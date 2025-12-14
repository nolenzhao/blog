---
title: Haskell Type States
date: 2025-11-28
author: Nolen Zhao
tags: [Haskell, Ad-hoc Polymorphism, Type-safety]
---

### Introduction 
OOP has been one of the most popular programming language paradigms in CS. It's often the case that students are unfamiliar 
with other paradigms or in some cases are not aware of them. However, popularization of ideas in functional languages have made their 
ways into languages like Python (higher order functions), Rust (traits), and C++(20) (concepts). In particular both traits and concepts 
from Rust and C++ respectively are heavily influence by the idea of type classes and type families in Haskell. 

### OOP's Problem
In OOP, inheritance is in many cases an unnatural and awkward way of expressing the shared attributes of multiple classes. The paradigm relies on 
the notion that child classes inherit methods from their parent class which they have the option of overriding for custom behaviour. However, the problem 
arises when the natural order between parents and classes becomes disjoint, as real world objects are often not tied to such rigid hierarchies. 

For example: 
```C++

class Chair{
public:
    virtual void sit() = { /* some sitting logic */ }
};

class RockingChair : public Chair{
    void sit() override { Chair::sit(); /* some rocking logic */ }
};

class Animal {
public:
    virtual void sit() = { /* some sitting logic */ }
}

class Horse : public Animal {
public:
    void sit() override { /* neigh */ }
}

// Repeat logic -- BAD!
void relax(Chair* c);
void relax(Animal* a);
```

`Chair` is an abstract class and is intended to be inherited by different types of chairs (who's primary function is for sitting). However, animals (which are not chairs) can also be sat on. Should the `Horse` or `Animal` class be forced to inherit from `Chair` to gain access to the sitting method? If not, then we are forced to implement this duplicate logic, and breaks principles of DRY (Don't Repeat Yourself).

### Templating 
From the above illustration, one might suggest the use of templates to avoid breaking the DRY principles. 

For example:
```C++
template <typename T>
void relax(T s){ s.sit() /* some relaxing logic */ }

relax(Chair{ /* Chair fields */ });
relax(RockingChair{ /* RockingChair fields */ });
relax(Horse{ /* Horse fields */ });

``` 
This is less aligned with classical OOP, where capabilities are declared inside the class hierarchy. Now, the `sit` method is not associated with the `Chair` class and begins to beg the question of why OOP is being used, if the objects are not being meaningfully represented. Templates avoid creating artificial inheritance hierarchies (`Horse` inherits from `Chair`), but they shift the enforcement of behavior from the type definition to the template **instantiation** site. In the case of substitution failure, the compiler will emit a substitution failure for every failed substitution, so in the case of nested templates, instead of a single line, every failed instantitation is printed. In this case, if any of `Chair`, `RockingChair`, or `Horse` did not implement the `sit` method, an error would be produced.

### Type Classes
A more natural relationship in Haskell is that of type classes. In programming, the job of a method or function is to perform some computation. In fact, a function is built up of operations and in some cases other functions (which themselves are made up of operations). By this logic, it can be guaranteed that any type which *supports* all operations in the function is guaranteed to perform successful computation. Not only is it useful to move have this guarantee of successful computation, it better represents real-life relationships and has less 
rigidity.

The type class details all methods that a type hoping to satisfy the type class must implement. For a type to **have an instance of** a certain type class, it must implement all methods detailed in the type class contract. Once that requirement is satisfied, an object of that type can be use as an argument to any function which requires types **having an instance of** that given type class.

For Example: 
```haskell

class Sittable a where
    sit :: a -> a
    adjust :: a -> Int -> a
    getOff:: a -> a
    -- Other functions which the instance needs to implement

relax :: Sittable a => a -> a
relax a = sit a -- some other logic
```
The `relax` method can only be called by types which satisfy the `Sittable` type class (more formally, types which **have an instance of** the Sittable type class) because the `sit` method is used within the function. We can now define the `Chair` and `Horse`
types, and provide them **an instance of** the `Sittable` type class.

```haskell
data Chair = Chair { comfort:: Int, height: Int, material: String}
data Horse = Horse { height: Int, material: String}

instance Sittable of Chair where
    sit c = c
    adjust c amount = c { height = height + amount }
    getOff c = c

instance Sittable of Horse where
    sit c = c
    -- We can't adjust a the height of a horse!
    adjust c amount = c
    getOff c = c


-- Now we can call the relax method on objects of type Chair or Horse
c = Chair { comfort = 10, height = 50, material = "plastic" }
h = Horse { height = 20, material = "wood" }

relax c
relax h
```

The `Chair` and `Horse` types have fulfilled the type class constraint through specifying the `instance of Sittable`. It is now valid to pass them in into the `relax` method which enforces the `Sittable` contract on it's input parameters.

### C++20 Concepts
For the average developer, who is more likely to use C++ than Haskell in their daily lives, a features of C++20 introduces *Concepts*. The idea is the same as type classes, but with an adjusted syntax. The `concept` keyword is analogous to the `class` declaration in Haskell. 

Let's take a look back at the earlier example. This time, we will enforce a constraint on the sit method and try to get shorter, more meaningful compile-time errors if our objects do not conform to sitting.

```c++
template <typename T>
concept Sittable = requires (T s){
    s.sit();
}

template <typename T>
void relax(T s) requires Sittable<T> { s.sit() /* some relaxing logic */ }

relax(Chair{ /* Chair fields */ });
relax(RockingChair{ /* RockingChair fields */ });
relax(Horse{ /* Table fields */ });
```

Now, we have declared the concept of an object being `Sittable`[^1]. Statements within the curly braces must be well-formed. In this example, the check is if `s.sit()` will compile correctly. The `relax` method now acts as a generic function which can be called to check for any object which there exists a `sit` method. Duplicate *relaxing logic* does not need to be written as in the case which only used templates.


### Conclusion
Haskell type classes have influenced OOP languages to perform type-checking in a more natural way, which doesn't need to restrain itself to the class hierarchy traditional to these languages. Consider using the type class equivalent in the language of your choice next time  


[^1]: Some alternative ways of declaring the constraint. These are identical but are some nice syntactic sugar.
    ```c++
    // There are different ways to write the same constraint 

    // Option 2 -- note the change from typename to Sittable
    template <Sittable T>
    void relax(T s) { s.sit()/* some relaxing logic */ }

    // Option 3
    void relax(Sittable auto s) { s.sit() /* some relaxing logic */ }
    ```