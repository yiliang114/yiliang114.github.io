---
title: ES6
date: 2020-12-29
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

### arguments 的作用，在 es6 中更好的替代方案

不定参数和默认参数

### 箭头函数与普通函数的区别？

- 简洁
- 普通 function 的声明在变量提升中是最高的，箭头函数没有函数提升
- 箭头函数没有属于自己的 this，arguments。
  - function 传统定义的函数，this 指向随着调用环境的改变而改变，而箭头 函数中的指向则是固定不变，一直指向定义环境的。箭头函数在定义之后，this 就不会发生改变了，无论用什么样子的方式调用它，this 都不会改变
- 箭头函数不能作为构造函数，不能被 new，没有 property
- call 和 apply 方法只有参数，没有作用域

### Polyfill

- polyfill 是“在旧版浏览器上复制标准 API 的 JavaScript 补充”,可以动态地加载 JavaScript 代码或库，在不支持这些标准 API 的浏览器中模拟它们
- 例如，geolocation（地理位置）polyfill 可以在 navigator 对象上添加全局的 geolocation 对象，还能添加 getCurrentPosition 函数以及“坐标”回调对象
- 所有这些都是 W3C 地理位置 API 定义的对象和函数。因为 polyfill 模拟标准 API，所以能够以一种面向所有浏览器未来的方式针对这些 API 进行开发
- 一旦对这些 API 的支持变成绝对大多数，则可以方便地去掉 polyfill，无需做任何额外工作。

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

### 什么情况下会用到静态类成员？

静态类成员（属性或方法）不绑定到某个类的特定实例，不管哪个实例引用它，都具有相同的值。静态属性通常是配置变量，而静态方法通常是纯粹的实用函数，不依赖于实例的状态。

### es6 class 的 new 实例和 es5 的 new 实例有什么区别？

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
