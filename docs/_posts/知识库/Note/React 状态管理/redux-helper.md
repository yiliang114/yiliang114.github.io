---
title: redux-helper
date: '2020-10-26'
draft: true
---

### oh-my-redux(redux-family-helper)

- create constants
  - 一种类型是 start perform done fail reset cancel 五种状态 start 是设置参数，perform 是实际请求接口
  - 一种类型是 start done fail 三种状态，不需要设置参数，done 直接赋值
- create actions
  - 对应第一种类型
  - 对应第二种类型
- create sagas
- Create thunk
- create rxjs
- Create promise
- create selectors
- Create connect 创建 redux 到 component 的映射。不要再重复输入了。

### fetch 操作

- fetch 需要取得结果 data

- operation 结果只做为一个状态 ret

- 简单的异步操作确实需要拉取接口的状态, 没有任何的副作用，不会有相关的后续操作

### 多步异步操作

- 封装 redux-thunk saga promise 等操作，需要更符合平常的操作。

### FSA(Flux Standard Action)

https://segmentfault.com/a/1190000010113847

必须的：

- 一个 action 必须是一个普通的 JavaScript 对象，有一个 type 字段。
- 一个 action 可能有 error 字段、payload 字段、meta 字段。
- 一个 action 必须不能包含除 type、payload、error 及 meta 以外的其他字段。

简单校验一个 action 是否是 FSA：

```js
let isFSA = Object.keys(action).every(item => {
  return ['payload', 'type', 'error', 'meta'].indexOf(item) > -1;
});
```

## 思路

### 为什么需要分 Fetch 和 Workflow ？

Fetch 的状态主要是对于 拉取接口的时候，将拉取的状态存储大 redux， 页面就可以针对状态显示不同的状态；

而引入 WorkFlow 的概念，主要是由于考虑到异步操作之间的工作流顺序，比如说提交表单之前，拉一个接口现在是否可以提交，如果接口返回 ok，则提交；否则就不提交。 提交表单这一个操作完全是根据拉是否能够提交这个异步接口返回的结果决定的。因此，helpers 中引入 redux-thunk ，在声明某一个 action 时就直接将整个执行这个 action 之前、之后、进行时.... 值了操作一并声明好了。 额。。。其实这样做有蛮多缺点的， 代码大量重复肯定是一个（如果很多 action 触发之前都需要某一个操作，那这个操作都需要在声明异步函数阶段就写入 action 了）；另外，具体执行流程对开发者不够透明，从 react 组件中，很难一眼看出这个异步操作之前做了什么动作。

#### 结论

如果需要将处理异步操作的中间件融入 helpers 中，那么肯定是有 Fetch 和 WorkFlow 之分的。

但是如果只是简单处理 redux 的状态，减少使用 redux 过程中的重复代码，其实只需要一个 Fetch 就够了，另外的异步处理中间件，开发者自行添加 redux-saga 也好，redux-thunk 也好，这个跟 helpers 没有关系。

### Redux-promise 的另一种探索思路

在 react 组件中 dispatch 一个 action， 合理的异步思路是（假设支持 async 和 await）,等待某一个 action 触发的事件结束，之后，再执行下一个操作。这里的异步不仅仅指的是访问接口的操作，简单的 redux 赋值操作也是异步的。很多时候，我需要赋值给 redux 结束之后，再从 redux 中取值（赋值之前判断，再执行之后的异步操作，也是合理的。）

那么，能够监听 dispatch 触发的事件？ 并 await 呢？

实际 dispatch(action) 之后是 return 当前的 action ，这可能是一个比较好的突破口
