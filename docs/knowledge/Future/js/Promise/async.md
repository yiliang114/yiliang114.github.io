---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### async 函数是什么，有什么作用？

`async`函数可以理解为内置自动执行器的`Generator`函数语法糖，它配合`ES6`的`Promise`近乎完美的实现了异步编程解决方案。

Async/Await 就是一个自执行的 generate 函数。利用 generate 函数的特性把异步的代码写成“同步”的形式。

async 函数返回一个 Promise 对象，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。可以理解为，是让出了线程，跳出了 async 函数体。

### async 和 await

一个函数如果加上 `async` ，那么该函数就会返回一个 `Promise`

```js
async function test() {
  return '1';
}
console.log(test()); // -> Promise {<resolved>: "1"}
```

可以把 `async` 看成将函数返回值使用 `Promise.resolve()` 包裹了下。`await` 只能在 `async` 函数中使用

```js
function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('finish');
      resolve('sleep');
    }, 2000);
  });
}
async function test() {
  let value = await sleep();
  console.log('object');
}
test();
```

上面代码会先打印 `finish` 然后再打印 `object` 。因为 `await` 会等待 `sleep` 函数 `resolve` ，所以即使后面是同步代码，也不会先去执行同步代码再来执行异步代码。

`async 和 await` 相比直接使用 `Promise` 来说，优势在于处理 `then` 的调用链，能够更清晰准确的写出代码。缺点在于滥用 `await` 可能会导致性能问题，因为 `await` 会阻塞代码，也许之后的异步代码并不依赖于前者，但仍然需要等待前者完成，导致代码失去了并发性。

下面来看一个使用 `await` 的代码。

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

当然也存在一些缺点，因为 **await 将异步代码改造成了同步代码**，如果多个异步代码没有依赖性却使用了 await 会导致性能上的降低。

```js
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch(url);
  await fetch(url1);
  await fetch(url2);
}
```

看一个使用 await 的例子：

```js
let a = 0;
let b = async () => {
  a = a + (await 10);
  console.log('2', a);
};
b();
a++;
console.log('1', a);

//先输出  ‘1’, 1
//在输出  ‘2’, 10
```

上述解释中提到了 await 内部实现了 generator，其实 **await 就是 generator 加上 Promise 的语法糖，且内部实现了自动执行 generator**。

### 使用 async/await 需要注意什么？

1. await 命令后面的 Promise 对象，运行结果可能是 rejected，此时等同于 async 函数返回的 Promise 对象被 reject。因此需要加上错误处理，可以给每个 await 后的 Promise 增加 catch 方法；也可以将 await 的代码放在 try...catch 中。
2. 多个 await 命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。
3. await 命令只能用在 async 函数之中，如果用在普通函数，会报错。
4. async 函数可以保留运行堆栈。

### Async/Await 如何通过同步的方式实现异步

Async/Await 就是一个**自执行**的 generate 函数。利用 generate 函数的特性把异步的代码写成“同步”的形式。

```js
var fetch = require('node-fetch');

function* gen() {
  // 这里的*可以看成 async
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url); // 这里的yield可以看成 await
  console.log(result.bio);
}
var g = gen();
var result = g.next();

result.value
  .then(function(data) {
    return data.json();
  })
  .then(function(data) {
    g.next(data);
  });
```

### async、await

`Generator` 函数的语法糖。有更好的语义、更好的适用性、返回值是 `Promise`。

- `async => *`
- `await => yield`

```js
// 基本用法

async function timeout(ms) {
  await new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
async function asyncConsole(value, ms) {
  await timeout(ms);
  console.log(value);
}
asyncConsole('hello async and await', 1000);
```

注：最好把 2，3，4 连到一起讲

### promise.all 结合 async await

```js
const getBook = async bookName => {
  const book = await fetchBook(bookName);

  return Promise.all([fetchAuthor(book.authorId), fetchRating(book.id)]).then(results => ({
    ...book,
    author: results[0],
    rating: results[1],
  }));
};
```

这样操作能够让多个异步请求接口同时发出请求，并行执行可以减少接口请求的时间

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
// b
// promise 2
// setTimeout2
```

### async 函数的使用

```js
function repeat(func, times, wait) {}
// 输入
const repeatFunc = repeat(alert, 4, 3000);

// 输出
// 会alert4次 helloworld, 每次间隔3秒
repeatFunc('hellworld');
// 会alert4次 worldhellp, 每次间隔3秒
repeatFunc('worldhello');
```

我自己的实现，没有成功。这种实现是 setTimeout 新建了两个，然而只清理了一个。

```js
function repeat(func, times, wait) {
  var timer = null;
  var count = 0;
  return function(...args) {
    timer = setInterval(function() {
      func.apply(null, args);
      count++;
      console.log('count', count, 'times', times);
      if (count >= times) {
        clearInterval(timer);
      }
    }, wait);
  };
}
// 输入
const repeatFunc = repeat(console.log, 4, 3000);
// 输出
// 会alert4次 helloworld, 每次间隔3秒
repeatFunc('hellworld');
// 会alert4次 worldhellp, 每次间隔3秒
repeatFunc('worldhello');
```

正确解法：使用 async/await 来实现

```js
async function wait(seconds) {
  return new Promise(res => {
    setTimeout(res, seconds);
  });
}

function repeat(func, times, s) {
  return async function(...args) {
    for (let i = 0; i < times; i++) {
      func.apply(null, args);
      await wait(s);
    }
  };
}

let log = console.log;
let repeatFunc = repeat(log, 4, 3000);
repeatFunc('HelloWorld');
repeatFunc('WorldHello');
```

### async 执行练习

- await 后面的才是异步的，之前都是同步的

```js
async function async1() {
  console.log('async1 start'); // 2
  await async2();
  console.log('async1 end'); // 6
}

async function async2() {
  console.log('async2'); // 3
}

console.log('script start'); //  1

setTimeout(function() {
  console.log('setTimeout'); // 8
}, 0);

async1();

new Promise(function(resolve) {
  console.log('promise1'); // 4
  resolve();
}).then(function() {
  console.log('promise2'); // 7
});

console.log('script end'); // 5
```

### setTimeout、Promise、Async/Await 的区别

我觉得这题主要是考察这三者在事件循环中的区别，事件循环中分为宏任务队列和微任务队列。
其中 setTimeout 的回调函数放到宏任务队列里，等到执行栈清空以后执行；
promise.then 里的回调函数会放到相应宏任务的微任务队列里，等宏任务里面的同步代码执行完再执行；async 函数表示函数里面可能会有异步方法，await 后面跟一个表达式，async 方法执行时，遇到 await 会立即执行表达式，然后把表达式后面的代码放到微任务队列里，让出执行栈让同步代码先执行。

#### 1. setTimeout

```js
console.log('script start'); //1. 打印 script start
setTimeout(function() {
  console.log('settimeout'); // 4. 打印 settimeout
}); // 2. 调用 setTimeout 函数，并定义其完成后执行的回调函数
console.log('script end'); //3. 打印 script start
// 输出顺序：script start->script end->settimeout
```

#### 2. Promise

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
  console.log('settimeout');
});
console.log('script end');
// 输出顺序: script start->promise1->promise1 end->script end->promise2->settimeout
```

当 JS 主线程执行到 Promise 对象时，

- promise1.then() 的回调就是一个 task
- promise1 是 resolved 或 rejected: 那这个 task 就会放入当前事件循环回合的 microtask queue
- promise1 是 pending: 这个 task 就会放入 事件循环的未来的某个(可能下一个)回合的 microtask queue 中
- setTimeout 的回调也是个 task ，它会被放入 macrotask queue 即使是 0ms 的情况

#### 3. async/await

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

[![在这里插入图片描述](https://camo.githubusercontent.com/127fb6994c3e219bae33573cc46aab7f97b7367b/68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f32303139303133313137343431333536322e706e67)](https://camo.githubusercontent.com/127fb6994c3e219bae33573cc46aab7f97b7367b/68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f32303139303133313137343431333536322e706e67)
很显然，func1 的运行结果其实就是一个 Promise 对象。因此我们也可以使用 then 来处理后续逻辑。

```js
func1().then(res => {
  console.log(res); // 30
});
```

await 的含义为等待，也就是 async 函数需要等待 await 后的函数执行完成并且有了返回结果（Promise 对象）之后，才能继续执行下面的代码。await 通过返回一个 Promise 对象来实现同步的效果。

### setTimeout、Promise、Async/Await 的区别

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
  Promise 新建后立即执行,promise 提供 promise.all,promise.race,promise.resolve,promise.rejecr 等方法
- async/await
- async/await 是写异步代码的新方式，以前的方法有回调函数和 Promise。
- async/await 是基于 Promise 实现的，它不能用于普通的回调函数。
- async/await 与 Promise 一样，是非阻塞的。
- async/await 使得异步代码看起来像同步代码，这正是它的魔力所在

#### 不同点：

then 和 settimeout 执行顺序，即 setTimeout(fn, 0)在下一轮“事件循环”开始时执行，Promise.then()在本轮“事件循环”结束时执行。因此 then 函数先输出，settimeout 后输出。
例子：

```js
var p1 = new Promise(function(resolve, reject){
    resolve(1);
})
setTimeout(function(){
  console.log("will be executed at the top of the next Event Loop");
},0)
p1.then(function(value){
  console.log("p1 fulfilled");
})
setTimeout(function(){
  console.log("will be executed at the bottom of the next Event Loop");
},0)
p1 fulfilled
will be executed at the top of the next Event Loop
will be executed at the bottom of the next Event Loop
```

原因：

> JavaScript 将异步任务分为 MacroTask 和 MicroTask，

- MacroTask 包含 MacroTask Queue（宏任务队列）主要包括 setTimeout,setInterval, setImmediate, requestAnimationFrame, NodeJS 中的 I/O 等。
- MicroTask 包含独立回调 microTask：如 Promise，其成功／失败回调函数相互独立；复合回调 microTask：如 Object.observe, MutationObserver 和 NodeJs 中的 process.nextTick ，不同状态回调在同一函数体；

- js 执行顺序
- 依次执行同步代码直至执行完毕；
- 检查 MacroTask 队列，若有触发的异步任务，则取第一个并调用其事件处理函数，然后跳至第三步，若没有需处理的异步任务，则直接跳至第三步；
- 检查 MicroTask 队列，然后执行所有已触发的异步任务，依次执行事件处理函数，直至执行完毕，然后跳至第二步，若没有需处理的异步任务中，则直接返回第二步，依次>执行后续步骤；
- 最后返回第二步，继续检查 MacroTask 队列，依次执行后续步骤；
- 如此往复，若所有异步任务处理完成，则结束；

promise 与 asyns/await 的不同：
asyns 函数前面多了一个 aync 关键字。await 关键字只能用在 aync 定义的函数内。async 函数会隐式地返回一个 promise，该 promise 的 reosolve 值就是函数 return 的值。
任何一个 await 语句后面的 Promise 对象变为 reject 状态，那么整个 async 函数都会中断执行
相同点：
async 函数的返回值是 Promise 对象，可以使用 then 方法添加回调函数，这一点与 promise 类似
希望多个请求并发执行，可以使用 Promise.all 方法
promise 和 setTimeout 都会被放入任务队列

### 简单实现 async/await 中的 async 函数

async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里

```js
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (e) {
        return reject(e);
      }
      if (next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(
        function(v) {
          step(function() {
            return gen.next(v);
          });
        },
        function(e) {
          step(function() {
            return gen.throw(e);
          });
        },
      );
    }
    step(function() {
      return gen.next(undefined);
    });
  });
}
```

### Async/Await 如何通过同步的方式实现异步

原理：

```
async function test() {
 // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
 // 如果有依赖性的话，其实就是解决回调地狱的例子了
 await fetch('XXX1')
 await fetch('XXX2')
 await fetch('XXX3')
}
```

### 异步笔试题

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

// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```
