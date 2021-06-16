---
title: Search
date: 2020-11-21
aside: false
draft: true
---

### 数组快排+二分搜索

```js
function swap(a, i, j) {
  let temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function quickSort(arr, start = 0, end = arr.length - 1) {
  if (arr && arr.length < 2) return arr;
  if (start >= end) return;

  let target = arr[start],
    i = start,
    j = end;

  while (i < j) {
    while (target <= a[j] && i < j) j--;
    while (target >= a[i] && i < j) i++;

    if (i < j) swap(arr, i, j);
  }

  // i === j
  swap(arr, start, i);
  quickSort(arr, start, i - 1);
  quickSort(arr, i + 1, end);

  return arr;
}

// 递归形式
function binary_search(arr, target, start, end) {
  if ((arr && arr.length < 1) || start > end) return -1;
  let midIndex = (start + (end - start)) >> 1;
  return arr[midIndex] === target
    ? midIndex
    : arr[midIndex] > target
    ? binary_search(arr, target, start, midIndex - 1)
    : binary_search(arr, target, midIndex + 1, end);
}
```

### search_bm

```js
/**
 * 从右向左扫描模式字符串的更有效方法
 *
 * 获取匹配字符串最右侧的字符 R 与 M - N + 1 的目标字符串匹配
 * 如果目标字符串截取值中没有 R，则匹配字符串整体向右移动 N - 1 位开始匹配
 * 如果匹配上最右侧一位，然后再向左匹配
 */
const pat = 'search';
const txt = 'hello search baby';
let R = 256;
let right = new Array(R);

function BM() {
  let M = pat.length;

  for (let c = 0; c < R; c++) {
    right[c] = -1;
  }
  for (let j = 0; j < M; j++) {
    right[pat.charCodeAt(j)] = j;
  }
}

function search(txt) {
  let N = txt.length;
  let M = pat.length;
  let skip;
  for (let i = 0; i < N - M; i += skip) {
    skip = 0;
    for (let j = M - 1; j >= 0; j--) {
      if (pat.charCodeAt(j) != txt.charCodeAt(i + j)) {
        skip = j - right[txt.charCodeAt(i + j)];
        if (skip < 1) skip = 1;
        break;
      }
    }
    if (skip == 0) return i;
  }
  return -1;
}

BM();
console.log(search(txt));

/**
 * 输出：6
 */
```

### 暴力搜索 search_violence

```js
function search(pat, txt) {
  const M = pat.length,
    N = txt.length;
  for (let i = 0; i <= N - M; i++) {
    let j;
    for (j = 0; j < M; j++) {
      if (txt.charAt(i + j) != pat.charAt(j)) {
        break;
      }
      if (j == M - 1) return i;
    }
  }
  return -1;
}

const pat = 'search';
const txt = 'hello search baby';

console.log(search(pat, txt));

/**
 * 输出结果：6
 *
 * 通过遍历的方式查找某一段字符是否匹配，没有占用额外内存。
 */
```

<!-- 第二种 -->

```js
function search(par, txt) {
  let i,
    j,
    M = pat.length,
    N = txt.length;
  for (i = 0, j = 0; i < N && j < M; i++) {
    if (txt.charAt(i) == pat.charAt(j)) {
      j++;
    } else {
      i -= j;
      j = 0;
    }
  }
  if (j == M) return i - M;
  else return -1;
}

const pat = 'search';
const txt = 'hello search baby';

console.log(search(pat, txt));
```

### 100 万个数抽 100 个怎么做？用什么数据结构？
