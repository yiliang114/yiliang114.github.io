---
title: webpack
date: 2020-11-21
draft: true
---

### webpack 简介

`webpack`是一个前端模块化打包工具，最开始它只能打包 JS 文件，但是随着 webpack 的发展，他还能打包如 CSS、图片等文件。主要由入口，出口，loader，plugins 四个部分。

### 模块化

### 安装

### webpack 基本配置文件

### Loader

### package-lock.json

**介绍 WebPack 是什么？ 有什么优势？**

- WebPack 是一款[模块加载器]兼[打包工具]，用于把各种静态资源（js/css/image 等）作为模块来使用
- WebPack 的优势：
  - WebPack 同时支持 commonJS 和 AMD/CMD，方便代码迁移
  - 不仅仅能被模块化 JS ，还包括 CSS、Image 等
  - 能替代部分 grunt/gulp 的工作，如打包、压缩混淆、图片 base64
  - 扩展性强，插件机制完善，特别是支持 React 热插拔的功能

**什么是前端工程化？**

- 前端工程化就是把一整套前端工作流程使用工具自动化完成

* 前端开发基本流程：
  - 项目初始化：yeoman, FIS
  - 引入依赖包：bower, npm
  - 模块化管理：npm, browserify, Webpack
  - 代码编译：babel, sass, less
  - 代码优化(压缩/合并)：Gulp, Grunt
  - 代码检查：JSHint, ESLint
  - 代码测试：Mocha
* 目前最知名的构建工具：Gulp, Grunt, npm + Webpack

**介绍 Yeoman 是什么？**

- Yeoman --前端开发脚手架工具，自动将最佳实践和工具整合起来构建项目骨架
- Yeoman 其实是三类工具的合体，三类工具各自独立：
  - yo --- 脚手架，自动生成工具（相当于一个粘合剂，把 Yeoman 工具粘合在一起）
  - Grunt、gulp --- 自动化构建工具 （最初只有 grunt，之后加入了 gulp）
  - Bower、npm --- 包管理工具 （原来是 bower，之后加入了 npm）

### 你说一下 webpack 的一些 plugin，怎么使用 webpack 对项目进行优化。

正好最近在做 webpack 构建优化和性能优化的事儿，当时吹了大概 15~20 分钟吧，插件请见[webpack 插件归纳总结](https://segmentfault.com/a/1190000016816813)。

构建优化

1. 减少编译体积 ContextReplacementPugin、IgnorePlugin、babel-plugin-import、babel-plugin-transform-runtime。
2. 并行编译 happypack、thread-loader、uglifyjsWebpackPlugin 开启并行
3. 缓存 cache-loader、hard-source-webpack-plugin、uglifyjsWebpackPlugin 开启缓存、babel-loader 开启缓存
4. 预编译 dllWebpackPlugin && DllReferencePlugin、auto-dll-webapck-plugin

性能优化

1. 减少编译体积 Tree-shaking、Scope Hositing。
2. hash 缓存 webpack-md5-plugin
3. 拆包 splitChunksPlugin、import()、require.ensure
