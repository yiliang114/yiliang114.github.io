---
title: VueLazyLoad
date: '2020-10-26'
draft: true
---

## Vue-lazyload

在有比较多图片加载的 vue 项目开发的初期一般我们会考虑”图片懒加载“来提高首屏加载的时间，图片懒加载的实际其实就是在页面视图可见范围以内图片就加载，当页面滑动的时候，原本不可见的图片现在可见了，就再去加载的过程。

mint-ui 组件库的 Lazy load 组件实际是直接引用了 vue-lazyload 组件。

### 原理

- 图片是通过 v-lazy 这个指令来实现。
- 组件
- 容器

### 基础概念

##### height 和 width

1. innerHeight innerWidth 是返回窗口的文档显示区的高度和宽度（只包括网页的部分）

2. outerHeight outerWidth 是返回整个浏览器的高度和宽度（从浏览器最外部开始算）

3. offsetWidth 获取物体宽度的数值， 这个实际的宽度是受盒模型的影响的。offsetWidth 实际获取的是盒模型(width+border + padding) <https://www.cnblogs.com/huaci/p/3863797.html>

4. image: naturalHeight, naturalWidth HTML5 的新属性，用来判断图片的真实宽度和高度。 但有个前提是，必须在图片完全下载到客户端浏览器才能判断，目前在 ie 9,Firefox, Chrome, Safari 和 Opera 都是可以使用的， 如果是不支持的版本浏览器，那可以用传统方法判断。

   ```
   var myimage = document.getElementById("myimage");
   if (typeof myimage.naturalWidth == "undefined") {
   // IE 6/7/8
   var i = new Image();
   i.src = myimage.src;
   var rw = i.width;
   var rh = i.height;
   }
   else {
   // HTML5 browsers
   var rw = myimage.naturalWidth;
   var rh = myimage.naturalHeight;
   }
   ```

##### 特定属性

1. data-srcset img 标签的预设 url， 自定义 html 属性可以一开始不加载 url 使用一个默认的很小的 base64 图片来显示，图片马上进入视图范围以内时，通过一个 loading 切换动画，并且监听器回调通过将预设的 url 替换到默认的 src 值上面，此时就会去发起 http 请求图片，达到一个懒加载的效果。

2. [`dataset`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset)

### 源码分析

```js
Vue.use(VueLazyload);
```

执行安装函数的时候，实际上是执行 index.js 中的 install 函数。

1. 注入 Vue 创建 LazyClass， 传入 options 参数创建 lazy 实例
2. 将 lazy 实例作为参数初始化 LazyContainer
3. Vue 原型链上添加 \$Lazyload
