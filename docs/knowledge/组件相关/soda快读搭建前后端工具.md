---
layout: CustomPages
title: 技术驱动
date: 2020-11-21
aside: false
draft: true
---

### 前端

vue-cli@3 的配置的

- vue-router
- vuex
- element
- eslint
- 单元测试
- build 之后已经配置好 public 直接部署到 nginx 即可
- 基本上 travis 也有了。。

React 系列

- router
- redux - saga
- immutable
- select 等乱七八糟

- umi 和 蚂蚁 dva
- mobx 原理等等

### 后台

基于 egg 来搭建的。 ts + egg ，为什么不用 koa2 因为 egg 不就是 koa 上封了一层么，自己能少做一点事情。

- 日志记录
- 日志、错误上报、错误邮件告警
- graph ql
- sequence 快速新建数据库表
- 快速创建路由并注册
- 权限系统
- api 网页调试工具， 不用每次都开 postman
  - 记录每次的值，直接点击即可
- 单元测试

### 部署

- docker 部署
- mysql 打包进 docker (可配置，根据是否需要)
- 持续集成(可以被快速配置， jenkins 和 travis 都有点麻烦。。。)
- 多机部署(k8s ？)
- 弹性扩容

### 独立系统

- 日志上报系统

- 日志、错误可视化
