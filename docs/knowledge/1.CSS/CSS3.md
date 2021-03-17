---
title: CSS3
date: 2020-11-21
draft: true
---

## CSS3 重要属性

### 1. 过渡 transform

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

### 2. 动画 animation

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

### 3. 形状转换

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

### 4. css 3 选择器

新增属性选择器:

- :first-of-type p:first-of-type 选择属于其父元素的首个 <p> 元素的每个 <p> 元素。
- :last-of-type p:last-of-type 选择属于其父元素的最后 <p> 元素的每个 <p> 元素。
- :only-of-type p:only-of-type 选择属于其父元素唯一的 <p> 元素的每个 <p> 元素。
- :only-child p:only-child 选择属于其父元素的唯一子元素的每个 <p> 元素。
- :nth-child(n) p:nth-child(2) 选择属于其父元素的第二个子元素的每个 <p> 元素。
- :nth-last-child(n) p:nth-last-child(2) 同上，从最后一个子元素开始计数。
- :nth-of-type(n) p:nth-of-type(2) 选择属于其父元素第二个 <p> 元素的每个 <p> 元素。
- :nth-last-of-type(n) p:nth-last-of-type(2) 同上，但是从最后一个子元素开始计数。
- :last-child p:last-child 选择属于其父元素最后一个子元素每个 <p> 元素。
- :root :root 选择文档的根元素。
- :empty p:empty 选择没有子元素的每个 <p> 元素（包括文本节点）。
- :target #news:target 选择当前活动的 #news 元素。
- :enabled input:enabled 选择每个启用的 <input> 元素。
- :disabled input:disabled 选择每个禁用的 <input> 元素
- :checked input:checked 选择每个被选中的 <input> 元素。
- :not(selector) :not(p) 选择非 <p> 元素的每个元素。
- ::selection ::selection 选择被用户选取的元素部分。

### 5. 阴影 box-shadow

没有 css3 的时候，或者需要兼容低版本浏览器的时候，阴影只能用图片实现。

box-shadow: 水平阴影的位置 垂直阴影的位置 模糊距离 阴影的大小 阴影的颜色 阴影开始方向（默认是从里往外，设置 inset 就是从外往里）;

```css
div {
  width: 300px;
  height: 100px;
  background: #09f;
  box-shadow: 10px 10px 5px #888888;
}
```

### 6. 边框 border

1. 边框图片 border-image: 图片 url 图像边界向内偏移 图像边界的宽度(默认为边框的宽度) 用于指定在边框外部绘制偏移的量（默认 0） 铺满方式--重复（repeat）、拉伸（stretch）或铺满（round）（默认:拉伸（stretch））;

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
  /* n1-n4四个值的顺序是:左上角，右上角，右下角，左下角 */
  border-radius: 25px 0 25px 0;
}
```

### 7. 背景

这一块主要讲 css3 提供背景的三个属性

background-clip
制定背景绘制（显示）区域

#### background-clip

制定背景绘制（显示）区域

默认情况（从边框开始绘制）

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf408afc1cd8b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

从 padding 开始绘制（显示），不算 border,，相当于把 border 那里的背景给裁剪掉！（background-clip: padding-box;）

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf408c7be2a4e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

只在内容区绘制（显示），不算 padding 和 border，相当于把 padding 和 border 那里的背景给裁剪掉！（background-clip: content-box;）

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf408e0dbb625?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### background-origin

引用菜鸟教程的说法：background-Origin 属性指定 background-position 属性应该是相对位置

下面的 div 初始的 html 和 css 代码都是一样的。如下
html

```
<div>
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
</div>
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

```

下面看下，background-origin 不同的三种情况

![img](https://user-gold-cdn.xitu.io/2017/12/4/16021299ec4cd0f0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### background-size

这个相信很好理解，就是制定背景的大小
下面的 div 初始的 html 和 css 代码都是一样的。如下
html

```
<div>
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
</div>
```

css

```
div
{
    border:1px dashed black;
    padding:35px;
    background:url('test.jpg') no-repeat;
}

```

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf4094945b61e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 10.文字

#### 换行

语法：`word-break: normal|break-all|keep-all;`
栗子和运行效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40a3835c6dc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

语法：`word-wrap: normal|break-word;`
栗子和运行效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40a45d4e4ed?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 超出省略号这个，主要讲`text-overflow`这个属性，我直接讲实例的原因是`text-overflow`的三个写法，`clip|ellipsis|string`。`clip`这个方式处理不美观，不优雅。`string`只在火狐兼容。

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40a4c74bd9d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 超出省略号

这个其实有三行代码，禁止换行，超出隐藏，超出省略号
html

```
<div>This is some long text that will not fit in the box</div>
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
}
```

运行结果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40a87535b71?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 多行超出省略号

超出省略号。这个对于大家来说，不难！但是以前如果是多行超出省略号，就只能用 js 模拟！现在 css3 提供了多行省略号的方法！遗憾就是这个暂时只支持 webkit 浏览器！

代码如下

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
    <style>
      div {
        width: 400px;
        margin: 0 auto;
        overflow: hidden;
        border: 1px solid #ccc;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    </style>
  </head>
  <body>
    <div>
      这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏这里将会超出隐藏
    </div>
  </body>
</html>
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

```

运行结果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40ad1173590?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

这样写，就算在不是 webkit 内核的浏览器，也可以优雅降级（高度=行高\*行数（webkit-line-clamp））！

#### 文字阴影

语法：text-shadow:水平阴影，垂直阴影，模糊的距离，以及阴影的颜色。
栗子：`text-shadow: 0 0 10px #f00;`
效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40b041a1fd2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 14.弹性布局 flex

这里说的弹性布局，就是 flex；这一块要讲的话，必须要全部讲完，不讲完没什么意思，反而会把大家搞蒙！讲完也是很长，所以，这里我也只贴教程网址。博客讲的很好，很详细！

[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

### 15.栅格布局

栅格化布局，就是 grid；这一块和 flex 一样，要讲就必须讲完。这块的内容和 flex 差不多，也有点长，这里我也贴链接，这个链接讲得也很详细！

[Grid 布局指南](http://www.jianshu.com/p/d183265a8dad)

### 16.多列布局

这一块，我也是了解过，我觉得多列应该还是挺有用的。虽然我没在项目中用过，下面我简单说下！举个例子！这个属性，建议加私有前缀，兼容性有待提高！
html

```
<div class="newspaper">
当我年轻的时候，我梦想改变这个世界；当我成熟以后，我发现我不能够改变这个世界，我将目光缩短了些，决定只改变我的国家；当我进入暮年以后，我发现我不能够改变我们的国家，我的最后愿望仅仅是改变一下我的家庭，但是，这也不可能。当我现在躺在床上，行将就木时，我突然意识到：如果一开始我仅仅去改变我自己，然后，我可能改变我的家庭；在家人的帮助和鼓励下，我可能为国家做一些事情；然后，谁知道呢?我甚至可能改变这个世界。
</div>
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

```

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40c0e0a6508?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 18.媒体查询

媒体查询，就在监听屏幕尺寸的变化，在不同尺寸的时候显示不同的样式！在做响应式的网站里面，是必不可少的一环！不过由于我最近的项目都是使用 rem 布局。所以媒体查询就没怎么用了！但是，媒体查询，还是很值得一看的！说不定哪一天就需要用上了！

栗子代码如下

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
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
```

运行效果

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40c47144d22?imageslim)
