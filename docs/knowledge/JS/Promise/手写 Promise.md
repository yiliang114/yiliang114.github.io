---
title: 手写 Promise
date: 2020-11-16
draft: true
---

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

```js
var PENDING = 'pending';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';

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

### 手写 Promise 实现

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
      // 规范 2.2.4，保证 onFulfilled，onRejected 异步执行
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

### 链式调用实现

光是实现了异步操作可不行，我们常常用到 new Promise().then().then() 这样的链式调用来解决回调地狱。

规范如何定义 then 方法：

- 每个 then 方法都返回一个新的 Promise 对象（原理的核心）
- 如果 then 方法中显示地返回了一个 Promise 对象就以此对象为准，返回它的结果
- 如果 then 方法中返回的是一个普通值（如 Number、String 等）就使用此值包装成一个新的 Promise 对象返回。
- 如果 then 方法中没有 return 语句，就视为返回一个用 Undefined 包装的 Promise 对象
- 若 then 方法中出现异常，则调用失败态方法（reject）跳转到下一个 then 的 onRejected
- 如果 then 方法没有传入任何回调，则继续向下传递（值的传递特性）
  总的来说就是不论何时 then 方法都要返回一个 Promise，这样才能调用下一个 then 方法。
