---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 10.异步笔试题

请写出下面代码的运行结果

```js
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
```

**注：本篇文章运行环境为当前最新版本的谷歌浏览器（72.0.3626.109）**

最近看到这样一道有关事件循环的前端面试题：

```js
//请写出输出内容
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

/*
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
*/
```

这道题主要考察的是事件循环中函数执行顺序的问题，其中包括`async` ，`await`，`setTimeout`，`Promise`函数。下面来说一下本题中涉及到的知识点。

#### 任务队列

首先我们需要明白以下几件事情：

- JS 分为同步任务和异步任务
- 同步任务都在主线程上执行，形成一个执行栈
- 主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放置一个事件。
- 一旦执行栈中的所有同步任务执行完毕（此时 JS 引擎空闲），系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行。

根据规范，事件循环是通过[任务队列](https://www.w3.org/TR/html5/webappapis.html#task-queues)的机制来进行协调的。一个 Event Loop 中，可以有一个或者多个任务队列(task queue)，一个任务队列便是一系列有序任务(task)的集合；**每个任务都有一个任务源(task source)，源自同一个任务源的 task 必须放到同一个任务队列，从不同源来的则被添加到不同队列。** setTimeout/Promise 等 API 便是任务源，而进入任务队列的是他们指定的具体执行任务。

[![任务队列](https://camo.githubusercontent.com/dd47eccb5d9f224f911f0a1cbdf3fb5c9f3fa24a/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643764383530353663372e706e67)](https://camo.githubusercontent.com/dd47eccb5d9f224f911f0a1cbdf3fb5c9f3fa24a/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643764383530353663372e706e67)

#### 宏任务

(macro)task（又称之为宏任务），可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）。

浏览器为了能够使得 JS 内部(macro)task 与 DOM 任务能够有序的执行，**会在一个(macro)task 执行结束后，在下一个(macro)task 执行开始前，对页面进行重新渲染**，流程如下：

```js
(macro)task->渲染->(macro)task->...
```

(macro)task 主要包含：script(整体代码)、setTimeout、setInterval、I/O、UI 交互事件、postMessage、MessageChannel、setImmediate(Node.js 环境)

#### 微任务

microtask（又称为微任务），**可以理解是在当前 task 执行结束后立即执行的任务**。也就是说，在当前 task 任务后，下一个 task 之前，在渲染之前。

所以它的响应速度相比 setTimeout（setTimeout 是 task）会更快，因为无需等渲染。也就是说，在某一个 macrotask 执行完后，就会将在它执行期间产生的所有 microtask 都执行完毕（在渲染前）。

microtask 主要包含：Promise.then、MutaionObserver、process.nextTick(Node.js 环境)

#### 运行机制

在事件循环中，每进行一次循环操作称为 tick，每一次 tick 的任务[处理模型](https://www.w3.org/TR/html5/webappapis.html#event-loops-processing-model)是比较复杂的，但关键步骤如下：

- 执行一个宏任务（栈中没有就从事件队列中获取）
- 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
- 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
- 当前宏任务执行完毕，开始检查渲染，然后 GUI 线程接管渲染
- 渲染完毕后，JS 线程继续接管，开始下一个宏任务（从事件队列中获取）

流程图如下：

[![mark](https://camo.githubusercontent.com/47479c8773d91e8eef4a359eca57bb1361183b9e/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643661353238626461662e6a7067)](https://camo.githubusercontent.com/47479c8773d91e8eef4a359eca57bb1361183b9e/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643661353238626461662e6a7067)

#### Promise 和 async 中的立即执行

我们知道 Promise 中的异步体现在`then`和`catch`中，所以写在 Promise 中的代码是被当做同步任务立即执行的。而在 async/await 中，在出现 await 出现之前，其中的代码也是立即执行的。那么出现了 await 时候发生了什么呢？

#### await 做了什么

从字面意思上看 await 就是等待，await 等待的是一个表达式，这个表达式的返回值可以是一个 promise 对象也可以是其他值。

很多人以为 await 会一直等待之后的表达式执行完之后才会继续执行后面的代码，**实际上 await 是一个让出线程的标志。await 后面的表达式会先执行一遍，将 await 后面的代码加入到 microtask 中，然后就会跳出整个 async 函数来执行后面的代码。**

这里感谢[@chenjigeng](https://github.com/chenjigeng)的纠正：

由于因为 async await 本身就是 promise+generator 的语法糖。所以 await 后面的代码是 microtask。所以对于本题中的

```js
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
```

等价于

```js
async function async1() {
  console.log('async1 start');
  Promise.resolve(async2()).then(() => {
    console.log('async1 end');
  });
}
```

#### 回到本题

以上就本道题涉及到的所有相关知识点了，下面我们再回到这道题来一步一步看看怎么回事儿。

1. 首先，事件循环从宏任务(macrotask)队列开始，这个时候，宏任务队列中，只有一个 script(整体代码)任务；当遇到任务源(task source)时，则会先分发任务到对应的任务队列中去。所以，上面例子的第一步执行如下图所示：

   [![img](https://camo.githubusercontent.com/15b3ae9733b0b5b6a144f519396ff88eaeca40fb/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432316166332e706e67)](https://camo.githubusercontent.com/15b3ae9733b0b5b6a144f519396ff88eaeca40fb/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432316166332e706e67)

2. 然后我们看到首先定义了两个 async 函数，接着往下看，然后遇到了 `console` 语句，直接输出 `script start`。输出之后，script 任务继续往下执行，遇到 `setTimeout`，其作为一个宏任务源，则会先将其任务分发到对应的队列中：

   [![img](https://camo.githubusercontent.com/0a6e6cd2cc52d18a0f97ec01659058e830305a45/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432353530612e706e67)](https://camo.githubusercontent.com/0a6e6cd2cc52d18a0f97ec01659058e830305a45/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432353530612e706e67)

3. script 任务继续往下执行，执行了 async1()函数，前面讲过 async 函数中在 await 之前的代码是立即执行的，所以会立即输出`async1 start`。

   遇到了 await 时，会将 await 后面的表达式执行一遍，所以就紧接着输出`async2`，然后将 await 后面的代码也就是`console.log('async1 end')`加入到 microtask 中的 Promise 队列中，接着跳出 async1 函数来执行后面的代码。

   [![img](https://camo.githubusercontent.com/93ec5469b0846f0f161641fc718005dbe994d190/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383333376165642e706e67)](https://camo.githubusercontent.com/93ec5469b0846f0f161641fc718005dbe994d190/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383333376165642e706e67)

4. script 任务继续往下执行，遇到 Promise 实例。由于 Promise 中的函数是立即执行的，而后续的 `.then` 则会被分发到 microtask 的 `Promise` 队列中去。所以会先输出 `promise1`，然后执行 `resolve`，将 `promise2` 分配到对应队列。

   [![img](https://camo.githubusercontent.com/6f617a237607ce7a71fabcab61d2952a8b412205/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383334376135652e706e67)](https://camo.githubusercontent.com/6f617a237607ce7a71fabcab61d2952a8b412205/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383334376135652e706e67)

5. script 任务继续往下执行，最后只有一句输出了 `script end`，至此，全局任务就执行完毕了。

   根据上述，每次执行完一个宏任务之后，会去检查是否存在 Microtasks；如果有，则执行 Microtasks 直至清空 Microtask Queue。

   因而在 script 任务执行完毕之后，开始查找清空微任务队列。此时，微任务中， `Promise` 队列有的两个任务`async1 end`和`promise2`，因此按先后顺序输出 `async1 end，promise2`。当所有的 Microtasks 执行完毕之后，表示第一轮的循环就结束了。

6. ~~第二轮循环开始，这个时候就会跳回 async1 函数中执行后面的代码，然后遇到了同步任务 `console` 语句，直接输出 `async1 end`。这样第二轮的循环就结束了。（也可以理解为被加入到 script 任务队列中，所以会先与 setTimeout 队列执行）~~

7. 第二轮循环依旧从宏任务队列开始。此时宏任务中只有一个 `setTimeout`，取出直接输出即可，至此整个流程结束。

下面我会改变一下代码来加深印象。

#### 变式一

在第一个变式中我将 async2 中的函数也变成了 Promise 函数，代码如下：

```js
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  //async2做出如下更改：
  new Promise(function(resolve) {
    console.log('promise1');
    resolve();
  }).then(function() {
    console.log('promise2');
  });
}
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);
async1();

new Promise(function(resolve) {
  console.log('promise3');
  resolve();
}).then(function() {
  console.log('promise4');
});

console.log('script end');
```

可以先自己看看输出顺序会是什么，下面来公布结果：

```js
script start
async1 start
promise1
promise3
script end
promise2
async1 end
promise4
setTimeout
```

在第一次 macrotask 执行完之后，也就是输出`script end`之后，会去清理所有 microtask。所以会相继输出`promise2`，`async1 end` ，`promise4`，其余不再多说。

#### 变式二

在第二个变式中，我将 async1 中 await 后面的代码和 async2 的代码都改为异步的，代码如下：

```js
async function async1() {
  console.log('async1 start');
  await async2();
  //更改如下：
  setTimeout(function() {
    console.log('setTimeout1');
  }, 0);
}
async function async2() {
  //更改如下：
  setTimeout(function() {
    console.log('setTimeout2');
  }, 0);
}
console.log('script start');

setTimeout(function() {
  console.log('setTimeout3');
}, 0);
async1();

new Promise(function(resolve) {
  console.log('promise1');
  resolve();
}).then(function() {
  console.log('promise2');
});
console.log('script end');
```

可以先自己看看输出顺序会是什么，下面来公布结果：

```js
script start
async1 start
promise1
script end
promise2
setTimeout3
setTimeout2
setTimeout1
```

在输出为`promise2`之后，接下来会按照加入 setTimeout 队列的顺序来依次输出，通过代码我们可以看到加入顺序为`3 2 1`，所以会按 3，2，1 的顺序来输出。

#### 变式三

变式三是我在一篇面经中看到的原题，整体来说大同小异，代码如下：

```js
async function a1() {
  console.log('a1 start');
  await a2();
  console.log('a1 end');
}
async function a2() {
  console.log('a2');
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('promise1');
});

a1();

let promise2 = new Promise(resolve => {
  resolve('promise2.then');
  console.log('promise2');
});

promise2.then(res => {
  console.log(res);
  Promise.resolve().then(() => {
    console.log('promise3');
  });
});
console.log('script end');
```

无非是在微任务那块儿做点文章，前面的内容如果你都看懂了的话这道题一定没问题的，结果如下：

```js
script start
a1 start
a2
promise2
script end
promise1
a1 end
promise2.then
promise3
setTimeout
```

### 11.算法手写题

已知如下数组：

> var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
>
> 编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

```js
Array.from(new Set(arr.flat(Infinity))).sort((a, b) => {
  return a - b;
});
```

### 12.JS 异步解决方案的发展历程以及优缺点。

JS 异步已经告一段落了，这里来一波小总结

#### 1. 回调函数（callback）

```
setTimeout(() => {
    // callback 函数体
}, 1000)
```

**缺点：回调地狱，不能用 try catch 捕获错误，不能 return**

回调地狱的根本问题在于：

- 缺乏顺序性： 回调地狱导致的调试困难，和大脑的思维方式不符
- 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身，即（**控制反转**）
- 嵌套函数过多的多话，很难处理错误

```js
ajax('XXX1', () => {
  // callback 函数体
  ajax('XXX2', () => {
    // callback 函数体
    ajax('XXX3', () => {
      // callback 函数体
    });
  });
});
```

**优点：解决了同步的问题**（只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。）

#### 2. Promise

Promise 就是为了解决 callback 的问题而产生的。

Promise 实现了链式调用，也就是说每次 then 后返回的都是一个全新 Promise，如果我们在 then 中 return ，return 的结果会被 Promise.resolve() 包装

**优点：解决了回调地狱的问题**

```js
ajax('XXX1')
  .then(res => {
    // 操作逻辑
    return ajax('XXX2');
  })
  .then(res => {
    // 操作逻辑
    return ajax('XXX3');
  })
  .then(res => {
    // 操作逻辑
  });
```

**缺点：无法取消 Promise ，错误需要通过回调函数来捕获**

#### 3. Generator

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

#### 4. Async/await

async、await 是异步的终极解决方案

**优点是：代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题**

**缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低。**

```js
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch('XXX1');
  await fetch('XXX2');
  await fetch('XXX3');
}
```

下面来看一个使用 `await` 的例子：

```js
let a = 0;
let b = async () => {
  a = a + (await 10);
  console.log('2', a); // -> '2' 10
};
b();
a++;
console.log('1', a); // -> '1' 1
```

对于以上代码你可能会有疑惑，让我来解释下原因

- 首先函数 `b` 先执行，在执行到 `await 10` 之前变量 `a` 还是 0，因为 `await` 内部实现了 `generator` ，**`generator` 会保留堆栈中东西，所以这时候 `a = 0` 被保存了下来**
- 因为 `await` 是异步操作，后来的表达式不返回 `Promise` 的话，就会包装成 `Promise.reslove(返回值)`，然后会去执行函数外的同步代码
- 同步代码执行完毕后开始执行异步代码，将保存下来的值拿出来使用，这时候 `a = 0 + 10`

上述解释中提到了 `await` 内部实现了 `generator`，其实 `await` 就是 `generator` 加上 `Promise`的语法糖，且内部实现了自动执行 `generator`。如果你熟悉 co 的话，其实自己就可以实现这样的语法糖。

### 13.Promise 构造函数是同步执行还是异步执行，那么 then 方法呢？

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
});

promise.then(() => {
  console.log(3);
});

console.log(4);
```

执行结果是：1243
promise 构造函数是同步执行的，then 方法是异步执行的

### 14.情人节福利题，如何实现一个 new

鉴于十三题可以说的东西很多，就先看了十四题，作为一个单身狗，new 的对象都是一个小狗啊

```js
// 实现一个new
var Dog = function(name) {
  this.name = name;
};
Dog.prototype.bark = function() {
  console.log('wangwang');
};
Dog.prototype.sayName = function() {
  console.log('my name is ' + this.name);
};
let sanmao = new Dog('三毛');
sanmao.sayName();
sanmao.bark();
// new 的作用
// 创建一个新对象obj
// 把obj的__proto__指向Dog.prototype 实现继承
// 执行构造函数，传递参数，改变this指向 Dog.call(obj, ...args)
// 最后把obj赋值给sanmao
var _new = function() {
  let constructor = Array.prototype.shift.call(arguments);
  let args = arguments;
  const obj = new Object();
  obj.__proto__ = constructor.prototype;
  constructor.call(obj, ...args);
  return obj;
};
var simao = _new(Dog, 'simao');
simao.bark();
simao.sayName();
console.log(simao instanceof Dog); // true
```

### 15.简单讲解一下 http2 的多路复用

HTTP2 采用二进制格式传输，取代了 HTTP1.x 的文本格式，二进制格式解析更高效。
多路复用代替了 HTTP1.x 的序列和阻塞机制，所有的相同域名请求都通过同一个 TCP 连接并发完成。在 HTTP1.x 中，并发多个请求需要多个 TCP 连接，浏览器为了控制资源会有 6-8 个 TCP 连接都限制。
HTTP2 中

- 同域名下所有通信都在单个连接上完成，消除了因多个 TCP 连接而带来的延时和内存消耗。
- 单个连接上可以并行交错的请求和响应，之间互不干扰

### 18.React 中 setState 什么时候是同步的，什么时候是异步的？

在 React 中，如果是由 React 引发的事件处理（比如通过 onClick 引发的事件处理），调用 setState 不会同步更新 this.state，除此之外的 setState 调用会同步执行 this.state。所谓“除此之外”，指的是绕过 React 通过 addEventListener 直接添加的事件处理函数，还有通过 setTimeout/setInterval 产生的异步调用。

**原因：**在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中回头再说，而 isBatchingUpdates 默认是 false，也就表示 setState 会同步更新 this.state，但是，有一个函数 batchedUpdates，这个函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会调用这个 batchedUpdates，造成的后果，就是由 React 控制的事件处理过程 setState 不会同步更新 this.state。

### 19.React setState 笔试题，下面的代码输出什么？

```js
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0,
    };
  }

  componentDidMount() {
    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val); // 第 1 次 log

    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val); // 第 2 次 log

    setTimeout(() => {
      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val); // 第 3 次 log

      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val); // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
}
```

1. 第一次和第二次都是在 react 自身生命周期内，触发时 isBatchingUpdates 为 true，所以并不会直接执行更新 state，而是加入了 dirtyComponents，所以打印时获取的都是更新前的状态 0。

2. 两次 setState 时，获取到 this.state.val 都是 0，所以执行时都是将 0 设置成 1，在 react 内部会被合并掉，只执行一次。设置完成后 state.val 值为 1。

3. setTimeout 中的代码，触发时 isBatchingUpdates 为 false，所以能够直接进行更新，所以连着输出 2，3。

输出： 0 0 2 3

### 20.介绍下 npm 模块安装机制，为什么输入 npm install 就可以自动安装对应的模块？

#### 1. npm 模块安装机制：

- 发出`npm install`命令
- 查询 node_modules 目录之中是否已经存在指定模块
  - 若存在，不再重新安装
  - 若不存在
    - npm 向 registry 查询模块压缩包的网址
    - 下载压缩包，存放在根目录下的`.npm`目录里
    - 解压压缩包到当前项目的`node_modules`目录

#### 2. npm 实现原理

输入 npm install 命令并敲下回车后，会经历如下几个阶段（以 npm 5.5.1 为例）：

1. **执行工程自身 preinstall**

当前 npm 工程如果定义了 preinstall 钩子此时会被执行。

1. **确定首层依赖模块**

首先需要做的是确定工程中的首层依赖，也就是 dependencies 和 devDependencies 属性中直接指定的模块（假设此时没有添加 npm install 参数）。

工程本身是整棵依赖树的根节点，每个首层依赖模块都是根节点下面的一棵子树，npm 会开启多进程从每个首层依赖模块开始逐步寻找更深层级的节点。

1. **获取模块**

获取模块是一个递归的过程，分为以下几步：

- 获取模块信息。在下载一个模块之前，首先要确定其版本，这是因为 package.json 中往往是 semantic version（semver，语义化版本）。此时如果版本描述文件（npm-shrinkwrap.json 或 package-lock.json）中有该模块信息直接拿即可，如果没有则从仓库获取。如 packaeg.json 中某个包的版本是 ^1.1.0，npm 就会去仓库中获取符合 1.x.x 形式的最新版本。
- 获取模块实体。上一步会获取到模块的压缩包地址（resolved 字段），npm 会用此地址检查本地缓存，缓存中有就直接拿，如果没有则从仓库下载。
- 查找该模块依赖，如果有依赖则回到第 1 步，如果没有则停止。

1. **模块扁平化（dedupe）**

上一步获取到的是一棵完整的依赖树，其中可能包含大量重复模块。比如 A 模块依赖于 loadsh，B 模块同样依赖于 lodash。在 npm3 以前会严格按照依赖树的结构进行安装，因此会造成模块冗余。

从 npm3 开始默认加入了一个 dedupe 的过程。它会遍历所有节点，逐个将模块放在根节点下面，也就是 node-modules 的第一层。当发现有**重复模块**时，则将其丢弃。

这里需要对**重复模块**进行一个定义，它指的是**模块名相同**且 **semver 兼容。\*\*每个 semver 都对应一段版本允许范围，如果两个模块的版本允许范围存在交集，那么就可以得到一个\*\*兼容**版本，而不必版本号完全一致，这可以使更多冗余模块在 dedupe 过程中被去掉。

比如 node-modules 下 foo 模块依赖 lodash@^1.0.0，bar 模块依赖 lodash@^1.1.0，则 **^1.1.0** 为兼容版本。

而当 foo 依赖 lodash@^2.0.0，bar 依赖 lodash@^1.1.0，则依据 semver 的规则，二者不存在兼容版本。会将一个版本放在 node_modules 中，另一个仍保留在依赖树里。

举个例子，假设一个依赖树原本是这样：

node_modules
-- foo
---- lodash@version1

-- bar
---- lodash@version2

假设 version1 和 version2 是兼容版本，则经过 dedupe 会成为下面的形式：

node_modules
-- foo

-- bar

-- lodash（保留的版本为兼容版本）

假设 version1 和 version2 为非兼容版本，则后面的版本保留在依赖树中：

node_modules
-- foo
-- lodash@version1

-- bar
---- lodash@version2

1. **安装模块**

这一步将会更新工程中的 node_modules，并执行模块中的生命周期函数（按照 preinstall、install、postinstall 的顺序）。

1. **执行工程自身生命周期**

当前 npm 工程如果定义了钩子此时会被执行（按照 install、postinstall、prepublish、prepare 的顺序）。

最后一步是生成或更新版本描述文件，npm install 过程完成。

### 21.有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣

Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()

#### 1. Object.prototype.toString.call()

每一个继承 Object 的对象都有 `toString` 方法，如果 `toString` 方法没有重写的话，会返回 `[Object type]`，其中 type 为对象的类型。但当除了 Object 类型的对象外，其他类型直接使用 `toString` 方法时，会直接返回都是内容的字符串，所以我们需要使用 call 或者 apply 方法来改变 toString 方法的执行上下文。

```js
const an = ['Hello', 'An'];
an.toString(); // "Hello,An"
Object.prototype.toString.call(an); // "[object Array]"
```

这种方法对于所有基本的数据类型都能进行判断，即使是 null 和 undefined 。

```js
Object.prototype.toString.call('An'); // "[object String]"
Object.prototype.toString.call(1); // "[object Number]"
Object.prototype.toString.call(Symbol(1)); // "[object Symbol]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(function() {}); // "[object Function]"
Object.prototype.toString.call({ name: 'An' }); // "[object Object]"
```

`Object.prototype.toString.call()` 常用于判断浏览器内置对象时。

更多实现可见 [谈谈 Object.prototype.toString](https://juejin.im/post/591647550ce4630069df1c4a)

#### 2. instanceof

`instanceof` 的内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`。

使用 `instanceof`判断一个对象是否为数组，`instanceof` 会判断这个对象的原型链上是否会找到对应的 `Array` 的原型，找到返回 `true`，否则返回 `false`。

```js
[] instanceof Array; // true
```

但 `instanceof` 只能用来判断对象类型，原始类型不可以。并且所有对象类型 instanceof Object 都是 true。

```js
[] instanceof Object; // true
```

#### 3. Array.isArray()

- 功能：用来判断对象是否为数组

- instanceof 与 isArray

  当检测 Array 实例时，`Array.isArray` 优于 `instanceof` ，因为 `Array.isArray` 可以检测出 `iframes`

  ```js
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  xArray = window.frames[window.frames.length - 1].Array;
  var arr = new xArray(1, 2, 3); // [1,2,3]

  // Correctly checking for Array
  Array.isArray(arr); // true
  Object.prototype.toString.call(arr); // true
  // Considered harmful, because doesn't work though iframes
  arr instanceof Array; // false
  ```

- `Array.isArray()` 与 `Object.prototype.toString.call()`

  `Array.isArray()`是 ES5 新增的方法，当不存在 `Array.isArray()` ，可以用 `Object.prototype.toString.call()` 实现。

  ```js
  if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }
  ```

### 22.介绍下重绘和回流（Repaint & Reflow），以及如何进行优化

#### 1. 浏览器渲染机制

- 浏览器采用流式布局模型（`Flow Based Layout`）
- 浏览器会把`HTML`解析成`DOM`，把`CSS`解析成`CSSOM`，`DOM`和`CSSOM`合并就产生了渲染树（`Render Tree`）。
- 有了`RenderTree`，我们就知道了所有节点的样式，然后计算他们在页面上的大小和位置，最后把节点绘制到页面上。
- 由于浏览器使用流式布局，对`Render Tree`的计算通常只需要遍历一次就可以完成，**但`table`及其内部元素除外，他们可能需要多次计算，通常要花 3 倍于同等元素的时间，这也是为什么要避免使用`table`布局的原因之一**。

#### 2. 重绘

由于节点的几何属性发生改变或者由于样式发生改变而不会影响布局的，称为重绘，例如`outline`, `visibility`, `color`、`background-color`等，重绘的代价是高昂的，因为浏览器必须验证 DOM 树上其他节点元素的可见性。

#### 3. 回流

回流是布局或者几何属性需要改变就称为回流。回流是影响浏览器性能的关键因素，因为其变化涉及到部分页面（或是整个页面）的布局更新。一个元素的回流可能会导致了其所有子元素以及 DOM 中紧随其后的节点、祖先节点元素的随后的回流。

```js
<body>
  <div class="error">
    <h4>我的组件</h4>
    <p>
      <strong>错误：</strong>错误的描述…
    </p>
    <h5>错误纠正</h5>
    <ol>
      <li>第一步</li>
      <li>第二步</li>
    </ol>
  </div>
</body>
```

在上面的 HTML 片段中，对该段落(`` 标签)回流将会引发强烈的回流，因为它是一个子节点。这也导致了祖先的回流（`div.error`和`body` – 视浏览器而定）。此外， ``和``也会有简单的回流，因为其在 DOM 中在回流元素之后。**大部分的回流将导致页面的重新渲染。**

**回流必定会发生重绘，重绘不一定会引发回流。**

#### 4. 浏览器优化

现代浏览器大多都是通过队列机制来批量更新布局，浏览器会把修改操作放在队列中，至少一个浏览器刷新（即 16.6ms）才会清空队列，但当你**获取布局信息的时候，队列中可能有会影响这些属性或方法返回值的操作，即使没有，浏览器也会强制清空队列，触发回流与重绘来确保返回正确的值**。

主要包括以下属性或方法：

- `offsetTop`、`offsetLeft`、`offsetWidth`、`offsetHeight`
- `scrollTop`、`scrollLeft`、`scrollWidth`、`scrollHeight`
- `clientTop`、`clientLeft`、`clientWidth`、`clientHeight`
- `width`、`height`
- `getComputedStyle()`
- `getBoundingClientRect()`

所以，我们应该避免频繁的使用上述的属性，他们都会强制渲染刷新队列。

#### 5. 减少重绘与回流

1. CSS

   - **使用 `transform` 替代 `top`**

   - **使用 `visibility` 替换 `display: none`** ，因为前者只会引起重绘，后者会引发回流（改变了布局

   - **避免使用`table`布局**，可能很小的一个小改动会造成整个 `table` 的重新布局。

   - **尽可能在`DOM`树的最末端改变`class`**，回流是不可避免的，但可以减少其影响。尽可能在 DOM 树的最末端改变 class，可以限制了回流的范围，使其影响尽可能少的节点。

   - **避免设置多层内联样式**，CSS 选择符**从右往左**匹配查找，避免节点层级过多。

     ```js
     <div>
       <a> <span></span> </a>
     </div>
     <style>
       span {
         color: red;
       }
       div > a > span {
         color: red;
       }
     </style>
     ```

     对于第一种设置样式的方式来说，浏览器只需要找到页面中所有的 `span` 标签然后设置颜色，但是对于第二种设置样式的方式来说，浏览器首先需要找到所有的 `span` 标签，然后找到 `span` 标签上的 `a` 标签，最后再去找到 `div` 标签，然后给符合这种条件的 `span` 标签设置颜色，这样的递归过程就很复杂。所以我们应该尽可能的避免写**过于具体**的 CSS 选择器，然后对于 HTML 来说也尽量少的添加无意义标签，保证**层级扁平**。

   - **将动画效果应用到`position`属性为`absolute`或`fixed`的元素上**，避免影响其他元素的布局，这样只是一个重绘，而不是回流，同时，控制动画速度可以选择 `requestAnimationFrame`，详见[探讨 requestAnimationFrame](https://github.com/LuNaHaiJiao/blog/issues/30)。

   - **避免使用`CSS`表达式**，可能会引发回流。

   - **将频繁重绘或者回流的节点设置为图层**，图层能够阻止该节点的渲染行为影响别的节点，例如`will-change`、`video`、`iframe`等标签，浏览器会自动将该节点变为图层。

   - **CSS3 硬件加速（GPU 加速）**，使用 css3 硬件加速，可以让`transform`、`opacity`、`filters`这些动画不会引起回流重绘 。但是对于动画的其它属性，比如`background-color`这些，还是会引起回流重绘的，不过它还是可以提升这些动画的性能。

2. JavaScript

   - **避免频繁操作样式**，最好一次性重写`style`属性，或者将样式列表定义为`class`并一次性更改`class`属性。
   - **避免频繁操作`DOM`**，创建一个`documentFragment`，在它上面应用所有`DOM操作`，最后再把它添加到文档中。
   - **避免频繁读取会引发回流/重绘的属性**，如果确实需要多次使用，就用一个变量缓存起来。
   - **对具有复杂动画的元素使用绝对定位**，使它脱离文档流，否则会引起父元素及后续元素频繁回流。

### 23.介绍下观察者模式和订阅-发布模式的区别，各自适用于什么场景

发布-订阅模式就好像报社， 邮局和个人的关系，报纸的订阅和分发是由邮局来完成的。报社只负责将报纸发送给邮局。
观察者模式就好像 个体奶农和个人的关系。奶农负责统计有多少人订了产品，所以个人都会有一个相同拿牛奶的方法。奶农有新奶了就负责调用这个方法。

### 24.聊聊 Redux 和 Vuex 的设计思想

https://zhuanlan.zhihu.com/p/53599723

### 25.说说浏览器和 Node 事件循环的区别

其中一个主要的区别在于浏览器的 event loop 和 nodejs 的 event loop 在处理异步事件的顺序是不同的,nodejs 中有 micro event;其中 Promise 属于 micro event 该异步事件的处理顺序就和浏览器不同.nodejs V11.0 以上 这两者之间的顺序就相同了.

为楼上补充一个例子

原文出自[liubasara 的个人博客](https://blog.liubasara.info/#/post/分享node与浏览器关于eventLoop的异同的一个小例子)

```js
function test() {
  console.log('start');
  setTimeout(() => {
    console.log('children2');
    Promise.resolve().then(() => {
      console.log('children2-1');
    });
  }, 0);
  setTimeout(() => {
    console.log('children3');
    Promise.resolve().then(() => {
      console.log('children3-1');
    });
  }, 0);
  Promise.resolve().then(() => {
    console.log('children1');
  });
  console.log('end');
}

test();

// 以上代码在node11以下版本的执行结果(先执行所有的宏任务，再执行微任务)
// start
// end
// children1
// children2
// children3
// children2-1
// children3-1

// 以上代码在node11及浏览器的执行结果(顺序执行宏任务和微任务)
// start
// end
// children1
// children2
// children2-1
// children3
// children3-1
```

### 26.介绍模块化发展历程

可从 IIFE、AMD、CMD、CommonJS、UMD、webpack(require.ensure)、ES Module、`<script type="module">` 这几个角度考虑。

模块化主要是用来抽离公共代码，隔离作用域，避免变量冲突等。

**IIFE**： 使用自执行函数来编写模块化，特点：**在一个单独的函数作用域中执行代码，避免变量冲突**。

```js
(function() {
  return {
    data: [],
  };
})();
```

**AMD**： 使用 requireJS 来编写模块化，特点：**依赖必须提前声明好**。

```js
define('./index.js', function(code) {
  // code 就是index.js 返回的内容
});
```

**CMD**： 使用 seaJS 来编写模块化，特点：**支持动态引入依赖文件**。

```js
define(function(require, exports, module) {
  var indexCode = require('./index.js');
});
```

**CommonJS**： nodejs 中自带的模块化。

```js
var fs = require('fs');
```

**UMD**：兼容 AMD，CommonJS 模块化语法。

**webpack(require.ensure)**：webpack 2.x 版本中的代码分割。

**ES Modules**： ES6 引入的模块化，支持 import 来引入另一个 js 。

```js
import a from 'a';
```

### 27.全局作用域中，用 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取？。

在 ES5 中，顶层对象的属性和全局变量是等价的，var 命令和 function 命令声明的全局变量，自然也是顶层对象。

```js
var a = 12;
function f() {}

console.log(window.a); // 12
console.log(window.f); // f(){}
```

但 ES6 规定，var 命令和 function 命令声明的全局变量，依旧是顶层对象的属性，但 let 命令、const 命令、class 命令声明的全局变量，不属于顶层对象的属性。

```js
let aa = 1;
const bb = 2;

console.log(window.aa); // undefined
console.log(window.bb); // undefined
```

在哪里？怎么获取？通过在设置断点，看看浏览器是怎么处理的：

![letandconst](https://user-images.githubusercontent.com/20290821/53854366-2ec1a400-4004-11e9-8c62-5a1dd91b8a5b.png)

通过上图也可以看到，在全局作用域中，用 let 和 const 声明的全局变量并没有在全局对象中，只是一个块级作用域（Script）中

怎么获取？在定义变量的块级作用域中就能获取啊，既然不属于顶层对象，那就不加 window（global）呗。

```js
let aa = 1;
const bb = 2;

console.log(aa); // 1
console.log(bb); // 2
```

### 28.cookie 和 token 都存放在 header 中，为什么不会劫持 token？

1、首先 token 不是防止 XSS 的，而是为了防止 CSRF 的；
2、CSRF 攻击的原因是浏览器会自动带上 cookie，而浏览器不会自动带上 token

### 写 React / Vue 项目时为什么要在列表组件中写 key，其作用是什么？

#### key 的作用是什么？

我重新梳理了一下文字，可能这样子会更好理解一些。

key 是给每一个 vnode 的唯一 id,可以`依靠key`,更`准确`, 更`快`的拿到 oldVnode 中对应的 vnode 节点。

##### 1. 更准确

因为带 key 就不是`就地复用`了，在 sameNode 函数 `a.key === b.key`对比中可以避免就地复用的情况。所以会更加准确。

##### 2. 更快

利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快。(这个观点，就是我最初的那个观点。从这个角度看，map 会比遍历更快。)

#### 完整

能提高 diff 效率其实是不准确的。

见[vue/patch.js](https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js#L424)，在不带 key 的情况下，判断[sameVnode](https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js#L35)时因为 a.key 和 b.key 都是 undefined，**对于列表渲染**来说已经可以判断为相同节点然后调用 patchVnode 了，实际根本不会进入到答主给的 else 代码，也就无从谈起“带 key 比不带 key 时 diff 算法更高效”了。

然后，官网推荐推荐的使用 key，应该理解为“使用唯一 id 作为 key”。因为 index 作为 key，和不带 key 的效果是一样的。index 作为 key 时，每个列表项的 index 在变更前后也是一样的，都是直接判断为 sameVnode 然后复用。

说到底，key 的作用就是更新组件时**判断两个节点是否相同**。相同就复用，不相同就删除旧的创建新的。

正是因为带唯一 key 时每次更新都不能找到可复用的节点，不但要销毁和创建 vnode，在 DOM 里添加移除节点对性能的影响更大。所以会才说“不带 key 可能性能更好”。看下面这个实验，渲染 10w 列表项，带唯一 key 与不带 key 的时间对比：

不使用 key 的情况：

```
<li v-for="item in list">{{ item.text }}</li>
```

[![image](https://user-images.githubusercontent.com/23716085/53108518-22543a80-3572-11e9-83b2-16b4aab7cdb9.png)](https://user-images.githubusercontent.com/23716085/53108518-22543a80-3572-11e9-83b2-16b4aab7cdb9.png)

使用 id 作为 key 的情况：

```
<li v-for="item in list" :key="item.id">{{ n.text }}</li>
```

[![image](https://user-images.githubusercontent.com/23716085/53108768-88d95880-3572-11e9-9f29-0082bf89eb3a.png)](https://user-images.githubusercontent.com/23716085/53108768-88d95880-3572-11e9-9f29-0082bf89eb3a.png)

list 构造：

```
  const list1 = []
  const list2 = []
  for (let i = 0; i <= 100000; i++) {
    list1.push({
      id: i,
      text: i
    })
    list2.push({
      id: i * 2,
      name: 100000 - i
    })
  }
```

因为不带 key 时节点能够复用，省去了销毁/创建组件的开销，同时只需要修改 DOM 文本内容而不是移除/添加节点，这就是文档中所说的“刻意依赖默认行为以获取性能上的提升”。

既然如此，为什么还要建议带 key 呢？因为这种模式只适用于渲染简单的无状态组件。对于大多数场景来说，列表组件都有自己的状态。

举个例子：一个新闻列表，可点击列表项来将其标记为"已访问"，可通过 tab 切换“娱乐新闻”或是“社会新闻”。

不带 key 属性的情况下，在“娱乐新闻”下选中第二项然后切换到“社会新闻”，"社会新闻"里的第二项也会是被选中的状态，因为这里复用了组件，保留了之前的状态。要解决这个问题，可以为列表项带上新闻 id 作为唯一 key，那么每次渲染列表时都会完全替换所有组件，使其拥有正确状态。

这只是个简单的例子，实际应用会更复杂。带上唯一 key 虽然会增加开销，但是对于用户来说基本感受不到差距，而且能保证组件状态正确，这应该就是为什么推荐使用唯一 id 作为 key 的原因。至于具体怎么使用，就要根据实际情况来选择了。

以上个人见解，如有误望指正。

### 29.聊聊 Vue 的双向数据绑定，Model 如何改变 View，View 又是如何改变 Model 的

VM 主要做了两件微小的事情：

- **从 M 到 V 的映射（Data Binding）**，这样可以大量节省你人肉来 update View 的代码
- **从 V 到 M 的事件监听（DOM Listeners）**，这样你的 Model 会随着 View 触发事件而改变

**1、M 到 V 实现**

做到这件事的第一步是形成类似于：

```js
// template
var tpl = '<p>{{ text }}</p>';
// data
var data = {
  text: 'This is some text',
};
// magic process
template(tpl, data); // '<p>This is some text</p>'
```

中间的 magic process 是模板引擎所做的事情，已经有非常多种模板引擎可供选择

- [JavaScript templates](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en/docs/JavaScript_templates)

当然你比较喜欢造轮子的话也可以自己实现一个

- [JavaScript template engine in just 20 lines](https://link.zhihu.com/?target=http%3A//krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line)
- [一个 JavaScript 模板引擎的实现](https://link.zhihu.com/?target=http%3A//kyleslight.net/article/27)

无论是 Angular 的 \$scope，React 的 state 还是 Vue 的 data 都提供了一个较为核心的 model 对象用来保存模型的状态；它们的模板引擎稍有差别，不过大体思路相似；拿到渲染后的 string 接下来做什么不言而喻了（中间还有很多处理，例如利用 model 的 diff 来最小量更新 view ）。

但是仅仅是这样并不够，我们需要知道什么时候来更新 view（ 即 render ），一般来说主要的 VM 做了以下几种选择：

- VM 实例初始化时
- model 动态修改时

其中初始化拿到 model 对象然后 render 没什么好讲的；model 被修改的时候如何监听属性的改变是一个问题，目前有以下几种思路：

- 借助于 Object 的 observe 方法
- 自己在 set，以及数组的常用操作里触发 change 事件
- 手动 setState()，然后在里面触发 change 事件

知道了触发 render 的时机以及如何 render，一个简单的 M 到 V 映射就实现了。

**2、V 到 M 实现**

从 V 到 M 主要由两类（ 虽然本质上都是监听 DOM ）构成，一类是用户自定义的 listener， 一类是 VM 自动处理的含有 value 属性元素的 listener

第一类类似于你在 Vue 里用 v-on 时绑定的那样，VM 在实例化得时候可以将所有用户自定义的 listener 一次性代理到根元素上，这些 listener 可以访问到你的 model 对象，这样你就可以在 listener 中改变 model

第二类类似于对含有 v-model 与 value 元素的自动处理，我们期望的是例如在一个输入框内

```js
<input type="text" v-model="message" />
```

输入值，那么我与之对应的 model 属性 message 也会随之改变，相当于 VM 做了一个默认的 listener，它会监听这些元素的改变然后自动改变 model，具体如何实现相信你也明白了

### 30.两个数组合并成一个数组

请把两个数组 ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] 和 ['A', 'B', 'C', 'D']，合并为 ['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2', 'D']。

```js
function concatArr(arr1, arr2) {
  const arr = [...arr1];
  let currIndex = 0;
  for (let i = 0; i < arr2.length; i++) {
    const RE = new RegExp(arr2[i]);
    while (currIndex < arr.length) {
      ++currIndex;
      if (!RE.test(arr[currIndex])) {
        arr.splice(currIndex, 0, a2[i]);
        break;
      }
    }
  }
  return arr;
}
var a1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
var a2 = ['A', 'B', 'C', 'D'];
const arr = concatArr(a1, a2);
console.log(a1); // ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
console.log(a2); // ['A', 'B', 'C', 'D']
console.log(arr); // ['A1', 'A2', 'A', B1', 'B2', 'B', C1', 'C2', 'C', D1', 'D2', 'D']
```

### 31.改造下面的代码，使之输出 0 - 9，写出你能想到的所有解法。

```js
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

```js
for (var i = 0; i < 10; i++) {
  setTimeout(
    i => {
      console.log(i);
    },
    1000,
    i,
  );
}
```

### 32.Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法。

#### 1. 原生 DOM 操作 vs. 通过框架封装操作。

这是一个性能 vs. 可维护性的取舍。框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快，因为框架的 DOM 操作层需要应对任何上层 API 可能产生的操作，它的实现必须是普适的。针对任何一个 benchmark，我都可以写出比任何框架更快的手动优化，但是那有什么意义呢？在构建一个实际应用的时候，你难道为每一个地方都去做手动优化吗？出于可维护性的考虑，这显然不可能。框架给你的保证是，你在不需要手动优化的情况下，我依然可以给你提供过得去的性能。

#### 2. 对 React 的 Virtual DOM 的误解。

React 从来没有说过 “React 比原生操作 DOM 快”。React 的基本思维模式是每次有变动就整个重新渲染整个应用。如果没有 Virtual DOM，简单来想就是直接重置 innerHTML。很多人都没有意识到，在一个大型列表所有数据都变了的情况下，重置 innerHTML 其实是一个还算合理的操作... 真正的问题是在 “全部重新渲染” 的思维模式下，即使只有一行数据变了，它也需要重置整个 innerHTML，这时候显然就有大量的浪费。

我们可以比较一下 innerHTML vs. Virtual DOM 的重绘性能消耗：

- innerHTML: render html string O(template size) + 重新创建所有 DOM 元素 O(DOM size)
- Virtual DOM: render Virtual DOM + diff O(template size) + 必要的 DOM 更新 O(DOM change)

Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是！它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。可以看到，innerHTML 的总计算量不管是 js 计算还是 DOM 操作都是和整个界面的大小相关，但 Virtual DOM 的计算量里面，只有 js 计算和界面大小相关，DOM 操作是和数据的变动量相关的。前面说了，和 DOM 操作比起来，js 计算是极其便宜的。这才是为什么要有 Virtual DOM：它保证了 1）不管你的数据变化多少，每次重绘的性能都可以接受；2) 你依然可以用类似 innerHTML 的思路去写你的应用。

#### 3. MVVM vs. Virtual DOM

相比起 React，其他 MVVM 系框架比如 Angular, Knockout 以及 Vue、Avalon 采用的都是数据绑定：通过 Directive/Binding 对象，观察数据变化并保留对实际 DOM 元素的引用，当有数据变化时进行对应的操作。MVVM 的变化检查是数据层面的，而 React 的检查是 DOM 结构层面的。MVVM 的性能也根据变动检测的实现原理有所不同：Angular 的脏检查使得任何变动都有固定的
O(watcher count) 的代价；Knockout/Vue/Avalon 都采用了依赖收集，在 js 和 DOM 层面都是 O(change)：

- 脏检查：scope digest O(watcher count) + 必要 DOM 更新 O(DOM change)
- 依赖收集：重新收集依赖 O(data change) + 必要 DOM 更新 O(DOM change)可以看到，Angular 最不效率的地方在于任何小变动都有的和 watcher 数量相关的性能代价。但是！当所有数据都变了的时候，Angular 其实并不吃亏。依赖收集在初始化和数据变化的时候都需要重新收集依赖，这个代价在小量更新的时候几乎可以忽略，但在数据量庞大的时候也会产生一定的消耗。

MVVM 渲染列表的时候，由于每一行都有自己的数据作用域，所以通常都是每一行有一个对应的 ViewModel 实例，或者是一个稍微轻量一些的利用原型继承的 "scope" 对象，但也有一定的代价。所以，MVVM 列表渲染的初始化几乎一定比 React 慢，因为创建 ViewModel / scope 实例比起 Virtual DOM 来说要昂贵很多。这里所有 MVVM 实现的一个共同问题就是在列表渲染的数据源变动时，尤其是当数据是全新的对象时，如何有效地复用已经创建的 ViewModel 实例和 DOM 元素。假如没有任何复用方面的优化，由于数据是 “全新” 的，MVVM 实际上需要销毁之前的所有实例，重新创建所有实例，最后再进行一次渲染！这就是为什么题目里链接的 angular/knockout 实现都相对比较慢。相比之下，React 的变动检查由于是 DOM 结构层面的，即使是全新的数据，只要最后渲染结果没变，那么就不需要做无用功。

Angular 和 Vue 都提供了列表重绘的优化机制，也就是 “提示” 框架如何有效地复用实例和 DOM 元素。比如数据库里的同一个对象，在两次前端 API 调用里面会成为不同的对象，但是它们依然有一样的 uid。这时候你就可以提示 track by uid 来让 Angular 知道，这两个对象其实是同一份数据。那么原来这份数据对应的实例和 DOM 元素都可以复用，只需要更新变动了的部分。或者，你也可以直接 track by $index 来进行 “原地复用”：直接根据在数组里的位置进行复用。在题目给出的例子里，如果 angular 实现加上 track by $index 的话，后续重绘是不会比 React 慢多少的。甚至在 dbmonster 测试中，Angular 和 Vue 用了 track by \$index 以后都比 React 快: dbmon (注意 Angular 默认版本无优化，优化过的在下面）

顺道说一句，React 渲染列表的时候也需要提供 key 这个特殊 prop，本质上和 track-by 是一回事。

#### 4. 性能比较也要看场合

在比较性能的时候，要分清楚初始渲染、小量数据更新、大量数据更新这些不同的场合。Virtual DOM、脏检查 MVVM、数据收集 MVVM 在不同场合各有不同的表现和不同的优化需求。Virtual DOM 为了提升小量数据更新时的性能，也需要针对性的优化，比如 shouldComponentUpdate 或是 immutable data。

- 初始渲染：Virtual DOM > 脏检查 >= 依赖收集
- 小量数据更新：依赖收集 >> Virtual DOM + 优化 > 脏检查（无法优化） > Virtual DOM 无优化
- 大量数据更新：脏检查 + 优化 >= 依赖收集 + 优化 > Virtual DOM（无法/无需优化）>> MVVM 无优化

不要天真地以为 Virtual DOM 就是快，diff 不是免费的，batching 么 MVVM 也能做，而且最终 patch 的时候还不是要用原生 API。在我看来 Virtual DOM 真正的价值从来都不是性能，而是它 1) 为函数式的 UI 编程方式打开了大门；2) 可以渲染到 DOM 以外的 backend，比如 ReactNative。

#### 5. 总结

以上这些比较，更多的是对于框架开发研究者提供一些参考。主流的框架 + 合理的优化，足以应对绝大部分应用的性能需求。如果是对性能有极致需求的特殊情况，其实应该牺牲一些可维护性采取手动优化：比如 Atom 编辑器在文件渲染的实现上放弃了 React 而采用了自己实现的 tile-based rendering；又比如在移动端需要 DOM-pooling 的虚拟滚动，不需要考虑顺序变化，可以绕过框架的内置实现自己搞一个。

### 33.下面的代码打印什么内容，为什么？

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

针对这题，在知乎上看到别人的回答说：

1. 函数表达式与函数声明不同，函数名只在该函数内部有效，并且此绑定是常量绑定。
2. 对于一个常量进行赋值，在 strict 模式下会报错，非 strict 模式下静默失败。
3. IIFE 中的函数是函数表达式，而不是函数声明。

实际上，有点类似于以下代码，但不完全相同，因为使用 const 不管在什么模式下，都会 TypeError 类型的错误

```js
const foo = (function() {
  foo = 10;
  console.log(foo);
})(foo)(); // Uncaught TypeError: Assignment to constant variable.
```

我的理解是，b 函数是一个相当于用 const 定义的常量，内部无法进行重新赋值，如果在严格模式下，会报错"Uncaught TypeError: Assignment to constant variable."
例如下面的：

```js
var b = 10;
(function b() {
  'use strict';
  b = 20;
  console.log(b);
})(); // "Uncaught TypeError: Assignment to constant variable."
```

### 34.简单改造下面的代码，使之分别打印 10 和 20。

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

我的解法：
1）打印 10

```js
var b = 10;
(function b(b) {
  window.b = 20;
  console.log(b);
})(b);
```

或者

```js
var b = 10;
(function b(b) {
  b.b = 20;
  console.log(b);
})(b);
```

2）打印 20

```js
var b = 10;
(function b(b) {
  b = 20;
  console.log(b);
})(b);
```

或

```js
var b = 10;
(function b() {
  var b = 20;
  console.log(b);
})();
```

### 36.使用迭代的方式实现 flatten 函数。

```js
const spreadableSymbol = Symbol.isConcatSpreadable;
const isFlattenable = value => {
  return (
    Array.isArray(value) ||
    (typeof value == 'object' && value !== null && Object.prototype.toString.call(value) === '[object Arguments]') ||
    !!(spreadableSymbol && value && value[spreadableSymbol])
  );
};

/**
 * flatten的基本实现，具体可以参考lodash库的flatten源码
 * @param array 需要展开的数组
 * @param depth 展开深度
 * @param predicate 迭代时需要调用的函数
 * @param isStrict 限制通过`predicate`函数检查的值
 * @param result 初始结果值
 * @returns {Array} 返回展开后的数组
 */
function flatten(array, depth, predicate, isStrict, result) {
  predicate || (predicate = isFlattenable);
  result || (result = []);

  if (array == null) {
    return result;
  }

  for (const value of array) {
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        flatten(value, depth - 1, predicate, isStrict, result);
      } else {
        result.push(...value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

flatten([1, 2, 3, [4, 5, [6]]], 2);
// [1, 2, 3, 4, 5, 6]
```

### 38.下面代码中 a 在什么情况下会打印 1？

```js
var a = ?;
if(a == 1 && a == 2 && a == 3){
 	console.log(1);
}
```

题目如下

```js
var a = ?;
if(a == 1 && a == 2 && a == 3){
 	console.log(1);
}
```

答案解析 因为==会进行隐式类型转换 所以我们重写 toString 方法就可以了

```js
var a = {
  i: 1,
  toString() {
    return a.i++;
  },
};

if (a == 1 && a == 2 && a == 3) {
  console.log(1);
}
```

### 40.在 Vue 中，子组件为何不可以修改父组件传递的 Prop

如果修改了，Vue 是如何监控到属性的修改并给出警告的。

1. 子组件为何不可以修改父组件传递的 Prop
   单向数据流，易于监测数据的流动，出现了错误可以更加迅速的定位到错误发生的位置。
2. 如果修改了，Vue 是如何监控到属性的修改并给出警告的。

```js
if (process.env.NODE_ENV !== 'production') {
  var hyphenatedKey = hyphenate(key);
  if (isReservedAttribute(hyphenatedKey) || config.isReservedAttr(hyphenatedKey)) {
    warn('"' + hyphenatedKey + '" is a reserved attribute and cannot be used as component prop.', vm);
  }
  defineReactive$$1(props, key, value, function() {
    if (!isRoot && !isUpdatingChildComponent) {
      warn(
        'Avoid mutating a prop directly since the value will be ' +
          'overwritten whenever the parent component re-renders. ' +
          "Instead, use a data or computed property based on the prop's " +
          'value. Prop being mutated: "' +
          key +
          '"',
        vm,
      );
    }
  });
}
```

在 initProps 的时候，在 defineReactive 时通过判断是否在开发环境，如果是开发环境，会在触发 set 的时候判断是否此 key 是否处于 updatingChildren 中被修改，如果不是，说明此修改来自子组件，触发 warning 提示。

需要特别注意的是，当你从子组件修改的 prop 属于基础类型时会触发提示。 这种情况下，你是无法修改父组件的数据源的， 因为基础类型赋值时是值拷贝。你直接将另一个非基础类型（Object, array）赋值到此 key 时也会触发提示(但实际上不会影响父组件的数据源)， 当你修改 object 的属性时不会触发提示，并且会修改父组件数据源的数据。

### 41.下面代码输出什么

```js
var a = 10;
(function() {
  console.log(a);
  a = 5;
  console.log(window.a);
  var a = 20;
  console.log(a);
})();
```

分别为 undefined 　 10 　 20，原因是作用域问题，在内部声名 var a = 20;相当于先声明 var a;然后再执行赋值操作，这是在ＩＩＦＥ内形成的独立作用域，如果把 var a=20 注释掉，那么 a 只有在外部有声明，显示的就是外部的Ａ变量的值了。结果Ａ会是 10 　 5 　 5

### 42.实现一个 sleep 函数

比如 sleep(1000) 意味着等待 1000 毫秒，可从 Promise、Generator、Async/Await 等角度实现

```js
const sleep = time => {
  return new Promise(resolve => setTimeout(resolve, time));
};

sleep(1000).then(() => {
  // 这里写你的骚操作
});
```

### 43.使用 sort() 对数组 [3, 15, 8, 29, 102, 22] 进行排序，输出结果

原题目：

使用 sort() 对数组 [3, 15, 8, 29, 102, 22] 进行排序，输出结果

我的答案：

[102, 15, 22, 29, 3, 8]

解析：
根据 MDN 上对 Array.sort()的解释，默认的排序方法会将数组元素转换为字符串，然后比较字符串中字符的 UTF-16 编码顺序来进行排序。所以'102' 会排在 '15' 前面。

### 44.介绍 HTTPS 握手过程

1. 客户端使用 https 的 url 访问 web 服务器,要求与服务器建立 ssl 连接
1. web 服务器收到客户端请求后, 会将网站的证书(包含公钥)传送一份给客户端
1. 客户端收到网站证书后会检查证书的颁发机构以及过期时间, 如果没有问题就随机产生一个秘钥
1. 客户端利用公钥将会话秘钥加密, 并传送给服务端, 服务端利用自己的私钥解密出会话秘钥
1. 之后服务器与客户端使用秘钥加密传输

### 45.HTTPS 握手过程中，客户端如何验证证书的合法性

1. 是否是信任的有效证书，浏览器内置了信任的根证书，看看 web 服务器上的证书是不是这些信任的根证书发的或者信任根的二级证书机构发的，还有是否过了有效期，是否被吊销；
2. 证明对方是否持有证书的对应的私钥

### 47.双向绑定和 vuex 是否冲突

在严格模式中使用 Vuex，当用户输入时，v-model 会试图直接修改属性值，但这个修改不是在 mutation 中修改的，所以会抛出一个错误。当需要在组件中使用 vuex 中的 state 时，有 2 种解决方案：
1、在 input 中绑定 value(vuex 中的 state)，然后监听 input 的 change 或者 input 事件，在事件回调中调用 mutation 修改 state 的值
2、使用带有 setter 的双向绑定计算属性。见以下例子（来自官方文档）：

```html
<input v-model="message" />
```

```js
computed: { message: { get () { return this.$store.state.obj.message }, set (value) { this.$store.commit('updateMessage', value) } } }
```

### 50.实现 (5).add(3).minus(2) 功能。

例： 5 + 3 - 2，结果为 6

```js
Number.prototype.add = function(n) {
  return this.valueOf() + n;
};
Number.prototype.minus = function(n) {
  return this.valueOf() - n;
};
```

[![image](https://user-images.githubusercontent.com/13726966/55743276-79e83000-5a64-11e9-9227-39b7fe4b98de.png)](https://user-images.githubusercontent.com/13726966/55743276-79e83000-5a64-11e9-9227-39b7fe4b98de.png)

### 51.Vue 的响应式原理中 Object.defineProperty 有什么缺陷？

为什么在 Vue3.0 采用了 Proxy，抛弃了 Object.defineProperty？

1. Object.defineProperty 无法监控到数组下标的变化，导致通过数组下标添加元素，不能实时响应；
2. Object.defineProperty 只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历。Proxy 可以劫持整个对象，并返回一个新的对象。
3. Proxy 不仅可以代理对象，还可以代理数组。还可以代理动态增加的属性。

### 52.怎么让一个 div 水平垂直居中

```js
<div class="parent">
  <div class="child"></div>
</div>
```

1.

```
div.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

1.

```js
div.parent {
    position: relative;
}
div.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
/* 或者 */
div.child {
    width: 50px;
    height: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -25px;
    margin-top: -5px;
}
/* 或 */
div.child {
    width: 50px;
    height: 10px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
```

1.

```js
div.parent {
    display: grid;
}
div.child {
    justify-self: center;
    align-self: center;
}
```

1.

```js
div.parent {
    font-size: 0;
    text-align: center;
    &::before {
        content: "";
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
    }
}
div.child{
  display: inline-block;
  vertical-align: middle;
}
```

### 57.分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景。

display: none (不占空间，不能点击)（场景，显示出原来这里不存在的结构）
visibility: hidden（占据空间，不能点击）（场景：显示不会导致页面结构发生变动，不会撑开）
opacity: 0（占据空间，可以点击）（场景：可以跟 transition 搭配）

### 58.箭头函数与普通函数（function）的区别是什么？构造函数（function）可以使用 new 生成实例，那么箭头函数可以吗？为什么？

箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：

1、函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。

2、不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

3、不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。

4、不可以使用 new 命令，因为：

- 没有自己的 this，无法调用 call，apply。
- 没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 **proto**

new 过程大致是这样的：

```js
function newFunc(father, ...rest) {
  var result = {};
  result.__proto__ = father.prototype;
  var result2 = father.apply(result, rest);
  if ((typeof result2 === 'object' || typeof result2 === 'function') && result2 !== null) {
    return result2;
  }
  return result;
}
```

### 59.给定两个数组，写一个方法来计算它们的交集。

例如：给定 nums1 = [1, 2, 2, 1]，nums2 = [2, 2]，返回 [2, 2]。

```js
function union(arr1, arr2) {
  return arr1.filter(item => {
    return arr2.indexOf(item) > -1;
  });
}
const a = [1, 2, 2, 1];
const b = [2, 3, 2];
console.log(union(a, b)); // [2, 2]
```

### 61.介绍下如何实现 token 加密

jwt 举例

1. 需要一个 secret（随机数）
1. 后端利用 secret 和加密算法(如：HMAC-SHA256)对 payload(如账号密码)生成一个字符串(token)，返回前端
1. 前端每次 request 在 header 中带上 token
1. 后端用同样的算法解密

### 62.redux 为什么要把 reducer 设计成纯函数

redux 的设计思想就是不产生副作用，数据更改的状态可回溯，所以 redux 中处处都是纯函数

### 63.如何设计实现无缝轮播

简单来说，无缝轮播的核心是制造一个连续的效果。最简单的方法就是复制一个轮播的元素，当复制元素将要滚到目标位置后，把原来的元素进行归位的操作，以达到无缝的轮播效果。

贴一段轮播的核心代码：

```js
// scroll the notice
useEffect(() => {
  const requestAnimationFrame =
    window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
  const cancelAnimationFrame =
    window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;

  const scrollNode = noticeContentEl.current;
  const distance = scrollNode.clientWidth / 2;

  scrollNode.style.left = scrollNode.style.left || 0;
  window.__offset = window.__offset || 0;

  let requestId = null;
  const scrollLeft = () => {
    const speed = 0.5;
    window.__offset = window.__offset + speed;
    scrollNode.style.left = -window.__offset + 'px';
    // 关键行：当距离小于偏移量时，重置偏移量
    if (distance <= window.__offset) window.__offset = 0;
    requestId = requestAnimationFrame(scrollLeft);
  };
  requestId = requestAnimationFrame(scrollLeft);

  if (pause) cancelAnimationFrame(requestId);
  return () => cancelAnimationFrame(requestId);
}, [notice, pause]);
```

### 64.模拟实现一个 Promise.finally

```js
Promise.prototype.finally = function(callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason =>
      P.resolve(callback()).then(() => {
        throw reason;
      }),
  );
};
```

### 65. `a.b.c.d` 和 `a['b']['c']['d']`，哪个性能更高？

应该是 a.b.c.d 比 a['b']['c']['d'] 性能高点，后者还要考虑 [ ] 中是变量的情况，再者，从两种形式的结构来看，显然编译器解析前者要比后者容易些，自然也就快一点。

### 66.ES6 代码转成 ES5 代码的实现思路是什么

将 ES6 的代码转换为 AST 语法树，然后再将 ES6 AST 转为 ES5 AST，再将 AST 转为代码

### 68. 如何解决移动端 Retina 屏 1px 像素问题

1 伪元素 + transform scaleY(.5)
2 border-image
3 background-image
4 box-shadow

### 69. 如何把一个字符串的大小写取反（大写变小写小写变大写），例如 ’AbC' 变成 'aBc' 。

```js
function processString(s) {
  var arr = s.split('');
  var new_arr = arr.map(item => {
    return item === item.toUpperCase() ? item.toLowerCase() : item.toUpperCase();
  });
  return new_arr.join('');
}
console.log(processString('AbC'));
```

### 70. 介绍下 webpack 热更新原理，是如何做到在不刷新浏览器的前提下更新页面的

1.当修改了一个或多个文件； 2.文件系统接收更改并通知 webpack；
3.webpack 重新编译构建一个或多个模块，并通知 HMR 服务器进行更新；
4.HMR Server 使用 webSocket 通知 HMR runtime 需要更新，HMR 运行时通过 HTTP 请求更新 jsonp；
5.HMR 运行时替换更新中的模块，如果确定这些模块无法更新，则触发整个页面刷新。

### 71. 实现一个字符串匹配算法，从长度为 n 的字符串 S 中，查找是否存在字符串 T，T 的长度是 m，若存在返回所在位置。

```js
const find = (S, T) => {
  if (S.length < T.length) return -1;
  for (let i = 0; i < S.length; i++) {
    if (S.slice(i, i + T.length) === T) return i;
  }
  return -1;
};
```

### 72. 为什么普通 `for` 循环的性能远远高于 `forEach` 的性能，请解释其中的原因。

![image-20190512225510941](https://ws2.sinaimg.cn/large/006tNc79gy1g2yxbg4ta8j31gh0u048h.jpg)

- for 循环没有任何额外的函数调用栈和上下文；
- forEach 函数签名实际上是

```js
array.forEach(function(currentValue, index, arr), thisValue)
```

它不是普通的 for 循环的语法糖，还有诸多参数和上下文需要在执行的时候考虑进来，这里可能拖慢性能；

### 74. 使用 JavaScript Proxy 实现简单的数据绑定

```html
<body>
  hello,world
  <input type="text" id="model" />
  <p id="word"></p>
</body>
<script>
  const model = document.getElementById('model');
  const word = document.getElementById('word');
  var obj = {};

  const newObj = new Proxy(obj, {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
      console.log('setting', target, key, value, receiver);
      if (key === 'text') {
        model.value = value;
        word.innerHTML = value;
      }
      return Reflect.set(target, key, value, receiver);
    },
  });

  model.addEventListener('keyup', function(e) {
    newObj.text = e.target.value;
  });
</script>
```

### 76.输出以下代码运行结果

```js
// example 1
var a={}, b='123', c=123;
a[b]='b';
a[c]='c';
// 输出 c
console.log(a[b]);

---------------------
// example 2
var a={}, b=Symbol('123'), c=Symbol('123');
a[b]='b';
a[c]='c';
console.log(a[b]);

---------------------
// example 3
var a={}, b={key:'123'}, c={key:'456'};
a[b]='b';
a[c]='c';
console.log(a[b]);
```

### 77.算法题「旋转数组」

给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。

示例 1：

```js
输入: [1, 2, 3, 4, 5, 6, 7] 和 k = 3
输出: [5, 6, 7, 1, 2, 3, 4]
解释:
向右旋转 1 步: [7, 1, 2, 3, 4, 5, 6]
向右旋转 2 步: [6, 7, 1, 2, 3, 4, 5]
向右旋转 3 步: [5, 6, 7, 1, 2, 3, 4]
```

示例 2：

```js
输入: [-1, -100, 3, 99] 和 k = 2
输出: [3, 99, -1, -100]
解释:
向右旋转 1 步: [99, -1, -100, 3]
向右旋转 2 步: [3, 99, -1, -100]
```

因为步数有可能大于数组长度，所以要先取余

```js
function rotate(arr, k) {
  const len = arr.length;
  const step = k % len;
  return arr.slice(-step).concat(arr.slice(0, len - step));
}
// rotate([1, 2, 3, 4, 5, 6], 7) => [6, 1, 2, 3, 4, 5]
```

### 78.Vue 的父组件和子组件生命周期钩子执行顺序是什么

父组建： beforeCreate -> created -> beforeMount
子组件： -> beforeCreate -> created -> beforeMount -> mounted
父组件： -> mounted
总结：从外到内，再从内到外

### 79.input 搜索如何防抖，如何处理中文输入

防抖就不说了，主要是这里提到的中文输入问题，其实看过 elementui 框架源码的童鞋都应该知道，elementui 是通过 compositionstart & compositionend 做的中文输入处理：
相关代码：

```html
<input
  ref="input"
  @compositionstart="handleComposition"
  @compositionupdate="handleComposition"
  @compositionend="handleComposition"
  \
/>
```

这 3 个方法是原生的方法，这里简单介绍下，官方定义如下 compositionstart 事件触发于一段文字的输入之前（类似于 keydown 事件，但是该事件仅在若干可见字符的输入之前，而这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）
简单来说就是切换中文输入法时在打拼音时(此时 input 内还没有填入真正的内容)，会首先触发 compositionstart，然后每打一个拼音字母，触发 compositionupdate，最后将输入好的中文填入 input 中时触发 compositionend。触发 compositionstart 时，文本框会填入 “虚拟文本”（待确认文本），同时触发 input 事件；在触发 compositionend 时，就是填入实际内容后（已确认文本）,所以这里如果不想触发 input 事件的话就得设置一个 bool 变量来控制。
[![image](https://user-images.githubusercontent.com/34699694/58140376-8f5e9580-7c71-11e9-987e-5fe39fce5e90.png)](https://user-images.githubusercontent.com/34699694/58140376-8f5e9580-7c71-11e9-987e-5fe39fce5e90.png)
根据上图可以看到

输入到 input 框触发 input 事件
失去焦点后内容有改变触发 change 事件
识别到你开始使用中文输入法触发**compositionstart **事件
未输入结束但还在输入中触发**compositionupdate **事件
输入完成（也就是我们回车或者选择了对应的文字插入到输入框的时刻）触发 compositionend 事件。

那么问题来了 使用这几个事件能做什么？
因为 input 组件常常跟 form 表单一起出现，需要做表单验证
[![image](https://user-images.githubusercontent.com/34699694/58140402-b1581800-7c71-11e9-97b9-9c696f3a0061.png)](https://user-images.githubusercontent.com/34699694/58140402-b1581800-7c71-11e9-97b9-9c696f3a0061.png)
为了解决中文输入法输入内容时还没将中文插入到输入框就验证的问题

我们希望中文输入完成以后才验证

### 80.介绍下 Promise.all 使用、原理实现及错误处理

```js
all(list) {
        return new Promise((resolve, reject) => {
            let resValues = [];
            let counts = 0;
            for (let [i, p] of list) {
                resolve(p).then(res => {
                    counts++;
                    resValues[i] = res;
                    if (counts === list.length) {
                        resolve(resValues)
                    }
                }, err => {
                    reject(err)
                })
            }
        })
    }
```

### 81.打印出 1 - 10000 之间的所有对称数

例如：121、1331 等

81.打印出 1 - 10000 之间的所有对称数

例如：121、1331 等

```js
[...Array(10000).keys()].filter(x => {
  return (
    x.toString().length > 1 &&
    x ===
      Number(
        x
          .toString()
          .split('')
          .reverse()
          .join(''),
      )
  );
});
```

[![image](https://user-images.githubusercontent.com/16409424/58295339-52290d80-7e01-11e9-81db-4716426e039d.png)](https://user-images.githubusercontent.com/16409424/58295339-52290d80-7e01-11e9-81db-4716426e039d.png)

### 82.周一算法题之「移动零」

给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
示例:

```js
输入: [0, 1, 0, 3, 12];
输出: [1, 3, 12, 0, 0];
```

说明:

1. 必须在原数组上操作，不能拷贝额外的数组。
1. 尽量减少操作次数。

```js
function zeroMove(array) {
  let len = array.length;
  let j = 0;
  for (let i = 0; i < len - j; i++) {
    if (array[i] === 0) {
      array.push(0);
      array.splice(i, 1);
      i--;
      j++;
    }
  }
  return array;
}
```

### 85.react-router 里的 `<Link>` 标签和 `<a>` 标签有什么区别

如何禁掉 `<a>` 标签默认事件，禁掉之后如何实现跳转。

先看 Link 点击事件 handleClick 部分源码

```js
if (that.props.onClick) that.props.onClick(event);

if (
  !event.defaultPrevented && // onClick prevented default
  event.button === 0 && // ignore everything but left clicks
  !that.props.target && // let browser handle "target=_blank" etc.
  !isModifiedEvent(event) // ignore clicks with modifier keys
) {
  event.preventDefault();

  var history = that.context.router.history;
  var that$props = that.props,
    replace = that$props.replace,
    to = that$props.to;

  if (replace) {
    history.replace(to);
  } else {
    history.push(to);
  }
}
```

Link 做了 3 件事情：

1. 有 onclick 那就执行 onclick
2. click 的时候阻止 a 标签默认事件（这样子点击`[123]()`就不会跳转和刷新页面）
3. 再取得跳转 href（即是 to），用 history（前端路由两种方式之一，history & hash）跳转，此时只是链接变了，并没有刷新页面

### 89.设计并实现 Promise.race()

```js
Promise._race = promises =>
  new Promise((resolve, reject) => {
    promises.forEach(promise => {
      promise.then(resolve, reject);
    });
  });
```

### 91.介绍下 HTTPS 中间人攻击

https 协议由 http + ssl 协议构成，具体的链接过程可参考[SSL 或 TLS 握手的概述](https://github.com/lvwxx/blog/issues/3)

中间人攻击过程如下：

1. 服务器向客户端发送公钥。
2. 攻击者截获公钥，保留在自己手上。
3. 然后攻击者自己生成一个【伪造的】公钥，发给客户端。
4. 客户端收到伪造的公钥后，生成加密 hash 值发给服务器。
5. 攻击者获得加密 hash 值，用自己的私钥解密获得真秘钥。
6. 同时生成假的加密 hash 值，发给服务器。
7. 服务器用私钥解密获得假秘钥。
8. 服务器用加秘钥加密传输信息

防范方法：

1. 服务端在发送浏览器的公钥中加入 CA 证书，浏览器可以验证 CA 证书的有效性

### 94.vue 在 v-for 时给每项元素绑定事件需要用事件代理吗？为什么？

说一下我个人理解，先说结论，可以使用

事件代理作用主要是 2 个

1. 将事件处理程序代理到父节点，减少内存占用率
2. 动态生成子节点时能自动绑定事件处理程序到父节点

这里我生成了十万个 span 节点，通过 performance monitor 来监控内存占用率和事件监听器的数量，对比以下 3 种情况

1. 不使用事件代理，每个 span 节点绑定一个 click 事件，并指向同一个事件处理程序

```html
<div>
  <span v-for="(item,index) of 100000" :key="index" @click="handleClick">
    {{item}}
  </span>
</div>
```

1. 不使用事件代理，每个 span 节点绑定一个 click 事件，并指向不同的事件处理程序

```html
<div>
  <span v-for="(item,index) of 100000" :key="index" @click="function () {}">
    {{item}}
  </span>
</div>
```

1. 使用事件代理

```html
<div @click="handleClick">
  <span v-for="(item,index) of 100000" :key="index"> {{item}} </span>
</div>
```

[![image](https://user-images.githubusercontent.com/39046570/59992198-235ebb00-967d-11e9-9b17-a7b1c6f761a9.png)](https://user-images.githubusercontent.com/39046570/59992198-235ebb00-967d-11e9-9b17-a7b1c6f761a9.png)

[![image](https://user-images.githubusercontent.com/39046570/59992186-13df7200-967d-11e9-9bb2-f6d5335a9583.png)](https://user-images.githubusercontent.com/39046570/59992186-13df7200-967d-11e9-9bb2-f6d5335a9583.png)

[![image](https://user-images.githubusercontent.com/39046570/59992179-0cb86400-967d-11e9-91bf-421ee14a94e3.png)](https://user-images.githubusercontent.com/39046570/59992179-0cb86400-967d-11e9-91bf-421ee14a94e3.png)

可以看到使用事件代理无论是监听器数量和内存占用率都比前两者要少

同时对比 3 个图中监听器的数量以及我以往阅读 vue 源码的过程中，并没有发现 vue 会自动做事件代理，但是一般给 v-for 绑定事件时，都会让节点指向同一个事件处理程序（第二种情况可以运行，但是 eslint 会警告），一定程度上比每生成一个节点都绑定一个不同的事件处理程序性能好，但是监听器的数量仍不会变，所以使用事件代理会更好一点

### 96.介绍下前端加密的常见场景和方法

首先，加密的目的，简而言之就是将明文转换为密文、甚至转换为其他的东西，用来隐藏明文内容本身，防止其他人直接获取到敏感明文信息、或者提高其他人获取到明文信息的难度。
通常我们提到加密会想到密码加密、HTTPS 等关键词，这里从场景和方法分别提一些我的个人见解。

#### 场景-密码传输

前端密码传输过程中如果不加密，在日志中就可以拿到用户的明文密码，对用户安全不太负责。
这种加密其实相对比较简单，可以使用 PlanA-前端加密、后端解密后计算密码字符串的 MD5/MD6 存入数据库；也可以 PlanB-直接前端使用一种稳定算法加密成唯一值、后端直接将加密结果进行 MD5/MD6，全程密码明文不出现在程序中。

**PlanA**
使用 Base64 / Unicode+1 等方式加密成非明文，后端解开之后再存它的 MD5/MD6 。

**PlanB**
直接使用 MD5/MD6 之类的方式取 Hash ，让后端存 Hash 的 Hash 。

#### 场景-数据包加密

应该大家有遇到过：打开一个正经网站，网站底下蹦出个不正经广告——比如 X 通的流量浮层，X 信的插入式广告……（我没有针对谁）
但是这几年，我们会发现这种广告逐渐变少了，其原因就是大家都开始采用 HTTPS 了。
被人插入这种广告的方法其实很好理解：你的网页数据包被抓取->在数据包到达你手机之前被篡改->你得到了带网页广告的数据包->渲染到你手机屏幕。
而 HTTPS 进行了包加密，就解决了这个问题。严格来说我认为从手段上来看，它不算是一种前端加密场景；但是从解决问题的角度来看，这确实是前端需要知道的事情。

**Plan**
全面采用 HTTPS

#### 场景-展示成果加密

经常有人开发网页爬虫爬取大家辛辛苦苦一点一点发布的数据成果，有些会影响你的竞争力，有些会降低你的知名度，甚至有些出于恶意爬取你的公开数据后进行全量公开……比如有些食谱网站被爬掉所有食谱，站点被克隆；有些求职网站被爬掉所有职位，被拿去卖信息；甚至有些小说漫画网站赖以生存的内容也很容易被爬取。

**Plan**
将文本内容进行展示层加密，利用字体的引用特点，把拿给爬虫的数据变成“乱码”。
举个栗子：正常来讲，当我们拥有一串数字“12345”并将其放在网站页面上的时候，其实网站页面上显示的并不是简单的数字，而是数字对应的字体的“12345”。这时我们打乱一下字体中图形和字码的对应关系，比如我们搞成这样：

图形：1 2 3 4 5
字码：2 3 1 5 4

这时，如果你想让用户看到“12345”，你在页面中渲染的数字就应该是“23154”。这种手段也可以算作一种加密。
具体的实现方法可以看一下《[Web 端反爬虫技术方案](https://juejin.im/post/5b6d579cf265da0f6e51a7e0)》。

### 101.修改以下 print 函数，使之输出 0 到 99，或者 99 到 0

要求：

> 1、只能修改 `setTimeout` 到 `Math.floor(Math.random() * 1000` 的代码
>
> 2、不能修改 `Math.floor(Math.random() * 1000`
>
> 3、不能使用全局变量

```js
function print(n) {
  setTimeout(() => {
    console.log(n);
  }, Math.floor(Math.random() * 1000));
}
for (var i = 0; i < 100; i++) {
  print(i);
}
```

```js
function print(n) {
  setTimeout(
    (() => {
      console.log(n);
      return () => {};
    }).call(n, []),
    Math.floor(Math.random() * 1000),
  );
}
for (var i = 0; i < 100; i++) {
  print(i);
}
```

### 102.不用加减乘除运算符，求整数的 7 倍

```js
/* -- 位运算 -- */

// 先定义位运算加法
function bitAdd(m, n) {
  while (m) {
    [m, n] = [(m & n) << 1, m ^ n];
  }
  return n;
}

// 位运算实现方式 1 - 循环累加7次
let multiply7_bo_1 = num => {
  let sum = 0,
    counter = new Array(7); // 得到 [empty × 7]
  while (counter.length) {
    sum = bitAdd(sum, num);
    counter.shift();
  }
  return sum;
};

// 位运算实现方式 2 - 二进制进3位(乘以8)后，加自己的补码(乘以-1)
let multiply7_bo_2 = num => bitAdd(num << 3, -num);

/* -- JS hack -- */

// hack 方式 1 - 利用 Function 的构造器 & 乘号的字节码
let multiply7_hack_1 = num => new Function(['return ', num, String.fromCharCode(42), '7'].join(''))();

// hack 方式 2 - 利用 eval 执行器 & 乘号的字节码
let multiply7_hack_2 = num => eval([num, String.fromCharCode(42), '7'].join(''));

// hack 方式 3 - 利用 SetTimeout 的参数 & 乘号的字节码
setTimeout(['window.multiply7_hack_3=(num)=>(7', String.fromCharCode(42), 'num)'].join(''));

/* -- 进制转换 -- */

// 进制转换方式 - 利用 toString 转为七进制整数；然后末尾补0(左移一位)后通过 parseInt 转回十进制
let multiply7_base7 = num => parseInt([num.toString(7), '0'].join(''), 7);
```

### 105.编程题

url 有三种情况

>

```js
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=&local_province_id=33
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=800&local_province_id=33
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=800,700&local_province_id=33
```

> 匹配 elective 后的数字输出（写出你认为的最优解法）:

```js
[] || ['800'] || ['800', '700'];
```

```js
function getUrlValue(url) {
  if (!url) return;
  let res = url.match(/(?<=elective=)(\d+(,\d+)*)/);
  return res ? res[0].split(',') : [];
}
```

### 106.分别写出如下代码的返回值

```js
String('11') == new String('11');
String('11') === new String('11');
```

true
false

new String() 返回的是对象

== 的时候，实际运行的是
String('11') == new String('11').toString();

=== 不再赘述。

### 107.考虑到性能问题，如何快速从一个巨大的数组中随机获取部分元素。

比如有个数组有 100K 个元素，从中不重复随机选取 10K 个元素。

由于随机从 100K 个数据中随机选取 10k 个数据，可采用统计学中随机采样点的选取进行随机选取，如在 0-50 之间生成五个随机数，然后依次将每个随机数进行加 50 进行取值，性能应该是最好的。

### 110.编程题，请写一个函数，完成以下功能

输入
`'1, 2, 3, 5, 7, 8, 10'`
输出
`'1~3, 5, 7~8, 10'`

### 111.编程题，写个程序把 entry 转换成如下对象

```js
var entry = {
  a: {
    b: {
      c: {
        dd: "abcdd"
      }
    },
    d: {
      xx: "adxx"
    },
    e: "ae"
  }
};
>
// 要求转换成如下对象
var output = {
  "a.b.c.dd": "abcdd",
  "a.d.xx": "adxx",
  "a.e": "ae"
};
```

```js
function flatObj(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let keyName = `${parentKey}${key}`;
      if (typeof obj[key] === 'object') flatObj(obj[key], keyName + '.', result);
      else result[keyName] = obj[key];
    }
  }
  return result;
}
```

### 112.编程题，写个程序把 entry 转换成如下对象（跟昨日题目相反）

```js
var entry = {
  "a.b.c.dd": "abcdd",
  "a.d.xx": "adxx",
  "a.e": "ae"
};
>
// 要求转换成如下对象
var output = {
  a: {
    b: {
      c: {
        dd: "abcdd"
      }
    },
    d: {
      xx: "adxx"
    },
    e: "ae"
  }
};
```

```js
var entry = {
  'a.b.c.dd': 'abcdd',
  'a.d.xx': 'adxx',
  'a.e': 'ae',
};

function map(entry) {
  const obj = Object.create(null);
  for (const key in entry) {
    const keymap = key.split('.');
    set(obj, keymap, entry[key]);
  }
  return obj;
}

function set(obj, map, val) {
  let tmp;
  if (!obj[map[0]]) obj[map[0]] = Object.create(null);
  tmp = obj[map[0]];
  for (let i = 1; i < map.length; i++) {
    if (!tmp[map[i]]) tmp[map[i]] = map.length - 1 === i ? val : Object.create(null);
    tmp = tmp[map[i]];
  }
}
console.log(map(entry));
```

### 113.编程题，根据以下要求，写一个数组去重函数（蘑菇街）

1. 如传入的数组元素为`[123, "meili", "123", "mogu", 123]`，则输出：`[123, "meili", "123", "mogu"]`
2. 如传入的数组元素为`[123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"]`，则输出：`[123, [1, 2, 3], [1, "2", 3], "meili"]`
3. 如传入的数组元素为`[123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili"]`，则输出：`[123, {a: 1}, {a: {b: 1}}, {a: "1"}, "meili"]`

```js
function filterArray(array) {
  var keys = {};
  if (array && array.length) {
    var rst = array.filter(val1 => {
      var str = JSON.stringify(val1);
      if (!keys[str]) {
        keys[str] = true;
        return true;
      } else {
        return false;
      }
    });
  }

  return rst;
}
// [123, "meili", "123", "mogu", 123]，则输出：[123, "meili", "123", "mogu"]
console.log(filterArray([123, 'meili', '123', 'mogu', 123]));
// [123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"]，则输出：[123, [1, 2, 3], [1, "2", 3], "meili"]
console.log(filterArray([123, [1, 2, 3], [1, '2', 3], [1, 2, 3], 'meili']));
// [123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili"]，则输出：[123, {a: 1}, {a: {b: 1}}, {a: "1"}, "meili"]
console.log(filterArray([123, { a: 1 }, { a: { b: 1 } }, { a: '1' }, { a: { b: 1 } }, 'meili']));
```

### 116.输出以下代码运行结果

```js
1 + "1";
>
2 * "2"[(1, 2)] + [2, 1];
>
"a" + +"b";
```

'11'
4
'1,22,1'
'aNaN'

//"a" + + "b"其实可以理解为
// + "b" -> NaN
//“a”+NaN

### 118.vue 渲染大量数据时应该怎么优化？

Object.freeze 冻结对象，不让 vue 劫持. 以及使用 虚拟列表

### 119.vue 如何优化首页的加载速度？vue 首页白屏是什么问题引起的？如何解决呢？

首页白屏的原因：
单页面应用的 html 是靠 js 生成，因为首屏需要加载很大的 js 文件(app.js vendor.js)，所以当网速差的时候会产生一定程度的白屏

解决办法：

优化 webpack 减少模块打包体积，code-split 按需加载
服务端渲染，在服务端事先拼装好首页所需的 html
首页加 loading 或 骨架屏 （仅仅是优化体验）

### 120.为什么 for 循环嵌套顺序会影响性能？

```js
var t1 = new Date().getTime();
for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 1000; j++) {
    for (let k = 0; k < 10000; k++) {}
  }
}
var t2 = new Date().getTime();
console.log('first time', t2 - t1);

for (let i = 0; i < 10000; i++) {
  for (let j = 0; j < 1000; j++) {
    for (let k = 0; k < 100; k++) {}
  }
}
var t3 = new Date().getTime();
console.log('two time', t3 - t2);
```

应该是第一个时间少一点，比如，按照每次循环判断来说 （初始化 自增次数类似）

1、i 会循环 100 次，判断 i<100 100 次
j 会循环 100 _ 1000 次，判断 j<100 100 _ 1000 次
k 会循环 100 _ 1000 _ 10000 次，判断 k<100 100 _ 1000 _ 10000 次

2、i 会循环 10000 次，判断 i<100 10000 次
j 会循环 10000 _ 1000 次，判断 j<100 10000 _ 1000 次
k 会循环 100 _ 1000 _ 10000 次， 判断 k<100 100 _ 1000 _ 10000 次

虽然判断 k<100 的次数都是一样的 但是前面两种判断就不一样了，由此可以看见时间长短。

### 122.webpack 打包 vue 速度太慢怎么办？

1.使用`webpack-bundle-analyzer`对项目进行模块分析生成 report，查看 report 后看看哪些模块体积过大，然后针对性优化，比如我项目中引用了常用的 UI 库 element-ui 和 v-charts 等

2.配置 webpack 的`externals`，官方文档的解释：防止将某些`import`的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖。
所以，可以将体积大的库分离出来：

```
// ...
externals: {
    'element-ui': 'Element',
    'v-charts': 'VCharts'
}
```

3.然后在`main.js`中移除相关库的 import

4.在`index.html`模板文件中，添加相关库的`cdn`引用，如：

```
<script src="https://unpkg.com/element-ui@2.10.0/lib/index.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/v-charts/lib/index.min.js"></script>
```

经过以上的处理，再尝试编译打包，会发现速度快了一些。
有什么更好的方式或不对的地方欢迎指出

### 123.vue 是如何对数组方法进行变异的？例如 push、pop、splice 等方法

对于这些变异方法 vue 做了包裹，在原型上进行了拦截，调用原生的数组方法后，还会执行发布和变更的操作来触发视图的更新。

### 124.永久性重定向（301）和临时性重定向（302）对 SEO 有什么影响

1）301 redirect——301 代表永久性转移(Permanently Moved)，301 重定向是网页更改地址后对搜索引擎友好的最好方法，只要不是暂时搬移的情况,都建议使用 301 来做转址。
如果我们把一个地址采用 301 跳转方式跳转的话，搜索引擎会把老地址的 PageRank 等信息带到新地址，同时在搜索引擎索引库中彻底废弃掉原先的老地址。旧网址的排名等完全清零

2）302 redirect——302 代表暂时性转移(Temporarily Moved )，在前些年，不少 Black Hat SEO 曾广泛应用这项技术作弊，目前，各大主要搜索引擎均加强了打击力度，象 Google 前些年对 Business.com 以及近来对 BMW 德国网站的惩罚。即使网站客观上不是 spam，也很容易被搜寻引擎容易误判为 spam 而遭到惩罚。

### 125.算法题

如何将`[{id: 1}, {id: 2, pId: 1}, ...]` 的重复数组（有重复数据）转成树形结构的数组 `[{id: 1, child: [{id: 2, pId: 1}]}, ...]` （需要去重）

```js
const fn = arr => {
  const res = [];
  const map = arr.reduce((res, item) => ((res[item.id] = item), res), {});
  for (const item of Object.values(map)) {
    if (!item.pId) {
      res.push(item);
    } else {
      const parent = map[item.pId];
      parent.child = parent.child || [];
      parent.child.push(item);
    }
  }
  return res;
};
```

### 126.扑克牌问题

有一堆扑克牌，将牌堆第一张放到桌子上，再将接下来的牌堆的第一张放到牌底，如此往复；

> 最后桌子上的牌顺序为： (牌底) 1,2,3,4,5,6,7,8,9,10,11,12,13 (牌顶)；
>
> 问：原来那堆牌的顺序，用函数实现。

```js
function poke(arr) {
  let i = 1;
  let out = [];
  while (arr.length) {
    if (i % 2) {
      out.push(arr.shift());
    } else {
      arr.push(arr.shift());
    }
    i++;
  }
  return out;
}

function reverse(arr) {
  let i = 1;
  let out = [];
  while (arr.length) {
    if (i % 2) {
      out.unshift(arr.pop());
    } else {
      out.unshift(out.pop());
    }
    i++;
  }
  return out;
}

reverse([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
// [1, 12, 2, 8, 3, 11, 4, 9, 5, 13, 6, 10, 7]
```

### 127.如何用 css 或 js 实现多行文本溢出省略效果，考虑兼容性

单行：
overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
多行：
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3; //行数
overflow: hidden;
兼容：
p{position: relative; line-height: 20px; max-height: 40px;overflow: hidden;}
p::after{content: "..."; position: absolute; bottom: 0; right: 0; padding-left: 40px;
background: -webkit-linear-gradient(left, transparent, #fff 55%);
background: -o-linear-gradient(right, transparent, #fff 55%);
background: -moz-linear-gradient(right, transparent, #fff 55%);
background: linear-gradient(to right, transparent, #fff 55%);
}

### 129.输出以下代码执行结果

```js
function wait() {
  return new Promise(resolve => setTimeout(resolve, 10 * 1000));
}
>
async function main() {
  console.time();
  const x = wait();
  const y = wait();
  const z = wait();
  await x;
  await y;
  await z;
  console.timeEnd();
}
main();
```

### 130.输出以下代码执行结果，大致时间就好（不同于上题）

```js
function wait() {
  return new Promise(resolve => setTimeout(resolve, 10 * 1000));
}
>
async function main() {
  console.time();
  await wait();
  await wait();
  await wait();
  console.timeEnd();
}
main();
```

### 131.接口如何防刷

referer 校验
UA 校验
频率限制（1s 内接口调用次数限制）

把某个 key 加配料，带上时间戳，加密，请求时带上，过期或解密失败则 403。

### 132.实现一个 Dialog 类，Dialog 可以创建 dialog 对话框，对话框支持可拖拽（腾讯）

```js
class Dialog {
  constructor(text) {
    this.lastX = 0;
    this.lastY = 0;
    this.x;
    this.y;
    this.text = text || '';
    this.isMoving = false;
    this.dialog;
  }
  open() {
    const model = document.createElement('div');
    model.id = 'model';
    model.style = `
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        background-color:rgba(0,0,0,.3);
        display:flex;
        justify-content: center;
        align-items: center;`;
    model.addEventListener('click', this.close.bind(this));
    document.body.appendChild(model);
    this.dialog = document.createElement('div');
    this.dialog.style = `
        padding:20px;
        background-color:white`;
    this.dialog.innerText = this.text;
    this.dialog.addEventListener('click', e => {
      e.stopPropagation();
    });
    this.dialog.addEventListener('mousedown', this.handleMousedown.bind(this));
    document.addEventListener('mousemove', this.handleMousemove.bind(this));
    document.addEventListener('mouseup', this.handleMouseup.bind(this));
    model.appendChild(this.dialog);
  }
  close() {
    this.dialog.removeEventListener('mousedown', this.handleMousedown);
    document.removeEventListener('mousemove', this.handleMousemove);
    document.removeEventListener('mouseup', this.handleMouseup);
    document.body.removeChild(document.querySelector('#model'));
  }
  handleMousedown(e) {
    this.isMoving = true;
    this.x = e.clientX;
    this.y = e.clientY;
  }
  handleMousemove(e) {
    if (this.isMoving) {
      this.dialog.style.transform = `translate(${e.clientX - this.x + this.lastX}px,${e.clientY -
        this.y +
        this.lastY}px)`;
    }
  }
  handleMouseup(e) {
    this.lastX = e.clientX - this.x + this.lastX;
    this.lastY = e.clientY - this.y + this.lastY;
    this.isMoving = false;
  }
}
let dialog = new Dialog('Hello');
dialog.open();
```

### 133.用 setTimeout 实现 setInterval，阐述实现的效果与 setInterval 的差异

```js
function mySetInterval() {
  mySetInterval.timer = setTimeout(() => {
    arguments[0]();
    mySetInterval(...arguments);
  }, arguments[1]);
}

mySetInterval.clear = function() {
  clearTimeout(mySetInterval.timer);
};

mySetInterval(() => {
  console.log(11111);
}, 1000);

setTimeout(() => {
  // 5s 后清理
  mySetInterval.clear();
}, 5000);
```

### 136.如何实现骨架屏，说说你的思路

封装多个不同大小的模块
根据页面需求配置组合模块
请求数据并处理成功后替换
