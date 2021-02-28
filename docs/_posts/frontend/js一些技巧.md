---
title: 'JS 一些技巧'
date: '2020-10-24'
tags:
  - 前端
---

## JS 一些技巧

### js 中的 boolean number 互转

```js
~~false === 0;
~~true === 1;
~~undefined === 0;
~~!undefined === 1;
~~null === 0;
~~!null === 1;
~~'' === 0;
~~!'' === 1;
```

```js
!!常常用来做类型判断;

// 代码很臃肿
var a;
if (a != null && typeof a != undefined && a != '') {
  //a有内容才执行的代码
}

// 可以直接使用 !!
if (!!a) {
  //a有内容才执行的代码...
}
```

0 - 1 翻转

<https://www.jianshu.com/p/b85091a5fe84>

- 箭头函数 this 指向
- 应该避免箭头函数的使用场景
  - vue methods 等
- 0.1 + 0.2 ，0.8 - 0.2 ， 0.1 + 0.7 等

```js
a typeof Array
a.constructor == Array
a instanceof Array
```

### js 字符串去空格

chrome FF 亲测 String.trim() 即可
