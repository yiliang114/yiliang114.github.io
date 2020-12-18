---
layout: CustomPages
title: Omi
date: 2020-11-21
aside: false
draft: true
---

### Shadow DOM

https://aotu.io/notes/2016/06/24/Shadow-DOM/index.html

**什么是单页面应用(SPA)？**

- 单页面应用(SPA)是指用户在浏览器加载单一的 HTML 页面，后续请求都无需再离开此页
- 目标：旨在用为用户提供了更接近本地移动 APP 或桌面应用程序的体验。

- 流程：第一次请求时，将导航页传输到客户端，其余请求通过 REST API 获取 JSON 数据
- 实现：数据的传输通过 Web Socket API 或 RPC(远程过程调用)。

- 优点：用户体验流畅，服务器压力小，前后端职责分离
- 缺点：关键词布局难度加大，不利于 SEO

**什么是“前端路由”? 什么时候适用“前端路由”? 有哪些优点和缺点?**

- 前端路由通过 URL 和 History 来实现页面切换
- 应用：前端路由主要适用于“前后端分离”的单页面应用(SPA)项目
- 优点：用户体验好，交互流畅
- 缺点：浏览器“前进”、“后退”会重新请求，无法合理利用缓存

### Omi + Web Components

https://segmentfault.com/a/1190000017091755?utm_source=tag-newest

http://www.ruanyifeng.com/blog/2019/08/web_components.html

### Web Components

好处： 跨端，内容封闭
坏处： 全局的 css 不受用了
