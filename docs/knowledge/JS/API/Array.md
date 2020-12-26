---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### fill

创建有 n 个元素，并且默认值都是 m 的数组： `var a = (new Array(n)).fill(m)`

### Array(...)和 Array.of(...) 的区别

Array(...)的作用是接受参数返回一个数组，但是有一个陷阱，如果只传入一个参数，并且这个参数是数 字的话，那么不会构造一个值为这个数字的单个元素的数组，而是构造一个空数组

```js
var a = Array(3);
a.length; // 3
a[0]; // undefined
```

Array.of(..)解决掉了这个陷阱

```js
var b = Array.of(3);
b.length; // 1
b[0]; // 3
var c = Array.of(1, 2, 3);
c.length; // 3
c; // 1,2,3
```

### Array.prototype.map 的第二个参数

### 类数组对象转换为数组

类数组对象：只包含使用从零开始，且自然递增的整数做键名，并且定义了 length 表示元素个数的对象，我们就认为他是类数组对象！类数组对象可以进行读写操作和遍历操作。

```js
var arrLike = {
  length: 4,
  2: 'foo',
};
```

要将其转换为真正的数组可以使用各种 Array.prototype 方法(map(..)、indexOf(..) 等)

```js
var arr = Array.prototype.slice.call(arrLike);
var arr2 = arr.slice();
var arr = Array.from(arrLike);
```

常见的类数组:

1. arguments

```js
console.log(Array.isArray(arguments)); //false
console.log(arguments);
//node打印: {}
//chrome打印: Arguments [callee: ƒ, Symbol(Symbol.iterator): ƒ]
//因为arguments具有Symbol.iterator属性，所以它可以用扩展运算符(...arguments) 或 其他�使用迭代器的方法
```

2. dom 中

```js
//仅限浏览器中
const nodeList = document.querySelectorAll('*');
console.log(Array.isArray(nodeList));
```

3. 字符串 String

```js
const array = Array.from('abc');
console.log(array);
//["a", "b", "c"]
```

4. TypedArray

```js
const typedArray = new Int8Array(new ArrayBuffer(3));
console.log(Array.isArray(typedArray));
//false
```

5. {length:0} 是类数组的特殊情况，转换时可以执行成功，返回空数组[]

```js
console.log(Array.from({ length: 0 }));
//[]
console.log(Array.from(''));
//[]
```
