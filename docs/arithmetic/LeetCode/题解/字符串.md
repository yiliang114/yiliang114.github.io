---
layout: CustomPages
title: LeetCode 题解
date: 2020-11-21
aside: false
draft: true
---

## 1. 字符串循环移位包含

```html
s1 = AABCD, s2 = CDAA Return : true
```

给定两个字符串 s1 和 s2，要求判定 s2 是否能够被 s1 做循环移位得到的字符串包含。

s1 进行循环移位的结果是 s1s1 的子字符串，因此只要判断 s2 是否是 s1s1 的子字符串即可。

## 2. 字符串循环移位

```html
s = "abcd123" k = 3 Return "123abcd"
```

将字符串向右循环移动 k 位。

将 abcd123 中的 abcd 和 123 单独翻转，得到 dcba321，然后对整个字符串进行翻转，得到 123abcd。

## 3. 字符串中单词的翻转

```html
s = "I am a student" Return "student a am I"
```

将每个单词翻转，然后将整个字符串翻转。

## 4. 两个字符串包含的字符是否完全相同

[242. Valid Anagram (Easy)](https://leetcode-cn.com/problems/valid-anagram/description/)

```html
s = "anagram", t = "nagaram", return true. s = "rat", t = "car", return false.
```

可以用 HashMap 来映射字符与出现次数，然后比较两个字符串出现的字符数量是否相同。

由于本题的字符串只包含 26 个小写字符，因此可以使用长度为 26 的整型数组对字符串出现的字符进行统计，不再使用 HashMap。

**解题思路**

一个重要的前提“假设两个字符串只包含小写字母”，小写字母一共也就 26 个，因此：

1.  可以利用两个长度都为 26 的字符数组来统计每个字符串中小写字母出现的次数，然后再对比是否相等；

2.  可以只利用一个长度为 26 的字符数组，将出现在字符串 s 里的字符个数加 1，而出现在字符串 t 里的字符个数减 1，最后判断每个小写字母的个数是否都为 0。

按上述操作，可得出结论：s 和 t 互为字母异位词。

```java
public boolean isAnagram(String s, String t) {
    int[] cnts = new int[26];
    for (char c : s.toCharArray()) {
        cnts[c - 'a']++;
    }
    for (char c : t.toCharArray()) {
        cnts[c - 'a']--;
    }
    for (int cnt : cnts) {
        if (cnt != 0) {
            return false;
        }
    }
    return true;
}
```

## 5. 计算一组字符集合可以组成的回文字符串的最大长度

[409. Longest Palindrome (Easy)](https://leetcode-cn.com/problems/longest-palindrome/description/)

```html
Input : "abccccdd" Output : 7 Explanation : One longest palindrome that can be built is "dccaccd", whose length is 7.
```

使用长度为 256 的整型数组来统计每个字符出现的个数，每个字符有偶数个可以用来构成回文字符串。

因为回文字符串最中间的那个字符可以单独出现，所以如果有单独的字符就把它放到最中间。

```java
public int longestPalindrome(String s) {
    int[] cnts = new int[256];
    for (char c : s.toCharArray()) {
        cnts[c]++;
    }
    int palindrome = 0;
    for (int cnt : cnts) {
        palindrome += (cnt / 2) * 2;
    }
    if (palindrome < s.length()) {
        palindrome++;   // 这个条件下 s 中一定有单个未使用的字符存在，可以把这个字符放到回文的最中间
    }
    return palindrome;
}
```

## 6. 字符串同构

[205. Isomorphic Strings (Easy)](https://leetcode-cn.com/problems/isomorphic-strings/description/)

```html
Given "egg", "add", return true. Given "foo", "bar", return false. Given "paper", "title", return true.
```

记录一个字符上次出现的位置，如果两个字符串中的字符上次出现的位置一样，那么就属于同构。

```java
public boolean isIsomorphic(String s, String t) {
    int[] preIndexOfS = new int[256];
    int[] preIndexOfT = new int[256];
    for (int i = 0; i < s.length(); i++) {
        char sc = s.charAt(i), tc = t.charAt(i);
        if (preIndexOfS[sc] != preIndexOfT[tc]) {
            return false;
        }
        preIndexOfS[sc] = i + 1;
        preIndexOfT[tc] = i + 1;
    }
    return true;
}
```

## 9. 统计二进制字符串中连续 1 和连续 0 数量相同的子字符串个数

[696. Count Binary Substrings (Easy)](https://leetcode-cn.com/problems/count-binary-substrings/description/)

```html
Input: "00110011" Output: 6 Explanation: There are 6 substrings that have equal number of consecutive 1's and 0's:
"0011", "01", "1100", "10", "0011", and "01".
```

```java
public int countBinarySubstrings(String s) {
    int preLen = 0, curLen = 1, count = 0;
    for (int i = 1; i < s.length(); i++) {
        if (s.charAt(i) == s.charAt(i - 1)) {
            curLen++;
        } else {
            preLen = curLen;
            curLen = 1;
        }

        if (preLen >= curLen) {
            count++;
        }
    }
    return count;
}
```

## 实现 atoi

使其能将字符串转换成整数。

首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。

当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。

该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。

注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。

在任何情况下，若函数不能进行有效的转换时，请返回 0。

说明：

假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−2^31, 2^31 − 1]。如果数值超过这个范围，qing 返回 INT_MAX (2^31 − 1) 或 INT_MIN (−2^31) 。

#### 思路

1. 找出第一个非空字符，判断是不是符号或者数字
2. 如果是符号，那么判断正负号
3. 如果符号后面跟的不是数字，那么就是非法的，返回 0
4. 确定连续数字字符的起始边界
5. 计算数字字符的代表的数字大小，并且判断是否越界
6. 返回结果的时候注意符号

```js
/**
 * @param {string} str
 * @return {number}
 */
var myAtoi = function(str) {
  var len = str.length,
    isNegative = null,
    result = 0,
    numberStarted = false,
    cur,
    i;

  for (i = 0; i < len; i++) {
    if (str.charAt(i) === ' ') {
      if (!numberStarted) {
        continue;
      } else {
        return getResult(isNegative, result);
      }
    }

    if (isNegative === null) {
      if (str.charAt(i) === '-') {
        isNegative = true;
        numberStarted = true;
        continue;
      } else if (str.charAt(i) === '+') {
        isNegative = false;
        numberStarted = true;
        continue;
      }
    }

    cur = parseInt(str.charAt(i));

    if (!isNaN(cur)) {
      result = result * 10 + cur;

      if (!numberStarted) {
        numberStarted = true;
      }
    } else {
      return getResult(isNegative, result);
    }
  }

  return getResult(isNegative, result);
};
// :(
function getResult(isNegative, result) {
  result = isNegative ? result * -1 : result;

  if (result > 2147483647) {
    result = 2147483647;
  } else if (result < -2147483648) {
    result = -2147483648;
  }

  return result;
}
```

```js
const MIN_INT_ABS = Math.pow(2, 31);
const MAX_INT = MIN_INT_ABS - 1;

/**
 * 判断char是否是符号
 * @param {String} char
 */
function isSymbol(char) {
  return char === '-' || char === '+';
}

/**
 * 判断char是否是数字
 * @param {String} char
 */
function isNumber(char) {
  return char >= '0' && char <= '9';
}

/**
 * 模拟atoi(str)
 * @param {String} str
 */
function myAtoi(str) {
  const length = str.length;

  // 找出第一个非空字符，判断是不是符号或者数字
  let firstNotEmptyIndex = 0;
  for (; firstNotEmptyIndex < length && str[firstNotEmptyIndex] === ' '; ++firstNotEmptyIndex) {}
  if (!isSymbol(str[firstNotEmptyIndex]) && !isNumber(str[firstNotEmptyIndex])) {
    return 0;
  }

  // 如果是符号，那么判断正负号
  let positive = true,
    firstNumberIndex = firstNotEmptyIndex;
  if (isSymbol(str[firstNotEmptyIndex])) {
    positive = str[firstNotEmptyIndex] === '+';
    firstNumberIndex += 1;
  }

  // 如果符号后面跟的不是数字，那么就是非法的，返回0
  if (!isNumber(str[firstNumberIndex])) {
    return 0;
  }

  // 确定连续数字字符的起始边界
  let endNumberIndex = firstNumberIndex;
  while (endNumberIndex < length && isNumber(str[endNumberIndex + 1])) {
    ++endNumberIndex;
  }

  // 计算数字字符的代表的数字大小
  // 并且判断是否越界
  let result = 0;
  for (let i = firstNumberIndex; i <= endNumberIndex; ++i) {
    result = result * 10 + (str[i] - '0');
    if (positive && result > MAX_INT) {
      return MAX_INT;
    }
    if (!positive && result > MIN_INT_ABS) {
      return -1 * MIN_INT_ABS;
    }
  }

  // 返回的时候注意符号
  return positive ? result : -1 * result;
}

/**
 * 以下是测试代码
 */

console.log(myAtoi(' +1.123sfsdfsd')); // 1
console.log(myAtoi(' -42')); // -42
console.log(myAtoi('words and 987')); // 0
console.log(myAtoi('-91283472332')); // -2147483648
```
