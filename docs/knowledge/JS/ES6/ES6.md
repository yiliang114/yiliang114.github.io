---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### arguments 的作用，在 es6 中更好的替代方案

不定参数和默认参数

### 箭头函数与普通函数的区别？

- 普通 function 的声明在变量提升中是最高的，箭头函数没有函数提升
- 箭头函数没有属于自己的 this，arguments
- 箭头函数不能作为构造函数，不能被 new，没有 property
- call 和 apply 方法只有参数，没有作用域

### ES Module

ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别

- CommonJS 支持动态导入，也就是 require(\${path}/xx.js)，后者目前不支持，但是已有提案
- CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
- CommonJS 在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 ES Module 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
- ES Module 会编译成 require/exports 来执行的

```js
// 引入模块 API
import XXX from './a.js';
import { XXX } from './a.js';
// 导出模块 API
export function a() {}
export default function() {}
```

### 私有方法和私有属性（阿里一面）

[阮老师 | ES6 入门](https://es6.ruanyifeng.com/?search=%E7%A7%81%E6%9C%89&x=0&y=0#docs/class#%E7%A7%81%E6%9C%89%E6%96%B9%E6%B3%95%E5%92%8C%E7%A7%81%E6%9C%89%E5%B1%9E%E6%80%A7)

#### 现有的解决方案

私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。这是常见需求，有利于代码的封装，但 ES6 不提供，只能通过变通方法模拟实现。

一种做法是在命名上加以区别，即在函数名或属性名前加`_`，但这并不安全，只是一种团队规范。

另一种方法就是索性**将私有方法移出类，放到模块里**，因为模块内部的所有方法都是对外可见的。

```js
class Widget {
  foo(baz) {
    bar.call(this, baz);
  }

  // ...
}

function bar(baz) {
  return (this.snaf = baz);
}
```

上面代码中，foo 是公开方法，内部调用了 bar.call(this, baz)。这使得 bar 实际上成为了当前模块的私有方法。

还有一种方法是利用**Symbol 值的唯一性**，将私有方法的名字命名为一个 Symbol 值。

```js
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass {
  // 公有方法
  foo(baz) {
    this[bar](baz);
  }

  // 私有方法
  [bar](baz) {
    return (this[snaf] = baz);
  }

  // ...
}
```

上面代码中，bar 和 snaf 都是 Symbol 值，一般情况下无法获取到它们，因此达到了私有方法和私有属性的效果。但是也不是绝对不行，Reflect.ownKeys()依然可以拿到它们。

```js
const inst = new myClass();

Reflect.ownKeys(myClass.prototype);
// [ 'constructor', 'foo', Symbol(bar) ]
```

### 请介绍一下装饰者模式，并实现

在不改变元对象的基础上，对这个对象进行包装和拓展（包括添加属性和方法），从而使这个对象可以有更复杂的功能。

### 对于 ES7 你了解多少？

**What is a Polyfill?**

- polyfill 是“在旧版浏览器上复制标准 API 的 JavaScript 补充”,可以动态地加载 JavaScript 代码或库，在不支持这些标准 API 的浏览器中模拟它们
- 例如，geolocation（地理位置）polyfill 可以在 navigator 对象上添加全局的 geolocation 对象，还能添加 getCurrentPosition 函数以及“坐标”回调对象
- 所有这些都是 W3C 地理位置 API 定义的对象和函数。因为 polyfill 模拟标准 API，所以能够以一种面向所有浏览器未来的方式针对这些 API 进行开发
- 一旦对这些 API 的支持变成绝对大多数，则可以方便地去掉 polyfill，无需做任何额外工作。

**做的项目中，有没有用过或自己实现一些 polyfill 方案（兼容性处理方案）？**

- 比如： html5shiv、Geolocation、Placeholder

### 对象

#### 删除对象属性

```js
delete Person.name;
```

#### 对象是否存在该属性

```js
'name' in Person;
```

in 缺陷---属性是继承来的时候,仍然返回 true
最好使用 hasOwnProperty()

```js
Person.hasOwnProperty('name');
```

### Map

对象缺陷: key 必须是字符串

Map 就是支持全类型的 key(如:number)

```js
var m = new Map([
  ['Michael', 95],
  ['Bob', 75],
  ['Tracy', 85],
]);
m.get('Michael'); // 95

var m = new Map(); // 空 Map
m.set('Adam', 67); // 添加新的 key-value
m.set('Bob', 59);
m.has('Adam'); // 是否存在 key 'Adam': true
m.get('Adam'); // 67
m.delete('Adam'); // 删除 key 'Adam'
m.get('Adam'); // undefined
```

### Set

没有重复值得 Array,重复值会被自动过滤掉

```js
var s1 = new Set(); // 空 Set
var s2 = new Set([1, 2, 3]); // 含 1, 2, 3
var s = new Set([1, 2, 3, 3, '3']);
s; // Set {1, 2, 3, "3"}
s.add(4); //添加(重复添加无效果)
s.delete(3); //删除
```

### 迭代器(iterable)

for...in 遍历的是对象的属性名称(key) Array 的 key 就是 index

```js
var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x in a) {
  alert(x); // '0', '1', '2', 'name'
}
```

for...of 就是解决这个问题的循环

```js
var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x of a) {
  alert(x); // 'A', 'B', 'C'
}
```

更好的方式: forEach

```js
var a = ['A', 'B', 'C'];
a.forEach(function(element, index, array) {
  // element: 指向当前元素的值
  // index: 指向当前索引
  // array: 指向 Array 对象本身
  alert(element);
});
```

Set

```js
var s = new Set(['A', 'B', 'C']);
s.forEach(function(element, sameElement, set) {
  alert(element);
});
```

Map

```js
var m = new Map([
  [1, 'x'],
  [2, 'y'],
  [3, 'z'],
]);
m.forEach(function(value, key, map) {
  alert(value);
});
```

函数

如果没有 return 语句,函数也会返回结果,只是结果为 undefined

arguments: 获取函数传入的所有参数

rest: 抑制参数(用于获取定义参数之外的参数,不过要改写法)

```js
function foo(a, b, ...rest) {
  console.log('a = ' + a);
  console.log('b = ' + b);
  console.log(rest);
}

foo(1, 2, 3, 4, 5);
// 结果:
// a = 1
// b = 2
// Array [ 3, 4, 5 ]

foo(1);
// 结果:
// a = 1
// b = undefined
// Array []
```

变量

var 变量会提升到函数顶部声明(未赋值)

局部作用域

JS 变量作用域实际上是函数内部, 那么在 for 循环语句块中是无法定义局部变量的

```js
function foo() {
  for (var i = 0; i < 100; i++) {
    //
  }
  i += 100; // 仍然可以引用变量 i
}
```

let 变量: 可以用来声明块级作用域的变量

```js
function foo() {
  var sum = 0;
  for (let i = 0; i < 100; i++) {
    sum += i;
  }
  i += 1; // SyntaxError
}
```

const: 定义常量

方法

对象绑定方法

```js
var xiaoming = {
  name: '小明',
  birth: 1990,
  age: function() {
    var y = new Date().getFullYear();
    return y - this.birth;
  },
};

xiaoming.age; // function xiaoming.age()
xiaoming.age(); // 今年调用是 25,明年调用就变成 26 了
```

this: 指向当前对象

apply call 绑定函数

```js
function getAge() {
  var y = new Date().getFullYear();
  return y - this.birth;
}

var xiaoming = {
  name: '小明',
  birth: 1990,
  age: getAge,
};

xiaoming.age(); // 25
getAge.apply(xiaoming, []); // 25, this 指向 xiaoming, 参数为空
```

另一个与 apply()类似的方法是 call()，唯一区别是：

• apply()把参数打包成 Array 再传入；

• call()把参数按顺序传入。

比如调用 Math.max(3, 5, 4)，分别用 apply()和 call()实现如下：

```js
Math.max.apply(null, [3, 5, 4]); // 5
Math.max.call(null, 3, 5, 4); // 5
```

对普通函数调用，我们通常把 this 绑定为 null。

高级函数

map(): 定义在 Array 中,对数组中每个元素执行 map 中传入的操作,并返回新数组

```js
function pow(x) {
return x \* x;
}

var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
arr.map(pow); // [1, 4, 9, 16, 25, 36, 49, 64, 81]
```

reduce(): 定义在 Array 中,必须接受两个参数,并把结果和下一个元素,做累积计算

```js
var arr = [1, 3, 5, 7, 9];
arr.reduce(function(x, y) {
  return x + y;
}); // 25
```

filter(): 定义在 Array 中,过滤掉元素,返回剩下的元素

```js
var arr = [1, 2, 4, 5, 6, 9, 10, 15];
var r = arr.filter(function(x) {
  return x % 2 !== 0;
});
r; // [1, 5, 9, 15]
```

sort(): 定义在 Array 中,排序函数

```js
var arr = [10, 20, 1, 2];
arr.sort(function(x, y) {
  if (x < y) {
    return -1;
  }
  if (x > y) {
    return 1;
  }
  return 0;
}); // [1, 2, 10, 20]
```

箭头函数

箭头函数相当于匿名函数

```js
// 两个参数:
(x, y) => x _ x + y _ y

// 无参数:
() => 3.14

// 可变参数:
(x, y, ...rest) => {
var i, sum = x + y;
for (i=0; i<rest.length; i++) {
sum += rest[i];
}
return sum;
}

```

如果要返回一个对象

```js
// SyntaxError:
x => {
  foo: x;
}; //错误写法
// ok:
x => ({ foo: x });
//因为和{...}函数体的语法冲突
```

箭头函数和匿名函数的区别:

匿名函数会出现 this 的错指向

```js
var obj = {
  birth: 1990,
  getAge: function() {
    var b = this.birth; // 1990
    var fn = function() {
      return new Date().getFullYear() - this.birth; // this 指向 window 或 undefined
    };
    return fn();
  },
};
```

箭头函数已绑定 this,不会出现错指向

```js
var obj = {
birth: 1990,
getAge: function () {
var b = this.birth; // 1990
var fn = () => new Date().getFullYear() - this.birth; // this 指向 obj 对象
return fn();
}
};
obj.getAge(); // 25

generator(多返回函数) 使用 function\*定义

function\* foo(x) {
yield x + 1;
yield x + 2;
return x + 3;
}
```

闭包: 返回值是函数, 函数的参数记录父函数的环境,这样就把东西带出来了

面向对象

JS 不区分类和对象的概念,而是通过原型(prototype)实现面向对象编程

```js
var Student = {
name: 'Robot',
height: 1.2,
run: function () {
console.log(this.name + ' is running...');
}
};

var xiaoming = {
name: '小明'
};

xiaoming.**proto** = Student;
```

JS 没有类的概念,多有的都是对象,使用原型实现继承

原型链

```js
arr---- > Array.prototype---- > Object.prototype---- > null;
```

构造函数

```js
function Student(name) {
  this.name = name;
  this.hello = function() {
    alert('Hello, ' + this.name + '!');
  };
}
//这确实是一个普通函数，但是在 JavaScript 中，可以用关键字 new 来调用这个函数，并返回一个对象：
var xiaoming = new Student('小明');
xiaoming.name; // '小明'
xiaoming.hello(); // Hello, 小明!
```

prototype: 可以用来扩展原型的属性和方法

### ES6 的类和 ES5 的构造函数有什么区别？

### 你能给出一个使用箭头函数的例子吗，箭头函数与其他函数有什么不同？

### 在构造函数中使用箭头函数有什么好处？

### 请给出一个解构（destructuring）对象或数组的例子。

解构是 ES6 中新功能，它提供了一种简洁方便的方法来提取对象或数组的值，并将它们放入不同的变量中。

**数组解构**

```js
// 变量赋值
const foo = ['one', 'two', 'three'];

const [one, two, three] = foo;
console.log(one); // "one"
console.log(two); // "two"
console.log(three); // "three"
```

```js
// 变量交换
let a = 1;
let b = 3;

[a, b] = [b, a];
console.log(a); // 3
console.log(b); // 1
```

**对象解构**

```js
// 变量赋值
const o = { p: 42, q: true };
const { p, q } = o;

console.log(p); // 42
console.log(q); // true
```

### ES6 的模板字符串为生成字符串提供了很大的灵活性，你可以举个例子吗？

**_模板字面量_**（Template literals） 是允许嵌入表达式的字符串字面量。你可以使用多行字符串和字符串插值功能。

**语法**

```js
`string text``string text line 1
 string text line 2``string text ${expression} string text`;

tag`string text ${expression} string text`;
```

**示例**

```js
console.log(`string text line 1
string text line 2`);
// "string text line 1
// string text line 2"

var a = 5;
var b = 10;
console.log(`Fifteen is ${a + b} and\nnot ${2 * a + b}.`);
// "Fifteen is 15 and
// not 20."
```

```js
//show函数采用rest参数的写法如下：

let name = '张三',
  age = 20,
  message = show`我来给大家介绍:${name}的年龄是${age}.`;

function show(stringArr, ...values) {
  let output = '';

  let index = 0;

  for (; index < values.length; index++) {
    output += stringArr[index] + values[index];
  }

  output += stringArr[index];

  return output;
}

message; //"我来给大家介绍:张三的年龄是20."
```

### 使用扩展运算符（spread）的好处是什么，它与使用剩余参数语句（rest）有什么区别？

在函数泛型编码时，ES6 的扩展运算符非常有用，因为我们可以轻松创建数组和对象的拷贝，而无需使用`Object.create`、`slice`或其他函数库。这个语言特性在 Redux 和 rx.js 的项目中经常用到。

```js
function putDookieInAnyArray(arr) {
  return [...arr, 'dookie'];
}

const result = putDookieInAnyArray(['I', 'really', "don't", 'like']); // ["I", "really", "don't", "like", "dookie"]

const person = {
  name: 'Todd',
  age: 29,
};

const copyOfTodd = { ...person };
```

ES6 的剩余参数语句提供了一个简写，允许我们将不定数量的参数表示为一个数组。它就像是扩展运算符语法的反面，将数据收集到数组中，而不是解构数组。剩余参数语句在函数参数、数组和对象的解构赋值中有很大作用。

```js
function addFiveToABunchOfNumbers(...numbers) {
  return numbers.map(x => x + 5);
}

const result = addFiveToABunchOfNumbers(4, 5, 6, 7, 8, 9, 10); // [9, 10, 11, 12, 13, 14, 15]

const [a, b, ...rest] = [1, 2, 3, 4]; // a: 1, b: 2, rest: [3, 4]

const { e, f, ...others } = {
  e: 1,
  f: 2,
  g: 3,
  h: 4,
}; // e: 1, f: 2, others: { g: 3, h: 4 }
```

### 什么情况下会用到静态类成员？

静态类成员（属性或方法）不绑定到某个类的特定实例，不管哪个实例引用它，都具有相同的值。静态属性通常是配置变量，而静态方法通常是纯粹的实用函数，不依赖于实例的状态。

### ES6 中有使用过什么？

**思路引导：**

这边可说的实在太多，你可以列举 1 - 2 个点。比如说说 `class`，那么 `class` 又可以拉回到原型的问题；可以说说 `promise`，那么线就被拉到了异步的内容；可以说说 `proxy`，那么如果你使用过 Vue 这个框架，就可以谈谈响应式原理的内容；同样也可以说说 `let` 这些声明变量的语法，那么就可以谈及与 `var` 的不同，说到提升这块的内容。

### es6 的特性有什么？

- 箭头函数
- 类的支持
- 解构
- 不定参数
- 默认参数
- 块级作用域 let\const
- 模板字符串
- 多行字符串
- 拆包表达式
- promise
- 改进的对象表达式
- 模块化
- 延展操作符
- 更新的数据结构（map 和 set）
- generator

#### 默认参数

```js
function fn(name="world") {...}
```

#### 模板字符串

```js
var url = `http://login?username=${userName}&password=${password}`;
```

#### 多行字符串

一个比较好的语法糖。

```js
var roadPoem = `Then took the other, as just as fair,
    And having perhaps the better claim
    Because it was grassy and wanted wear,
    Though as for that the passing there
    Had worn them really about the same,`;
```

#### 解构赋值

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

```js
var [first, second, third] = someArray;

//------
let [a, b, c] = [1, 2, 3];
//等同于
let a = 1;
let b = 2;
let c = 3;

// 对象的解构赋值：获取对象的多个属性并且使用一条语句将它们赋给多个变量。
var { StyleSheet, Text, View } = React;
```

#### 箭头函数

箭头最神奇的地方在于他会让你写正确的代码。比如，this 在上下文和函数中的值应当是相同的，它不会变化，通常变化的原因都是因为你创建了闭包。

使用箭头函数可以让我们不再用 that = this 或者 self = this 或者 `that = this` 或者.bind(this)这样的代码。

#### 延展操作符

- 通过它可以将数组作为参数直接传入函数

```js
var people = ['Wayou', 'John', 'Sherlock'];
function sayHello(people1, people2, people3) {
  console.log(`Hello ${people1},${people2},${people3}`);
}
//改写为
sayHello(...people); //输出：Hello Wayou,John,Sherlock
```

- 在函数定义时可以通过…rest 获取定义参数外的所有参数

```js
function foo(a, b, ...rest) {}
```

#### 模块化

es6 有 import 和 export 运算符来实现了.

你在模块中的所有声明相对于模块而言都是寄存在本地的。如果你希望公开在模块中声明的内容，并让其它模块加以使用，你一定要导出这些功能。想要导出模块的功能有很多方法，其中最简单的方式是添加 export 关键字。你可以导出所有的最外层函数、类以及 var、let 或 const 声明的变量。

> 模块与脚本还是有两点区别

> - “在 ES6 模块中，无论你是否加入“use strict;”语句，默认情况下模块都是在严格模式下运行。”
>   摘录来自: InfoQ 中文站. “深入浅出 ES6。” iBooks.
> - “在模块中你可以使用 import 和 export 关键字。”

### 箭头函数相比于普通函数的优点？

- 简洁
- this
  function 传统定义的函数，this 指向随着调用环境的改变而改变，而箭头 函数中的指向则是固定不变，一直指向定义环境的。
  > 箭头函数在定义之后，this 就不会发生改变了，无论用什么样子的方式调用它，this 都不会改变
  > 箭头函数没有它自己的 this 值，箭头函数内的 this 值继承自外围作用域。
- 构造函数
  箭头函数固然好用，但是不能用于构造函数，即不能被 new 一下
- 变量提升
  由于 js 的内存机制，function 的级别最高，而用箭头函数定义函数的时候，需要 var(let const 定义的时候更不必说)关键词，而 var 所定义的变量不能得到变量提升，故箭头函数一定要定义于调用之前！

### es6 中的 Map 结构

### es6 为什么推出 Map 结构？

JavaScript 的对象（object）本质上就是键值对的集合（Hash 结构），但是只能用字符串作为键。这就给它的使用带来了很大的限制。

### 装饰器

https://segmentfault.com/p/1210000009968000/read

### JS 中的依赖注入

https://www.cnblogs.com/front-end-ralph/p/5208045.html

inversify

## es6 重难点

### let 和 const

ES6 新增了`let`和`const`，它们声明的变量，都处于“块级作用域”。并且不存在“变量提升”，不允许重复声明。

同时，`const`声明的变量所指向的内存地址保存的数据不得改变：

- 对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。
- 对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，`const`只能保证这个指针是固定的（即总是指向另一个固定的地址），不能保证指向的数据结构不可变。

如果要保证指向的数据结构也不可变，需要自行封装：

```js
/**
 * 冻结对象
 * @param {Object} obj
 * @return {Object}
 */
function constantize(obj) {
  if (Object.isFrozen(obj)) {
    return obj;
  }

  Reflect.ownKeys(obj).forEach(key => {
    // 如果属性是对象，递归冻结
    typeof obj[key] === 'object' && (obj[key] = constantize(obj[key]));
  });

  return Object.freeze(obj);
}

/********测试代码 **********/

const obj = {
  a: 1,
  b: {
    c: 2,
    d: {
      a: 1,
    },
  },
  d: [1, 2],
};

const fronzenObj = constantize(obj);
try {
  fronzenObj.d = [];
  fronzenObj.b.c = 3;
} catch (error) {
  console.log(error.message);
}
```

### Set 和 Map

> 题目：解释下`Set`和`Map`。

- Set 元素不允许重复
- Map 类似对象，但是它的键（key）可以是任意数据类型

**①Set 常用方法**

```js
// 实例化一个set
const set = new Set([1, 2, 3, 4]);

// 遍历set
for (let item of set) {
  console.log(item);
}

// 添加元素，返回Set本身
set.add(5).add(6);

// Set大小
console.log(set.size);

// 检查元素存在
console.log(set.has(0));

// 删除指定元素，返回bool
let success = set.delete(1);
console.log(success);

set.clear();
```

其他遍历方法：由于没有键名，`values()`和`keys()`返回同样结果。

```js
for (let item of set.keys()) {
  console.log(item);
}

for (let item of set.values()) {
  console.log(item);
}

for (let item of set.entries()) {
  console.log(item);
}
```

**②Map 常用方法**

Map 接口基本和 Set 一致。不同的是增加新元素的 API 是：`set(key, value)`

```js
const map = new Map();

// 以任意对象为 Key 值
// 这里以 Date 对象为例
let key = new Date();
map.set(key, 'today');

console.log(map.get(key));
```

### Generator 与 yield

`generator`函数是 es6 提供的新特性，它的最大特点是：**控制函数的执行**。让我们从网上最火的一个例子来看：

```js
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}

var b = foo(5);
b.next(); // { value:6, done:false }
b.next(12); // { value:8, done:false }
b.next(13); // { value:42, done:true }
```

通俗的解释下为什么会有这种输出：

1. 给函数 foo 传入参数 5，但由于它是 generator，所以执行到**第一个 yield 前**就停止了。
1. 第一次调用 next()，**这次传入的参数会被忽略**暂停\*\*。
1. 第二次调用 next(12)，**传入的参数会被当作上一个 yield 表达式的返回值**。因此，y = 2 \* 12 = 24。执行到第二个 yield，返回其后的表达式的值 24 / 3 = 8。然后函数在此处暂停。
1. 第三次调用 next(13)，没有 yield，只剩 return 了，按照正常函数那样返回 return 的表达式的值，并且`done`为`true`。

**难点**：在于为什么最后的`value`是 42 呢？

首先，`x`的值是刚开始调用 foo 函数传入的 5。而最后传入的 13 被当作第二个 yield 的返回值，所以`z`的值是 13。对于`y`的值，我们在前面第三步中已经计算出来了，就是 24。

所以，`x + y + z = 5 + 24 + 13 = 42`

看懂了上面的分析，再看下面这段代码就很好理解了：

```js
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}

var a = foo(5);
a.next(); // Object{value:6, done:false}
a.next(); // Object{value:NaN, done:false}
a.next(); // Object{value:NaN, done:true}
```

只有第一次调用 next 函数的时候，输出的 value 是 6。其他时候由于没有给 next 传入参数，因此 yield 的返回值都是`undefined`，进行运算后自然是`NaN`。

### Promise 介绍

简单归纳下 Promise：**三个状态、两个过程、一个方法**

- 三个状态：`pending`、`fulfilled`、`rejected`
- 两个过程（**单向不可逆**）：
  - `pending`->`fulfilled`
  - `pending`->`rejected`
- 一个方法`then`：`Promise`本质上只有一个方法，`catch`和`all`方法都是基于`then`方法实现的。

请看下面这段代码：

```js
// 构造 Promise 时候, 内部函数立即执行
new Promise((resolve, reject) => {
  console.log('new Promise');
  resolve('success');
});
console.log('finifsh');

//  then 中 使用了 return，那么 return 的值会被 Promise.resolve() 包装
Promise.resolve(1)
  .then(res => {
    console.log(res); // => 1
    return 2; // 包装成 Promise.resolve(2)
  })
  .then(res => {
    console.log(res); // => 2
  });
```

### async/await 介绍

`async`函数返回一个`Promise`对象，可以使用`then`方法添加回调函数。

当函数执行的时候，一旦遇到`await`就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

这也是它最受欢迎的地方：**能让异步代码写起来像同步代码，并且方便控制顺序**。

可以利用它实现一个`sleep`函数阻塞进程：

```js
function sleep(millisecond) {
  return new Promise(resolve => {
    setTimeout(() => resolve, millisecond);
  });
}

/**
 * 以下是测试代码
 */
async function test() {
  console.log('start');
  await sleep(1000); // 睡眠1秒
  console.log('end');
}

test(); // 执行测试函数
```

虽然方便，**但是它也不能取代`Promise`，尤其是我们可以很方便地用`Promise.all()`来实现并发**，而`async/await`只能实现串行。

```js
function sleep(second) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(Math.random());
      resolve();
    }, second);
  });
}

async function chuanXingDemo() {
  await sleep(1000);
  await sleep(1000);
  await sleep(1000);
}

async function bingXingDemo() {
  var tasks = [];
  for (let i = 0; i < 3; ++i) {
    tasks.push(sleep(1000));
  }

  await Promise.all(tasks);
}
```

运行`bingXingDemo()`，几乎同时输出，它是并发执行；运行`chuanXingDemo()`，每个输出间隔 1s，它是串行执行。

### ES6 对象和 ES5 对象

> 题目：es6 class 的 new 实例和 es5 的 new 实例有什么区别？

在`ES6`中（和`ES5`相比），`class`的`new`实例有以下特点：

- `class`的构造参数必须是`new`来调用，不可以将其作为普通函数执行
- `es6` 的`class`不存在变量提升
- **最重要的是：es6 内部方法不可以枚举**。es5 的`prototype`上的方法可以枚举。

为此我做了以下测试代码进行验证：

```js
console.log(ES5Class()); // es5:可以直接作为函数运行
// console.log(new ES6Class()) // 会报错：不存在变量提升

function ES5Class() {
  console.log('hello');
}

ES5Class.prototype.func = function() {
  console.log('Hello world');
};

class ES6Class {
  constructor() {}
  func() {
    console.log('Hello world');
  }
}

let es5 = new ES5Class();
let es6 = new ES6Class();

// 推荐在循环对象属性的时候，使用for...in
// 在遍历数组的时候的时候，使用for...of
console.log('ES5 :');
for (let _ in es5) {
  console.log(_);
}

// es6:不可枚举
console.log('ES6 :');
for (let _ in es6) {
  console.log(_);
}
```

### Proxy 代理器

他可以实现 js 中的“元编程”：在目标对象之前架设拦截，可以过滤和修改外部的访问。

它支持多达 13 种拦截操作，例如下面代码展示的`set`和`get`方法，分别可以在设置对象属性和访问对象属性时候进行拦截。

```js
const handler = {
  // receiver 指向 proxy 实例
  get(target, property, receiver) {
    console.log(`GET: target is ${target}, property is ${property}`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`SET: target is ${target}, property is ${property}`);
    return Reflect.set(target, property, value);
  },
};

const obj = { a: 1, b: { c: 0, d: { e: -1 } } };
const newObj = new Proxy(obj, handler);

/**
 * 以下是测试代码
 */

newObj.a; // output: GET...
newObj.b.c; // output: GET...

newObj.a = 123; // output: SET...
newObj.b.c = -1; // output: GET...
```

运行这段代码，会发现最后一行的输出是 `GET ...`。也就是说它触发的是`get`拦截器，而不是期望的`set`拦截器。**这是因为对于对象的深层属性，需要专门对其设置 Proxy**。

**更多请见**：[《阮一峰 ES6 入门：Proxy》](http://es6.ruanyifeng.com/#docs/proxy)

### EsModule 和 CommonJS 的比较

目前 js 社区有 4 种模块管理规范：AMD、CMD、CommonJS 和 EsModule。 ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别：

- CommonJS 支持动态导入，也就是 `require(${path}/xx.js)`，后者目前不支持，但是已有提案：`import(xxx)`
- CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
- commonJs 输出的是值的浅拷贝，esModule 输出值的引用
- ES Module 会编译成 `require/exports` 来执行的
