---
layout: CustomPages
title: html
date: 2020-11-21
aside: false
draft: true
---

### 单页应用如何解决 SEO ?

用了 PhantomJS 做预渲染，Google 收录完美，百度只收录首页。

#### 前言

在一个单页应用中，往往只有一个 html 文件，然后根据访问的 url 来匹配对应的路由脚本，动态地渲染页面内容。单页应用在优化了用户体验的同时，也给我们带来了许多问题，例如 SEO 不友好、首屏可见时间过长等。服务端渲染（SSR）和预渲染（Prerender）技术正是为解决这些问题而生的。

#### 服务端渲染与预渲染区别

客户端渲染：用户访问 url，请求 html 文件，前端根据路由动态渲染页面内容。关键链路较长，有一定的白屏时间；
服务端渲染：用户访问 url，服务端根据访问路径请求所需数据，拼接成 html 字符串，返回给前端。前端接收到 html 时已有部分内容；
预渲染：构建阶段生成匹配预渲染路径的 html 文件（注意：每个需要预渲染的路由都有一个对应的 html）。构建出来的 html 文件已有部分内容

服务端渲染与预渲染共同点
针对单页应用，服务端渲染和预渲染共同解决的问题：

SEO：单页应用的网站内容是根据当前路径动态渲染的，html 文件中往往没有内容，网络爬虫不会等到页面脚本执行完再抓取；
弱网环境：当用户在一个弱环境中访问你的站点时，你会想要尽可能快的将内容呈现给他们。甚至是在 js 脚本被加载和解析前；
低版本浏览器：用户的浏览器可能不支持你使用的 js 特性，预渲染或服务端渲染能够让用户至少能够看到首屏的内容，而不是一个空白的网页。
预渲染能与服务端渲染一样提高 SEO 优化，但前者比后者需要更少的配置，实现成本低。弱网环境下，预渲染能更快地呈现页面内容，减少页面可见时间。

#### 什么场景下不适合使用预渲染

个性化内容：对于路由是 /my-profile 的页面来说，预渲染就失效了。因为页面内容依据看它的人而显得不同；

经常变化的内容：如果你预渲染一个游戏排行榜，这个排行榜会随着新的玩家记录而更新，预渲染会让你的页面显示不正确直到脚本加载完成并替换成新的数据。这是一个不好的用户体验；

成千上万的路由：不建议预渲染非常多的路由，因为这会严重拖慢你的构建进程。

#### Prerender SPA Plugin

prerender-spa-plugin 是一个 webpack 插件用于在单页应用中预渲染静态 html 内容。因此，该插件限定了你的单页应用必须使用 webpack 构建，且它是框架无关的，无论你是使用 React 或 Vue 甚至不使用框架，都能用来进行预渲染。

prerender-spa-plugin 原理

那么 prerender-spa-plugin 是如何做到将运行时的 html 打包到文件中的呢？原理很简单，就是在 webpack 构建阶段的最后，在本地启动一个 phantomjs，访问配置了预渲染的路由，再将 phantomjs 中渲染的页面输出到 html 文件中，并建立路由对应的目录。

查看 prerender-spa-plugin 源码  prerender-spa-plugin/lib/phantom-page-render.js。

```js
// 打开页面
page.open(url, function (status) {
...
// 没有设置捕获钩子时，在脚本执行完捕获
if (
!options.captureAfterDocumentEvent &&
!options.captureAfterElementExists &&
!options.captureAfterTime
) {
// 拼接 html
var html = page.evaluate(function () {
var doctype = new window.XMLSerializer().serializeToString(document.doctype)
var outerHTML = document.documentElement.outerHTML
return doctype + outerHTML
})
returnResult(html) // 捕获输出
}
...
})
```
