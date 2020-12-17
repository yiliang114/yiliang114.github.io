---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# react 全家桶实战-社区 app

## 需求分析

需求是做一个社区的 webapp，首先一个社区的功能有：

- 登录、注册
- 发帖
- 查看别人的帖子
- 评论帖子
- 等等

开发过程中需要将这些功能拆分成一个一个可拆解的模块。

```
// todo
模块划分图
```

## 技术选型

`react`全家桶的话，`redux`，`redux`， `react-redux` 这三样是必须的。`redux-saga`是一个`redux`处理异步`action`的中间件，对比`redux-thunk`，配合`async`,`await`也可以基本满足业务开发的需求。但是总体而言`redux-saga`更加优雅一些，`redux-saga`能够让我们像处理同步 action 一样处理异步 action。

UI 框架选择了`antd-mobile`, 用`axios`发送 http 请求，用`create-react-app`脚手架创建项目。

## 步骤

### init

```
create-react-app react-cnode
```

### 安装 antd-mobile

```
npm install antd-mobile --save
```

[文档](https://www.jianshu.com/p/43c604177c08)

[git](https://link.jianshu.com/?t=https://github.com/Juliiii/React-Cnode)

## 遇到的问题
