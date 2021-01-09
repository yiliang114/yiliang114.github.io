---
title: 居中
date: 2020-11-21
aside: false
---

### 被居中元素宽高固定

1. 绝对定位，top 和 left 为 50%， margin 的 left 和 top 为自身宽高一半

```css
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -9rem;
  margin-top: -5rem;
}
```

2. 绝对定位，top 和 left 为父元素一半剪自身一半

```css
.center {
  position: absolute;
  top: calc(50% - 5em);
  left: calc(50% - 9em);
}
```

### 被居中元素宽高不定

3. 使用 CSS3 的 `transform`将位置在中心点平移自身宽高一半

```css
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

4. 使用 flex 布局居中

```css
.wrapper {
  display: flex;
}
.center {
  margin: auto;
}
```

5. flex 布局，父元素指定子元素居中。

```css
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 在浏览器窗口中居中

基于视口的垂直居中。不要求原生有固定的宽高，但是这种居中是在整个页面窗口内居中，不是基于父元素

```css
.center {
  margin: 50vh auto;
  transform: translateY(-50%);
}
```

### 常见的几种布局？垂直水平居中的多种实现方法？等高栏的几种实现方法？

常见的几种布局：
文档流布局，浮动布局，定位布局，flex 布局

html:

```js
<div class="parent">
  <div class="child">
    <div class="box">box</div>
  </div>
</div>
```

水平居中：

```js
.child{
 	width:200px;
 	margin:0 auto;
  }
```

垂直水平居中：
一：绝对定位 1.

```js
        .parent {
            position: relative;
        }
        .child {
            width: 200px;
            height: 200px;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            margin: auto;
        }
```

2.margin 负间距

```js
        .child{
            width:200px;
            height: 200px;
            position: absolute;
            left:50%;
            top:50%;
            margin-left:-100px;
            margin-top:-100px;
        }
```

1. Transforms 变形

```js
        .child {
            width: 200px;
            height: 200px;
            position:absolute;
            left:50%;    /* 定位父级的50% */
            top:50%;
            transform: translate(-50%,-50%); /*自己的50% */
        }
```

二.flex 布局，使用于不定宽高布局 1.

```
        .parent {
            display: flex;
            justify-content:center;
            align-items:center;
        }
```

```js
        .parent {
            display: flex;
        }
        .child {
            margin: auto
        }
```

三：父元素设置 teable-cell 元素,利用三层结构模拟父子结构

```js
        .parent {
            display: table;
            width: 200px;
            height: 200px;
        }

        .child {
            display: table-cell;
            text-align: center;
            vertical-align: middle;
        }

        .box {
            display: inline-block;
        }
```

四：grid 布局 1.

```js
        .parent {
            display: grid;
        }

        .child {
            justify-self: center;
            align-self: center;
        }
```

```js
        .parent {
            display: grid;
        }

        .child {
            margin: auto;
        }
```

等高栏的几种实现方法？ 1.

```js
.parent {
position: reletive
}
.child {
position: absolute;
top:0;
bottom: 0;
overflow:auto
}
```

```js
.parent {
display: flex;
}
.child {
flex: 1
}
```

自适应高度 1.

```js
<div class="outer">
    <div class="A"> 头部DIV </div>
    <div class="B">下部DIV </div>
</div>
body { height: 100%; padding: 0; margin: 0; }
.outer { height: 100%; padding: 100px 0 0; box-sizing: border-box ; position: relative; }
.A { height: 100px; background: #BBE8F2; position: absolute; top: 0 ; left: 0 ; width: 100%; }
.B { height: 100%; background: #D9C666; }
```

```js
<div class="outer">
    <div class="A">头部DIV</div>
    <div class="B">下部DIV</div>
</div>
body { height: 100%; padding: 0; margin: 0; }
.outer { height: 100%; padding: 100px 0 0; box-sizing: border-box ; }
.A { height: 100px; margin: -100px 0 0; background: #BBE8F2; }
.B { height: 100%; background: #D9C666; }
```

扩展：
line-height: height 有被问到该值是不是等于高度设置的值，这个没有答好，回来测试发现是跟盒模型相关的，需要是 computed height
absolute + transform 居中为什么要使用 transform（为什么不使用 marginLeft / Top），这是一道重绘重排的问题。
flex + align-items: center 我会对 flex 容器以及 flex 项目的每个 css 属性都了解一遍，并且写了一些小 demo， flex：1 代表什么

### 居中

- div 垂直居中、水平居中的方式；文字如何在 div 中水平居中，垂直居中

### align-items 和 justify-content 的区别

传统布局基于盒模型，非常依赖 display 属性 、position 属性 、float 属性。而 flex 布局更灵活，可以简便、完整、响应式地实现各种页面布局，比如水平垂直居中。
align-items：定义在侧轴（纵轴）方向上的对齐方式；
justify-content：定义在主轴（横轴）方向上的对齐方式

### css 布局问题？css 实现三列布局怎么做？如果中间是自适应又怎么做？

### 流式布局如何实现，响应式布局如何实现

### 移动端布局方案

### 实现三栏布局（圣杯布局，双飞翼布局，flex 布局）

### 圣杯布局和双飞翼布局的理解和区别，并用代码实现

https://github.com/haizhilin2013/interview/issues/2

### css 实现水平垂直居中

```css
.align-center {
  /**
         * 负边距+定位：水平垂直居中（Negative Margin）
         * 使用绝对定位将content的定点定位到body的中心，然后使用负margin（content宽高的一半），
         * 将content的中心拉回到body的中心，已到达水平垂直居中的效果。
         */

  position: absolute;

  left: 50%;

  top: 50%;

  width: 400px;

  height: 400px;

  margin-top: -200px;

  margin-left: -200px;

  border: 1px dashed #333;
}
```

### 如何居中一个浮动元素

<!-- 父元素和子元素同时左浮动，然后父元素相对左移动50%，再然后子元素相对右移动50%，或者子元素相对左移动-50%也就可以了。 -->

```css
.p {
  position: relative;

  left: 50%;

  float: left;
}

.c {
  position: relative;

  float: left;

  right: 50%;
}
```

```html
<div class="p">
  <h1 class="c">Test Float Element Center</h1>
</div>
```

### 实现一下一个 div 的居中。如果不适用 flex 布局怎么做？

```js
<header>
  <style>
    .contaniner {
      margin: 0 auto; // 左右居中
      border: 1px solid red;
      width: 100px;
      height: 100px;
      top: calc(50% - 50px);
      position: relative;
    }
  </style>
</header>
<div class="contaniner" />
```

> 必须有 width,`margin: 0 auto`才有效果；
> `top: calc(50% - 50px); position: relative;`是可以上下居中

### 如何居中 div？如何居中一个浮动元素？如何让绝对定位的 div 居中？

- 给`div`设置一个宽度，然后添加`margin:0 auto`属性

```
div{
    width:200px;
    margin:0 auto;
 }
```

- 居中一个浮动元素

```
//确定容器的宽高 宽500 高 300 的层
//设置层的外边距

 .div {
      width:500px ; height:300px;//高度可以不设
      margin: -150px 0 0 -250px;
      position:relative;         //相对定位
      background-color:pink;     //方便看效果
      left:50%;
      top:50%;
 }
```

- 让绝对定位的 div 居中

```
  position: absolute;
  width: 1200px;
  background: none;
  margin: 0 auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
```

### 如何居中 div？

(1)、非浮动元素居中：可以设置 margin:0 auto 令其居中, 定位 ,父级元素 text-align:center 等等
(2)、浮动元素居中:
方法一:设置当前 div 的宽度，然后设置 margin-left:50%; position:relative; left:-250px;其中的 left 是宽度的一半。
方法二:父元素和子元素同时左浮动，然后父元素相对左移动 50%，再然后子元素相对左移动-50%。
方法三:position 定位等等。

### 兼容性 怎么样？ 适合移动端的有哪些？

### 什么元素才能设置高度和宽度？

块状元素

### 绝对定位的百分比是相对于父元素的宽高

### CSS 垂直居中、水平垂直居中

### 52.怎么让一个 div 水平垂直居中

```js
<div class="parent">
  <div class="child"></div>
</div>
```

1.

```
div.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

1.

```js
div.parent {
    position: relative;
}
div.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
/* 或者 */
div.child {
    width: 50px;
    height: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -25px;
    margin-top: -5px;
}
/* 或 */
div.child {
    width: 50px;
    height: 10px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
```

1.

```js
div.parent {
    display: grid;
}
div.child {
    justify-self: center;
    align-self: center;
}
```

1.

```js
div.parent {
    font-size: 0;
    text-align: center;
    &::before {
        content: "";
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
    }
}
div.child{
  display: inline-block;
  vertical-align: middle;
}
```
