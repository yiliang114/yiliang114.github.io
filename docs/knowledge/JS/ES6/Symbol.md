---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### Symbol

`Symbol`是`ES6`引入的第七种原始数据类型, 所有 Symbol()生成的值都是独一无二的，可以从根本上解决对象属性太多导致属性名冲突覆盖的问题。

Symbol 类型的 key 是不能通过`Object.keys()`或者`for...in`来枚举的，但是也不是私有属性，它未被包含在对象自身的属性名集合(property names)之中。所以，利用该特性，我们可以把一些不需要对外操作和访问的属性使用 Symbol 来定义。也正因为这样一个特性，当使用`JSON.stringify()`将对象转换成 JSON 字符串的时候，Symbol 属性也会被排除在输出内容之外。

### symbol 应用

#### 作为属性名的使用

```js
var mySymbol = Symbol();
// 第一种写法
var a = {};
a[mySymbol] = 'Hello!';
// 第二种写法
var a = { [mySymbol]: 'Hello!' };
// 第三种写法
var a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });
// 以上写法都得到同样结果
a[mySymbol]; // "Hello!"
```

#### 变量可以不再重复

```js
et name1 = Symbol('name');
let name2 = Symbol('name');
console.log(name1 === name2); // false
```

将 Symbol 类型转换为字符串类型

```js
let name1 = Symbol('name');
let name2 = Symbol('name');

console.log(name1.toString()); // Symbol(name)
console.log(String(name2)); // Symbol(name)
```

#### Symbol 类型应用于对象的属性

```js
let getName = Symbol('name');
let obj = {
  [getName]() {
    return 'Joh';
  },
};
console.log(obj[getName]()); // Joh
```

#### Symbol 类型的属性具有一定的隐藏性

```js
let name = Symbol('name');
let obj = {
  age: 22,
  [name]: 'Joh',
};

console.log(Object.keys(obj)); // 打印不出 类型为Symbol的[name]属性

// 使用for-in也打印不出 类型为Symbol的[name]属性
for (var k in obj) {
  console.log(k);
}

// 使用 Object.getOwnPropertyNames 同样打印不出 类型为Symbol的[name]属性
console.log(Object.getOwnPropertyNames(obj));

// 使用 Object.getOwnPropertySymbols 可以
var key = Object.getOwnPropertySymbols(obj)[0];
console.log(obj[key]); // Joh
```

#### Symbol.for 和 Symbol.keyFor 的应用

使用 Symbol.for 获取 Symbol 类型的值，使用 Symbol.keyFor 来获取之前的字符串

```js
let name1 = Symbol.for('name');
let name2 = Symbol.for('name');
console.log(name1 === name2); // true
console.log(Symbol.keyFor(name1)); // name 备注：字符串类型的
```

#### 使用 Symbol.iterator 迭代器来逐个返回数组的单项

```js
et arr = ['a', 'b', 'c'];
var iterator = arr[Symbol.iterator]();
// next 方法返回done表示是否完成
console.log(iterator.next()); // {value: "a", done: false}
console.log(iterator.next()); // {value: "b", done: false}
console.log(iterator.next()); // {value: "c", done: false}
console.log(iterator.next()); // {value: undefined, done: true}
console.log(iterator.next()); // {value: undefined, done: true}
```

#### 字符串实现了 Symbol.iterator 接口

在 ES6 中在 set, map 字符串都能实现 Symbol.iterator 接口

```js
'use strict';

console.log('Joh'[Symbol.iterator]); // [Function: [Symbol.iterator]]

for (let char of 'Lili') {
  console.log(char);
}
```
