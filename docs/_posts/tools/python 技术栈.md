---
title: 'python 技术栈整理'
date: 2020-09-05
tags:
  - python
---

# python 技术栈整理

## 开发环境

### 工具

- PyChram

### 本地环境

- 包管理： pip/easy_install
- 库、版本管理，环境隔离： viertualenv + viertualenvwrapper
- ipython/ipdb
- pydev

## 项目开发

### web 框架

一门语言要成为 web 后台语言，首先要处理 web 后台相关的库。

- Tornado：异步, 高性能, 最新版本 4.0。
- Flask：轻量! 可以灵活组合各类组件进行开发(第三方组件很丰富), 简单高效, 便于快速开发和维护。
- Django：有些重, 配置和约定众多, 可以快速开发一些”管理”性质的后台。
  Python Web 框架也是超多，目前主流的就是这三个了。目前工作中采用的 Tornado，性能卓越。
- web.py web2.py

### ORM

- SQLAlchemy：标配。
- pymongo：访问 mongodb。
- peewe：一个更轻量的 ORM，简单了解，没在生产环境用过。

### 数据库

- 关系型数据库：mysql

### No SQL：

- redis 缓存/持久化/特殊需求(计数-排行榜-时间线等)
- memcached 集群, 多用于有时限性质的缓存
- mongodb
  目前业务中这三个都有用到，感觉 redis 有逐渐取代 memcached 的趋势。

### py 代码编程规范

- pep8

### 分布式存储

- HDFS：hadopp 生态
- Hive：分析 log
- Hbase： 列数据库，可以存储海量数据，上 10 亿条不在话下，跟关系型数据库区别较大。

### 消息队列

- `RabbitMQ`: python 中`pika`操作。
- `celery`： 据同事反馈，找 Python 开发的时候，10 个有 9 个用过 celery(芹菜)。于是，简单看了下 celery 使用文档，感觉 RabbitMQ 已经满足现在的业务需求，没有在生产环境中使用。

### 项目部署

### 服务器

- `nginx` , 主要用于负载均衡,，反向代理，使用极为广泛。
- `uWSGI`，用来部署 Django 项目。
- `gunicorn` a Python WSGI HTTP Server for UNIX, 用来运行 Flask 项目

### 运维管理

- `saltstack`：别名，盐栈。自动化运维工具。
- `puppet`：这货是 Ruby 开发的，百度和小米都在大规模使用。
- `fabric`： 用于自动化部署。
- `Supervisor` A Process Control System, 配置管理各种程序, 进程监控, 自动重启等。

#### 第三方库

- `requests` HTTP for humans, 非常好用, 强烈推荐
- `beautifulsoup` 配合 urllib2 或者 requests 库进项简单的抓取分析工作
- `scrapy` 很牛的抓取框架, 适合规模较大,需求复杂的的抓取任务
- `cachetools`: 本地缓存

## 其他

### 软件工程

- 设计模式：Python 虽然不像 Java 里没完没了的设计模式，基本的设计模式也会用到。组合，单例模式、装饰器模式、工厂模式这几个常用。
- RESTful 接口。
- MVC
- 测试：单元测试，性能测试。
  有比较才有差距，多看别人代码，借鉴提高。

### 云计算

- 大数据：Hadoop 生态。
- 虚拟化：Docker， KVM， OpenStack。
- 公有云：AWS，阿里云，Azure，金山云。
- 私有云：百度的私有云建设的很不错，分布式存储、虚拟化业界领先。
