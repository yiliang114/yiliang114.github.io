---
title: React-SSR
date: '2020-10-26'
draft: true
---

### 客户端渲染与服务端渲染

客户端渲染即普通的 React 项目渲染方式。
客户端渲染流程：

1. 浏览器发送请求
2. 服务器返回 HTML
3. 浏览器发送 bundle.js 请求
4. 服务器返回 bundle.js
5. 浏览器执行 bundle.js 中的 React 代码

CSR 带来的问题：

1. 首屏加载时间过长
2. SEO 不友好

因为时间在往返的几次网络请求中就耽搁了，而且因为 CSR 返回到页面的 HTML 中没有内容，就只有一个 root 空元素，页面内容是靠 js 渲染出来的，爬虫在读取网页时就抓不到信息，所以 SEO 不友好

SSR 带来的问题：

1. React 代码在服务器端执行，很大的消耗了服务器的性能

### React 同构时页面加载流程

1. 服务端运行 React 代码渲染出 HTML
2. 浏览器加载这个无交互的 HTML 代码
3. 浏览器接收到内容展示
4. 浏览器加载 JS 文件
5. JS 中 React 代码在浏览器中重新执行