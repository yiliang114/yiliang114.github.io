---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 基础

闭包
基本数据类型
如何判断数据类型（typeof 和 instanceof）
this，箭头函数的 this，call、apply、bind 区别
作用域以及作用域链，上下文执行栈和作用域链的区别
原型、原型链、说一下原型链，对象，构造函数之间的一些联系。
new 原理
继承
如果理解 js 的单线程
什么是任务队列
event-loop、事件委托和使用
微任务和宏任务
Promise 的执行顺序
CommonJS 和 ES Module 区别，amd cmd， seajs 是什么，seajs 如何加载 vuejs 的项目
HTTP 强缓存和协商缓存
跨域解决方案
重绘和回流
前端性能优化
跨域， 普通请求
es6 proxy

防抖、节流
深拷贝
手写从 url 中获取参数
多种方式声明一个数组
手写一个事件类 on emit off 等

什么是 DOCTYPE 及作用
浏览器的渲染过程
DOM 事件中 target 和 currentTarget 的区别

CSS 盒模型， box-sizing。
上下左右垂直居中
flex
CSS 设置高度等于宽度的 3/4
rem em px 单位的区别。 em 相对于父元素，rem 相对于根元素。
margin 的合并 高度塌陷的问题，如何解决
bfc
纯 css 换行

http2.0 https

XSS
CSRF

getBoundingClientRect 获取的 top 和 offsetTop 获取的 top 区别

说一下你项目中用到的技术栈，以及觉得得意和出色的点，以及让你头疼的点，怎么解决的。
说一下项目中觉得可以改进的地方以及做的很优秀的地方？

Babel 的一个插件：transform-runtime 以及 stage-2，你说一下他们的作用。
babel 把 ES6 转成 ES5 或者 ES3 之类的原理是什么，有没有去研究
webpack 配置用到 webpack.optimize.UglifyJsPlugin 这个插件，有没有觉得压缩速度很慢，有什么办法提升速度。
webpack 的 loader
有没有去研究 webpack 的一些原理和机制，怎么实现的
简历上看见你了解 http 协议。说一下 200 和 304 的理解和区别

http 缓存原理， cookie
http 状态码
url 输入浏览器地址栏后的过程
请你描述下用户从输入 url 到看到完整页面这个过程发生的事情，尽可能的详细。会涉及到 http 协议，缓存等等，然后可以发散出页面比较慢的问题，怎么去优化，怎么更好的利用缓存，你用过哪些非常规的优化方法等等
输入网址到出现页面的过程（IP 解析，DNS 解析等）
DNS 是怎么解析的
TCP 连接是怎么建立的？详细讲下三次握手
三次握手为什么第二次握手时需要发送多一个 SYN 包
HTTP 请求头的组成

操作 DOM 比较耗费资源，请问怎么减少消耗
简化操作 DOM 的 API 或者库
VDOM

JS 的事件循环机制
事件循环中队列中的事件有先后顺序吗
setTimeout 设定为 0ms 会直接执行吗，如果设置为 5s 会一定在 5s 后执行吗
JS 延后加载， 怎么缩短 JS 的加载时间
解析 HTML 的过程
加载 JS 和 CSS 会阻塞浏览器的渲染吗
下载 JS 和 CSS 会阻塞吗
操作 DOM 树为什么比操作 VDOM 树要慢
请求过程中 session 一般时间是多久
请问每个 session 在服务器如果都是在有效时间内都是存在的吗，假设有 20 个 session，服务器的这些连接在这段时间都是存在的吗

浏览器兼容性举例
全文单词首字母大写
正向代理反向代理

#### 什么是原型 什么是原型链， `__proto__` 与 prototype 之间的差别

1. 所有的引用类型（数组，对象，函数），都有一个隐式原型链, `__proto__` 值是一个普通的对象
2. 所有的函数，都有一个显示原型链, `prototype` 值也是一个普通的对象
3. 所有引用类型的隐式原型链的值与其构造函数的显示原型链的值是相等的

当试图得到一个对象的某个属性的时候，如果这个对象本身没有这个属性，那么就会去它的 `__proto__` 中（即它的构造函数的 prototype 中） 寻找。如果它的构造函数的原型链上也没有的话，就再往构造函数的隐式原型链上去寻找，一直到找不到为止。 这个链式结构叫做原型链。

最顶层是 `Object.prototype.__proto__ === null`

for in 是遍历对象的。for in 在高级浏览器中会屏蔽来自原型链的属性，通过 hasOwnProperty 还可以再检察一下。
for of 一般是用来遍历数组，只遍历数组的元素值，不遍历数组对象上挂载的属性。

闭包说白了就是能够读取其他函数内部变量的函数。因为 js 没有块级作用域作用域，只有函数作用域和全局作用域，所以通过一个函数包一下，返回一个函数就可以读取到函数内部的变量，给外部访问。

this: this 的值是在执行的时候才能确认，定义的时候不能确认

#### javascript 中 apply、call 和 bind 的区别：

1. bind 返回的是一个函数，需要再次手动执行。
2. call 第二个参数以后的参数都跟调用的函数意义对应，而使用 apply 的时候，函数的参数都是放在数组中的，作为第二个参数。

#### 限频防抖函数手写

```js
// debounce
function debounce(fn, delay) {
  delay = delay || 500;
  let timer;
  return function() {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

```js
// throttle
function throttle(fn, delay) {
  delay = delay || 500;
  let timer;
  return function() {
    let args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, delay);
    }
  };
}
```

#### class 和普通构造函数有和区别

class 是 es6 中比较标准和比较统一的模块化语法，可以说是升级了以前的构造函数。

#### 解答:

1. class 在语法上更加贴合面向对象的写法
2. class 实现实现继承更加易读、易理解
3. 更易与后端工程师或者有 java 等面向对象语言经验的开发者的使用
4. 本质还是语法糖，还是使用 prototype

#### js 构造函数

通过原型链实现代码的复用。

```js
function MathHandle(x, y) {
  this.x = x;
  this.y = y;
}
MathHandle.prototype.add = function() {
  return this.x + this.y;
};

var a = new MathHandle(1, 2);
console.log(a.add());
```

#### class 语法

模拟 java c# 等高级的面向对象的语言的做法。

```js
class MathHandle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add() {
    return this.x + this.y;
  }
}
var a = new MathHandle(1, 2);
console.log(a.add());
```

#### 语法糖

```js
class MathHandle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add() {
    return this.x + this.y;
  }
}

// 这种语法糖形式，看起来和实际原理不一样的东西
typeof MathHandle; // "function"
// 构造函数的（显式）原型里面默认有一个 constructor 属性，等于构造函数本身
MathHandle === MathHandle.prototype.constructor; // true
// 每一个 new 出来的实例，都拥有一个隐式原型，等于构造函数的显式原型
m.__proto__ === MathHandle.prototype; // true
```

#### 继承

```js
function Animal() {
  this.eat = function() {};
}

function Dog() {
  this.bark = function() {};
}
// 需要继承的构造函数的显式原型赋值成为被调用继承的构造函数创建出来的实例
// 低级构造函数的显式原型赋值成高级构造函数的实例
Dog.prototype = new Animal();

var hashiqi = new Dog();
```

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {}
}

class Dog extends Animal {
  constructor(name) {
    super(name);
    this.name = name;
  }
  say() {}
}

const dog = new Dog('哈士奇');
```

对 vuex 的理解
vue 从 data 到渲染页面的整个过程
虚拟 dom
怎么看待组件嵌套很多层级的组件
组件设计原则
介绍状态机
对 http2 的了解
pwa 的使用
对新技术的了解
websocket 的使用场景
对 MVC MVP MVVM 的了解
对 SEO 的了解
redux - 是怎么实现的， 实现过程

### 浏览器

- sessionStorage , localStorage , cookie , Web Storage
- 首次进入的时候，
- 缓存
- 请指出 document load 和 document ready 的区别
- Doctype

事件冒泡，捕获，事件代理
浏览器事件循环
跨域的几种方式，cors 的头，需要设置哪些

### DOM 事件类

##### DOM 事件的级别

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

#### HTTP 协议类

##### HTTP 协议的主要特点

简单快速、灵活、无连接、无状态（后面两个重要）

##### HTTP 报文的组成部分

http 就是建立在 tcp 连接之上的应用（层？）http 报文是由请求报文和相应报文组成的。

请求报文：

    1. 请求行。请求行包含 http 方法，页面地址，http 协议以及版本

2. 请求头。 一些 key-value 值告诉服务端需要什么内容 3. 空行。分离请求头和请求体 4. 请求体

响应报文：

1. 状态行
2. 响应头
3. 空行
4. 响应体

##### HTTP 方法

GET, POST, PUT, DELETE, HEAD

HEAD 方法用于获取报文首部

##### POST 和 GET 的区别

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

##### HTTP 状态码

1xx: 指示信息
2xx: 成功 200 206
3xx: 重定向 301 永久重定向 302 临时重定向 304 缓存
4xx: 客户端错误 400 401 未授权 403 资源禁止被访问 404 资源不存在
5xx: 服务端错误 500 503

##### 什么是持久连接

我们知道 HTTP 协议采用“请求-应答”模式，当使用普通模式，即非 Keep-Alive 模式时，每个请求/应答客户和服务器都要新建一个连接，完成之后立即断开连接（HTTP 协议为无连接的协议）；当使用 Keep-Alive 模式（又称持久连接、连接重用）时，Keep-Alive 功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive 功能避免了建立或者重新建立连接。

http 1.1 之后支持

#### 面向对象

类的声明

生成实例

如何实现继承

继承的几种方式

#### 通信类

##### 什么是同源策略及限制

协议、端口、域名有一个不一样就是不同源

##### 前后端如何进行通信

ajax （同源下的策略）
websocket （不限制是否同源）
cors （支持跨域通信也支持跨域通信）

##### 如何创建 ajax

手写的 ajax 是否兼容 IE ， IE 下面的 ajax 与普通浏览器的 ajax 对象不一样

##### 跨域通信的几种方式

1. JSONP

2. Hash url 中 # 号后面的内容， hash 修改页面不刷新， search 修改会刷新页面

   利用 window.onhashChange 获取修改的 hash

3. postMessage （HTML5 新增）

4. WebSocket

5. CORS （添加 http 请求头允许跨域通信）

#### 安全类

1. CSRF

   跨站请求伪造。条件： 1. 用户在 A 网站确实登录过。 2. A 网站接口存在漏洞，会下发登录态。

   防御：1. token 验证 2. Referer 验证（页面来源验证） 3. 隐藏令牌

2. XSS

   跨域脚本攻击

### vue

router 的哈希模式与 history 有什么不同，hash 值能被监听改变么？

- vue @ 3 支持到什么版本
- 引入的小图片为什么被渲染成了 base64
  - 这个是 webpack 里面的对应插件处理的.对于小于多少 K 以下的图片(规定的格式)直接转为 base64 格式渲染;具体配置在 webpack.base.conf.js 里面的 rules 里面的 url-loader 这样做的好处:在网速不好的时候先于内容加载和减少 http 的请求次数来减少网站服务器的负担
- vue 中的 ref 是什么？ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 \$refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例。

为什么 for 循环的 id 不能使用 index
什么是 vdom 为什么要使用 vdom
vdom 如何使用，核心函数有什么
diff 算法
如何理解 MVVM
Vue 实现双向数据绑定的原理，以及 vue.js 和 react.js 异同点，如果让你选框架，你怎么怎么权衡这两个框架，分析一下。
vue 如何实现响应式
vue 如何解析模板
介绍 vue 的实现流程
Vue Diff
双向绑定
MVVM 是什么
Vue 的生命周期
vue 数据更新机制

### 网络

- 三次握手、四次挥手
- 常见状态码
- post 与 get
- http 的缓存，以及怎么设置， 强缓存、协商缓存
- https 是什么，有点缺点
- url 输入到显示的过程
- dns 的作用，可靠连接有哪些
- 浏览器页面渲染的流程是什么

#### TCP 三次握手和四次挥手的全过程

三次握手：
第一次握手：客户端发送 syn 包(syn=x)到服务器，并进入 SYN_SEND 状态，等待服务器确认；
第二次握手：服务器收到 syn 包，必须确认客户的 SYN（ack=x+1），同时自己也发送一个 SYN 包（syn=y），即 SYN+ACK 包，此时服务器进入 SYN_RE 状态；
第三次握手：客户端收到服务器的 SYN ＋ ACK 包，向服务器发送确认包 ACK(ack=y+1)，此包发送完毕，客户端和服务器进入 ESTABLISHED 状态，完次握手。
握手过程中传送的包里不包含数据，三次握手完毕后，客户端与服务器才正式开始传送数据。理想状态下，TCP 连接一旦建立，在通信双方中的任何一动关闭连接之前，TCP 连接都将被一直保持下去。
四次挥手
与建立连接的“三次握手”类似，断开一个 TCP 连接则需要“四次握手”。
第一次挥手：主动关闭方发送一个 FIN，用来关闭主动方到被动关闭方的数据传送，也就是主动关闭方告诉被动关闭方：我已经不 会再给你发数据了然，在 fin 包之前发送出去的数据，如果没有收到对应的 ack 确认报文，主动关闭方依然会重发这些数据)，但是，此时主动关闭方还可 以接受数据。
第二次挥手：被动关闭方收到 FIN 包后，发送一个 ACK 给对方，确认序号为收到序号+1（与 SYN 相同，一个 FIN 占用一个序号）。
第三次挥手：被动关闭方发送一个 FIN，用来关闭被动关闭方到主动关闭方的数据传送，也就是告诉主动关闭方，我的数据也发送完了，不会再给你发了。
第四次挥手：主动关闭方收到 FIN 后，发送一个 ACK 给被动关闭方，确认序号为收到序号+1，至此，完成四次挥手。

#### TCP 的三次握手过程？为什么会采用三次握手，若采用二次握手可以吗？

    建立连接的过程是利用客户服务器模式，假设主机A为客户端，主机B为服务器端。
    （1）TCP的三次握手过程：主机A向B发送连接请求；主机B对收到的主机A的报文段进行确认；主机A再次对主机B的确认进行确认。
    （2）采用三次握手是为了防止失效的连接请求报文段突然又传送到主机B，因而产生错误。失效的连接请求报文段是指：主机A发出的连接请求没有收到主机B的确认，于是经过一段时间后，主机A又重新向主机B发送连接请求，且建立成功，顺序完成数据传输。考虑这样一种特殊情况，主机A第一次发送的连接请求并没有丢失，而是因为网络节点导致延迟达到主机B，主机B以为是主机A又发起的新连接，于是主机B同意连接，并向主机A发回确认，但是此时主机A根本不会理会，主机B就一直在等待主机A发送数据，导致主机B的资源浪费。
    （3）采用两次握手不行，原因就是上面说的实效的连接请求的特殊情况。

#### TCP 三次握手的过程，为什么是三次而不是两次或者四次？

第一次握手：客户端发送一个 syn（同步）包（syn=x）给服务器，进入 SYN_SEND 状态，等待服务器确认

第二次握手：服务端收到客户端发送的同步包，确认客户端的同步请求（ack=x+1）,同时也发送一个同步包，
也就是一个 ACK 包+SYN 包服务器进入 SYN_RECV 状态

第三次握手：客户端收到服务器的 SYN+ACK 包，向服务器发送一个确认包，此包发送完毕，客户端和服务器进入
ESTABLISHED 状态，完成三次握手

不是两次是为了防止已经失效的连接请求报文段突然又传送到了服务端，因而产生错误，比如有一个因网络延迟的请求
发送到了服务端，服务端收到这个同步报文之后进行确认，如果此时是两次握手，那么此时连接建立，但是客户端并没有发出
建立连接的请求，服务端却一直等待客户端发送数据，这样服务端的资源就白白浪费了。

不是四次的话是因为完全没有必要，三次已经足够了

\

#### TCP 的四次挥手

第一次：主动关闭方发送一个 FIN 包，用来关闭主动关闭方到被动关闭方的数据传送，也就是告诉另一方我不再发送数据了，但此时仍可以接收数据

第二次：被动关闭方收到 FIN 包之后，发送一个确认（ACK）包给对方

第三次：被动关闭方发送一个 FIN 包，告诉对方不带发送数据

第四次：主动关闭方收到 FIN 包之后，发送一个 ACK 包给对方，至此完成四次挥手

#### 说说 TCP 传输的三次握手四次挥手策略

- 为了准确无误地把数据送达目标处，TCP 协议采用了三次握手策略。用 TCP 协议把数据包送出去后，TCP 不会对传送 后的情况置之不理，它一定会向对方确认是否成功送达。握手过程中使用了 TCP 的标志：SYN 和 ACK

- 发送端首先发送一个带 SYN 标志的数据包给对方。接收端收到后，回传一个带有 SYN/ACK 标志的数据包以示传达确认信息。 最后，发送端再回传一个带 ACK 标志的数据包，代表“握手”结束。 若在握手过程中某个阶段莫名中断，TCP 协议会再次以相同的顺序发送相同的数据包

#### 断开一个 TCP 连接则需要“四次握手”：

- 第一次挥手：主动关闭方发送一个 FIN，用来关闭主动方到被动关闭方的数据传送，也就是主动关闭方告诉被动关闭方：我已经不 会再给你发数据了(当然，在 fin 包之前发送出去的数据，如果没有收到对应的 ack 确认报文，主动关闭方依然会重发这些数据)，但是，此时主动关闭方还可 以接受数据

- 第二次挥手：被动关闭方收到 FIN 包后，发送一个 ACK 给对方，确认序号为收到序号+1（与 SYN 相同，一个 FIN 占用一个序号）

- 第三次挥手：被动关闭方发送一个 FIN，用来关闭被动关闭方到主动关闭方的数据传送，也就是告诉主动关闭方，我的数据也发送完了，不会再给你发数据了

- 第四次挥手：主动关闭方收到 FIN 后，发送一个 ACK 给被动关闭方，确认序号为收到序号+1，至此，完成四次挥手

#### tcp 为什么三次握手而不是两次或者四次

#### https 与 http

#### 输入一个 url 的过程

浏览器缓存 首先是查找浏览器缓存,浏览器会缓存 DNS 记录一段时间。系统缓存 如果在浏览器缓存里没有找到需要的记录，浏览器会做一个系统调用来
查找这个网址的对应 DNS 信息。 路由器缓存 如果在系统缓存里没有找到找到对应的 IP，请求会发向路由器，它一般会有自己的 DNS 缓存。
第一步 浏览器查找该域名的 IP 地址
第二步 浏览器根据解析得到的 IP 地址向 web 服务器发送一个 HTTP 请求
第三步 服务器收到请求并进行处理
第四步 服务器返回一个响应
第五步 浏览器对该响应进行解码，渲染显示。
第六步 页面显示完成后，浏览器发送异步请求。

从 HTTP 请求回来 ，产生流式的数据，DOM 的构建、CSS 计算、渲染、绘制，都是尽可能的流式处理前一步的产出，不需要等待上一步完全接受才开始处理，所以我们在浏览网页的时候，才会逐步出现页面

> - 浏览器接受 url 开启一个网络请求线程
> - 浏览器发出一个完整的 http 请求
> - 服务器接收请求到后台接收请求
> - 使用 http 请求请求页面
> - 把请求回来的 html 代码解析成 DOM 树
> - CSS 的可视化格式模型解析
> - 根据 CSS 属性对元素进行渲染，得到内存中的位图
> - 对位图的合成
> - 绘制页面

浏览器的工作流程大致就是：构建 DOM 树-构建 CSSOM-构建渲染树-布局-绘制

### 异步

- promise 解决的问题
- promise 与事件循环，settimeout 以及 react 的下一次循环

#### Promise 的基本使用

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

#### 模拟二面

1. 面试技巧
2. 渲染机制类
3. js 运行机制
4. 页面性能
5. 错误监控

#### 模拟三面

1. 面试技巧
2. 业务能力
3. 团队协作能力
4. 带人能力

#### 模拟终面（hr）

1. 面试技巧
2. 职业竞争力
3. 职业规划（不能说走一步看一步）

#### react

- 绑定 this
- setState
- 事件原理， 冒泡、捕获
- hooks
- diff 原理
- fiber

#### vue

- 双向绑定原理
- 指令原理
- vue 如何实现代码的复用
- router 的 hash 和 history 有什么区别
- vuex 的使用场景
- 几种通信原理
- sync
- render
- 计算属性是如何做到属性值改变才重新计算（缓存）
- v-if v-show
  - 回流和重绘

### webpack

- 对 webpack 有了解吗？chunk、bundle 和 module 有什么区别

### rollup.js

vue react 都是通过 rollup 来打包的，一般来说会被打包成比较小的 js 文件，能够对一些冗余代码做一定的优化。

rollup 功能单一，一般来说只能处理模块化打包 （只能处理 js 文件）。webpack 功能强大，能够处理几乎所有文件。

### 性能优化

- code split
- 首屏？
- 骨架屏

### 面试准备

社招的知识更看重深度，以及架构上的能力。业务代码抽象能力，项目把控能力。经验体现在，协调其他人快速进行开发。

#### 自我介绍

学历、工作经历（时间-公司-岗位-职责-技术栈-业绩（重要，带来哪些成就、想出哪些产出、有输出什么技术方案，解决哪些技术问题））、开源项目。

#### 自我陈述

1. 把握面试的沟通方向。 （前端负责人？ 问题： 项目有几个人，在项目中承担什么样的角色，项目管理还是技术管理，你做出了什么样的成绩。 项目是怎么进行分配的，团队怎么进行协作，技术管理上如何配合，技术难点是如何解决的）

   1. 比如分析了他们的网站所用到的技术或者效果，把它的实现方式分析了一遍，又自己实现了一遍不同的方式。在自我陈述的时候就可以说，我平时比较习惯研究一些网站，喜欢去看技术原理，或者好玩的点，自己比较喜欢思考，也愿意去尝试去做有没有更好的方式。

### 一面/二面

技术一面主要判断对基础知识的掌握

- 描述一个你遇到过的技术问题，你是如何解决的？

主要去测试基础知识点（HTML/CSS/JS）。基础之上的延伸，深入原理。例如： 用 vue 做了什么。 先会问项目中的一些东西，接着就会落脚到 vue 上，比如 vue 的生命周期，vue 的工作原理是什么，有没有看过源码，你觉得源码有什么缺点，如果让你改进你怎么改进。 或者认为它的框架有什么优点。

### 二面、三面

技术二面主要判断技术深度及广度

- 你最擅长的技术是什么？
  - 你觉得你在这个技术上的水平到什么程度了？你觉得最高级别应该是怎样的？
- 浏览器及性能
  - 谈一下你所知道的页面性能优化方法？
    - 这些优化方法背后的原理是什么？
    - 除了这些常规的，你还了解什么最新的方法么？
  - 如何分析页面性能？
- 其它
  - 除了前端以外还了解什么其它技术么？
  - 对计算机基础的了解情况，比如常见数据结构、编译原理等

知识体系的深度（浏览器原理，js 引擎）

一般情况下不会面技术。技术负责人、业务负责人。不再关注技术点。职业生涯里，在哪一个项目有没有做过哪些事情，你的角色是什么，你推动了什么，你改变了什么。

#### 项目

介绍做过的项目
遇到的问题以及解决方案

### 三面、四面

（技术、业务负责人）

准备好要说的项目后面的技术原理和难点。

项目架构，基础能力，人员安排组织， 遇到过什么问题，攻克什么难题（需要把握时间，组织好时间）

想办法把准备的东西说出来，引导找时机。

沟通，性格，潜力。

#### 开放性问题

三年内的职业规划
跳槽原因
同事怎么看待你
你的优点、缺点
你还能提高的地方

##### 考察能力

1. 业务能力

   - 我做过什么业务（最好能用几句话描述做过的事情）
   - 负责的业务有什么业绩 （用户量提升了多少，性能提升了多少， 需要数据）
   - 使用了什么技术方案（技术栈）
   - 突破了什么技术难点（别人做不到的，我做到了）
   - 遇到了什么问题（肯定有遇到的问题，证明深入）
   - 最大的收获是什么（技术上得到了成长，业务上有什么总结）

2. 团队协作能力（保持愉快的合作氛围，要让别人觉得你乐于与别人合作）通过其他事情描述的过程中体现出来（不要直接说这个）。

3. 事务推动能力（跨部门，跨组，说一说这里的经验）

   1. vuex 插件的推动
   2. 前端监控系统

4. 带人能力

5. 其他能力

##### 话题

1. 职业竞争力

   业务能力，我想做什么方向上做到最好的坚持。

2. 职业规划

   希望公司里有一些周分享之类的。多赞美 hr 和公司。
