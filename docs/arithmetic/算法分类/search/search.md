---
layout: CustomPages
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
  let midIndex = parseInt((start + end) / 2);
  return arr[midIndex] === target
    ? midIndex
    : arr[midIndex] > target
    ? binary_search(arr, target, start, midIndex - 1)
    : binary_search(arr, target, midIndex + 1, end);
}

let a = [3, 4, 6, 1, 3, 6, 32, 45, 21, 12];
a = quickSort(a);

var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 23, 44, 86];
console.time('binary_search');
console.log('binary_search result: ', binary_search(a, 2, 0, a.length - 1));
console.log('binary_search result: ', binary_search(a, 3, 0, a.length - 1));
console.log('binary_search result: ', binary_search(arr, 10, 0, arr.length - 1));
console.log('binary_search result: ', binary_search(arr, 44, 0, arr.length - 1));
console.timeEnd('binary_search');
```

### 迭代和递归的二分搜索

```js
// 递归
export default function BinarySearchRecursive(items, element) {
  const middleIndex = Math.floor(items.length / 2);

  // Base Case
  if (items.length === 1) return items[0];

  if (items[middleIndex] <= element) {
    return BinarySearchRecursive(items.splice(middleIndex, items.length - 1), element);
  }

  return BinarySearchRecursive(items.splice(0, middleIndex), element);
}

// 迭代 ？
export function BinarySearchIterative(items, element) {
  let low = 0;
  let high = items.length - 1;

  while (low < high) {
    const middle = Math.floor((high + low) / 2);
    const middleElement = items[middle];
    // Check middle element is equal to the element we are looking for. If it is,
    // return it
    if (middleElement === element) return middle;

    if (middleElement > element) {
      high = middle - 1;
    } else {
      low = middle + 1;
    }
  }

  if (items[low] === element) return low;

  return -1;
}
```

### BreadthFirstSearch

广度优先 ？ TODO: 这个算法怪怪的。。。

```js
export default function BFS(tree) {
  const queue = [];
  const items = [];
  // 树的根节点数据
  if (tree && tree.value) queue.push(tree);
  while (queue.length) {
    const first = queue.shift();
    if (!first) return;
    items.push(first.value);
    if (first.left) queue.push(first.left);
    if (first.right) queue.push(first.right);
  }
  return items;
}
```

### QuickSelect

TODO:

```js
export default function QuickSelect(items, kth) {
  return RandomizedSelect(items, 0, items.length - 1, kth);
}

export function RandomizedSelect(items, left, right, i) {
  if (left === right) return items[left];

  const pivotIndex = RandomizedPartition(items, left, right);
  const k = pivotIndex - left + 1;

  if (i === k) return items[pivotIndex];
  if (i < k) return RandomizedSelect(items, left, pivotIndex - 1, i);

  return RandomizedSelect(items, pivotIndex + 1, right, i - k);
}

// 随机分区
export function RandomizedPartition(items, left, right) {
  const rand = getRandomInt(left, right);
  Swap(items, rand, right);
  return Partition(items, left, right);
}

function Partition(items, left, right) {
  const x = items[right];
  let pivotIndex = left - 1;

  for (let j = left; j < right; j++) {
    if (items[j] <= x) {
      pivotIndex++;
      Swap(items, pivotIndex, j);
    }
  }

  Swap(items, pivotIndex + 1, right);

  return pivotIndex + 1;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Swap(arr: any[], x: any, y: any) {
  const temp = arr[x];
  arr[x] = arr[y];
  arr[y] = temp;
}
```

### search_bst

```js
/**
 * 二叉树的查找
 * 使用递归的方式进行查找
 */
function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

function get(node, val) {
  if (node == null) return null;
  // 比目标值大的数据只会在右下侧？
  if (val < node.val) return get(x.left, val);
  if (val > node.val) return get(x.right, val);
  else return x.val;
}

function put(node, val) {
  if (node == null) node = new Node(val);
  if (val < node.val) return put(x.left, val);
  if (val > node.val) return put(x.right, val);
  else node.val = val;
  return node;
}
```

### search_linklist

```js
function node(key, val, next) {
  this.key = key;
  this.val = val;
  this.next = next;
}

function get(key, first) {
  for (let x = first; x != null; x = x.next) {
    if (key == x.key) {
      return x.val;
    }
  }
  return null;
}

function put(key, val, first) {
  for (let x = first; x != null; x = x.next) {
    if (key == x.key) {
      x.val = val;
      return;
    }
  }
  first = new node(key, val, first);
}

let S = new node(0, 'S', null);
let E = new node(1, 'E', null);
let A = new node(2, 'A', null);
let R = new node(3, 'R', null);
let C = new node(4, 'C', null);
let H = new node(5, 'H', null);
let EE = new node(6, 'E', null);
let first = new node(8, 'B', null);
first.next = S;
first.next.next = E;
first.next.next.next = A;
first.next.next.next.next = R;
first.next.next.next.next.next = C;
first.next.next.next.next.next.next = H;
first.next.next.next.next.next.next.next = EE;

console.log(first);
console.log(get(6, first));
console.log(get(3, first));
put(3, 'BB', first);
console.log(get(3, first));
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

#### 100 万个数抽 100 个怎么做？用什么数据结构？
