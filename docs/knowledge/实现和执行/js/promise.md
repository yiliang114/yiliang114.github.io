---
title: 谈谈promise/async/await的执行顺序与V8引擎的BUG
date: 2020-12-23
draft: true
---

### 谈谈 promise/async/await 的执行顺序与 V8 引擎的 BUG

#### 1. 题目和答案

> 故事还是要从下面这道面试题说起：请问下面这段代码的输出是什么？

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
```

上述，在`Chrome 66`和`node v10`中，正确输出是：

```bash
script start
async2 end
Promise
script end
promise1
promise2
async1 end
setTimeout
```

> **注意**：在新版本的浏览器中，`await`输出顺序被“提前”了，请看官耐心慢慢看。

#### 2. 流程解释

边看输出结果，边做解释吧：

1. 正常输出`script start`
2. 执行`async1`函数，此函数中又调用了`async2`函数，输出`async2 end`。回到`async1`函数，**遇到了`await`，让出线程**。
3. 遇到`setTimeout`，扔到**下一轮宏任务队列**
4. 遇到`Promise`对象，立即执行其函数，输出`Promise`。其后的`resolve`，被扔到了微任务队列
5. 正常输出`script end`
6. 此时，此次`Event Loop`宏任务都执行完了。来看下第二步被扔进来的微任务，因为`async2`函数是`async`关键词修饰，因此，将`await async2`后的代码扔到微任务队列中
7. 执行第 4 步被扔到微任务队列的任务，输出`promise1`和`promise2`
8. 执行第 6 步被扔到微任务队列的任务，输出`async1 end`
9. 第一轮 EventLoop 完成，执行第二轮 EventLoop。执行`setTimeout`中的回调函数，输出`setTimeout`。

#### 3. 再谈 async 和 await

细心的朋友肯定会发现前面第 6 步，如果`async2`函数是没有`async`关键词修饰的一个普通函数呢？

```js
// 新的async2函数
function async2() {
  console.log('async2 end');
}
```

输出结果如下所示：

```bash
script start
async2 end
Promise
script end
async1 end
promise1
promise2
setTimeout
```

不同的结果就出现在前面所说的第 6 步：如果 await 函数后面的函数是普通函数，那么其后的微任务就正常执行；否则，会将其再放入微任务队列。

#### 4. 其实是 V8 引擎的 BUG

看到前面，正常人都会觉得真奇怪！（但是按照上面的诀窍倒也是可以理解）

然而 V8 团队确定了**这是个 bug**（很多强行解释要被打脸了），具体的 PR[请看这里](https://github.com/tc39/ecma262/pull/1250)。好在，这个问题已经在最新的 Chrome 浏览器中**被修复了**。

简单点说，前面两段不同代码的运行结果都是：

```bash
script start
async2 end
Promise
script end
async1 end
promise1
promise2
setTimeout
```

`await`就是让出线程，其后的代码放入微任务队列（不会再多一次放入的过程），就这么简单了。

### 异步笔试题

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

micro-task（又称为微任务），**可以理解是在当前 task 执行结束后立即执行的任务**。也就是说，在当前 task 任务后，下一个 task 之前，在渲染之前。

所以它的响应速度相比 setTimeout（setTimeout 是 task）会更快，因为无需等渲染。也就是说，在某一个 macro-task 执行完后，就会将在它执行期间产生的所有 micro-task 都执行完毕（在渲染前）。

micro-task 主要包含：Promise.then、MutaionObserver、process.nextTick(Node.js 环境)

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

很多人以为 await 会一直等待之后的表达式执行完之后才会继续执行后面的代码，**实际上 await 是一个让出线程的标志。await 后面的表达式会先执行一遍，将 await 后面的代码加入到 micro-task 中，然后就会跳出整个 async 函数来执行后面的代码。**

这里感谢[@chenjigeng](https://github.com/chenjigeng)的纠正：

由于因为 async await 本身就是 promise+generator 的语法糖。所以 await 后面的代码是 micro-task。所以对于本题中的

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

1. 首先，事件循环从宏任务(macro-task)队列开始，这个时候，宏任务队列中，只有一个 script(整体代码)任务；当遇到任务源(task source)时，则会先分发任务到对应的任务队列中去。所以，上面例子的第一步执行如下图所示：

   [![img](https://camo.githubusercontent.com/15b3ae9733b0b5b6a144f519396ff88eaeca40fb/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432316166332e706e67)](https://camo.githubusercontent.com/15b3ae9733b0b5b6a144f519396ff88eaeca40fb/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432316166332e706e67)

2. 然后我们看到首先定义了两个 async 函数，接着往下看，然后遇到了 `console` 语句，直接输出 `script start`。输出之后，script 任务继续往下执行，遇到 `setTimeout`，其作为一个宏任务源，则会先将其任务分发到对应的队列中：

   [![img](https://camo.githubusercontent.com/0a6e6cd2cc52d18a0f97ec01659058e830305a45/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432353530612e706e67)](https://camo.githubusercontent.com/0a6e6cd2cc52d18a0f97ec01659058e830305a45/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432353530612e706e67)

3. script 任务继续往下执行，执行了 async1()函数，前面讲过 async 函数中在 await 之前的代码是立即执行的，所以会立即输出`async1 start`。

   遇到了 await 时，会将 await 后面的表达式执行一遍，所以就紧接着输出`async2`，然后将 await 后面的代码也就是`console.log('async1 end')`加入到 micro-task 中的 Promise 队列中，接着跳出 async1 函数来执行后面的代码。

   [![img](https://camo.githubusercontent.com/93ec5469b0846f0f161641fc718005dbe994d190/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383333376165642e706e67)](https://camo.githubusercontent.com/93ec5469b0846f0f161641fc718005dbe994d190/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383333376165642e706e67)

4. script 任务继续往下执行，遇到 Promise 实例。由于 Promise 中的函数是立即执行的，而后续的 `.then` 则会被分发到 micro-task 的 `Promise` 队列中去。所以会先输出 `promise1`，然后执行 `resolve`，将 `promise2` 分配到对应队列。

   [![img](https://camo.githubusercontent.com/6f617a237607ce7a71fabcab61d2952a8b412205/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383334376135652e706e67)](https://camo.githubusercontent.com/6f617a237607ce7a71fabcab61d2952a8b412205/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383334376135652e706e67)

5. script 任务继续往下执行，最后只有一句输出了 `script end`，至此，全局任务就执行完毕了。

   根据上述，每次执行完一个宏任务之后，会去检查是否存在 micro-task(微任务)；如果有，则执行 micro-task(微任务) 直至清空 micro-task Queue。

   因而在 script 任务执行完毕之后，开始查找清空微任务队列。此时，微任务中， `Promise` 队列有的两个任务`async1 end`和`promise2`，因此按先后顺序输出 `async1 end，promise2`。当所有的 micro-task(微任务) 执行完毕之后，表示第一轮的循环就结束了。

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

在第一次 macro-task 执行完之后，也就是输出`script end`之后，会去清理所有 micro-task。所以会相继输出`promise2`，`async1 end` ，`promise4`，其余不再多说。

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

### 异步与 Promise 题

#### 题目一

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

#### 题目二

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 1000);
});
const promise2 = promise1.then(() => {
  throw new Error('error!!!');
});

console.log('promise1', promise1);
console.log('promise2', promise2);

setTimeout(() => {
  console.log('promise1', promise1);
  console.log('promise2', promise2);
}, 2000);
```

#### 题目三

```js
const promise = new Promise((resolve, reject) => {
  resolve('success1');
  reject('error');
  resolve('success2');
});

promise
  .then(res => {
    console.log('then: ', res);
  })
  .catch(err => {
    console.log('catch: ', err);
  });
```

#### 题目四

```js
Promise.resolve(1)
  .then(res => {
    console.log(res);
    return 2;
  })
  .catch(err => {
    return 3;
  })
  .then(res => {
    console.log(res);
  });
```

#### 题目五

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('once');
    resolve('success');
  }, 1000);
});

const start = Date.now();
promise.then(res => {
  console.log(res, Date.now() - start);
});
promise.then(res => {
  console.log(res, Date.now() - start);
});
```

#### 题目六

```js
Promise.resolve()
  .then(() => {
    return new Error('error!!!');
  })
  .then(res => {
    console.log('then: ', res);
  })
  .catch(err => {
    console.log('catch: ', err);
  });
```

#### 题目七

```js
const promise = Promise.resolve().then(() => {
  return promise;
});
promise.catch(console.error);
```

#### 题目八

```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log);
```

#### 题目九

```js
Promise.resolve()
  .then(
    function success(res) {
      throw new Error('error');
    },
    function fail1(e) {
      console.error('fail1: ', e);
    },
  )
  .catch(function fail2(e) {
    console.error('fail2: ', e);
  });
```

#### 题目十

```js
process.nextTick(() => {
  console.log('nextTick');
});
Promise.resolve().then(() => {
  console.log('then');
});
setImmediate(() => {
  console.log('setImmediate');
});
console.log('end');
```

#### 不会结束

首先需要注意的是一个 function 只是 return 一个 promise 但是没有 resolve 或者 rejected 的话，await 是没有结果的，也不会进行赋值。

```js
try {
  function test(id) {
    return new Promise(async (resolve, reject) => {});
  }
  const a = await test();
  console.log(a);
} catch (error) {
  console.error('error', error);
}
// 此处 a 不会被打印
```

#### 坑

```js
/**
 * Created by lin on 2018/8/16.
 */
// promise.then(...).catch(...);与promise.then(..., ...);并不等价，
// 尤其注意当promise.then(...).catch(...);中的then会抛异常的情况下。
const fn = () => {
  throw 2;
};

// promise.then(...).catch(...);
Promise.resolve(1) // { [[PromiseStatus]]:"resolved", [[PromiseValue]]:1 }
  .then(v => {
    // 1
    fn(); // 抛异常了，then返回一个rejected的promise
    return 3; // 后面不执行了
  }) // { [[PromiseStatus]]:"rejected", [[PromiseValue]]:2 }
  .catch(v => {
    // v是throw的值2
    console.log(v); // 2
    return 4; // catch返回一个resolved且值为4的promise
  }); // { [[PromiseStatus]]:"resolved", [[PromiseValue]]:4 }
// 程序最后正常结束

// promise.then(..., ...);
Promise.resolve(1) // { [[PromiseStatus]]:"resolved", [[PromiseValue]]:1 }
  .then(
    v => {
      // 1
      fn(); // 抛异常了，then返回一个rejected的promise
      return 3; // 后面不执行了
    },
    v => {
      // 这里只有then之前是rejected才执行
      console.log(v); // 不执行
      return 4; // 不执行
    },
  ); // { [[PromiseStatus]]:"rejected", [[PromiseValue]]:2 }
// 程序最后抛异常：Uncaught (in promise) 2
```

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

```js
function wait() {
  return new Promise(resolve => setTimeout(resolve, 10 * 100));
}
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
// 1s 左右
```

```js
function wait() {
  return new Promise(resolve => setTimeout(resolve, 10 * 100));
}
async function main() {
  console.time();
  await wait();
  await wait();
  await wait();
  console.timeEnd();
}
main();
// 3s 左右
```
