---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### nextTick 原理分析

`nextTick` 可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM。

在 Vue 2.4 之前都是使用的 micro-task(微任务)，但是 micro-task(微任务) 的优先级过高，在某些情况下可能会出现比事件冒泡更快的情况，但如果都使用 macro-task(宏任务) 又可能会出现渲染的性能问题。所以在新版本中，会默认使用 micro-task(微任务)，但在特殊情况下会使用 macro-task(宏任务)，比如 v-on。

对于实现 macro-task(宏任务) ，会先判断是否能使用 `setImmediate` ，不能的话降级为 `MessageChannel` ，以上都不行的话就使用 `setTimeout`

```js
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else if (
  typeof MessageChannel !== 'undefined' &&
  (isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === '[object MessageChannelConstructor]')
) {
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = () => {
    port.postMessage(1);
  };
} else {
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}
```

`nextTick` 同时也支持 Promise 的使用，会判断是否实现了 Promise

```js
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  // 将回调函数整合进一个数组中
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (usemacro - task) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // 判断是否可以使用 Promise
  // 可以的话给 _resolve 赋值
  // 这样回调函数就能以 promise 的方式调用
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve;
    });
  }
}
```

### vue 的 nextTick

vue 的 nextTick 机制，以及 2.6 之后的 vue 做的更改是啥，为啥会导致一个 bug 。。。？？？？

1. 2.6 之前可以正常使用，查看 2.6 与 2.5 实现的差别。他这个变更有些破坏性，原本是 macro-task 的，改成了 micro-task. EventLoop 周期变了
2. 修改这个实现，只需要将这个 api 换成 setTimeout 0 来实现即可
