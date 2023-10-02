---
title: redux-thunk
date: '2020-10-26'
draft: true
---

## redux-thunk

**redux-thunk 和 redux-saga 是 redux 应用中最常用的两种异步处理方式。**

Redux Thunk 中间件允许您编写返回函数而不是 Action 的创建者。thunk 则可以用来延迟 action 的派发(dispatch)，这可以处理异步 action 的派发(dispatch)。 thunk 可用于延迟 Action 的发送，或仅在满足某个条件时发送。内部函数接收 Store 的方法`dispatch()`和`getState()`作为参数。
