---
layout: CustomPages
title: css3
date: 2020-11-21
aside: false
draft: true
---

# 个人总结（css3 新特性）

## 1.前言

css3 这个相信大家不陌生了，是个非常有趣，神奇的东西！有了 css3，js 都可以少写很多！我之前也写过关于 css3 的文章，也封装过 css3 的一些小动画。个人觉得 css3 不难，但是很难用得好，用得顺手，最近我也在过一遍 css3 的一些新特性（不是全部，是我在工作上常用的，或者觉得有用的），以及一些实例，就写了这一篇总结！希望，这篇文章能帮到大家认识 css3。写这篇文章主要是让大家能了解 css3 的一些新特性，以及基础的用法，感觉 css3 的魅力！如果想要用好 css3，这个得靠大家继续努力学习，寻找一些讲得更深入的文章或者书籍了！如果大家有什么其他特性推荐的，欢迎补充！大家一起学习，进步！

> 看这篇文章，代码可以不用看得过于仔细！这里主要是想让大家了解 css3 的新特性！代码也是很基础的用法。我给出代码主要是让大家在浏览器运行一下，让大家参考和调试。不要只看代码，只看代码的话，不会知道哪个代码有什么作用的，建议边看效果边看代码。

## 2.过渡

过渡，是我在项目里面用得最多的一个特性了！也相信是很多人用得最多的一个例子！我平常使用就是想让一些交互效果（主要是 hover 动画），变得生动一些，不会显得那么生硬！好了，下面进入正文！

引用菜鸟教程的说法：CSS3 过渡是元素从一种样式逐渐改变为另一种的效果。要实现这一点，必须规定两项内容：指定要添加效果的 CSS 属性指定效果的持续时间。

### 2-1 语法

```
transition： CSS属性，花费时间，效果曲线(默认ease)，延迟时间(默认0)复制代码
```

栗子 1

```
/*宽度从原始值到制定值的一个过渡，运动曲线ease,运动时间0.5秒，0.2秒后执行过渡*/
transition：width,.5s,ease,.2s复制代码
```

栗子 2

```
/*所有属性从原始值到制定值的一个过渡，运动曲线ease,运动时间0.5秒*/
transition：all,.5s
复制代码
```

上面栗子是简写模式，也可以分开写各个属性（这个在下面就不再重复了）

```
transition-property: width;
transition-duration: 1s;
transition-timing-function: linear;
transition-delay: 2s;
复制代码
```

### 2-2 实例-hover 效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf406a612547d?imageslim)

上面两个按钮，第一个使用了过渡，第二个没有使用过渡，大家可以看到当中的区别，用了过渡之后是不是没有那么生硬，有一个变化的过程，显得比较生动。
当然这只是一个最简单的过渡栗子，两个按钮的样式代码，唯一的区别就是，第一个按钮加了过渡代码`transition: all .5s;`

### 2-3 实例-下拉菜单

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf406a38c5137?imageslim)

上面两个菜单，第一个没有使用过渡，第二个使用过渡，大家明显看到区别，使用了过渡看起来也是比较舒服！代码区别就是有过渡的 ul 的上级元素(祖先元素)有一个类名（ul-transition）。利用这个类名，设置 ul 的过渡`.ul-transition ul{transform-origin: 0 0;transition: all .5s;}`

可能大家不知道我在说什么！我贴下代码吧

html

```
<div class="demo-hover demo-ul t_c">
    <ul class="fllil">
        <li>
            <a href="javascript:;">html</a>
            <ul>
                <li><a href="#">div</a></li>
                <li><a href="#">h1</a></li>
            </ul>
        </li>
        <li>
            <a href="javascript:;">js</a>
            <ul>
                <li><a href="#">string</a></li>
                <li><a href="#">array</a></li>
                <li><a href="#">object</a></li>
                <li><a href="#">number</a></li>
            </ul>
        </li>
        <li>
            <a href="javascript:;">css3</a>
            <ul>
                <li><a href="#">transition</a></li>
                <li><a href="#">animation</a></li>
            </ul>
        </li>
        <li>
            <a href="javascript:;">框架</a>
            <ul>
                <li><a href="#">vue</a></li>
                <li><a href="#">react</a></li>
            </ul>
        </li>
    </ul>
    <div class="clear"></div>
</div>
<div class="demo-hover demo-ul ul-transition t_c">
    <ul class="fllil">
        <li>
            <a href="javascript:;">html</a>
            <ul>
                <li><a href="#">div</a></li>
                <li><a href="#">h1</a></li>
            </ul>
        </li>
        <li>
            <a href="javascript:;">js</a>
            <ul>
                <li><a href="#">string</a></li>
                <li><a href="#">array</a></li>
                <li><a href="#">object</a></li>
                <li><a href="#">number</a></li>
            </ul>
        </li>
        <li>
            <a href="javascript:;">css3</a>
            <ul>
                <li><a href="#">transition</a></li>
                <li><a href="#">animation</a></li>
            </ul>
        </li>
        <li>
            <a href="javascript:;">框架</a>
            <ul>
                <li><a href="#">vue</a></li>
                <li><a href="#">react</a></li>
            </ul>
        </li>
    </ul>
    <div class="clear"></div>
</div>
复制代码
```

css

```
.demo-ul{margin-bottom: 300px;}
    .demo-ul li{
        padding: 0 10px;
        width: 100px;
        background: #f90;
        position: relative;
    }
    .demo-ul li a{
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
    }
    .demo-ul li ul{
        position: absolute;
        width: 100%;
        top: 40px;
        left: 0;
        transform: scaleY(0);
        overflow: hidden;
    }
    .ul-transition ul{
        transform-origin: 0 0;
        transition: all .5s;
    }
    .demo-ul li:hover ul{
        transform: scaleY(1);
    }
    .demo-ul li ul li{
        float: none;
        background: #0099ff;

}
复制代码
```

上面两个可以说是过渡很基础的用法，过渡用法灵活，功能也强大，结合 js，可以很轻松实现各种效果（焦点图，手风琴）等，以及很多意想不到的效果。这个靠大家要去挖掘！

## 3.动画

动画这个平常用的也很多，主要是做一个预设的动画。和一些页面交互的动画效果，结果和过渡应该一样，让页面不会那么生硬！

### 3-1.语法

```
animation：动画名称，一个周期花费时间，运动曲线（默认ease），动画延迟（默认0），播放次数（默认1），是否反向播放动画（默认normal），是否暂停动画（默认running）复制代码
```

栗子 1

```
/*执行一次logo2-line动画，运动时间2秒，运动曲线为 linear*/
animation: logo2-line 2s linear;复制代码
```

栗子 2

```
/*2秒后开始执行一次logo2-line动画，运动时间2秒，运动曲线为 linear*/
animation: logo2-line 2s linear 2s;复制代码
```

栗子 3

```
/*无限执行logo2-line动画，每次运动时间2秒，运动曲线为 linear，并且执行反向动画*/
animation: logo2-line 2s linear alternate infinite;复制代码
```

还有一个重要属性

```
animation-fill-mode : none | forwards | backwards | both;
/*none：不改变默认行为。
forwards ：当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）。
backwards：在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）。
both：向前和向后填充模式都被应用。  */      复制代码
```

### 3-2.logo 展示动画

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf406b0855a99?imageslim)

这个是我用公司 logo 写的动画，没那么精细

代码如下

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="reset.css">
</head>
<style>
.logo-box{
    width: 600px;
    margin: 100px auto;
    font-size: 0;
    position: relative;
}
.logo-box div{
    display: inline-block;
}
.logo-box .logo-text{
    margin-left: 10px;
}
.logo-box .logo1{
    animation: logo1 1s ease-in 2s;
    animation-fill-mode:backwards;
}
.logo-box .logo-text{
    animation: logoText 1s ease-in 3s;
    animation-fill-mode:backwards;
}
.logo-box .logo2{
    position: absolute;
    top: 20px;
    left: 20px;
    animation: logo2-middle 2s ease-in;
}
.logo-box .logo2 img{
    animation: logo2-line 2s linear;
}
@keyframes logo1 {
    0%{
        transform:rotate(180deg);
        opacity: 0;
    }
    100%{
        transform:rotate(0deg);
        opacity: 1;
    }
}
@keyframes logoText {
    0%{
        transform:translateX(30px);
        opacity: 0;
    }
    100%{
        transform:translateX(0);
        opacity: 1;
    }
}
@keyframes logo2-line {
    0% { transform: translateX(200px)}
    25% { transform: translateX(150px)}
    50% { transform: translateX(100px)}
    75% { transform: translateX(50px)}
    100% { transform: translateX(0); }
}

@keyframes logo2-middle {
    0% { transform: translateY(0);     }
    25% { transform: translateY(-100px);     }
    50% { transform: translateY(0);     }
    75% { transform: translateY(-50px);     }
    100% { transform: translateY(0); }
}
</style>
<body>
<div class="logo-box">
<div class="logo1"><img src="logo1.jpg"/></div>
<div class="logo2"><img src="logo2.jpg"/></div>
<div class="logo-text"><img src="logo3.jpg"/></div>
</div>

<div class="wraper"><div class="item"></div></div>

</body>
</html>
复制代码
```

下面让大家看一个专业级别的

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf406a3af6c0a?imageslim)

代码如下

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<style>
    body {
        font-family: Arial,"Helvetica Neue",Helvetica,sans-serif;
        overflow: hidden;
        background: #fff;
    }

    .center {
        margin: 80px auto;
    }

    .so {
        display: block;
        width: 500px;
        height: 156px;
        background: #ffffff;
    }
    .so .inner {
        width: 500px;
        height: 156px;
        position: absolute;
    }
    .so .inner * {
        position: absolute;
        animation-iteration-count: infinite;
        animation-duration: 3.5s;
    }
    .so .inner .name {
        position: absolute;
        font-size: 54px;
        left: 130px;
        top: 95px;
    }
    .so .inner .name .b {
        font-weight: bold;
    }
    .so .inner .stack-box {
        top: 100px;
        width: 115px;
        height: 56px;
    }
    .so .inner .box {
        width: 115px;
        height: 56px;
        left: 0px;
    }
    .so .inner .box div {
        background: #BCBBBB;
    }
    .so .inner .box .bottom {
        bottom: 0px;
        left: 0px;
        width: 115px;
        height: 12px;
    }
    .so .inner .box .left {
        bottom: 11px;
        left: 0px;
        width: 12px;
        height: 34px;
    }
    .so .inner .box .right {
        bottom: 11px;
        left: 103px;
        width: 12px;
        height: 34px;
    }
    .so .inner .box .top {
        top: 0px;
        left: 0px;
        width: 0;
        height: 12px;
    }
    .so .inner .stack {
        left: 22px;
        top: 22px;
    }
    .so .inner .stack .inner-item {
        background: #F48024;
        width: 71px;
        height: 12px;
    }
    .so .inner .stack .item {
        transition: transform 0.3s;
        width: 291px;
    }
    .so .inner .stack div:nth-child(1) {
        transform: rotate(0deg);
    }
    .so .inner .stack div:nth-child(2) {
        transform: rotate(12deg);
    }
    .so .inner .stack div:nth-child(3) {
        transform: rotate(24deg);
    }
    .so .inner .stack div:nth-child(4) {
        transform: rotate(36deg);
    }
    .so .inner .stack div:nth-child(5) {
        transform: rotate(48deg);
    }
    .so .inner .box {
        animation-name: box;
    }
    .so .inner .box .top {
        animation-name: box-top;
    }
    .so .inner .box .left {
        animation-name: box-left;
    }
    .so .inner .box .right {
        animation-name: box-right;
    }
    .so .inner .box .bottom {
        animation-name: box-bottom;
    }
    .so .inner .stack-box {
        animation-name: stack-box;
    }
    .so .inner .stack {
        animation-name: stack;
    }
    .so .inner .stack .inner-item {
        animation-name: stack-items;
    }
    .so .inner .stack .item:nth-child(1) {
        animation-name: stack-item-1;
    }
    .so .inner .stack .item:nth-child(2) {
        animation-name: stack-item-2;
    }
    .so .inner .stack .item:nth-child(3) {
        animation-name: stack-item-3;
    }
    .so .inner .stack .item:nth-child(4) {
        animation-name: stack-item-4;
    }
    .so .inner .stack .item:nth-child(5) {
        animation-name: stack-item-5;
    }
    @keyframes stack {
        0% {
            left: 22px;
        }
        15% {
            left: 22px;
        }
        30% {
            left: 52px;
        }
        50% {
            left: 52px;
        }
        80% {
            left: 22px;
        }
    }
    @keyframes stack-item-1 {
        0% {
            transform: rotate(12deg * 0);
        }
        10% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(0deg);
        }
        54% {
            transform: rotate(0deg);
        }
        92% {
            transform: rotate(12deg * 0);
        }
    }
    @keyframes stack-item-2 {
        0% {
            transform: rotate(12deg * 1);
        }
        10% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(0deg);
        }
        54% {
            transform: rotate(0deg);
        }
        92% {
            transform: rotate(12deg * 1);
        }
    }
    @keyframes stack-item-3 {
        0% {
            transform: rotate(12deg * 2);
        }
        10% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(0deg);
        }
        54% {
            transform: rotate(0deg);
        }
        92% {
            transform: rotate(12deg * 2);
        }
    }
    @keyframes stack-item-4 {
        0% {
            transform: rotate(12deg * 3);
        }
        10% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(0deg);
        }
        54% {
            transform: rotate(0deg);
        }
        92% {
            transform: rotate(12deg * 3);
        }
    }
    @keyframes stack-item-5 {
        0% {
            transform: rotate(12deg * 4);
        }
        10% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(0deg);
        }
        54% {
            transform: rotate(0deg);
        }
        92% {
            transform: rotate(12deg * 4);
        }
    }
    @keyframes stack-items {
        0% {
            width: 71px;
        }
        15% {
            width: 71px;
        }
        30% {
            width: 12px;
        }
        50% {
            width: 12px;
        }
        80% {
            width: 71px;
        }
    }
    @keyframes box {
        0% {
            left: 0;
        }
        15% {
            left: 0;
        }
        30% {
            left: 30px;
        }
        50% {
            left: 30px;
        }
        80% {
            left: 0;
        }
    }
    @keyframes box-top {
        0% {
            width: 0;
        }
        6% {
            width: 0;
        }
        15% {
            width: 115px;
        }
        30% {
            width: 56px;
        }
        50% {
            width: 56px;
        }
        59% {
            width: 0;
        }
    }
    @keyframes box-bottom {
        0% {
            width: 115px;
        }
        15% {
            width: 115px;
        }
        30% {
            width: 56px;
        }
        50% {
            width: 56px;
        }
        80% {
            width: 115px;
        }
    }
    @keyframes box-right {
        15% {
            left: 103px;
        }
        30% {
            left: 44px;
        }
        50% {
            left: 44px;
        }
        80% {
            left: 103px;
        }
    }
    @keyframes stack-box {
        0% {
            transform: rotate(0deg);
        }
        30% {
            transform: rotate(0deg);
        }
        40% {
            transform: rotate(135deg);
        }
        50% {
            transform: rotate(135deg);
        }
        83% {
            transform: rotate(360deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
<body>
<div class="so center">
    <div class="inner">
        <div class="stack-box">
            <div class="stack">
                <div class="item">
                    <div class="inner-item"></div>
                </div>
                <div class="item">
                    <div class="inner-item"></div>
                </div>
                <div class="item">
                    <div class="inner-item"></div>
                </div>
                <div class="item">
                    <div class="inner-item"></div>
                </div>
                <div class="item">
                    <div class="inner-item"></div>
                </div>
            </div>
            <div class="box">
                <div class="bottom"></div>
                <div class="left"></div>
                <div class="right"></div>
                <div class="top"></div>
            </div>
        </div>
        <div class="name">
            stack<span class="b">overflow</span>
        </div>
    </div>
</div>
</body>
</html>
复制代码
```

### 3-3.loading 效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf406c9b4b6be?imageslim)

这个代码实在太多了，大家直接上网址看吧。[css3-loading](http://www.html5tricks.com/demo/css3-loading-cool-styles/index.html)

### 3-4.音乐震动条

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf406a65019bf?imageslim)

代码如下

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>纯CSS3模拟跳动的音符效果</title>
  <style>
    *{margin:0;padding:0;list-style: none;}
    body{background-color: #efefef;}
    .demo-music {
      position: absolute;
      width: 100%;
      height: 200px;
      top: 120px;
      zoom: 1.5;
    }

    .demo-music .music {
      width: 80px;
      height: 50px;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-40px, -25px);
      transform: translate(-40px, -25px);
      position: absolute;
    }

    .demo-music #waves {
      width: 80px;
      height: 50px;
      position: absolute;
      top: 12px;
      left: 12px;
    }

    .demo-music #waves li {
      position: relative;
      float: left;
      height: 100%;
      width: 12%;
      overflow: hidden;
      margin-right: 1px;
    }

    .demo-music #waves li span {
      position: absolute;
      bottom: 0;
      display: block;
      height: 100%;
      width: 100px;
      background: #09f;
    }

    .demo-music #waves .li1 span {
      animation: waves 0.8s linear 0s infinite alternate;
      -webkit-animation: waves 0.8s linear 0s infinite alternate;
    }

    .demo-music #waves .li2 span {
      animation: waves 0.9s linear 0s infinite alternate;
      -webkit-animation: waves 0.9s linear 0s infinite alternate;
    }

    .demo-music #waves .li3 span {
      animation: waves 1s linear 0s infinite alternate;
      -webkit-animation: waves 1s linear 0s infinite alternate;
    }

    .demo-music #waves .li4 span {
      animation: waves 0.8s linear 0s infinite alternate;
      -webkit-animation: waves 0.8s linear 0s infinite alternate;
    }

    .demo-music #waves .li5 span {
      animation: waves 0.7s linear 0s infinite alternate;
      -webkit-animation: waves 0.7s linear 0s infinite alternate;
    }

    .demo-music #waves .li6 span {
      animation: waves 0.8s linear 0s infinite alternate;
      -webkit-animation: waves 0.8s linear 0s infinite alternate;
    }
    @-webkit-keyframes waves {
      10% {
        height: 20%;
      }
      20% {
        height: 60%;
      }
      40% {
        height: 40%;
      }
      50% {
        height: 100%;
      }
      100% {
        height: 50%;
      }
    }

    @keyframes waves {
      10% {
        height: 20%;
      }
      20% {
        height: 60%;
      }
      40% {
        height: 40%;
      }
      50% {
        height: 100%;
      }
      100% {
        height: 50%;
      }
    }
  </style>
</head>
<body>
  <div class="demo-music">
    <div class="music">
      <ul id="waves" class="movement">
        <li class="li1"><span class="ani-li"></span></li>
        <li class="li2"><span class="ani-li"></span></li>
        <li class="li3"><span class="ani-li"></span></li>
        <li class="li4"><span class="ani-li"></span></li>
        <li class="li5"><span class="ani-li"></span></li>
        <li class="li6"><span class="ani-li"></span></li>
      </ul>
      <div class="music-state"></div>
    </div>
    </div>
</body>
</html>
复制代码
```

## 4.形状转换

这一部分，分 2d 转换和 3d 转换。有什么好玩的，下面列举几个！

### 4-1.语法

transform:适用于 2D 或 3D 转换的元素
transform-origin：转换元素的位置（围绕那个点进行转换）。默认(x,y,z)：(50%,50%,0)

### 4-2.实例

transform:rotate(30deg);

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf4073fe59bee?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

transform:translate(30px,30px);

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40796ffdae7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

transform:scale(.8);

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40757b99cbe?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

transform: skew(10deg,10deg);

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf4079d3f4d6e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

transform:rotateX(180deg);

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf4076749b7ff?imageslim)

transform:rotateY(180deg);

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf407ce7addac?imageslim)

transform:rotate3d(10,10,10,90deg);

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf407e0e9cca6?imageslim)

## 5.选择器

css3 提供的选择器可以让我们的开发，更加方便！这个大家都要了解。下面是 css3 提供的选择器。

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40815f2e26b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

图片来自 w3c。这一块建议大家去 w3c 看（[CSS 选择器参考手册](http://www.w3school.com.cn/cssref/css_selectors.asp)），那里的例子通俗易懂。我不重复讲了。
提供的选择器里面，基本都挺好用的。但是我觉得有些不会很常用，比如，`:root，:empty，:target，:enabled，:checked`。而且几个不推荐使用，网上的说法是性能较差`[attribute*=value]，[attribute$=value]，[attribute^=value]`，这个我没用过，不太清楚。

## 6.阴影

以前没有 css3 的时候，或者需要兼容低版本浏览器的时候，阴影只能用图片实现，但是现在不需要，css3 就提供了！

### 6-1.语法

```
box-shadow: 水平阴影的位置 垂直阴影的位置 模糊距离 阴影的大小 阴影的颜色 阴影开始方向（默认是从里往外，设置inset就是从外往里）;
复制代码
```

### 6-1.栗子

```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title></title>
<style>
div
{
    width:300px;
    height:100px;
    background:#09f;
    box-shadow: 10px 10px 5px #888888;
}
</style>
</head>
<body>

<div></div>

</body>
</html>
复制代码
```

运行效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf408200fcfe3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 7.边框

### 7-1.边框图片

#### 7-1-1.语法

border-image: 图片 url 图像边界向内偏移 图像边界的宽度(默认为边框的宽度) 用于指定在边框外部绘制偏移的量（默认 0） 铺满方式--重复（repeat）、拉伸（stretch）或铺满（round）（默认：拉伸（stretch））;

#### 7-1-2.栗子

边框图片（来自菜鸟教程）

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf4081f22448c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

代码

```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title></title>
<style>
.demo {
    border: 15px solid transparent;
    padding: 15px;
    border-image: url(border.png);
    border-image-slice: 30;
    border-image-repeat: round;
    border-image-outset: 0;
}
</style>
</head>
<body>
    <div class="demo"></div>
</body>
</html>
复制代码
```

效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf4084a24c0f6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

有趣变化

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf408714dd53c?imageslim)

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf408927cbdf9?imageslim)

那个更好看，大家看着办

### 7-2.边框圆角

#### 7-2-1.语法

```
border-radius: n1,n2,n3,n4;
border-radius: n1,n2,n3,n4/n1,n2,n3,n4;
/*n1-n4四个值的顺序是：左上角，右上角，右下角，左下角。*/
复制代码
```

#### 7-2-2.栗子

```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title></title>
<style>
div
{
    border:2px solid #a1a1a1;
    padding:10px 40px;
    background:#dddddd;
    text-align:center;
    width:300px;
    border-radius:25px 0 25px 0;
}
</style>
</head>
<body>
<div>border-radius</div>
</body>
</html>
复制代码
```

运行结果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf408a43f9c7a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 8.背景

这一块主要讲 css3 提供背景的三个属性

### background-clip

制定背景绘制（显示）区域

默认情况（从边框开始绘制）

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf408afc1cd8b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

从 padding 开始绘制（显示），不算 border,，相当于把 border 那里的背景给裁剪掉！（background-clip: padding-box;）

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf408c7be2a4e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

只在内容区绘制（显示），不算 padding 和 border，相当于把 padding 和 border 那里的背景给裁剪掉！（background-clip: content-box;）

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf408e0dbb625?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### background-origin

引用菜鸟教程的说法：background-Origin 属性指定 background-position 属性应该是相对位置

下面的 div 初始的 html 和 css 代码都是一样的。如下
html

```
<div>
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
</div>复制代码
```

css

```
div
{
    border:10px dashed black;
    padding:35px;
    background:url('logo.png') no-repeat,#ccc;
    background-position:0px 0px;
}
复制代码
```

下面看下，background-origin 不同的三种情况

![img](https://user-gold-cdn.xitu.io/2017/12/4/16021299ec4cd0f0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### background-size

这个相信很好理解，就是制定背景的大小
下面的 div 初始的 html 和 css 代码都是一样的。如下
html

```
<div>
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
</div>复制代码
```

css

```
div
{
    border:1px dashed black;
    padding:35px;
    background:url('test.jpg') no-repeat;
}
复制代码
```

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf4094945b61e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 多张背景图

这个没什么，就是在一张图片，使用多张背景图片，代码如下！
html

```
<p>两张图片的背景</p>
<div>
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
</div>复制代码
```

css

```
div
{
    border:1px dashed black;
    padding:35px;
    background-size: contain;
    background:url('test.jpg') no-repeat left,url(logo.png) no-repeat right;
}复制代码
```

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf409687dad22?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 9.反射

这个也可以说是倒影，用起来也挺有趣的。

### 9-1.语法

```
-webkit-box-reflect:方向[ above-上 | below-下 | right-右 | left-左 ]，偏移量，遮罩图片复制代码
```

### 9-2.下倒影

html

```
<p>下倒影</p>
<p class="reflect-bottom-p"><img src="test.jpg" class="reflect-bottom"></p>复制代码
```

css

```
.reflect-bottom-p {
    padding-bottom: 300px;
}

.reflect-bottom {
    -webkit-box-reflect: below;
}   复制代码
```

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf4095f677c17?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 9-2.右倒影（有偏移）

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf4096f546feb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

html

```
<p>右倒影同时有偏移</p>
<p><img src="test.jpg" class="reflect-right-translate"></p>复制代码
```

css

```
.reflect-right-translate {
    -webkit-box-reflect: right 10px;
}复制代码
```

### 9-3.下倒影（渐变）

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf4097af57a33?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

html

```
<p>下倒影（渐变）</p>
<p class="reflect-bottom-p"><img src="test.jpg" class="reflect-bottom-mask"></p>
复制代码
```

css

```
reflect-bottom-mask {
    -webkit-box-reflect: below 0 linear-gradient(transparent, white);
}复制代码
```

### 9-3.下倒影（图片遮罩）

使用的图片

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf409f492ec3e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40a2b211b66?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

html

```
<p>下倒影（png图片）</p>
<p class="reflect-bottom-p"><img src="test.jpg" class="reflect-bottom-img"></p>
复制代码
```

css

```
.reflect-bottom-img {
    -webkit-box-reflect: below 0 url(shou.png);
}
复制代码
```

## 10.文字

### 换行

语法：`word-break: normal|break-all|keep-all;`
栗子和运行效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40a3835c6dc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

语法：`word-wrap: normal|break-word;`
栗子和运行效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40a45d4e4ed?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 超出省略号这个，主要讲`text-overflow`这个属性，我直接讲实例的原因是`text-overflow`的三个写法，`clip|ellipsis|string`。`clip`这个方式处理不美观，不优雅。`string`只在火狐兼容。

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40a4c74bd9d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 超出省略号

这个其实有三行代码，禁止换行，超出隐藏，超出省略号
html

```
<div>This is some long text that will not fit in the box</div>复制代码
```

css

```
div
{
    width:200px;
    border:1px solid #000000;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
}复制代码
```

运行结果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40a87535b71?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 多行超出省略号

超出省略号。这个对于大家来说，不难！但是以前如果是多行超出省略号，就只能用 js 模拟！现在 css3 提供了多行省略号的方法！遗憾就是这个暂时只支持 webkit 浏览器！

代码如下

```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title></title>
<style>
div
{
    width:400px;
    margin:0 auto;
    overflow : hidden;
    border:1px solid #ccc;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>
</head>
<body>

<div>这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏</div>


</body>
</html>
复制代码
```

效果图

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40a832ee9fc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

这样发现边框贴着难看，要撑开一点，但是撑开上下边框不要使用 padding!因为会出现下面这个效果。

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40abc4d7d2b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

正确姿势是这样写

```
<style>
div
{
    width:400px;
    margin:0 auto;
    overflow : hidden;
    border:1px solid #ccc;
    text-overflow: ellipsis;
    padding:0 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height:30px;
    height:60px;
}
</style>
复制代码
```

运行结果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40ad1173590?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

这样写，就算在不是 webkit 内核的浏览器，也可以优雅降级（高度=行高\*行数（webkit-line-clamp））！

### 文字阴影

语法：text-shadow:水平阴影，垂直阴影，模糊的距离，以及阴影的颜色。
栗子：`text-shadow: 0 0 10px #f00;`
效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40b041a1fd2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 11.颜色

这个其实就是 css3 提供了新的颜色表示方法。

### rgba

一个是 rgba（rgb 为颜色值，a 为透明度）

```
color: rgba(255,00,00,1);
background: rgba(00,00,00,.5);
复制代码
```

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40b1020cb2b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### hsla

h:色相”，“s：饱和度”，“l：亮度”，“a：透明度”
这个我姿势了解过，没用过，这里简单给一个例子

```
color: hsla( 112, 72%, 33%, 0.68);
background-color: hsla( 49, 65%, 60%, 0.68);复制代码
```

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40b1982d846?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 12.渐变

css3 的渐变可以说是一大亮点，提供了线性渐变，径向渐变，圆锥渐变（w3c 和菜鸟教程都没有提及，是我从一篇文章了解到，但是我自己在谷歌浏览器尝试，却是一个无效的写法！大家如果知道怎么用，请告知！感谢）
渐变这一部分，由于用法灵活，功能也强大，这个写起来很长，写一点又感觉没什么意思，我这里贴几个链接教程给大家，在文章我不多说了，毕竟我也是从那几个地方学的，他们写得也是比我好，比我详细！

[CSS3 Gradient](http://www.w3cplus.com/content/css3-gradient)
[再说 CSS3 渐变——线性渐变](http://www.w3cplus.com/css3/new-css3-linear-gradient.html)
[再说 CSS3 渐变——径向渐变](http://www.w3cplus.com/css3/new-css3-radial-gradient.html)
[神奇的 conic-gradient 圆锥渐变](http://www.cnblogs.com/coco1s/p/7079529.html)（这篇就是看我看到圆锥渐变的文章）

## 13.Filter（滤镜）

css3 的滤镜也是一个亮点，功能强大，写法也灵活。

栗子代码如下

```
<p>原图</p>
<img src="test.jpg" />
<p>黑白色filter: grayscale(100%)</p>
<img src="test.jpg" style="filter: grayscale(100%);"/>
<p>褐色filter:sepia(1)</p>
<img src="test.jpg" style="filter:sepia(1);"/>
<p>饱和度saturate(2)</p>
<img src="test.jpg" style="filter:saturate(2);"/>
<p>色相旋转hue-rotate(90deg)</p>
<img src="test.jpg" style="filter:hue-rotate(90deg);"/>
<p>反色filter:invert(1)</p>
<img src="test.jpg" style="filter:invert(1);"/>
<p>透明度opacity(.5)</p>
<img src="test.jpg" style="filter:opacity(.5);"/>
<p>亮度brightness(.5)</p>
<img src="test.jpg" style="filter:brightness(.5);"/>
<p>对比度contrast(2)</p>
<img src="test.jpg" style="filter:contrast(2);"/>
<p>模糊blur(3px)</p>
<img src="test.jpg" style="filter:blur(3px);"/>
<p>阴影drop-shadow(5px 5px 5px #000)</p>
<img src="test.jpg" style="filter:drop-shadow(5px 5px 5px #000);"/>复制代码
```

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40bbb4e9a7d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 14.弹性布局

这里说的弹性布局，就是 flex；这一块要讲的话，必须要全部讲完，不讲完没什么意思，反而会把大家搞蒙！讲完也是很长，所以，这里我也只贴教程网址。博客讲的很好，很详细！

[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

## 15.栅格布局

栅格化布局，就是 grid；这一块和 flex 一样，要讲就必须讲完。这块的内容和 flex 差不多，也有点长，这里我也贴链接，这个链接讲得也很详细！

[Grid 布局指南](http://www.jianshu.com/p/d183265a8dad)

## 16.多列布局

这一块，我也是了解过，我觉得多列应该还是挺有用的。虽然我没在项目中用过，下面我简单说下！举个例子！这个属性，建议加私有前缀，兼容性有待提高！
html

```
<div class="newspaper">
当我年轻的时候，我梦想改变这个世界；当我成熟以后，我发现我不能够改变这个世界，我将目光缩短了些，决定只改变我的国家；当我进入暮年以后，我发现我不能够改变我们的国家，我的最后愿望仅仅是改变一下我的家庭，但是，这也不可能。当我现在躺在床上，行将就木时，我突然意识到：如果一开始我仅仅去改变我自己，然后，我可能改变我的家庭；在家人的帮助和鼓励下，我可能为国家做一些事情；然后，谁知道呢?我甚至可能改变这个世界。
</div>复制代码
```

css

```
.newspaper
{
    column-count: 3;
    -webkit-column-count: 3;
    -moz-column-count: 3;
    column-rule:2px solid #000;
    -webkit-column-rule:2px solid #000;
    -mox-column-rule:2px solid #000;
}
复制代码
```

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40c0e0a6508?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 17.盒模型定义

box-sizing 这个属性，网上说法是：属性允许您以特定的方式定义匹配某个区域的特定元素。

这个大家看着可能不知道在说什么，简单粗暴的理解就是：box-sizing:border-box 的时候，边框和 padding 包含在元素的宽高之内！如下图

![img](https://user-gold-cdn.xitu.io/2017/12/4/1601f4be4c14ae21?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

box-sizing:content-box 的时候，边框和 padding 不包含在元素的宽高之内！如下图

![img](https://user-gold-cdn.xitu.io/2017/12/4/1601f4c0c8ceb5b0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 18.媒体查询

媒体查询，就在监听屏幕尺寸的变化，在不同尺寸的时候显示不同的样式！在做响应式的网站里面，是必不可少的一环！不过由于我最近的项目都是使用 rem 布局。所以媒体查询就没怎么用了！但是，媒体查询，还是很值得一看的！说不定哪一天就需要用上了！

栗子代码如下

```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title></title>
<style>
body {
    background-color: pink;
}
@media screen and (max-width: 960px) {
    body {
        background-color: darkgoldenrod;
    }
}
@media screen and (max-width: 480px) {
    body {
        background-color: lightgreen;
    }
}
</style>
</head>
<body>

<h1>重置浏览器窗口查看效果！</h1>
<p>如果媒体类型屏幕的可视窗口宽度小于 960 px ，背景颜色将改变。</p>
<p>如果媒体类型屏幕的可视窗口宽度小于 480 px ，背景颜色将改变。</p>

</body>
</html>
复制代码
```

运行效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40c47144d22?imageslim)

## 19.混合模式

混合模式，就像 photoshop 里面的混合模式！这一块，我了解过，在项目上没用过，但是我觉得这个应该不会没有用武之地！
css3 的混合模式，两个（background-blend-mode 和 mix-blend-mode）。这两个写法和显示效果都非常像！区别就在于 background-blend-mode 是用于同一个元素的背景图片和背景颜色的。mix-blend-mode 用于一个元素的背景图片或者颜色和子元素的。看以下代码，区别就出来了！

> 这一块图片很多，大家看图片快速扫一眼，看下什么效果就好！

### background-blend-mode

代码

```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <style>
        div{
            width: 480px;
            height: 300px;
            background:url('test.jpg')no-repeat,#09f;
        }
    </style>
    <body>
        <!---->

        <p>原图</p>
        <div></div>
        <p>multiply正片叠底</p>
        <div style="background-blend-mode: multiply;"></div>
        <p>screen滤色</p>
        <div style="background-blend-mode: screen;"></div>
        <p>overlay叠加</p>
        <div style="background-blend-mode: overlay;"></div>
        <p>darken变暗</p>
        <div style="background-blend-mode: darken;"></div>
        <p>lighten变亮</p>
        <div style="background-blend-mode: lighten;"></div>
        <p>color-dodge颜色减淡模式</p>
        <div style="background-blend-mode: color-dodge;"></div>
        <p>color-burn颜色加深</p>
        <div style="background-blend-mode: color-burn;"></div>
        <p>hard-light强光</p>
        <div style="background-blend-mode: hard-light;"></div>
        <p>soft-light柔光</p>
        <div style="background-blend-mode: soft-light;"></div>
        <p>difference差值</p>
        <div style="background-blend-mode: difference;"></div>
        <p>exclusion排除</p>
        <div style="background-blend-mode: exclusion;"></div>
        <p>hue色相</p>
        <div style="background-blend-mode: hue;"></div>
        <p>saturation饱和度</p>
        <div style="background-blend-mode: saturation;"></div>
        <p>color颜色</p>
        <div style="background-blend-mode: color;"></div>
        <p>luminosity亮度</p>
        <div style="background-blend-mode: luminosity;"></div>
    </body>
</html>
复制代码
```

运行效果

### mix-blend-mode

代码

```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <style>
        div{
            padding: 20px;
            width: 480px;
            background: #09f;
        }
    </style>
    <body>
        <p>原图</p>
        <div><img src="test.jpg"/></div>
        <p>multiply正片叠底</p>
        <div><img src="test.jpg" style="mix-blend-mode: multiply;"/></div>
        <p>screen滤色</p>
        <div><img src="test.jpg" style="mix-blend-mode: screen;"/></div>
        <p>overlay叠加</p>
        <div><img src="test.jpg" style="mix-blend-mode: overlay;"/></div>
        <p>darken变暗</p>
        <div><img src="test.jpg" style="mix-blend-mode: darken;"/></div>
        <p>lighten变亮</p>
        <div><img src="test.jpg" style="mix-blend-mode: lighten;"/></div>
        <p>color-dodge颜色减淡模式</p>
        <div><img src="test.jpg" style="mix-blend-mode: color-dodge;"/></div>
        <p>color-burn颜色加深</p>
        <div><img src="test.jpg" style="mix-blend-mode: color-burn;"/></div>
        <p>hard-light强光</p>
        <div><img src="test.jpg" style="mix-blend-mode: hard-light;"/></div>
        <p>soft-light柔光</p>
        <div><img src="test.jpg" style="mix-blend-mode: soft-light;"/></div>
        <p>difference差值</p>
        <div><img src="test.jpg" style="mix-blend-mode: difference;"/></div>
        <p>exclusion排除</p>
        <div><img src="test.jpg" style="mix-blend-mode: exclusion;"/></div>
        <p>hue色相</p>
        <div><img src="test.jpg" style="mix-blend-mode: hue;"/></div>
        <p>saturation饱和度</p>
        <div><img src="test.jpg" style="mix-blend-mode: saturation;"/></div>
        <p>color颜色</p>
        <div><img src="test.jpg" style="mix-blend-mode: color;"/></div>
        <p>luminosity亮度</p>
        <div><img src="test.jpg" style="mix-blend-mode: luminosity;"/></div>
    </body>
</html>
复制代码
```

运行效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40ec2e01e59?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40e9a09db9f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40ecebd64e9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40eded5de01?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40f61d8f918?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 20.小结

好了，个人总结的 css3 的新特性，就到这里了！其中有一些新特性如果想使用的好，必须多去了解和练习。有些新特性，如果要单独详细的讲，比如动画，过渡，弹性盒子，渐变等。估计可以写几篇或者十几篇文章！特别是动画，估计写一本书都可以！上面对 css3 新特性的讲解和案例，都是基础的认识和用法，希望能起到一个拓展思维的作用。最重要的是，大家要多加练习，实操是最重要的一环，孰能生巧也是这样来的！css3 不仅要会用，也要用好，用好 css3，在项目的开发上，很有帮助的！当然如果我有发现什么好玩的，有用的，我会继续写文章。
最后，如果大家觉得我哪里写错了，写得不好，或者有什么推荐的！欢迎指点！
