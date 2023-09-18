---
title: Node
date: '2020-10-26'
draft: true
---

## Node

### Node 的应用场景

特点：

1. 它是一个 Javascript 运行环境
2. 依赖于 Chrome V8 引擎进行代码解释
3. 事件驱动
4. 非阻塞 I/O
5. 单进程，单线程

简单强大，轻量可扩展．简单体现在 node 使用的是 javascript,json 来进行编码，人人都会；强大体现在非阻塞 IO,可以适应分块传输数据，较慢的网络环境，尤其擅长高并发访问；轻量体现在 node 本身既是代码，又是服务器，前后端使用统一语言;可扩展体现在可以轻松应对多实例，多服务器架构，同时有海量的第三方应用组件

优点：

1. 高并发（最重要的优点）
2. 因为 Node 是基于事件驱动和无阻塞的，所以非常适合处理并发请求，因此构建在 Node 上的代理服务器相比其他技术实现（如 Ruby）的服务器表现要好得多。
3. 与 Node 代理服务器交互的客户端代码是由 javascript 语言编写的，因此客户端和服务器端都用同一种语言编写，这是非常美妙的事情。

缺点：

1. 只支持单核 CPU，不能充分利用 CPU
2. 可靠性低，一旦代码某个环节崩溃，整个系统都崩溃
3. Node 是一个相对新的开源项目，所以不太稳定，它总是一直在变。
4. 缺少足够多的第三方库支持。看起来，就像是 Ruby/Rails 当年的样子（第三方库现在已经很丰富了，所以这个缺点可以说不存在了）。

适用场景:

1. 高并发
2. 聊天
3. 实时消息推送, 实时应用：在线聊天、图文直播
4. RESTful API
5. 工具类应用：前端部署

不适用场景:

1. CPU 密集运算；不能充分利用多核 CPU；可靠性低，某个环节出错会导致整个系统崩溃

### Express 和 koa 各有啥优缺点?

1. Koa 虽然同它哥 Express 说的一样，是 Web Framework。不过从架构功能设计和架构设计上看，它更像它舅舅（原谅我亲戚关系懵了）── Connect。更多是一个中间件框架，其提供的是一个架子，而几乎所有的功能都需要由第三方中间件完成。

2. Express 更为贴近 Web Framework 这一概念，比如自带 Router、路由规则等（在没有剥离 bodyParser 之前更为贴切）；相比之下 Koa 则更为宽松，光是 Router 就有 20+ 个，自由选择嘛（Home · koajs/koa Wiki · GitHub），更为灵活。 死马 （Koa 的 maintainer 之一）也发布了一个推荐的常用中间件合集包 koa-middlewares

3. Express 和 Koa 最明显的差别就是 Handler 的处理方法，一个是普通的回调函数，一个是利用生成器函数（Generator Function）来作为响应器。往里头儿说就是 Express 是在同一线程上完成当前进程的所有 HTTP 请求，而 Koa 利用 co 作为底层运行框架，利用 Generator 的特性，实现“协程响应”（并不能将 Generator 等价于协程，在 V8 的邮件列表中对 Generator 的定义基本是 `coroutine-like`），然而 co 这个库对 Generator 的使用方法并非当初 Generator 的设计初衷。详细可以看这里：Koa, co and coroutine

4. 还是要感谢 TJ 创造了 co 这个大杀器吧，让我们基本完全忘记了什么是回调函数或者 callbacks hell。虽然实现方法略微取巧，但是就大大加速了开发速度这一点而言，已经足以让我们跪舔了。

### 什么是 EventEmitter

EventEmitter 是 node 中一个实现观察者模式的类，主要功能是监听和发射消息，用于处理多模块交互问题.

实现：主要分三步：定义一个子类，调用构造函数，继承 EventEmitter

```js
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function MyEmitter() {
  EventEmitter.call(this);
} // 构造函数

util.inherits(MyEmitter, EventEmitter); // 继承

var em = new MyEmitter();
em.on('hello', function(data) {
  console.log('收到事件hello的数据:', data);
}); // 接收事件，并打印到控制台
em.emit('hello', 'EventEmitter传递消息真方便!');
```

应用：

1. 模块间传递消息
2. 回调函数内外传递消息
3. 处理流数据，因为流是在 EventEmitter 基础上实现的.
4. 观察者模式发射触发机制相关应用

如何捕获错误事件：
监听 error 事件即可．如果有多个 EventEmitter,也可以用 domain 来统一处理错误事件

```js
var domain = require('domain');
var myDomain = domain.create();
myDomain.on('error', function(err) {
  console.log('domain接收到的错误事件:', err);
}); // 接收事件并打印
myDomain.run(function() {
  var emitter1 = new MyEmitter();
  emitter1.emit('error', '错误事件来自emitter1');
  emitter2 = new MyEmitter();
  emitter2.emit('error', '错误事件来自emitter2');
});
```

EventEmitter 中的 newListenser 事件用处：
newListener 可以用来做事件机制的反射，特殊应用，事件管理等．当任何 on 事件添加到 EventEmitter 时，就会触发 newListener 事件，基于这种模式，我们可以做很多自定义处理.

```js
var emitter3 = new MyEmitter();
emitter3.on('newListener', function(name, listener) {
  console.log('新事件的名字:', name);
  console.log('新事件的代码:', listener);
  setTimeout(function() {
    console.log('我是自定义延时处理机制');
  }, 1000);
});
emitter3.on('hello', function() {
  console.log('hello　node');
});
```

### node 脱敏是如何做的， 中间件？

### gateway 网关层做了什么内容，平台的权限是如何设计的，如何进行工作的？

### 简述公司 node 架构中容灾的实现 ?

### 开发中有遇到过比较难定位的问题吗？Node 内存泄露有遇到过吗？

### node 如何捕获异常

### node 文件的读和写

如果 node 文件不是很大的话， 可以直接通过 fs 的 readFile 和 writeFile 进行操作，但是如果文件比较大的话，就推荐直接使用 stream 进行操作了。

### node.js stream 和 buffer 有什么区别?

- buffer: 为数据缓冲对象，是一个类似数组结构的对象，可以通过指定开始写入的位置及写入的数据长度，往其中写入二进制数据
- stream: 是对 buffer 对象的高级封装，其操作的底层还是 buffer 对象，stream 可以设置为可读、可写，或者即可读也可写，在 nodejs 中继承了 EventEmitter 接口，可以监听读入、写入的过程。具体实现有文件流，http-response 等

### stream 和同步方式处理文件有什么区别

request 会返回一个可读流， 可以直接使用 pipe 函数，但是因为 pipe 函数是一个异步操作，如果 pipe 操作写一个
可写流，不能直接使用 await 进行同步执行，stream 有一个 finish 事件，表示 pipe 操作的完成，这样就不会出现在 pipe 操作还没有结束的时候，另外的读取文件操作会显示文件长度为 0 的问题。

```js
function getFileFromUrl(url, filename) {
  return new Promise(resolve => {
    request(url)
      .pipe(fs.createWriteStream(filename))
      .on('finish', resolve);
  });
}
```

### node es6

https://segmentfault.com/a/1190000012709705

最主要是 `babel-preset-env` 和 `babel-register` 配合使用。 前者自动检查 node 的版本，并设置指定的预设，后者进行实时转码，编译 es6 代码到 node 可以直接执行的代码。

### 其他总览

- 一个小工具： 能够保存所有请求的返回到本地 json 中，保证离线状态下 web 的可运行性。
- 浏览器的 js 是单线程，但是 nodejs 是多线程，为什么说 node 对于多线程支持很好？
- nodejs html 解析 -- Cheerio http://www.cnblogs.com/CraryPrimitiveMan/p/3674421.html
- Express 和 koa 有什么关系，有什么区别？
- Nodejs 中的 Stream 和 Buffer 有什么区别？
- node 是如何实现高并发的？
- nodejs 的进程和线程
- nodejs 中通常如何使用 session
- 说说 nodejs 的 buffer 与 stream 的关系（流对象，只能操作 string 和 buffer）
- nodejs 适合做什么样的业务？
- node 的异步问题是如何解决的？
- 中间件、子进程
- 使用箭头函数需要注意的地方有哪些？
- 说说你对 set 数据结构的理解
- 说说你对 class 的理解
- rest 参数你有了解吗
- 谈谈你对 es6 的 module 体系的理解

### Node process.env

在看一些前框框架实现的源码的时候，经常会看到类似如下的代码：

```js
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod.js');
} else {
  module.exports = require('./dev.js');
}
```

node 中有全局变量 process 表示当前 node 进程，process（进程）其实就是存在 nodejs 中的一个全局变量，process.env 包含着关于系统环境的信息。但是 process.env 中并不存在 NODE_ENV 这个东西。其实 NODE_ENV 只是一个用户自定义的变量。

而具体 `process.env.xxx` 中的 `xxx` 是开发者自己定义的。比如上述的：

```bash
process.env.NODE_ENV
// 或者
process.env.VUE_CLI_DEBUG = true
process.env.PORT
```

#### window 设置环境变量

```bash
set NODE_ENV=dev
```

#### Unix 设置环境变量

```bash
export NODE_ENV=dev
```

#### 直接在 js 代码中设置环境变量

```js
process.env.VUE_CLI_DEBUG = true;
```

#### package.json 中设置环境变量

```js
"scripts": {
  "start-win": "set NODE_ENV=dev && node app.js",
  "start-unix": "export NODE_ENV=dev && node app.js",
 }
```

#### 解决 window 和 unix 命令不一致的问题

安装 `npm i cross-env --save-dev`

```js
"scripts": {
  "start-win": "cross-en NODE_ENV=dev && node app.js",
 }
```

#### unix 永久设置环境变量

```bash
# 所有用户都生效
vim /etc/profile
# 当前用户生效
vim ~/.bash_profile
```

最后修改完成后需要运行如下语句令系统重新加载

```bash
# 修改/etc/profile文件后
source /etc/profile
# 修改~/.bash_profile文件后
source ~/.bash_profile
```
