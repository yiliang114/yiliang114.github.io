---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### var,let,const 区别

- 全局申明的 var 变量会挂载在 window 上，而 let 和 const 不会
- var 声明变量存在变量提升，let 和 const 不会
- let、const 的作用范围是块级作用域，而 var 的作用范围是函数作用域
- 同一作用域下 let 和 const 不能声明同名变量，而 var 可以
- 同一作用域下在 let 和 const 声明前使用会存在暂时性死区
- const
  - 一旦声明必须赋值,不能使用 null 占位
  - 声明后不能再修改
  - 如果声明的是复合类型数据，可以修改其属性

let 和 const 都是对变量的声明，都有块级作用域的概念，不同的是 const 是对常量的声明，因此声明同时必须赋值，且之后不能更改，而 let 则可以。

用 var 声明的变量的作用域是它当前的执行上下文，它可以是嵌套的函数，也可以是声明在任何函数外的变量。let 和 const 是块级作用域，意味着它们只能在最近的一组花括号（function、if-else 代码块或 for 循环中）中访问。

```js
function foo() {
  // 所有变量在函数中都可访问
  var bar = 'bar';
  let baz = 'baz';
  const qux = 'qux';

  console.log(bar); // bar
  console.log(baz); // baz
  console.log(qux); // qux
}

console.log(bar); // ReferenceError: bar is not defined
console.log(baz); // ReferenceError: baz is not defined
console.log(qux); // ReferenceError: qux is not defined
if (true) {
  var bar = 'bar';
  let baz = 'baz';
  const qux = 'qux';
}

// 用 var 声明的变量在函数作用域上都可访问
console.log(bar); // bar
// let 和 const 定义的变量在它们被定义的语句块之外不可访问
console.log(baz); // ReferenceError: baz is not defined
console.log(qux); // ReferenceError: qux is not defined
var会使变量提升，这意味着变量可以在声明之前使用。let和const不会使变量提升，提前使用会报错。

console.log(foo); // undefined

var foo = 'foo';

console.log(baz); // ReferenceError: can't access lexical declaration 'baz' before initialization

let baz = 'baz';

console.log(bar); // ReferenceError: can't access lexical declaration 'bar' before initialization

const bar = 'bar';
// 用var重复声明不会报错，但let和const会。

var foo = 'foo';
var foo = 'bar';
console.log(foo); // "bar"

let baz = 'baz';
let baz = 'qux'; // Uncaught SyntaxError: Identifier 'baz' has already been declared
// let和const的区别在于：let允许多次赋值，而const只允许一次。

// 这样不会报错。
let foo = 'foo';
foo = 'bar';

// 这样会报错。
const baz = 'baz';
baz = 'qux';
```

### let 有什么用，有了 var 为什么还要用 let？

在`ES6`之前，声明变量只能用`var`，`var`方式声明变量其实是很不合理的，准确的说，是因为`ES5`里面没有块级作用域是很不合理的。没有块级作用域回来带很多难以理解的问题，比如`for`循环`var`变量泄露，变量覆盖等问题。`let`声明的变量拥有自己的块级作用域，且修复了`var`声明变量带来的变量提升问题。

### let，const

`let` 产生块级作用域（通常配合 `for` 循环或者 `{}` 进行使用产生块级作用域），`const` 申明的变量是常量（内存地址不变）

### var、let 及 const 区别

什么是提升？什么是暂时性死区？var、let 及 const 区别？

对于这个问题，我们应该先来了解提升（hoisting）这个概念。

```
console.log(a) // undefined
var a = 1
```

从上述代码中我们可以发现，虽然变量还没有被声明，但是我们却可以使用这个未被声明的变量，这种情况就叫做提升，并且提升的是声明。

对于这种情况，我们可以把代码这样来看

```
var a
console.log(a) // undefined
a = 1
```

接下来我们再来看一个例子

```
var a = 10
var a
console.log(a)
```

对于这个例子，如果你认为打印的值为 `undefined` 那么就错了，答案应该是 `10`，对于这种情况，我们这样来看代码

```
var a
var a
a = 10
console.log(a)
```

到这里为止，我们已经了解了 `var` 声明的变量会发生提升的情况，其实不仅变量会提升函数也会被提升。

```
console.log(a) // ƒ a() {}
function a() {}
var a = 1
```

对于上述代码，打印结果会是 `ƒ a() {}`，即使变量声明在函数之后，这也说明了函数会被提升，并且优先于变量提升。

说完了这些，想必大家也知道 `var` 存在的问题了，使用 `var` 声明的变量会被提升到作用域的顶部，接下来我们再来看 `let` 和 `const` 。

我们先来看一个例子：

```
var a = 1
let b = 1
const c = 1
console.log(window.b) // undefined
console.log(window. c) // undefined

function test(){
  console.log(a)
  let a
}
test()
```

首先在全局作用域下使用 `let` 和 `const` 声明变量，变量并不会被挂载到 `window` 上，这一点就和 `var` 声明有了区别。

再者当我们在声明 `a` 之前如果使用了 `a`，就会出现报错的情况

![img](./images/1672730318cfa540.jpg)

你可能会认为这里也出现了提升的情况，但是因为某些原因导致不能访问。

首先报错的原因是因为存在暂时性死区，我们不能在声明前就使用变量，这也是 `let` 和 `const` 优于 `var` 的一点。然后这里你认为的提升和 `var` 的提升是有区别的，虽然变量在编译的环节中被告知在这块作用域中可以访问，但是访问是受限制的。

那么到这里，想必大家也都明白 `var`、`let` 及 `const` 区别了，不知道你是否会有这么一个疑问，为什么要存在提升这个事情呢，其实提升存在的根本原因就是为了解决函数间互相调用的情况

```
function test1() {
    test2()
}
function test2() {
    test1()
}
test1()
```

假如不存在提升这个情况，那么就实现不了上述的代码，因为不可能存在 `test1` 在 `test2` 前面然后 `test2` 又在 `test1` 前面。

那么最后我们总结下这小节的内容：

- 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
- `var` 存在提升，我们能在声明之前使用。`let`、`const` 因为暂时性死区的原因，不能在声明前使用
- `var` 在全局作用域下声明变量会导致变量挂载在 `window` 上，其他两者不会
- `let` 和 `const` 作用基本一致，但是后者声明的变量不能再次赋值

### let const var 的区别？

| 声明方式 | 变量提升 | 作用域 | 初始值 | 重复定义                          |
| -------- | -------- | ------ | ------ | --------------------------------- |
| var      | 是       | 函数级 | 不必须 | 允许                              |
| let      | 否       | 块级   | 不必须 | 不允许                            |
| const    | 否       | 块级   | 必须   |  复合类型的变量可以，其他并不可以 |

> `const`对于复合类型的变量，变量名不指向数据，而是指向数据所在的地址。

Q：为什么 const 一旦声明常量，就必须立即初始化，不能留到以后再赋值？

Q： `const obj = {a: 1};`那么 a 还能赋值为其他值吗？为什么？

> A: </br>obj.a = 2;这是完全正确的。因为`const`对于复合类型的变量，变量名不指向数据，而是指向数据所在的地址。</br>
> 常量 obj 存储的是一个地址，指向一个对象。不可变的只是这个地址，即不能把 obj 指向另一个地址，但对象本身是可变的，所以依然可以为其添加新属性。

Q: 有什么办法可以让`const obj = {a: 1};`的值不可变？

> A: </br>如果真的想讲对象冻结，应该使用 `Object.freeze` 方法。
> `const foo = Object.freeze({}); foo.prop= 123;` // 不起作用

### 介绍一下 ES6 的暂时性死区和块级作用域

### 变量提升

var 会使变量提升，这意味着变量可以在声明之前使用。let 和 const 不会使变量提升，提前使用会报错。变量提升（hoisting）是用于解释代码中变量声明行为的术语。使用 var 关键字声明或初始化的变量，会将声明语句“提升”到当前作用域的顶部。但是，只有声明才会触发提升，赋值语句（如果有的话）将保持原样。

### 简述 arguments 的作用，在 es6 中更好的替代方案是什么?

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

使用箭头函数可以让我们不再用 that = this 或者 self = this 或者\_this = this 或者.bind(this)这样的代码。

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
