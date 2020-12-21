---
layout: CustomPages
title: HTTP 请求头结构
date: 2020-12-21
aside: false
---

# HTTP 请求头结构

## HTTP 首部

有 4 种类型的首部字段：通用首部字段、请求首部字段、响应首部字段和实体首部字段。

通用首部表示一些通用信息，如 Date 表示报文创建时间，请求首部就是请求报文中独有的，如 cookie、和缓存相关的 If-Modified-Since，响应首部就是响应报文中独有的，如 set-cookie 和重定向有关的 location，实体首部用来描述实体部分，如 Allow 用来描述可执行的请求方法，Content-Type 描述主体类型，Content-Encoding 描述主体的编码方式。

各种首部字段及其含义如下（不需要全记，仅供查阅）：

### 通用首部字段

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

### 请求首部字段

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

### 响应首部字段

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

### 实体首部字段

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

## 结构

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
Cache-Control: max-age=0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36
Referer: https://www.google.com.hk/
Accept-Encoding: gzip,deflate,sdch
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6
Cookie: authorstyle=yes
If-None-Match: "2cc8-3e3073913b100"
If-Modified-Since: Wed, 01 Sep 2004 13:24:52 GMT

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
Cache-Control: max-age=21600
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

## 其他

### 请描述以下 request 和 response headers：

- Diff. between Expires, Date, Age and If-Modified-...
- Do Not Track
- Cache-Control
- Transfer-Encoding
- ETag
- X-Frame-Options

### refer 不属于浏览器 response headers 的字段

### Accept 和 Content-Type

Accept 请求头用来告知客户端可以处理的内容类型，这种内容类型用 MIME 类型来表示。服务器使用 Content-Type 应答头通知客户端它的选择。

Accept: text/html
Accept: image/_
Accept: text/html, application/xhtml+xml, application/xml;q=0.9, _/\*;q=0.8
1.Accept 属于请求头， Content-Type 属于实体头。
Http 报头分为通用报头，请求报头，响应报头和实体报头。
请求方的 http 报头结构：通用报头|请求报头|实体报头
响应方的 http 报头结构：通用报头|响应报头|实体报头

2.Accept 代表发送端（客户端）希望接受的数据类型。
比如：Accept：text/xml;
代表客户端希望接受的数据类型是 xml 类型

Content-Type 代表发送端（客户端|服务器）发送的实体数据的数据类型。
比如：Content-Type：text/html;
代表发送端发送的数据格式是 html。

二者合起来，
Accept:text/xml；
Content-Type:text/html
即代表希望接受的数据类型是 xml 格式，本次请求发送的数据的数据格式是 html。

### 和缓存有关的请求头有哪些？优先级是怎样的？

和缓存有关的请求头有 Cache-Control、If-Match、If-None-Match、If-Modified-Since、If-Unmodified-Since，在缓存中
总体来说是 Cache-Control 优先于 Expires，Cache-Control 中会需要检测 Cache-Control 是否过期，过期的话检验会优先检测 Etag，
也就是 If-Match、If-None-Match,不一致则验证 Last-Modify 请求头也就是 If-Modified-Since、If-Unmodified-Since。
