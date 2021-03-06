---
title: 基础
date: 2020-11-21
draft: true
---

### display 有哪些值？说明他们的作用。

- none 缺省值。象行内元素类型一样显示。此元素不会被显示。
- block 块类型。默认宽度为父元素宽度，可设置宽高，换行显示。此元素将显示为块级元素，此元素前后会带有换行符。
- inline 行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。默认。此元素会被显示为内联元素，元素前后没有换行符。
- inline-block 默认宽度为内容宽度，可以设置宽高，同行显示。行内块元素。（CSS2.1 新增的值）
- table 此元素会作为块级表格来显示。
- flex： 将对象作为弹性伸缩盒显示。
- inline-flex： 将对象作为内联块级弹性伸缩盒显示。
- inherit 规定应该从父元素继承 display 属性的值

### display:inline-block 什么时候会显示间隙？

1. 有空格时候会有间隙 解决：移除空格
2. margin 正值的时候 解决：margin 使用负值
3. 使用 font-size 时候 解决：font-size:0、letter-spacing、word-spacing

- 相邻的 inline-block 元素之间有换行或空格分隔的情况下会产生间距
- 非 inline-block 水平元素设置为 inline-block 也会有水平间距
- 可以借助 vertical-align:top; 消除垂直间隙
- 可以在父级加 font-size：0; 在子元素里设置需要的字体大小，消除垂直间隙
- 把 li 标签写到同一行可以消除垂直间隙，但代码可读性差

两个并列的 inline-block 中间会有一条裂缝，这个的原因是两个标签之间有空格，浏览器把这些空格当成文字中空格，所以这两个块中间多少有间隙。

- 移除空格
- 使用 margin 负值
- 使用 font-size:0
- letter-spacing
- word-spacing

### 图片下面有一个缝隙是因为什么

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/imgbottom.png)

因为 img 也相当于一个 inline 的元素， inline 就要遵守行高的构成，它会按照 base 基线对齐，基线对齐的话那么它就会和底线间有一个缝隙。

如何解决： 因为它会遵守文字对齐方案，那么就把图片的对齐方式修改为 `vertical-align: bottom`。或者让他`display: block`，这样图片虽然会换行，但是没有间隙了。

### display,float,position 的关系

1. 如果`display`为 none，那么 position 和 float 都不起作用，这种情况下元素不产生框
2. 否则，如果 position 值为 absolute 或者 fixed，框就是绝对定位的，float 的计算值为 none，display 根据下面的表格进行调整。
3. 否则，如果 float 不是 none，框是浮动的，display 根据下表进行调整
4. 否则，如果元素是根元素，display 根据下表进行调整
5. 其他情况下 display 的值为指定值

总结起来：**绝对定位、浮动、根元素都需要调整`display`**
