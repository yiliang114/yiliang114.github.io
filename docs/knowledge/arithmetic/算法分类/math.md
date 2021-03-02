---
layout: CustomPages
title: 前端与数据结构-数学
date: 2020-09-04
aside: false
draft: true
---

### 阶乘

在数学上, 一个正整数 `n` 的阶乘 (写作 `n!`), 就是所有小于等于 `n` 的正整数的乘积. 比如:

```
5! = 5 * 4 * 3 * 2 * 1 = 120
```

| n   |                n! |
| --- | ----------------: |
| 0   |                 1 |
| 1   |                 1 |
| 2   |                 2 |
| 3   |                 6 |
| 4   |                24 |
| 5   |               120 |
| 6   |               720 |
| 7   |             5 040 |
| 8   |            40 320 |
| 9   |           362 880 |
| 10  |         3 628 800 |
| 11  |        39 916 800 |
| 12  |       479 001 600 |
| 13  |     6 227 020 800 |
| 14  |    87 178 291 200 |
| 15  | 1 307 674 368 000 |

```js
function tailFactorial(n, total) {
  switch (n) {
    case 0:
      return 1;
    case 1:
      return total;
    default:
      return tailFactorial(n - 1, n * total);
  }
}

function factorial(n) {
  return tailFactorial(n, 1);
}
```

### 打印出 1 - 10000 之间的所有对称数

例如：121、1331 等

```js
[...Array(10000).keys()].filter(x => {
  return (
    x.toString().length > 1 &&
    x ===
      Number(
        x
          .toString()
          .split('')
          .reverse()
          .join(''),
      )
  );
});
```

```js
var isPalindrome = function(x) {
  let str = x.toString().split('');
  return str.join() === str.reverse().join();
};
let arr = [];
for (let i = 1; i < 100000; i++) {
  if (isPalindrome(i)) {
    arr.push(i);
  }
}
console.log(arr);
```

### 不用加减乘除运算符，求整数的 7 倍

```js
/* -- 位运算 -- */

// 先定义位运算加法
function bitAdd(m, n) {
  while (m) {
    [m, n] = [(m & n) << 1, m ^ n];
  }
  return n;
}

// 位运算实现方式 1 - 循环累加7次
let multiply7_bo_1 = num => {
  let sum = 0,
    counter = new Array(7); // 得到 [empty × 7]
  while (counter.length) {
    sum = bitAdd(sum, num);
    counter.shift();
  }
  return sum;
};

// 位运算实现方式 2 - 二进制进3位(乘以8)后，加自己的补码(乘以-1)
let multiply7_bo_2 = num => bitAdd(num << 3, -num);
```

### 是否是素数

```js
function isPrime(n) {
  if (n < 2) {
    return false;
  }
  for (let i = 2; i < Math.ceil(Math.sqrt(n)) + 1; i++) {
    if (n % i === 0 && i !== n) {
      return false;
    }
  }
  return true;
}
[0, 1, 2, 9, 17, 25, 73, 10000000000000].forEach(val => isPrime(val));
```
