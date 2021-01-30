---
title: 浏览器
date: 2020-11-21
draft: true
---

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

### 浏览器是怎样解析 CSS 选择器的？

按照从上到下，从右到左的顺序解析 .list a {color:blue;} 先解析到 a 标签，并将页面上所有 a 标签的字体颜色都按照 color:red 进行渲染（蓝色），再解析到 .list ，将页面上所有 .list 类目下的 a 标签的字体渲染成蓝色。

- 样式系统从关键选择器开始匹配，然后左移查找规则选择器的祖先元素
- 只要选择器的子树一直在工作，样式系统就会持续左移，直到和规则匹配，或者是因为不匹配而放弃该规则
- 浏览器解析 CSS 选择器的方式是从右到左

### 超链接访问过后 hover 样式就不出现了。

被点击访问过的超链接样式不在具有 hover 和 active 了解决方法是改变 CSS 属性的排列顺序:

- `L-V-H-A : a:link {} a:visited {} a:hover {} a:active {}`

### 全屏滚动的原理是什么？ 用到了 CSS 的那些属性？

原理：有点类似于轮播，整体的元素一直排列下去，假设有 5 个需要展示的全屏页面，那么高度是 500%，只是展示 100%，剩下的可以通过 transform 进行 y 轴定位，也可以通过 margin-top 实现

- 原理类似图片轮播原理，超出隐藏部分，滚动时显示
- 可能用到的 CSS 属性：overflow:hidden; transform:translate(100%, 100%); display:none;

### 抽离样式模块怎么写，说出思路？

- CSS 可以拆分成 2 部分：公共 CSS 和 业务 CSS：
  - 网站的配色，字体，交互提取出为公共 CSS。这部分 CSS 命名不应涉及具体的业务
  - 对于业务 CSS，需要有统一的命名，使用公用的前缀。可以参考面向对象的 CSS

### rgba() 和 opacity 的透明效果有什么不同？

- opacity 作用于元素以及元素内的所有内容（包括文字）的透明度
- rgba() 只作用于元素自身的颜色或其背景色，子元素不会继承透明效果

### css 属性 content 有什么作用？

- content 属性专门应用在 before/after 伪元素上，用于插入额外内容或样式

### 元素竖向的百分比设定是相对于容器的高度吗？

当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，但是，对于一些表示竖向距离的属性，例如 padding-top , padding-bottom , margin-top , margin-bottom 等，当按百分比设定它们时，依据的也是父容器的宽度，而不是高度。

- 元素竖向的百分比设定是相对于容器的宽度，而不是高度

### 解释浏览器如何确定哪些元素与 CSS 选择器匹配。

这部分与上面关于编写高效的 CSS 有关。浏览器从最右边的选择器（关键选择器）根据关键选择器，浏览器从 DOM 中筛选出元素，然后向上遍历被选元素的父元素，判断是否匹配。选择器匹配语句链越短，浏览器的匹配速度越快。

例如，对于形如 p span 的选择器，浏览器首先找到所有<span>元素，并遍历它的父元素直到根元素以找到<p>元素。对于特定的<span>，只要找到一个<p>，就知道'`已经匹配并停止继续匹配。

### CSS 有哪些继承属性

关于文字排版的属性如：

- font
- word-break
- letter-spacing
- text-align
- text-rendering
- word-spacing
- white-space
- text-indent
- text-transform
- text-shadow
- line-height
- color
- visibility
- cursor

### overflow: scroll 时不能平滑滚动的问题怎么处理？

- 监听滚轮事件，然后滚动到一定距离时用 jquery 的 animate 实现平滑效果。

### 有个场景：国家发生灾难后，需要将该页面做成灰白色，如何实现？

### css 模块化是什么？

css 模块化就是所有的类名都只有局部作用域的 css 文件。

好处
css 模块化将作用域限制于组件中，从而避免了全局作用域的问题，编译过程还能帮你完成命名。
css 模块化的解决方案
目前解决方案有两种:

第一，彻底抛弃 css,使用 js 或 json 来写样式，例如：[Radium](https://github.com/FormidableLabs/radium)，[jsxstyle](https://github.com/smyte/jsxstyle)，[react-style](https://github.com/js-next/react-style) 属于这一类。
第二, 依旧使用旧的 css,使用 js 来管理样式依赖，代表是[css-modules](https://github.com/css-modules/css-modules)

### 通过 html img 标签设置图片和通过 div 背景图设置图片，两种设置图片的方式有什么优劣？

- 占位符
  `<img>` 标签定义 HTML 页面中的图像。从技术上讲，图片并不会插入 HTML 页面中，而是链接到 HTML 页面上。img 标签的作用是为被引用的图像创建占位符。

  background-image 作为背景，在图片没有加载的时候或者加载失败的时候，不会有图片的占位标记，不会出现红叉。

- 加载时间
  `img`是写在 HTML 里的是以 HTML 插入 img 标签的形式存在，CSS 图片背景是等结构加载完成后再去加载的。
- 是否为内容
  非内容的图片写在 css 里，内容的图片就写在 HTML 里。

### cursor: pointer

cursor 规则是设定网页浏览时用户鼠标指针的样式，也就是鼠标的图形形状
cursor：pointer 设定鼠标的形状为一只伸出食指的手，这也是绝大多数浏览器里面鼠标停留在网页链接上方时候的样式
另外可以选择其他鼠标指针样式，常用的有 default 箭头，crosshair 十字，progress 箭头和沙漏等等

### iconfont 原理

- 利用编码让图标编为一个字符
- 引入字体
- 利用 before 伪元素向页面中插入一个文字

### css 定义的权重

- !important 优先级最高，但也会被权重高的 important 所覆盖
- 行内样式总会覆盖外部样式表的任何样式(除了!important)
- 单独使用一个选择器的时候，不能跨等级使 css 规则生效
- 如果两个权重不同的选择器作用在同一元素上，权重值高的 css 规则生效
- 如果两个相同权重的选择器作用在同一元素上：以后面出现的选择器为最后规则
- 权重相同时，与元素距离近的选择器生

一句话总结：
!important > 行内样式 > ID 选择器 > (类选择器 | 属性选择器 | 伪类选择器 ) > 元素选择器 > \*
![大鱼吃小鱼](http://image.zhangxinxu.com/image/blog/201208/specifishity1-1.png)

### 文本超出部分显示省略号

单行

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

多行

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3; // 最多显示几行
overflow: hidden;
```

### 浏览器是如何解析 css 选择器的

最终两个 div 中的字都是蓝色的，这跟 css 解析的顺序有关系。

```
<div class="red blue">123</div>
<div class="blue red">123</div>
.red {
    color: red
}

.blue {
    color: blue
}
```

### css 中可以让文字在垂直和水平方向上重叠的两个属性是什么？

垂直方向：line-height
水平方向：letter-spacing

那么问题来了，关于 letter-spacing 的妙用知道有哪些么？

答案:可以用于消除 inline-block 元素间的换行符空格间隙问题。
