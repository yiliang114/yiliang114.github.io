---
title: Doctype&Meta
date: 2020-11-21
draft: true
---

## Doctype

### Doctype 的作用是什么

告知浏览器文档使用哪种 HTML 或 XHTML 规范解析页面。如果没有写，则浏览器则根据自身的规则（怪异模式渲染）对代码进行解析，可能会严重影响 HTML 排版布局。

### 有多少种 Doctype 文档类型

该标签可声明三种 DTD 类型，分别表示严格版本、过渡版本以及基于框架的 HTML 文档。

HTML 4.01 规定了三种文档类型：Strict、Transitional 以及 Frameset。在 HTML5 中<!DOCTYPE>只有一种，HTML5 不基于 SGML，所以不需要引用 DTD， `<!doctype html>` 表示 html5 的。

Standards （标准）模式（也就是严格呈现模式）用于呈现遵循最新标准的网页，而 Quirks（包容）模式（也就是松散呈现模式或者兼容模式）用于呈现为传统浏览器而设计的网页。

## Meta

### meta 标签

meta 标签：提供给页面的一些元信息（名称/值对）， 比如针对搜索引擎和更新频度的描述和关键词。

- name： 告诉搜索引擎你的站点的信息，包括作者 内容 关键字等。名称/值对中的名称。常用的有 author、description、keywords、generator、revised、others。 把 content 属性关联到一个名称。
- http-equiv：用以说明主页制作所使用的文字及语言， 没有 name 时，会采用这个属性的值。常用的有 content-type、expires、refresh、set-cookie。把 content 属性关联到 http 头部。
- content： 名称/值对中的值， 可以是任何有效的字符串。 始终要和 name 属性或 http-equiv 属性一起使用。
- scheme： 用于指定要用来翻译属性值的方案
- viewport 原理， 标签缩放页面比例

### viewport

Viewport ：字面意思为视图窗口，在移动 web 开发中使用。表示将设备浏览器宽度虚拟成一个特定的值（或计算得出），这样利于移动 web 站点跨设备显示效果基本一致。移动版的 Safari 浏览器最新引进了 viewport 这个 meta tag，让网页开发者来控制 viewport 的大小和缩放，其他手机浏览器也基本支持。

在移动端浏览器当中，存在着两种视口，一种是可见视口（也就是我们说的设备大小），另一种是视窗视口（网页的宽度是多少）。 举个例子：如果我们的屏幕是 320 像素 \* 480 像素的大小（iPhone4），假设在浏览器中，320 像素的屏幕宽度能够展示 980 像素宽度的内容。那么 320 像素的宽度就是可见视口的宽度，而能够显示的 980 像素的宽度就是视窗视口的宽度。

为了显示更多的内容，大多数的浏览器会把自己的视窗视口扩大，简易的理解，就是让原本 320 像素的屏幕宽度能够容下 980 像素甚至更宽的内容（将网页等比例缩小）

Viewport 属性值

- width 设置 layout viewport 的宽度，为一个正整数，或字符串"width-device"
- initial-scale 设置页面的初始缩放值，为一个数字，可以带小数
- minimum-scale 允许用户的最小缩放值，为一个数字，可以带小数
- maximum-scale 允许用户的最大缩放值，为一个数字，可以带小数
- height 设置 layout viewport 的高度，这个属性对我们并不重要，很少使用
- user-scalable 是否允许用户进行缩放，值为"no"或"yes", no 代表不允许，yes 代表允许这些属性可以同时使用，也可以单独使用或混合使用，多个属性同时使用时用逗号隔开就行了

### viewport 的常见设置有哪些

viewport 常常使用在响应式开发以及移动 web 开发中，viewport 顾名思义就是用来设置视口，主要是规定视口的宽度、视口的初始缩放值、
视口的最小缩放值、视口的最大缩放值、是否允许用户缩放等。一个常见的 viewport 设置如下：

```html
<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no,width=device-width" />
```

其中同时设置 width 和 initial-scale 的目的是为了解决 iphone、ipad、ie 横竖屏不分的情况，因为这两个值同时存在时会取较大值。

### header 中 meta

兼容性配置，让 IE 使用最高级的 Edge 渲染，如果有 chrome 就使用 chrome 渲染。

```html
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
```

如果是双核浏览器，优先使用 webkit 引擎

```html
<meta name="render" content="webkit" />
```

### 禁止缩放

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no" />
```

### CSS 如何适配浏览器大小？

1.

```html
<meta
  name="viewport"
  content="width=device-width,
        height=device-height,
        inital-scale=1.0,
        maximum-scale=1.0,
        user-scalable=no;"
/>
```

2. 网页内部的元素宽度要使用百分比，在不同的屏幕大小下需使用媒体查询定义不同的 css 代码

代码解析：
width：控制 viewport 的大小，可以是指定的一个值，比如 1920，或者是特殊的值，如 device-width 为设备的宽度，单位为缩放为 100% 时的 CSS 的像素。
height：和 width 相对应，指定高度，可以是指定的一个值，比如 1080，或者是特殊的值，如 device-height 为设备的高度。
initial-scale：初始缩放比例，即当页面第一次载入是时缩放比例。
maximum-scale：允许用户缩放到的最大比例。
minimum-scale：允许用户缩放到的最小比例。
user-scalable：用户是否可以手动缩放。
