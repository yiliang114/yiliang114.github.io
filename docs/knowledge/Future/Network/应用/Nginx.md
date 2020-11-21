---
layout: CustomPages
title: 应用
date: 2020-11-21
aside: false
draft: true
---

### centos 安装 nginx

```
yum install nginx
nginx -v
```

### Linux -bash: rz(或者是 sz): command not found

```
yum -y install lrzsz
```

### nginx 基本代理

```
server {
  listen        80;
  # 访问的域名
  server_name   test.com;
  # 代理请求
  location / {
    proxy_pass http://127.0.0.1:8888;
    # 设置HTTP头中修改host为test.com
    proxy_set_header Host $host;
  }
}
```

### nginx 配置缓存

```shell
# 写在server外
proxy_cache_path  cache levels=1:2 keys_zoom=my_cache:10m
```

- cache
  - 文件夹名
- levels=1:2
  - 设置二级文件夹来存缓存，因为随着文件的越来越多查找速度会越来越慢
- keys_zoom=my_cache:10m
  - 申请 10 兆内存来缓存内容

```shell
server {
  listen        80;
  server_name   test.com;
  location / {
    proxy_cache   my_cache; #在这里写缓存
    proxy_pass http://127.0.0.1:8888;
    proxy_set_header Host $host;
  }
}
```

```shell
server {
    listen       80;
    server_name  _;

    location ^~/document {
      alias /usr/local/tbp-fe/wiki;
      try_files $uri $uri/ /404.html =404;
      add_header Cache-Control max-age=300;
    }

    location / {
            root /data/home/yiliang114/tbp-test/;
            index  index.html;
    }
}
```

### 前端项目线上如何做跨域

前端页面被跨域限制了，说明不同源。 这个时候可以找一台跟后台接口同源的服务器用 nginx 来做接口转发。

以一个 vue 项目为例，在开发过程中，开发者可以主动去配合 dev 的 proxyTable， 本质上是本地起了一个 node 服务（express）来做转发到 `localhost`， 因为跨域是会存在于浏览器。 而发布到线上去之后，很可能由于 dev 环境下对每一个接口请求都携带了 `/api` 前缀，这对我们很友好。

nginx 配置：

```
...
location /api {
	# 配置一
	proxy_pass http://abc.hahah.com/;
	# 配置二
	proxy_pass http://abc.hahah.com;
	# 配置三
	proxy_pass http://100.200.30.20;
}
...

```

其中配置二和配置三，本质上是一样的（使用 ip 和域名）ip 后面有没有 `/` 是由区别的，有 `/` 表示转发请求之后，`/api` 后面的内容才会被转发，相当于 url 是被截断的，正好我们需要这种形式，因为 `/api` 是我们添加的虚拟的 url 部分。

### 反向代理和正向代理

#### 正向代理

Shadowsocks 是一个正向代理的应用

正向代理就是客户端向代理服务器发送请求，并且指定目标服务器，之后代理向目标服务器转交并且将获得的内容返回给客户端。比如翻墙.

也就是传说中的代理,他的工作原理就像一个跳板，简单的说，我是一个用户，我访问不了某网站，但是我能访问一个代理服务器，这个代理服务器呢，他能访问那个我不能访问的网站，于是我先连上代理服务器，告诉他我需要那个无法访问网站的内容，代理服务器去取回来，然后返回给我。

正向代理 是一个位于客户端和原始服务器(origin server)之间的服务器，为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标(原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端。客户端必须要进行一些特别的设置才能使用正向代理。

正向代理的含义举例说明就是，一个中国人小明想访问 google，但是我们都知道中国的网络正常情况下是访问不了 google 的，但是国外的网络可以，于此同时小明可以访问一般的国外网络。于是小明想了一个办法，每次他要访问 google 的时候，就告诉他在美国的基友要访问的网址，他基友获取到的内容再发送给小明。这样的做法，其实 google 是分辨不出来到底是小明在访问还是小明的基友自己主动在访问。

#### 反向代理

nginx 的负载均衡是一个反向代理的应用。

反向代理的话代理会判断请求走向何处，并将请求转交给客户端，客户端只会觉得这个代理是一个真正的服务器。如负载均衡。

例用户访问 http://www.test.com/readme，但www.test.com上并不存在readme页面，他是偷偷从另外一台服务器上取回来，然后作为自己的内容返回用户，但用户并不知情。这里所提到的 www.test.com 这个域名对应的服务器就设置了反向代理功能。

结论就是，反向代理正好相反，对于客户端而言它就像是原始服务器，并且客户端不需要进行任何特别的设置。客户端向反向代理的命名空间(name-space)中的内容发送普通请求，接着反向代理将判断向何处(原始服务器)转交请求，并将获得的内容返回给客户端，就像这些内容原本就是它自己的一样。

反向代理的含义举例说明就是，nginx 的转发（或者说是负载均衡）。简单说，计算机一个端口通常只能被一个程序占用，但是如果需要在请求每一个服务的时候都在 url 中加上端口号那一定是很崩溃的。nginx 做的工作就是让所有的请求都到一个端口上来（比如 80 或者 443）

#### 两者区别

从用途上来讲：

正向代理的典型用途是为在防火墙内的局域网客户端提供访问 Internet 的途径。正向代理还可以使用缓冲特性减少网络使用率。反向代理的典型用途是将防火墙后面的服务器提供给 Internet 用户访问。反向代理还可以为后端的多台服务器提供负载平衡，或为后端较慢的服务器提供缓冲服务。另外，反向代理还可以启用高级 URL 策略和管理技术，从而使处于不同 web 服务器系统的 web 页面同时存在于同一个 URL 空间下。

从安全性来讲：

正向代理允许客户端通过它访问任意网站并且隐藏客户端自身，因此你必须采取安全措施以确保仅为经过授权的客户端提供服务。反向代理对外都是透明的，访问者并不知道自己访问的是一个代理。

### 负载均衡

upstream 模块实现。

4 种调度算法实现

- 轮询 每个请求按时间顺序逐一分配到不同的后端服务器
- ip_hash 每个请求按访问 IP 的 hash 结果分配，这样来自同一个 IP 的访客固定访问一个后端服务器，有效解决了动态网页存在的 session 共享问题。
- fair 这是比上面两个更加智能的负载均衡算法。此种算法可以依据页面大小和加载时间长短智能地进行负载均衡，也就是根据后端服务器的响应时间来分配请求，响应时间短的优先分配。
- url_hash 此方法按访问 url 的 hash 结果来分配请求，使每个 url 定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率。

### 页面缓存（静态内容缓存）

proxy_cache 和 proxy_cache_path 等相关配置
