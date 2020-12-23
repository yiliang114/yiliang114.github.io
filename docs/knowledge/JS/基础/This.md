---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### this

`this` 是很多人会混淆的概念，但是其实他一点都不难，你只需要记住几个规则就可以了。

```js
function foo() {
  console.log(this.a);
}
var a = 1;
foo();

var obj = {
  a: 2,
  foo: foo,
};
obj.foo();

// 以上两者情况 `this` 只依赖于调用函数前的对象，优先级是第二个情况大于第一个情况

// 以下情况是优先级最高的，`this` 只会绑定在 `c` 上，不会被任何方式修改 `this` 指向
var c = new foo();
c.a = 3;
console.log(c.a);

// 还有种就是利用 call，apply，bind 改变 this，这个优先级仅次于 new
```

以上几种情况明白了，很多代码中的 `this` 应该就没什么问题了，下面让我们看看箭头函数中的 `this`

```js
function a() {
  return () => {
    return () => {
      console.log(this);
    };
  };
}
console.log(a()()());
```

箭头函数其实是没有 `this` 的，这个函数中的 `this` 只取决于他外面的第一个不是箭头函数的函数的 `this`。在这个例子中，因为调用 `a` 符合前面代码中的第一个情况，所以 `this` 是 `window`。并且 `this` 一旦绑定了上下文，就不会被任何代码改变。

### 如何确定 this 指向

如果要判断一个运行中函数的 this 绑定，就需要找到这个函数的直接调用位置。找到之后就可以顺序应用下面这四条规则来判断 this 的绑定对象。

1. 由 new 调用？绑定到新创建的对象。
2. 由 call 或者 apply （或者 bind ）调用？绑定到指定的对象。
3. 由上下文对象调用？绑定到那个上下文对象。
4. 默认：在严格模式下绑定到 undefined ，否则绑定到全局对象。

### 箭头函数中的 this 判断

箭头函数会继承外层函数调用的 this 绑定（无论 this 绑定到什么）。这其实和 ES6 之前代码中的 self = this 机制一样

箭头函数里面的 this 是继承它作用域父级的 this， 即声明箭头函数处的 this

```js
let a = {
  b: function() {
    console.log(this);
  },
  c: () => {
    console.log(this);
  },
};

a.b(); // a
a.c(); // window

let d = a.b;
d(); // window
```

### this 的指向有哪几种情况？

this 代表函数调用相关联的对象，通常也称之为执行上下文。

1. 作为函数直接调用，非严格模式下，this 指向 window，严格模式下，this 指向 undefined；
2. 在事件中，this 指向触发这个事件的对象
3. 作为某对象的方法调用，this 通常指向调用的对象。如果有 new 关键字，this 指向 new 出来的实例对象。
4. 使用 apply、call、bind 可以绑定 this 的指向。
5. 在构造函数中，this 指向新创建的对象
6. 箭头函数没有单独的 this 值，this 在箭头函数创建时确定，它与声明所在的上下文相同。

this 永远指向函数运行时所在的对象，而不是函数被创建时所在的对象。匿名函数或不处于任何对象中的函数指向 window

### this 的用法以及优先级

this 的四种用法：

1. 单纯的函数调用，这是默认绑定
2. 作为对象方法调用，这是隐式绑定
3. 通过 apply.call.bind 方法调用，这是显示绑定，(call，apply 传参方式不同，都是立即执行，bind 不是立即执行，而是返回一个函数)
4. 通过 new 绑定，最终指向的是 new 出来的对象

优先级： new>显示>隐式>默认
特例：箭头函数不使用 this 的四种标准规则，而是根据外层(函数或者全局)作用域来决定 this。箭头函数会继承外层函数调用的 this 绑定(无论 this 绑定到什么)。这 其实和 ES6 之前代码中的 self = this 机制一样

扩展：词法作用域和 this 的区别

- 词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的
- this 是在调用时被绑定的，this 指向什么，完全取决于函数的调用位置(关于 this 的指向问题，本文已经有说明),匿名函数或不处于任何对象中的函数指向 window

### 多个 this 规则出现时，this 最终指向哪里？

首先，new 的方式优先级最高，接下来是 bind 这些函数，然后是 obj.foo() 这种调用方式，最后是 foo 这种调用方式，同时，箭头函数的 this 一旦被绑定，就不会再被任何方式所改变。

### 如果对一个函数进行多次 bind，那么上下文会是什么呢？

```js
let a = {};
let fn = function() {
  console.log(this);
};
fn.bind().bind(a)(); // => ?
```

不管我们给函数 bind 几次，fn 中的 this 永远由第一次 bind 决定，所以结果永远是 window。

```js
// fn.bind().bind(a) 等于
let fn2 = function fn1() {
  return function() {
    return fn.apply();
  }.apply(a);
};
fn2();
```

### 对作用域上下文和 this 的理解，看下列代码：

```js
var User = {
  count: 1,

  getCount: function() {
    return this.count;
  },
};
console.log(User.getCount()); // what?
var func = User.getCount;
console.log(func()); // what?

// 1
// undefined
```

#### 如何确保 User 总是能访问到 func 的上下文，即正确返回 1 ?

正确的方法是使用 Function.prototype.bind。兼容各个浏览器完整代码如下：

```js
Function.prototype.bind =
  Function.prototype.bind ||
  function(context) {
    var self = this;

    return function() {
      return self.apply(context, arguments);
    };
  };

var func = User.getCount.bind(User);
console.log(func());
```

### This 下面代码中分别输出什么？

```js
// code 1
var length = 10;
function fn() {
  alert(this.length);
}
var obj = {
  length: 5,
  method: function() {
    fn();
  },
};
obj.method(); // ？

// code 2
var num = 100;
var obj = {
  num: 200,
  inner: {
    num: 300,
    print: function() {
      console.log(this.num);
    },
  },
};

obj.inner.print(); //？

var func = obj.inner.print;
func(); //？

obj.inner.print(); //？
(obj.inner.print = obj.inner.print)(); //？

// code 3
function foo() {
  console.log(this.a);
}
var obj2 = { a: 42, foo: foo };
var obj1 = { a: 2, obj2: obj2 };
obj1.obj2.foo(); // ？

var obj3 = { a: 2 };
foo.call(obj3); // ？

var bar = function() {
  foo.call(obj3);
};
bar(); // ？
setTimeout(bar, 100); // ？
bar.call(window); // ？

var obj4 = { a: 3, foo: foo };
obj2.foo(); // ？
obj4.foo(); // ？
obj2.foo.call(obj4); //？
obj4.foo.call(obj2); // ？

// code 4
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo,
};
var a = 'oops, global';
setTimeout(obj.foo, 100); // ？
obj.foo(); // ？

// code 5 (new绑定)
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // ？

var obj1 = { foo: foo };
var obj2 = {};

obj1.foo(2);
console.log(obj1.a); // ？

obj1.foo.call(obj2, 3);
console.log(obj2.a); // ？

var bar = new obj1.foo(4);
console.log(obj1.a); // ？
console.log(bar.a); // ？

// code 6

function foo() {
  console.log(this.a);
}

var a = 2;

foo.call(null); // ？
var bar = foo.bind(null);
bar(); // ？
foo.apply(undefined); // ？

// code 7 箭头函数

function foo() {
  return a => console.log(this.a);
}

var obj1 = { a: 2 };
var obj2 = { a: 3 };
var bar = foo.call(obj1);
bar.call(obj2); // ？
```

```js
function Foo() {
  getName = function() {
    console.log(1);
  };
  return this;
}
Foo.getName = function() {
  console.log(2);
};
Foo.prototype.getName = function() {
  console.log(3);
};
var getName = function() {
  console.log(4);
};

function getName() {
  console.log(5);
}

//请写出以下输出结果：
Foo.getName(); //-> 2    Foo对象上的getName() ，这里不会是3，因为只有Foo的实例对象才会是3，Foo上面是没有3的
getName(); //-> 4    window上的getName，console.log(5)的那个函数提升后，在console.log(4)的那里被重新赋值
Foo().getName(); //-> 1    在Foo函数中，getName是全局的getName，覆盖后输出 1
getName(); //-> 1    window中getName();
new Foo.getName(); //-> 2    Foo后面不带括号而直接 '.'，那么点的优先级会比new的高，所以把 Foo.getName 作为构造函数
new Foo().getName(); //-> 3    此时是Foo的实例，原型上会有输出3这个方法
```

```js
// code 1
var length = 10;
function fn() {
  alert(this.length);
}
var obj = {
  length: 5,
  method: function() {
    fn();
  }
};
obj.method(); // 10 隐式绑定的函数会丢失绑定对象，会应用默认绑定。`obj.method()`它实际上引用的是函数fn本身。

// code 2
var num = 100;
var obj = {
  num: 200,
  inner: {
    num: 300,
    print: function() {
      console.log(this.num);
    }
  }
};

obj.inner.print(); //300

var func = obj.inner.print;
func(); //100 默认绑定，绑定的是全局对象

obj.inner.print(); //300 隐式绑定，当函数引用有上下文对象时，隐式绑定规则会把函数调用的`this`绑定到这个上下文对象。

(obj.inner.print = obj.inner.print)(); //100 赋值对象返回的是一个函数，默认绑定，绑定的是全局对象

// code 3
function foo() {
  console.log(this.a);
}
var obj2 = { a: 42, foo: foo };
var obj1 = { a: 2, obj2: obj2 };
obj1.obj2.foo(); // 42 对象属性引用链中只有上一层或者说最后一层在调用位置中起作用。

var obj3 = { a: 2 };
foo.call(obj3); // 2

var bar = function() {
  foo.call(obj3);
};
bar(); // 2
setTimeout(bar, 100); // 2
bar.call(window); // 2 硬绑定的bar不可能在修改它的this

var obj4 = { a: 3, foo: foo };
obj2.foo(); // 42
obj4.foo(); // 3
obj2.foo.call(obj4); // 3
obj4.foo.call(obj2); // 42 显示绑定比隐式绑定优先级高

// code 4
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
var a = "oops, global"; // a是全局对象的属性
setTimeout(obj.foo, 100); // "oops, global"
obj.foo(); // 2

// code 5 (new绑定)
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // 2 new绑定

var obj1 = { foo: foo };
var obj2 = {};

obj1.foo(2);
console.log(obj1.a); // 2

obj1.foo.call(obj2, 3);
console.log(obj2.a); // 3

var bar = new obj1.foo(4);
console.log(obj1.a); // 2
console.log(bar.a); // 4 new绑定比隐式绑定优先级高

// code 6

function foo() {
  console.log(this.a);
}

var a = 2;

// 如果你把null或者undefined作为this的绑定对象传入call\apply\bind，这些值在调用的时候会被忽略，实际应用的是默认绑定规则。
foo.call(null); // 2
var bar = foo.bind(null);
bar(); // 2
foo.apply(undefined); // 2

// code 7 箭头函数

function foo() {
  return a => console.log(this.a);
}

var obj1 = { a: 2 };
var obj2 = { a: 3 };
var bar = foo.call(obj1);
bar.call(obj2); // 2 箭头函数是根据外层（函数或者全局）作用域来决定this。并且绑定后无法修改。

// code 8 独立函数调用

var a = 1;
function main() {
  alert(a); // undefined
  var a = 2;
  alert(this.a); // 1 这个地方的this一定指的全局对象，使用的是默认绑定规则
  alert(a); // 2
}
main();

//----------
function foo() {
  console.log(this.a);
}
var a = 2;
foo(); // 2

// code 9 网上改编自360的题目

window.val = 1;
var obj = {
  val: 2,
  dbl: function() {
    this.val *= 2;
    val *= 2;
    console.log(val);
    console.log(this.val);
  }
};
// 说出下面的输出结果
obj.dbl();  // 2 4 单独调用obj.dbl(); 其中this.val= 2； 而val 则是window.val => 第一个打印的结果是：1*2 ,第二个打印的结果是： 2*2
var func = obj.dbl;
func(); // 函数是引用，其中this.val === val === window.val === 2

输出的结果是： 2 4 8 8

// ----箭头函数中的this----
// code 10
var obj = {
   say: function () {
     setTimeout(() => {
       console.log(this)
     });
   }
 }
 obj.say(); // obj
 > 此时的 this继承自obj, 指的是定义它的对象obj, 而不是 window!

// code 11
var obj = {
say: function () {
  var f1 = () => {
    console.log(this); // obj
    setTimeout(() => {
      console.log(this); // obj
    })
  }
  f1();
  }
}
obj.say()
> 因为f1定义时所处的函数 中的 this是指的 obj, setTimeout中的箭头函数this继承自f1, 所以不管有多层嵌套,都是 obj

// code 12

var obj = {
say: function () {
  var f1 = function () {
    console.log(this); // window, f1调用时,没有宿主对象,默认是window
    setTimeout(() => {
      console.log(this); // window
    })
  };
  f1();
  }
}
obj.say()

// code 13
var obj = {
say: function () {
  'use strict';
  var f1 = function () {
  console.log(this); // undefined
  setTimeout(() => {
    console.log(this); // undefined
  })
  };
  f1();
 }
}
obj.say()

> 严格模式下,没有宿主调用的函数中的this是undefined!!!所以箭头函数中的也是undefined!
// ----箭头函数中的this----
```

```js
var name1 = 1;

function test() {
  let name1 = 'kin';
  let a = {
    name1: 'jack',
    fn: () => {
      var name1 = 'black';
      console.log(this.name1);
    },
  };
  return a;
}

test().fn(); // ?
```

答案： 输出 1

因为 fn 处绑定的是箭头函数，箭头函数并不创建 this，它只会从自己的作用域链的上一层继承 this。这里它的上一层是 test()，非严格模式下 test 中 this 值为 window。

- 如果在绑定 fn 的时候使用了 function，那么答案会是 'jack'
- 如果第一行的 var 改为了 let，那么答案会是 undefind， 因为 let 不会挂到 window 上

### 箭头函数的 this

### 执行题

谁调用函数，函数体中的 this 就指向谁

```js
var x = 1;

var bar = function() {
  console.log(this.x);
};

var obj1 = { x: 1 };
var obj2 = { x: 2 };
var obj3 = { x: 3 };

var fun = bar.bind(obj1);
fun();
fun = bar.bind(obj1).bind(obj2);
fun();
fun = bar
  .bind(obj1)
  .bind(obj2)
  .bind(obj3);
fun();
/*
1
1
1
*/
```
