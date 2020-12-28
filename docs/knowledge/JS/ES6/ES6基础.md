---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 简要介绍 ES6

`ES2015`特指在`2015`年发布的新一代`JS`语言标准，`ES6`泛指下一代 JS 语言标准，包含`ES2015`、`ES2016`、`ES2017`、`ES2018`等。现阶段在绝大部分场景下，`ES2015`默认等同`ES6`。`ES5`泛指上一代语言标准。`ES2015`可以理解为`ES5`和`ES6`的时间分界线

ES6 在变量的声明和定义方面增加了 let、const 声明变量，有局部变量的概念，赋值中有比较吸引人的结构赋值，同时 ES6 对字符串、
数组、正则、对象、函数等拓展了一些方法，如字符串方面的模板字符串、函数方面的默认参数、对象方面属性的简洁表达方式，ES6 也
引入了新的数据类型 symbol，新的数据结构 set 和 map,symbol 可以通过 typeof 检测出来，为解决异步回调问题，引入了 promise 和
generator，还有最为吸引人了实现 Class 和模块，通过 Class 可以更好的面向对象编程，使用模块加载方便模块化编程，当然考虑到
浏览器兼容性，我们在实际开发中需要使用 babel 进行编译。

### ES6 的新特性

- 块级作用区域 `let a = 1;`
- 可定义常量 `const PI = 3.141592654;`
- 箭头函数
- 变量解构赋值 `var [a, b, c] = [1, 2, 3];`
- 字符串的扩展(模板字符串) `var sum =`\${a + b}`;`
- 数组的扩展(转换数组类型) `Array.from($('li'));`
- 函数的扩展(扩展运算符) `[1, 2].push(...[3, 4, 5]);`
- 对象的扩展(同值相等算法) `Object.is(NaN, NaN);`
- 新增数据类型(Symbol) `let uid = Symbol('uid');`
- 新增数据结构(Map) `let set = new Set([1, 2, 2, 3]);`
- for...of 循环 `for(let val of arr){};`
- Promise 对象 `var promise = new Promise(func);`
- Generator 函数 `function* foo(x){yield x; return x*x;}`
- 引入 Class(类) `class Foo {}`
- 引入模块体系 `export default func;`
- 引入 async await 函数[ES7]
- Map Set 与 WeakMap WeakSet
- 参数默认值，不定参数，扩展参数
- 增强的字面量对象

类的支持，模块化，箭头操作符，let/const 块作用域，字符串模板，解构，参数默认值/不定参数/拓展参数, for-of 遍历, generator, Map/Set, Promise

ES6 就是 ES2015。目前并不是所有浏览器都能兼容 ES6 全部特性。

#### 最常用的 ES6 特性

`let, const, class, extends, super, arrow functions, template string, destructuring, default, rest arguments`

- **表达式**：声明、解构赋值
- **内置对象**：字符串扩展、数值扩展、对象扩展、数组扩展、函数扩展、正则扩展、Symbol、Set、Map、Proxy、Reflect
- **语句与运算**：Class、Module、Iterator
- **异步编程**：Promise、Generator、Async

### class, extends, super

```js
class Animal {
  constructor() {
    this.type = 'animal';
  }
  says(say) {
    console.log(this.type + ' says ' + say);
  }
}

let animal = new Animal();
animal.says('hello'); //animal says hello

class Cat extends Animal {
  constructor() {
    super();
    this.type = 'cat';
  }
}

let cat = new Cat();
cat.says('hello'); //cat says hello
```

上面代码首先用`class`定义了一个“类”，可以看到里面有一个`constructor`方法，这就是构造方法，而`this`关键字则代表实例对象。简单地说，`constructor`内定义的方法和属性是实例对象自己的，而`constructor`外定义的方法和属性则是所有实例对象可以共享的。

Class 之间可以通过`extends`关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。上面定义了一个 Cat 类，该类通过`extends`关键字，继承了 Animal 类的所有属性和方法。

`super`关键字，它指代父类的实例（即父类的 this 对象）。子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类没有自己的`this`对象，而是继承父类的`this`对象，然后对其进行加工。如果不调用`super`方法，子类就得不到`this`对象。

ES6 的继承机制，实质是先创造父类的实例对象 this（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。

P.S 如果你写 react 的话，就会发现以上三个东西在最新版 React 中出现得很多。创建的每个 component 都是一个继承`React.Component`的类。[详见 react 文档](https://facebook.github.io/react/docs/reusable-components.html)

### Class 本质

其实在 JS 中并不存在类，`class` 只是语法糖，本质还是函数。

```js
class Person {}
Person instanceof Function; // true
```

### 举一些 ES6 对 String 字符串类型做的常用升级优化?

**优化部分**

`ES6`新增了字符串模板，在拼接大段字符串时，用反斜杠`(`)`取代以往的字符串相加的形式，能保留所有空格和换行，使得字符串拼接看起来更加直观，更加优雅

**升级部分**

`ES6`在`String`原型上新增了`includes()`方法，用于取代传统的只能用`indexOf`查找包含字符的方法(`indexOf`返回`-1`表示没查到不如`includes`方法返回`false`更明确，语义更清晰), 此外还新增了`startsWith()`, `endsWith(),` `padStart()`,`padEnd()`,`repeat()`等方法，可方便的用于查找，补全字符串

### 举一些 ES6 对 Array 数组类型做的常用升级优化

**优化部分**

- 数组解构赋值。`ES6`可以直接以`let [a,b,c] = [1,2,3]`形式进行变量赋值，在声明较多变量时，不用再写很多`let(var),`且映射关系清晰，且支持赋默认值
- 扩展运算符。`ES6`新增的扩展运算符(`...`)(重要),可以轻松的实现数组和松散序列的相互转化，可以取代`arguments`对象和`apply`方法，轻松获取未知参数个数情况下的参数集合。（尤其是在`ES5`中，`arguments`并不是一个真正的数组，而是一个类数组的对象，但是扩展运算符的逆运算却可以返回一个真正的数组）。扩展运算符还可以轻松方便的实现数组的复制和解构赋值（`let a = [2,3,4]`; `let b = [...a]`）

**升级部分**

`ES6`在`Array`原型上新增了`find()`方法，用于取代传统的只能用`indexOf`查找包含数组项目的方法,且修复了`indexOf`查找不到`NaN的bug([NaN].indexOf(NaN) === -1)`.此外还新增了`copyWithin()`,`includes()`, `fill()`,`flat()`等方法，可方便的用于字符串的查找，补全,转换等

### 举一些 ES6 对 Number 数字类型做的常用升级优化

**优化部分**

ES6 在`Number`原型上新增了`isFinite()`, `isNaN()`方法，用来取代传统的全局`isFinite(),` `isNaN()`方法检测数值是否有限、是否是`NaN`。`ES5`的`isFinite()`, `isNaN()`方法都会先将非数值类型的参数转化为`Number`类型再做判断，这其实是不合理的，最造成 i`sNaN('NaN') === true`的奇怪行为`--'NaN'`是一个字符串，但是`isNaN`却说这就是`NaN`。而`Number.isFinite()`和`Number.isNaN()`则不会有此类问题(`Number.isNaN('NaN') === false`)。（`isFinite()`同上）

**升级部分**

`ES6`在`Math`对象上新增了`Math.cbrt()`，`trunc()`，`hypot()`等等较多的科学计数法运算方法，可以更加全面的进行立方根、求和立方根等等科学计算

### 举一些 ES6 对 Object 类型做的常用升级优化?(重要)

**优化部分**

对象属性变量式声明。`ES6`可以直接以变量形式声明对象属性或者方法，。比传统的键值对形式声明更加简洁，更加方便，语义更加清晰

```js
let [apple, orange] = ['red appe', 'yellow orange'];
let myFruits = { apple, orange }; // let myFruits = {apple: 'red appe', orange: 'yellow orange'};
```

尤其在对象解构赋值(见优化部分 b.)或者模块输出变量时，这种写法的好处体现的最为明显

```js
let { keys, values, entries } = Object;
let MyOwnMethods = { keys, values, entries }; // let MyOwnMethods = {keys: keys, values: values, entries: entries}
```

可以看到属性变量式声明属性看起来更加简洁明了。方法也可以采用简洁写法

```js
let es5Fun = {
  method: function() {},
};
let es6Fun = {
  method() {},
};
```

对象的解构赋值。 `ES6`对象也可以像数组解构赋值那样，进行变量的解构赋值

```js
let { apple, orange } = { apple: 'red appe', orange: 'yellow orange' };
```

对象的扩展运算符(`...`)。 ES6 对象的扩展运算符和数组扩展运算符用法本质上差别不大，毕竟数组也就是特殊的对象。对象的扩展运算符一个最常用也最好用的用处就在于可以轻松的取出一个目标对象内部全部或者部分的可遍历属性，从而进行对象的合并和分解

```js
let { apple, orange, ...otherFruits } = {
  apple: 'red apple',
  orange: 'yellow orange',
  grape: 'purple grape',
  peach: 'sweet peach',
};
// otherFruits  {grape: 'purple grape', peach: 'sweet peach'}
// 注意: 对象的扩展运算符用在解构赋值时，扩展运算符只能用在最有一个参数(otherFruits后面不能再跟其他参数)
let moreFruits = { watermelon: 'nice watermelon' };
let allFruits = { apple, orange, ...otherFruits, ...moreFruits };
```

`super` 关键字。`ES6`在`Class`类里新增了类似`this`的关键字`super`。同`this`总是指向当前函数所在的对象不同，`super`关键字总是指向当前函数所在对象的原型对象

**升级部分**

`ES6`在`Object`原型上新增了`is()`方法，做两个目标对象的相等比较，用来完善`'==='`方法。`'==='`方法中`NaN === NaN //false`其实是不合理的，`Object.is`修复了这个小`bug`。`(Object.is(NaN, NaN) // true)`

`ES6`在`Object`原型上新增了`assign()`方法，用于对象新增属性或者多个对象合并

```js
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
Object.assign(target, source1, source2);
target; // {a:1, b:2, c:3}
```

**注意**: `assign`合并的对象`target`只能合并`source1`、s`ource2`中的自身属性，并不会合并`source1`、`source2`中的继承属性，也不会合并不可枚举的属性，且无法正确复制 get 和 set 属性（会直接执行`get/set`函数，取`return`的值）

- `ES6`在`Object`原型上新增了`getOwnPropertyDescriptors()`方法，此方法增强了`ES5`中`getOwnPropertyDescriptor()`方法，可以获取指定对象所有自身属性的描述对象。结合`defineProperties()`方法，可以完美复制对象，包括复制`get`和`set`属性
- `ES6`在`Object`原型上新增了`getPrototypeOf()`和`setPrototypeOf()`方法，用来获取或设置当前对象的`prototype`对象。这个方法存在的意义在于，`ES5`中获取设置`prototype`对像是通过`__proto__`属性来实现的，然而`__proto__`属性并不是 ES 规范中的明文规定的属性，只是浏览器各大产商“私自”加上去的属性，只不过因为适用范围广而被默认使用了，再非浏览器环境中并不一定就可以使用，所以为了稳妥起见，获取或设置当前对象的`prototype`对象时，都应该采用 ES6 新增的标准用法
- `ES6`在`Object`原型上还新增了`Object.keys()`，`Object.values()`，`Object.entries()`方法，用来获取对象的所有键、所有值和所有键值对数组

### 举一些 ES6 对 Function 函数类型做的常用升级优化?

**优化部分**

箭头函数(核心)。箭头函数是 ES6 核心的升级项之一，箭头函数里没有自己的 this,这改变了以往 JS 函数中最让人难以理解的 this 运行机制。主要优化点

- 箭头函数内的 this 指向的是函数定义时所在的对象，而不是函数执行时所在的对象。ES5 函数里的 this 总是指向函数执行时所在的对象，这使得在很多情况下`this`的指向变得很难理解，尤其是非严格模式情况下，`this`有时候会指向全局对象，这甚至也可以归结为语言层面的 bug 之一。ES6 的箭头函数优化了这一点，它的内部没有自己的`this`,这也就导致了`this`总是指向上一层的`this`，如果上一层还是箭头函数，则继续向上指，直到指向到有自己`this`的函数为止，并作为自己的`this`
- 箭头函数不能用作构造函数，因为它没有自己的`this`，无法实例化
- 也是因为箭头函数没有自己的 this,所以箭头函数 内也不存在`arguments`对象。（可以用扩展运算符代替）
- 函数默认赋值。`ES6`之前，函数的形参是无法给默认值得，只能在函数内部通过变通方法实现。`ES6`以更简洁更明确的方式进行函数默认赋值

```js
function es6Fuc(x, y = 'default') {
  console.log(x, y);
}
es6Fuc(4); // 4, default
```

**升级部分**

ES6 新增了双冒号运算符，用来取代以往的`bind`，`call`,和`apply`。(浏览器暂不支持，`Babel`已经支持转码)

```js
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);
```

### 日常前端代码开发中，有哪些值得用 ES6 去改进的编程优化或者规范？

- 常用箭头函数来取代`var self = this`;的做法。
- 常用`let`取代`var`命令。
- 常用数组/对象的结构赋值来命名变量，结构更清晰，语义更明确，可读性更好。
- 在长字符串多变量组合场合，用模板字符串来取代字符串累加，能取得更好地效果和阅读体验。
- 用`Class`类取代传统的构造函数，来生成实例化对象。
- 在大型应用开发中，要保持`module`模块化开发思维，分清模块之间的关系，常用`import`、`export`方法。

### 数组的解构

`let [a, b, target, ...params] = process.argv`

### 模块化严格模式

ES6 的模块自动采用严格模式，不管你有没有在模块头部加上”use strict”;。所以在编写模块代码时，我们要遵循严格模式的规则，否则代码将会报错

### es6 多重继承实现

https://www.jianshu.com/p/779f48bb342d
不支持多重继承，如何实现比较好
