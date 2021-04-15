---
title: ES6
date: 2020-12-29
draft: true
---

## ES6 的新特性

Class，模块化，箭头操作符，let/const 块作用域，字符串模板，解构，参数默认值/不定参数/拓展参数, Map/Set, Promise

## var、let 和 const 区别

- var 声明的变量会挂载在 window 上，而 let 和 const 声明的变量不会
- var 定义的变量会提升， 而 let 和 const 定义的变量不会
- let 和 const 是 JS 中的块级作用域
- 同一作用域下 let 和 const 不允许重复声明(会抛出错误)
- let 和 const 定义的变量在定义语句之前，如果使用会抛出错误(形成了暂时性死区)，而 var 不会。
- const 声明一个只读的常量。一旦声明，常量的值就不能改变(如果声明是一个对象，那么不能改变的是对象的引用地址)

## Class

在 JS 中并不存在类，`class` 只是语法糖，本质还是函数。

原理：类本身指向构造函数，所有方法定义在`prototype`上，可看作构造函数的另一种写法(`Class === Class.prototype.constructor`)

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

子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类没有自己的`this`对象，而是继承父类的`this`对象，然后再用子类的构造函数修改 this。如果不调用`super`方法，子类就得不到`this`对象。

### class 构造函数执行的顺序

```js
class B {
  b = console.log('1');
  constructor() {
    console.log('2');
  }
}

class A extends B {
  a = console.log('3');
  constructor() {
    super();
    console.log('4');
  }
}

new A();
new B();

// 也就是说 constructor 前面的属性赋值比 constructor 构造函数执行的时间早
// 1234
```

### TODO: Class 的原理是什么 ？

### 继承

- ES5 实质：先创造子类实例的`this`，再将父类的属性方法添加到`this`上(`Parent.apply(this)`)
- ES6 实质：先将父类实例的属性方法加到`this`上(调用`super()`)，再用子类构造函数修改`this`

- 子类继承父类：子类使用父类的属性方法时，必须在构造函数中调用 super()，否则得不到父类的 this

- this 指向：解构实例属性或方法时会报错

  - 绑定 this：`this.method = this.method.bind(this)`
  - 箭头函数：`this.method = () => this.method()`

- 属性定义位置

  - 定义在构造函数中并使用`this`指向
  - 定义在`类最顶层`

```js
// 继承混合类
function CopyProperties(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      const desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
function MixClass(...mixins) {
  class Mix {
    constructor() {
      for (const mixin of mixins) {
        CopyProperties(this, new mixin());
      }
    }
  }
  for (const mixin of mixins) {
    CopyProperties(Mix, mixin);
    CopyProperties(Mix.prototype, mixin.prototype);
  }
  return Mix;
}
class Student extends MixClass(Person, Kid) {}
```

#### es6 class 的 new 实例和 es5 的 new 实例有什么区别？

在`ES6`中（和`ES5`相比），`class`的`new`实例有以下特点：

- `class`的构造参数必须是`new`来调用，不可以将其作为普通函数执行
- `es6` 的`class`不存在变量提升
- **最重要的是：es6 内部方法不可以枚举**。es5 的`prototype`上的方法可以枚举。

## 箭头函数与普通函数的区别？

- 简洁
- 普通 function 的声明在变量提升中是最高的，箭头函数没有函数提升
- 箭头函数没有属于自己的 this，arguments。
  - function 传统定义的函数，this 指向随着调用环境的改变而改变，而箭头 函数中的指向则是固定不变，一直指向定义环境的。箭头函数在定义之后，this 就不会发生改变了。
- 箭头函数不能作为构造函数，不能被 new，没有 prototype
- call 和 apply 方法只有参数，没有作用域

### 箭头函数与普通函数（function）的区别是什么？为什么

箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比区别：

1. 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象，它会从自己的作用域链的上一层继承 this（因此无法使用 apply / call / bind 进行绑定 this 值）
2. 箭头函数不可以使用 arguments 对象,，该对象在函数体内不存在，如果要用，可以用 rest 参数代替
3. 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数
4. 不绑定 super 和 new.target
5. 不可以使用 new 命令，因为

## 私有属性、方法

```js
const name = Symbol('name');
const print = Symbol('print');
class Person {
  constructor(age) {
    this[name] = 'Bruce';
    this.age = age;
  }
  [print]() {
    console.log(`${this[name]} is ${this.age} years old`);
  }
}
```

#### 现有的解决方案

私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。这是常见需求，有利于代码的封装，但 ES6 不提供，只能通过变通方法模拟实现。

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

## 介绍下 Set、Map 和 WeakMap 的比较

Set

1. 成员不能重复
2. 只有健值，没有键名，有点类似数组。
3. 可以遍历，方法有 add,delete,has

Map

1. 本质上是健值对的集合，类似集合
2. 可以遍历，方法很多，可以干跟各种数据格式转换

weakMap

1. 只接受对象作为键名（null 除外）
2. 键名所指向的对象，不计入垃圾回收机制
3. 不能遍历，方法同 get,set,has,delete

### object 和 Map 的区别 TODO:

## Symbol

`Symbol`是`ES6`引入的第七种原始数据类型, 所有 Symbol()生成的值都是独一无二的，可以从根本上解决对象属性太多导致属性名冲突覆盖的问题。

Symbol 类型的 key 是不能通过`Object.keys()`或者`for...in`来枚举的，但是也不是私有属性，它未被包含在对象自身的属性名集合(property names)之中。所以，利用该特性，我们可以把一些不需要对外操作和访问的属性使用 Symbol 来定义。也正因为这样一个特性，当使用`JSON.stringify()`将对象转换成 JSON 字符串的时候，Symbol 属性也会被排除在输出内容之外。

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

## 装饰器的原理

语法糖，实则调用 Object.defineProperty，可以添加、修改对象属性
