---
title: this
date: '2020-11-02'
draft: true
---

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

## 变量提升

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

```js
let name = 'ConardLi';
{
  console.log(name); // Uncaught ReferenceError: name is not defined
  // Uncaught ReferenceError: Cannot access 'name' before initialization
  let name = 'code秘密花园';
}
```

```js
var employeeId = 'abc123';

function foo() {
  employeeId = '123bcd';
  return;

  function employeeId() {}
}
foo();
console.log(employeeId);
// abc123
```

```js
var employeeId = 'abc123';

function foo() {
  employeeId();
  return;

  function employeeId() {
    console.log(typeof employeeId);
  }
}
foo();
// function
```

```js
// TODO:
function foo() {
  employeeId();
  var product = 'Car';
  return;

  function employeeId() {
    console.log(product);
  }
}
foo();
// undefined
```

```js
// TODO:
(function() {
  var objA = Object.create({
    foo: 'foo',
  });
  var objB = objA;
  objB.foo = 'bar';

  delete objA.foo;
  console.log(objA.foo);
  console.log(objB.foo);
})();
// foo foo
```

```js
(function() {
  var objA = {
    foo: 'foo',
  };
  var objB = objA;
  objB.foo = 'bar';

  delete objA.foo;
  console.log(objA.foo);
  console.log(objB.foo);
})();
// undefined undefined
```

```js
(function() {
  var array = new Array('100');
  console.log(array);
  console.log(array.length);
})();
// ["100"] 1
```

```js
(function() {
  var array1 = [];
  var array2 = new Array(100);
  var array3 = new Array(['1', 2, '3', 4, 5.6]);
  console.log(array1);
  console.log(array2);
  console.log(array3);
  console.log(array3.length);
})();
// [] [] [Array[5]] 1
```

```js
(function() {
  var array = new Array('a', 'b', 'c', 'd', 'e');
  array[10] = 'f';
  delete array[10];
  console.log(array.length);
})();
// 11
```

```js
function funcA() {
  console.log('funcA ', this);
  (function innerFuncA1() {
    console.log('innerFunc1', this);
    (function innerFunA11() {
      console.log('innerFunA11', this);
    })();
  })();
}

console.log(funcA());
// funcA  Window {...}
// innerFunc1 Window {...}
// innerFunA11 Window {...}
```

```js
var obj = {
  message: 'Hello',
  innerMessage: !(function() {
    console.log(this.message);
  })(),
};

console.log(obj.innerMessage);
// undefined
// true
```

```js
var obj = {
  message: 'Hello',
  innerMessage: function() {
    return this.message;
  },
};

console.log(obj.innerMessage());
// Hello
```

```js
var obj = {
  message: 'Hello',
  innerMessage: function() {
    // 直接是 window 调用的该函数
    (function() {
      console.log(this.message);
    })();
  },
};
console.log(obj.innerMessage());
// undefined
```

```js
var obj = {
  message: 'Hello',
  innerMessage: function() {
    var self = this;
    (function() {
      console.log(self.message);
    })();
  },
};
console.log(obj.innerMessage());
// Hello
```

```js
function myFunc(param1, param2) {
  console.log(myFunc.length);
}
console.log(myFunc());
console.log(myFunc('a', 'b'));
console.log(myFunc('a', 'b', 'c', 'd'));
// 2 2 2
```

```js
function myFunc() {
  console.log(arguments.length);
}
console.log(myFunc());
console.log(myFunc('a', 'b'));
console.log(myFunc('a', 'b', 'c', 'd'));
// 0 2 4
```

```js
function Person(name, age) {
  this.name = name || 'John';
  this.age = age || 24;
  this.displayName = function() {
    console.log(this.name);
  };
}

Person.name = 'John';
Person.displayName = function() {
  // this 指向 Person 对象（函数）的函数名： Person
  console.log(this.name);
};

var person1 = new Person('John');
person1.displayName();
Person.displayName();

// John Person
```

### 变量与函数同名的情况

```js
var a = 10;
(function() {
  console.log(a);
  a = 5;
  console.log(window.a);
  var a = 20;
  console.log(a);
})();
// undefined 10 20
```

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})(); //[Function b]
```

```js
var b = 10;
(function b() {
  'use strict';
  b = 20;
  console.log(b);
})(); // "Uncaught TypeError: Assignment to constant variable."
```

函数表达式与函数声明不同，函数名只在该函数内部有效，并且此绑定是常量绑定。
在严格模式下 b 函数相当于常量，无法进行重新赋值，在非严格模式下函数声明优先变量声明

#### 简单改造下面的代码，使之分别打印 10 和 20

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

- 打印 20

```js
var b = 10;
(function b() {
  var b = 20;
  console.log(b);
})(); // 20 在自执行函数中重新定义一个变量，
```

```js
var b = 10;
(function a() {
  b = 20;
  console.log(b);
})();
```

```js
var b = 10;
(function() {
  b = 20;
  console.log(b);
})();
```

- 打印 10

```js
var b = 10;
(function b() {
  b = 20;
  console.log(window.b);
})();
```

在自执行函数中访问 window，window 中的 b 值为 10 2.

```js
var b = 10;
(function() {
  console.log(b);
  b = 20;
})();
```

```js
var b = 10;
(function b(b) {
  console.log(b);
  b = 20;
})(b);
```

### 作用域

```js
var foo = 'Hello';
(function() {
  var bar = ' World';
  alert(foo + bar);
})();
alert(foo + bar);

// "Hello World" 和 ReferenceError: bar is not defined
```

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}

// 3 3 3 and 0 1 2
```

```js
function getAge() {
  'use strict';
  age = 21;
  console.log(age);
}

getAge();

// ReferenceError
```

### 构造函数

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

```js
String.prototype.giveLydiaPizza = () => {
  return 'Just give Lydia pizza already!';
};

const name = 'Lydia';

name.giveLydiaPizza();
('Just give Lydia pizza already!');
```

### 函数

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

### 对象

```js
const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);

// 456
```

### 变量提升

```js
var a = 10;
(function() {
  console.log(a);
  a = 5;
  console.log(window.a);
  var a = 20;
  console.log(a);
})();
```

分别为 undefined 　 10 　 20，原因是作用域问题，在内部声名 var a = 20;相当于先声明 var a;然后再执行赋值操作，这是在ＩＩＦＥ内形成的独立作用域，如果把 var a=20 注释掉，那么 a 只有在外部有声明，显示的就是外部的Ａ变量的值了。结果Ａ会是 10 　 5 　 5

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

针对这题，在知乎上看到别人的回答说：

1. 函数表达式与函数声明不同，函数名只在该函数内部有效，并且此绑定是常量绑定。
2. 对于一个常量进行赋值，在 strict 模式下会报错，非 strict 模式下静默失败。
3. IIFE 中的函数是函数表达式，而不是函数声明。

实际上，有点类似于以下代码，但不完全相同，因为使用 const 不管在什么模式下，都会 TypeError 类型的错误

```js
const foo = (function() {
  foo = 10;
  console.log(foo);
})(foo)(); // Uncaught TypeError: Assignment to constant variable.
```

我的理解是，b 函数是一个相当于用 const 定义的常量，内部无法进行重新赋值，如果在严格模式下，会报错"Uncaught TypeError: Assignment to constant variable."
例如下面的：

```js
var b = 10;
(function b() {
  'use strict';
  b = 20;
  console.log(b);
})(); // "Uncaught TypeError: Assignment to constant variable."
```

### return value

```js
function getNumber() {
  return 2, 4, 5;
}

var numb = getNumber();
console.log(numb);
// 5 最后一个值就是 return 回的值
```

```js
(function() {
  function sayHello() {
    var name = 'Hi John';
    return;
    {
      fullName: name;
    }
  }
  console.log(sayHello().fullName);
})();
// 需要在同一行
// Uncaught TypeError: Cannot read property 'fullName' of undefined
```

### sort 函数

```js
(function() {
  var arrayNumb = [2, 8, 15, 16, 23, 42];
  arrayNumb.sort();
  console.log(arrayNumb);
})();
// [ 15, 16, 2, 23, 42, 8 ]
```
