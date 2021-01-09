---
layout: CustomPages
title: 基础
date: 2020-11-21
aside: false
draft: true
---

### 对内联元素设置`padding-top`和`padding-bottom`是否会增加它的高度？

不会。对于行内元素，设置左右内边距，左右内边距将是可见的。而设置上下内边距，设置背景颜色后可以看见内边距区域有增加，对于行内非替换元素，不会影响其行高，不会撑开父元素。而对于替换元素，则撑开了父元素。

### padding 百分比是相对于父级宽度还是自身的宽度
