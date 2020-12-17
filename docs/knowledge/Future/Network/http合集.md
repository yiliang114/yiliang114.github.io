---
layout: CustomPages
title: Network
date: 2020-11-21
aside: false
draft: true
---

## HTTP 网络

- post 与 get
- http 的缓存，以及怎么设置
  - 一般会在 nginx 中设置缓存头
  - 强缓存
  - 协商缓存
- https 是什么，有点缺点
  - http + TLS ？ 原理 重点，说明证书
- url 输入到显示的过程
- dns 的作用，可靠连接有哪些
- 浏览器页面渲染的流程是什么
- http2, http3
- keep-alive ?

### 常见状态码

#### 1XX 信息

- 100 Continue. 表明到目前为止都很正常，客户端可以继续发送请求或者忽略这个响应。

#### 2XX 成功

- 200 OK，表示从客户端发来的请求在服务器端被正确处理
- 204 No content，表示请求成功，但响应报文不含实体的主体部分
- 205 Reset Content，表示请求成功，但响应报文不含实体的主体部分，但是与 204 响应不同在于要求请求方重置内容
- 206 Partial Content，进行范围请求

#### 3XX 重定向

- 301 moved permanently，永久性重定向，表示资源已被分配了新的 URL
- 302 found，临时性重定向，表示资源临时被分配了新的 URL
  - 请求 html 文件返回 302 表示登录态已经失效了，需要重定向登录才可以。并在返回的请求头里面加上一个 location 值，值的内容是一个登录的页面加上 request url, 这样页面收到返回之后，就会重定向到登录页面。登录完成之后，通过返回头的 setCookie 注入登录态，以及又是一个 302 重定向到 url 里存入的网址，这样就完成了一个登录的过程。
  - nodejs 的 res.redirect 不过不设置状态码，那就是 302 跳转，可以设置为 301 跳转
- 303 see other，表示资源存在着另一个 URL，应使用 GET 方法获取资源
- 304 not modified，表示服务器允许访问资源，但因发生请求未满足条件的情况
- 307 temporary redirect，临时重定向，和 302 含义类似，但是期望客户端保持请求方法不变向新的地址发出请求

#### 4XX 客户端错误

- 400 bad request，请求报文存在语法错误
- 401 unauthorized，表示发送的请求需要有通过 HTTP 认证的认证信息
- 403 forbidden，表示对请求资源的访问被服务器拒绝
- 404 not found，表示在服务器上没有找到请求的资源

#### 5XX 服务器错误

- 500 internal sever error，表示服务器端在执行请求时发生了错误
- 501 Not Implemented，表示服务器不支持当前请求所需要的某个功能
- 503 service unavailable，表明服务器暂时处于超负载或正在停机维护，无法处理请求

### 跨域

- 跨域请求头具体的值
  - 跨域的时候 不能设置 `*` 通配符，而是要写具体的域名
  - 有自定义的 header 部分需要做一定的配置

https://juejin.im/post/5d032b77e51d45777a126183#heading-6

#### CORS 全称"跨域资源共享"（Cross-origin resource sharing）

主要的字段

- Access-Control-Allow-Origin
- Access-Control-Allow-Credentials
- Access-Control-Allow-Methods
- Access-Control-Allow-Headers 实际请求将携带的自定义请求首部字段
- Access-Control-Max-Age 用来指定本次预检请求的有效期，单位为秒。

##### 简单请求

请求方式使用下列方法之一：

- GET
- HEAD
- POST

Content-Type 的值仅限于下列三者之一：

- text/plain
- multipart/form-data
- application/x-www-form-urlencoded

对于简单请求，浏览器会直接发送 CORS 请求，具体说来就是在 header 中加入 origin 请求头字段。同样，在响应头中，返回服务器设置的相关 CORS 头部字段，Access-Control-Allow-Origin 字段为允许跨域请求的源。

#### options nginx 配置

预检请求发生的条件：

使用了下面任一 HTTP 方法：

- PUT
- DELETE
- CONNECT
- OPTIONS
- TRACE
- PATCH

Content-Type 的值不属于下列之一:

- application/x-www-form-urlencoded
- multipart/form-data
- text/plain

```
# 配置如果是OPTIONS方法直接返回204状态
if ($request_method = 'OPTIONS') {
     add_header 'Access-Control-Allow-Origin' '*' always;
     add_header 'Access-Control-Allow-Credentials' 'true';
     add_header 'Access-Control-Allow-Methods' 'GET, POST, PATCH, DELETE, PUT, OPTIONS';
     add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,  Access-Control-Expose-Headers, Token, Authorization';
     add_header 'Access-Control-Max-Age' 1728000;
     add_header 'Content-Type' 'text/plain charset=UTF-8';
     add_header 'Content-Length' 0;
     return 204;
}
```

### axios

### 原生 ajax
