---
title: Promise
date: '2020-10-26'
draft: true
---

## JS 异步解决方案的发展历程以及优缺点。

### 1. 回调函数

**缺点：回调地狱，不能用 try catch 捕获错误，不能 return**

### 2. Promise

Promise 就是为了解决 callback 的问题而产生的。

Promise 实现了链式调用，也就是说每次 then 后返回的都是一个全新 Promise，如果我们在 then 中 return ，return 的结果会被 Promise.resolve() 包装

**优点：解决了回调地狱的问题**
**缺点：无法取消 Promise ，错误需要通过回调函数来捕获**

### 3. Generator

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

### 4. Async/await

async、await 是异步的终极解决方案

**优点是：代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题**

**缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低。**

```js
let a = 0;
let b = async () => {
  a = a + (await 10);
  console.log('2', a); // -> '2' 10
};
b();
a++;
console.log('1', a); // -> '1' 1
// '1' 1
// '2' 10
```

## Promise 概念

Promise 是 ES6 新增的语法，是异步编程的一种解决方案，解决了回调地狱的问题。

Promise 对象有以下两个特点。

1. 对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：Pending（进行中）、Fulfilled（已成功）和 Rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise 对象的状态改变，只有两种可能：从 Pending 变为 Fulfilled 和从 Pending 变为 Rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 Resolved（已定型）。如果改变已经发生了，你再对 Promise 对象添加回调函数，也会立即得到这个结果。

依照 Promise/A+ 的定义，Promise 有三种状态：

- pending: 初始状态, 进行中
- resolved: 已完成
- rejected: 已失败

执行 new 的时候状态就开始变化。promise 对象身上有两个方法：then()，和 catch()。

```js
new Promise((resolve, reject) => {
  console.log('promise 1');
  resolve(1);
});
// promise 1
// 说明 promise 构造函数是立即执行的。
```

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

`Promise` 对象的错误具有“冒泡”性质，**会一直向后传递，直到被捕获为止**。也就是说，错误总是会被下一个`catch`语句捕获

### "吃掉错误"机制

> `Promise`会吃掉内部的错误，并不影响外部代码的运行。所以需要`catch`，以防丢掉错误信息。

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

## promise 场景题

- 什么时候 promise 不会被销毁
- promise 如果没有 resolve 会怎么样？
- promise 什么情况会发生内存泄漏
- Promise 中 .then 的第二参数与 .catch 有什么区别?

## Promise

### async/await

async 是 ES2017 标准推出的用于处理异步操作的关键字，从本质上来说，它就是 Generator 函数的语法糖。

async 函数内阻塞，函数外不阻塞。

#### async 函数是什么，有什么作用？

`async`函数可以理解为内置自动执行器的`Generator`函数语法糖，它配合`ES6`的`Promise`近乎完美的实现了异步编程解决方案。

Async/Await 就是一个自执行的 generate 函数。利用 generate 函数的特性把异步的代码写成“同步”的形式。

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

**async 函数可以保留运行堆栈。**

### Generator

#### Generator 实现

Generator 是 ES6 中新增的语法，和 Promise 一样，都可以用来异步编程

```js
// 使用 * 表示这是一个 Generator 函数
// 内部可以通过 yield 暂停代码
// 通过调用 next 恢复执行
function* test() {
  let a = 1 + 2;
  yield 2;
  yield 3;
}
let b = test();
console.log(b.next()); // >  { value: 2, done: false }
console.log(b.next()); // >  { value: 3, done: false }
console.log(b.next()); // >  { value: undefined, done: true }
```

从以上代码可以发现，加上 `*` 的函数执行后拥有了 `next` 函数，也就是说函数执行后返回了一个对象。每次调用 `next` 函数可以继续执行被暂停的代码。以下是 Generator 函数的简单实现

```js
// cb 也就是编译过的 test 函数
function generator(cb) {
  return (function() {
    var object = {
      next: 0,
      stop: function() {},
    };

    return {
      next: function() {
        var ret = cb(object);
        if (ret === undefined) return { value: undefined, done: true };
        return {
          value: ret,
          done: false,
        };
      },
    };
  })();
}
// 如果你使用 babel 编译后可以发现 test 函数变成了这样
function test() {
  var a;
  return generator(function(_context) {
    while (1) {
      switch ((_context.prev = _context.next)) {
        // 可以发现通过 yield 将代码分割成几块
        // 每次执行 next 函数就执行一块代码
        // 并且表明下次需要执行哪块代码
        case 0:
          a = 1 + 2;
          _context.next = 4;
          return 2;
        case 4:
          _context.next = 6;
          return 3;
        // 执行完毕
        case 6:
        case 'end':
          return _context.stop();
      }
    }
  });
}
```

#### Generator 生成器

```js
function* foo(x) {
  let y = 2 * (yield x + 1);
  let z = yield y / 3;
  return x + y + z;
}
let it = foo(5);
console.log(it.next()); // => {value: 6, done: false}
console.log(it.next(12)); // => {value: 8, done: false}
console.log(it.next(13)); // => {value: 42, done: true}
```

- 首先 Generator 函数调用和普通函数不同，它会返回一个迭代器

- 当执行第一次 next 时，传参会被忽略，并且函数暂停在 yield (x + 1) 处，所以返回 5 + 1 = 6

- 当执行第二次 next 时，传入的参数等于上一个 yield 的返回值，如果你不传参，yield 永远返回 undefined。此时 let y = 2 _ 12，所以第二个 yield 等于 2 _ 12 / 3 = 8

- 当执行第三次 next 时，传入的参数会传递给 z，所以 z = 13, x = 5, y = 24，相加等于 42

#### 可迭代对象有什么特点

![](https://user-images.githubusercontent.com/21194931/59647925-b7c5ab00-91af-11e9-833a-6c0bfc53b09f.png)

```js
function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ? { value: array[nextIndex++], done: false } : { done: true };
    },
  };
}
// 使用 next 方法依次访问对象中的键值
var it = makeIterator(['step', 'by', 'step']);
console.log(it.next().value); // 'step'
console.log(it.next().value); // 'by'
console.log(it.next().value); // 'step'
console.log(it.next().value); // undefined
console.log(it.next().done); // true
```

#### JavaScript 中的迭代器（iterators）和迭代（iterables）是什么？ 你知道什么是内置迭代器吗？

迭代（Iteration ）是什么，它分为两个部分
Iterable：可迭代性是一种数据结构，它希望使其元素可以访问公共部分。它通过内置系统的一个方法，键为 Symbol.iterator。这个方法就是迭代器的工厂。Iterator：用于遍历数据结构的元素的指针

内置可迭代对象

1. 数组 Arrays

```js
console.log([][Symbol.iterator]);

for (let x of ['a', 'b']) console.log(x);
```

2. 字符串 Strings

```js
console.log(''[Symbol.iterator]);
for (let x of 'abc') console.log(x);
```

3. Map

```js
let map = new Map().set('a', 1).set('b', 2);
console.log(map[Symbol.iterator]);
for (let pair of map) {
  console.log(pair);
}
```

4. Set

```js
let set = new Set().add('a').add('b');
for (let x of set) {
  console.log(x);
}
```

5. arguments

```js
function printArgs() {
  for (let x of arguments) {
    console.log(x);
  }
}
printArgs('a', 'b');
```

6. Typed Arrays

7. Generators，后面讲这个的时候在介绍

然后我们在看看哪些操作符以及表达式中可以操作迭代器

1. 数组解构操作符

```js
let set = new Set()
  .add('a')
  .add('b')
  .add('c'); //Chrome浏览器不支持这段代码
let [x, y] = set;
let [first, ...rest] = set;
```

2. for-of 循环
3. Array.from，新添加的数组静态方法

```js
Array.from(new Map().set(false, 'no').set(true, 'yes'));
```

4. spread 操作符

```js
let arr = ['b', 'c'];
['a', ...arr, 'd'];
```

5. Map，Set 构造函数

```js
let map = new Map([
  ['uno', 'one'],
  ['dos', 'two'],
]);
let set = new Set(['red', 'green', 'blue']);
```

6. Promise.all，Promise.race 参数
7. yield\*

#### async/await 原理

虽然说 Generator 函数号称是解决异步回调问题，但却带来了一些麻烦，比如函数外部无法捕获异常，比如多个 yield 会导致调试困难。所以相较之下 Promise 是更优秀的异步解决方案。

async/await 做的事情就是将 Generator 函数转换成 Promise。

## Generator

Generator 函数是 ES6 提出的除 Promise 之外的另一种**异步解决方案**，不同于常见的异步回调，它的用法有些“奇怪”。这里我们只简单介绍一下它的主要用法。
