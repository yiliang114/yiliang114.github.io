---
title: performance
date: 2020-11-21
draft: true
---

性能优化的原则是以更好的用户体验为标准，具体就是实现下面的目标:

1. 多使用内存、缓存或者其他方法
2. 减少 CPU 和 GPU 计算，更快展现

优化的方向有两个:

1. 减少页面体积，提升网络加载
2. 优化页面渲染

### 性能优化

- 网络部分
  - 尽量减少 HTTP 请求数
    - 合并文件
    - 雪碧图
    - 小图 Base64，图片小于 30k 的图片直接做成 base64；
  - 减少 DNS 查找
    - 开启 DNS 预解析
  - 使用 CDN 静态资源服务器
- 缓存
  - 添上协商缓存、强缓存等形式
  - 使用外链的方式引入 JS 和 CSS（缓存）
- 内容部分
  - 按需加载组件
  - 预加载组件
- JS 部分
  - 把脚本放在底部， 加快渲染页面
  - 将脚本成组打包，减少请求
  - 使用非阻塞方式下载 js 脚本， 异步加载等。通过 preload prefetch 优化加载资源的时间
    - 动态脚本加载： 使用 JS 创建一个 script 标签再插入到页面中
    - defer（IE）：整个 HTML**解析完**后才会执行，如果是多个，按照加载顺序依次执行
    - async： **加载完**之后立即执行，如果是多个，执行和加载顺序无关
  - 大的文件使用 code split 进行切割，按需加载 js 文件
  - 合并 DOM 插入,DOM 操作是非常耗费性能的，因此插入多个标签时，先插入 Fragment 然后再统一插入 DOM。
  - 事件节流
- 图片部分
  - 选用合适的图片格式
  - 图片按需加载
- 组件的按需加载，接口按需请求，code split
- cookie
  - 给 cookie 减肥
    - 清除不必要的 cookie
    - cookie 尽可能小
    - 设置好合适的域
    - 合适的有效期
  - 把静态资源放在不含 cookie 的域下。当浏览器发送对静态图像的请求时，cookie 也会一起发送，而服务器根本不需要这些 cookie。
- 服务器
  - 开启 Gzip 等压缩
- webpack 开启 tree-shaking 减少代码体积
  - vue 中 code spilt ，路由懒加载。

### 如何渲染几万条数据并不卡住界面

考察如何在不卡住页面的情况下渲染数据，也就是说不能一次性将几万条都渲染出来，而应该一次渲染部分 DOM，那么就可以通过 `requestAnimationFrame` 来每 16 ms 刷新一次。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <ul>
      控件
    </ul>
    <script>
      setTimeout(() => {
        // 插入十万条数据
        const total = 100000;
        // 一次插入 20 条，如果觉得性能不好就减少
        const once = 20;
        // 渲染数据总共需要几次
        const loopCount = total / once;
        let countOfRender = 0;
        let ul = document.querySelector('ul');
        function add() {
          // 优化性能，插入不会造成回流
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < once; i++) {
            const li = document.createElement('li');
            li.innerText = Math.floor(Math.random() * total);
            fragment.appendChild(li);
          }
          ul.appendChild(fragment);
          countOfRender += 1;
          loop();
        }
        function loop() {
          if (countOfRender < loopCount) {
            window.requestAnimationFrame(add);
          }
        }
        loop();
      }, 0);
    </script>
  </body>
</html>
```

1. 前端长列表的性能优化

只渲染页面用用户能看到的部分。并且在不断滚动的过程中去除不在屏幕中的元素，不再渲染，从而实现高性能的列表渲染。
借鉴着这个想法，我们思考一下。当列表不断往下拉时，web 中的 dom 元素就越多，即使这些 dom 元素已经离开了这个屏幕，不被用户所看到了，这些 dom 元素依然存在在那里。导致浏览器在渲染时需要不断去考虑这些 dom 元素的存在，
造成 web 浏览器的长列表渲染非常低效。因此，实现的做法就是捕捉 scroll 事件，当 dom 离开屏幕，用户不再看到时，就将其移出 dom tree。

### 插入几万个 DOM，如何实现页面不卡顿？

肯定不能一次性把几万个 DOM 全部插入，这样肯定会造成卡顿，所以解决问题的重点应该是如何分批次部分渲染 DOM。部分人应该可以想到通过 `requestAnimationFrame` 的方式去循环的插入 DOM，其实还有种方式去解决这个问题：**虚拟滚动**（virtualized scroller）。

**这种技术的原理就是只渲染可视区域内的内容，非可见区域的那就完全不渲染了，当用户在滚动的时候就实时去替换渲染的内容。**

![滚动](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/vScroll.png)

从上图中我们可以发现，即使列表很长，但是渲染的 DOM 元素永远只有那么几个，当我们滚动页面的时候就会实时去更新 DOM，这个技术就能顺利解决这发问题。如果你想了解更多的内容可以了解下这个 [react-virtualized](https://github.com/bvaughn/react-virtualized)。

### 100 亿排序问题：内存不足，一次只允许你装载和操作 1 亿条数据，如何对 100 亿条数据进行排序

- 把这 100 亿的 int 型数据以文件形式存储到 100 个小文件中
- 对这 100 个小文件分别读取后排序再存入
- 遍历排序后对 100 个小文件，每个小文件里面取第一个数字, 组成一个 100 大数的堆
- new 个空的大文件存最后的结果
- 之后出 100 个数的那个堆,找到对应的小文件取数字,写入大文件, 记得 flash, gc 之类的
- 循环 3, 等所有的小文件都取完, 大文件就是存的最后结果

### 页面大量图片，如何优化加载，优化用户体验

1. 图片懒加载。在页面的未可视区域添加一个滚动事件，判断图片位置与浏览器顶端的距离与页面的距离，如果前者小于后者，优先加载。
1. 如果为幻灯片、相册等，可以使用图片预加载技术，将当前展示图片的前一张和后一张优先下载。
1. 如果图片为 css 图片，可以使用 CSSsprite，SVGsprite 等技术。
1. 如果图片过大，可以使用特殊编码的图片，加载时会先加载一张压缩的特别厉害的缩略图，以提高用户体验。
1. 如果图片展示区域小于图片的真实大小，应在服务器端根据业务需要先进行图片压缩，图片压缩后大小与展示一致。

### 图片懒加载与预加载

图片懒加载的原理就是暂时不设置图片的 src 属性，而是将图片的 url 隐藏起来，比如先写在 data-src 里面，等某些事件触发的时候(比如滚动到底部，点击加载图片)再将图片真实的 url 放进 src 属性里面，从而实现图片的延迟加载

图片预加载，是指在一些需要展示大量图片的网站，实现图片的提前加载。从而提升用户体验。常用的方式有两种，一种是隐藏在 css 的 background 的 url 属性里面，一种是通过 javascript 的 Image 对象设置实例对象的 src 属性实现图片的预加载。相关代码如下：
css 实现

```css
#preload-01 {
  background: url(http://domain.tld/image-01.png) no-repeat -9999px -9999px;
}
#preload-02 {
  background: url(http://domain.tld/image-02.png) no-repeat -9999px -9999px;
}
#preload-03 {
  background: url(http://domain.tld/image-03.png) no-repeat -9999px -9999px;
}
```

Javascript 预加载图片的方式：

```js
function preloadImg(url) {
  var img = new Image();
  img.src = url;
  if (img.complete) {
    //接下来可以使用图片了
    //do something here
  } else {
    img.onload = function() {
      //接下来可以使用图片了
      //do something here
    };
  }
}
```

预加载：提前加载图片，当用户需要查看时可直接从本地缓存中渲染。
懒加载：懒加载的主要目的是作为服务器前端的优化，减少请求数或延迟请求数。
两种技术的本质：两者的行为是相反的，一个是提前加载，一个是迟缓甚至不加载。
懒加载对服务器前端有一定的缓解压力作用，预加载则会增加服务器前端压力

### Gzip

差不多能压缩 1/4 的体积
https://blog.csdn.net/baidu_35407267/article/details/77141871
es6 以上不支持 uglify 需要压缩代码的话，要使用 babel 的 minify

### 移动端性能优化

- 尽量使用 css3 动画，开启硬件加速。
- 适当使用`touch`事件代替`click`事件。
- 避免使用`css3`渐变阴影效果。
- 可以用`transform: translateZ(0)`来开启硬件加速。
- 不滥用 Float。Float 在渲染时计算量比较大，尽量减少使用
- 不滥用 Web 字体。Web 字体需要下载，解析，重绘当前页面，尽量减少使用。
- 合理使用 requestAnimationFrame 动画代替 setTimeout
- CSS 中的属性（CSS3 transitions、CSS3 3D transforms、Opacity、Canvas、WebGL、Video）会触发 GPU 渲染，请合理使用。过渡使用会引发手机过耗电增加
- PC 端的在移动端同样适用

### 预渲染

> 可以通过预渲染将下载的文件预先在后台渲染，可以使用以下代码开启预渲染

```html
<link rel="prerender" href="http://example.com" />
```

- 预渲染虽然可以提高页面的加载速度，但是要确保该页面百分百会被用户在之后打开，否则就白白浪费资源去渲染

### 代码层面

- 防抖
- 节流

### 使用 Webpack 优化项目

- 对于 Webpack4，打包项目使用 production 模式，这样会自动开启代码压缩
- 使用 ES6 模块来开启 tree shaking，这个技术可以移除没有使用的代码
- 优化图片，对于小图可以使用 base64 的方式写入文件中
- 按照路由拆分代码，实现按需加载
- 给打包出来的文件名添加哈希，实现浏览器缓存文件

### 对组件库的优化

- 提供按需加载
- 图片、样式等走 cdn，懒加载等
- table list 海量数据，虚拟列表
- 页面加载海量数据
  - https://juejin.im/post/5ae17a386fb9a07abc299cdd

### 虚拟列表的实现原理

有两种形式 ？

定高和不定高。

#### ant table 的虚拟列表

### 懒加载原理

1. 路由分割、图片、数据懒加载
2. 数据日志、error、埋点上报
3. 日志可视化

一开始先给为 src 赋值成一个通用的预览图，下拉时候再动态赋值成正式的图片。如 下， preview.png 是预览图片，比较小，加载很快，而且很多图片都共用这个 `preview.png` ，加载一次即可。待页面下拉，图片显示出来时，再去替换 src 为 `data-realsrc` 的值。

`<img src="preview.png" data-realsrc="abc.png"/>`. 另外，这里为何要用 `data-` 开头的属性值?—— 所有 HTML 中自定义的属性，都应该用 `data-` 开头，因为 `data-` 开头的属性浏览器渲染的时候会忽略掉，提高渲染性能。

### webpack code split

![image](https://user-images.githubusercontent.com/11473889/109128661-a9080780-778a-11eb-8e34-3d93864be75d.png)

外部引入 cdn 的形式总体上还是会减小包的大小的。

#### 页面性能

保证页面加载的流畅，提升页面性能的方法有哪些？

- 资源压缩合并，减少 HTTP 请求，开启 gzip 压缩
- 非核心代码的异步加载

  - 异步加载方式
    - 动态脚本加载
    - defer
    - async
  - 异步加载的区别
    - defer 是 HTML 解析完之后才会执行，如果是多个按照循序依次执行
    - async 是在加载完之后立即执行，如果是多个，执行顺序和加载顺序无关，哪一个先加载完毕先执行

- 利用浏览器缓存
- 使用 CDN
- DNS 预解析(啥叫预解析？ 很多浏览器中（打开）的 a 标签的预解析开关，但是对于 https 的链接，默认是关闭的，打开的话提升性能)

  - http-equiv="x-dns-prefetch-control" content="on"
  - rel="dns-prefetch"

### 减少页面的计算

减少页面的计算，抽离功能函数，放到 node 层
