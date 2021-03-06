---
title: this
date: '2020-11-02'
draft: true
---

### 以下代码执行结果是什么？

```js
var foo = 1,
  bar = 2,
  j,
  test;
test = function(j) {
  j = 5;
  var bar = 5;
  console.log(bar); // 5
  foo = 5;
};
test(10);
console.log(foo); // 5 改变的全局变量
console.log(bar); // 2 函数内部同名变量
console.log(j); // undefined 形参
```

```js
var j = [1, 2, 3];
test = function(j) {
  j.push(4);
};
test(j);
console.log(j); // [1,2,3,4] 数组和对象都是引用复制
```

```js
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
obj.method(); // 10 , 对 fn 间接引用，调用这个函数会应用默认的绑定规则
```

#### 继承

```js
function Foo() {
  this.value = 42;
}
Foo.prototype = {
  method: function() {
    return true;
  },
};
function Bar() {
  var value = 1;
  return {
    method: function() {
      return value;
    },
  };
}
// TODO:
Foo.prototype = new Bar();
console.log(Foo.prototype.constructor); // ƒ Object() { [native code] } 指向内置的 Object() 方法
console.log(Foo.prototype instanceof Bar); // false
var test = new Foo();
console.log(test instanceof Foo); // true
console.log(test instanceof Bar); // false
console.log(test.method()); // 1
```

> Foo.prototype 的 constructor 属性只是 Foo 函数在声明时的默认属性。如果你创建了一个新对象并替换了函数默认的.prototype 对象引用，**那么新对象并不会自动获得 constructor 属性**。（这也是原型继承时，需要重新赋值的原因。）
> Foo.prototype 没有 constructor 属性，所以他会委托[[Prototype]]链上的委托连顶端的 Object.prototype。这个对象有 constructor 属性，只想内置的 Object(...)函数。

#### 变量提升

```js
if (!('sina' in window)) {
  var sina = 1;
}
console.log('sina:', sina); // undefined
```

> 由于 JavaScript 在编译阶段会对声明进行提升，所以上述代码会做如下处理：

```js
var sina;
if (!('sina' in window)) {
  sina = 1;
}
console.log('sina:', sina);
```

>  声明被提升后，`window.sina`的值就是 undefined，但是`!("sina" in window)`这段代码的运行结果是`true`，所以`sina = 1;`就不会被执行，所以  本题目的输出结果是`undefined`。

#### 函数与变量同名

```js
function SINA() {
  return 1;
}
var SINA;
console.log(typeof SINA); // function
```

> 重复声明被忽略掉了，所以`var SINA`并没有起到作用，而是被忽略掉了。

### This 下面代码中分别输出什么？

```js
// 直接执行 Foo() 返回的是 window
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

// TODO:
//请写出以下输出结果：
Foo.getName(); //-> 2    Foo对象上的getName() ，这里不会是3，因为只有Foo的实例对象才会是3，Foo上面是没有3的
getName(); //-> 4    window上的getName，console.log(5)的那个函数提升后，在console.log(4)的那里被重新赋值
Foo().getName(); //-> 1    在Foo函数中，getName是全局的getName，覆盖后输出 1
getName(); //-> 1    window中getName();
new Foo.getName(); //-> 2    Foo后面不带括号而直接 '.'，那么点的优先级会比new的高，所以把 Foo.getName 作为构造函数
new Foo().getName(); //-> 3    此时是Foo的实例，原型上会有输出3这个方法
```

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo,
};
var a = 'oops, global'; // a是全局对象的属性
setTimeout(obj.foo, 100); // "oops, global"
obj.foo(); // 2

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

window.val = 1;
var obj = {
  val: 2,
  dbl: function() {
    this.val *= 2;
    val *= 2;
    console.log(val);
    console.log(this.val);
  },
};
// 说出下面的输出结果
obj.dbl(); // 2 4 单独调用obj.dbl(); 其中this.val= 2； 而val 则是window.val => 第一个打印的结果是：1*2 ,第二个打印的结果是： 2*2
var func = obj.dbl;
func(); // 函数是引用，其中this.val === val === window.val === 2

// 输出的结果是： 2 4 8 8

var obj = {
  say: function() {
    var f1 = function() {
      console.log(this); // window, f1调用时,没有宿主对象,默认是window
      setTimeout(() => {
        console.log(this); // window
      });
    };
    f1();
  },
};
obj.say();

// code 13
var obj = {
  say: function() {
    'use strict';
    var f1 = function() {
      console.log(this); // undefined
      setTimeout(() => {
        console.log(this); // undefined
      });
    };
    f1();
  },
};
obj.say();

// 严格模式下,没有宿主调用的函数中的this是undefined!!!所以箭头函数中的也是undefined!
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

test().fn(); // 1
//  如果在绑定 fn 的时候使用了 function，那么答案会是 'jack'
//  如果第一行的 var 改为了 let，那么答案会是 undefined， 因为 let 不会挂到 window 上
```

```js
let obj = {
  fun1: () => {
    console.log('111');
  },
  fun2: () => {
    this.fun1();
  },
};

// 从自己的作用域链的上一层继承 this。
// Uncaught TypeError: this.fun1 is not a function
obj.fun2();
```
