---
title: 类型转换
date: '2020-11-02'
draft: true
---

### ['1', '2', '3'].map(parseInt) what & why ?

首先让我们回顾一下，map 函数的第一个参数 callback：
var new_array = arr.map(function callback(currentValue[, index[, array]]) { // Return element for new_array }[, thisArg])
这个 callback 一共可以接收三个参数，其中第一个参数代表当前被处理的元素，而第二个参数代表该元素的索引。

而 parseInt 则是用来解析字符串的，使字符串成为指定基数的整数。
parseInt(string, radix)
接收两个参数，第一个表示被处理的值（字符串），第二个表示为解析时的基数。

了解这两个函数后，我们可以模拟一下运行情况

parseInt('1', 0) //radix 为 0 时，且 string 参数不以“0x”和“0”开头时，按照 10 为基数处理。这个时候返回 1
parseInt('2', 1) //基数为 1（1 进制）表示的数中，最大值小于 2，所以无法解析，返回 NaN
parseInt('3', 2) //基数为 2（2 进制）表示的数中，最大值小于 3，所以无法解析，返回 NaN
map 函数返回的是一个数组，所以最后结果为[1, NaN, NaN]

### 下面的代码打印什么内容，为什么？

```
var b = 10;
(function b(){
    b = 20;
    console.log(b);
})(); //[Function b]
```

```
var b = 10;
(function b() {
  'use strict'
  b = 20;
  console.log(b)
})() // "Uncaught TypeError: Assignment to constant variable."
```

1.函数表达式与函数声明不同，函数名只在该函数内部有效，并且此绑定是常量绑定。
在严格模式下 b 函数相当于常量，无法进行重新赋值，
在非严格模式下函数声明优先变量声明

### 简单改造下面的代码，使之分别打印 10 和 20

```
var b = 10;
(function b(){
    b = 20;
    console.log(b);
})();
```

- 打印 20

```
  var b = 10;
  (function b(){
    var b = 20;
    console.log(b);
  })();// 20 在自执行函数中重新定义一个变量，
```

```
var b = 10;
(function a(){
   b = 20;
   console.log(b);
})();
```

```
var b = 10;
(function (){
   b = 20;
   console.log(b);
})();
```

- 打印 10

```
  var b = 10;
  (function b(){
    b = 20;
    console.log(window.b);
  })();

```

// 在自执行函数中访问 window，window 中的 b 值为 10 2.

```
var b = 10;
(function (){
  console.log(b);
  b = 20;
})();
```

```
var b = 10;
(function b(b){
   console.log(b);
   b = 20;
})(b);
```

### 使用迭代的方式实现 flatten 函数

```js
let arr = [1, 2, [3, 4, 5, [6, 7], 8], 9, 10, [11, [12, 13]]];
```

迭代实现

```js
function flatten(arr) {
  let arrs = [...arr];
  let newArr = [];
  while (arrs.length) {
    let item = arrs.shift();
    if (Array.isArray(item)) {
      arrs.unshift(...item);
    } else {
      newArr.push(item);
    }
  }
  return newArr;
}
```

递归实现

```js
function flatten(arr) {
  let arrs = [];
  arr.map(item => {
    if (Array.isArray(item)) {
      arrs.push(...flatten(item));
    } else {
      arrs.push(item);
    }
  });
  return arrs;
}
```

字符串转换

```js
arr.join(',').split(',').map(item => Number(item)))
```

使用 Generator 实现数组 flatten:

```js
function* flat(arr) {
  for (let item of arr) {
    if (Array.isArray(item)) {
      yield* flat(item); //Generator委托
    } else {
      yield item;
    }
  }
}
function flatten(arr) {
  let result = [];
  for (let val of flat(arr)) {
    result.push(val);
  }
  return result;
}
let arr1 = [1, [2, 3, [4, 5], 6], [7]];
console.log(flatten(arr1)); //[1, 2, 3, 4, 5, 6, 7]
```

### 面代码中 a 在什么情况下会打印 1？

```js
var a = ?;
if(a == 1 && a == 2 && a == 3){
 	conso.log(1);
}
```

考察隐式转换,重写 toString 方法即可

```js
var a = {
  i: 1,
  toString() {
    return a.i++;
  },
};

if (a == 1 && a == 2 && a == 3) {
  console.log(1);
}
```

```js
let a = {
  i: 1,
  valueOf() {
    return a.i++;
  },
};

if (a == 1 && a == 2 && a == 3) {
  console.log('1');
}
```

```js
var a = [1, 2, 3];
a.join = a.shift;
if (a == 1 && a == 2 && a == 3) {
  console.log('1');
}
```

```
let a = {[Symbol.toPrimitive]: ((i) => () => ++i) (0)};
if(a == 1 && a == 2 && a == 3) {
  console.log('1');
}
```

### 手动实现 call,apply, bind 方法

call 实现

```js
Function.prototype.call2 = function(context) {
  context = context || window;
  context.fn = this;
  var args = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
  }
  var result = eval('context.fn(' + args + ')');
  delete context.fn;
  return result;
};
```

apply 实现

```js
Function.prototype.apply = function(context, arr) {
  context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']');
    }
    result = eval('context.fn(' + args + ')');
  }

  delete context.fn;
  return result;
};
```

bind 实现

```js
Function.prototype.bind = function(oThis) {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }

  var aArgs = Array.prototype.slice.call(arguments, 1),
    fToBind = this,
    fNOP = function() {},
    fBound = function() {
      // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
      // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
      // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
      return fToBind.apply(
        this instanceof fNOP && oThis ? this : oThis || window,
        aArgs.concat(Array.prototype.slice.call(arguments)),
      );
    };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();

  return fBound;
};
```

[call,apply,bind 的用法以及实现原理 ](https://github.com/LuoShengMen/StudyNotes/issues/28)

### 模拟 new 实现

```js
function Foo(name, age) {
  this.name = name;
  this.age = age;
}

var nar = new Foo('tom', 18);
console.log(nar.name);
function OBK() {
  var obj = new Object(), //从Object.prototype上克隆一个对象
    Constructor = [].shift.call(arguments); //取得外部传入的构造器

  var F = function() {};
  F.prototype = Constructor.prototype;
  obj = new F(); //指向正确的原型

  var ret = Constructor.apply(obj, arguments); //借用外部传入的构造器给obj设置属性

  return typeof ret === 'object' ? ret : obj; //确保构造器总是返回一个对象
}
var bar = OBK(Foo, 'jim', 15);
console.log(bar.age);
```

### 输出什么

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

输出：
// undefind 10 20

### 实现一个 sleep 函数如 sleep(1000)意味着等待 1000 毫秒，从 Promise、Generator、Async/Await 等角度实现

while 实现

```js
function sleep(ms) {
  var start = Date.now(),
    expire = start + ms;
  while (Date.now() < expire);
  console.log('1111');
  return;
}
```

promise 实现

```js
const sleep = timer => {
  return new Promise(resolve => setTimeout(resolve, timer));
};
sleeo(1000).then();
```

generate 实现

```js
function* sleep(ms) {
  yield new Promise(function(resolve, reject) {
    console.log(111);
    setTimeout(resolve, ms);
  });
}
sleep(500)
  .next()
  .value.then(function() {
    console.log(2222);
  });
```

async 实现

```js
const sleep = time => {
  return new Promise(resolve => setTimeout(resolve, time));
};

async function sleepAsync() {
  await sleep(1000);
}

sleepAsync();
```

### sort（）排序一个数组

```js
const arr = [3, 15, 8, 29, 102, 22];
arr.sort((a, b) => a - b); // 3,8,15,22,29,102
arr.sort((a, b) => b - a); //102, 29, 22, 15, 8, 3
```

### 经典前端笔试题

```js
function Foo() {
  getName = function() {
    alert(1);
  };
  return this;
}
Foo.getName = function() {
  alert(2);
};
Foo.prototype.getName = function() {
  alert(3);
};
var getName = function() {
  alert(4);
};
function getName() {
  alert(5);
}
// 输出值
Foo.getName(); //2
getName(); //4
Foo().getName(); // 1
getName(); // 1
new Foo.getName(); // 2
new Foo().getName(); //3
new new Foo().getName(); //3

实际执行;
Foo.getName(); // 2
getName(); // 4
Foo();
getName(); // 1
getName(); // 1
Foo.getName(); // 2
new Foo().getName(); // 3
new Foo().getName(); // 3
```

https://juejin.im/post/5c6d67cbf265da2dde06e8a5

### Object.assign()的模拟实现

实现一个 Object.assign 大致思路如下：

1、判断原生 Object 是否支持该函数，如果不存在的话创建一个函数 assign，并使用 Object.defineProperty 将该函数绑定到 Object 上。

2、判断参数是否正确（目标对象不能为空，我们可以直接设置{}传递进去,但必须设置值）。

3、使用 Object() 转成对象，并保存为 to，最后返回这个对象 to。

4、使用 for..in 循环遍历出所有可枚举的自有属性。并复制给新的目标对象（使用 hasOwnProperty 获取自有属性，即非原型链上的属性）。

实现代码如下，这里为了验证方便，使用 assign2 代替 assign。注意此模拟实现不支持 symbol 属性，因为 ES5 中根本没有 symbol 。

```js
if (typeof Object.assign2 != 'function') {
  // Attention 1
  Object.defineProperty(Object, 'assign2', {
    value: function(target) {
      'use strict';
      if (target == null) {
        // Attention 2
        throw new TypeError('Cannot convert undefined or null to object');
      }

      // Attention 3
      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          // Attention 2
          // Attention 4
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true,
  });
}
```

### 深拷贝的实现

```js
function cloneDeep(x) {
  const root = {};

  // 栈
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x,
    },
  ];

  while (loopList.length) {
    // 广度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res = parent;
    if (typeof key !== 'undefined') {
      res = parent[key] = {};
    }

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === 'object') {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k],
          });
        } else {
          res[k] = data[k];
        }
      }
    }
  }

  return root;
}
```

扩展：深拷贝和浅拷贝的区别
浅拷贝只是新开一个别名来引用这个内存区。即拷贝原对象的引用

深拷贝会重新开辟一个内存区，并把之前内存区的值复制进来，这样两个内存区初始值是一样的，但接下去的操作互不影响
[深拷贝终极探索](https://segmentfault.com/a/1190000016672263)

### 笔试题

```js
var obj = {
  '2': 3,
  '3': 4,
  length: 2,
  splice: Array.prototype.splice,
  push: Array.prototype.push,
};
obj.push(1);
obj.push(2);
console.log(obj);
```

输出稀疏数组[,,1,2]
1.call push 这个方法如果对象有 length 属性，length 属性会加 1 并且返回，这个是在某本书的上看到的，一直记得。 2.调用 push 方法的时候会在调用对象的 key=length 的地方做一个赋值，不管前面 key 有没有值，也就是说在调用 push 的时候 对象实际被理解为了[0:undefined,1:undefined,2:3,3:4]

### 实现 (5).add(3).minus(2) 功能

```js
Number.prototype.add = function(value) {
  let number = parseFloat(value);
  if (typeof number !== 'number' || Number.isNaN(number)) {
    throw new Error('请输入数字或者数字字符串～');
  }
  return this + number;
};
Number.prototype.minus = function(value) {
  let number = parseFloat(value);
  if (typeof number !== 'number' || Number.isNaN(number)) {
    throw new Error('请输入数字或者数字字符串～');
  }
  return this - number;
};
console.log((5).add(3).minus(2));
```

### 求一个字符串的字节长度

```js
function GetBytes(str) {
  var len = str.length;
  var bytes = len;
  for (var i = 0; i < len; i++) {
    if (str.charCodeAt(i) > 255) bytes++;
  }
  return bytes;
}
alert(GetBytes('你好,as'));
```

一个英文字符占用一个字节，一个中文字符占用两个字节

### 输出以下代码的执行结果并解释为什么

```js
var a = { n: 1 };
var b = a;
a.x = a = { n: 2 };

console.log(a.x);
console.log(b.x);
```

输出：

```js
a.x; //  undefined
b.x; //  {n: 2}
```

运算赋优先级问题，此前 a 和 b 都是指向{n:1}，a.x 执行之后 x 值为 undefined，a 和 b 指向{n:1,x:undefined},接下来执行赋值运算，a 指向变更成了{n:2},此时都 a.x= a,实际上是 b.x=a,b 指向了{n:1,x:{n: 2}},此时 a.x 输出 undefined,b.x 输出{n:2}

### {1:222, 2:123, 5:888}，请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null]

```js
let data = { 1: 222, 2: 123, 5: 888 };
let arr = Array.from({ length: 12 }).map((it, i) => data[i + 1] || null);
用时更少;

let obj = { 1: 222, 2: 123, 5: 888 };
let res = Array.from({ length: 12 }).fill(null);
keys(obj).forEach(it => (res[it - 1] = obj[it]));
```

### 要求设计 LazyMan 类，实现以下功能

```js
LazyMan('Tony');
// Hi I am Tony

LazyMan('Tony')
  .sleep(10)
  .eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan('Tony')
  .eat('lunch')
  .sleep(10)
  .eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan('Tony')
  .eat('lunch')
  .eat('dinner')
  .sleepFirst(5)
  .sleep(10)
  .eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
```

答案：

```js
class LazyManClass {
  constructor(name) {
    this.taskList = [];
    this.name = name;
    console.log(`Hi I am ${this.name}`);
    setTimeout(() => {
      this.next();
    }, 0);
  }
  eat(name) {
    var that = this;
    var fn = (function(n) {
      return function() {
        console.log(`I am eating ${n}`);
        that.next();
      };
    })(name);
    this.taskList.push(fn);
    return this;
  }
  sleepFirst(time) {
    var that = this;
    var fn = (function(t) {
      return function() {
        setTimeout(() => {
          console.log(`等待了${t}秒...`);
          that.next();
        }, t * 1000);
      };
    })(time);
    this.taskList.unshift(fn);
    return this;
  }
  sleep(time) {
    var that = this;
    var fn = (function(t) {
      return function() {
        setTimeout(() => {
          console.log(`等待了${t}秒...`);
          that.next();
        }, t * 1000);
      };
    })(time);
    this.taskList.push(fn);
    return this;
  }
  next() {
    var fn = this.taskList.shift();
    fn && fn();
  }
}
function LazyMan(name) {
  return new LazyManClass(name);
}
LazyMan('Tony')
  .eat('lunch')
  .eat('dinner')
  .sleepFirst(5)
  .sleep(4)
  .eat('junk food');
```

### 写一个通用的事件侦听器函数

```js
// event(事件)工具集，来源：github.com/markyun
markyun.Event = {
  // 页面加载完成后
  readyEvent: function(fn) {
    if (fn == null) {
      fn = document;
    }
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
      window.onload = fn;
    } else {
      window.onload = function() {
        oldonload();
        fn();
      };
    }
  },
  // 视能力分别使用dom0||dom2||IE方式 来绑定事件
  // 参数： 操作的元素,事件名称 ,事件处理程序
  addEvent: function(element, type, handler) {
    if (element.addEventListener) {
      //事件类型、需要执行的函数、是否捕捉
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, function() {
        handler.call(element);
      });
    } else {
      element['on' + type] = handler;
    }
  },
  // 移除事件
  removeEvent: function(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.datachEvent) {
      element.detachEvent('on' + type, handler);
    } else {
      element['on' + type] = null;
    }
  },
  // 阻止事件 (主要是事件冒泡，因为IE不支持事件捕获)
  stopPropagation: function(ev) {
    if (ev.stopPropagation) {
      ev.stopPropagation();
    } else {
      ev.cancelBubble = true;
    }
  },
  // 取消事件的默认行为
  preventDefault: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
  // 获取事件目标
  getTarget: function(event) {
    return event.target || event.srcElement;
  },
  // 获取event对象的引用，取到事件的所有信息，确保随时能使用event；
  getEvent: function(e) {
    var ev = e || window.event;
    if (!ev) {
      var c = this.getEvent.caller;
      while (c) {
        ev = c.arguments[0];
        if (ev && Event == ev.constructor) {
          break;
        }
        c = c.caller;
      }
    }
    return ev;
  },
};
```

### 实现 destructuringArray 方法，达到如下效果

```js
// destructuringArray( [1,[2,4],3], "[a,[b],c]" );
// result
// { a:1, b:2, c:3 }
```

实现：

```js
destructuringArray = (value, keys) => {
  let obj = {};
  let arr = JSON.parse(keys.replace(/\w+/g, '"$&"'));
  console.log(arr);
  const iterate = (value, keys) => {
    keys.forEach((item, index) => {
      if (Array.isArray(item)) iterate(value[index], item);
      else obj[item] = value[index];
    });
  };
  iterate(value, arr);
  console.log(obj);
  return obj;
};
```

### js 获取当前时间戳？获取一个月有多少天？

JS 获取当前时间戳的方法
//方法一

```js
var timestamp = new Date().getTime();
console.log(timestamp); //1495302061441
```

//方法二

```js
var timestamp2 = new Date().valueOf();
console.log(timestamp2); //1495302061447
```

//方法三

```js
var timestamp3 = Date.parse(new Date());
console.log(timestamp3); //1495302061000
```

获取一个月多少天？
方法一：new Date()第 3 个参数默认为 1，就是每个月的 1 号，把它设置为 0 时， new Date()会返回上一个月的最后一天，然后通过 getDate()方法得到天数

```js
function getMonthDay(year, month) {
  let days = new Date(year, month + 1, 0).getDate();
  return days;
}
```

方法二:
可以把每月的天数写在数组中再判断时闰年还是平年确定 2 月分的天数

```js
function getDays(year) {
   let days = [31,28,31,...]
  if ( (year % 4 ===0) && (year % 100 !==0 || year % 400 ===0) ) {
        days[1] = 29
  }
}
```

### 如何实现以下函数?柯里化

理解柯里化 ：用闭包把参数保存起来，当参数的数量足够执行函数了，就开始执行函数

```js
dd(2, 5); // 7
add(2)(5); // 7
```

基本实现：

```js
function add() {
  let data = Array.prototype.slice.call(arguments);
  if (data.length > 1) {
    return data.reduce((source, item) => source + item, 0);
  } else {
    let sum;
    sum = (sum || 0) + data[0];
    return add.bind(this, sum);
  }
}
```

进化版：

> 当一个对象转换成原始值时，先查看对象是否有 valueOf 方法，如果有并且返回值是一个原始值，
> 那么直接返回这个值，否则没有 valueOf 或返回的不是原始值，那么调用 toString 方法，返回字符串表示

```js
function add() {
  let data = Array.prototype.slice.call(arguments);
  if (data.length > 1) {
    return data.reduce((source, item) => source + item, 0);
  } else {
    let sum = data[0];
    function tmp(b) {
      // 使用闭包
      sum = sum + b;
      return tmp;
    }
    tmp.valueOf = function() {
      return sum;
    };
    tmp.toString = function() {
      return sum + '';
    };
    return tmp;
  }
}
```

参数固定版本：

```js
var curry = function(final, arity) {
  var curried = function() {
    // this是每次的参数列表
    // 每次slice()保证curry后的函数仍然是无状态的
    var new_args = this.slice();
    for (arg_key in arguments) {
      new_args.push(arguments[arg_key]);
    }

    if (new_args.length >= arity) {
      return final.apply(null, new_args);
    } else {
      return curried.bind(new_args);
    }
  };

  return curried.bind([]);
};

var sum4 = function(a, b) {
  return a + b;
};

var add = curry(sum4, sum4.length);

console.log(add(2, 5));
console.log(add(2)(5));
```

最终版

```js
function add() {
  let data = [].concat(Array.prototype.slice.call(arguments));
  function tmp() {
    // 使用闭包
    data = data.concat(Array.prototype.slice.call(arguments));
    return tmp;
  }
  tmp.valueOf = function() {
    return data.reduce((source, item) => source + item, 0);
  };
  tmp.toString = function() {
    return data.reduce((source, item) => source + item, 0);
  };
  return tmp;
}
```

有关性能的一些事：

- 存取 arguments 对象通常要比存取命名参数要慢一些。
- 一些老版本的浏览器在 arguments.length 的实现上相当慢。
- 使用 fn.apply() 和 fn.call() 要比直接调用 fn() 要慢点。
- 创建大量嵌套作用域和闭包会带来开销，无论是内容还是速度上。
- 大多数瓶颈来自 DOM 操作

扩展：

- 柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。
- 偏函数即局部应用则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数
  [函数柯里化](https://github.com/LuoShengMen/StudyNotes/issues/481)

### ES6 的 Set 内部实现

实现：

```js
function Set() {
  var items = {};
  var length = 0;
  //判断元素是否存在
  this.has = function(val) {
    return items.hasOwnProperty(val);
  };
  //增加操作
  this.add = function(val) {
    if (!this.has(val)) {
      items[val] = val;
      length++;
      return true;
    }
    return false;
  };
  // 删除操作
  this.remove = function(val) {
    if (this.has(val)) {
      delete items[val];
      length -= 1;
      return true;
    }
    return false;
  };
  // 清除
  this.clear = function() {
    items = {};
    length = 0;
    return true;
  };
  //获取大小
  this.size = function() {
    return length;
  };
  //获取属性
  this.values = function() {
    return Object.keys(items);
  };
}
var set = new Set();
set.add(1);
set.add(2);
set.add(3);
set.add('a');
```

求并集：

```js
this.union = function(otherSet) {
  var unionSet = new Set(); //存放结果
  var values = this.values();
  for (var i = 0; i < values.length; i++) {
    unionSet.add(values[i]); //放入当前集合中的元素
  }
  values = otherSet.values();
  for (var i = 0; i < values.length; i++) {
    unionSet.add(values[i]); //放入另一个集合的元素
  }
  return unionSet;
};
```

交集：

```js
this.intersection = function(otherSet) {
  var intersectionSet = new Set(); //存放结果
  var values = this.values();
  for (var i = 0; i < values.length; i++) {
    if (otherSet.has(values[i])) {
      //只放入两个集合共有的元素
      intersectionSet.add(values[i]);
    }
  }
  return intersectionSet;
};
```

差集：

```js
this.difference = function(otherSet) {
  var differenceSet = new Set(); //存放结果
  var values = this.values();
  for (var i = 0; i < values.length; i++) {
    if (!otherSet.has(values[i])) {
      //只放入集合otherSet中没有的
      differenceSet.add(values[i]);
    }
  }
  return differenceSet;
};
```

### js 实现一个拖拽？

首先是三个事件，分别是 mousedown，mousemove，mouseup
当鼠标点击按下的时候，需要一个 tag 标识此时已经按下，可以执行 mousemove 里面的具体方法。

clientX，clientY 标识的是鼠标的坐标，分别标识横坐标和纵坐标，并且我们用 offsetX 和 offsetY 来表示元素的元素的初始坐标，移动的举例应该是：
鼠标移动时候的坐标-鼠标按下去时候的坐标。

也就是说定位信息为：

鼠标移动时候的坐标-鼠标按下去时候的坐标+元素初始情况下的 offetLeft.

还有一点也是原理性的东西，也就是拖拽的同时是绝对定位，我们改变的是绝对定位条件下的 left
以及 top 等等值。
div:

```js
  <div class="drag" style="left:0;top:0;width:100px;height:100px">按住拖动</div>

<style>
        .drag {
            background-color: skyblue;
            position: absolute;
            line-height: 100px;
            text-align: center;
        }
 </style>
```

js:

```js
// 获取DOM元素
let dragDiv = document.getElementsByClassName('drag')[0];
// 鼠标按下事件 处理程序
let putDown = function(event) {
  dragDiv.style.cursor = 'pointer';
  let offsetX = parseInt(dragDiv.style.left); // 获取当前的x轴距离
  let offsetY = parseInt(dragDiv.style.top); // 获取当前的y轴距离
  let innerX = event.clientX - offsetX; // 获取鼠标在方块内的x轴距
  let innerY = event.clientY - offsetY; // 获取鼠标在方块内的y轴距
  // 按住鼠标时为div添加一个border
  dragDiv.style.borderStyle = 'solid';
  dragDiv.style.borderColor = 'red';
  dragDiv.style.borderWidth = '3px';
  // 鼠标移动的时候不停的修改div的left和top值
  document.onmousemove = function(event) {
    dragDiv.style.left = event.clientX - innerX + 'px';
    dragDiv.style.top = event.clientY - innerY + 'px';
    // 边界判断
    if (parseInt(dragDiv.style.left) <= 0) {
      dragDiv.style.left = '0px';
    }
    if (parseInt(dragDiv.style.top) <= 0) {
      dragDiv.style.top = '0px';
    }
    if (parseInt(dragDiv.style.left) >= window.innerWidth - parseInt(dragDiv.style.width)) {
      dragDiv.style.left = window.innerWidth - parseInt(dragDiv.style.width) + 'px';
    }
    if (parseInt(dragDiv.style.top) >= window.innerHeight - parseInt(dragDiv.style.height)) {
      dragDiv.style.top = window.innerHeight - parseInt(dragDiv.style.height) + 'px';
    }
  };
  // 鼠标抬起时，清除绑定在文档上的mousemove和mouseup事件
  // 否则鼠标抬起后还可以继续拖拽方块
  document.onmouseup = function() {
    document.onmousemove = null;
    document.onmouseup = null;
    // 清除border
    dragDiv.style.borderStyle = '';
    dragDiv.style.borderColor = '';
    dragDiv.style.borderWidth = '';
  };
};
// 绑定鼠标按下事件
dragDiv.addEventListener('mousedown', putDown, false);
```

### 如何把一个字符串的大小写取反（大写变小写小写变大写），例如 ’AbC' 变成 'aBc'

```js
function processString(s) {
  var arr = s.split('');
  var new_arr = arr.map(item => {
    return item === item.toUpperCase() ? item.toLowerCase() : item.toUpperCase();
  });
  return new_arr.join('');
}
console.log(processString('AbC'));
```

### 实现 Storage，使得该对象为单例，并对 localStorage 进行封装设置值 setItem(key,value)和 getItem(key)

```js
var instance = null;
class Storage {
  static getInstance() {
    if (!instance) {
      instance = new Storage();
    }
    return this.instance;
  }
  setItem = (key, value) => localStorage.setItem(key, value),
  getItem = key => localStorage.getItem(key)
}
```

### 实现一个持续的动画效果

js 定时器实现

```js
var e = document.getElementById('e');
var flag = true;
var left = 0;
setInterval(() => {
  left == 0 ? (flag = true) : left == 100 ? (flag = false) : '';
  flag ? (e.style.left = ` ${left++}px`) : (e.style.left = ` ${left--}px`);
}, 1000 / 60);
```

js APIrequestAnimationFrame 实现

```js
//兼容性处理
window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
var e = document.getElementById('e');
var flag = true;
var left = 0;

function render() {
  left == 0 ? (flag = true) : left == 100 ? (flag = false) : '';
  flag ? (e.style.left = ` ${left++}px`) : (e.style.left = ` ${left--}px`);
}

(function animloop() {
  render();
  requestAnimFrame(animloop);
})();
```

优势：
浏览器可以优化并行的动画动作，更合理的重新排列动作序列，并把能够合并的动作放在一个渲染周期内完成，从而呈现出更流畅的动画效果
解决毫秒的不精确性
避免过度渲染（渲染频率太高、tab 不可见暂停等等）
注：requestAnimFrame 和 定时器一样也头一个类似的清除方法 cancelAnimationFrame

css 实现：

```js
animation:mymove 5s infinite;
@keyframes mymove {
from {top:0px;}
to {top:200px;}
}
```

### 如何每隔三个数加一个逗号，还要考虑小数点的情况

```js
function transform(number){
    var num = number.toString()
    var numArr = num.split('.')
    var [num, dotNum] = numArr


    var operateNum = num.split('').reverse()
    var result = [], len = operateNum.length
    for(var i = 0; i< len; i++){
         result.push(operateNum[i])
         if(((i+1) % 3 === 0) && (i !== len-1)){
              result.push(',')
        }
    }

    if(dotNum){
         result.reverse().push('.'， ...dotNum)
         return result.join('')
    }else{
         return result.reverse().join('')
    }

}

```

### 手写 indexOf

```js
function indexOf(str, val) {
  var strLen = str.length,
    valLen = val.length;
  for (var i = 0; i < strLen; i++) {
    var matchLen = i + valLen;
    var matchStr = str.slice(i, matchLen);
    if (matchLen > strLen) {
      return -1;
    }
    if (matchStr === val) {
      return i;
    }
  }
  return -1;
}
```

### 用 setTimeout 来实现 setInterval

```js
function say() {
  //something
  setTimeout(say, 200);
}
setTimeout(say, 200);
setTimeout(function() {
  //do something
  setTimeout(arguments.callee, 200);
}, 200);
```

### js 怎么控制一次加载一张图片，加载完后再加载下一张

```html
<script type="text/javascript">
  var obj = new Image();
  obj.src = 'http://www.phpernote.com/uploadfiles/editor/201107240502201179.jpg';
  obj.onload = function() {
    alert('图片的宽度为：' + obj.width + '；图片的高度为：' + obj.height);
    document.getElementById('mypic').innnerHTML = "<img src='" + this.src + "' />";
  };
</script>
<div id="mypic">onloading……</div>
```

```html
<script type="text/javascript">
  var obj = new Image();
  obj.src = 'http://www.phpernote.com/uploadfiles/editor/201107240502201179.jpg';
  obj.onreadystatechange = function() {
    if (this.readyState == 'complete') {
      alert('图片的宽度为：' + obj.width + '；图片的高度为：' + obj.height);
      document.getElementById('mypic').innnerHTML = "<img src='" + this.src + "' />";
    }
  };
</script>
<div id="mypic">onloading……</div>
```

### 实现 log 函数

```js
function log() {
  // var arr = [].slice.call(arguments);
  var arr = Array.from(arguments);
  var res = '';
  arr.forEach(elem => {
    res += elem + ' ';
  });
  console.log(`(app)${res}`);
}

// 测试
log('hello', 'world');
log('hello world');
```

### 下面的输出是什么？

```js
pi = 0;
radius = 1;
function circum(radius) {
  radius = 3;
  pi = 3.14;
  console.log(2 * pi * radius); // 18.14
  console.log(arguments[0]); // 3
}
circum(2);
console.log(pi); // 3.14
console.log(radius); // 1

// 函数内修改了radius 修改的是"形式参数"，修改的pi是"全局的"pi
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
function foo(a, b){
   arguments[0] = 9;
   arguments[1] = 99;
   console.log(a, b); //9, 99
}
foo(1, 10);

function foo(a, b){
   a = 8;
   b = 88;
   console.log(arguments[0], arguments[1]); //8, 88
}
foo(1, 10);

// ES6的默认函数不会改变arguments类数组对象值
function foo(a=1, b=10){
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
    console.log(arguments[0])
}
f2(10)

经过变量提升后：
function f2(a) {
    var a;
    console.log(a);
    console.log(a);
    console.log(arguments[0])
}
f2(10);

var a会被归纳，由于a已经有值，故不会变为undefined
```

### 下面的输出是什么？

```js
var a = {};
var b = {name:"ZS"};
var c = {};
c[a] = "demo1";
c[b] = "demo2";

console.log(c[a]);      // demo2
console.log(c);         // Object {[object Object]: "demo2"}

c[a]、c[b]隐式的将对象a，b使用了toString（）方法进行了转换，然后再对属性赋值。
即：Object.prototype.toString.call(a) ==> [object Object]
因此，c = { [object Object]: 'demo1'} ==> c = {[object Object]: 'demo2' }

```

### 下面的输出是什么？

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

```js
window.setTimeout(hello(userName),3000);
这将使hello函数立即执行，并将'返回值'作为调用句柄传递给setTimeout函数

// 方法1：
使用'字符串形式'可以达到想要的结果:
window.setTimeout("hello(userName)",3000);
但是，此处的username变量必须处于全局环境下

// 方法2：
function hello(_name){
       alert("hello,"+_name);
}
// 创建一个函数，用于返回一个无参数函数
function _hello(_name){
       return function(){
             hello(_name);
       }
}
window.setTimeout(_hello(userName),3000);
使用_hello(userName)来返回一个不带参数的函数句柄，从而实现了参数传递的功能
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

### 实现鼠标滑过头像显示简介

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .div1 {
        width: 100px;
        height: 100px;
        background-color: red;
        border-radius: 50px;
      }
      .div2 {
        width: 100px;
        height: 200px;
        margin-top: 10px;
        background-color: black;
        display: none;
      }
    </style>
  </head>
  <body>
    <div class="div1"></div>
    <div class="div2"></div>

    <script type="text/javascript">
      var d1 = document.getElementsByClassName('div1')[0];
      var d2 = document.getElementsByClassName('div2')[0];
      var timer;
      d1.addEventListener('mouseenter', function() {
        timer = window.setTimeout(function() {
          d2.style.display = 'block';
        }, 300);
      });
      d1.addEventListener('mouseout', function() {
        window.clearTimeout(timer);
        d2.style.display = 'none';
      });
    </script>
  </body>
</html>
```

### 分析下列输出结果

```js
// example 1
var a = {},
  b = '123',
  c = 123;
a[b] = 'b';
a[c] = 'c';
console.log(a[b]);

// example 2
var a = {},
  b = Symbol('123'),
  c = Symbol('123');
a[b] = 'b';
a[c] = 'c';
console.log(a[b]);

// example 3
var a = {},
  b = { key: '123' },
  c = { key: '456' };
a[b] = 'b';
a[c] = 'c';
console.log(a[b]);
```

对象键名的转换：

- 对象的键名只能是字符串和 Symbol 类型。
- 其他类型的键名会被转换成字符串类型。
- 对象转字符串默认会调用 toString 方法。
  example 1，c 的键名转换成字符串将 b 键覆盖输出 c
  example 2，任何一个 Symbol 类型的值都是不相等的，所以 b 键和 c 键都不会被覆盖，输出 b
  example 3，对象都会被转换为字符串 [object Object]，因此 c 键会覆盖 b 键，输出 c

### 一行代码实现 100 个值的数组，并且值是数组下标

一行代码实现方式:
一：

```js
var arr = Array.from(new Array(100).keys());
```

二：

```js
var arr = Object.keys(Array.from({ length: 100 }));
```

三：

```js
var arr = Object.keys(Array.apply(null, { length: 100 })).map(item => +item);
```

四：

```js
var arr = Array.from({ length: 100 }, (v, k) => k);
```

五：

```js
var arr = Array.from(Array(100), (v, k) => k);
```

六：

```js
var arr = new Array(100)
  .toString()
  .split(',')
  .map((item, index) => index);
```

扩展：循环方式：

实现方法一：循环赋值

```js
var arr1 = new Array(100);
for (var i = 0; i < arr1.length; i++) {
  arr1[i] = i;
}
console.log(arr1);
```

实现方法二：push 方法实现

```js
var arr2 = new Array();
for (var i = 0; i < 100; i++) {
  arr2.push(i);
}
console.log(arr2);
```

实现方法三：while

```js
var arr3 = new Array();
var i = 0;
while (i < 100) {
  arr3.push(i);
  i++;
}
console.log(arr3);
```

实现方法四：do while

```js
var arr4 = new Array();
var i = 0;
do {
  arr4.push(i);
  i++;
} while (i < 100);
console.log(arr4);
```

实现方法五：定时器

```js
var arr9 = [];
var i = 0;
var timer = setInterval(function() {
  arr9[i] = i++;
  if (i >= 100) {
    clearInterval(timer);
    console.log(arr9);
  }
}, 1);
```

实现方法六：递归

```js
var arr = [];
var i = 0;
function MakeArray(num) {
  if (i < num) {
    arr[i] = i++;
    MakeArray(num);
  }
  return arr;
}
console.log(MakeArray(100));
```

### 实现以下代码

1.创建长度为 5 的空数组 arr 2.生成一个(2-32)之间的随机整数 rand 3.把 rand 插入到数组 arr 内，如果数组内已存在 rand 相同的数字，则重新生成随机数插入到 arr 内。使用递归实现，不能使用 for/while 循环 4.最终输出长度为 5，且内容不重复的数组

```js
const RandomNumBoth = (Min, Max) => {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
};
const getNewArr = (arr, i) => {
  let num = RandomNumBoth(2, 32);
  if (i < 5) {
    if (arr.indexOf(num) === -1) {
      arr[i] = num;
      i++;
      getNewArr(arr, i);
    } else {
      getNewArr(arr, i);
    }
  }
  return arr;
};
let arr = Array.from(new Array(5));
let i = 0;
getNewArr(arr, i);
```

扩展：随机数获取
Math.random() 这个函数可以生成 [0,1) 的一个随机数
一、min ≤ r ≤ max

```js
function RandomNumBoth(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}
```

二、min ≤ r < max

```js
function RandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.floor(Rand * Range); //舍去
  return num;
}
```

三、min < r ≤ max

```js
function RandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  if (Math.round(Rand * Range) == 0) {
    return Min + 1;
  }
  var num = Min + Math.round(Rand * Range);
  return num;
}
```

四、min < r < max

```js
function RandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  if (Math.round(Rand * Range) == 0) {
    return Min + 1;
  } else if (Math.round(Rand * Max) == Max) {
    index++;
    return Max - 1;
  } else {
    var num = Min + Math.round(Rand * Range) - 1;
    return num;
  }
}
```

### 打印出 1 - 10000 之间的所有对称数

```js
var isPalindrome = function(x) {
  let str = x.toString().split('');
  return str.join() === str.reverse().join();
};
let arr = [];
for (let i = 1; i < 100000; i++) {
  if (isPalindrome(i)) {
    arr.push(i);
  }
}
console.log(arr);
```

### 请实现一个 add 函数，满足以下功能

> add(1); // 1
> add(1)(2); // 3
> add(1)(2)(3)；// 6
> add(1)(2, 3); // 6
> add(1, 2)(3); // 6
> add(1, 2, 3); // 6

```js
function add() {
  let args = [...arguments];
  let addfun = function() {
    args.push(...arguments);
    return addfun;
  };
  addfun.toString = function() {
    return args.reduce((a, b) => {
      return a + b;
    });
  };
  return addfun;
}
```

```js
function currying(fn, length) {
  length = length || fn.length; // 注释 1
  return function(...args) {
    // 注释 2
    return args.length >= length // 注释 3
      ? fn.apply(this, args) // 注释 4
      : currying(fn.bind(this, ...args), length - args.length); // 注释 5
  };
}
```

```js
const currying = fn =>
  (judge = (...args) => (args.length >= fn.length ? fn(...args) : (...arg) => judge(...args, ...arg)));
```

其中注释部分

注释 1：第一次调用获取函数 fn 参数的长度，后续调用获取 fn 剩余参数的长度

注释 2：currying 包裹之后返回一个新函数，接收参数为 ...args

注释 3：新函数接收的参数长度是否大于等于 fn 剩余参数需要接收的长度

注释 4：满足要求，执行 fn 函数，传入新函数的参数

注释 5：不满足要求，递归 currying 函数，新的 fn 为 bind 返回的新函数（bind 绑定了 ...args 参数，未执行），新的 length 为 fn 剩余参数的长度

### 使以下代码正常运行

```js
let a = [1, 2, 3, 4, 5];
a.multiply();
console.log(a); // [1, 2, 3, 4, 5, 1, 4, 9, 16, 25]
```

```js
Object.prototype.multiply = function() {
  let arr = this;
  a = arr.concat(arr.map(item => item * item));
};
```

### 在输入框中如何判断输入的是一个正确的网址

利用正则表达式

`(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]`

### 实现 convert 方法，把原始 list 转换成树形结构，要求尽可能降低时间复杂度

以下数据结构中，id 代表部门编号，name 是部门名称，parentId 是父部门编号，为 0 代表一级部门，现在要求实现一个 convert 方法，把原始 list 转换成树形结构，parentId 为多少就挂载在该 id 的属性 children 数组下，结构如下

```js
// 原始 list 如下
let list =[
    {id:1,name:'部门A',parentId:0},
    {id:2,name:'部门B',parentId:0},
    {id:3,name:'部门C',parentId:1},
    {id:4,name:'部门D',parentId:1},
    {id:5,name:'部门E',parentId:2},
    {id:6,name:'部门F',parentId:3},
    {id:7,name:'部门G',parentId:2},
    {id:8,name:'部门H',parentId:4}
];
const result = convert(list, ...);

// 转换后的结果如下
let result = [
    {
      id: 1,
      name: '部门A',
      parentId: 0,
      children: [
        {
          id: 3,
          name: '部门C',
          parentId: 1,
          children: [
            {
              id: 6,
              name: '部门F',
              parentId: 3
            }, {
              id: 16,
              name: '部门L',
              parentId: 3
            }
          ]
        },
        {
          id: 4,
          name: '部门D',
          parentId: 1,
          children: [
            {
              id: 8,
              name: '部门H',
              parentId: 4
            }
          ]
        }
      ]
    },
  ···
];
```

解法：

```js
const convert = list => {
  const res = [];
  const map = list.reduce((res, v) => ((res[v.id] = v), res), {});
  console.log(map);
  for (const item of list) {
    if (item.parentId === 0) {
      res.push(item);
      continue;
    }
    if (item.parentId in map) {
      const parent = map[item.parentId];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
  }
  return res;
};
```

### 已知数据格式，实现一个函数 fn 找出链条中所有的父级 id

```js
const data = [
  {
    id: 1,
    name: '222',
    children: [
      {
        id: 2,
        name: '34',
        children: [
          {
            id: 112,
            name: '334',
          },
          {
            id: 112,
            name: '354',
          },
        ],
      },
    ],
  },
];
const fn = value => {
  let graph = [];
  const mapData = new Map();
  function ParentMap(data, parentId) {
    parentId = parentId || 0;
    data.forEach(item => {
      mapData[item.id] = { ...item, parentId };
      if (item.children) {
        ParentMap(item.children, item.id);
      }
    });
  }
  ParentMap(data);
  function getId(data, value) {
    graph.unshift(data[value].id);
    if (data[value].parentId !== 0) {
      getId(data, data[value].parentId);
    }
  }
  getId(mapData, value);
  return graph;
};
```

### 不借助第三者交换 a，b 两个值

```js
/* 方法一 */
a = a + b;
b = a - b;
a = a - b;

/* 方法二 */
a = a - b;
b = a + b;
a = b - a;

/* 方法三 */
a = { a: b, b: a };
b = a.b;
a = a.a;

/* 方法四 */
a = [a, b];
b = a[0];
a = a[1];

/* 方法五 */
[a, b] = [b, a];
```

### 格式化金钱，每千分位加逗号

```js
function format(str) {
  let s = '';
  let count = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    s = str[i] + s;
    count++;
    if (count % 3 == 0 && i != 0) {
      s = ',' + s;
    }
  }
  return s;
}
function format(str) {
  return str.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
```

### 写出如下代码的打印结果

```js
function changeObjProperty(o) {
  o.siteUrl = 'http://www.baidu.com';
  o = new Object();
  o.siteUrl = 'http://www.google.com';
}
let webSite = new Object();
changeObjProperty(webSite);
console.log(webSite.siteUrl);
```

http://www.baidu.com
原因：函数的形参是值传递的，形参 o 的指向发生改变，指向堆内存中一个新的对象

### 编程算法题

用 JavaScript 写一个函数，输入 int 型，返回整数逆序后的字符串。如：输入整型 1234，返回字符串“4321”。要求必须使用递归函数调用，不能用全局变量，输入函数必须只有一个参数传入，必须返回字符串。

```js
function fun(num) {
  let num1 = num / 10;
  let num2 = num % 10;
  if (num1 < 1) {
    return num;
  } else {
    num1 = Math.floor(num1);
    return `${num2}${fun(num1)}`;
  }
}
var a = fun(12345);
```

### 给定一个整数无序数组和变量 sum,是否存在数组中任意两项和使等于 sum 的值，是则返回 true

```js
const findSum = (arr, val) => {
  let searchValues = new Set();
  searchValues.add(val - arr[0]);
  for (let i = 1, length = arr.length; i < length; i++) {
    let searchVal = val - arr[i];
    if (searchValues.has(arr[i])) {
      return true;
    } else {
      searchValues.add(searchVal);
    }
  }
  return false;
};

const findSum = (arr, sum) => arr.some((set => n => set.has(n) || !set.add(sum - n))(new Set()));
```

### 请写出如下代码的打印结果

```js
function Foo() {
  Foo.a = function() {
    console.log(1);
  };
  this.a = function() {
    console.log(2);
  };
}
Foo.prototype.a = function() {
  console.log(3);
};
Foo.a = function() {
  console.log(4);
};
Foo.a();
let obj = new Foo();
obj.a();
Foo.a();
```

输出顺序是 4 2 1 .

```js
function Foo() {
  Foo.a = function() {
    console.log(1);
  };
  this.a = function() {
    console.log(2);
  };
}
// 以上只是 Foo 的构建方法，没有产生实例，此刻也没有执行

Foo.prototype.a = function() {
  console.log(3);
};
// 现在在 Foo 上挂载了原型方法 a ，方法输出值为 3

Foo.a = function() {
  console.log(4);
};
// 现在在 Foo 上挂载了直接方法 a ，输出值为 4

Foo.a();
// 立刻执行了 Foo 上的 a 方法，也就是刚刚定义的，所以
// # 输出 4

let obj = new Foo();
/* 这里调用了 Foo 的构建方法。Foo 的构建方法主要做了两件事：
1. 将全局的 Foo 上的直接方法 a 替换为一个输出 1 的方法。
2. 在新对象上挂载直接方法 a ，输出值为 2。
*/

obj.a();
// 因为有直接方法 a ，不需要去访问原型链，所以使用的是构建方法里所定义的 this.a，
// # 输出 2

Foo.a();
// 构建方法里已经替换了全局 Foo 上的 a 方法，所以
// # 输出 1
```

### Async/Await 如何通过同步的方式实现异步

Async/Await 就是一个自执行的 generate 函数。利用 generate 函数的特性把异步的代码写成“同步”的形式。

```js
var fetch = require('node-fetch');

function* gen() {
  // 这里的*可以看成 async
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url); // 这里的yield可以看成 await
  console.log(result.bio);
}
var g = gen();
var result = g.next();

result.value
  .then(function(data) {
    return data.json();
  })
  .then(function(data) {
    g.next(data);
  });
```

### 修改以下 print 函数，使之输出 0 到 99，或者 99 到 0

要求：

1. 只能修改 setTimeout 到 Math.floor(Math.random() \* 1000 的代码
2. 不能修改 Math.floor(Math.random() \* 1000
3. 不能使用全局变量

```js
function print(n) {
  setTimeout(() => {
    console.log(n);
  }, Math.floor(Math.random() * 1000));
}
for (var i = 0; i < 100; i++) {
  print(i);
}
```

```js
function print(n) {
  setTimeout(
    (() => {
      console.log(n);
      return () => {};
    }).call(n, []),
    Math.floor(Math.random() * 1000),
  );
}
for (var i = 0; i < 100; i++) {
  print(i);
}
```

### 不用加减乘除运算符，求整数的 7 倍

可以使用三类方式：位运算加法、JS hack、进制转换。实现方式分别如下：

```js
/* -- 位运算 -- */

// 先定义位运算加法
function bitAdd(m, n) {
  while (m) {
    [m, n] = [(m & n) << 1, m ^ n];
  }
  return n;
}

// 位运算实现方式 1 - 循环累加7次
let multiply7_bo_1 = num => {
  let sum = 0,
    counter = new Array(7); // 得到 [empty × 7]
  while (counter.length) {
    sum = bitAdd(sum, num);
    counter.shift();
  }
  return sum;
};

// 位运算实现方式 2 - 二进制进3位(乘以8)后，加自己的补码(乘以-1)
let multiply7_bo_2 = num => bitAdd(num << 3, -num);

/* -- JS hack -- */

// hack 方式 1 - 利用 Function 的构造器 & 乘号的字节码
let multiply7_hack_1 = num => new Function(['return ', num, String.fromCharCode(42), '7'].join(''))();

// hack 方式 2 - 利用 eval 执行器 & 乘号的字节码
let multiply7_hack_2 = num => eval([num, String.fromCharCode(42), '7'].join(''));

// hack 方式 3 - 利用 SetTimeout 的参数 & 乘号的字节码
setTimeout(['window.multiply7_hack_3=(num)=>(7', String.fromCharCode(42), 'num)'].join(''));

/* -- 进制转换 -- */

// 进制转换方式 - 利用 toString 转为七进制整数；然后末尾补0(左移一位)后通过 parseInt 转回十进制
let multiply7_base7 = num => parseInt([num.toString(7), '0'].join(''), 7);
```

### 模拟实现一个 localStorage

```js
'use strict';
const valuesMap = new Map();

class LocalStorage {
  getItem(key) {
    const stringKey = String(key);
    if (valuesMap.has(key)) {
      return String(valuesMap.get(stringKey));
    }
    return null;
  }

  setItem(key, val) {
    valuesMap.set(String(key), String(val));
  }

  removeItem(key) {
    valuesMap.delete(key);
  }

  clear() {
    valuesMap.clear();
  }

  key(i) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'key' on 'Storage': 1 argument required, but only 0 present."); // this is a TypeError implemented on Chrome, Firefox throws Not enough arguments to Storage.key.
    }
    var arr = Array.from(valuesMap.keys());
    return arr[i];
  }

  get length() {
    return valuesMap.size;
  }
}
const instance = new LocalStorage();

global.localStorage = new Proxy(instance, {
  set: function(obj, prop, value) {
    if (LocalStorage.prototype.hasOwnProperty(prop)) {
      instance[prop] = value;
    } else {
      instance.setItem(prop, value);
    }
    return true;
  },
  get: function(target, name) {
    if (LocalStorage.prototype.hasOwnProperty(name)) {
      return instance[name];
    }
    if (valuesMap.has(name)) {
      return instance.getItem(name);
    }
  },
});
```

### javascript 实现一个带并发限制的异步调度器，保证同时最多运行 2 个任务

```js
class Scheduler {
  constructor() {
    (this.tasks = []), (this.usingTask = []);
  }
  add(promiseCreator) {
    return new Promise((resolve, reject) => {
      promiseCreator.resolve = resolve;
      if (this.usingTask.length < 2) {
        this.usingRun(promiseCreator);
      } else {
        this.tasks.push(promiseCreator);
      }
    });
  }

  usingRun(promiseCreator) {
    this.usingTask.push(promiseCreator);
    promiseCreator().then(() => {
      promiseCreator.resolve();
      debugger;
      this.usingMove(promiseCreator);
      if (this.tasks.length > 0) {
        this.usingRun(this.tasks.shift());
      }
    });
  }

  usingMove(promiseCreator) {
    let index = this.usingTask.findIndex(promiseCreator);
    this.usingTask.splice(index, 1);
  }
}

const timeout = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};

addTask(400, 4);
addTask(200, 2);
addTask(300, 3);
addTask(100, 1);

// 2, 4, 3, 1
```

**手写事件侦听器，并要求兼容浏览器**

```JavaScript
var eventUtil = {
  getEvent: function(event) {
      return event || window.event;
  },

  getTarget: function(event) {
      return event.target || event.srcElement;
  },

  addListener: function(element, type, hander) {
      if (element.addEventListener) {
          element.addEventListener(type, hander, false);
      } else if (element.attachEvent) {
          element.attachEvent('on' + type, hander);
      } else {
          element['on' + type] = hander;
      }
  },

  removeListener: function(element, type, hander) {
      if (element.removeEventListener) {
          element.removeEventListener(type, hander, false);
      } else if (element.deattachEvent) {
          element.detachEvent(type, hander);
      } else {
          element['on' + type] = null;
      }
  },

  preventDefault: function(event) {
      if (event.preventDefault) {
          event.preventDefault();
      } else {
          event.returnValue = false;
      }
  },

  stopPropagation: function(event) {
      if (event.stopPropagation) {
          event.stopPropagation();
      } else {
          event.cancelBubble = true;
      }
  }
};

// 调用
(function() {
  var btn = document.getElementById("btn");
  var link = document.getElementsByTagName("a")[0];

  eventUtil.addListener(btn, "click", function(event) {
      var event = eventUtil.getEvent(event);
      var target = eventUtil.getTarget(event);
      alert(event.type);
      alert(target);
      eventUtil.stopPropagation(event);
  });

  eventUtil.addListener(link, "click", function(event) {
      alert("prevent default event");
      var event = eventUtil.getEvent(event);
      eventUtil.preventDefault(event);
  });

  eventUtil.addListener(document.body, "click", function() {
      alert("click body");
  });
})();
```

**手写事件模型**

```JavaScript
var Event = (function () {
    var list = {}, bind, trigger, remove;
    bind = function (key, fn) {
        if (!list[key]) {
            list[key] = [];
        }
        list[key].push(fn);
    };
    trigger = function () {
        var key = Array.prototype.shift.call(arguments);
        var fns = list[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    };
    remove = function (key, fn) {
        var fns = list[key];
        if (!fns) {
            return false;
        }
        if (!fn) {
            fns & (fns.length = 0);
        } else {
            for (var i = fns.length - 1; i >= 0; i--) {
                var _fn = fns[i];
                if (_fn === fn) {
                    fns.splice(i, 1);
                }
            }
        }
    };
    return {
        bind: bind,
        trigger: trigger,
        remove: remove
    }
})();

// 调用
Event.bind('Hit', function(){ console.log('bind event'); }); // 绑定事件
Event.trigger("Hit", function(){ console.log('trigger event'); }); // 触发事件
```

**手写事件代理，并要求兼容浏览器**

```JavaScript
function delegateEvent(parentEl, selector, type, fn) {
    var handler = function(e){
          var e = e || window.event;
          var target = e.target || e.srcElement;
          if (matchSelector(target, selector)) {
              if(fn) {
                  fn.call(target, e);
              }
          }
    };
    if(parentEl.addEventListener){
        parentEl.addEventListener(type, handler);
    }else{
        parentEl.attachEvent("on" + type, handler);
    }
}
/**
 * support #id, tagName, .className
 */
function matchSelector(ele, selector) {
    // if use id
    if (selector.charAt(0) === "#") {
        return ele.id === selector.slice(1);
    }
    // if use class
    if (selector.charAt(0) === ".") {
        return (" " + ele.className + " ").indexOf(" " + selector.slice(1) + " ") != -1;
    }
    // if use tagName
    return ele.tagName.toLowerCase() === selector.toLowerCase();
}

// 调用
var box = document.getElementById("box");
delegateEvent(box, "a", "click", function(){
    console.log(this.href);
})
```

**手写事件触发器，并要求兼容浏览器**

```JavaScript
var fireEvent = function(element, event){
    if (document.createEventObject){
        var mockEvent = document.createEventObject();
        return element.fireEvent('on' + event, mockEvent)
    }else{
        var mockEvent = document.createEvent('HTMLEvents');
        mockEvent.initEvent(event, true, true);
        return element.dispatchEvent(mockEvent);
    }
}
```

**手写 Function.bind 函数**

```JavaScript
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError("'this' is not function");
    }

    // bind's default arguments, array without first element
    // first part arguments for the function
    var aBindArgs = Array.prototype.slice.call(arguments, 1);
    var fToBind = this; // the function will be binding
    var fNOP = function () {};
    var fBound = function () {
          // target this will be binding
          var oThis = this instanceof fNOP ? this : oThis || this;
          // last part arguments for the function
          var aCallArgs = Array.prototype.slice.call(arguments);
          // complete arguments for the function
          var aFuncArgs = aBindArgs.concat(aCallArgs);
          return fToBind.apply(oThis, aFuncArgs);
        };

    // fBound extends fToBind
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

// 调用
var add = function(a, b, c){ return a + b + c;};
var newAdd = add.bind(null, 1, 2);
var result = newAdd(3);
```

**手写数组快速排序**

```JavaScript
var quickSort = function(arr) {
    if (arr.length <= 1) { return arr; }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0, len = arr.length; i < len; i++){
        if (arr[i] < pivot) {
          left.push(arr[i]);
        } else {
          right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right));
};

// 调用
quickSort([9, 4, 2, 8, 1, 5, 3, 7]);
```

**手写数组冒泡排序**

```JavaScript
var bubble = function(arr){
    var maxIndex = arr.length - 1, temp, flag;
    for (var i = maxIndex; i > 0; i--) {
        flag = true
        for (var j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                flag = false;
            }
        }
        if(! flag){
            break;
        }
    }
    return arr;
}
// 调用
var arr = bubble([13, 69, 28, 93, 55, 75, 34]);
```

**手写数组去重**

```JavaScript
Array.prototype.unique = function() { return [...new Set(this)];};
// 调用
[1, 2, 3, 3, 2, 1].unique();

function unique1(arr){
    var hash = {}, result = [];
    for(var i=0, len=arr.length; i<len; i++){
        if(! hash[arr[i]]){
          result.push(arr[i]);
          hash[arr[i]] = true;
        }
    }
    return result;
}
// 调用
unique1([1, 2, 3, 3, 2, 1]);

Array.prototype.unique2 = function(){
    this.sort();
    var result = [this[0]];
    var len = this.length;
    for(var i = 0; i < len; i++){
        if(this[i] !== result[result.length - 1]){
          result.push(this[i]);
        }
    }
    return result;
}
// 调用
[1, 2, 3, 3, 2, 1].unique2();

function unique3(arr){
    var result = [];
    for(var i=0; i<arr.length; i++){
        if(result.indexOf(arr[i]) == -1){
          result.push(arr[i]);
        }
    }
    return result;
}

// 调用
unique3([1, 2, 3, 3, 2, 1]);
```

**将 url 的查询参数解析成字典对象**

```JavaScript
function parseQuery(url) {
  url = url == null ? window.location.href : url;
  var search = url.substring(url.lastIndexOf("?") + 1);
  var hash = {};
  var reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, function (match, $1, $2) {
      var name = decodeURIComponent($1);
      var val = decodeURIComponent($2);
      hash[name] = String(val);
      return match;
  });
  return hash;
}
```

**用 JS 实现千位分隔符**

```JavaScript
function test1(num){
  var str = (+ num) + '';
  var len = str.length;
  if(len <= 3) return str;
  num = '';
  while(len > 3){
      len -= 3;
      num = ',' + str.substr(len, 3) + num;
  }
  return str.substr(0, len) + num;
}

function test2(num){
  // ?= 正向匹配:匹配位置
  // ?! 正向不匹配:排除位置
  var str = (+num).toString();
  var reg = /(?=(?!\b)(\d{3})+$)/g;
  return str.replace(reg, ',');
}
```

### 下面这段代码的执行结果是什么？

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 1000);
}
```

继续问，怎么实现期望一共返回 1-5，5 个值，并且一秒返回一个值？

> 这段代码,我们预期的结果是：分别输出数字 1~5，每秒一次，每次一个。但是实际结果却是：这段代码在运行时会以每秒一次的频率输出五次 6。

> 这是为什么？

> 首先解释 6 是从哪里来的。这个循环的终止条件是 `i` 不再 `<=5`。条件首次成立时 i 的值是 6。因此，输出显示的是循环结束时 i 的最终值。仔细想一下，这好像又是显而易见的，<u>延迟函数的回调会在循环结束时才执行</u>。事实上， 当定时器运行时即使每个迭代中执行的是 setTimeout(.., 0)，<u>所有的回调函数依然是在循 环结束后才会被执行</u>，因此会每次输出一个 6 出来。

因为外层作用域中只有一个`i`，这个`i`被封闭进去，而不是每个迭代的函数会封闭一个新的`i`.

> ---以上解释来自《你不知道的 JavaScript（上卷）》第五章

这样就可以实现期望一共返回 1-5，5 个值，并且一秒返回一个值

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}

// or

for (var i = 1; i <= 5; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);
    }, j * 1000);
  })(i);
}

// or

for (var i = 1; i <= 5; i++) {
  let j = i;
  setTimeout(function timer() {
    console.log(j);
  }, j * 1000);
}
```

let 声明只属于作用域块。`for`循环头部的`let i`不只是为 for 循环本身声明了一个`i`，而是为循环的每一次迭代都重新声明了一个新的`i`。这意味着 loop 迭代内部创建的闭包封闭的是每次迭代中的变量，就像期望的那样。

或者

```js
for (var i = 1; i <= 5; i++) {
  (function(j) {
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })(i);
}
```

在迭代内使用 IIFE 会为每个迭代都生成一个新的作用域，使得延迟函数的回调可以将新的
作用域封闭在每个迭代内部，每个迭代中都会含有一个具有正确值的变量供我们访问。

### 以下代码执行结果分别是什么？

- 3 + "3" // '33'
- "23" > "3" // false
- var b = true && 2; // 2
- "abc123".slice(2, -1) // 'c12' // 如果 start\stop 是负数（绝对值小于字符串长度），则 start\stop + 字符串长度。// 不会交换 start 和 stop
- "abc123".substring(2, -1) // 'ab' //如果 start or stop 是负数或 NaN，会把它当成 0 对待;如果 start > stop,则会交换这两个参数 // 交换 start 和 stop

解释：

**String.slice() 和 String.substring(),String.substr()的区别**

Syntax: string.slice(start, stop);
Syntax: string.substring(start, stop);
返回一个字符串，左包含，右不包含

Syntax:String.substr(start, num);
返回字符串,包含 start 开始,num 为字符数

---

slice VS substring

相同：

1.  如果 start == stop,return 一个空字符串
2.  stop 如果被省略，则直接扫至字符串尾
3.  如果 start 或 stop 大于了字符串长度，则会被替换成字符串长度

不同：
substing():

- 1.如果 start > stop,则会交换这两个参数
- 2.如果 start or stop 是负数或 NaN，会把它当成 0 对待

slice():

- 1.如果 start > stop,不会交换这两个参数，返回空字符串””
- 2.如果 start,or stop 是负数，且绝对值小于字符串长度，则开头\结尾是 start\stop+字符串长度
- 3.如果 start or stop 是负数，且绝对值大于字符串长度，则当作 0 处理

### 以下代码执行结果是什么？

- 1

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
  console.log(bar); // 2 由于函数作用域对全局作用域的隐藏，所以只有在test函数内部，bar=5,并不能影响到全局中的bar
  console.log(j); // undefined  test(10)函数调用的时候，是函数内部的参数j接收到了10，但是它也是函数作用域内的变量，并不会改变全局作用域中的j。
  ```

  > 这个题目还有一个类似的题目：这个考察的是，数组和对象都是引用复制

  ```js
  var j = [1, 2, 3];
  test = function(j) {
    j.push(4);
  };
  test(j);
  console.log(j); // [1,2,3,4],因为test(j)中的j是对[1,2,3]的引用复制给function(j)中的j,而在test函数内部，通过引用改变的是[1,2,3]这是数组本身，所以console.log(j); 为 [1,2,3,4]
  ```

- 2

  ```js
  for (var i = 0; i < 5; i++) {
    window.setTimeout(function() {
      console.log(i); // 
    }, 1000);
  }
  console.log('i=' + i); // 先输出“i=5”,然后再隔1s后输出一个5个5
  ```

  只有

  ```js
  for (var i = 0; i < 5; i++) {
    window.setTimeout(function() {
      console.log(i);
    }, i * 1000); // 只有i*1000才会每隔1S输出一个
  }
  ```

  > "i=5" </br>
  > 5</br>
  > 5</br>
  > 5</br>
  > 5</br>
  > 5</br>

  > setTimeout </br>
  > 语法: `var timeoutID = scope.setTimeout(function[, delay, param1, param2,...]);` `var timeoutID = scope.setTimeout(code[, delay]);`
  >
  > - function 是你想要在 delay 毫秒之后执行的函数。
  > - delay (可选) 延迟的毫秒数 (一秒等于 1000 毫秒)，函数的调用会在该延迟之后发生。如果省略该参数，delay 取默认值 0。实际的延迟时间可能会比 delay 值长，原因请查看 Reasons for delays longer than specified。
  > - param1, ..., paramN (可选) 附加参数，一旦定时器到期，它们会作为参数传递给 function 或 执行字符串（setTimeout 参数中的 code）
  >
  > ```js
  > for (var i = 0; i < 5; i++) {
  >   window.setTimeout(
  >     function(j) {
  >       console.log(i + j); // 每隔100ms输出一个13
  >     },
  >     100,
  >     8,
  >   );
  > }
  > console.log('i=' + i); // 5
  > ```

* 3

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
  obj.method(); // 10 , 对fn间接引用，调用这个函数会应用默认的绑定规则
  ```

> 这个考察的是`this`的指向问题。

还有一个类似的问题：

```js
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

obj.inner.print(); //300

var func = obj.inner.print;
func(); //100

obj.inner.print(); //300

(obj.inner.print = obj.inner.print)(); //100

// 问题：第一个和第三个有什么区别？第三个和第四个有什么区别？
```

1.第一个和第三个没有区别，运行的都是 obj.inner.print()，里面的 this 指向 obj.inner.num

2.第四个，首先你要知道一点，复制操作，会返回所赋的值。

```js
var a;
console.log((a = 5)); //5
```

所以(obj.inner.print = obj.inner.print)的结果就是一个函数，内容是

```js
function () {
    console.log(this.num);
}
```

在全局下运行这个函数，里面的 this 指向的就是 window，所以(obj.inner.print = obj.inner.print)();的结果就是

```js
var num = 100;
function () {
    console.log(this.num);
}()
// 100
```

3.  第二个

赋值操作，fun 完全就是一个函数引用，这个引用丢失了函数原本所在的上下文信息，所以最终是在全局上下文中运行

```js
function() {
  console.log(this.num);
}
```

所以这个时候 num 是全局的 num,也就是 100

- 4

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
  Foo.prototype = new Bar();
  console.log(Foo.prototype.constructor); // ƒ Object() { [native code] } 指向内置的Object()方法
  console.log(Foo.prototype instanceof Bar); // false
  var test = new Foo();
  console.log(test instanceof Foo); // true
  console.log(test instanceof Bar); // false
  console.log(test.method()); // 1
  ```

  > 1: Foo.prototype 的.constructor 属性只是 Foo 函数在声明时的默认属性。如果你创建了一个新对象并替换了函数默认的.prototype 对象引用，**那么新对象并不会自动获得.constructor 属性**。（这也是原型继承时，需要重新赋值的原因。）
  > Foo.prototype 没有.constructor 属性，所以他会委托[[Prototype]]链上的委托连顶端的 Object.prototype。这个对象有.constructor 属性，只想内置的 Object(...)函数。

- 5

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

- 6

  ```js
  var t1 = new Date().getTime();
  var timer1 = setTimeout(function() {
    clearTimeout(timer1);
    console.info('实际执行延迟时间：', new Date().getTime() - t1, 'ms'); // 500+ms
  }, 500);
  ```

  > 需要查看`setTimeout`的运行机制。

  > 阮一峰老师有篇不错的文章（[JavaScript 运行机制详解：再谈 Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)），我就不再重复造轮子了；如果觉得太长不看的话，楼主简短地大白话描述下。

  JavaScript 都是单线程的，单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。如果排队是因为计算量大，CPU 忙不过来，倒也算了，但是很多时候 CPU 是闲着的，因为 IO 设备（输入输出设备）很慢（比如 Ajax 操作从网络读取数据），不得不等着结果出来，再往下执行。
  JavaScript 语言的设计者意识到，这时主线程完全可以不管 IO 设备，挂起处于等待中的任务，先运行排在后面的任务。等到 IO 设备返回了结果，再回过头，把挂起的任务继续执行下去。于是，所有任务可以分成两种，一种是同步任务（synchronous），另一种是异步任务（asynchronous）。同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；异步任务指的是，不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。具体来说，异步执行的运行机制如下。（同步执行也是如此，因为它可以被视为没有异步任务的异步执行。）
  （1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
  （2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
  （3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
  （4）主线程不断重复上面的第三步。

  > 一段 js 代码（里面可能包含一些 setTimeout、鼠标点击、ajax 等事件），从上到下开始执行，遇到 setTimeout、鼠标点击等事件，异步执行它们，此时并不会影响代码主体继续往下执行(当线程中没有执行任何同步代码的前提下才会执行异步代码)，一旦异步事件执行完，回调函数返回，将它们按次序加到执行队列中,加入到队列中，只是在确定额  的时间候调用，但是并不一定立马执行。

综上所述， 500ms 后异步任务执行完毕，然后就在“任务队列”之中防止一个事件。但是，需要主线程的 “执行栈”中所有的同步任务执行完毕后，“任务队列”中的时间才会开始执行。所以，500+ms 后才真正的执行输出。

- 7
  ```js
  function SINA() {
    return 1;
  }
  var SINA;
  console.log(typeof SINA); // function
  ```

> 重复声明被忽略掉了，所以`var SINA`并没有起到作用，而是被忽略掉了。

- 8

```js
var sinaNews = {
  name: 'sinNewsName',
  test: function() {
    console.log('this.name:', this.name, '//');
  },
};
setTimeout(sinaNews.test, 500); // "this.name:  //"
```

> 回调函数丢失 this 绑定

### 如何对数组进行排序？如：[2, [1,2], 3, "2", "a", "b", "a", [1, 2]]，重排序后[2, [1, 2], 3, "2", "a", "b"]

> 个人答案

```js
function deleteCopy(arr) {
  var map = {};
  var newarr = [];
  arr.forEach(item => {
    if (!map[JSON.stringify(item)]) {
      newarr.push(item);
      map[JSON.stringify(item)] = 1;
    }
  });
  return newarr;
}
```

### 下面代码打印出什么？

```js
const a = 2;
console.log(a); //   2
a = 3; // TypeError: Assignment to constant variable.
```

常量的值在设定之后就不能再更改。

> 顺便记录一下`TypeError`与`ReferenceError`的区别：
> `ReferenceError`： 如果 RHS 查询（取值查询）在所有前台的作用域中找寻不到所需的变量，引擎就会抛出`ReferenceError`异常。
> `ReferenceError`同作用域判别失败相关，而`TypeError`则代表作用域判别成功了，但是对结果的操作是非法或者不合理的。比如视图对一个非函数类型的值进行函数调用，或者引用`null`或`undefined`类型的值中的属性，那么引擎会抛出类型异常，`TypeError`.

### 下面代码分别输出什么？

```js
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

接下来我们可以看到当调用 foo() 时，this.a 被解析成了全局变量 a。为什么?因为在本 例中，函数调用时应用了 this 的默认绑定，因此 this 指向全局对象。

bar() 调用使用严格模式(strict mode)，那么全局对象将无法使用默认绑定，因此 this 会绑定 到 undefined

### 根据以下代码，写出结果

```js
// 第一组
alert(a);
a();
var a = 3;
function a() {
  alert(10);
}
alert(a);
a = 6;
a();

//------------分割线------------------
// 第二组
alert(a);
a();
var a = 3;
var a = function() {
  // 函数表达式
  alert(10);
};
alert(a);
a = 6;
a();
```

> 考点其实就两个，第一变量声明提前，第二函数声明优先于变量声明！但是函数表达式并不会被提升！！

第一部分的代码片段会被引擎理解为如下形式：

```js
function a() {
  // 变量声明、函数声明会被提升，函数声明有先有变量申明
  alert(10);
}
var a;
alert(a);
a();
a = 3;
alert(a);
a = 6;
a();
```

第一部分运行结果：

1.函数声明优先于变量声明，所以，刚开始，a 就是 function a(){alert(10)} ，就会看到这个函数。

2.a()，执行函数，就是出现 alert(10)。

3.执行了 var a=3; 所以 alert(a)就是显示 3 。

4.由于 a 不是一个函数了，所以往下在执行到 a()的时候， 报错。

第二部的代码片段会被引擎理解为：

```js
var a;
alert(a);
a();
a = 3;
a = function() {
  // 函数表达式
  alert(10);
};
alert(a);
a = 6;
a();
```

第二部分运行结果：
1.underfind

2.报错在之前说过，预解析是把带有 var 和 function 关键字的事先声明，但不会赋值。所以一开始是 underfind，然后报错是因为执行到 a()的时候，a 并不是一个函数。因为报错了，错误会冒泡上浮，知道 catch 或者是最上层，所以不会继续执行下去。

> 备注

```js
//函数表达式，和变量声明同等
var a = function() {
  alert(10);
};
//函数声明，优于变量声明
function a() {
  alert(10);
}
```
