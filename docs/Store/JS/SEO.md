---
title: SEO
date: 2020-11-21
draft: true
---

### 前端需要注意哪些 SEO

- 标题与关键词:设置有吸引力切合实际的标题，标题中要包含所做的关键词
- 网站结构目录:最好不要超过三级，每级有“面包屑导航”，使网站成树状结构分布
- 页面元素:给图片标注"Alt"可以让搜索引擎更友好的收录
- 网站内容:每个月每天有规律的更新网站的内容，会使搜索引擎更加喜欢
- 友情链接:对方一定要是正规网站，每天有专业的团队或者个人维护更新
- 内链的布置:使网站形成类似蜘蛛网的结构，不会出现单独连接的页面或链接
- 流量分析:通过统计工具(百度统计，CNZZ)分析流量来源，指导下一步的 SEO
- 合理的 title、description、keywords：搜索对着三项的权重逐个减小，title 值强调重点即可，重要关键词出现不要超过 2 次，而且要靠前，不同页面 title 要有所不同；description 把页面内容高度概括，长度合适，不可过分堆砌关键词，不同页面 description 有所不同；keywords 列举出重要关键词即可
- 语义化的 HTML 代码，符合 W3C 规范：语义化代码让搜索引擎容易理解网页
- 重要内容 HTML 代码放在最前：搜索引擎抓取 HTML 顺序是从上到下，有的搜索引擎对抓取长度有限制，保证重要内容一定会被抓取
- 重要内容不要用 js 输出：爬虫不会执行 js 获取内容
- 少用 iframe：搜索引擎不会抓取 iframe 中的内容
- 非装饰性图片必须加 alt
- 提高网站速度：网站速度是搜索引擎排序的一个重要指标
- 了解搜索引擎如何抓取网页和如何索引网页
- meta 标签优化
- 关键词分析
- 付费给搜索引擎
- 链接交换和链接广泛度（Link Popularity）
- 合理的标签使用

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
page.open(url, function(status) {
  // ...
  // 没有设置捕获钩子时，在脚本执行完捕获
  if (!options.captureAfterDocumentEvent && !options.captureAfterElementExists && !options.captureAfterTime) {
    // 拼接 html
    var html = page.evaluate(function() {
      var doctype = new window.XMLSerializer().serializeToString(document.doctype);
      var outerHTML = document.documentElement.outerHTML;
      return doctype + outerHTML;
    });
    returnResult(html); // 捕获输出
  }
  // ...
});
```

### 请解释单页应用是什么，如何使其对 SEO 友好。

**好处：**

- 用户感知响应更快，用户切换页面时，不再看到因页面刷新而导致的白屏。
- 对服务器进行的 HTTP 请求减少，因为对于每个页面加载，不必再次下载相同的资源。
- 客户端和服务器之间的关注点分离。可以为不同平台（例如手机、聊天机器人、智能手表）建立新的客户端，而无需修改服务器代码。只要 API 没有修改，可以单独修改客户端和服务器上的代码。

**坏处：**

- 由于加载了多个页面所需的框架、应用代码和资源，导致初始页面加载时间较长。
- 服务器还需要进行额外的工作，需要将所有请求路由配置到单个入口点，然后由客户端接管路由。
- SPA 依赖于 JavaScript 来呈现内容，但并非所有搜索引擎都在抓取过程中执行 JavaScript，他们可能会在你的页面上看到空的内容。这无意中损害了应用的搜索引擎优化（SEO）。然而，当你构建应用时，大多数情况下，搜索引擎优化并不是最重要的因素，因为并非所有内容都需要通过搜索引擎进行索引。为了解决这个问题，可以在服务器端渲染你的应用，或者使用诸如 [Prerender](https://prerender.io/) 的服务来“在浏览器中呈现你的 javascript，保存静态 HTML，并将其返回给爬虫”。

### 前后端分离的项目如何 seo

1. 使用 prerender。但是回答 prerender，面试官肯定会问你，如果不用 prerender，让你直接去实现，好的，请看下面的第二个答案。
2. 先去 https://www.baidu.com/robots.txt 找出常见的爬虫，然后在 nginx 上判断来访问页面用户的 User-Agent 是否是爬虫，如果是爬虫，就用 nginx 方向代理到我们自己用 nodejs + puppeteer 实现的爬虫服务器上，然后用你的爬虫服务器爬自己的前后端分离的前端项目页面，增加扒页面的接收延时，保证异步渲染的接口数据返回，最后得到了页面的数据，返还给来访问的爬虫即可。