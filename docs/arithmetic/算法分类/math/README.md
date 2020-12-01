---
layout: CustomPages
title: 前端与数据结构-数学
date: 2020-09-04
aside: false
draft: true
---

# Math

### factorial 阶乘

```js
function tailFactorial(n, total) {
  switch (n) {
    case 0:
      return 1;
    case 1:
      return total;
    default:
      return tailFactorial(n - 1, n * total);
  }
}

function factorial(n) {
  return tailFactorial(n, 1);
}

/// tests

import { test } from 'ava';

test(t => t.is(factorial(0), 1));
test(t => t.is(factorial(1), 1));
test(t => t.is(factorial(6), 720));
```

### Numbers

- **[5.1](#numbers--power-of-two) Given an integer, determine if it is a power of 2. If so,
  return that number, else return -1. (0 is not a power of two)**

  ```js
  isPowerOfTwo(4); // true
  isPowerOfTwo(64); // true
  isPowerOfTwo(1); // true
  isPowerOfTwo(0); // false
  isPowerOfTwo(-1); // false

  // For the non-zero case:
  function isPowerOfTwo(number) {
    // `&` uses the bitwise n.
    // In the case of number = 4; the expression would be identical to:
    // `return (4 & 3 === 0)`
    // In bitwise, 4 is 100, and 3 is 011. Using &, if two values at the same
    // spot is 1, then result is 1, else 0. In this case, it would return 000,
    // and thus, 4 satisfies are expression.
    // In turn, if the expression is `return (5 & 4 === 0)`, it would be false
    // since it returns 101 & 100 = 100 (NOT === 0)

    return number & (number - 1 === 0);
  }

  // For zero-case:
  function isPowerOfTwoZeroCase(number) {
    return number !== 0 && (number & (number - 1)) === 0;
  }
  ```

* **[6.2](#javascript--use-strict) Describe the functionality of the `use strict;` directive**

  ```
  the `use strict` directive defines that the Javascript should be executed in `strict mode`.
  One major benefit that strict mode provides is that it prevents developers from using
  undeclared variables. Older versions of javascript would ignore this directive declaration
  ```

  ```js
  // Example of strict mode
  'use strict';

  catchThemAll();
  function catchThemAll() {
    x = 3.14; // Error will be thrown
    return x * x;
  }
  ```

### 三角形

```js
/**
 * https://leetcode.com/problems/triangle/description/
 * Difficulty:Medium
 *
 * Given a triangle, find the minimum path sum from top to bottom.
 * Each step you may move to adjacent numbers on the row below.
 * For example, given the following triangle
 * [
 *      [2],
 *     [3,4],
 *    [6,5,7],
 *   [4,1,8,3]
 * ]
 * The minimum path sum from top to bottom is 11 (i.e., 2 + 3 + 5 + 1 = 11).
 * Note:
 * Bonus point if you are able to do this using only O(n) extra space,
 * where n is the total number of rows in the triangle.
 */

/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function(triangle) {
  if (!triangle.length) return 0;
  var dp = [[triangle[0][0]]];

  var n = triangle.length;
  for (var i = 1; i < n; i++) {
    dp.push(new Array(i + 1).fill(0));
  }
  // console.log(triangle);

  for (var i = 1; i < n; i++) {
    for (var j = 0; j < i + 1; j++) {
      var a = j - 1;
      var b = j;
      if (a < 0) dp[i][j] = dp[i - 1][b];
      else if (b > i - 1) dp[i][j] = dp[i - 1][a];
      else dp[i][j] = Math.min(dp[i - 1][b], dp[i - 1][a]);
      dp[i][j] += triangle[i][j];
    }
  }
  var min = dp[n - 1][0];
  for (var i = 1; i < n; i++) {
    if (dp[n - 1][i] < min) min = dp[n - 1][i];
  }

  // console.log(dp, min);
  return min;
};
```
