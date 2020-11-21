---
layout: CustomPages
title: SkeletonScreen
date: 2020-11-21
aside: false
draft: true
---

一直以来，无论是web还是iOS、android的应用中，为了提升应用的加载等待这段时间的用户感知体验，各种奇门遁甲之术层出不穷。其中，菊花图以及由它衍生各种加载动画是一个非常大的流派，如下图所示：

![img](https://blog-10039692.file.myqcloud.com/1508382587648_934_1508382611328.gif)

由它衍生而出的各种加载动画也是遍地开花：

![img](https://blog-10039692.file.myqcloud.com/1508382595843_8516_1508382619365.jpg)

在很多的应用的交互中，这种菊花的加载的设计已然要一统江湖了。

不过，现在对于加载的设计体验有了比菊花加载体验更棒的方法，即本文要讲的**Skeleton Screen Loading**，中文一般叫做骨架屏。骨架屏听起来总觉得怪怪的，本文还是沿用英文的叫法**Skeleton Screen Loading**。

所谓Skeleton Screen Loading即表示在页面完全渲染完成之前，用户会看到一个样式简单，描绘了当前页面的大致框架，感知到页面正在逐步加载，加载完成后，最终骨架屏中各个占位部分将被真实的数据替换。

一图胜千言，来看看微信阅读的客户端，它就使用了Skeleton Screen Loading来提升它的加载体验，可以下载它的客户端实际感受下：

![img](https://blog-10039692.file.myqcloud.com/1508382617834_4936_1508382642834.gif)

现在好多web和客户端都已经放弃了以前的那种菊花的加载体验，转而使用Skeleton Screen Loading，比如Facebook、medium以及slack等。国内的饿了么、掘金等也都使用Skeleton Screen Loading来提升它们的加载体验。

![img](https://blog-10039692.file.myqcloud.com/1508382762452_1341_1508382786287.jpg)

下面这段话，是iOS中关于加载体验的交互设计标准的一个说明：

> Don’t make people wait for content to load before seeing the screen they’re expecting. Show the screen immediately, and use placeholder text, graphics, or animations to identify where content isn’t available yet. Replace these placeholder elements as the content loads. — Apple iOS Human Interface Guidelines

使用Skeleton Screen Loading也充分遵循了iOS人机交互设计指南。本文就来讲讲如何使用vue来实现Skeleton Screen Loading。

## VUE实现思路

在本文中，我们将会使用vue组件 (Component) 功能来实现一个Skeleton Screen Loading，如下图所示：

![img](https://blog-10039692.file.myqcloud.com/1508382785194_44_1508382808701.gif)

具体vue组件 (Component) 功能这里就不详讲了，可以去[官方的文档](https://cn.vuejs.org/v2/guide/components.html)看看详细的信息。

这里推荐一个模拟开发数据的开源服务[jsonplaceholder](https://jsonplaceholder.typicode.com/)，类似经常使用的图片占位服务一样，它提供了在web开发中一些常见数据类型的api服务，比如文章、评论、用户系统等，都提供了对应的接口，在开发调试阶段还是非常方便的。

比如我们做的这个例子要用到用户系统，直接使用这个[用户数据接口](https://jsonplaceholder.typicode.com/users)就行了。

首先，主要的工作是实现Skeleton Screen Loading加载动画，先使用常规的html和css来实现这个动画。

动画效果如下所示：

![img](https://blog-10039692.file.myqcloud.com/1508382906163_7373_1508382929797.gif)

先定义好html结构：

```javascript
 <div class="timeline-item">
   <div class="animated-background">
     <div class="background-masker header-top"></div>
     <div class="background-masker header-left"></div>
     <div class="background-masker header-right"></div>
     <div class="background-masker header-bottom"></div>
     <div class="background-masker subheader-left"></div>
     <div class="background-masker subheader-right"></div>
     <div class="background-masker subheader-bottom"></div>
   </div>
</div>
```

下面来说说实现动画的主要思路：

要实现这样的效果，需要使用一点点小技巧。先在图层animated-background定义一个大的渐变背景，然后在不需要显示背景图的位置，定义几个占位的结构填充为白色就可以实现上图所示的UI展现形式。最后使用background-position来移动背景图片的位置，就可以实现图中的动画效果。

详细的代码可以去这里查看，[demo](https://codepen.io/janily/pen/rGqQgJ)。

主要的效果实现了，下面就可以正式开工来定义我们的**Skeleton Screen Loading**组件。

```javascript
Vue.component('user-item', {
  props: ['email', 'name'],
  template: `<div>
      <h2 v-text="name"></h2>
      <p v-text="email"></p>
    </div>`
})

Vue.component('loading-item', {
  template: `<div class="animated-background">
     <div class="background-masker header-top"></div>
     <div class="background-masker header-left"></div>
     <div class="background-masker header-right"></div>
     <div class="background-masker header-bottom"></div>
     <div class="background-masker subheader-left"></div>
     <div class="background-masker subheader-right"></div>
     <div class="background-masker subheader-bottom"></div>
   </div>`
})
```

上面定义了两个组件，一个是用来显示用户信息数据的组件user-item；一个在加载完之前来显示Skeleton Screen Loading效果的loading-item组件。

定义好组件后，然后在主文件定义好对应的结构来注册使用组件：

```javascript
<div id="app">
  <div v-for="user in users" class="items" v-if="loading">
    <user-item :name="user.name" :email="user.email"></user-item>
  </div>
  <div v-for="load in loades" v-if="!loading">
    <loading-item></loading-item>
  </div>
</div>
```

根据上面定义好的组件，上面的代码表示，当数据加载完后，显示用户数据。当还没有加载完用户数据，则显示预先定义好的加载组件即loading-item。

```javascript
var app = new Vue({
  el: '#app',
  data: {
    users: [],
    loading: false,
    loades: 10
  },
  methods: {
    getUserDetails: function() {
      fetch(`https://jsonplaceholder.typicode.com/users`)
        .then(result => result.json())
        .then(result => {
          this.users = result
          this.loading = true
        });
    }
  },
  created: function() {
    setTimeout(() => {
      this.getUserDetails()
    }, 1000);
  }
});
```

一个简单优雅的Skeleton Screen Loading就完成了。

通过上面简单的实例，可以明显感受到当使用Skeleton Screen Loading来代替传统的菊花图在体验上更加好一些。

使用Skeleton Screen Loading，可以利用一些视觉元素来将内容的轮廓更快显示在屏幕上，让用户在等待加载的过程中对将要加载的内容有一个更加清晰的预期，特别是在弱网络的场景下，Skeleton Screen Loading的体验无疑是更好的，用起来吧。

对于Skeleton Screen Loading，你有什么样的看法呢？欢迎在评论区留言一起分享你的看法。



https://codepen.io/janily/pen/rGqQgJ