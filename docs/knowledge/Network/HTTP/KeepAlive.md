---
layout: CustomPages
title: HTTP
date: 2020-11-21
aside: false
draft: true
---

keepalive_timeout 参数是一个请求完成之后还要保持连接多久，不是请求时间多久，目的是保持长连接，减少创建连接过程给系统带来的性能损耗，类似于线程池，数据库连接池。

```nignx
keepalive_timeout  65;
```

tcp keep alive 与 http keep alive 不同。

<https://blog.csdn.net/chrisnotfound/article/details/80111559>

### http keep alive nginx

nginx 在反向代理 HTTP 协议的时候，默认使用的是 HTTP1.0 去向后端服务器获取响应的内容后在返回给客户端。
HTTP1.0 和 HTTP1.1 的一个不同之处就是，HTTP1.0 不支持 HTTP keep-alive。nginx 在后端服务器请求时使用了 HTTP1.0 同时使用 HTTP Header 的 Connection：Close 通知后端服务器主动关闭连接。这样会导致任何一个客户端的请求都在后端服务器上产生了一个 TIME-WAIT 状态的连接。所以我们需要在 Nginx 上启用 HTTP1.1 的向后端发送请求，同时支持 Keep-alive。

nginx 需要设置的几个字段：

```
http{
''' 省去其他的配置
    upstream www{
        keepalive 50; # 必须配置，建议50-100之间
        '''
    }
    server {
    '''省去其他的配置
        location / {
        proxy_http_version 1.1; # 后端配置支持HTTP1.1，必须配
        proxy_set_header Connection "";   # 后端配置支持HTTP1.1 ,必须配置。
        }
    '''

    }
'''
}
```

说是这么说，但实际上在使用过程中不需要指定 proxy_http_version 和 proxy_set_header 只需要设置 keepalive 的时间就可以了，一般会设置 50 - 100 单位是秒。

#### nginx 中开启 keepalive 后应答反而为 close 的原因

<https://blog.csdn.net/zhiyuan_2007/article/details/78215789>

**在 http1.1 及之后版本。如果是 keep alive，则 content-length 和 chunk 必然是二选一。**

### http 连接性能优化，长连接，keep-alive 作用

<https://blog.csdn.net/u014749862/article/details/51374197>

在早期的 HTTP/1.0 中，每次 http 请求都要创建一个连接，而创建连接的过程需要消耗资源和时间，为了减少资源消耗，缩短响应时间，就需要重用连接。在后来的 HTTP/1.0 中以及 HTTP/1.1 中，引入了重用连接的机制，就是在 http 请求头中加入 Connection: keep-alive 来告诉对方这个请求响应完成后不要关闭，下一次咱们还用这个请求继续交流。协议规定 HTTP/1.0 如果想要保持长连接，需要在请求头中加上 Connection: keep-alive。

keep-alive 的优点：

- 较少的 CPU 和内存的使用（由于同时打开的连接的减少了）
- 允许请求和应答的 HTTP 管线化
- 降低拥塞控制 （TCP 连接减少了）
- 减少了后续请求的延迟（无需再进行握手）
- 报告错误无需关闭 TCP 连

### http 长连接？

### 其他

nginx 如何处理能够保持连接不断开 ？ http1.1 的长连接特性

- http 接口如何进行长连接？ （http 是无状态 之类的）如何 keep alive
- Accept-Encoding https://blog.csdn.net/thewindkee/article/details/71190403 https://www.cnblogs.com/ct2011/p/5835990.html
