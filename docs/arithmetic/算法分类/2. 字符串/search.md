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

#### 100 万个数抽 100 个怎么做？用什么数据结构？

### 数字在排序数组中出现的次数

#### 1. 题目

统计一个数字在排序数组中出现的次数。

#### 2. 思路解析

题目说是排序数组，所以可以使用“二分查找”的思想。

一种思路是查找到指定数字，然后向前向后遍历，复杂度是 O(N)。

另一种是不需要遍历所有的数字，只需要找到数字在数组中的左右边界即可，做差即可得到出现次数。

#### 3. 代码实现

```javascript
/**
 * 寻找指定数字的左 / 右边界
 *
 * @param {Array} nums
 * @param {*} target
 * @param {String} mode left | right 寻找左 | 右边界
 */
function findBoundary(nums, target, mode) {
  let left = 0,
    right = nums.length - 1;

  while (left < right) {
    let mid = (right + left) >> 1;

    if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else if (mode === 'left') {
      // nums[mid] === target
      // 如果下标是0或者前一个元素不等于target
      // 那么mid就是左边界
      if (mid === 0 || nums[mid - 1] !== target) {
        return mid;
      }
      // 否则，继续在左部分遍历
      right = mid - 1;
    } else if (mode === 'right') {
      // nums[mid] === target
      // 如果下标是最后一位 或者 后一个元素不等于target
      // 那么mid就是右边界
      if (mid === nums.length - 1 || nums[mid + 1] !== target) {
        return mid;
      }
      // 否则，继续在右部分遍历
      left = mid + 1;
    }
  }

  // left === right
  if (nums[left] === target) {
    return left;
  }

  return -1;
}

/**
 * 寻找指定数字的出现次数
 *
 * @param {Array} nums
 * @param {*} target
 */
function getTotalTimes(nums, target) {
  const length = nums.length;
  if (!length) {
    return 0;
  }

  return findBoundary(nums, target, 'right') - findBoundary(nums, target, 'left') + 1;
}

/**
 * 以下是测试代码
 */

const nums = [1, 2, 3, 3, 3, 4, 5];
console.log(getTotalTimes(nums, 3));
```
