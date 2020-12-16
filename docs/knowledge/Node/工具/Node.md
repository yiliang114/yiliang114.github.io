---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### node

- 一个小工具： 能够保存所有请求的返回到本地 json 中，保证离线状态下 web 的可运行性。
- 浏览器的 js 是单线程，但是 nodejs 是多线程，为什么说 node 对于多线程支持很好？
- nodejs 的环境变量： process.env.NODE_ENV = 'production'
- 获取脚本执行的 localhost 地址 https://blog.csdn.net/panyang01/article/details/79353999
- Eggjs: https://cnodejs.org/topic/5b7d1504632c7f422e5b8080
- nodejs html 解析 -- Cheerio http://www.cnblogs.com/CraryPrimitiveMan/p/3674421.html
- nodejs 你了解多少？
- 所有的 ES6 特性你都知道吗？如果遇到一个东西不知道是 ES6 还是 ES5, 你该怎么区分它
- Express 和 koa 有什么关系，有什么区别？
- 为什么选 nodeJS 为什么不喜欢 php 和 python?
- Nodejs 中的 Stream 和 Buffer 有什么区别？
- Node 的全局变量有哪些
- node 是如何实现高并发的？
- 说一下 Nodejs 的 event loop 的原理， https://www.jianshu.com/p/10714ad38f9a
- 简述公司 node 架构中容灾的实现 ?
- SSR 和 客户端渲染有什么区别
- nodejs 的进程和线程
- nodejs 中通常如何使用 session
- nodejs 手写一个 tcp socket 连接 （涉及到 nodejs 的源码）

- 说说 nodejs 的 buffer 与 stream 的关系（流对象，只能操作 string 和 buffer）
- 对 nodejs 有没有了解
- Express 和 koa 有什么关系，有什么区别？
- nodejs 适合做什么样的业务？
- nodejs 与 php，java 有什么区别
- Nodejs 中的 Stream 和 Buffer 有什么区别？
- node 的异步问题是如何解决的？
- node 是如何实现高并发的？
- 说一下 Nodejs 的 event loop 的原理

- egg 路由
  http://www.ptbird.cn/EggJS-router-more.html

* 有一套初步的 nodejs 后台快速搭建的解决方案：
  描述：

  1. 事件模型
  2. 中间件机制
  3. 日志系统如何进行处理
  4. 如何鉴权

  <https://baijiahao.baidu.com/s?id=1589718820513455212&wfr=spider&for=pc>

### API

https://www.cnblogs.com/qiuzhimutou/p/4758898.html
http://blog.csdn.net/fdipzone/article/details/51253955

### 为什么要用 node?

总结起来 node 有以下几个特点:简单强大，轻量可扩展．简单体现在 node 使用的是 javascript,json 来进行编码，人人都会；强大体现在非阻塞 IO,可以适应分块传输数据，较慢的网络环境，尤其擅长高并发访问；轻量体现在 node 本身既是代码，又是服务器，前后端使用统一语言;可扩展体现在可以轻松应对多实例，多服务器架构，同时有海量的第三方应用组件

### node 有哪些全局对象?

process, console, Buffer

process 常用方法:

- process.stdin,
- process.stdout
- process.stderr,
- process.on,
- process.env
- process.argv
- process.arch
- process.platform
- process.exit

console 常用方法:

- console.log/console.info
- console.error/console.warning,
- console.time/console.timeEnd
- console.trace
- console.table

Buffer 是用来处理二进制数据的，比如图片，mp3,数据库文件等.Buffer 支持各种编码解码，二进制字符串互转

### node 有哪些定时功能

setTimeout/clearTimeout, setInterval/clearInterval, setImmediate/clearImmediate, process.nextTick

### node 的构架是什么样子的?

主要分为三层，应用 app >> V8 及 node 内置架构 >> 操作系统. V8 是 node 运行的环境，可以理解为 node 虚拟机．node 内置架构又可分为三层: 核心模块(javascript 实现) >> c++绑定 >> libuv + CAes + http

![image](https://user-images.githubusercontent.com/21194931/56270693-53dc2300-6129-11e9-931a-cf2b9cd0c8d4.png)

node 核心模块：EventEmitter, Stream, FS, Net 和全局对象

### 对 Node 的优点和缺点提出了自己的看法？

\*（优点）因为 Node 是基于事件驱动和无阻塞的，所以非常适合处理并发请求，
因此构建在 Node 上的代理服务器相比其他技术实现（如 Ruby）的服务器表现要好得多。
此外，与 Node 代理服务器交互的客户端代码是由 javascript 语言编写的，
因此客户端和服务器端都用同一种语言编写，这是非常美妙的事情。

\*（缺点）Node 是一个相对新的开源项目，所以不太稳定，它总是一直在变，
而且缺少足够多的第三方库支持。看起来，就像是 Ruby/Rails 当年的样子。

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
二者主要用来监听文件变动．fs.watch 利用操作系统原生机制来监听，可能不适用网络文件系统; fs.watchFile 则是定期检查文件状态变更，适用于网络文件系统，但是相比 fs.watch 有些慢，因为不是实时机制

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

### node 异步，部署，性能调优，异常调试

node 中的异步和同步怎么理解
node 是单线程的，异步是通过一次次的循环事件队列来实现的．同步则是说阻塞式的 IO,这在高并发环境会是一个很大的性能问题，所以同步一般只在基础框架的启动时使用，用来加载配置文件，初始化程序什么的．

有哪些方法可以进行异步流程的控制?

- 1. 多层嵌套回调
- 2)　为每一个回调写单独的函数，函数里边再回调
- 1. 用第三方框架比方 async, q, promise 等

怎样绑定 node 程序到 80 端口?
多种方式 1) sudo 2) apache/nginx 代理 3) 用操作系统的 firewall iptables 进行端口重定向

有哪些方法可以让 node 程序遇到错误后自动重启?

- 1. runit
- 1. forever
- 1. nohup npm start &

怎样充分利用多个 CPU?
一个 CPU 运行一个 node 实例

怎样调节 node 执行单元的内存大小?
用--max-old-space-size 和 --max-new-space-size 来设置 v8 使用内存的上限

程序总是崩溃，怎样找出问题在哪里?

- 1. node --prof 查看哪些函数调用次数多
- 1. memwatch 和 heapdump 获得内存快照进行对比，查找内存溢出

有哪些常用方法可以防止程序崩溃?

- 1. try-catch-finally
- 1. EventEmitter/Stream error 事件处理
- 1. domain 统一控制
- 1. jshint 静态检查 5) jasmine/mocha 进行单元测试

怎样调试 node 程序?
node --debug app.js 和 node-inspector

如何捕获 NodeJS 中的错误，有几种方法?

- 1. 监听错误事件 req.on('error', function(){}), 适用 EventEmitter 存在的情况;
- 1. Promise.then.catch(error),适用 Promise 存在的情况
- 1. try-catch,适用 async-await 和 js 运行时异常，比如 undefined object

### async

async]常用方法:
async 是一个 js 类库，它的目的是解决 js 中异常流程难以控制的问题．async 不仅适用在 node.js 里，浏览器中也可以使用．
1.async.parallel 并行执行完多个函数后，调用结束函数

```js
async.parallel([
	    function(){ ... },
	    function(){ ... }
	], callback);
```

2.async.series 串行执行完多个函数后，调用结束函数

```js
	async.series([
	    function(){ ... },
	    function(){ ... }
	]);
```

3.async.waterfall 依次执行多个函数，后一个函数以前面函数的结果作为输入参数

```js
async.waterfall(
  [
    function(callback) {
      callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback) {
      // arg1 now equals 'one' and arg2 now equals 'two'
      callback(null, 'three');
    },
    function(arg1, callback) {
      // arg1 now equals 'three'
      callback(null, 'done');
    },
  ],
  function(err, result) {
    // result now equals 'done'
  },
);
```

4.async.map 异步执行多个数组，返回结果数组

```js
async.map(['file1', 'file2', 'file3'], fs.stat, function(err, results) {
  // results is now an array of stats for each file
});
```

5.async.filter 异步过滤多个数组，返回结果数组

```js
async.filter(['file1', 'file2', 'file3'], fs.exists, function(results) {
  // results now equals an array of the existing files
});
```

### Express

express 项目的目录
app.js, package.json, bin/www, public, routes, views.

express 常用函数
express.Router 路由组件,app.get 路由定向，app.configure 配置，app.set 设定参数,app.use 使用中间件

express 中如何获取路由的参数
/users/:name 使用 req.params.name 来获取; req.body.username 则是获得表单传入参数 username; express 路由支持常用通配符 ?, +, \*, and ()

express response 常用方法
res.download() 弹出文件下载
res.end() 结束 response
res.json() 返回 json
res.jsonp() 返回 jsonp
res.redirect() 重定向请求
res.render() 渲染模板
res.send() 返回多种形式数据
res.sendFile 返回文件
res.sendStatus() 返回状态

### mongodb 与 mongoose

mongodb 常用优化措施
类似传统数据库，索引和分区．

mongoose 支持哪些特性:
mongoose 是 mongodb 的文档映射模型．主要由 Schema, Model 和 Instance 三个方面组成．Schema 就是定义数据类型，Model 就是把 Schema 和 js 类绑定到一起，Instance 就是一个对象实例．常见 mongoose 操作有,save, update, find. findOne, findById, static 方法等．

### redis 最简单的应用

redis 支持的功能：
set/get, mset/hset/hmset/hmget/hgetall/hkeys, sadd/smembers, publish/subscribe, expire

简单应用：

```js
var redis = require('redis'),
  client = redis.createClient();

client.set('foo_rand000000000000', 'some fantastic value');
client.get('foo_rand000000000000', function(err, reply) {
  console.log(reply.toString());
});
client.end();
```

### apache,nginx 有什么区别?

二者都是代理服务器，功能类似．apache 应用简单，相当广泛．nginx 在分布式，静态转发方面比较有优势．

### path.join 与 path.resolve 的区别

一.path.join(path1，path2，path3.......)
作用：将路径片段使用特定的分隔符（window：\）连接起来形成路径，并规范化生成的路径。若任意一个路径片段类型错误，会报
二.path.resolve([from...],to)
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

### 如何判断当前脚本运行在浏览器还是 node 环境中？

    通过判断 Global 对象是否为window，如果不为window，当前脚本没有运行在浏览器中。即在node中的全局变量是global ,浏览器的全局变量是window。 可以通过该全局变量是否定义来判断宿主环境

### 对 Node 的优点和缺点提出了自己的看法？

    优点：
    1. 因为Node是基于事件驱动和无阻塞的，所以非常适合处理并发请求，因此构建在Node上的代理服务器相比其他技术实现（如Ruby）的服务器表现要好得多。
    2. 与Node代理服务器交互的客户端代码是由javascript语言编写的，因此客户端和服务器端都用同一种语言编写，这是非常美妙的事情。

    缺点：
    1. Node是一个相对新的开源项目，所以不太稳定，它总是一直在变。
    2. 缺少足够多的第三方库支持。看起来，就像是Ruby/Rails当年的样子（第三方库现在已经很丰富了，所以这个缺点可以说不存在了）。

- [使用箭头函数需要注意的地方有哪些？]()
- [let 和 const 的区别是什么]()
- [说说你对 set 数据结构的理解]()
- [说说你对 class 的理解]()
- [rest 参数你有了解吗]()
- [谈谈你对 es6 的 module 体系的理解]()
- [手写一个 promise 方法]()

### Express 和 koa 各有啥优缺点?

1. Koa 虽然同它哥 Express 说的一样，是 Web Framework。不过从架构功能设计和架构设计上看，它更像它舅舅（原谅我亲戚关系懵了）── Connect。更多是一个中间件框架，其提供的是一个架子，而几乎所有的功能都需要由第三方中间件完成。
2. Express 更为贴近 Web Framework 这一概念，比如自带 Router、路由规则等（在没有剥离 bodyParser 之前更为贴切）；相比之下 Koa 则更为宽松，光是 Router 就有 20+ 个，自由选择嘛（Home · koajs/koa Wiki · GitHub），更为灵活。 死马 （Koa 的 maintainer 之一）也发布了一个推荐的常用中间件合集包 koa-middlewares(http://npmjs.org/package/koa-middlewares)。
3. Express 和 Koa 最明显的差别就是 Handler 的处理方法，一个是普通的回调函数，一个是利用生成器函数（Generator Function）来作为响应器。往里头儿说就是 Express 是在同一线程上完成当前进程的所有 HTTP 请求，而 Koa 利用 co 作为底层运行框架，利用 Generator 的特性，实现“协程响应”（并不能将 Generator 等价于协程，在 V8 的邮件列表中对 Generator 的定义基本是 `coroutine-like`），然而 co 这个库对 Generator 的使用方法并非当初 Generator 的设计初衷。详细可以看这里：Koa, co and coroutine
4. 还是要感谢 TJ 创造了 co 这个大杀器吧，让我们基本完全忘记了什么是回调函数或者 callbacks hell。虽然实现方法略微取巧，但是就大大加速了开发速度这一点而言，已经足以让我们跪舔了。
