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

### [leetcode.7] reverse-integer

```js
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
  const isMinus = x < 0;
  x = isMinus ? -x : x;
  let temp = x + '',
    temp2 = Array.prototype.reverse.call(temp);
  return isMinus ? '-' + parseInt(temp2) : parseInt(temp2);
};

reverse(10);
reverse(0);
reverse(-1230);
```

```js
/**
 * https://leetcode.com/problems/reverse-integer/description/
 * Difficulty:Easy
 *
 * Given a 32-bit signed integer, reverse digits of an integer.
 *
 * Example 1:
 * Input: 123
 * Output:  321
 * Example 2:
 * Input: -123
 * Output: -321
 * Example 3:
 * Input: 120
 * Output: 21
 * Note:
 * Assume we are dealing with an environment which could only hold integers within the 32-bit signed integer range.
 * For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.
 */

/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
  var sign = x >= 0 ? -1 : 1;
  x = Math.abs(x);

  var sum = 0;
  while (x) {
    sum = sum * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  var ret = sign * -1 * sum;
  var max = Math.pow(2, 31) - 1;
  var min = -Math.pow(2, 31);
  if (ret > max) return 0;
  if (ret < min) return 0;
  return ret;
};

console.log(reverse(123) === 321);
console.log(reverse(-123) === -321);
console.log(reverse(120) === 21);
console.log(reverse(1534236469) === 0);
console.log(reverse(-2147483412), reverse(-2147483412) === -2143847412);
console.log(reverse(-2147483648), reverse(-2147483648) === 0);
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
