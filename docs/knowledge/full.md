---
title: Full FE Note
date: 2021-03-04
draft: true
---

## 基础

### 闭包

闭包就是函数中的函数，里面的函数可以访问外面函数的变量。作用一般是封装私有化变量，防止了全局污染，缓存数据等。在浏览器端可以通过强制刷新销毁闭包，但是由于 node 的内存限制和累积效应，可能会造成进程退出甚至服务器沓机。

### 基本数据类型

7 种。 number, boolean, string, undefined, null, symbol, bigint

typeof 能够得到的值, 8 种: number, boolean, string, undefined, symbol, object, function, bigint

### 判断数据类型

1. `typeof`
2. `instanceof`
3. `Object.prototype.toString.call()`
4. 对于数组的判断，还可以使用`Array.isArray()`

性能方面：判断数据 Array.isArray() 性能最好，instanceof 次之，Object.prototype.toString.call() 第三
功能方面：`Object.prototype.toString.call()` 所有的类型都可以判断, 可以理解为是 100% 准确。

`Object.prototype.toString.call()` 能够得到的值, 8 种: number, boolean, string, undefined, symbol, object, function, bigint。

### 原型

- 所有的引用类型（数组、对象、函数），都有一个`__proto__`属性，属性值是一个普通的对象。
- 所有的函数（除了箭头函数），都有一个 `prototype` 属性，属性值也是一个普通的对象。
- 所有的引用类型（数组、对象、函数），`__proto__`属性值指向它的构造函数的 `prototype` 属性值。

**注**：ES6 的箭头函数没有 `prototype` 属性，但是有`__proto__`属性。

```js
const obj = {};
// 引用类型的 __proto__ 属性值指向它的构造函数的 prototype 属性值
console.log(obj.__proto__ === Object.prototype); // output: true
```

### 原型链

当试图得到一个对象的某个属性的时候，如果这个对象本身没有这个属性，那么就会去它的 `__proto__` 中（即它的构造函数的 prototype 中） 寻找。如果它的构造函数的原型链上也没有的话，就再往构造函数的隐式原型链上去寻找，一直到找不到为止。 这个链式结构叫做原型链。

最顶层是 `Object.prototype.__proto__ === null`

### instanceof 原理与实现

`instanceof`是通过原型链来进行判断的，所以只要不断地通过访问`__proto__`，就可以拿到构造函数的原型`prototype`, 直到`null`停止。

```js
/**
 * 判断 left 是不是 right 类型的对象
 * @param {*} left
 * @param {*} right
 * @return {Boolean}
 */
function instanceof(left, right) {
  let prototype = right.prototype;
  left = left.__proto__;
  while (true) {
    if (left === null || left === undefined) {
      return false;
    }
    if (left === prototype) {
      return true;
    }
    left = left.__proto__;
  }
}
```

### ES5 继承

**原型链继承**

缺点：无法向父类构造函数中传递参数；子类原型链上定义的方法有先后顺序问题。需要注意的是 js 中交换原型链，均需要修复`prototype.constructor`指向问题。

```js
function Animal(species) {
  this.species = species;
}
Animal.prototype.func = function() {
  console.log('Animal');
};

function Cat() {}
/**
 * func 方法是无效的, 因为后面原型链被重新指向了 Animal 实例
 */
Cat.prototype.func = function() {
  console.log('Cat');
};

Cat.prototype = new Animal();
Cat.prototype.constructor = Cat; // 修复: 将 Cat.prototype.constructor 重新指向本身
```

**组合继承**

结合绑定构造函数和原型链继承 2 种方式，缺点是：调用了 2 次父类的构造函数。

```js
function Animal(species) {
  this.species = species;
}
Animal.prototype.func = function() {
  console.log('Animal');
};

function Cat() {
  Animal.apply(this, arguments);
}

Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
```

**寄生组合继承**

改进了组合继承的缺点，只需要调用 1 次父类的构造函数。**它是引用类型最理想的继承范式**。

```js
/**
 * 寄生组合继承的核心代码
 * @param {Function} Sub 子类
 * @param {Function} Parent 父类
 */
function inheritPrototype(Sub, Parent) {
  // 拿到父类的原型
  let prototype = Object.create(Parent.prototype);
  // 改变 constructor 指向
  prototype.constructor = Sub;
  // 父类原型赋给子类
  Sub.prototype = prototype;
}

function Animal(species) {
  this.species = species;
}
Animal.prototype.func = function() {
  console.log('Animal');
};

function Cat() {
  Animal.apply(this, arguments); // 只调用了 1 次构造函数
}

inheritPrototype(Cat, Animal);
```

### ES6 继承

本质还是语法糖，还是使用 prototype

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log('eat');
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);
    this.name = name;
  }
  bark() {
    console.log('bark');
  }
}

const dog = new Dog('哈士奇');
console.log(typeof Dog.prototype); // animal 实例 object
console.log(typeof Dog.prototype.constructor); // Class Dog, 还是一个构造函数

// 这种语法糖形式，看起来和实际原理不一样的东西
typeof Animal; // "function"
// 构造函数的（显式）原型里面默认有一个 constructor 属性，等于构造函数本身
Animal === Animal.prototype.constructor; // true
// 每一个 new 出来的实例，都拥有一个隐式原型，等于构造函数的显式原型
animal.__proto__ === Animal.prototype; // true
```

### 作用域和作用域链

**作用域**

ES5 有”全局作用域“和”函数作用域“。ES6 的`let`和`const`使得 JS 用了”块级作用域“。为了解决 ES5 的全局冲突，一般都是闭包（立即执行函数），将变量封装到函数作用域。

**作用域链**

当前作用域没有找到定义，继续向父级作用域寻找，直至全局作用域。**这种层级关系，就是作用域链**。

### this 有几种使用场景

this 的四种用法：

1. 单纯的函数调用，这是默认绑定
2. 作为对象方法调用，这是隐式绑定
3. 通过 apply.call.bind 方法调用，这是显示绑定，(call，apply 传参方式不同，都是立即执行，bind 不是立即执行，而是返回一个函数)
4. 通过 new 绑定，最终指向的是 new 出来的对象

优先级： new > 显示 > 隐式 > 默认

### 普通函数和箭头函数的 this

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

### apply、call 和 bind 的区别

1. bind 返回的是一个函数，需要再次手动执行。
2. call 第二个参数以后的参数都跟调用的函数意义对应，而使用 apply 的时候，函数的参数都是放在数组中的，作为第二个参数。

### JS 事件流

#### 事件冒泡和事件捕获

事件流分为：**冒泡**和**捕获**，顺序是先捕获再冒泡。

**事件冒泡**：子元素的触发事件会一直向父节点传递，一直到根结点停止。此过程中，可以在每个节点捕捉到相关事件。可以通过`stopPropagation`方法终止冒泡。

**事件捕获**：和“事件冒泡”相反，从根节点开始执行，一直向子节点传递，直到目标节点。

`addEventListener`给出了第三个参数同时支持冒泡与捕获：默认是`false`，事件冒泡；设置为`true`时，是事件捕获。

#### DOM0 级 和 DOM2 级

**DOM2 级**：前面说的`addEventListener`，它定义了`DOM`事件流，捕获 + 冒泡。

**DOM0 级**：

- 直接在 html 标签内绑定`on`事件
- 在 JS 中绑定`on`系列事件

**注意**：现在通用`DOM2`级事件，优点如下：

1. 可以绑定 / 卸载事件
2. 支持事件流
3. 冒泡 + 捕获：相当于每个节点同一个事件，至少 2 次处理机会
4. 同一类事件，可以绑定多个函数

#### DOM 事件的级别

1. DOM0

   ```
   element.onclick = function(){}
   ```

2. DOM2

   ```
   element.addEventListener('click', function(){}, flase) // bool 指定冒泡还是捕获
   ```

3. DOM3

   ```
   element.addEventListener('keyup', function(){}, false) // dom3 增加了很多事件类型
   ```

#### DOM 事件模型

指的就是冒泡和捕获。冒泡是目标元素向上，捕获是从上往下

#### DOM 事件流

事件流是一个事件发生之后如何进行传递的过程。一个完整的事件流分三个阶段：捕获、目标阶段、冒泡。

#### 描述 DOM 事件捕获的具体流程

捕获是从上到下的过程。 第一个接触到的对象是 window, 接着是 document, 再是 html 标签，接着是 body 元素，再一层一层父级元素，最后到目标元素。获取 body 标签 `document.body` ， 或者 html 标签 `document.documentElement`.

#### Event 对象的常见应用

```
event.preventDefault() // 阻止默认事件，比如阻止 a 标签的跳转行为

event.stopPropagation() // 阻止冒泡。

event.stopImmediatePropagation() // 如果一个对象绑定了两个函数，一般来说两个函数会被依次执行。 如果在回调函数 A 中调用 stopImmediatePropagation 之后就不会再执行回调函数 B 了。

// 事件委托（代理） 只做一次绑定。
event.currentTarget // 当前绑定事件的元素
event.target // 当前被点击的元素
```

#### 自定义事件

如何自定义事件， 自动触发。（ vue 里面以及普通 js 中 ？ ）

```
var evt = new Event('custom')
// 在 dom 上注册事件
element.addEventListener('custom', function(){
	console.log('custom')
})
// 自定义触发事件
element.dispatch('evt')
```

Event 和 CustomEvent 的用法都是一致的，不过后者可以在后面跟随一个 obj 传需要传的参数。

### Event Loop

#### 单线程

> 题目：讲解下面代码的执行过程和结果。

```js
var a = true;
setTimeout(function() {
  a = false;
}, 100);
while (a) {
  console.log('while执行了');
}
```

这段代码会一直执行并且输出 "while..."。**JS 是单线程的，先跑执行栈里的同步任务，然后再跑任务队列的异步任务**。

#### 执行栈和任务队列

> 题目：说一下 JS 的 Event Loop。

简单总结如下：

1. JS 是单线程的，其上面的所有任务都是在两个地方执行：**执行栈和任务队列**。前者是存放同步任务；后者是异步任务有结果后，就在其中放入一个事件。
2. 当执行栈的任务都执行完了（栈空），js 会读取任务队列，并将可以执行的任务从任务队列丢到执行栈中执行。
3. 这个过程是循环进行，所以称作`Loop`。

### 异步 与 Promise

- promise 解决的问题
- promise 与事件循环，settimeout 以及 react 的下一次循环

如果理解 js 的单线程
什么是任务队列
event-loop、事件委托和使用
微任务和宏任务
Promise 的执行顺序

promise 出现的目的是解决回调地狱。

普通的异步加载过程：

```js
function loadImg(src, callback, fail) {
  var img = document.createElement('img')
  img.onload = funciton() {
    callback(img)
  }
  img.onerror = function() {
    fail()
  }
  img.src = src
}

var src = 'https://xxx.jpg'
loadImg(src, function(img) {
  console.log(img.width)
}, function() {
  console.log('fail')
})
```

promise 的语法：

```js
function loadImg(src) {
  return new Promise((resolve, reject) => {
    var img = document.createElement('img');
    img.onload = function() {
      resolve(img);
    };
    img.onerror = function() {
      reject();
    };
    img.src = src;
  });
}
var src =
  'https://ss0.bdstatic.com/6KYTfyqn1Ah3otqbppnN2DJv/zheguilogo/8b83961cd845269d7a3677ef9efa0751_originalsize.jpeg';
loadImg(src)
  .then(
    img => {
      console.log(img.width);
    },
    () => {
      console.log('fail');
    },
  )
  .then(img => {
    // promise 的链式调用，需要前面的 then 中 return 出值或者一个新的 promise
    console.log(img);
  });
```

### 浅拷贝

- `Object.assign`
- 展开运算符 `...`
- for 循环方式， 手动复制属性
- arr.slice、arr.concat 等

### 深拷贝

- `JSON.parse(JSON.stringify(src))`：这种方法有局限性，如果属性值是函数或者一个类的实例的时候，无法正确拷贝
- 借助 HTML5 的`MessageChannel`：这种方法有局限性，当属性值是函数的时候，会报错
- for 循环手写

### 跨域

普通请求

跨域解决方案

#### 什么是同源策略及限制

协议、端口、域名有一个不一样就是不同源

#### 跨域通信的几种方式

1. JSONP

2. Hash url 中 ## 号后面的内容， hash 修改页面不刷新， search 修改会刷新页面

   利用 window.onhashChange 获取修改的 hash

3. postMessage （HTML5 新增）

4. WebSocket

5. CORS （添加 http 请求头允许跨域通信）

跨域脚本攻击

### Proxy

### 错误监控

### 模块化

CommonJS 和 ES Module 区别，amd cmd， seajs 是什么，seajs 如何加载 vuejs 的项目

### 其他

getBoundingClientRect 获取的 top 和 offsetTop 获取的 top 区别

浏览器兼容性举例
正向代理反向代理

## CSS

CSS 盒模型， box-sizing。
上下左右垂直居中
flex
CSS 设置高度等于宽度的 3/4
rem em px 单位的区别。 em 相对于父元素，rem 相对于根元素。
margin 的合并 高度塌陷的问题，如何解决
bfc
纯 css 换行

## 网络

HTTP 强缓存和协商缓存，以及怎么设置
三次握手、四次挥手。三次握手为什么第二次握手时需要发送多一个 SYN 包
http2.0 新特性
https 是什么，有点缺点
常见状态码 200 和 304
post 与 get
url 输入到显示的过程
浏览器页面渲染的流程是什么
cookie
HTTP 请求头的组成
websocket 的使用场景

### 前后端如何进行通信

ajax （同源下的策略）
websocket （不限制是否同源）
cors （支持跨域通信也支持跨域通信）

### HTTP 协议类

#### HTTP 协议的主要特点

简单快速、灵活、无连接、无状态（后面两个重要）

#### HTTP 报文的组成部分

http 就是建立在 tcp 连接之上的应用（层？）http 报文是由请求报文和相应报文组成的。

请求报文：

    1. 请求行。请求行包含 http 方法，页面地址，http 协议以及版本

2. 请求头。 一些 key-value 值告诉服务端需要什么内容 3. 空行。分离请求头和请求体 4. 请求体

响应报文：

1. 状态行
2. 响应头
3. 空行
4. 响应体

#### HTTP 方法

GET, POST, PUT, DELETE, HEAD

HEAD 方法用于获取报文首部

#### POST 和 GET 的区别

1. GET 在浏览器回退时是无害的，而 POST 会再次提交请求 （记）
2. GET 产生的 URL 地址可以被收藏，而 POST 不可以
3. GET 请求会被浏览器主动缓存，而 POST 不会，除非手动设置 （记）
4. GET 请求只能进行 URL 编码，而 POST 支持多种编码方式
5. GET 请求参数会被完整保存在浏览器的历史记录里，而 POST 中的参数不会被保留 （记）
   为了防止 CSRF 攻击好多人都会把 GET 请求改成 POST 请求
6. GET 请求在 URL 中传送的参数是有长度限制的（基本是 2 kb，不同浏览器不一样，因为 http 协议对长度是有限制的，会被截断），而 POST 没有限制 （记）
7. 对参数的数据类型，GET 只接受 ASCII 字符，而 POST 没有限制
8. GET 比 POST 更不安全，因为参数直接暴露在 URL 上，所以不能用来传入敏感信息
9. GET 参数通过 URL 传递，POST 放在 Request Body 中 （记）

#### HTTP 状态码

1xx: 指示信息
2xx: 成功 200 206
3xx: 重定向 301 永久重定向 302 临时重定向 304 缓存
4xx: 客户端错误 400 401 未授权 403 资源禁止被访问 404 资源不存在
5xx: 服务端错误 500 503

#### 什么是持久连接

我们知道 HTTP 协议采用“请求-应答”模式，当使用普通模式，即非 Keep-Alive 模式时，每个请求/应答客户和服务器都要新建一个连接，完成之后立即断开连接（HTTP 协议为无连接的协议）；当使用 Keep-Alive 模式（又称持久连接、连接重用）时，Keep-Alive 功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive 功能避免了建立或者重新建立连接。

http 1.1 之后支持

### TCP 三次握手

1. 客户端发送一个 syn（同步）包（syn=x）给服务器，进入 SYN_SEND 状态，等待服务器确认
2. 服务端收到客户端发送的同步包，确认客户端的同步请求（ack=x+1）,同时也发送一个同步包，也就是一个 ACK 包+SYN 包服务器进入 SYN_RECV 状态
3. 客户端收到服务器的 SYN+ACK 包，向服务器发送一个确认包，此包发送完毕，客户端和服务器进入 ESTABLISHED 状态，完成三次握手

不是两次是为了防止已经失效的连接请求报文段突然又传送到了服务端，因而产生错误，比如有一个因网络延迟的请求发送到了服务端，服务端收到这个同步报文之后进行确认，如果此时是两次握手，那么此时连接建立，但是客户端并没有发出建立连接的请求，服务端却一直等待客户端发送数据，这样服务端的资源就白白浪费了。

不是四次的话是因为完全没有必要，三次已经足够了

### TCP 四次挥手

1. 主动关闭方发送一个 FIN 包，用来关闭主动关闭方到被动关闭方的数据传送，也就是告诉另一方我不再发送数据了，但此时仍可以接收数据
2. 被动关闭方收到 FIN 包之后，发送一个确认（ACK）包给对方，确认序号为收到序号+1（与 SYN 相同，一个 FIN 占用一个序号）
3. 被动关闭方发送一个 FIN 包，告诉对方不再发送数据
4. 主动关闭方收到 FIN 包之后，发送一个 ACK 包给对方，确认序号为收到序号+1，至此完成四次挥手

### 输入一个 url 的过程

首先是查找浏览器缓存, 浏览器会缓存 DNS 记录一段时间。系统缓存 如果在浏览器缓存里没有找到需要的记录，浏览器会做一个系统调用来查找这个网址的对应 DNS 信息。 路由器缓存 如果在系统缓存里没有找到找到对应的 IP，请求会发向路由器，它一般会有自己的 DNS 缓存。

1. 浏览器查找该域名的 IP 地址
2. 浏览器根据解析得到的 IP 地址向 web 服务器发送一个 HTTP 请求
3. 服务器收到请求并进行处理
4. 服务器返回一个响应
5. 浏览器对该响应进行解码，渲染显示。
6. 页面显示完成后，浏览器发送异步请求。

从 HTTP 请求回来 ，产生流式的数据，DOM 的构建、CSS 计算、渲染、绘制，都是尽可能的流式处理前一步的产出，不需要等待上一步完全接受才开始处理，所以我们在浏览网页的时候，才会逐步出现页面

浏览器的工作流程大致就是：构建 DOM 树-构建 CSSOM-构建渲染树-布局-绘制

## 框架(Vue)

对 MVC MVP MVVM 的了解
什么是 vdom 为什么要使用 vdom

vue.js 和 react.js 异同点，如果让你选框架，你怎么怎么权衡这两个框架，分析一下。
响应式
计算属性是如何做到属性值改变才重新计算（缓存）
Vue 的生命周期
vue 数据(事件)更新机制
vue 双向绑定
vue-router 的监听原理
vuex 的原理 ？对 vuex 的理解

为什么 for 循环的 id 不能使用 index
diff 算法

router 的哈希模式与 history 有什么不同，hash 值能被监听改变么？

vue 如何实现代码的复用
几种通信原理

vue@2 与 vue@3 做了哪些升级
vue@3 支持到什么版本

vite 的简单原理
omiv 的原理
omi 的简单原理

### react

- 绑定 this
- setState
- 事件原理， 冒泡、捕获
- hooks
- diff 原理
- fiber

## 前端安全

1. CSRF

   跨站请求伪造。条件： 1. 用户在 A 网站确实登录过。 2. A 网站接口存在漏洞，会下发登录态。

   防御：1. token 验证 2. Referer 验证（页面来源验证） 3. 隐藏令牌

2. XSS

## 浏览器

操作 DOM 比较耗费资源，请问怎么减少消耗
简化操作 DOM 的 API 或者库
VDOM
setTimeout 设定为 0ms 会直接执行吗，如果设置为 5s 会一定在 5s 后执行吗
JS 延后加载， 怎么缩短 JS 的加载时间

操作 DOM 树为什么比操作 VDOM 树要慢

- sessionStorage , localStorage , cookie , Web Storage
- 首次进入的时候，
- 缓存
- 请指出 document load 和 document ready 的区别
- Doctype

事件冒泡，捕获，事件代理
浏览器事件循环
跨域的几种方式，cors 的头，需要设置哪些
什么是 DOCTYPE 及作用
浏览器的渲染过程
DOM 事件中 target 和 currentTarget 的区别
重绘和回流

### 渲染机制类

解析 HTML 的过程
加载 JS 和 CSS 会阻塞浏览器的渲染吗
下载 JS 和 CSS 会阻塞吗### DOM 事件类

## 工程化

webpack 的插件和 loader， 写过什么插件，怎么处理的？

### webpack

Babel 的一个插件：transform-runtime 以及 stage-2，你说一下他们的作用。
babel 把 ES6 转成 ES5 或者 ES3 之类的原理是什么，有没有去研究
webpack 配置用到 webpack.optimize.UglifyJsPlugin 这个插件，有没有觉得压缩速度很慢，有什么办法提升速度。
webpack 的 loader
有没有去研究 webpack 的一些原理和机制，怎么实现的

- 对 webpack 有了解吗？chunk、bundle 和 module 有什么区别

#### loader

引入的小图片为什么被渲染成了 base64？ 这个是 webpack 里面的对应插件处理的.对于小于多少 K 以下的图片(规定的格式)直接转为 base64 格式渲染;具体配置在 webpack.base.conf.js 里面的 rules 里面的 url-loader 这样做的好处:在网速不好的时候先于内容加载和减少 http 的请求次数来减少网站服务器的负担

### rollup.js

vue react 都是通过 rollup 来打包的，一般来说会被打包成比较小的 js 文件，能够对一些冗余代码做一定的优化。

rollup 功能单一，一般来说只能处理模块化打包 （只能处理 js 文件）。webpack 功能强大，能够处理几乎所有文件。

## 前端性能优化

- code split
- 首屏？
- 骨架屏
- 浏览器及性能
  - 谈一下你所知道的页面性能优化方法？
    - 这些优化方法背后的原理是什么？
    - 除了这些常规的，你还了解什么最新的方法么？
  - 如何分析页面性能？

### vue-lazy 的原理

### 虚拟列表实现的原理

## 手写代码

防抖、节流
深拷贝
手写从 url 中获取参数
手写一个事件类
全文单词首字母大写（正则）
手写的 ajax

### 手写的 ajax TODO:

手写的 ajax 是否兼容 IE ， IE 下面的 ajax 与普通浏览器的 ajax 对象不一样

### 手写 Promise

## 项目

说一下你项目中用到的技术栈，以及觉得得意和出色的点，以及让你头疼的点，怎么解决的。
说一下项目中觉得可以改进的地方以及做的很优秀的地方？
准备几个项目的难点以及解决方案
介绍做过的项目
遇到的问题以及解决方案
性能优化的方案
