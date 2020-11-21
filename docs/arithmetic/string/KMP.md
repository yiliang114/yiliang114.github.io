---
layout: CustomPages
title: KMP
date: 2020-11-21
aside: false
draft: true
---

## SF/ALGs/string/kmp.js

```js
// 暴力匹配
const bf = (str, target) => {
  let i = 0,
    j = 0;
  const sLength = str.length,
    tLength = target.length;

  while (i < sLength && j < tLength) {
    // 如果匹配全部向后移动
    if (str[i] === target[j]) {
      i++;
      j++;
      // 如果不匹配的话，主串的位置需要回退
      // i 是档次循环开始的主串开始位置； j 是已经匹配的模式串位置
    } else {
      // +1 下一位
      i = i - j + 1;
      j = 0;
    }
  }
  return j === tLength ? i - j : -1;
};

// console.log(bf('abcdefrt', 'def'))
// console.log(bf('abcdefrt', 'iop'))

// kmp 算法， 需要算一个寻找最长前缀后缀数组
const kmp = (str, target) => {
  let i = 0,
    j = 0;
  const sLength = str.length,
    tLength = target.length;
  const next = getNextArr(target, target.length);
  console.log('next', next);

  while (i < sLength && j < tLength) {
    // 如果匹配全部向后移动
    if (j === -1 || str[i] === target[j]) {
      i++;
      j++;
    } else {
      // 失配时，模式串向右移动的位数为：已匹配字符数- 失配字符的上一位字符所对应的最大长度值
      // i 不变，只修改 j 的值
      j = next[j];
    }
  }
  console.log('i', i);
  console.log('j', j);
  return j === tLength ? i - j : -1;
};

// next 数组相当于“最大长度值” 整体向右移动一位，然后初始值赋为-1。
// 意识到了这一点，你会惊呼原来next 数组的求解竟然如此简单：就是找最大对称长度的前缀后缀，然后整体右移一位，初值赋为 - 1
// 根据最大长度表求出了next 数组后，从而有
// 失配时，模式串向右移动的位数为：失配字符所在位置 - 失配字符对应的 next 值
function getNextArr(pattern) {
  const next = [];
  next[0] = -1;
  let i = 0,
    j = -1;
  while (i < pattern.length) {
    // -1 表示首次匹配，无前缀、无后缀。 所以 next[1] = 0
    // pattern[i] 表示的是后缀，子串的末尾一位
    if (j === -1 || pattern[i] === pattern[j]) {
      ++i;
      ++j;
      next[i] = j;
    } else {
      j = next[j];
    }
  }
  return next;
}

console.log(kmp('abcdefrt', 'def'));
// console.log(kmp('abcdefrt', 'iop'))

// BM 算法

// KMP
const KMPSearch = (text, pattern) => {
  const tLength = text.length;
  const pLength = pattern.length;
  const next = getNext(pattern);
  console.log('next', next);
  let i = 0,
    j = 0;
  while (i < tLength && j < pLength) {
    if (j === -1 || text[i] === pattern[j]) {
      i++;
      j++;
    } else {
      j = next[j];
    }
  }
  // console.log('i', i)
  // console.log('j', j)

  if (j === pLength) return i - j;
  return -1;
};

const getNext = pattern => {
  const next = [];
  next[0] = -1;
  let i = 0,
    j = -1,
    length = pattern.length;
  while (i < length) {
    // pattern[i] 后缀 pattern[j] 前缀
    if (j === -1 || pattern[i] === pattern[j]) {
      ++i;
      ++j;
      next[i] = j;
    } else {
      j = next[j];
    }
  }
  return next;
};

console.log(KMPSearch('abcdefrt', 'def'));
// console.log(KMPSearch('abcdefrt', 'iop'))
```
