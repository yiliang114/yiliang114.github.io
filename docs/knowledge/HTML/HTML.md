---
title: html
date: 2020-11-21
draft: true
---

## HTML

### iframe 框架都有哪些优缺点？

优点：

- 重载页面时不需要重载整个页面，只需要重载页面中的一个框架页
- 技术易于掌握，使用方便，可主要应用于不需搜索引擎来搜索的页面
- 方便制作导航栏
- iframe 能够原封不动的把嵌入的网页展现出来。
- 如果有多个网页引用 iframe，那么你只需要修改 iframe 的内容，就可以实现调用的每一个页面内容的更改，方便快捷。
- 网页如果为了统一风格，头部和版本都是一样的，就可以写成一个页面，用 iframe 来嵌套，可以增加代码的可重用。
- 如果遇到加载缓慢的第三方内容如图标和广告，这些问题可以由 iframe 来解决。

缺点：

- 会产生很多页面，不容易管理，不容易打印
- 对浏览器搜索引擎不友好
- 多框架的页面会增加服务器的 http 请求
- 搜索引擎的爬虫程序无法解读这种页面
- 框架结构中出现各种滚动条
- 使用框架结构时，保证设置正确的导航链接。
- iframe 页面会增加服务器的 http 请求

### offsetWidth/offsetHeight,clientWidth/clientHeight 与 scrollWidth/scrollHeight 区别

offsetWidth/offsetHeight 返回值包含 content + padding + border，效果与 e.getBoundingClientRect()相同
clientWidth/clientHeight 返回值只包含 content + padding，如果有滚动条，也不包含滚动条
scrollWidth/scrollHeight 返回值包含 content + padding + 溢出内容的尺寸

### 实现效果，点击容器内的图标，图标边框变成 border 1px solid red，点击空白处重置

```js
const box = document.getElementById('box');
function isIcon(target) {
  return target.className.includes('icon');
}

box.onclick = function(e) {
  e.stopPropagation();
  const target = e.target;
  if (isIcon(target)) {
    target.style.border = '1px solid red';
  }
};
const doc = document;
doc.onclick = function(e) {
  const children = box.children;
  for (let i = 0; i < children.length; i++) {
    if (isIcon(children[i])) {
      children[i].style.border = 'none';
    }
  }
};
```

### 怎么从十万个节点中找到想要的节点，怎么快速在某个节点前插入一个节点

1.假设文档是一棵 Root 节点为 html 标签的一棵树，因为是只需要返回第一个找到的节点，所以通过队列实现广度优先遍历

```js
function isWanted(node) {
  //查找成立的条件
}

function findNode(isWanted) {
  const root = document.getElementByTagName('html');
  const queue = [root];
  while (!isWanted(queue[0])) {
    const current = queue[0];
    const children = queue[0].children || [];
    for (i = 0; i < children.length; i++) {
      // 这里在遍历的过程中新增指针把children指向parent, 可以帮助求解第二问。
      children[i].parent = current;
      queue.push(children[i]);
    }
    queue.unshift();
  }
  return queue[0];
}
```

2.根据第一题找到的 node，然后可以找到 parent 节点，再通过 parent 找到所有子节点，对应 index 位置插入节点就好

```js
function insertNode(newNode) {
  const newChildren = [];
  const existingNode = findNode(isWanted);
  const parent = existingNode.parent;
  const siblings = parent.children;
  //  如果用indexOf再加上splice的话，需要两次循环。时间复杂度为O(2n)？
  for (i = 0; i < siblings; i++) {
    if (siblings[i] === existingNode) {
      newChildren.push(newNode);
    }
    newChildren.push(siblings[i]);
  }
  parent.children = newChildren;
  return;
}
```

### 使用 link 和@import 有什么区别？

1. link 是 HTML 标签，@import 是 css 提供的。
2. link 引入的样式页面加载时同时加载，@import 引入的样式需等页面加载完成后再加载。
3. link 没有兼容性问题，@import 不兼容 ie5 以下。
4. link 可以通过 js 操作 DOM 动态引入样式表改变样式，而@import 不可以。

### 实现不使用 border 画出 1px 高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果。

```html
<div style="height:1px;overflow:hidden;background:red"></div>
```

### 写 HTML 代码时应注意什么？

- 尽可能少的使用无语义的标签。例如`div`,`span`
- 在语义不明显时，既可以使用`div`又可以使用`P`的时候，尽量使用`P`，因为`P`在默认情况下有上下间距，对兼容特殊终端有利
- 不要使用纯样式标签，例如：`b,font,u`, 该用 CSS 设置
- 需要强调的文本，可以包含在 strong 或 em 标签中（浏览器预设样式，能用 CSS 指定就不用它们）， strong 默认样式是加粗（不要用 b）， em 是斜体（不用 i）
- 使用表格时，标题要用 caption，表头用 thead，主体部分用 tbody 包围，尾部用
  tfoot 包围。表头和一般单元格要区分开，表头用 th，单元格用 td
- 表单域要用 fieldset 标签包起来，并用 legend 标签说明表单的用途
- 每个 input 标签对应的说明文本都需要使用 label 标签，并且通过为 input 设置 id
  属性，在 lable 标签中设置 for=someld 来让说明文本和相对应的 input 关联起来

### 什么是渐进式渲染（progressive rendering）？

渐进式渲染是用于提高网页性能（尤其是提高用户感知的加载速度），以尽快呈现页面的技术。

在以前互联网带宽较小的时期，这种技术更为普遍。如今，移动终端的盛行，而移动网络往往不稳定，渐进式渲染在现代前端开发中仍然有用武之地。

一些举例：

- 图片懒加载——页面上的图片不会一次性全部加载。当用户滚动页面到图片部分时，JavaScript 将加载并显示图像。
- 确定显示内容的优先级（分层次渲染）——为了尽快将页面呈现给用户，页面只包含基本的最少量的 CSS、脚本和内容，然后可以使用延迟加载脚本或监听`DOMContentLoaded`/`load`事件加载其他资源和内容。
- 异步加载 HTML 片段——当页面通过后台渲染时，把 HTML 拆分，通过异步请求，分块发送给浏览器。更多相关细节可以在[这里](http://www.ebaytechblog.com/2014/12/08/async-fragments-rediscovering-progressive-html-rendering-with-marko/)找到。

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

### 简述一下 src 与 href 的区别。

答案：

src 用于替换当前元素，href 用于在当前文档和引用资源之间确立联系。

src 是 source 的缩写，指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求 src 资源时会将其指向的资源下载并应用到文档内，例如 js 脚本，img 图片和 frame 等元素。

<script src ="js.js"></script>

当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将 js 脚本放在底部而不是头部。

href 是 Hypertext Reference 的缩写，指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，如果我们在文档中添加

<link href="common.css" rel="stylesheet"/>

那么浏览器会识别该文档为 css 文件，就会并行下载资源并且不会停止对当前文档的处理。这也是为什么建议使用 link 方式来加载 css，而不是使用@import 方式。

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

### HTML5 的离线储存

在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件

#### 原理：

HTML5 的离线存储是基于一个新建的 .appcache 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像 cookie 一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示 #####如何使用：

- 页面头部像下面一样加入一个 manifest 的属性；
- 在 cache.manifest 文件的编写离线存储的资源
- 在离线状态时，操作 window.applicationCache 进行需求实现

#### 浏览器如何加载

在线的情况下，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问 app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。如果已经访问过 app 并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。
