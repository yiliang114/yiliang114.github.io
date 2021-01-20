---
title: ES6
date: 2020-12-29
draft: true
---

### ES6 的新特性

类的支持，模块化，箭头操作符，let/const 块作用域，字符串模板，解构，参数默认值/不定参数/拓展参数, for-of 遍历, generator, Map/Set, Promise

### Class

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

子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类没有自己的`this`对象，而是继承父类的`this`对象，然后对其进行加工。如果不调用`super`方法，子类就得不到`this`对象。

ES6 的继承机制，实质是先创造父类的实例对象 this（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。

#### Class 本质

其实在 JS 中并不存在类，`class` 只是语法糖，本质还是函数。

#### 什么情况下会用到静态类成员？

静态类成员（属性或方法）不绑定到某个类的特定实例，不管哪个实例引用它，都具有相同的值。静态属性通常是配置变量，而静态方法通常是纯粹的实用函数，不依赖于实例的状态。

#### es6 class 的 new 实例和 es5 的 new 实例有什么区别？

在`ES6`中（和`ES5`相比），`class`的`new`实例有以下特点：

- `class`的构造参数必须是`new`来调用，不可以将其作为普通函数执行
- `es6` 的`class`不存在变量提升
- **最重要的是：es6 内部方法不可以枚举**。es5 的`prototype`上的方法可以枚举。

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

### 箭头函数与普通函数的区别？

- 简洁
- 普通 function 的声明在变量提升中是最高的，箭头函数没有函数提升
- 箭头函数没有属于自己的 this，arguments。
  - function 传统定义的函数，this 指向随着调用环境的改变而改变，而箭头 函数中的指向则是固定不变，一直指向定义环境的。箭头函数在定义之后，this 就不会发生改变了。
- 箭头函数不能作为构造函数，不能被 new，没有 prototype
- call 和 apply 方法只有参数，没有作用域

### Polyfill

polyfill 是“在旧版浏览器上复制标准 API 的 JavaScript 补充”,可以动态地加载 JavaScript 代码或库，在不支持这些标准 API 的浏览器中模拟它们。一旦对这些 API 的支持变成绝对大多数，则可以方便地去掉 polyfill，无需做任何额外工作。

### 私有方法和私有属性

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

### 模块化严格模式

ES6 的模块自动采用严格模式，不管你有没有在模块头部加上”use strict”;。所以在编写模块代码时，我们要遵循严格模式的规则，否则代码将会报错
