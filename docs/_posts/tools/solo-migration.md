---
title: solo-migration
date: 2020-03-14 17:06:38
tags:
  - solo
---

### 记一次 solo 迁移

> 本篇博客迁移自 solo. 发表于 2018-11-01

#### 背景

由于一些历史原因，我原来是将博客、网页部署在腾讯云的服务器上的，后来因为腾讯云的蜜汁服务体验，果断买了阿里云的服务器，不过由于腾讯云的域名时间有效期还很长，本着不要浪费的原则，我决定域名`zhijianzhang.cn` 继续使用，而将原服务器上的 solo 博客迁移到阿里云上。所以有了一个比较尴尬的场景：使用腾讯云购买的域名和阿里云的服务器。.

##### 数据库迁移

1. 在新的目标服务器的数据库中创建一个名为 solo 的数据库
   ![imagepng](https://imgconvert.csdnimg.cn/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzExLzljMjc1MDFjNWNiZjRiNzFhNTlhNTNiZmJlM2YwMTM3X2ltYWdlLnBuZw?x-oss-process=image/format,png)

2. 右键 Connection -> Data Transfer
   ![imagepng](https://imgconvert.csdnimg.cn/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzExL2EyOGExOGM1ZTZiMjQwODdiOTM1YmFhMDk0MzE4ZTA2X2ltYWdlLnBuZw?x-oss-process=image/format,png)

3) 选择配置之后，就 Next -> Start
   ![imagepng](https://imgconvert.csdnimg.cn/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzExL2Y2OGRkMDUyNjU5OTQ5MWI4NTdlOGUwMDg0Njk3ZDcyX2ltYWdlLnBuZw?x-oss-process=image/format,png)

4. 迁移完了之后，目标服务器上有了 solo 数据表和数据
   ![imagepng](https://imgconvert.csdnimg.cn/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzExLzBiYjM2OTgyMGYzMTQ0MTg4ODY5NTllYzMyODA1Yzc3X2ltYWdlLnBuZw?x-oss-process=image/format,png)

##### 项目文件迁移

1. 压缩 solo 项目文件： `sudo tar zcvf solo.tar.gz solo-2.9.4/`
   ![imagepng](https://imgconvert.csdnimg.cn/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzExL2UwMWNiMDg5NGNiNDQ3MTQ5ZmI2ZTVmOTQ5NmEwMWNlX2ltYWdlLnBuZw?x-oss-process=image/format,png)

2) 通过 ubuntu 的 scp 命令向目标服务器传输这个压缩文件： `scp -r solo.tar.gz root@xxx.yy.cc.rrr:/usr/local/workspace/`. 输入密码之后就会开始慢慢传输文件
   ![imagepng](https://imgconvert.csdnimg.cn/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzExLzdlNmExNWZiM2ZkMDQ4OGRiYTZjZmVjNGI3ZThmY2E1X2ltYWdlLnBuZw?x-oss-process=image/format,png)

3. 去目标服务器上解压文件
   ```bash
   cd /usr/local/workspace/
   tar xzvf solo.tar.gz
   ```
   ![imagepng](https://imgconvert.csdnimg.cn/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzExLzU5YWI3MGVlM2FiODQzMjc5M2ZiM2Q3ZWNhOTEwYjhhX2ltYWdlLnBuZw?x-oss-process=image/format,png)

4) 启动 solo `nohup java -cp WEB-INF/lib/*:WEB-INF/classes org.b3log.solo.Starter >/dev/null 2>&1 &`, 启动就完事了，是不可能的。
   ![imagepng](https://imgconvert.csdnimg.cn/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzExLzRhODNmYWQxYTBlZDRhZWE4NzM0NTdkYTQ4MDU1NWY3X2ltYWdlLnBuZw?x-oss-process=image/format,png)

注意，我主要是为了操作方便，所以 mysql 的用户名和密码都是一致的，所以这里能直接不修改启动就行了。

##### nginx 配置

其实这一步不算是迁移，就在新的服务器上为 solo 添加配置。 贴一下从 D 那抄的配置：

```nginx
upstream backend {
    server localhost:8080; # Tomcat/Jetty 监听端口
}

server {
    listen       80;
    server_name  solo.zhijianzhang.cn; # 博客域名

    access_log off;

    location / {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        proxy_pass http://backend$request_uri;
        proxy_set_header  Host $host:$server_port;
        proxy_set_header  X-Real-IP  $remote_addr;
        client_max_body_size  10m;
    }
}

```

![imagepng](https://imgconvert.csdnimg.cn/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzExLzRiZjI0YzAzOWM1NzQ5ZmViYTEwZmQ5MmU4YWQ2MzI5X2ltYWdlLnBuZw?x-oss-process=image/format,png)

我这边主要是在 `/etc/nginx/conf.d` 中新建一个 `solo.conf` 文件，写入上面的配置之后 `reload` 一下 nginx 配置就行了。因为默认 `/etc/nginx/nginx.conf` 会 `include` 在 `conf.d` 文件夹下的所有 `.conf` 配置文件的内容。

```bash
sudo nginx -t
sudo nginx -s reload
```

##### 云解析

![imagepng](https://imgconvert.csdnimg.cn/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzExLzNkYWM0MjRmZDc5ZjQ4NTM4NDY2ZDk5OGI0MmM4MTNiX2ltYWdlLnBuZw?x-oss-process=image/format,png)

这里不要奇怪为什么在腾讯云的控制台，上面说了，因为是腾讯云上购买的域名，要云解析到阿里云的服务器的话，需要将整个域名在阿里云重新进行备案（其实跟在阿里云重新购买并备案一个域名差不多），时间上大概也是一个月左右，备案通过之后还是在腾讯云的控制台进行管理云解析。

##### 最后

如果顺利的话，一般经过上述步骤之后，访问同一个[域名](http://solo.zhijianzhang.cn)，就能看到熟悉的博客了。如果不顺利的话，emmmm .... 聪明的你一定会发现哪里出了问题的！

（这篇笔记算是写了两遍...., solo 竟然在没有写标签的情况下没有触发自动保存，页面一切写了大半小时的内容就没了...）

##### 迁移过程的错误

迁移完了之后，需要写一篇博客看看数据能够正常保存。在发布博客的时候，有可能会出现如下的问题： ![](https://imgconvert.csdnimg.cn/aHR0cDovL21lZGlhLnpoaWppYW56aGFuZy5jbi8vZmlsZS8yMDE4LzExLzg2OTJhYTNjNjQ0ODRmYWJiMWMwNzZiM2Q3MjNjYWQ1X2ltYWdlLnBuZw?x-oss-process=image/format,png)

本来以为出现这个问题的原因是由于数据库的格式引起的，手动去修改数据库格式为 `utf8mb4` 之后生效了一会之后又不行了。后来改回原来的格式，发现重新新建的文章是可以保存成功的，出现这个原因只是单的这篇。

具体原因手动 @D
