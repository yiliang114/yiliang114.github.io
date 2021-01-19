---
title: 布局
date: 2020-11-21
draft: true
---

### 介绍下栅格系统 (grid system)

一个基本的栅格系统仅仅需要几个元素

- a container （一个容器）
- rows （行）
- columns （列）
- gutters (the space between columns)

容器：

容器是用于设置整个栅格的宽度， 容器的宽度通常是 100%, 但是，你可能也要设置一下最大宽度，用于限制在大屏幕的展示

行：
行是用于确保它里面的列元素不会溢出到其他的行元素里面，为了达到目的，通常我们需要使用 clearfix。

列:
列是栅格系统中最重要的组成部分，我们通常需要在不同的分辨率下，改变他的宽度来实现响应式布局。
列与列之间的间距:
这里通常需要开启'border-box' 模式。

最后，通过媒体查询来实现响应式布局

完整代码

```css
.grid-container {
    width: 100%;
    max-width : 1200px;
    margin: 0 auto;
}
.grid-container *{
    box-sizing: border-box;
}
.row:before,
.row:after {
    content:"";
    display: table ;
    clear:both;
}
[class*='col-'] {
    float: left;
    min-height: 1px;
    width: 16.66%;
    padding: 12px;
    background-color: #FFDCDC;
}
.col-1{
    width: 16.66%;
}
.col-2{
    width: 33.33%;
}
.col-3{
    width: 50%;
}
.col-4{
    width: 66.664%;
}
.col-5{
    width: 83.33%;
}
.col-6{
    width: 100%;
}


.outline, .outline *{
    outline: 1px solid #F6A1A1;
}


[class*='col-'] > p {
 background-color: #FFC2C2;
 padding: 0;
 margin: 0;
 text-align: center;
 color: white;
}


@media screen and (max-width:800px){
    .col-1{ width: 33.33%;  }
    .col-2{ width: 50%;     }
    .col-3{ width: 83.33%;  }
    .col-4{ width: 100%;    }
    .col-5{ width: 100%;    }
    .col-6{ width: 100%;    }


    .row .col-2:last-of-type{
        width: 100%;
    }


    .row .col-5 ~ .col-1{
        width: 100%;
    }
}


@media screen and (max-width:650px){
    .col-1{ width: 50%;     }
    .col-2{ width: 100%;    }
    .col-3{ width: 100%;    }
    .col-4{ width: 100%;    }
    .col-5{ width: 100%;    }
    .col-6{ width: 100%;    }
}
```

HTML 代码：

```html
<div class="grid-container outline">
  <div class="row">
    <div class="col-1"><p>col-1</p></div>
    <div class="col-1"><p>col-1</p></div>
    <div class="col-1"><p>col-1</p></div>
    <div class="col-1"><p>col-1</p></div>
    <div class="col-1"><p>col-1</p></div>
    <div class="col-1"><p>col-1</p></div>
  </div>
  <div class="row">
    <div class="col-2"><p>col-2</p></div>
    <div class="col-2"><p>col-2</p></div>
    <div class="col-2"><p>col-2</p></div>
  </div>
  <div class="row">
    <div class="col-3"><p>col-3</p></div>
    <div class="col-3"><p>col-3</p></div>
  </div>
  <div class="row">
    <div class="col-4"><p>col-4</p></div>
    <div class="col-2"><p>col-2</p></div>
  </div>
  <div class="row">
    <div class="col-5"><p>col-5</p></div>
    <div class="col-1"><p>col-1</p></div>
  </div>
  <div class="row">
    <div class="col-6"><p>col-6</p></div>
  </div>
</div>
```
