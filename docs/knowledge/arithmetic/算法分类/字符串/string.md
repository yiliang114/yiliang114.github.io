---
title: 【数据结构与算法】- 字符串问题
date: 2020-08-31
aside: false
draft: true
---

## 常见

- 暴力法：通过 for 循环遍历找出目标子字符串。 朴素?
- KMP：基于上一次匹配的结果向下匹配
- BM: 使用 pat 最右侧一位字符串去匹配，匹配上后逐个向左匹配。
- RK: 使用散列表匹配相同散列表的子字符串。
- trie

最常见问题：

- 最长公共子序列(并不是连续的)
- 最长回文子串

### 马拉车算法

马拉车算法是用来 查找一个字符串的最长回文子串的线性方法，这个方法的牛逼之处在于将时间复杂度提升到了线性

## 字符串问题

字符串问题有很多，从简单的实现 substr，识别回文，到复杂一点的公共子串/子序列。其实字符串本质上也是字符数组，因此
很多数据的思想和方法也可以用在字符串问题上，并且在有些时候能够发挥很好的作用。

专门处理字符串的算法也很多，比如 trie，马拉车算法，游程编码，huffman 树等等。

## 字符串排序性能对比

字符串排序除了之前的排序，还多了 3 中排序：

- 低位优先字符串排序
- 高位优先字符串排序
- 三向字符串快速排序

|        算法        | 时间复杂度 | 空间复杂度 |
| :----------------: | :--------: | :--------: |
|  字符串的插入排序  |   N - N2   |     1      |
|      快速排序      |   Nlog2N   |    logN    |
|      归并排序      |   Nlog2N   |     N      |
|    三项快速排序    | N - Nlog2N |    logN    |
| 低位优先字符串排序 |     NW     |     N      |
| 高位优先字符串排序 |   N - Nw   |    N+WR    |
| 三向字符串快速排序 |   N - Nw   |   W+logN   |

### 三向字符串快速排序

```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function(nums) {
  sort(nums, 0, nums.length - 1);
};

function sort(arr, lo, hi) {
  if (hi <= lo) return;
  let lt = lo,
    i = lo + 1,
    gt = hi;
  let v = arr[lo];
  while (i <= gt) {
    if (arr[i] < v) swap(arr, lt++, i++);
    else if (arr[i] > v) swap(arr, i, gt--);
    else i++;
  }
  sort(arr, lo, lt - 1);
  sort(arr, gt + 1, hi);
}

function swap(arr, a, b) {
  let x = arr[a];
  arr[a] = arr[b];
  arr[b] = x;
}

/**
 * 三向字符串快速排序
 */
```

## 前缀问题

前缀树用来处理这种问题是最符合直觉的，但是它也有缺点，比如公共前缀很少的情况下，比较费内存。

### 字符串搜索

有一个文本串 S，和一个模式串 P，现在要查找 P 在 S 中的位置，怎么查找呢？

1. 暴力匹配算法
   如果用暴力匹配的思路，并假设现在文本串 S 匹配到 i 位置，模式串 P 匹配到 j 位置，则有：
   如果当前字符匹配成功(即 S[i] == P[j])，则 i++，j++，继续匹配下一个字符；
   如果失配(即 S[i]! = P[j])，令 i = i - (j - 1) ，j = 0。相当于每次匹配失败时，i 回溯，j 被置为 0。

```js
const violentMatch = (s, p) => {
  if (!s) return -1;
  const sLength = s.length,
    pLength = p.length;
  let i = 0,
    j = 0;
  while (i < sLength && j < pLength) {
    // ①如果当前字符匹配成功(即S[i] == P[j])，则i++，j++
    if (s[i] === p[j]) {
      i++;
      j++;
    } else {
      // ②如果失配(即S[i]! = P[j])，令i = i - (j - 1)，j = 0
      i -= j - 1;
      j = 0;
    }
  }
  //匹配成功，返回模式串p在文本串s中的位置，否则返回-1
  if (j === pLength) {
    return i - j;
  }
  return -1;
};

console.log(violentMatch('BBC ABCDAB ABCDABCDABDE', 'ABCDABD'));
```

### 返回整数逆序后的字符串

输入 int 型，返回整数逆序后的字符串。如：输入整型 1234，返回字符串“4321”。要求必须使用递归函数调用，不能用全局变量，输入函数必须只有一个参数传入，必须返回字符串。

```js
function fun(num) {
  let num1 = num / 10;
  let num2 = num % 10;
  if (num1 < 1) {
    return num;
  } else {
    num1 = Math.floor(num1);
    return `${num2}${fun(num1)}`;
  }
}
var a = fun(12345);
```

### 字符串数组查重

```js
function checkHashAllUniqueChars(string) {
  const set = new Set();

  for (const char of string) {
    if (!set.has(char)) {
      set.add(char);
    } else {
      return false;
    }
  }

  return true;
}
```

### 判断两个字符串是否是置换

```js
/**
 *
 * O(NlgN) time
 * O(N) space
 */
export function checkPermutationSlow(str1, str2) {
  const arr1 = str1.split('').sort();
  const arr2 = str2.split('').sort();

  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

/**
 * O(N) time
 * O(N) space
 */
export default function checkPermutationFast(str1, str2) {
  const charCount1 = new Map();
  const charCount2 = new Map();
  for (let i = 0; i < str1.length; i++) {
    if (!charCount1.get(str1[i])) {
      charCount1.set(str1[i], 1);
    } else {
      charCount1.set(str1[i], charCount1.get(str1[i]) + 1);
    }
  }

  for (let i = 0; i < str2.length; i++) {
    if (!charCount2.get(str2[i])) {
      charCount2.set(str2[i], 1);
    } else {
      charCount2.set(str2[i], charCount2.get(str2[i]) + 1);
    }
  }

  for (let i = 0; i < str1.length; i++) {
    if (charCount1.get(str1[i]) !== charCount2.get(str1[i])) {
      return false;
    }
  }
  return true;
}
```

```js
/**
 * Complexity: O(n)
 */
export default function PermutationString(first, second) {
  if (first.length !== second.length) return false;

  const _first: Map<string, number> = new Map();

  for (const char of first) {
    if (_first.has(char)) {
      const some = _first.get(char);
      _first.set(char, some + 1);
    } else {
      _first.set(char, 1);
    }
  }

  for (const _char of second) {
    if (_first.has(_char)) {
      const foo = _first.get(_char);
      if (foo) {
        _first.set(_char, foo - 1);
      }
    }
  }

  for (const val of _first.values()) {
    if (val !== 0) return false;
  }

  return true;
}

/**
 * Complexity: O(nlogn)
 */
export function PermutationStringInPlace(first, second) {
  if (first.length !== second.length) return false;

  const _first = first.split('').sort();
  const _second = second.split('').sort();

  for (let i = 0; i < _first.length; i++) {
    if (_first[i] !== _second[i]) return false;
  }

  return true;
}
```

### 判断两个字符串是否？？

```js
export default function OneAway(str1, str2) {
  // new Set 传入一个字符串得到一个不重复的集合。
  const set1 = new Set(str1);
  const set2 = new Set(str2);
  const diffs = new Array(2);

  for (const char of set1) {
    if (!set2.has(char)) {
      diffs.push(false);
    }
    if (diffs.length >= 2) {
      return false;
    }
  }

  return true;
}
```

### 翻转字符串

![](http://s0.lgstatic.com/i/image2/M01/90/CA/CgoB5l2IRiCATj5LAGJa69BtQRA357.gif)

**解法：**用两个指针，一个指向字符串的第一个字符 a，一个指向它的最后一个字符 m，然后互相交换。交换之后，两个指针向中央一步步地靠拢并相互交换字符，直到两个指针相遇。这是一种比较快速和直观的方法。

**注意：**由于无法直接修改字符串里的字符，所以必须先把字符串变换为数组，然后再运用这个算法。

```js
function reverse(string) {
  let index = string.length - 1;
  let result = '';
  while (index > -1) {
    result += string[index];
    index--;
  }
  return result;
}
```

双指针形式待实现。

### 字符串平衡

```js
function isBalanced(string) {
  let stack = new Stack();
  for (let letter of string) {
    switch (letter) {
      case '{':
      case '[':
      case '(':
        stack.push(letter);
        break;
      case '}':
      case ']':
      case ')':
        if (pairOf(stack.peek()) === letter) {
          stack.pop();
        } else {
          return false;
        }
    }
  }
  return stack.size() === 0;
}

let pairs = {
  '(': ')',
  '[': ']',
  '{': '}',
};
function pairOf(letter) {
  return pairs[letter];
}

class Stack {
  constructor() {
    this.items = [];
  }
  peek() {
    return this.items[this.size() - 1];
  }
  push(item) {
    this.items.push(item);
  }
  pop() {
    return this.items.pop();
  }
  size() {
    return this.items.length;
  }
}
```

### 字符串排列组合

```js
function permute(string) {
  return permuteArray(string.split(''));
}

function permuteArray(array) {
  switch (array.length) {
    case 0:
      return [];
    case 1:
      return array;
    default:
      return flatten(array.map(a => permuteArray(without(array, a)).map(b => a.concat(b))));
  }
}

function flatten(array) {
  return array.reduce((a, b) => a.concat(b), []);
}

function without(array, a) {
  const bs = array.slice(0);
  bs.splice(array.indexOf(a), 1);
  return bs;
}
```

### 统计一个字符串出现最多的字母

给出一段英文连续的英文字符窜，找出重复出现次数最多的字母

```js
function findMaxDuplicateChar(str) {
  // 单个字符串
  if (str.length == 1) {
    return str;
  }
  let charObj = {},
    maxChar = str[0],
    maxValue = 1;
  for (let i = 0; i < str.length; i++) {
    if (!charObj[str[i]]) {
      charObj[str[i]] = 1;
    } else {
      charObj[str[i]] += 1;
    }

    if (charObj[str[i]] > maxValue) {
      maxChar = str[i];
      maxValue = charObj[str[i]];
    }
  }
  return maxChar;
}
```

### 随机生成指定长度的字符串

实现一个算法，随机生成指制定长度的字符串

```js
function randomString(n) {
  const str = 'abcdefghijklmnopqrstuvwxyz9876543210';
  const len = str.length;
  let tmp = '';
  for (let i = 0; i < n; i++) {
    tmp += str[Math.floor(Math.random() * len)];
  }
  return tmp;
}
```
