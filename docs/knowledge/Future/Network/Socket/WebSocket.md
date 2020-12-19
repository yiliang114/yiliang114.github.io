---
layout: CustomPages
title: Socket
date: 2020-11-21
aside: false
draft: true
---

### 简要介绍一下 socket 协议

### Websocket

Websocket 是一个 持久化的协议， 基于 http ， 服务端可以 主动 push

兼容：

- FLASH Socket
- 长轮询： 定时发送 ajax
- long poll： 发送 --> 有消息时再 response

用法：

- new WebSocket(url)
- ws.onerror = fn
- ws.onclose = fn
- ws.onopen = fn
- ws.onmessage = fn
- ws.send()

websocket

- [你知道什么是 websocket 吗？它有什么应用场景？](https://github.com/haizlin/fe-interview/issues/575)

### WebSocket 的实现和应用

(1)什么是 WebSocket?
WebSocket 是 HTML5 中的协议，支持持久连续，http 协议不支持持久性连接。Http1.0 和 HTTP1.1 都不支持持久性的链接，HTTP1.1 中的 keep-alive，将多个 http 请求合并为 1 个

(2)WebSocket 是什么样的协议，具体有什么优点？

- HTTP 的生命周期通过 Request 来界定，也就是 Request 一个 Response，那么在 Http1.0 协议中，这次 Http 请求就结束了。在 Http1.1 中进行了改进，是的有一个 connection：Keep-alive，也就是说，在一个 Http 连接中，可以发送多个 Request，接收多个 Response。但是必须记住，在 Http 中一个 Request 只能对应有一个 Response，而且这个 Response 是被动的，不能主动发起。
- WebSocket 是基于 Http 协议的，或者说借用了 Http 协议来完成一部分握手，在握手阶段与 Http 是相同的。我们来看一个 websocket 握手协议的实现，基本是 2 个属性，upgrade，connection。

基本请求如下

```js
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

多了下面 2 个属性

```js
Upgrade:webSocket
Connection:Upgrade
告诉服务器发送的是websocket
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```

### WebSocket 与消息推送？

B/S 架构的系统多使用 HTTP 协议，
HTTP 协议的特点： 1 无状态协议 2 用于通过 Internet 发送请求消息和响应消息 3 使用端口接收和发送消息，默认为 80 端口 底层通信还是 Socket 完成。
HTTP 协议决定了服务器与客户端之间的连接方式，无法直接实现消息推送（ F5 已坏） , 一些变相的解决办法：
双向通信与消息推送
轮询：客户端定时向服务器发送 Ajax 请求，服务器接到请求后马上返回响应信息并关闭连接。
优点：后端程序编写比较容易。
缺点：请求中有大半是无用，浪费带宽和服务器资源。
实例：适于小型应用。
长轮询：客户端向服务器发送 Ajax 请求，服务器接到请求后 hold 住连接，直到有新消息才返回响应信息并关闭连接，客户端处理完响应信息后再向器发送新的请求。
优点：在无消息的情况下不会频繁的请求，耗费资小。
缺点：服务器 hold 连接会消耗资源，返回数据顺序无保证，难于管理维护。 Comet 异步的 ashx ，
实例：WebQQ、 Hi 网页版、 Facebook IM 。
长连接：在页面里嵌入一个隐蔵 iframe，将这个隐蔵 iframe 的 src 属性设为对一个长连接的请求或是采用 xhr 请求，服务器端就能源源不断地户端输入数据。
优点：消息即时到达，不发无用请求；管理起来也相对便。
缺点：服务器维护一个长连接会增加开销。
实例：Gmail 聊天

Flash Socket：在页面中内嵌入一个使用了 Socket 类的 Flash 程序 JavaScript 通过调用此 Flash 程序提供的 Socket 接口与服务器端 Socket 接口进行通信， JavaScript 在收到服务器端传送的信息后控制页面的显示。
优点：实现真正的即时通信，而不是伪即时。
缺点：客户端必须安装 Flash 插件；非 HTTP 协议，无法自动穿越防火墙。
实例：网络互动游戏。
Websocket:
WebSocket 是 HTML5 开始提供的一种浏览器与服务器间进行全双工通讯的网络技术。依靠这种技术可以实现客户端和服务器端的长连接，双向实信。
特点:
a、事件驱动
b、异步
c、使用 ws 或者 wss 协议的客户端 socket
d、能够实现真正意义上的推送功能
缺点：少部分浏览器不支持，浏览器支持的程度与方式有区别。

### webSocket 如何兼容低浏览

- Adobe Flash Socket 、
- ActiveX HTMLFile (IE) 、
- 基于 multipart 编码发送 XHR 、
- 基于长轮询的 XHR

### websocket

在单个 TCP 连接上进行全双工通讯的协议。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建**持久性**的连接，并进行**双向**数据传输。

- Socket.onopen 连接建立时触发
- Socket.onmessage 客户端接收服务端数据时触发
- Socket.onerror 通信发生错误时触发
- Socket.onclose 连接关闭时触发

### 对 websocket 的理解？

WebSocket 协议在 2008 年诞生，2011 年成为国际标准。所有浏览器都已经支持了。

WebSocket 是一个持久化的协议，是基于 http 协议来完成一部分握手。

Websocket 握手中多了:
Upgrade: websocket
Connection: Upgrade
这就是 WebSocket 的核心，告诉服务器是一个 WebSocket 协议。

> ajax 轮询和 long poll 都是不断的建立 http 连接，等待服务端处理，可以体现 http 协议的一个特点：被动性（服务器端不能主动联系客户端，只能客户端发起）。
>
> - ajax 轮询</br>

    ajax轮询的原理特别简单。让浏览器隔个几秒就发送一次请求，询问服务器是否有新信息。

> - long poll</br>

    long poll 其实原理跟 ajax轮询 差不多，都是采用轮询的方式，不过采取的是阻塞模型（一直打电话，没收到就不挂电话），也就是说，客户端发起连接后，如果没消息，就一直不返回Response给客户端。直到有消息才返回，返回完之后，客户端再次建立连接，周而复始。

#### 特点

- 服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。
- 建立在 TCP 协议之上，服务器端的实现比较容易。
- 与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。

* 数据格式比较轻量，性能开销小，通信高效。
* 可以发送文本，也可以发送二进制数据。
* 没有同源限制，客户端可以与任意服务器通信。
* 协议标识符是 ws（如果加密，则为 wss），服务器网址就是 URL。

  ![ws和wss](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/ws.png)

#### 使用

主要是的是`webSocket.onmessage`属性，用于指定接收服务器数据后的回调函数。`webSocket.send()`方法，可用于向服务器发送数据。

#### 参考

- [websocket 原理](https://www.cnblogs.com/fuqiang88/p/5956363.html)

### 了解 websocket 吗，websocket 是如何进行握手的
