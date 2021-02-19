---
title: Event Loop
date: '2020-10-26'
draft: true
---

## Event Loop

概括：异步事件会被放置到对应的宏任务队列或者微任务队列中去，当执行栈为空的时候，主线程会首先查看微任务中的事件，如果微任务不是空的那么执行微任务中的事件，如果没有，则在宏任务中取出最前面的一个事件。把对应的回调加入当前执行栈...如此反复，进入循环。

### 执行栈

可以把执行栈认为是一个存储函数调用的**栈结构**，遵循先进后出的原则。

![执行栈可视化](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/1670d2d20ead32ec.jpg)

当开始执行 JS 代码时，首先会执行一个 `main` 函数，然后执行我们的代码。根据先进后出的原则，后执行的函数会先弹出栈，在图中我们也可以发现，`foo` 函数后执行，当执行完毕后就从栈中弹出了。

平时在开发中，大家也可以在报错中找到执行栈的痕迹

```js
function foo() {
  throw new Error('error');
}
function bar() {
  foo();
}
bar();
```

![函数执行顺序](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/1670c0e21540090c.jpg)

大家可以在上图清晰的看到报错在 `foo` 函数，`foo` 函数又是在 `bar` 函数中调用的。

当我们使用递归的时候，因为栈可存放的函数是有**限制**的，一旦存放了过多的函数且没有得到释放的话，就会出现爆栈的问题

```js
function bar() {
  bar();
}
bar();
```

### Micro-Task 与 Macro-Task

浏览器端事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。**宏任务队列可以有多个，微任务队列只有一个**。

- 常见的 macro-task 比如：setTimeout、setInterval、setImmediate、script（整体代码）、 I/O 操作、UI 渲染等。
- 常见的 micro-task 比如: new Promise().then(回调)、MutationObserver(html5 新特性)、process.nextTick 等。

因为 Promise 属于微任务，setTimeout 属于宏任务。所以这也就是为什么 `setTimeout` 会比 `Promise` 后执行，明明代码写在 `Promise` 之前。

### 浏览器中的 Event Loop

执行 JS 代码其实就是往执行栈中放入函数，当遇到异步的代码时，会被**挂起**并在需要执行的时候加入到 Task（有多种 Task） 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为。

不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 **微任务**（micro-task） 和 **宏任务**（macro-task）。在 ES6 规范中，micro-task 称为 `jobs`，macro-task 称为 `task`。下面来看以下代码的执行顺序：

```js
console.log('script start');

async function async1() {
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2 end');
}
async1();

setTimeout(function() {
  console.log('setTimeout');
}, 0);

new Promise(resolve => {
  console.log('Promise');
  resolve();
})
  .then(function() {
    console.log('promise1');
  })
  .then(function() {
    console.log('promise2');
  });

console.log('script end');
// script start => async2 end => Promise => script end => promise1 => promise2 => async1 end => setTimeout
```

> 注意：新的浏览器中不是如上打印的，因为 await 变快了，具体内容可以往下看
> 以上代码虽然 `setTimeout` 写在 `Promise` 之前，但是因为 `Promise` 属于微任务而 `setTimeout` 属于宏任务

首先先来解释下上述代码的 `async` 和 `await` 的执行顺序。当我们调用 `async1` 函数时，会马上输出 `async2 end`，并且函数返回一个 `Promise`，接下来在遇到 `await`的时候会就让出线程开始执行 `async1` 外的代码，所以我们完全可以把 `await` 看成是**让出线程**的标志。

然后当同步代码全部执行完毕以后，就会去执行所有的异步代码，那么又会回到 `await` 的位置执行返回的 `Promise` 的 `resolve` 函数，这又会把 `resolve` 丢到微任务队列中，接下来去执行 `then` 中的回调，当两个 `then` 中的回调全部执行完毕以后，又会回到 `await` 的位置处理返回值，这时候你可以看成是 `Promise.resolve(返回值).then()`，然后 `await` 后的代码全部被包裹进了 `then` 的回调中，所以 `console.log('async1 end')` 会优先执行于 `setTimeout`。

如果你觉得上面这段解释还是有点绕，那么我把 `async` 的这两个函数改造成你一定能理解的代码

```js
new Promise((resolve, reject) => {
  console.log('async2 end');
  // Promise.resolve() 将代码插入微任务队列尾部
  // resolve 再次插入微任务队列尾部
  resolve(Promise.resolve());
}).then(() => {
  console.log('async1 end');
});
```

也就是说，如果 `await` 后面跟着 `Promise` 的话，`async1 end` 需要等待三个 tick 才能执行到。那么其实这个性能相对来说还是略慢的，所以 V8 团队借鉴了 Node 8 中的一个 Bug，在引擎底层将三次 tick 减少到了二次 tick。

所以 Event Loop 执行顺序如下所示：

- 首先执行同步代码，这属于宏任务
- 当执行完所有同步代码后，执行栈为空，查询是否有异步代码需要执行
- 执行所有微任务
- 当执行完所有微任务后，如有必要会渲染页面
- 然后开始下一轮 Event Loop，执行宏任务中的异步代码，也就是 `setTimeout` 中的回调函数

所以以上代码虽然 `setTimeout` 写在 `Promise` 之前，但是因为 `Promise` 属于微任务而 `setTimeout` 属于宏任务，所以会有以上的打印。

微任务包括 `process.nextTick` ，`promise` ，`MutationObserver`。

宏任务包括 `script` ， `setTimeout` ，`setInterval` ，`setImmediate` ，`I/O` ，`UI rendering`。

这里很多人会有个误区，认为微任务快于宏任务，其实是错误的。因为宏任务中包括了 `script` ，浏览器会**先执行一个宏任务**，接下来有异步代码的话才会先执行微任务。

### JS 中的 event loop

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

> 宏任务中包括了 script ，浏览器会先执行一个宏任务，接下来有异步代码的话就先执行微任务

**所以正确的一次 Event loop 顺序是这样的**

- 执行同步代码，这属于宏任务
- 执行栈为空，查询是否有微任务需要执行
- 执行所有微任务
- 必要的话渲染 UI
- 然后开始下一轮 `Event loop`，执行宏任务中的异步代码

### Node 中的 Event Loop

Node 中的 Event Loop 和浏览器中的是完全不相同的东西。

Node 的 Event Loop 分为 6 个阶段，它们会按照**顺序**反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

![img](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/1670c3fe3f9a5e2b.jpg)

#### timer

timers 阶段会执行 `setTimeout` 和 `setInterval` 回调，并且是由 poll 阶段控制的。

同样，在 Node 中定时器指定的时间也不是准确时间，只能是**尽快**执行。

#### I/O

I/O 阶段会处理一些上一轮循环中的**少数未执行**的 I/O 回调

#### idle, prepare

idle, prepare 阶段内部实现，这里就忽略不讲了。

#### poll

poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情

1. 回到 timer 阶段执行回调
2. 执行 I/O 回调

并且在进入该阶段时如果没有设定了 timer 的话，会发生以下两件事情

- 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
- 如果 poll 队列为空时，会有两件事发生
  - 如果有 `setImmediate` 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
  - 如果没有 `setImmediate` 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去

当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调。

#### check

check 阶段执行 `setImmediate`

#### close callbacks

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

![img](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/16710fb80dd42d27.jpg)

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

接下去我们详细介绍`timers`、`poll`、`check`这 3 个阶段，因为日常开发中的绝大部分异步任务都是在这 3 个阶段处理的。

##### (1) timer

timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的。
同样，**在 Node 中定时器指定的时间也不是准确时间，只能是尽快执行**。

##### (2) poll

poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情

1.回到 timer 阶段执行回调

2.执行 I/O 回调

并且在进入该阶段时如果没有设定了 timer 的话，会发生以下两件事情

- 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
- 如果 poll 队列为空时，会有两件事发生
  - 如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
  - 如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去

当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调。

##### (3) check 阶段

setImmediate()的回调会被加入 check 队列中，从 event loop 的阶段图可以知道，check 阶段的执行顺序在 poll 阶段之后。
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

### Node 中的 Event loop

- `Node` 中的 `Event loop` 和浏览器中的不相同。
- `Node` 的 `Event loop` 分为`6`个阶段，它们会按照顺序反复运行

```js
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──connections───     │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

**timer**

- `timers` 阶段会执行 `setTimeout` 和 `setInterval`
- 一个 timer 指定的时间并不是准确时间，而是在达到这个时间后尽快执行回调，可能会因为系统正在执行别的事务而延迟

**I/O**

- `I/O` 阶段会执行除了 `close` 事件，定时器和 `setImmediate` 的回调

idle, prepare
idle, prepare 阶段内部实现

**poll**

- `poll` 阶段很重要，这一阶段中，系统会做两件事情

  - 执行到点的定时器
  - 执行 `poll` 队列中的事件

- 并且当 poll 中没有定时器的情况下，会发现以下两件事情
  - 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者系统限制
  - 如果 poll 队列为空，会有两件事发生
  - 如果有 `setImmediate` 需要执行，`poll` 阶段会停止并且进入到 `check` 阶段执行 `setImmediate`
  - 如果没有 `setImmediate` 需要执行，会等待回调被加入到队列中并立即执行回调
  - 如果有别的定时器需要被执行，会回到 `timer` 阶段执行回调。

**check**

- `check` 阶段执行 `setImmediate`

**close callbacks**

- `close callbacks` 阶段执行 `close` 事件
- 并且在 `Node` 中，有些情况下的定时器执行顺序是随机的

```js
setTimeout(() => {
  console.log('setTimeout');
}, 0);
setImmediate(() => {
  console.log('setImmediate');
});
// 这里可能会输出 setTimeout，setImmediate
// 可能也会相反的输出，这取决于性能
// 因为可能进入 event loop 用了不到 1 毫秒，这时候会执行 setImmediate
// 否则会执行 setTimeout
```

> 上面介绍的都是 macro-task 的执行情况，micro-task 会在以上每个阶段完成后立即执行

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

// 以上代码在浏览器和 node 中打印情况是不同的
// 浏览器中一定打印 timer1, promise1, timer2, promise2
// node 中可能打印 timer1, timer2, promise1, promise2
// 也可能打印 timer1, promise1, timer2, promise2
```

> `Node` 中的 `process.nextTick` 会先于其他 `micro-task` 执行

```js
setTimeout(() => {
  console.log('timer1');

  Promise.resolve().then(function() {
    console.log('promise1');
  });
}, 0);

process.nextTick(() => {
  console.log('nextTick');
});
// nextTick, timer1, promise1
```

主要的区别在于浏览器的 event loop 和 nodejs 的 event loop 在处理异步事件的顺序是不同的,nodejs 中有 micro event;其中 Promise 属于 micro event 该异步事件的处理顺序就和浏览器不同.nodejs V11.0 以上 这两者之间的顺序就相同了.

浏览器下事件循环(Event Loop):
微任务 micro-task(jobs): promise / ajax / Object.observe(该方法已废弃)
宏任务 macro-task(task): setTimout / script / IO / UI Rendering

Node 的 Event Loop

- timer 阶段: 执行到期的 setTimeout / setInterval 队列回调
- I/O 阶段: 执行上轮循环残流的 callback
- idle, prepare
- poll: 等待回调

  - 执行回调
  - 执行定时器

    - 到期的 setTimeout / setInterval， 则返回 timer 阶段
    - 如有 setImmediate，则前往 check 阶段

- check

  - 执行 setImmediate

- close callbacks

### Node 与浏览器的 Event Loop 差异

> 在浏览器和 Node 中 Event Loop 其实是不相同的

**浏览器环境下，micro-task 的任务队列是每个 macro-task 执行完之后执行。而在 Node.js 中，micro-task 会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行 micro-task 队列的任务**。
![](https://camo.githubusercontent.com/71b607cd363565c5d61299d31d9fd72b889de645/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031392f312f31322f313638343162616431636461373431663f773d3130353126683d33343426663d706e6726733d3932363835)

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

浏览器端运行结果：`timer1=>promise1=>timer2=>promise2`

浏览器端的处理过程如下：

![](https://camo.githubusercontent.com/b325e476f0336804b8bdbcd7e4e3674a52dfbd80/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031392f312f31322f313638343164363339326538663533373f773d36313126683d33343126663d67696626733d373232393739)

Node 端运行结果分两种情况：

- 如果是 node11 版本一旦执行一个阶段里的一个宏任务(setTimeout,setInterval 和 setImmediate)就立刻执行微任务队列，这就跟浏览器端运行一致，最后的结果为`timer1=>promise1=>timer2=>promise2`
- 如果是 node10 及其之前版本：要看第一个定时器执行完，第二个定时器是否在完成队列中。

  - 如果是第二个定时器还未在完成队列中，最后的结果为`timer1=>promise1=>timer2=>promise2`
  - 如果是第二个定时器已经在完成队列中，则最后的结果为`timer1=>timer2=>promise1=>promise2`(下文过程解释基于这种情况下)

    1.全局脚本（main()）执行，将 2 个 timer 依次放入 timer 队列，main()执行完毕，调用栈空闲，任务队列开始执行；

    2.首先进入 timers 阶段，执行 timer1 的回调函数，打印 timer1，并将 promise1.then 回调放入 micro-task 队列，同样的步骤执行 timer2，打印 timer2；

    3.至此，timer 阶段执行结束，event loop 进入下一个阶段之前，执行 micro-task 队列的所有任务，依次打印 promise1、promise2

Node 端的处理过程如下：
![](https://camo.githubusercontent.com/34b3491060826045c67bd57c6dcf97222620a722/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031392f312f31322f313638343164356638353436383034373f773d35393826683d33333326663d67696626733d343637363635)

### 宏任务和微任务的打印顺序

```js
setTimeout(_ => console.log(4));

new Promise(resolve => {
  resolve();
  console.log(1);
}).then(_ => {
  console.log(3);
});

console.log(2);
```

Promise 构造函数里面的内容都是同步执行的。setTimeout 就是作为宏任务来存在的，而 Promise.then 则是具有代表性的微任务，上述代码的执行顺序就是按照序号来输出的。

### setTimeout 和 promise 的区别？宏任务和微任务是什么？有什么区别？

宏任务队列可以有多个，微任务队列只有一个。

宏任务：script（全局任务）, setTimeout, setInterval, setImmediate, I/O, UI rendering.
微任务：process.nextTick, Promise, Object.observer, MutationObserver.

取一个宏任务来执行。执行完毕后，下一步。
取一个微任务来执行，执行完毕后，再取一个微任务来执行。直到微任务队列为空，执行下一步。
更新 UI 渲染。

写出下面的执行结果：

```js
console.log('1');

setTimeout(function() {
  console.log('2');
  new Promise(function(resolve) {
    console.log('3');
    resolve();
  }).then(function() {
    console.log('4');
  });
});

new Promise(function(resolve) {
  console.log('5');
  resolve();
}).then(function() {
  console.log('6');
});

setTimeout(function() {
  console.log('7');

  new Promise(function(resolve) {
    console.log('8');
    resolve();
  }).then(function() {
    console.log('9');
  });
});
```

结果是：
1 5 6 2 3 4 7 8 9

### 总结

浏览器和 Node 环境下，micro-task 任务队列的执行时机不同

- Node 端，micro-task 在事件循环的各个阶段之间执行
- 浏览器端，micro-task 在事件循环的 macro-task 执行完之后执行

#### promise 与 setTimeout 判断执行顺序

promise 和 setTimeout 都会将事件放入异步队列，但 setTimeout 即便是写 0，也会有 4ms 的延迟

```js
console.log('begin');

setTimeout(() => {
  console.log('setTimeout 1');

  Promise.resolve()
    .then(() => {
      console.log('promise 1');
      setTimeout(() => {
        console.log('setTimeout2');
      });
    })
    .then(() => {
      console.log('promise 2');
    });

  new Promise(resolve => {
    console.log('a');
    resolve();
  }).then(() => {
    console.log('b');
  });
}, 0);
console.log('end');

// begin
// end
// setTimeout 1
// a
// promise 1
// b
// promise 2
// setTimeout2
```

### setTimeout、Promise、Async/Await 的区别

主要是考察这三者在事件循环中的区别，事件循环中分为宏任务队列和微任务队列。
其中 setTimeout 的回调函数放到宏任务队列里，等到执行栈清空以后执行；
promise.then 里的回调函数会放到相应宏任务的微任务队列里，等宏任务里面的同步代码执行完再执行；async 函数表示函数里面可能会有异步方法，await 后面跟一个表达式，async 方法执行时，遇到 await 会立即执行表达式，然后把表达式后面的代码放到微任务队列里，让出执行栈让同步代码先执行。

##### 1. setTimeout

```js
console.log('script start'); //1. 打印 script start
setTimeout(function() {
  console.log('setTimeout'); // 4. 打印 setTimeout
}); // 2. 调用 setTimeout 函数，并定义其完成后执行的回调函数
console.log('script end'); //3. 打印 script start
// 输出顺序：script start->script end->setTimeout
```

##### 2. Promise

Promise 本身是**同步的立即执行函数**， 当在 executor 中执行 resolve 或者 reject 的时候, 此时是异步操作， 会先执行 then/catch 等，当主栈完成后，才会去调用 resolve/reject 中存放的方法执行，打印 p 的时候，是打印的返回结果，一个 Promise 实例。

```js
console.log('script start');
let promise1 = new Promise(function(resolve) {
  console.log('promise1');
  resolve();
  console.log('promise1 end');
}).then(function() {
  console.log('promise2');
});
setTimeout(function() {
  console.log('setTimeout');
});
console.log('script end');
// 输出顺序: script start->promise1->promise1 end->script end->promise2->setTimeout
```

当 JS 主线程执行到 Promise 对象时，

- promise1.then() 的回调就是一个 task
- promise1 是 resolved 或 rejected: 那这个 task 就会放入当前事件循环回合的 micro-task queue
- promise1 是 pending: 这个 task 就会放入 事件循环的未来的某个(可能下一个)回合的 micro-task queue 中
- setTimeout 的回调也是个 task ，它会被放入 macro-task queue 即使是 0ms 的情况

##### 3. async/await

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
async1();
console.log('script end');

// 输出顺序：script start->async1 start->async2->script end->async1 end
```

async 函数返回一个 Promise 对象，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。可以理解为，是让出了线程，跳出了 async 函数体。

举个例子：

```js
async function func1() {
  return 1;
}

console.log(func1());
```

[![](https://camo.githubusercontent.com/127fb6994c3e219bae33573cc46aab7f97b7367b/68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f32303139303133313137343431333536322e706e67)](https://camo.githubusercontent.com/127fb6994c3e219bae33573cc46aab7f97b7367b/68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f32303139303133313137343431333536322e706e67)
很显然，func1 的运行结果其实就是一个 Promise 对象。因此我们也可以使用 then 来处理后续逻辑。

```js
func1().then(res => {
  console.log(res); // 30
});
```

await 的含义为等待，也就是 async 函数需要等待 await 后的函数执行完成并且有了返回结果（Promise 对象）之后，才能继续执行下面的代码。await 通过返回一个 Promise 对象来实现同步的效果。

- setTimeout 方法用于在指定的毫秒数后调用函数或计算表达式。setTimeout() 只是将事件插入了“任务队列”，必须等当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。要是当前代码消耗时间很长，也有可能要等很久，所以并没办法保证回调函数一定会在 setTimeout() 指定的时间执行。所以， setTimeout() 的第二个参数表示的是最少时间，并非是确切时间,setTimeout() 的第二个参数的最小值不得小于 4 毫秒，如果低于这个值，则默认是 4 毫秒
- 1.setTimeout 它会开启一个定时器线程，并不会影响后续的代码执行，这个定时器线程会在事件队列后面添加一个任务，
  当 js 线程在主线程执行其他线程代码完毕后，就会取出事件队列中的事件进行执行，
- 2.定时器中的 this 存在隐式丢失的情况

```js
var a = 0;
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo,
};
setTimeout(obj.foo, 100); //0
```

若想获得 obj 对象中的 a 属性值，可以将 obj.foo 函数放置在定时器中的匿名函数中进行隐式绑定

```js
var a = 0;
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo,
};
setTimeout(function() {
  obj.foo();
}, 100); //2
```

或者使用 bind 方法将 foo()方法的 this 绑定到 obj 上,call,apply 方法均可

```js
var a = 0;
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo,
};
setTimeout(obj.foo.bind(obj), 100); //2
```

- promise 就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果,将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数
  Promise 新建后立即执行,promise 提供 Promise.all,promise.race,promise.resolve,promise.rejecr 等方法
- async/await
- async/await 是写异步代码的新方式，以前的方法有回调函数和 Promise。
- async/await 是基于 Promise 实现的，它不能用于普通的回调函数。
- async/await 与 Promise 一样，是非阻塞的。
- async/await 使得异步代码看起来像同步代码，这正是它的魔力所在

##### 不同点：

then 和 setTimeout 执行顺序，即 setTimeout(fn, 0)在下一轮“事件循环”开始时执行，Promise.then()在本轮“事件循环”结束时执行。因此 then 函数先输出，setTimeout 后输出。
例子：

```js
var p1 = new Promise(function(resolve, reject) {
  resolve(1);
});
setTimeout(function() {
  console.log('will be executed at the top of the next Event Loop');
}, 0);
p1.then(function(value) {
  console.log('p1 fulfilled');
});
setTimeout(function() {
  console.log('will be executed at the bottom of the next Event Loop');
}, 0);
// p1 fulfilled
// will be executed at the top of the next Event Loop
// will be executed at the bottom of the next Event Loop
```

原因：

> JavaScript 将异步任务分为 macro-task 和 micro-task，

- macro-task 包含 macro-task Queue（宏任务队列）主要包括 setTimeout,setInterval, setImmediate, requestAnimationFrame, NodeJS 中的 I/O 等。
- micro-task 包含独立回调 micro-task：如 Promise，其成功／失败回调函数相互独立；复合回调 micro-task：如 Object.observe, MutationObserver 和 NodeJs 中的 process.nextTick ，不同状态回调在同一函数体；

- js 执行顺序
- 依次执行同步代码直至执行完毕；
- 检查 macro-task 队列，若有触发的异步任务，则取第一个并调用其事件处理函数，然后跳至第三步，若没有需处理的异步任务，则直接跳至第三步；
- 检查 micro-task 队列，然后执行所有已触发的异步任务，依次执行事件处理函数，直至执行完毕，然后跳至第二步，若没有需处理的异步任务中，则直接返回第二步，依次>执行后续步骤；
- 最后返回第二步，继续检查 macro-task 队列，依次执行后续步骤；
- 如此往复，若所有异步任务处理完成，则结束；
