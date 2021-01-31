---
title: DOM & BOM
date: '2020-10-26'
draft: true
---

## DOM

主要部分: DOM 事件的级别,DOM 事件模型,DOM 事件流,DOM 事件捕获的具体流程,Event 对象的常见应用,自定义事件 这几个部分的内容。

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

### 获得一个 DOM 元素的绝对位置

- offsetTop：返回当前元素相对于其 offsetParent 元素的顶部的距离
- offsetLeft：返回当前元素相对于其 offsetParent 元素的左边的距离
- getBoundingClientRect()：返回值是一个 DOMRect 对象，它包含了一组用于描述边框的只读属性——left、top、right 和 bottom，属性单位为像素

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

### innerText 和 innerHTML 的区别

设置值时 innerText 会把 HTML 标签当做普通的文本显示，而 innerHTML 则不会。也就是直接修改 innerHTML 会解析内容中的 HTML 标签，比如换行。

### 请指出 document load 和 document ready 两个事件的区别。

DOMContentLoaded 与 load 的区别

https://www.cnblogs.com/caizhenbo/p/6679478.html

## BOM

BOM 是 browser object model 的缩写， 简称浏览器对象模型。 主要处理浏览器窗口和框架，描述了与浏览器进行交互的方法和接口， 可以对浏览器窗口进行访问和操作， 譬如可以弹出新的窗口， 回退历史记录， 获取 url。

### BOM 与 DOM 的关系

- js 是通过访问 BOM 对象来访问、 控制、 修改浏览器
- BOM 的 window 包含了 document， 因此通过 window 对象的 document 属性就可以访问、检索、 修改文档内容与结构。
- document 对象又是 DOM 模型的根节点。

因此， BOM 包含了 DOM， 浏览器提供出来给予访问的是 BOM 对象， 从 BOM 对象再访问到 DOM 对象， 从而 js 可以操作浏览器以及浏览器读取到的文档

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

### offsetWidth/offsetHeight,clientWidth/clientHeight 与 scrollWidth/scrollHeight 的区别

- offsetWidth/offsetHeight 返回值包含 content + padding + border，效果与 e.getBoundingClientRect()相同
- clientWidth/clientHeight 返回值只包含 content + padding，如果有滚动条，也不包含滚动条
- scrollWidth/scrollHeight 返回值包含 content + padding + 溢出内容的尺寸
