---
title: 实现一个 Promise
date: '2020-10-26'
draft: true
---

### Promise 实现

Promise 是 ES6 新增的语法，解决了回调地狱的问题。

可以把 Promise 看成一个状态机。初始是 `pending` 状态，可以通过函数 `resolve` 和 `reject` ，将状态转变为 `resolved` 或者 `rejected` 状态，状态一旦改变就不能再次变化。

`then` 函数会返回一个 Promise 实例，并且该返回值是一个新的实例而不是之前的实例。因为 Promise 规范规定除了 `pending` 状态，其他状态是不可以改变的，如果返回的是一个相同实例的话，多个 `then` 调用就失去意义了。

对于 `then` 来说，本质上可以把它看成是 `flatMap`

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

以上就是根据 Promise / A+ 规范来实现的代码，可以通过 `promises-aplus-tests` 的完整测试

![](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-042629.png)

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

### 如何实现 Promise.all

要实现 Promise.all,首先我们需要知道 Promise.all 的功能：

1. 如果传入的参数是一个空的可迭代对象，那么此 promise 对象回调完成(resolve),只有此情况，是同步执行的，其它都是异步返回的。
2. 如果传入的参数不包含任何 promise，则返回一个异步完成.
3. promises 中所有的 promise 都“完成”时或参数中不包含 promise 时回调完成。
4. 如果参数中有一个 promise 失败，那么 Promise.all 返回的 promise 对象失败
   在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组

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

### 如何实现 Promise.finally

```js
Promise.prototype.finally = function(callback) {
  return this.then(
    value => {
      return Promise.resolve(callback()).then(() => {
        return value;
      });
    },
    err => {
      return Promise.resolve(callback()).then(() => {
        throw err;
      });
    },
  );
};
```

### 如何实现 Promise.race

在代码实现前，我们需要先了解 Promise.race 的特点：

1. Promise.race 返回的仍然是一个 Promise.
   它的状态与第一个完成的 Promise 的状态相同。它可以是完成（ resolves），也可以是失败（rejects），这要取决于第一个 Promise 是哪一种状态。
2. 如果传入的参数是不可迭代的，那么将会抛出错误。
3. 如果传的参数数组是空，那么返回的 promise 将永远等待。
4. 如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，则 Promise.race 将解析为迭代中找到的第一个值。

```js
Promise.race = function(promises) {
  //promises 必须是一个可遍历的数据结构，否则抛错
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

### 使用 Promise 封装一个 AJAX

#### ajax 的 xhr 对象的 7 个事件

- onloadstart
  - 开始 send 触发
- onprogress
  - 从服务器上下载数据每 50ms 触发一次
- onload
  - 得到响应
- onerror
  - 服务器异常
- onloadend
  - 请求结束，无论成功失败
- onreadystatechange
  - xhr.readyState 改变使触发
- onabort
  - 调用 xhr.abort 时触发

#### 实现代码

```js
const ajax = obj => {
  return new Promise((resolve, reject) => {
    let method = obj.method || 'GET';

    // 创建 xhr
    let xhr;
    if (window.XMLHTTPRequest) {
      xhr = new XMLHTTPRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // 超时
    xhr.ontimeout = function() {
      reject({
        errorType: 'timeout_error',
        xhr: xhr,
      });
    };
    // 报错
    xhr.onerror = function() {
      reject({
        errorType: 'onerror',
        xhr: xhr,
      });
    };
    // 监听 statuschange
    xhr.onreadystatechange = function() {
      if (xhr.readState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          resolve(xhr.responseText);
        } else {
          reject({
            errorType: 'onerror',
            xhr: xhr,
          });
        }
      }
    };

    // 发送请求
    if (method === 'POST') {
      xhr.open('POST', obj.url, ture);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(JSON.parse(obj.data));
    } else {
      let query = '';
      for (let key in obj.data) {
        query += `&${encodeURIComponent(key)}=${encodeURIComponent(obj.data[key])}`;
      }
      // The substring() method returns the part of the string between the start and end indexes, or to the end of the string.
      query.substring(1);
      xhr.open('GET', obj.url, +'?' + query, true);
      xhr.send();
    }
  });
};
```

### 如何用原生来实现 promise.all()?

```js
function PromiseM() {
  this.status = 'pending';
  this.msg = '';
  var that = this;
  var process = arguments[0];
  process(
    function() {
      that.status = 'resolve';
      that.msg = arguments[0];
    },
    function() {
      that.status = 'reject';
      that.msg = arguments[0];
    },
  );
  return this;
}
PromiseM.prototype.then = function() {
  if (this.status == 'resolve') {
    arguments[0](this.msg);
  }
  if (this.status == 'reject' && arguments[1]) {
    arguments[1](this.msg);
  }
};

// 测试用例

var p = new PromiseM(function(resolve, reject) {
  resolve('123');
});

p.then(
  function(success) {
    console.log(success);
    console.log('success');
  },
  function() {
    console.log('fail！');
  },
);
```

### promise.all race 以及 多层的 then 以及多个 promise 异步 同步执行？ promise 如果没有 resolve 会怎么样？
