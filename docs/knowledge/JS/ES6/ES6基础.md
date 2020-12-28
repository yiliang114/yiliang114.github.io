---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 简要介绍 ES6

`ES2015`特指在`2015`年发布的新一代`JS`语言标准，`ES6`泛指下一代 JS 语言标准，包含`ES2015`、`ES2016`、`ES2017`、`ES2018`等。现阶段在绝大部分场景下，`ES2015`默认等同`ES6`。`ES5`泛指上一代语言标准。`ES2015`可以理解为`ES5`和`ES6`的时间分界线

ES6 在变量的声明和定义方面增加了 let、const 声明变量，有局部变量的概念，赋值中有比较吸引人的结构赋值，同时 ES6 对字符串、数组、正则、对象、函数等拓展了一些方法，如字符串方面的模板字符串、函数方面的默认参数、对象方面属性的简洁表达方式，ES6 也引入了新的数据类型 symbol，新的数据结构 set 和 map,symbol 可以通过 typeof 检测出来，为解决异步回调问题，引入了 promise 和 generator，还有最为吸引人了实现 Class 和模块，通过 Class 可以更好的面向对象编程，使用模块加载方便模块化编程，当然考虑到浏览器兼容性，我们在实际开发中需要使用 babel 进行编译。

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

### 模块化严格模式

ES6 的模块自动采用严格模式，不管你有没有在模块头部加上”use strict”;。所以在编写模块代码时，我们要遵循严格模式的规则，否则代码将会报错

### 日常前端代码开发中，有哪些值得用 ES6 去改进的编程优化或者规范？

- 常用箭头函数来取代`var self = this`;的做法。
- 常用`let`取代`var`命令。
- 常用数组/对象的结构赋值来命名变量，结构更清晰，语义更明确，可读性更好。
- 在长字符串多变量组合场合，用模板字符串来取代字符串累加，能取得更好地效果和阅读体验。
- 用`Class`类取代传统的构造函数，来生成实例化对象。
- 在大型应用开发中，要保持`module`模块化开发思维，分清模块之间的关系，常用`import`、`export`方法。

### es6 多重继承实现

https://www.jianshu.com/p/779f48bb342d

不支持多重继承，如何实现比较好

### 举一些 ES6 对 Object 类型做的常用升级优化?

- `ES6`在`Object`原型上新增了`getOwnPropertyDescriptors()`方法，此方法增强了`ES5`中`getOwnPropertyDescriptor()`方法，可以获取指定对象所有自身属性的描述对象。结合`defineProperties()`方法，可以完美复制对象，包括复制`get`和`set`属性
- `ES6`在`Object`原型上新增了`getPrototypeOf()`和`setPrototypeOf()`方法，用来获取或设置当前对象的`prototype`对象。这个方法存在的意义在于，`ES5`中获取设置`prototype`对像是通过`__proto__`属性来实现的，然而`__proto__`属性并不是 ES 规范中的明文规定的属性，只是浏览器各大产商“私自”加上去的属性，只不过因为适用范围广而被默认使用了，再非浏览器环境中并不一定就可以使用，所以为了稳妥起见，获取或设置当前对象的`prototype`对象时，都应该采用 ES6 新增的标准用法
- `ES6`在`Object`原型上还新增了`Object.keys()`，`Object.values()`，`Object.entries()`方法，用来获取对象的所有键、所有值和所有键值对数组
