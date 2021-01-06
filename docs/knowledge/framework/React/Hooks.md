---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

Stateless Component 和 Functional Component 不是一个东西

Hooks 出现的本质是把 React 面向生命周期编程编程了面向业务逻辑编程， 其实你可以不用再去关心本不该关心的生命周期了。

### 什么是 hooks?

Hooks 是一个新的草案，它允许你在不编写类的情况下使用状态和其他 React 特性。让我们来看一个 useState 钩子示例：

```jsx
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## note

以前在使用 react 的时候，我们总纠结于组件是否可以不要有内部状态，而选择 Class Component 还是 Function Component

说一说 react 的 hooks 的作用和对它的理解

### 我需要用 hooks 重写所有类组件吗?

不需要。但你可以在某些组件（或新组件）中尝试使用 hooks，而无需重写任何已存在的代码。因为在 ReactJS 中目前没有移除 classes 的计划。

### 如何使用 React Hooks 获取数据?

名为 useEffect 的 effect hook 可用于使用 axios 从 API 中获取数据，并使用 useState 钩子提供的更新函数设置组件本地状态中的数据。让我们举一个例子，它从 API 中获取 react 文章列表。

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });

  useEffect(async () => {
    const result = await axios('http://hn.algolia.com/api/v1/search?query=react');

    setData(result.data);
  }, []);

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;
```

记住，我们为 effect hook 提供了一个空数组作为第二个参数，以避免在组件更新时再次激活它，它只会在组件挂载时被执行。比如，示例中仅在组件挂载时获取数据。

### Hooks 是否涵盖了类的所有用例?

Hooks 并没有涵盖类的所有用例，但是有计划很快添加它们。目前，还没有与不常见的 getSnapshotBeforeUpdate 和 componentDidCatch 生命周期等效的钩子。

### Hooks 需要遵循什么规则?

为了使用 hooks，你需要遵守两个规则：

仅在顶层的 React 函数调用 hooks。也就是说，你不能在循环、条件或内嵌函数中调用 hooks。这将确保每次组件渲染时都以相同的顺序调用 hooks，并且它会在多个 useState 和 useEffect 调用之间保留 hooks 的状态。
仅在 React 函数中调用 hooks。例如，你不能在常规的 JavaScript 函数中调用 hooks。

### Hooks 应用 createContext

createContext 传参是一个默认值， defaultValue 未匹配 Provider 时生效
React.createContext(defaultValue)

ProductContext.Provider 标签注入一个 value 供子组件使用. useContext 方法和 context 提供的 Consumer 组件都可以用来获取 context
