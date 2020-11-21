---
layout: CustomPages
title: Network
date: 2020-11-21
aside: false
draft: true
---

## nginx

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

```
# 写在server外
proxy_cache_path  cache levels=1:2 keys_zoom=my_cache:10m
```

- cache
  - 文件夹名
- levels=1:2
  - 设置二级文件夹来存缓存，因为随着文件的越来越多查找速度会越来越慢
- keys_zoom=my_cache:10m
  - 申请 10 兆内存来缓存内容

```
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

```
server {
    listen       80;
    server_name  _;

    location ^~/document {
      alias /usr/local/tbp-fe/wiki;
      try_files $uri $uri/ /404.html =404;
      add_header Cache-Control max-age=300;
    }

    location / {
            root /data/home/mrjzhang/tbp-test/;
            index  index.html;
    }
}
```

### nginx 日志格式

```
log_format access '$remote_addr - $remote_user[$time_local] "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '" $http_user_agent" "$http_x_forwarded_for"'
                  '"$upstream_cache_status" "$upstream_addr"  "$request_time" $upstream_response_time $http_host';
```

### Nginx 相关问题

- 性能瓶颈可能出现在哪

  - CPU 太弱
  - worker 数量比 CPU 核心数大太多，导致频繁上下文切换
  - 连接数，包括最大连接数，和当前是否由太多连接占着茅坑不拉屎

  - 解决方案

    - [CPU affinity](http://nginx.org/en/docs/ngx_core_module.html#worker_cpu_affinity)
    - 提高连接数
    - 正确设置 worker 数

- 惊群问题及其解决方案

  - https://en.wikipedia.org/wiki/Process_management_(computing)
  - 解决方案：没有解决方案。accept 惊群已经被内核解决了。但是 epoll 惊群没有完全解决。

### nginx 配置

https://www.cnblogs.com/shihaiming/p/6183923.html

为什么 ars 那样配置是不行的。因为发布的目录不一样。公司的服务器上是，针对每一个项目，将 build 之后的文件全都放到项目名的文件夹下，但是，自己发布的时候，是项目名下的 dist 目录。

**nodejs 以及静态资源发布系统**

**nginx 配置文章**

nginx 重定向：

这个如何写
这种需求有多种方法可以实现：

1. 利用 Nginx rewrite 内部跳转实现：

```
location /image {
          rewrite ^/image/(.*)$     /make/image/$1 last;
}
```

2.利用 alias 映射

```
location  /image  {
       alias  /make/image;  #这里写绝对路径
}
```

3.利用 root 映射：

```
location  /image {
      root   /make;
}
```

4.利用 nginx 的 permanent 301 绝对跳转实现

```
location /image {
        rewrite ^/image/(.*)$   http://www.adc.com/make/image/$1;
}
```

vue 和 react

vue 需要更改 build 的 assetsPublicPath

```
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
        worker_connections 768;
        # multi_accept on;
}

http {

        ##
        # Basic Settings
        ##

        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        # server_tokens off;

        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ##
        # SSL Settings
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
        ssl_prefer_server_ciphers on;

        ##
        # Logging Settings
        ##

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Gzip Settings
        ##

        gzip on;
        gzip_disable "msie6";

        # gzip_vary on;
        # gzip_proxied any;
        # gzip_comp_level 6;
        # gzip_buffers 16 8k;
        # gzip_http_version 1.1;

        ##
        # Virtual Host Configs
        ##

        server {
            listen       80;
            server_name  demo.com;

            # 截断uri，后面部分被转发
            location /node/ {
                proxy_pass http://127.0.0.1:3000/;
            }
            location /node2/ {
                proxy_pass http://127.0.0.1:3001/;
            }

            location /home/ {
                root /usr/local/workspace/front-end/home;
                try_files $uri $uri/ /index.html =404;
            }

            location /vue-test/ {
                # alias会把location后面配置的路径丢弃掉，把当前匹配到的目录指向到指定的目录。alias后面必须要用“/”结束
                alias /usr/local/workspace/front-end/vue-test/dist/;
            }

            location @notfound {
                rewrite 301 http://www.sunnynetwork.cn;
            }
        }

        #include /etc/nginx/conf.d/*.conf;
        #include /etc/nginx/sites-enabled/*;
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

详情可以参考 https://www.cnblogs.com/lemon-le/p/7800879.html 或者 《nginx 高性能 Web 服务器详解》

### 存在的问题

1. 路径中需要将最后的 `/` 输入完整才能够访问成功。

### 自动化部署

- jenkins
- 上不上 docker

### 什么是正向代理？什么是反向代理？

正向代理就是客户端向代理服务器发送请求，并且指定目标服务器，之后代理向目标服务器转交并且将获得的内容返回给客户端。比如翻墙
反向代理的话代理会判断请求走向何处，并将请求转交给客户端，客户端只会觉得这个代理是一个真正的服务器。如负载均衡。

[正向代理和反向代理的区别](https://zhuanlan.zhihu.com/p/25423394)

### 停止 nginx 方法

1.

```js
nginx -s stop
```

2.

```js
ps -ef | grep nginx

kill -QUIT 主进程号 ：从容停止 Nginx
kill -TERM 主进程号 ：快速停止 Nginx
kill -9 nginx ：强制停止 Nginx
```

###s 端口转发

实际上端口转发就就是有多个服务分别在不同的端口上（一个端口只能被一个服务占用），统一对外端口只有一个（通常会是 80 端口或者 443 端口）

举个例子：[豆瓣电影](https://movie.douban.com/),[豆瓣读书](https://book.douban.com/)

## nginx 使用

### 1. 反向代理和正向代理

#### 正向代理

也就是传说中的代理,他的工作原理就像一个跳板，简单的说，我是一个用户，我访问不了某网站，但是我能访问一个代理服务器，这个代理服务器呢，他能访问那个我不能访问的网站，于是我先连上代理服务器，告诉他我需要那个无法访问网站的内容，代理服务器去取回来，然后返回给我。

正向代理 是一个位于客户端和原始服务器(origin server)之间的服务器，为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标(原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端。客户端必须要进行一些特别的设置才能使用正向代理。

#### 反向代理

例用户访问 http://www.test.com/readme，但www.test.com上并不存在readme页面，他是偷偷从另外一台服务器上取回来，然后作为自己的内容返回用户，但用户并不知情。这里所提到的 www.test.com 这个域名对应的服务器就设置了反向代理功能。

结论就是，反向代理正好相反，对于客户端而言它就像是原始服务器，并且客户端不需要进行任何特别的设置。客户端向反向代理的命名空间(name-space)中的内容发送普通请求，接着反向代理将判断向何处(原始服务器)转交请求，并将获得的内容返回给客户端，就像这些内容原本就是它自己的一样。

#### 两者区别

从用途上来讲：

正向代理的典型用途是为在防火墙内的局域网客户端提供访问 Internet 的途径。正向代理还可以使用缓冲特性减少网络使用率。反向代理的典型用途是将防火墙后面的服务器提供给 Internet 用户访问。反向代理还可以为后端的多台服务器提供负载平衡，或为后端较慢的服务器提供缓冲服务。另外，反向代理还可以启用高级 URL 策略和管理技术，从而使处于不同 web 服务器系统的 web 页面同时存在于同一个 URL 空间下。

从安全性来讲：

正向代理允许客户端通过它访问任意网站并且隐藏客户端自身，因此你必须采取安全措施以确保仅为经过授权的客户端提供服务。反向代理对外都是透明的，访问者并不知道自己访问的是一个代理。

### 2. 负载均衡

upstream 模块实现。

4 种调度算法实现

- 轮询 每个请求按时间顺序逐一分配到不同的后端服务器
- ip_hash 每个请求按访问 IP 的 hash 结果分配，这样来自同一个 IP 的访客固定访问一个后端服务器，有效解决了动态网页存在的 session 共享问题。
- fair 这是比上面两个更加智能的负载均衡算法。此种算法可以依据页面大小和加载时间长短智能地进行负载均衡，也就是根据后端服务器的响应时间来分配请求，响应时间短的优先分配。
- url_hash 此方法按访问 url 的 hash 结果来分配请求，使每个 url 定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率。

### 3. 页面缓存（静态内容缓存）

proxy_cache 和 proxy_cache_path 等相关配置

### 4. URL 重写

完成临时重定向或者永久向

### 5. 读写分离

web1 写操作（文件上传） web2 只读

### 6.跨域访问

跨域是指浏览器不能执行其他网站的脚本。

同源：域名、协议和端口必须相同。浏览器执行 javascript 时会检查这个脚本属于哪个页面，如果不是同源页面会拒绝执行。

请求转发和 url 重写欺骗浏览器和真实服务器实现跨域访问。

## nginx 配置

说明一下什么是正向代理和反向代理。举个实际使用中的例子，Shadowsocks 是一个正向代理的应用，而 nginx 的负载均衡是一个反向代理的应用。

正向代理的含义举例说明就是，一个中国人小明想访问 google，但是我们都知道中国的网络正常情况下是访问不了 google 的，但是国外的网络可以，于此同时小明可以访问一般的国外网络。于是小明想了一个办法，每次他要访问 google 的时候，就告诉他在美国的基友要访问的网址，他基友获取到的内容再发送给小明。这样的做法，其实 google 是分辨不出来到底是小明在访问还是小明的基友自己主动在访问。

反向代理的含义举例说明就是，nginx 的转发（或者说是负载均衡）。简单说，计算机一个端口通常只能被一个程序占用，但是如果需要在请求每一个服务的时候都在 url 中加上端口号那一定是很崩溃的。nginx 做的工作就是让所有的请求都到一个端口上来（比如 80 或者 443）

### 正向代理

#### 默认配置

```shell
server {
    server_name localhost;
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
    try_files $uri $uri/ =404;
    }
}
```

#### mac nginx 默认地址

默认 html 地址

```shell
/usr/local/var/www/index.html
```

默认 conf 地址

```shell
/usr/local/etc/nginx/nginx.conf
```

### mac nginx 命令

测试 nginx 是否正确

```cmd
sudo nginx -t
```

停止

```cmd
sudo nginx -s stop
```

启动

```cmd
sudo nginx
```

重新加载

```cmd
sudo nginx -s reload
```

### 反向代理

### nginx 搭建 https 服务器

https://www.jianshu.com/p/fe0fadb38600

### nginx http 转 https

配置

```shell

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    upstream seven_cli_port{
	    server 127.0.0.1:7777;
	}

    # HTTPS server
    #
    server {
        listen       443 ssl;
        server_name  xiaowei.qcloud.com;

        ssl_certificate      server.crt;
        ssl_certificate_key  server.key;

        ssl_session_timeout 5m;
	    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
	    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	    ssl_prefer_server_ciphers on;


        location / {
	       	proxy_pass http://seven_cli_port;

	       	proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection keep-alive;
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
	        proxy_set_header X-Real-IP $remote_addr;
	        proxy_set_header X-Forwarded-Proto  $scheme;

        }
    }

}
```

https://blog.csdn.net/see__you__again/article/details/51896891

https://blog.csdn.net/permanent_2008/article/details/45564613

https://blog.csdn.net/dounine/article/details/53734631

### 参考

https://blog.csdn.net/see__you__again/article/details/51896891

### 实际使用建议

所以实际使用中，个人觉得至少有三个匹配规则定义，如下：

直接匹配网站根，通过域名访问网站首页比较频繁，使用这个会加速处理，官网如是说。

这里是直接转发给后端应用服务器了，也可以是一个静态首页

第一个必选规则

```shell
location = / {

    proxy_pass http://tomcat:8080/index

}
```

第二个必选规则是处理静态文件请求，这是 nginx 作为 http 服务器的强项

有两种配置模式，目录匹配或后缀匹配,任选其一或搭配使用

```shell
location ^~ /static/ {

    root /webroot/static/;

}

location ~\* \.(gif|jpg|jpeg|png|css|js|ico)\$ {

    root /webroot/res/;

}
```

第三个规则就是通用规则，用来转发动态请求到后端应用服务器

非静态文件请求就默认是动态请求，自己根据实际把握

```shell
location / {

    proxy_pass http://tomcat:8080/

}
```

https://blog.csdn.net/zhongzh86/article/details/70173174

https://www.cnblogs.com/knowledgesea/p/5175711.html

通过启动一个端口的服务，再用 nginx 进行转发实现 vue 项目部署： https://www.cnblogs.com/liugx/p/9336176.html

### vue-cli@3.x

https://segmentfault.com/a/1190000015428921

### nginx 配置

https://www.cnblogs.com/xiaoliangup/p/9175932.html
