---
title: Symbol
date: '2020-10-26'
draft: true
---

### Symbol

`Symbol`是`ES6`引入的第七种原始数据类型, 所有 Symbol()生成的值都是独一无二的，可以从根本上解决对象属性太多导致属性名冲突覆盖的问题。

Symbol 类型的 key 是不能通过`Object.keys()`或者`for...in`来枚举的，但是也不是私有属性，它未被包含在对象自身的属性名集合(property names)之中。所以，利用该特性，我们可以把一些不需要对外操作和访问的属性使用 Symbol 来定义。也正因为这样一个特性，当使用`JSON.stringify()`将对象转换成 JSON 字符串的时候，Symbol 属性也会被排除在输出内容之外。

### Symbol

- 定义：独一无二的值
- 声明：`const set = Symbol(str)`
- 入参：字符串(可选)
- 方法
  - **Symbol()**：创建以参数作为描述的`Symbol值`(不登记在全局环境)
  - **Symbol.for()**：创建以参数作为描述的`Symbol值`，如存在此参数则返回原有的`Symbol值`(先搜索后创建，登记在全局环境)
  - **Symbol.keyFor()**：返回已登记的`Symbol值`的描述(只能返回`Symbol.for()`的`key`)
  - **Object.getOwnPropertySymbols()**：返回对象中所有用作属性名的`Symbol值`的数组
- 内置
  - **Symbol.hasInstance**：指向一个内部方法，当其他对象使用`instanceof运算符`判断是否为此对象的实例时会调用此方法
  - **Symbol.isConcatSpreadable**：指向一个布尔值，定义对象用于`Array.prototype.concat()`时是否可展开
  - **Symbol.species**：指向一个构造函数，当实例对象使用自身构造函数时会调用指定的构造函数
  - **Symbol.match**：指向一个函数，当实例对象被`String.prototype.match()`调用时会重新定义`match()`的行为
  - **Symbol.replace**：指向一个函数，当实例对象被`String.prototype.replace()`调用时会重新定义`replace()`的行为
  - **Symbol.search**：指向一个函数，当实例对象被`String.prototype.search()`调用时会重新定义`search()`的行为
  - **Symbol.split**：指向一个函数，当实例对象被`String.prototype.split()`调用时会重新定义`split()`的行为
  - **Symbol.iterator**：指向一个默认遍历器方法，当实例对象执行`for-of`时会调用指定的默认遍历器
  - **Symbol.toPrimitive**：指向一个函数，当实例对象被转为原始类型的值时会返回此对象对应的原始类型值
  - **Symbol.toStringTag**：指向一个函数，当实例对象被`Object.prototype.toString()`调用时其返回值会出现在`toString()`返回的字符串之中表示对象的类型
  - **Symbol.unscopables**：指向一个对象，指定使用`with`时哪些属性会被`with环境`排除

> 数据类型

- **Undefined**
- **Null**
- **String**
- **Number**
- **Boolean**
- **Object**(包含`Array`、`Function`、`Date`、`RegExp`、`Error`)
- **Symbol**

> 应用场景

- 唯一化对象属性名：属性名属于 Symbol 类型，就都是独一无二的，可保证不会与其他属性名产生冲突
- 消除魔术字符串：在代码中多次出现且与代码形成强耦合的某一个具体的字符串或数值
- 遍历属性名：无法通过`for-in`、`for-of`、`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回，只能通过`Object.getOwnPropertySymbols`返回
- 启用模块的 Singleton 模式：调用一个类在任何时候返回同一个实例(`window`和`global`)，使用`Symbol.for()`来模拟全局的`Singleton模式`

> 重点难点

- `Symbol()`生成一个原始类型的值不是对象，因此`Symbol()`前不能使用`new命令`
- `Symbol()`参数表示对当前`Symbol值`的描述，相同参数的`Symbol()`返回值不相等
- `Symbol值`不能与其他类型的值进行运算
- `Symbol值`可通过`String()`或`toString()`显式转为字符串
- `Symbol值`作为对象属性名时，此属性是公开属性，但不是私有属性
- `Symbol值`作为对象属性名时，只能用方括号运算符(`[]`)读取，不能用点运算符(`.`)读取
- `Symbol值`作为对象属性名时，不会被常规方法遍历得到，可利用此特性为对象定义`非私有但又只用于内部的方法`

### 应用场景

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

#### 使用 Symbol.iterator 迭代器来逐个返回数组的单向

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
