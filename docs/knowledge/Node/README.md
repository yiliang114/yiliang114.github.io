---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# NodeJS

## 简介

node 擅长 IO 密集型任务，对于 CPU 密集型任务也可以写但是会比较麻烦。

## Node

服务端 JavaScript: JavaScript 最早是运行在浏览器中，然而浏览器只是提供了一个上下文，它定义了使用 JavaScript 可以做什么，但并没有“说”太多关于 JavaScript 语言本身可以做什么。事实上，JavaScript 是一门“完整”的语言： 它可以使用在不同的上下文中，其能力与其他同类语言相比有过之而无不及。

Node.js 事实上就是另外一种上下文，它允许在后端（脱离浏览器环境）运行 JavaScript 代码。

要实现在后台运行 JavaScript 代码，代码需要先被解释然后正确的执行。Node.js 的原理正是如此，它使用了 Google 的 V8 虚拟机（Google 的 Chrome 浏览器使用的 JavaScript 执行环境），来解释和执行 JavaScript 代码。

## NodeJS 特点

- 非阻塞式的异步 I/O
  - Node.js 中采用了非阻塞型 I/O 机制，因此在执行了访问文件的代码之后，Nodejs 不会阻塞在那里等待文件获取完成，而是把这件事交给底层操作系统，使用回调函数的方式来处理异步的 IO，立即转而执行其它的代码，
- 事件轮询
  - Nodejs 接收到的事件会放到事件队列中，而不是立即执行它，当 NodeJS 当前代码执行完后他会检查事件队列中是否有事件，如果有，他会取出来依次执行
- 单线程
  - Node.js 不为每个客户连接创建一个新的线程，而仅仅使用一个线程。当有用户连接了，就触发一个内部事件，通过非阻塞 I/O、事件驱动机制，让 Node.js 程序宏观上也是并行的
  - 优点：不会死锁、不用像多线程那样处处在意同步问题、没有线程切换带来的性能上的开销
  - 缺点：多核 CPU 需单独开子线程、错误会使得整个应用退出、大量计算会占用 CPU 从而无法调用异步 I/O
- 擅长 I/O 密集型
  - 主要体现在 Node 利用事件轮询的方式处理事件，而不是单开一个线程来为每一个请求服务
- 不擅长 CPU 密集型业务
  - 由于 Node 单线程，如果长时间运行计算将导致 CPU 不能释放，使得后续 I/O 无法发起。（解决办法是分解大型运算为多个小任务，不阻塞 I/O 发起）

**对 Node 的优点和缺点提出了自己的看法？**

- （优点）因为 Node 是基于事件驱动和无阻塞的，所以非常适合处理并发请求因此构建在 Node 上的代理服务器相比其他技术实现（如 Ruby）的服务器表现要好得多。此外，与 Node 代理服务器交互的客户端代码是由 javascript 语言编写的，因此客户端和服务器端都用同一种语言编写，这是非常美妙的事情。
- （缺点）Node 是一个相对新的开源项目，所以不太稳定，它总是一直在变，而且缺少足够多的第三方库支持。看起来，就像是 Ruby/Rails 当年的样子。

### global 对象

与在浏览器端不同，浏览器端将希望全局访问的对象挂到 window 上，而 nodejs 则将希望全局访问的对象挂到 global 对象上

- CommonJS
- Buffer、process、console
- timer 定时器相关

### setImmediate()、setTimeout(fn, 0) 与 process.nextTick()

两个都是传入一个回调函数，当同步事件执行完之后马上执行。

执行顺序依次是：

- process.nextTick()
  - 将回调函数加入到 当前执行栈的尾部，任务队列之前
- setTimeout(fn, 0)
  - 回调函数加入到 任务队列尾部。即使是 0，也会又 4ms 的延时
- setImmediate()
  - 将回调函数插入到任务队列的最末尾，也不会造成阻塞，但不妨碍其他的异步事件

```js
setImmediate(() => {
  console.log('setImmediate');
});

setTimeout(() => {
  console.log('setImmediate');
}, 0);

process.nextTick(() => {
  console.log('next');
});
```

### node.js stream 和 buffer 有什么区别?

- buffer: 为数据缓冲对象，是一个类似数组结构的对象，可以通过指定开始写入的位置及写入的数据长度，往其中写入二进制数据
- stream: 是对 buffer 对象的高级封装，其操作的底层还是 buffer 对象，stream 可以设置为可读、可写，或者即可读也可写，在 nodejs 中继承了 EventEmitter 接口，可以监听读入、写入的过程。具体实现有文件流，http-response 等

**对 Node.js 的优点、缺点提出了自己的看法？ Node.js 的特点和适用场景？**

- Node.js 的特点：单线程，非阻塞 I/O，事件驱动
- Node.js 的优点：擅长处理高并发；适合 I/O 密集型应用

* Node.js 的缺点：不适合 CPU 密集运算；不能充分利用多核 CPU；可靠性低，某个环节出错会导致整个系统崩溃

* Node.js 的适用场景：
  - RESTful API
  - 实时应用：在线聊天、图文直播
  - 工具类应用：前端部署(npm, gulp)
  - 表单收集：问卷系统

**如何判断当前脚本运行在浏览器还是 node 环境中？**

- 判断 Global 对象是否为 window，如果不为 window，当前脚本没有运行在浏览器中

**什么是 npm ？**

- npm 是 Node.js 的模块管理和发布工具

### 对 Node 的优点和缺点提出了自己的看法？

（优点）因为 Node 是基于事件驱动和无阻塞的，所以非常适合处理并发请求，
因此构建在 Node 上的代理服务器相比其他技术实现（如 Ruby）的服务器表现要好得多。
此外，与 Node 代理服务器交互的客户端代码是由 javascript 语言编写的，
因此客户端和服务器端都用同一种语言编写，这是非常美妙的事情。

（缺点）Node 是一个相对新的开源项目，所以不太稳定，它总是一直在变，
而且缺少足够多的第三方库支持。看起来，就像是 Ruby/Rails 当年的样子。

### 升级 nodejs

首先安装 n 模块：

```
cnpm install -g n
```

第二步：

升级 node.js 到最新稳定版

```
sudo n stable
```

### cnpm

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

### 环境变量

一般的 node 项目使用 dotenv 去加载 .env 文件并读取文件中的变量值。

而 vue-cli@3 本身就支持加载不同环境的的 env 文件。

### stream 的异步

request 会返回一个可读流， 可以直接使用 pipe 函数，但是因为 pipe 函数是一个异步操作，如果 pipe 操作写一个
可写流，不能直接使用 await 进行同步执行，stream 有一个 finish 事件，表示 pipe 操作的完成，这样就不会出现在 pipe 操作还没有结束的时候，另外的读取文件操作会显示文件长度为 0 的问题。

[where to put a callback when pipe is finished?](https://github.com/request/request/issues/1645)

```js
function getFileFromUrl(url, filename) {
  return new Promise(resolve => {
    request(url)
      .pipe(fs.createWriteStream(filename))
      .on('finish', resolve);
  });
}
```

### node 文件的读和写

如果 node 文件不是很大的话， 可以直接通过 fs 的 readFile 和 writeFile 进行操作，但是如果文件比较大的话，就推荐直接使用 stream 进行操作了。

[node stream](https://blog.csdn.net/qq_32842925/article/details/83475517)

## 资料

https://github.com/nqdeng/7-days-nodejs

Yeoman： https://www.cnblogs.com/nzbin/p/5751323.html
