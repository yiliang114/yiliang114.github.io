---
layout: CustomPages
title: Sorting
date: 2020-11-21
aside: false
draft: true
---

## SF/ALGs/sort/Sorting/HeapSort.js

```js
import MaxHeap from '../DataStructures/MaxHeap';

export default function HeapSort(items: Array<number>) {
  const heap = new MaxHeap();
  const list = [];

  // Insert every element in the node into the heap. Calling
  // insert() will maxHeapify()
  items.forEach(item => {
    heap.insert(item);
  });

  // For every element in the heap, delete the max value.
  // Right after deletion, the MaxHeap will automatically propogate
  // the next highest value of the heap to the root
  heap.get().forEach(() => {
    // Delete the roo
    const node = heap.deleteNodeIndex(0);
    list.push(node);
  });

  return list.reverse();
}
```

## SF/ALGs/sort/Sorting/InsertionSort.js

```js
/**
 * InsertionSort is simple sorting algorithm. Is efficient when
 * sorting small data sets. Often used in conjunction with Bucket sort
 * More specifically, run time requires n checks + (# of inversions)
 *
 *
 * Notes:
 * - Stable
 * - In-place
 *
 * @complexity: O(n^2)
 * @flow
 */
export default function InsertionSort(items: Array<number>): Array<number> {
  const itemsCopy = [...items];
  let value; // the value currently being compared
  let i; // index of first element in unsorted section
  let j; // index going into sorted section

  for (i = 0; i < itemsCopy.length; i++) {
    value = itemsCopy[i];
    j = i - 1;
    while (j >= 0 && itemsCopy[j] > value) {
      itemsCopy[j + 1] = itemsCopy[j];
      j--;
    }
    itemsCopy[j + 1] = value;
  }

  return itemsCopy;
}
```

## SF/ALGs/sort/Sorting/KahnsTopologicalSort.js

```js
/**
 * Kahns topsort algo
 * @param {*} nodes In adjacency list format
 */
export default function KahnsTopologicalSort(nodes) {
  const ordering = [];
  const queue = [];

  // Indexes correspond to node, values correspond to indegree
  // ex. 0 -> 3, node 0 has indegree 3
  const indegrees = new Array(nodes).fill(0);

  for (const outdegrees of Object.values(nodes)) {
    for (const outdegree of outdegrees) {
      indegrees[outdegree]++;
    }
  }

  if (!indegrees.includes(0)) {
    throw new Error('Cycle in graph');
  }

  // Find all nodes of indegree 0 and add them to queue. These
  // nodes have no parents so they go first in topological order
  for (let i = 0; i < indegrees.length; i++) {
    if (indegrees[i] === 0) {
      queue.push(queue);
    }
  }

  while (queue.length) {
    const node = queue.shift();
    ordering.push(node);
    // For each child, decrement indegree because we are removing parent
    for (const child of nodes[node]) {
      indegrees[child]--;
      if (indegrees[child] === 0) {
        queue.push(child);
      }
    }
  }

  if (ordering.length !== nodes.length) {
    throw new Error('Cycle in graph');
  }

  return ordering;
}
```

## SF/ALGs/sort/Sorting/MergeSortRecursive.js

```js
/**
 * MergeSort is an efficient algorithm that utilizes the divide-and-conquer paradigm
 *
 * Notes:
 * - Has best, average, and worst case of O(nlgn)
 * - Stable
 * - Not in-place. Requires O(n) space since each recursive call on MergeSort
 *   creates temporary arrays to store values
 *
 * @complexity: O(nlgn)
 * @flow
 */
export default function MergeSortRecursive(items) {
  return _divide(items);
}

const _items = [];

function _divide(array) {
  switch (array.length) {
    case 1:
      _items.push(array);
      return _items;
    default: {
      const middle = Math.floor(array.length / 2);
      const first = array.splice(middle);
      return _merge(_divide(first), _divide(array));
    }
  }
}

// The 'target' array is the array that we'll merge into. This array will be
// shorter in length so that we don't access an array index that's out of bounds
function _merge(first, second) {
  const merged = [];
  const [target, source] = first.length > second.length ? [first, second] : [second, first];

  for (let i = 0; i < target.length && i < source.length; i++) {
    if (target[i] < source[i]) {
      merged.push(target[i]);
      merged.push(source[i]);
    } else {
      merged.push(source[i]);
      merged.push(target[i]);
    }
  }

  if (merged.length < target.length + source.length) {
    const diff = target.length - source.length;
    for (let i = target.length - diff; i < target.length; i++) {
      merged.push(target[i]);
    }
  }

  return merged;
}
```

## SF/ALGs/sort/Sorting/MiddleShift.js

```js
/**
 * Add a number to the middle of an array
 *
 * Solution: Find the index closest to the 'middle' of an array. Then add the
 *           elements that follow it to separate
 * @flow
 */

/**
 * Complexity: O((n/2)^2)
 */
export function SlowMiddleShift(string, char) {
  const middleIndex = Math.floor(string.length / 2);
  let formatted = string.substring(0, middleIndex);

  // BAD
  // O((n/2)^2)
  formatted += char;

  for (let i = middleIndex; i < string.length; i++) {
    formatted += string[i];
  }

  return formatted;
}

/**
 * Complexity: O(n+1)
 */
export default function FastMiddleShift(string, char) {
  const middleIndex = Math.floor(string.length / 2);
  return string.substring(0, middleIndex) + char + string.substring(middleIndex);
}
```

## SF/ALGs/sort/Sorting/QuickSort.js

```js
/**
 * QuickSort is an efficient sorting algorithm that utilizes the divide-and-conquer paradigm
 *
 * Notes:
 * - Algorithm derived via Introduction to Algorithm (Cormen et al)
 * - Has an optimal best and average case (O(nlgn)) but unlikely poor worst case (O(n^2))
 *   - Worst occurs when QuickSort produces a maximally unbalanced subproblem with n-1 elements
 *     and one with 0 elements, and happens through every iteration of QuickSort
 * - Not stable (Other implementations of QuickSort are)
 * - In-place (Other implementations of QuickSort aren't)
 * - This implementation uses randomly selected pivots for better performance
 *
 * @complexity: O(nlgn)
 * @flow
 */
export default function QuickSort(items) {
  const itemsCopy = [...items];
  QuickSortRecursive(itemsCopy, 0, itemsCopy.length - 1);
  return itemsCopy;
}

function QuickSortRecursive(items, p, r) {
  if (p < r) {
    const q = RandomizedPartition(items, p, r);
    QuickSortRecursive(items, p, q - 1);
    QuickSortRecursive(items, q + 1, r);
  }
}

function RandomizedPartition(items, p, r) {
  const i = getRandomInt(p, r);
  Swap(items, i, r);
  return Partition(items, p, r);
}

function Partition(items, p, r) {
  const x = items[r];
  let i = p - 1;

  for (let j = p; j < r; j++) {
    if (items[j] <= x) {
      i++;
      Swap(items, i, j);
    }
  }

  Swap(items, i + 1, r);

  return i + 1;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Swap(arr, x, y) {
  const temp = arr[x];
  arr[x] = arr[y];
  arr[y] = temp;
}
```

## SF/ALGs/sort/Sorting/SelectionSort.js

```js
/**
 * For each element, check if there are any other elements smaller than it.
 * If there are, swap those elements.
 *
 * @complexity: O(n^2)
 * @flow
 */
export default function SelectionSort(elements) {
  const { length } = elements;

  for (let i = 0; i < length; i++) {
    let lowestIndex = i;

    for (let k = i + 1; k < length; k++) {
      if (elements[k] < elements[lowestIndex]) {
        lowestIndex = k;
      }
    }

    if (lowestIndex !== i) {
      swap(elements, i, lowestIndex);
    }
  }

  return elements;
}

function swap(items, firstIndex, secondIndex) {
  const temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
}
```

## SF/ALGs/sort/sort_max_pq.js

```js
const pq = [];
let N = 0;

function less(i, j) {
  return pq[i] < pq[j];
}

function swap(i, j) {
  let tmp = pq[i];
  pq[i] = pq[j];
  pq[j] = tmp;
}

// 上浮
function swim(k) {
  while (k > 1 && less(parseInt(k / 2), k)) {
    swap(parseInt(k / 2), k);
    k = parseInt(k / 2);
  }
}

// 下沉
function sink(k) {
  while (2 * k <= N) {
    let j = 2 * k;
    if ((j < N) & less(j, j + 1)) j++;
    if (!less(k, j)) break;
    swap(k, j);
    k = j;
  }
}

function insert(v) {
  pq[++N] = v;
  swim(N);
  console.log(pq);
}

function deleteMax() {
  let max = pq[1];
  swap(1, N--);
  pq[N + 1] = null;
  sink(1);
  console.log(pq);
  return max;
}

insert('P');
insert('Q');
insert('E');
deleteMax();
insert('X');
insert('A');
insert('M');
deleteMax();
insert('P');
insert('L');
insert('E');
deleteMax();

/**
 * 堆排序
 * 将数组变为二叉字符树
 * 通过操作字符数的上浮和下沉来完成两个功能
 *  1. 删除并返回最大值
 *  2. 插入并求出最大值
 */
/*
[empty, "P"]
[empty, "Q", "P"]
[empty, "Q", "P", "E"]
[empty, "P", "E", null]
[empty, "X", "E", "P"]
[empty, "X", "E", "P", "A"]
[empty, "X", "M", "P", "A", "E"]
[empty, "P", "M", "E", "A", null]
[empty, "P", "P", "E", "A", "M"]
[empty, "P", "P", "L", "A", "M", "E"]
[empty, "P", "P", "L", "A", "M", "E", "E"]
[empty, "P", "M", "L", "A", "E", "E", null]
 */
```

## SF/ALGs/sort/sort_max_pq_02.js

```js
// 上浮
// function swim(k) {
//     while (k > 1 && less(parseInt(k / 2), k)) {
//         swap(parseInt(k / 2), k)
//         k = parseInt(k / 2)
//     }
// }

// 下沉
function sink(arr, k, len) {
  while (2 * k <= len) {
    let j = 2 * k;
    if ((j < len) & (arr[j] < arr[j + 1])) j++;
    if (arr[k] >= arr[j]) break;
    swap(arr, k, j);
    k = j;
  }
  console.log('sink', arr);
}

function sort(arr) {
  let len = arr.length;
  console.log('step 01');
  for (let k = parseInt(len / 2); k >= 0; k--) {
    sink(arr, k, len);
  }
  len--;
  console.log('step 02');
  while (len > 0) {
    swap(arr, 0, len--);
    sink(arr, 0, len);
  }
  console.log(arr);
}

function swap(arr, a, b) {
  let x = arr[a];
  arr[a] = arr[b];
  arr[b] = x;
}

const arr = ['S', 'O', 'R', 'T', 'E', 'X', 'A', 'M', 'P', 'L', 'E'];
sort(arr);

/**
 * 堆排序
 * 先将数组进行堆有序化
 * 然后求出最大值移动到最后
 * 然后将堆的范围向前缩小一位
 */
/*
step 01
["S", "O", "R", "T", "E", "X", "A", "M", "P", "L", "E"]
["S", "O", "R", "T", "P", "X", "A", "M", "E", "L", "E"]
["S", "O", "R", "T", "P", "X", "A", "M", "E", "L", "E"]
["S", "O", "X", "T", "P", "R", "A", "M", "E", "L", "E"]
["S", "X", "R", "T", "P", "O", "A", "M", "E", "L", "E"]
["X", "T", "R", "S", "P", "O", "A", "M", "E", "L", "E"]
step 02
["T", "S", "R", "M", "P", "O", "A", "E", "E", "L", "X"]
["S", "R", "P", "M", "L", "O", "A", "E", "E", "T", "X"]
["R", "P", "O", "M", "L", "E", "A", "E", "S", "T", "X"]
["P", "O", "L", "M", "E", "E", "A", "R", "S", "T", "X"]
["O", "M", "L", "A", "E", "E", "P", "R", "S", "T", "X"]
["M", "L", "E", "A", "E", "O", "P", "R", "S", "T", "X"]
["L", "E", "E", "A", "M", "O", "P", "R", "S", "T", "X"]
["E", "E", "A", "L", "M", "O", "P", "R", "S", "T", "X"]
["E", "A", "E", "L", "M", "O", "P", "R", "S", "T", "X"]
["A", "E", "E", "L", "M", "O", "P", "R", "S", "T", "X"]
*/
```

## SF/ALGs/sort/sort_merge_b2t.js

```js
const arr = [];
const str = 'SORTEXAMPLE';

for (let char of str) {
  arr.push(char);
}

let aux = new Array(arr.length);
function sort(arr) {
  const len = arr.length;
  aux = new Array(len);
  for (let sz = 1; sz < len; sz = sz + sz) {
    for (let lo = 0; lo < len - sz; lo += sz + sz) {
      merge(arr, lo, lo + sz - 1, Math.min((len - 1, lo + sz + sz - 1)));
    }
  }
}

function merge(arr, lo, mid, hi) {
  let i = lo,
    j = mid + 1;
  for (let k = lo; k <= hi; k++) {
    aux[k] = arr[k];
  }
  for (let k = lo; k <= hi; k++) {
    if (i > mid) arr[k] = aux[j++];
    else if (j > hi) arr[k] = aux[i++];
    else if (aux[j] < aux[i]) arr[k] = aux[j++];
    else arr[k] = aux[i++];
  }
  console.log(arr);
}

sort(arr, 0, arr.length - 1);

/*
这是一种先两两对比，然后44对比，如此往复。
最后对比整个数组。
["S", "O", "R", "T", "E", "X", "A", "M", "P", "L", "E"]
["O", "S", "R", "T", "E", "X", "A", "M", "P", "L", "E"]
["O", "S", "R", "T", "E", "X", "A", "M", "P", "L", "E"]
["O", "S", "R", "T", "E", "X", "A", "M", "P", "L", "E"]
["O", "S", "R", "T", "E", "X", "A", "M", "P", "L", "E"]
["O", "S", "R", "T", "E", "X", "A", "M", "L", "P", "E"]
["O", "R", "S", "T", "E", "X", "A", "M", "L", "P", "E"]
["O", "R", "S", "T", "A", "E", "M", "X", "L", "P", "E"]
["O", "R", "S", "T", "A", "E", "M", "X", "E", "L", "P", undefined]
["A", "E", "M", "O", "R", "S", "T", "X", "E", "L", "P", undefined]
["A", "E", "E", "L", "M", "O", "P", "R", "S", "T", "X", undefined, undefined, undefined, undefined, undefined]
*/
```

## SF/ALGs/sort/sort_merge_t2b.js

```js
const arr = [];
const str = 'SORTEXAMPLE';

for (let char of str) {
  arr.push(char);
}

let aux = new Array(arr.length);
function sort(arr, lo, hi) {
  if (hi <= lo) return;
  let mid = lo + parseInt((hi - lo) / 2);

  sort(arr, lo, mid);
  sort(arr, mid + 1, hi);
  merge(arr, lo, mid, hi);
}

function merge(arr, lo, mid, hi) {
  let i = lo,
    j = mid + 1;
  for (let k = lo; k <= hi; k++) {
    aux[k] = arr[k];
  }
  for (let k = lo; k <= hi; k++) {
    if (i > mid) arr[k] = aux[j++];
    else if (j > hi) arr[k] = aux[i++];
    else if (aux[j] < aux[i]) arr[k] = aux[j++];
    else arr[k] = aux[i++];
  }
  console.log(arr);
}

sort(arr, 0, arr.length - 1);

/*
通过归并法缩小范围
["S", "O", "R", "T", "E", "X", "A", "M", "P", "L", "E"]
left
["O", "S", "R", "T", "E", "X", "A", "M", "P", "L", "E"]
["O", "R", "S", "T", "E", "X", "A", "M", "P", "L", "E"]
["O", "R", "S", "E", "T", "X", "A", "M", "P", "L", "E"]
["O", "R", "S", "E", "T", "X", "A", "M", "P", "L", "E"]
["E", "O", "R", "S", "T", "X", "A", "M", "P", "L", "E"]
["E", "O", "R", "S", "T", "X", "A", "M", "P", "L", "E"]
right
["E", "O", "R", "S", "T", "X", "A", "M", "P", "L", "E"]
["E", "O", "R", "S", "T", "X", "A", "M", "P", "E", "L"]
["E", "O", "R", "S", "T", "X", "A", "E", "L", "M", "P"]
all
["A", "E", "E", "L", "M", "O", "P", "R", "S", "T", "X"]
*/
```

## SF/ALGs/sort/sorting-1/Sort.js

```js
import Comparator from '../../utils/comparator/Comparator';

/**
 * @typedef {Object} SorterCallbacks
 * @property {function(a: *, b: *)} compareCallback - If provided then all elements comparisons
 *  will be done through this callback.
 * @property {function(a: *)} visitingCallback - If provided it will be called each time the sorting
 *  function is visiting the next element.
 */

export default class Sort {
  constructor(originalCallbacks) {
    this.callbacks = Sort.initSortingCallbacks(originalCallbacks);
    this.comparator = new Comparator(this.callbacks.compareCallback);
  }

  /**
   * @param {SorterCallbacks} originalCallbacks
   * @returns {SorterCallbacks}
   */
  static initSortingCallbacks(originalCallbacks) {
    const callbacks = originalCallbacks || {};
    const stubCallback = () => {};

    callbacks.compareCallback = callbacks.compareCallback || undefined;
    callbacks.visitingCallback = callbacks.visitingCallback || stubCallback;

    return callbacks;
  }

  sort() {
    throw new Error('sort method must be implemented');
  }
}
```

## SF/ALGs/sort/sorting-1/SortTester.js

```js
export const sortedArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
export const reverseArr = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
export const notSortedArr = [15, 8, 5, 12, 10, 1, 16, 9, 11, 7, 20, 3, 2, 6, 17, 18, 4, 13, 14, 19];
export const equalArr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
export const negativeArr = [-1, 0, 5, -10, 20, 13, -7, 3, 2, -3];
export const negativeArrSorted = [-10, -7, -3, -1, 0, 2, 3, 5, 13, 20];

export class SortTester {
  static testSort(SortingClass) {
    const sorter = new SortingClass();

    expect(sorter.sort([])).toEqual([]);
    expect(sorter.sort([1])).toEqual([1]);
    expect(sorter.sort([1, 2])).toEqual([1, 2]);
    expect(sorter.sort([2, 1])).toEqual([1, 2]);
    expect(sorter.sort([3, 4, 2, 1, 0, 0, 4, 3, 4, 2])).toEqual([0, 0, 1, 2, 2, 3, 3, 4, 4, 4]);
    expect(sorter.sort(sortedArr)).toEqual(sortedArr);
    expect(sorter.sort(reverseArr)).toEqual(sortedArr);
    expect(sorter.sort(notSortedArr)).toEqual(sortedArr);
    expect(sorter.sort(equalArr)).toEqual(equalArr);
  }

  static testNegativeNumbersSort(SortingClass) {
    const sorter = new SortingClass();
    expect(sorter.sort(negativeArr)).toEqual(negativeArrSorted);
  }

  static testSortWithCustomComparator(SortingClass) {
    const callbacks = {
      compareCallback: (a, b) => {
        if (a.length === b.length) {
          return 0;
        }
        return a.length < b.length ? -1 : 1;
      },
    };

    const sorter = new SortingClass(callbacks);

    expect(sorter.sort([''])).toEqual(['']);
    expect(sorter.sort(['a'])).toEqual(['a']);
    expect(sorter.sort(['aa', 'a'])).toEqual(['a', 'aa']);
    expect(sorter.sort(['aa', 'q', 'bbbb', 'ccc'])).toEqual(['q', 'aa', 'ccc', 'bbbb']);
    expect(sorter.sort(['aa', 'aa'])).toEqual(['aa', 'aa']);
  }

  static testSortStability(SortingClass) {
    const callbacks = {
      compareCallback: (a, b) => {
        if (a.length === b.length) {
          return 0;
        }
        return a.length < b.length ? -1 : 1;
      },
    };

    const sorter = new SortingClass(callbacks);

    expect(sorter.sort(['bb', 'aa', 'c'])).toEqual(['c', 'bb', 'aa']);
    expect(sorter.sort(['aa', 'q', 'a', 'bbbb', 'ccc'])).toEqual(['q', 'a', 'aa', 'ccc', 'bbbb']);
  }

  static testAlgorithmTimeComplexity(SortingClass, arrayToBeSorted, numberOfVisits) {
    const visitingCallback = jest.fn();
    const callbacks = { visitingCallback };
    const sorter = new SortingClass(callbacks);

    sorter.sort(arrayToBeSorted);

    expect(visitingCallback).toHaveBeenCalledTimes(numberOfVisits);
  }
}
```

## SF/ALGs/sort/sorting-1/bubble-sort/BubbleSort.js

```js
import Sort from '../Sort';

export default class BubbleSort extends Sort {
  sort(originalArray) {
    // Flag that holds info about whether the swap has occur or not.
    let swapped = false;
    // Clone original array to prevent its modification.
    const array = [...originalArray];

    for (let i = 1; i < array.length; i += 1) {
      swapped = false;

      // Call visiting callback.
      this.callbacks.visitingCallback(array[i]);

      for (let j = 0; j < array.length - i; j += 1) {
        // Call visiting callback.
        this.callbacks.visitingCallback(array[j]);

        // Swap elements if they are in wrong order.
        if (this.comparator.lessThan(array[j + 1], array[j])) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];

          // Register the swap.
          swapped = true;
        }
      }

      // If there were no swaps then array is already sorted and there is
      // no need to proceed.
      if (!swapped) {
        return array;
      }
    }

    return array;
  }
}
```

## SF/ALGs/sort/sorting-1/counting-sort/CountingSort.js

```js
import Sort from '../Sort';

export default class CountingSort extends Sort {
  /**
   * @param {number[]} originalArray
   * @param {number} [smallestElement]
   * @param {number} [biggestElement]
   */
  sort(originalArray, smallestElement = undefined, biggestElement = undefined) {
    // Init biggest and smallest elements in array in order to build number bucket array later.
    let detectedSmallestElement = smallestElement || 0;
    let detectedBiggestElement = biggestElement || 0;

    if (smallestElement === undefined || biggestElement === undefined) {
      originalArray.forEach(element => {
        // Visit element.
        this.callbacks.visitingCallback(element);

        // Detect biggest element.
        if (this.comparator.greaterThan(element, detectedBiggestElement)) {
          detectedBiggestElement = element;
        }

        // Detect smallest element.
        if (this.comparator.lessThan(element, detectedSmallestElement)) {
          detectedSmallestElement = element;
        }
      });
    }

    // Init buckets array.
    // This array will hold frequency of each number from originalArray.
    const buckets = Array(detectedBiggestElement - detectedSmallestElement + 1).fill(0);

    originalArray.forEach(element => {
      // Visit element.
      this.callbacks.visitingCallback(element);

      buckets[element - detectedSmallestElement] += 1;
    });

    // Add previous frequencies to the current one for each number in bucket
    // to detect how many numbers less then current one should be standing to
    // the left of current one.
    for (let bucketIndex = 1; bucketIndex < buckets.length; bucketIndex += 1) {
      buckets[bucketIndex] += buckets[bucketIndex - 1];
    }

    // Now let's shift frequencies to the right so that they show correct numbers.
    // I.e. if we won't shift right than the value of buckets[5] will display how many
    // elements less than 5 should be placed to the left of 5 in sorted array
    // INCLUDING 5th. After shifting though this number will not include 5th anymore.
    buckets.pop();
    buckets.unshift(0);

    // Now let's assemble sorted array.
    const sortedArray = Array(originalArray.length).fill(null);
    for (let elementIndex = 0; elementIndex < originalArray.length; elementIndex += 1) {
      // Get the element that we want to put into correct sorted position.
      const element = originalArray[elementIndex];

      // Visit element.
      this.callbacks.visitingCallback(element);

      // Get correct position of this element in sorted array.
      const elementSortedPosition = buckets[element - detectedSmallestElement];

      // Put element into correct position in sorted array.
      sortedArray[elementSortedPosition] = element;

      // Increase position of current element in the bucket for future correct placements.
      buckets[element - detectedSmallestElement] += 1;
    }

    // Return sorted array.
    return sortedArray;
  }
}
```

## SF/ALGs/sort/sorting-1/heap-sort/HeapSort.js

```js
import Sort from '../Sort';
import MinHeap from '../../../data-structures/heap/MinHeap';

export default class HeapSort extends Sort {
  sort(originalArray) {
    const sortedArray = [];
    const minHeap = new MinHeap(this.callbacks.compareCallback);

    // Insert all array elements to the heap.
    originalArray.forEach(element => {
      // Call visiting callback.
      this.callbacks.visitingCallback(element);

      minHeap.add(element);
    });

    // Now we have min heap with minimal element always on top.
    // Let's poll that minimal element one by one and thus form the sorted array.
    while (!minHeap.isEmpty()) {
      const nextMinElement = minHeap.poll();

      // Call visiting callback.
      this.callbacks.visitingCallback(nextMinElement);

      sortedArray.push(nextMinElement);
    }

    return sortedArray;
  }
}
```

## SF/ALGs/sort/sorting-1/insertion-sort/InsertionSort.js

```js
import Sort from '../Sort';

export default class InsertionSort extends Sort {
  sort(originalArray) {
    const array = [...originalArray];

    // Go through all array elements...
    for (let i = 0; i < array.length; i += 1) {
      let currentIndex = i;

      // Call visiting callback.
      this.callbacks.visitingCallback(array[i]);

      // Go and check if previous elements and greater then current one.
      // If this is the case then swap that elements.
      while (
        array[currentIndex - 1] !== undefined &&
        this.comparator.lessThan(array[currentIndex], array[currentIndex - 1])
      ) {
        // Call visiting callback.
        this.callbacks.visitingCallback(array[currentIndex - 1]);

        // Swap the elements.
        const tmp = array[currentIndex - 1];
        array[currentIndex - 1] = array[currentIndex];
        array[currentIndex] = tmp;

        // Shift current index left.
        currentIndex -= 1;
      }
    }

    return array;
  }
}
```

## SF/ALGs/sort/sorting-1/merge-sort/MergeSort.js

```js
import Sort from '../Sort';

export default class MergeSort extends Sort {
  sort(originalArray) {
    // Call visiting callback.
    this.callbacks.visitingCallback(null);

    // If array is empty or consists of one element then return this array since it is sorted.
    if (originalArray.length <= 1) {
      return originalArray;
    }

    // Split array on two halves.
    const middleIndex = Math.floor(originalArray.length / 2);
    const leftArray = originalArray.slice(0, middleIndex);
    const rightArray = originalArray.slice(middleIndex, originalArray.length);

    // Sort two halves of split array
    const leftSortedArray = this.sort(leftArray);
    const rightSortedArray = this.sort(rightArray);

    // Merge two sorted arrays into one.
    return this.mergeSortedArrays(leftSortedArray, rightSortedArray);
  }

  mergeSortedArrays(leftArray, rightArray) {
    let sortedArray = [];

    // In case if arrays are not of size 1.
    while (leftArray.length && rightArray.length) {
      let minimumElement = null;

      // Find minimum element of two arrays.
      if (this.comparator.lessThanOrEqual(leftArray[0], rightArray[0])) {
        minimumElement = leftArray.shift();
      } else {
        minimumElement = rightArray.shift();
      }

      // Call visiting callback.
      this.callbacks.visitingCallback(minimumElement);

      // Push the minimum element of two arrays to the sorted array.
      sortedArray.push(minimumElement);
    }

    // If one of two array still have elements we need to just concatenate
    // this element to the sorted array since it is already sorted.
    if (leftArray.length) {
      sortedArray = sortedArray.concat(leftArray);
    }

    if (rightArray.length) {
      sortedArray = sortedArray.concat(rightArray);
    }

    return sortedArray;
  }
}
```

## SF/ALGs/sort/sorting-1/quick-sort/QuickSort.js

```js
import Sort from '../Sort';

export default class QuickSort extends Sort {
  /**
   * @param {*[]} originalArray
   * @return {*[]}
   */
  sort(originalArray) {
    // Clone original array to prevent it from modification.
    const array = [...originalArray];

    // If array has less than or equal to one elements then it is already sorted.
    if (array.length <= 1) {
      return array;
    }

    // Init left and right arrays.
    const leftArray = [];
    const rightArray = [];

    // Take the first element of array as a pivot.
    const pivotElement = array.shift();
    const centerArray = [pivotElement];

    // Split all array elements between left, center and right arrays.
    while (array.length) {
      const currentElement = array.shift();

      // Call visiting callback.
      this.callbacks.visitingCallback(currentElement);

      if (this.comparator.equal(currentElement, pivotElement)) {
        centerArray.push(currentElement);
      } else if (this.comparator.lessThan(currentElement, pivotElement)) {
        leftArray.push(currentElement);
      } else {
        rightArray.push(currentElement);
      }
    }

    // Sort left and right arrays.
    const leftArraySorted = this.sort(leftArray);
    const rightArraySorted = this.sort(rightArray);

    // Let's now join sorted left array with center array and with sorted right array.
    return leftArraySorted.concat(centerArray, rightArraySorted);
  }
}
```

## SF/ALGs/sort/sorting-1/quick-sort/QuickSortInPlace.js

```js
import Sort from '../Sort';

export default class QuickSortInPlace extends Sort {
  /** Sorting in place avoids unnecessary use of additional memory, but modifies input array.
   *
   * This process is difficult to describe, but much clearer with a visualization:
   * @see: http://www.algomation.com/algorithm/quick-sort-visualization
   *
   * @param {*[]} originalArray - Not sorted array.
   * @param {number} inputLowIndex
   * @param {number} inputHighIndex
   * @param {boolean} recursiveCall
   * @return {*[]} - Sorted array.
   */
  sort(originalArray, inputLowIndex = 0, inputHighIndex = originalArray.length - 1, recursiveCall = false) {
    // Copies array on initial call, and then sorts in place.
    const array = recursiveCall ? originalArray : [...originalArray];

    /**
     * The partitionArray() operates on the subarray between lowIndex and highIndex, inclusive.
     * It arbitrarily chooses the last element in the subarray as the pivot.
     * Then, it partially sorts the subarray into elements than are less than the pivot,
     * and elements that are greater than or equal to the pivot.
     * Each time partitionArray() is executed, the pivot element is in its final sorted position.
     *
     * @param {number} lowIndex
     * @param {number} highIndex
     * @return {number}
     */
    const partitionArray = (lowIndex, highIndex) => {
      /**
       * Swaps two elements in array.
       * @param {number} leftIndex
       * @param {number} rightIndex
       */
      const swap = (leftIndex, rightIndex) => {
        const temp = array[leftIndex];
        array[leftIndex] = array[rightIndex];
        array[rightIndex] = temp;
      };

      const pivot = array[highIndex];
      // visitingCallback is used for time-complexity analysis.
      this.callbacks.visitingCallback(pivot);

      let partitionIndex = lowIndex;
      for (let currentIndex = lowIndex; currentIndex < highIndex; currentIndex += 1) {
        if (this.comparator.lessThan(array[currentIndex], pivot)) {
          swap(partitionIndex, currentIndex);
          partitionIndex += 1;
        }
      }

      // The element at the partitionIndex is guaranteed to be greater than or equal to pivot.
      // All elements to the left of partitionIndex are guaranteed to be less than pivot.
      // Swapping the pivot with the partitionIndex therefore places the pivot in its
      // final sorted position.
      swap(partitionIndex, highIndex);

      return partitionIndex;
    };

    // Base case is when low and high converge.
    if (inputLowIndex < inputHighIndex) {
      const partitionIndex = partitionArray(inputLowIndex, inputHighIndex);
      const RECURSIVE_CALL = true;
      this.sort(array, inputLowIndex, partitionIndex - 1, RECURSIVE_CALL);
      this.sort(array, partitionIndex + 1, inputHighIndex, RECURSIVE_CALL);
    }

    return array;
  }
}
```

## SF/ALGs/sort/sorting-1/radix-sort/RadixSort.js

```js
import Sort from '../Sort';

// Using charCode (a = 97, b = 98, etc), we can map characters to buckets from 0 - 25
const BASE_CHAR_CODE = 97;
const NUMBER_OF_POSSIBLE_DIGITS = 10;
const ENGLISH_ALPHABET_LENGTH = 26;

export default class RadixSort extends Sort {
  /**
   * @param {*[]} originalArray
   * @return {*[]}
   */
  sort(originalArray) {
    // Assumes all elements of array are of the same type
    const isArrayOfNumbers = this.isArrayOfNumbers(originalArray);

    let sortedArray = [...originalArray];
    const numPasses = this.determineNumPasses(sortedArray);

    for (let currentIndex = 0; currentIndex < numPasses; currentIndex += 1) {
      const buckets = isArrayOfNumbers
        ? this.placeElementsInNumberBuckets(sortedArray, currentIndex)
        : this.placeElementsInCharacterBuckets(sortedArray, currentIndex, numPasses);

      // Flatten buckets into sortedArray, and repeat at next index
      sortedArray = buckets.reduce((acc, val) => {
        return [...acc, ...val];
      }, []);
    }

    return sortedArray;
  }

  /**
   * @param {*[]} array
   * @param {number} index
   * @return {*[]}
   */
  placeElementsInNumberBuckets(array, index) {
    // See below. These are used to determine which digit to use for bucket allocation
    const modded = 10 ** (index + 1);
    const divided = 10 ** index;
    const buckets = this.createBuckets(NUMBER_OF_POSSIBLE_DIGITS);

    array.forEach(element => {
      this.callbacks.visitingCallback(element);
      if (element < divided) {
        buckets[0].push(element);
      } else {
        /**
         * Say we have element of 1,052 and are currently on index 1 (starting from 0). This means
         * we want to use '5' as the bucket. `modded` would be 10 ** (1 + 1), which
         * is 100. So we take 1,052 % 100 (52) and divide it by 10 (5.2) and floor it (5).
         */
        const currentDigit = Math.floor((element % modded) / divided);
        buckets[currentDigit].push(element);
      }
    });

    return buckets;
  }

  /**
   * @param {*[]} array
   * @param {number} index
   * @param {number} numPasses
   * @return {*[]}
   */
  placeElementsInCharacterBuckets(array, index, numPasses) {
    const buckets = this.createBuckets(ENGLISH_ALPHABET_LENGTH);

    array.forEach(element => {
      this.callbacks.visitingCallback(element);
      const currentBucket = this.getCharCodeOfElementAtIndex(element, index, numPasses);
      buckets[currentBucket].push(element);
    });

    return buckets;
  }

  /**
   * @param {string} element
   * @param {number} index
   * @param {number} numPasses
   * @return {number}
   */
  getCharCodeOfElementAtIndex(element, index, numPasses) {
    // Place element in last bucket if not ready to organize
    if (numPasses - index > element.length) {
      return ENGLISH_ALPHABET_LENGTH - 1;
    }

    /**
     * If each character has been organized, use first character to determine bucket,
     * otherwise iterate backwards through element
     */
    const charPos = index > element.length - 1 ? 0 : element.length - index - 1;

    return element.toLowerCase().charCodeAt(charPos) - BASE_CHAR_CODE;
  }

  /**
   * Number of passes is determined by the length of the longest element in the array.
   * For integers, this log10(num), and for strings, this would be the length of the string.
   */
  determineNumPasses(array) {
    return this.getLengthOfLongestElement(array);
  }

  /**
   * @param {*[]} array
   * @return {number}
   */
  getLengthOfLongestElement(array) {
    if (this.isArrayOfNumbers(array)) {
      return Math.floor(Math.log10(Math.max(...array))) + 1;
    }

    return array.reduce((acc, val) => {
      return val.length > acc ? val.length : acc;
    }, -Infinity);
  }

  /**
   * @param {*[]} array
   * @return {boolean}
   */
  isArrayOfNumbers(array) {
    // Assumes all elements of array are of the same type
    return this.isNumber(array[0]);
  }

  /**
   * @param {number} numBuckets
   * @return {*[]}
   */
  createBuckets(numBuckets) {
    /**
     * Mapping buckets to an array instead of filling them with
     * an array prevents each bucket from containing a reference to the same array
     */
    return new Array(numBuckets).fill(null).map(() => []);
  }

  /**
   * @param {*} element
   * @return {boolean}
   */
  isNumber(element) {
    return Number.isInteger(element);
  }
}
```

## SF/ALGs/sort/sorting-1/selection-sort/SelectionSort.js

```js
import Sort from '../Sort';

export default class SelectionSort extends Sort {
  sort(originalArray) {
    // Clone original array to prevent its modification.
    const array = [...originalArray];

    for (let i = 0; i < array.length - 1; i += 1) {
      let minIndex = i;

      // Call visiting callback.
      this.callbacks.visitingCallback(array[i]);

      // Find minimum element in the rest of array.
      for (let j = i + 1; j < array.length; j += 1) {
        // Call visiting callback.
        this.callbacks.visitingCallback(array[j]);

        if (this.comparator.lessThan(array[j], array[minIndex])) {
          minIndex = j;
        }
      }

      // If new minimum element has been found then swap it with current i-th element.
      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
      }
    }

    return array;
  }
}
```

## SF/ALGs/sort/sorting-1/shell-sort/ShellSort.js

```js
import Sort from '../Sort';

export default class ShellSort extends Sort {
  sort(originalArray) {
    // Prevent original array from mutations.
    const array = [...originalArray];

    // Define a gap distance.
    let gap = Math.floor(array.length / 2);

    // Until gap is bigger then zero do elements comparisons and swaps.
    while (gap > 0) {
      // Go and compare all distant element pairs.
      for (let i = 0; i < array.length - gap; i += 1) {
        let currentIndex = i;
        let gapShiftedIndex = i + gap;

        while (currentIndex >= 0) {
          // Call visiting callback.
          this.callbacks.visitingCallback(array[currentIndex]);

          // Compare and swap array elements if needed.
          if (this.comparator.lessThan(array[gapShiftedIndex], array[currentIndex])) {
            const tmp = array[currentIndex];
            array[currentIndex] = array[gapShiftedIndex];
            array[gapShiftedIndex] = tmp;
          }

          gapShiftedIndex = currentIndex;
          currentIndex -= gap;
        }
      }

      // Shrink the gap.
      gap = Math.floor(gap / 2);
    }

    // Return sorted copy of an original array.
    return array;
  }
}
```
