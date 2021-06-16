---
title: Promise
date: '2020-10-26'
draft: true
---

## 异步解决方案的发展历程

### 1. 回调函数

缺点：回调地狱，不能用 try catch 捕获错误，不能 return

### 2. Promise

Promise 是为了解决回调地狱的问题而产生的。

优点：解决了回调地狱的问题
缺点：无法取消 Promise ，错误需要通过回调函数来捕获

### 3. generator

**特点：可以控制函数的执行**，可以配合 co 函数库使用

```js
function* fetch() {
  yield ajax('XXX1', () => {});
  yield ajax('XXX2', () => {});
  yield ajax('XXX3', () => {});
}
let it = fetch();
let result1 = it.next();
let result2 = it.next();
let result3 = it.next();
```

### 4. async/await

async、await 是异步的终极解决方案

优点：代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题
缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低。

## Promise

Promise 有以下两个特点：

1. 对象的状态不受外界影响。
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。

Promise 构造函数是同步执行，then 方法是异步执行。

```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('Fulfilled.');
});

console.log('Hi!');
// Promise
// Hi!
// Fulfilled
```

优点：

- 避免可读性极差的回调地狱。
- 使用`.then()`编写的顺序异步代码，既简单又易读。
- 使用`Promise.all()`编写并行异步代码变得很容易。
- 代码结构更加扁平化，易读易理解，更加清晰明了。
- 可以更好的捕捉错误

缺点：

- 在不支持 ES6 的旧版浏览器中，需要引入 polyfill 才能使用。
- 无法取消 Promise，一旦新建它就会立即执行，无法中途取消。
- 如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。
- 当处于 Pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

### 错误冒泡

`Promise` 对象的错误具有“冒泡”性质，**会一直向后传递，直到被捕获为止**。也就是说，错误总是会被下一个`catch`语句捕获。`Promise`会吃掉内部的错误，并不影响外部代码的运行。所以需要`catch`，以防丢掉错误信息。

```js
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为 x 没有声明
    resolve(x + 2);
  });
};
someAsyncThing()
  .then(function() {
    return someOtherAsyncThing();
  })
  .catch(function(error) {
    console.error('oh no', error);
    // 下面一行会报错，因为y没有声明
    y + 2;
  })
  .catch(function(error) {
    console.error('carry on', error);
  });
// oh no [ReferenceError: x is not defined]
// carry on [ReferenceError: y is not defined]
```

### Promise 中 .then 的第二参数与 .catch 有什么区别?

Promise/A+ 规范，Promise 中的异常会被 then 的第二个参数作为参数传入。

主要区别就是，如果在 then 的第一个函数里抛出了异常，后面的 catch 能捕获到，而 then 的第二个函数捕获不到。then 的第二个参数和 catch 捕获错误信息的时候会就近原则，如果是 promise 内部报错，reject 抛出错误后，then 的第二个参数和 catch 方法都存在的情况下，只有 then 的第二个参数能捕获到，如果 then 的第二个参数不存在，则 catch 方法会捕获到。

### Promise.then 里抛出的错误能否被 try...catch 捕获，为什么。

因为 try catch 只能处理同步的错误，对异步错误没有办法捕获

### 什么时候 promise 不会被销毁?

类似问题：

- promise 如果没有 resolve 会怎么样？
- 什么情况会发生内存泄漏?

结论：

1. 当一个 Promise 没有被赋值给一个变量，同时没调用 resolve、reject，那么它就会被垃圾回收。
2. 如果每次都生成新的 new Promise 且 resolve 没有被调用，那么就直接被回收。
3. 如果每次都生成新的 new Promise 但是 resolve 有被调用，但是一直没被执行，这个时候 Promise 就不会被垃圾回收。
4. 如果使用同一个 new Promise ，且没有 resolve，那么也不会被垃圾回收。多次引用

### 破坏 promise 链

在一个 promise 链中，只要任何一个 promise 被 reject，promise 链就被破坏了，reject 之后的 promise 都不会再执行，而是直接调用 .catch 方法。这也是为什么在 standard practice 中，一定要在最后加上 .catch 的原因。通过 .catch 能够清楚的判断出 promise 链在哪个环节出了问题。

## async/await

async 是 ES2017 标准推出的用于处理异步操作的关键字，async/await 做的事情就是将 Generator 函数转换成 Promise。

**async 函数内阻塞，函数外不阻塞。async 函数可以保留运行堆栈。**

async 函数返回一个 Promise 对象，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。可以理解为，是让出了线程，跳出了 async 函数体。

```js
var a = 0;
var b = async () => {
  a = a + (await 10);
  console.log('2', a); // -> '2' 10
  a = (await 10) + a;
  console.log('3', a); // -> '3' 20
};
b();
a++;
console.log('1', a); // -> '1' 1
```

对于以上代码你可能会有疑惑，这里说明下原理

- 首先函数 `b` 先执行，在执行到 `await 10` 之前变量 `a` 还是 0，因为在 `await` 内部实现了 `generators` ，`generators` 会保留堆栈中东西，所以这时候 `a = 0` 被保存了下来
- 因为 `await` 是异步操作，遇到`await`就会立即返回一个`pending`状态的`Promise`对象，暂时返回执行代码的控制权，使得函数外的代码得以继续执行，所以会先执行 `console.log('1', a)`
- 这时候同步代码执行完毕，开始执行异步代码，将保存下来的值拿出来使用，这时候 `a = 10`
- 然后后面就是常规执行代码了
