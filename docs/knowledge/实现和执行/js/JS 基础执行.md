---
title: 类型转换
date: '2020-11-02'
draft: true
---

1. 下面代码的输出是什么？

```js
function sayHi() {
  console.log(name);
  console.log(age);
  var name = 'Lydia';
  let age = 21;
}

sayHi();

// undefined 和 ReferenceError
```

在函数中，我们首先使用 var 关键字声明了 name 变量。 这意味着变量在创建阶段会被提升（JavaScript 会在创建变量创建阶段为其分配内存空间），默认值为 undefined，直到我们实际执行到使用该变量的行。 我们还没有为 name 变量赋值，所以它仍然保持 undefined 的值。
使用 let 关键字（和 const）声明的变量也会存在变量提升，但与 var 不同，初始化没有被提升。 在我们声明（初始化）它们之前，它们是不可访问的。 这被称为“暂时死区”。 当我们在声明变量之前尝试访问变量时，JavaScript 会抛出一个 ReferenceError。

关于 let 的是否存在变量提升，我们何以用下面的例子来验证：

```js
let name = 'ConardLi';
{
  console.log(name); // Uncaught ReferenceError: name is not defined
  let name = 'code秘密花园';
}
```

复制代码 let 变量如果不存在变量提升，console.log(name)就会输出 ConardLi，结果却抛出了 ReferenceError，那么这很好的说明了，let 也存在变量提升，但是它存在一个“暂时死区”，在变量未初始化或赋值前不允许访问。
变量的赋值可以分为三个阶段：

1. 创建变量，在内存中开辟空间
1. 初始化变量，将变量初始化为 undefined
1. 真正赋值

关于 let、var 和 function：

let 的「创建」过程被提升了，但是初始化没有提升。
var 的「创建」和「初始化」都被提升了。
function 的「创建」「初始化」和「赋值」都被提升了。

2. 下面代码的输出是什么?

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}

// 3 3 3 and 0 1 2
```

由于 JavaScript 中的事件执行机制，setTimeout 函数真正被执行时，循环已经走完。 由于第一个循环中的变量 i 是使用 var 关键字声明的，因此该值是全局的。 在循环期间，我们每次使用一元运算符++都会将 i 的值增加 1。 因此在第一个例子中，当调用 setTimeout 函数时，i 已经被赋值为 3。
在第二个循环中，使用 let 关键字声明变量 i：使用 let（和 const）关键字声明的变量是具有块作用域的（块是{}之间的任何东西）。 在每次迭代期间，i 将被创建为一个新值，并且每个值都会存在于循环内的块级作用域。

3. 下面代码的输出是什么?

```js
const shape = {
  radius: 10,
  diameter() {
    return this.radius * 2;
  },
  perimeter: () => 2 * Math.PI * this.radius,
};

shape.diameter();
shape.perimeter();

// 20 and NaN
```

请注意，diameter 是普通函数，而 perimeter 是箭头函数。
对于箭头函数，this 关键字指向是它所在上下文（定义时的位置）的环境，与普通函数不同！ 这意味着当我们调用 perimeter 时，它不是指向 shape 对象，而是指其定义时的环境（window）。没有值 radius 属性，返回 undefined。

4. 下面代码的输出是什么?

```js
+true;
!'Lydia';

//  1 and false
```

一元加号会尝试将 boolean 类型转换为数字类型。 true 被转换为 1，false 被转换为 0。
字符串'Lydia'是一个真值。 我们实际上要问的是“这个真值是假的吗？”。 这会返回 false。

7. 下面代码的输出是什么?

```js
let a = 3;
let b = new Number(3);
let c = 3;

console.log(a == b);
console.log(a === b);
console.log(b === c);

// true false false
```

new Number（）是一个内置的函数构造函数。 虽然它看起来像一个数字，但它并不是一个真正的数字：它有一堆额外的功能，是一个对象。
当我们使用==运算符时，它只检查它是否具有相同的值。 他们都有 3 的值，所以它返回 true。

8. 下面代码的输出是什么?

```js
class Chameleon {
  static colorChange(newColor) {
    this.newColor = newColor;
  }

  constructor({ newColor = 'green' } = {}) {
    this.newColor = newColor;
  }
}

const freddie = new Chameleon({ newColor: 'purple' });
freddie.colorChange('orange');

// TypeError
```

colorChange 方法是静态的。 静态方法仅在创建它们的构造函数中存在，并且不能传递给任何子级。 由于 freddie 是一个子级对象，函数不会传递，所以在 freddie 实例上不存在 freddie 方法：抛出 TypeError。

9. 下面代码的输出是什么?

```js
let greeting;
greetign = {}; // Typo!
console.log(greetign);

// {}
```

控制台会输出空对象，因为我们刚刚在全局对象上创建了一个空对象！ 当我们错误地将 greeting 输入为 greetign 时，JS 解释器实际上在浏览器中将其视为 global.greetign = {}（或 window.greetign = {}）。
为了避免这种情况，我们可以使用“use strict”。 **这可以确保在将变量赋值之前必须声明变量**

11. 下面代码的输出是什么?

```js
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const member = new Person('Lydia', 'Hallie');
// 非原型链
Person.getFullName = () => this.firstName + this.lastName;

// member.getFullName === undefined
console.log(member.getFullName());

// TypeError
```

假设我们将此方法添加到构造函数本身。 也许不是每个 Person 实例都需要这种方法。这会浪费大量内存空间，因为它们仍然具有该属性，这占用了每个实例的内存空间。 相反，如果我们只将它添加到原型中，我们只需将它放在内存中的一个位置，但它们都可以访问它！

12. 下面代码的输出是什么?

```js
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const lydia = new Person('Lydia', 'Hallie');
const sarah = Person('Sarah', 'Smith');

console.log(lydia);
console.log(sarah);

// Person {firstName: "Lydia", lastName: "Hallie"} and undefined
```

对于 sarah，我们没有使用 new 关键字。 使用 new 时，它指的是我们创建的新空对象。 但是，如果你不添加 new 它指的是全局对象！
我们指定了 this.firstName 等于'Sarah 和 this.lastName 等于 Smith。 我们实际做的是定义 global.firstName ='Sarah'和 global.lastName ='Smith。 sarah 本身的返回值是 undefined。

12. 事件传播的三个阶段是: 捕获 > 目标 > 冒泡
    在捕获阶段，事件通过父元素向下传递到目标元素。 然后它到达目标元素，冒泡开始。

13) 除基础对象外，所有对象都有原型。

14. 下面代码的输出是什么?

```js
function sum(a, b) {
  return a + b;
}

sum(1, "2");

// "12"
// TODO: 这里为啥不是 “2” 转成 2 ，结果为 3 呢？
因为在javascript做运算时，会进行隐式转换。a为string类型，b为numer进行相加运算，首先会先将b转换为string类型，进行字符串的拼接运算。a+b运算之后得到的是一个string类型的10011，这时再跟c去做减法，显然字符串减number是行不通的。这时就会把string类型转换为number再去做减法运算。
```

16. 下面代码的输出是什么?

```js
function getPersonInfo(one, two, three) {
  console.log(one);
  console.log(two);
  console.log(three);
}

const person = 'Lydia';
const age = 21;

getPersonInfo`${person} is ${age} years old`;

// ["", " is ", " years old"] Lydia 21
```

如果使用标记的模板字符串，则第一个参数的值始终是字符串值的数组。 其余参数获取传递到模板字符串中的表达式的值！

20. 下面代码的输出是什么?

```js
function getAge() {
  'use strict';
  age = 21;
  console.log(age);
}

getAge();

// ReferenceError
```

<!-- TODO: -->

使用“use strict”，可以确保不会意外地声明全局变量。 我们从未声明变量 age，因为我们使用``use strict'，它会引发一个 ReferenceError。 如果我们不使用“use strict”，它就会起作用，因为属性 age`会被添加到全局对象中。

21. 下面代码的输出是什么?

```js
const sum = eval('10*10+5');

// 105
```

eval 会为字符串传递的代码求值。 如果它是一个表达式，就像在这种情况下一样，它会计算表达式。 表达式为 10 \* 10 + 5 计算得到 105。

24. 下面代码的输出是什么?

```js
const obj = { 1: 'a', 2: 'b', 3: 'c' };
const set = new Set([1, 2, 3, 4, 5]);

obj.hasOwnProperty('1');
obj.hasOwnProperty(1);
set.has('1');
set.has(1);

// true true false true
```

所有对象键（不包括 Symbols）都会被存储为字符串，即使你没有给定字符串类型的键。 这就是为什么 obj.hasOwnProperty（'1'）也返回 true。
上面的说法不使用于 Set。 在我们的 Set 中没有“1”：set.has（'1'）返回 false。 它有数字类型 1，set.has（1）返回 true。

25. 下面代码的输出是什么?

```js
const obj = { a: 'one', b: 'two', a: 'three' };
console.log(obj);

// { a: "three", b: "two" }
```

如果对象有两个具有相同名称的键，则将替前面的键。它仍将处于第一个位置，但具有最后指定的值。

28. 下面代码的输出是什么?

```js
String.prototype.giveLydiaPizza = () => {
  return 'Just give Lydia pizza already!';
};

const name = 'Lydia';

name.giveLydiaPizza();
('Just give Lydia pizza already!');
```

String 是一个内置的构造函数，我们可以为它添加属性。 我刚给它的原型添加了一个方法。 原始类型的字符串自动转换为字符串对象，由字符串原型函数生成。 因此，所有字符串（字符串对象）都可以访问该方法！

当使用基本类型的字符串调用 giveLydiaPizza 时，实际上发生了下面的过程：

1. 创建一个 String 的包装类型实例
1. 在实例上调用 substring 方法
1. 销毁实例

29) 下面代码的输出是什么?

```js
const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);

// 456
```

对象键自动转换为字符串。我们试图将一个对象设置为对象 a 的键，其值为 123。
但是，当对象自动转换为字符串化时，它变成了[Object object]。 所以我们在这里说的是 a["Object object"] = 123。 然后，我们可以尝试再次做同样的事情。 c 对象同样会发生隐式类型转换。那么，a["Object object"] = 456。
然后，我们打印 a[b]，它实际上是 a["Object object"]。 我们将其设置为 456，因此返回 456。

31. 单击按钮时 event.target 是什么?

```html
<div onclick="console.log('first div')">
  <div onclick="console.log('second div')">
    <button onclick="console.log('button')">
      Click!
    </button>
  </div>
</div>
```

A: div 外部
B: div 内部
C: button
D: 所有嵌套元素的数组

答案: C
导致事件的最深嵌套元素是事件的目标。 你可以通过 event.stopPropagation 停止冒泡

32. 单击下面的 html 片段打印的内容是什么?

```html
<div onclick="console.log('div')">
  <p onclick="console.log('p')">
    Click here!
  </p>
</div>
```

A: p div
B: div p
C: p
D: div

答案: A
如果我们单击 p，我们会看到两个日志：p 和 div。在事件传播期间，有三个阶段：捕获，目标和冒泡。 默认情况下，事件处理程序在冒泡阶段执行（除非您将 useCapture 设置为 true）。 它从最深的嵌套元素向外延伸。

35. 下面这些值哪些是假值?

```js
0;
new Number(0);
('');
(' ');
new Boolean(false);
undefined;
```

A: 0, '', undefined
B: 0, new Number(0), '', new Boolean(false), undefined
C: 0, '', new Boolean(false), undefined
D: 所有都是假值

答案: A
JavaScript 中只有 6 个假值：

- undefined
- null
- NaN
- 0
- '' (empty string)
- false

函数构造函数，如 new Number 和 new Boolean 都是真值。

38. 下面代码的输出是什么?

```js
(() => {
  let x, y;
  try {
    throw new Error();
  } catch (x) {
    // x 传参，块级作用域，不影响外部； 而 y 非传参，所以 catch 中修改 y 值将会对外部的变量进行修改
    (x = 1), (y = 2);
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();

//
```

A: 1 undefined 2
B: undefined undefined undefined
C: 1 1 2
D: 1 undefined undefined

答案

答案: A
catch 块接收参数 x。当我们传递参数时，这与变量的 x 不同。这个变量 x 是属于 catch 作用域的。
之后，我们将这个块级作用域的变量设置为 1，并设置变量 y 的值。 现在，我们打印块级作用域的变量 x，它等于 1。
在 catch 块之外，x 仍然是 undefined，而 y 是 2。 当我们想在 catch 块之外的 console.log(x)时，它返回 undefined，而 y 返回 2。

- 请写出 console.log 中的内容
  ```
    var msg = 'hello';//顶级作用域window下有个变量msg
    function great(name, attr) {
    var name = 'david';
    var greating = msg + name + '!';
    var msg = '你好';
    for (var i = 0; i < 10; i++) {
        var next = msg + '你的id是' + i * 2 + i;
    }
    console.log(arguments[0]);
    console.log(arguments[1]);
    console.log(greating);
    console.log(next);
    }
    great('Tom')
  ```

### 如何判断当前脚本运行在浏览器还是 node 环境中？（阿里）

- this === window ? 'browser' : 'node';
- 通过判断 Global 对象是否为 window，如果不为 window，当前脚本没有运行在浏览器中

**使用 JS 实现获取文件扩展名？**

```
function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

```

### 请指出 JavaScript 宿主对象 (host objects) 和原生对象 (native objects) 的区别？

原生对象： Object、Function、Array、String、Boolean、Number、Date、RegExp、Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError
所有非本地对象都是宿主对象（host object），所有的 BOM 和 DOM 对象都是宿主对象。自己定义的对象 oPerson 就是宿主对象。

### 函数表达式和函数声明

```
// 函数声明
function funDeclaration(type){
    return type==="Declaration";
}
    // 函数表达式
var funExpression = function(type){
    return type==="Expression";
}
```

### 判断数组有哪些方法，能够 100%准确吗，100%准确的方法是哪个？

Object.prototype.toString.call() // [object Array]

### 实现数组的随机排序，取反，拼接（怎么更加有效率、简洁）
