---
title: Padding&Margin
date: 2020-11-21
draft: true
---

## BFC 与 IFC

- BFC 块级格式化上下文 (Block Formatting Context)
- IFC 行内格式化上下文 (Inline Formatting Context)

### 什么是 BFC 与 IFC

BFC 决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。当涉及到可视化布局的时候，Block Formatting Context 提供了一个环境，HTML 元素在这个环境中按照一定规则进行布局。一个环境中的元素不会影响到其它环境中的布局。比如浮动元素会形成 BFC，浮动元素内部子元素的主要受该浮动元素影响，两个浮动元素之间是互不影响的。也可以说 BFC 就是一个作用范围。

在普通流中的 Box(框) 属于一种 formatting context(格式化上下文) ，类型可以是 block ，或者是 inline ，但不能同时属于这两者。并且， Block boxes(块框) 在 block formatting context(块格式化上下文) 里格式化， Inline boxes(块内框) 则在 Inline Formatting Context(行内格式化上下文) 里格式化。

`BFC` 容器里面的子元素不会在布局上影响到外面的元素，反之也是如此(只要脱离文档流，肯定就能产生 `BFC`)。

浮动元素和绝对定位元素，非块级盒子的块级容器（例如 inline-blocks, table-cells, 和 table-captions），以及 overflow 值不为 visible 的块级盒子，都会为他们的内容创建新的 BFC（块级格式上下文）。

在 BFC 中，每个盒的左外边缘都与其包含的块的左边缘相接。两个相邻的块级盒在垂直方向上的边距会发生合并（collapse）。

产生 `BFC` 方式如下

- 根元素，即 HTML 元素（最大的一个 BFC）
- `float` 的值不为 `none`。（产生浮动）
- `overflow` 的值不为 `visible`。
- `position` 的值不为 `relative` 和 `static`。
- `display` 的值为 `table-cell`, `table-caption`, `inline-block`中的任何一个。

用处：

常见的多栏布局，结合块级别元素浮动，里面的元素则是在一个相对隔离的环境里运行

`IFC`：`IFC` 的 `line` `box`（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的 `padding/margin` 影响)。

> `IFC`中的`line box`一般左右都贴紧整个 `IFC`，但是会因为 `float` 元素而扰乱。`float` 元素会位于 IFC 与 `line box` 之间，使得 `line box` 宽度缩短。 同个 `ifc` 下的多个 `line box` 高度会不同。 `IFC`中时不可能有块级元素的，当插入块级元素时（如 `p` 中插入 `div`）会产生两个匿名块与 `div` 分隔开，即产生两个 `IFC` ，每个 `IFC` 对外表现为块级元素，与 `div` 垂直排列。

用处：

- 水平居中：当一个块要在环境中水平居中时，设置其为 `inline-block` 则会在外层产生`IFC`，通过 `text-align` 则可以使其水平居中。
- 垂直居中：创建一个 `IFC`，用其中一个元素撑开父元素的高度，然后设置其 `vertical-align`: `middle`，其他行内元素则可以在此父元素下垂直居中

### IFC 作用

水平居中：当一个块要在环境中水平居中时，设置其为 inline-block 则会在外层产生 IFC，通过 text-align 则可以使其水平居中。
垂直居中：创建一个 IFC，用其中一个元素撑开父元素的高度，然后设置其 vertical-align:middle，其他行内元素则可以在此父元素下垂直居中。

### BFC 的原理（渲染规则）：

1. BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此, 文字环绕效果，设置 float
2. 内部的 Box 会在垂直方向，一个接一个地放置。
3. 属于同一个 BFC 的两个相邻的 Box 的 margin 会发生重叠
4. BFC 的区域不会与 float box 重叠。
5. 计算 BFC 的高度，浮动元素也参与计算

### BFC 的使用场景？

1. 能够取消垂直外边距重叠的问题。阻止父子元素的 margin 折叠
2. 解决 float 布局中高度超出内容不符合预期的情况（根据 BFC 元素与浮动元素不重叠原理）
3. 清除浮动（子元素是浮动，父元素是浮动元素， 父元素设置成一个 BFC 块子元素就能撑起父元素，子元素参与父元素高度计算）清除内部浮动 （撑开高度）
   原理: 触发父 div 的 BFC 属性，使下面的子 div 都处在父 div 的同一个 BFC 区域之内
4. 避免文字环绕
5. 分属于不同的 BFC 时，可以阻止 margin 重叠
6. 多列布局中使用 BFC,自适用两列布局
7. 可以包含浮动元素，不被浮动元素覆盖
8. 解决面积重合的问题

### BFC 的应用

#### 举例 1 解决 margin 重叠

> 当父元素和子元素发生 `margin` 重叠时，解决办法：**给子元素或父元素创建 BFC**。

比如说，针对下面这样一个 `div` 结构：

```html
<div class="father">
  <p class="son"></p>
</div>
```

> 上面的`div`结构中，如果父元素和子元素发生`margin`重叠，我们可以给子元素创建一个 `BFC`，就解决了：

```html
<div class="father">
  <p class="son" style="overflow: hidden"></p>
</div>
```

> 因为**第二条：BFC 区域是一个独立的区域，不会影响外面的元素**。

#### 举例 2 BFC 区域不与 float 区域重叠：

针对下面这样一个 div 结构；

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <style>
      .father-layout {
        background: pink;
      }

      .father-layout .left {
        float: left;
        width: 100px;
        height: 100px;
        background: green;
      }

      .father-layout .right {
        height: 150px; /*右侧标准流里的元素，比左侧浮动的元素要高*/
        background: red;
      }
    </style>
  </head>
  <body>
    <section class="father-layout">
      <div class="left">
        左侧，生命壹号
      </div>
      <div class="right">
        右侧，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，
      </div>
    </section>
  </body>
</html>
```

效果如下：

![](http://img.smyhvae.com/20180306_0825.png)

> 上图中，由于右侧标准流里的元素，比左侧浮动的元素要高，导致右侧有一部分会跑到左边的下面去。

##### 如果要解决这个问题，可以将右侧的元素创建 BFC**，因为**第三条：BFC 区域不与`float box`区域重叠\*\*。解决办法如下：（将 right 区域添加 overflow 属性）

```html
<div class="right" style="overflow: hidden">
  右侧，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，smyhvae，
</div>
```

![](http://img.smyhvae.com/20180306_0827.png)

上图表明，解决之后，`father-layout`的背景色显现出来了，说明问题解决了。

#### 举例 3 清除浮动

现在有下面这样的结构：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <style>
      .father {
        background: pink;
      }

      .son {
        float: left;
        background: green;
      }
    </style>
  </head>
  <body>
    <section class="father">
      <div class="son">
        生命壹号
      </div>
    </section>
  </body>
</html>
```

效果如下：

![](http://img.smyhvae.com/20180306_0840.png)

上面的代码中，儿子浮动了，但由于父亲没有设置高度，导致看不到父亲的背景色（此时父亲的高度为 0）。正所谓**有高度的盒子，才能关住浮动**。

> 如果想要清除浮动带来的影响，方法一是给父亲设置高度，然后采用隔墙法。方法二是 BFC：给父亲增加 `overflow=hidden`属性即可， 增加之后，效果如下：

![](http://img.smyhvae.com/20180306_0845.png)

> 为什么父元素成为 BFC 之后，就有了高度呢？这就回到了**第四条：计算 BFC 的高度时，浮动元素也参与计算**。意思是，\*\*在计算 BFC 的高度时，子元素的 float box 也会参与计算

### BFC 两栏布局

```html
    <style>
      .left {
        width: 200px;
        height: 500px;
        float: left;
        background: #999;
      }
      .main {
        height: 800px;
        background: #aaa;
        overflow: auto;
        color: #fff;
      }
    </style>
  </head>
  <body>
    <div class="left"></div>
    <div class="main">
      <h1>BFC 两栏布局</h1>
      <p>
        左侧块浮动到左边，但是因为是浮动块，右侧块高度一旦超过左侧块后文字就会出现在左侧的下方，因为没有块把它挡住。
      </p>
      <p>
        解决办法：
        让右侧块变为BFC文字就不会横过去。因为BFC元素不与Float元素相重叠。
      </p>
    </div>
  </body>
```

### 多栏布局的一种方式

- 上文提到的一条规则：与浮动元素相邻的已生成 BFC 的元素不能与浮动元素互相覆盖。利用该特性可以作为多栏布局的一种实现方式。

- 这种布局的特点在于左右俩栏的宽度固定，中间栏可以根据浏览器宽度自适应。

  ![img](https:////upload-images.jianshu.io/upload_images/1606281-f440a960de13410f.png?imageMogr2/auto-orient/strip|imageView2/2/w/609/format/webp)

  多栏布局

- IE 中也有与 BFC 类似概念的 haslayout。

### BFC 的原理/BFC 的布局规则

> `BFC` 的原理，其实也就是 `BFC` 的渲染规则（能说出以下四点就够了）。包括：

1. BFC **内部的**子元素，在垂直方向，**边距会发生重叠**。
2. BFC 在页面中是独立的容器，外面的元素不会影响里面的元素，反之亦然。（稍后看`举例1`）
3. **BFC 区域不与旁边的`float box`区域重叠**。（可以用来清除浮动带来的影响）。（稍后看`举例2`）
4. 计算`BFC`的高度时，浮动的子元素也参与计算。（稍后看`举例3`）

### 为什么内联元素的层叠顺序要比块状元素高

内联元素一般都是基于语义级(semantic)的基本元素，它只能容纳文本或者其他内联元素，通常被包括在块元素中使用，常见内联元素有“a、b、br”等,基本上可以说成内联元素变成了块状元素的子元素，所以子元素也就是内联元素要高于块状元素

1. 行内块的级别比块级元素的层级高，行内块能覆盖块
2. z-index 不能和和 float 一起使用，因为他的层级已经规定在 z-index：0；和 z-index 负数之间

### 请阐述`z-index`属性，并说明如何形成层叠上下文（stacking context）。

CSS 中的`z-index`属性控制重叠元素的垂直叠加顺序。`z-index`只能影响`position`值不是`static`的元素。

没有定义`z-index`的值时，元素按照它们出现在 DOM 中的顺序堆叠（层级越低，出现位置越靠上）。非静态定位的元素（及其子元素）将始终覆盖静态定位（static）的元素，而不管 HTML 层次结构如何。

层叠上下文是包含一组图层的元素。 在一组层叠上下文中，其子元素的`z-index`值是相对于该父元素而不是 document root 设置的。每个层叠上下文完全独立于它的兄弟元素。如果元素 B 位于元素 A 之上，则即使元素 A 的子元素 C 具有比元素 B 更高的`z-index`值，元素 C 也永远不会在元素 B 之上.

每个层叠上下文是自包含的：当元素的内容发生层叠后，整个该元素将会在父层叠上下文中按顺序进行层叠。少数 CSS 属性会触发一个新的层叠上下文，例如`opacity`小于 1，`filter`不是`none`，`transform`不是`none`。

### 描述 z-index 和叠加上下文是如何形成的。

层叠上下文，就是在呈现的时候决定哪个元素在上、哪个元素在下。在一个层叠上下文，所有的元素根据规则从下到上排列，分成了七个等级：

1. 背景和边框 — 形成层叠上下文的元素的背景和边框。 层叠上下文中的最低等级。
2. 负 z-index 值 — 层叠上下文内有着负 z-index 值的子元素。
3. 块级盒 — 文档流中非行内非定位子元素。
4. 浮动盒 — 非定位浮动元素。
5. 行内盒 — 文档流中行内级别非定位子元素。
6. z-index: 0 — 定位元素。这些元素形成了新的层叠上下文。
7. 正 z-index 值 — 定位元素。层叠上下文中的最高等级

层叠上下文是具有包含关系的，同时又各自应用层叠规则而互不影响，也就是说一个层叠上下文中有一个 z-index 值很大的定位元素，它依然会处于层叠等级高于创建该层叠上下文元素的元素的下方.

z-index: 每个元素都具有三维空间位置，除了水平和垂直位置外，还能在 "Z 轴" 上层层相叠、排列。元素在 "Z 轴" 方向上的呈现顺序，由层叠上下文和层叠级别决定。在文档中，每个元素仅属于一个层叠上下文。元素的层叠级别为整型，它描述了在相同层叠上下文中元素在 "Z 轴" 上的呈现顺序。同一层叠上下文中，层叠级别大的显示在上，层叠级别小的显示在下，相同层叠级别时，遵循后来居上的原则，即其在 HTML 文档中的顺序。不同层叠上下文中，元素呈现顺序以父级层叠上下文的层叠级别来决定呈现的先后顺序，与自身的层叠级别无关

解决方案：

1. 如果两个元素都没有定位发生位置重合现象或者两个都已定位元素且 z-index 相同发生位置重合现象，那么按文档流顺序，后面的覆盖前面的。
2. 如果两个元素都没有设置 z-index，使用默认值，一个定位一个没有定位，那么定位元素覆盖未定位元素
3. 如果父元素 z-index 有效，那么子元素无论是否设置 z-index 都和父元素一致，在父元素上方
4. 如果父元素 z-index 失效（未定位或者使用默认值），那么定位子元素的 z-index 设置生效 5,如果兄弟元素的 z-index 生效，那么其子元素覆盖关系有父元素决定

## margin

### 上下 margin 重合的问题

在重合元素外包裹一层容器，并触发该容器生成一个 BFC。

例子：

```html
<div class="aside"></div>
<div class="text">
  <div class="main"></div>
</div>
```

```css
.aside {
  margin-bottom: 100px;
  width: 100px;
  height: 150px;
  background: #f66;
}
.main {
  margin-top: 100px;
  height: 200px;
  background: #fcc;
}
.text {
  /* 盒子main的外面包一个div，通过改变此div的属性使两个盒子分属于两个不同的BFC，以此来阻止margin重叠 */
  /* 此时已经触发了BFC属性 */
  overflow: hidden;
}
```

### margin 叠加几种情况

margin 叠加的意思是：当两个或者更多的垂直外边距 相遇时，它们将形成一个外边距，这个外边距的高度等于两个发生叠加的外边距中高度较大者。

1. 当一个元素出现在另一个元素上面时，第一个元素的底边外边距与第二个元素的顶边外边距发生叠加。如图：
   ![叠加](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/marginSuperposition1.png)

2. 当一个元素在另一个元素中时，它们的顶边距和低边距也会发生叠加
   ![叠加2](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/marginSuperposition2.png)

3. 如果一个元素是空元素（即一个元素没有内容，内边距和边框），这种情况外边距的顶边距和低边距碰在一起也会发生叠加
   ![叠加3](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/marginSuperposition3.png)

4. 在上面那种空元素的情况，如果该空元素与另一个元素的外边距碰在一起，也会发生叠加。
   ![叠加4](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/marginSuperposition4.png)

以上 4 种外边距叠加情况**只会发生在普通文档流的垂直方向**。行内框、浮动框、绝对定位框之间的外边距不会发生叠加，同样水平方向也不会发生叠加。

### 如何解决多个元素重叠问题？

使用 z-index 属性可以设置元素的层叠顺序
z-index 属性
语法：z-index: auto | <integer>
默认值：auto
适用于：定位元素。即定义了 position 为非 static 的元素
取值：
auto： 元素在当前层叠上下文中的层叠级别是 0。元素不会创建新的局部层叠上下文，除非它是根元素。
整数： 用整数值来定义堆叠级别。可以为负值。 说明：
检索或设置对象的层叠顺序。
z-index 用于确定元素在当前层叠上下文中的层叠级别，并确定该元素是否创建新的局部层叠上下文。
当多个元素层叠在一起时，数字大者将显示在上面。

### 外边距折叠(collapsing margins)

外边距合并指的是，当两个垂直外边距相遇时，它们将形成一个外边距.

外边距重叠就是 margin-collapse。 毗邻的两个或多个 margin 会合并成一个 margin，叫做外边距折叠。规则如下：

折叠结果遵循下列计算规则：

- 两个相邻的外边距都是正数时，折叠结果是它们两者之间较大的值
- 两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值
- 两个外边距一正一负时，折叠结果是两者的相加的和

1. 两个或多个毗邻的普通流中的块元素垂直方向上的 margin 会折叠
2. 浮动元素/inline-block 元素/绝对定位元素的 margin 不会和垂直方向上的其他元素的 margin 折叠
3. 创建了块级格式化上下文的元素，不会和它的子元素发生 margin 折叠
4. 元素自身的 margin-bottom 和 margin-top 相邻时也会折叠

#### 标准文档流中，竖直方向的 margin 不叠加，只取较大的值作为 margin\*\*(水平方向的`margin`是可以叠加的，即水平方向没有塌陷现象)。

> PS：如果不在标准流，比如盒子都浮动了，那么两个盒子之间是没有`margin`重叠的现象的。

> 我们来看几个例子。

#### 兄弟元素之间

如下图所示：

![](http://img.smyhvae.com/20170805_0904.png)

#### 子元素和父元素之间

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      .father {
        background: green;
      }

      /* 给儿子设置margin-top为10像素 */
      .son {
        height: 100px;
        margin-top: 10px;
        background: red;
      }
    </style>
  </head>
  <body>
    <div class="father">
      <div class="son"></div>
    </div>
  </body>
</html>
```

> 上面的代码中，儿子的`height`是 `100p`x，`magin-top` 是`10px`。注意，此时父亲的 `height` 是`100`，而不是`110`。因为儿子和父亲在竖直方向上，共一个`margin`。

儿子这个盒子：

![](http://img.smyhvae.com/20180305_2216.png)

父亲这个盒子：

![](http://img.smyhvae.com/20180305_2217.png)

> 上方代码中，如果我们给父亲设置一个属性：`overflow: hidden`，就可以避免这个问题，此时父亲的高度是 110px，这个用到的就是 BFC（下一段讲解）。

#### 善于使用父亲的 padding，而不是儿子的 margin

> 其实，这一小段讲的内容与上一小段相同，都是讲父子之间的 margin 重叠。

我们来看一个奇怪的现象。现在有下面这样一个结构：（`div`中放一个`p`）

```html
<div>
  <p></p>
</div>
```

> 上面的结构中，我们尝试通过给儿子`p`一个`margin-top:50px;`的属性，让其与父亲保持 50px 的上边距。结果却看到了下面的奇怪的现象：

![](http://img.smyhvae.com/20170806_1537.png)

> 此时我们给父亲`div`加一个`border`属性，就正常了：

![](http://img.smyhvae.com/20170806_1544.png)

> 如果父亲没有`border`，那么儿子的`margin`实际上踹的是“流”，踹的是这“行”。所以，父亲整体也掉下来了。

#### margin 这个属性，本质上描述的是兄弟和兄弟之间的距离； 最好不要用这个 marign 表达父子之间的距离。

> 所以，如果要表达父子之间的距离，我们一定要善于使用父亲的 padding，而不是儿子的`margin。

### 行内(inline)元素 设置`margin-top`和`margin-bottom` 是否起作用？

不起作用。(答案是起作用，个人觉得不对。)

html 里的元素分为替换元素（replaced element）和非替换元素（non-replaced element）。

- 替换元素是指用作为其他内容占位符的一个元素。最典型的就是`img`，它只是指向一个图像文件。以及大多数表单元素也是替换，例如`input`等。
- 非替换元素是指内容包含在文档中的元素。例如，如果一个段落的文本内容都放在该元素本身之内，则这个段落就是一个非替换元素。

讨论`margin-top`和`margin-bottom`对行内元素是否起作用，则要对行内替换元素和行内非替换元素分别讨论。

首先我们应该明确外边距可以应用到行内元素，规范中是允许的，不过由于在向一个行内非替换元素应用外边距，对行高(line-height)没有任何影响。由于外边距实际上是透明的。所以对声明`margin-top`和`margin-bottom`没有任何视觉效果。其原因就在于行内非替换元素的外边距不会改变一个元素的行高。而对于行内非替换元素的左右边距则不是这样，是有影响的。

而为替换元素设置的外边距会影响行高，可能会使行高增加或减少，这取决于上下外边距的值。行内替换元素的左右边距与非替换元素的左右边距的作用一样。

### css:两个块状元素上下的 margin-top 和 margin-bottom 会重叠。啥原因？怎么解决？（应该给父类元素添加 BFC）

原因在于 div1 的 margin-bottom 的参照元素是 div2-1，而 div2-1 的 margin-top 的参照元素恰好是 div1，这就导致了它俩之间的间距就会以两值中最大的那个为实际效果。

### margin 和 padding 分别适合什么场景使用？

- margin 是用来隔开元素与元素的间距；padding 是用来隔开元素与内容的间隔。
- margin 用于布局分开元素使元素与元素互不相干；
- padding 用于元素与内容之间的间隔，让内容（文字）与（包裹）元素之间有一段

### margin 重叠

margin 的这一特性——纵向重叠。如 `<p>` 的纵向 margin 是 16px，那么两个 `<p>` 之间纵向的距离是多少?—— 按常理来说应该是 16 + 16 = 32px，但是答案仍然是 16px。因为纵向的 margin 是会重叠的，如果两者不一样大 的话，大的会把小的“吃掉”。

解决 margin 重叠的问题是创建 BFC。例如父容器如果是 `display: flex;flex-direction: column;` 的形式，垂直方向排列下来，margin 也是不会重叠的， 需要额外使用 first or last 之类的伪类额外处理样式才可以。

## 负 margin

### 负 margin 在页面布局中的应用

#### 1. 左右列固定，中间列自适应布局

此例适用于左右栏宽度固定，中间栏宽度自适应的布局。由于网页的主体部分一般在中间，很多网页都需要中间列优先加载，而这种布局刚好满足此需求。

```html
<div class="main">
  <div class="main_body">Main</div>
</div>
<div class="left">Left</div>
<div class="right">Right</div>
```

```css
body {
  margin: 0;
  padding: 0;
  min-width: 600px;
}
.main {
  float: left;
  width: 100%;
}
.main_body {
  margin: 0 210px;
  background: #888;
  height: 200px;
}
.left,
.right {
  float: left;
  width: 200px;
  height: 200px;
  background: #f60;
}
.left {
  margin-left: -100%;
}
.right {
  margin-left: -200px;
}
```

效果：

![img](https://pic002.cnblogs.com/images/2012/389001/2012082812531391.png)

#### 2. 去除列表右边框

项目中经常会使用浮动列表展示信息，为了美观通常为每个列表之间设置一定的间距（margin-right）,当父元素的宽度固定式，每一行的最右端的 li 元素的右边距就多余了，去除的方法通常是为最右端的 li 添加 class，设置*margin-right:0;* 这种方法需要动态判断为哪些 li 元素添加 class，麻烦！！！利用负 margin 就可以实现下面这种效果：

```html
<div id="test">
  <ul>
    <li>子元素1</li>
    <li>子元素2</li>
    <li>子元素3</li>
    <li>子元素4</li>
    <li>子元素5</li>
    <li>子元素6</li>
  </ul>
</div>
```

```css
body,
ul,
li {
  padding: 0;
  margin: 0;
}
ul,
li {
  list-style: none;
}
#test {
  width: 320px;
  height: 210px;
  background: #ccc;
}
#test ul {
  margin-right: -10px;
  zoom: 1;
}
#test ul li {
  width: 100px;
  height: 100px;
  background: #f60;
  margin-right: 10px;
  margin-bottom: 10px;
  float: left;
}
```

效果：

![img](https://pic002.cnblogs.com/images/2012/389001/2012082812544719.png)

#### 3. 负边距+定位：水平垂直居中

使用绝对定位将 div 定位到 body 的中心，然后使用负 margin（content 宽高的一半），将 div 的中心拉回到 body 的中心，已到达水平垂直居中的效果。

```html
<div id="test"></div>
```

```css
body {
  margin: 0;
  padding: 0;
}
#test {
  width: 200px;
  height: 200px;
  background: #f60;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -100px;
}
```

效果：

![img](https://pic002.cnblogs.com/images/2012/389001/2012082812561561.png)

#### 4. 去除列表最后一个 li 元素的 border-bottom

列表中我们经常会添加 border-bottom 值，最后一个 li 的 border-bottom 往往会与外边框重合，视觉上不雅观，往往要移除。

```html
<ul id="test">
  <li>Test</li>
  <li>Test</li>
  <li>Test</li>
  <li>Test</li>
  <li>Test</li>
</ul>
```

```css
body,
ul,
li {
  margin: 0;
  padding: 0;
}
ul,
li {
  list-style: none;
}
#test {
  margin: 20px;
  width: 390px;
  background: #f4f8fc;
  border-radius: 3px;
  border: 2px solid #d7e2ec;
}
#test li {
  height: 25px;
  line-height: 25px;
  padding: 5px;
  border-bottom: 1px dotted #d5d5d5;
  margin-bottom: -1px;
}
```

效果：

![img](https://pic002.cnblogs.com/images/2012/389001/2012082812574768.png)

#### 5. 多列等高

此例关键是给每个框设置大的底部内边距，然后用数值相似的负外边距消除这个高度。这会导致每一列溢出容器元素，如果把外包容器的 overflow 属性设为 hidden，列就在最高点被裁切。

```html
<div id="wrap">
  <div id="left">
    <p style="height:50px">style="height:50px"</p>
  </div>
  <div id="center">
    <p style="height:100px">style="height:100px"</p>
  </div>
  <div id="right">
    <p style="height:200px">style="height:200px"</p>
  </div>
</div>
```

```css
body,
p {
  margin: 0;
  padding: 0;
}
#wrap {
  overflow: hidden;
  width: 580px;
  margin: 0 auto;
}
#left,
#center,
#right {
  margin-bottom: -200px;
  padding-bottom: 200px;
}
#left {
  float: left;
  width: 140px;
  background: #777;
}
#center {
  float: left;
  width: 300px;
  background: #888;
}
#right {
  float: right;
  width: 140px;
  background: #999;
}
p {
  color: #fff;
  text-align: center;
}
```

效果：

![img](https://pic002.cnblogs.com/images/2012/389001/2012082813072672.png)

## padding

### 对内联元素设置`padding-top`和`padding-bottom`是否会增加它的高度？

不会。对于行内元素，设置左右内边距，左右内边距将是可见的。而设置上下内边距，设置背景颜色后可以看见内边距区域有增加，对于行内非替换元素，不会影响其行高，不会撑开父元素。而对于替换元素，则撑开了父元素。

### padding 百分比是相对于父级宽度还是自身的宽度
