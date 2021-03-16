---
title: 基础
date: 2020-11-21
draft: true
---

## display

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

## position

### 说说你对页面中使用定位(position)的理解？

使用 css 布局 position 非常重要，语法如下：

position：static | relative | absolute | fixed | center | page | sticky
默认值：static，center、page、sticky 是 CSS3 中新增加的值。

1. static
   可以认为静态的，默认元素都是静态的定位，对象遵循常规流。
2. relative
   相对定位，对象遵循常规流，并且参照自身在常规流中的位置通过 top，right，bottom，left 这 4 个定位偏移属性进行偏移时不会影响常规流中的任何元素。
3. absolute
   a、绝对定位，对象脱离常规流，此时偏移属性参照的是离自身最近的定位祖先元素，如果没有定位的祖先元素，则一直回溯到 body 元素。盒子的偏移位置不影响常规流中的任何元素，其 margin 不与其他任何 margin 折叠。
   b、元素定位参考的是离自身最近的定位祖先元素，要满足两个条件，第一个是自己的祖先元素，可以是父元素也可以是父元素的父元素，一直找，如果没有则选择 body 为对照对象。第二个条件是要求祖先元素必须定位，通俗说就是 position 的属性值为非 static 都行。
4. fixed
   固定定位，与 absolute 一致，但偏移定位是以窗口为参考。当出现滚动条时，对象不会随着滚动。
5. center
   与 absolute 一致，但偏移定位是以定位祖先元素的中心点为参考。盒子在其包含容器垂直水平居中。（CSS3）
6. page
   与 absolute 一致。元素在分页媒体或者区域块内，元素的包含块始终是初始包含块，否则取决于每个 absolute 模式。（CSS3）
7. sticky
   对象在常态时遵循常规流。它就像是 relative 和 fixed 的合体，当在屏幕中时按常规流排版，当卷动到屏幕外时则表现如 fixed。该属性的表现是现实中你见到的吸附效果。（CSS3）
   盒位置根据正常流计算(这称为正常流动中的位置)，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位。在所有情况下（即便被定位元素为 `table` 时），该元素定位均不对后续元素造成影响。当元素 B 被粘性定位时，后续元素的位置仍按照 B 未定位时的位置来确定。`position: sticky` 对 `table` 元素的效果与 `position: relative` 相同。

### absolute 的 containing block(容器块)计算方式跟正常流有什么不同？

无论属于哪种，都要先找到其祖先元素中最近的 position 值不为 static 的元素，然后再判断：

1. 若此元素为 inline 元素，则 containing block 为能够包含这个元素生成的第一个和最后一个 inline box 的 padding box (除 margin, border 外的区域) 的最小矩形；
2. 否则,则由这个祖先元素的 padding box 构成。
   如果都找不到，则为 initial containing block。

补充：

- static(默认的)/relative：简单说就是它的父元素的内容框（即去掉 padding 的部分）
- absolute: 向上找最近的定位为 absolute/relative 的元素
- fixed: 它的 containing block 一律为根元素(html/body)，根元素也是 initial containing block

### position 跟 display、margin collapse、overflow、float 这些特性相互叠加后会怎么样？

- 如果元素的 display 为 none,那么元素不被渲染,position,float 不起作用,
- 如果元素拥有 position:absolute;或者 position:fixed;属性那么元素将为绝对定位,float 不起作用.
- 如果元素 float 属性不是 none,元素会脱离文档流,根据 float 属性值来显示.有浮动,绝对定位,inline-block 属性的元素,margin 不会和垂直方向上的其他元素 margin 折叠

### 如何确定一个元素的包含块(containing block)

1. 根元素的包含块叫做初始包含块，在连续媒体中他的尺寸与 viewport 相同并且 anchored at the canvas origin；对于 paged media，它的尺寸等于 page area。初始包含块的 direction 属性与根元素相同。
2. `position`为`relative`或者`static`的元素，它的包含块由最近的块级（`display`为`block`,`list-item`, `table`）祖先元素的**内容框**组成
3. 如果元素`position`为`fixed`。对于连续媒体，它的包含块为 viewport；对于 paged media，包含块为 page area
4. 如果元素`position`为`absolute`，它的包含块由祖先元素中最近一个`position`为`relative`,`absolute`或者`fixed`的元素产生，规则如下：

   - 如果祖先元素为行内元素，the containing block is the bounding box around the **padding boxes** of the first and the last inline boxes generated for that element.
   - 其他情况下包含块由祖先节点的**padding edge**组成

   如果找不到定位的祖先元素，包含块为**初始包含块**

### `position:absolute`和`float`属性的异同

- 共同点：对内联元素设置`float`和`absolute`属性，可以让元素脱离文档流，并且可以设置其宽高。
- 不同点：`float`仍会占据位置，`absolute`会覆盖文档流中的其他元素。

### position 的 absolute 与 fixed 共同点与不同点

A 共同点：

1. 改变行内元素的呈现方式，display 被置为 block；
2. 让元素脱离普通流，不占据空间；
3. 默认会覆盖到非定位元素上

B 不同点：

absolute 的”根元素“是可以设置的，而 fixed 的”根元素“固定为浏览器窗口。当你滚动网页，fixed 元素与浏览器窗口之间的距离是不变的。

### 什么情况下，用`translate()`而不用绝对定位？什么时候，情况相反。

`translate()`是`transform`的一个值。改变`transform`或`opacity`不会触发浏览器重新布局（reflow）或重绘（repaint），只会触发复合（compositions）。而改变绝对定位会触发重新布局，进而触发重绘和复合。`transform`使浏览器为元素创建一个 GPU 图层，但改变绝对定位会使用到 CPU。 因此`translate()`更高效，可以缩短平滑动画的绘制时间。

当使用`translate()`时，元素仍然占据其原始空间（有点像`position：relative`），这与改变绝对定位不同。

### position 的值， relative 和 absolute 分别是相对于谁进行定位的？

- `absolute` :生成绝对定位的元素， 相对于最近一级的 定位不是 static 的父元素来进行定位。
- `fixed` （老 IE 不支持）生成绝对定位的元素，通常相对于浏览器窗口或 frame 进行定位。
- `relative` 生成相对定位的元素，相对于其在普通流中的位置进行定位。
- `static` 默认值。没有定位，元素出现在正常的流中
- `sticky` 生成粘性定位的元素，容器的位置根据正常文档流计算得出

### 绝对定位和相对定位的区别？relative 和 absolute 有何区别

relative 会导致自身位置的相对变化，而不会影响其他元素的位置、大小。这是 relative 的要点之一.

absolute 元素脱离了文档结构。只要元素会脱离文档结构，它就会产生破坏性，导致父元素坍塌。

绝对定位是相对于最近的已经定位的祖先元素，没有则相对于 body，绝对定位脱离文档流，而相对定位是相对于元素在文档中的初始位置，并且
相对定位的元素仍然占据原有的空间。

绝对定位和相对定位相对的基准是 第一个非 static 的父元素。

### 请解释 relative、fixed、absolute 和 static 元素的区别

1. static（静态定位）：默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声明）。

2. relative（相对定位）：生成相对定位的元素，通过 top,bottom,left,right 的设置相对于其正常（原先本身）位置进行定位。可通过 z-index 进行层次分级。

3. absolute（绝对定位）：生成绝对定位的元素，相对于 static 定位以外的第一个父元素进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。可通过 z-index 进行层次分级。

4. fixed（固定定位）：生成绝对定位的元素，相对于浏览器窗口进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。可通过 z-index 进行层次分级。

### absolute 的 containing block 计算方式跟正常流有什么不同？

无论属于哪种，都要先找到其祖先元素中最近的 position 值不为 static 的元素，然后再判断：

1. 若此元素为 inline 元素，则 containing block 为能够包含这个元素生成的第一个和最后一个 inline box 的 padding box (除 margin, border 外的区域) 的最小矩形；
2. 否则,则由这个祖先元素的 padding box 构成。

如果都找不到，则为 initial containing block。

补充：

1. static(默认的)/relative：简单说就是它的父元素的内容框（即去掉 padding 的部分）
2. absolute: 向上找最近的定位为 absolute/relative 的元素
3. fixed: 它的 containing block 一律为根元素(html/body)

## padding

### 对内联元素设置`padding-top`和`padding-bottom`是否会增加它的高度？

不会。对于行内元素，设置左右内边距，左右内边距将是可见的。而设置上下内边距，设置背景颜色后可以看见内边距区域有增加，对于行内非替换元素，不会影响其行高，不会撑开父元素。而对于替换元素，则撑开了父元素。

### padding 百分比是相对于父级宽度还是自身的宽度
