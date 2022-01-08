---
title: Node 场景
date: '2020-10-26'
draft: true
---

## Node 场景

### BFF

- 中间件
  - 鉴权
  - 日志，完整的日志链路
- 规范请求体和返回体的格式、字段等
- 接口文档自动更新

<!-- https://www.infoq.cn/article/4hjplbxo1xktefxzpqz8 -->

#### 解决

简单介绍一下 bff 怎么做的？
权限、访问控制
配置生成页面、规范
云函数 serverless

怎么进行复用

### Nest

网关职责：

1. 接口时间统计
2. 身份验证
3. 参数类型验证

### Node + TS

前端 后台共享 proto 加快接口 mock 的速度等

#### TS

- nest
- daruk
- https://github.com/TypedProject/tsed
- https://cnodejs.org/topic/59214033ba8670562a40f314
- https://github.com/axetroy/kost

google： typescript node 框架

#### 需求

- ts
- 装饰器
- 自动加载模块 （可以自定义名称。。。 其实最好是不要可定义，传一个配置即可）
- IOC 控制反转
- 插件（丰富的插件）， 和 中间件
- 日志系统
- 急速的 restful api 打造 / rpc
- 云 api 模式（搞成一个插件 or 中间件）
- 自动环境变量注入
- 定时任务
- 事件模型
- 中间件机制
- 日志系统如何进行处理
- 如何鉴权

### 服务端渲染、同构

### 怎么保证后端服务稳定性，怎么做容灾

### 怎么让数据库查询更快
