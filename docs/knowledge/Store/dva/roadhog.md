---
layout: CustomPages
title: dva
date: 2020-11-21
aside: false
draft: true
---

# roadhog 源码

[项目地址](https://github.com/sorrycc/roadhog/blob/master/README_zh-cn.md)

## 了解和熟悉

Roadhog 是一个包含  `dev`、`build`  和  `test`  的命令行工具，他基于  [react-dev-utils](https://github.com/facebookincubator/create-react-app/tree/master/packages/react-dev-utils)，和  [create-react-app](https://github.com/facebookincubator/create-react-app)  的体验保持一致。你可以想象他为可配置版的 create-react-app。

目前使用 Roadhog 比较多的场景是跟 dva 搭配使用。从项目的功能来看，Roadhog 主要是将项目的 webpack 配置封装入黑盒子中，项目的开发者不需要再自定义 webpack 配置，Roadhog 对外暴露了三个命令`dev`、`build`  和  `test` 。同时，为了简化前端项目的开发，roadhog dev 命令支持了数据的 Mock 功能，在  `.roadhogrc.mock.js`  中进行配置。
