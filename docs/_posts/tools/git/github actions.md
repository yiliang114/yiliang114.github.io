---
title: 'github actions'
date: '2020-10-22'
tags:
  - github
draft: true
---

## github actions

### 简介

Github Actions 是 Github 推出的一个新的功能，可以为我们的项目自动化地构建工作流，例如代码检查，自动化打包，测试，发布版本等等。Github 是做了一个商店的功能。这样大家就可以自己定义自己的 Action，然后方便别人复用。同时也可以统一自己的或者组织在构建过程中的一些公共流程。

其中对于每一个项目的 action 都是在一个独立的 docker 容器环境中运行的，所以一般来说需要开发者了解 docker 的基本知识。

### 基本概念

1. workflow （工作流程）：持续集成一次运行的过程，就是一个 workflow。
2. job （任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。
3. step（步骤）：每个 job 由多个 step 构成，一步步完成。
4. action （动作）：每个 step 可以依次执行一个或多个命令（action）。

### 自动发布 npm

https://www.infoq.cn/article/QhNJfG6QYk3kDpKJ3PDq

### 发布一个 action

https://help.github.com/cn/actions/automating-your-workflow-with-github-actions/publishing-actions-in-github-marketplace

### 自动 issue blog

https://github.com/Sep0lkit/git-issues-blog

### work-weixin-notifier

是否编译结束

https://github.com/marketplace/actions/work-weixin-notifier

### TODO: DEMO

- 自动 changelog
- 上传 cos
- 上传 七牛云
- 自动发布 npm 包
