---
title: redux-thunk
date: '2020-10-26'
draft: true
---

## redux-thunk

**redux-thunk 和 redux-saga 是 redux 应用中最常用的两种异步处理方式。**

### Redux Thunk 的作用是什么

Redux thunk 是一个允许你编写返回一个函数而不是一个 action 的 actions creators 的中间件。如果满足某个条件，thunk 则可以用来延迟 action 的派发(dispatch)，这可以处理异步 action 的派发(dispatch)。

### redux-thunk

1. thunk 的作用是什么？

### 什么是 Redux Thunk?

*Redux Thunk*中间件允许您编写返回函数而不是 Action 的创建者。 thunk 可用于延迟 Action 的发送，或仅在满足某个条件时发送。内部函数接收 Store 的方法`dispatch()`和`getState()`作为参数。

### redux thunk

#### saga

https://segmentfault.com/a/1190000007261052?_ea=1290634

#### 聊聊 Redux 和 Vuex 的设计思想

Redux vs Vuex 对比分析
store 和 state 是最基本的概念，Vuex 没有做出改变。其实 Vuex 对整个框架思想并没有任何改变，只是某些内容变化了名称或者叫法，通过改名，以图在一些细节概念上有所区分。

Vuex 弱化了 dispatch 的存在感。Vuex 认为状态变更的触发是一次“提交”而已，而调用方式则是框架提供一个提交的 commit API 接口。

Vuex 取消了 Redux 中 Action 的概念。不同于 Redux 认为状态变更必须是由一次"行为"触发，Vuex 仅仅认为在任何时候触发状态变化只需要进行 mutation 即可。Redux 的 Action 必须是一个对象，而 Vuex 认为只要传递必要的参数即可，形式不做要求。

Vuex 也弱化了 Redux 中的 reducer 的概念。reducer 在计算机领域语义应该是"规约"，在这里意思应该是根据旧的 state 和 Action 的传入参数，"规约"出新的 state。在 Vuex 中，对应的是 mutation，即"转变"，只是根据入参对旧 state 进行"转变"而已。

总的来说，Vuex 通过弱化概念，在任何东西都没做实质性削减的基础上，使得整套框架更易于理解了。
另外 Vuex 支持 getter，运行中是带缓存的，算是对提升性能方面做了些优化工作，言外之意也是鼓励大家多使用 getter。

[详解](https://www.jianshu.com/p/e0987169de96)

#### redux 如何更新组件

```js
store.subscribe(() => this.setState({ count: store.getState() }));
```

subscribe 中添加回调监听函数，当 dispatch 触发的时候，会执行 subscribe listeners 中的函数。

subscribe 负责监听改变

#### redux 为什么要把 reducer 设计成纯函数

先看源码

```js
  ...
let hasChanged = false
const nextState = {}
for (let i = 0; i < finalReducerKeys.length; i++) {
  const key = finalReducerKeys[i]
  const reducer = finalReducers[key]
  const previousStateForKey = state[key]
  const nextStateForKey = reducer(previousStateForKey, action)
  if (typeof nextStateForKey === 'undefined') {
    const errorMessage = getUndefinedStateErrorMessage(key, action)
    throw new Error(errorMessage)
  }
  nextState[key] = nextStateForKey
  hasChanged = hasChanged || nextStateForKey !== previousStateForKey
}
return hasChanged ? nextState : state
```

这一段 const nextStateForKey = reducer(previousStateForKey, action)代码通过 reducer 返回的 state,然后通过 hasChanged = hasChanged || nextStateForKey !== previousStateForKey 来比较新旧两个对象是否一致，此比较法 �，比较的是两个对象的 � 存储位置，也就是浅比较法,如果当 reduxer 返回旧的 state,redux 认为没有改变，页面也就不会更新

为什么要这么做？
因为比较两个 javascript 对象中所有的属性是否 � 完全相同，� 唯一的办法就是深比较，然而，深比较在真实的应用中代码是非常大的，非常耗性能的，需要比较的 � 次数特别多，所以一个有效的解决方案就是做一个 � 规定，当无论发生任何变化时，开发者都要 � 返回一个新的对象，没有变化时，开发者返回就的对象，这也就是 redux 为什么要把 reducer 设计成纯函数的原因

#### redux-saga
