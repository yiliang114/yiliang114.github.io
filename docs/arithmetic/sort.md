---
layout: CustomPages
title: 排序算法
date: '2020-08-24'
aside: false
---

## 排序算法

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
