---
layout: CustomPages
title: Node Interview
date: 2020-11-21
aside: false
draft: true
---

## [Network](/sections/zh-cn/network.md)

- [`[Doc]` Net (网络)](/sections/zh-cn/network.md#net)
- [`[Doc]` UDP/Datagram](/sections/zh-cn/network.md#udp)
- [`[Doc]` HTTP](/sections/zh-cn/network.md#http)
- [`[Doc]` DNS (域名服务器)](/sections/zh-cn/network.md#dns)
- [`[Doc]` ZLIB (压缩)](/sections/zh-cn/network.md#zlib)
- [`[Point]` RPC](/sections/zh-cn/network.md#rpc)

**常见问题**

- cookie 与 session 的区别? 服务端如何清除 cookie? [[more]](/sections/zh-cn/network.md#q-cookie-session)
- HTTP 协议中的 POST 和 PUT 有什么区别? [[more]](/sections/zh-cn/network.md#q-post-put)

- TCP/UDP 的区别? TCP 粘包是怎么回事，如何处理? UDP 有粘包吗? [[more]](/sections/zh-cn/network.md#q-tcp-udp)
- `TIME_WAIT` 是什么情况? 出现过多的 `TIME_WAIT` 可能是什么原因? [[more]](/sections/zh-cn/network.md#q-time-wait)
- ECONNRESET 是什么错误? 如何复现这个错误?
- socket hang up 是什么意思? 可能在什么情况下出现? [[more]](/sections/zh-cn/network.md#socket-hang-up)
- hosts 文件是什么? 什么叫 DNS 本地解析?
- 列举几个提高网络传输速度的办法?

[阅读更多](/sections/zh-cn/network.md)

## [OS](/sections/zh-cn/os.md)

- [`[Doc]` TTY](/sections/zh-cn/os.md#tty)
- [`[Doc]` OS (操作系统)](/sections/zh-cn/os.md#os-1)
- [`[Doc]` Path](/sections/zh-cn/os.md#path)
- [`[Doc]` 命令行参数](/sections/zh-cn/os.md#命令行参数)
- [`[Basic]` 负载](/sections/zh-cn/os.md#负载)
- [`[Point]` CheckList](/sections/zh-cn/os.md#checklist)

**常见问题**

- 什么是 TTY? 如何判断是否处于 TTY 环境? [[more]](/sections/zh-cn/os.md#tty)
- 不同操作系统的换行符 (EOL) 有什么区别? [[more]](/sections/zh-cn/os.md#os)
- 服务器负载是什么概念? 如何查看负载? [[more]](/sections/zh-cn/os.md#负载)
- ulimit 是用来干什么的? [[more]](/sections/zh-cn/os.md#ulimit)

[阅读更多](/sections/zh-cn/os.md)

## [错误处理/调试](/sections/zh-cn/error.md)

- [`[Doc]` Errors (异常)](/sections/zh-cn/error.md#errors)
- [`[Doc]` Domain (域)](/sections/zh-cn/error.md#domain)
- [`[Doc]` Debugger (调试器)](/sections/zh-cn/error.md#debugger)
- [`[Doc]` C/C++ 插件](/sections/zh-cn/error.md#c-c++-addon)
- [`[Doc]` V8](/sections/zh-cn/error.md#v8)
- [`[Point]` 内存快照](/sections/zh-cn/error.md#内存快照)
- [`[Point]` CPU profiling](/sections/zh-cn/error.md#cpu-profiling)

**常见问题**

- 怎么处理未预料的出错? 用 try/catch ，domains 还是其它什么? [[more]](/sections/zh-cn/error.md#q-handle-error)
- 什么是 `uncaughtException` 事件? 一般在什么情况下使用该事件? [[more]](/sections/zh-cn/error.md#uncaughtexception)
- domain 的原理是? 为什么要弃用 domain? [[more]](/sections/zh-cn/error.md#domain)
- 什么是防御性编程? 与其相对的 let it crash 又是什么?
- 为什么要在 cb 的第一参数传 error? 为什么有的 cb 第一个参数不是 error, 例如 http.createServer?
- 为什么有些异常没法根据报错信息定位到代码调用? 如何准确的定位一个异常? [[more]](/sections/zh-cn/error.md#错误栈丢失)
- 内存泄漏通常由哪些原因导致? 如何分析以及定位内存泄漏? [[more]](/sections/zh-cn/error.md#内存快照)

[阅读更多](/sections/zh-cn/error.md)

## [测试](/sections/zh-cn/test.md)

- [`[Basic]` 测试方法](/sections/zh-cn/test.md#测试方法)
- [`[Basic]` 单元测试](/sections/zh-cn/test.md#单元测试)
- [`[Basic]` 集成测试](/sections/zh-cn/test.md#集成测试)
- [`[Basic]` 基准测试](/sections/zh-cn/test.md#基准测试)
- [`[Basic]` 压力测试](/sections/zh-cn/test.md#压力测试)
- [`[Doc]` Assert (断言)](/sections/zh-cn/test.md#assert)

**常见问题**

- 为什么要写测试? 写测试是否会拖累开发进度?[[more]](/sections/zh-cn/test.md#q-why-write-test)
- 单元测试的单元是指什么? 什么是覆盖率?[[more]](/sections/zh-cn/test.md#单元测试)
- 测试是如何保证业务逻辑中不会出现死循环的?[[more]](/sections/zh-cn/test.md#q-death-loop)
- mock 是什么? 一般在什么情况下 mock?[[more]](/sections/zh-cn/test.md#mock)

[阅读更多](/sections/zh-cn/test.md)

## [util](/sections/zh-cn/util.md)

- [`[Doc]` URL](/sections/zh-cn/util.md#url)
- [`[Doc]` Query Strings (查询字符串)](/sections/zh-cn/util.md#query-strings)
- [`[Doc]` Utilities (实用函数)](/sections/zh-cn/util.md#util-1)
- [`[Basic]` 正则表达式](/sections/zh-cn/util.md#正则表达式)

**常见问题**

- HTTP 如何通过 GET 方法 (URL) 传递 let arr = [1,2,3,4] 给服务器? [[more]](/sections/zh-cn/util.md#get-param)
- Node.js 中继承 (util.inherits) 的实现? [[more]](/sections/zh-cn/util.md#utilinherits)
- 如何递归获取某个文件夹下所有的文件名? [[more]](/sections/zh-cn/util.md#q-traversal)

[阅读更多](/sections/zh-cn/util.md)

## [存储](/sections/zh-cn/storage.md)

- [`[Point]` Mysql](/sections/zh-cn/storage.md#mysql)
- [`[Point]` Mongodb](/sections/zh-cn/storage.md#mongodb)
- [`[Point]` Replication](/sections/zh-cn/storage.md#replication)
- [`[Point]` 数据一致性](/sections/zh-cn/storage.md#数据一致性)
- [`[Point]` 缓存](/sections/zh-cn/storage.md#缓存)

**常见问题**

- 备份数据库与 M/S, M/M 等部署方式的区别? [[more]](/sections/zh-cn/storage.md#replication)
- 索引有什么用，大致原理是什么? 设计索引有什么注意点? [[more]](/sections/zh-cn/storage.md#索引)
- Monogdb 连接问题(超时/断开等)有可能是什么问题导致的? [[more]](/sections/zh-cn/storage.md#Mongodb)
- 什么情况下数据会出现脏数据? 如何避免? [[more]](/sections/zh-cn/storage.md#数据一致性)
- redis 与 memcached 的区别? [[more]](/sections/zh-cn/storage.md#缓存)

[阅读更多](/sections/zh-cn/storage.md)

## [安全](/sections/zh-cn/security.md)

- [`[Doc]` Crypto (加密)](/sections/zh-cn/security.md#crypto)
- [`[Doc]` TLS/SSL](/sections/zh-cn/security.md#tlsssl)
- [`[Doc]` HTTPS](/sections/zh-cn/security.md#https)
- [`[Point]` XSS](/sections/zh-cn/security.md#xss)
- [`[Point]` CSRF](/sections/zh-cn/security.md#csrf)
- [`[Point]` 中间人攻击](/sections/zh-cn/security.md#中间人攻击)
- [`[Point]` Sql/Nosql 注入](/sections/zh-cn/security.md#sqlnosql-注入)

**常见问题**

- 加密是如何保证用户密码的安全性? [[more]](/sections/zh-cn/security.md#crypto)
- TLS 与 SSL 有什么区别? [[more]](/sections/zh-cn/security.md#tlsssl)
- HTTPS 能否被劫持? [[more]](/sections/zh-cn/security.md#https)
- XSS 攻击是什么? 有什么危害? [[more]](/sections/zh-cn/security.md#xss)
- 过滤 Html 标签能否防止 XSS? 请列举不能的情况? [[more]](/sections/zh-cn/security.md#xss)
- CSRF 是什么? 如何防范? [[more]](/sections/zh-cn/security.md#csrf)
- 如何避免中间人攻击? [[more]](/sections/zh-cn/security.md#中间人攻击)

[阅读更多](/sections/zh-cn/security.md)
