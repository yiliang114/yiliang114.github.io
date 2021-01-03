---
layout: CustomPages
title: HTML5
date: 2020-11-21
aside: false
draft: true
---

### HTML5 有哪些新特性、移除了哪些元素

#### 新特性

- 语义化： 能够让你更恰当地描述你的内容是什么
- 设备访问 Device Access： 能够处理各种输入和输出设备（触控事件 touch ， 使用地理位置定位，检测设备方向）
- HTML5 现在已经不是 SGML 的子集，主要是关于图像，位置，存储，多任务等功能的增加。
- 拖拽释放(Drag and drop) API
- 语义化更好的内容标签（header,nav,footer,aside,article,section）
- 音频、视频 API(audio,video)
- 画布(Canvas) API
- webGL
- 地理(Geolocation) API
- 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失
- sessionStorage 的数据在页面会话结束时会被清除
- 表单控件，calendar、date、time、email、url、search
- 新的技术 webworker, websocket 等
- XMLHTTPRequest2， 在线和离线事件等

**新的 API**

- Media API
- Text Track API
- Application Cache API
- User Interaction
- Data Transfer API
- Command API
- Constraint Validation API
- History API

**HTML5 提供了新的元素来创建更好的页面结构**

| 标签       | 描述                              |
| ---------- | --------------------------------- |
| <article>  | 定义页面独立的内容区域。          |
| <aside>    | 定义页面的侧边栏内容。            |
| <header>   | 定义了文档的头部区域              |
| <footer>   | 定义 section 或 document 的页脚。 |
| <mark>     | 定义带有记号的文本。              |
| <nav>      | 定义导航链接的部分。              |
| <progress> | 定义任何类型的任务的进度。        |
| <time>     | 定义日期或时间。                  |

#### 移除元素：

1. 纯表现的元素：basefont，big，center, s，strike，tt，u；
1. 对可用性产生负面影响的元素：frame，frameset，noframes；

### HTML5 的优点与缺点？

优点：
a、网络标准统一、HTML5 本身是由 W3C 推荐出来的。
b、多设备、跨平台
c、即时更新。
d、提高可用性和改进用户的友好体验；
e、有几个新的标签，这将有助于开发人员定义重要的内容；
f、可以给站点带来更多的多媒体元素(视频和音频)；
g、可以很好的替代 Flash 和 Silverlight；
h、涉及到网站的抓取和索引的时候，对于 SEO 很友好；
i、被大量应用于移动应用程序和游戏。

缺点： a、安全：像之前 Firefox4 的 web socket 和透明代理的实现存在严重的安全问题，同时 web storage、web socket 这样的功能很容易被黑客利用，来盗取用户的信息和资料。
b、完善性：许多特性各浏览器的支持程度也不一样。
c、技术门槛：HTML5 简化开发者工作的同时代表了有许多新的属性和 API 需要开发者学习，像 web worker、web socket、web storage 等新特性，后台甚至浏览器原理的知识，机遇的同时也是巨大的挑战
d、性能：某些平台上的引擎问题导致 HTML5 性能低下。
e、浏览器兼容性：最大缺点，IE9 以下浏览器几乎全军覆没。

### 说说你对 HTML5 认识?（是什么,为什么）

是什么：
HTML5 指的是包括 HTML 、 CSS 和 JavaScript 在内的一套技术组合。它希望能够减少网页浏览器对于需要插件的丰富性网络应用服务（ Plug-in-Based Rich Internet Application ， RIA ），例如： AdobeFlash 、 Microsoft Silverlight 与 Oracle JavaFX 的需求，并且提供更多能有效加强网络应用的标准集。 HTML5 是 HTML 最新版本， 2014 年 10 月由万维网联盟（ W3C ）完成标准制定。目标是替换 1999 年所制定的 HTML 4.01 和 XHTML 1.0 标准，以期能在互联网应用迅速发展的时候，使网络标准达到匹配当代的网络需求。

为什么：
HTML4 陈旧不能满足日益发展的互联网需要，特别是移动互联网。为了增强浏览器功能 Flash 被广泛使用，但安全与稳定堪忧，不适合在移动端使用（耗电、触摸、不开放）。
HTML5 增强了浏览器的原生功能，符合 HTML5 规范的浏览器功能将更加强大，减少了 Web 应用对插件的依赖，让用户体验更好，让开发更加方便，另外 W3C 从推出 HTML4.0 到 5.0 之间共经历了 17 年， HTML 的变化很小，这并不符合一个好产品的演进规则。

### 将 HTML5 看作成开放的网络平台，什么是 HTML5 的基本构件（building block）？

语义 - 提供更准确地描述内容。
连接 - 提供新的方式与服务器通信。
离线和存储 - 允许网页在本地存储数据并有效地离线运行。
多媒体 - 在 Open Web 中，视频和音频被视为一等公民（first-class citizens）。
2D/3D 图形和特效 - 提供更多种演示选项。
性能和集成 - 提供更快的访问速度和性能更好的计算机硬件。
设备访问 - 允许使用各种输入、输出设备。
外观 - 可以开发丰富的主题

### HTML5 Canvas

HTML5 <canvas> 元素用于图形的绘制，通过脚本 (通常是 JavaScript)来完成。<canvas> 标签只是图形容器，您必须使用脚本来绘制图形。

### HTML5 拖放

`<img draggable="true">`

### HTML5 的 form 如何关闭自动补全功能？

给不想要提示的 form 或某个 input 设置为 autocomplete=off。

### HTML5 的离线储存

在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件

#### 原理：

HTML5 的离线存储是基于一个新建的 .appcache 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像 cookie 一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示 #####如何使用：

- 页面头部像下面一样加入一个 manifest 的属性；
- 在 cache.manifest 文件的编写离线存储的资源
- 在离线状态时，操作 window.applicationCache 进行需求实现

#### 浏览器如何加载

在线的情况下，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问 app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。如果已经访问过 app 并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。
