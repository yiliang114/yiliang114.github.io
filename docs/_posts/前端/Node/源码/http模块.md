---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### HTTP 模块

做 node 服务端编程，net 基本是绕不开的一个模块。

前端最熟悉的`http`协议属于应用层协议，应用层的内容想要发送出去，还需要将消息逐层下发，通过传输层（`tcp`,`udp`），网际层(`ip`)和更底层的网络接口后才能被传输出去。`net`模块就是对分层通讯模型的实现。

`net`模块中有两大主要抽象概念——`net.Server`和`net.Socket`。《deep-into-node》一书中对`Socket`概念进行了解释：

Socket 是对 TCP/IP 协议族的一种封装，是应用层与 TCP/IP 协议族通信的中间软件抽象层。它把复杂的 TCP/IP 协议族隐藏在 Socket 接口后面，对用户来说，一组简单的接口就是全部，让 Socket 去组织数据，以符合指定的协议。

Socket 还可以认为是一种网络间不同计算机上的进程通信的一种方法，利用三元组（ip 地址，协议，端口）就可以唯一标识网络中的进程，网络中的进程通信可以利用这个标志与其它进程进行交互。

简单地说，`net.Server`实例可以监听一个端口（用于实现客户端`TCP`连接通讯）或者地址（用于实现`IPC`跨进程通讯），`net.Socket`实例可以建立一个套接字实例，它可以用来和`server`建立连接，连接建立后，就可以实现通讯了。

使用 nodejs 起一个简单的 http server :

```
'use stirct'
const { createServer } = require('http')

createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World\n')
})
.listen(3000, function () { console.log('Listening on port 3000') })
```

#### Node.js 的 http 模块

源码在 `lib/http.js` 中。通过 createServer 函数的实现可以看到， 实际是创建了一个 Server 实例， 传入了选项参数和监听器回调函数。

```
function createServer(opts, requestListener) {
  return new Server(opts, requestListener);
}
```
