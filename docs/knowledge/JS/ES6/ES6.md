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
