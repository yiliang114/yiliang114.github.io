---
title: webpack
date: 2020-11-21
aside: false
draft: true
---

# plugins

使用`plugins`让打包变的便捷，可以在 webpack 打包的某时刻帮做一些事情，他很像一个生命周期函数

### html-webpack-plugin

html-webpack-plugin 会在打包结束后，自动生成一个 html 文件,并把打包生成的 js 自动引入到 HTML 中。
可以给这个 html 制定一个模板

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 插件
plugins: [
    new HtmlWebpackPlugin({
        template: 'src/index.html'
    })
],
```

### clean-webpack-plugin

帮助打包时先清空 dist 目录

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
