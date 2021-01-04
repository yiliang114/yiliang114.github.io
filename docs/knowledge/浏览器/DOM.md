---
title: DOM & BOM
date: '2020-10-26'
draft: true
---

## DOM

主要部分: DOM 事件的级别,DOM 事件模型,DOM 事件流,DOM 事件捕获的具体流程,Event 对象的常见应用,自定义事件 这几个部分的内容。

### DOM 事件级别

- DOM0
  - onXXX 类型的定义事件
  - element.onclick = function(e) { ... }
- DOM2
  - addEventListener 方式
  - element.addEventListener('click', function (e) { ... })
  - btn.removeEventListener('click', func, false)
  - btn.attachEvent("onclick", func);
  - btn.detachEvent("onclick", func);
- DOM3
  - 增加了很多事件类型
  - element.addEventListener('keyup', function (e) { ... })
  - eventUtil 是自定义对象，textInput 是 DOM3 级事件

### DOM 事件模型

捕获从上到下， 冒泡从下到上。
先捕获，再到目标，再冒泡
![事件模型](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/==dom事件模型.jpg)

### DOM 事件的绑定的几种方式?

TODO:

### DOM 事件流

DOM 标准采用捕获+冒泡。两种事件流都会触发 DOM 的所有对象，从 window 对象开始，也在 window 对象结束。

DOM 标准规定事件流包括三个阶段：

- 事件捕获阶段
- 处于目标阶段
- 事件冒泡阶段

### 描述 DOM 事件捕获的具体流程

从 window -> document -> html -> body -> ... -> 目标元素

### Event 对象常见应用

- event.target 触发事件的元素
- event.currentTarget 绑定事件的元素
- event.preventDefault() 阻止默认行为
- event.stopPropagation() 阻止在捕获阶段或冒泡阶段继续传播，而不是阻止冒泡
- event.stopImmediatePropagation() 阻止事件冒泡并且阻止相同事件的其他侦听器被调用。

### 自定义事件

- Event
- CustomEvent

CustomEvent 不仅可以用来做自定义事件，还可以在后面跟一个 object 做参数

```js
var evt = new Event('myEvent');

someDom.addEventListener('myEvent', function() {
  //处理这个自定义事件
});

someDom.dispatchEvent(evt);
```

### 什么是 window 对象? 什么是 document 对象

- Window 对象表示当前浏览器的窗口，是 JavaScript 的顶级对象。
- 我们创建的所有对象、函数、变量都是 Window 对象的成员。
- Window 对象的方法和属性是在全局范围内有效的。
- Document 对象是 HTML 文档的根节点与所有其他节点（元素节点，文本节点，属性节点, 注释节点）
- Document 对象使我们可以通过脚本对 HTML 页面中的所有元素进行访问
- Document 对象是 Window 对象的一部分，可通过 window.document 属性对其进行访问

window

- Window 对象表示当前浏览器的窗口，是 JavaScript 的顶级对象。
- 我们创建的所有对象、函数、变量都是 Window 对象的成员。
- Window 对象的方法和属性是在全局范围内有效的。

document

- Document 对象是 HTML 文档的根节点与所有其他节点（元素节点，文本节点，属性节点, 注释节点）
- Document 对象使我们可以通过脚本对 HTML 页面中的所有元素进行访问
- Document 对象是 Window 对象的一部分，即 window.document

### DOM 操作——怎样添加、移除、移动、复制、创建和查找节点。

```js
// 创建新节点
createDocumentFragment(); // 创建一个DOM片段
createElement(); // 创建一个具体的元素
createTextNode(); // 创建一个文本节点

// 添加、移除、替换、插入
appendChild();
removeChild();
replaceChild();
insertBefore(); // 在已有的子节点前插入一个新的子节点

// 查找
getElementsByTagName(); // 通过标签名称
getElementsByName(); // 通过元素的 Name 属性的值(IE 容错能力较强，会得到一个数组，其中包括 id 等于 name 值的)
getElementById(); // 通过元素 Id，唯一性
querySelector();
querySelectorAll();

// 对属性进行操作
getAttribute();
setAttribute();
removeAttribute();
```

### 浏览器原生的方法

1. getElementById
2. getElementByTagName
3. querySelectorAll
4. p.style.width
5. p.getAttribute
6. p.setAttribute
7. hasOwnProperty

### 获得一个 DOM 元素的绝对位置

- offsetTop：返回当前元素相对于其 offsetParent 元素的顶部的距离
- offsetLeft：返回当前元素相对于其 offsetParent 元素的左边的距离
- getBoundingClientRect()：返回值是一个 DOMRect 对象，它包含了一组用于描述边框的只读属性——left、top、right 和 bottom，属性单位为像素

### DOM 元素的 dom.getAttribute(propName)和 dom.propName 有什么区别和联系

- dom.getAttribute()，是标准 DOM 操作文档元素属性的方法，具有通用性可在任意文档上使用，返回元素在源文件中设置的属性
- dom.propName 通常是在 HTML 文档中访问特定元素的特性，浏览器解析元素后生成对应对象（如 a 标签生成 HTMLAnchorElement），这些对象的特性会根据特定规则结合属性设置得到，对于没有对应特性的属性，只能使用 getAttribute 进行访问
- dom.getAttribute()返回值是源文件中设置的值，类型是字符串或者 null（有的实现返回""）
- dom.propName 返回值可能是字符串、布尔值、对象、undefined 等
- 大部分 attribute 与 property 是一一对应关系，修改其中一个会影响另一个，如 id，title 等属性
- 一些布尔属性`<input hidden/>`的检测设置需要 hasAttribute 和 removeAttribute 来完成，或者设置对应 property
- 像`<a href="../index.html">link</a>`中 href 属性，转换成 property 的时候需要通过转换得到完整 URL
- 一些 attribute 和 property 不是一一对应如：form 控件中`<input value="hello"/>`对应的是 defaultValue，修改或设置 value property 修改的是控件当前值，setAttribute 修改 value 属性不会改变 value property

### JS 获取 dom 的 CSS 样式

```js
function getStyle(obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr];
  } else {
    return window.getComputedStyle(obj, false)[attr];
  }
}
```

### JS 实现鼠标拖拽

https://blog.csdn.net/qq_37746973/article/details/80748879

### 区分什么是"客户区坐标","页面坐标","屏幕坐标"

- 客户区坐标
  - 鼠标指针在可视区中的水平坐标(clientX)和垂直坐标(clientY)
- 页面坐标
  - 鼠标指针在页面布局中的水平坐标(pageX)和垂直坐标
- 屏幕坐标
  - 设备物理屏幕的水平坐标(screenX)和垂直坐标(screenY)

### focus/blur 与 focusin/focusout 的区别与联系

1. focus/blur 不冒泡，focusin/focusout 冒泡
2. focus/blur 兼容性好，focusin/focusout 在除 FireFox 外的浏览器下都保持良好兼容性，如需使用事件托管，可考虑在 FireFox 下使用事件捕获 elem.addEventListener('focus', handler, true)

### mouseover/mouseout 与 mouseenter/mouseleave 的区别与联系

1. mouseover/mouseout 是标准事件，**所有浏览器都支持**；mouseenter/mouseleave 是 IE5.5 引入的特有事件后来被 DOM3 标准采纳，现代标准浏览器也支持
2. mouseover/mouseout 是**冒泡**事件；mouseenter/mouseleave**不冒泡**。需要为**多个元素监听鼠标移入/出事件时，推荐 mouseover/mouseout 托管，提高性能**
3. 标准事件模型中 event.target 表示发生移入/出的元素,**vent.relatedTarget**对应移出/如元素；在老 IE 中 event.srcElement 表示发生移入/出的元素，**event.toElement**表示移出的目标元素，**event.fromElement**表示移入时的来源元素

### document.write 和 innerHTML 的区别

    document.write 只能重绘整个页面
    innerHTML 可以重绘页面的一部分

#### 在什么时候你会使用 `document.write()`？

DOM 方法，可向文档写入 HTML 表达式或 JavaScript 代码。
大多数生成的广告代码依旧使用 `document.write()`，虽然这种用法会让人很不爽。

### 如何实现对一个 DOM 元素的深拷贝，包括元素的绑定事件？

### 页面上某一个点的坐标，如何获取该左边上的所有元素

### insertAdjacentHTML

insertAdjacentHTML() 将指定的文本解析为 HTML 或 XML，并将结果节点插入到 DOM 树中的指定位置。它不会重新解析它正在使用的元素，因此它不会破坏元素内的现有元素。这避免了额外的序列化步骤，使其比直接 innerHTML 操作更快。

```js
element.insertAdjacentHTML(position, text);
```

position 是相对于元素的位置，并且必须是以下字符串之一：

- 'beforebegin' 元素自身的前面。
- 'afterbegin' 插入元素内部的第一个子节点之前。
- 'beforeend' 插入元素内部的最后一个子节点之后。
- 'afterend' 元素自身的后面。

text 是要被解析为 HTML 或 XML,并插入到 DOM 树中的字符串。

示例：

```js
// <div id="one">one</div>
var d1 = document.getElementById('one');
d1.insertAdjacentHTML('afterend', '<div id="two">two</div>');

// 此时，新结构变成： // <div id="one">one</div><div id="two">two</div>

// ES6 version

let html = `<div id="two">two</div>`;
div.insertAdjacentHTML(`beforeend`, html);
```

### 要动态改变层中内容可以使用的方法？

innerHTML，innerText

### innerText 和 innerHTML 的区别

设置值时 innerText 会把 HTML 标签当做普通的文本显示，而 innerHTML 则不会。也就是直接修改 innerHTML 会解析内容中的 HTML 标签，比如换行。

### 请指出 document load 和 document ready 两个事件的区别。

DOMContentLoaded 与 load 的区别

https://www.cnblogs.com/caizhenbo/p/6679478.html

## BOM

BOM 是 browser object model 的缩写， 简称浏览器对象模型。 主要处理浏览器窗口和框架，描述了与浏览器进行交互的方法和接口， 可以对浏览器窗口进行访问和操作， 譬如可以弹出新的窗口， 回退历史记录， 获取 url。

### BOM 与 DOM 的关系

1. js 是通过访问 BOM 对象来访问、 控制、 修改浏览器
2. BOM 的 window 包含了 document， 因此通过 window 对象的 document 属性就可以访问、检索、 修改文档内容与结构。
3. document 对象又是 DOM 模型的根节点。

因此， BOM 包含了 DOM， 浏览器提供出来给予访问的是 BOM 对象， 从 BOM 对象再访问到 DOM 对象， 从而 js 可以操作浏览器以及浏览器读取到的文档

### DOM 和 BOM 有什么区别

DOM
Document Object Model，文档对象模型
DOM 是为了操作文档出现的 API，document 是其的一个对象
DOM 和文档有关，这里的文档指的是网页，也就是 html 文档。DOM 和浏览器无关，他关注的是网页本身的内容。

BOM
Browser Object Model，浏览器对象模型
BOM 是为了操作浏览器出现的 API，window 是其的一个对象
window 对象既为 javascript 访问浏览器提供 API，同时在 ECMAScript 中充当 Global 对象

### BOM 对象包含哪些内容？

- Window JavaScript 层级中的顶层对象， 表示浏览器窗口。
- Navigator 包含客户端浏览器的信息。
- History 包含了浏览器窗口访问过的 URL。
- Location 包含了当前 URL 的信息。
- Screen 包含客户端显示屏的信息。

### js 的路由是如何实现的？

location 是 javascript 里边管理地址栏的内置对象，比如 location.href 就管理页面的 url，用 location.href=url 就可以直接将页面重定向 url。而 location.hash 则可以用来获取或设置页面的标签值。

- #后的字符
  在第一个#后面出现的任何字符，都会被浏览器解读为位置标识符。这意味着，这些字符都不会被发送到服务器端。

- window.hash
  hash 属性是一个可读可写的字符串，该字符串是 URL 的锚部分（从 # 号开始的部分）。

### 几个很实用的 BOM 属性对象方法?

什么是 Bom? Bom 是浏览器对象。有哪些常用的 Bom 属性呢？

1. location 对象
   location.href-- 返回或设置当前文档的 URL
   location.search -- 返回 URL 中的查询字符串部分。例如 http://www.dreamdu.com/dreamd... 返回包括(?)后面的内容?id=5&name=dreamdu
   location.hash -- 返回 URL#后面的内容，如果没有#，返回空
   location.host -- 返回 URL 中的域名部分，例如 www.dreamdu.com
   location.hostname -- 返回 URL 中的主域名部分，例如 dreamdu.com
   location.pathname -- 返回 URL 的域名后的部分。例如 http://www.dreamdu.com/xhtml/ 返回/xhtml/
   location.port -- 返回 URL 中的端口部分。例如 http://www.dreamdu.com:8080/xhtml/ 返回 8080
   location.protocol -- 返回 URL 中的协议部分。例如 http://www.dreamdu.com:8080/xhtml/ 返回(//)前面的内容 http:
   location.assign -- 设置当前文档的 URL
   location.replace() -- 设置当前文档的 URL，并且在 history 对象的地址列表中移除这个 URL location.replace(url);
   location.reload() -- 重载当前页面

2. history 对象
   history.go() -- 前进或后退指定的页面数 history.go(num);
   history.back() -- 后退一页
   history.forward() -- 前进一页

3. Navigator 对象
   navigator.userAgent -- 返回用户代理头的字符串表示(就是包括浏览器版本信息等的字符串)
   navigator.cookieEnabled -- 返回浏览器是否支持(启用)cookie

#### History 对象

History 对象包含用户（在浏览器窗口中） 访问过的 URL

| 方法/属性 | 描述                              |
| --------- | --------------------------------- |
| length    | 返回浏览器历史列表中的 URL 数量。 |
| back()    | 加载 history 列表中的前一个 URL。 |
| forward() | 加载 history 列表中的下一个 URL。 |
| go()      | 加载 history 列表中的某个具体页面 |

#### Location 对象

Location 对象包含有关当前 URL 的信息。

| 属性     | 描述                                         |
| -------- | -------------------------------------------- |
| hash     | 设置或返回从井号 (#) 开始的 URL（锚） 。     |
| host     | 设置或返回主机名和当前 URL 的端口号。        |
| hostname | 设置或返回当前 URL 的主机名。                |
| href     | 设置或返回完整的 URL。                       |
| pathname | 设置或返回当前 URL 的路径部分。              |
| port     | 设置或返回当前 URL 的端口号。                |
| protocol | 设置或返回当前 URL 的协议。                  |
| search   | 置或返回从问号 (?) 开始的 URL（查询部分） 。 |

| 方法            | 描述                                                            |
| --------------- | --------------------------------------------------------------- |
| assign()        | 加载新的文档。                                                  |
| reload(‘force’) | 重新加载当前文档。参数可选，不填或填 false 则取浏览器缓存的文档 |
| replace()       | 用新的文档替换当前文档。                                        |

#### Window 对象

Window 对象表示一个浏览器窗口或一个框架。 在客户端 JavaScript 中， Window 对象
是全局对象，所有的表达式都在当前的环境中计算。 例如，可以只写 document， 而
不必写 window.document。

| 属性                                                   | 描述                                                                                                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| closed                                                 | 返回窗口是否已被关闭。                                                                                                                                                          |
| defaultStatus                                          | 设置或返回窗口状态栏中的默认文本。 （仅 Opera 支持）                                                                                                                            |
| document                                               | 对 Document 对象的只读引用。 请参阅 Document 对象。                                                                                                                             |
| history                                                | 对 History 对象的只读引用。 请参数 History 对象。                                                                                                                               |
| innerheight                                            | 返回窗口的文档显示区的高度。                                                                                                                                                    |
| innerwidth                                             | 返回窗口的文档显示区的宽度。                                                                                                                                                    |
| length                                                 | 设置或返回窗口中的框架数量。                                                                                                                                                    |
| location                                               | 用于窗口或框架的 Location 对象。 请参阅 Location 对象。                                                                                                                         |
| name                                                   | 设置或返回窗口的名称。                                                                                                                                                          |
| Navigator                                              | 对 Navigator 对象的只读引用。 请参数 Navigator 对象。                                                                                                                           |
| opener                                                 | 返回对创建此窗口的窗口的引用。                                                                                                                                                  |
| outerheight                                            | 返回窗口的外部高度。                                                                                                                                                            |
| outerwidth                                             | 返回窗口的外部宽度。                                                                                                                                                            |
| pageXOffset                                            | 设置或返回当前页面相对于窗口显示区左上角的 X 位置。                                                                                                                             |
| pageYOffset                                            | 设置或返回当前页面相对于窗口显示区左上角的 Y 位置。                                                                                                                             |
| parent                                                 | 返回父窗口。                                                                                                                                                                    |
| Screen                                                 | 对 Screen 对象的只读引用。 请参数 Screen 对象。                                                                                                                                 |
| self                                                   | 返回对当前窗口的引用。 等价于 Window 属性。                                                                                                                                     |
| status                                                 | 设置窗口状态栏的文本。 (默认只支持 Opera)                                                                                                                                       |
| top                                                    | 返回最顶层的先辈窗口。                                                                                                                                                          |
| window                                                 | window 属性等价于 self 属性， 它包含了对窗口自身的引用。                                                                                                                        |
| screenLeft <br/> screenTop <br/> screenX <br/> screenY | 只读整数。声明了窗口的左上角在屏幕上的的 x 坐标和 y 坐标。 IE、 Safari、 Chrome 和 Opera 支持 screenLeft 和 screenTop， 而 Chrome、 Firefox 和 Safari 支持 screenX 和 screenY。 |

| 方法            | 描述                                                                                  |
| --------------- | ------------------------------------------------------------------------------------- |
| alert()         | 显示带有一段消息和一个确认按钮的警告框。                                              |
| blur()          | 把键盘焦点从顶层窗口移开。                                                            |
| confirm()       | 显示带有一段消息以及确认按钮和取消按钮的对话框。                                      |
| createPopup()   | 创建一个弹出窗口。 只有 ie 支持（不包括 ie11）                                        |
| focus()         | 把键盘焦点给予一个窗口。                                                              |
| moveBy()        | 可相对窗口的当前坐标把它移动指定的像素。                                              |
| moveTo()        | 把窗口的左上角移动到一个指定的坐标。                                                  |
| open()          | 打开一个新的浏览器窗口或查找一个已命名的窗口。 window.open(URL,name,features,replace) |
| print()         | 打印当前窗口的内容。                                                                  |
| prompt()        | 显示可提示用户输入的对话框。                                                          |
| resizeBy()      | 按照指定的像素调整窗口的大小。                                                        |
| resizeTo()      | 把窗口的大小调整到指定的宽度和高度。                                                  |
| scrollBy()      | 按照指定的像素值来滚动内容。                                                          |
| scrollTo()      | 把内容滚动到指定的坐标。                                                              |
| setInterval()   | 按照指定的周期（以毫秒计） 来调用函数或计算表达式。                                   |
| setTimeout()    | 在指定的毫秒数后调用函数或计算表达式。                                                |
| clearInterval() | 取消由 setInterval() 设置的 timeout。                                                 |
| clearTimeout()  | 取消由 setTimeout() 方法设置的 timeout。close() 关闭浏览器窗口                        |

#### Navigator 对象

Navigator 对象包含的属性描述了正在使用的浏览器。 可以使用这些属性进行平台专用的配置。 虽然这个对象的名称显而易见的是 Netscape 的 Navigator 浏览器， 但其他实现了 JavaScript 的浏览器也支持这个对象。

| 属性            | 描述                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------- |
| appCodeName     | 返回浏览器的代码名。 以 Netscape 代码为基础的浏览器中， 它的值是 "Mozilla"。Microsoft 也是          |
| appMinorVersion | 返回浏览器的次级版本。 （IE4、 Opera 支持）                                                         |
| appName         | 返回浏览器的名称。                                                                                  |
| appVersion      | 返回浏览器的平台和版本信息。                                                                        |
| browserLanguage | 返回当前浏览器的语言。 （IE 和 Opera 支持）cookieEnabled 返回指明浏览器中是否启用 cookie 的布尔值。 |
| cpuClass        | 返回浏览器系统的 CPU 等级。 （IE 支持）                                                             |
| onLine          | 返回指明系统是否处于脱机模式的布尔值。                                                              |
| platform        | 返回运行浏览器的操作系统平台。                                                                      |
| systemLanguage  | 返回当前操作系统的默认语言。 （IE 支持）                                                            |
| userAgent       | 返回由客户机发送服务器的 user-agent 头部的值。                                                      |
| userLanguage    | 返回操作系统设定的自然语言。 （IE 和 Opera 支持）                                                   |
| plugins         | 返回包含客户端安装的所有插件的数组                                                                  |

| 方法           | 描述                                         |
| -------------- | -------------------------------------------- |
| javaEnabled()  | 规定浏览器是否支持并启用了 Java。            |
| taintEnabled() | 规定浏览器是否启用数据污点 (data tainting)。 |

#### Screen 对象

Screen 对象包含有关客户端显示屏幕的信息。 每个 Window 对象的 screen 属性都引用一个 Screen 对象。 Screen 对象中存放着有关显示浏览器屏幕的信息。 JavaScript 程序将利用这些信息来优化它们的输出， 以达到用户的显示要求。 例如，一个程序可以根据显示器的尺寸选择使用大图像还是使用小图像，它还可以根据显示器的颜色深度选择使用 16 位色还是使用 8 位色的图形。 另外，JavaScript 程序还能根有关屏幕尺寸的信息将新的浏览器窗口定位在屏幕中间。

| 属性                 | 描述                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| availHeight          | 返回显示屏幕的高度 (除 Windows 任务栏之外)。                                                     |
| availWidth           | 返回显示屏幕的宽度 (除 Windows 任务栏之外)。                                                     |
| bufferDepth          | 设置或返回调色板的比特深度。 （仅 IE 支持）colorDepth 返回目标设备或缓冲器上的调色板的比特深度。 |
| deviceXDPI           | 返回显示屏幕的每英寸水平点数。 （仅 IE 支持）                                                    |
| deviceYDPI           | 返回显示屏幕的每英寸垂直点数。 （仅 IE 支持）                                                    |
| fontSmoothingEnabled | 返回用户是否在显示控制面板中启用了字体平滑。 （仅 IE 支持）                                      |
| height               | 返回显示屏幕的高度。                                                                             |
| logicalXDPI          | 返回显示屏幕每英寸的水平方向的常规点数。 （仅 IE 支持）                                          |
| logicalYDPI          | 返回显示屏幕每英寸的垂直方向的常规点数。 （仅 IE 支持）                                          |
| pixelDepth           | 返回显示屏幕的颜色分辨率（比特每像素） 。                                                        |
| updateInterval       | 设置或返回屏幕的刷新率。 （仅 IE11 以下支持）                                                    |
| width                | 返回显示器屏幕的宽度。                                                                           |

### offsetWidth/offsetHeight,clientWidth/clientHeight 与 scrollWidth/scrollHeight 的区别

- offsetWidth/offsetHeight 返回值包含 content + padding + border，效果与 e.getBoundingClientRect()相同
- clientWidth/clientHeight 返回值只包含 content + padding，如果有滚动条，也不包含滚动条
- scrollWidth/scrollHeight 返回值包含 content + padding + 溢出内容的尺寸
