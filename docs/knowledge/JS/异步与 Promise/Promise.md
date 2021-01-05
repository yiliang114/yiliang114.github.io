---
title: Promise
date: '2020-10-26'
draft: true
---

## Promise 概念

Promise 是 ES6 新增的语法，是异步编程的一种解决方案，解决了回调地狱的问题。比传统的解决方案--回调函数和事件更合理和更强大。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。

Promise 对象有以下两个特点。

1. 对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：Pending（进行中）、Fulfilled（已成功）和 Rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise 对象的状态改变，只有两种可能：从 Pending 变为 Fulfilled 和从 Pending 变为 Rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 Resolved（已定型）。如果改变已经发生了，你再对 Promise 对象添加回调函数，也会立即得到这个结果。

依照 Promise/A+ 的定义，Promise 有三种状态：

- pending: 初始状态, 进行中
- resolved: 已完成
- rejected: 已失败

执行 new 的时候状态就开始变化。promise 对象身上有两个方法：then()，和 catch()。

### 基本用法

Promise 对象是一个构造函数，用来生成 Promise 实例。下面代码创造了一个 Promise 实例。

```js
var promise = new Promise(function(resolve, reject) {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

resolve 函数的作用是，将 Promise 对象的状态从“未完成”变为“成功”（即从 Pending 变为 Resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；reject 函数的作用是，将 Promise 对象的状态从“未完成”变为“失败”（即从 Pending 变为 Rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise 实例生成以后，可以用 then 方法分别指定 Resolved 状态和 Rejected 状态的回调函数。

```js
promise.then(
  function(value) {
    // success
  },
  function(error) {
    // failure
  },
);
```

then 函数返回的也是一个 Promise 对象。所以可以一直 then 下去。

then 方法可以接受两个回调函数作为参数。第一个回调函数是 Promise 对象的状态变为 Resolved 时调用，第二个回调函数是 Promise 对象的状态变为 Rejected 时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受 Promise 对象传出的值作为参数。

Promise 新建后就会立即执行。

```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('Resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// Resolved
```

Promise 构造函数是同步执行，then 方法是异步执行。

上面代码中，Promise 新建后立即执行，所以首先输出的是 Promise。然后，then 方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以 Resolved 最后输出。

### Promise 优缺点

优点：

- 避免可读性极差的回调地狱。
- 使用`.then()`编写的顺序异步代码，既简单又易读。
- 使用`Promise.all()`编写并行异步代码变得很容易。
- 代码结构更加扁平化，易读易理解，更加清晰明了。
- 能解决回调地狱的问题
- 可以将数据请求和业务逻辑分离开来。
- 便于维护管理
- 可以更好的捕捉错误

缺点：

- 在不支持 ES2015 的旧版浏览器中，需要引入 polyfill 才能使用。
- 无法取消 Promise，一旦新建它就会立即执行，无法中途取消。
- 如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。
- 当处于 Pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

### API

#### then

**连续调用`then`**

因为`then`方法返回另一个`Promise`对象。当这个对象状态发生改变，就会分别调用`resolve`和`reject`

#### catch

等同于 `.then(null, rejection)`。另外，`then`方法指定的回调函数运行中的错误，也会被`catch`捕获。

#### all

用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。它接收一个具有`Iterator`接口的参数。其中，`item`如果不是`Promise`对象，会自动调用`Promise.resolve`方法。所有实例状态都变成 fulfilled，p 的状态才会变成 fulfilled，此时所以参数实例的返回值组成一个数组，传递给 p 的回调函数。

或者其中有一个变为`rejected`，才会调用`Promise.all`方法后面的回调函数。而对于每个`promise`对象，一旦它被自己定义`catch`方法捕获异常，那么状态就会更新为`resolved`而不是`rejected`。

```js
'use strict';
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
  .then(result => result)
  .catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('p2 error');
})
  .then(result => result)
  .catch(
    // 如果注释掉 catch，进入情况2
    // 否则，情况1
    e => e.message,
  );

Promise.all([p1, p2])
  .then(
    result => console.log(result), // 情况1
  )
  .catch(
    e => console.log('error in all'), // 情况2
  );

// p1, p2 的状态都是 fulfilled
```

#### race

和`all`方法类似，`Promise.race`方法同样是将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。而且只要有一个状态被改变，那么新的`Promise`状态会立即改变。只要所有参数实例之中有一个实例率先改变状态，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。

#### resolve

可将现有对象转为 Promise 对象，Promise.resolve 方法就起到这个作用。

#### reject

Promise.reject(reason) 方法也会返回一个新的 Promise 实例，该实例的状态为 rejected。

#### done

Promise 对象的回调链，不管以 then 方法或 catch 方法结尾，要是最后一个方法抛出错误，都有可能无法捕捉到（因为 Promise 内部的错误不会冒泡到全局）。因此，我们可以提供一个 done 方法，总是处于回调链的尾端，保证抛出任何可能出现的错误。

#### finally

finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。它与 done 方法的最大区别，它接受一个普通的回调函数作为参数，该函数不管怎样都必须执行。服务器使用 Promise 处理请求，然后使用 finally 方法关掉服务器。

### 错误冒泡

> `Promise` 对象的错误具有“冒泡”性质，**会一直向后传递，直到被捕获为止**。也就是说，错误总是会被下一个`catch`语句捕获

### "吃掉错误"机制

> `Promise`会吃掉内部的错误，并不影响外部代码的运行。所以需要`catch`，以防丢掉错误信息。

阮一峰大大给出的 demo：

```js
'use strict';

const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});

setTimeout(() => {
  console.log(123);
}, 2000);
```

还有如下 demo

```js
someAsyncThing()
  .then(function() {
    return someOtherAsyncThing();
  })
  .catch(function(error) {
    console.log('oh no', error);
    // 下面一行会报错，因为y没有声明
    y + 2;
  })
  .catch(function(error) {
    console.log('carry on', error);
  });
// oh no [ReferenceError: x is not defined]
// carry on [ReferenceError: y is not defined]
```

## 异步

- 什么时候 promise 不会被销毁
- promise 如果没有 resolve 会怎么样？
- promise 什么情况会发生内存泄漏
- Promise 中 .then 的第二参数与 .catch 有什么区别?
- Eventemitter 的 emit 是同步还是异步?
- 如何判断接口是否异步? 是否只要有回调函数就是异步?
- nextTick, setTimeout 以及 setImmediate 三者有什么区别?
- 如何实现一个 sleep 函数?
- 如何实现一个异步的 reduce? (注:不是异步完了之后同步 reduce)

### 用 promise 和 setTimeout 实现一个 delay 函数

```js
function delay(delayTime) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, delayTime);
  });
}
delay(1000).then(function() {
  console.log('0：执行成功！');
});

delay(2000)
  .then(function() {
    console.log('1：执行成功！');
    return delay(1000);
  })
  .then(function() {
    console.log('2：执行失败！');
  });
```
