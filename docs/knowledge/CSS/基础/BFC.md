---
title: BFC
date: 2020-11-21
draft: true
---

### 什么是 BFC 与 IFC

BFC（Block Formatting Context）即“块级格式化上下文”， IFC（Inline Formatting Context）即行内格式化上下文。常规流（也称标准流、普通流）是一个文档在被显示时最常见的布局形态。一个框在常规流中必须属于一个格式化上下文。

BFC 决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。当涉及到可视化布局的时候，Block Formatting Context 提供了一个环境，HTML 元素在这个环境中按照一定规则进行布局。一个环境中的元素不会影响到其它环境中的布局。比如浮动元素会形成 BFC，浮动元素内部子元素的主要受该浮动元素影响，两个浮动元素之间是互不影响的。也可以说 BFC 就是一个作用范围。

在普通流中的 Box(框) 属于一种 formatting context(格式化上下文) ，类型可以是 block ，或者是 inline ，但不能同时属于这两者。并且， Block boxes(块框) 在 block formatting context(块格式化上下文) 里格式化， Inline boxes(块内框) 则在 Inline Formatting Context(行内格式化上下文) 里格式化。

### BFC、IFC、GFC、FFC：FC（Formatting Contexts），格式化上下文

`BFC` 容器里面的子元素不会在布局上影响到外面的元素，反之也是如此(只要脱离文档流，肯定就能产生 `BFC`)。

浮动元素和绝对定位元素，非块级盒子的块级容器（例如 inline-blocks, table-cells, 和 table-captions），以及 overflow 值不为 visible 的块级盒子，都会为他们的内容创建新的 BFC（块级格式上下文）。

在 BFC 中，每个盒的左外边缘都与其包含的块的左边缘相接。两个相邻的块级盒在垂直方向上的边距会发生合并（collapse）。

产生 `BFC` 方式如下

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

### 如何创建 BFC ？

1. 根元素，即 HTML 元素（最大的一个 BFC）
2. float 值不为 none 因为 css float 默认值为 none 只要设置了浮动，当前元素就创建了 BFC
3. position 默认值是 static position 的值为 absolute 或 fixed。 position 的值只要不是 static 或者 relative 就创建了一个 BFC。
4. display 的值为 inline-block、table-cell、table-caption. display 设置了跟 table 相关的 比如 table-cell
5. overflow 不为 visible 这个是最常用的。visible（默认值。内容不会被修剪，会呈现在元素框之外）.auto 或者 hidden 都可以创建一个 BFC.

### BFC 的原理（渲染规则）：

1. 内部的 Box 会在垂直方向，一个接一个地放置。
2. 属于同一个 BFC 的两个相邻的 Box 的 margin 会发生重叠
3. BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此, 文字环绕效果，设置 float
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
