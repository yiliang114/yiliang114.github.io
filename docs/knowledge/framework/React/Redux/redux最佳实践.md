---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# Redux 最佳实践

[支付宝前端应用框架的发展和选择](https://github.com/sorrycc/blog/issues/6)

[React + Redux 最佳实践](https://github.com/sorrycc/blog/issues/1)

## 理解 Redux

Redux 本身是一个很轻的库，解决 component -> action -> reducer -> state 的单向数据流转问题。

它有两个非常突出的特点：

- predictable 可预测性
- 可扩展性

可预测性是由于它大量使用 pure function 和 plain object 等概念（reducer 和 action creator 是 pure function， state 和 action 是 plain object），并且 state 是 immutable 的。 这对于项目的稳定性会是很好的保证。

可扩展性则让我们可通过 middleware 定制 action 的处理，通过 reducer enhancer 扩展 reducer 等等。从而有了丰富的社区扩展和支持，比如异步处理，Form，router 同步， redu/ubdo ，性能问题（selecter）， 工具支持等。

## Library 选择

那么多的社区扩展，该如何选择才能组成我们的最佳实践？ 以异步处理为例。（也是最重要的一个问题）

用的比较多的通用解决方案有这些：

- [redux-thunk](https://github.com/gaearon/redux-thunk)
- [redux-promise](https://github.com/acdlite/redux-promise)
- [redux-saga](https://github.com/yelouafi/redux-saga)

redux-thunk 是支持函数形式的 action
