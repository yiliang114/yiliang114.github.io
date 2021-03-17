---
title: Full FE Note
date: 2021-03-04
draft: true
---

## 基础

- 原型链
- 继承的方式
- new 做了什么操作
- this 指向
- 事件循环模型，具体的代码卡死执行？
- 手写深拷贝函数（包含环的情况）
- es6 的新特性
- var 与 const/let 的区别
- vue@2 与 vue@3 的差别， 性能如何提升的，静态标记？
- vue@2 与 vue@3 的响应式原理差别？
- 懒加载的原理
- 大数据列表的虚拟列表原理
- SSR 是如何做的？
- Omi 的原理， Omiv 可以监听数组下标变化的原理

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

### apply、call 和 bind 的区别

1. bind 返回的是一个函数，需要再次手动执行。
2. call 第二个参数以后的参数都跟调用的函数意义对应，而使用 apply 的时候，函数的参数都是放在数组中的，作为第二个参数。

### JS 事件流

#### DOM 事件流

一个完整的事件流分三个阶段：捕获、目标阶段、冒泡。

#### 事件冒泡和事件捕获

事件流分为：**冒泡**和**捕获**，顺序是先捕获再冒泡。冒泡是目标元素向上，捕获是从上往下。

**事件冒泡**：子元素的触发事件会一直向父节点传递，一直到根结点停止。此过程中，可以在每个节点捕捉到相关事件。可以通过 `stopPropagation` 方法终止冒泡。

**事件捕获**：和“事件冒泡”相反，从根节点开始执行，一直向子节点传递，直到目标节点。

`addEventListener`给出了第三个参数同时支持冒泡与捕获：默认是`false`，事件冒泡；设置为`true`时，是事件捕获。

#### 描述 DOM 事件捕获的具体流程

捕获是从上到下的过程。 第一个接触到的对象是 window, 接着是 document, 再是 html 标签，接着是 body 元素，再一层一层父级元素，最后到目标元素。获取 body 标签 `document.body` ， 或者 html 标签 `document.documentElement`.

#### DOM 事件的级别

**DOM3 级**：增加了很多事件类型
**DOM2 级**：前面说的`addEventListener`，它定义了`DOM`事件流，捕获 + 冒泡。
**DOM0 级**：

- 直接在 html 标签内绑定`on`事件
- 在 JS 中绑定`on`系列事件

**注意**：现在通用`DOM2`级事件，优点如下：

1. 可以绑定 / 卸载事件
2. 支持事件流
3. 冒泡 + 捕获：相当于每个节点同一个事件，至少 2 次处理机会
4. 同一类事件，可以绑定多个函数

#### Event 对象的常见应用

```js
event.preventDefault(); // 阻止默认事件，比如阻止 a 标签的跳转行为
event.stopPropagation(); // 阻止冒泡。

event.stopImmediatePropagation(); // 如果一个对象绑定了两个函数，一般来说两个函数会被依次执行。 如果在回调函数 A 中调用 stopImmediatePropagation 之后就不会再执行回调函数 B 了。

// 事件委托（代理） 只做一次绑定。
event.currentTarget; // 当前绑定事件的元素
event.target; // 当前被点击的元素
```

#### 事件委托和使用

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

#### 微任务和宏任务

异步事件会被放置到对应的宏任务队列或者微任务队列中去，当执行栈为空的时候，主线程会首先查看微任务中的事件，如果微任务不是空的那么执行微任务中的事件，如果没有，则在宏任务中取出最前面的一个事件。把对应的回调加入当前执行栈...如此反复，进入循环。

浏览器端事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。**宏任务队列可以有多个，微任务队列只有一个**。

- 常见的 macro-task 比如：setTimeout、setInterval、setImmediate、script（整体代码）、 I/O 操作、UI 渲染等。
- 常见的 micro-task 比如: new Promise().then(回调)、MutationObserver(html5 新特性)、process.nextTick 等。

Node 中的 Event Loop：

分为 6 个阶段，它们会按照**顺序**反复运行。timer, I/O, (idle, prepare), poll(循环 1, 2), check, close callbacks

#### setTimeout

setTimeout 设定为 0ms 会直接执行吗，如果设置为 5s 会一定在 5s 后执行吗

### 异步 与 Promise

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

协议、端口、域名都一样才是同源

跨域限制范围

- `Cookie`、`LocalStorage`和`IndexDB`无法获取。
- 无法获取和操作`DOM`。
- 不能发送`ajax`请求。我们要注意，`ajax`只适合**同源**的通信。

#### 跨域通信的几种方式

1. JSONP
2. Hash url 中 ## 号后面的内容， hash 修改页面不刷新，利用 window.onhashChange 获取修改的 hash
3. postMessage
4. WebSocket
5. 通过修改 `document.domain` 来跨子域
6. 使用 `window.name` 来进行跨域
7. CORS （添加 http 请求头允许跨域通信）

#### CORS

主要的字段

- Access-Control-Allow-Origin
- Access-Control-Allow-Credentials
- Access-Control-Allow-Methods
- Access-Control-Allow-Headers 实际请求将携带的自定义请求首部字段
- Access-Control-Max-Age 用来指定本次预检请求的有效期，单位为秒。

#### Options 请求

第一次发送了一个 Options 请求，询问服务器是否支持修改的请求头，如果服务器支持，则在第二次中发送真正的请求。

#### 简单请求

请求方式使用下列方法之一：

- GET
- HEAD
- POST

Content-Type 的值仅限于下列三者之一：

- text/plain
- multipart/form-data
- application/x-www-form-urlencoded

对于简单请求，浏览器会直接发送 CORS 请求，具体说来就是在 header 中加入 origin 请求头字段。同样，在响应头中，返回服务器设置的相关 CORS 头部字段，Access-Control-Allow-Origin 字段为允许跨域请求的源。

### 错误监控

## CSS

### 盒模型

盒模型包含： 内容(content)、填充(padding)、边界(margin)、 边框(border)。

有两种盒模型， IE 盒子模型、标准 W3C 盒子模型；

区 别： IE 盒子模型的 content 部分把 border 和 padding 计算了进去;

box-sizing 的默认属性是 content-box。

```css
/* 设置当前盒子为 标准盒模型（默认） */
box-sizing: content-box;

/* 设置当前盒子为 IE盒模型 */
box-sizing: border-box;
```

### 上下左右垂直居中

### flex

### rem em px 单位的区别。 em 相对于父元素，rem 相对于根元素。

### margin 的合并 高度塌陷的问题，如何解决

### BFC

### 清除浮动

## 网络

### http2.0 新特性

1. 二进制传输
2. 多路复用
3. Header 压缩
4. 主动推送

### https 是什么，有点缺点

HTTPS = HTTP + SSL

### HTTP 报文的组成部分

http 就是建立在 tcp 连接之上的应用层, http 报文是由请求报文和相应报文组成的。

请求报文：

1. 请求行。请求行包含 http 方法，页面地址，http 协议以及版本
2. 请求头。 一些 key-value 值告诉服务端需要什么内容
3. 空行。分离请求头和请求体
4. 请求体

响应报文：

1. 状态行
2. 响应头
3. 空行
4. 响应体

### HTTP 方法

GET, POST, PUT, DELETE, HEAD. HEAD 方法用于获取报文首部

### POST 和 GET 的区别

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

### HTTP 状态码

1xx: 指示信息
2xx: 成功 200 206
3xx: 重定向 301 永久重定向 302 临时重定向 304 缓存
4xx: 客户端错误 400 401 未授权 403 资源禁止被访问 404 资源不存在
5xx: 服务端错误 500 503

### 强缓存和协商缓存

浏览器的三级缓存原理：

1. 先去内存看，如果有，直接加载
2. 如果内存没有，择取硬盘获取，如果有直接加载
3. 如果硬盘也没有，那么就进行网络请求
4. 加载到的资源缓存到硬盘和内存

#### 强缓存 200 from cached

Expires 值是时间点
Cache-Control 值是 max-age: xxx（优先级更高）

#### 协商缓存 304 Not Modified

Last-Modified
If-Modified-Since 值是二进制时间

或者

ETag
If-None-Match 值是 hash 唯一标识串

#### 为什么要有 ETag

`HTTP1.1` 中 `ETag` 的出现主要是为了解决几个 `Last-Modified` 比较难解决的问题：

- 一些文件也许会周期性的更改，但是内容并不改变(仅仅改变的修改时间)，这个时候我们并不希望客户端认为这个文件被修改了，而重新 GET；
- 某些文件修改非常频繁，比如在秒以下的时间内进行修改，(比方说 1s 内修改了 N 次)，`If-Modified-Since` 能检查到的粒度是秒级的，使用 `ETag` 就能够保证这种需求下客户端在 1 秒内能刷新 N 次 cache。
- 某些服务器不能精确的得到文件的最后修改时间。

### 前后端如何进行通信

ajax （同源下的策略）
websocket （不限制是否同源）
cors （支持跨域通信也支持跨域通信）

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

### 持久连接 Keep-Alive

我们知道 HTTP 协议采用“请求-应答”模式，当使用普通模式，即非 Keep-Alive 模式时，每个请求/应答客户和服务器都要新建一个连接，完成之后立即断开连接（HTTP 协议为无连接的协议）；当使用 Keep-Alive 模式（又称持久连接、连接重用）时，Keep-Alive 功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive 功能避免了建立或者重新建立连接。

http 1.1 之后支持

## 框架(Vue)

### Vue3 的响应式原理

### MVVM

- `View`：界面
- `Model`：数据模型
- `ViewModel`：作为桥梁负责沟通 `View` 和 `Model`

在 MVVM 中，UI 是通过数据驱动的，数据一旦改变就会相应的刷新对应的 UI，UI 如果改变，也会改变对应的数据。

### vdom

vdom 是对类似 HTML 节点的一层描述。采用 Virtual DOM 则会对需要修改的 DOM 进行比较（DIFF），从而只选择需要修改的部分。也因此对于不需要大量修改 DOM 的应用来说，采用 Virtual DOM 并不会有优势。

### vue 为什么采用 vdom？

引入 `Virtual DOM` 在性能方面的考量仅仅是一方面。

- 性能受场景的影响是非常大的，不同的场景可能造成不同实现方案之间成倍的性能差距，所以依赖细粒度绑定及 `Virtual DOM` 哪个的性能更好还真不是一个容易下定论的问题。
- `Vue` 之所以引入了 `Virtual DOM`，更重要的原因是为了解耦 `HTML`依赖，这带来两个非常重要的好处是：

> - 不再依赖 `HTML` 解析器进行模版解析，可以进行更多的 `AOT` 工作提高运行时效率：通过模版 `AOT` 编译，`Vue` 的运行时体积可以进一步压缩，运行时效率可以进一步提升；
> - 可以渲染到 `DOM` 以外的平台，实现 `SSR`、同构渲染这些高级特性，`Weex`等框架应用的就是这一特性。

综上，`Virtual DOM` 在性能上的收益并不是最主要的，更重要的是它使得 `Vue` 具备了现代框架应有的高级特性。

### Vue 和 React 之间的区别

1. 数据 Vue 双向绑定， React 单向数据流。
2. Vue 默认使用 template 模板，React 使用 JSX。
3. 改变数据方式不同，Vue 直接修改状态，React 需要使用 `setState` 来改变状态。Vue 页面更新渲染已经是最优的了，但是 React 还是需要用户手动去优化这方面的问题。
4. 开发模式：React 在 view 层侵入性还是要比 Vue 大很多的,React 严格上只针对 MVC 的 view 层，Vue 则是 MVVM 模式的一种实现

### 几种实现双向绑定的做法

- 发布者-订阅者模式（backbone.js）
- 脏检查 (angular.js)
- 数据劫持（vue.js） 是采用数据劫持结合发布者-订阅者模式的方式，通过`Object.defineProperty()`来劫持各个属性的`setter`，`getter`，在数据变动时发布消息给订阅者，触发相应的监听回调。

#### Object.defineProperty

属性描述符包括：configurable(可配置性相当于属性的总开关，只有为 true 时才能设置，而且不可逆)、Writable(是否可写，为 false 时将不能够修改属性的值)、Enumerable(是否可枚举，为 false 时 for..in 以及 Object.keys()将不能枚举出该属性)、get(一个给属性提供 getter 的方法)、set(一个给属性提供 setter 的方法)

```js
var o = { name: 'vue' };
Object.defineProperty(o, 'age', {
  value: 3,
  writable: true, //可以修改属性a的值
  enumerable: true, //能够在for..in或者Object.keys()中枚举
  configurable: true, //可以配置
});
```

### Vue 的响应式

1. 需要 observe 的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter 和 getter 这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化。
2. compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3. Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要做的事情是:
   1. 在自身实例化时往属性订阅器(dep)里面添加自己
   2. 自身必须有一个 update()方法
   3. 待属性变动 dep.notify()通知时，能调用自身的 update() 方法，并触发 Compile 中绑定的回调，则功成身退。
4. MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据 model 变更的双向绑定效果。

### 计算属性是如何做到属性值改变才重新计算（缓存）

1. 初始化 props 和 data， 使用 `Object.defineProperty` 把这些属性全部转为 `getter/setter`。
2. 初始化 `computed`, 遍历 `computed` 里的每个属性，每个 computed 属性都是一个 watch 实例。每个属性提供的函数作为属性的 getter，使用 Object.defineProperty 转化。
3. `Object.defineProperty getter` 依赖收集。用于依赖发生变化时，触发属性重新计算。
4. 若出现当前 computed 计算属性嵌套其他 computed 计算属性时，先进行其他的依赖收集

### diff 算法

- 同个节点，会用 patch 进行打补丁操作
- 不同节点，会进行 insert 和 delete 操作
- 判断为一样的类型
  - key
  - tag
  - 如果是 input 标签的话，需要 type 也一样。

### 为什么 for 循环的 id 不能使用 index

key 的作用是让 vue 精准的追踪到每一个元素，高效的更新虚拟 DOM。

循环比较虚拟 dom， 会一层一层进行遍历。

通俗描述原因： 本来不一样的东西，现在变成一样了。。。。 因为 key 变成一样了，就判断是同个东西

场景：

1. 中间插入节点
2. 中间删除节点

会徒增很多的比较。

### 异步更新队列

vue 更新 dom 时是异步执行的。数据变化、更新是在主线程中同步执行的；在侦听到数据变化时，watcher 将数据变更存储到异步队列中，当本次数据变化，即主线成任务执行完毕，异步队列中的任务才会被执行（已去重）。

### nextTick

在 Vue 2.4 之前都是使用的 micro-task(微任务)，但是 micro-task(微任务) 的优先级过高，在某些情况下可能会出现比事件冒泡更快的情况，但如果都使用 macro-task(宏任务) 又可能会出现渲染的性能问题。所以在新版本中，会默认使用 micro-task(微任务)，但在特殊情况下会使用 macro-task(宏任务)，比如 v-on。

### vue-router 的监听原理

前端路由实现起来其实很简单，本质就是监听 URL 的变化，然后匹配路由规则，显示相应的页面，并且无须刷新。目前单页面使用的路由就只有两种实现方式

- hash 模式
- history 模式

#### hash

`www.test.com/#/` 就是 Hash URL，当 `#` 后面的哈希值发生变化时，不会向服务器请求数据，可以通过 `hashchange` 事件来监听到 URL 的变化，从而进行跳转页面。

#### history

主要是两个 api:

- pushState
- popState

执行 router.push(url) 的操作的时候，会执行 pushState(url) 这样的操作，直接更新一个状态。当用户做出浏览器动作时，比如点击后退按钮时会触发 `popState` 事件

#### updateRoute

执行 router.push(url) 的操作的时候， 会执行 updateRoute 函数， 通过一个全局 mixins 会执行 this.\_route = route 这样一个操作。因为 `_route` 是响应式的，router-view 组件内部使用到了这个值，所以就会重新执行 render 函数。

### router 的哈希模式与 history 有什么不同，hash 值能被监听改变么？

1. 一个是 hash, 一个看起来像真实的路径
2. hash 值不会被带到服务器上去
3. push 的时候实现原理不一样
   1. hash 模式的话，主要是将 location.hash = route.fullPath

### vuex 的原理 ？对 vuex 的理解

vuex 只能使用在 vue 上，很大的程度是因为其高度依赖于 vue 的 computed 依赖检测系统以及其插件系统。其的实现方式完完全全的使用了 vue 自身的响应式设计，依赖监听、依赖收集都属于 vue 对对象 Property set get 方法的代理劫持。

vuex 中的 store 本质就是没有 template 的隐藏着的 vue 组件。

vuex 生成了一个 store 实例，并且把这个实例挂在了所有的组件上，所有的组件引用的都是同一个 store 实例。由于其他组件引用的是同样的实例，所以一个组件改变了 store 上的数据， 导致另一个组件上的数据也会改变，就像是一个对象的引用。

### Vue 的父组件和子组件生命周期钩子执行顺序是什么

父组建： beforeCreate -> created -> beforeMount
子组件： -> beforeCreate -> created -> beforeMount -> mounted
父组件： -> mounted
总结：从外到内，再从内到外

### 组件 keep-alive 的时候又是什么道理？

直接将组件缓存在了内存中，而没有直接走入销毁阶段。

### 几种通信原理

#### 父子组件通信

1. emit/props
2. `$parent.xxx`
3. provide/injected
4. event bus
5. Vuex

#### 任意组件

这种方式可以通过 Vuex 或者 Event Bus 解决，另外如果你不怕麻烦的话，可以使用这种方式解决上述所有的通信情况

### vue@3 支持到什么版本

### vue@2 与 vue@3 做了哪些升级

1. 开发语言切换到 ts, 包使用 lerna 来管理。
2. diff 算法优化，编译速度更快。vue2.x 的虚拟 DOM 是进行全量比较，vue3 新增了静态标记（PatchFlag）。
3. 静态提升：vue2.x 无论元素是否参与更新，每次都会重新创新，然后渲染；vue3 中对于不参与更新的元素会做静态提升，只会创建一次，在渲染的时候复用即可。
4. 包拆的更细，更小。用了 Tree-shaking， 没有用到的代码基本不会被打包进去。
5. 引入了很多 hooks

### Proxy

### vite 的简单原理

实现原理是利用 es6 的 import 发送请求去加载文件的特性，拦截这些请求，做一些预编译，省去 webpack 冗长的打包时间。

1. node 进程托管静态资源请求
2. 重写模块路径，浏览器只能识别 `./`、`../`、`/`这种开头的路径，直接 import 的 npm 包，路径需要被重写为 `@/`
3. 解析模块的路径，在 node_modules 中读取 vue 的相关包，其中最主要的是 compiler-sfc
4. 用 compiler-sfc 解析 vue 文件，会被拆成 template script 和 style 三个部分，template 会被编译成一个 render 函数，放在一个 \_\_script 对象中，最终返回的代码是一个 js 文件内容是导出了一个 script，script 部分基本不变，style 部分会处理成一个 updateCss 函数，通过原生方式在插入一个 style 标签。

<!-- ### omi 的简单原理 TODO

### omiv 的原理 TODO -->

## 前端安全 TODO:

### CSRF

跨站请求伪造。条件： 1. 用户在 A 网站确实登录过。 2. A 网站接口存在漏洞，会下发登录态。
防御：1. token 验证 2. Referer 验证（页面来源验证） 3. 隐藏令牌

### XSS

## 浏览器

什么是 DOCTYPE 及作用
请指出 document load 和 document ready 的区别
JS 延后加载， 怎么缩短 JS 的加载时间

### Web Storage

sessionStorage , localStorage , cookie , Web Storage

### 渲染机制类

解析 HTML 的过程
加载 JS 和 CSS 会阻塞浏览器的渲染吗
下载 JS 和 CSS 会阻塞吗
浏览器的渲染过程
重绘和回流

## 工程化

webpack, rollup 与 vite 之间的区别是什么
webpack 的 loader 和 plugin 区别是什么，有没有写过 loader 和 plugin
webpack 打包速度过慢怎么办
webpack 配置用到 webpack.optimize.UglifyJsPlugin 这个插件，有没有觉得压缩速度很慢，有什么办法提升速度。
webpack 是怎么把 es6 的语法编译成 es5 甚至更低版本的
babel 把 ES6 转成 ES5 或者 ES3 之类的原理是什么，有没有去研究
chunk、bundle 和 module 有什么区别
有没有去研究 webpack 的一些原理和机制，怎么实现的

### babel

babel 是什么，做什么工作 ？
Babel 的一个插件：transform-runtime 以及 stage-2，你说一下他们的作用。
plugin env stage 分别是什么，有什么作用？

#### webpack 打包慢

1. 配置 externals
2. 进阶方法 DllPlugin 和 DllReferencePlugin
3. HappyPack 开启多进程编译，但是也并不一定支持所有 loader 都适合
4. babel-loader 开启缓存
5. 模块按需加载

#### loader

引入的小图片为什么被渲染成了 base64？ 这个是 webpack 里面的对应插件处理的.对于小于多少 K 以下的图片(规定的格式)直接转为 base64 格式渲染;具体配置在 webpack.base.conf.js 里面的 rules 里面的 url-loader 这样做的好处:在网速不好的时候先于内容加载和减少 http 的请求次数来减少网站服务器的负担

### rollup

vue react 都是通过 rollup 来打包的，一般来说会被打包成比较小的 js 文件，能够对一些冗余代码做一定的优化。rollup 功能单一，一般来说只能处理模块化打包 （只能处理 js 文件）。webpack 功能强大，能够处理几乎所有文件。

## 设计模式

1. 单例模式很常用，比如全局缓存、全局状态管理等等这些只需要一个对象。在 Vuex 源码中，你也可以看到单例模式的使用，虽然它的实现方式不大一样，通过一个外部变量来控制只安装一次 Vuex
2. 工厂模式，一个 Class 中包含另一个实现复杂的 Class。 起到的作用就是隐藏了创建实例的复杂度，只需要提供一个接口，简单清晰。
3. 适配器模式，用来解决两个接口不兼容的情况，不需要改变已有的接口，通过包装一层的方式实现两个接口的正常协作。例如 Vue 中的 Computed 做的事情。
4. 代理模式，代理是为了控制对对象的访问，不让外部直接访问到对象。
5. 发布-订阅模式， Vue 的双向绑定。
6. 观察者模式 ， Vue 的事件。

## 前端性能优化

把脚本放在底部， 加快渲染页面
文件名添加哈希， http 强缓存静态文件
按需加载组件
资源压缩合并，减少 HTTP 请求，开启 gzip 压缩
清除不必要的 cookie， 设置好合适的域
把静态资源放在不含 cookie 的域下
非核心代码的异步加载
DNS 预解析 ？？？

### 懒加载的原理

### 虚拟大列表的处理

### code split

1. vue-router 中的通过 webpack 的 `() => import` or `require.ensure` API 能够自动进行代码分割
2. 通过 analyzer 进行分析 js 包的大小，webpack 中的 externals 能够拆分包，通过外链 cdn 的形式引入

### 首屏时间

如何计算？

### 页面性能

如何分析页面性能？

performance API 的哪些指标？

### vue-lazy 的原理

getBoundingClientRect 获取的 top 和 offsetTop 获取的 top 区别

### 虚拟列表实现的原理

## 手写代码

防抖、节流
深拷贝
手写从 url 中获取参数
手写一个事件类
全文单词首字母大写（正则）
手写的 ajax
手写 Promise

## 项目

介绍做过的项目
说一下你项目中用到的技术栈，做的出色的点，可以改进的地方，以及让你头疼的点，怎么解决的。
遇到的问题，或者难点以及解决方案

## 补充

1. node: bff, ssr
2. ts: npm/cli
3. react: 部分原理知识
