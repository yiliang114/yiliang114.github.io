---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### Generator 实现

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

### Generator 生成器

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

### 生成器原理

当 yeild 产生一个值后，生成器的执行上下文就会从栈中弹出。但由于迭代器一直保持着队执行上下文的引用，上下文不会丢失，不会像普通函数一样执行完后上下文就被销毁

### 迭代器是什么？

TODO:

> 生成器返回的是迭代器。

### 可迭代对象有什么特点

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

### JavaScript 中的迭代器（iterators）和迭代（iterables）是什么？ 你知道什么是内置迭代器吗？

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

### Generator

遍历器对象生成函数，最大的特点是可以交出函数的执行权

- `function` 关键字与函数名之间有一个星号；
- 函数体内部使用 `yield`表达式，定义不同的内部状态；
- `next`指针移向下一个状态

这里你可以说说 `Generator`的异步编程，以及它的语法糖 `async` 和 `awiat`，传统的异步编程。`ES6` 之前，异步编程大致如下

- 回调函数
- 事件监听
- 发布/订阅

传统异步编程方案之一：协程，多个线程互相协作，完成异步任务。

### Generator 函数是什么，有什么作用？

- 如果说`JavaScript`是`ECMAScript`标准的一种具体实现、`Iterator`遍历器是`Iterator`的具体实现，那么`Generator`函数可以说是`Iterator`接口的具体实现方式。
- 执行`Generator`函数会返回一个遍历器对象，每一次`Generator`函数里面的`yield`都相当一次遍历器对象的`next()`方法，并且可以通过`next(value)`方法传入自定义的 value,来改变`Generator`函数的行为。
- `Generator`函数可以通过配合`Thunk` 函数更轻松更优雅的实现异步编程和控制流管理。

### Generator

你理解的 Generator 是什么？

`Generator` 算是 ES6 中难理解的概念之一了，`Generator` 最大的特点就是可以控制函数的执行。在这一小节中我们不会去讲什么是 `Generator`，而是把重点放在 `Generator` 的一些容易困惑的地方。

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

你也许会疑惑为什么会产生与你预想不同的值，接下来就让我为你逐行代码分析原因

- 首先 `Generator` 函数调用和普通函数不同，它会返回一个迭代器
- 当执行第一次 `next` 时，传参会被忽略，并且函数暂停在 `yield (x + 1)` 处，所以返回 `5 + 1 = 6`
- 当执行第二次 `next` 时，传入的参数等于上一个 `yield` 的返回值，如果你不传参，`yield` 永远返回 `undefined`。此时 `let y = 2 * 12`，所以第二个 `yield` 等于 `2 * 12 / 3 = 8`
- 当执行第三次 `next` 时，传入的参数会传递给 `z`，所以 `z = 13, x = 5, y = 24`，相加等于 `42`

`Generator` 函数一般见到的不多，其实也于他有点绕有关系，并且一般会配合 co 库去使用。当然，我们可以通过 `Generator` 函数解决回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：

```js
function* fetch() {
  yield ajax(url, () => {});
  yield ajax(url1, () => {});
  yield ajax(url2, () => {});
}
let it = fetch();
let result1 = it.next();
let result2 = it.next();
let result3 = it.next();
```

在 javascript 的世界中，所有代码都是单线程执行的。由于这个“缺陷”，导致 JavaScript 的所有网络操作，浏览器事件，都必须是异步执行。
最开始我们可以用回调函数来解决这个问题，

```js
function callBack() {
  console.log('回调');
}
setTimeout(callBack, 1000);
// 回调
```

但是随着业务的不断深入，难免会像陷入回调地狱这样的问题。直到后来我们有了 Promise 来解决这个问题。

```js
let p1 = new Promise(function(resolve, reject) {
  // ...
});
p1.then(
  function(data) {
    console.log(data);
  },
  function(err) {
    console.log(err);
  },
);
```

### 说下 generater 和 yield

### generater 的本质是什么，或者说下 generater 执行时操作系统中发生了什么
