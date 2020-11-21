---
layout: CustomPages
title: longest-common
date: 2020-11-21
aside: false
draft: true
---

## SF/ALGs/string/longest-common.js

```js
const longestCommonPrefix = strArr => {
  if (strArr.length === 0) return '';
  for (let i = 0; i < strArr[0].length; i++) {
    for (let j = 1; j < strArr.length; j++) {
      if (strArr[j][i] !== strArr[0][i]) return strArr[0].slice(0, i);
    }
  }
  return strArr[0];
};

// console.log('prefix: ', longestCommonPrefix(['flower', 'flow', 'flight']))
// console.log('prefix: ', longestCommonPrefix(['dog', 'car', 'flight']))

const longestCommonSuffix = strArr => {
  if (strArr.length === 0) return '';
  const standardEndIndex = strArr[0].length - 1;
  for (let i = 0; i <= standardEndIndex; i++) {
    for (let j = 1; j < strArr.length; j++) {
      const endIndex = strArr[j].length - 1;
      // console.log('匹配: ', strArr[j][endIndex - i], strArr[0][standardEndIndex - i])
      if (strArr[j][endIndex - i] !== strArr[0][standardEndIndex - i]) {
        // console.log('===', standardEndIndex - i)
        return strArr[0].slice(standardEndIndex - i + 1);
      }
    }
  }
  return '';
};

// console.log('Suffix: ', longestCommonSuffix(['now', 'flow', 'how']))
// console.log('Suffix: ', longestCommonSuffix(['dog', 'pig', 'haog']))

// TODO: LCS
const longestCommonSubstring = strArr => {};
```
