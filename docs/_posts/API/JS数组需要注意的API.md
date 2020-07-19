---
title: 'JS数组需要注意的API'
date: '2020-03-14 09:06:38'
tags:
  - JS
  - Array
vssue-id: 2
---

### JS Array 需要注意的 API

#### Array.filter(Boolean)

去除数组中为“假”的元素: 0, undefined, null, NaN、'', false

```js
const a = [1, 2, 'b', 0, {}, '', NaN, 3, undefined, null, 5]
const b = a.filter(Boolean) // [1,2,"b",{},3,5]
```

实际上，下面这样的写法是一种简写模式

```js
b = a.filter(Boolean)
```

它等价于

```js
b = a.filter(function(x) {
  return Boolean(x)
})
```

Boolean 是一个函数，它会对遍历数组中的元素，并根据元素的真假类型，对应返回 true 或 false.

例如：

```js
Boolean(0) // false
Boolean(true) // true
Boolean(1) // true
Boolean('') // false
Boolean('false') // true. "false"是一个非空字符串
```
