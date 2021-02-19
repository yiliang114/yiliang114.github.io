---
title: NodeJS
date: '2020-10-26'
draft: true
---

### 为什么要用 node?

总结起来 node 有以下几个特点:简单强大，轻量可扩展．简单体现在 node 使用的是 javascript,json 来进行编码，人人都会；强大体现在非阻塞 IO,可以适应分块传输数据，较慢的网络环境，尤其擅长高并发访问；轻量体现在 node 本身既是代码，又是服务器，前后端使用统一语言;可扩展体现在可以轻松应对多实例，多服务器架构，同时有海量的第三方应用组件

### NodeJS 特点

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

#### global 对象

与在浏览器端不同，浏览器端将希望全局访问的对象挂到 window 上，而 nodejs 则将希望全局访问的对象挂到 global 对象上

- CommonJS
- Buffer、process、console
- timer 定时器相关

#### setImmediate()、setTimeout(fn, 0) 与 process.nextTick()

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

#### node.js stream 和 buffer 有什么区别?

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

#### stream 的异步

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

#### node 文件的读和写

如果 node 文件不是很大的话， 可以直接通过 fs 的 readFile 和 writeFile 进行操作，但是如果文件比较大的话，就推荐直接使用 stream 进行操作了。

### node

- 一个小工具： 能够保存所有请求的返回到本地 json 中，保证离线状态下 web 的可运行性。
- 浏览器的 js 是单线程，但是 nodejs 是多线程，为什么说 node 对于多线程支持很好？
- nodejs html 解析 -- Cheerio http://www.cnblogs.com/CraryPrimitiveMan/p/3674421.html
- Express 和 koa 有什么关系，有什么区别？
- Nodejs 中的 Stream 和 Buffer 有什么区别？
- node 是如何实现高并发的？
- 简述公司 node 架构中容灾的实现 ?
- nodejs 的进程和线程
- nodejs 中通常如何使用 session
- 说说 nodejs 的 buffer 与 stream 的关系（流对象，只能操作 string 和 buffer）
- nodejs 适合做什么样的业务？
- node 的异步问题是如何解决的？

### Node 的应用场景

特点：

1. 它是一个 Javascript 运行环境
2. 依赖于 Chrome V8 引擎进行代码解释
3. 事件驱动
4. 非阻塞 I/O
5. 单进程，单线程
   优点：

高并发（最重要的优点）
缺点：

1. 只支持单核 CPU，不能充分利用 CPU
2. 可靠性低，一旦代码某个环节崩溃，整个系统都崩溃

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

- 1.模块间传递消息
- 2.回调函数内外传递消息
- 3.处理流数据，因为流是在 EventEmitter 基础上实现的.
- 4.观察者模式发射触发机制相关应用

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

### 什么是 Stream?

定义：
stream 是基于事件 EventEmitter 的数据管理模式．由各种不同的抽象接口组成，主要包括可写，可读，可读写，可转换等几种类型

优点：
非阻塞式数据处理提升效率，片断处理节省内存，管道处理方便可扩展等

应用：
文件，网络，数据转换，音频视频等

如何捕获错误事件：
监听 error 事件，方法同 EventEmitter.

常用的 Stream：
Readable 为可被读流，在作为输入数据源时使用；Writable 为可被写流,在作为输出源时使用；Duplex 为可读写流,它作为输出源接受被写入，同时又作为输入源被后面的流读出．Transform 机制和 Duplex 一样，都是双向流，区别时 Transfrom 只需要实现一个函数\_transfrom(chunk, encoding, callback);而 Duplex 需要分别实现\_read(size)函数和\_write(chunk, encoding, callback)函数.

实现 Writable Stream：
三步走:1)构造函数 call Writable 2)　继承 Writable 3) 实现\_write(chunk, encoding, callback)函数

```js
var Writable = require('stream').Writable;
var util = require('util');

function MyWritable(options) {
  Writable.call(this, options);
} // 构造函数
util.inherits(MyWritable, Writable); // 继承自Writable
MyWritable.prototype._write = function(chunk, encoding, callback) {
  console.log('被写入的数据是:', chunk.toString()); // 此处可对写入的数据进行处理
  callback();
};

process.stdin.pipe(new MyWritable()); // stdin作为输入源，MyWritable作为输出源
```

### 文件系统

内置的 fs 模块架构:
fs 模块主要由下面几部分组成: 1) POSIX 文件 Wrapper,对应于操作系统的原生文件操作 2) 文件流 fs.createReadStream 和 fs.createWriteStream 3) 同步文件读写,fs.readFileSync 和 fs.writeFileSync 4) 异步文件读写, fs.readFile 和 fs.writeFile

读写一个文件方法:
总体来说有四种: 1) POSIX 式低层读写 2) 流式读写 3) 同步文件读写 4) 异步文件读写

读取 json 配置文件:
主要有两种方式，第一种是利用 node 内置的 require('data.json')机制，直接得到 js 对象; 第二种是读入文件入内容，然后用 JSON.parse(content)转换成 js 对象．二者的区别是 require 机制情况下，如果多个模块都加载了同一个 json 文件，那么其中一个改变了 js 对象，其它跟着改变，这是由 node 模块的缓存机制造成的，只有一个 js 模块对象; 第二种方式则可以随意改变加载后的 js 变量，而且各模块互不影响，因为他们都是独立的，是多个 js 对象.

fs.watch 和 fs.watchFile 有什么区别，怎么应用?
二者主要用来监听文件变动．fs.watch 利用操作系统原生机制来监听，可能不使用网络文件系统; fs.watchFile 则是定期检查文件状态变更，适用于网络文件系统，但是相比 fs.watch 有些慢，因为不是实时机制

### node 的网络模块架构

node 的网络模块架构:
node 全面支持各种网络服务器和客户端，包括 tcp, http/https, tcp, udp, dns, tls/ssl 等.

node 是怎样支持 https,tls 的?
主要实现以下几个步骤即可: 1) openssl 生成公钥私钥 2) 服务器或客户端使用 https 替代 http 3) 服务器或客户端加载公钥私钥证书

实现一个简单的 http 服务器?
经典又很没毛意义的一个题目．思路是加载 http 模块，创建服务器，监听端口.

```js
var http = require('http'); // 加载http模块

http
  .createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' }); // 200代表状态成功, 文档类型是给浏览器识别用的
    res.write(
      '<meta charset="UTF-8"> <h1>我是标题啊！</h1> <font color="red">这么原生，初级的服务器，下辈子能用着吗?!</font>',
    ); // 返回给客户端的html数据
    res.end(); // 结束输出流
  })
  .listen(3000); // 绑定3ooo, 查看效果请访问 http://localhost:3000
```

### child-process

为什么需要 child-process?
node 是异步非阻塞的，这对高并发非常有效．可是我们还有其它一些常用需求，比如和操作系统 shell 命令交互，调用可执行文件，创建子进程进行阻塞式访问或高 CPU 计算等，child-process 就是为满足这些需求而生的．child-process 顾名思义，就是把 node 阻塞的工作交给子进程去做．

exec,execFile,spawn 和 fork 都是做什么用的?
exec 可以用操作系统原生的方式执行各种命令，如管道 cat ab.txt | grep hello; execFile 是执行一个文件; spawn 是流式和操作系统进行交互; fork 是两个 node 程序(javascript)之间时行交互.

实现一个简单的命令行交互程序?
使用 spawn

```js
var cp = require('child_process');

var child = cp.spawn('echo', ['你好', '钩子']); // 执行命令
child.stdout.pipe(process.stdout); // child.stdout是输入流，process.stdout是输出流
// 这句的意思是将子进程的输出作为当前程序的输入流，然后重定向到当前程序的标准输出，即控制台
```

两个 node 程序之间怎样交互:
用 fork 嘛，上面讲过了．原理是子程序用 process.on, process.send，父程序里用 child.on,child.send 进行交互.

```js
1) fork-parent.js
	var cp = require('child_process');
	var child = cp.fork('./fork-child.js');
	child.on('message', function(msg){
		console.log('老爸从儿子接受到数据:', msg);
	});
	child.send('我是你爸爸，送关怀来了!');

	2) fork-child.js
	process.on('message', function(msg){
		console.log("儿子从老爸接收到的数据:", msg);
		process.send("我不要关怀，我要银民币！");
	});
```

怎样让一个 js 文件变得像 linux 命令一样可执行?

- 1. 在 myCommand.js 文件头部加入 #!/usr/bin/env node
- 1. chmod 命令把 js 文件改为可执行即可
- 1. 进入文件目录，命令行输入 myComand 就是相当于 node myComand.js 了

child-process 和 process 的 stdin,stdout,stderror 是一样的吗?
概念都是一样的，输入，输出，错误，都是流．区别是在父程序眼里，子程序的 stdout 是输入流，stdin 是输出流

### path.join 与 path.resolve 的区别

1. path.join(path1，path2，path3.......)
   作用：将路径片段使用特定的分隔符（window：\）连接起来形成路径，并规范化生成的路径。若任意一个路径片段类型错误，会报

2. path.resolve([from...],to)
   作用：把一个路径或路径片段的序列解析为一个绝对路径。相当于执行 cd 操作

以 webpack 中 webpack.config.js 配置路径为例

```js
const DIST_DIR = path.resolve(__dirname, '../dist'); // 设置静态访问文件路径
const DIST_DIRs = path.join(__dirname, '/dist');

console.log(__dirname); // ...../React-Whole-barrels/build 即当前文件夹的绝对路径
console.log(DIST_DIR); // ..../React-Whole-barrels/dist  这是相对于当前文件夹的另一个文件的路径
console.log(DIST_DIRs); //...../React-Whole-barrels/build/dist 这是将两个路径连接起来
```

### Node.js 的适用场景

1. 高并发
2. 聊天
3. 实时消息推送

### 对 Node 的优点和缺点提出了自己的看法？

优点：

1. 因为 Node 是基于事件驱动和无阻塞的，所以非常适合处理并发请求，因此构建在 Node 上的代理服务器相比其他技术实现（如 Ruby）的服务器表现要好得多。
2. 与 Node 代理服务器交互的客户端代码是由 javascript 语言编写的，因此客户端和服务器端都用同一种语言编写，这是非常美妙的事情。

缺点：

1.  Node 是一个相对新的开源项目，所以不太稳定，它总是一直在变。
2.  缺少足够多的第三方库支持。看起来，就像是 Ruby/Rails 当年的样子（第三方库现在已经很丰富了，所以这个缺点可以说不存在了）。

- 使用箭头函数需要注意的地方有哪些？
- 说说你对 set 数据结构的理解
- 说说你对 class 的理解
- rest 参数你有了解吗
- 谈谈你对 es6 的 module 体系的理解

### Express 和 koa 各有啥优缺点?

1. Koa 虽然同它哥 Express 说的一样，是 Web Framework。不过从架构功能设计和架构设计上看，它更像它舅舅（原谅我亲戚关系懵了）── Connect。更多是一个中间件框架，其提供的是一个架子，而几乎所有的功能都需要由第三方中间件完成。

2. Express 更为贴近 Web Framework 这一概念，比如自带 Router、路由规则等（在没有剥离 bodyParser 之前更为贴切）；相比之下 Koa 则更为宽松，光是 Router 就有 20+ 个，自由选择嘛（Home · koajs/koa Wiki · GitHub），更为灵活。 死马 （Koa 的 maintainer 之一）也发布了一个推荐的常用中间件合集包 koa-middlewares

3. Express 和 Koa 最明显的差别就是 Handler 的处理方法，一个是普通的回调函数，一个是利用生成器函数（Generator Function）来作为响应器。往里头儿说就是 Express 是在同一线程上完成当前进程的所有 HTTP 请求，而 Koa 利用 co 作为底层运行框架，利用 Generator 的特性，实现“协程响应”（并不能将 Generator 等价于协程，在 V8 的邮件列表中对 Generator 的定义基本是 `coroutine-like`），然而 co 这个库对 Generator 的使用方法并非当初 Generator 的设计初衷。详细可以看这里：Koa, co and coroutine

4. 还是要感谢 TJ 创造了 co 这个大杀器吧，让我们基本完全忘记了什么是回调函数或者 callbacks hell。虽然实现方法略微取巧，但是就大大加速了开发速度这一点而言，已经足以让我们跪舔了。
