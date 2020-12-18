---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

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

### Class 本质

其实在 JS 中并不存在类，`class` 只是语法糖，本质还是函数。

```js
class Person {}
Person instanceof Function; // true
```

### ES5、ES6 和 ES2015 有什么区别?

`ES2015`特指在`2015`年发布的新一代`JS`语言标准，`ES6`泛指下一代 JS 语言标准，包含`ES2015`、`ES2016`、`ES2017`、`ES2018`等。现阶段在绝大部分场景下，`ES2015`默认等同`ES6`。`ES5`泛指上一代语言标准。`ES2015`可以理解为`ES5`和`ES6`的时间分界线

### ES6 的了解

新增模板字符串（为 JavaScript 提供了简单的字符串插值功能）、箭头函数（操作符左边为输入的参数，而右边则是进行的操作以及返回的值 Inputs=>outputs。）、for-of（用来遍历数据—例如数组中的值。）arguments 对象可被不定参数和默认参数完美代替。ES6 将 promise 对象纳入规范，提供了原生的 Promise 对象。增加了 let 和 const 命令，用来声明变量。增加了块级作用域。let 命令实际上就增加了块级作用域。ES6 规定，var 命令和 function 命令声明的全局变量，属于全局对象的属性；let 命令、const 命令、class 命令声明的全局变量，不属于全局对象的属性。。还有就是引入 module 模块的概念

### 简要介绍 ES6

ES6 在变量的声明和定义方面增加了 let、const 声明变量，有局部变量的概念，赋值中有比较吸引人的结构赋值，同时 ES6 对字符串、
数组、正则、对象、函数等拓展了一些方法，如字符串方面的模板字符串、函数方面的默认参数、对象方面属性的简洁表达方式，ES6 也
引入了新的数据类型 symbol，新的数据结构 set 和 map,symbol 可以通过 typeof 检测出来，为解决异步回调问题，引入了 promise 和
generator，还有最为吸引人了实现 Class 和模块，通过 Class 可以更好的面向对象编程，使用模块加载方便模块化编程，当然考虑到
浏览器兼容性，我们在实际开发中需要使用 babel 进行编译。

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

### this

不同情况的调用，`this`指向分别如何。顺带可以提一下 `es6` 中箭头函数没有 `this`, `arguments`, `super` 等，这些只依赖包含箭头函数最接近的函数

### 变量声明提升

`js` 代码在运行前都会进行 `AST` 解析，函数申明默认会提到当前作用域最前面，变量申明也会进行提升。但赋值不会得到提升。关于 `AST` 解析，这里也可以说是形成词法作用域的主要原因

### Iterator 是什么，有什么作用？(重要)

- `Iterator`是`ES6`中一个很重要概念，它并不是对象，也不是任何一种数据类型。因为`ES6`新增了`Set`、`Map`类型，他们和`Array`、`Object`类型很像，`Array`、`Object`都是可以遍历的，但是`Set`、`Map`都不能用 for 循环遍历，解决这个问题有两种方案，一种是为`Set`、`Map`单独新增一个用来遍历的`API`，另一种是为`Set`、`Map`、`Array`、`Object`新增一个统一的遍历`API`，显然，第二种更好，`ES6`也就顺其自然的需要一种设计标准，来统一所有可遍历类型的遍历方式。`Iterator`正是这样一种标准。或者说是一种规范理念
- 就好像`JavaScript`是`ECMAScript`标准的一种具体实现一样，`Iterator`标准的具体实现是`Iterator`遍历器。`Iterator`标准规定，所有部署了`key`值为`[Symbol.iterator]`，且`[Symbol.iterator]`的`value`是标准的`Iterator`接口函数(标准的`Iterator`接口函数: 该函数必须返回一个对象，且对象中包含`next`方法，且执行`next()`能返回包含`value/done`属性的`Iterator`对象)的对象，都称之为可遍历对象，`next()`后返回的`Iterator`对象也就是`Iterator`遍历器

```js
//obj就是可遍历的，因为它遵循了Iterator标准，且包含[Symbol.iterator]方法，方法函数也符合标准的Iterator接口规范。
//obj.[Symbol.iterator]() 就是Iterator遍历器
let obj = {
  data: ['hello', 'world'],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false,
          };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  },
};
```

`ES6`给`Set`、`Map`、`Array`、`String`都加上了`[Symbol.iterator]`方法，且`[Symbol.iterator]`方法函数也符合标准的`Iterator`接口规范，所以`Set`、`Map`、`Array`、`String`默认都是可以遍历的

```js
//Array
let array = ['red', 'green', 'blue'];
array[Symbol.iterator]() //Iterator遍历器
array[Symbol.iterator]().next() //{value: "red", done: false}

//String
let string = '1122334455';
string[Symbol.iterator]() //Iterator遍历器
string[Symbol.iterator]().next() //{value: "1", done: false}

//set
let set = new Set(['red', 'green', 'blue']);
set[Symbol.iterator]() //Iterator遍历器
set[Symbol.iterator]().next() //{value: "red", done: false}

//Map
let map = new Map();
let obj= {map: 'map'};
map.set(obj, 'mapValue');
map[Symbol.iterator]().next()  {value: Array(2), done: false}

```

### filter

```js
var b = [['A', 'B', 'C'], ['D', 'E'], ['F']];

// 获取二维数组铺平展开的下标值
spreadArrayIndex = array => {
  if (array instanceof Array && array[0] instanceof Array) {
    const indexResult = array.map((list, index) => {
      const target = list.filter((item, idx) => {
        if (item === value) {
          return idx;
        }
      });
      if (target.length !== 0) {
        return target[0];
      }
    });
    if (indexResult.length !== 0) {
      return indexResult[0];
    }
  }
};

// 获得二维数组的总长度
sumArrayNum = array => {
  // 二维数组
  if (array instanceof Array && array[0] instanceof Array) {
    const lengthArray = array.map(item => item.length);
    return lengthArray.reduce((total, num) => total + num);
  }
};

console.log();
var b = ['D', 'E'];
b.map((item, idx) => {
  console.log(item, idx, item === 'D');
  if (item === 'D') {
    console.log('D: ', idx);
    return idx;
  }
});

// 获取一维数组下标
var b = ['D', 'E'];
var idx = b.indexOf('D');
console.log(idx);

// 获取二维数组下标
var b = [['A', 'B', 'C'], ['D', 'E'], ['F']];
var target = b.filter(item => item.indexOf('D') > -1);
if (target && target[0]) {
  var idx1 = b.indexOf(target[0]);
  var idx2 = target[0].indexOf('D');
  console.log(idx1, idx2);
}
var total = 0;
for (var i = 0; i < idx1; i++) {
  total += b[i].length;
}
total += idx2 + 1;
console.log(total);

// 获取平铺之后二维数组下标
function spreadArrayIndex(array, value) {
  // var b = [['A', 'B', 'C'], ['D', 'E'], ['F']]
  if (array instanceof Array && array[0] instanceof Array) {
    var target = array.filter(item => item.indexOf(value) > -1);
    if (target && target[0]) {
      var idx1 = array.indexOf(target[0]);
      var idx2 = target[0].indexOf(value);
      // console.log(idx1, idx2)
    }
    var total = 0;
    for (var i = 0; i < idx1; i++) {
      total += array[i].length;
    }
    total += idx2 + 1;
    // console.log(total)
    return total;
  }
}

// 获取子元素是对象的二维数组平铺之后的下标
function spreadArrayObjectIndex(ArrayObject, value) {
  // var b = [[{ name: 'A' }, { name: 'B' }, { name: 'C' }], [{ name: 'D' }, { name: 'E' }], [{ name: 'F' }]]
  if (ArrayObject instanceof Array && ArrayObject[0] instanceof Array && ArrayObject[0][0] instanceof Object) {
    var targetX = ArrayObject.filter(xitem => {
      var result = xitem.map(yitem => yitem.name === value);
      return result.includes(true);
    });
    var idxX = ArrayObject.indexOf(targetX[0]);
    var targetY = targetX[0].filter(item => item.name === value);
    var idxY = targetX[0].indexOf(targetY[0]);

    // console.log(idxX, idxY)
    var total = 0;
    for (var i = 0; i < idxX; i++) {
      total += ArrayObject[i].length;
    }
    total += idxY;
    console.log(total);
    return total;
  }
}
```
