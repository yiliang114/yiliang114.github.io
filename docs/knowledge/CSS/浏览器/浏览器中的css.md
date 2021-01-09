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

### CSS 的解析顺序

css 选择器匹配元素是逆向解析

- 因为所有样式规则可能数量很大，而且绝大多数不会匹配到当前的 DOM 元素（因为数量很大所以一般会建立规则索引树），所以有一个快速的方法来判断「这个 selector 不匹配当前元素」就是极其重要的。
- 如果正向解析，例如「div div p em」，我们首先就要检查当前元素到 html 的整条路径，找到最上层的 div，再往下找，如果遇到不匹配就必须回到最上层那个 div，往下再去匹配选择器中的第一个 div，回溯若干次才能确定匹配与否，效率很低。
- 逆向匹配则不同，如果当前的 DOM 元素是 div，而不是 selector 最后的 em，那只要一步就能排除。只有在匹配时，才会不断向上找父节点进行验证

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

### 什么是视差滚动效果，如何给每页做不同的动画？

- 视差滚动是指多层背景以不同的速度移动，形成立体的运动效果，具有非常出色的视觉体验
- 一般把网页解剖为：背景层、内容层和悬浮层。当滚动鼠标滚轮时，各图层以不同速度移动，形成视差的

- 实现原理
  - 以 “页面滚动条” 作为 “视差动画进度条”
  - 以 “滚轮刻度” 当作 “动画帧度” 去播放动画的
  - 监听 mousewheel 事件，事件被触发即播放动画，实现“翻页”效果

### 如何修改 Chrome 记住密码后自动填充表单的黄色背景？

- 产生原因：由于 Chrome 默认会给自动填充的 input 表单加上 input:-webkit-autofill 私有属性造成的
- 解决方案 1：在 form 标签上直接关闭了表单的自动填充：autocomplete="off"
- 解决方案 2：input:-webkit-autofill { background-color: transparent; }

```css
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  background-color: rgb(250, 255, 189); /* #FAFFBD; */
  background-image: none;
  color: rgb(0, 0, 0);
}
```

### rgba() 和 opacity 的透明效果有什么不同？

- opacity 作用于元素以及元素内的所有内容（包括文字）的透明度
- rgba() 只作用于元素自身的颜色或其背景色，子元素不会继承透明效果

### css 属性 content 有什么作用？

- content 属性专门应用在 before/after 伪元素上，用于插入额外内容或样式

### 元素竖向的百分比设定是相对于容器的高度吗？

当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，但是，对于一些表示竖向距离的属性，例如 padding-top , padding-bottom , margin-top , margin-bottom 等，当按百分比设定它们时，依据的也是父容器的宽度，而不是高度。

- 元素竖向的百分比设定是相对于容器的宽度，而不是高度

### input [type=search] 搜索框右侧小图标如何美化？

```css
input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
  height: 15px;
  width: 15px;
  border-radius: 8px;
  background: url('images/searchicon.png') no-repeat 0 0;
  background-size: 15px 15px;
}
```

### 网站图片文件，如何点击下载？而非点击预览？

`<a href="logo.jpg" download>下载</a>`
`<a href="logo.jpg" download="网站LOGO" >下载</a>`

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

### CSS 样式表根据所在网页的位置，可分为哪几种样式表？

行内样式表，内嵌样式表，外部样式表

### overflow: scroll 时不能平滑滚动的问题怎么处理？

- 监听滚轮事件，然后滚动到一定距离时用 jquery 的 animate 实现平滑效果。

### 有个场景：国家发生灾难后，需要将该页面做成灰白色，如何实现？

### css 模块化是什么？

css 模块化就是所有的类名都只有局部作用域的 css 文件。

> 好处
> css 模块化将作用域限制于组件中，从而避免了全局作用域的问题，编译过程还能帮你完成命名。

> css 模块化的解决方案
> 目前解决方案有两种:
> 第一，彻底抛弃 css,使用 js 或 json 来写样式，例如：[Radium](https://github.com/FormidableLabs/radium)，[jsxstyle](https://github.com/smyte/jsxstyle)，[react-style](https://github.com/js-next/react-style) 属于这一类。
> 第二, 依旧使用旧的 css,使用 js 来管理样式依赖，代表是[css-modules](https://github.com/css-modules/css-modules)

### 抽离样式模块怎么写，说出思路？

CSS 可以拆分成 2 部分：公共 CSS 和 业务 CSS：

- 网站的配色，字体，交互提取出为公共 CSS。这部分 CSS 命名不应涉及具体的业务
- 对于业务 CSS，需要有统一的命名，使用公用的前缀。可以参考面向对象的 CSS

### 通过 html img 标签设置图片和通过 div 背景图设置图片，两种设置图片的方式有什么优劣？

- 占位符
  `<img>` 标签定义 HTML 页面中的图像。从技术上讲，图片并不会插入 HTML 页面中，而是链接到 HTML 页面上。img 标签的作用是为被引用的图像创建占位符。

  background-image 作为背景，在图片没有加载的时候或者加载失败的时候，不会有图片的占位标记，不会出现红叉。

- 加载时间
  `img`是写在 HTML 里的是以 HTML 插入 img 标签的形式存在，CSS 图片背景是等结构加载完成后再去加载的。
- 是否为内容
  非内容的图片写在 css 里，内容的图片就写在 HTML 里。

### 你会使用哪些技术和处理方法？

功能限制的浏览器，比如 IE 低版本、手机浏览器、奇葩国内浏览器，会在很多功能上不符合 Web 标准，而应对的方式有这么几种：

- 只提供符合 Web 标准的页面；
- 提供另一个符合那些浏览器标准的页面(例如说移动端一套 css,电脑端一套 css);
- 兼容：这里有两种思路，一个是渐进增强，一个优雅降级。
  渐进增强的思路就是提供一个可用的原型，后来再为高级浏览器提供优化。优雅降级的思路是根据高级浏览器提供一个版本，然后有功能限制的浏览器只需要一个刚好能用的版本。当然，工作中的标准都是尽量满足设计，如果不能满足的话就尽量贴近，不得已（性能之类的问题）才会砍掉某个浏览器版本上的需求。

相关技术:

- Media Query
- CSS hack
- 条件判断 `<!--[if !IE]><!-->除IE外都可识别 <!--<![endif]-->`

### `screen`关键词是指设备物理屏幕的大小还是指浏览器的视窗？

```css
@media only screen and (max-width: 1024px) {
  margin: 0;
}
```

浏览器视窗

### `only` 选择器的作用是？

```css
@media only screen and (max-width: 1024px) {
  argin: 0;
}
```

停止旧版本浏览器解析选择器的其余部分。

only 用来定某种特定的媒体类型，可以用来排除不支持媒体查询的浏览器。其实 only 很多时候是用来对那些不支持 Media Query 但却支持 Media Type 的设备隐藏样式表的。其主要有：支持媒体特性（Media Queries）的设备，正常调用样式，此时就当 only 不存在；对于不支持媒体特性(Media Queries)但又支持媒体类型(Media Type)的设备，这样就会不读了样式，因为其先读 only 而不是 screen；另外不支持 Media Qqueries 的浏览器，不论是否支持 only，样式都不会被采用。

### 网站图片文件，如何点击下载？而非点击预览？

```html
<a href="logo.jpg" download>下载</a> <a href="logo.jpg" download="网站LOGO">下载</a>
```

### 如何优化网页的打印样式

```html
<link rel="stylesheet" type="text/css" media="screen" href="xxx.css" />
```

其中 media 指定的属性就是设备，显示器上就是 screen，打印机则是 print，电视是 tv，投影仪是 projection。

```html
<link rel="stylesheet" type="text/css" media="print" href="yy
```

但打印样式表也应有些注意事项：

- 打印样式表中最好不要用背景图片，因为打印机不能打印 CSS 中的背景。如要显示图片，请使用 html 插入到页面中。
- 最好不要使用像素作为单位，因为打印样式表要打印出来的会是实物，所以建议使用 pt 和 cm。
- 隐藏掉不必要的内容。（@print div{display:none;}）
- 打印样式表中最好少用浮动属性，因为它们会消失。

### 如何为功能受限的浏览器提供页面？ 使用什么样的技术和流程？

- 优雅的降级：为现代浏览器构建应用，同时确保它在旧版浏览器中正常运行。
- 渐进式增强：构建基于用户体验的应用，但在浏览器支持时添加新增功能。
- 利用 [caniuse.com](https://caniuse.com/) 检查特性支持。
- 使用 `autoprefixer` 自动生成 CSS 属性前缀。
- 使用 [Modernizr](https://modernizr.com/)进行特性检测。

### 除了`screen`，你还能说出一个 @media 属性的例子吗？

### 如何实现一个使用非标准字体的网页设计？

使用`@font-face`并为不同的`font-weight`定义`font-family`。

### 请解释浏览器是如何判断元素是否匹配某个 CSS 选择器？

浏览器先产生一个元素集合，这个集合往往由最后一个部分的索引产生（如果没有索引就是所有元素的集合）。然后向上匹配，如果不符合上一个部分，就把元素从集合中删除，直到真个选择器都匹配完，还在集合中的元素就匹配这个选择器了。

### css module

通常需要在 webpack 配置中进行设置。

https://segmentfault.com/a/1190000010301977

### cursor: pointer

cursor 规则是设定网页浏览时用户鼠标指针的样式，也就是鼠标的图形形状
cursor：pointer 设定鼠标的形状为一只伸出食指的手，这也是绝大多数浏览器里面鼠标停留在网页链接上方时候的样式
另外可以选择其他鼠标指针样式，常用的有 default 箭头，crosshair 十字，progress 箭头和沙漏等等

### css sprite 是什么,有什么优缺点

概念：将多个小图片拼接到一个图片中。通过 background-position 和元素尺寸调节需要显示的背景图案。

优点：

1. 减少 HTTP 请求数，极大地提高页面加载速度
2. 增加图片信息重复度，提高压缩比，减少图片大小
3. 更换风格方便，只需在一张或几张图片上修改颜色或样式即可实现

缺点：

1. 图片合并麻烦
2. 维护麻烦，修改一个图片可能需要从新布局整个图片，样式

### 超链接访问过后 hover 样式就不出现的问题是什么？如何解决？

答案：被点击访问过的超链接样式不在具有 hover 和 active 了,解决方法是改变 CSS 属性的排列顺序: L-V-H-A（link,visited,hover,active）

### 有哪项方式可以对一个 DOM 设置它的 CSS 样式？

外部样式表，引入一个外部 css 文件
内部样式表，将 css 代码放在 <head> 标签内部
内联样式，将 css 样式直接定义在 HTML 元素内部

### css 样式表置顶

经样式表（css）放在网页的 head 这种会让网页的加载速度更快，因为这样做可以使浏览器逐步加载已经下载的网页内容。这对内容比较多的网页尤其重要，用户不用一直等待在一个白屏上而是可以先看已经下载的内容。如果将样式表放在底部，浏览器会拒绝渲染已经下载的网页，因为大多数浏览器在实现时都努力避免重绘，样式表中的内容是绘制网页的关键信息，没有下载下来之前只好对不起观众了。

### CSS 的加载是异步的吗？表现在什么地方？

### css 中属性的浏览器前缀一般都是如何进行处理的？

通过 padding-bottom 或者 padding-top 实现等比缩放响应式图片:

```css
.img-container {
    position: relative;
    padding-bottom: 20%;
    height: 0;
    overflow: hidden;
    background: red;
}
.img-container img {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
}
<div class="img-container">
    <img src="images/o_1.jpg" alt="" />
</div>

```

我理解实现方法解释如下：

1. 设置父元素 div.img-containe 的高度为 0，设置 padding-bottom 的值为图片的宽高百分比。
2. 与子元素 img 相对父元素绝对定位，然后高度，宽度为百分之百，自然而然图片的实际宽高是 padding-bottom 的值乘以父元素的实际宽度，从而实现等比缩放响应式图片。

实现原理：让子元素宽高比例与父元素相同

### 如何实现一个矩形的椭圆边角（使用 border-radius:a/b）

### offsetHeight, scrollHeight, clientHeight 分别代表什么

### 只有块级元素才能定义宽度和高度

### 什么操作会引起浏览器对 css 进行重绘. css repaint 机制

### 文档流的概念,定位的理解以之 z-index 计算规则 & 浏览器差异性

### 实现三个 DIV 等分排布在一行(考察 border-box

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

### 浏览器解析 CSS

`.wrapper div > p` CSS 中，浏览器查找元素是通过选择权从后往前找的， 这样做的目的是加快 CSS 解析速度，从后往前，排除法

[浏览器解析 css 选择器的规则](https://blog.csdn.net/qq_21397815/article/details/72874932)

### 怎样美化一个 checkbox ?

- 让原本的勾选框隐藏
- `input + label` 背景图没选中
- `input:checked + label` 背景图选中

```css
.checkbox input {
  display: none;
}
.checkbox input + label {
  background: url(./没选中.png) left center no-repeat;
  background-size: 20px 20px;
  padding-left: 20px;
}
.checkbox input:checked + label {
  background-image: url(./选中.png);
}
```

```html
<div class="checkbox">
  <input type="checkbox" id="handsome" />
  <label for="handsome">我很帅</label>
</div>
```

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

### 利用伪元素画三角

.info-tab {
position: relative;
}
.info-tab::after {
content: '';
border: 4px solid transparent;
border-top-color: #2c8ac2;
position: absolute;
top: 0;
}
已知父级盒子的宽高，子级 img 宽高未知，想让 img 铺满父级盒子且图片不能变形

需要用到 css 的 object-fit 属性

div {
width: 200px;
height: 200px;
}
img {
object-fit: cover;
width: 100%;
height: 100%;
}
MDN

### iframe 的作用

iframe 是用来在网页中插入第三方页面，早期的页面使用 iframe 主要是用于导航栏这种很多页面都相同的部分，这样在切换页面的时候避免重复下载。

优点 1. 便于修改，模拟分离，像一些信息管理系统会用到。2. 但现在基本不推荐使用。除非特殊需要，一般不推荐使用。

缺点 1. iframe 的创建比一般的 DOM 元素慢了 1-2 个数量级 2. iframe 标签会阻塞页面的的加载，如果页面的 onload 事件不能及时触发，会让用户觉得网页加载很慢，用户体验不好，在 Safari 和 Chrome 中可以通过 js 动态设置 iframe 的 src 属性来避免阻塞。3. iframe 对于 SEO 不友好，替换方案一般就是动态语言的 Incude 机制和 ajax 动态填充内容等。

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

答案：

垂直方向：line-height

水平方向：letter-spacing

那么问题来了，关于 letter-spacing 的妙用知道有哪些么？

答案:可以用于消除 inline-block 元素间的换行符空格间隙问题。

### 浏览器的滚动条

https://www.jianshu.com/p/5e51b3ce27c4
