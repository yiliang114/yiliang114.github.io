---
layout: CustomPages
title: Network
date: 2020-11-21
aside: false
draft: true
---

# gRPC 相关

## HTTP2

- HTTP2 比 1，改进在哪？为什么会更快？

  - https://www.zhihu.com/question/34074946
  - 多路复用，允许通过单一的 HTTP/2 连接发起多重的请求-响应消息。而 HTTP/1.1 协议中，
    浏览器客户端在同一时间内，针对同一域名下的请求数量有一定的数量限制。超过限制数目
    的请求会被阻塞。(解决办法：CDN 使用多个域名)
  - 二进制分帧，HTTP/2 会将所有传输的信息分割成更小的消息和帧，并对他们采用二进制
    格式的编码，其中 HTTP/1.1 中的首部信息会被封装到 HEADER frame，而 body 则会封装进
    DATA frame。头部进行压缩，使用[HPACK](https://www.jianshu.com/p/f44b930cfcac)算法。
  - server push。

---

- https://http2.github.io/http2-spec/

## protobuf

- https://developers.google.com/protocol-buffers/docs/encoding

  - little endian
  - base 128 varints: 每个 byte 的第一位，代表接下来是否仍然有数据。
    低的 7 位表示数据，base-128 是因为 2 的 7 次方是 128。例如 1，则表示为
    `0000 0001`，300，则表示为 `1010 1100 0000 0010`，怎么还原成 300 呢？
    首先把高位忽略，变成 `010 1100 000 0010`，然后翻转（因为是 little endian），
    所以是 `000 0010 010 1100`，即 `100101100`，算一下即 `256 + 32 + 8 + 4 = 300`
  - 表示类型的 byte，低三位表示类型，高三位是 field number，即 proto message 里的 tag。

- gRPC vs RESTful

  - 需要传输的数据量更小(数据压缩，例如 int32 最少只需要一个 byte)
  - HTTP 头部有很多重复的信息
  - 调用更方便
