---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### Promise 含义

Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件更合理和更强大。

从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise 对象有以下两个特点。

1. 对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：Pending（进行中）、Fulfilled（已成功）和 Rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是 Promise 这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise 对象的状态改变，只有两种可能：从 Pending 变为 Fulfiled 和从 Pending 变为 Rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 Resolved（已定型）。如果改变已经发生了，你再对 Promise 对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

依照 Promise/A+ 的定义，Promise 有四种状态：

- pending: 初始状态, 进行中
- resolved: 已完成.
- rejected: 已失败.

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

- 轻微地增加了代码的复杂度（这点存在争议）。
- 在不支持 ES2015 的旧版浏览器中，需要引入 polyfill 才能使用。

1. 无法取消 Promise，一旦新建它就会立即执行，无法中途取消。
1. 如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。
1. 当处于 Pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

### API

#### Promise.all

Promise.all 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例:只有 p1、p2、p3 的状态都变成 fulfilled，p 的状态才会变成 fulfilled，此时 p1、p2、p3 的返回值组成一个数组，传递给 p 的回调函数。

```js
var p = Promise.all([p1, p2, p3]);
```

#### Promise.race()

Promise.race 方法同样是将多个 Promise 实例，包装城一个新的 Promise 实例: 上面代码中，只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。

```js
var p = Promise.race([p1, p2, p3]);
```

#### Promise.resolve()

有时需要将现有对象转为 Promise 对象，Promise.resolve 方法就起到这个作用。

```js
Promise.resolve('foo')等价于 new Promise(resolve => resolve('foo'))
```

#### Promise.reject()

Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为 rejected。

#### done()

Promise 对象的回调链，不管以 then 方法或 catch 方法结尾，要是最后一个方法抛出错误，都有可能无法捕捉到（因为 Promise 内部的错误不会冒泡到全局）。因此，我们可以提供一个 done 方法，总是处于回调链的尾端，保证抛出任何可能出现的错误。

#### finally()

finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。它与 done 方法的最大区别，它接受一个普通的回调函数作为参数，该函数不管怎样都必须执行。服务器使用 Promise 处理请求，然后使用 finally 方法关掉服务器。

```js
server.listen(0).then(function () {// run test}).finally(server.stop);
```

### Promise 构造函数是同步执行还是异步执行，那么 then 方法呢？

```js
console.log(1);
let promise = new Promise(function(resolve, reject) {
  console.log(3);
  resolve();
})
  .then(function() {
    console.log(4);
  })
  .then(function() {
    console.log(9);
  });
console.log(5);
1, 3, 5, 4, 9;
```

答案：Promise 构造函数是同步执行，then 方法是异步执行

扩展：

```js
console.log(1);
setTimeout(function() {
  console.log(2);
  let promise = new Promise(function(resolve, reject) {
    console.log(7);
    resolve();
  }).then(function() {
    console.log(8);
  });
}, 1000);
setTimeout(function() {
  console.log(10);
  let promise = new Promise(function(resolve, reject) {
    console.log(11);
    resolve();
  }).then(function() {
    console.log(12);
  });
}, 0);
let promise = new Promise(function(resolve, reject) {
  console.log(3);
  resolve();
})
  .then(function() {
    console.log(4);
  })
  .then(function() {
    console.log(9);
  });
console.log(5);
/// 1,3，5，4，9，10，11，12，2，7，8
```

思考：

```js
async function timeout(ms) {
  await new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}

asyncPrint('hello world', 50);
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start');
setTimeout(function() {
  console.log('setTimeout');
}, 0);
async1();
new Promise(function(resolve) {
  console.log('promise1');
  resolve();
}).then(function() {
  console.log('promise2');
});
console.log('script end');
// script start， async1 start，async2,promise1，script end， async1 end，promise2，setTime
```

### Promise 的构造函数

构造一个 `Promise`，最基本的用法如下：

```js
	var promise = new Promise(function(resolve, reject) {
	  if (...) {  // succeed
	    resolve(result);
	  } else {   // fails
	    reject(Error(errMessage));
	  }
	});
```

`Promise` 实例拥有 `then` 方法（具有 `then` 方法的对象，通常被称为 `thenable`）。它的使用方法如下：

```js
promise.then(onFulfilled, onRejected);
```

接收两个函数作为参数，一个在 `fulfilled` 的时候被调用，一个在 `rejected` 的时候被调用，接收参数就是 `future，onFulfilled` 对应 `resolve`, `onRejected` 对应 `reject`。

使用了 Promise 对象之后可以链式调用的方式组织代码

```js
new Promise(test).then(function (result) {
console.log('成功：' + result);
}).catch(function (reason) {
console.log('失败：' + reason);
});

Promise.all: 都成功才会返回

Promise.race: 有一个成功就返回

var p1 = new Promise(function (resolve) {
setTimeout(function () {
resolve("Hello");
}, 3000);
});

var p2 = new Promise(function (resolve) {
setTimeout(function () {
resolve("World");
}, 1000);
});

Promise.all([p1, p2]).then(function (result) {
console.log(result); // ["Hello", "World"]
});
```

有了 Promise 对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。

### 为什么能一直 then ？

> Promise 决议后的值仍然是 promise 对象。
> 如何将一个立即值封装为 promise 对象?
> var p1 = Promise.resolve(42);

### 你对 Promises 及其 polyfill 的掌握程度如何？

掌握它的工作原理。`Promise`是一个可能在未来某个时间产生结果的对象：操作成功的结果或失败的原因（例如发生网络错误）。 `Promise`可能处于以下三种状态之一：fulfilled、rejected 或 pending。 用户可以对`Promise`添加回调函数来处理操作成功的结果或失败的原因。

一些常见的 polyfill 是`$.deferred`、Q 和 Bluebird，但不是所有的 polyfill 都符合规范。ES2015 支持 Promises，现在通常不需要使用 polyfills。
