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

### 异步

```js
setTimeout(() => {
  console.log(1);
}, 0);

new (resolve => {
  console.log(2);
  resolve();
  console.log(3);
}).then(() => {
  console.log(4);
});

console.log(5);
```

结果是：
2 3 5 4 1

```js
var p1 = new (function(resolve, reject) {
  setTimeout(() =>reject(new Error('p1 中failure')) , 3000);
})

var p2 = new (function(resolve, reject){
  setTimeout(() => resolve(p1), 1000);
});
var p3 = new (function(resolve, reject) {
  resolve(2);
});
var p4 = new (function(resolve, reject) {
  reject(new Error('error  in  p4'));
});

1. p3.then(re => console.log(re)); //?
2. p4.catch(error => console.log(error));//?

3. p2.then(null,re => console.log(re));//?
4. p2.catch(re => console.log(re));//?
```

打印的顺序是：2， "error in p4 "这是立即打印出来的。

而 3S 后会打印出两个'p1 中 failure'。

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
