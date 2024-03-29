---
title: CSS3 动画
date: 2020-11-21
draft: true
---

### CSS 动画

- 位置 - 平移
- 方向 - 旋转
- 大小 - 缩放
- 透明度
- 其他 - 线形变换

#### 1. 过渡 transform

css3 过渡是元素从一种样式逐渐改变为另一种效果，要实现这一点，必须规定两项定容: 指定要添加效果的 css 属性和效果的持续时间。

translate:移动，是 transform 的一个方法
transform:变形，改变
transition: 允许 css 属性值在一定的时间区间内平滑的过渡。（过渡动画）

```css
transition-property: width;
transition-duration: 1s;
transition-timing-function: linear;
transition-delay: 2s;
```

#### 2. 动画 animation

动画这个效果也使用非常多，主要是做一个预设动画和一些页面交互的动画效果，主要的结果和过渡应该一样，也不会让页面显得那么生硬。

animation: 动画名称，一个周期花费时间，运动曲线（默认 ease），动画延迟（默认 0），播放次数（默认 1），是否反向播放动画（默认 normal），是否暂停动画（默认 running）;

```css
/*执行一次logo2-line动画，运动时间2秒，运动曲线为 linear*/
animation: logo2-line 2s linear;

/*2秒后开始执行一次logo2-line动画，运动时间2秒，运动曲线为 linear*/
animation: logo2-line 2s linear 2s;

/*无限执行logo2-line动画，每次运动时间2秒，运动曲线为 linear，并且执行反向动画*/
animation: logo2-line 2s linear alternate infinite;
```

#### 3. 形状转换

分 2d 转换和 3d 转换。

语法:

- transform:适用于 2D 或 3D 转换的元素
- transform-origin:转换元素的位置（围绕那个点进行转换）。默认(x,y,z):(50%,50%,0)

demo:

- transform:rotate(30deg); 角度
- transform:translate(30px,30px); 位移
- transform:scale(.8); 缩放
- transform: skew(10deg,10deg); 翻转？
- transform:rotateX(180deg) transform:rotateY(180deg) 2D 翻转
- transform:rotate3d(10,10,10,90deg); 3D 翻转

### 前端动画怎么做

- animation 过渡动画
- transition 过渡动画
- JS 原生控制 DOM 位置
- canvas 绘制动画

### CSS3 动画（简单动画的实现，如旋转等）

依靠 CSS3 中提出的三个属性：transition、transform、animation
transition：定义了元素在变化过程中是怎么样的，包含 transition-property、transition-duration、transition-timing-function、transition-delay。
transform：定义元素的变化结果，包含 rotate、scale、skew、translate。
animation：动画定义了动作的每一帧（@Keyframes）有什么效果，包括 animation-name，animation-duration、animation-timing-function、animation-delay、animation-iteration-count、animation-direction

### 说一说 css3 的 animation

css3 的 animation 是 css3 新增的动画属性，这个 css3 动画的每一帧是通过@keyframes 来声明的，keyframes 声明了动画的名称，通过 from、to 或者是百分比来定义
每一帧动画元素的状态，通过 animation-name 来引用这个动画，同时 css3 动画也可以定义动画运行的时长、动画开始时间、动画播放方向、动画循环次数、动画播放的方式，
这些相关的动画子属性有：animation-name 定义动画名、animation-duration 定义动画播放的时长、animation-delay 定义动画延迟播放的时间、animation-direction 定义
动画的播放方向、animation-iteration-count 定义播放次数、animation-fill-mode 定义动画播放之后的状态、animation-play-state 定义播放状态，如暂停运行等、animation-timing-function
定义播放的方式，如恒速播放、艰涩播放等。

### transition 过渡动画

用来控制过渡的时间，使用过渡的属性，过渡效果曲线，过渡的延时

要求元素的状态必须有变化，即某 CSS 值变化时发生的动画

- transition-property
  - 规定设置过渡效果的 CSS 属性的名称。
- transition-duration
  - 规定完成过渡效果需要多少秒或毫秒。
- transition-timing-function
  - 规定速度效果的速度曲线。
- transition-delay
  - 定义过渡效果何时开始

在 chrome 的调试窗口按下 esc 在下面出现一个框框，选择 animation 就可以看到动画面板了

```css
div {
  width: 100px;
  height: 100px;
  background: blue;
  transition: width 2s, background 1s;
}
div:hover {
  background: orange;
  width: 300px;
}
```

### animation 关键帧动画

相当于多个补间动画组合到一起

与 transition 不同的是，他可以让元素自己动，而不要求某值的改变来触发动画

`animation: name duration timing-function delay iteration-count direction;`

- animation-name
  - 规定需要绑定到选择器的 keyframe 名称。
- animation-duration
  - 规定完成动画所花费的时间，以秒或毫秒计
- animation-timing-function
  - 动画的速度曲线
- animation-delay
  - 动画开始之前的延迟
- animation-iteration-count
  - n | infinit
  - 动画应该播放的次数
- animation-direction
  - normal | alternate
  - 是否应该轮流反向播放动画
- animation-play-state
  - 可用于暂停动画
- animation-fill-mode
  - forwards 动画停了就保持最后的那个状态
  - backwards 动画停了还得反着做一遍回去
  - 在动画执行之前和之后如何给动画的目标应用样式。

```css
#one {
  width: 50px;
  height: 50px;
  background-color: orange;
  animation: run;
  animation-delay: 0.5s;
  animation-duration: 2s;
  animation-fill-mode: forwards;
}
@keyframes run {
  0% {
    width: 100px;
  }
  50% {
    width: 400px;
    background-color: blue;
  }
  100% {
    width: 800px;
  }
}
```

### transition-timing-function

- ease 慢速开始，然后变快，然后慢速结束
- ease-in 慢速开始
- ease-out 慢结束
- ease-in-out
- linear

### 逐帧动画

关键帧之间是有补间的，会选一个效果过渡过去，而逐帧动画则是每个 keyframe 之间没有过渡，直接切换过去

关键是使用下面这行 CSS
`animation-timing-function: steps(1);`
这个 step 是指定关键帧之间需要有几个画面

### 过渡动画和关键帧动画的区别

- 过渡动画需要有状态变化
- 关键帧动画不需要状态变化
- 关键帧动画能控制更精细

### CSS 动画的性能

- CSS 动画不差
- 部分情况下优于 JS
- JS 可以做到更精细
- 含高危属性，会让性能变差 (如 box-shadow)

### 关于 js 动画和 css3 动画的差异性

渲染线程分为 main thread 和 compositor thread，如果 css 动画只改变 transform 和 opacity，这时整个 CSS 动画得以在 compositor trhead 完成（而 js 动画则会在 main thread 执行，然后出发 compositor thread 进行下一步操作），特别注意的是如果改变 transform 和 opacity 是不会 layout 或者 paint 的。
区别：

- 功能涵盖面，js 比 css 大
- 实现/重构难度不一，CSS3 比 js 更加简单，性能跳优方向固定
- 对帧速表现不好的低版本浏览器，css3 可以做到自然降级
- css 动画有天然事件支持
- css3 有兼容性问题

### 请问为何要使用 translate() 而非 absolute positioning，或反之的理由？为什么？

通过 absolute 定位属性实现的移动，通过 translate 也可以实现，两者结合使用可以实现元素的居中。

文档流上的差异：

absolute 会脱离文档流，而 translate 不会脱离文档流

基点上的差异：

absolute 是基于第一个非 static 父元素的左上角 border 与 padding 交界处，而 translate 是子元素整体平移，没有所谓的基点而言，当然通过 transform-origin 改变旋转的基准点？

视图属性上的差异：

可以看出使用 translate 的例子的 offsetTop 和 offsetLeft 的数值与没有产生位移的元素没有然后区别，无论位移多少这两个数值都是固定不变的。

而使用相对定位的例子 offsetTop 和 offsetLeft 的数值则根据位移的长度发生了改变。

动画表现上的差异：

使用绝对定位的动画效果会受制于利用像素(px)为单位进行位移，而使用 translate 函数的动画则可以不受像素的影响，以更小的单位进行位移。

另外，绝对定位的动画效果完全使用 CPU 进行计算，而使用 translate 函数的动画则是利用 GPU，因此在视觉上使用 translate 函数的动画可以有比绝对定位动画有更高的帧数。

### 如果需要手动写动画，你认为最小时间间隔是多久？

多数显示器默认频率是 60Hz，即 1 秒刷新 60 次，所以理论上最小间隔为 1/60＊1000ms ＝ 16.7ms

### 什么时候应该使用 CSS animations 而不是 CSS transitions？你做出这个决定标准是什么？

Transitions 动画功能与 Animations 动画功能的区别：虽然它们两者都是通过改变元素的属性值来实现动画效果，但是 Transitions 只能通过指定属性的开始值与结束值，然后在这两者之间进行平滑过渡的方式来实现动画的效果，因此不能实现较复杂的动画效果；而 Animations 功能可以通过定义多个关键帧以及每个关键帧中元素的属性值来实现复杂的动画效果

### 实现 div 的动画移动

使用 css3 的动画 animation 和@keyframes 来实现 div 的移动。

```html
<html>
<head>
  <style>
    div {
      width: 100px;
      height: 100px;
      border: 1px solid red;
      position: relative;
      animation: div 5s  infinite alternate;
    }

    @keyframes div {
      form {left: 0; background-color:'#fff'}
      to {left: 200px; background-color: red}
    }
  </style>
</head>

<body>
  <div></div>
</body>
</html
```

### 实现一个 img 图片旋转的方法？

- transform: rotate(30deg);
- CSS3 动画 @keyframes

### CSS3 动画如何实现暂停？

css3 动画可以通过设置 animation-play-state 属性为 paused 来设置这个动画暂停。

### 让一个 100px 的方形元素从页面的最左边过渡到最右边，最高效的动画方式是什么？

css3 transition 使用底层渲染，比所有 js 动画都要高效。可以让元素绝对定位，从 left:0 变换为 left:calc(100vw-100px)。

### css 动画和 js 动画的差异

代码复杂度，js 动画代码相对复杂一些
动画运行时，对动画的控制程度上，js 能够让动画，暂停，取消，终止，css 动画不能添加事件
动画性能看，js 动画多了一个 js 解析的过程，性能不如 css 动画好

### linear-gradient

做活动页面的时候我们经常会遇到这样的需求：

顶部的中间一张大 banner 图片，然后整个区域的背景色要根据图片背景色渐变。就可以使用这个属性了。

```
div {
    width: 200px;
    height: 50px;
    background: linear-gradient(to right, red, yellow, black, green);
}
```

是不是很有趣？其实，`linear-gradient`还有更多有趣的功能，你可以根据下面的动图去感受一下：

你以为这就完了？等等，还有更强大的呢！`repeating-linear-gradient`，来感受一下：

`linear-gradient`还有更加强大的功能，比如它可以给元素添加多个渐变，从而达到更 NB 的效果。

### radial-gradient

上面的`linear-gradient`是线性渐变，这个属性是径向渐变。下面的代码实现了一个 chrome 的 logo。

```css
div.chrome {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #999, 0 0 2px #ddd inset;
  background: radial-gradient(circle, #4facf5 0, #2196f3 28%, transparent 28%), radial-gradient(
      circle,
      #fff 33%,
      transparent 33%
    ), linear-gradient(-50deg, #ffeb3b 34%, transparent 34%), linear-gradient(60deg, #4caf50 33%, transparent 33%),
    linear-gradient(180deg, #ff756b 0, #f44336 30%, transparent 30%), linear-gradient(
      -120deg,
      #ffeb3b 40%,
      transparent 40%
    ), linear-gradient(-60deg, #ffeb3b 30%, transparent 30%), linear-gradient(0deg, #4caf50 45%, transparent 45%),
    linear-gradient(60deg, #4caf50 30%, transparent 30%), linear-gradient(120deg, #f44336 50%, transparent 50%),
    linear-gradient(180deg, #f44336 30%, transparent 30%);
}
```

实现原理就是使用了多个渐变色放在 div 上，友协被遮住，视觉上就产生了想要的效果，是不是很强大！看了下图你就知道其实就是在 div 上加了很多个渐变。

![img](https://lc-api-gold-cdn.xitu.io/3ce54ea0817bf4ff8084.gif?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### transition 和 animation 的区别，是否可暂停

### 过渡与动画的区别是什么

transition
可以在一定的时间内实现元素的状态过渡为最终状态，用于模拟以一种过渡动画效果，但是功能有限，只能用于制作简单的动画效果而动画属性
animation
可以制作类似 Flash 动画，通过关键帧控制动画的每一步，控制更为精确，从而可以制作更为复杂的动画。
什么是外边距合并
