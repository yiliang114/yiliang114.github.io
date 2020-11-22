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
