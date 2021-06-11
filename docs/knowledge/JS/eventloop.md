---
title: Event Loop
date: 2020-10-26
draft: true
---

## v8 引擎 JS 代码是如何执行的

在执行一段代码时，JS 引擎会首先创建一个执行栈。然后 JS 引擎会创建一个全局执行上下文，并 push 到执行栈中, 这个过程 JS 引擎会为这段代码中所有变量分配内存并赋一个初始值（undefined），在创建完成后，JS 引擎会进入执行阶段，这个过程 JS 引擎会逐行的执行代码，即为之前分配好内存的变量逐个赋值(真实值)。

如果这段代码中存在 function 的声明和调用，那么 JS 引擎会创建一个函数执行上下文，并 push 到执行栈中，其创建和执行过程跟全局执行上下文一样。但有特殊情况，即当函数中存在对其它函数的调用时，JS 引擎会在父函数执行的过程中，将子函数的全局执行上下文 push 到执行栈，这也是为什么子函数能够访问到父函数内所声明的变量。

还有一种特殊情况是，在子函数执行的过程中，父函数已经 return 了，这种情况下，JS 引擎会将父函数的上下文从执行栈中移除，与此同时，JS 引擎会为还在执行的子函数上下文创建一个闭包，这个闭包里保存了父函数内声明的变量及其赋值，子函数仍然能够在其上下文中访问并使用这边变量/常量。当子函数执行完毕，JS 引擎才会将子函数的上下文及闭包一并从执行栈中移除。

## JS 运行机制

js 将所有任务分成两种，一种是同步任务，另一种是异步任务。在所有同步任务执行完之前，任何的异步任务是不会执行的。一般来说，有以下四种会放入异步任务队列:

1. setTimeout 和 setInterval
2. DOM 事件
3. ES6 中的 Promise
4. Ajax 异步请求

## 为什么要设计成单线程？

浏览器端的脚本主要的任务就是处理用户的交互，而用户的交互无非就是响应 DOM 上的一些事件/增删改 DOM 中的元素。多线程会带来很复杂的同步问题。

举个例子：如果 js 被设计了多线程，如果有一个线程要修改一个 dom 元素，另一个线程要删除这个 dom 元素，此时浏览器就会一脸茫然，不知所措。所以，为了避免复杂性，从一诞生，JavaScript 就是单线程，这已经成了这门语言的核心特征，将来也不会改变

## JS 垃圾回收机制

垃圾收集机制的原理：找出那些不再继续使用的变量，然后释放其占用的内存。为此，垃圾收集器会按照固定的时间间隔周期性地执行这一操作。

### 引用计数

引用：在内存管理的环境中，一个对象如果有访问另一个对象的权限（隐式或者显式），叫做一个对象引用另一个对象。例如，一个 Javascript 对象具有对它原型的引用（隐式引用）和对它属性的引用（显式引用）。

引用计数：此算法把“对象是否不再需要”简化定义为“对象有没有其他对象引用到它”。如果没有引用指向该对象（零引用），对象将被垃圾回收机制回收。

限制：循环引用，如果两个对象相互引用，那么垃圾回收机制无法判定对象不再需要，因此这部分内存并不会被回收。DOM 中同样存在循环引用的情况，也会造成内存泄漏。

定义和用法：引用计数是跟踪记录每个值被引用的次数。

基本原理：就是变量的引用次数，被引用一次则加 1，当这个引用计数为 0 时，被视为准备回收的对象。

流程:

1. 声明了一个变量并将一个引用类型的值赋值给这个变量，这个引用类型值引用次数就是 1
1. 同一个值又被赋值另一个变量，这个引用类型的值引用次数加 1
1. 当包含这个引用类型值得变量又被赋值另一个值了，那么这个引用类型的值的引用次数减 1
1. 当引用次数变成 0 时， 说明这个值需要解除引用
1. 当垃圾回收机制下次运行时，它就会释放引用次数为 0 的值所占用的内存

### 标记清除

标记清除算法把“对象是否不再需要”简化定义为“对象是否可以获得”。

这个算法假定设置一个叫根的对象(在 JavaScript 中，根是全局对象)。垃圾回收器将定期从根开始，找到所有从根引用的对象，然后找到这些对象引用的对象......从根开始，垃圾回收器将找到所有可以获得的对象和收集所有不能获得的对象。

这个算法比前一个要好，因为“有零引用的对象”总是不可获得的，但是相反却不一定，参考“循环引用”。

定义和用法：

当变量进入环境时，将变量标记"进入环境"，当变量离开环境时，标记为："离开环境"。某一个时刻，垃圾回收器会过滤掉环境中的变量，以及被环境变量引用的变量，剩下的就是被视为准备回收的变量。

到目前为止，IE、Firefox、Opera、Chrome、Safari 的 js 实现使用的都是标记清除的垃圾回收策略或类似的策略，只不过垃圾收集的时间间隔互不相同。

流程：

1. 浏览器在运行的时候会给存储再内存中的所有变量都加上标记
1. 去掉环境中的变量以及被环境中引用的变量的标记
1. 如果还有变量有标记，就会被视为准备删除的变量
1. 垃圾回收机制完成内存的清除工作，销毁那些带标记的变量，并回收他们所占用的内存空间

### 掘金

在 JS 中，有两种内存回收算法。第一种是引用计数垃圾收集，第二种是标记-清除算法（从 2012 年起，所有现代浏览器都使用了标记-清除垃圾回收算法）。

#### 引用计数垃圾收集

如果一个对象没有被其他对象引用，那它将被垃圾回收机制回收。

```js
let o = { a: 1 };
```

一个对象被创建，并被 o 引用。

```js
o = null;
```

刚才被 o 引用的对象现在是零引用，将会被回收。

##### 循环引用

引用计数垃圾收集有一个缺点，就是循环引用会造成对象无法被回收。

```js
function f() {
  var o = {};
  var o2 = {};
  o.a = o2; // o 引用 o2
  o2.a = o; // o2 引用 o

  return 'azerty';
}

f();
```

在 f() 执行后，函数的局部变量已经没用了，一般来说，这些局部变量都会被回收。但上述例子中，o 和 o2 形成了循环引用，导致无法被回收。

#### 标记-清除算法

这个算法假定设置一个叫做根（root）的对象（在 Javascript 里，根是全局对象）。垃圾回收器将定期从根开始，找所有从根开始引用的对象，然后找这些对象引用的对象……从根开始，垃圾回收器将找到所有可以获得的对象和收集所有不能获得的对象。

对于刚才的例子来说，在 f() 执行后，由于 o 和 o2 从全局对象出发无法获取到，所以它们将会被回收。

#### 高效使用内存

在 JS 中能形成作用域的有函数、全局作用域、with，在 es6 还有块作用域。局部变量随着函数作用域销毁而被释放，全局作用域需要进程退出才能释放或者使用 delete 和赋空值 `null` `undefined`。

在 V8 中用 delete 删除对象可能会干扰 V8 的优化，所以最好通过赋值方式解除引用。

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
