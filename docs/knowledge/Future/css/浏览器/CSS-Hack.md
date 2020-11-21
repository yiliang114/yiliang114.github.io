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

具体请看：
cnblogs.com/Renyi-Fan/p

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

常用 hack:

- png24 位的图片在 iE6 浏览器上出现背景，解决方案是做成 PNG8.
- 浏览器默认的 margin 和 padding 不同。解决方案是加一个全局的\*{margin:0;padding:0;}来统一。
- IE6 双边距 bug:块属性标签 float 后，又有横行的 margin 情况下，在 ie6 显示 margin 比设置的大。
  浮动 ie 产生的双倍距离 #box{ float:left; width:10px; margin:0 0 0 100px;}
  这种情况之下 IE 会产生 20px 的距离，解决方案是在 float 的标签样式控制中加入 ——*display:inline;将其转化为行内属性。(*这个符号只有 ie6 会识别)
  渐进识别的方式，从总体中逐渐排除局部。
  首先，巧妙的使用“\9”这一标记，将 IE 游览器从所有情况中分离出来。
  接着，再次使用“+”将 IE8 和 IE7、IE6 分离开来，这样 IE8 已经独立识别。
  css
  .bb{
  background-color:red;/_所有识别_/
  background-color:#00deff\9; /_IE6、7、8 识别_/
  +background-color:#a200ff;/_IE6、7 识别_/
  _background-color:#1e0bd1;/\_IE6 识别_/
  }
- IE 下,可以使用获取常规属性的方法来获取自定义属性,
  也可以使用 getAttribute()获取自定义属性;
  Firefox 下,只能使用 getAttribute()获取自定义属性。
  解决方法:统一通过 getAttribute()获取自定义属性。
- IE 下,even 对象有 x,y 属性,但是没有 pageX,pageY 属性;
  Firefox 下,event 对象有 pageX,pageY 属性,但是没有 x,y 属性。
- 解决方法：（条件注释）缺点是在 IE 浏览器下可能会增加额外的 HTTP 请求数。
- Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示,
  可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决。

超链接访问过后 hover 样式就不出现了 被点击访问过的超链接样式不在具有 hover 和 active 了解决方法是改变 CSS 属性的排列顺序:
L-V-H-A : a:link {} a:visited {} a:hover {} a:active {}

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

想要更多的了解 CSS hack 方面的知识可以参考：

- [史上最全的 CSS hack 方式一览](http://blog.csdn.net/freshlover/article/details/12132801)
- [史上最全的 css hack](http://www.cnblogs.com/wuqiang/archive/2011/08/23/2150240.html)

### CSS Hack

在一部分不合法，但是在某些浏览器上生效的写法就叫 CSS Hack，一般用来兼容老的浏览器， 缺点是难理解、难维护、易失效

替代方案：

- 特征检测
- 针对性的加 class
  - 比如第一步检测是 IE6，那么只需要添加一个专门的 class 名来兼容 IE6 就好

写 Hack 时需要注意

- 标准属性写在前面， hack 代码写在后面

### css hack 原理及常用 hack

原理：利用**不同浏览器对 CSS 的支持和解析结果不一样**编写针对特定浏览器样式。常见的 hack 有 1）属性 hack。2）选择器 hack。3）IE 条件注释

- IE 条件注释：适用于[IE5, IE9]常见格式如下

```html
<!--[if IE 6]>
  Special instructions for IE 6 here
<![endif]-->
```

- 选择器 hack：不同浏览器对选择器的支持不一样

```css
/***** Selector Hacks ******/

/* IE6 and below */
* html #uno {
  color: red;
}

/* IE7 */
*:first-child + html #dos {
  color: red;
}

/* IE7, FF, Saf, Opera  */
html > body #tres {
  color: red;
}

/* IE8, FF, Saf, Opera (Everything but IE 6,7) */
html>/**/body #cuatro {
  color: red;
}

/* Opera 9.27 and below, safari 2 */
html:first-child #cinco {
  color: red;
}

/* Safari 2-3 */
html[xmlns*=''] body:last-child #seis {
  color: red;
}

/* safari 3+, chrome 1+, opera9+, ff 3.5+ */
body:nth-of-type(1) #siete {
  color: red;
}

/* safari 3+, chrome 1+, opera9+, ff 3.5+ */
body:first-of-type #ocho {
  color: red;
}

/* saf3+, chrome1+ */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  #diez {
    color: red;
  }
}

/* iPhone / mobile webkit */
@media screen and (max-device-width: 480px) {
  #veintiseis {
    color: red;
  }
}

/* Safari 2 - 3.1 */
html[xmlns*='']:root #trece {
  color: red;
}

/* Safari 2 - 3.1, Opera 9.25 */
*|html[xmlns*=''] #catorce {
  color: red;
}

/* Everything but IE6-8 */
:root * > #quince {
  color: red;
}

/* IE7 */
* + html #dieciocho {
  color: red;
}

/* Firefox only. 1+ */
#veinticuatro,
x:-moz-any-link {
  color: red;
}

/* Firefox 3.0+ */
#veinticinco,
x:-moz-any-link,
x:default {
  color: red;
}
```

- 属性 hack：不同浏览器解析 bug 或方法

```css
/* IE6 */
#once {
  _color: blue;
}

/* IE6, IE7 */
#doce {
  *color: blue; /* or #color: blue */
}

/* Everything but IE6 */
#diecisiete {
  color/**/: blue;
}

/* IE6, IE7, IE8 */
#diecinueve {
  color: blue\9;
}

/* IE7, IE8 */
#veinte {
  color/*\**/: blue\9;
}

/* IE6, IE7 -- acts as an !important */
#veintesiete {
  color: blue !ie;
} /* string after ! can be anything */
```

### 什么是 Css Hack？ie6,7,8 的 hack 分别是什么？

答案：针对不同的浏览器写不同的 CSS code 的过程，就是 CSS hack。

示例如下：

```css
 #test {
 width:300px;
 height:300px;

 background-color:blue; /_firefox_/
 background-color:red\9; /_all ie_/
 background-color:yellow\0; /_ie8_/
 +background-color:pink; /_ie7_/
 \_background-color:orange; /_ie6_/ }
 :root #test { background-color:purple\9; } /_ie9_/
 @media all and (min-width:0px){ #test {background-color:black\0;} } /_opera_/
 @media screen and (-webkit-min-device-pixel-ratio:0){ #test {background-color:gray;} } /_chrome and safari_/
```

### 经常遇到的浏览器的兼容性有哪些？原因，解决方法是什么，常用 hack 的技巧

- png24 位的图片在 iE6 浏览器上出现背景，解决方案是做成 PNG8
- 浏览器默认的 margin 和 padding 不同。解决方案是加一个全局的\*{margin:0;padding:0;}来统一
- IE6 双边距 bug:块属性标签 float 后，又有横行的 margin 情况下，在 ie6 显示 margin 比设置的大
- 浮动 ie 产生的双倍距离 #box{ float:left; width:10px; margin:0 0 0 100px;}
- 这种情况之下 IE 会产生 20px 的距离，解决方案是在 float 的标签样式控制中加入 ——*display:inline;将其转化为行内属性。(*这个符号只有 ie6 会识别)
- 渐进识别的方式，从总体中逐渐排除局部
- 首先，巧妙的使用“\9”这一标记，将 IE 游览器从所有情况中分离出来。
- 接着，再次使用“+”将 IE8 和 IE7、IE6 分离开来，这样 IE8 已经独立识别

```
.bb{
      background-color:red;/*所有识别*/
      background-color:#00deff\9; /*IE6、7、8识别*/
      +background-color:#a200ff;/*IE6、7识别*/
      _background-color:#1e0bd1;/*IE6识别*/
  }
```

- IE 下,可以使用获取常规属性的方法来获取自定义属性,也可以使用 getAttribute()获取自定义属性;
- Firefox 下,只能使用 getAttribute()获取自定义属性
  - 解决方法:统一通过 getAttribute()获取自定义属性。
- IE 下,even 对象有 x,y 属性,但是没有 pageX,pageY 属性
- Firefox 下,event 对象有 pageX,pageY 属性,但是没有 x,y 属性

  - 解决方法：（条件注释）缺点是在 IE 浏览器下可能会增加额外的 HTTP 请求数。

### 常见的兼容性问题？

1. 不同浏览器的标签默认的 margin 和 padding 不一样。

   \*{margin:0;padding:0;}

2. IE6 双边距 bug：块属性标签 float 后，又有横行的 margin 情况下，在 IE6 显示 margin 比设置的大。hack：display:inline;将其转化为行内属性。

3. 渐进识别的方式，从总体中逐渐排除局部。首先，巧妙的使用“9”这一标记，将 IE 浏览器从所有情况中分离出来。接着，再次使用“+”将 IE8 和 IE7、IE6 分离开来，这样 IE8 已经独立识别。

   ```
   {
   background-color:#f1ee18;/*所有识别*/
   .background-color:#00deff\9; /*IE6、7、8识别*/
   +background-color:#a200ff;/*IE6、7识别*/
   _background-color:#1e0bd1;/*IE6识别*/
   }
   ```

4. 设置较小高度标签（一般小于 10px），在 IE6，IE7 中高度超出自己设置高度。hack：给超出高度的标签设置 overflow:hidden;或者设置行高 line-height 小于你设置的高度。

5. IE 下，可以使用获取常规属性的方法来获取自定义属性,也可以使用 getAttribute()获取自定义属性；Firefox 下，只能使用 getAttribute()获取自定义属性。解决方法:统一通过 getAttribute()获取自定义属性。

6. Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示,可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决。

7. 超链接访问过后 hover 样式就不出现了，被点击访问过的超链接样式不再具有 hover 和 active 了。解决方法是改变 CSS 属性的排列顺序:L-V-H-A ( love hate ): a:link {} a:visited {} a:hover {} a:active {}

### 切出兼容 4 个浏览器的页面 css hack， 不同浏览器的 css hack 怎么写 ？ 选择器的优先级

### 经常遇到的浏览器兼容性有哪些？ 原因、解决办法是什么？ 常用的 hack 技巧

### CSS hack 分类

<!-- TODO: -->

CSS hack 有三种表现形式，css 属性前缀法、选择器前缀法以及 ie 条件注释法（即头部引用 if ie）。实际项目中 css
hack 大部分是针对 ie 浏览器不同版本之间的表现差异而引入的。 1.属性前缀法：

例：ie6 能识别下划线“_”和星号“*”，ie7 能识别星号“*”（以上版本并不支持），但不能识别下划线“_”，ie6~ie10 都认识“\9”，但是其他浏览器不能支持 2.选择器前缀法（选择器 hack）
例：ie6 能识别*html
.class{},ie7 能识别*+html .class{} 或者\*:first-child+html .class{}; 3.ie 条件注释法：

针对所有 ie（ie10+已经不再支持条件注释）：<!--[if IE]>ie浏览器显示的内容<![endif]-->，针对 ie6 及以下版本：<!--[if lte IE
6]>只在ie6及以下显示的内容<![endif]-->.这类 hack 不仅针对 css 生效，对写在判断语句里面的所有代码都会生效。
