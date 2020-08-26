---
layout: CustomPages
title: 排序算法
date: 2020-08-25
aside: false
---

## 排序算法

各种排序优化版: https://blog.csdn.net/weixin_33856370/article/details/91381068

### 冒泡排序

```js
function bubbleSort(arr) {
  for (let i = 0, l = arr.length; i < l - 1; i++) {
    for (let j = i + 1; j < l; j++) {
      if (arr[i] > arr[j]) {
        let tem = arr[i];
        arr[i] = arr[j];
        arr[j] = tem;
      }
    }
  }
  return arr;
}
```

### 快速排序

快速排序，其效率很高，而其基本原理：算法参考某个元素值，将小于它的值，放到左数组中，大于它的值的元素就放到右数组中，然后递归进行上一次左右数组的操作，返回合并的数组就是已经排好顺序的数组了。

```js
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let leftArr = [];
  let rightArr = [];
  let q = arr[0];
  for (let i = 1, l = arr.length; i < l; i++) {
    if (arr[i] > q) {
      rightArr.push(arr[i]);
    } else {
      leftArr.push(arr[i]);
    }
  }
  return [].concat(quickSort(leftArr), [q], quickSort(rightArr));
}
```

### 插入排序

```js
function sort(arr) {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    for (let j = i; j > 0 && arr[j] < arr[j - 1]; j--) {
      swap(arr, j, j - 1);
      console.log(arr);
    }
  }
  return arr;
}

function swap(arr, a, b) {
  let x = arr[a];
  arr[a] = arr[b];
  arr[b] = x;
}
```

### 选择排序

```js
function sort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    let min = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    swap(arr, i, min);
    console.log(arr);
  }
  return arr;
}

function swap(arr, a, b) {
  let x = arr[a];
  arr[a] = arr[b];
  arr[b] = x;
}
```

### 希尔排序

```js
function sort(arr) {
  const len = arr.length;
  let h = 1;
  while (h < parseInt(len / 3)) {
    h = 3 * h + 1;
  }
  while (h >= 1) {
    for (let i = h; i < len; i++) {
      for (let j = i; j >= h && arr[j] < arr[j - h]; j -= h) {
        swap(arr, j, j - h);
        console.log(arr);
      }
    }
    h = parseInt(h / 3);
  }
  return arr;
}

function swap(arr, a, b) {
  let x = arr[a];
  arr[a] = arr[b];
  arr[b] = x;
}
```
