---
layout: CustomPages
title: dva
date: 2020-11-21
aside: false
draft: true
---

## Dva

从[官网](https://dvajs.com/guide/)中的介绍可以看到对于 dva 的说明：

> dva 首先是一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验，dva 还额外内置了 react-router 和 fetch， 所以也可以理解为是一个轻量级的应用框架。

从作者[云谦](https://github.com/sorrycc)的博客

dva 项目魔改， 首先从 github 上 clone 一个比较成熟的项目， 比如这里我是 clone 了 https://github.com/LANIF-UI/dva-boot-admin。 其次最终通过对照着官网的文档，对项目做了一定的注释和删减，最终会得到一个全新、简单、充满注释的 dva demo 项目。

#### 阅读源码的正确方式

1. 首先需要有一定的基础， 比如本地阅读是对 dva 的拆解，那么首先需要知道的是 dva 的实现是什么样的。 具体可以参考云谦大神的博客，这里就简单理解为 dva 是对 react react-router redux redux-saga 以及 fetch 等常见的 saga 解决方案的封装，实际上 dva 的这些 api 最终会被转化为以 redux-saga 项目的中间态，最后再被 roadhog (webpack) 打包成静态资源文件。本质上就是在写普通的 react 项目。
2. 如果不使用 dva，而需要自己手动来搭建 redux-saga 这套解决方案，你会怎么做
3. 先看 dva 官网的 api， 对照一个接口一个接口地去看 dva 的实现原理，同时需要观察步骤 2 中你自己搭建的项目，了解 dva 在这里这么做的原因。
4. 对着官网 api 查看了源码之后，已经有大部分源码你已经看过了，这时候再直接去看源码的结构和实现。
5. 记得记下一些笔记和优秀的设计，以后用到自己的代码中。
