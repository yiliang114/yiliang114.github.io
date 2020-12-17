---
layout: CustomPages
title: html
date: 2020-11-21
aside: false
draft: true
---

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

### HTML 和 DOM 的关系

- HTML 只是一个字符串
- DOM 由 HTML 解析而来
- JS 可以维护 DOM

### offsetWidth/offsetHeight,clientWidth/clientHeight 与 scrollWidth/scrollHeight 区别

offsetWidth/offsetHeight 返回值包含 content + padding + border，效果与 e.getBoundingClientRect()相同
clientWidth/clientHeight 返回值只包含 content + padding，如果有滚动条，也不包含滚动条
scrollWidth/scrollHeight 返回值包含 content + padding + 溢出内容的尺寸

### 如果页面使用 ‘application/xhtml+xml’ 会有什么问题吗？

要求比较严格，必须有 head、body 标签且每个元素必须是关闭的。
一些老的浏览器不支持，实际上，任何最新的浏览器都将支持 application/xhtml+xml 媒体类型。大多数浏览器也接受以 application/xml 发送的 XHTML 文档。

### 如果网页内容需要支持多语言，你会怎么做？

采用统一编码 UTF-8 方式编码
应用字符集的选择；所以对提供了多语言版本的网站来说，Unicode 字符集应该是最理想的选择。它是一种双字节编码机制的字符集，不管是东方文字还是西方文字，在 Unicode 中一律用两个字节来表示，因而至少可以定义 65536 个不同的字符，几乎可以涵盖世界上目前所有通用的语言的每一种字符。 所以在设计和开发多语言网站时，一定要注意先把非中文页面的字符集定义为“utf-8”格式，即：这一步非常重要，原因在于若等页面做好之后再更改字符集设置，可说是一件非常非常吃力不讨好的工作，有时候甚至可能需要从头再来，重新输入网站的文字内容。

### 为什么通常推荐将 CSS 放置在 之间，而将 JS <script> 放置在 之前？你知道有哪些例外吗？

浏览器在处理 HTML 页面渲染和 JavaScript 脚本执行的时候是单一进程的,所以在当浏览器在渲染 HTML 遇到了<script>标签会先去执行标签内的代码(如果是使用 src 属性加载的外链文件,则先下载再执行),在这个过程中,页面渲染和交互都会被阻塞。所以将<script>放在之前,当页面渲染完成再去执行<script>。

一般希望 DOM 还没加载必须需要先加载的 js 会放置在中,有些加了 defer、async 的<script>也会放在中。

### 你用过哪些不同的 HTML 模板语言？

有过，比如 Pug （以前叫 Jade）、 ERB、 Slim、 Handlebars、 Jinja、 Liquid 等等。在我看来，这些模版语言大多是相似的，都提供了用于展示数据的内容替换和过滤器的功能。大部分模版引擎都支持自定义过滤器，以展示自定义格式的内容

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
只有组件的 visible 有变化且为 ture 时候，才重渲染组件内的所有内容

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

## 写一个选择器，完成从 DOM 中获取所有`<a>`中包含`163.com`的链接筛选出来。

> 其实考察的是如何自己实现`$`符号，使用的是`document.queryElementAll(a[href*=163.com])`。这个很可能是不对的。

### 如何提供包含多种语言内容的页面？

这个问题有点问得含糊其辞，我认为这是在询问最常见的情况：如何提供包含多种语言内容的页面，并保证页面内容语言的一致性。

当客户端向服务器发送 HTTP 请求时，通常会发送有关语言首选项的信息，比如使用`Accept-Language`请求头。如果替换语言存在，服务器可以利用该信息返回与之相匹配的 HTML 文档。返回的 HTML 文档还应在`<html>`标签中声明`lang`属性，比如`<html lang="en">...</html>`

在后台中，HTML 将包含`i18n`占位符和待以替换的内容，这些按照不同语言，以 YML 或 JSON 格式存储。然后，服务器将动态生成指定语言内容的 HTML 页面。整个过程通常需要借助后台框架实现。

### 在设计开发多语言网站时，需要留心哪些事情？

- 在 HTML 中使用`lang`属性。
- 引导用户切换到自己的母语——让用户能够轻松地切换到自己的国家或语言，而不用麻烦。
- 在图片中展示文本会阻碍网站规模增长——把文本放在图片中展示，仍然是一种非常流行的方式。这样做可以在所有终端上，都能显示出美观的非系统字体。然而，为了翻译图片中的文本，需要为每种语言单独创建对应的图片，这种做法很容易在图片数量不断增长的过程中失控。
- 限制词语或句子的长度——网页内容在使用其他语言表述时，文字长度会发生变化。设计时，需要警惕文字长度溢出布局的问题，最好不要使用受文字长度影响较大的设计。比如标题、标签、按钮的设计，往往很受文字长度影响，这些设计中的文字与正文或评论部分不同，一般不可以自由换行。
- 注意颜色的使用——颜色在不同的语言和文化中，意义和感受是不同的。设计时应该使用恰当的颜色。
- 日期和货币的格式化——日期在不同的国家和地区，会以不同的方式显示。比如美国的日期格式是“May 31, 2012”，而在欧洲部分地区，日期格式是“31 May 2012”。
- 不要使用连接的翻译字符串——不要做类似这样的事情，比如`“今天的日期是”+具体日期`。这样做可能会打乱其他语言的语序。替代方案是，为每种语言编写带变量替换的模版字符串。请看下面两个分别用英语和中文表示的句子：`I will travel on {% date %}`和`{% date %} 我会出发`。可以看到，语言的语法规则不同，变量的位置是不同的。
- 注意语言阅读的方向——在英语中，文字是从左向右阅读的；而在传统日语中，文字是从右向左阅读的。

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

### favicon.ico 有什么作用？怎么在页面中引用？常用尺寸有哪些？可以修改后缀名吗？

https://github.com/haizlin/fe-interview/issues/513

### 怎样禁止表单记住密码自动填充？

https://github.com/haizlin/fe-interview/issues/494

### 请写出唤醒拔打电话、发送邮件、发送短信的例子](https://github.com/haizlin/fe-interview/issues/407)

### html 直接输入多个空格为什么只能显示一个空格？](https://github.com/haizlin/fe-interview/issues/299)

### 写出 html 提供的几种空格实体（5 种以上）](https://github.com/haizlin/fe-interview/issues/293)

### 什么是 html 的字符实体？版权符号代码怎么写？](https://github.com/haizlin/fe-interview/issues/279)

### web workers 有用过吗？能帮我们解决哪些问题？](https://github.com/haizlin/fe-interview/issues/207)

### From 表单提交时为什么会刷新页面？怎么预防刷新？](https://github.com/haizlin/fe-interview/issues/202)

### Form 表单是怎么上传文件的？你了解它的原理吗？](https://github.com/haizlin/fe-interview/issues/198)

### Ajax 与 Flash 的优缺点分别是什么？](https://github.com/haizlin/fe-interview/issues/189)

### 说说你对 target="\_blank"的理解？有啥安全性问题？如何防范？](https://github.com/haizlin/fe-interview/issues/185)

### 说说你对 WEB 标准和 W3C 的理解与认识？](https://github.com/haizlin/fe-interview/issues/181)

### 说说 video 标签中预加载视频用到的属性是什么？](https://github.com/haizlin/fe-interview/issues/165)

### 如何让元素固定在页面底部？有哪些比较好的实践？](https://github.com/haizlin/fe-interview/issues/161)

### 解释下什么是 ISISO8859-2 字符集？](https://github.com/haizlin/fe-interview/issues/156)

### 说说你对 HTML 元素的显示优先级的理解](https://github.com/haizlin/fe-interview/issues/114)

### DOM 和 BOM 有什么区别？](https://github.com/haizlin/fe-interview/issues/110)

### 你了解什么是无障碍 web（WAI）吗？在开发过程中要怎么做呢？](https://github.com/haizlin/fe-interview/issues/102)

### 说说你对影子(Shadow)DOM 的了解](https://github.com/haizlin/fe-interview/issues/94)

### 解释下你对 GBK 和 UTF-8 的理解？并说说页面上产生乱码的可能原因](https://github.com/haizlin/fe-interview/issues/90)

### 关于`<form>`标签的 enctype 属性你有哪些了解？

https://github.com/haizlin/fe-interview/issues/78

### js 放在 html 的`<body>`和`<head>`有什么区别？

https://github.com/haizlin/fe-interview/issues/74

### 谈谈你对 input 元素中 readonly 和 disabled 属性的理解

https://github.com/haizlin/fe-interview/issues/70

### 请描述 HTML 元素的显示优先级

https://github.com/haizlin/fe-interview/issues/66

### 说说你对 html 中的置换元素和非置换元素的理解

https://github.com/haizlin/fe-interview/issues/62

### 怎样在页面上实现一个圆形的可点击区域？

https://github.com/haizlin/fe-interview/issues/58

### 你认为 table 的作用和优缺点是什么呢？

https://github.com/haizlin/fe-interview/issues/54

### 浏览器内多个标签页之间的通信方式有哪些？

https://github.com/haizhilin2013/interview/issues/25

### 其他

input 和 textarea 的区别

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

参考资料：[MDN: html global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes)或者[W3C HTML global-attributes](http://www.w3.org/TR/html-markup/global-attributes.html#common.attrs.core)

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
