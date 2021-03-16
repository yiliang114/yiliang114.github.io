---
title: Float 浮动
date: 2020-11-21
draft: true
---

## Float 浮动

元素"浮动",脱离文档流。

对自己的影响

- 形成"块"(BFC)
- 这个块会负责自己的布局，宽高由自己决定

比如 span 中用 float 这个 span 就形成了一个 BFC，就可以设置宽高了

对兄弟元素的影响

- 上面一般贴非 float 元素
- 靠边贴 float 元素或边
- 不影响其他块级元素位置
- 影响其他块级元素文本

对父级元素的影响

- 从布局上"消失"
- 高度塌陷

浮动出现的最开始出现的意义是用来让文字环绕图片而已。
float 可以自动包裹元素。
float 会导致父容器高度塌陷。float 为什么会导致高度塌陷：元素含有浮动属性 –> 破坏 inline box –> 破坏 line box 高度 –> 没有高度 –> 塌陷。什么时候会塌陷：当标签里面的元素只要样子没有实际高度时会塌陷。
浮动会脱离文档流。产生自己的块级格式化上下文。

a. 浮动元素脱离文档流，不占据空间（引起“高度塌陷”现象）
b. 浮动元素碰到包含它的边框或者浮动元素的边框停留。

### 请阐述`Float`定位的工作原理。

浮动（float）是 CSS 定位属性。浮动元素从网页的正常流动中移出，但是保持了部分的流动性，会影响其他元素的定位（比如文字会围绕着浮动元素）。这一点与绝对定位不同，绝对定位的元素完全从文档流中脱离。

CSS 的`clear`属性通过使用`left`、`right`、`both`，让该元素向下移动（清除浮动）到浮动元素下面。

如果父元素只包含浮动元素，那么该父元素的高度将塌缩为 0。我们可以通过清除（clear）从浮动元素后到父元素关闭前之间的浮动来修复这个问题。

有一种 hack 的方法，是自定义一个`.clearfix`类，利用伪元素选择器`::after`清除浮动。[另外还有一些方法](https://css-tricks.com/all-about-floats/#article-header-id-4)，比如添加空的`<div></div>`和设置浮动元素父元素的`overflow`属性。与这些方法不同的是，`clearfix`方法，只需要给父元素添加一个类，定义如下：

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

```css
/**
* 在标准浏览器下使用
* 1 content内容为空格用于修复opera下文档中出现
*   contenteditable属性时在清理浮动元素上下的空白
* 2 使用display使用table而不是block：可以防止容器和
*   子元素top-margin折叠,这样能使清理效果与BFC，IE6/7
*   zoom: 1;一致
**/

.clearfix:before,
.clearfix:after {
  content: ' '; /* 1 */
  display: table; /* 2 */
}

.clearfix:after {
  clear: both;
}

/**
* IE 6/7下使用
* 通过触发hasLayout实现包含浮动
**/
.clearfix {
  *zoom: 1;
}
```

### 清除浮动

1. 使用空标签清除浮动。
   这种方法是在所有浮动标签后面添加一个空标签 定义 css clear:both. 弊端就是增加了无意义标签。
2. 使用 overflow。给父元素设置 overflow：auto 或者 hidden。
   给包含浮动元素的父标签添加 css 属性 overflow:auto; zoom:1; zoom:1 用于兼容 IE6。
3. 使用 after 伪对象清除浮动。
   该方法只适用于非 IE 浏览器。具体写法可参照以下示例。使用中需注意以下几点。一、该方法中必须为需要清除浮动元素的伪对象中设置 height:0，否则该元素会比实际高出若干像素；

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

### 请解释一下为什么需要清除浮动？清除浮动的方式

- 清除浮动是为了清除使用浮动元素产生的影响。浮动的元素，高度会塌陷，而高度的塌陷使我们页面后面的布局不能正常显示
- 父级 div 定义 height
- 父级 div 也一起浮动；
- 常规的使用一个 class；

```css
.clearfix:before,
.clearfix:after {
  content: ' ';
  display: table;
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1;
}
```

### 清除浮动最佳实践（after 伪元素闭合浮动）：

```css
.clearfix:after {
  content: '\200B';
  display: table;
  height: 0;
  clear: both;
}
.clearfix {
  *zoom: 1;
}
```

### 有哪些清除浮动的技术，都适用哪些情况？

- 空`div`方法：`<div style="clear:both;"></div>`。
- clearfix 方法：上文使用`.clearfix`类已经提到。
- `overflow: auto`或`overflow: hidden`方法：上文已经提到。

在大型项目中，我会使用 clearfix 方法，在需要的地方使用`.clearfix`。设置`overflow: hidden`的方法可能使其子元素显示不完整，当子元素的高度大于父元素时。

### 行内元素 float:left 后是否变为块级元素？

浮动后，行内元素不会成为块状元素，但是可以设置宽高。行内元素要想变成块状元素，占一行，直接设置 display:block;。但如果元素设置了浮动后再设置 display:block;那就不会占一行。

### 如何居中 div, 如何居中一个浮动元素?

1. 非浮动元素居中：可以设置 margin:0 auto 令其居中, 定位 ,父级元素 text-align:center 等等
2. 浮动元素居中:
   1. 设置当前 div 的宽度，然后设置 margin-left:50%; position:relative; left:-250px;其中的 left 是宽度的一半。
   1. 父元素和子元素同时左浮动，然后父元素相对左移动 50%，再然后子元素相对左移动-50%。
   1. position 定位等等。

### 如何垂直居中一个浮动元素？

```css
// 方法一：已知元素的高宽

#div1 {
  background-color: #6699ff;
  width: 200px;
  height: 200px;

  position: absolute; //父元素需要相对定位
  top: 50%;
  left: 50%;
  margin-top: -100px; //二分之一的 height，width
  margin-left: -100px;
}

//方法二:

#div1 {
  width: 200px;
  height: 200px;
  background-color: #6699ff;

  margin: auto;
  position: absolute; //父元素需要相对定位
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
```

那么问题来了，如何垂直居中一个<img>?（用更简便的方法。）

```css
#container //<img>的容器设置如下
 {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
```

### 设置元素浮动后，该元素的 display 值会如何变化？

- 设置元素浮动后，该元素的 display 值自动变成 block

### zoom:1 的清除浮动原理?

- 清除浮动，触发 hasLayout；
- Zoom 属性是 IE 浏览器的专有属性，它可以设置或检索对象的缩放比例。解决 ie 下比较奇葩的 bug
- 譬如外边距（margin）的重叠，浮动清除，触发 ie 的 haslayout 属性等
