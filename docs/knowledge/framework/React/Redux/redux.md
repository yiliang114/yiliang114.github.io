---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### redux 简介

redux 是一个应用数据流框架，主要是解决了组件间状态共享的问题，原理是集中式管理，主要有三个核心方法，`action，store，reducer`

工作流程是：

- view 用 actionCreator 创建一个 action,里面可能包含一些数据
- 使用 store 的 dispatch 方法将 acion 传入 store
- store 将 action 与旧的 state 转发给 reducer
- reducer 深拷贝 state,并返回一个新的 state 给 store
- store 接收并更新 state
- 使用 store.subscribe 订阅更新,重新 render 组件

### reducer 为什么是纯函数？

从本质上讲，纯函数的定义如下：不修改函数的输入值，依赖于外部状态（比如数据库，DOM 和全局变量），同时对于任何相同的输入有着相同的输出结果。
![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/pureRedux.png)

阅读源码可以看到，Redux 接收一个给定的 state（对象），然后通过循环将 state 的每一部分传递给每个对应的 reducer。如果有发生任何改变，reducer 将返回一个新的对象。如果不发生任何变化，reducer 将返回旧的 state。

Redux 只通过比较新旧两个对象的存储位置来比较新旧两个对象是否相同（也就是 Javascript 对象浅比较）。如果你在 reducer 内部直接修改旧的 state 对象的属性值，那么新的 state 和旧的 state 将都指向同一个对象。因此 Redux 认为没有任何改变，返回的 state 将为旧的 state。

深比较在真实的应用当中代价昂贵，因为通常 js 的对象都很大，同时需要比较的次数很多。

因此一个有效的解决方法是作出一个规定：无论何时发生变化时，开发者都要创建一个新的对象，然后将新对象传递出去。同时，当没有任何变化发生时，开发者发送回旧的对象。也就是说，新的对象代表新的 state。 使用了新的策略之后，你能够比较两个对象通过使用!==比较两个对象的存储位置而不是比较两个对象的所有属性。

### 理解 Redux

Redux 本身是一个很轻的库，解决 component -> action -> reducer -> state 的单向数据流转问题。

它有两个非常突出的特点：

- predictable 可预测性
- 可扩展性

可预测性是由于它大量使用 pure function 和 plain object 等概念（reducer 和 action creator 是 pure function， state 和 action 是 plain object），并且 state 是 immutable 的。 这对于项目的稳定性会是很好的保证。

可扩展性则让我们可通过 middleware 定制 action 的处理，通过 reducer enhancer 扩展 reducer 等等。从而有了丰富的社区扩展和支持，比如异步处理，Form，router 同步， redu/ubdo ，性能问题（selecter）， 工具支持等。

### Library 选择

那么多的社区扩展，该如何选择才能组成我们的最佳实践？ 以异步处理为例。（也是最重要的一个问题）

用的比较多的通用解决方案有这些：

- [redux-thunk](https://github.com/gaearon/redux-thunk)
- [redux-promise](https://github.com/acdlite/redux-promise)
- [redux-saga](https://github.com/yelouafi/redux-saga)

redux-thunk 是支持函数形式的 action

### state 根对象的结构

在 React 中，尽量会把状态放在顶层的组件，在顶层的人组件使用 Redux 或者 Router。

这就把组件分为了两种： 容器组件和展示组件。

- 容器组件： 和 Redux 和 Router 交互，维护一套状态 和触发 Action
- 展示组件： 展示组件是在容器组件的内部，不维护状态。所有数据都通过 props 传给它们，所有的操作也都是通过回调完成。

### Part

Redux 分为三大部分，store， action ， reducer。

#### Store

整个应用的 state 被存储在一棵 Object Tree 中，并且这个 Object Tree 只存在于唯一一个 store 中。容器组件可以从 store 中获取所需要的状态，容器组件同时也可以发送给 store 一个 action，告诉他改变某一个状态的值。

#### Action

action 可以理解为一种指令，action 是一个对象，需要至少有一个元素 type， type 是 action 的唯一标识。

```js
{
  type: ACTION_TYPE,
  text: "content",
}
```

指令由组件触发，然后传到 reducer。

#### Reducer

action 只解释了要去做什么，以及做这件事情需要的参数值。具体去改变 store 中的 state 是由 reducer 来做的。

reducer 是一个包含 switch 的函数，根据传入的 action.type 对旧 state 进行不同的操作，最后返回一个新的 state 到 store 并储存的过程。

#### 数据流

### Redux 和 React 联系

Redux 和 React 之间没有关系，通过`react-redux`这个库绑定起来。

```
npm i --save react-redux
```

`react-redux`提供`Provider`和`connect`。

#### Provider

## redux

action creator 动作创建器

redux 中的 action 是具有如下格式的 js 对象，带有一个 type 值

```json
{
  "type": "ADD_TODO",
  "payload": {
    "text": "Do something."
  }
}
```

action creator 是 生成 action 的辅助函数，用来创建 action 。它本身是一个函数，在返回 action 对象之前， 可以对 action 中的值进行相关操作。

```js
export function addTodo(text) {
  return { type: ADD_TODO, text };
}
```

https://blog.csdn.net/real_bird/article/details/77113264

只要记得 action creator 最终是服务于 dispatch 的，因为 dispatch 需要的是一个 action （触发一个动作）

```js
const getDataAction = someData => (dispatch, getState) => {
  dispatch({ type: GET_DATA, data: someData });

  fetch() // 我使用的是fetch，并对fetch做了封装
    .then(res => res.json()) // 以json数据为例
    .then(jsonData => {
      dispatch({ type: GET_DATA_SUCCESS });
    })
    .catch(err => {
      dispatch({ type: GET_DATA_FAILED });
    });
};
```

#### 迷糊之处 1

##### return action 和 dispatch 之间是什么关系？

- redux connnect state -> props
- mapDispatchToProps action-> props

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

### createStore.js

createStore 是 redux 中一个非常重要的 API，createStore 会生成一个 store，维护一个状态树，里面是全局的 state,

```js
store = createStore(reducer, preloadedState, enhancer);
```

createStore 接受三个参数，分别为 reducer 纯函数，初始状态，增强器（即 applyMiddleware()返回的东西以及其他的中间件）用法如下：

```
const enhancer = compose(
applyMiddleware(sagaMiddleware),
composeWithDevTools()
);
```

createStore 生成的 store 提供了 dispath,subscribe,getState,replaceReducer,observable 等方法，接下来逐一分析。

```js
export default function createStore(reducer, preloadedState, enhancer) {
  // 判断接受的参数个数，来指定 reducer 、 preloadedState 和 enhancer
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  let currentReducer = reducer; // 存储当前的reducer
  let currentState = preloadedState; // 存储当前的状态
  let currentListeners = []; // 储存当前的监听函数列表
  let nextListeners = currentListeners; // 储存下一个监听函数列表
  let isDispatching = false; //是否在执行reducer
}
```

首先判定参数个数，分别指定三个参数，接着判断 enhancer 是否存在并且为函数则调用 enhancer，并且终止当前函数执行，前面的判断基本上是对三个参数对判断。接下来是对当前状态及 reducer 的存储。

#### getState

```js
// 接上述代码，这里不在重复
function getState() {
  if (isDispatching) {
    throw new Error(
      'You may not call store.getState() while the reducer is executing. ' +
        'The reducer has already received the state as an argument. ' +
        'Pass it down from the top reducer instead of reading it from the store.',
    );
  }

  return currentState;
}
```

这里判断是否在执行 reducer，返回当前的最新状态 state.

#### dispatch

```js
function dispatch(action) {
  if (!isPlainObject(action)) {
    throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
  }

  if (typeof action.type === 'undefined') {
    throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
  }

  if (isDispatching) {
    throw new Error('Reducers may not dispatch actions.');
  }

  try {
    isDispatching = true;
    currentState = currentReducer(currentState, action);
  } finally {
    isDispatching = false;
  }

  const listeners = (currentListeners = nextListeners);
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i];
    listener();
  }

  return action;
}
```

dispatch 接受一个参数 action，action 是把数据从应用传到 store 的有效载荷,它是 store 数据的唯一来源,action 包含 type 和 payload,payload 表示最新的状态 state，type 代表操作类型。传入 action 后会首先运行 reducer，reducer 接收 action 和当前状态 state,reducer 只判断 type 属性来返回最新的 state。
dispatch 还会触发整个监听函数列表，所以最后整个监听函数列表都会按顺序执行一遍。dispatch 返回值就是传入的 action。

#### subscribe

```js
function ensureCanMutateNextListeners() {
  if (nextListeners === currentListeners) {
    nextListeners = currentListeners.slice();
  }
}
```

ensureCanMutateNextListeners 会根据当前的监听函数列表生成下一个监听函数列表。

```js
function subscribe(listener) {
  if (typeof listener !== 'function') {
    throw new Error('Expected the listener to be a function.');
  }

  if (isDispatching) {
    throw new Error(
      'You may not call store.subscribe() while the reducer is executing. ' +
        'If you would like to be notified after the store has been updated, subscribe from a ' +
        'component and invoke store.getState() in the callback to access the latest state. ' +
        'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.',
    );
  }

  let isSubscribed = true;

  ensureCanMutateNextListeners();
  nextListeners.push(listener);

  return function unsubscribe() {
    if (!isSubscribed) {
      return;
    }

    if (isDispatching) {
      throw new Error(
        'You may not unsubscribe from a store listener while the reducer is executing. ' +
          'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.',
      );
    }

    isSubscribed = false;

    ensureCanMutateNextListeners();
    const index = nextListeners.indexOf(listener);
    nextListeners.splice(index, 1);
  };
}
```

subscribe 会接受一个 listener 函数，首先运行 ensureCanMutateNextListeners 生成下一个监听列表，然后向列表中添加进新的监听函数 listenner,subscribe 的返回值是一个 unsubscribe，是一个解绑函数，调用该解绑函数，会将已经添加的监听函数删除，该监听函数处于一个闭包之中，会一直存在，所以在解绑函数中能删除该监听函数。这就是 redux 精妙之处。

#### replaceReducer

```js
function replaceReducer(nextReducer) {
  if (typeof nextReducer !== 'function') {
    throw new Error('Expected the nextReducer to be a function.');
  }

  currentReducer = nextReducer;
  dispatch({ type: ActionTypes.REPLACE });
}
```

顾名思义 replaceReducer 的意思就是替换掉 reducer，replaceReducer 接受一个 reducer 替换的当前的 reducer，之后立即执行 dispatch({ type: ActionTypes.INIT }) ，用来初始化 store 的状态。
replaceReducer 的使用场景，分别是：

> 1.当你的程序要进行代码分割的时候 2.当你要动态的加载不同的 reducer 的时候 3.当你要实现一个实时 reloading 机制的时候

#### observable

该方法并不是暴露给使用者的，一般用于内部，在测试的时候会用到，这里不深究。

[redux 源码分析(二) ](https://github.com/LuoShengMen/StudyNotes/issues/170)

#### redux 和 vuex 的区别

redux 是 flux 的一种实现，redux 不单单可以用在 react 上面。
vuex 是 redux 的基础上进行改变，对仓库的管理更加明确。
数据流向不一样，vuex 的同异步有不同的流向，而 redux 的同异步是一样的。
redux 使用的是不可变的数据，而 vuex 的数据是可变的，redux 每次修改更新数据，其实就是用新的数据替换旧的数据，而 vuex 是直接修改原数据。

#### redux 为什么要把 reducer 设计成纯函数

redux 的设计思想就是不产生副作用，数据更改的状态可回溯，所以 redux 中处处都是纯函数
