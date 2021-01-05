---
layout: CustomPages
title: css3
date: 2020-11-21
aside: false
draft: true
---

## 2.过渡

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
