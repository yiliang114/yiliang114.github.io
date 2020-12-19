---
layout: CustomPages
title: css3
date: 2020-11-21
aside: false
draft: true
---

# CSS3 初体验之奇技淫巧

---

自 CSS3 流行以来，虽然以前看过一遍所有的新增属性，但其实在实际项目中用到的少之又少。所以没有形成系统性的认识，以及看到效果立马就能想到解决方案的能力。然后最近正好遇到一个需要绘制大量动画的需求，所以决定趁此机会好好研究一下这个既熟悉又陌生的 css3。

在正式开始 css3 之前，先来介绍一些比较经典的`css3实例`，让大家好好感受一下 css3 的魅力，本文会提到以下几个 css3 的属性：

border-radius、::after、attr 和 content、box-sizing、linear-gradient、radial-gradient、box-shadow

# border-radius

- 相信这个属性，写过 css 的同学都知道，用来产生圆角，比如画一个圆形：

  ```
    div {
        width:100px;
        height:100px;
        background:red;
        border-radius:50px;    //圆角效果最大为长宽的一半，所以设置为50px及以上均可。
        /*border-radius:50%; */   //或者使用百分比，设置为50%及以上都是圆形效果。
    }复制代码
  ```

![img](https://lc-api-gold-cdn.xitu.io/4196b0ab5944c4f1ea44.png?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 然后我们来看看它的语法：`border-radius: [左上] [右上] [右下] [左下]`，于是我们来画一个半圆

  ```
    div {
        width: 100px;
        height: 50px;
        background: red;
        border-radius: 50px 50px 0 0;
    }复制代码
  ```

* 那如果要画一个椭圆该怎么办呢？你会发现上面的语法貌似做不到了，其实 border-radius 的值还有一种语法: `x半径/y半径`：

  ```
    div {
        width: 100px;
        height: 50px;
        background: red;
        border-radius: 50px/25px;
    }复制代码
  ```

- 如果我要画半个椭圆，又要咋办呢？

  ```
    div {
        width: 100px;
        height: 50px;
        background: red;
        border-radius: 100% 0 0 100% /50%;
    }复制代码
  ```

# ::after

这里拿个简单的例子来看，我们要画一个放大镜，如下图：

分析一下，这个放大镜可以由两个 div 组成，一个是黑色的圆环，一个是黑色把手（旋转 45 度）。所以我们就需要用两个 div 来实现吗？答案是 NO，一个 div 也是可以的，我们可以借助`::after`来添加一个元素。同理如果需要三个 div，我们还可以使用`::before`再添加一个元素。下面看一下代码：

```
div {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 5px solid #333;
    position: relative;
}
div::after {
    content: '';
    display: block;
    width: 8px;
    height: 60px;
    border-radius: 5px;
    background: #333;
    position: absolute;
    right: -22px;
    top: 38px;
    transform: rotate(-45deg);
}复制代码
```

# attr 和 content

比如我们要实现一个悬浮提示的功能。传统方法，使用 title 属性就能实现，但是现在我们要更美观，可以使用 css3 提供的`attr：能够在css中获取到元素的某个属性值，然后插入到伪元素的content中去。`

假如我们的 html 代码如下：

```
    <div data-title="hello, world">hello...</div>复制代码
```

我们来看看实现这个插件的 css 代码：

```
div {
    position: relative;
}
div:hover::after {
    content: attr(data-title);    //取到data-title属性的值
    display: inline-block;
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 5px;
    position: absolute;
    top: -50px;
    left: -30px;
}复制代码
```

当 hover 的时候，在元素尾部添加一个内容为 data-title 属性值的元素，所以就实现了 hover 显示的效果，如下图所示：

# box-sizing

我们知道，在标准盒子模型中，元素的总宽＝ content + padding + border + margin。 css 中的盒子模型大家可能都知道，但是这个盒子模型的属性可能没有那么多人知道，`box-sizing`属性就是用来重定义这个计算方式的，它有三个取值，分别是：`content-box（默认）`、`border-box`、`padding-box`

一般来说，假如我们需要有一个`占宽200px、padding10px、border5px的div`，经过计算，要这么定义样式。

```
div {
    width: 170px;   //这里的宽度要使用200-10*2-5*2 = 170得到。
    height: 50px;
    padding: 10px;
    border: 5px solid red;
}复制代码
```

然后我们来使用一下 box-sizing 属性。

```
div {
    box-sizing: border-box;
    width: 200px;  //这里的宽度就是元素所占总宽度，不需要计算
    height: 50px;
    padding: 10px;
    border: 5px solid red;
}复制代码
```

# linear-gradient

做活动页面的时候我们经常会遇到这样的需求：

顶部的中间一张大 banner 图片，然后整个区域的背景色要根据图片背景色渐变。就可以使用这个属性了。

```
div {
    width: 200px;
    height: 50px;
    background: linear-gradient(to right, red, yellow, black, green);
}复制代码
```

是不是很有趣？其实，`linear-gradient`还有更多有趣的功能，你可以根据下面的动图去感受一下：

你以为这就完了？等等，还有更强大的呢！`repeating-linear-gradient`，来感受一下：

`linear-gradient`还有更加强大的功能，比如它可以给元素添加多个渐变，从而达到更 NB 的效果。

# radial-gradient

上面的`linear-gradient`是线性渐变，这个属性是径向渐变。下面的代码实现了一个 chrome 的 logo。

```
div.chrome {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #999, 0 0 2px #ddd inset;
    background: radial-gradient(circle, #4FACF5 0, #2196F3 28%, transparent 28%),
                radial-gradient(circle, #fff 33%, transparent 33%),
                linear-gradient(-50deg, #FFEB3B 34%, transparent 34%),
                linear-gradient(60deg, #4CAF50 33%, transparent 33%),
                linear-gradient(180deg, #FF756B 0, #F44336 30%, transparent 30%),
                linear-gradient(-120deg, #FFEB3B 40%, transparent 40%),
                linear-gradient(-60deg, #FFEB3B 30%, transparent 30%),
                linear-gradient(0deg, #4CAF50 45%, transparent 45%),
                linear-gradient(60deg, #4CAF50 30%, transparent 30%),
                linear-gradient(120deg, #F44336 50%, transparent 50%),
                linear-gradient(180deg, #F44336 30%, transparent 30%);
}复制代码
```

实现原理就是使用了多个渐变色放在 div 上，友协被遮住，视觉上就产生了想要的效果，是不是很强大！看了下图你就知道其实就是在 div 上加了很多个渐变。

![img](https://lc-api-gold-cdn.xitu.io/3ce54ea0817bf4ff8084.gif?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

# box-shadow

上面的例子大都是对 css3 新属性的了解和认识，这个实例则是有关于解决方案的例子。

- 需求：我们要实现下面这个效果图（三个边框：黑色，绿色，红色）：

![img](https://lc-api-gold-cdn.xitu.io/05b9a5e336c41c36d201.png?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 解法一：假如没有 css3 知识，我们可以做这样做：用三个 div，分别设置边框，然后分别控制宽高和位置来达到这个效果。显然，很复杂，这里就不贴代码了。

- 解法二：现在我们有 css3 的知识了，借助`box-shadow`就可以轻松解决这个问题。先来看看它的语法：`box-shadow: [x偏移] [y偏移] [阴影模糊宽度] [阴影宽度] [颜色]`，并且还能添加多个阴影，使用逗号隔开。

![img](https://lc-api-gold-cdn.xitu.io/8aaee4fee8e7723b4448.gif?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

当然你还可以继续增加，四重边框，五重边框......都不再是问题啦。另外，还能加圆角，阴影会贴紧内层 div。

`使用这种方法，有一个缺点就是，不支持虚线边框。`

- 解法三： 使用 outline（只能支持两重边框）

![img](https://lc-api-gold-cdn.xitu.io/28ee989d549a334778a3.gif?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

`使用这种方法的缺点就是，只能支持两层的边框，而且还不能根据容器的border-radius自动贴合。`

# 总结

通过这段时间对 css3 的深入了解，发现 css3 真的很强大，研究起来还是挺有趣的，只有想不到，感觉没有做不到。不过为了实现很酷炫的效果，可能需要编写大量的 css 代码，这个时候使用什么技术就需要我们自己来衡量了。
