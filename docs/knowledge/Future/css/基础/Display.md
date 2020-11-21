---
layout: CustomPages
title: 基础
date: 2020-11-21
aside: false
draft: true
---

### 绝对定位和相对定位的区别？

绝对定位是相对于最近的已经定位的祖先元素，没有则相对于 body，绝对定位脱离文档流，而相对定位是相对于元素在文档中的初始位置，并且
相对定位的元素仍然占据原有的空间。

绝对定位和相对定位相对的基准是 第一个非 static 的父元素 ？

### 行内元素和块级元素的具体区别是什么？行内元素的 padding 和 margin 可以设置吗？

行内元素:

- 和相邻的内联元素在同一行；
- width\height\padding-bottom\padding-bottom 和 margin-top\margin-bottom 都不可改变（也就是 padding 和 margin 的 left 和 right 是可以改变的）
- 宽度只与内容有关；
- 行内元素只能容纳文本或其他行内元素。

块级元素

- 总是在新的一行上开始，占据一整行，而且后面的元素也会另起一行显示；
- width\height\padding\margin 都可控制；
- 宽度始终与浏览器宽度一致，与内容无关；
- 它可以容纳内联元素和其他块元素。

### 1.1 内联元素(inline)

- 元素显示方式："文本方式"，1 个挨着 1 个，不独自占有 1 行；
- 内嵌的元素也必须是内联元素：如<a></a>,不能在里面嵌入<div></div>等块级元素；
- 包含的标签有：<a>、<input>、<label>、<img> 等等；

### 1.2 块元素(block)

- 元素显示方式：每个元素独自占有 1 行，相当于前后都带有换行符；
- 内嵌的元素可以是内联或块级元素；
- 包含的元素有：<h1>~<h6>、<div>、<hr>等等；

### 2.1 默认展示(未添加 width 和 height 属性)

- HTML 元素在浏览器展示的方式是：从上到下，从左到右。
- 内联元素，是根据浏览器的宽度及自身的 width 宽度来填充。若当前行剩余空白区域不够，就会换至下一行。
- 块级元素，根据内联元素的展示方式展示大概区域；当浏览器的宽度减少时，会自动扩充块级元素的 height 属性的值，以容纳内嵌元素的展示。

① 当块级元素没设置 width 属性时，浏览器宽度的变更，会压缩块元素内嵌元素的排版。

② 设置块级元素的 width 属性时，浏览器的 width 属性值变更，不会影响到块级元素里的内嵌元素的布局，他们(内嵌元素)受父级块级元素的影响。

适用范围：导航条(导航条里有多个 a 标签，可放在一个 div 里，并给 div 附加 width 属性；以免浏览器缩小，造成导航排版乱掉)；

### 内联与块级标签有何区别？

Html 中的标签默认主要分为两大类型，一类为块级元素，另一类是行内元素，许多人也把行内称为内联，所以叫内联元素，其实就是一个意思。为了很好的布局，必须理解它们间的区别。

### 行内元素、块级元素区别

行内元素：和其他元素都在一行上，高度、行高及外边距和内边距都不可改变，文字图片的宽度不可改变，只能容纳文本或者其他行内元素；其中 img 是行元素

块级元素：总是在新行上开始，高度、行高及外边距和内边距都可控制，可以容纳内敛元素和其他元素；行元素转换为块级元素方式：display：block；

一边固定宽度一边宽度自适应

### 行内元素和块级元素的具体区别是什么？行内元素的 padding 和 margin 可设置吗？

块级元素(block)特性：

总是独占一行，表现为另起一行开始，而且其后的元素也必须另起一行显示;
宽度(width)、高度(height)、内边距(padding)和外边距(margin)都可控制;
　　内联元素(inline)特性：
和相邻的内联元素在同一行;
宽度(width)、高度(height)、内边距的 top/bottom(padding-top/padding-bottom)和外边距的 top/bottom(margin-top/margin-bottom)都不可改变（也就是 padding 和 margin 的 left 和 right 是可以设置的），就是里面文字或图片的大小。
　　那么问题来了，浏览器还有默认的天生 inline-block 元素（拥有内在尺寸，可设置高宽，但不会自动换行），有哪些？

答案：<input> 、<img> 、<button> 、<textarea> 、<label>。

### display 有哪些值？说明他们的作用。

- block 块类型。默认宽度为父元素宽度，可设置宽高，换行显示。此元素将显示为块级元素，此元素前后会带有换行符。
- none 缺省值。象行内元素类型一样显示。此元素不会被显示。
- inline 行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。默认。此元素会被显示为内联元素，元素前后没有换行符。
- inline-block 默认宽度为内容宽度，可以设置宽高，同行显示。行内块元素。（CSS2.1 新增的值）
- list-item 象块类型元素一样显示，并添加样式列表标记。
- table 此元素会作为块级表格来显示。
- inherit 规定应该从父元素继承 display 属性的值

默认值：inline

- none： 隐藏对象。与 visibility 属性的 hidden 值不同，其不为被隐藏的对象保留其物理空间
- inline： 指定对象为内联元素。
- block： 指定对象为块元素。
- list-item： 指定对象为列表项目。
- inline-block： 指定对象为内联块元素。（CSS2）
- table： 指定对象作为块元素级的表格。类同于 html 标签<table>（CSS2）
- inline-table： 指定对象作为内联元素级的表格。类同于 html 标签<table>（CSS2）
- table-caption： 指定对象作为表格标题。类同于 html 标签<caption>（CSS2）
- table-cell： 指定对象作为表格单元格。类同于 html 标签<td>（CSS2）
- table-row： 指定对象作为表格行。类同于 html 标签<tr>（CSS2）
- table-row-group： 指定对象作为表格行组。类同于 html 标签<tbody>（CSS2）
- table-column： 指定对象作为表格列。类同于 html 标签<col>（CSS2）
- table-column-group： 指定对象作为表格列组显示。类同于 html 标签<colgroup>（CSS2）
- table-header-group： 指定对象作为表格标题组。类同于 html 标签<thead>（CSS2）
- table-footer-group： 指定对象作为表格脚注组。类同于 html 标签<tfoot>（CSS2）
- run-in： 根据上下文决定对象是内联对象还是块级对象。（CSS3）
- box： 将对象作为弹性伸缩盒显示。（伸缩盒最老版本）（CSS3）
- inline-box： 将对象作为内联块级弹性伸缩盒显示。（伸缩盒最老版本）（CSS3）
- flexbox： 将对象作为弹性伸缩盒显示。（伸缩盒过渡版本）（CSS3）
- inline-flexbox： 将对象作为内联块级弹性伸缩盒显示。（伸缩盒过渡版本）（CSS3）
- flex： 将对象作为弹性伸缩盒显示。（伸缩盒最新版本）（CSS3）
- inline-flex： 将对象作为内联块级弹性伸缩盒显示。（伸缩盒最新版本）（CSS3）

### 如何确定一个元素的包含块(containing block)

1. 根元素的包含块叫做初始包含块，在连续媒体中他的尺寸与 viewport 相同并且 anchored at the canvas origin；对于 paged media，它的尺寸等于 page area。初始包含块的 direction 属性与根元素相同。
2. position 为 relative 或者 static 的元素，它的包含块由最近的块级（display 为 block,list-item, table）祖先元素的内容框组成
3. 如果元素 position 为 fixed。对于连续媒体，它的包含块为 viewport；对于 paged media，包含块为 page area
4. 如果元素 position 为 absolute，它的包含块由祖先元素中最近一个 position 为 relative,absolute 或者 fixed 的元素产生，规则如下：
5. 如果祖先元素为行内元素，the containing block is the bounding box around the padding boxes of the first and the last inline boxes generated for that element.

- 其他情况下包含块由祖先节点的 padding edge 组成
- 如果找不到定位的祖先元素，包含块为初始包含块

### block，inline 和 inline-block 细节对比？

首先：CSS 规范规定，每个元素都有 display 属性，确定该元素的类型，每个元素都有默认的 display 值，如 div 的 display 默认值为“block”，则为“块级”元素；span 默认 display 属性值为“inline”，是“行内”元素。

- 行内元素有：a b span img input select strong（强调的语气）
- 块级元素有：div ul ol li dl dt dd h1 h2 h3 h4…p

#### display:block

1. block 元素会独占一行，多个 block 元素会各自新起一行。默认情况下，block 元素宽度自动填满其父元素宽度。
1. block 元素可以设置 width,height 属性。块级元素即使设置了宽度,仍然是独占一行。
1. block 元素可以设置 margin 和 padding 属性。

#### display:inline

1. inline 元素不会独占一行，多个相邻的行内元素会排列在同一行里，直到一行排列不下，才会新换一行，其宽度随元素的内容而变化。
1. inline 元素设置 width,height 属性无效。
1. inline 元素的 margin 和 padding 属性，水平方向的 padding-left, padding-right, margin-left, margin-right 都产生边距效果；但竖直方向的 padding-top, padding-bottom, margin-top, margin-bottom 不会产生边距效果。

#### display:inline-block

1. 简单来说就是将对象呈现为 inline 对象，但是对象的内容作为 block 对象呈现。之后的内联对象会被排列在同一行内。比如我们可以给一个 link（a 元素）inline-block 属性值，使其既具有 block 的宽度高度特性又具有 inline 的同行特性。

补充说明

1. 一般我们会用 display:block，display:inline 或者 display:inline-block 来调整元素的布局级别，其实 display 的参数远远不止这三种，仅仅是比较常用而已。
1. IE（低版本 IE）本来是不支持 inline-block 的，所以在 IE 中对内联元素使用 display:inline-block，理论上 IE 是不识别的，但使用 display:inline-block 在 IE 下会触发 layout，从而使内联元素拥有了 display:inline-block 属性的表象。

### `inline`和`inline-block`有什么区别？

我把`block`也加入其中，为了获得更好的比较。

|                                 | `block`                                                     | `inline-block`                             | `inline`                                                                                                           |
| ------------------------------- | ----------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| 大小                            | 填充其父容器的宽度。                                        | 取决于内容。                               | 取决于内容。                                                                                                       |
| 定位                            | 从新的一行开始，并且不允许旁边有 HTML 元素（除非是`float`） | 与其他内容一起流动，并允许旁边有其他元素。 | 与其他内容一起流动，并允许旁边有其他元素。                                                                         |
| 能否设置`width`和`height`       | 能                                                          | 能                                         | 不能。 设置会被忽略。                                                                                              |
| 可以使用`vertical-align`对齐    | 不可以                                                      | 可以                                       | 可以                                                                                                               |
| 边距（margin）和填充（padding） | 各个方向都存在                                              | 各个方向都存在                             | 只有水平方向存在。垂直方向会被忽略。 尽管`border`和`padding`在`content`周围，但垂直方向上的空间取决于'line-height' |
| 浮动（float）                   | -                                                           | -                                          | 就像一个`block`元素，可以设置垂直边距和填充。                                                                      |

### `display: block;`和`display: inline;`的区别

`block`元素特点：

1.处于常规流中时，如果`width`没有设置，会自动填充满父容器 2.可以应用`margin/padding` 3.在没有设置高度的情况下会扩展高度以包含常规流中的子元素 4.处于常规流中时布局时在前后元素位置之间（独占一个水平空间） 5.忽略`vertical-align`

`inline`元素特点

1.水平方向上根据`direction`依次布局 2.不会在元素前后进行换行 3.受`white-space`控制 4.`margin/padding`在竖直方向上无效，水平方向上有效 5.`width/height`属性对非替换行内元素无效，宽度由元素内容决定 6.非替换行内元素的行框高由`line-height`确定，替换行内元素的行框高由`height`,`margin`,`padding`,`border`决定 6.浮动或绝对定位时会转换为`block` 7.`vertical-align`属性生效

### 请解释 relative、fixed、absolute 和 static 元素的区别

1. static（静态定位）：默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声明）。

2. relative（相对定位）：生成相对定位的元素，通过 top,bottom,left,right 的设置相对于其正常（原先本身）位置进行定位。可通过 z-index 进行层次分级。

3. absolute（绝对定位）：生成绝对定位的元素，相对于 static 定位以外的第一个父元素进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。可通过 z-index 进行层次分级。

4. fixed（固定定位）：生成绝对定位的元素，相对于浏览器窗口进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。可通过 z-index 进行层次分级。

### 去除 inline-block 元素间间距的方法

两个并列的 inline-block 中间会有一条裂缝，这个的原因是两个标签之间有空格，浏览器把这些空格当成文字中空格，所以这两个块中间多少有间隙。

- 移除空格
- 使用 margin 负值
- 使用 font-size:0
- letter-spacing
- word-spacing

### 请问为何要使用 transform 而非 absolute positioning，或反之的理由？为什么？

- 使用 transform 或 position 实现动画效果时是有很大差别。
- 使用 transform 时，可以让 GPU 参与运算，动画的 FPS 更高。
- 使用 position 时，最小的动画变化的单位是 1px，而使用 transform 参与时，可以做到更小（动画效果更加平滑）
- 功能都一样。但是 translate 不会引起浏览器的重绘和重排，这就相当 nice 了。

反之

- transform 改变 fixed 子元素的定位对象
- transform 改变元素层叠顺序
  [transform 的副作用](http://imweb.io/topic/5a23e1f1a192c3b460fce26e)

### display,float,position 的关系

1. 如果`display`为 none，那么 position 和 float 都不起作用，这种情况下元素不产生框
2. 否则，如果 position 值为 absolute 或者 fixed，框就是绝对定位的，float 的计算值为 none，display 根据下面的表格进行调整。
3. 否则，如果 float 不是 none，框是浮动的，display 根据下表进行调整
4. 否则，如果元素是根元素，display 根据下表进行调整
5. 其他情况下 display 的值为指定值
   总结起来：**绝对定位、浮动、根元素都需要调整`display`**
   ![display转换规则](img/display-adjust.png)

### absolute 的 containing block 计算方式跟正常流有什么不同？

无论属于哪种，都要先找到其祖先元素中最近的 position 值不为 static 的元素，然后再判断：

1. 若此元素为 inline 元素，则 containing block 为能够包含这个元素生成的第一个和最后一个 inline box 的 padding box (除 margin, border 外的区域) 的最小矩形；
2. 否则,则由这个祖先元素的 padding box 构成。

如果都找不到，则为 initial containing block。

补充：

1. static(默认的)/relative：简单说就是它的父元素的内容框（即去掉 padding 的部分）
2. absolute: 向上找最近的定位为 absolute/relative 的元素
3. fixed: 它的 containing block 一律为根元素(html/body)

### display:inline-block 什么时候会显示间隙？

1. 有空格时候会有间隙 解决：移除空格
2. margin 正值的时候 解决：margin 使用负值
3. 使用 font-size 时候 解决：font-size:0、letter-spacing、word-spacing

- 相邻的 inline-block 元素之间有换行或空格分隔的情况下会产生间距
- 非 inline-block 水平元素设置为 inline-block 也会有水平间距
- 可以借助 vertical-align:top; 消除垂直间隙
- 可以在父级加 font-size：0; 在子元素里设置需要的字体大小，消除垂直间隙
- 把 li 标签写到同一行可以消除垂直间隙，但代码可读性差
