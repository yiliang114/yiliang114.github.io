---
layout: CustomPages
title: 浏览器
date: 2020-11-21
aside: false
draft: true
---

### css hack 是什么

由于不同的浏览器，比如 Internet Explorer 6,Internet Explorer 7,Mozilla Firefox 等，对 CSS 的解析认识不一样，因此会导致生成的页面效果不一样，得不到我们所需要的页面效果。

这个时候我们就需要针对不同的浏览器去写不同的 CSS，让它能够同时兼容不同的浏览器，能在不同的浏览器中也能得到我们想要的页面效果。

这个针对不同的浏览器写不同的 CSS code 的过程，就叫 CSS hack,也叫写 CSS hack。

### css hack 原理及常用 hack

- 原理：利用不同浏览器对 CSS 的支持和解析结果不一样编写针对特定浏览器样式。
- 常见的 hack 有
  - 属性 hack
  - 选择器 hack
  - IE 条件注释

css hack 原理：
对于不同的浏览器，CSS 的解析程度不一样，因此会导致生成的页面效果不一样；特别是对于 IE 这种蛇精病的浏览器来说，这个时候我们就需要针对不同的浏览器（特别是 IE）去写不同的 CSS，这个过程就叫做 css hack

css hack 主要依据的是

1. 浏览器对 CSS 的支持及解析结果不一样；
2. CSS 中的优先级的关系。

### 讨论 CSS hacks，条件引用或者其他。

A: CSS 主要由三种方法：

- 属性前缀法(即类内部 Hack)：例如 IE6 能识别下划线"\_"和星号" \* "，IE7 能识别星号" \* "，但不能识别下划线"\_"，IE6~IE10 都认识"\9"，但 firefox 前述三个都不能认识。
- 选择器前缀法(即选择器 Hack)：例如 IE6 能识别`*html .class{}`，IE7 能识别`*+html .class{}`或者`*:first-child+html .class{}`。
- IE 条件注释法(即 HTML 条件注释 Hack)：针对所有 IE(注：IE10+已经不再支持条件注释)： <!--[if IE]>IE浏览器显示的内容 <![endif]-->，针对 IE6 及以下版本： <!--[if lt IE 6]>只在IE6-显示的内容 <![endif]-->。这类 Hack 不仅对 CSS 生效，对写在判断语句里面的所有代码都会生效。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Css Hack</title>
    <style>
      #test {
        width: 300px;
        height: 300px;

        background-color: blue; /*firefox*/
        background-color: red\9; /*all ie*/
        background-color: yellow\0; /*ie8*/
        +background-color: pink; /*ie7*/
        _background-color: orange; /*ie6*/
      }
      :root #test {
        background-color: purple\9;
      } /*ie9*/
      @media all and (min-width: 0px) {
        #test {
          background-color: black\0;
        }
      } /*opera*/
      @media screen and (-webkit-min-device-pixel-ratio: 0) {
        #test {
          background-color: gray;
        }
      } /*chrome and safari*/
    </style>
  </head>
  <body>
    <div id="test">test</div>
  </body>
</html>
```

### CSS Hack

在一部分不合法，但是在某些浏览器上生效的写法就叫 CSS Hack，一般用来兼容老的浏览器， 缺点是难理解、难维护、易失效

替代方案：

- 特征检测
- 针对性的加 class
  - 比如第一步检测是 IE6，那么只需要添加一个专门的 class 名来兼容 IE6 就好

写 Hack 时需要注意

- 标准属性写在前面， hack 代码写在后面
