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
