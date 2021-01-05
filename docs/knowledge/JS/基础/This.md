---
title: This
date: '2020-10-26'
draft: true
---

## This

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

### 普通函数和箭头函数的 this

还是一道经典题目，下面的这段代码的输出是什么？（为了方便解释，输出放在了注释中）

```js
function fn() {
  console.log(this); // 1. {a: 100}
  var arr = [1, 2, 3];

  (function() {
    console.log(this); // 2. Window
  })();

  // 普通 JS
  arr.map(function(item) {
    console.log(this); // 3. Window
    return item + 1;
  });
  // 箭头函数
  let brr = arr.map(item => {
    console.log('es6', this); // 4. {a: 100}
    return item + 1;
  });
}
fn.call({ a: 100 });
```

其实诀窍很简单，常见的基本是 3 种情况：es5 普通函数、es6 的箭头函数以及通过`bind`改变过上下文返回的新函数。

① **es5 普通函数**：

- 函数被直接调用，上下文一定是`window`
- 函数作为对象属性被调用，例如：`obj.foo()`，上下文就是对象本身`obj`
- 通过`new`调用，`this`绑定在返回的实例上

② **es6 箭头函数**： 它本身没有`this`，会沿着作用域向上寻找，直到`global` / `window`。请看下面的这段代码：

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

③ **bind 绑定上下文返回的新函数**：就是被第一个 bind 绑定的上下文，而且 bind 对“箭头函数”无效。请看下面的这段代码：

```js
function run() {
  console.log(this.a);
}

run.bind({ a: 1 })(); // output: 1

// 多次bind，上下文由第一个bind的上下文决定
run.bind({ a: 2 }).bind({ a: 1 })(); // output: 2
```

最后，再说说这几种方法的优先级：new > bind > 对象调用 > 直接调用

至此，这道题目的输出就说可以解释明白了。

### this 的指向有哪几种情况？

this 代表函数调用相关联的对象，通常也称之为执行上下文。

1. 作为函数直接调用，非严格模式下，this 指向 window，严格模式下，this 指向 undefined；
2. 在事件中，this 指向触发这个事件的对象
3. 作为某对象的方法调用，this 通常指向调用的对象。如果有 new 关键字，this 指向 new 出来的实例对象。
4. 使用 apply、call、bind 可以绑定 this 的指向。
5. 在构造函数中，this 指向新创建的对象
6. 箭头函数没有单独的 this 值，this 在箭头函数创建时确定，它与声明所在的上下文相同。

this 永远指向函数运行时所在的对象，而不是函数被创建时所在的对象。匿名函数或不处于任何对象中的函数指向 window

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

### this

> 如何正确判断 this？箭头函数的 this 是什么？
> this 是很多人会混淆的概念，但是其实它一点都不难，只是网上很多文章把简单的东西说复杂了。在这一小节中，你一定会彻底明白 this 这个概念的。

我们先来看几个函数调用的场景:

```js
function foo() {
  console.log(this.a);
}
var a = 1;
foo();

const obj = {
  a: 2,
  foo: foo,
};
obj.foo();

const c = new foo();
```

接下来我们一个个分析上面几个场景

- 对于直接调用 foo 来说，不管 foo 函数被放在了什么地方，this 一定是 window
- 对于 obj.foo() 来说，我们只需要记住，谁调用了函数，谁就是 this，所以在这个场景下 foo 函数中的 this 就是 obj 对象
- 对于 new 的方式来说，this 被永远绑定在了 c 上面，不会被任何方式改变 this
  说完了以上几种情况，其实很多代码中的 this 应该就没什么问题了，下面让我们看看箭头函数中的 this

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

首先箭头函数其实是没有 this 的，箭头函数中的 this 只取决包裹箭头函数的第一个普通函数的 this。在这个例子中，因为包裹箭头函数的第一个普通函数是 a，所以此时的 this 是 window。另外对箭头函数使用 bind 这类函数是无效的。

最后种情况也就是 bind 这些改变上下文的 API 了，对于这些函数来说，this 取决于第一个参数，如果第一个参数为空，那么就是 window。

那么说到 bind，不知道大家是否考虑过，如果对一个函数进行多次 bind，那么上下文会是什么呢？

```js
let a = {};
let fn = function() {
  console.log(this);
};
fn.bind().bind(a)(); // => ?
```

如果你认为输出结果是 a，那么你就错了，其实我们可以把上述代码转换成另一种形式

```js
// fn.bind().bind(a) 等于
let fn2 = function fn1() {
  return function() {
    return fn.apply();
  }.apply(a);
};
fn2();
```

可以从上述代码中发现，不管我们给函数 bind 几次，fn 中的 this 永远由第一次 bind 决定，所以结果永远是 window。

```js
let a = { name: 'yiliang114' };
function foo() {
  console.log(this.name);
}
foo.bind(a)(); // => 'yiliang114'
```

以上就是 this 的规则了，但是可能会发生多个规则同时出现的情况，这时候不同的规则之间会根据优先级最高的来决定 this 最终指向哪里。

首先，new 的方式优先级最高，接下来是 bind 这些函数，然后是 obj.foo() 这种调用方式，最后是 foo 这种调用方式，同时，箭头函数的 this 一旦被绑定，就不会再被任何方式所改变。

如果你还是觉得有点绕，那么就看以下的这张流程图吧，图中的流程只针对于单个规则。

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/this.jpg)

### 执行题

谁调用函数，函数体中的 this 就指向谁

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

<!-- 经典前端笔试题 -->

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
- 如果第一行的 var 改为了 let，那么答案会是 undefined， 因为 let 不会挂到 window 上

## bind, call 和 apply

### bind、call 和 apply 各自有什么区别？

**思路引导：**

首先肯定是说出三者的不同，如果自己实现过其中的函数，可以尝试说出自己的思路。然后可以聊一聊 `this` 的内容，有几种规则判断 `this` 到底是什么，`this` 规则会涉及到 `new`，那么最后可以说下自己对于 `new` 的理解。

### call, apply, bind 的区别和作用？

三个函数的作用都是用来动态改变当前函数的 this 指针， 并且三个函数的第一个参数都是新的 this 指向值

#### 区别：

1. call 和 apply 都是直接执行一个函数，执行过程中遇到 this 就改变为指向的值
2. bind 是在函数执行之前就已经强行修改了 this 的值，并且最终返回的结果是一个函数，需要手动执行
3. call 与 apply 的区别是 apply 的参数是一个数组， 而 bind 只有一个 this 参数。
   ```js
   Foo.call(this, name);
   Foo.apply(this, [name]);
   Foo.bind(this)(name);
   ```

### call，apply，bind 三者用法和区别

参数、绑定规则（显示绑定和强绑定），运行效率（最终都会转换成一个一个的参数去运行）、运行情况（`call`，`apply` 立即执行，`bind` 是`return` 出一个 `this` “固定”的函数，这也是为什么 `bind` 是强绑定的一个原因）

注：“固定”这个词的含义，它指的固定是指只要传进去了 `context`，则 `bind` 中 `return` 出来的函数 `this` 便一直指向 `context`，除非 `context` 是个变量

### call 和 apply 的区别是什么，哪个性能更好一些

1. 参数传递方式不一样：call 是需要参数按顺序传递进去，apply 接受参数数组，第二个参数可以是 Array 的实例，也可以是 arguments 对象
2. 第一个参数 this 都是指定的上下文，他可以是任何一个 JavaScript 对象
3. call 比 apply 的性能要好，平常可以多用 call, call 传入参数的格式正是内部所需要的格式
   https://github.com/Rashomon511/LearningRecord/issues/28

### call, apply, bind 区别

首先说下前两者的区别。

`call` 和 `apply` 都是为了解决改变 `this` 的指向。作用都是相同的，只是传参的方式不同。

除了第一个参数外，`call` 可以接收一个参数列表，`apply` 只接受一个参数数组。

```js
let a = {
  value: 1,
};
function getValue(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
}
getValue.call(a, 'yiliang114', '24');
getValue.apply(a, ['yiliang114', '24']);
```

#### 模拟实现 call 和 apply

可以从以下几点来考虑如何实现

- 不传入第一个参数，那么默认为 `window`
- 改变了 this 指向，让新的对象可以执行该函数。那么思路是否可以变成给新的对象添加一个函数，然后在执行完以后删除？

```js
Function.prototype.myCall = function(context) {
  var context = context || window;
  // 给 context 添加一个属性
  // getValue.call(a, 'yiliang114', '24') => a.fn = getValue
  context.fn = this;
  // 将 context 后面的参数取出来
  var args = [...arguments].slice(1);
  // getValue.call(a, 'yiliang114', '24') => a.fn('yiliang114', '24')
  var result = context.fn(...args);
  // 删除 fn
  delete context.fn;
  return result;
};
```

以上就是 `call` 的思路，`apply` 的实现也类似

```js
Function.prototype.myApply = function(context) {
  var context = context || window;
  context.fn = this;

  var result;
  // 需要判断是否存储第二个参数
  // 如果存在，就将第二个参数展开
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }

  delete context.fn;
  return result;
};
```

`bind` 和其他两个方法作用也是一致的，只是该方法会返回一个函数。并且我们可以通过 `bind` 实现柯里化。

同样的，也来模拟实现下 `bind`

```js
Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  var that = this;
  var args = [...arguments].slice(1);
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new that(...args, ...arguments);
    }
    return that.apply(context, args.concat(...arguments));
  };
};
```

### call apply bind , 区别是什么

bind 返回的是绑定 this 之后的函数，需要手动再次执行
call 与 bind 一样传入的第一个参数是 this， 后面跟的参数是函数的参数， 函数立即执行
apply 第一个参数是 this， 后面需要跟一个数组， 函数也是立即执行

### call 和 apply 的区别？

- 例子中用 add 来替换 sub，add.call(sub,3,1) == add(3,1) ，所以运行结果为：alert(4);
- 注意：js 中的函数其实是对象，函数名是对 Function 对象的引用。

```js
function add(a, b) {
  alert(a + b);
}
function sub(a, b) {
  alert(a - b);
}
add.call(sub, 3, 1);
```

### call 和 apply 有什么区别？

`.call`和`.apply`都用于调用函数，第一个参数将用作函数内 this 的值。然而，`.call`接受逗号分隔的参数作为后面的参数，而`.apply`接受一个参数数组作为后面的参数。一个简单的记忆方法是，从`call`中的 C 联想到逗号分隔（comma-separated），从`apply`中的 A 联想到数组（array）。

```js
function add(a, b) {
  return a + b;
}

console.log(add.call(null, 1, 2)); // 3
console.log(add.apply(null, [1, 2])); // 3
```

### apply 和 call 的作用和区别?

apply(thisObj[, argArray]);
call(thisObj[, arg1[, arg2[, [,...argN]]]])

都可以用来代替另一个对象调用一个方法，将一个函数的对象上下文从初始的上下文改变为由 thisObj 指定的新对象。

不同之处：

- apply 最多有两个参数，新 this 对象和一个数组 argArray(参数)。
- call 可以接受多个参数，第一个参数与 apply 一样，后面则是一串参数列表。

第一个参数与 apply 一样，后面则是一串参数列表

### 手写 call、apply 及 bind 函数

call、apply 及 bind 函数内部实现是怎么样的？

首先从以下几点来考虑如何实现这几个函数

- 不传入第一个参数，那么上下文默认为 `window`
- 改变了 `this` 指向，让新的对象可以执行该函数，并能接受参数

那么我们先来实现 `call`

```js
Function.prototype.myCall = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  context = context || window;
  context.fn = this;
  const args = [...arguments].slice(1);
  const result = context.fn(...args);
  delete context.fn;
  return result;
};
```

以下是对实现的分析：

- 首先 `context` 为可选参数，如果不传的话默认上下文为 `window`
- 接下来给 `context` 创建一个 `fn` 属性，并将值设置为需要调用的函数
- 因为 `call` 可以传入多个参数作为调用函数的参数，所以需要将参数剥离出来
- 然后调用函数并将对象上的函数删除

以上就是实现 `call` 的思路，`apply` 的实现也类似，区别在于对参数的处理，所以就不一一分析思路了

```js
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  context = context || window;
  context.fn = this;
  let result;
  // 处理参数和 call 有区别
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
};
```

`bind` 的实现对比其他两个函数略微地复杂了一点，因为 `bind` 需要返回一个函数，需要判断一些边界问题，以下是 `bind` 的实现

```js
Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  const that = this;
  const args = [...arguments].slice(1);
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new that(...args, ...arguments);
    }
    return that.apply(context, args.concat(...arguments));
  };
};
```

以下是对实现的分析：

- 前几步和之前的实现差不多，就不赘述了
- `bind` 返回了一个函数，对于函数来说有两种方式调用，一种是直接调用，一种是通过 `new` 的方式，我们先来说直接调用的方式
- 对于直接调用来说，这里选择了 `apply` 的方式实现，但是对于参数需要注意以下情况：因为 `bind` 可以实现类似这样的代码 `f.bind(obj, 1)(2)`，所以我们需要将两边的参数拼接起来，于是就有了这样的实现 `args.concat(...arguments)`
- 最后来说通过 `new` 的方式，在之前的章节中我们学习过如何判断 `this`，对于 `new` 的情况来说，不会被任何方式改变 `this`，所以对于这种情况我们需要忽略传入的 `this`

### 自封装 bind

- 因为 bind 的使用方法是 某函数.bind(某对象，...剩余参数),所以需要在 Function.prototype 上进行编程
- 将传递的参数中的某对象和剩余参数使用 apply 的方式在一个回调函数中执行即可
- 要在第一层获取到被绑定函数的 this，因为要拿到那个函数用 apply

```js
/**
 * 简单版本
 */
Function.prototype.myBind = (that, ...args) => {
  const funcThis = this;
  return function(..._args) {
    return funcThis.apply(that, args.concat(_args));
  };
};

Function.prototype.mybind = function(ctx) {
  var that = this;
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    return that.apply(ctx, args.concat(args, Array.prototype.slice.call(arguments)));
  };
};
```

```js
/**
 * 自封装bind方法
 * @param  {对象} target [被绑定的this对象， 之后的arguments就是被绑定传入参数]
 * @return {[function]}  [返回一个新函数，这个函数就是被绑定了this的新函数]
 */
Function.prototype.myBind = function(target) {
  target = target || window;
  var self = this;
  var args = [].slice.call(arguments, 1);
  var temp = function() {};
  var F = function() {
    var _args = [].slice.call(arguments, 0);
    return self.apply(this instanceof temp ? this : target, args.concat(_args));
  };
  temp.prototype = this.prototype; //维护原型关系
  F.prototype = new temp();
  return F;
};
```

### 简单实现 Function.bind 函数？

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(that) {
    var func = this,
      args = arguments;
    return function() {
      return func.apply(that, Array.prototype.slice.call(args, 1));
    };
  };
}
// 只支持 bind 阶段的默认参数：
func.bind(that, arg1, arg2)();

// 不支持以下调用阶段传入的参数：
func.bind(that)(arg1, arg2);
```

**null，undefined 的区别？**

- undefined 表示不存在这个值。
- undefined :是一个表示"无"的原始值或者说表示"缺少值"，就是此处应该有一个值，但是还没有定义。当尝试读取时会返回 undefined
- 例如变量被声明了，但没有赋值时，就等于 undefined

- null 表示一个对象被定义了，值为“空值”
- null : 是一个对象(空对象, 没有任何属性和方法)
- 例如作为函数的参数，表示该函数的参数不是对象；

- 在验证 null 时，一定要使用　=== ，因为 == 无法分别 null 和　 undefined

### 自封装 apply

- 首先要先原型上即 Function.prototype 上编程
- 需要拿到函数的引用， 在这里是 this
- 让 传入对象.fn = this
- 执行 传入对象.fn(传入参数)
- 返回执行结果

```js
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  context = context || window;
  context.fn = this;
  let result;
  // 处理参数和 call 有区别
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
};
```

### bind 函数实现

```js
// 第一版，实现改变this
Function.prototype.bind2 = function(context) {
  var self = this; // 需要改变this的函数
  var partArgs = Array.prototype.slice.call(arguments, 1);
  return function() {
    var args = partArgs.concat(Array.prototype.slice.call(arguments, 0));
    return self.apply(context, args);
  };
};
// 第二版，当返回的函数被当作构造函数调用时，this指向构造对象
Function.prototype.bind2 = function(context) {
  var self = this; // 需要改变this的函数
  var partArgs = Array.prototype.slice.call(arguments, 1);
  var bound = function() {
    var args = partArgs.concat(Array.prototype.slice.call(arguments, 0));
    return self.apply(this instanceof bound ? this : context, args);
  };
  var fNop = function() {};
  fNop.prototype = self.prototype;
  bound.prototype = new fNop();
  return bound;
};
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
