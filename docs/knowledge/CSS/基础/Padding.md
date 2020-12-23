---
layout: CustomPages
title: 基础
date: 2020-11-21
aside: false
draft: true
---

### 对内联元素设置`padding-top`和`padding-bottom`是否会增加它的高度？

A: 答案是不会。同上题比较纠结，不太明白这里的 dimensions 指的是到底是什么意思？放置一边，咱们来分析下。对于行内元素，设置左右内边距，左右内边距将是可见的。而设置上下内边距，设置背景颜色后可以看见内边距区域有增加，对于行内非替换元素，不会影响其行高，不会撑开父元素。而对于替换元素，则撑开了父元素。看下 demo，更好的理解下：

<http://codepen.io/paddingme/pen/CnFpa>

### padding 百分比是相对于父级宽度还是自身的宽度

### margin 和 padding 使用的场景有哪些？

https://github.com/haizlin/fe-interview/issues/220
