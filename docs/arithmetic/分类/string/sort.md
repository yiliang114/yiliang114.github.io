---
layout: CustomPages
title: 字符串排序相关
date: 2020-11-21
aside: false
draft: true
---

# 字符串排序相关

## SF/ALGs/string/sort_index_count.js

```js
function sort(arr) {
  let N = arr.length;
  let R = arr.length + 1;
  let aux = new Array(N);
  let count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // 统计各个索引出现的总数
  for (let i = 0; i < N; i++) {
    count[arr[i].key + 1]++;
  }
  // 将出现频率转为索引
  for (let r = 0; r < R; r++) {
    count[r + 1] += count[r];
  }
  // 将元素分类
  for (let i = 0; i < N; i++) {
    let index = count[arr[i].key]++;
    aux[index] = arr[i];
  }
  // 回写
  for (let i = 0; i < N; i++) {
    arr[i] = aux[i];
  }
}

const arr = [
  {
    key: 2,
    value: 'jack',
  },
  {
    key: 1,
    value: 'rose',
  },
  {
    key: 4,
    value: 'jack',
  },
  {
    key: 3,
    value: 'jack',
  },
  {
    key: 3,
    value: 'jack',
  },
  {
    key: 1,
    value: 'jack',
  },
  {
    key: 2,
    value: 'jack',
  },
  {
    key: 4,
    value: 'jack',
  },
  {
    key: 1,
    value: 'jack',
  },
];

sort(arr);
```

## SF/ALGs/string/sort_lsd.js

```js
function sort(arr, w) {
  let N = arr.length;
  let R = 256;
  let aux = new Array(N);
  for (let d = w - 1; d >= 0; d--) {
    let count = [];
    // 创建一个长度为 R 的数组保存字符数量
    for (let i = 0; i < R + 1; i++) {
      count.push(0);
    }
    // 统计字符数量
    for (let i = 0; i < N; i++) {
      let char = arr[i].charAt(d);
      let charCode = parseInt(char) + 1; // charCode 是字符原值加一
      count[charCode]++;
    }
    // 将前面的字符数量加到后面
    for (let r = 0; r < R; r++) {
      count[r + 1] += count[r];
    }
    // aux 数组变为当前 d 的有序数组
    for (let i = 0; i < N; i++) {
      let char = arr[i].charAt(d);
      let index = count[char]++; // index 的值为 count[char]，之后 count[char]++
      // index 就是 char 的起始索引位置
      aux[index] = arr[i];
    }
    // 回写
    for (let i = 0; i < N; i++) {
      arr[i] = aux[i];
    }
  }
  console.log(arr);
}

const arr = [
  '4PGC938',
  '2YIE230',
  '3CI0720',
  '1ICK750',
  '10HV845',
  '4JZY524',
  '1ICK736',
  '3CI0721',
  '7ATW723',
  '2RLA649',
];

sort(arr, 7);

/*
比如 arr = [ 8,0,0,0,5,4,6,1,3,9 ]
首先创建一个从 0 - 9 都为 0 的 count = [ 0,0,0,0,0,0,0,0,0,0,0 ]
然后统计数量 count = [ 0,3,1,0,1,1,1,1,0,1,1 ]
然后进行累加 count = [ 0,3,4,4,5,6,7,8,8,9,10 ]
最后利用 count 为索引赋值
i = 0, char = 8, index = 8, count = [ 0,3,4,4,5,6,7,8,9,9,10 ], aux[8] = arr[0]
i = 1, char = 0, index = 0, count = [ 1,3,4,4,5,6,7,8,9,9,10 ], aux[0] = arr[1]
i = 2, char = 0, index = 1, count = [ 2,3,4,4,5,6,7,8,9,9,10 ], aux[1] = arr[2]
i = 3, char = 0, index = 2, count = [ 3,3,4,4,5,6,7,8,9,9,10 ], aux[2] = arr[3]
i = 4, char = 5, index = 6, count = [ 3,3,4,4,5,7,7,8,9,9,10 ], aux[6] = arr[4]
i = 5, char = 4, index = 5, count = [ 3,3,4,4,6,7,7,8,9,9,10 ], aux[5] = arr[5]
i = 6, char = 6, index = 7, count = [ 3,3,4,4,6,7,8,8,9,9,10 ], aux[7] = arr[6]
i = 7, char = 1, index = 3, count = [ 3,4,4,4,6,7,8,8,9,9,10 ], aux[3] = arr[7]
i = 8, char = 3, index = 4, count = [ 3,4,4,5,6,7,8,8,9,9,10 ], aux[4] = arr[8]
i = 9, char = 9, index = 9, count = [ 3,4,4,4,6,7,8,8,9,10,10 ], aux[9] = arr[9]

至此我可猜测，传入 count 数组的值加一的原因在于之后的累加 index。
问题：为何数量能够变为索引值？
count 其实是用于计算每个键在排序结果中的起始索引位置。
如 count = [ 0,3,4,4,5,6,7,8,8,9,10 ]。那么值 0 的起始位置为 0，值 4 的起始位置为 5 （说明前面有 5 个小于 5 的值）
所以，count 是索引值，我们通过传入 char 来获取相对 count 的值。然后 count 加一（起始位置后移一位）。

最后将 aux 回写给 arr。

低位优先排序适合长度相同的字符串的排序
 */
```

## SF/ALGs/string/sort_msd.js

```js
/**
 * 高位优先排序
 * 使用递归方法来解决此问题
 */
const arr = ['she', 'shells', 'seashells', 'by', 'the', 'seashore', 'sells', 'are', 'surely', 'seashells', 'jack'];
const R = 256;
const M = 15;
const aux = new Array(N);
const N = arr.length;

function charAt(s, c) {
  if (c < s.length) return parseInt(s.charAt(c));
  else return -1;
}
// MSD
function sort(a, lo, hi, d) {
  if (hi <= lo) {
    insertSort(a, lo, hi, d);
    return;
  }
  let count = [];
  for (let i = 0; i < R + 2; i++) {
    count++;
  }
  for (let i = lo; i <= hi; i++) {
    count[charAt(a[i], d) + 2]++;
  }
  for (let r = 0; r < R + 1; r++) {
    count[r + 1] += count[r];
  }
  for (let i = lo; i <= hi; i++) {
    aux[count[charAt(a[i], d) + 1]++] = a[i];
  }
  for (let i = lo; i <= hi; i++) {
    a[i] = aux[i - lo];
  }
  for (r = 0; r < R; r++) {
    sort(a, lo + count[r], lo + count[r + 1] - 1, d + 1);
  }
}
// 插入排序
function insertSort(a, lo, hi, d) {
  const len = a.length;
  for (let i = lo; i <= hi; i++) {
    for (let j = i; j >= lo && charAt(a[j], d) < charAt(a[j - 1], d); j--) {
      swap(a, j, j - 1);
    }
  }
}
// 交换
function swap(arr, a, b) {
  let x = arr[a];
  arr[a] = arr[b];
  arr[b] = x;
}

/**
 * 使用了递归和索引计数法。
 * 递归：先对第一个字符排序，然后递归对有同一个第一个字符串的数组进行排序。其中短的字符串会返回 -1，所以必定排在最前面。
 * 使用索引计数法来针对字符排序。
 * 见 P464 的图 5.1.12
 *
 * 最坏情况，所有的键都相同，那么 MSD 需要检查所有的字符
 */
```

## SF/ALGs/string/sort_quick_3_string.js

```js
function charAt(s, c) {
  if (c < s.length) return parseInt(s.charCodeAt(c));
  else return -1;
}

function sort(a, lo, hi, d) {
  if (hi <= lo) return;
  let lt = lo,
    gt = hi;
  let v = charAt(a[lo], d);
  let i = lo + 1;
  while (i <= gt) {
    let t = charAt(a[i], d);
    if (t < v) swap(a, lt++, i++);
    else if (t > v) swap(a, i, gt--);
    else i++;
  }
  sort(a, lo, lt - 1, d);
  if (v >= 0) sort(a, lt, gt, d + 1);
  sort(a, gt + 1, hi, d);
}

// 交换
function swap(arr, a, b) {
  let x = arr[a];
  arr[a] = arr[b];
  arr[b] = x;
}

const arr = [
  'comadobe',
  'eduprincetoncs',
  'eduprincetoncs',
  'comcnn',
  'eduuvacs',
  'comcnn',
  'eduuvacs',
  'eduuvacs',
  'eduprincetoncs',
  'comapple',
  'comadobe',
  'eduprincetoncs',
  'eduuvacs',
  'comcnn',
  'comcnn',
  'comapple',
];

sort(arr, 0, arr.length - 1, 0);
console.log(arr);

/*
输出结果：
[
    "comadobe",
    "comadobe",
    "comapple",
    "comapple",
    "comcnn",
    "comcnn",
    "comcnn",
    "comcnn",
    "eduprincetoncs",
    "eduprincetoncs",
    "eduprincetoncs",
    "eduprincetoncs",
    "eduuvacs",
    "eduuvacs",
    "eduuvacs",
    "eduuvacs"
]
 */
```

### 回文排列

给定一个字符串，写一个函数来检查它是否是 a 的排列回文

```js
export default function palindromePermutation(str: string) {
  // create new string that ignores whitespace
  // for each character, use it as a key and icrment the value in a hash table
  // have a flag that allows only one character to appear once
  // check if all the values in the hash table === 2 or if at most one === 1
  const newStr = str.replace(/ /g, '').toLowerCase();
  const charCount = new Map();
  for (let i = 0; i < newStr.length; i++) {
    if (!charCount.get(newStr[i])) {
      charCount.set(newStr[i], 1);
    } else {
      charCount.set(newStr[i], charCount.get(newStr[i]) + 1);
    }
  }

  let flagCount = 0;
  for (let i = 0; i < newStr.length; i++) {
    if (charCount.get(newStr[i]) === 1) {
      flagCount += 1;
    }
    if (flagCount === 2) {
      return false;
    }
  }
  return true;
}
```
