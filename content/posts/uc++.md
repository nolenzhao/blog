---
title: Review of uC++
date: 2025-12-14
author: Nolen Zhao
tags: [Coding, Academic, Concurrency, C++]
---


## Introduction 
This semester I took the class [CS343: Concurrent and Parallel Programming](https://uwflow.com/course/cs343) at the University of Waterloo. Below is a survey of the [uC++](https://github.com/pabuhr/uCPP) language extension and the course in general. Please see the official [uC++ reference](https://plg.uwaterloo.ca/~usystem/pub/uSystem/uC++.pdf) for more information.

## Practical Features
Below is a list of features which I believe have immediately practicality in C++, even for sequential programs. 

### Finally Clause
This is already a feature in Java, Python, C#, etc. The `finally` clause executes regardless of the control flow of the `try/except` block. In the example below, regardless of the outcome of the write, we should unconditionally release the mutex lock before returning to prevent deadlock. The `finally` block is ran immediately following the statement to `return/raise` in this example. Python also has the context manager[^1] with similar semantics.

```python
def write_shared(path: str) -> int:
    mutex_lock.acquire()
    try: 
        # Some computation
        return val
    except SomeError: 
        # Some error logging
        raise 
    finally: 
        mutex_lock.release()
```

Without the `finally` clause, all control flow paths need to be taken into account. Forgetting to release the lock becomes easier as the number of different exceptions to `catch` grows.

```c++
    mutex_lock.acquire();
    try{
        // Some computation
        mutex_lock.release()    // Need to release the lock before return
        return val
    }
    catch(SomeError&){
        // Some error logging
        mutex_lock.release();   // Also need to release here before throwing
        throw 
    }
```

This is what the same uC++ snippet looks like.
```c++
    mutex_lock.acquire();
    try{
        // Some computation
        return val
    }
    catch(SomeError&){
        // Some error logging
        throw 
    }
    finally{
        mutex_lock.release();
    }
```

### Bounded Catch Clause
The bounded `catch` specifies for which objects a certain type of exception should be caught for. This specifies that `catch` should only execute if a given object threw an exception. As seen below, both the object and exception type must match for the `catch` to execute. 

Below is the uC++ snippet.
```c++
_Exception E{};

struct Obj{ 
    void comp() { _Throw E{}; }
};

try{
    Obj obj1;
    // computation
    // This block may throw exception E
    if(x) obj1.comp();
}
catch(obj1.E){
    // logic specific to obj1
}
catch(obj2.E){
    // logic specific to obj2
}
```

### Dynamic Exception Handling
Object slicing can occur when throwing objects of a derived type. The following C++ snippet illustrates the issue. 

```c++
class B {};
class D: public B {};

void f(B& o){
    throw o;
}

D d{};
try{
    f(d);
}
catch(D&) { /* handling */ }  // This will not catch the exception
catch(B&) { /* handling */ }  // This will catch the exception
```

Here, object slicing occurs, and the function `f` copies the static type of the object (B from the argument list). Thus, the handler for the derived types does not match even though the runtime type is `D`.

Below is a uC++ snippet where slicing does not occur. 
```c++
_Exception B {};
_Exception D : public B {};

void f(B& o){
    _Throw o;
}
D d{};
try{
    f(d);
}
catch(D&) { /* handling */ }  // This will catch the exception first
catch(B&) { /* handling */ } 
```




## Interesting Features
These are somewhat concurrency exclusive. May not have immediately practicality in sequential code.

### Coroutines
Coroutines are in essence, a stack-full class. It allows for suspension and resumption of computation within methods. The stack-full nature allows preservation of the results mid-computation. If readers are familiar with generators [^2] in Python or other languages, the concept is similar. However, coroutines in uC++ are more powerful, as they allow coroutines to suspend and call other coroutines, whereas generators in Python can only suspend back to main (they are stackless and use main's stack). 

Each `_Coroutine` defines the `main` function which it executes. The call to `suspend()` pauses the execution and control/execution resumes at the last `_Coroutine` which resumed it. Calls to `resume()` have different semantics, and instead control goes to the `this` object. 

Below is a Fibonacci sequence. The state at the beginning needs to be remembered, to produce the initial two value of 0 and 1. Then, the Fibonacci pattern is continued indefinitely. This removes the need for state variables if it was a regular function call.
```c++
_Coroutine fibonacci(){
public: 
    int prev1 = 0
    int prev2 = 1;;
    int _res;

    void main(){
        _res = prev1;
        suspend();            
        _res = prev2;
        while(true){
            suspend();
            _res = prev1 + prev2;
            prev1 = prev2;
            prev2 = _res;
        }
    }
}
```

## Concepts 
Some concepts which I think give a deeper understanding of concurrency/parallelism. These may not be novel to uC++, but are foundational knowledge.

### Lock Implementation 
The most basic lock is a spinlock. Atomic hardware instructions is needed here. It is also the base of the mutex lock. Mutual exclusion is almost always built off of hardware atomics [^3]. 

Below is a conventional implementation for a spinlock using the [Test and Set](https://en.wikipedia.org/wiki/Test-and-set) instrucion [^4].

```c++
/*
Test the lock. Set it and return the old value
If it was locked before, it remains locked and returns true 
If it was unlocked, it gets locked, and returns false
*/
TestAndSet(bool& lk){
    bool val = lk;
    lk = true;
    return val;
}

class SpinLock{
private: 
    bool& lk;
public:
    acquire(){
        while(TestAndSet(lk)) {}
    }
    release(){
        lk = false;
    }
}
```

A mutex lock can be built from this spinlock. An interesting notion is that of barging. While it is trivial to create a mutex lock which only allows one thread into the critical section, what is less apparent is how to enforce FIFO ordering. 

Consider this snippet. An avail flag is used as a means to communicate the state of the lock. When a thread is unblocked by a releasing thread, it will wake, and try to acquire the spinlock. At the same instant, if an arriving thread calls `acquire` on the mutex lock, and then calls `acquire` on the spinlock, there is a race. This is why the check for `avail` is in the `while` loop. This concept is known as barging, as tasks barge in front of others that are in line.
```c++
class MutexLock{
private: 
    bool avail = false;
    Task* owner;
    SpinLock spinlock;
    std::queue<Task> blocked;
public:
    void acquire(){
        spinlock.acquire();
        // A check for the owner makes this lock re-entrant
        while(!avail && owner != currThread()){
            // Yield, release lock, and add self to blocked list
            yieldNoSchedule(spinlock); 
            spinlock.acquire();
        }
        avail = false;
        owner = currThread();
        spinlock.release();
    }
    void release(){
        spinlock.acquire();
        owner = nullptr;
        if(!blocked.empty()){
            // Unblock front first task and add to ready queue
        }
        avail = true;
        spinlock.release();
    }
}
```

To mitigate this, there are the techniques of barging avoidance, and barging prevention. Barging avoidance adjusts the snippet, with the avail flag held `false` while there are tasks waiting on the blocked list. This way, any barging task who won the race and acquired the spinlock must block anyways, preserving FIFO ordering.
```c++
class MutexLock{
public: 
    // Sample members
public:
    void acquire(){
        spinlock.acquire();
        /*
        This is now just an if statement, FIFO is preserved, no need to  
        check again for if the race was lost
        */
        if(!avail && owner != currThread()){
            // Yield, release lock, and add self to blocked list
            yieldNoSchedule(spinlock); 
            spinlock.acquire();
        }
        else{
            avail = false;
        }
        owner = currThread();
        spinlock.release();
    }
    void release(){
        spinlock.acquire();
        owner = nullptr;
        /*
        Only set avail to true if there are no waiting tasks. This way a
        taking wanting to acquire the mutex lock can if nobody is waiting.
        */
        if(!blocked.empty()){
            // Unblock front first task and add to ready queue
        }
        else{
            avail = true;
        }
        spinlock.release();
    }
}
```

This snippet shows barging prevention. This does not allow threads to even acquire the spinlock. The spinlock is held unless there are no blocked threads waiting. The spinlock is then **NOT** reacquired by the waking task, and instead conceptually passed since it was never released by the releasing task. It is only released once no tasks are waiting. This way waiting tasks can immediately enter the critical section while calling tasks to the `acquire` on the mutex lock must spin. 
```c++
class MutexLock{
public: 
    // Sample members
public:
    void acquire(){
        spinlock.acquire();
        /*
        This is now just an if statement, FIFO is preserved, no need to  
        check again for if the race was lost
        */
        if(!avail && owner != currThread()){
            // Yield, release lock, and add self to blocked list
            yieldNoSchedule(spinlock); 
            // Don't reacquire the lock here (it was never released)
        }
        else{
            avail = false;
        }
        owner = currThread();
        spinlock.release();
    }
    void release(){
        spinlock.acquire();
        owner = nullptr;
        /*
        Only set avail to true if there are no waiting tasks. This way a
        taking wanting to acquire the mutex lock can if nobody is waiting.
        */
        if(!blocked.empty()){
            // Unblock front first task and add to ready queue
        }
        else{
            avail = true;
            // Only release the lock if no other task is waiting 
            spinlock.release();
        }
    }
}
```

As a reuslt of these changes, FIFO odering has been preserved given that waiting tasks on the blocked list enter are woken one at a time, and enter the critical section, and calling tasks cannot join the blocked list while tasks are being unblocked. 



## Conclusion
This course gave me a much deeper understanding of the fundamentals of concurrency/parallelism, diving into the implementation of locks, and the issues that come with them. It also covers high level constructs, as you appreciate the need for them when dealing with convoluted critical section access which would be difficult with solely locking primitives. Professor Peter Buhr is one of the creators of uC++ and his knowledge of concurrency is apparent when teaching, interleaving analogies, and often answering students questions on the very next slide. I would highly recommend this course if taught under him.

[^1]: The `with` statement can perform the same cleanup here. The statement following `with` must return a context manager object (must define behaviour for entrance and exit). It should be noted that this version releases the lock **before** the `except` statement is run, as the lock is released when exiting the `with` block. The snippet with the `finally` clause releases the lock **after** the `except` statement. If the error logging is not a critical section, unlocking earlier can have better performance.
    ```python
    def write_shared(path: str) -> int:
        try:
            with mutex_lock:   
                # Some computation 
                return val
        except SomeError: 
            # Some error logging
            raise 
    ```

[^2]: Generators in Python work a bit differently. The concept is the same, where execution continues, not from the beginning of the function, but where it was last suspended. However, this returns an `Iterator` type. As mentioned before, these are **not** stack-full, so generators cannot call other generators. Hence only the `yield` keyword is available here, which is analogous to `suspend` in uC++. There is no equivalent for `resume`.
    ```python
    def fibonacci() -> Iterator[int]: 
        prev1 = 0
        prev2 = 1 
        yield prev1
        yield prev2
        while True:
            res = prev1 + prev2
            yield res
            prev1 = prev2
            prev2 = res
    ```
[^3]: See Dekker's, Peterson's, and Lamport's Bakery for mutual exclusion with Software. These algorithm's are also covered in this course. 

[^4]: Other common atomic instructions provided are Compare and Swap (CAS) or Fetch and Increment. CAS is strictly stronger than Test and Set.