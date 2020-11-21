---
layout: CustomPages
title: 字符串查找相关
date: 2020-11-21
aside: false
draft: true
---

## 字符串查找相关

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

### search_kmp

```js
/**
 * KMP 的特点在于之前检查过的字符串不在重复检查
 * 更加上一次匹配的结果来决定是否从头匹配
 * 减少搜索次数
 */
let pat = 'search';
let dfa = [];

function KMP() {
  const M = pat.length;
  const R = 256;

  dfa[pat.charAt(0)][0] = 1;
  for (let x = 0, j = 1; j < M; j++) {
    for (let c = 0; c < R; c++) {
      dfs[c][j] = dfs[c][x];
    }
    dfa[pat.charAt(j)][j] = j + 1;
    x = dfa[pat.charAt(j)][x];
  }
}

function search(txt) {
  let i,
    j,
    N = txt.length,
    M = pat.length;
  for (i = 0, j = 0; i < N && j < M; i++) {
    j = dfs[txt.charAt(i)][j];
  }
  if (j == M) {
    return i - M;
  } else {
    return -1;
  }
}

KMP();
const txt = 'hello search baby';
console.log(search(txt));

/**
 * TODO 由于 Java 和 JS 的数据结构不同，所以运行失败
 *
 * 大体思想需要学习，之后进行实现。
 */
```

### search_rk

```js
/**
 * RK 指纹字符串查找算法
 * 使用散列值的方法，将每个字符的值进行某种方式的计算，计算的值相同再去检查字符串
 */
function search(pat, txt) {
  let N = txt.length;
  let patHash = hash(pat, pat.length);
  let txtHash = hash(txt, N);
  if (patHash == txtHash) return 0;
  for (let i = M; i < N; i++) {
    txtHash = (txtHash + Q - ((RM * txt.charCodeAt(i - M)) % Q)) % Q;
    txtHash = (txtHash * R + txt.charCodeAt(i)) % Q;
    if (patHash == txtHash) {
      return i - M + 1;
    }
  }
  return -1;
}

/**
 * TODO 这个方法并没有真正的实现，只是进行了了解。
 */
```

### search_violence

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

### search_violence_2

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
