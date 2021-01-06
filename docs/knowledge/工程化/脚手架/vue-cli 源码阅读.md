---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# vue-cli 源码阅读笔记

## 背景

说一说我为什么想看`vue-cli`源码： 之前我们前端小组用的项目脚手架一直是一位同事自己的开源项目，后来这位同事离职了，脚手架更新也不是特别方便，遇到 bug 时，对于脚手架内部逻辑不熟也很难排查。

我们前端小组的技术栈基本上市面上流行的都有：

- react + redux + ts 全家桶
- react + mobx
- vue + vuex
- vue h5
- ...

jquery zepto 这些老项目一般也只是出于维护状态，就算重构也是全部推翻用 react 或者 vue 重构。

因此我的前端小组需要一个自己维护的，并支持多种技术栈模板的脚手架工具，与此同时，对于脚手架内部的原理和实现逻辑，我也必须非常了解。

而对于 vue 项目，vue-cli 无疑是最好的学习对象。

## 项目结构

首先 `git clone https://github.com/vuejs/vue-cli`， 需要切换到 `master`

分支上。最后得到的是一个如下的目录：

```
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── appveyor.yml
├── bin
|  ├── vue
|  ├── vue-build
|  ├── vue-create
|  ├── vue-init
|  └── vue-list
├── circle.yml
├── docs
|  └── build.md
├── issue_template.md
├── lib
|  ├── ask.js
|  ├── check-version.js
|  ├── eval.js
|  ├── filter.js
|  ├── generate.js
|  ├── git-user.js
|  ├── local-path.js
|  ├── logger.js
|  ├── options.js
|  └── warnings.js
├── package-lock.json
├── package.json
└── test
   └── e2e
```

整体目录如上图所示，但是对我们阅读源码来说，最重要的是一下几个部分：

```
├── README.md
├── bin
|  ├── vue
|  ├── vue-build
|  ├── vue-create
|  ├── vue-init
|  └── vue-list
├── lib
|  ├── ask.js
|  ├── check-version.js
|  ├── eval.js
|  ├── filter.js
|  ├── generate.js
|  ├── git-user.js
|  ├── local-path.js
|  ├── logger.js
|  ├── options.js
|  └── warnings.js
├── package.json
```

- bin 目录存放 vue-cli 的命令文件
- lib 存放作者封装的一些工具函数
