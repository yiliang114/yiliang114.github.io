---
title: HTTP 请求头结构
date: 2020-12-21
draft: true
---

## HTTP 请求头结构

### HTTP request 报文结构是怎样的

1. 首行是**Request-Line**包括：**请求方法**，**请求 URI**，**协议版本**，**CRLF**
2. 首行之后是若干行**请求头**，包括**general-header**，**request-header**或者**entity-header**，每个一行以 CRLF 结束
3. 请求头和消息实体之间有一个**CRLF 分隔**
4. 根据实际请求需要可能包含一个**消息实体**
   一个请求报文例子如下：

```
GET /Protocols/rfc2616/rfc2616-sec5.html HTTP/1.1
Host: www.w3.org
Connection: keep-alive
`Cache-Control`: max-age=0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36
Referer: https://www.google.com.hk/
Accept-Encoding: gzip,deflate,sdch
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6
Cookie: authorstyle=yes
`If-None-Match`: "2cc8-3e3073913b100"
`If-Modified-Since`: Wed, 01 Sep 2004 13:24:52 GMT

name=qiu&age=25
```

请求报文有 4 部分组成:

- 请求行 请求行包括：请求方法字段、URL 字段、HTTP 协议版本字段。它们用空格分隔。例如，GET /index.html HTTP/1.1。
  - 请求类型
  - 要访问的资源
  - HTTP 协议版本号
- 请求头 请求头部:请求头部由关键字/值对组成，每行一对，关键字和值用英文冒号“:”分隔
  - 用来说明服务器要使用的附加信息（一些键值对）
  - 例如：User-Agent、 Accept、Content-Type、Connection
- 空行
  - 分割请求头与请求体
- 请求体 请求体: post put 等请求携带的数据
  - 可以添加任意的其他数据

### HTTP response 报文结构是怎样的

1. 首行是状态行包括：**HTTP 版本，状态码，状态描述**，后面跟一个 CRLF (回车换行)
2. 首行之后是**若干行响应头**，包括：**通用头部，响应头部，实体头部**
3. 响应头部和响应实体之间用**一个 CRLF 空行**分隔
4. 最后是一个可能的**消息实体**
   响应报文例子如下：

```
HTTP/1.1 200 OK
Date: Tue, 08 Jul 2014 05:28:43 GMT
Server: Apache/2
Last-Modified: Wed, 01 Sep 2004 13:24:52 GMT
ETag: "40d7-3e3073913b100"
Accept-Ranges: bytes
Content-Length: 16599
`Cache-Control`: max-age=21600
Expires: Tue, 08 Jul 2014 11:28:43 GMT
P3P: policyref="http://www.w3.org/2001/05/P3P/p3p.xml"
Content-Type: text/html; charset=iso-8859-1

{"name": "qiu", "age": 25}
```

请求报文有 4 部分组成:

- 状态行 由协议版本，状态码和状态码的原因短语组成，例如 HTTP/1.1 200 OK。
  - 状态码
  - 状态消息
  - HTTP 协议版本号
- 消息报头 响应部首组成
  - 说明客户端要使用的一些附加信息
  - 如：Content-Type、charset、响应的时间
- 空行
- 响应正文 服务器响应的数据
  - 返回给客户端的文本信息

### HTTP 首部

有 4 种类型的首部字段：通用首部字段、请求首部字段、响应首部字段和实体首部字段。

各种首部字段及其含义如下（不需要全记，仅供查阅）：

#### 1. 通用首部字段

|    首部字段名     |                    说明                    |
| :---------------: | :----------------------------------------: |
|   Cache-Control   |               控制缓存的行为               |
|    Connection     | 控制不再转发给代理的首部字段、管理持久连接 |
|       Date        |             创建报文的日期时间             |
|      Pragma       |                  报文指令                  |
|      Trailer      |             报文末端的首部一览             |
| Transfer-Encoding |         指定报文主体的传输编码方式         |
|      Upgrade      |               升级为其他协议               |
|        Via        |            代理服务器的相关信息            |
|      Warning      |                  错误通知                  |

#### 2. 请求首部字段

|     首部字段名      |                      说明                       |
| :-----------------: | :---------------------------------------------: |
|       Accept        |            用户代理可处理的媒体类型             |
|   Accept-Charset    |                  优先的字符集                   |
|   Accept-Encoding   |                 优先的内容编码                  |
|   Accept-Language   |             优先的语言（自然语言）              |
|    Authorization    |                  Web 认证信息                   |
|       Expect        |              期待服务器的特定行为               |
|        From         |               用户的电子邮箱地址                |
|        Host         |               请求资源所在服务器                |
|      If-Match       |              比较实体标记（ETag）               |
|  If-Modified-Since  |               比较资源的更新时间                |
|    If-None-Match    |        比较实体标记（与 If-Match 相反）         |
|      If-Range       |      资源未更新时发送实体 Byte 的范围请求       |
| If-Unmodified-Since | 比较资源的更新时间（与 If-Modified-Since 相反） |
|    Max-Forwards     |                 最大传输逐跳数                  |
| Proxy-Authorization |         代理服务器要求客户端的认证信息          |
|        Range        |               实体的字节范围请求                |
|       Referer       |            对请求中 URI 的原始获取方            |
|         TE          |                传输编码的优先级                 |
|     User-Agent      |              HTTP 客户端程序的信息              |

#### 3. 响应首部字段

|     首部字段名     |             说明             |
| :----------------: | :--------------------------: |
|   Accept-Ranges    |     是否接受字节范围请求     |
|        Age         |     推算资源创建经过时间     |
|        ETag        |        资源的匹配信息        |
|      Location      |   令客户端重定向至指定 URI   |
| Proxy-Authenticate | 代理服务器对客户端的认证信息 |
|    Retry-After     |   对再次发起请求的时机要求   |
|       Server       |    HTTP 服务器的安装信息     |
|        Vary        |   代理服务器缓存的管理信息   |
|  WWW-Authenticate  |   服务器对客户端的认证信息   |

#### 4. 实体首部字段

|    首部字段名    |          说明          |
| :--------------: | :--------------------: |
|      Allow       | 资源可支持的 HTTP 方法 |
| Content-Encoding | 实体主体适用的编码方式 |
| Content-Language |   实体主体的自然语言   |
|  Content-Length  |     实体主体的大小     |
| Content-Location |   替代对应资源的 URI   |
|   Content-MD5    |   实体主体的报文摘要   |
|  Content-Range   |   实体主体的位置范围   |
|   Content-Type   |   实体主体的媒体类型   |
|     Expires      | 实体主体过期的日期时间 |
|  Last-Modified   | 资源的最后修改日期时间 |

### http 头部信息

每一个 http 请求和响应都会带有响应的头部信息，XHR 对象提供了操作请求头部和响应头部信息的方法。

默认情况下，发送 ajax 请求时，还会发送下列头部信息：

- Accept: 浏览器能够显示的字符集
- Accept-Charset: 浏览器能够显示的字符集
- Accpet-Encoding: 浏览器能够处理的压缩编码
- Accept-Language: 浏览器当前设置的语言
- Connection: 浏览器与服务器之间的连接类型（keep-alive）
- Cookie: 当前页面设置的任何 cookie
- Host: 发出请求的页面所在域
- Referer: 发出请求的页面的 URL
- User-Agent: 浏览器的用户代理字段（跟 window.navigator.userAgent 值是一样的）
- :method: http 请求方法类型 GET/POST...

不同的浏览器实际发送的头部内容会有所不同，但是上面列出的信息基本上所有的浏览器都是会发送的。

原生操作 http 请求头部的方法：

- .setRequestHeader("name","value")
- .getResponseHeader('name')
- .getAllResponseHeaders()

特殊的一些头部字段：

- x-requested-with: 用来判断一个请求时传统的 http 请求还是 ajax 请求。XMLHttpRequest 表示 ajax 请求，例如 axios 中将全局的请求都声明为 ajax 请求。

事实上在服务端判断 request 来自 ajax 请求（异步）还是传统请求（同步）是通过判断请求中是否带有`x-requested-with` 属性，并且其值是否是`XMLHttpRequest`。 如果 request.getHeader("X-Requested-With") 的值为 XMLHttpRequest，则为 Ajax 异步请求。为 null，则为传统同步请求。
