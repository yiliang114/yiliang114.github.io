---
title: Webpack Dev Server
date: 2020-11-21
draft: true
---

## Webpack Dev Server

如何用它搭建一个开发环境？

### webpack-dev-server 配置跨域

```js
module.exports = {
  // ...
  devServer: {
    contentBase: './dist', // 起一个在 dist 文件夹下的服务器
    open: true, // 自动打开浏览器并访问服务器地址
    proxy: {
      // 跨域代理
      '/api': 'http: //localhost:3000', // 如果使用 /api,会被转发（代理）到该地址
    },
    port: 8080,
    hot: true, // 开启 HMR 功能
    hotOnly: true, // 即使 HMR 不生效，也不自动刷新
  },
  // ...
};
```
