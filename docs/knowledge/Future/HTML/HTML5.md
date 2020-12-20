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

#### HTML5 有哪些新增的表单元素？

HTML5 新增了很多表单元素让开发者构建更优秀的 Web 应用程序，主要有：
datalist
keygen
output

#### HTML5 标准提供了哪些新的 API？

· Media API
· Text Track API
· Application Cache API
· User Interaction
· Data Transfer API
· Command API
· Constraint Validation API
· History API

#### 移除元素：

1. 纯表现的元素：basefont，big，center, s，strike，tt，u；
1. 对可用性产生负面影响的元素：frame，frameset，noframes；

### HTML5 为什么只需要写 <!DOCTYPE HTML>？

HTML5 不基于 SGML，因此不需要对 DTD 进行引用，但是需要 doctype 来规范浏览器的行为（让浏览器按照它们应该的方式来运行）；
而 HTML4.01 基于 SGML,所以需要对 DTD 进行引用，才能告知浏览器文档所使用的文档类型。

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

### html5 有哪些新特性、移除了那些元素？如何处理 HTML5 新标签的浏览器兼容问题？如何区分 HTML 和 HTML5？

- HTML5 现在已经不是 SGML 的子集，主要是关于图像，位置，存储，多任务等功能的增加。

- 拖拽释放(Drag and drop) API
  语义化更好的内容标签（header,nav,footer,aside,article,section）
  音频、视频 API(audio,video)
  画布(Canvas) API
  地理(Geolocation) API
  本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失；
  sessionStorage 的数据在浏览器关闭后自动删除
  表单控件，calendar、date、time、email、url、search
  新的技术 webworker, websocket, Geolocation

- 移除的元素

  纯表现的元素：basefont，big，center，font, s，strike，tt，u；
  对可用性产生负面影响的元素：frame，frameset，noframes；
  支持 HTML5 新标签：

- IE8/IE7/IE6 支持通过 document.createElement 方法产生的标签，
  可以利用这一特性让这些浏览器支持 HTML5 新标签，浏览器支持新标签后，还需要添加标签默认的样式：

- 当然最好的方式是直接使用成熟的框架、使用最多的是 html5shim 框架
  <!--[if lt IE 9]>
       <script> src="http://html5shim.googlecode.com/svn/trunk/html5.js"</script>
       <![endif]-->
  如何区分： DOCTYPE 声明\新增的结构元素\功能元素

### `<keygen>` 是正确的 HTML5 标签吗

是。
`<keygen>` 标签规定用于表单的密钥对生成器字段。当提交表单时，私钥存储在本地，公钥发送到服务器。是 HTML5 标签。

### 将 HTML5 看作成开放的网络平台，什么是 HTML5 的基本构件（building block）？

语义 - 提供更准确地描述内容。
连接 - 提供新的方式与服务器通信。
离线和存储 - 允许网页在本地存储数据并有效地离线运行。
多媒体 - 在 Open Web 中，视频和音频被视为一等公民（first-class citizens）。
2D/3D 图形和特效 - 提供更多种演示选项。
性能和集成 - 提供更快的访问速度和性能更好的计算机硬件。
设备访问 - 允许使用各种输入、输出设备。
外观 - 可以开发丰富的主题

### HTML5 的存储方案有哪些

HTML5 提供了 sessionStorage、localStorage 和离线存储作为新的存储方案，其中 sessionStorage 和 localStorage
都是采用键值对的形式存储，两者都是通过 setItem、getItem、removeItem 来实现增删查改，而 sessionStorage 是会话存储，也就是说
当浏览器关闭之后 sessionStorage 也自动清空了，而 localStorage 不会，它没有时间上的限制。离线存储也就是应用程序缓存，这个通常用来
确保 web 应用能够在离线情况下使用，通过在 html 标签中属性 manifest 来声明需要缓存的文件，这个属性的值是一个包含需要缓存的文件的文件名的文件，
这个 manifest 文件声明的缓存文件可在初次加载后缓存在客户端，可以通过更新这个 manifest 文件来达到更新缓存文件的目的。

### HTML5 的离线储存

##### 使用场景：

在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件

##### 原理：

HTML5 的离线存储是基于一个新建的.appcache 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像 cookie 一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示 #####如何使用：

- 页面头部像下面一样加入一个 manifest 的属性；
- 在 cache.manifest 文件的编写离线存储的资源
- 在离线状态时，操作 window.applicationCache 进行需求实现

##### 浏览器如何加载

在线的情况下，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问 app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。如果已经访问过 app 并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。

### HTML5 的 form 如何关闭自动完成功能？

给不想要提示的 form 或某个 input 设置为 autocomplete=off。

### HTML5 应用程序缓存和浏览器缓存有什么区别？

    应用程序缓存是 HTML5  的重要特性之一，提供了离线使用的功能，让应用程序可以获取本地的网站内容，例如 HTML 、 CSS 、图片以及 JavaScript 。这个特性可以提高网站性能，它的实现借助于 manifest 文件，如下：
    <!doctype html>
    <html manifest=”example.appcache”>
    …..
    </html>

    与传统浏览器缓存相比，它不强制用户访问的网站内容被缓存。

### HTML5 Canvas 元素有什么用？

    Canvas 元素用于在网页上绘制图形，该元素标签强大之处在于可以直接在 HTML 上进行图形操作，
    <canvas id=” canvas1 ″ width= ” 300 ″ height= ” 100 ″ >
    </canvas>

### 除了 audio 和 video，HTML5 还有哪些媒体标签？

HTML5 对于多媒体提供了强有力的支持，除了 audio 和 video 标签外，还支持以下标签：

```js
<embed> 标签定义嵌入的内容，比如插件。
<embed type=” video/quicktime ” src= ” Fishing.mov ” >
<source> 对于定义多个数据源很有用。
<video width=” 450 ″ height= ” 340 ″ controls>
    <source src=” jamshed.mp4 ″ type= ” video/mp4 ″ >
    <source src=” jamshed.ogg ” type= ” video/ogg ” >
</video>
<track> 标签为诸如 video 元素之类的媒介规定外部文本轨道。 用于规定字幕文件或其他包含文本的文件，当媒介播放时，这些文件是可见的。
<video width=” 450 ″ height= ” 340 ″ controls>
    <source src=” jamshed.mp4 ″ type= ” video/mp4 ″ >
    <source src=” jamshed.ogg ” type= ” video/ogg ” >
    <track kind=” subtitles ” label= ” English ” src= ” jamshed_en.vtt ” srclang= ” en ” default></track>
    <track kind=” subtitles ” label= ” Arabic ” src= ” jamshed_ar.vtt ” srclang= ” ar ” ></track>
</video>
```

据源很有用。标签为诸如 video 元素之类的媒介规定外部文本轨道。 用于规定字幕文件或其他包含文本的文件，当媒介播放时，这些文件是可见的。

### HTML5 中如何嵌入视频？

和音频类似，HTML5 支持 MP4 、 WebM 和 Ogg 格式的视频，下面是简单示例：

```js
<video width=” 450 ″ height= ” 340 ″ controls>
<source src=” jamshed.mp4 ″ type= ” video/mp4 ″ >
Your browser does’ nt support video embedding feature.
</video>
```

### HTML5 中如何嵌入音频？

HTML5 支持 MP3 、 Wav 和 Ogg 格式的音频，下面是在网页中嵌入音频的简单示例：

```js
<audio controls>
  <source src=” jamshed.mp3 ″ type= ” audio/mpeg ” >
  Your browser does’ nt support audio embedding feature.
</audio>
```

### 新的 HTML5 文档类型和字符集是？

HTML5 文档类型很简单：

<!doctype html>

HTML5 使用 UTF-8 编码示例：

<meta charset=” UTF-8 ″ >

### 如何处理 HTML5 新标签的浏览器兼容问题？

- 通过 document.createElement 创建新标签
- 使用垫片 html5shiv.js

### 如何区分 HTML 和 HTML5？

- DOCTYPE 声明、新增的结构元素、功能元素

### 浏览器是怎么对 HTML5 的离线储存资源进行管理和加载的？

- 在线的情况下，浏览器发现 html 标签有 manifest 属性，它会请求 manifest 文件
- 如果是第一次访问 app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储
- 如果已经访问过 app 且资源已经离线存储了，浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作。如果文件改变了，那么就会重新下载文件中的资源并进行离线存储
- 离线的情况下，浏览器就直接使用离线存储的资源。

### HTML5 的离线储存怎么使用，工作原理能不能解释一下？

- 在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件
- 原理：HTML5 的离线存储是基于一个新建的.appcache 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像 cookie 一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示

- 如何使用：

  - 在文档的 html 标签设置 manifest 属性，如 manifest="/offline.appcache"
  - 在项目中新建 manifest 文件，manifest 文件的命名建议：xxx.appcache
  - 在 web 服务器配置正确的 MIME-type，即 text/cache-manifest

```
CACHE MANIFEST
#v0.11
CACHE:
js/app.js
css/style.css
NETWORK:
resourse/logo.png
FALLBACK:
/ /offline.html
```

### 浏览器是怎么对 HTML5 的离线储存资源进行管理和加载的呢？

- 在线的情况下，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问 app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。如果已经访问过 app 并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储
- 离线的情况下，浏览器就直接使用离线存储的资源

### HTML5 的离线储存怎么使用，工作原理能不能解释一下？

在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。

原理：HTML5 的离线存储是基于一个新建的.appcache 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像 cookie 一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。

如何使用：

1. 页面头部像下面一样加入一个 manifest 的属性；
2. 在 cache.manifest 文件的编写离线存储的资源

```
CACHE MANIFEST
#v1.0

CACHE:
js/app.js
css/style.css

NETWORK:
assets/logo.png

FALLBACK:
/html5/ /404.html
```

### 浏览器是怎么对 HTML5 的离线储存资源进行管理和加载的呢？

- 在线的情况下，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问 app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。如果已经访问过 app 并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。
- 离线的情况下，浏览器就直接使用离线存储的资源。

在离线状态时，操作 window.applicationCache 进行需求实现。

参考链接：[HTML5 离线缓存-manifest 简介](https://yanhaijing.com/html/2014/12/28/html5-manifest/)

## HTML5 的新特性（或者说 HTML5 有代表性的标签）

### HTML5 提供了新的元素来创建更好的页面结构：

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

### HTML5 Canvas

HTML5 <canvas> 元素用于图形的绘制，通过脚本 (通常是 JavaScript)来完成.

<canvas> 标签只是图形容器，您必须使用脚本来绘制图形。

### HTML5 拖放

`<img draggable="true">`

### HTML5 地理定位

Geolocation API 用于获得用户的地理位置。

### HTML5 Audio(音频)、Video(视频)

### HTML5 Web 存储

- localStorage
- sessionStorage

### 用 HTML5 实现手机摇一摇功能你有做过吗？你知道它的原理吗？

https://github.com/haizlin/fe-interview/issues/580

### 你有用过 HTML5 的 Device API 吗？说说它都有哪些应用场景？

https://github.com/haizlin/fe-interview/issues/576

### HTML5 的应用程序缓存与浏览器缓存有什么不同？

https://github.com/haizlin/fe-interview/issues/568

### 你有用过 HTML5 中的 datalist 标签吗？说说你对它的理解

https://github.com/haizlin/fe-interview/issues/562

### 说说你对 HTML5 的 img 标签属性 srcset 和 sizes 的理解？都有哪些应用场景？

https://github.com/haizlin/fe-interview/issues/530

### HTML5 如何识别语音读出的内容和朗读指定的内容？

https://github.com/haizlin/fe-interview/issues/526

### 写个例子说明 HTML5 在移动端如何打开 APP？](https://github.com/haizlin/fe-interview/issues/490)

### HTML5 如果不写`<! DOCTYPE html>` ，页面还会正常工作么？](https://github.com/haizlin/fe-interview/issues/403)

### 有使用过 HTML5 的拖放 API 吗？说说你对它的理解](https://github.com/haizlin/fe-interview/issues/275)

### 有用过 HTML5 的 webSQL 和 IndexedDB 吗？说说你对它们的理解](https://github.com/haizlin/fe-interview/issues/254)

### HTML5 相对于 HTML4 有哪些优势？](https://github.com/haizlin/fe-interview/issues/240)

### 你了解 HTML5 的 download 属性吗？](https://github.com/haizlin/fe-interview/issues/236)

### 你有了解 HTML5 的地理定位吗？怎么使用？](https://github.com/haizlin/fe-interview/issues/207)

### HTML5 如何使用音频和视频？](https://github.com/haizlin/fe-interview/issues/177)

### html5 哪些标签可以优化 SEO?](https://github.com/haizlin/fe-interview/issues/136)

### HTML5 的文件离线储存怎么使用，工作原理是什么？

https://github.com/haizhilin2013/interview/issues/10

### HTML5 的 form 如何关闭自动补全功能？

给不想要提示的 form 或某个 input 设置为 autocomplete=off。

### 简述下 html5 的离线储存原理，同时说明如何使用？

https://github.com/haizhilin2013/interview/issues/22

### html 的元素有哪些（包含 H5）？

https://github.com/haizhilin2013/interview/issues/4

HTML5 的 video 在有的移动端设备无法自动播放？怎么解决？

### HTML 废弃标签介绍

这些标签都有着浓重的样式的作用，干涉了 css。

- font
- b
- u
- i
- del
- hr
- em
- strong

br 很少用，尽量使用 p 标签来换行。

标准的 div+css 页面，用的标签种类很少：

- div
- p
- h1
- span
- a
- img
- ul
- ol
- dl
- input 等

### HTML 语义化

- HTML 标签的语义化是指：通过使用包含语义的标签（如 h1-h6）恰当地表示文档结构
- css 命名的语义化是指：为 html 标签添加有意义的 class

就是用合理、正确的标签来展示内容，比如 h1~h6 定义标题。好处：

- 去掉或者丢失样式的时候能够让页面呈现出清晰的结构
- 有利于 SEO：和搜索引擎建立良好沟通，有助于爬虫抓取更多的有效信息：爬虫依赖于标签来确定上下文和各个关键字的权重；
- 方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备）以意义的方式来渲染网页；
- 便于团队开发和维护，语义化更具可读性，遵循 W3C 标准的团队都遵循这个标准，可以减少差异化。
- 易于用户阅读，样式丢失的时候能让页面呈现清晰的结构。
- 有利于 SEO，搜索引擎根据标签来确定上下文和各个关键字的权重。
- 方便其他设备解析，如盲人阅读器根据语义渲染网页
- 有利于开发和维护，语义化更具可读性，代码更好维护，与 CSS3 关系更和谐。
- 用正确的标签做正确的事情。
- html 语义化让页面的内容结构化，结构更清晰，便于对浏览器、搜索引擎解析;
- 即使在没有样式 CSS 情况下也以一种文档格式显示，并且是容易阅读的;
- 搜索引擎的爬虫也依赖于 HTML 标记来确定上下文和各个关键字的权重，利于 SEO;
- 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。
- 去掉样式后页面呈现清晰的结构
- 盲人使用读屏器更好地阅读
- 搜索引擎更好地理解页面，有利于收录
- 便团队项目的可持续运作及维护

### 什么是 web 语义化,有什么好处

web 语义化是指通过 HTML 标记表示页面包含的信息，包含了 HTML 标签的语义化和 css 命名的语义化。
HTML 标签的语义化是指：通过使用包含语义的标签（如 h1-h6）恰当地表示文档结构
css 命名的语义化是指：为 html 标签添加有意义的 class，id 补充未表达的语义，如[Microformat](http://en.wikipedia.org/wiki/Microformats)通过添加符合规则的 class 描述信息
为什么需要语义化：

- 去掉样式后页面呈现清晰的结构
- 盲人使用读屏器更好地阅读
- 搜索引擎更好地理解页面，有利于收录
- 便团队项目的可持续运作及维护

### 说说你对语义化的理解？

1. 去掉或者丢失样式的时候能够让页面呈现出清晰的结构
2. 有利于 SEO：和搜索引擎建立良好沟通，有助于爬虫抓取更多的有效信息：爬虫依赖于标签来确定上下文和各个关键字的权重；
3. 方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备）以意义的方式来渲染网页；
4. 便于团队开发和维护，语义化更具可读性，是下一步吧网页的重要动向，遵循 W3C 标准的团队都遵循这个标准，可以减少差异化。

### 你如何理解 HTML 结构的语义化？

去掉或样式丢失的时候能让页面呈现清晰的结构：
html 本身是没有表现的，我们看到例如<h1>是粗体，字体大小 2em，加粗；<strong>是加粗的，不要认为这是 html 的表现，这些其实 html 默认的 css 样式在起作用，所以去掉或样式丢失的时候能让页面呈现清晰的结构不是语义化的 HTML 结构的优点，但是浏览器都有有默认样式，默认样式的目的也是为了更好的表达 html 的语义，可以说浏览器的默认样式和语义化的 HTML 结构是不可分割的。

屏幕阅读器（如果访客有视障）会完全根据你的标记来“读”你的网页.
　　例如,如果你使用的含语义的标记,屏幕阅读器就会“逐个拼出”你的单词,而不是试着去对它完整发音.

PDA、手机等设备可能无法像普通电脑的浏览器一样来渲染网页（通常是因为这些设备对 CSS 的支持较弱）
　　使用语义标记可以确保这些设备以一种有意义的方式来渲染网页.理想情况下,观看设备的任务是符合设备本身的条件来渲染网页.

语义标记为设备提供了所需的相关信息,就省去了你自己去考虑所有可能的显示情况（包括现有的或者将来新的设备）.例如,一部手机可以选择使一段标记了标题的文字以粗体显示.而掌上电脑可能会以比较大的字体来显示.无论哪种方式一旦你对文本标记为标题,您就可以确信读取设备将根据其自身的条件来合适地显示页面.

搜索引擎的爬虫也依赖于标记来确定上下文和各个关键字的权重
　　过去你可能还没有考虑搜索引擎的爬虫也是网站的“访客”,但现在它们他们实际上是极其宝贵的用户.没有他们的话,搜索引擎将无法索引你的网站,然后一般用户将很难过来访问.

你的页面是否对爬虫容易理解非常重要,因为爬虫很大程度上会忽略用于表现的标记,而只注重语义标记.
　　因此,如果页面文件的标题被标记,而不是,那么这个页面在搜索结果的位置可能会比较靠后.除了提升易用性外,语义标记有利于正确使用 CSS 和 JavaScript,因为其本身提供了许多“钩钩”来应用页面的样式与行为.
SEO 主要还是靠你网站的内容和外部链接的。

便于团队开发和维护
　　 W3C 给我们定了一个很好的标准，在团队中大家都遵循这个标准，可以减少很多差异化的东西，方便开发和维护，提高开发效率，甚至实现模块化开发。
