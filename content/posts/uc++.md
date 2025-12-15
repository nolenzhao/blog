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


## Interesting Features
These are somewhat concurrency exclusive. May not have immediately practicality in sequential code.

### Coroutines
Coroutines are in essence, a stack-full class. It allows for suspension and resumption of computation within methods. The stack-full nature allows preservation of the results mid-computation. If readers are familiar with generators in Python or other languages, the concept is similar. However, coroutines in uC++ are more powerful, as they allow coroutines to suspend and call other coroutines, whereas generators[^2] in Python can only suspend back to main (they are stackless and use main's stack). 

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

[^2]: Generators in Python work a bit differently. The concept is the same, where execution continues, not from the beginning of the function, but where it was last suspended. However, this returns an `Iterator` type.
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