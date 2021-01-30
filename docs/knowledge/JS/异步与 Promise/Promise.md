---
title: Promise
date: '2020-10-26'
draft: true
---

## JS 异步解决方案的发展历程以及优缺点。

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

## Promise 概念

```js
new Promise((resolve, reject) => {
  console.log('promise 1');
  resolve(1);
});
// promise 1
// 说明 promise 构造函数是立即执行的。
```

Promise 是 ES6 新增的语法，是异步编程的一种解决方案，解决了回调地狱的问题。比传统的解决方案--回调函数和事件更合理和更强大。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。

Promise 对象有以下两个特点。

1. 对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：Pending（进行中）、Fulfilled（已成功）和 Rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise 对象的状态改变，只有两种可能：从 Pending 变为 Fulfilled 和从 Pending 变为 Rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 Resolved（已定型）。如果改变已经发生了，你再对 Promise 对象添加回调函数，也会立即得到这个结果。

依照 Promise/A+ 的定义，Promise 有三种状态：

- pending: 初始状态, 进行中
- resolved: 已完成
- rejected: 已失败

执行 new 的时候状态就开始变化。promise 对象身上有两个方法：then()，和 catch()。

### 基本用法

Promise 对象是一个构造函数，用来生成 Promise 实例。下面代码创造了一个 Promise 实例。

```js
var promise = new Promise(function(resolve, reject) {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

resolve 函数的作用是，将 Promise 对象的状态从“未完成”变为“成功”（即从 Pending 变为 Resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；reject 函数的作用是，将 Promise 对象的状态从“未完成”变为“失败”（即从 Pending 变为 Rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise 实例生成以后，可以用 then 方法分别指定 Resolved 状态和 Rejected 状态的回调函数。

```js
promise.then(
  function(value) {
    // success
  },
  function(error) {
    // failure
  },
);
```

then 函数返回的也是一个 Promise 对象。所以可以一直 then 下去。

then 方法可以接受两个回调函数作为参数。第一个回调函数是 Promise 对象的状态变为 Resolved 时调用，第二个回调函数是 Promise 对象的状态变为 Rejected 时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受 Promise 对象传出的值作为参数。

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

上面代码中，Promise 新建后立即执行，所以首先输出的是 Promise。然后，then 方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以 Resolved 最后输出。

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

> `Promise` 对象的错误具有“冒泡”性质，**会一直向后传递，直到被捕获为止**。也就是说，错误总是会被下一个`catch`语句捕获

### "吃掉错误"机制

> `Promise`会吃掉内部的错误，并不影响外部代码的运行。所以需要`catch`，以防丢掉错误信息。

阮一峰大大给出的 demo：

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

还有如下 demo

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

## Promise 构造函数是同步执行还是异步执行，那么 then 方法呢？

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

## promise 场景题

- 什么时候 promise 不会被销毁
- promise 如果没有 resolve 会怎么样？
- promise 什么情况会发生内存泄漏
- Promise 中 .then 的第二参数与 .catch 有什么区别?

## Promise

- 定义：包含异步操作结果的对象

- 状态

  - **进行中**：`pending`
  - **已成功**：`resolved`
  - **已失败**：`rejected`

- 特点

  - 对象的状态不受外界影响
  - 一旦状态改变就不会再变，任何时候都可得到这个结果

- 声明：`new Promise((resolve, reject) => {})`

- 出参

  - **resolve**：将状态从`未完成`变为`成功`，在异步操作成功时调用，并将异步操作的结果作为参数传递出去
  - **reject**：将状态从`未完成`变为`失败`，在异步操作失败时调用，并将异步操作的错误作为参数传递出去

- 方法

  - then()

    ：分别指定

    ```
    resolved状态
    ```

    和

    ```
    rejected状态
    ```

    的回调函数

    - **第一参数**：状态变为`resolved`时调用
    - **第二参数**：状态变为`rejected`时调用(可选)

  - **catch()**：指定发生错误时的回调函数

  - Promise.all()

    ：将多个实例包装成一个新实例，返回全部实例状态变更后的结果数组(

    齐变更再返回

    )

    - 入参：具有`Iterator接口`的数据结构
    - 成功：只有全部实例状态变成`resolved`，最终状态才会变成`resolved`
    - 失败：其中一个实例状态变成`rejected`，最终状态就会变成`rejected`

  - **Promise.race()**：将多个实例包装成一个新实例，返回全部实例状态优先变更后的结果(先变更先返回)

  - Promise.resolve()

    ：将对象转为 Promise 对象(等价于

    ```
    new Promise(resolve => resolve())
    ```

    )

    - **Promise 实例**：原封不动地返回入参
    - **Thenable 对象**：将此对象转为 Promise 对象并返回(Thenable 为包含`then()`的对象，执行`then()`相当于执行此对象的`then()`)
    - **不具有 then()的对象**：将此对象转为 Promise 对象并返回，状态为`resolved`
    - **不带参数**：返回 Promise 对象，状态为`resolved`

  - **Promise.reject()**：将对象转为状态为`rejected`的 Promise 对象(等价于`new Promise((resolve, reject) => reject())`)

> 应用场景

- 加载图片
- AJAX 转 Promise 对象

> 重点难点

- 只有异步操作的结果可决定当前状态是哪一种，其他操作都无法改变这个状态
- 状态改变只有两种可能：从`pending`变为`resolved`、从`pending`变为`rejected`
- 一旦新建`Promise对象`就会立即执行，无法中途取消
- 不设置回调函数，内部抛错不会反应到外部
- 当处于`pending`时，无法得知目前进展到哪一个阶段
- 实例状态变为`resolved`或`rejected`时，会触发`then()`绑定的回调函数
- `resolve()`和`reject()`的执行总是晚于本轮循环的同步任务
- `then()`返回新实例，其后可再调用另一个`then()`
- `then()`运行中抛出错误会被`catch()`捕获
- `reject()`的作用等同于抛出错误
- 实例状态已变成`resolved`时，再抛出错误是无效的，不会被捕获，等于没有抛出
- 实例状态的错误具有`冒泡`性质，会一直向后传递直到被捕获为止，错误总是会被下一个`catch()`捕获
- 不要在`then()`里定义`rejected`状态的回调函数(不使用其第二参数)
- 建议使用`catch()`捕获错误，不要使用`then()`第二个参数捕获
- 没有使用`catch()`捕获错误，实例抛错不会传递到外层代码，即`不会有任何反应`
- 作为参数的实例定义了`catch()`，一旦被`rejected`并不会触发`Promise.all()`的`catch()`
- `Promise.reject()`的参数会原封不动地作为`rejected`的理由，变成后续方法的参数

## Generator

- 定义：封装多个内部状态的异步编程解决方案

- 形式：调用`Generator函数`(该函数不执行)返回指向内部状态的指针对象(不是运行结果)

- 声明：`function* Func() {}`

- 方法

  - **next()**：使指针移向下一个状态，返回`{ done, value }`(入参会被当作上一个`yield命令表达式`的返回值)
  - **return()**：返回指定值且终结遍历`Generator函数`，返回`{ done: true, value: 入参 }`
  - **throw()**：在`Generator函数`体外抛出错误，在`Generator函数`体内捕获错误，返回自定义的`new Errow()`

- yield 命令：声明内部状态的值(

  ```
  return
  ```

  声明结束返回的值)

  - 遇到`yield命令`就暂停执行后面的操作，并将其后表达式的值作为返回对象的`value`
  - 下次调用`next()`时，再继续往下执行直到遇到下一个`yield命令`
  - 没有再遇到`yield命令`就一直运行到`Generator函数`结束，直到遇到`return语句`为止并将其后表达式的值作为返回对象的`value`
  - `Generator函数`没有`return语句`则返回对象的`value`为`undefined`

- yield\*命令：在一个`Generator函数`里执行另一个`Generator函数`(后随具有`Iterator接口`的数据结构)

- 遍历：通过`for-of`自动调用`next()`

- 作为对象属性

  - 全写：`const obj = { method: function*() {} }`
  - 简写：`const obj = { * method() {} }`

- 上下文：执行产生的`上下文环境`一旦遇到`yield命令`就会暂时退出堆栈(但并不消失)，所有变量和对象会冻结在`当前状态`，等到对它执行`next()`时，这个`上下文环境`又会重新加入调用栈，冻结的变量和对象恢复执行

> 方法异同

- 相同点：`next()`、`throw()`、`return()`本质上是同一件事，作用都是让函数恢复执行且使用不同的语句替换`yield命令`
- 不同点
  - **next()**：将`yield命令`替换成一个`值`
  - **return()**：将`yield命令`替换成一个`return语句`
  - **throw()**：将`yield命令`替换成一个`throw语句`

> 应用场景

- 异步操作同步化表达
- 控制流管理
- 为对象部署 Iterator 接口：把`Generator函数`赋值给对象的`Symbol.iterator`，从而使该对象具有`Iterator接口`
- 作为具有 Iterator 接口的数据结构

> 重点难点

- 每次调用`next()`，指针就从`函数头部`或`上次停下的位置`开始执行，直到遇到下一个`yield命令`或`return语句`为止
- 函数内部可不用`yield命令`，但会变成单纯的`暂缓执行函数`(还是需要`next()`触发)
- `yield命令`是暂停执行的标记，`next()`是恢复执行的操作
- `yield命令`用在另一个表达式中必须放在`圆括号`里
- `yield命令`用作函数参数或放在赋值表达式的右边，可不加`圆括号`
- `yield命令`本身没有返回值，可认为是返回`undefined`
- `yield命令表达式`为惰性求值，等`next()`执行到此才求值
- 函数调用后生成遍历器对象，此对象的`Symbol.iterator`是此对象本身
- 在函数运行的不同阶段，通过`next()`从外部向内部注入不同的值，从而调整函数行为
- 首个`next()`用来启动遍历器对象，后续才可传递参数
- 想首次调用`next()`时就能输入值，可在函数外面再包一层
- 一旦`next()`返回对象的`done`为`true`，`for-of`遍历会中止且不包含该返回对象
- 函数内部部署`try-finally`且正在执行`try`，那么`return()`会导致立刻进入`finally`，执行完`finally`以后整个函数才会结束
- 函数内部没有部署`try-catch`，`throw()`抛错将被外部`try-catch`捕获
- `throw()`抛错要被内部捕获，前提是必须`至少执行过一次next()`
- `throw()`被捕获以后，会附带执行下一条`yield命令`
- 函数还未开始执行，这时`throw()`抛错只可能抛出在函数外部

> 首次 next()可传值

```
function Wrapper(func) {
    return function(...args) {
        const generator = func(...args);
        generator.next();
        return generator;
    }
}
const print = Wrapper(function*() {
    console.log(`First Input: ${yield}`);
    return "done";
});
print().next("hello");

```
