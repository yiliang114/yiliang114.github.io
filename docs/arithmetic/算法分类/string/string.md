---
layout: CustomPages
title: 【数据结构与算法】- 字符串问题
date: 2020-08-31
aside: false
---

# 【数据结构与算法】- 字符串问题

## 常见

- 暴力法：通过 for 循环遍历找出目标子字符串。 朴素?
- KMP：基于上一次匹配的结果向下匹配
- BM: 使用 pat 最右侧一位字符串去匹配，匹配上后逐个向左匹配。
- RK: 使用散列表匹配相同散列表的子字符串。
- trie

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

## 实现字符串的一些原生方法

这类题目应该是最直接的题目了，题目歧义比较小, 难度也是相对较小，因此用于电面等形式也是不错的。

- [28.implement-str-str](https://leetcode.com/problems/implement-strstr/)

## 前缀问题

前缀树用来处理这种问题是最符合直觉的，但是它也有缺点，比如公共前缀很少的情况下，比较费内存。

## 随机生成指定长度的字符串

## 字符串截取

```js
export default function SubString(string, start = 0, end = string.length) {
  let substring = '';

  for (let i = start; i < end + 1; i++) {
    substring += string[i];
  }

  return substring;
}
```

## ReverseString 翻转字符串

```js
/**
 * A short example showing how to reverse a string
 * @flow
 */

/**
 * Create a new string and append
 * @complexity O(n)
 */
export default function ReverseStringIterative(string: string): string {
  let reversedString = '';
  let index;

  for (index = string.length - 1; index >= 0; index--) {
    reversedString += string[index];
  }

  return reversedString;
}

/**
 * JS disallows string mutation so we're actually a bit slower.
 *
 * @complexity: O(n)
 *
 * 'some' -> 'eoms' -> 'emos'
 */
export function ReverseStringIterativeInplace(string: string): string {
  const _string = string.split('');

  for (let i = 0; i < Math.floor(_string.length / 2); i++) {
    const first = _string[i];
    const second = _string[_string.length - 1 - i];
    _string[i] = second;
    _string[_string.length - 1 - i] = first;
  }

  return _string.join('');
}
```

## SF/ALGs/string/HasDupeChars.js

```js
/**
 * Implement an algorithm to determine if a string has only unique characters.
 * In other words, it cannot have duplicates. What if you can not use additional
 * data structures?
 *
 * Solution: Essentially, we have to check if a character is not repeated.
 *           We can use a hash map so that we can have constant time access when
 *           checking to see if a solution exists.
 *
 *           It's less optimal to use String.prototype.includes ('foo'.includes()).
 *           `includes()` iterates over each element, each means O(n). Using a
 *           hash map can get us to O(1) for lookup
 *
 * Complexity: O(n^2): In the worst-case senario, each element in the array
 *                     needs to be iterated over and every character in each
 *                     string will need to be iterated over. Each of those
 *                     operations is O(n)
 * @flow
 */
export default function HasDupeChars(string: string): boolean {
  const set = new Set(string);
  return set.size !== string.length;
}
```

## SF/ALGs/string/Permutations.js

```js
/**
 * Find all the permutations of a string
 *
 * What is a permutation?
 *
 * [a, b, c]
 * [b, c, a] <- this is a valid permutation
 * [b, b, a] <- this is a permutation
 * [b, b, a] <- this is also a permutation. 'duplicates' are counted
 *
 * @flow
 */
import Factorial from '../Math/Factorial';

let permutations = 0;

/**
 * @complexity: O(n!), where n is the length of the string
 */
export default function StringPermutationsRecursive(string: string): number {
  if (string.length === 1) {
    permutations++;
  }

  const _string = string.split('');

  for (let i = 0; i < _string.length; i++) {
    StringPermutationsRecursive(_string.filter((e: any, _i: number): boolean => _i !== i).join(''));
  }

  return permutations;
}

/**
 * @complexity: O(n), where n is the length of the string
 */
export function StringPermutationsRecursiveFactorial(string: string): number {
  return Factorial(string.length);
}
```

## SF/ALGs/string/RandomString.js

```js
/**
 * A smal example that genrates a random string of letters and numbers
 * @flow
 */
import randomNumber from '../Math/RandomNumber';

/**
 * Generate a random string
 */
export default function RandomString(stringLength: number): string {
  const dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let generatedRandomString = '';
  let index;

  for (index = 0; index < stringLength; index++) {
    const randomDictionaryIndex = Math.floor(randomNumber(0, dictionary.length));
    generatedRandomString += dictionary[randomDictionaryIndex];
  }

  return generatedRandomString;
}
```

## 其他

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

### 给出一个字符串，找到里面重复最多的字符？

> 个人答案, 如果有重复数相同的，那么不会记录后面的字符

```js
function findMax(str) {
  var map = {},
    max = { num: 0 };

  for (var index in str) {
    if (map[str[index]]) {
      map[str[index]]++;
    } else {
      map[str[index]] = 1;
    }
    if (map[str[index]] > max.num) {
      max.num = map[str[index]];
      max.key = str[index];
    }
  }
  console.log(`max num is ${max.num}, the key is ${max.key}`);
}
```

### 题目

#### 翻转字符串

![](http://s0.lgstatic.com/i/image2/M01/90/CA/CgoB5l2IRiCATj5LAGJa69BtQRA357.gif)

**解法：**用两个指针，一个指向字符串的第一个字符 a，一个指向它的最后一个字符 m，然后互相交换。交换之后，两个指针向中央一步步地靠拢并相互交换字符，直到两个指针相遇。这是一种比较快速和直观的方法。

**注意：**由于无法直接修改字符串里的字符，所以必须先把字符串变换为数组，然后再运用这个算法。

#### 给定两个字符串 s 和 t，编写一个函数来判断 t 是否是 s 的字母异位词

LeetCode 第 242 题

说明：你可以假设字符串只包含小写字母。

**示例 1**

输入: s = "anagram", t = "nagaram"

输出: true

**示例 2**

输入: s = "rat", t = "car"

输出: false

字母异位词，也就是两个字符串中的相同字符的数量要对应相等。例如，s 等于 “anagram”，t 等于 “nagaram”，s 和 t 就互为字母异位词。因为它们都包含有三个字符 a，一个字符 g，一个字符 m，一个字符 n，以及一个字符 r。而当 s 为 “rat”，t 为 “car”的时候，s 和 t 不互为字母异位词。

**解题思路**

一个重要的前提“假设两个字符串只包含小写字母”，小写字母一共也就 26 个，因此：

1.  可以利用两个长度都为 26 的字符数组来统计每个字符串中小写字母出现的次数，然后再对比是否相等；

2.  可以只利用一个长度为 26 的字符数组，将出现在字符串 s 里的字符个数加 1，而出现在字符串 t 里的字符个数减 1，最后判断每个小写字母的个数是否都为 0。

按上述操作，可得出结论：s 和 t 互为字母异位词。

### 字符串数组查重

```js
export default function CheckHashAllUniqueChars(string) {
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
export function checkPermutationSlow(str1: string, str2: string) {
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
export default function checkPermutationFast(str1: string, str2: string) {
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
 * Given two strings, write a method to decide if one is a permutation of the
 * other.
 * @flow
 */

/**
 * Complexity: O(n)
 */
export default function PermutationString(first: string, second: string): boolean {
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
export function PermutationStringInPlace(first: string, second: string): boolean {
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
export default function OneAway(str1: string, str2: string): boolean {
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

### 括号匹配

```js
import Stack from '../DataStructures/Stack';

const start = ['{', '(', '['];
const endings = ['}', ')', ']'];

const endingMappings = {
  '}': '{',
  ')': '(',
  ']': '[',
};

export default function isBalanced(string: string): boolean {
  const stack = new Stack();

  for (const char of Array.from(string)) {
    if (start.includes(char)) {
      stack.push(char);
      continue;
    }
    if (endings.includes(char)) {
      if (stack.empty()) return false;
      if (stack.pop() !== endingMappings[char]) return false;
    }
  }

  return stack.empty();
}
```

### 字符串相关

在字符串相关算法中，Trie 树可以解决解决很多问题，同时具备良好的空间和时间复杂度，比如以下问题

- 词频统计
- 前缀匹配

如果你对于 Trie 树还不怎么了解，可以前往 [这里](../DataStruct/dataStruct-zh.md#trie) 阅读

### 翻转字符串

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

/// tests

import { test } from 'ava';

test(t => t.is(reverse(''), ''));
test(t => t.is(reverse('abcdef'), 'fedcba'));
```

### 字符串平衡（栈）

```js
/// solution

function isBalanced2(string) {
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

/// tests

import { test } from 'ava';

test(t => t.is(isBalanced2('(foo { bar (baz) [boo] })'), true));
test(t => t.is(isBalanced2('foo { bar { baz }'), false));
test(t => t.is(isBalanced2('foo { (bar [baz] } )'), false));
```
