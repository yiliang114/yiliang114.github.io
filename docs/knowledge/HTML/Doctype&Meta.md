---
title: Doctype&Meta
date: 2020-11-21
draft: true
---

## Doctype

### Doctype (文档类型) 的作用是什么

Doctype 在文档最开头。声明位于文档中的最前面的位置，处于标签之前。此标签可告知浏览器文档使用哪种 HTML 或 XHTML 规范。（重点：告诉浏览器按照何种规范解析页面）

1. <!DOCTYPE> 声明位于文档中的最前面，处于 <html> 标签之前。告知浏览器以何种模式来渲染文档。
2. 严格模式的排版和 JS 运作模式是 以该浏览器支持的最高标准运行。
3. 在混杂模式中，页面以宽松的向后兼容的方式显示。模拟老式浏览器的行为以防止站点无法工作。
4. DOCTYPE 不存在或格式不正确会导致文档以混杂模式呈现。

- 对文档进行有效性验证:
  它告诉用户代理和校验器这个文档是按照什么 DTD 写的。这个动作是被动的，
  每次页面加载时，浏览器并不会下载 DTD 并检查合法性，只有当手动校验页面时才启用。
- 决定浏览器的呈现模式: 对于实际操作，通知浏览器读取文档时用哪种解析算法。
  如果没有写，则浏览器则根据自身的规则对代码进行解析，可能会严重影响 HTML 排版布局。
- 浏览器有三种方式解析 HTML 文档。

  - 非怪异（标准）模式
  - 怪异模式
  - 部分怪异（近乎标准）模式

严格模式和混杂模式。
严格模式的排版和 JS 运作模式是 以该浏览器支持的最高标准运行。
混杂模式，向后兼容，页面以宽松的向后兼容的方式显示， 模拟老式浏览器，防止浏览器无法兼容页面。

### 有多少种 Doctype 文档类型？

1. 该标签可声明三种 DTD 类型，分别表示严格版本、过渡版本以及基于框架的 HTML 文档。
2. HTML 4.01 规定了三种文档类型：Strict、Transitional 以及 Frameset。
3. XHTML 1.0 规定了三种 XML 文档类型：Strict、Transitional 以及 Frameset。
4. Standards （标准）模式（也就是严格呈现模式）用于呈现遵循最新标准的网页，而 Quirks（包容）模式（也就是松散呈现模式或者兼容模式）用于呈现为传统浏览器而设计的网页。

<!doctype html> 表示 html5 的写法，html 是 html4 的写法。

## Meta

### meta 标签

meta 标签：提供给页面的一些元信息（名称/值对）， 比如针对搜索引擎和更新频度的描述和关键词。

- name： 告诉搜索引擎你的站点的信息，包括作者 内容 关键字等。名称/值对中的名称。常用的有 author、description、keywords、generator、revised、others。 把 content 属性关联到一个名称。
- http-equiv：用以说明主页制作所使用的文字及语言， 没有 name 时，会采用这个属性的值。常用的有 content-type、expires、refresh、set-cookie。把 content 属性关联到 http 头部。
- content： 名称/值对中的值， 可以是任何有效的字符串。 始终要和 name 属性或 http-equiv 属性一起使用。
- scheme： 用于指定要用来翻译属性值的方案
- viewport 原理， 标签缩放页面比例

### viewport

Viewport ：字面意思为视图窗口，在移动 web 开发中使用。表示将设备浏览器宽度虚拟成一个特定的值（或计算得出），这样利于移动 web 站点跨设备显示效果基本一致。移动版的 Safari 浏览器最新引进了 viewport 这个 meta tag，让网页开发者来控制 viewport 的大小和缩放，其他手机浏览器也基本支持。

在移动端浏览器当中，存在着两种视口，一种是可见视口（也就是我们说的设备大小），另一种是视窗视口（网页的宽度是多少）。 举个例子：如果我们的屏幕是 320 像素 \* 480 像素的大小（iPhone4），假设在浏览器中，320 像素的屏幕宽度能够展示 980 像素宽度的内容。那么 320 像素的宽度就是可见视口的宽度，而能够显示的 980 像素的宽度就是视窗视口的宽度。

为了显示更多的内容，大多数的浏览器会把自己的视窗视口扩大，简易的理解，就是让原本 320 像素的屏幕宽度能够容下 980 像素甚至更宽的内容（将网页等比例缩小）

Viewport 属性值

- width 设置 layout viewport 的宽度，为一个正整数，或字符串"width-device"
- initial-scale 设置页面的初始缩放值，为一个数字，可以带小数
- minimum-scale 允许用户的最小缩放值，为一个数字，可以带小数
- maximum-scale 允许用户的最大缩放值，为一个数字，可以带小数
- height 设置 layout viewport 的高度，这个属性对我们并不重要，很少使用
- user-scalable 是否允许用户进行缩放，值为"no"或"yes", no 代表不允许，yes 代表允许这些属性可以同时使用，也可以单独使用或混合使用，多个属性同时使用时用逗号隔开就行了

### viewport 的常见设置有哪些

viewport 常常使用在响应式开发以及移动 web 开发中，viewport 顾名思义就是用来设置视口，主要是规定视口的宽度、视口的初始缩放值、
视口的最小缩放值、视口的最大缩放值、是否允许用户缩放等。一个常见的 viewport 设置如下：

```html
<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no,width=device-width" />
```

其中同时设置 width 和 initial-scale 的目的是为了解决 iphone、ipad、ie 横竖屏不分的情况，因为这两个值同时存在时会取较大值。

### header 中 meta

兼容性配置，让 IE 使用最高级的 Edge 渲染，如果有 chrome 就使用 chrome 渲染。

```html
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
```

如果是双核浏览器，优先使用 webkit 引擎

```html
<meta name="render" content="webkit" />
```

### meta 标签禁止缓存

### meta 标签：自动刷新/跳转

假设要实现一个类似 PPT 自动播放的效果，你很可能会想到使用 JavaScript 定时器控制页面跳转来实现。但其实有更加简洁的实现方法，比如通过 meta 标签来实现：

```html
<meta http-equiv="Refresh" content="5; URL=page2.html" />
```

上面的代码会在 5s 之后自动跳转到同域下的 page2.html 页面。我们要实现 PPT 自动播放的功能，只需要在每个页面的 meta 标签内设置好下一个页面的地址即可。

另一种场景，比如每隔一分钟就需要刷新页面的大屏幕监控，也可以通过 meta 标签来实现，只需去掉后面的 URL 即可：

```html
<meta http-equiv="Refresh" content="60" />
```

既然这样做又方便又快捷，为什么这种用法比较少见呢？

一方面是因为不少前端工程师对 meta 标签用法缺乏深入了解，另一方面也是因为在使用它的时候，刷新和跳转操作是不可取消的，所以对刷新时间间隔或者需要手动取消的，还是推荐使用 JavaScript 定时器来实现。但是，如果你只是想实现页面的定时刷新或跳转（比如某些页面缺乏访问权限，在 x 秒后跳回首页这样的场景）建议你可以实践下 meta 标签的用法。
