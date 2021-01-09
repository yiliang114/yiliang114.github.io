---
title: 基础
date: 2020-11-21
draft: true
---

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

### 负 margin 在页面布局中的应用

https://segmentfault.com/a/1190000020046311?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com&share_user=1030000000178452

CSS 布局奇淫巧计之-强大的负边距

https://www.cnblogs.com/2050/archive/2012/08/13/2636467.html#2457812

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

### 负 margin 和 padding 分别适合什么样的场景

margin 的负值一般是用来做偏移量的
