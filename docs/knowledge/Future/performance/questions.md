---
layout: CustomPages
title: performance
date: 2020-11-21
aside: false
draft: true
---

### 如何进行网站性能优化

- content 方面

  1. 减少 HTTP 请求：合并文件、CSS 精灵、inline Image
  2. 减少 DNS 查询：DNS 查询完成之前浏览器不能从这个主机下载任何任何文件。方法：DNS 缓存、将资源分布到恰当数量的主机名，平衡并行下载和 DNS 查询
  3. 避免重定向：多余的中间访问
  4. 使 Ajax 可缓存
  5. 非必须组件延迟加载
  6. 未来所需组件预加载
  7. 减少 DOM 元素数量
  8. 将资源放到不同的域下：浏览器同时从一个域下载资源的数目有限，增加域可以提高并行下载量
  9. 减少 iframe 数量
  10. 不要 404

- Server 方面
  1. 使用 CDN
  2. 添加 Expires 或者 Cache-Control 响应头
  3. 对组件使用 Gzip 压缩
  4. 配置 ETag
  5. Flush Buffer Early
  6. Ajax 使用 GET 进行请求
  7. 避免空 src 的 img 标签
- Cookie 方面
  1. 减小 cookie 大小
  2. 引入资源的域名不要包含 cookie
- css 方面
  1. 将样式表放到页面顶部
  2. 不使用 CSS 表达式
  3. 使用<link>不使用@import
  4. 不使用 IE 的 Filter
- Javascript 方面
  1. 将脚本放到页面底部
  2. 将 javascript 和 css 从外部引入
  3. 压缩 javascript 和 css
  4. 删除不需要的脚本
  5. 减少 DOM 访问
  6. 合理设计事件监听器
- 图片方面
  1. 优化图片：根据实际颜色需要选择色深、压缩
  2. 优化 css 精灵
  3. 不要在 HTML 中拉伸图片
  4. 保证 favicon.ico 小并且可缓存
- 移动方面
  1. 保证组件小于 25k
  2. Pack Components into a Multipart Document

### 你如何对网站的文件和资源进行优化？

    期待的解决方案包括：
     文件合并
     文件最小化/文件压缩
     使用 CDN 托管
     缓存的使用（多个域名来提供缓存）
     其他

### 请说出三种减少页面加载时间的方法。

1. 优化图片
2. 图像格式的选择（GIF：提供的颜色较少，可用在一些对颜色要求不高的地方）
3. 优化 CSS（压缩合并 css，如 margin-top,margin-left...)
4. 网址后加斜杠（如 www.campr.com/目录，会判断这个“目录是什么文件类型，或者是目录。）
5. 标明高度和宽度（如果浏览器没有找到这两个参数，它需要一边下载图片一边计算大小，如果图片很多，浏览器需要不断地调整页面。这不但影响速度，也影响浏览体验。当浏览器知道了高度和宽度参数后，即使图片暂时无法显示，页面上也会腾出图片的空位，然后继续加载后面的内容。从而加载时间快了，浏览体验也更好了。）
6. 减少 http 请求（合并文件，合并图片）。

### 面试题

**如何渲染几万条数据并不卡住界面**

这道题考察了如何在不卡住页面的情况下渲染数据，也就是说不能一次性将几万条都渲染出来，而应该一次渲染部分 DOM，那么就可以通过 `requestAnimationFrame` 来每 16 ms 刷新一次。

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

- 你会用什么工具来查找代码中的性能问题？
- 你会用什么方式来增强网站的页面滚动效能？
- 请解释 layout、painting 和 compositing 的区别。

Form [Front-end-Developer-Interview-Questions](https://github.com/h5bp/Front-end-Developer-Interview-Questions)

- [Yahoo Best Practices for Speeding Up Your Web Site](https://developer.yahoo.com/performance/rules.html)
- [Google 使用 RAIL 模型评估性能](https://developers.google.com/web/fundamentals/performance/rail)
- [前端性能优化最佳实践](https://csspod.com/frontend-performance-best-practices/)

1. 前端长列表的性能优化

只渲染页面用用户能看到的部分。并且在不断滚动的过程中去除不在屏幕中的元素，不再渲染，从而实现高性能的列表渲染。
借鉴着这个想法，我们思考一下。当列表不断往下拉时，web 中的 dom 元素就越多，即使这些 dom 元素已经离开了这个屏幕，不被用户所看到了，这些 dom 元素依然存在在那里。导致浏览器在渲染时需要不断去考虑这些 dom 元素的存在，
造成 web 浏览器的长列表渲染非常低效。因此，实现的做法就是捕捉 scroll 事件，当 dom 离开屏幕，用户不再看到时，就将其移出 dom tree。

### 插入几万个 DOM，如何实现页面不卡顿？

肯定不能一次性把几万个 DOM 全部插入，这样肯定会造成卡顿，所以解决问题的重点应该是如何分批次部分渲染 DOM。部分人应该可以想到通过 `requestAnimationFrame` 的方式去循环的插入 DOM，其实还有种方式去解决这个问题：**虚拟滚动**（virtualized scroller）。

这种技术的原理就是只渲染可视区域内的内容，非可见区域的那就完全不渲染了，当用户在滚动的时候就实时去替换渲染的内容。

![滚动](../img/vScroll.png)

从上图中我们可以发现，即使列表很长，但是渲染的 DOM 元素永远只有那么几个，当我们滚动页面的时候就会实时去更新 DOM，这个技术就能顺利解决这发问题。如果你想了解更多的内容可以了解下这个 [react-virtualized](https://github.com/bvaughn/react-virtualized)。

项目中使用过哪些优化方法
优化中会提到缓存的问题，问：静态资源或者接口等如何做缓存优化
页面 DOM 节点太多，会出现什么问题？如何优化？

### a.b.c.d 和 a['b']['c']['d']，哪个性能更高？

[参考链接](https://github.com/airuikun/Weekly-FE-Interview/issues/19)

### 2 万小球问题：在浏览器端，用 js 存储 2 万个小球的信息，包含小球的大小，位置，颜色等，如何做到对这 2 万条小球信息进行最优检索和存储

思路：

- 用 ArrayBuffer 实现极致存储
- 哈夫曼编码 + 字典查询树实现更优索引
- 用 bit-map 实现大数据筛查
- 用 hash 索引实现简单快捷的检索
- 用 IndexedDB 实现动态存储扩充浏览器端虚拟容量
- 用 iframe 的漏洞实现浏览器端 localStorage 无限存储，实现 2 千万小球信息存储

扩展：如何尽可能流畅的实现这 2 万小球在浏览器中，以直线运动的动效显示出来. 提供几个思路：

- 使用 GPU 硬件加速
- 使用 webGL
- 使用 assembly 辅助计算，然后在浏览器端控制动画帧频
- 用 web worker 实现 javascript 多线程，分块处理小球
- 用单链表树算法和携程机制，实现任务动态分割和任务暂停、恢复、回滚，动态渲染和处理小球

### 100 亿排序问题：内存不足，一次只允许你装载和操作 1 亿条数据，如何对 100 亿条数据进行排序

- 把这 100 亿的 int 型数据以文件形式存储到 100 个小文件中
- 对这 100 个小文件分别读取后排序再存入
- 遍历排序后对 100 个小文件，每个小文件里面取第一个数字, 组成一个 100 大数的堆
- new 个空的大文件存最后的结果
- 之后出 100 个数的那个堆,找到对应的小文件取数字,写入大文件, 记得 flash, gc 之类的
- 循环 3, 等所有的小文件都取完, 大文件就是存的最后结果

### 页面大量图片，如何优化加载，优化用户体验

图片懒加载。在页面的未可视区域添加一个滚动事件，判断图片位置与浏览器顶端的距离与页面的距离，如果前者小于后者，优先加载。
如果为幻灯片、相册等，可以使用图片预加载技术，将当前展示图片的前一张和后一张优先下载。
如果图片为 css 图片，可以使用 CSSsprite，SVGsprite 等技术。
如果图片过大，可以使用特殊编码的图片，加载时会先加载一张压缩的特别厉害的缩略图，以提高用户体验。
如果图片展示区域小于图片的真实大小，应在服务器端根据业务需要先进行图片压缩，图片压缩后大小与展示一致。

### 数组里面有 10 万个数据，取第一个元素和第 10 万个元素的时间相差多少

![image](https://user-images.githubusercontent.com/21194931/57821866-bd9d2a80-77c4-11e9-8c27-c38ed2752197.png)

数组可以直接根据索引取的对应的元素，所以不管取哪个位置的元素的时间复杂度都是 O(1)
消耗时间几乎一致，差异可以忽略不计

### Vue react 项目的路由懒加载

### km 上有一篇 starkwwang 写的一篇 react 性能优化

### 图片懒加载，vue-lazyload 的实现原理

### 图片 base64 处理， 说一说 base64 做的处理是什么？

### chrome 75 之后 img 可以直接被懒加载 loading=lazy

### 如果一个页面要做性能优化，从哪方面考察，从哪些地方优化

### 项目中使用过哪些优化方法

### 优化中会提到缓存的问题，问：静态资源或者接口等如何做缓存优化

### 服务部署到同一个区域，能加速；静态资源使用 cdn

### 雪碧图处理： 直接通过 wbepack 插件进行处理。 小于多大的自动创建雪碧图。我记得是。

### 请解释 layout、painting 和 compositing 的区别。

### 性能优化

### 减少 http 请求数

- 使用 grophl ，最佳的解决方案

### vue 中 code spilt ，路由懒加载。

### css，js 放置位置， 异步加载 js

### 代码压缩、图片压缩

### 雪碧图

### cdn 原理

### 懒加载原理

### localstorage 等离线缓存

### 域名收敛和发散 也是一种优化

### 图片进行懒加载

### 一个页面中需要请求很多个接口才能获取到需要的所有数据，通过 graphQL 将接口进行聚合。列表类的接口通常可以设置成懒加载（如果不是设置成翻页的话）

### h5 中如何优化首屏

### 如何优化 vue 项目的 bundlejs 体积， webpack-bundle-analyzer 打包依赖分析。

### 接口 waiting 时间很长， 请求到是很快

### vuex 的封装，希望一个接口请求之后，能够灵活得触发额外的几个异步接口

### vuex 动态加载 namespace， 整个 store 树一起加载会很慢

- 首先，vuex 里面并不推荐使用 redux 的状态机，success error 等状态，都能够触发不同的自定义异步事件，至于 loading 的状态，应该是根据 vuex getter 中获取的数据，是否符合预期，符合预期就显示，如果不符合预期，比如报错了，如果不适用全局通知的话怎么全局显示 是一个问题？这就是状态机的必要之处吧？ 想一想这里如何进行处理。 如果能用全局通知的话，状态机似乎就真的没啥用了。

### window.performce 这个 api 的使用，以及哪一些数据能够被用来采集上报等

### 分析 emonitor 的实现和上报的原理

### 加快页面的加载速度的方式

### cdn 的用法是什么？什么时候用到？

### 浏览器的页面优化？

### 如何优化 DOM 操作的性能

### 单页面应用有什么 SEO 方案？

### 单页面应用首屏显示比较慢，原因是什么？有什么解决方案？

### 谈谈你对前端性能优化的理解:

a. 请求数量：合并脚本和样式表，CSS Sprites，拆分初始化负载，划分主域
b. 请求带宽：开启 GZip，精简 JavaScript，移除重复脚本，图像优化，将 icon 做成字体
c. 缓存利用：使用 CDN，使用外部 JavaScript 和 CSS，添加 Expires 头，减少 DNS 查找，配置 ETag，使
AjaX 可缓存
d. 页面结构：将样式表放在顶部，将脚本放在底部，尽早刷新文档的输出
e. 代码校验：避免 CSS 表达式，避免重定向
参考《前端工程与性能优化》

### 请说出三种减少页面加载时间的方法

a. 尽量减少页面中重复的 HTTP 请求数量
b. 服务器开启 gzip 压缩
c. css 样式的定义放置在文件头部
d. Javascript 脚本放在文件末尾
e. 压缩合并 Javascript、CSS 代码
f. 使用多域名负载网页内的多个文件、图片
参考《减低页面加载时间的方法》

### 你都使用哪些工具来测试代码的性能？

JSPerf, Dromaeo

### 一个页面上有大量的图片（大型电商网站），加载很慢，你有哪些方法优化这些图片的加载，给用

户更好的体验。
a. 图片懒加载，滚动到相应位置才加载图片。
b. 图片预加载，如果为幻灯片、相册等，将当前展示图片的前一张和后一张优先下载。
c. 使用 CSSsprite，SVGsprite，Iconfont、Base64 等技术，如果图片为 css 图片的话。
d. 如果图片过大，可以使用特殊编码的图片，加载时会先加载一张压缩的特别厉害的缩略图，以提高用户体验。

### cdn 的用法是什么？什么时候用到？

### 前端性能

### 性能优化，除了雅虎 13 条军规，还有哪些

### resize 和 scroll 事件的性能优化

### 看了一下你的几个项目，能告诉我你在遇到问题是怎么解决的吗?（问题主要在最后的性能问题上。自己首先会尝试调优一下自己的代码，然后再去从文件打包上去思考，如果无法自己解决，会去参考下别人的博客或者是社区。）

### 开启 gzip

### 如何加快页面加载速度？（减少 HTTP 访问次数、CDN、minify、服务器增加缓存、CSS 放前面 JS 放后面、图片压缩、CSS Sprite（我之前一直以为是 Spirit ）等。）

### 为什么要减少 HTTP 访问次数？（浏览器进程请求链接的数目是有限的，如果有很多 HTTP 请求，有些就得等着；另外，建立 HTTP 链接的开销比较大，需要三次握手之类，而相对地，一次连接中文件大小的边际成本就很小。）

### 文件合并

### css 精灵

### 避免页面跳转

### JavaScript 延迟加载

### 减少 dom 元素数量：会加大页面加载和脚本执行的效率

### 浏览器一般对于同一个域的下载连接数有所限制，按照域名划分下载内容可以使得浏览器增大并行下载链接，但是注意控制域名使用在 2-4 个之间，不然 dns 查询也是个问题。

### 一般网站规划会将静态资源放在类似于 static.example.com，动态内容放在 www.example.com 上，这样做还有一个好处是可以在静态的域名上避免使用 cookie，后面会在 cookie 的规则中提到。

### （静态资源 static.example.com 和动态内容 www.example.com 这个例子有点小问题，很多大型网站由于存在分站（比如网易的 news.163.com），cookie 是写在.example.com 下的，静态资源域名需要彻底剥离，比如淘宝的 tbcdn.com）

### 404 我们都不陌生，代表服务器没有找到资源，我们需要特别注意 404 的情况 下不要在我们提供的网页资源上，客户端发送一个请求但是服务器却反悔一个无用- 的结果，时间浪费掉了。

### 使用 cdn

### 利用缓存： cache-control 和 expires

### gzip 压缩传输文件

### 配置 etag

### 避免空的 src： 空的图- 然会使浏览器发送请求到服务器，这样完全是浪费事件，而且浪费服务器的资源。尤其是你的网站每天被很多人访问的时候，这种空请- 求造成的伤害不容忽略。

### 减少 cookie 的大小： cookie 被用来做认证或者个性化设置，其信息被包含在 http 报文头中，对于 cookie 我们需要注意以下几点，来提高请求的响应速度。

### Gzip

差不多能压缩 1/4 的体积
https://blog.csdn.net/baidu_35407267/article/details/77141871
es6 以上不支持 uglify 需要压缩代码的话，要使用 babel 的 minify

### css 样式表置顶： 经样式表（css）放在网页的 head 这种会让网页的加载速度更快，因为这样做可以使浏览器逐步加载已经下载的网页内容。这对内容比较多的网页尤其重要，用户不用一直等待在一个白屏上而是可以先看已经下载的内容。如果将样式表放在底部，浏览器会拒绝渲染已经下载的网页，因为大多数浏览器在- 实现时都努力避免重绘，样式表中的内容是绘制网页的关键信息，没有下载下来之前只好对不起观众了。

### 文件合并（目的是减少 http 请求）

### 文件压缩：目的是直接减少文件下载的体积

### 使用 CDN （内容分发网络）来托管资源

### 缓存的使用（并且多个域名来提供缓存）

### GZIP 压缩你的 JS 和 CSS 文件

### 减少 http 请求（合并文件、合并图片）

### 优化图片文件，减小其尺寸，特别是缩略图，图片懒加载

### 压缩 Javascript、CSS 代码

### 从雪碧图到 svg

### 从 promise 到 await

### vue react 从声明周期中考虑的避免 rerender 的优化

### cdn 加速

### webpack 压缩

### 图片资源的压缩，换格式啥的

### 添加缓存 expires 头进行缓存，或者为 HTML 指定 Cache-Control

### 配置 Etag 和 Last-Modified

### 使用 ajax 可缓存（在进行 Ajax 请求的时候，可以选择尽量使用 get 方法，这样可以使用客户端的缓存，提高请求速度。）

### 静态资源不同域名存放（同一个域名并行下载文件数量有限）

### https://www.jianshu.com/p/ead7dab72cd6?mType=Group

#### TODO: react vue jquery 的图片懒加载、背景图片懒加载的功能

https://github.com/lzxb/lazy-load-img
https://github.com/tuupola/jquery_lazyload/blob/2.x/lazyload.js
https://www.cnblogs.com/careyyibu/p/8695205.html
https://blog.csdn.net/baidu_24024601/article/details/76167082
http://www.techug.com/post/photoshop-beauty-experiment.html
http://www.webhek.com/post/background-image-lazy-load.html
https://code.i-harness.com/zh-CN/q/b7540e
https://github.com/ApoorvSaxena/lozad.js/blob/master/src/lozad.js
https://segmentfault.com/a/1190000011527281

https://juejin.im/post/5d548b83f265da03ab42471d

### 单页面首屏加载慢，原因是什么，有什么解决方案
