---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

## redux-saga 介绍

redux-saga 是 redux 的中间件，中间件的作用是为 redux 提供额外的功能。

我们都知道 reducers 中的所有操作都是同步的并且是纯粹的，即 reducer 都是纯函数，**纯函数是指一个函数返回的结果只依赖于它的参数，并且在执行过程中不会对外部产生副作用**，即给它传什么，就吐出什么。但是在实际开发应用的过程中，我们希望做一些异步的（比如 AJAX 请求）且不纯粹的操作（比如改变外部状态），这些在函数式编程范式中被称为“副作用”。

Redux 的作者将这些副作用的处理通过中间件的方式让开发者自行选择进行实现。

**redux-saga 就是用来处理上述副作用（异步任务）的一个中间件。它是一个接收事件，并可能触发新事件的过程管理者，为应用管理复杂的流程。**

## redux-thunk

**redux-thunk 和 redux-saga 是 redux 应用中最常用的两种异步处理方式。**

## redux-saga

sagas 采用 Generator 函数来 `yield` Effects （包含指令的文本对象）。**Generator 函数的作用是可以暂停执行，再次执行的时候从上次暂停的地方继续执行。** Effect 是一个简单的对象，该对象包含了一些给中间件解释执行的额信息，可以通过使用`Effect API` 如 `fork` `call` take put cancel 等来创建 Effect [saga api](https://redux-saga-in-chinese.js.org/docs/api/index.html#takepattern)

- put 触发某个 action， 作用和 dispatch 相同
- take 等待 dispatch 匹配某个 action

### bindActionCreators

```
bindActionCreator 这个函数的主要作用就是返回一个函数，当我们调用返回的这个函数的时候，就会自动的dispatch对应的action
```

## 简述

redux-saga 就是用于管理副作用如异步获取数据，访问浏览器缓存的一个中间件。其中 reducer 负责处理 state 更新，sagas 负责协调异步操作，并提供一系列的 API（take,put,call 等）让副作用管理更容易，执行更高效，测试更简单。

## 源码分析

由于是 redux 的异步扩展，redux-saga 中广泛应用了 redux 中的很多函数，比如 applyMiddleware、dispatch、getState 等。如对 redux 不熟悉，建议看下[redux 源码分析](https://github.com/LuoShengMen/StudyNotes/issues/169),我们会通过[该例子](https://github.com/LuoShengMen/MyBlog-front/blob/master/src/store/index.js)来分析 redux-sgag 源码

### 内部执行逻辑

![image](https://user-images.githubusercontent.com/21194931/56470449-dbeb6100-6478-11e9-819e-41dfa39d2cb8.png)

### 入口文件

在 store/index.js 中通过 createSagaMiddleware 和 sagaMiddleware.run(rootSaga)引入 redux-saga 逻辑。sagaMiddleware.run 其实调用的是 runsage。

```js
// 这是redux-saga中间件的入口函数，是按照中间件的基本编写方式来写的
// context、options默认是空的，分析的时候可以忽略
function sagaMiddlewareFactory({ context = {}, ...options } = {}) {
  const { sagaMonitor, logger, onError, effectMiddlewares } = options;
  let boundRunSaga;

  // 下面就是中间件基本的编写方式
  // sagaMiddleware.run其实调用的是runsage
  function sagaMiddleware({ getState, dispatch }) {
    const channel = stdChannel();
    channel.put = (options.emitter || identity)(channel.put);
    // 为runSaga提供redux的函数以及subscribe
    boundRunSaga = runSaga.bind(null, {
      context,
      channel,
      dispatch,
      getState,
      sagaMonitor,
      logger,
      onError,
      effectMiddlewares,
    });

    return next => action => {
      if (sagaMonitor && sagaMonitor.actionDispatched) {
        sagaMonitor.actionDispatched(action);
      }
      const result = next(action);
      channel.put(action);
      return result;
    };
  }
  // 负责启动中间件的函数，下一小节讲述
  sagaMiddleware.run = (...args) => {
    return boundRunSaga(...args);
  };

  sagaMiddleware.setContext = props => {
    assignWithSymbols(context, props);
  };

  return sagaMiddleware;
}
```

### runSaga 函数

你传入的 saga 函数是一个 generator 函数。

```js
function runSaga(options, saga, ...args) {
  // saga就是传过来的saga函数
  const iterator = saga(...args);

  const {
    channel = stdChannel(),
    dispatch,
    getState,
    context = {},
    sagaMonitor,
    logger,
    effectMiddlewares,
    onError,
  } = options;

  const effectId = nextSagaId();
  // 日志
  const log = logger || _log;
  const logError = err => {
    log('error', err);
    if (err && err.sagaStack) {
      log('error', err.sagaStack);
    }
  };
  // 是否有effectMiddlewares
  const middleware = effectMiddlewares && compose(...effectMiddlewares);
  const finalizeRunEffect = runEffect => {
    if (is.func(middleware)) {
      return function finalRunEffect(effect, effectId, currCb) {
        const plainRunEffect = eff => runEffect(eff, effectId, currCb);
        return middleware(plainRunEffect)(effect);
      };
    } else {
      return runEffect;
    }
  };

  const env = {
    stdChannel: channel,
    dispatch: wrapSagaDispatch(dispatch),
    getState,
    sagaMonitor,
    logError,
    onError,
    finalizeRunEffect,
  };

  try {
    suspend();
    // 这一行是最终执行的
    const task = proc(env, iterator, context, effectId, getMetaInfo(saga), null);

    if (sagaMonitor) {
      sagaMonitor.effectResolved(effectId, task);
    }

    return task;
  } finally {
    flush();
  }
}
```

### oasp 函数

asap 是一个调度策略，存放了一个 quene，然后每次只允许一个任务执行

```js
const queue = [];
let semaphore = 0;

function exec(task) {
  try {
    suspend();
    task();
  } finally {
    release();
  }
}

export function asap(task) {
  queue.push(task);

  if (!semaphore) {
    suspend();
    flush();
  }
}

export function suspend() {
  semaphore++;
}

function release() {
  semaphore--;
}
// while循环，将队列中执行完成，直到为空
export function flush() {
  release();

  let task;
  while (!semaphore && (task = queue.shift()) !== undefined) {
    exec(task);
  }
}
```

### stdChannel 函数

stdChannel 函数运行时才去运行 multicastChannel，最终返回 multicastChannel 的运行结果，该结果为一个对象

```js
function stdChannel() {
  const chan = multicastChannel();
  const { put } = chan;
  chan.put = input => {
    // SAGA_ACTION :一个字符串，模版字符串 `@@redux-saga/${name}`
    if (input[SAGA_ACTION]) {
      put(input);
      return;
    }
    // asap是一个调度策略，存放了一个quene，然后每次只允许一个任务执行
    asap(() => {
      put(input);
    });
  };
  return chan;
}
```

上面函数中的 chan 是 multicastChannel 函数执行的结果,返回了一个对象，对象包含 put、take 方法

- take 方法：将回调函数存入 nextTakers
- put 方法：执行相应的回调函数

```js
function multicastChannel() {
  let closed = false;

  // 在状态管理中，经常碰到current和next的操作，为了保持一致性
  // 一个代表当前状态（�任务队列），
  // 一个代表下一个状态（任务队列），
  // 初始状态两个是一致的
  let currentTakers = [];
  let nextTakers = currentTakers;
  // 下面函数做的操作是，将当前的队列，复制给下一个队列
  const ensureCanMutateNextTakers = () => {
    if (nextTakers !== currentTakers) {
      return;
    }
    nextTakers = currentTakers.slice();
  };

  const close = () => {
    closed = true;
    const takers = (currentTakers = nextTakers);
    nextTakers = [];
    takers.forEach(taker => {
      // END是一个对象，END = { type: CHANNEL_END_TYPE }
      taker(END);
    });
  };

  return {
    [MULTICAST]: true,
    put(input) {
      if (closed) {
        return;
      }
      // isEND是一个函数，判断是不是已经结束了
      // isEnd = a => a && a.type === CHANNEL_END_TYPE
      if (isEnd(input)) {
        close();
        return;
      }

      const takers = (currentTakers = nextTakers);

      for (let i = 0, len = takers.length; i < len; i++) {
        const taker = takers[i];

        if (taker[MATCH](input)) {
          taker.cancel();
          taker(input);
        }
      }
    },
    take(cb, matcher = matchers.wildcard) {
      if (closed) {
        cb(END);
        return;
      }
      cb[MATCH] = matcher;
      ensureCanMutateNextTakers();
      nextTakers.push(cb);

      cb.cancel = once(() => {
        ensureCanMutateNextTakers();
        remove(nextTakers, cb);
      });
    },
    close,
  };
}
```
