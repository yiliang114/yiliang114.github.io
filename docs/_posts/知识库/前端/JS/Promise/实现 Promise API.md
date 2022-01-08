---
title: 实现 Promise 的常用 API
date: 2020-11-16
draft: true
---

## 实现 Promise 的常用 API

### 实现 Promise.finally

它就是一个语法糖，在当前 promise 实例执行完 then 或者 catch 后，均会触发。`Promise.prototype.finally` 的执行与 promise 实例的状态无关，不依赖于 promise 的执行后返回的结果值。其传入的参数是函数对象。
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

promise.then(...).catch(...);与 promise.then(..., ...); 并不等价，
尤其注意当 promise.then(...).catch(...); 中的 then 会抛异常的情况下。

<!-- 到底是 then 的第二个参数中处理异常还是用 catch 处理异常 ？-->

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

`Promise.all`与`Promise.any`的关系，类似于，`Array.prototype.every`和`Array.prototype.some`的关系。

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

### 实现 Promise.retry(promiseFn, times)

可以设置时间间隔和次数。

```js
Promise.retry = function(promiseFn, times = 3) {
  return new Promise(async (resolve, reject) => {
    while (times--) {
      try {
        var ret = await promiseFn();
        resolve(ret);
        break;
      } catch (error) {
        if (!times) reject(error);
      }
    }
  });
};

function getProm() {
  const n = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => (n > 0.9 ? resolve(n) : reject(n)), 1000);
  });
}

Promise.retry(getProm);
```

### 实现 Promise.all(list, limit)

控制一下子发出的请求个数。异步请求控制并发 LimitPromise

```js
function PromiseLimit(funcArray, limit = 5) {
  let i = 0;
  // promise 存储
  const result = [];
  // 执行存储
  const executing = [];
  const queue = function() {
    // 边界处理, funcArray 为空数组
    if (i === funcArray.length) return Promise.all(executing);
    // 一个 promise
    const p = funcArray[i++]();
    // 最终返回的 promise 队列
    result.push(p);
    // 在 p 执行结束之后，将 e 从 executing 数组中取出
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    // 执行中的 promise 队列
    executing.push(e);
    // 如果个数到了 limit， 先 race 等待执行结束，再执行 queue 添加一个 promise
    if (executing.length >= limit) {
      return Promise.race(executing).then(
        () => queue(),
        e => Promise.reject(e),
      );
    }
    // 如果个数还没到，则直接执行 queue() 函数添加 promise
    return Promise.resolve().then(() => queue());
  };
  return queue().then(() => Promise.all(result));
}
```
