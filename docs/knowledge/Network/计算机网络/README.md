---
layout: CustomPages
title: Network
date: 2020-11-21
aside: false
draft: true
---

### 什么是一级域名，什么是二级域名，什么是三级域名

通俗的解释：baidu.com 是一级域名，zhidao.baidu.com 是二级域名。www.baidu.com 是域名 baidu.com 的一个二级域名，只不过是一个比较特殊的二级域名罢了。他的特殊就在于现在的实践中，人们在解析域名的的时候，在惯例和默认的情况下，是把 www.baidu.com 这个二级域名指向它的一级域名 baidu.com。因此，现在的大部分情况下，baidu.com 和 www.baidu.com，都是一样的，有和没有 www 一般没有关系。

#### 原理

为什么大都数网站打开二级域名 www.baidu.com 和打开一级域名 baidu.com 是一样的，其实是把两个域名都解析到了同一个 IP 或期中的一个做了 301 中转。这样做的目的是符合网民的使用习惯，有利于网站的权重集中。

### 网络分层七层模型

- 应用层：应用层、表示层、会话层（从上往下）（`HTTP、FTP、SMTP、DNS`）
- 传输层（`TCP`和`UDP`）
- 网络层（`IP`）
- 物理和数据链路层（以太网）

### 其他

- `TIME_WAIT` 是什么情况? 出现过多的 `TIME_WAIT` 可能是什么原因?
