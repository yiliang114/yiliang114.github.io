---
title: html
date: 2020-11-21
draft: true
---

## HTML

### Reflow 和 Repaint

Reflow：当涉及到 DOM 节点的布局属性发生变化时，就会重新计算该属性，浏览器会重新描绘相应的元素，此过程叫 Reflow（回流或重排）。
Repaint：
当影响 DOM 元素可见性的属性发生变化 (如 color) 时, 浏览器会重新描绘相应的元素, 此过程称为 Repaint（重绘）。因此重排必然会引起重绘。

引起 Repaint 和 Reflow 的一些操作

- 调整窗口大小
- 字体大小
- 样式表变动
- 元素内容变化，尤其是输入控件
- CSS 伪类激活，在用户交互过程中发生
- DOM 操作，DOM 元素增删、修改
- width, clientWidth, scrollTop 等布局宽高的计算

Repaint 和 Reflow 是不可避免的，只能说对性能的影响减到最小，给出下面几条建议：

1. 避免逐条更改样式。建议集中修改样式，例如操作 className。
2. 避免频繁操作 DOM。创建一个 documentFragment 或 div，在它上面应用所有 DOM 操作，最后添加到文档里。设置 display:none 的元素上操作，最后显示出来。
3. 避免频繁读取元素几何属性（例如 scrollTop）。绝对定位具有复杂动画的元素。
4. 绝对定位使它脱离文档流，避免引起父元素及后续元素大量的回流

### 为什么利用多个域名来存储网站资源会更有效？

CDN 缓存更方便
突破浏览器并发限制
节约 cookie 带宽
节约主域名的连接数，优化页面响应速度
防止不必要的安全问题

## HTML5

### web 语义化的好处

1. 去掉或者丢失样式的时候能够让页面呈现出清晰的结构
2. 有利于 SEO：和搜索引擎建立良好沟通，有助于爬虫抓取更多的有效信息：爬虫依赖于标签来确定上下文和各个关键字的权重；
3. 方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备）以意义的方式来渲染网页；
4. 便于团队开发和维护，语义化更具可读性，是下一步吧网页的重要动向，遵循 W3C 标准的团队都遵循这个标准，可以减少差异化。

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
- 地理 API
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

### HTML5 的优点？

优点：

- 提高可用性和改进用户的友好体验；
- 可以给站点带来更多的多媒体元素(视频和音频)；
- 可以很好的替代 Flash 和 Silverlight；
- 涉及到网站的抓取和索引的时候，对于 SEO 很友好；
- 被大量应用于移动应用程序和游戏。
