---
layout: CustomPages
title: 基础
date: 2020-11-21
aside: false
draft: true
---

### CSS 单位

1. px 绝对单位。传统上一个像素对应于计算机屏幕上的一个点，而对于高清屏则对应更多。

2. % 父元素**宽度**的比例。

   1. 如果对 html 元素设置 font-size 为百分比值，则是以浏览器默认的字体大小 16px 为参照计算的（所有浏览器的默认字体大小都为 16px），如 62.5%即等于 10px（62.5% \* 16px = 10px）。

3. em 相对单位。 不同的属性有不同的参照值。

   1. 对于字体大小属性（font-size）来说，em 的计算方式是相对于父元素的字体大小
   2. border, width, height, padding, margin, line-height）在这些属性中，使用 em 单位的计算方式是参照该元素的 font-size，1em 等于该元素设置的字体大小。同理如果该元素没有设置，则一直向父级元素查找，直到找到，如果都没有设置大小，则使用浏览器默认的字体大小。

4. rem 是相对于根元素 html 的 font-size 来计算的，所以其参照物是固定的。

   1. 好处：rem 只需要修改 html 的 font-size 值即可达到全部的修改，即所谓的牵一发而动全身。

5. vw, vh, vmin, vmax 相对单位，是基于视窗大小（浏览器用来显示内容的区域大小）来计算的。
   1. vw：基于视窗的宽度计算，1vw 等于视窗宽度的百分之一
   2. vh：基于视窗的高度计算，1vh 等于视窗高度的百分之一
   3. vmin：基于 vw 和 vh 中的最小值来计算，1vmin 等于最小值的百分之一
   4. vmax：基于 vw 和 vh 中的最大值来计算，1vmax 等于最大值的百分之一

em 相对于父元素，rem 相对于根元素。

### 设置`p`的`font-size:10rem`，当用户重置或拖曳浏览器窗口时，文本大小是否会也随着变化？

A: 不会。

`rem`是以`html`根元素中`font-size`的大小为基准的相对度量单位，文本的大小不会随着窗口的大小改变而改变。

### px rem vw 的区别

1. 说一说在移动端布局里的 vw 方法
2. 移动端点击延迟处理

### em vs rem

### px/em/rem 的区别

#### px 在缩放页面时无法调整那些使用它作为单位的字体、按钮等的大小，是相对于显示屏幕分辨率而言的

> 这是一个不取决于平台的、跨浏览器的准确设置字体大小高度为你所想的像素大小的方法

##### 特点：

- IE 无法调整那些使用 px 作为单位的字体大小

#### em 的值并不是固定的，会继承父级元素的字体大小，代表倍数；

> 但是由于 em 是相对于其父级字体的倍数的，当出现有多重嵌套内容时，使用 em 分别给它们设置字体的大小往往要重新计算

##### 特点：

- em 的值并不是固定的
- em 会继承父级元素的字体大小

#### rem 的值并不是固定的，始终是基于根元素 的，也代表倍数。

> 为了兼容不支持 rem 的浏览器，我们需要在各个使用了 rem 地方前面写上对应的 px 值，这样不支持的浏览器可以优雅降级

##### 特点：

- 即可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应

### 谈谈你对 CSS 中刻度的认识

在 CSS 中刻度是用于设置元素尺寸的单位。
a、特殊值 0 可以省略单位。例如：margin:0px 可以写成 margin:0
b、一些属性可能允许有负长度值，或者有一定的范围限制。如果不支持负长度值，那应该变换到能够被支持的最近的一个长度值。
c、长度单位包括：相对单位和绝对单位。

- 相对长度单位有： em, ex, ch, rem, vw, vh, vmax, vmin
- 绝对长度单位有： cm, mm, q, in, pt, pc, px
- 绝对长度单位：1in = 2.54cm = 25.4 mm = 72pt = 6pc = 96px
- 文本相对长度单位：em
  相对长度单位是相对于当前对象内文本的字体尺寸，如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。(相对父元素的字体大小倍数)

body { font-size: 14px; }
h1 { font-size: 16px; }
.size1 p { font-size: 1em; }
.size2 p { font-size: 2em; }
.size3 p { font-size: 3em; }
文本相对长度单位：rem
rem 是 CSS3 新增的一个相对单位（root em，根 em），相对于根元素(即 html 元素)font-size 计算值的倍数
只相对于根元素的大小
浏览器的默认字体大小为 16 像素，浏览器默认样式也称为 user agent stylesheet，就是所有浏览器内置的默认样式，多数是可以被修改的，但 chrome 不能直接修改，可以被用户样式覆盖。

### 请你说说 em 与 rem 的区别？

#### rem

rem 是 CSS3 新增的一个相对单位（root em，根 em），相对于根元素(即 html 元素)font-size 计算值的倍数只相对于根元素的大小

rem（font size of the root element）是指相对于根元素的字体大小的单位。简单的说它就是一个相对单位。
作用：利用 rem 可以实现简单的响应式布局，可以利用 html 元素中字体的大小与屏幕间的比值设置 font-size 的值实现当屏幕分辨率变化时让元素也变化，以前的天猫 tmall 就使用这种办法

#### em

文本相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸(默认 16px)。(相对父元素的字体大小倍数)
em（font size of the element）是指相对于父元素的字体大小的单位。它与 rem 之间其实很相似，区别在。（相对是的 HTML 元素的字体大，默认 16px）
em 与 rem 的重要区别： 它们计算的规则一个是依赖父元素另一个是依赖根元素计算

### 在 CSS 样式中常使用 px、em 在表现上有什么区别？

- px 相对于显示器屏幕分辨率，无法用浏览器字体放大功能
- em 值并不是固定的，会继承父级的字体大小： em = 像素值 / 父级 font-size

### px 和 em 的区别。

px 和 em 都是长度单位，区别是，px 的值是固定的，指定是多少就是多少，计算比较容易。em 得值不是固定的，并且 em 会继承父级元素的字体大小。

浏览器的默认字体高都是 16px。所以未经调整的浏览器都符合: 1em=16px。那么 12px=0.75em, 10px=0.625em。

### rem 和 em 的区别

### CSS 中的长度单位（px,pt,rem,em,ex,vw,vh,vh,vmin,vmax）

在 CSS 样式中常使用 px、em，各有什么优劣，在表现上有什么区别？

- px 是相对长度单位，相对于显示器屏幕分辨率而言的。
- em 是相对长度单位，相对于当前对象内文本的字体尺寸。
- px 定义的字体，无法用浏览器字体放大功能。
- em 的值并不是固定的，会继承父级元素的字体大小，1 ÷ 父元素的 font-size × 需要转换的像素值 = em
  值。

### 说一说 px rem vw 等不同单位的含义，以及适用的场景，有什么不同，优缺点等。

### 你对 line-height 是如何理解的？

- line-height 指一行字的高度，包含了字间距，实际上是下一行基线到上一行基线距离
- 如果一个标签没有定义 height 属性，那么其最终表现的高度是由 line-height 决定的
- 一个容器没有设置高度，那么撑开容器高度的是 line-height 而不是容器内的文字内容
- 把 line-height 值设置为 height 一样大小的值可以实现单行文字的垂直居中
- line-height 和 height 都能撑开一个高度，height 会触发 haslayout（一个低版本 IE 的东西），而 line-height 不会

### line-height 三种赋值方式有何区别？（带单位、纯数字、百分比）

- 带单位：px 是固定值，而 em 会参考父元素 font-size 值计算自身的行高
- 纯数字：会把比例传递给后代。例如，父级行高为 1.5，子元素字体为 18px，则子元素行高为 1.5 \* 18 = 27px
- 百分比：将计算后的值传递给后代

#### CSS:line-height:150%与 line-height:1.5 的真正区别是什么？

代码：

<div style="line-height:150%;font-size:16px;">
    父元素内容
    <div style="font-size:30px;">
          Web前端开发<br />
          line-height行高问题
    </div>
</div>

![img](https://pic3.zhimg.com/50/cd8d76c78e80e3183a1c241dfb39f2c5_hd.jpg)![img](https://pic3.zhimg.com/80/cd8d76c78e80e3183a1c241dfb39f2c5_hd.jpg)

下图是当 line-height:1.5em 的效果，父元素的行高为 150%时，会根据父元素的字体大小先计算出行高值然后再让子元素继承。所以当 line-height:1.5em 时，子元素的行高等于 16px \* 1.5em = 24px：

![img](https://pic3.zhimg.com/50/cd8d76c78e80e3183a1c241dfb39f2c5_hd.jpg)![img](https://pic3.zhimg.com/80/cd8d76c78e80e3183a1c241dfb39f2c5_hd.jpg)

下图是当 line-height:1.5 的效果，父元素行高为 1.5 时，会根据子元素的字体大小动态计算出行高值让子元素继承。所以，当 line-height:1.5 时，子元素行高等于 30px \* 1.5 = 45px：

![img](https://pic2.zhimg.com/50/1a56e5fabcf173ae074e0f4ed9e61e3c_hd.jpg)![img](https://pic2.zhimg.com/80/1a56e5fabcf173ae074e0f4ed9e61e3c_hd.jpg)

### 怎么让 Chrome 支持小于 12px 的文字？

```css
.shrink {
  /* 0.8是缩放比例 */
  -webkit-transform: scale(0.8);
  -o-transform: scale(1);
  display: inline-block;
}
```

#### 如何批量添加阿里巴巴图标 iconfont

打开控制台 输入如下代码，其实就是触发点击事件，可以一次性选择当前页面所有的图标

```js
var span = document.querySelectorAll('.icon-cover');

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() - start < delay) {
    continue;
  }
}

for (var i = 0, len = span.length, j = 1; i < len; i++, j++) {
  span[i].querySelector('span').click();
  console.log(i);
  if (j === 20) {
    var buttonGroup = document.querySelectorAll('.car-manage-bottom');
    buttonGroup[1].children[0].click();

    var deleteBtn = document.querySelectorAll('.top-btn-wrap');
    deleteBtn[0].click();
    // break;
    j = 0;
    sleep(1000);
  }
}
```

### vw 与 % 的区别

% 是相对于父容器的，而 vw 可以固定基数，只要窗口大小不变，就是固定的。而 rem 则需要手动设置 根组件（html 标签的 font-size 大小）反正本来也是要设置的，自适应的实现是使用一个 能够 window 窗口大小的 js 脚本来改变 font-size 的大小，从而实现以 rem 为单位的元素的自适应大小。感觉这是 vw 比 rem 好的一个地方，不用手动设置。

### vw 使用过程中存在的一些问题

转化为 px 之后，0.9 px 和 1.1px 浏览器会不会表现为一样？ 所以很多时候不能导致刚刚好？https://blog.csdn.net/haibin_hu/article/details/51798815?locationNum=4

<https://www.jianshu.com/p/1a9b5d48afa2>

<https://blog.csdn.net/huangm_fat/article/details/80090245>
<https://www.cnblogs.com/wuguoyuan/p/rem.html>

- em vw rem 布局
  - rem 是相对于根标签的 字体大小来进行缩放，所以自适应的话，需要动态设定根标签的 font-size
