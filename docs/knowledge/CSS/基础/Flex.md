---
title: 基础
date: 2020-11-21
draft: true
---

## Flex

### flex 弹性布局

采用 flex 布局的容器称为 flex 容器（flex container），当一个元素采用 flex 布局后，它的子元素将自动成为容器成员（flex item）。flex 容器默认存在 2 根轴线，主轴（main axis，默认为横轴）和交叉轴（cross axis，默认为纵轴），flex 布局所有的属性都围绕这 2 条轴线上的元素如何布排进行设定。

#### 常用属性

#### flex container 容器属性

1. flex-direction，决定主轴上元素的排布方向，有 4 种取值

- row：默认值，主轴为水平方向且起点在左端
- row-reverse：主轴为水平方向且起点在右端
- column：主轴为垂直方向且起点在上方
- column-reverse：主轴为垂直方向且起点在下方

2. flex-wrap，定义换行方式，当一条轴线放不下时如何换行，有 3 种取值

- nowrap：默认值，不换行
- wrap：换行
- wrap-reverse：换行且第一行在下方

3. flex-flow，是 flex-direction 属性和 flex-wrap 属性的简写形式，默认值为 row nowrap（主轴在横轴，不换行）

4. justify-content 定义了子元素在主轴上的对齐方式。水平对齐

- flex-start 默认值，左对齐，从左至右按顺序排列
- flex-end 右对齐，从右至左按顺序排列
- center 居中排列
- space-between 两端对齐，最左与最右的元素与容器边界无间隔，元素与元素间的距离相等
- space-around 等距对齐，元素两侧间隔相等，元素与元素之间的距离是最两端元素与容器边界距离的 2 倍，

5. align-items 定义在交叉轴上的项目如何对齐。垂直对齐

- flex-start 以交叉轴的起点对齐
- flex-end 以交叉轴的终点对齐
- center 以交叉轴的中点对齐
- strench 如果项目未设置高度或设置为 auto，将占满整个容器
- baseline 以项目第一行文字的基线对齐

6. align-content 定义了多根轴线的对齐方式。轴线对齐

- flex-start：与交叉轴的起点对齐
- flex-end：与交叉轴的终点对齐
- center：与交叉轴的中点对齐
- space-between：与交叉轴两端对齐，轴线之间的间隔相等
- space-around：轴线之间的间隔相等，轴线间的距离是轴线与交叉轴起点、交叉轴终点距离的两倍。
- stretch：默认值，轴线占满整个交叉轴

#### flex item 项目属性

1. order，定义项目的排列顺序，数值越小，排列越靠前，默认都为 0
2. flex-grow，定义项目的放大比例，默认都为 0，即使有剩余空间也不放大。如果都设为 1，则所有项目将等分空间。如果有一个项目设为 2 而其它项目设为 1，则该项目占据的空间是其它项目的 2 倍。
3. flex-shrink，定义了项目的缩小比例，默认都为 1， 既当空间不足时，所有项目都将等比例缩小。如果设为 0，则当空间不足时，该项目也不缩小。
4. flex-basis，定义项目占据的主轴空间，浏览器根据这个属性计算是否有多余空间。默认值为 auto，即项目本来的大小，也可设置固定空间。
5. flex，是 flex-grow、flex-shrink 和 flex-basis 的简写，默认为 0 1 auto。该属性有 2 个快捷值，auto（1 1 auto）和 none（0 0 auto），建议优先使用这 2 个属性，而不是单独写 3 个分离的属性，因为浏览器会推算相关值。
6. align-self，允许单个项目能够有和其它项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto，表示继承父元素的 align-items 属性。

#### flex 常见的布局

```css
/* 上下左右居中 */
.box-center {
   display: flex;
   justify-content: center;
   align-items: center;
}

/* item 两端对齐（左右两端不留空间） */
.item-between {
   display: flex;
   justify-content: space-between;
}

/* item 两端对齐且上下居中（主轴在横轴） */
.lr-bettem {
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
}

/* item 从左到右排列，且上下居中（主轴在横轴） */
.lr-start {
   display: flex;
   flex-direction: row;
   justify-content: flex-start;
   align-items: center;
}

/* item 从左到右排列，上下不居中 */
.lr-start2 {
   display: flex;
   flex-direction: row;
   justify-content: flex-start;
}

/* item从右到左排列，且上下居中 */
.lr-end {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

/* item 上下两端对齐（主轴在纵轴） */
.ud-bettem {
   display: flex;
   flex-direction: column;
   justify-content: space-between;
}
```

### 说一说 flex 布局 不兼容哪些东西

### 请解释一下 CSS3 的 Flexbox（弹性盒布局模型）以及适用场景？

- Flexbox 用于不同尺寸屏幕中创建可自动扩展和收缩布局

该布局模型的目的是提供一种更加高效的方式来对容器中的条目进行布局、对齐和分配空间。在传统的布局方式中，block 布局是把块在垂直方向从上到下依次排列的；而 inline 布局则是在水平方向来排列。弹性盒布局并没有这样内在的方向限制，可以由开发人员自由操作。
适用场景：弹性布局适合于移动前端开发，在 Android 和 ios 上也完美支持。

### 你了解 CSS Flex 和 Grid 吗？

Flex 主要用于一维布局，而 Grid 则用于二维布局。

Flex
flex 容器中存在两条轴， 横轴和纵轴， 容器中的每个单元称为 flex item。

在容器上可以设置 6 个属性： flex-direction flex-wrap flex-flow justify-content align-items align-content

注意：当设置 flex 布局之后，子元素的 float、clear、vertical-align 的属性将会失效。

Flex 项目属性
有六种属性可运用在 item 项目上: 1. order 2. flex-basis 3. flex-grow 4. flex-shrink 5. flex 6. align-self

Grid
CSS 网格布局用于将页面分割成数个主要区域，或者用来定义组件内部元素间大小、位置和图层之间的关系。

像表格一样，网格布局让我们能够按行或列来对齐元素。 但是，使用 CSS 网格可能还是比 CSS 表格更容易布局。 例如，网格容器的子元素可以自己定位，以便它们像 CSS 定位的元素一样，真正的有重叠和层次。

### 请解释一下 CSS3 的 Flexbox（弹性盒布局模型）,以及适用场景？

- 一个用于页面布局的全新 CSS3 功能，Flexbox 可以把列表放在同一个方向（从上到下排列，从左到右），并让列表能延伸到占用可用的空间
- 较为复杂的布局还可以通过嵌套一个伸缩容器（flex container）来实现
- 采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。
- 它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"
- 常规布局是基于块和内联流方向，而 Flex 布局是基于 flex-flow 流可以很方便的用来做局中，能对不同屏幕大小自适应
- 在布局上有了比以前更加灵活的空间

### 使用 flex 实现三栏布局，两边固定，中间自适应

这就是圣杯布局国内也叫双飞翼布局，在第一天已经有回答了

同意里面的一个回答，现在有很多简单的实现方式，传统的这个也是一种 hack 的方式，真的没必要去追究了，但是核心知识点可以掌握。

1.把 center 放在最前面，优先渲染 2.相对定位 relative 也是可以设置 left,right 等值的
3.margin 负值的了解和使用
4.float 真的不建议使用

现在的 flex/grid 很轻松就能实现，甚至绝对定位也是很容易实现也更容易理解。

作用：圣杯布局和双飞翼布局解决的问题是一样的，就是两边顶宽，中间自适应的三栏布局，中间栏要在放在文档流前面以优先渲染。
   区别：圣杯布局，为了中间 div 内容不被遮挡，将中间 div 设置了左右 padding-left 和 padding-right 后，将左右两个 div 用相对布局 position: relative 并分别配合 right 和 left 属性，以便左右两栏 div 移动后不遮挡中间 div。双飞翼布局，为了中间 div 内容不被遮挡，直接在中间 div 内部创建子 div 用于放置内容，在该子 div 里用 margin-left 和 margin-right 为左右两栏 div 留出位置。

圣杯布局代码：

```html
<body>
  <div id="hd">header</div>
  <div id="bd">
    <div id="middle">middle</div>
    <div id="left">left</div>
    <div id="right">right</div>
  </div>
  <div id="footer">footer</div>
</body>

<style>
  #hd {
    height: 50px;
    background: #666;
    text-align: center;
  }
  #bd {
    /*左右栏通过添加负的margin放到正确的位置了，此段代码是为了摆正中间栏的位置*/
    padding: 0 200px 0 180px;
    height: 100px;
  }
  #middle {
    float: left;
    width: 100%; /*左栏上去到第一行*/
    height: 100px;
    background: blue;
  }
  #left {
    float: left;
    width: 180px;
    height: 100px;
    margin-left: -100%;
    background: #0c9;
    /*中间栏的位置摆正之后，左栏的位置也相应右移，通过相对定位的left恢复到正确位置*/
    position: relative;
    left: -180px;
  }
  #right {
    float: left;
    width: 200px;
    height: 100px;
    margin-left: -200px;
    background: #0c9;
    /*中间栏的位置摆正之后，右栏的位置也相应左移，通过相对定位的right恢复到正确位置*/
    position: relative;
    right: -200px;
  }
  #footer {
    height: 50px;
    background: #666;
    text-align: center;
  }
</style>
```

双飞翼布局代码：

```html
<body>
  <div id="hd">header</div>
  <div id="middle">
    <div id="inside">middle</div>
  </div>
  <div id="left">left</div>
  <div id="right">right</div>
  <div id="footer">footer</div>
</body>

<style>
  #hd {
    height: 50px;
    background: #666;
    text-align: center;
  }
  #middle {
    float: left;
    width: 100%; /*左栏上去到第一行*/
    height: 100px;
    background: blue;
  }
  #left {
    float: left;
    width: 180px;
    height: 100px;
    margin-left: -100%;
    background: #0c9;
  }
  #right {
    float: left;
    width: 200px;
    height: 100px;
    margin-left: -200px;
    background: #0c9;
  }

  /*给内部div添加margin，把内容放到中间栏，其实整个背景还是100%*/
  #inside {
    margin: 0 200px 0 180px;
    height: 100px;
  }
  #footer {
    clear: both; /*记得清楚浮动*/
    height: 50px;
    background: #666;
    text-align: center;
  }
</style>
```

#### flex 布局

```html
<head>
  <style>
    .container {
      border: 1px solid black;
      width: 100vw;
      height: 100vh;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .item {
      border: 1px solid red;
      height: 100%;
    }

    .left {
      width: 100px;
    }

    .right {
      flex: 1;
    }
  </style>
</head>

<body class="container">
  <div class="item left">100px宽</div>
  <div class="item right">自适应</div>
</body>
```

非 flex 布局方式

```html
<html>
  <head>
    <meta charset="utf-8" />
    <title>test.html</title>
    <style>
      .container {
        border: 1px solid black;
        width: 100vw;
        height: 100vh;
      }

      .item {
        border: 1px solid red;
        height: 100%;
      }

      .left {
        float: left;
        width: 100px;
      }

      .right {
        margin: 0 0 0 100px;
      }
    </style>
  </head>

  <body class="container">
    <div class="item left">100px宽</div>
    <div class="item right">自适应</div>
  </body>
</html>
```

### 你了解 CSS Flexbox 和 Grid 吗？

了解。Flexbox 主要用于一维布局，而 Grid 则用于二维布局。

Flexbox 解决了 CSS 中的许多常见问题，例如容器中元素的垂直居中，粘性定位（sticky）的页脚等。Bootstrap 和 Bulma 基于 Flexbox，这是创建布局的推荐方式。我之前曾使用过 Flexbox，但在使用`flex-grow`时遇到了一些浏览器不兼容问题（Safari），我必须使用`inline-blocks`和手动计算百分比宽度，来重写我的代码，这种体验不是很好。

Grid 创建基于栅格的布局，是迄今为止最直观的方法（最好是！），但目前浏览器支持并不广泛。

### 设置 width 的 flex 元素,flex 属性值是多少?

### flex:1 表示什么

![image](https://user-images.githubusercontent.com/21194931/56741835-2edd5500-67a6-11e9-885c-7047f8ca4b9c.png)

### 你了解 CSS Flex 和 Grid 吗？

Flex 主要用于一维布局，而 Grid 则用于二维布局。

Flex

flex 容器中存在两条轴， 横轴和纵轴， 容器中的每个单元称为 flex item。

在容器上可以设置 6 个属性： flex-direction flex-wrap flex-flow justify-content align-items align-content

注意：当设置 flex 布局之后，子元素的 float、clear、vertical-align 的属性将会失效。

Flex 项目属性

有六种属性可运用在 item 项目上: 1. order 2. flex-basis 3. flex-grow 4. flex-shrink 5. flex 6. align-self

Grid

CSS 网格布局用于将页面分割成数个主要区域，或者用来定义组件内部元素间大小、位置和图层之间的关系。

像表格一样，网格布局让我们能够按行或列来对齐元素。但是，使用 CSS 网格可能还是比 CSS 表格更容易布局。例如，网格容器的子元素可以自己定位，以便它们像 CSS 定位的元素一样，真正的有重叠和层次。

### flex 布局设置 width 无效

常常我们布局会使用到 flex，但布局中存在一些问题，比如无法设置宽度

```css
display: flex;
flex-wrap: nowrap;
```

我通过设置元素不换行，然后子元素分别设置了 50px 的宽度和高度，但是无法生效，要通过如下方式设置

```css
flex: 0 0 50px;
```

子元素不能直接设置 width: 50px，需要通过 flex 布局指定宽度，关于里面的具体参数，可以看这篇文章： 链接

### flex 设置成 1 和 auto 有什么区别

首先明确一点是， flex 是 flex-grow、flex-shrink、flex-basis 的缩写。故其取值可以考虑以下情况：

flex 的默认值是以上三个属性值的组合。假设以上三个属性同样取默认值，则 flex 的默认值是 0 1 auto。同理，如下是等同的：

```css
.item {
  flex: 2333 3222 234px;
}
.item {
  flex-grow: 2333;
  flex-shrink: 3222;
  flex-basis: 234px;
}
```

当 flex 取值为 none，则计算值为 0 0 auto，如下是等同的：

```css
.item {
  flex: none;
}
.item {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
}
```

当 flex 取值为 auto，则计算值为 1 1 auto，如下是等同的：

```css
.item {
  flex: auto;
}
.item {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
}
```

当 flex 取值为一个非负数字，则该数字为 flex-grow 值，flex-shrink 取 1，flex-basis 取 0%，如下是等同的：

```css
.item {
  flex: 1;
}
.item {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
```

当 flex 取值为一个长度或百分比，则视为 flex-basis 值，flex-grow 取 1，flex-shrink 取 1，有如下等同情况（注意 0% 是一个百分比而不是一个非负数字）：

```css
.item-1 {
  flex: 0%;
}
.item-1 {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
.item-2 {
  flex: 24px;
}
.item-1 {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 24px;
}
```

当 flex 取值为两个非负数字，则分别视为 flex-grow 和 flex-shrink 的值，flex-basis 取 0%，如下是等同的：

```css
.item {
  flex: 2 3;
}
.item {
  flex-grow: 2;
  flex-shrink: 3;
  flex-basis: 0%;
}
```

当 flex 取值为一个非负数字和一个长度或百分比，则分别视为 flex-grow 和 flex-basis 的值，flex-shrink 取 1，如下是等同的：

```css
.item {
  flex: 2333 3222px;
}
.item {
  flex-grow: 2333;
  flex-shrink: 1;
  flex-basis: 3222px;
}
```

flex-basis 规定的是子元素的基准值。所以是否溢出的计算与此属性息息相关。flex-basis 规定的范围取决于 box-sizing。这里主要讨论以下 flex-basis 的取值情况：

auto：首先检索该子元素的主尺寸，如果主尺寸不为 auto，则使用值采取主尺寸之值；如果也是 auto，则使用值为 content。

content：指根据该子元素的内容自动布局。有的用户代理没有实现取 content 值，等效的替代方案是 flex-basis 和主尺寸都取 auto。

百分比：根据其包含块（即伸缩父容器）的主尺寸计算。如果包含块的主尺寸未定义（即父容器的主尺寸取决于子元素），则计算结果和设为 auto 一样。

举一个不同的值之间的区别：

```html
<div class="parent">
  <div class="item-1"></div>
  <div class="item-2"></div>
  <div class="item-3"></div>
</div>

<style type="text/css">
  .parent {
    display: flex;
    width: 600px;
  }
  .parent > div {
    height: 100px;
  }
  .item-1 {
    width: 140px;
    flex: 2 1 0%;
    background: blue;
  }
  .item-2 {
    width: 100px;
    flex: 2 1 auto;
    background: darkblue;
  }
  .item-3 {
    flex: 1 1 200px;
    background: lightblue;
  }
</style>
```

主轴上父容器总尺寸为 600px

子元素的总基准值是：0% + auto + 200px = 300px，其中

- 0% 即 0 宽度
- auto 对应取主尺寸即 100px
  故剩余空间为 600px - 300px = 300px

伸缩放大系数之和为： 2 + 2 + 1 = 5

剩余空间分配如下：

- item-1 和 item-2 各分配 2/5，各得 120px
- item-3 分配 1/5，得 60px
  各项目最终宽度为：

- item-1 = 0% + 120px = 120px
- item-2 = auto + 120px = 220px
- item-3 = 200px + 60px = 260px
  当 item-1 基准值取 0% 的时候，是把该项目视为零尺寸的，故即便声明其尺寸为 140px，也并没有什么用，形同虚设

而 item-2 基准值取 auto 的时候，根据规则基准值使用值是主尺寸值即 100px，故这 100px 不会纳入剩余空间
