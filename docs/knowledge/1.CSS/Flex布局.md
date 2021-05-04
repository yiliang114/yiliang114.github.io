---
title: Flex布局
date: 2020-11-21
draft: true
---

# Flex 布局

### flex 布局，固定高度，左边定宽，右边自适应？

flex 布局给父元素设置 display:flex,左边的子元素给个 width:100px,右边的子元素 flex:1

### 如果子元素不能 100%继承高度，怎么实现撑满？

这个问题我当时没反应过来面试官的意思，我问了一下是不是要纵轴方向的 flex 布局？后来面试官说 嗯。。也可以，这个过了。我就愣了，回来之后想了一下，不知道是不是说如果子元素无法 100%的继承高度，那是不是可以结合定位的方式，比如父元素 relative，子元素 absolute，然后四个位置都是 0？不知道是不是这个意思~无法考究了

### Flex 如何实现上下两行，上行高度自适应，下行高度 200px？

flex-direction: column
flex: 1

### 使用 flex 实现三栏布局，两边固定，中间自适应

这就是圣杯布局,也叫双飞翼布局

1. 把 center 放在最前面，优先渲染
2. 相对定位 relative 也是可以设置 left,right 等值的
3. margin 负值的了解和使用
4. float 真的不建议使用

现在的 flex/grid 很轻松就能实现，甚至绝对定位也是很容易实现也更容易理解。

作用：圣杯布局和双飞翼布局解决的问题是一样的，就是两边顶宽，中间自适应的三栏布局，中间栏要在放在文档流前面以优先渲染。

区别：圣杯布局，为了中间 div 内容不被遮挡，将中间 div 设置了左右 padding-left 和 padding-right 后，将左右两个 div 用相对布局 position: relative 并分别配合 right 和 left 属性，以便左右两栏 div 移动后不遮挡中间 div。双飞翼布局，为了中间 div 内容不被遮挡，直接在中间 div 内部创建子 div 用于放置内容，在该子 div 里用 margin-left 和 margin-right 为左右两栏 div 留出位置。

圣杯布局代码：

```html
<body>
  <div id="hd">header</div>
  <div id="bd">
    <div id="middle">middle</div>
    <div id="left">left</div>
    <div id="right">right</div>
  </div>
  <div id="footer">footer</div>
</body>

<style>
  #hd {
    height: 50px;
    background: #666;
    text-align: center;
  }
  #bd {
    /*左右栏通过添加负的margin放到正确的位置了，此段代码是为了摆正中间栏的位置*/
    padding: 0 200px 0 180px;
    height: 100px;
  }
  #middle {
    float: left;
    width: 100%; /*左栏上去到第一行*/
    height: 100px;
    background: blue;
  }
  #left {
    float: left;
    width: 180px;
    height: 100px;
    margin-left: -100%;
    background: #0c9;
    /*中间栏的位置摆正之后，左栏的位置也相应右移，通过相对定位的left恢复到正确位置*/
    position: relative;
    left: -180px;
  }
  #right {
    float: left;
    width: 200px;
    height: 100px;
    margin-left: -200px;
    background: #0c9;
    /*中间栏的位置摆正之后，右栏的位置也相应左移，通过相对定位的right恢复到正确位置*/
    position: relative;
    right: -200px;
  }
  #footer {
    height: 50px;
    background: #666;
    text-align: center;
  }
</style>
```

双飞翼布局代码：

```html
<body>
  <div id="hd">header</div>
  <div id="middle">
    <div id="inside">middle</div>
  </div>
  <div id="left">left</div>
  <div id="right">right</div>
  <div id="footer">footer</div>
</body>

<style>
  #hd {
    height: 50px;
    background: #666;
    text-align: center;
  }
  #middle {
    float: left;
    width: 100%; /*左栏上去到第一行*/
    height: 100px;
    background: blue;
  }
  #left {
    float: left;
    width: 180px;
    height: 100px;
    margin-left: -100%;
    background: #0c9;
  }
  #right {
    float: left;
    width: 200px;
    height: 100px;
    margin-left: -200px;
    background: #0c9;
  }

  /*给内部div添加margin，把内容放到中间栏，其实整个背景还是100%*/
  #inside {
    margin: 0 200px 0 180px;
    height: 100px;
  }
  #footer {
    clear: both; /*记得清楚浮动*/
    height: 50px;
    background: #666;
    text-align: center;
  }
</style>
```

#### flex 布局

```html
<head>
  <style>
    .container {
      border: 1px solid black;
      width: 100vw;
      height: 100vh;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .item {
      border: 1px solid red;
      height: 100%;
    }

    .left {
      width: 100px;
    }

    .right {
      flex: 1;
    }
  </style>
</head>

<body class="container">
  <div class="item left">100px宽</div>
  <div class="item right">自适应</div>
</body>
```

非 flex 布局方式

```html
<html>
  <head>
    <meta charset="utf-8" />
    <title>test.html</title>
    <style>
      .container {
        border: 1px solid black;
        width: 100vw;
        height: 100vh;
      }

      .item {
        border: 1px solid red;
        height: 100%;
      }

      .left {
        float: left;
        width: 100px;
      }

      .right {
        margin: 0 0 0 100px;
      }
    </style>
  </head>

  <body class="container">
    <div class="item left">100px宽</div>
    <div class="item right">自适应</div>
  </body>
</html>
```
