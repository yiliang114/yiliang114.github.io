---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 何为 redux

Redux 的基本思想是整个应用的 state 保持在一个单一的 store 中。store 就是一个简单的 javascript 对象，而改变应用 state 的唯一方式是在应用中触发 actions，然后为这些 actions 编写 reducers 来修改 state。整个 state 转化是在 reducers 中完成，并且不应该有任何副作用。

### 何为 action

Actions 是一个纯 javascript 对象，它们必须有一个 type 属性表明正在执行的 action 的类型。实质上，action 是将数据从应用程序发送到 store 的有效载荷。

### 何为 reducer

一个 reducer 是一个纯函数，该函数以先前的 state 和一个 action 作为参数，并返回下一个 state。

### Redux 源码分析

首先让我们来看下 `combineReducers` 函数

```js
// 传入一个 object
export default function combineReducers(reducers) {
  // 获取该 Object 的 key 值
  const reducerKeys = Object.keys(reducers);
  // 过滤后的 reducers
  const finalReducers = {};
  // 获取每一个 key 对应的 value
  // 在开发环境下判断值是否为 undefined
  // 然后将值类型是函数的值放入 finalReducers
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning(`No reducer provided for key "${key}"`);
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  // 拿到过滤后的 reducers 的 key 值
  const finalReducerKeys = Object.keys(finalReducers);

  // 在开发环境下判断，保存不期望 key 的缓存用以下面做警告
  let unexpectedKeyCache;
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }

  let shapeAssertionError;
  try {
    // 该函数解析在下面
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }
  // combineReducers 函数返回一个函数，也就是合并后的 reducer 函数
  // 该函数返回总的 state
  // 并且你也可以发现这里使用了闭包，函数里面使用到了外面的一些属性
  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError;
    }
    // 该函数解析在下面
    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        warning(warningMessage);
      }
    }
    // state 是否改变
    let hasChanged = false;
    // 改变后的 state
    const nextState = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      // 拿到相应的 key
      const key = finalReducerKeys[i];
      // 获得 key 对应的 reducer 函数
      const reducer = finalReducers[key];
      // state 树下的 key 是与 finalReducers 下的 key 相同的
      // 所以你在 combineReducers 中传入的参数的 key 即代表了 各个 reducer 也代表了各个 state
      const previousStateForKey = state[key];
      // 然后执行 reducer 函数获得该 key 值对应的 state
      const nextStateForKey = reducer(previousStateForKey, action);
      // 判断 state 的值，undefined 的话就报错
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      // 然后将 value 塞进去
      nextState[key] = nextStateForKey;
      // 如果 state 改变
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    // state 只要改变过，就返回新的 state
    return hasChanged ? nextState : state;
  };
}
```

`combineReducers` 函数总的来说很简单，总结来说就是接收一个对象，将参数过滤后返回一个函数。该函数里有一个过滤参数后的对象 finalReducers，遍历该对象，然后执行对象中的每一个 reducer 函数，最后将新的 state 返回。

接下来让我们来看看 combinrReducers 中用到的两个函数

```js
// 这是执行的第一个用于抛错的函数
function assertReducerShape(reducers) {
  // 将 combineReducers 中的参数遍历
  Object.keys(reducers).forEach(key => {
    const reducer = reducers[key];
    // 给他传入一个 action
    const initialState = reducer(undefined, { type: ActionTypes.INIT });
    // 如果得到的 state 为 undefined 就抛错
    if (typeof initialState === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined during initialization. ` +
          `If the state passed to the reducer is undefined, you must ` +
          `explicitly return the initial state. The initial state may ` +
          `not be undefined. If you don't want to set a value for this reducer, ` +
          `you can use null instead of undefined.`,
      );
    }
    // 再过滤一次，考虑到万一你在 reducer 中给 ActionTypes.INIT 返回了值
    // 传入一个随机的 action 判断值是否为 undefined
    const type =
      '@@redux/PROBE_UNKNOWN_ACTION_' +
      Math.random()
        .toString(36)
        .substring(7)
        .split('')
        .join('.');
    if (typeof reducer(undefined, { type }) === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined when probed with a random type. ` +
          `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
          `namespace. They are considered private. Instead, you must return the ` +
          `current state for any unknown actions, unless it is undefined, ` +
          `in which case you must return the initial state, regardless of the ` +
          `action type. The initial state may not be undefined, but can be null.`,
      );
    }
  });
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  // 这里的 reducers 已经是 finalReducers
  const reducerKeys = Object.keys(reducers);
  const argumentName =
    action && action.type === ActionTypes.INIT
      ? 'preloadedState argument passed to createStore'
      : 'previous state received by the reducer';

  // 如果 finalReducers 为空
  if (reducerKeys.length === 0) {
    return (
      'Store does not have a valid reducer. Make sure the argument passed ' +
      'to combineReducers is an object whose values are reducers.'
    );
  }
  // 如果你传入的 state 不是对象
  if (!isPlainObject(inputState)) {
    return (
      `The ${argumentName} has unexpected type of "` +
      {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] +
      `". Expected argument to be an object with the following ` +
      `keys: "${reducerKeys.join('", "')}"`
    );
  }
  // 将参入的 state 于 finalReducers 下的 key 做比较，过滤出多余的 key
  const unexpectedKeys = Object.keys(inputState).filter(
    key => !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key],
  );

  unexpectedKeys.forEach(key => {
    unexpectedKeyCache[key] = true;
  });

  if (action && action.type === ActionTypes.REPLACE) return;

  // 如果 unexpectedKeys 有值的话
  if (unexpectedKeys.length > 0) {
    return (
      `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
      `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
      `Expected to find one of the known reducer keys instead: ` +
      `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
    );
  }
}
```

接下来让我们先来看看 `compose` 函数

```js
// 这个函数设计的很巧妙，通过传入函数引用的方式让我们完成多个函数的嵌套使用，术语叫做高阶函数
// 通过使用 reduce 函数做到从右至左调用函数
// 对于上面项目中的例子
compose(applyMiddleware(thunkMiddleware), window.devToolsExtension ? window.devToolsExtension() : f => f);
// 经过 compose 函数变成了 applyMiddleware(thunkMiddleware)(window.devToolsExtension()())
// 所以在找不到 window.devToolsExtension 时你应该返回一个函数
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

然后我们来解析 `createStore` 函数的部分代码

```js
export default function createStore(reducer, preloadedState, enhancer) {
  // 一般 preloadedState 用的少，判断类型，如果第二个参数是函数且没有第三个参数，就调换位置
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }
  // 判断 enhancer 是否是函数
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }
    // 类型没错的话，先执行 enhancer，然后再执行 createStore 函数
    return enhancer(createStore)(reducer, preloadedState);
  }
  // 判断 reducer 是否是函数
  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }
  // 当前 reducer
  let currentReducer = reducer;
  // 当前状态
  let currentState = preloadedState;
  // 当前监听函数数组
  let currentListeners = [];
  // 这是一个很重要的设计，为的就是每次在遍历监听器的时候保证 currentListeners 数组不变
  // 可以考虑下只存在 currentListeners 的情况，如果我在某个 subscribe 中再次执行 subscribe
  // 或者 unsubscribe，这样会导致当前的 currentListeners 数组大小发生改变，从而可能导致
  // 索引出错
  let nextListeners = currentListeners;
  // reducer 是否正在执行
  let isDispatching = false;
  // 如果 currentListeners 和 nextListeners 相同，就赋值回去
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  // ......
}
```

接下来先来介绍 `applyMiddleware` 函数

在这之前我需要先来介绍一下函数柯里化，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

```js
function add(a,b) { return a + b }
add(1, 2) => 3
// 对于以上函数如果使用柯里化可以这样改造
function add(a) {
    return b => {
   return a + b
    }
}
add(1)(2) => 3
// 你可以这样理解函数柯里化，通过闭包保存了外部的一个变量，然后返回一个接收参数的函数，在该函数中使用了保存的变量，然后再返回值。
```

```js
// 这个函数应该是整个源码中最难理解的一块了
// 该函数返回一个柯里化的函数
// 所以调用这个函数应该这样写 applyMiddleware(...middlewares)(createStore)(...args)
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    // 这里执行 createStore 函数，把 applyMiddleware 函数最后次调用的参数传进来
    const store = createStore(...args);
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`,
      );
    };
    let chain = [];
    // 每个中间件都应该有这两个函数
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args),
    };
    // 把 middlewares 中的每个中间件都传入 middlewareAPI
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    // 和之前一样，从右至左调用每个中间件，然后传入 store.dispatch
    dispatch = compose(...chain)(store.dispatch);
    // 这里只看这部分代码有点抽象，我这里放入 redux-thunk 的代码来结合分析
    // createThunkMiddleware返回了3层函数，第一层函数接收 middlewareAPI 参数
    // 第二次函数接收 store.dispatch
    // 第三层函数接收 dispatch 中的参数
    {
      function createThunkMiddleware(extraArgument) {
        return ({ dispatch, getState }) => next => action => {
          // 判断 dispatch 中的参数是否为函数
          if (typeof action === 'function') {
            // 是函数的话再把这些参数传进去，直到 action 不为函数，执行 dispatch({tyep: 'XXX'})
            return action(dispatch, getState, extraArgument);
          }

          return next(action);
        };
      }
      const thunk = createThunkMiddleware();

      export default thunk;
    }
    // 最后把经过中间件加强后的 dispatch 于剩余 store 中的属性返回，这样你的 dispatch
    return {
      ...store,
      dispatch,
    };
  };
}
```

好了，我们现在将困难的部分都攻克了，来看一些简单的代码

```js
// 这个没啥好说的，就是把当前的 state 返回，但是当正在执行 reducer 时不能执行该方法
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
// 接收一个函数参数
function subscribe(listener) {
  if (typeof listener !== 'function') {
    throw new Error('Expected listener to be a function.');
  }
  // 这部分最主要的设计 nextListeners 已经讲过，其他基本没什么好说的
  if (isDispatching) {
    throw new Error(
      'You may not call store.subscribe() while the reducer is executing. ' +
        'If you would like to be notified after the store has been updated, subscribe from a ' +
        'component and invoke store.getState() in the callback to access the latest state. ' +
        'See http://redux.js.org/docs/api/Store.html#subscribe for more details.',
    );
  }

  let isSubscribed = true;

  ensureCanMutateNextListeners();
  nextListeners.push(listener);

  // 返回一个取消订阅函数
  return function unsubscribe() {
    if (!isSubscribed) {
      return;
    }

    if (isDispatching) {
      throw new Error(
        'You may not unsubscribe from a store listener while the reducer is executing. ' +
          'See http://redux.js.org/docs/api/Store.html#subscribe for more details.',
      );
    }

    isSubscribed = false;

    ensureCanMutateNextListeners();
    const index = nextListeners.indexOf(listener);
    nextListeners.splice(index, 1);
  };
}

function dispatch(action) {
  // 原生的 dispatch 会判断 action 是否为对象
  if (!isPlainObject(action)) {
    throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
  }

  if (typeof action.type === 'undefined') {
    throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
  }
  // 注意在 Reducers 中是不能执行 dispatch 函数的
  // 因为你一旦在 reducer 函数中执行 dispatch，会引发死循环
  if (isDispatching) {
    throw new Error('Reducers may not dispatch actions.');
  }
  // 执行 combineReducers 组合后的函数
  try {
    isDispatching = true;
    currentState = currentReducer(currentState, action);
  } finally {
    isDispatching = false;
  }
  // 然后遍历 currentListeners，执行数组中保存的函数
  const listeners = (currentListeners = nextListeners);
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i];
    listener();
  }

  return action;
}
// 然后在 createStore 末尾会发起一个 action dispatch({ type: ActionTypes.INIT });
// 用以初始化 state
```

- react hook 了解么
- 为什么之前的 render 函数必须有一个顶层节点，现在不需要了，可以直接渲染一个数组？

### 在 Redux 中，何为 store

Store 是一个 javascript 对象，它保存了整个应用的 state。与此同时，Store 也承担以下职责：

- 允许通过 `getState()` 访问 state
- 运行通过 `dispatch(action)` 改变 state
- 通过 `subscribe(listener)` 注册 listeners
- 通过 `subscribe(listener)` 返回的函数处理 listeners 的注销

### Redux Thunk 的作用是什么

Redux thunk 是一个允许你编写返回一个函数而不是一个 action 的 actions creators 的中间件。如果满足某个条件，thunk 则可以用来延迟 action 的派发(dispatch)，这可以处理异步 action 的派发(dispatch)。

### redux 缺点

重绘

redux 的缺点也是足够明显的。每一次 dispatch 事件之后都会导致整个虚拟 dom 至顶向下的重绘。重绘剪枝需要在`shouldComponentUpdate`中完成，如果事件足够复杂， store 足够大，`shouldComponentUpdate`方法的剪枝粒度就不那么容易控制了（实际情况下，`shouldComponentUpdate`基本和`TODO`一样不可保证）。

- 一个组件所需要的数据，必须由父组件传过来，而不能像 flux 中直接从 store 取。
- 当一个组件相关数据更新时，即使父组件不需要用到这个组件，父组件还是会重新 render，可能会有效率影响，或者需要写复杂的`shouldComponentUpdate`进行判断。

### reducer

redux 的另一个缺点是：reducer 要求每次返回一个新的对象引用。当需要修改的数据层级较深，reducer 写起来很难保证优雅。所以一般 redux 项目都会刻意的保持 store 的平坦化，没有深层级的数据，用`Object.assign`几步搞定。如果 store 不可避免的太大了，怎么办呢？很多工程开始使用`Immutable.js`，以上的代码可以改写为：

```
let newState = state.updateIn(['list',0,'roomInfo','rateList',0, 'score'], 90);
```

store 大了，你不用 immutable 还能怎么办呢？

### Redux

1.  redux 一般需要配合什么中间件使用？mobx 与 redux 的区别？
2.  redux-thunk 的使用，redux-saga 的使用，redux-observable 的使用，以及其他
3.  reselect 的使用，baobab 的使用
4.  什么是**reducers**，**middleware**，**store **，**action**
5.  什么是 combineReducers，与一般的 reducer 有什么不同？
6.  react-redux 与 redux 有什么不同之处?(`redux`和`react`没关系，但他俩能合作)
7.  react-redux 的一些函数： connect，provider，mapStateToProps 等
8.  redux（store）的一些函数： getState, dispatch, subscribe
9.  对于一个状态，会创建三个 action： 请求中，请求成功，请求失败？为什么？

### redux-thunk

1. thunk 的作用是什么？

### redux-saga

1. saga 的作用是什么？

### redux-observable

1. observable 的作用是什么？

### redux-amrc

1. amrc 的作用是什么？

### MobX

1. mobx 的使用方式 ?

2. mobx 的核心概念

3. mobx 与 mobx-react 的区别

4. 什么是*Reactions*，_derivations_，_autorun _？

5. 什么时候需要用 action 装饰器？什么时候 action 装饰器后面跟 get 以及 set？哪些数据需要 observable 哪些不需要？

6. store 文件中 什么时候用 _Reactions_，_derivations_， 以及 autorun 比较好？

   ​

### redux-saga

```
function* watchFetchModel() {
  // global saga永不cancel
  yield takeLatest(getFetchActions(FETCH_MODEL).Start, fetchModel);
}
```

### redux 中间件

> 中间件提供第三方插件的模式，自定义拦截 action -> reducer 的过程。变为 action -> middlewares -> reducer 。这种机制可以让我们改变数据流，实现如异步 action ，action 过滤，日志输出，异常报告等功能

- `redux-logger`：提供日志输出
- `redux-thunk`：处理异步操作
- `redux-promise`：处理异步操作，`actionCreator`的返回值是`promise`

### redux 的 immutable 使用 immutable 之前和之后有什么区别？

### redux 生态

- redux-thunk
- redux-saga
- redux-promise 通常与 redux-actions 搭配，好像有了 actions 之后就不要再接腾讯云状态的 actions 了。
- redux-promise-middleware
- redux-actions

### redux 的同步数据流

主要说是单向数据流： http://www.redux.org.cn/docs/basics/DataFlow.html），据说触发一个action 之后 state 改变，如果是异步获取数据引发 state 改变，使用 await async 之后 理论上在同一个函数里能够直接调用更新后的值？ 具体场景: 我在触发某一个动作之前，需要先拉取一个接口获取当前状态，resp 更新到 store 中，如果没有问题，再触发之后的动作。感觉可能需要利用 thunk 传递一个 actionCreator 时 携带一个 callback，而这个 callback 的内容就是 需要获取同步 state 值的逻辑？

### redux saga 和 thunk 传一个回调给 action，保证 state 更新之后同步获取。

### immutable.js 的作用， 配合 redux 、reselector 使用的时候，是不是就需要再手动浅拷贝了？

### redux 异步请求状态机：

- start： 装载 param 参数
- perform： 执行异步操作
- done： 执行成功，redux 赋值
- cancel: 执行结束

### redux 封装

- 将 saga 或者 rxjs 封装成 类 mobx 的。
- 通过标注的形式 ——> 高阶组件 @observe 等
- 要知道为什么 vuex 和 mobx 能够直接修改数据，引起 组件的重新渲染（mobx）是直接可以脱离 react 的渲染机制的。 因为 vuex 和 mobx 都- 是通过观察者模式来做的，被观察的属性 set 和 get 的时候会通知组件的 rerender。 而 redux ，则是利用 react 的 rerender，很多地方都需要自己去做性能优化， shouldComponentUpdate

### saga 为什么要手动触发 LOCATION_CHANGE 这个 action

https://neue.v2ex.com/t/300257， 重复触发 LOCATION_CHANGE 会导致 saga 异常，不执行异步操作。

### saga 的 cancel 操作， 什么时候 saga 异步操作需要退出？ 等多久？

https://redux-saga-in-chinese.js.org/docs/api/index.html#canceltask

### redux saga 存在子组件的 saga 存在一个多次注册的 bug，对于各个子组件的 saga task ，需要在当前的作用域内 take 之后 cancel 掉才能避免被多次监听。

### Redux 中的 Action 是什么?

*Actions*是纯 JavaScript 对象或信息的有效负载，可将数据从您的应用程序发送到您的 Store。 它们是 Store 唯一的数据来源。 Action 必须具有指示正在执行的操作类型的 type 属性。

例如，表示添加新待办事项的示例操作：

```js
{
  type: ADD_TODO,
  text: 'Add todo item'
}
```

### Redux 只能与 React 一起使用么?

Redux 可以用做任何 UI 层的数据存储。最常见的应用场景是 React 和 React Native，但也有一些 bindings 可用于 AngularJS，Angular 2，Vue，Mithril 等项目。Redux 只提供了一种订阅机制，任何其他代码都可以使用它。

### 您是否需要使用特定的构建工具来使用 Redux ?

Redux 最初是用 ES6 编写的，用 Webpack 和 Babel 编译成 ES5。 无论您的 JavaScript 构建过程如何，您都应该能够使用它。Redux 还提供了一个 UMD 版本，可以直接使用而无需任何构建过程。

### Redux Form 的 `initialValues` 如何从状态更新?

你需要添加`enableReinitialize：true`设置。

```js
const InitializeFromStateForm = reduxForm({
  form: 'initializeFromState',
  enableReinitialize: true,
})(UserEdit);
```

如果你的`initialValues`属性得到更新，你的表单也会更新。

### 我需要将所有状态保存到 Redux 中吗？我应该使用 react 的内部状态吗?

这取决于开发者的决定。即开发人员的工作是确定应用程序的哪种状态，以及每个状态应该存在的位置，有些用户喜欢将每一个数据保存在 Redux 中，以维护其应用程序的完全可序列化和受控。其他人更喜欢在组件的内部状态内保持非关键或 UI 状态，例如“此下拉列表当前是否打开”。

以下是确定应将哪种数据放入 Redux 的主要规则：

应用程序的其他部分是否关心此数据？
您是否需要能够基于此原始数据创建更多派生数据？
是否使用相同的数据来驱动多个组件？
能够将此状态恢复到给定时间点（即时间旅行调试）是否对您有价值？
您是否要缓存数据（即，如果已经存在，则使用处于状态的状态而不是重新请求它）？

### Flux 和 Redux 之间有什么区别?

以下是 Flux 和 Redux 之间的主要区别

| Flux                        | Redux                      |
| --------------------------- | -------------------------- |
| 状态是可变的                | 状态是不可变的             |
| Store 包含状态和更改逻辑    | 存储和更改逻辑是分开的     |
| 存在多个 Store              | 仅存在一个 Store           |
| 所有的 Store 都是断开连接的 | 带有分层 reducers 的 Store |
| 它有一个单独的 dispatcher   | 没有 dispatcher 的概念     |
| React 组件监测 Store        | 容器组件使用连接函数       |

### formik 相对于其他 redux 表单库有什么优势?

下面是建议使用 formik 而不是 redux 表单库的主要原因：

表单状态本质上是短期的和局部的，因此不需要在 redux（或任何类型的 flux 库）中跟踪它。
每次按一个键，Redux-Form 都会多次调用整个顶级 Redux Reducer。这样就增加了大型应用程序的输入延迟。
经过 gzip 压缩过的 Redux-Form 为 22.5 kB，而 Formik 只有 12.7 kB。

### 什么是 Flux?

_Flux_ 是*应用程序设计范例*，用于替代更传统的 MVC 模式。它不是一个框架或库，而是一种新的体系结构，它补充了 React 和单向数据流的概念。在使用 React 时，Facebook 会在内部使用此模式。

在 dispatcher，stores 和视图组件具有如下不同的输入和输出：

![flux](images/flux.png)

### 什么是 Redux?

_Redux_ 是基于 _Flux 设计模式_ 的 JavaScript 应用程序的可预测状态容器。Redux 可以与 React 一起使用，也可以与任何其他视图库一起使用。它很小（约 2kB）并且没有依赖性。

### Redux 的核心原则是什么？?

Redux 遵循三个基本原则：

**单一数据来源：** 整个应用程序的状态存储在单个对象树中。单状态树可以更容易地跟踪随时间的变化并调试或检查应用程序。
**状态是只读的：** 改变状态的唯一方法是发出一个动作，一个描述发生的事情的对象。这可以确保视图和网络请求都不会直接写入状态。
**使用纯函数进行更改：** 要指定状态树如何通过操作进行转换，您可以编写 reducers。Reducers 只是纯函数，它将先前的状态和操作作为参数，并返回下一个状态。

### 与 Flux 相比，Redux 的缺点是什么?

我们应该说使用 Redux 而不是 Flux 几乎没有任何缺点。这些如下：

**您将需要学会避免突变：** Flux 对变异数据毫不吝啬，但 Redux 不喜欢突变，许多与 Redux 互补的包假设您从不改变状态。您可以使用 dev-only 软件包强制执行此操作，例如`redux-immutable-state-invariant`，Immutable.js，或指示您的团队编写非变异代码。
**您将不得不仔细选择您的软件包：** 虽然 Flux 明确没有尝试解决诸如撤消/重做，持久性或表单之类的问题，但 Redux 有扩展点，例如中间件和存储增强器，以及它催生了丰富的生态系统。
**还没有很好的 Flow 集成：** Flux 目前可以让你做一些非常令人印象深刻的静态类型检查，Redux 还不支持。

### `mapStateToProps()` 和 `mapDispatchToProps()` 之间有什么区别?

`mapStateToProps()`是一个实用方法，它可以帮助您的组件获得最新的状态（由其他一些组件更新）：

```js
const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter),
  };
};
```

`mapDispatchToProps()`是一个实用方法，它可以帮助你的组件触发一个动作事件（可能导致应用程序状态改变的调度动作）：

```js
const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id));
    },
  };
};
```

### 我可以在 reducer 中触发一个 Action 吗?

在 reducer 中触发 Action 是**反模式**。您的 reducer 应该*没有副作用*，只是接收 Action 并返回一个新的状态对象。在 reducer 中添加侦听器和调度操作可能会导致链接的 Action 和其他副作用。

### 如何在组件外部访问 Redux 存储的对象?

是的，您只需要使用`createStore()`从它创建的模块中导出存储。此外，它不应污染全局窗口对象。

```js
store = createStore(myReducer);

export default store;
```

### MVW 模式的缺点是什么?

DOM 操作非常昂贵，导致应用程序行为缓慢且效率低下。
由于循环依赖性，围绕模型和视图创建了复杂的模型。
协作型应用程序（如 Google Docs）会发生大量数据更改。
无需添加太多额外代码就无法轻松撤消（及时回退）。

### Redux 和 RxJS 之间是否有任何相似之处?

这些库的目的是不同的，但是存在一些模糊的相似之处。

Redux 是一个在整个应用程序中管理状态的工具。它通常用作 UI 的体系结构。可以将其视为（一半）Angular 的替代品。 RxJS 是一个反应式编程库。它通常用作在 JavaScript 中完成异步任务的工具。把它想象成 Promise 的替代品。 Redux 使用 Reactive 范例，因为 Store 是被动的。Store 检测到 Action，并自行改变。RxJS 也使用 Reactive 范例，但它不是一个体系结构，它为您提供了基本构建块 Observables 来完成这种模式。

### 如何在加载时触发 Action?

您可以在`componentDidMount()`方法中触发 Action，然后在`render()`方法中可以验证数据。

```js
class App extends Component {
  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    return this.props.isLoaded ? <div>{'Loaded'}</div> : <div>{'Not Loaded'}</div>;
  }
}

const mapStateToProps = state => ({
  isLoaded: state.isLoaded,
});

const mapDispatchToProps = { fetchData };

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

### 在 React 中如何使用 Redux 的 `connect()` ?

您需要按照两个步骤在容器中使用您的 Store：

**使用`mapStateToProps()`：** 它将 Store 中的状态变量映射到您指定的属性。
**将上述属性连接到容器：** `mapStateToProps`函数返回的对象连接到容器。你可以从`react-redux`导入`connect()`。

    ```jsx
    import React from 'react'
    import { connect } from 'react-redux'

    class App extends React.Component {
      render() {
        return <div>{this.props.containerData}</div>
      }
    }

    function mapStateToProps(state) {
      return { containerData: state.data }
    }

    export default connect(mapStateToProps)(App)
    ```

### 如何在 Redux 中重置状态?

你需要在你的应用程序中编写一个*root reducer*，它将处理动作委托给`combineReducers()`生成的 reducer。

例如，让我们在`USER_LOGOUT`动作之后让`rootReducer()`返回初始状态。我们知道，无论 Action 怎么样，当使用`undefined`作为第一个参数调用它们时，reducers 应该返回初始状态。

```js
const appReducer = combineReducers({
  /* your app's top-level reducers */
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};
```

如果使用`redux-persist`，您可能还需要清理存储空间。`redux-persist`在 storage 引擎中保存您的状态副本。首先，您需要导入适当的 storage 引擎，然后在将其设置为`undefined`之前解析状态并清理每个存储状态键。

```js
const appReducer = combineReducers({
  /* your app's top-level reducers */
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    Object.keys(state).forEach(key => {
      storage.removeItem(`persist:${key}`);
    });

    state = undefined;
  }

  return appReducer(state, action);
};
```

### Redux 中连接装饰器的 `at` 符号的目的是什么?

**@** 符号实际上是用于表示装饰器的 JavaScript 表达式。*装饰器*可以在设计时注释和修改类和属性。

让我们举个例子，在没有装饰器的情况下设置 Redux 。

- **未使用装饰器:**

  ```js
  import React from 'react';
  import * as actionCreators from './actionCreators';
  import { bindActionCreators } from 'redux';
  import { connect } from 'react-redux';

  function mapStateToProps(state) {
    return { todos: state.todos };
  }

  function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actionCreators, dispatch) };
  }

  class MyApp extends React.Component {
    // ...define your main app here
  }

  export default connect(mapStateToProps, mapDispatchToProps)(MyApp);
  ```

- **使用装饰器:**

  ```js
  import React from 'react';
  import * as actionCreators from './actionCreators';
  import { bindActionCreators } from 'redux';
  import { connect } from 'react-redux';

  function mapStateToProps(state) {
    return { todos: state.todos };
  }

  function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actionCreators, dispatch) };
  }

  @connect(mapStateToProps, mapDispatchToProps)
  export default class MyApp extends React.Component {
    // ...define your main app here
  }
  ```

除了装饰器的使用外，上面的例子几乎相似。装饰器语法尚未构建到任何 JavaScript 运行时中，并且仍然是实验性的并且可能会发生变化。您可以使用`babel`来获得装饰器支持。

### React 上下文和 React Redux 之间有什么区别?

您可以直接在应用程序中使用**Context**，这对于将数据传递给深度嵌套的组件非常有用。而**Redux**功能更强大，它还提供了 Context API 无法提供的大量功能。此外，React Redux 在内部使用上下文，但它不会在公共 API 中有所体现。

### 为什么 Redux 状态函数称为 reducers ?

Reducers 总是返回状态的累积（基于所有先前状态和当前 Action）。因此，它们充当了状态的 Reducer。每次调用 Redux reducer 时，状态和 Action 都将作为参数传递。然后基于该 Action 减少（或累积）该状态，然后返回下一状态。您可以*reduce*一组操作和一个初始状态（Store），在该状态下执行这些操作以获得最终的最终状态。

### 如何在 Redux 中发起 AJAX 请求?

您可以使用`redux-thunk`中间件，它允许您定义异步操作。

让我们举个例子，使用*fetch API*将特定帐户作为 AJAX 调用获取：

```js
export function fetchAccount(id) {
  return dispatch => {
    dispatch(setLoadingAccountState()); // Show a loading spinner
    fetch(`/account/${id}`, response => {
      dispatch(doneFetchingAccount()); // Hide loading spinner
      if (response.status === 200) {
        dispatch(setAccount(response.json)); // Use a normal function to set the received state
      } else {
        dispatch(someError);
      }
    });
  };
}

function setAccount(data) {
  return { type: 'SET_Account', data: data };
}
```

### 我应该在 Redux Store 中保留所有组件的状态吗?

将数据保存在 Redux 存储中，并在组件内部保持 UI 相关状态。

### 访问 Redux Store 的正确方法是什么?

在组件中访问 Store 的最佳方法是使用`connect()`函数，该函数创建一个包裹现有组件的新组件。此模式称为*高阶组件*，通常是在 React 中扩展组件功能的首选方式。这允许您将状态和 Action 创建者映射到组件，并在 Store 更新时自动传递它们。

我们来看一个使用 connect 的`<FilterLink>`组件的例子：

```js
import { connect } from 'react-redux';
import { setVisibilityFilter } from '../actions';
import Link from '../components/Link';

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => dispatch(setVisibilityFilter(ownProps.filter)),
});

const FilterLink = connect(mapStateToProps, mapDispatchToProps)(Link);

export default FilterLink;
```

由于它具有相当多的性能优化并且通常不太可能导致错误，因此 Redux 开发人员几乎总是建议使用`connect()`直接访问 Store（使用上下文 API）。

```js
class MyComponent {
  someMethod() {
    doSomethingWith(this.context.store);
  }
}
```

### React Redux 中展示组件和容器组件之间的区别是什么?

**展示组件**是一个类或功能组件，用于描述应用程序的展示部分。

**容器组件**是连接到 Redux Store 的组件的非正式术语。容器组件*订阅* Redux 状态更新和*dispatch*操作，它们通常不呈现 DOM 元素；他们将渲染委托给展示性的子组件。

### Redux 中常量的用途是什么?

常量允许您在使用 IDE 时轻松查找项目中该特定功能的所有用法。它还可以防止你拼写错误，在这种情况下，你会立即得到一个`ReferenceError`。

通常我们会将它们保存在一个文件中（`constants.js`或`actionTypes.js`）。

```js
export const ADD_TODO = 'ADD_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const EDIT_TODO = 'EDIT_TODO';
export const COMPLETE_TODO = 'COMPLETE_TODO';
export const COMPLETE_ALL = 'COMPLETE_ALL';
export const CLEAR_COMPLETED = 'CLEAR_COMPLETED';
```

在 Redux 中，您可以在两个地方使用它们：

**在 Action 创建时:**

    让我们看看 `actions.js`:

    ```js
    import { ADD_TODO } from './actionTypes';

    export function addTodo(text) {
      return { type: ADD_TODO, text }
    }
    ```

**在 reducers 里:**

    让我们创建 `reducer.js` 文件:

    ```js
    import { ADD_TODO } from './actionTypes'

    export default (state = [], action) => {
      switch (action.type) {
        case ADD_TODO:
          return [
            ...state,
            {
              text: action.text,
              completed: false
            }
          ];
        default:
          return state
      }
    }
    ```

### 编写 `mapDispatchToProps()` 有哪些不同的方法?

有一些方法可以将*action creators*绑定到`mapDispatchToProps()`中的`dispatch()`。以下是可能的写法：

```js
const mapDispatchToProps = dispatch => ({
  action: () => dispatch(action()),
});
```

```js
const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(action, dispatch),
});
```

```js
const mapDispatchToProps = { action };
```

第三种写法只是第一种写法的简写。

### 在 `mapStateToProps()` 和 `mapDispatchToProps()` 中使用 `ownProps` 参数有什么用?

如果指定了`ownProps`参数，React Redux 会将传递给该组件的 props 传递给你的*connect*函数。因此，如果您使用连接组件：

```jsx
import ConnectedComponent from './containers/ConnectedComponent';

<ConnectedComponent user={'john'} />;
```

你的`mapStateToProps()`和`mapDispatchToProps()`函数里面的`ownProps`将是一个对象：

```js
{
  user: 'john';
}
```

您可以使用此对象来决定从这些函数返回的内容。

### 如何构建 Redux 项目目录?

大多数项目都有几个顶级目录，如下所示：

**Components**: 用于*dumb*组件，Redux 不必关心的组件。
**Containers**: 用于连接到 Redux 的*smart*组件。
**Actions**: 用于所有 Action 创建器，其中文件名对应于应用程序的一部分。
**Reducers**: 用于所有 reducer，其中文件名对应于 state key。
**Store**: 用于 Store 初始化。

这种结构适用于中小型项目。

### 什么是 redux-saga?

`redux-saga`是一个库，旨在使 React/Redux 项目中的副作用（数据获取等异步操作和访问浏览器缓存等可能产生副作用的动作）更容易，更好。

这个包在 NPM 上有发布:

```console
$ npm install --save redux-saga
```

### redux-saga 的模型概念是什么?

*Saga*就像你的项目中的一个单独的线程，它独自负责副作用。`redux-saga` 是一个 redux _中间件_，这意味着它可以在项目启动中使用正常的 Redux 操作，暂停和取消该线程，它可以访问完整的 Redux 应用程序状态，并且它也可以调度 Redux 操作。

### 在 redux-saga 中 `call()` 和 `put()` 之间有什么区别?

`call()`和`put()`都是 Effect 创建函数。 `call()`函数用于创建 Effect 描述，指示中间件调用 promise。`put()`函数创建一个 Effect，指示中间件将一个 Action 分派给 Store。

让我们举例说明这些 Effect 如何用于获取特定用户数据。

```js
function* fetchUserSaga(action) {
  // `call` function accepts rest arguments, which will be passed to `api.fetchUser` function.
  // Instructing middleware to call promise, it resolved value will be assigned to `userData` variable
  const userData = yield call(api.fetchUser, action.userId);

  // Instructing middleware to dispatch corresponding action.
  yield put({
    type: 'FETCH_USER_SUCCESS',
    userData,
  });
}
```

### 什么是 Redux Thunk?

*Redux Thunk*中间件允许您编写返回函数而不是 Action 的创建者。 thunk 可用于延迟 Action 的发送，或仅在满足某个条件时发送。内部函数接收 Store 的方法`dispatch()`和`getState()`作为参数。

### `redux-saga` 和 `redux-thunk` 之间有什么区别?

*Redux Thunk*和*Redux Saga*都负责处理副作用。在大多数场景中，Thunk 使用*Promises*来处理它们，而 Saga 使用*Generators*。Thunk 易于使用，因为许多开发人员都熟悉 Promise，Sagas/Generators 功能更强大，但您需要学习它们。但是这两个中间件可以共存，所以你可以从 Thunks 开始，并在需要时引入 Sagas。

### 什么是 Redux DevTools?

*Redux DevTools*是 Redux 的实时编辑的时间旅行环境，具有热重新加载，Action 重放和可自定义的 UI。如果您不想安装 Redux DevTools 并将其集成到项目中，请考虑使用 Chrome 和 Firefox 的扩展插件。

### Redux DevTools 的功能有哪些?

允许您检查每个状态和 action 负载。
让你可以通过*撤销*回到过去。
如果更改 reducer 代码，将重新评估每个*已暂存*的 Action。
如果 Reducers 抛出错误，你会看到这发生了什么 Action，以及错误是什么。
使用`persistState()`存储增强器，您可以在页面重新加载期间保持调试会话。

### 什么是 Redux 选择器以及使用它们的原因?

*选择器*是将 Redux 状态作为参数并返回一些数据以传递给组件的函数。

例如，要从 state 中获取用户详细信息：

```js
const getUserData = state => state.user.data;
```

### 什么是 Redux Form?

*Redux Form*与 React 和 Redux 一起使用，以使 React 中的表单能够使用 Redux 来存储其所有状态。Redux Form 可以与原始 HTML5 输入一起使用，但它也适用于常见的 UI 框架，如 Material UI，React Widgets 和 React Bootstrap。

### Redux Form 的主要功能有哪些?

字段值通过 Redux 存储持久化。
验证（同步/异步）和提交。
字段值的格式化，解析和规范化。

### 如何向 Redux 添加多个中间件?

你可以使用`applyMiddleware()`。

例如，你可以添加`redux-thunk`和`logger`作为参数传递给`applyMiddleware()`：

```js
import { createStore, applyMiddleware } from 'redux';
const createStoreWithMiddleware = applyMiddleware(ReduxThunk, logger)(createStore);
```

### 如何在 Redux 中设置初始状态?

您需要将初始状态作为第二个参数传递给 createStore ：

```js
const rootReducer = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter,
});

const initialState = {
  todos: [{ id: 123, name: 'example', completed: false }],
};

const store = createStore(rootReducer, initialState);
```

### Relay 与 Redux 有何不同?

Relay 与 Redux 类似，因为它们都使用单个 Store。主要区别在于 relay 仅管理源自服务器的状态，并且通过*GraphQL*查询（用于读取数据）和突变（用于更改数据）来使用对状态的所有访问。Relay 通过仅提取已更改的数据而为您缓存数据并优化数据提取。

### 什么是 Reselect 以及它是如何工作的?

*Reselect*是一个**选择器库**（用于 Redux ），它使用*memoization*概念。它最初编写用于计算类似 Redux 的应用程序状态的派生数据，但它不能绑定到任何体系结构或库。

Reselect 保留最后一次调用的最后输入/输出的副本，并仅在其中一个输入发生更改时重新计算结果。如果连续两次提供相同的输入，则 Reselect 将返回缓存的输出。它的 memoization 和缓存是完全可定制的。

### Reselect 库的主要功能有哪些?

选择器可以计算派生数据，允许 Redux 存储最小可能状态。
选择器是有效的。除非其参数之一发生更改，否则不会重新计算选择器。
选择器是可组合的。它们可以用作其他选择器的输入。

### 举一个 Reselect 用法的例子?

让我们通过使用 Reselect 来简化计算不同数量的装运订单：

```js
import { createSelector } from 'reselect';

const shopItemsSelector = state => state.shop.items;
const taxPercentSelector = state => state.shop.taxPercent;

const subtotalSelector = createSelector(shopItemsSelector, items => items.reduce((acc, item) => acc + item.value, 0));

const taxSelector = createSelector(
  subtotalSelector,
  taxPercentSelector,
  (subtotal, taxPercent) => subtotal * (taxPercent / 100),
);

export const totalSelector = createSelector(subtotalSelector, taxSelector, (subtotal, tax) => ({
  total: subtotal + tax,
}));

let exampleState = {
  shop: {
    taxPercent: 8,
    items: [
      { name: 'apple', value: 1.2 },
      { name: 'orange', value: 0.95 },
    ],
  },
};

console.log(subtotalSelector(exampleState)); // 2.15
console.log(taxSelector(exampleState)); // 0.172
console.log(totalSelector(exampleState)); // { total: 2.322 }
```

### redux

> 本人从毕业就开始使用 react+redux 这一套框架，虽然已经使用一年多，但是这之前都没有阅读 redux 源码，希望这次的源码阅读与分析可以让我对 redux 理解更深刻

- 对于 redux 的工作流程不了解的同学可以看这篇[文章](https://github.com/LuoShengMen/StudyNotes/issues/250)

redux 的源码并不是很多，大致只分为下列几个文件：

![image](https://user-images.githubusercontent.com/21194931/56455394-54c2be00-6390-11e9-8545-b4faa7f39a43.png)

![image](https://user-images.githubusercontent.com/21194931/56455395-5db38f80-6390-11e9-8c45-7e8a2e9a7679.png)

index.js 是整个代码的入口，主要是判断代码在非生成环境是否压缩暴露出 createStore,combineReducers,bindActionCreators,applyMiddleware 等几个方法,如果没有这发出警告 ⚠️

```js
import createStore from './createStore';
import combineReducers from './combineReducers';
import bindActionCreators from './bindActionCreators';
import applyMiddleware from './applyMiddleware';
import compose from './compose';
import warning from './utils/warning';
import __DO_NOT_USE__ActionTypes from './utils/actionTypes';

/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning(
    'You are currently using minified code outside of NODE_ENV === "production". ' +
      'This means that you are running a slower development build of Redux. ' +
      'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' +
      'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' +
      'to ensure you have the correct code for your production build.',
  );
}

export { createStore, combineReducers, bindActionCreators, applyMiddleware, compose, __DO_NOT_USE__ActionTypes };
```

### ai-skills redux

- action 事件
- constant action 对象中的 type 在 constant 中统一声明
- reducer switch case 指定 action type 与事件对应关系
- saga 异步操作
- selector 配置选择性更新 state 计算

### 说一下 redux

- 使用 `react-redux` 中的`<Provider>`来绑定全局的一个 store;
- 使用 `react-redux` 中的`connect`来创建容器组件。

### redux 是在哪儿监听数据的？怎么监听的？

- 使用`redux-saga/effects`中的`takeLates`来监听最新的 action 以及`redux-saga`中的`createSagaMiddleware`来创建监听

### react, flux 和 redux 的关系？

简单来说：

Flux 本身是一套单向数据流的设计框架。
Redux 是其中的一种具体实现。
React 和 redux 总是一起出现，是因为如果单单使用 react，它仅仅是一个 view 的框架，不足以提供足够的前端管理和使用功能。而 redux 的引用就好像 react+MC 一样，赋予了 react 完整的生态系统。当然 redux 不是基于 mvc 的。简单说，redux+react 换了个更直接的法子实现了 MVC 能提供的数据管理功能。
