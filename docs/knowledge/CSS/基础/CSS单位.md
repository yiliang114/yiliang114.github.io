---
title: 基础
date: 2020-11-21
draft: true
---

### CSS 单位

1. px 绝对单位。传统上一个像素对应于计算机屏幕上的一个点

2. % 父元素**宽度**的比例。

   1. 如果对 html 元素设置 font-size 为百分比值，则是以浏览器默认的字体大小 16px 为参照计算的（所有浏览器的默认字体大小都为 16px），如 62.5%即等于 10px（62.5% \* 16px = 10px）。

3. em 相对单位。 不同的属性有不同的参照值。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸(默认 16px)。(相对父元素的字体大小倍数)

   1. em 会继承父元素的字体大小 ？
   2. 对于字体大小属性（font-size）来说，em 的计算方式是相对于父元素的字体大小.
   3. border, width, height, padding, margin, line-height）在这些属性中，使用 em 单位的计算方式是参照该元素的 font-size，1em 等于该元素设置的字体大小。同理如果该元素没有设置，则一直向父级元素查找，直到找到，如果都没有设置大小，则使用浏览器默认的字体大小。
   4. 所以未经调整的浏览器都符合: 1em=16px。那么 12px=0.75em, 10px=0.625em。

4. rem 是相对于根元素 html 的 font-size 来计算的，所以其参照物是固定的。利用 rem 可以实现简单的响应式布局。

   1. 好处：rem 只需要修改 html 的 font-size 值即可达到全部的修改，即所谓的牵一发而动全身。
   2. 缺点：兼容性不够好，为了兼容不支持 rem 的浏览器，我们需要在各个使用了 rem 地方前面写上对应的 px 值，这样不支持的浏览器可以优雅降级

5. vw, vh 相对单位，是基于视窗大小（浏览器用来显示内容的区域大小）来计算的。
   1. vw：基于视窗的宽度计算，1vw 等于视窗宽度的百分之一
   2. vh：基于视窗的高度计算，1vh 等于视窗高度的百分之一

em 相对于父元素，rem 相对于根元素。

### 怎么让 Chrome 支持小于 12px 的文字？

```css
.shrink {
  /* 0.8是缩放比例 */
  -webkit-transform: scale(0.8);
  -o-transform: scale(1);
  display: inline-block;
}
```

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

```html
<div style="line-height:150%;font-size:16px;">
  父元素内容
  <div style="font-size:30px;">
    Web前端开发<br />
    line-height行高问题
  </div>
</div>
```

![img](https://pic3.zhimg.com/50/cd8d76c78e80e3183a1c241dfb39f2c5_hd.jpg)![img](https://pic3.zhimg.com/80/cd8d76c78e80e3183a1c241dfb39f2c5_hd.jpg)

下图是当 line-height:1.5em 的效果，父元素的行高为 150%时，会根据父元素的字体大小先计算出行高值然后再让子元素继承。所以当 line-height:1.5em 时，子元素的行高等于 16px \* 1.5em = 24px：

![img](https://pic3.zhimg.com/50/cd8d76c78e80e3183a1c241dfb39f2c5_hd.jpg)![img](https://pic3.zhimg.com/80/cd8d76c78e80e3183a1c241dfb39f2c5_hd.jpg)

下图是当 line-height:1.5 的效果，父元素行高为 1.5 时，会根据子元素的字体大小动态计算出行高值让子元素继承。所以，当 line-height:1.5 时，子元素行高等于 30px \* 1.5 = 45px：

![img](https://pic2.zhimg.com/50/1a56e5fabcf173ae074e0f4ed9e61e3c_hd.jpg)![img](https://pic2.zhimg.com/80/1a56e5fabcf173ae074e0f4ed9e61e3c_hd.jpg)
