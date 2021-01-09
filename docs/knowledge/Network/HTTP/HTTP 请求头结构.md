---
title: HTTP 请求头结构
date: 2020-12-21
---## HTTP 请求头结构

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
