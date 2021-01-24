---
layout: CustomPages
title: Search
date: 2020-11-21
aside: false
draft: true
---

### BinarySearch

```js
export default function BinarySearchRecursive(items, element) {
  const middleIndex = Math.floor(items.length / 2);

  // Base Case
  if (items.length === 1) return items[0];

  if (items[middleIndex] <= element) {
    return BinarySearchRecursive(items.splice(middleIndex, items.length - 1), element);
  }

  return BinarySearchRecursive(items.splice(0, middleIndex), element);
}

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

```js
export default function BFS(tree) {
  const queue = [];
  const items = [];
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

### OnesInBinary

```js
function OnesInBinary(number) {
  const binary = new Array(32);
  let _placeholder = number;

  while (_placeholder > 0) {
    const pwr = Math.floor(Math.log2(_placeholder));
    _placeholder -= 2 ** pwr;
    binary[binary.length - 1 - pwr] = 1;
  }

  return binary.reduce((p, c) => (c === 1 ? p + 1 : p));
}

const binarySearch = (arr, target) => {
  let i = 0,
    j = arr.length - 1;
  while (i <= j) {
    let mid = i + parseInt((j - i) / 2);
    if (target === arr[mid]) return mid;
    if (target < arr[mid]) {
      j = mid - 1;
    } else {
      i = mid + 1;
    }
  }
  return -1;
};
```

### QuickSelect

```js
/**
 * QuickSelect is an algorithm to find the kth smallest number
 *
 * Notes:
 * -QuickSelect is related to QuickSort, thus has optimal best and average
 *  case (O(n)) but unlikely poor worst case (O(n^2))
 * -This implementation uses randomly selected pivots for better performance
 *
 * @complexity: O(n) (on average )
 * @complexity: O(n^2) (worst case)
 * @flow
 */
type num = number;

export default function QuickSelect(items, kth) {
  return RandomizedSelect(items, 0, items.length - 1, kth);
}

export function RandomizedSelect(items, left, right, i): any {
  if (left === right) return items[left];

  const pivotIndex = RandomizedPartition(items, left, right);
  const k = pivotIndex - left + 1;

  if (i === k) return items[pivotIndex];
  if (i < k) return RandomizedSelect(items, left, pivotIndex - 1, i);

  return RandomizedSelect(items, pivotIndex + 1, right, i - k);
}

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

### binary_search

```js
// 二分法查找，也称折半查找，是一种在有序数组中查找特定元素的搜索算法。查找过程可以分为以下步骤：
// (1)首先，从有序数组的中间的元素开始搜索，如果该元素正好是目标元素(即要查找的元素)，则搜索过程结束，否则进行下一步。
// (2)如果目标元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半区域查找，然后重复第一步的操作。
// (3)如果某一步数组为空，则表示找不到目标元素。

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

### interpolationSearch

```js
/**
 * Interpolation search implementation.
 *
 * @param {*[]} sortedArray - sorted array with uniformly distributed values
 * @param {*} seekElement
 * @return {number}
 */
export default function interpolationSearch(sortedArray, seekElement) {
  let leftIndex = 0;
  let rightIndex = sortedArray.length - 1;

  while (leftIndex <= rightIndex) {
    const rangeDelta = sortedArray[rightIndex] - sortedArray[leftIndex];
    const indexDelta = rightIndex - leftIndex;
    const valueDelta = seekElement - sortedArray[leftIndex];

    // If valueDelta is less then zero it means that there is no seek element
    // exists in array since the lowest element from the range is already higher
    // then seek element.
    if (valueDelta < 0) {
      return -1;
    }

    // If range delta is zero then subarray contains all the same numbers
    // and thus there is nothing to search for unless this range is all
    // consists of seek number.
    if (!rangeDelta) {
      // By doing this we're also avoiding division by zero while
      // calculating the middleIndex later.
      return sortedArray[leftIndex] === seekElement ? leftIndex : -1;
    }

    // Do interpolation of the middle index.
    const middleIndex = leftIndex + Math.floor((valueDelta * indexDelta) / rangeDelta);

    // If we've found the element just return its position.
    if (sortedArray[middleIndex] === seekElement) {
      return middleIndex;
    }

    // Decide which half to choose for seeking next: left or right one.
    if (sortedArray[middleIndex] < seekElement) {
      // Go to the right half of the array.
      leftIndex = middleIndex + 1;
    } else {
      // Go to the left half of the array.
      rightIndex = middleIndex - 1;
    }
  }

  return -1;
}
```

### jumpSearch

```js
import Comparator from '../../../utils/comparator/Comparator';

/**
 * Jump (block) search implementation.
 *
 * @param {*[]} sortedArray
 * @param {*} seekElement
 * @param {function(a, b)} [comparatorCallback]
 * @return {number}
 */
export default function jumpSearch(sortedArray, seekElement, comparatorCallback) {
  const comparator = new Comparator(comparatorCallback);
  const arraySize = sortedArray.length;

  if (!arraySize) {
    // We can't find anything in empty array.
    return -1;
  }

  // Calculate optimal jump size.
  // Total number of comparisons in the worst case will be ((arraySize/jumpSize) + jumpSize - 1).
  // The value of the function ((arraySize/jumpSize) + jumpSize - 1) will be minimum
  // when jumpSize = √array.length.
  const jumpSize = Math.floor(Math.sqrt(arraySize));

  // Find the block where the seekElement belong to.
  let blockStart = 0;
  let blockEnd = jumpSize;
  while (comparator.greaterThan(seekElement, sortedArray[Math.min(blockEnd, arraySize) - 1])) {
    // Jump to the next block.
    blockStart = blockEnd;
    blockEnd += jumpSize;

    // If our next block is out of array then we couldn't found the element.
    if (blockStart > arraySize) {
      return -1;
    }
  }

  // Do linear search for seekElement in subarray starting from blockStart.
  let currentIndex = blockStart;
  while (currentIndex < Math.min(blockEnd, arraySize)) {
    if (comparator.equal(sortedArray[currentIndex], seekElement)) {
      return currentIndex;
    }

    currentIndex += 1;
  }

  return -1;
}
```

### linearSearch

```js
import Comparator from '../../../utils/comparator/Comparator';

/**
 * Linear search implementation.
 *
 * @param {*[]} array
 * @param {*} seekElement
 * @param {function(a, b)} [comparatorCallback]
 * @return {number[]}
 */
export default function linearSearch(array, seekElement, comparatorCallback) {
  const comparator = new Comparator(comparatorCallback);
  const foundIndices = [];

  array.forEach((element, index) => {
    if (comparator.equal(element, seekElement)) {
      foundIndices.push(index);
    }
  });

  return foundIndices;
}
```

### search_binary

```js
function binarySearch(arr, val, lo, hi) {
  if (hi < lo) return null;
  let mid = lo + parseInt((hi - lo) / 2);
  console.log('范围', lo + '-' + hi);
  console.log('中间值', mid + ':' + arr[mid]);
  if (val < arr[mid]) {
    return binarySearch(arr, val, lo, mid - 1);
  } else if (val > arr[mid]) {
    return binarySearch(arr, val, mid + 1, hi);
  } else {
    return mid;
  }
}

const arr = [1, 3, 4, 5, 6, 7, 8, 9, 11, 13, 13, 13, 15, 16, 18, 20, 23, 24, 26, 27, 29, 30];

const index = binarySearch(arr, 8, 0, arr.length - 1);

function put(arr, val) {
  const i = binarySearch(arr, val, 0, arr.length - 1);
  arr.splice(i, 0, val);
}

/*
范围 0-21
中间值 10:13
范围 0-9
中间值 4:6
范围 5-9
中间值 7:9
范围 5-6
中间值 5:7
*/
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
  this.rignt = null;
}

function get(node, val) {
  if (node == null) return null;
  if (val < node.val) return get(x.left, val);
  if (val > node.val) return get(x.rignt, val);
  else return x.val;
}

function put(node, val) {
  if (node == null) node = new Node(val);
  if (val < node.val) return put(x.left, val);
  if (val > node.val) return put(x.rignt, val);
  else node.val = val;
  return node;
}
```

### search_linear

```js
let M = 4; // 线性探测表的大小
let N = 3; // 符号表中键值对的总数

function hash(key) {
  return key.charCodeAt() % M;
}

function put(key, val, keys, vals) {
  if (N >= parseInt(M / 2)) resize(2 * M);
  let i;
  for (i = hash(key); keys[i] != null; i = (i + 1) % M) {
    if (keys[i] == key) {
      vals[i] = val;
      return;
    }
  }
  keys[i] = key;
  vals[i] = val;
  N++;
}

function resize(len) {}

function get(key, keys, vals) {
  for (i = hash(key); keys[i] != null; i = (i + 1) % M) {
    if (keys[i] == key) {
      return vals[i];
    }
  }
  return null;
}

let keys = new Array(M);
let vals = new Array(M);

put('A', 'jack', keys, vals);
put('B', 'rose', keys, vals);
put('C', 'james', keys, vals);
put('D', 'over', keys, vals);
// put("E", "nash", keys, vals)
// put("F", "curry", keys, vals)
// put("G", "bb", keys, vals)
// put("H", "pet", keys, vals)
// put("I", "boss", keys, vals)
// put("J", "steven", keys, vals)
// put("K", "green", keys, vals)
// put("L", "klar", keys, vals)
console.log(keys);
console.log(vals);

/**
 * 散列表的线性探测法
 * 如果有两个相同散列值、不同键的相遇，后面的散列值往后移动。写不下就往后移动，就算有原主人来了也只好往后移动。
 * 如果有两个相同散列值、相同键的相遇，取后面的 value。
 *
 * TODO 在 JS 中和在 Java 中稍有不同，并没与实现成功。
 */
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

### search_zipper

```js
function hash(key) {
  return key.charCodeAt() % 4;
}

function get(arr, key) {
  return arr[hash(key)][key];
}

function put(arr, key, val) {
  let hashCode = hash(key);
  if (!arr[hashCode]) {
    arr[hashCode] = {};
  }
  arr[hashCode][key] = val;
}

let arr = {};

put(arr, 'A', 'jack');
put(arr, 'B', 'rose');
put(arr, 'C', 'wade');
put(arr, 'D', 'green');
put(arr, 'E', 'cook');
put(arr, 'F', 'curry');
put(arr, 'G', 'james');
console.log(arr);
console.log(get(arr, 'C'));

/**
 * 不知道这算不算是拉链法，通过求余将大量数据通过拉链法存储。
 * 获取的时候直接通过索引即可找到。而且还节省了存储空间。
 * 可以通过控制 arr 的长度来节省空间，也可以增加 arr 的长度来加快检索速度。
 */
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
