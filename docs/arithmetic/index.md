---
layout: CustomPages
title: 算法
date: '2020-08-23'
aside: false
---

# JavaScript 算法

## 基础的算法题

### 判断一个字符串是否是回文

回文是指将字符串翻转之后的值跟翻转之前的值相等。比如 `mamam`, `ava` .

这里主要的考察是 `reverse` 的实现， 刚好 JS 的数组（注意是数组，而不是字符串）就有 `reverse` 函数。直接利用现成的函数，将字符串转换成数组。

```js
function checkPalindrome(str) {
  return (
    str ===
    str
      .split('')
      .reverse()
      .join('')
  );
}
```

### 整型数组去重

比如输入: `[1,13,24,11,11,14,1,2]`
输出: `[1,13,24,11,14,2]`

这道问题有不止一个解法。

- 第一种解法，主要考察个人对 Object 的使用，利用 key 来进行筛选。
- 直接使用 ES6 的 Set 去重。

```js
function unique(arr) {
  const hashTable = {};
  const data = [];
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i];
    if (!hashTable[key]) {
      hashTable[key] = true;
      data.push(key);
    }
  }
  return data;
}

function unique1(arr) {
  return Array.from(new Set(arr));
}
```

### 统计一个字符串出现最多的字母

给出一段英文连续的英文字符窜，找出重复出现次数最多的字母

输入: `afjghdfraaaasdenas`
输出: `a`

前面出现过去重的算法，这里需要是统计重复次数。

```js
function findMaxDuplicateChar(str) {
  // 单个字符串
  if (str.length == 1) {
    return str;
  }
  let charObj = {},
    maxChar = str[0],
    maxValue = 1;
  for (let i = 0; i < str.length; i++) {
    if (!charObj[str[i]]) {
      charObj[str[i]] = 1;
    } else {
      charObj[str[i]] += 1;
    }

    if (charObj[str[i]] > maxValue) {
      maxChar = str[i];
      maxValue = charObj[str[i]];
    }
  }
  return maxChar;
}
```
