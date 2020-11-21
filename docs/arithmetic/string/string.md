---
layout: CustomPages
title: 【数据结构与算法】-字符串问题
date: 2020-08-31
aside: false
---

# 【数据结构与算法】-字符串问题

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

## 子字符串查找

- 暴力法：通过 for 循环遍历找出目标子字符串。
- KMP：基于上一次匹配的结果向下匹配
- BM: 使用 pat 最右侧一位字符串去匹配，匹配上后逐个向左匹配。
- RK: 使用散列表匹配相同散列表的子字符串。

## 实现字符串的一些原生方法

这类题目应该是最直接的题目了，题目歧义比较小, 难度也是相对较小，因此用于电面等形式也是不错的。

- [28.implement-str-str](https://leetcode.com/problems/implement-strstr/)

## 回文

回文串就是一个正读和反读都一样的字符串，比如“level”或者“noon”等等就是回文串。

判断是否回文的通用方法是首尾双指针，具体可以见下方 125 号题目。 判断最长回文的思路主要是两个字"扩展"，
如果可以充分利用回文的特点，则可以减少很多无谓的计算，典型的是《马拉车算法》。

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
