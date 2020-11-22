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

## 其他

有一个文本串 S，和一个模式串 P，现在要查找 P 在 S 中的位置，怎么查找呢？

1. 暴力匹配算法
   如果用暴力匹配的思路，并假设现在文本串 S 匹配到 i 位置，模式串 P 匹配到 j 位置，则有：
   如果当前字符匹配成功（即 S[i] == P[j]），则 i++，j++，继续匹配下一个字符；
   如果失配（即 S[i]! = P[j]），令 i = i - (j - 1) ，j = 0。相当于每次匹配失败时，i 回溯，j 被置为 0。

```js
const violentMatch = (s, p) => {
  if (!s) return -1;
  const sLength = s.length,
    pLength = p.length;
  let i = 0,
    j = 0;
  while (i < sLength && j < pLength) {
    // ①如果当前字符匹配成功（即S[i] == P[j]），则i++，j++
    if (s[i] === p[j]) {
      i++;
      j++;
    } else {
      // ②如果失配（即S[i]! = P[j]），令i = i - (j - 1)，j = 0
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

KMP 算法，它利用之前已经部分匹配这个有效信息，保持 i 不回溯，通过修改 j 的位置，让模式串尽量地移动到有效的位置。
Knuth-Morris-Pratt 字符串查找算法，简称为 “KMP 算法”，常用于在一个文本串 S 内查找一个模式串 P 的出现位置
TODO:

https://segmentfault.com/a/1190000020034789?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com&share_user=1030000000178452

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

#### Longest Common Prefix 最长公共子串

Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".

Example 1:
Input: ["flower","flow","flight"]
Output: "fl"

Example 2:
Input: ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.

Note:
All given inputs are in lowercase letters a-z.

##### 参考答案

###### 二分法

- 找到字符串数组中长度最短字符串
- longest common prefix 长度范围 0 ~ minLength
- 运用`binary search`

参考代码

```javascript
/*
 * @lc app=leetcode id=14 lang=javascript
 *
 * [14] Longest Common Prefix
 */

function isCommonPrefix(strs, middle) {
  const prefix = strs[0].substring(0, middle);
  for (let i = 1; i < strs.length; i++) {
    if (!strs[i].startsWith(prefix)) return false;
  }

  return true;
}
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
  // trie 解法
  // 时间复杂度O(m) 空间复杂度O(m * n)

  // tag: 二分法
  // 时间复杂度 O(n*logm)  空间复杂度O(1)
  if (strs.length === 0) return '';
  if (strs.length === 1) return strs[0];

  let minLen = Number.MAX_VALUE;

  for (let i = 0; i < strs.length; i++) {
    minLen = Math.min(minLen, strs[i].length);
  }

  let low = 0;
  let high = minLen;

  while (low <= high) {
    const middle = (low + high) >> 1;
    if (isCommonPrefix(strs, middle)) low = middle + 1;
    else high = middle - 1;
  }

  return strs[0].substring(0, (low + high) >> 1);
};
```

###### trie 树

以 LeetCode 另一道题[Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree/description/)的解法作为本题的参考思路, 具体代码可以自行补充完善

- 建立 Trie
- 遍历到有一个 children 有超过一个子元素为止

Trie 实现参考代码

```javascript
/*
 * @lc app=leetcode id=208 lang=javascript
 *
 * [208] Implement Trie (Prefix Tree)
 *
 * https://leetcode.com/problems/implement-trie-prefix-tree/description/
 *
 * algorithms
 * Medium (36.93%)
 * Total Accepted:    172K
 * Total Submissions: 455.5K
 * Testcase Example:  '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]'
 *
 * Implement a trie with insert, search, and startsWith methods.
 *
 * Example:
 *
 *
 * Trie trie = new Trie();
 *
 * trie.insert("apple");
 * trie.search("apple");   // returns true
 * trie.search("app");     // returns false
 * trie.startsWith("app"); // returns true
 * trie.insert("app");
 * trie.search("app");     // returns true
 *
 *
 * Note:
 *
 *
 * You may assume that all inputs are consist of lowercase letters a-z.
 * All inputs are guaranteed to be non-empty strings.
 *
 *
 */
function TrieNode(val) {
  this.val = val;
  this.children = [];
  this.isWord = false;
}

function computeIndex(c) {
  return c.charCodeAt(0) - 'a'.charCodeAt(0);
}
/**
 * Initialize your data structure here.
 */
var Trie = function() {
  this.root = new TrieNode(null);
};

/**
 * Inserts a word into the trie.
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function(word) {
  let ws = this.root;
  for (let i = 0; i < word.length; i++) {
    const c = word[i];
    const current = computeIndex(c);
    if (!ws.children[current]) {
      ws.children[current] = new TrieNode(c);
    }
    ws = ws.children[current];
  }
  ws.isWord = true;
};

/**
 * Returns if the word is in the trie.
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function(word) {
  let ws = this.root;
  for (let i = 0; i < word.length; i++) {
    const c = word[i];
    const current = computeIndex(c);
    if (!ws.children[current]) return false;
    ws = ws.children[current];
  }
  return ws.isWord;
};

/**
 * Returns if there is any word in the trie that starts with the given prefix.
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function(prefix) {
  let ws = this.root;
  for (let i = 0; i < prefix.length; i++) {
    const c = prefix[i];
    const current = computeIndex(c);
    if (!ws.children[current]) return false;
    ws = ws.children[current];
  }
  return true;
};

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
```

###### 暴力法

比较常规的一种解法, 大部分人采用的做法, 这里就不再赘述
