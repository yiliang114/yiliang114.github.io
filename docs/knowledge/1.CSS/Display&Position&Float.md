---
title: Display&Position&Float
date: 2020-11-21
draft: true
---

## Display

### display 有哪些值

1. none 缺省值。此元素不会被显示。
2. block 块级元素。
3. inline 行内元素。默认宽度为内容宽度，不可设置宽高，同行显示。
4. inline-block 块级行内元素，可以设置宽高，同行显示。
5. flex 弹性盒子
6. inline-flex 内联的弹性盒子
7. table 块级表格
8. inherit 规定应该从父元素继承 display 属性的值

### display:inline-block 什么时候会显示间隙？

相邻的 inline-block 元素之间有换行或空格分隔的情况下会产生间距，非 inline-block 水平元素设置为 inline-block 也会有水平间距。这个的原因是两个标签之间有空格，浏览器把这些空格当成文字中空格，所以这两个块中间多少有间隙。

解决办法：

1. `display: block` 直接解决
2. 可以借助 vertical-align 为 top 或者 bottom 消除垂直间隙。
3. 可以在父级加 font-size：0; 在子元素里设置需要的字体大小，消除垂直间隙。使用 font-size 时候 解决：font-size:0, letter-spacing,word-spacing
   1. letter-spacing 设置文本字符的间距
   2. word-spacing 标签和单词直接的间距
4. 有空格时候会有间隙 解决：移除空格
5. margin 正值的时候 解决：margin 使用负值

## Position

1. static 可以认为静态的，默认元素都是静态的定位，对象遵循常规流。
2. relative 相对定位，对象遵循常规流，并且参照自身在常规流中的位置通过 top，right，bottom，left 这 4 个定位偏移属性进行偏移时不会影响常规流中的任何元素。
3. absolute
   a、绝对定位，对象脱离常规流，此时偏移属性参照的是离自身最近的定位祖先元素，如果没有定位的祖先元素，则一直回溯到 body 元素。盒子的偏移位置不影响常规流中的任何元素，其 margin 不与其他任何 margin 折叠。
   b、元素定位参考的是离自身最近的定位祖先元素，要满足两个条件，第一个是自己的祖先元素，可以是父元素也可以是父元素的父元素，一直找，如果没有则选择 body 为对照对象。第二个条件是要求祖先元素必须定位，通俗说就是 position 的属性值为非 static 都行。
4. fixed
   固定定位，与 absolute 一致，但偏移定位是以窗口为参考。当出现滚动条时，对象不会随着滚动。
5. center
6. page
7. sticky
   对象在常态时遵循常规流。它就像是 relative 和 fixed 的合体，当在屏幕中时按常规流排版，当卷动到屏幕外时则表现如 fixed。该属性的表现是现实中你见到的吸附效果。（CSS3）
   盒位置根据正常流计算(这称为正常流动中的位置)，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位。在所有情况下（即便被定位元素为 `table` 时），该元素定位均不对后续元素造成影响。当元素 B 被粘性定位时，后续元素的位置仍按照 B 未定位时的位置来确定。`position: sticky` 对 `table` 元素的效果与 `position: relative` 相同。

### position 的值， relative 和 absolute 分别是相对于谁进行定位的？

- `static` 默认值。没有定位，元素出现在正常的流中
- `absolute` 生成绝对定位的元素， 相对于最近一级的 定位不是 static 的父元素来进行定位。
- `relative` 生成相对定位的元素，相对于其在普通流中的位置进行定位。
- `fixed` （老 IE 不支持）生成绝对定位的元素，通常相对于浏览器窗口或 frame 进行定位。
- `sticky` 生成粘性定位的元素，容器的位置根据正常文档流计算得出.
- `center` 与 absolute 一致，但偏移定位是以定位祖先元素的中心点为参考。盒子在其包含容器垂直水平居中。（CSS3）
- `page`与 absolute 一致。元素在分页媒体或者区域块内，元素的包含块始终是初始包含块，否则取决于每个 absolute 模式。（CSS3）

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

### absolute 的 containing block 计算方式跟正常流有什么不同？

无论属于哪种，都要先找到其祖先元素中最近的 position 值不为 static 的元素，然后再判断：

1. 若此元素为 inline 元素，则 containing block 为能够包含这个元素生成的第一个和最后一个 inline box 的 padding box (除 margin, border 外的区域) 的最小矩形；
2. 否则,则由这个祖先元素的 padding box 构成。

如果都找不到，则为 initial containing block。

补充：

1. static(默认的)/relative：简单说就是它的父元素的内容框（即去掉 padding 的部分）
2. absolute: 向上找最近的定位为 absolute/relative 的元素
3. fixed: 它的 containing block 一律为根元素(html/body)

## Float

浮动元素从网页的正常流动中移出，但是保持了部分的流动性，会影响其他元素的定位（比如文字会围绕着浮动元素）。这一点与绝对定位不同，绝对定位的元素完全从文档流中脱离。

元素"浮动",脱离文档流。

对自己的影响：

1. 会形成"块"(BFC)
2. 这个块会负责自己的布局，宽高由自己决定
3. 设置元素浮动后，该元素的 display 值自动变成 block

对兄弟元素的影响：

1. 上面一般贴非 float 元素
2. 靠边贴 float 元素或边，浮动元素碰到包含它的边框或者浮动元素的边框停留。
3. 不影响其他块级元素位置
4. 影响其他块级元素文本

对父级元素的影响：

1. 从布局上"消失"。
2. 如果父元素只包含浮动元素，那么该父元素的高度将塌缩为 0。导致高度塌陷。float 为什么会导致高度塌陷：元素含有浮动属性 –> 破坏 inline box –> 破坏 line box 高度 –> 没有高度 –> 塌陷。什么时候会塌陷：当标签里面的元素只要样子没有实际高度时会塌陷。

### 清除浮动

CSS 的`clear`属性通过使用`left`、`right`、`both`，让该元素向下移动（清除浮动）到浮动元素下面。

有一种 hack 的方法，是自定义一个`.clearfix`类，利用伪元素选择器`::after`清除浮动。也可以添加添加空的`<div></div>`和设置浮动元素父元素的`overflow`属性。与这些方法不同的是，`clearfix`方法，只需要给父元素添加一个类，定义如下：

```css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

值得一提的是，把父元素属性设置为`overflow: auto`或`overflow: hidden`，会使其内部的子元素形成块格式化上下文（Block Formatting Context），并且父元素会扩张自己，使其能够包围它的子元素。

浮动元素引起的问题：

1. 父元素的高度无法被撑开，影响与父元素同级的元素
2. 与浮动元素同级的非浮动元素（内联元素）会跟随其后
3. 若非第一个元素浮动，则该元素之前的元素也需要浮动，否则会影响页面显示的结构

浮动会漂浮于普通流之上，像浮云一样，但是只能左右浮动。正是这种特性，导致框内部由于不存在其他普通流元素了，表现出高度为 0（高度塌陷）。

1. 添加额外标签，例如 <div style="clear:both"></div>
1. 使用 br 标签和其自身的 html 属性，例如 <br clear="all" />
1. 父元素设置 overflow：hidden；在 IE6 中还需要触发 hasLayout，例如 zoom：1；
1. 父元素设置 overflow：auto 属性；同样 IE6 需要触发 hasLayout
1. 父元素也设置浮动
1. 父元素设置 display:table
1. 使用:after 伪元素；由于 IE6-7 不支持:after，使用 zoom:1 触发 hasLayout。

在 CSS2.1 里面有一个很重要的概念，那就是 Block formatting contexts （块级格式化上下文），简称 BFC。创建了 BFC 的元素就是一个独立的盒子，里面的子元素不会在布局上影响外面的元素，同时 BFC 仍然属于文档中的普通流。IE6-7 的显示引擎使用的是一个称为布局（layout）的内部概念。

### 解释下什么是浮动和它的工作原理？

- 非 IE 浏览器下，容器不设高度且子元素浮动时，容器高度不能被内容撑开。
  此时，内容会溢出到容器外面而影响布局。这种现象被称为浮动（溢出）。
- 工作原理：

  - 浮动元素脱离文档流，不占据空间（引起“高度塌陷”现象）
  - 浮动元素碰到包含它的边框或者其他浮动元素的边框停留

### 容器包含若干浮动元素时如何清理(包含)浮动

1. 容器元素闭合标签前添加额外元素并设置`clear: both`
2. 父元素触发块级格式化上下文(见块级可视化上下文部分)
3. 设置容器元素伪元素进行清理

### 清除浮动

1. 使用空标签清除浮动。空`div`方法：`<div style="clear:both;"></div>`
   这种方法是在所有浮动标签后面添加一个空标签 定义 css clear:both. 弊端就是增加了无意义标签。
2. 使用 after 伪对象清除浮动。
   该方法只适用于非 IE 浏览器。具体写法可参照以下示例。使用中需注意以下几点。一、该方法中必须为需要清除浮动元素的伪对象中设置 height:0，否则该元素会比实际高出若干像素；
3. 使用 overflow。给父元素设置 overflow：auto 或者 hidden。
   给包含浮动元素的父标签添加 css 属性 overflow:auto; zoom:1; zoom:1 用于兼容 IE6。

使用`CSS`中的`clear:both`;属性来清除元素的浮动可解决 2、3 问题，对于问题 1，添加如下样式，给父元素添加`clearfix`样式：

```css
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.clearfix {
  display: inline-block;
} /* for IE/Mac */
```

在大型项目中，我会使用 clearfix 方法，在需要的地方使用`.clearfix`。设置`overflow: hidden`的方法可能使其子元素显示不完整，当子元素的高度大于父元素时。

### 如何居中 div, 如何居中一个浮动元素?

1. 非浮动元素居中：可以设置 margin:0 auto 令其居中, 定位 ,父级元素 text-align:center 等等
2. 浮动元素居中:
   1. 设置当前 div 的宽度，然后设置 margin-left:50%; position:relative; left:-250px;其中的 left 是宽度的一半。
   1. 父元素和子元素同时左浮动，然后父元素相对左移动 50%，再然后子元素相对左移动-50%。
   1. position 定位等等。

### 如何垂直居中一个浮动元素？

```css
/* 方法一：已知元素的高宽 */
#div1 {
  background-color: #6699ff;
  width: 200px;
  height: 200px;
  /* 父元素需要相对定位 */
  position: absolute;
  top: 50%;
  left: 50%;
  /* 二分之一的 height，width */
  margin-top: -100px;
  margin-left: -100px;
}

/* 方法二: */
#div1 {
  width: 200px;
  height: 200px;
  background-color: #6699ff;

  margin: auto;
  /* 父元素需要相对定位 */
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
```

那么问题来了，如何垂直居中一个<img>?（用更简便的方法。）

```css
/* <img>的容器设置如下 */
#container {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
```

### zoom:1 的清除浮动原理?

- 清除浮动，触发 hasLayout；
- Zoom 属性是 IE 浏览器的专有属性，它可以设置或检索对象的缩放比例。解决 ie 下比较奇葩的 bug
- 譬如外边距（margin）的重叠，浮动清除，触发 ie 的 haslayout 属性等
