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
