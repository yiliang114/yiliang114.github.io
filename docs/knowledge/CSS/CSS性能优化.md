---
title: 浏览器
date: 2020-11-21
draft: true
---

### css sprite 是什么,有什么优缺点

概念：将多个小图片拼接到一个图片中。通过 background-position 和元素尺寸调节需要显示的背景图案。

优点：

1. 减少 HTTP 请求数，极大地提高页面加载速度
2. 增加图片信息重复度，提高压缩比，减少图片大小
3. 更换风格方便，只需在一张或几张图片上修改颜色或样式即可实现

缺点：

1. 图片合并麻烦
2. 维护麻烦，修改一个图片可能需要从新布局整个图片，样式

### css 合并方法

避免使用 @import 引入多个 css 文件，可以使用 CSS 工具将 CSS 合并为一个 CSS 文件，例如使用 Sass\Compass 等

### base64 的原理及优缺点

优点可以加密，减少了 http 请求
缺点是需要消耗 CPU 进行编解码

- 写入 CSS， 减少 HTTP 请求
- 适用于小图片
- base64 的体积约为原图 4/3

### CSS 优化、提高性能的方法有哪些？

- 多个 css 合并，尽量减少 HTTP 请求
- 将 css 文件放在页面最上面
- 充分利用 css 继承属性，减少代码量
- 抽象提取公共样式，减少代码量
- css 雪碧图
- css 压缩与合并、Gzip 压缩
- css 文件放在 head 里、不要用@import

### 1000-div 问题

一次性插入 1000 个 div，如何优化插入的性能

- 使用 Fragment

```js
var fragment = document.createDocumentFragment();
fragment.appendChild(elem);
```

- 向 1000 个并排的 div 元素中，插入一个平级的 div 元素，如何优化插入的性能

  - 先 display:none 然后插入 再 display:block
  - 赋予 key，然后使用 virtual-dom，先 render，然后 diff，最后 patch
  - 脱离文档流，用 GPU 去渲染，开启硬件加速
