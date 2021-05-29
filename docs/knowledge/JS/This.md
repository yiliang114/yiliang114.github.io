---
title: This
date: 2020-10-26
draft: true
---

## This

### 用法和优先级

1. 单纯的函数调用，这是默认绑定
2. 作为对象方法调用，这是隐式绑定
3. 通过 apply, call, bind 方法调用，这是显示绑定
4. 通过 new 绑定，最终指向的是 new 出来的对象

优先级： new > 显示 > 隐式 > 默认

### 值的判断

```js
let a = {
  b: function() {
    console.log(this);
  },
  c: () => {
    console.log(this);
  },
};

// 普通 function 函数谁调用，this 的值就指向谁
a.b(); // a
// 如果是箭头函数，继承外层函数的 this 即声明箭头函数处的 this
a.c(); // window

let d = a.b;
d(); // window
```

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

箭头函数其实是没有 `this` 的，这个函数中的 `this` 只取决于他外面的第一个不是箭头函数的函数的 `this`。

## bind, call, bind

三个函数的作用都是用来动态改变当前函数的 this 指针， 并且三个函数的第一个参数都是新的 this 指向值。

**区别**:

1. call 和 apply 都是立即执行，执行过程中遇到 this 就改变为指向的值，bind 不是立即执行，而是返回一个函数，需要手动执行。
2. apply 的参数是一个数组，call 接受逗号分隔的参数作为后面的参数，而 bind 只有一个 this 参数。

```js
Foo.call(this, name);
Foo.apply(this, [name]);
Foo.bind(this)(name);
```

一个简单的记忆方法是，从`call`中的 C 联想到逗号分隔（comma-separated），从`apply`中的 A 联想到数组（array）。

### 如果对一个函数进行多次 bind，那么上下文会是什么呢？

```js
let a = {};
let fn = function() {
  console.log(this);
};
fn.bind().bind(a)(); // => ?
```

不管我们给函数 bind 几次，fn 中的 this 永远由第一次 bind 决定，所以结果永远是 window。

## this 和作用域

```js
pi = 0;
radius = 1;
function circum(radius) {
  console.log(arguments[0]); // 2
  radius = 3;
  pi = 3.14;
  console.log(2 * pi * radius); // 18.84
  // 函数内部修改形参，是个引用？
  console.log(arguments[0]); // 3
}
circum(2);
console.log(pi); // 3.14
console.log(radius); // 1
// 函数内修改了 radius 修改的是形式参数，修改的 pi 是全局的 window or global 中的 pi
```

```js
var pi = 0;
var radius = 1;
function circum(radius) {
  radius = 3;
  pi = 3.14;
  console.log(2 * pi * radius); // 18.84
  console.log(arguments[0]); // 3
}
circum(radius);
console.log(pi); // 3.14
console.log(radius); // 1
```

```js
function foo(a, b) {
  arguments[0] = 9;
  arguments[1] = 99;
  console.log(a, b); //9, 99
}
foo(1, 10);

function foo(a, b) {
  a = 8;
  b = 88;
  console.log(arguments[0], arguments[1]); //8, 88
}
foo(1, 10);

// ES6 的默认函数不会改变 arguments 类数组对象值
function foo(a = 1, b = 10) {
  arguments[0] = 9;
  arguments[1] = 99;
  console.log(a, b); //1, 10
}
foo();

// 实例
function f2(a) {
  console.log(a);
  var a;
  console.log(a);
  console.log(arguments[0]);
}
f2(10);

// 经过变量提升后：
function f2(a) {
  var a;
  console.log(a);
  console.log(a);
  console.log(arguments[0]);
}
f2(10);

// var a 会被归纳，由于 a 已经有值，故不会变为 undefined
```

```js
var a = {};
var b = { name: 'ZS' };
var c = {};
c[a] = 'demo1';
c[b] = 'demo2';

console.log(c[a]); // demo2
console.log(c); // Object {[object Object]: "demo2"}
```

c[a]、c[b]隐式的将对象 a，b 使用了 toString（）方法进行了转换，然后再对属性赋值。
即：Object.prototype.toString.call(a) ==> [object Object]
因此，c = { [object Object]: 'demo1'} ==> c = {[object Object]: 'demo2' }

```js
var array1 = Array(3);
array1[0] = 2;
var result = array1.map(elem => '1');

// ['1', empty * 2]
```

```js
var setPerson = function(person) {
  person.name = 'kevin';
  person = { name: 'Nick' };
  console.log(person.name); // Nick
  person.name = 'Jay';
  console.log(person.name); // Jay
};
var person = { name: 'Alan' };
setPerson(person);
console.log(person.name); // Kevin
```

```js
var execFunc = () => console.log('a');
setTimeout(execFunc, 0);
console.log('000');
execFunc = () => console.log('b');

// '000', 'a'
```

`window.setTimeout(hello(userName),3000);`
这将使 hello 函数立即执行，并将'返回值'作为调用句柄传递给 setTimeout 函数

方法 1：
使用'字符串形式'可以达到想要的结果:
`window.setTimeout("hello(userName)",3000);`
但是，此处的 username 变量必须处于全局环境下

```js
// 方法2：
function hello(_name) {
  alert('hello,' + _name);
}
// 创建一个函数，用于返回一个无参数函数
function _hello(_name) {
  return function() {
    hello(_name);
  };
}
window.setTimeout(_hello(userName), 3000);
// 使用_hello(userName)来返回一个不带参数的函数句柄，从而实现了参数传递的功能
```

```js
for (var i = { j: 0 }; i.j < 5; i.j++) {
  (function(i) {
    setTimeout(function() {
      console.log(i.j);
    }, 0);
  })(JSON.parse(JSON.stringify(i)));
}

// 0, 1, 2, 3, 4

for (var i = { j: 0 }; i.j < 5; i.j++) {
  (function(i) {
    setTimeout(function() {
      console.log(i.j);
    }, 0);
  })(i);
}

// 5, 5, 5, 5, 5
```

```js
var name = 'Tom';
(function() {
  if (typeof name == 'undefined') {
    var name = 'Jack';
    console.log('Goodbye ' + name);
  } else {
    console.log('Hello ' + name);
  }
})();
// Goodbye Jack
```

```js
var name = 'Tom';
(function() {
  if (typeof name == 'undefined') {
    name = 'Jack';
    console.log('Goodbye ' + name);
  } else {
    console.log('Hello ' + name);
  }
})();
```

```js
// 接下来我们可以看到当调用 foo() 时，this.a 被解析成了全局变量 a。为什么?因为在本 例中，函数调用时应用了 this 的默认绑定，因此 this 指向全局对象。
// bar() 调用使用严格模式(strict mode)，那么全局对象将无法使用默认绑定，因此 this 会绑定 到 undefined

function foo() {
  'use strict';
  console.log(this.a);
}

function bar() {
  console.log(this.a);
}

var a = "this is a 'a'";

bar(); // "this is a 'a'"
foo(); // "TypeError: Cannot read property 'a' of undefined
```

```js
function passWordMngr() {
  var password = '12345678';
  this.userName = 'John';
  return {
    pwd: password,
  };
}
// Block End
var userInfo = passWordMngr();
console.log(userInfo.pwd);
console.log(userInfo.userName);
// 12345678 undefined
```

```js
var employeeId = 'aq123';
function Employee() {
  this.employeeId = 'bq1uy';
}
console.log(Employee.employeeId);
// undefined
```

```js
var employeeId = 'aq123';

function Employee() {
  this.employeeId = 'bq1uy';
}
console.log(new Employee().employeeId);
Employee.prototype.employeeId = 'kj182';
Employee.prototype.JobId = '1BJKSJ';
console.log(new Employee().JobId);
console.log(new Employee().employeeId);
// bq1uy 1BJKSJ bq1uy
```

```js
var employeeId = 'aq123';
(function Employee() {
  try {
    throw 'foo123';
  } catch (employeeId) {
    console.log(employeeId);
  }
  console.log(employeeId);
})();
// foo123 aq123
```

```js
// Call, Apply, Bind
(function() {
  var greet = 'Hello World';
  var toGreet = [].filter.call(greet, function(element, index) {
    return index > 5;
  });
  console.log(toGreet);
})();
// [ 'W', 'o', 'r', 'l', 'd' ]
```

```js
var output = (function(x) {
  delete x;
  return x;
})(0);

console.log(output);
// 0
// delete 只能用于删除对象的属性
```

```js
var x = 1;
var output = (function() {
  delete x;
  return x;
})();

console.log(output);
// 1
```

```js
var x = { foo: 1 };
var output = (function() {
  delete x.foo;
  return x.foo;
})();

console.log(output);
// undefined
```

```js
var Employee = {
  company: 'xyz',
};
var emp1 = Object.create(Employee);
delete emp1.company;
console.log(emp1.company);
// xyz
// 会去拿原型链上的属性
```

```js
var strA = 'hi there';
var strB = strA;
strB = 'bye there!';
console.log(strA);
// hi there
```

```js
var objA = { prop1: 42 };
var objB = objA;
objB.prop1 = 90;
console.log(objA);
// {prop1: 90}
```

```js
var objA = { prop1: 42 };
var objB = objA;
objB = {};
console.log(objA);
// {prop1: 42}
```

```js
var arrA = [0, 1, 2, 3, 4, 5];
var arrB = arrA;
arrB[0] = 42;
console.log(arrA);
// [42,1,2,3,4,5]
```

```js
var arrA = [0, 1, 2, 3, 4, 5];
var arrB = arrA.slice();
arrB[0] = 42;
console.log(arrA);
// [0,1,2,3,4,5]
```

```js
var arrA = [{ prop1: 'value of array A!!' }, { someProp: 'also value of array A!' }, 3, 4, 5];
var arrB = arrA;
arrB[0].prop1 = 42;
console.log(arrA);
// [{prop1: 42}, {someProp: "also value of array A!"}, 3,4,5]
```

```js
var arrA = [{ prop1: 'value of array A!!' }, { someProp: 'also value of array A!' }, 3, 4, 5];
var arrB = arrA.slice();
arrB[0].prop1 = 42;
arrB[3] = 20;
console.log(arrA);

// [{prop1: 42}, {someProp: "also value of array A!"}, 3,4,5]
function slice(arr) {
  var result = [];
  for (i = 0; i < arr.length; i++) {
    result.push(arr[i]);
  }
  return result;
}
```

```js
var trees = ['xyz', 'xxxx', 'test', 'ryan', 'apple'];
delete trees[3];
console.log(trees.length);
// 5
```

```js
var bar = true;
console.log(bar + 0);
console.log(bar + 'xyz');
console.log(bar + true);
console.log(bar + false);
// 1, "truexyz", 2, 1
```

```js
var z = 1,
  y = (z = typeof y);
console.log(y);
// undefined
```

```js
// NFE (Named Function Expression)
var foo = function bar() {
  return 12;
};
typeof bar();
// Reference Error
```

```js
bar();
(function abc() {
  console.log('something');
})();
function bar() {
  console.log('bar got called');
}
// bar got called
// something
```

```js
var salary = '1000$';

(function() {
  console.log('Original salary was ' + salary);

  var salary = '5000$';

  console.log('My New Salary ' + salary);
})();
// undefined, 5000$
```

```js
function User(name) {
  this.name = name || 'JsGeeks';
}

var person = (new User('xyz')['location'] = 'USA');
console.log(person);
// USA
```

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

#### 函数与变量同名

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

//请写出以下输出结果：
Foo.getName(); //-> 2    Foo对象上的getName() ，这里不会是3，因为只有Foo的实例对象才会是3，Foo上面是没有3的
// 变量声明式函数优先级更高
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

## 其他

#### this 有几种使用场景

this 的四种用法：

1. 单纯的函数调用，这是默认绑定
2. 作为对象方法调用，这是隐式绑定
3. 通过 apply.call.bind 方法调用，这是显示绑定，(call，apply 传参方式不同，都是立即执行，bind 不是立即执行，而是返回一个函数)
4. 通过 new 绑定，最终指向的是 new 出来的对象

**es5 普通函数**：

- 函数被直接调用，上下文一定是`window`
- 函数作为对象属性被调用，例如：`obj.foo()`，上下文就是对象本身`obj`
- 通过`new`调用，`this`绑定在返回的实例上

**es6 箭头函数**： 它本身没有`this`，会沿着作用域向上寻找，直到`global` / `window`。

```js
function run() {
  const inner = () => {
    return () => {
      console.log(this.a);
    };
  };

  inner()();
}

run.bind({ a: 1 })(); // Output: 1
```

**bind 绑定上下文返回的新函数**：就是被第一个 bind 绑定的上下文，而且 bind 对“箭头函数”无效。

优先级： new > 显示 > 隐式 > 默认

#### apply、call 和 bind 的区别

1. bind 返回的是一个函数，需要再次手动执行。
2. call 第二个参数以后的参数都跟调用的函数意义对应，而使用 apply 的时候，函数的参数都是放在数组中的，作为第二个参数。
