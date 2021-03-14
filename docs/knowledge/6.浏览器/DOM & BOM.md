---
title: DOM & BOM
date: '2020-10-26'
draft: true
---

## DOM

主要部分: DOM 事件的级别,DOM 事件模型,DOM 事件流,DOM 事件捕获的具体流程,Event 对象的常见应用,自定义事件 这几个部分的内容。

### 什么是 window 对象? 什么是 document 对象

window

- Window 对象表示当前浏览器的窗口，是 JavaScript 的顶级对象。
- 我们创建的所有对象、函数、变量都是 Window 对象的成员。
- Window 对象的方法和属性是在全局范围内有效的。

document

- Document 对象是 HTML 文档的根节点与所有其他节点（元素节点，文本节点，属性节点, 注释节点）
- Document 对象使我们可以通过脚本对 HTML 页面中的所有元素进行访问
- Document 对象是 Window 对象的一部分，即 window.document

### 获得一个 DOM 元素的绝对位置

- offsetTop：返回当前元素相对于其 offsetParent 元素的顶部的距离
- offsetLeft：返回当前元素相对于其 offsetParent 元素的左边的距离
- getBoundingClientRect()：返回值是一个 DOMRect 对象，它包含了一组用于描述边框的只读属性——left、top、right 和 bottom，属性单位为像素

### offsetWidth/offsetHeight,clientWidth/clientHeight 与 scrollWidth/scrollHeight 的区别

- offsetWidth/offsetHeight 返回值包含 content + padding + border，效果与 e.getBoundingClientRect()相同
- clientWidth/clientHeight 返回值只包含 content + padding，如果有滚动条，也不包含滚动条
- scrollWidth/scrollHeight 返回值包含 content + padding + 溢出内容的尺寸

### innerText 和 innerHTML 的区别

设置值时 innerText 会把 HTML 标签当做普通的文本显示，而 innerHTML 则不会。也就是直接修改 innerHTML 会解析内容中的 HTML 标签，比如换行。

### DOM 常用 API

1. document.getElementById
2. document.getElementsByTagName
3. document.getElementsByClassName
4. document.querySelectorAll
5. document.createElement 添加新节点
6. document.getElementById('id').parentElement 父元素
7. document.getElementById('id').childNodes 子元素
8. document.getElementById('div1').removeChild 删除节点

## BOM

BOM 是 browser object model 的缩写， 简称浏览器对象模型。 主要处理浏览器窗口和框架，描述了与浏览器进行交互的方法和接口， 可以对浏览器窗口进行访问和操作， 譬如可以弹出新的窗口， 回退历史记录， 获取 url。

### BOM 对象包含哪些内容？

- Window JavaScript 层级中的顶层对象， 表示浏览器窗口。
- Navigator 包含客户端浏览器的信息。
- History 包含了浏览器窗口访问过的 URL。
- Location 包含了当前 URL 的信息。
- Screen 包含客户端显示屏的信息。

### BOM 与 DOM 的关系

- js 是通过访问 BOM 对象来访问、 控制、 修改浏览器
- BOM 的 window 包含了 document， 因此通过 window 对象的 document 属性就可以访问、检索、 修改文档内容与结构。
- document 对象又是 DOM 模型的根节点。

因此， BOM 包含了 DOM， 浏览器提供出来给予访问的是 BOM 对象， 从 BOM 对象再访问到 DOM 对象， 从而 js 可以操作浏览器以及浏览器读取到的文档

#### History 对象

History 对象包含用户（在浏览器窗口中） 访问过的 URL

| 方法/属性 | 描述                              |
| --------- | --------------------------------- |
| length    | 返回浏览器历史列表中的 URL 数量。 |
| back()    | 加载 history 列表中的前一个 URL。 |
| forward() | 加载 history 列表中的下一个 URL。 |
| go()      | 加载 history 列表中的某个具体页面 |

#### location 对象

location 对象包含有关当前 URL 的信息。

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

#### navigator.userAgent

返回由客户机发送服务器的 user-agent 头部的值。
