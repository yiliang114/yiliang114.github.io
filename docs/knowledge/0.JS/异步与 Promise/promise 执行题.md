---
title: promise 执行题
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
// TODO: 这里应该还是异步？
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
// 在`Chrome 66`和`node v10`中，正确输出是
// script start
// async2 end
// Promise
// script end
// promise1
// promise2
// async1 end
// setTimeout
```

> **注意**：在新版本的浏览器中，`await`输出顺序被“提前”了，请看官耐心慢慢看。

#### 2. 流程解释

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

### 异步

```js
var p1 = new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error('p1 中failure')), 3000);
});

var p2 = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(p1), 1000);
});
var p3 = new Promise(function(resolve, reject) {
  resolve(2);
});
var p4 = new Promise(function(resolve, reject) {
  reject(new Error('error  in  p4'));
});

p3.then(re => console.log(re)); //?
p4.catch(error => console.log(error)); //?

p2.then(null, re => console.log(re)); //?
p2.catch(re => console.log(re)); //?
// 2， "error in p4 "这是立即打印出来的。
//  3S 后会打印出两个'p1 中 failure'
```

如果 3 直接写成`p2.then(re => console.log(re));`是会报错，说没有捕捉到错误。

```js
var p1 = .resolve(1)
var p2 = new (resolve => {
  setTimeout(() => resolve(2), 100)
})
var v3 = 3
var p4 = new ((resolve, reject) => {
  setTimeout(() => reject('oops'), 10)
})

var p5 = new (resolve => {
  setTimeout(() => resolve(5), 0)
})
var p1 = .resolve(1)
.race([v3, p1, p2, p4, p5]).then(val => console.log(val)) //?
.race([p1, v3, p2, p4, p5]).then(val => console.log(val)) // ?
.race([p1, p2, p4, p5]).then(val => console.log(val)) // ?
.race([p2, p4, p5]).then(val => console.log(val)) //?
```

打印顺序是：6 3 1 1 5

```js
function 1() {
  return new (function(resolve, reject) {
    for (let i = 0; i < 2; i++) {
      console.log('111')
    }
    resolve(true)
  })
}
function 2() {
  return new (function(resolve, reject) {
    for (let i = 0; i < 2; i++) {
      console.log('222')
    }
    resolve(true)
  })
}

setTimeout(function() {
  console.log('333')
}, 0) // 这是是会执行的。考察的是异步执行，js的任务队列

.all([1(), 2()]).then(function() {
  console.log('All Done!')
})
```

> 结果是：

```js
'111';
'111';
'222';
'222';
'All Done!';
'333';
```

### 异步笔试题

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

```js
setTimeout(() => {
  console.log(1);
}, 0);

new Promise(resolve => {
  // Promise 构造函数是同步执行
  console.log(2);
  resolve();
  console.log(3);
}).then(() => {
  console.log(4);
});

console.log(5);
// 2 3 5 4 1
```

```js
setTimeout(_ => console.log(4));

new Promise(resolve => {
  resolve();
  console.log(1);
}).then(_ => {
  console.log(3);
});

console.log(2);
// 1,2,3,4
```

Promise 构造函数里面的内容都是同步执行的。setTimeout 就是作为宏任务来存在的，而 Promise.then 则是具有代表性的微任务。

```js
Promise.resolve()
  .then(() => {
    console.log(0);
    return Promise.resolve(4);
  })
  .then(res => console.log(res));

Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });
// 0, 1, 2, 3, 4, 5, 6
```

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
// Promise 的构造函数是同步执行的？
// 1,2,4,3
```

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
// promise1 Promise {<pending>}
// promise2 Promise {<pending>}
// promise1 Promise {<fulfilled>: "success"}
// promise2 Promise {<rejected>: Error: error!!!}
```

```js
// 状态只会改变一次
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
// then: success1
// Promise {<fulfilled>: "success1"}
```

```js
// 可以一直 then catch
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
// 1, 2
```

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
// then:  Error: error!!!
```

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('once');
    resolve('success');
  }, 1000);
});

const start = Date.now();
// TODO: ???
promise.then(res => {
  console.log(res, Date.now() - start);
});
promise.then(res => {
  console.log(res, Date.now() - start);
});
// TODO:
// once
// success 1004
// success 1005
```

```js
const promise = Promise.resolve().then(() => {
  return promise;
});
promise.catch(console.error);
// 会报错
// TypeError: Chaining cycle detected for promise
```

```js
//  then 中 使用了 return，那么 return 的值会被 Promise.resolve() 包装
Promise.resolve(1)
  .then(res => {
    console.log(res); // => 1
    return 2; // 包装成 Promise.resolve(2)
  })
  .then(res => {
    console.log(res); // => 2
  });
```

```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log);
// 1
// TODO: 因为中间步骤没有最终改变 resolve 的值 ？
```

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
// fail2:  Error: error
```

```js
// TODO: process.nextTick 微任务，但是貌似比 promise 慢一点？
process.nextTick(() => {
  console.log('nextTick');
});
Promise.resolve().then(() => {
  console.log('then');
});
// 宏任务，感觉类似 setTimeout
setImmediate(() => {
  console.log('setImmediate');
});
console.log('end');
// end
// then
// nextTick
// setImmediate
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

#### async & await

```js
try {
  function test(id) {
    return new Promise(async (resolve, reject) => {});
  }
  // 需要注意的是一个 function 只是 return 一个 promise 但是没有 resolve 或者 rejected 的话，await 是没有结果的，也不会进行赋值。
  const a = await test();
  console.log(a);
} catch (error) {
  console.error('error', error);
}
// 此处 a 不会被打印
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
// 因为异步已经在执行了
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

## 执行顺序

### promise 与 setTimeout 判断执行顺序

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
// TODO:
// b
// promise 2
// setTimeout2
```

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
