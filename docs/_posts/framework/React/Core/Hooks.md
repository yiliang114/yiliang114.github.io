---
title: React Hooks
date: '2020-10-26'
draft: true
---

## React Hooks

> Hooks 出现的本质是把 React 面向生命周期编程编程了面向业务逻辑编程， 可以不用再去关心本不该关心的生命周期了。

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

## Hooks 的动机

Hook 解决了我们五年来编写和维护成千上万的组件时遇到的各种各样看起来不相关的问题。

### 1. 在组件之间复用状态逻辑很难。

React 没有提供将可复用性行为“附加”到组件的途径（例如，把组件连接到 store）。React 需要为共享状态逻辑提供更好的原生途径。你可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。Hook 使你在无需修改组件结构的情况下复用状态逻辑。 这使得在组件间或社区内共享 Hook 变得更便捷。

### 2. 复杂组件变得难以理解。

我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑。例如，组件常常在 componentDidMount 和 componentDidUpdate 中获取数据。但是，同一个 componentDidMount 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 componentWillUnmount 中清除。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致。

在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在。这也给测试带来了一定挑战。同时，这也是很多人将 React 与状态管理库结合使用的原因之一。但是，这往往会引入了很多抽象概念，需要你在不同的文件之间来回切换，使得复用变得更加困难。

为了解决这个问题，Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），而并非强制按照生命周期划分。你还可以使用 reducer 来管理组件的内部状态，使其更加可预测。

### 3. 难以理解的 class

除了代码复用和代码管理会遇到困难外，我们还发现 class 是学习 React 的一大屏障。你必须去理解 JavaScript 中 this 的工作方式，这与其他语言存在巨大差异。还不能忘记绑定事件处理器。没有稳定的语法提案，这些代码非常冗余。大家可以很好地理解 props，state 和自顶向下的数据流，但对 class 却一筹莫展。即便在有经验的 React 开发者之间，对于函数组件与 class 组件的差异也存在分歧，甚至还要区分两种组件的使用场景。

Hook 使你在非 class 的情况下可以使用更多的 React 特性。 从概念上讲，React 组件一直更像是函数。而 Hook 则拥抱了函数，同时也没有牺牲 React 的精神原则。Hook 提供了问题的解决方案，无需学习复杂的函数式或响应式编程技术。

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

## react hooks 的原理和实现

### useState 的实现原理

当调用 useState 的时候，会返回形如 `(变量, 函数)` 的一个元祖。并且 state 的初始值就是外部调用 useState 的时候，传入的参数。

理清楚了传参和返回值，再来看下 useState 还做了些什么。正如下面代码所示，当点击按钮的时候，执行`setNum`，状态 num 被更新，**并且 UI 视图更新**。显然，useState 返回的用于更改状态的函数，自动调用了`render`方法来触发视图更新。

```js
function App() {
  const [num, setNum] = useState < number > 0;

  return (
    <div>
      <div>num: {num}</div>
      <button onClick={() => setNum(num + 1)}>加 1</button>
    </div>
  );
}
```

有了上面的探索，借助闭包，封装一个 `setState` 如下：

```js
function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

let state: any;

function useState<T>(initialState: T): [T, (newState: T) => void] {
  state = state || initialState;

  function setState(newState: T) {
    state = newState;
    render();
  }

  return [state, setState];
}

render(); // 首次渲染
```

这是一个简易能用的`useState`雏形了。它也解决了文章开始提到的「🤔️ useState 的实现原理」这个问题。但如果在函数内声明多个 state，在当前代码中，只有第一个 state 是生效的(请看`state = state || initialState;`))。

### 为什么不能在循环、判断内部使用 Hook

先不要考虑题目提及的问题。思路还是回到如何让 useState 支持多个 state。[《React hooks: not magic, just arrays》](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)中提及，React Hook 看起来非常 Magic 的实现，本质上还是通过 Array 来实现的。

前面 useState 的简单实现里，初始的状态是保存在一个全局变量中的。以此类推，多个状态，应该是保存在一个专门的全局容器中。这个容器，就是一个朴实无华的 Array 对象。具体过程如下：

- 第一次渲染时候，根据 useState 顺序，逐个声明 state 并且将其放入全局 Array 中。每次声明 state，都要将 cursor 增加 1。
- 更新 state，触发再次渲染的时候。**cursor 被重置为 0**。按照 useState 的声明顺序，依次拿出最新的 state 的值，视图更新。

请看下面这张图，每次使用 useState，都会向 STATE 容器中添加新的状态。

![](https://miro.medium.com/max/1260/1*8TpWnrL-Jqh7PymLWKXbWg.png)

实现的代码如下：

```js
import React from 'react';
import ReactDOM from 'react-dom';

const states: any[] = [];
let cursor: number = 0;

function useState<T>(initialState: T): [T, (newState: T) => void] {
  const currenCursor = cursor;
  states[currenCursor] = states[currenCursor] || initialState; // 检查是否渲染过

  function setState(newState: T) {
    states[currenCursor] = newState;
    render();
  }

  ++cursor; // update: cursor
  return [states[currenCursor], setState];
}

function App() {
  const [num, setNum] = useState < number > 0;
  const [num2, setNum2] = useState < number > 1;

  return (
    <div>
      <div>num: {num}</div>
      <div>
        <button onClick={() => setNum(num + 1)}>加 1</button>
        <button onClick={() => setNum(num - 1)}>减 1</button>
      </div>
      <hr />
      <div>num2: {num2}</div>
      <div>
        <button onClick={() => setNum2(num2 * 2)}>扩大一倍</button>
        <button onClick={() => setNum2(num2 / 2)}>缩小一倍</button>
      </div>
    </div>
  );
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
  cursor = 0; // 重置cursor
}

render(); // 首次渲染
```

此时，如果想在循环、判断等不在函数组件顶部的地方使用 Hook，如下所示：

```js
let tag = true;

function App() {
  const [num, setNum] = useState < number > 0;

  // 只有初次渲染，才执行
  if (tag) {
    const [unusedNum] = useState < number > 1;
    tag = false;
  }

  const [num2, setNum2] = useState < number > 2;

  return (
    <div>
      <div>num: {num}</div>
      <div>
        <button onClick={() => setNum(num + 1)}>加 1</button>
        <button onClick={() => setNum(num - 1)}>减 1</button>
      </div>
      <hr />
      <div>num2: {num2}</div>
      <div>
        <button onClick={() => setNum2(num2 * 2)}>扩大一倍</button>
        <button onClick={() => setNum2(num2 / 2)}>缩小一倍</button>
      </div>
    </div>
  );
}
```

由于在条件判断的逻辑中，重置了`tag=false`，因此此后的渲染不会再进入条件判断语句。看起来好像没有问题？但是，由于 useState 是基于 Array+Cursor 来实现的，第一次渲染时候，state 和 cursor 的对应关系如下表：

| 变量名    | cursor |
| --------- | ------ |
| num       | 0      |
| unusedNum | 1      |
| num2      | 2      |

当点击事件触发再次渲染，并不会进入条件判断中的 useState。所以，cursor=2 的时候对应的变量是 num2。而其实 num2 对应的 cursor 应该是 3。就会导致`setNum2`并不起作用。

到此，解决了文章开头提出的「🤔️ 为什么不能在循环、判断内部使用 Hook」。在使用 Hook 的时候，请在函数组件顶部使用！

### useEffect 的实现原理

在探索 useEffect 原理的时候，一直被一个问题困扰：useEffect 作用和用途是什么？当然，用于函数的副作用这句话谁都会讲。举个例子吧：

```js
function App() {
  const [num, setNum] = useState(0);

  useEffect(() => {
    // 模拟异步请求后端数据
    setTimeout(() => {
      setNum(num + 1);
    }, 1000);
  }, []);

  return <div>{!num ? '请求后端数据...' : `后端数据是 ${num}`}</div>;
}
```

这段代码，虽然这样组织可读性更高，毕竟可以将这个请求理解为函数的副作用。**但这并不是必要的**。完全可以不使用`useEffect`，直接使用`setTimeout`，并且它的回调函数中更新函数组件的 state。

在阅读[A Complete Guide to useEffect](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)和[构建你自己的 Hooks](http://react.html.cn/docs/hooks-custom.html)之后，我才理解 useEffect 的存在的必要性和意义。

在 useEffect 的第二个参数中，我们可以指定一个数组，如果下次渲染时，数组中的元素没变，那么就不会触发这个副作用（可以类比 Class 类的关于 nextprops 和 prevProps 的生命周期）。好处显然易见，**相比于直接裸写在函数组件顶层，useEffect 能根据需要，避免多余的 render**。

下面是一个不包括销毁副作用功能的 useEffect 的 TypeScript 实现：

```js
// 还是利用 Array + Cursor的思路
const allDeps: any[][] = [];
let effectCursor: number = 0;

function useEffect(callback: () => void, deps: any[]) {
  if (!allDeps[effectCursor]) {
    // 初次渲染：赋值 + 调用回调函数
    allDeps[effectCursor] = deps;
    ++effectCursor;
    callback();
    return;
  }

  const currenEffectCursor = effectCursor;
  const rawDeps = allDeps[currenEffectCursor];
  // 检测依赖项是否发生变化，发生变化需要重新render
  const isChanged = rawDeps.some((dep: any, index: number) => dep !== deps[index]);
  if (isChanged) {
    callback();
  }
  ++effectCursor;
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
  effectCursor = 0; // 注意将 effectCursor 重置为0
}
```

对于 useEffect 的实现，配合下面案例的使用会更容易理解。当然，你也可以在这个 useEffect 中发起异步请求，并在接受数据后，调用 state 的更新函数，不会发生爆栈的情况。

```js
function App() {
  const [num, setNum] = useState < number > 0;
  const [num2] = useState < number > 1;

  // 多次触发
  // 每次点击按钮，都会触发 setNum 函数
  // 副作用检测到 num 变化，会自动调用回调函数
  useEffect(() => {
    console.log('num update: ', num);
  }, [num]);

  // 仅第一次触发
  // 只会在compoentDidMount时，触发一次
  // 副作用函数不会多次执行
  useEffect(() => {
    console.log('num2 update: ', num2);
  }, [num2]);

  return (
    <div>
      <div>num: {num}</div>
      <div>
        <button onClick={() => setNum(num + 1)}>加 1</button>
        <button onClick={() => setNum(num - 1)}>减 1</button>
      </div>
    </div>
  );
}
```

⚠️ useEffect 第一个回调函数可以返回一个用于销毁副作用的函数，相当于 Class 组件的 unmount 生命周期。这里为了方便说明，没有进行实现。

在这一小节中，尝试解答了 「🤔️ useEffect 的实现原理」和 「🤔️ useEffect 的应用场景」这两个问题。

### Class VS Hooks

虽然 Hooks 看起来更酷炫，更简洁。但是在实际开发中我更倾向于使用 Class 来声明组件。两种方法的对比如下：

| Class                                          | Hooks                |
| ---------------------------------------------- | -------------------- |
| 代码逻辑清晰（构造函数、componentDidMount 等） | 需要配合变量名和注释 |
| 不容易内存泄漏                                 | 容易发生内存泄漏     |

总的来说，Hooks 对代码编写的要求较高，在没有有效机制保证代码可读性、规避风险的情况下，Class 依然是我的首选。关于内存泄漏，下面是一个例子（目前还没找到方法规避这种向全局传递状态更新函数的做法）：

```js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

let func: any;
setInterval(() => {
  typeof func === 'function' && func(Date.now());
  console.log('interval');
}, 1000);

function App() {
  const [num, setNum] = useState < number > 0;
  if (typeof func !== 'function') {
    func = setNum;
  }
  return <div>{num}</div>;
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();
```
