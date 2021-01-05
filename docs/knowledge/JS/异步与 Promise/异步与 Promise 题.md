---
title: 异步与 Promise 题
date: '2020-10-26'
draft: true
---

## 异步与 Promise 题

### 题目一

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

### 题目二

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

### 题目三

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

### 题目四

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

### 题目五

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

### 题目六

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

### 题目七

```js
const promise = Promise.resolve().then(() => {
  return promise;
});
promise.catch(console.error);
```

### 题目八

```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log);
```

### 题目九

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

### 题目十

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

### 不会结束

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

### 坑

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
