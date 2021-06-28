---
title: dva
date: 2020-11-21
draft: true
---

## dva 是什么

dva 是阿里体验技术部开发的 React 应用框架，主要用于解决组件之间的通行问题，在以前 react 项目中解决数据流问题会引入 redux，又由于 redux 没有异步操作，所以需要引入 redux-saga 或 redux-thunk，这样的缺点就是是需要引入多个库，致使项目结构复杂。而现在：

> dva = React-Router + Redux + Redux-saga

将上面三个 React 工具库包装在一起，简化了 API，让开发 React 应用更加方便和快捷。

了解 dva 之前可以先去了解 redux-saga.

dva 的最简结构：

```js
import dva from 'dva';
const App = () => <div>Hello dva</div>;

// 创建应用
const app = dva();
app.model(model);
// 注册视图
app.router(() => <App />);
// 启动应用
app.start('#root');
```

## 核心概念

- State：一个对象，保存整个应用状态
- View：React 组件构成的视图层
- Action：一个对象，描述事件
- connect 方法：一个函数，绑定 State 到 View
- dispatch 方法：一个函数，发送 Action 到 State

### state 和 view

state 是用于数据存储保存全局状态。view 是 react 组件构成的 UI 层，当 state 变化时会触发 ui 层视图的变化。

### Action 和 dispatch

action 是用于描述一个事件的一个对象

```json
{
  "type": "submit-form-data",
  "payload": formData
}
```

dispatch 则用来发送 Action 到 State

### connect

connect 是一个函数，绑定 State 到 View，connect 方法返回的也是一个 React 组件，通常称为容器组件，是用于生成 State 到 Prop 的映射

```js
// 第一种写法这里使用来修饰器@
@connect((state) => {
  return {
    dept: state.dept,
    version: state.version,
  };
})

// 第二种写法
connect(({ state}) => ({state}))(App);
```

## Model

dva 中的 model 是所有的应用逻辑都定义在里面

model 的栗子 🌰：

```js
export default {
    namespace: 'modelName',
    state: {
 num: 0
    }，
    subscriptions: {
 setup({dispatch,history}){
   return history.listen(({pathname, query})=>{
    //  do something...
   })
 }
    }
    effects: {
   *addAfter1Second({payload}, { call, put, select }) {
     yield call(delay, 1000);
     yield put({ type: 'add' , payload: 10});
     const num =  yield select(state => state.modelName.num);
     console.log(num)
 },
    },
    reducers: {
 add(state, action) {
   return{
     ...state,
     num: action.payload
   }
 },
  },
}
```

model 对象的属性由 namespace,state, effect,reducers,subscriptions 组成。

### namespace 和 state

namespace 当前 Model 的名称。整个应用的 State，由多个小的 Model 的 State 以 namespace 为 key 合成,当在 ui 层触发变化时，可以利用 namespace 来区分触发那个 model 的方法。从而改变 state.

```js
dispatch({
  type: 'modelName/add',
  payload: 10,
});
```

数据保存在 state，直接决定了视图层的输出.

### effects 和 reducers

effects 和 reducers 都是 action 的处理器，不同的是 reducers 处理的是同步的 action,effects 处理的是异步的 action,effects 是基于 redux-saga 实现，effect 是一个 Generator 函数，内部使用 yield 关键字，标识每一步的操作。effect 提供了供内部使用的三个方法。

- call: 执行异步函数，一般用于请求数据
- put: 相当与 dispatch，发出一个 action,触法一个同步的 action
- select: 可以用于获取全局的状态 state

### subscriptions

subscriptions 一般用于监听路由变化，当满足某些要求时，可以触发一些事件

## 数据流图

![image](https://user-images.githubusercontent.com/21194931/56455493-812b0a00-6391-11e9-866b-a70f6ceefb9f.png)
