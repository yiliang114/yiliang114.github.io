---
layout: CustomPages
title: html
date: 2020-11-21
aside: false
draft: true
---

### web 语义化的好处

1. 去掉或者丢失样式的时候能够让页面呈现出清晰的结构
2. 有利于 SEO：和搜索引擎建立良好沟通，有助于爬虫抓取更多的有效信息：爬虫依赖于标签来确定上下文和各个关键字的权重；
3. 方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备）以意义的方式来渲染网页；
4. 便于团队开发和维护，语义化更具可读性，是下一步吧网页的重要动向，遵循 W3C 标准的团队都遵循这个标准，可以减少差异化。

### HTML 和 DOM 的关系

- HTML 只是一个字符串
- DOM 由 HTML 解析而来

### iframe 框架都有哪些优缺点？

优点：

- 重载页面时不需要重载整个页面，只需要重载页面中的一个框架页
- 技术易于掌握，使用方便，可主要应用于不需搜索引擎来搜索的页面
- 方便制作导航栏
- iframe 能够原封不动的把嵌入的网页展现出来。
- 如果有多个网页引用 iframe，那么你只需要修改 iframe 的内容，就可以实现调用的每一个页面内容的更改，方便快捷。
- 网页如果为了统一风格，头部和版本都是一样的，就可以写成一个页面，用 iframe 来嵌套，可以增加代码的可重用。
- 如果遇到加载缓慢的第三方内容如图标和广告，这些问题可以由 iframe 来解决。

缺点：

- 会产生很多页面，不容易管理，不容易打印
- 对浏览器搜索引擎不友好
- 多框架的页面会增加服务器的 http 请求
- 搜索引擎的爬虫程序无法解读这种页面
- 框架结构中出现各种滚动条
- 使用框架结构时，保证设置正确的导航链接。
- iframe 页面会增加服务器的 http 请求

### offsetWidth/offsetHeight,clientWidth/clientHeight 与 scrollWidth/scrollHeight 区别

offsetWidth/offsetHeight 返回值包含 content + padding + border，效果与 e.getBoundingClientRect()相同
clientWidth/clientHeight 返回值只包含 content + padding，如果有滚动条，也不包含滚动条
scrollWidth/scrollHeight 返回值包含 content + padding + 溢出内容的尺寸

### 为什么通常推荐将 CSS 放置在 之间，而将 JS <script> 放置在 之前？你知道有哪些例外吗？

浏览器在处理 HTML 页面渲染和 JavaScript 脚本执行的时候是单一进程的,所以在当浏览器在渲染 HTML 遇到了<script>标签会先去执行标签内的代码(如果是使用 src 属性加载的外链文件,则先下载再执行),在这个过程中,页面渲染和交互都会被阻塞。所以将<script>放在之前,当页面渲染完成再去执行<script>。

一般希望 DOM 还没加载必须需要先加载的 js 会放置在中,有些加了 defer、async 的<script>也会放在中。

### 请指出 document load 和 document DOMContentLoaded 两个事件的区别

他们的区别是，触发的时机不一样，先触发 DOMContentLoaded 事件（DOM 树构建完成），后触发 load 事件（页面加载完毕）

### 实现效果，点击容器内的图标，图标边框变成 border 1px solid red，点击空白处重置

```js
const box = document.getElementById('box');
function isIcon(target) {
  return target.className.includes('icon');
}

box.onclick = function(e) {
  e.stopPropagation();
  const target = e.target;
  if (isIcon(target)) {
    target.style.border = '1px solid red';
  }
};
const doc = document;
doc.onclick = function(e) {
  const children = box.children;
  for (let i = 0; i < children.length; i++) {
    if (isIcon(children[i])) {
      children[i].style.border = 'none';
    }
  }
};
```

### 现在要你完成一个 Dialog 组件，说说你设计的思路？它应该有什么功能？

该组件需要提供 hook 指定渲染位置，默认渲染在 body 下面。
然后改组件可以指定外层样式，如宽度等
组件外层还需要一层 mask 来遮住底层内容，点击 mask 可以执行传进来的 onCancel 函数关闭 Dialog。
另外组件是可控的，需要外层传入 visible 表示是否可见。
然后 Dialog 可能需要自定义头 head 和底部 footer，默认有头部和底部，底部有一个确认按钮和取消按钮，确认按钮会执行外部传进来的 onOk 事件，然后取消按钮会执行外部传进来的 onCancel 事件。
当组件的 visible 为 true 时候，设置 body 的 overflow 为 hidden，隐藏 body 的滚动条，反之显示滚动条。
组件高度可能大于页面高度，组件内部需要滚动条。
只有组件的 visible 有变化且为 true 时候，才重渲染组件内的所有内容

### 怎么从十万个节点中找到想要的节点，怎么快速在某个节点前插入一个节点

1.假设文档是一棵 Root 节点为 html 标签的一棵树，因为是只需要返回第一个找到的节点，所以通过队列实现广度优先遍历

```js
function isWanted(node) {
  //查找成立的条件
}

function findNode(isWanted) {
  const root = document.getElementByTagName('html');
  const queue = [root];
  while (!isWanted(queue[0])) {
    const current = queue[0];
    const children = queue[0].children || [];
    for (i = 0; i < children.length; i++) {
      // 这里在遍历的过程中新增指针把children指向parent, 可以帮助求解第二问。
      children[i].parent = current;
      queue.push(children[i]);
    }
    queue.unshift();
  }
  return queue[0];
}
```

2.根据第一题找到的 node，然后可以找到 parent 节点，再通过 parent 找到所有子节点，对应 index 位置插入节点就好

```js
function insertNode(newNode) {
  const newChildren = [];
  const existingNode = findNode(isWanted);
  const parent = existingNode.parent;
  const siblings = parent.children;
  //  如果用indexOf再加上splice的话，需要两次循环。时间复杂度为O(2n)？
  for (i = 0; i < siblings; i++) {
    if (siblings[i] === existingNode) {
      newChildren.push(newNode);
    }
    newChildren.push(siblings[i]);
  }
  parent.children = newChildren;
  return;
}
```

### 使用 link 和@import 有什么区别？

1. link 是 HTML 标签，@import 是 css 提供的。
2. link 引入的样式页面加载时同时加载，@import 引入的样式需等页面加载完成后再加载。
3. link 没有兼容性问题，@import 不兼容 ie5 以下。
4. link 可以通过 js 操作 DOM 动态引入样式表改变样式，而@import 不可以。

### 实现不使用 border 画出 1px 高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果。

```html
<div style="height:1px;overflow:hidden;background:red"></div>
```

### 下面代码中，在浏览器上显示为什么会有空格？

```html
<div>
  <span>1</span>
  <span>2</span>
  <span>3</span>
</div>
```

显示结果：`1 2 3`，为什么会有空格 ?

- 原因：

  > 行内元素之间产生的间距，是由于换行符、tab( 制表符 )、空格等字符引起，而字符的大小是定义字体大小来控制。（不论空格、换行符、tab 有几个，都显示一个空格）

  三个`span`标签之间都有换行符，而 “ 行内元素之间的空格相当于块级元素的回车换行
  ” 所以会在输出时，显示空格。

- 解决办法

  1.  可以使用浮动来去除空格。

  > 不可否认，使用浮动技术是比较好的办法，实际工作中我们使用浮动也是比较多，但是也并不是每处地方都要使用浮动，而且使用浮动后还需要清除浮动的操作。

  ```html
  <div>
    <span>1</span>
    <span>2</span>
    <span>3</span>
  </div>

  <style>
    span {
      float: left;
    }
  </style>
  ```

  2.  由于 “ 行内元素之间产生的间距，是由于换行符、tab( 制表符 )、空格等字符引起，而<u>字符的大小是定义字体大小来控制</u>。” 所以我们可以控制父级元素的字符大小来去除空格。

```html
<div>
  <span>1</span>
  <span>2</span>
  <span>3</span>
</div>

<style>
  div {
    font-size: 0; /* 所有浏览器 */
    *word-spacing: -1px; /* 使用word-spacing 修复 IE6、7 中始终存在的 1px 空隙，减少单词间的空白（即字间隔） */
  }
  span {
    font-size: 16;
    letter-spacing: normal; /* 设置字母、字间距为0 */
    word-spacing: normal; /* 设置单词、字段间距为0 */
  }
</style>
```

经过测试后，可发现设置 font-size:0 并不能使得换行符、tab( 制表符 )、空格等在所有浏览器中产生的额外间距消失：IE6 、 7 浏览器始终存在的 1px 空隙。

针对 IE6、7 浏览器，使用 word-spacing 修复 IE6、7 中始终存在的 1px 空隙，减少 单词间的空白（即字间隔 `*word-spacing:-1px;`

- 相关：

> 行内元素的高度由其内容撑开，**不可显示的设置其高度**，这就是为什么我们一次次的在 span 上设置 height 属性不好使的原因。

### 写 HTML 代码时应注意什么？

- 尽可能少的使用无语义的标签。例如`div`,`span`
- 在语义不明显时，既可以使用`div`又可以使用`P`的时候，尽量使用`P`，因为`P`在默认情况下有上下间距，对兼容特殊终端有利
- 不要使用纯样式标签，例如：`b,font,u`, 该用 CSS 设置
- 需要强调的文本，可以包含在 strong 或 em 标签中（浏览器预设样式，能用 CSS 指定就不用它们）， strong 默认样式是加粗（不要用 b）， em 是斜体（不用 i）
- 使用表格时，标题要用 caption，表头用 thead，主体部分用 tbody 包围，尾部用
  tfoot 包围。表头和一般单元格要区分开，表头用 th，单元格用 td
- 表单域要用 fieldset 标签包起来，并用 legend 标签说明表单的用途
- 每个 input 标签对应的说明文本都需要使用 label 标签，并且通过为 input 设置 id
  属性，在 lable 标签中设置 for=someld 来让说明文本和相对应的 input 关联起来

### 什么是渐进式渲染（progressive rendering）？

渐进式渲染是用于提高网页性能（尤其是提高用户感知的加载速度），以尽快呈现页面的技术。

在以前互联网带宽较小的时期，这种技术更为普遍。如今，移动终端的盛行，而移动网络往往不稳定，渐进式渲染在现代前端开发中仍然有用武之地。

一些举例：

- 图片懒加载——页面上的图片不会一次性全部加载。当用户滚动页面到图片部分时，JavaScript 将加载并显示图像。
- 确定显示内容的优先级（分层次渲染）——为了尽快将页面呈现给用户，页面只包含基本的最少量的 CSS、脚本和内容，然后可以使用延迟加载脚本或监听`DOMContentLoaded`/`load`事件加载其他资源和内容。
- 异步加载 HTML 片段——当页面通过后台渲染时，把 HTML 拆分，通过异步请求，分块发送给浏览器。更多相关细节可以在[这里](http://www.ebaytechblog.com/2014/12/08/async-fragments-rediscovering-progressive-html-rendering-with-marko/)找到。

### Reflow 和 Repaint

Reflow：当涉及到 DOM 节点的布局属性发生变化时，就会重新计算该属性，浏览器会重新描绘相应的元素，此过程叫 Reflow（回流或重排）。
Repaint：
当影响 DOM 元素可见性的属性发生变化 (如 color) 时, 浏览器会重新描绘相应的元素, 此过程称为 Repaint（重绘）。因此重排必然会引起重绘。

引起 Repaint 和 Reflow 的一些操作

- 调整窗口大小
- 字体大小
- 样式表变动
- 元素内容变化，尤其是输入控件
- CSS 伪类激活，在用户交互过程中发生
- DOM 操作，DOM 元素增删、修改
- width, clientWidth, scrollTop 等布局宽高的计算

Repaint 和 Reflow 是不可避免的，只能说对性能的影响减到最小，给出下面几条建议：

1. 避免逐条更改样式。建议集中修改样式，例如操作 className。
2. 避免频繁操作 DOM。创建一个 documentFragment 或 div，在它上面应用所有 DOM 操作，最后添加到文档里。设置 display:none 的元素上操作，最后显示出来。
3. 避免频繁读取元素几何属性（例如 scrollTop）。绝对定位具有复杂动画的元素。
4. 绝对定位使它脱离文档流，避免引起父元素及后续元素大量的回流

### 页面编码和被请求的资源编码如果不一致如何处理？

- 后端响应头设置 charset
- 前端页面`<meta>`设置 charset

  2.每个 HTML 文件里开头都有个很重要的东西，Doctype，知道这是干什么的吗？

答案：<!DOCTYPE> 声明位于文档中的最前面的位置，处于 <html> 标签之前。此标签可告知浏览器文档使用哪种 HTML 或 XHTML 规范。（重点：告诉浏览器按照何种规范解析页面）

4.div+css 的布局较 table 布局有什么优点？

改版的时候更方便 只要改 css 文件。
页面加载速度更快、结构化清晰、页面显示简洁。
表现与结构相分离。
易于优化（seo）搜索引擎更友好，排名更容易靠前。

### 为什么利用多个域名来存储网站资源会更有效？

CDN 缓存更方便
突破浏览器并发限制
节约 cookie 带宽
节约主域名的连接数，优化页面响应速度
防止不必要的安全问题

### 请谈一下你对网页标准和标准制定机构重要性的理解。

（无标准答案）网页标准和标准制定机构都是为了能让 web 发展的更‘健康’，开发者遵循统一的标准，降低开发难度，开发成本，SEO 也会更好做，也不会因为滥用代码导致各种 BUG、安全问题，最终提高网站易用性。

### 简述一下 src 与 href 的区别。

答案：

src 用于替换当前元素，href 用于在当前文档和引用资源之间确立联系。

src 是 source 的缩写，指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求 src 资源时会将其指向的资源下载并应用到文档内，例如 js 脚本，img 图片和 frame 等元素。

<script src ="js.js"></script>

当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将 js 脚本放在底部而不是头部。

href 是 Hypertext Reference 的缩写，指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，如果我们在文档中添加

<link href="common.css" rel="stylesheet"/>

那么浏览器会识别该文档为 css 文件，就会并行下载资源并且不会停止对当前文档的处理。这也是为什么建议使用 link 方式来加载 css，而不是使用@import 方式。

### 知道什么是微格式吗？谈谈理解。在前端构建中应该考虑微格式吗？

答案：

微格式（Microformats）是一种让机器可读的语义化 XHTML 词汇的集合，是结构化数据的开放标准。是为特殊应用而制定的特殊格式。

优点：将智能数据添加到网页上，让网站内容在搜索引擎结果界面可以显示额外的提示。（应用范例：豆瓣，有兴趣自行 google）

### 在 css/js 代码上线之后开发人员经常会优化性能，从用户刷新网页开始，一次 js 请求一般情况下有哪些地方会有缓存处理？

答案：dns 缓存，cdn 缓存，浏览器缓存，服务器缓存。

### 为什么在 li 标签里面设置 高度 height 的时候 不管设置多少都一样？没有任何变化。而改变宽度 width 却有变化？

a、如果同时设置了 height 和 line-height，那么元素的实际高度即为 height；

b、如果只设置了 line-height，那么元素的实际高度等于 line-height；

如果你把 height 设置为 0，说明元素没有高度，虽然你也设置了 line-height:30px，由 a 可知，同时设置了 height 和 line-height，高度就是 height，所以此时元素的实际高度就是 0，如果没有高度的话，浏览器特别懒，虽然你有宽度，但是我也不会把你渲染成一个块的。所以你会看到所有的字体叠在了一起。

那为什么 height 设置成 1px 就可以了呢？蚊子腿也是肉，不是么？虽然 height 只有区区 1px，但至少也是有高度的啊。所以此时浏览器会把每个 li 渲染成块，所以你并没有看到字体叠在一起。

你可能会问为什么高度为 0 或 1 时，高度这么小应该容纳不下字体才对啊？为什么还能显示呢？

那是因为浏览器的 overflow 默认值为 visible

你可以设置成 overflow:hidden。。然后你就看不到了。。

### HTML 全局属性(global attribute)有哪些

- `accesskey`:设置快捷键，提供快速访问元素如<a href="#" accesskey="a">aaa</a>在 windows 下的 firefox 中按`alt + shift + a`可激活元素
- `class`:为元素设置类标识，多个类名用空格分开，CSS 和 javascript 可通过 class 属性获取元素
- `contenteditable`: 指定元素内容是否可编辑
- `contextmenu`: 自定义鼠标右键弹出菜单内容
- `data-*`: 为元素增加自定义属性
- `dir`: 设置元素文本方向
- `draggable`: 设置元素是否可拖拽
- `dropzone`: 设置元素拖放类型： copy, move, link
- `hidden`: 表示一个元素是否与文档。样式上会导致元素不显示，但是不能用这个属性实现样式效果
- `id`: 元素 id，文档内唯一
- `lang`: 元素内容的的语言
- `spellcheck`: 是否启动拼写和语法检查
- `style`: 行内 css 样式
- `tabindex`: 设置元素可以获得焦点，通过 tab 可以导航
- `title`: 元素相关的建议信息
- `translate`: 元素和子孙节点内容是否需要本地化

### 禁用 a 标签的点击事件

```js
// js的方法
$('ul li a').click(function(e) {
  var e = e || window.event;
  e.preventDefault();
  alert($(this).index());
});
```

```css
// css 的方法
li > a {
  pointer-events: none;
}
```

### HTML 与 XHTML 二者有什么区别

区别：

1. 所有的标记都必须要有一个相应的结束标记
2. 所有标签的元素和属性的名字都必须使用小写
3. 所有的 XML 标记都必须合理嵌套
4. 所有的属性必须用引号""括起来
5. 把所有<和&特殊符号用编码表示
6. 给所有属性赋一个值
7. 不要在注释内容中使“--”
8. 图片必须有说明文字

最主要的不同：
XHTML 元素必须被正确地嵌套。
XHTML 元素必须被关闭。
标签名必须用小写字母。
XHTML 文档必须拥有根元素。

### head 元素

head 子元素大概分为三类，分别是：

- 描述网页基本信息的
- 指向渲染网页需要其他文件链接的
- 各大厂商根据自己需要定制的

#### 网页基本信息

一个网页，首先得有个标题，就跟人有名字一样。除此之外，还可以根据实际需要补充一些基本信息。

- 文档标题（浏览器标签中显示的文本）：<title>深入了解 head 元素</title>
- 编码格式：<meta charset="utf-8"> 如果你的页面出现乱码，那一般就是编码格式不对
- 视窗设置：<meta name="viewport" content="width=device-width, initial-scale=1.0">
- 搜索引擎优化相关内容： <meta name="description" content=“帮助你深层次了解HTML文档结构”>
- IE 浏览器版本渲染设置：<meta http-equiv="X-UA-Compatible" content="ie=edge">

#### 其他文件链接

- CSS 文件：<link rel="stylesheet" type="text/css" href="style.css">
- JavaScript 文件：<script src=“script.js"></script>

但是为了让页面的样子更早的让用户看到，一般把 JS 文件放到 body 的底部

#### 厂商定制

同样分享页面到 QQ 的聊天窗口，有些页面直接就是一个链接，但是有些页面有标题，图片，还有文字介绍。为什么区别这么明显呢？其实就是看有没有设置下面这三个内容

```html
<meta itemprop="name" content="这是分享的标题" />
<meta itemprop="image" content="http://imgcache.qq.com/qqshow/ac/v4/global/logo.png" />
<meta name="description" itemprop="description" content="这是要分享的内容" />
```

### 哪种情况下应该使用`small`标签？当你想在`h1` 标题后创建副标题？还是当在`footer`里面增加版权信息？

    `small`标签一般使用场景是在版权信息和法律文本里使用，也可以在标题里使用标注附加信息（bootstrap 中可见），但不可以用来创建副标题。

### 如果你有一个搜索结果页面，你想高亮搜索的关键词。什么 HTML 标签可以使用?

`<mark>` 标签表现高亮文本。

### 下列代码中`scope` 属性是做什么的？

```html
<article>
  <h1>Hello World</h1>
  <style scoped>
    p {
      color: #ff0;
    }
  </style>
  <p>This is my text</p>
</article>

<article>
  <h1>This is awesome</h1>
  <p>I am some other text</p>
</article>
```

`scoped` 属性是一个布尔属性。如果使用该属性，则样式仅仅应用到 style 元素的父元素及其子元素。

### 当下列的 HTML 代码加载时会触发新的 HTTP 请求吗？

```html
<img src="mypic.jpg" style="visibility: hidden" alt="My picture" />
```

会

```html
<div style="display: none;">
  <img src="mypic.jpg" alt="My photo" />
</div>
```

会

### `main1.css`一定会在`alert('Hello world')`被加载和编译吗?

```html
<head>
  <link href="main1.css" rel="stylesheet" />
  <script>
    alert('Hello World');
  </script>
</head>
```

是

### 在`main2.css`获取前`main1`一定必须被下载解析吗？

```html
<head>
  <link href="main1.css" rel="stylesheet" />
  <link href="main2.css" rel="stylesheet" />
</head>
```

no!

### 在`Paragraph 1`加载后`main2.css`才会被加载编译吗？

```html
<head>
  <link href="main1.css" rel="stylesheet" />
</head>
<body>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
  <link href="main2.css" rel="stylesheet" />
</body>
```

yes!

### `<bdo>` 标签是否可以改变文本方向？

可以。

`<bdo>`标签覆盖默认的文本方向。

```html
<bdo dir="rtl">Here is some text</bdo>
```

### 下列 HTML 代码是否正确？

```html
<figure>
  <img src="myimage.jpg" alt="My image" />
  <figcaption>
    <p>This is my self portrait.</p>
  </figcaption>
</figure>
```

正确

`<figure>` 标签规定独立的流内容（图像、图表、照片、代码等等）。`figure` 元素的内容应该与主内容相关，但如果被删除，则不应对文档流产生影响。使用`<figcaption>`元素为`figure`添加标题（caption）。

### 对 WEB 标准以及 W3C 的理解与认识?

标签闭合、标签小写、不乱嵌套、提高搜索机器人搜索几率、使用外 链 css 和 js 脚本、结构行为表现的分离、
文件下载与页面速度更快、内容能被更多的用户所访问、内容能被更广泛的设备所访问、更少的代码和组件，
容易维 护、改版方便，不需要变动页面内容、提供打印版本而不需要复制内容、提高网站易用性。

### 列表

#### 1. 无序列表

unordered List: ul
List Item: li

**ul 标签里面只能包裹 li 标签，不能有别的；li 标签也只能由 ul 或者 ul 包裹。**

浏览器默认给无序列表小圆点的“先导符号”。去掉小圆点：`list-style:none;`

li 是一个容器级标签，li 标签里面放置的东西可能很多。导航条，新闻列表。

#### 2. 有序列表

ordered List： ol

有序列表用的不多，一般手写序号

#### 3. 定义列表

dl 定义列表；dt 定义标题；dd 定义描述
`<dl><dt><dd></dd></dt></dl>`

定义列表语法灵活： 可以一个 dt 配多个 dd；还可以拆开，让每一个 dl 里面只有一个 dt 和 dd。

一般用在 footer 中描述各项。（京东 footer，垂直菜单）

dt、dd 都是容器级标签。

**用什么标签，不是根据样子来决定，而是语义，语义决定网页的骨架。**

### div 和 span

css 中，这两个是最重要的盒子。

div 是容器级标签；span 是文本级标签，里面只能放文字、图片、表单元素等。
**span 里面不能放 p h ul dl ol div 等**

div+css ： div 标签负责布局，负责结构，负责分块。css 负责样式。

### 表单

自封闭标签：

```
<meta name=“keywords” content=”” />
<img src=”” alt=”” />
<input type=”text” />

```

#### 输入框：

value 表示“值”，value 属性就是默认有的值。
`<input type="text" value="默认有的值" />`

#### 密码框：

`<input type="password" />`

#### 单选框：

```
<input type="radio" name="xingbie" /> 男
<input type="radio" name="xingbie" /> 女
```

#### 多选框：

```
<input type="checkbox" name="aihao"/> 睡觉
<input type="checkbox" name="aihao"/> 吃饭
<input type="checkbox" name="aihao"/> 足球
```

#### 下拉列表

```
<select>
	<option>北京</option>
	<option>河北</option>
	<option>河南</option>
</select>
```

#### 多行文本框（文本域）

`<textarea cols="30" rows="10"></textarea>`

cols 属性表示 columns“列”，rows 属性表示 rows“行”。

#### HTML5 新增

date、color 选择颜色和日期 等。

#### label 标签

本质上讲，“男”、“女”这两个汉字，和 input 元素没有关系。

`<input type="radio" name="sex" /> 男`
`<input type="radio" name="sex" check="checked"/> 女`

label 就是解决这个问题的。

`<input type="radio" name="sex" id="nan" /><label for="nan">男</label>`
`<input type="radio" name="sex" id="nv" /><label for="nv">女</label>`

input 元素要有一个 id，然后 label 标签就有一个 for 属性，和 id 相同，就表示绑定了，这个 label 和 input 就有绑定关系了。

复选框也有 label：

`<input type="checkbox" id="kk" />`
`<label for="kk">10天内免登录</label>`

什么表单元素都有 label。

### 字符实体

`&lt;` less than 小于
`&gt;` greater than 大于
`&copy;` 版权符号

`&nbsp;` non-breaking spacing 空格
`哈&nbsp;&nbsp;&nbsp;&nbsp;哈` 空出了 4 个字的格，可以防止空白折叠现象。

### 其他

input 和 textarea 的区别
