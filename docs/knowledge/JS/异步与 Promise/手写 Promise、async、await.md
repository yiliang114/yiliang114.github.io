---
title: 手写 Promise、async、await
date: 2020-11-16
draft: true
---

### Promise 实现

```js
// 三种状态
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';
// promise 接收一个函数参数，该函数会立即执行
function MyPromise(fn) {
  let that = this;
  that.currentState = PENDING;
  that.value = undefined;
  // 用于保存 then 中的回调，只有当 promise
  // 状态为 pending 时才会缓存，并且每个实例至多缓存一个
  that.resolvedCallbacks = [];
  that.rejectedCallbacks = [];

  that.resolve = function(value) {
    if (value instanceof MyPromise) {
      // 如果 value 是个 Promise，递归执行
      return value.then(that.resolve, that.reject);
    }
    setTimeout(() => {
      // 异步执行，保证执行顺序
      if (that.currentState === PENDING) {
        that.currentState = RESOLVED;
        that.value = value;
        that.resolvedCallbacks.forEach(cb => cb());
      }
    });
  };

  that.reject = function(reason) {
    setTimeout(() => {
      // 异步执行，保证执行顺序
      if (that.currentState === PENDING) {
        that.currentState = REJECTED;
        that.value = reason;
        that.rejectedCallbacks.forEach(cb => cb());
      }
    });
  };
  // 用于解决以下问题
  // new Promise(() => throw Error('error))
  try {
    fn(that.resolve, that.reject);
  } catch (e) {
    that.reject(e);
  }
}

MyPromise.prototype.then = function(onResolved, onRejected) {
  var self = this;
  // 规范 2.2.7，then 必须返回一个新的 promise
  var promise2;
  // 规范 2.2.onResolved 和 onRejected 都为可选参数
  // 如果类型不是函数需要忽略，同时也实现了透传
  // Promise.resolve(4).then().then((value) => console.log(value))
  onResolved = typeof onResolved === 'function' ? onResolved : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : r => throw r;

  if (self.currentState === RESOLVED) {
    return (promise2 = new MyPromise(function(resolve, reject) {
      // 规范 2.2.4，保证 onFulfilled，onRjected 异步执行
      // 所以用了 setTimeout 包裹下
      setTimeout(function() {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === REJECTED) {
    return (promise2 = new MyPromise(function(resolve, reject) {
      setTimeout(function() {
        // 异步执行onRejected
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === PENDING) {
    return (promise2 = new MyPromise(function(resolve, reject) {
      self.resolvedCallbacks.push(function() {
        // 考虑到可能会有报错，所以使用 try/catch 包裹
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });

      self.rejectedCallbacks.push(function() {
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });
    }));
  }
};
// 规范 2.3
function resolutionProcedure(promise2, x, resolve, reject) {
  // 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
  if (promise2 === x) {
    return reject(new TypeError('Error'));
  }
  // 规范 2.3.2
  // 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      x.then(function(value) {
        // 再次调用该函数是为了确认 x resolve 的
        // 参数是什么类型，如果是基本类型就再次 resolve
        // 把值传给下个 then
        resolutionProcedure(promise2, value, resolve, reject);
      }, reject);
    } else {
      x.then(resolve, reject);
    }
    return;
  }
  // 规范 2.3.3.3.3
  // reject 或者 resolve 其中一个执行过得话，忽略其他的
  let called = false;
  // 规范 2.3.3，判断 x 是否为对象或者函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 规范 2.3.3.2，如果不能取出 then，就 reject
    try {
      // 规范 2.3.3.1
      let then = x.then;
      // 如果 then 是函数，调用 x.then
      if (typeof then === 'function') {
        // 规范 2.3.3.3
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            // 规范 2.3.3.3.1
            resolutionProcedure(promise2, y, resolve, reject);
          },
          e => {
            if (called) return;
            called = true;
            reject(e);
          },
        );
      } else {
        // 规范 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 规范 2.3.4，x 为基本类型
    resolve(x);
  }
}
```

### 实现一个简易版 Promise

```js
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

function MyPromise(fn) {
  const that = this;
  that.state = PENDING;
  that.value = null;
  that.resolvedCallbacks = [];
  that.rejectedCallbacks = [];
  // 待完善 resolve 和 reject 函数
  // 待完善执行 fn 函数
}
```

- 首先我们创建了三个常量用于表示状态，对于经常使用的一些值都应该通过常量来管理，便于开发及后期维护
- 在函数体内部首先创建了常量 `that`，因为代码可能会异步执行，用于获取正确的 `this` 对象
- 一开始 `Promise` 的状态应该是 `pending`
- `value` 变量用于保存 `resolve` 或者 `reject` 中传入的值
- `resolvedCallbacks` 和 `rejectedCallbacks` 用于保存 `then` 中的回调，因为当执行完 `Promise` 时状态可能还是等待中，这时候应该把 `then` 中的回调保存起来用于状态改变时使用

接下来我们来完善 `resolve` 和 `reject` 函数，添加在 `MyPromise` 函数体内部

```js
function resolve(value) {
  if (that.state === PENDING) {
    that.state = RESOLVED;
    that.value = value;
    that.resolvedCallbacks.map(cb => cb(that.value));
  }
}

function reject(value) {
  if (that.state === PENDING) {
    that.state = REJECTED;
    that.value = value;
    that.rejectedCallbacks.map(cb => cb(that.value));
  }
}
```

这两个函数代码类似，就一起解析了

- 首先两个函数都得判断当前状态是否为等待中，因为规范规定只有等待态才可以改变状态
- 将当前状态更改为对应状态，并且将传入的值赋值给 `value`
- 遍历回调数组并执行

完成以上两个函数以后，我们就该实现如何执行 `Promise` 中传入的函数了

```js
try {
  fn(resolve, reject);
} catch (e) {
  reject(e);
}
```

- 实现很简单，执行传入的参数并且将之前两个函数当做参数传进去
- 要注意的是，可能执行函数过程中会遇到错误，需要捕获错误并且执行 `reject` 函数

最后我们来实现较为复杂的 `then` 函数

```js
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  const that = this;
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : r => {
          throw r;
        };
  if (that.state === PENDING) {
    that.resolvedCallbacks.push(onFulfilled);
    that.rejectedCallbacks.push(onRejected);
  }
  if (that.state === RESOLVED) {
    onFulfilled(that.value);
  }
  if (that.state === REJECTED) {
    onRejected(that.value);
  }
};
```

- 首先判断两个参数是否为函数类型，因为这两个参数是可选参数

- 当参数不是函数类型时，需要创建一个函数赋值给对应的参数，同时也实现了透传，比如如下代码

  ```js
  // 该代码目前在简单版中会报错
  // 只是作为一个透传的例子
  Promise.resolve(4)
    .then()
    .then(value => console.log(value));
  ```

- 接下来就是一系列判断状态的逻辑，当状态不是等待态时，就去执行相对应的函数。如果状态是等待态的话，就往回调函数中 `push` 函数，比如如下代码就会进入等待态的逻辑

  ```js
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 0);
  }).then(value => {
    console.log(value);
  });
  ```

以上就是简单版 `Promise` 实现，接下来一小节是实现完整版 `Promise` 的解析，相信看完完整版的你，一定会对于 `Promise` 的理解更上一层楼。

### 实现一个符合 Promise/A+ 规范的 Promise

我们先来改造一下 `resolve` 和 `reject` 函数

```js
function resolve(value) {
  if (value instanceof MyPromise) {
    return value.then(resolve, reject);
  }
  setTimeout(() => {
    if (that.state === PENDING) {
      that.state = RESOLVED;
      that.value = value;
      that.resolvedCallbacks.map(cb => cb(that.value));
    }
  }, 0);
}
function reject(value) {
  setTimeout(() => {
    if (that.state === PENDING) {
      that.state = REJECTED;
      that.value = value;
      that.rejectedCallbacks.map(cb => cb(that.value));
    }
  }, 0);
}
```

- 对于 `resolve` 函数来说，首先需要判断传入的值是否为 `Promise` 类型
- 为了保证函数执行顺序，需要将两个函数体代码使用 `setTimeout` 包裹起来

接下来继续改造 `then` 函数中的代码，首先我们需要新增一个变量 `promise2`，因为每个 `then` 函数都需要返回一个新的 `Promise` 对象，该变量用于保存新的返回对象，然后我们先来改造判断等待态的逻辑

```js
if (that.state === PENDING) {
  return (promise2 = new MyPromise((resolve, reject) => {
    that.resolvedCallbacks.push(() => {
      try {
        const x = onFulfilled(that.value);
        resolutionProcedure(promise2, x, resolve, reject);
      } catch (r) {
        reject(r);
      }
    });

    that.rejectedCallbacks.push(() => {
      try {
        const x = onRejected(that.value);
        resolutionProcedure(promise2, x, resolve, reject);
      } catch (r) {
        reject(r);
      }
    });
  }));
}
```

- 首先我们返回了一个新的 `Promise` 对象，并在 `Promise` 中传入了一个函数
- 函数的基本逻辑还是和之前一样，往回调数组中 `push` 函数
- 同样，在执行函数的过程中可能会遇到错误，所以使用了 `try...catch` 包裹
- 规范规定，执行 `onFulfilled` 或者 `onRejected` 函数时会返回一个 `x`，并且执行 `Promise` 解决过程，这是为了不同的 `Promise` 都可以兼容使用，比如 JQuery 的 `Promise` 能兼容 ES6 的 `Promise`

接下来我们改造判断执行态的逻辑

```js
if (that.state === RESOLVED) {
  return (promise2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      try {
        const x = onFulfilled(that.value);
        resolutionProcedure(promise2, x, resolve, reject);
      } catch (reason) {
        reject(reason);
      }
    });
  }));
}
```

- 其实大家可以发现这段代码和判断等待态的逻辑基本一致，无非是传入的函数的函数体需要异步执行，这也是规范规定的
- 对于判断拒绝态的逻辑这里就不一一赘述了，留给大家自己完成这个作业

最后，当然也是最难的一部分，也就是实现兼容多种 `Promise` 的 `resolutionProcedure` 函数

```js
function resolutionProcedure(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Error'));
  }
}
```

首先规范规定了 `x` 不能与 `promise2` 相等，这样会发生循环引用的问题，比如如下代码

```js
let p = new MyPromise((resolve, reject) => {
  resolve(1);
});
let p1 = p.then(value => {
  return p1;
});
```

然后需要判断 `x` 的类型

```js
if (x instanceof MyPromise) {
  x.then(function(value) {
    resolutionProcedure(promise2, value, resolve, reject);
  }, reject);
}
```

这里的代码是完全按照规范实现的。如果 `x` 为 `Promise` 的话，需要判断以下几个情况：

1. 如果 `x` 处于等待态，`Promise` 需保持为等待态直至 `x` 被执行或拒绝
2. 如果 `x` 处于其他状态，则用相同的值处理 `Promise`

当然以上这些是规范需要我们判断的情况，实际上我们不判断状态也是可行的。

接下来我们继续按照规范来实现剩余的代码

```js
let called = false;
if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
  try {
    let then = x.then;
    if (typeof then === 'function') {
      then.call(
        x,
        y => {
          if (called) return;
          called = true;
          resolutionProcedure(promise2, y, resolve, reject);
        },
        e => {
          if (called) return;
          called = true;
          reject(e);
        },
      );
    } else {
      resolve(x);
    }
  } catch (e) {
    if (called) return;
    called = true;
    reject(e);
  }
} else {
  resolve(x);
}
```

- 首先创建一个变量 `called` 用于判断是否已经调用过函数
- 然后判断 `x` 是否为对象或者函数，如果都不是的话，将 `x` 传入 `resolve` 中
- 如果 `x` 是对象或者函数的话，先把 `x.then` 赋值给 `then`，然后判断 `then` 的类型，如果不是函数类型的话，就将 `x` 传入 `resolve` 中
- 如果 `then` 是函数类型的话，就将 `x` 作为函数的作用域 `this` 调用之，并且传递两个回调函数作为参数，第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`，两个回调函数都需要判断是否已经执行过函数，然后进行相应的逻辑
- 以上代码在执行的过程中如果抛错了，将错误传入 `reject` 函数中

以上就是符合 Promise/A+ 规范的实现了，如果你对于这部分代码尚有疑问，欢迎在评论中与我互动。

### 链式调用实现

光是实现了异步操作可不行，我们常常用到 new Promise().then().then()这样的链式调用来解决回调地狱。
规范如何定义 then 方法：

- 每个 then 方法都返回一个新的 Promise 对象（原理的核心）
- 如果 then 方法中显示地返回了一个 Promise 对象就以此对象为准，返回它的结果
- 如果 then 方法中返回的是一个普通值（如 Number、String 等）就使用此值包装成一个新的 Promise 对象返回。
- 如果 then 方法中没有 return 语句，就视为返回一个用 Undefined 包装的 Promise 对象
- 若 then 方法中出现异常，则调用失败态方法（reject）跳转到下一个 then 的 onRejected
- 如果 then 方法没有传入任何回调，则继续向下传递（值的传递特性）
  总的来说就是不论何时 then 方法都要返回一个 Promise，这样才能调用下一个 then 方法。我们可以实例化一个 promise2 返回，将这个 promise2 返回的值传递到下一个 then 中。

```js
Promise.prototype.then = function (onFulfilled, onRejected) {
    let promise2 = new Promise((resolve, reject) => {
    // 其他代码
    }
    return promise2;
};
```

接下来就处理根据上一个 then 方法的返回值来生成新 Promise 对象.

```js
/**
 * 解析then返回值与新Promise对象
 * @param {Object} promise2 新的Promise对象
 * @param {*} x 上一个then的返回值
 * @param {Function} resolve promise2的resolve
 * @param {Function} reject promise2的reject
 */
function resolvePromise(promise2, x, resolve, reject) {
  //...
}
```

当 then 的返回值与新生成的 Promise 对象为同一个（引用地址相同），状态永远为等待态（pending），再也无法成为 resolved 或是 rejected，程序会死掉,则会抛出 TypeError 错误

```js
let promise2 = p.then(data => {
  return promise2;
});
// TypeError: Chaining cycle detected for promise #<Promise>
```

因此需要判断 x。

1.  x 不能和新生成的 promise 对象为同一个
2.  x 不能是 null，可以是对象或者函数(包括 promise), 否则是普通值,那么直接 resolve(x)
3.  当 x 是对象或者函数（默认 promise）则声明 then，let then = x.then
4.  如果取 then 报错，则走 reject()
5.  如果 then 是个函数，则用 call 执行 then，第一个参数是 this，后面是成功的回调和失败的回调，成功和失败只能调用一个 所以设定一个 called 来防止多次调用
6.  如果成功的回调还是 pormise，就递归继续解析

> 小提示： 为什么取对象上的属性有报错的可能？Promise 有很多实现（bluebird，Q 等），Promises/A+只是一个规范，大家都按此规范来实现 Promise 才有可能通用，因此所有出错的可能都要考虑到，假设另一个人实现的 Promise 对象使用 Object.defineProperty()恶意的在取值时抛错，我们可以防止代码出现 Bug
> resolvePromise 实现

```js
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    // 1.x不能等于promise2
    reject(new TypeError('Promise发生了循环引用'));
  }
  let called;
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 2. 可能是个对象或是函数
    try {
      let then = x.then; // 3.取出then方法引用
      if (typeof then === 'function') {
        // 此时认为then是一个Promise对象
        //then是function，那么执行Promise
        then.call(
          x,
          y => {
            // 5.使用x作为this来调用then方法，即then里面的this指向x
            if (called) return;
            called = true;
            // 6.递归调用，传入y若是Promise对象，继续循环
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          },
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      // 也属于失败
      if (called) return;
      called = true;
      reject(e); // 4.取then报错，直接reject
    }
  } else {
    //否则是个普通值
    resolve(x);
  }
}
```

此时链式调用支持已经实现，在相应的地方调用 resolvePromise 方法即可。

### Promise/A+ 规范

Promise 是一个对象或者函数，对外提供了一个 then 函数，内部拥有 3 个状态。

#### then 函数

then 函数接收两个函数作为可选参数：

```js
promise.then(onFulfilled, onRejected);
```

同时遵循下面几个规则：

- 如果可选参数不为函数时应该被忽略；
- 两个函数都应该是异步执行的，即放入事件队列等待下一轮 tick，而非立即执行；
- 当调用 onFulfilled 函数时，会将当前 Promise 的值作为参数传入；
- 当调用 onRejected 函数时，会将当前 Promise 的失败原因作为参数传入；
- then 函数的返回值为 Promise。

#### Promise 状态

Promise 的 3 个状态分别为 pending、fulfilled 和 rejected。

#### Promise 解决过程

Promise 解决过程是一个抽象的操作，即接收一个 promise 和一个值 x，目的就是对 Promise 形式的执行结果进行统一处理。需要考虑以下 3 种情况。

**情况 1： x 等于 promise**

抛出一个 TypeError 错误，拒绝 promise。

**情况 2：x 为 Promise 的实例**

如果 x 处于等待状态，那么 promise 继续等待至 x 执行或拒绝，否则根据 x 的状态执行/拒绝 promise。

**情况 3：x 为对象或函数**

该情况的核心是取出 x.then 并调用，在调用的时候将 this 指向 x。将 then 回调函数中得到结果 y 传入新的 Promise 解决过程中，形成一个递归调用。其中，如果执行报错，则以对应的错误为原因拒绝 promise。

这一步是处理拥有 then() 函数的对象或函数，这类对象或函数我们称之为“thenable”。注意，它只是拥有 then() 函数，并不是 Promise 实例。

**情况 4：如果 x 不为对象或函数**

以 x 作为值，执行 promise。

### Promise 实现

#### Promise 函数及状态

由于 Promise 只有 3 个 状态，这里我们可以先创建 3 个“常量”来消除魔术字符串：

```js
var PENDING = 'pending';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';
```

由于 Promise 可以被实例化，所以可以定义成类或函数，这里为了增加难度，先考虑在 ES5 环境下实现，所以写成构造函数的形式。

使用过 Promise 的人肯定知道，在创建 Promise 的时候会传入一个回调函数，该回调函数会接收两个参数，分别用来执行或拒绝当前 Promise。同时考虑到 Promise 在执行时可能会有返回值，在拒绝时会给出拒绝原因，我们分别用 value 和 reason 两个变量来表示。具体代码如下：

```js
function Promise(execute) {
  var self = this;
  self.state = PENDING;
  function resolve(value) {
    if (self.state === PENDING) {
      self.state = FULFILLED;
      self.value = value;
    }
  }
  function reject(reason) {
    if (self.state === PENDING) {
      self.state = REJECTED;
      self.reason = reason;
    }
  }
  try {
    execute(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
```

Promise 是单次执行的，所以需要判断状态为 PENDING 的时候再执行函数 resolve() 或函数 reject() 。同时 Promise 的内部异常不能直接抛出，所以要进行异常捕获。

#### then() 函数

每个 Promise 实例都有一个 then() 函数，该函数会访问 Promise 内部的值或拒绝原因，所以通过函数原型 prototype 来实现。then() 函数接收两个回调函数作为参数，于是写成下面的形式：

```js
Promise.prototype.then = function(onFulfilled, onRejected) {};
```

根据第 1 条原则，如果可选参数不为函数时应该被忽略，所以在函数 then() 内部加上对参数的判断：

```js
onFulfilled =
  typeof onFulfilled === 'function'
    ? onFulfilled
    : function(x) {
        return x;
      };
onRejected =
  typeof onRejected === 'function'
    ? onRejected
    : function(e) {
        throw e;
      };
```

根据第 2 条规则，传入的回调函数是异步执行的。要模拟异步，可以通过 setTimeout 来延迟执行。再根据第 3 条和第 4 条规则，应根据 Promise 的状态来执行对应的回调，执行状态下调用 onFulfilled() 函数，拒绝状态下调用 onRejected() 函数。

```js
var self = this;
switch (self.state) {
  case FULFILLED:
    setTimeout(function() {
      onFulfilled(self.value);
    });
    break;
  case REJECTED:
    setTimeout(function() {
      onRejected(self.reason);
    });
    break;
  case PENDING:
    // todo
    break;
}
```

等待状态下就有些麻烦了，需要等到 Promise 状态转变时才能调用。

按照常规处理方式，可以建立一个监听，监听 Promise 的状态值改变。由于浏览器环境和 Node.js 环境的事件监听不一样，考虑兼容性，这种实现会比较复杂。

换个角度来看，在不考虑异常的情况下 Promise 的状态改变只依赖于构造函数中的 resolve() 函数和 reject() 函数执行。所以可考虑将 onFulfilled() 和 onRejected() 函数先保存到 Promise 属性 onFulfilledFn 和 onRejectedFn 中，等到状态改变时再调用。

```js
case PENDING:
  self.onFulfilledFn = function () {
    onFulfilled(self.value);
  }
  self.onRejectedFn = function () {
    onRejected(self.reason);
  }
  break;

```

最后看第 5 条规则，then() 被调用时应该返回一个新的 Promise，所以在上面的 3 种状态的处理逻辑中，都应该创建并返回一个 Promise 实例。以执行状态为例，可以改成下面的样子。

```js
case FULFILLED:
  promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
      try {
        onFulfilled(self.value);
      } catch (e) {
        reject(e)
      }
    })
  });
  break;

```

同时，它带来的另一个效果是**支持链式调用**。在链式调用的情况下，如果 Promise 实例处于等待状态，那么需要保存多个 resolve() 或 reject() 函数，所以 onFulfilledFn 和 onRejectedFn 应该改成数组。

```js
case PENDING:
  promise = new Promise(function (resolve, reject) {
    self.onFulfilledFn.push(function () {
      try {
        onFulfilled(self.value);
      } catch (e) {
        reject(e)
      }
    });
    self.onRejectedFn.push(function () {
      try {
        onRejected(self.reason);
      } catch (e) {
        reject(e)
      }
    })
  });
  break;

```

对应的，Promise 构造函数中应该初始化属性 onFulfilledFn 和 onRejectedFn 为数组，同时 resolve() 和 reject() 函数在改变状态时应该调用这个数组中的函数，并且这个调用过程应该是异步的。

```js
function Promise(execute) {
  ...
  self.onFulfilledFn = [];
  self.onRejectedFn = [];
  ...
  function resolve(value) {
    setTimeout(function() {
      ...
      self.onFulfilledFn.forEach(function (f) {
        f(self.value)
      })
    })
  }
  function reject(reason) {
    setTimeout(function() {
      ...
      self.onRejectedFn.forEach(function (f) {
        f(self.reason)
      })
    })
  }
}

```

#### resolvePromise() 函数

前面提到解决过程函数有两个参数及 3 种情况，先来考虑第 1 种情况，promise 与 x 相等，应该直接抛出 TypeError 错误：

```js
function resolvePromise(promise, x) {
  if (promise === x) {
    return reject(new TypeError('x 不能与 promise 相等'));
  }
}
```

情况 2，x 为 Promise 的实例，应该尝试让 promise 接受 x 的状态，怎么接受呢？

直接改变 promise 状态肯定是不可取的，首先状态信息属于内部变量，其次也无法调用属性 onResolvedFn 和 onFulfilledFn 中的待执行函数。所以必须要通过调用 promise 在构造时的函数 resolve() 和 reject() 来改变。

如果 x 处于等待状态，那么 promise 继续保持等待状态，等待解决过程函数 resolvePromise() 执行，否则应该用相同的值执行或拒绝 promise。我们无法从外部拒绝或执行一个 Promise 实例，只能通过调用构造函数传入的 resolve() 和 reject() 函数来实现。所以还需要把这两个函数作为参数传递到 resolvePromise 函数中。

在函数 resolvePromise() 内部加上情况 2 的判断，代码如下：

```js
function resolvePromise(promise, x, resolve, reject) {
  ...
  if (x instanceof Promise) {
    if (x.state === FULFILLED) {
      resolve(x.value)
    } else if (x.state === REJECTED) {
      reject(x.reason)
    } else {
      x.then(function (y) {
        resolvePromise(promise, y, resolve, reject)
      }, reject)
    }
  }
}

```

再来实现情况 3，将 x.then 取出然后执行，并将执行结果放入解决过程函数 resolvePromise() 中。 考虑到 x 可能只是一个 thenable 而非真正的 Promise，所以在调用 then() 函数的时候要设置一个变量 excuted 避免重复调用。同时记得在执行时添加异常捕获并及时拒绝当前 promise。

```js
if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
  var executed;
  try {
    var then = x.then;
    if (typeof then === 'function') {
      then.call(
        x,
        function(y) {
          if (executed) return;
          executed = true;
          return resolvePromise(promise, y, resolve, reject);
        },
        function(e) {
          if (executed) return;
          executed = true;
          reject(e);
        },
      );
    } else {
      resolve(x);
    }
  } catch (e) {
    if (executed) return;
    executed = true;
    reject(e);
  }
}
```

情况 4 就很简单了，直接把 x 作为值执行。

```js
resolve(x);
```

### Promise 测试

编写测试代码永远是一个好习惯，为了验证编写的 Promise 正确性，引用一个专门用来测试 Promise 规范性的模块 [promises-aplus-tests](https://github.com/promises-aplus/promises-tests)，该模块内置了数百个测试案例，支持命令行一键测试。只是在导出模块的时候需要遵循 CommonJS 规范，并且按照要求导出对应的函数。[最终代码地址请点击这里获取](https://github.com/yalishizhude/course/tree/master/plus2)。

测试结果如下图所示：

![image (16).png](https://s0.lgstatic.com/i/image/M00/2B/DD/CgqCHl7_DEeALZgpAAALJ4MkJtQ487.png)

### async/await

async 是 ES2017 标准推出的用于处理异步操作的关键字，从本质上来说，它就是 Generator 函数的语法糖。

async 函数内阻塞，函数外不阻塞。

#### async 函数是什么，有什么作用？

`async`函数可以理解为内置自动执行器的`Generator`函数语法糖，它配合`ES6`的`Promise`近乎完美的实现了异步编程解决方案。

Async/Await 就是一个自执行的 generate 函数。利用 generate 函数的特性把异步的代码写成“同步”的形式。

async 函数返回一个 Promise 对象，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。可以理解为，是让出了线程，跳出了 async 函数体。

#### async 和 await

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

#### 使用 async/await 需要注意什么？

1. await 命令后面的 Promise 对象，运行结果可能是 rejected，此时等同于 async 函数返回的 Promise 对象被 reject。因此需要加上错误处理，可以给每个 await 后的 Promise 增加 catch 方法；也可以将 await 的代码放在 try...catch 中。
2. 多个 await 命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。
3. await 命令只能用在 async 函数之中，如果用在普通函数，会报错。
4. async 函数可以保留运行堆栈。

#### Async/Await 如何通过同步的方式实现异步

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

#### async、await

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

#### Promise.all 结合 async await

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

#### async 函数的使用

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

#### async 执行练习

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

#### setTimeout、Promise、Async/Await 的区别

我觉得这题主要是考察这三者在事件循环中的区别，事件循环中分为宏任务队列和微任务队列。
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

#### setTimeout、Promise、Async/Await 的区别

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

> JavaScript 将异步任务分为 macro-task 和 micro-task，

- macro-task 包含 macro-task Queue（宏任务队列）主要包括 setTimeout,setInterval, setImmediate, requestAnimationFrame, NodeJS 中的 I/O 等。
- micro-task 包含独立回调 micro-task：如 Promise，其成功／失败回调函数相互独立；复合回调 micro-task：如 Object.observe, MutationObserver 和 NodeJs 中的 process.nextTick ，不同状态回调在同一函数体；

- js 执行顺序
- 依次执行同步代码直至执行完毕；
- 检查 macro-task 队列，若有触发的异步任务，则取第一个并调用其事件处理函数，然后跳至第三步，若没有需处理的异步任务，则直接跳至第三步；
- 检查 micro-task 队列，然后执行所有已触发的异步任务，依次执行事件处理函数，直至执行完毕，然后跳至第二步，若没有需处理的异步任务中，则直接返回第二步，依次>执行后续步骤；
- 最后返回第二步，继续检查 macro-task 队列，依次执行后续步骤；
- 如此往复，若所有异步任务处理完成，则结束；

promise 与 asyns/await 的不同：
asyns 函数前面多了一个 aync 关键字。await 关键字只能用在 aync 定义的函数内。async 函数会隐式地返回一个 promise，该 promise 的 reosolve 值就是函数 return 的值。
任何一个 await 语句后面的 Promise 对象变为 reject 状态，那么整个 async 函数都会中断执行
相同点：
async 函数的返回值是 Promise 对象，可以使用 then 方法添加回调函数，这一点与 promise 类似
希望多个请求并发执行，可以使用 Promise.all 方法
promise 和 setTimeout 都会被放入任务队列

#### 简单实现 async/await 中的 async 函数

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

#### Async/Await 如何通过同步的方式实现异步

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

#### 异步笔试题

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

### Generator

#### Generator 实现

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

#### Generator 生成器

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

#### 生成器原理

当 yeild 产生一个值后，生成器的执行上下文就会从栈中弹出。但由于迭代器一直保持着队执行上下文的引用，上下文不会丢失，不会像普通函数一样执行完后上下文就被销毁

#### 迭代器是什么？

TODO:

> 生成器返回的是迭代器。

#### 可迭代对象有什么特点

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

#### JavaScript 中的迭代器（iterators）和迭代（iterables）是什么？ 你知道什么是内置迭代器吗？

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

#### Generator

遍历器对象生成函数，最大的特点是可以交出函数的执行权

- `function` 关键字与函数名之间有一个星号；
- 函数体内部使用 `yield`表达式，定义不同的内部状态；
- `next`指针移向下一个状态

这里你可以说说 `Generator`的异步编程，以及它的语法糖 `async` 和 `awiat`，传统的异步编程。`ES6` 之前，异步编程大致如下

- 回调函数
- 事件监听
- 发布/订阅

传统异步编程方案之一：协程，多个线程互相协作，完成异步任务。

#### Generator 函数是什么，有什么作用？

- 如果说`JavaScript`是`ECMAScript`标准的一种具体实现、`Iterator`遍历器是`Iterator`的具体实现，那么`Generator`函数可以说是`Iterator`接口的具体实现方式。
- 执行`Generator`函数会返回一个遍历器对象，每一次`Generator`函数里面的`yield`都相当一次遍历器对象的`next()`方法，并且可以通过`next(value)`方法传入自定义的 value,来改变`Generator`函数的行为。
- `Generator`函数可以通过配合`Thunk` 函数更轻松更优雅的实现异步编程和控制流管理。

#### Generator

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

#### 说下 generator 和 yield

#### generator 的本质是什么，或者说下 generator 执行时操作系统中发生了什么

#### async/await 原理

虽然说 Generator 函数号称是解决异步回调问题，但却带来了一些麻烦，比如函数外部无法捕获异常，比如多个 yield 会导致调试困难。所以相较之下 Promise 是更优秀的异步解决方案。

async/await 做的事情就是将 Generator 函数转换成 Promise。下面代码描述的是 async 的实现逻辑：

```js
function generator2promise(generatorFn) {
  return function() {
    var gen = generatorFn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value);
            },
            function(err) {
              step('throw', err);
            },
          );
        }
      }
      return step('next');
    });
  };
}
```

它将 Generator 函数包装成了一个新的匿名函数，调用这个匿名函数时返回一个 Promise。在这个 Promise 内部会创建一个 step() 函数，该函数负责递归调用 Generator 函数对应的迭代器，当迭代器执行完成时执行当前的 Promise，失败时则拒绝 Promise。

#### 什么是 Generator 函数？

Generator 函数是 ES6 提出的除 Promise 之外的另一种**异步解决方案**，不同于常见的异步回调，它的用法有些“奇怪”。这里我们只简单介绍一下它的主要用法。

当声明一个 Generator 函数时，需要在 function 关键字与函数名之间加上一个星号，像下面这样：

```js
function* fn() {
  ...
}

```

当调用 Generator 函数后，函数并不会立即执行，而是返回一个迭代器对象。

- 函数体内部使用 yield 表达式，定义不同的内部状态。

- 当函数体外部调用迭代器的 next() 函数时，函数会执行到下一个 yield 表达式的位置，并返回一个对象，该对象包含属性 value 和 done，value 是调用 next() 函数时传入的参数，done 为布尔值表示是否执行完成。

下面是一个将异步回调函数改写成 Generator 函数的示例代码：

```js
function asyncFn(cb) {
  setTimeout(cb, 1000, 1);
}
function* fn() {
  var result = yield asyncFn(function(data) {
    it.next(data);
  });
  console.log(result); // 1
}
var it = fn();
it.next();
```

下面讲讲这段代码的执行逻辑。

- asyncFn() 是一个自定义的异步回调函数，1 秒后返回数值 1。

- 先调用 Generator 函数得到迭代器 it，但此时函数并没有执行，需要执行迭代器的 next() 函数才能调用函数 fn() 。

- Generator 函数 fn() 内部调用异步函数 asyncFn 时使用了 yield 关键字，代表此处暂停执行，等到异步函数 asyncFn 执行完成后再执行后面的代码。

- 1 秒后，匿名回调函数内部得到的返回值 1，通过 it.next() 函数返回这个值，并告诉迭代器继续执行后面的 console.log。

### 手写例子

```js
// 三种状态
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';
// promise 接收一个函数参数，该函数会立即执行
function Promise(fn) {
  let that = this;
  that.currentState = PENDING;
  that.value = undefined;
  // 用于保存 then 中的回调，只有当 promise
  // 状态为 pending 时才会缓存，并且每个实例至多缓存一个
  that.resolvedCallbacks = [];
  that.rejectedCallbacks = [];

  that.resolve = function(value) {
    if (value instanceof Promise) {
      // 如果 value 是个 Promise，递归执行
      return value.then(that.resolve, that.reject);
    }
    setTimeout(() => {
      // 异步执行，保证执行顺序
      if (that.currentState === PENDING) {
        that.currentState = RESOLVED;
        that.value = value;
        that.resolvedCallbacks.forEach(cb => cb());
      }
    });
  };

  that.reject = function(reason) {
    setTimeout(() => {
      // 异步执行，保证执行顺序
      if (that.currentState === PENDING) {
        that.currentState = REJECTED;
        that.value = reason;
        that.rejectedCallbacks.forEach(cb => cb());
      }
    });
  };
  // 用于解决以下问题
  // new Promise(() => throw Error('error))
  try {
    fn(that.resolve, that.reject);
  } catch (e) {
    that.reject(e);
  }
}

Promise.prototype.then = function(onResolved, onRejected) {
  var self = this;
  // 规范 2.2.7，then 必须返回一个新的 promise
  var promise2;
  // 规范 2.2.onResolved 和 onRejected 都为可选参数
  // 如果类型不是函数需要忽略，同时也实现了透传
  // Promise.resolve(4).then().then((value) => console.log(value))
  onResolved = typeof onResolved === 'function' ? onResolved : v => v;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : r => {
          throw r;
        };

  if (self.currentState === RESOLVED) {
    return (promise2 = new Promise(function(resolve, reject) {
      // 规范 2.2.4，保证 onFulfilled，onRjected 异步执行
      // 所以用了 setTimeout 包裹下
      setTimeout(function() {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === REJECTED) {
    return (promise2 = new Promise(function(resolve, reject) {
      setTimeout(function() {
        // 异步执行onRejected
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === PENDING) {
    return (promise2 = new Promise(function(resolve, reject) {
      self.resolvedCallbacks.push(function() {
        // 考虑到可能会有报错，所以使用 try/catch 包裹
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });

      self.rejectedCallbacks.push(function() {
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });
    }));
  }
};
// 规范 2.3
function resolutionProcedure(promise2, x, resolve, reject) {
  // 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
  if (promise2 === x) {
    return reject(new TypeError('Error'));
  }
  // 规范 2.3.2
  // 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
  if (x instanceof Promise) {
    if (x.currentState === PENDING) {
      x.then(function(value) {
        // 再次调用该函数是为了确认 x resolve 的
        // 参数是什么类型，如果是基本类型就再次 resolve
        // 把值传给下个 then
        resolutionProcedure(promise2, value, resolve, reject);
      }, reject);
    } else {
      x.then(resolve, reject);
    }
    return;
  }
  // 规范 2.3.3.3.3
  // reject 或者 resolve 其中一个执行过得话，忽略其他的
  let called = false;
  // 规范 2.3.3，判断 x 是否为对象或者函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 规范 2.3.3.2，如果不能取出 then，就 reject
    try {
      // 规范 2.3.3.1
      let then = x.then;
      // 如果 then 是函数，调用 x.then
      if (typeof then === 'function') {
        // 规范 2.3.3.3
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            // 规范 2.3.3.3.1
            resolutionProcedure(promise2, y, resolve, reject);
          },
          e => {
            if (called) return;
            called = true;
            reject(e);
          },
        );
      } else {
        // 规范 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 规范 2.3.4，x 为基本类型
    resolve(x);
  }
}

/**
 * Promise.all Promise进行并行处理
 * 参数: promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 当这个数组里的所有promise对象全部变为resolve状态的时候，才会resolve。
 */
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let done = gen(promises.length, resolve);
    promises.forEach((promise, index) => {
      promise.then(value => {
        done(index, value);
      }, reject);
    });
  });
};

function gen(length, resolve) {
  let count = 0;
  let values = [];
  return function(i, value) {
    values[i] = value;
    if (++count === length) {
      console.log(values);
      resolve(values);
    }
  };
}

/**
 * Promise.race
 * 参数: 接收 promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理(取决于哪一个更快)
 */
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      promise.then(resolve, reject);
    });
  });
};

// 用于promise方法链时 捕获前面onFulfilled/onRejected抛出的异常
Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.resolve = function(value) {
  return new Promise(resolve => {
    resolve(value);
  });
};

Promise.reject = function(reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};
```

### Generator 与 yield

`generator`函数是 es6 提供的新特性，它的最大特点是：**控制函数的执行**。让我们从网上最火的一个例子来看：

```js
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}

var b = foo(5);
b.next(); // { value:6, done:false }
b.next(12); // { value:8, done:false }
b.next(13); // { value:42, done:true }
```

通俗的解释下为什么会有这种输出：

1. 给函数 foo 传入参数 5，但由于它是 generator，所以执行到**第一个 yield 前**就停止了。
1. 第一次调用 next()，**这次传入的参数会被忽略**暂停\*\*。
1. 第二次调用 next(12)，**传入的参数会被当作上一个 yield 表达式的返回值**。因此，y = 2 \* 12 = 24。执行到第二个 yield，返回其后的表达式的值 24 / 3 = 8。然后函数在此处暂停。
1. 第三次调用 next(13)，没有 yield，只剩 return 了，按照正常函数那样返回 return 的表达式的值，并且`done`为`true`。

**难点**：在于为什么最后的`value`是 42 呢？

首先，`x`的值是刚开始调用 foo 函数传入的 5。而最后传入的 13 被当作第二个 yield 的返回值，所以`z`的值是 13。对于`y`的值，我们在前面第三步中已经计算出来了，就是 24。

所以，`x + y + z = 5 + 24 + 13 = 42`

看懂了上面的分析，再看下面这段代码就很好理解了：

```js
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}

var a = foo(5);
a.next(); // Object{value:6, done:false}
a.next(); // Object{value:NaN, done:false}
a.next(); // Object{value:NaN, done:true}
```

只有第一次调用 next 函数的时候，输出的 value 是 6。其他时候由于没有给 next 传入参数，因此 yield 的返回值都是`undefined`，进行运算后自然是`NaN`。

### Promise 介绍

简单归纳下 Promise：**三个状态、两个过程、一个方法**

- 三个状态：`pending`、`fulfilled`、`rejected`
- 两个过程（**单向不可逆**）：
  - `pending`->`fulfilled`
  - `pending`->`rejected`
- 一个方法`then`：`Promise`本质上只有一个方法，`catch`和`all`方法都是基于`then`方法实现的。

请看下面这段代码：

```js
// 构造 Promise 时候, 内部函数立即执行
new Promise((resolve, reject) => {
  console.log('new Promise');
  resolve('success');
});
console.log('finifsh');

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

### async/await 介绍

`async`函数返回一个`Promise`对象，可以使用`then`方法添加回调函数。

当函数执行的时候，一旦遇到`await`就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

这也是它最受欢迎的地方：**能让异步代码写起来像同步代码，并且方便控制顺序**。

可以利用它实现一个`sleep`函数阻塞进程：

```js
function sleep(millisecond) {
  return new Promise(resolve => {
    setTimeout(() => resolve, millisecond);
  });
}

/**
 * 以下是测试代码
 */
async function test() {
  console.log('start');
  await sleep(1000); // 睡眠1秒
  console.log('end');
}

test(); // 执行测试函数
```

虽然方便，**但是它也不能取代`Promise`，尤其是我们可以很方便地用`Promise.all()`来实现并发**，而`async/await`只能实现串行。

```js
function sleep(second) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(Math.random());
      resolve();
    }, second);
  });
}

async function chuanXingDemo() {
  await sleep(1000);
  await sleep(1000);
  await sleep(1000);
}

async function bingXingDemo() {
  var tasks = [];
  for (let i = 0; i < 3; ++i) {
    tasks.push(sleep(1000));
  }

  await Promise.all(tasks);
}
```

运行`bingXingDemo()`，几乎同时输出，它是并发执行；运行`chuanXingDemo()`，每个输出间隔 1s，它是串行执行。

## 实现 Promise 的常用 API

### 实现 Promise.finally

它就是一个语法糖，在当前 promise 实例执行完 then 或者 catch 后，均会触发。`Promise.prototype.finally` 的执行与 promise 实例的状态无关，不依赖于 promise 的执行后返回的结果值。其传入的参数是函数对象。

#### 代码实现

实现思路：

- 考虑到 promise 的 resolver 可能是个异步函数，因此 finally 实现中，要通过调用实例上的 then 方法，添加 callback 逻辑
- 成功透传 value，失败透传 error

```js
Promise.prototype.finally = function(cb) {
  return this.then(
    value => Promise.resolve(cb()).then(() => value),
    error =>
      Promise.resolve(cb()).then(() => {
        throw error;
      }),
  );
};
```

### 实现 Promise.all

`Promise.all(iterators)`返回一个新的 Promise 实例。iterators 中包含外界传入的多个 promise 实例。

对于返回的新的 Promise 实例，有以下两种情况：

- 如果传入的所有 promise 实例的状态均变为`fulfilled`，那么返回的 promise 实例的状态就是`fulfilled`，并且其 value 是 传入的所有 promise 的 value 组成的数组。
- 如果有一个 promise 实例状态变为了`rejected`，那么返回的 promise 实例的状态立即变为`rejected`。

#### 代码实现

实现思路：

- 传入的参数不一定是数组对象，可以是"遍历器"
- 传入的每个实例不一定是 promise，需要用`Promise.resolve()`包装
- 借助"计数器"，标记是否所有的实例状态均变为`fulfilled`

```js
Promise.all = function(iterators) {
  const promises = Array.from(iterators);
  const num = promises.length;
  const resolvedList = new Array(num);
  let resolvedNum = 0;

  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          // 保存这个 promise 实例的 value
          resolvedList[index] = value;
          // 通过计数器，标记是否所有实例均 fulfilled
          if (++resolvedNum === num) {
            resolve(resolvedList);
          }
        })
        .catch(reject);
    });
  });
};
```

```js
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let result = [];
    if (promises.length === 0) {
      resolve(result);
    } else {
      function processValue(i, data) {
        result[i] = data;
        if (++index === promises.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < promises.length; i++) {
        //promises[i] 可能是普通值
        Promise.resolve(promises[i]).then(
          data => {
            processValue(i, data);
          },
          err => {
            reject(err);
            return;
          },
        );
      }
    }
  });
};
```

### 实现 Promise.race

在代码实现前，我们需要先了解 Promise.race 的特点：

1. Promise.race 返回的仍然是一个 Promise.
   它的状态与第一个完成的 Promise 的状态相同。它可以是完成（ resolves），也可以是失败（rejects），这要取决于第一个 Promise 是哪一种状态。
2. 如果传入的参数是不可迭代的，那么将会抛出错误。
3. 如果传的参数数组是空，那么返回的 promise 将永远等待。
4. 如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，则 Promise.race 将解析为迭代中找到的第一个值。

```js
Promise.race = function(promises) {
  // promises 必须是一个可遍历的数据结构，否则抛错
  return new Promise((resolve, reject) => {
    if (typeof promises[Symbol.iterator] !== 'function') {
      //真实不是这个错误
      Promise.reject('args is not iteratable!');
    }
    if (promises.length === 0) {
      return;
    } else {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(
          data => {
            resolve(data);
            return;
          },
          err => {
            reject(err);
            return;
          },
        );
      }
    }
  });
};
```

<!-- TODO: 到底是 then 的第二个参数中处理异常还是用 catch 处理异常 -->

```js
Promise.myRace = function(iterators) {
  const promises = Array.from(iterators);

  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve)
        .catch(reject);
    });
  });
};
```

### 实现 Promise.any

`Promise.any(iterators)`的传参和返回值与`Promise.all`相同。

如果传入的实例中，有任一实例变为`fulfilled`，那么它返回的 promise 实例状态立即变为`fulfilled`；如果所有实例均变为`rejected`，那么它返回的 promise 实例状态为`rejected`。

⚠️`Promise.all`与`Promise.any`的关系，类似于，`Array.prototype.every`和`Array.prototype.some`的关系。

#### 代码实现

实现思路和`Promise.all`类似。不过由于对异步过程的处理逻辑不同，**因此这里的计数器用来标识是否所有的实例均 rejected**。

```js
Promise.any = function(iterators) {
  const promises = Array.from(iterators);
  const num = promises.length;
  const rejectedList = new Array(num);
  let rejectedNum = 0;

  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => resolve(value))
        .catch(error => {
          rejectedList[index] = error;
          if (++rejectedNum === num) {
            reject(rejectedList);
          }
        });
    });
  });
};
```

### 实现 Promise.allSettled

`Promise.allSettled(iterators)`的传参和返回值与`Promise.all`相同。

根据[ES2020](https://github.com/tc39/proposal-promise-allSettled)，此返回的 promise 实例的状态只能是`fulfilled`。对于传入的所有 promise 实例，会等待每个 promise 实例结束，并且返回规定的数据格式。

如果传入 a、b 两个 promise 实例：a 变为 rejected，错误是 error1；b 变为 fulfilled，value 是 1。那么`Promise.allSettled`返回的 promise 实例的 value 就是：

```js
[
  { status: 'rejected', value: error1 },
  { status: 'fulfilled', value: 1 },
];
```

#### 代码实现

实现中的计数器，用于统计所有传入的 promise 实例。

```js
const formatSettledResult = (success, value) =>
  success ? { status: 'fulfilled', value } : { status: 'rejected', reason: value };

Promise.allSettled = function(iterators) {
  const promises = Array.from(iterators);
  const num = promises.length;
  const settledList = new Array(num);
  let settledNum = 0;

  return new Promise(resolve => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          settledList[index] = formatSettledResult(true, value);
          if (++settledNum === num) {
            resolve(settledList);
          }
        })
        .catch(error => {
          settledList[index] = formatSettledResult(false, error);
          if (++settledNum === num) {
            resolve(settledList);
          }
        });
    });
  });
};
```

### Promise.all、Promise.any 和 Promise.allSettled 中计数器使用对比

这三个方法均使用了计数器来进行异步流程控制，下面表格横向对比不同方法中计数器的用途，来加强理解：

| 方法名               | 用途                                        |
| -------------------- | ------------------------------------------- |
| `Promise.all`        | 标记 fulfilled 的实例个数                   |
| `Promise.any`        | 标记 rejected 的实例个数                    |
| `Promise.allSettled` | 标记所有实例（fulfilled 和 rejected）的个数 |
