---
title: HTTP
date: 2020-11-21
draft: true
---

### 基础概念

- URI 统一资源标识符
- URL 统一资源定位符

HTTP 的特性:

- HTTP 协议构建于 TCP/IP 协议之上，是一个应用层协议，默认端口号是 80
- HTTP 是**无连接无状态**的

### 具体应用

#### Cookie

HTTP 协议是无状态的，主要是为了让 HTTP 协议尽可能简单，使得它能够处理大量事务。HTTP/1.1 引入 Cookie 来保存状态信息。

Cookie 是服务器发送给客户端的数据，该数据会被保存在浏览器中，并且客户端的下一次请求报文会包含该数据。通过 Cookie 可以让服务器知道两个请求是否来自于同一个客户端，从而实现保持登录状态等功能。

##### 1. 创建过程

服务器发送的响应报文包含 Set-Cookie 字段，客户端得到响应报文后把 Cookie 内容保存到浏览器中。

```html
HTTP/1.0 200 OK Content-type: text/html Set-Cookie: yummy_cookie=choco Set-Cookie: tasty_cookie=strawberry [page
content]
```

客户端之后发送请求时，会从浏览器中读出 Cookie 值，在请求报文中包含 Cookie 字段。

```html
GET /sample_page.html HTTP/1.1 Host: www.example.org Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```

##### 2. 分类

- 会话期 Cookie：浏览器关闭之后它会被自动删除，也就是说它仅在会话期内有效。
- 持久性 Cookie：指定一个特定的过期时间（Expires）或有效期（Max-Age）之后就成为了持久性的 Cookie。

```html
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
```

##### 3. Set-Cookie

|     属性     | 说明                                                                             |
| :----------: | -------------------------------------------------------------------------------- |
|  NAME=VALUE  | 赋予 Cookie 的名称和其值（必需项）                                               |
| expires=DATE | Cookie 的有效期（若不明确指定则默认为浏览器关闭前为止）                          |
|  path=PATH   | 将服务器上的文件目录作为 Cookie 的适用对象（若不指定则默认为文档所在的文件目录） |
| domain=域名  | 作为 Cookie 适用对象的域名（若不指定则默认为创建 Cookie 的服务器的域名）         |
|    Secure    | 仅在 HTTPs 安全通信时才会发送 Cookie                                             |
|   HttpOnly   | 加以限制，使 Cookie 不能被 JavaScript 脚本访问                                   |

##### 4. Session 和 Cookie 区别

Session 是服务器用来跟踪用户的一种手段，每个 Session 都有一个唯一标识：Session ID。当服务器创建了一个 Session 时，给客户端发送的响应报文包含了 Set-Cookie 字段，其中有一个名为 sid 的键值对，这个键值对就是 Session ID。客户端收到后就把 Cookie 保存在浏览器中，并且之后发送的请求报文都包含 Session ID。HTTP 就是通过 Session 和 Cookie 这两种方式一起合作来实现跟踪用户状态的，Session 用于服务器端，Cookie 用于客户端。

##### 5. 浏览器禁用 Cookie 的情况

会使用 URL 重写技术，在 URL 后面加上 sid=xxx 。

##### 6. 使用 Cookie 实现用户名和密码的自动填写

网站脚本会自动从保存在浏览器中的 Cookie 读取用户名和密码，从而实现自动填写。

但是如果 Set-Cookie 指定了 HttpOnly 属性，就无法通过 Javascript 脚本获取 Cookie 信息，这是出于安全性考虑。

#### 缓存

##### 1. 优点

1. 降低服务器的负担；
2. 提高响应速度（缓存资源比服务器上的资源离客户端更近）。

##### 2. 实现方法

1. 让代理服务器进行缓存；
2. 让客户端浏览器进行缓存。

##### 3. Cache-Control 字段

HTTP 通过 Cache-Control 首部字段来控制缓存。

```html
Cache-Control: private, max-age=0, no-cache
```

##### 4. no-cache 指令

该指令出现在请求报文的 Cache-Control 字段中，表示缓存服务器需要先向原服务器验证缓存资源是否过期；

该指令出现在响应报文的 Cache-Control 字段中，表示缓存服务器在进行缓存之前需要先验证缓存资源的有效性。

##### 5. no-store 指令

该指令表示缓存服务器不能对请求或响应的任何一部分进行缓存。

no-cache 不表示不缓存，而是缓存之前需要先进行验证，no-store 才是不进行缓存。

##### 6. max-age 指令

该指令出现在请求报文的 Cache-Control 字段中，如果缓存资源的缓存时间小于该指令指定的时间，那么就能接受该缓存。

该指令出现在响应报文的 Cache-Control 字段中，表示缓存资源在缓存服务器中保存的时间。

Expires 字段也可以用于告知缓存服务器该资源什么时候会过期。在 HTTP/1.1 中，会优先处理 Cache-Control : max-age 指令；而在 HTTP/1.0 中，Cache-Control : max-age 指令会被忽略掉。

#### 持久连接

当浏览器访问一个包含多张图片的 HTML 页面时，除了请求访问 HTML 页面资源，还会请求图片资源，如果每进行一次 HTTP 通信就要断开一次 TCP 连接，连接建立和断开的开销会很大。持久连接只需要建立一次 TCP 连接就能进行多次 HTTP 通信。

<div align="center"> <img src="../pics//450px-HTTP_persistent_connection.svg.png" width=""/> </div><br>

持久连接需要使用 Connection 首部字段进行管理。HTTP/1.1 开始 HTTP 默认是持久化连接的，如果要断开 TCP 连接，需要由客户端或者服务器端提出断开，使用 Connection : close；而在 HTTP/1.1 之前默认是非持久化连接的，如果要维持持续连接，需要使用 Connection : Keep-Alive。

#### 管线化处理

HTTP/1.1 支持管线化处理，可以同时发送多个请求和响应，而不需要发送一个请求然后等待响应之后再发下一个请求。

#### 编码

编码（Encoding）主要是为了对实体进行压缩。常用的编码有：gzip、compress、deflate、identity，其中 identity 表示不执行压缩的编码格式。

#### 分块传输编码

Chunked Transfer Coding，可以把数据分割成多块，让浏览器逐步显示页面。

#### 多部分对象集合

一份报文主体内可含有多种类型的实体同时发送，每个部分之间用 boundary 字段定义的分隔符进行分隔，每个部分都可以有首部字段。

例如，上传多个表单时可以使用如下方式：

```html
Content-Type: multipart/form-data; boundary=AaB03x --AaB03x Content-Disposition: form-data; name="submit-name" Larry
--AaB03x Content-Disposition: form-data; name="files"; filename="file1.txt" Content-Type: text/plain ... contents of
file1.txt ... --AaB03x--
```

#### 范围请求

如果网络出现中断，服务器只发送了一部分数据，范围请求使得客户端能够只请求未发送的那部分数据，从而避免服务器端重新发送所有数据。

在请求报文首部中添加 Range 字段指定请求的范围，请求成功的话服务器发送 206 Partial Content 状态。

```html
GET /z4d4kWk.jpg HTTP/1.1 Host: i.imgur.com Range: bytes=0-1023
```

```html
HTTP/1.1 206 Partial Content Content-Range: bytes 0-1023/146515 Content-Length: 1024 ... (binary content)
```

#### 内容协商

通过内容协商返回最合适的内容，例如根据浏览器的默认语言选择返回中文界面还是英文界面。

涉及以下首部字段：Accept、Accept-Charset、Accept-Encoding、Accept-Language、Content-Language。

#### 虚拟主机

HTTP/1.1 使用虚拟主机技术，使得一台服务器拥有多个域名，并且在逻辑上可以看成多个服务器。

使用 Host 首部字段进行处理。

#### 通信数据转发

##### 1. 代理

代理服务器接受客户端的请求，并且转发给其它服务器。

使用代理的主要目的是：缓存、网络访问控制以及访问日志记录。

代理服务器分为正向代理和反向代理两种，用户察觉得到正向代理的存在，而反向代理一般位于内部网络中，用户察觉不到。

<div align="center"> <img src="../pics//a314bb79-5b18-4e63-a976-3448bffa6f1b.png" width=""/> </div><br>

<div align="center"> <img src="../pics//2d09a847-b854-439c-9198-b29c65810944.png" width=""/> </div><br>

##### 2. 网关

与代理服务器不同的是，网关服务器会将 HTTP 转化为其它协议进行通信，从而请求其它非 HTTP 服务器的服务。

##### 3. 隧道

使用 SSL 等加密手段，为客户端和服务器之间建立一条安全的通信线路。隧道本身不去解析 HTTP 请求。
