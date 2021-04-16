---
title: Event Loop
date: 2020-10-26
draft: true
---

## JS 运行机制

js 将所有任务分成两种，一种是同步任务，另一种是异步任务。在所有同步任务执行完之前，任何的异步任务是不会执行的。一般来说，有以下四种会放入异步任务队列:

1. setTimeout 和 setInterval
2. DOM 事件
3. ES6 中的 Promise
4. Ajax 异步请求

## JS 代码是如何执行的

在执行一段代码时，JS 引擎会首先创建一个执行栈
然后 JS 引擎会创建一个全局执行上下文，并 push 到执行栈中, 这个过程 JS 引擎会为这段代码中所有变量分配内存并赋一个初始值（undefined），在创建完成后，JS 引擎会进入执行阶段，这个过程 JS 引擎会逐行的执行代码，即为之前分配好内存的变量逐个赋值(真实值)。
如果这段代码中存在 function 的声明和调用，那么 JS 引擎会创建一个函数执行上下文，并 push 到执行栈中，其创建和执行过程跟全局执行上下文一样。但有特殊情况，即当函数中存在对其它函数的调用时，JS 引擎会在父函数执行的过程中，将子函数的全局执行上下文 push 到执行栈，这也是为什么子函数能够访问到父函数内所声明的变量。
还有一种特殊情况是，在子函数执行的过程中，父函数已经 return 了，这种情况下，JS 引擎会将父函数的上下文从执行栈中移除，与此同时，JS 引擎会为还在执行的子函数上下文创建一个闭包，这个闭包里保存了父函数内声明的变量及其赋值，子函数仍然能够在其上下文中访问并使用这边变量/常量。当子函数执行完毕，JS 引擎才会将子函数的上下文及闭包一并从执行栈中移除。
最后，JS 引擎是单线程的，那么它是如何处理高并发的呢？即当代码中存在异步调用时 JS 是如何执行的。比如 setTimeout 或 fetch 请求都是 non-blocking 的，当异步调用代码触发时，JS 引擎会将需要异步执行的代码移出调用栈，直到等待到返回结果，JS 引擎会立即将与之对应的回调函数 push 进任务队列中等待被调用，当调用(执行)栈中已经没有需要被执行的代码时，JS 引擎会立刻将任务队列中的回调函数逐个 push 进调用栈并执行。这个过程我们也称之为事件循环。

## 为什么要设计成单线程？

浏览器端的脚本主要的任务就是处理用户的交互，而用户的交互无非就是响应 DOM 上的一些事件/增删改 DOM 中的元素。
这决定了多线程会带来很复杂的同步问题。

举个例子：如果 js 被设计了多线程，如果有一个线程要修改一个 dom 元素，另一个线程要删除这个 dom 元素，此时浏览器就会一脸茫然，不知所措。所以，为了避免复杂性，从一诞生，JavaScript 就是单线程，这已经成了这门语言的核心特征，将来也不会改变

## Event Loop

### 宏任务、微任务

浏览器端事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。**宏任务队列可以有多个，微任务队列只有一个**。

- 常见的 macro-task 比如：setTimeout、setInterval、setImmediate、script（整体代码）、 I/O 操作、UI 渲染等。
- 常见的 micro-task 比如: new Promise().then(回调)、MutationObserver(html5 新特性)、process.nextTick 等。

因为 Promise 属于微任务，setTimeout 属于宏任务。

```js
// 两个函数都会一直执行，卡死为止。
function a() {
  console.log('a');
  setTimeout(a);
}

a();

function b() {
  console.log('b');
  Promise.resolve().then(b);
}

b();
```

**微任务**

- `process.nextTick`
- `promise`
- `Object.observe`
- `MutationObserver`

**宏任务**

- `script`
- `setTimeout`
- `setInterval`
- `setImmediate`
- `I/O`
- `UI rendering`

这里很多人会有个误区，认为微任务快于宏任务，其实是错误的。因为宏任务中包括了 `script` ，浏览器会**先执行一个宏任务**，接下来有异步代码的话才会先执行微任务。

#### 关于 setTimeOut、setImmediate、process.nextTick()的比较

#### setTimeout()

将事件插入到了事件队列，必须等到当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。
当主线程时间执行过长，无法保证回调会在事件指定的时间执行。浏览器端每次 setTimeout 会有 4ms 的延迟，当连续执行多个 setTimeout，有可能会阻塞进程，造成性能问题。

#### setImmediate()

服务端 node 提供的方法。事件插入到事件队列尾部，主线程和事件队列的函数执行完成之后立即执行。和 setTimeout(fn,0)的效果差不多。

#### process.nextTick()

服务器端 node 提供的办法。插入到事件队列尾部，但在下次事件队列之前会执行。它指定的任务总是发生在所有异步任务之前，当前主线程的末尾。

大致流程：当前”执行栈”的尾部–>下一次 Event Loop（主线程读取”任务队列”）之前–>触发 process 指定的回调函数。

用此方法可以用于处于异步延迟的问题。

### 浏览器中的 Event Loop

异步事件会被放置到对应的宏任务队列或者微任务队列中去，当**执行栈**为空的时候，主线程会首先查看微任务中的事件，如果微任务不是空的那么执行微任务中的事件，如果没有，则在宏任务中取出最前面的一个事件。把对应的回调加入当前**执行栈**...如此反复，进入循环。

浏览器中的 Event Loop 执行顺序：

- 首先执行同步代码，这属于宏任务
- 当执行完所有同步代码后，执行栈为空，查询是否有异步代码需要执行
- 执行所有微任务
- 当执行完所有微任务后，如有必要会渲染页面
- 然后开始下一轮 Event Loop，执行宏任务中的异步代码，也就是 `setTimeout` 中的回调函数

### Node 中的 Event Loop

Node 中的 Event Loop 和浏览器中的是完全不相同的东西。

Node 的 Event Loop 分为 6 个阶段，它们会按照**顺序**反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

日常开发中的绝大部分异步任务都是在`timers`、`poll`、`check`这 3 个阶段处理的。

#### 1. timer

timers 阶段会执行 `setTimeout` 和 `setInterval` 回调，并且是由 poll 阶段控制的。

同样，在 Node 中定时器指定的时间也不是准确时间，只能是**尽快**执行。

#### 2. I/O

I/O 阶段会处理一些上一轮循环中的**少数未执行**的 I/O 回调

#### 3. idle, prepare

idle, prepare 阶段内部实现，这里就忽略不讲了。

#### 4. poll

poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情

1. 回到 timer 阶段执行回调
2. 执行 I/O 回调

并且在进入该阶段时如果没有设定了 timer 的话，会发生以下两件事情

- 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
- 如果 poll 队列为空时，会有两件事发生
  - 如果有 `setImmediate` 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
  - 如果没有 `setImmediate` 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去

当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调。

#### 5. check

check 阶段执行 `setImmediate`

setImmediate() 的回调会被加入 check 队列中，从 event loop 的阶段图可以知道，check 阶段的执行顺序在 poll 阶段之后。
我们先来看个例子:

```js
console.log('start');
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(function() {
    console.log('promise1');
  });
}, 0);
setTimeout(() => {
  console.log('timer2');
  Promise.resolve().then(function() {
    console.log('promise2');
  });
}, 0);
Promise.resolve().then(function() {
  console.log('promise3');
});
console.log('end');
//start=>end=>promise3=>timer1=>timer2=>promise1=>promise2
```

- 一开始执行栈的同步任务（这属于宏任务）执行完毕后（依次打印出 start end，并将 2 个 timer 依次放入 timer 队列）,会先去执行微任务（**这点跟浏览器端的一样**），所以打印出 promise3
- 然后进入 timers 阶段，执行 timer1 的回调函数，打印 timer1，并将 promise.then 回调放入 micro-task 队列，同样的步骤执行 timer2，打印 timer2；这点跟浏览器端相差比较大，**timers 阶段有几个 setTimeout/setInterval 都会依次执行**，并不像浏览器端，每执行一个宏任务后就去执行一个微任务（关于 Node 与浏览器的 Event Loop 差异，下文还会详细介绍）。

#### 6. close callbacks

close callbacks 阶段执行 close 事件

在以上的内容中，我们了解了 Node 中的 Event Loop 的执行顺序，接下来我们将会通过代码的方式来深入理解这块内容。

首先在有些情况下，定时器的执行顺序其实是**随机**的

```js
setTimeout(() => {
  console.log('setTimeout');
}, 0);
setImmediate(() => {
  console.log('setImmediate');
});
```

对于以上代码来说，`setTimeout` 可能执行在前，也可能执行在后

- 首先 `setTimeout(fn, 0) === setTimeout(fn, 1)`，这是由源码决定的
- 进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 timer 阶段就会直接执行 `setTimeout` 回调
- 那么如果准备时间花费小于 1ms，那么就是 `setImmediate` 回调先执行了

当然在某些情况下，他们的执行顺序一定是固定的，比如以下代码：

```js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

在上述代码中，`setImmediate` 永远**先执行**。因为两个代码写在 IO 回调中，IO 回调是在 poll 阶段执行，当回调执行完毕后队列为空，发现存在 `setImmediate` 回调，所以就直接跳转到 check 阶段去执行回调了。

上面介绍的都是 macro-task 的执行情况，对于 micro-task 来说，它会在以上每个阶段完成前**清空** micro-task 队列，下图中的 Tick 就代表了 micro-task

```js
setTimeout(() => {
  console.log('timer21');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
});
```

对于以上代码来说，其实和浏览器中的输出是一样的，micro-task 永远执行在 macro-task 前面。

最后我们来讲讲 Node 中的 `process.nextTick`，这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会**清空队列中的所有回调函数**，并且优先于其他 micro-task 执行。

```js
setTimeout(() => {
  console.log('timer1');

  Promise.resolve().then(function() {
    console.log('promise1');
  });
}, 0);

process.nextTick(() => {
  console.log('nextTick');
  process.nextTick(() => {
    console.log('nextTick');
    process.nextTick(() => {
      console.log('nextTick');
      process.nextTick(() => {
        console.log('nextTick');
      });
    });
  });
});
```

对于以上代码，大家可以发现无论如何，永远都是先把 nextTick 全部打印出来。

#### 六个阶段

其中 libuv 引擎中的事件循环分为 6 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

![](https://camo.githubusercontent.com/992acfd5750f98c9a56a9a96e95111bdf7cc7669/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031392f312f31322f313638343162643938363063316565393f773d33353926683d33333126663d706e6726733d3130353037)

从上图中，大致看出 node 中的事件循环的顺序：

外部输入数据-->轮询阶段(poll)-->检查阶段(check)-->关闭事件回调阶段(close callback)-->定时器检测阶段(timer)-->I/O 事件回调阶段(I/O callbacks)-->闲置阶段(idle, prepare)-->轮询阶段（按照该顺序反复运行）...

- timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调
- I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
- idle, prepare 阶段：仅 node 内部使用
- poll 阶段：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里
- check 阶段：执行 setImmediate() 的回调
- close callbacks 阶段：执行 socket 的 close 事件回调

注意：**上面六个阶段都不包括 process.nextTick()**(下文会介绍)

#### 注意点

##### (1) setTimeout 和 setImmediate

二者非常相似，区别主要在于调用时机不同。

- setImmediate 设计在 poll 阶段完成时执行，即 check 阶段；
- setTimeout 设计在 poll 阶段为空闲时，且设定时间到达后执行，但它在 timer 阶段执行

```js
setTimeout(function timeout() {
  console.log('timeout');
}, 0);
setImmediate(function immediate() {
  console.log('immediate');
});
```

- 对于以上代码来说，setTimeout 可能执行在前，也可能执行在后。
- 首先 setTimeout(fn, 0) === setTimeout(fn, 1)，这是由源码决定的
  进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 timer 阶段就会直接执行 setTimeout 回调
- 如果准备时间花费小于 1ms，那么就是 setImmediate 回调先执行了

但当二者在异步 i/o callback 内部调用时，总是先执行 setImmediate，再执行 setTimeout

```js
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
// immediate
// timeout
```

在上述代码中，setImmediate 永远先执行。因为两个代码写在 IO 回调中，IO 回调是在 poll 阶段执行，当回调执行完毕后队列为空，发现存在 setImmediate 回调，所以就直接跳转到 check 阶段去执行回调了。

##### (2) process.nextTick

这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 micro-task 执行。

```js
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(function() {
    console.log('promise1');
  });
}, 0);
process.nextTick(() => {
  console.log('nextTick');
  process.nextTick(() => {
    console.log('nextTick');
    process.nextTick(() => {
      console.log('nextTick');
      process.nextTick(() => {
        console.log('nextTick');
      });
    });
  });
});
// nextTick=>nextTick=>nextTick=>nextTick=>timer1=>promise1
```

### Node 与浏览器的 Event Loop 差异

浏览器和 Node 环境下，micro-task 任务队列的执行时机不同

- Node 端，micro-task 在事件循环的各个阶段之间执行
- 浏览器端，micro-task 在事件循环的 macro-task 执行完之后执行

接下我们通过一个例子来说明两者区别：

```js
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(function() {
    console.log('promise1');
  });
}, 0);

setTimeout(() => {
  console.log('timer2');
  Promise.resolve().then(function() {
    console.log('promise2');
  });
}, 0);
```

浏览器端运行结果：`timer1 => promise1 => timer2 => promise2`

Node 端运行结果分两种情况：

- 如果是 node11 版本一旦执行一个阶段里的一个宏任务 (setTimeout,setInterval 和 setImmediate) 就立刻执行微任务队列，这就跟浏览器端运行一致，最后的结果为`timer1=>promise1=>timer2=>promise2`
- 如果是 node10 及其之前版本：要看第一个定时器执行完，第二个定时器是否在完成队列中。

  - 如果是第二个定时器还未在完成队列中，最后的结果为`timer1=>promise1=>timer2=>promise2`
  - 如果是第二个定时器已经在完成队列中，则最后的结果为`timer1=>timer2=>promise1=>promise2`(下文过程解释基于这种情况下)

    1.全局脚本（main()）执行，将 2 个 timer 依次放入 timer 队列，main()执行完毕，调用栈空闲，任务队列开始执行；

    2.首先进入 timers 阶段，执行 timer1 的回调函数，打印 timer1，并将 promise1.then 回调放入 micro-task 队列，同样的步骤执行 timer2，打印 timer2；

    3.至此，timer 阶段执行结束，event loop 进入下一个阶段之前，执行 micro-task 队列的所有任务，依次打印 promise1、promise2

Node 端的处理过程如下：

![](https://camo.githubusercontent.com/34b3491060826045c67bd57c6dcf97222620a722/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031392f312f31322f313638343164356638353436383034373f773d35393826683d33333326663d67696626733d343637363635)
