---
layout: CustomPages
title: css3
date: 2020-11-21
aside: false
draft: true
---

### CSS3 有哪些新特性？

- 新增各种 CSS 选择器 （: not(.input)：所有 class 不是“input”的节点）
- 圆角 （border-radius:8px）
- 阴影（box-shadow）
- 对文字加特效（text-shadow），线性渐变（gradient），旋转（transform）
- 多列布局 （multi-column layout）
- 阴影和反射 （Shadow\Reflect）
- 文字特效 （text-shadow）
- 文字渲染 （Text-decoration）
- 线性渐变 （gradient）线性渐变,径向渐变
- 缩放,定位,倾斜,动画,多背景
- 旋转 transform:rotate(9deg) scale(0.85,0.90) translate(0px,-30px) skew(-9deg,0deg);// 旋转,缩放,定位,倾斜 `:transform:\scale(0.85,0.90)\ translate(0px,-30px)\ skew(-9deg,0deg)\Animation:`
- 多背景 rgba
- 在 CSS3 中唯一引入的伪类是 ::selection.
- 媒体查询 @media
- border-image
- 过渡效果
- css3 动画: animation、2d 变换、3d 变换
- 伸缩布局盒模型 flexbox

#### css3 文本效果

- text-justify（ 规定当 text-align 设置为 "justify" 时所使用的对齐方法。）
- text-outline（规定文本的轮廓。）
- text-overflow（规定当文本溢出包含元素时发生的事情。）
- text-shadow（向文本添加阴影。）
- text-wrap（规定文本的换行规则。）

### CSS3 新增伪类有那些？

- p:first-of-type 选择属于其父元素的首个 <p> 元素的每个 <p> 元素。
- p:last-of-type 选择属于其父元素的最后 <p> 元素的每个 <p> 元素。
- p:only-of-type 选择属于其父元素唯一的 <p> 元素的每个 <p> 元素。
- p:only-child 选择属于其父元素的唯一子元素的每个 <p> 元素。
- p:nth-child(2) 选择属于其父元素的第二个子元素的每个 <p> 元素。
- :after 在元素之前添加内容,也可以用来做清除浮动。
- :before 在元素之后添加内容
- :enabled
- :disabled 控制表单控件的禁用状态。
- :checked 单选框或复选框被选中
- :root 选择文档的根元素，等同于 html 元素
- :empty 选择没有子元素的元素
- :target 选取当前活动的目标元素
- :not(selector) 选择除 selector 元素意外的元素
- :nth-child(n) 匹配父元素下指定子元素，在所有子元素中排序第 n
- :nth-last-child(n) 匹配父元素下指定子元素，在所有子元素中排序第 n，从后向前数
- :nth-child(odd)
- :nth-child(even)
- :nth-child(3n+1)
- ::selection 选择被用户选取的元素部分
- :first-line 选择元素中的第一行
- :first-letter 选择元素中的第一个字符

### css3 的滤镜（filter）听过吗？

| Filter                                           | 描述                                                                                                                                                                                          |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| none                                             | 没有效果                                                                                                                                                                                      |
| blur(px)                                         | 给图像设置高斯模糊。                                                                                                                                                                          |
| brightness(%)                                    | 给图片应用一种线性乘法，使其看起来更亮或更暗。如果值是 0%，图像会全黑。值是 100%，则图像无变化。其他的值对应线性乘数效果。值超过 100%也是可以的，图像会比原来更亮。如果没有设定值，默认是 1。 |
| contrast(%)                                      | 调整图像的对比度。值是 0%的话，图像会全黑。值是 100%，图像不变。值可以超过 100%，意味着会运用更低的对比。若没有设置值，默认是 1。                                                             |
| drop-shadow(h-shadow v-shadow blur spread color) | 给图像设置一个阴影效果。阴影是合成在图像下面，可以有模糊度的，可以以特定颜色画出的遮罩图的偏移版本。                                                                                          |
| grayscale(%)                                     | 将图像转换为灰度图像。值定义转换的比例。值为 100%则完全转为灰度图像，值为 0%图像无变化。值在 0%到 100%之间，则是效果的线性乘子。若未设置，值默认是 0；                                        |
| opacity(%)                                       | 转化图像的透明程度。                                                                                                                                                                          |

### calc()

css3 带来了计算属性
https://www.w3cplus.com/css3/how-to-use-css3-calc-function.html

一般常用在一直宽高的元素定位的时候使用。

### 缩放

### css 3 重要属性

#### 1. 过渡 transform

应该算是 css3 使用最多的属性了，通常是让一些交互效果变得不那么生硬。css3 过渡是元素从一种样式逐渐改变为另一种效果，要实现这一点，必须规定两项定容： 指定要添加效果的 css 属性和效果的持续时间。

```css
transition： CSS属性，花费时间，效果曲线(默认ease)，延迟时间(默认0)
```

例子：

```css
/*宽度从原始值到制定值的一个过渡，运动曲线ease,运动时间0.5秒，0.2秒后执行过渡*/
transition：width,.5s,ease,.2s
/*所有属性从原始值到制定值的一个过渡，运动曲线ease,运动时间0.5秒*/
transition：all,.5s
```

translate:移动，是 transform 的一个方法
transform:变形，改变
transition: 允许 css 属性值在一定的时间区间内平滑的过渡。（过渡动画）

#### 2. 动画 animation

动画这个效果也使用非常多，主要是做一个预设动画和一些页面交互的动画效果，主要的结果和过渡应该一样，也不会让页面显得那么生硬。

```css
animation：动画名称，一个周期花费时间，运动曲线（默认ease），动画延迟（默认0），播放次数（默认1），是否反向播放动画（默认normal），是否暂停动画（默认running）
```

demo

```css
/*执行一次logo2-line动画，运动时间2秒，运动曲线为 linear*/
animation: logo2-line 2s linear;

/*2秒后开始执行一次logo2-line动画，运动时间2秒，运动曲线为 linear*/
animation: logo2-line 2s linear 2s;

/*无限执行logo2-line动画，每次运动时间2秒，运动曲线为 linear，并且执行反向动画*/
animation: logo2-line 2s linear alternate infinite;
```

还有一个重要属性

```css
/*无限执行logo2-line动画，每次运动时间2秒，运动曲线为 linear，并且执行反向动画*/
animation: logo2-line 2s linear alternate infinite;
```

#### 3. 形状转换

分 2d 转换和 3d 转换。

语法：

- transform:适用于 2D 或 3D 转换的元素
- transform-origin：转换元素的位置（围绕那个点进行转换）。默认(x,y,z)：(50%,50%,0)

demo:

- transform:rotate(30deg); 角度
- transform:translate(30px,30px); 位移
- transform:scale(.8); 缩放
- transform: skew(10deg,10deg); 翻转？
- transform:rotateX(180deg) transform:rotateY(180deg) 2D 翻转
- transform:rotate3d(10,10,10,90deg); 3D 翻转

#### 4. css 3 选择器

新增属性选择器：

- element1~element2 p~ul 选择前面有 <p> 元素的每个 <ul> 元素。 3
- [attribute^=value] a[src^="https"] 选择其 src 属性值以 "https" 开头的每个 <a> 元素。 3
- [attribute$=value] a[src$=".pdf"] 选择其 src 属性以 ".pdf" 结尾的所有 <a> 元素。 3
- [attribute*=value] a[src*="abc"] 选择其 src 属性中包含 "abc" 子串的每个 <a> 元素。 3
- :first-of-type p:first-of-type 选择属于其父元素的首个 <p> 元素的每个 <p> 元素。 3
- :last-of-type p:last-of-type 选择属于其父元素的最后 <p> 元素的每个 <p> 元素。 3
- :only-of-type p:only-of-type 选择属于其父元素唯一的 <p> 元素的每个 <p> 元素。 3
- :only-child p:only-child 选择属于其父元素的唯一子元素的每个 <p> 元素。 3
- :nth-child(n) p:nth-child(2) 选择属于其父元素的第二个子元素的每个 <p> 元素。 3
- :nth-last-child(n) p:nth-last-child(2) 同上，从最后一个子元素开始计数。 3
- :nth-of-type(n) p:nth-of-type(2) 选择属于其父元素第二个 <p> 元素的每个 <p> 元素。 3
- :nth-last-of-type(n) p:nth-last-of-type(2) 同上，但是从最后一个子元素开始计数。 3
- :last-child p:last-child 选择属于其父元素最后一个子元素每个 <p> 元素。 3
- :root :root 选择文档的根元素。 3
- :empty p:empty 选择没有子元素的每个 <p> 元素（包括文本节点）。 3
- :target #news:target 选择当前活动的 #news 元素。 3
- :enabled input:enabled 选择每个启用的 <input> 元素。 3
- :disabled input:disabled 选择每个禁用的 <input> 元素 3
- :checked input:checked 选择每个被选中的 <input> 元素。 3
- :not(selector) :not(p) 选择非 <p> 元素的每个元素。 3
- ::selection ::selection 选择被用户选取的元素部分。

#### 5. 阴影 box-shadow

没有 css3 的时候，或者需要兼容低版本浏览器的时候，阴影只能用图片实现。

box-shadow: 水平阴影的位置 垂直阴影的位置 模糊距离 阴影的大小 阴影的颜色 阴影开始方向（默认是从里往外，设置 inset 就是从外往里）;

demo:

```css
div {
  width: 300px;
  height: 100px;
  background: #09f;
  box-shadow: 10px 10px 5px #888888;
}
```

#### 6. 边框 border

1. 边框图片 border-image: 图片 url 图像边界向内偏移 图像边界的宽度(默认为边框的宽度) 用于指定在边框外部绘制偏移的量（默认 0） 铺满方式--重复（repeat）、拉伸（stretch）或铺满（round）（默认：拉伸（stretch））;

```css
.demo {
  border: 15px solid transparent;
  padding: 15px;
  border-image: url(border.png);
  border-image-slice: 30;
  border-image-repeat: round;
  border-image-outset: 0;
}
```

2. 边框圆角 border-radius

```css
div {
  border: 2px solid #a1a1a1;
  padding: 10px 40px;
  background: #dddddd;
  text-align: center;
  width: 300px;
  /* n1-n4四个值的顺序是：左上角，右上角，右下角，左下角 */
  border-radius: 25px 0 25px 0;
}
```

#### 7. 背景

这一块主要讲 css3 提供背景的三个属性

background-clip
制定背景绘制（显示）区域

默认情况（从边框开始绘制）
