---
layout: CustomPages
title: Socket
date: 2020-11-21
aside: false
draft: true
---

## Socket

### Socket 基本概念

Socket 是对 TCP/IP 协议族的一种封装，是应用层与 TCP/IP 协议族通信的中间软件抽象层。从设计模式的角度看来，Socket 其实就是一个门面模式，它把复杂的 TCP/IP 协议族隐藏在 Socket 接口后面，对用户来说，一组简单的接口就是全部，让 Socket 去组织数据，以符合指定的协议。

Socket 还可以认为是一种网络间不同计算机上的进程通信的一种方法，利用三元组（ip 地址，协议，端口）就可以唯一标识网络中的进程，网络中的进程通信可以利用这个标志与其它进程进行交互。

Socket 起源于 Unix ，Unix/Linux 基本哲学之一就是“一切皆文件”，都可以用“打开(open) –> 读写(write/read) –> 关闭(close)”模式来进行操作。因此 Socket 也被处理为一种特殊的文件。

### 写一个简易的 WebServer

一个简易的 Server 的流程如下：

- 1.建立连接，接受一个客户端连接。
- 2.接受请求，从网络中读取一条 HTTP 请求报文。
- 3.处理请求，访问资源。
- 4.构建响应，创建带有 header 的 HTTP 响应报文。
- 5.发送响应，传给客户端。

省略流程 3，大体的程序与调用的函数逻辑如下：

- socket() 创建套接字
- bind() 分配套接字地址
- listen() 等待连接请求
- accept() 允许连接请求
- read()/write() 数据交换
- close() 关闭连接

代码如下：

```cpp
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <unistd.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <string>
#include <cstring>
#include <iostream>

using namespace std;

const int port = 9090;
const int buffer_size = 1<<20;
const int method_size = 1<<10;
const int filename_size = 1<<10;
const int common_buffer_size = 1<<10;

void handleError(const string &message);
void requestHandling(int *sock);
void sendError(int *sock);
void sendData(int *sock, char *filename);
void sendHTML(int *sock, char *filename);
void sendJPG(int *sock, char *filename);

int main()
{
	int server_sock;
	int client_sock;

	struct sockaddr_in server_address;
	struct sockaddr_in client_address;

	socklen_t client_address_size;

    server_sock = socket(PF_INET, SOCK_STREAM, 0);

    if (server_sock == -1)
    {
    	handleError("socket error");
    }

    memset(&server_address,0,sizeof(server_address));
    server_address.sin_family = AF_INET;
    server_address.sin_addr.s_addr = htonl(INADDR_ANY);
    server_address.sin_port = htons(port);

    if(bind(server_sock,(struct sockaddr*)&server_address, sizeof(server_address)) == -1){
    	handleError("bind error");
    }

    if(listen(server_sock, 5) == -1) {
    	handleError("listen error");
    }

    while(true) {
        client_address_size = sizeof(client_address);
        client_sock = accept(server_sock, (struct sockaddr*) &client_address, &client_address_size);

        if (client_sock == -1) {
            handleError("accept error");
        }
        requestHandling(&client_sock);
    }

    //system("open http://127.0.0.1:9090/index.html");
    close(server_sock);

	return 0;
}

void requestHandling(int *sock){
    int client_sock = *sock;
    char buffer[buffer_size];
    char method[method_size];
    char filename[filename_size];

    read(client_sock, buffer, sizeof(buffer)-1);

    if(!strstr(buffer, "HTTP/")) {
        sendError(sock);
        close(client_sock);
        return;
    }

    strcpy(method, strtok(buffer," /"));
    strcpy(filename, strtok(NULL, " /"));

    if(0 != strcmp(method, "GET")) {
        sendError(sock);
        close(client_sock);
        return;
    }

    sendData(sock, filename);
}

void sendData(int *sock, char *filename) {
    int client_sock = *sock;
    char buffer[common_buffer_size];
    char type[common_buffer_size];

    strcpy(buffer, filename);

    strtok(buffer, ".");
    strcpy(type, strtok(NULL, "."));

    if(0 == strcmp(type, "html")){
        sendHTML(sock, filename);
    }else if(0 == strcmp(type, "jpg")){
        sendJPG(sock, filename);
    }else{
        sendError(sock);
        close(client_sock);
        return ;
    }
}

void sendHTML(int *sock, char *filename) {
    int client_sock = *sock;
    char buffer[buffer_size];
    FILE *fp;

    char status[] = "HTTP/1.0 200 OK\r\n";
    char header[] = "Server: A Simple Web Server\r\nContent-Type: text/html\r\n\r\n";

    write(client_sock, status, strlen(status));
    write(client_sock, header, strlen(header));

    fp = fopen(filename, "r");
    if(!fp){
        sendError(sock);
        close(client_sock);
        handleError("failed to open file");
        return ;
    }

    fgets(buffer,sizeof(buffer), fp);
    while(!feof(fp)) {
        write(client_sock, buffer, strlen(buffer));
        fgets(buffer, sizeof(buffer), fp);
    }

    fclose(fp);
    close(client_sock);
}

void sendJPG(int *sock, char *filename) {
    int client_sock = *sock;
    char buffer[buffer_size];
    FILE *fp;
    FILE *fw;

    char status[] = "HTTP/1.0 200 OK\r\n";
    char header[] = "Server: A Simple Web Server\r\nContent-Type: image/jpeg\r\n\r\n";

    write(client_sock, status, strlen(status));
    write(client_sock, header, strlen(header));

    fp = fopen(filename, "rb");
    if(NULL == fp){
        sendError(sock);
        close(client_sock);
        handleError("failed to open file");
        return ;
    }

    fw = fdopen(client_sock, "w");
    fread(buffer, 1, sizeof(buffer), fp);
    while (!feof(fp)){
        fwrite(buffer, 1, sizeof(buffer), fw);
        fread(buffer, 1, sizeof(buffer), fp);
    }

    fclose(fw);
    fclose(fp);
    close(client_sock);
}

void handleError(const string &message) {
	cout<<message;
	exit(1);
}

void sendError(int *sock){
    int client_sock = *sock;

    char status[] = "HTTP/1.0 400 Bad Request\r\n";
    char header[] = "Server: A Simple Web Server\r\nContent-Type: text/html\r\n\r\n";
    char body[] = "<html><head><title>Bad Request</title></head><body><p>400 Bad Request</p></body></html>";

    write(client_sock, status, sizeof(status));
    write(client_sock, header, sizeof(header));
    write(client_sock, body, sizeof(body));
}
```

## Websocket

### Websocket 简介

WebSocket 是 HTML5 新增的协议，它的目的是在浏览器和服务器之间建立一个不受限的双向通信的通道，比如说，服务器可以在任意时刻发送消息给浏览器。

为什么传统的 HTTP 协议不能做到 WebSocket 实现的功能？这是因为 HTTP 协议是一个请求－响应协议，请求必须先由浏览器发给服务器，服务器才能响应这个请求，再把数据发送给浏览器。换句话说，浏览器不主动请求，服务器是没法主动发数据给浏览器的。

这样一来，要在浏览器中搞一个实时聊天，在线炒股（不鼓励），或者在线多人游戏的话就没法实现了，只能借助 Flash 这些插件。

也有人说，HTTP 协议其实也能实现啊，比如用轮询或者 Comet。轮询是指浏览器通过 JavaScript 启动一个定时器，然后以固定的间隔给服务器发请求，询问服务器有没有新消息。这个机制的缺点一是实时性不够，二是频繁的请求会给服务器带来极大的压力。

Comet 本质上也是轮询，但是在没有消息的情况下，服务器先拖一段时间，等到有消息了再回复。这个机制暂时地解决了实时性问题，但是它带来了新的问题：以多线程模式运行的服务器会让大部分线程大部分时间都处于挂起状态，极大地浪费服务器资源。另外，一个 HTTP 连接在长时间没有数据传输的情况下，链路上的任何一个网关都可能关闭这个连接，而网关是我们不可控的，这就要求 Comet 连接必须定期发一些 ping 数据表示连接“正常工作”。

以上两种机制都治标不治本，所以，HTML5 推出了 WebSocket 标准，让浏览器和服务器之间可以建立无限制的全双工通信，任何一方都可以主动发消息给对方。

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

### 简要介绍一下 socket 协议

### WebSocket 协议

WebSocket 并不是全新的协议，而是利用了 HTTP 协议来建立连接。我们来看看 WebSocket 连接是如何创建的。

首先，WebSocket 连接必须由浏览器发起，因为请求协议是一个标准的 HTTP 请求，格式如下：

```
GET ws://localhost:3000/ws/chat HTTP/1.1
Host: localhost
Upgrade: websocket
Connection: Upgrade
Origin: http://localhost:3000
Sec-WebSocket-Key: client-random-string
Sec-WebSocket-Version: 13
```

该请求和普通的 HTTP 请求有几点不同：

1. GET 请求的地址不是类似/path/，而是以 ws://开头的地址；
2. 请求头 Upgrade: websocket 和 Connection: Upgrade 表示这个连接将要被转换为 WebSocket 连接；
3. Sec-WebSocket-Key 是用于标识这个连接，并非用于加密数据；
4. Sec-WebSocket-Version 指定了 WebSocket 的协议版本。

随后，服务器如果接受该请求，就会返回如下响应：

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: server-random-string
```

该响应代码`101`表示本次连接的 HTTP 协议即将被更改，更改后的协议就是 Upgrade: websocket 指定的 WebSocket 协议。

版本号和子协议规定了双方能理解的数据格式，以及是否支持压缩等等。如果仅使用 WebSocket 的 API，就不需要关心这些。

现在，一个 WebSocket 连接就建立成功，浏览器和服务器就可以随时主动发送消息给对方。消息有两种，一种是文本，一种是二进制数据。通常，我们可以发送 JSON 格式的文本，这样，在浏览器处理起来就十分容易。

为什么 WebSocket 连接可以实现全双工通信而 HTTP 连接不行呢？实际上 HTTP 协议是建立在 TCP 协议之上的，TCP 协议本身就实现了全双工通信，但是 HTTP 协议的请求－应答机制限制了全双工通信。WebSocket 连接建立以后，其实只是简单规定了一下：接下来，咱们通信就不使用 HTTP 协议了，直接互相发数据吧。

安全的 WebSocket 连接机制和 HTTPS 类似。首先，浏览器用 wss://xxx 创建 WebSocket 连接时，会先通过 HTTPS 创建安全的连接，然后，该 HTTPS 连接升级为 WebSocket 连接，底层通信走的仍然是安全的 SSL/TLS 协议。

**浏览器**

很显然，要支持 WebSocket 通信，浏览器得支持这个协议，这样才能发出 ws://xxx 的请求。目前，支持 WebSocket 的主流浏览器如下：

- Chrome
- Firefox
- IE >= 10
- Sarafi >= 6
- Android >= 4.4
- iOS >= 8

**服务器**

由于 WebSocket 是一个协议，服务器具体怎么实现，取决于所用编程语言和框架本身。Node.js 本身支持的协议包括 TCP 协议和 HTTP 协议，要支持 WebSocket 协议，需要对 Node.js 提供的 HTTPServer 做额外的开发。已经有若干基于 Node.js 的稳定可靠的 WebSocket 实现，我们直接用 npm 安装使用即可。

> 注：本篇文章转载于廖雪峰 websocket 教程

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

### 了解 websocket 吗，websocket 是如何进行握手的
