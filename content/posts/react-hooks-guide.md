---
title: Understanding React Hooks
date: 2025-11-28
author: Nolen Zhao
tags: [React, JavaScript, Web Development, Frontend]
draft: true
---

### Introduction

React Hooks changed how we write React components. Instead of managing state and lifecycle in class components, we can now use simple functions.

### What are Hooks?

Hooks are functions that let you "hook into" React features from function components. The most common ones are:

- **useState** - Add state to functional components
- **useEffect** - Perform side effects
- **useContext** - Access context values
- **useRef** - Create mutable references

### useState Example

Here's how to manage state in a functional component:

```javascript
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
```

The `useState` hook returns two values:
1. The current state value
2. A function to update it

### useEffect Example

Handle side effects like API calls, subscriptions, or DOM updates:

```javascript
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        // This runs after render
        fetch(`/api/users/${userId}`)
            .then(res => res.json())
            .then(data => setUser(data));
        
        // Cleanup function (optional)
        return () => {
            console.log('Component unmounted');
        };
    }, [userId]); // Re-run when userId changes
    
    if (!user) return <div>Loading...</div>;
    
    return <div>Hello, {user.name}!</div>;
}
```

### Rules of Hooks

> **Important:** Always follow these rules:

1. **Only call hooks at the top level** - Don't call them inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Use them in functional components or custom hooks

### Custom Hooks

You can create your own hooks to reuse stateful logic:

```javascript
function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : initialValue;
    });
    
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    
    return [value, setValue];
}

// Usage
function App() {
    const [name, setName] = useLocalStorage('name', 'Guest');
    
    return (
        <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
        />
    );
}
```

### Common Patterns

#### Fetching Data

```javascript
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [url]);
    
    return { data, loading, error };
}
```

#### Debouncing Input

```javascript
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => clearTimeout(timer);
    }, [value, delay]);
    
    return debouncedValue;
}
```

### Key Takeaways

1. Hooks make functional components as powerful as class components
2. They promote code reuse through custom hooks
3. State management becomes simpler and more intuitive
4. Side effects are easier to reason about

### Resources

- [Official React Hooks Documentation](https://react.dev/reference/react)
- [Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)
- Custom hooks are just functions that use other hooks!

Happy coding! 🚀
