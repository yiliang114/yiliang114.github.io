---
layout: CustomPages
title: 动态规划-数字相关
date: 2020-11-29
aside: false
draft: true
---

# 数字相关

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

isPrime(0) === false;
isPrime(1) === false;
isPrime(2) === true;
isPrime(9) === false;
isPrime(17) === true;
isPrime(25) === false;
isPrime(73) === true;
isPrime(10000000000000) === false;
```

### duplicateZeros

```js
/**
 * @param {number[]} arr
 * @return {void} Do not return anything, modify arr in-place instead.
 */
var duplicateZeros = function(arr) {
  const indexArr = [],
    length = arr.length;
  arr.map((elm, index) => {
    if (elm === 0) {
      indexArr.push(index);
    }
  });
  indexArr.forEach((elm, index) => {
    arr.splice(elm + index, 0, 0);
  });
  arr.splice(length, arr.length - length);
};

duplicateZeros([1, 0, 2, 3, 0, 4, 5, 0]);
```
