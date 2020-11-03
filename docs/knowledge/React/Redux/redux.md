---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# Redux

## state 根对象的结构

在 React 中，尽量会把状态放在顶层的组件，在顶层的人组件使用 Redux 或者 Router。

这就把组件分为了两种： 容器组件和展示组件。

- 容器组件： 和 Redux 和 Router 交互，维护一套状态 和触发 Action
- 展示组件： 展示组件是在容器组件的内部，不维护状态。所有数据都通过 props 传给它们，所有的操作也都是通过回调完成。

## Part

Redux 分为三大部分，store， action ， reducer。

### Store

整个应用的 state 被存储在一棵 Object Tree 中，并且这个 Object Tree 只存在于唯一一个 store 中。容器组件可以从 store 中获取所需要的状态，容器组件同时也可以发送给 store 一个 action，告诉他改变某一个状态的值。

### Action

action 可以理解为一种指令，action 是一个对象，需要至少有一个元素 type， type 是 action 的唯一标识。

```
{
  type: ACTION_TYPE,
  text: "content",
}
```

指令由组件触发，然后传到 reducer。

### Reducer

action 只解释了要去做什么，以及做这件事情需要的参数值。具体去改变 store 中的 state 是由 reducer 来做的。

reducer 是一个包含 switch 的函数，根据传入的 action.type 对旧 state 进行不同的操作，最后返回一个新的 state 到 store 并储存的过程。

### 数据流

## Redux 和 React 联系

Redux 和 React 之间没有关系，通过`react-redux`这个库绑定起来。

```
npm i --save react-redux
```

`react-redux`提供`Provider`和`connect`。

### Provider

# redux

action creator 动作创建器

redux 中的 action 是具有如下格式的 js 对象，带有一个 type 值

```
{
  type: 'ADD_TODO',
  payload: {
    text: 'Do something.'
  }
}
```

action creator 是 生成 action 的辅助函数，用来创建 action 。它本身是一个函数，在返回 action 对象之前， 可以对 action 中的值进行相关操作。

```
export function addTodo(text) {
  return { type: ADD_TODO, text }
}
```

https://blog.csdn.net/real_bird/article/details/77113264

只要记得 action creator 最终是服务于 dispatch 的，因为 dispatch 需要的是一个 action （触发一个动作）

```
const getDataAction = (someData) => (dispatch, getState) => {
  dispatch({ type: GET_DATA, data: someData});

  fetch() // 我使用的是fetch，并对fetch做了封装
  .then(res => res.json()) // 以json数据为例
  .then(jsonData => {
    dispatch({ type: GET_DATA_SUCCESS })
  })
  .catch(err => {
    dispatch({ type: GET_DATA_FAILED })
  })
}


```

### 迷糊之处 1

#### return action 和 dispatch 之间是什么关系？

- redux connnect state -> props
- mapDispatchToProps action-> props

## redux thunk

### saga

https://segmentfault.com/a/1190000007261052?_ea=1290634
