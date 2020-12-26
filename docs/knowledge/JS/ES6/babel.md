---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

[babel](https://www.vanadis.cn/2017/03/18/babel-stage-x/)

https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#visitors%E8%AE%BF%E9%97%AE%E8%80%85

## babel 介绍

babel 是一个解码器，可以将 ES6 代码转为 ES5 代码，从而在现有环境执行。这意味着你可以直接写 ES6 ES7 之类的代码，而不用担心现有的环境支不支持。

### 配置文件 .babelrc

.babelrc 存放在项目的根目录下面。基本格式如下：

```js
{
  "presets": [],
  "plugins": []
}
```

presets (预设)字段设定转码规则，官方提供以下的规则集，你可以根据需要安装。

- babel-preset-es2015 用于解析 ES6
- babel-preset-react 用于解析 JSX
- babel-preset-stage-0 用于解析 ES7

然后，将这些规则加入 .babelrc

```js
  {
    "presets": [
      "es2015",
      "react",
      "stage-0"
    ],
    "plugins": []
  }
```

### preset 预设

### plugin 插件

### babel 是什么，一般需要怎么用。 说一说 babel 做的事情。

### babel 是什么，有什么作用?

`babel`是一个 `ES6` 转码器，可以将 `ES6` 代码转为 `ES5` 代码，以便兼容那些还没支持`ES6`的平台

### babel-polyfill

https://blog.csdn.net/chjj0904/article/details/79169821
Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，
以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。
举例来说，ES6 在 Array 对象上新增了 Array.from 方法。Babel 就不会转码这个方法。如果想让这个方法运行，必须使用 babel-polyfill，为当前环境提供一个垫片

### [babel-register](http://babeljs.io/docs/usage/babel-register/)

babel-register 字面意思能看出来，这是 babel 的一个注册器，它在底层改写了 node 的 require 方法，引入 babel-register 之后所有 require 并以.es6, .es, .jsx 和 .js 为后缀的模块都会经过 babel 的转译
https://blog.csdn.net/qq_40171039/article/details/78326344

### babel 不支持 proxy

### 什么是 Babel

- Babel 是一个 JS 编译器，自带一组 ES6 语法转化器，用于转化 JS 代码。
  这些转化器让开发者提前使用最新的 JS 语法(ES6/ES7)，而不用等浏览器全部兼容。
- Babel 默认只转换新的 JS 句法(syntax)，而不转换新的 API。

### 为什么很多人宁可使用 for 循环也不愿意使用扩展运算符 ？

### 插件

transform-runtime 以及 stage-2 说一下他们的作用

- stage-1，stage-2，stage-3

- 按需加载插件的实现原理
- (vue 的) jsx 插件的实现原理

### polyfill 的作用

### babel

https://juejin.im/post/5c03b85ae51d450c740de19c

## babel

- 是做什么的？ 什么原理
- stage 几个阶段的区别

### 堆，栈，队列的区别

申请方式
内存中的堆和栈第一个区别就是申请方式的不同：栈是系统自动分配空间的，而堆则是程序员根据需要自己申请的空间。由于栈上的空间是自动分配自动回收的，所以栈上的数据的生存周期只是在函数的运行过程中，运行后就释放掉，不可以再访问。而堆上的数据只要程序员不释放空间，就一直可以访问到，不过缺点是一旦忘记释放会造成内存泄露。
申请效率的比较：栈由系统自动分配，速度较快。但程序员是无法控制的。堆是由 new 分配的内存，一般速度比较慢，而且容易产生内存碎片，不过用起来最方便。

申请大小的限制：
栈：在 Windows 下，栈是向低地址扩展的数据结构，是一块连续的内存的区域。这句话的意思是栈顶的地址和栈的最大容量是系统预先规定好的，在 Windows 下，栈的大小是 2M（也有的说是 1M，总之是一个编译时就确定的常数），如果申请的空间超过栈的剩余空间时，将提示 overflow。因此，能从栈获得的空间较小。
堆：堆是向高地址扩展的数据结构，是不连续的内存区域。这是由于系统是用链表来存储空闲内存地址的，自然是不连续的，而链表的遍历方向是由低地址向高地址。堆的大小受限于计算机系统中有效的虚拟内存。由此可见，堆获得的空间比较灵活，也比较大。

### 解释同步 (synchronous) 和异步 (asynchronous) 函数的区别

同步调用，在发起一个函数或方法调用时，没有得到结果之前，该调用就不返回，直到返回结果；

异步调用的概念和同步相对，在一个异步调用发起后，被调用者立即返回给调用者，但调用者不能立刻得到结果，被调用者在实际处理这个调用的请求完成后，通过状态、通知或回调等方式来通知调用者请求处理的结果。

简单地说，同步就是发出一个请求后什么事都不做，一直等待请求返回后才会继续做事；异步就是发出请求后继续去做其他事，这个请求处理完成后会通知你，这时候就可以处理这个回应了。

### 默认参数如何工作？

1. 基本用法

```js
function first(x = 1, y = 2) {
  console.log('x：' + x, 'y：' + y);
}
first();
first(100);
```

2. 与解构赋值默认值结合

```js
function second({ x, y = 2 }) {
  console.log('x：' + x, 'y：' + y);
}
second({});
second({ x: 100 });
second({ x: 100, y: 200 });
```

3. 双重默认值

```js
function third({ x = 1, y = 2 } = {}) {
  console.log('x：' + x, 'y：' + y);
}
third();
third({ x: 100, y: 200 });
third({ x: 100 });
```

### 其他

- assign-deep
- 原型和原型链 https://www.cnblogs.com/jianghao233/p/8983176.html
- 几个字符串函数的区别 https://blog.csdn.net/qq_37120738/article/details/79086706
- 如何创建一个对象，以及各种方式的区别
- js 创建一个空对象的几种方法和区别， vuex 中使用 Object.create(null) ？ 为什么不直接使用 {}

* Object.keys 输出顺序 https://mp.weixin.qq.com/s?__biz=MzA5NzkwNDk3MQ==&mid=2650587762&idx=1&sn=0b9fc52be79943be1f37005d231a1529&chksm=8891d256bfe65b40ae4ae66cefcf262dd5e4382b6dbcf891eaea1c36e4b9519723cacb196975&scene=0#rd
* this 以及 箭头函数的 this
* prototype 和 **proto** 的关系

- Typeof null
- var undefined
- undefined == null // true
- null === null
- undefined === undefined
- 1 == true;
- 2 == true;
- 0 == false;
- 0 == '';
- NaN == NaN
- []==![]
- []==false
- typeof 去判断数据类型时返回值有哪些
- == 与===
- undefined 和 not defined 的区别

- typeof, instance of, Object.prototype.toString()
- 怎么判断一个 object 是否是一个数组
- 0.1 + 0.2 为啥不等于 0.3
- js number 最大和最小的数是多少？ 超出该如何表示？
- 说一说 promise 和 await async 分别的优势和劣势

  - 首先 await 的劣势有几个

    - 需要手动加 try catch
    - 多个 await 执行会有一定的先后顺序，如果可以并行处理需要使用 promise.all 才可以

  - 普通限频函数的实现原理，以及缺点，造成的问题(promise) 以及解决的办法

- 如果我们使用 js 的 "关联数组"， 我们如何计算 "关联数组" 的长度？
- 对于 arguments , object prototype, context, this 的理解
- settimeout setinterval requestAnimation 之间的区别
- 优化 http 请求需要全部打包还是进行拆分，如何查分？
- 如何监控 js 对象属性变更 proxy 以及 defineProperty
- js 中的 in 操作符号， 判断对象中是否有某一个 key 但是不能用于 数组 <https://www.cnblogs.com/yu-709213564/p/6580392.html>
- document load 和 ready 的区别
- 低版本的 浏览器不支持 html5 如何解决
- 说一说 基本的浏览器兼容问题
- js 的 curry 化
- 解释 event-loop 和 macro-task mico-task 的理解和应用举例
- promise generator 和 async/await 是如何实现的？
- jquery 源码中你对哪个部分印象最深，讲一讲？（我就说了构造函数返回原型链中的 this）
- 原型链是干啥的么，为什么要有原型链？
- 熟悉 this 吗？js 中的 this 和 c++/java 中的 this 有什么区别？ this 的三种应用场景
- 如果在构造函数中为 this 赋值 1 会发生什么？应该怎么改变 this 的值？
- JS 如何实现重载和多态
- 浮点型如何存储
- 原生事件绑定（跨浏览器），dom0 和 dom2 的区别？
- 说出一些函数的原型链
- 严格模式(在非严格模式中，未声明变量默认为全局变量，可以在全局环境中通过 this 访问。严格模式取消了默认 this 全局变量，因此在函数 foo 外访问会报错)
- 执行环境和作用域链的解释
- 如何用原生 JS 实现 jQuery 选择器？（querySelector 和 querySeletorAll）
- 如何给子元素到父元素依次绑定事件？（不考虑兼容性的话，使用 addEventListenr）
- addEventListenr 有三个参数，解释一下最后一个参数？（事件冒泡和事件捕获的区别）
- 如何让一个函数调用自身（函数内部可以使用其函数名或者 argument.callee 进行调用）
- argument.callee 是什么?（表示当前执行的函数，但是在 ES5 的严格模式下是不能使用的。(要勇敢地发散问题，这个 ES5 就是发散出来的，体现自身知识广度））
- 如何创建 DOM 节点（这个很简单），追问：元素节点和文本节点有什么区别（只回答了他们的 nodeType 不一样，元素节点是 1，文本节点是 3）
- 什么是预加载、懒加载
- 如何判断一个变量是字符串

  ```
    Object.prototype.toString.call('str') // '[object String]'
    typeof 'str' // 'string'
    // 常见的错误写法（我只答了上面俩，多机智）
    > 'cads' instanceof String
    false
  ```

- JavaScript 原型，原型链 ?
  原型：
  a. 原型是一个对象，其他对象可以通过它实现属性继承。
  b. 一个对象的真正原型是被对象内部的[[Prototype]]属性(property)所持有。浏览器支持非标准的访问器 proto。
  c. 在 javascript 中，一个对象就是任何无序键值对的集合，如果它不是一个主数据类型(undefined，null，boolean，number，string)，那它就是一个对象。
  原型链：
  a. 因为每个对象和原型都有一个原型(注:原型也是一个对象)，对象的原型指向对象的父，而父的原型又指向父的父，我们把这种通过原型层层连接起来的关系撑为原型链。
  b. 这条链的末端一般总是默认的对象原型。
  ```
    a.__proto__ = b;
    b.__proto__ = c;
    c.__proto__ = {}; //default object
    {}.__proto__.__proto__; //null
  ```

* 显示原型和隐式原型，手绘原型链，原型链是什么？为什么要有原型链
* 指出 JS 的宿主对象和原生对象的区别，为什么扩展 JS 内置对象不是好的做法？有哪些内置对象和内置函数？
* document load 和 document DOMContentLoaded 两个事件的区别
* typeof 能够得到哪些值
* 给定一个元素获取它相对于视图窗口的坐标
* navigator 对象，location 和 history
* js 动画和 css3 动画比较
* js 处理异常
* websocket 的工作原理和机制。

* 什么是函数柯里化？以及说一下 JS 的 API 有哪些应用到了函数柯里化的实现？(函数柯里化一些了解，以及在函数式编程的应用，最后说了一下 JS 中 bind 函数和数组的 reduce 方法用到了函数柯里化。)
* JS 代码调试
* String 对象方法不包含 length ， 数组中的 length 是 Array 的属性
* 判断数组或者对象是否为空

  ```
  export const isArrayEmpty = (array) => {
    return !array || (array && array.length === 0)
  }

  export const isEmpty = (v) => {
    return (
      (Array.isArray(v) && v.length == 0) || (Object.prototype.isPrototypeOf(v) && Object.keys(v).length == 0)
    );
  }
  ```

* isPrototypeOf https://www.jianshu.com/p/44ba37660b4a
* babel 入门篇
  https://blog.csdn.net/mm19931027/article/details/78741128

* js 对象拷贝
  https://blog.csdn.net/wang839305939/article/details/80819132

  - 深拷贝
    JSON.parse(JSON.stringify(a)) 会有一些缺点

    - 会忽略 `undefined`
    - 不能序列化函数，会被忽略
    - 不能解决循环引用的对象

  - 浅拷贝
    - Object.assign({}, a)
    - ... 扩展对象符

* 四舍五入 Math.round()
* function(foo) { var foo = {n: 1}} var foo 的优先级低于形参，无效
* 只要为 img 标签设置了 src 属性，无论是 display: none 还是 visibility: hidden 都会产生请求；把图片设置为不存在的属性，比如 data-src 此时 display: none 还是 visibility: hidden 都不会产生请求
* js 中最大能表示的数是多少？最小的数是多少？ 一个字符串占几个字节， 一个 number 类型占多少字节
* new Array 与 [] 声明数组的区别，new String 与 "" 声明字符串的区别
* a href="javascript: void(0)" 标签的 href 空属性

- 描述一种 JavaScript 中实现 memoization(避免重复运算)的策略。

* 你如何从浏览器的 URL 中获取查询字符串参数。

* 如何实现下列代码：

```js
[1, 2, 3, 4, 5].duplicator(); // [1,2,3,4,5,1,2,3,4,5]
```

### 如何实现数组的随机排序？

- 方法一：

```js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function randSort1(arr) {
  for (var i = 0, len = arr.length; i < len; i++) {
    var rand = parseInt(Math.random() * len);
    var temp = arr[rand];
    arr[rand] = arr[i];
    arr[i] = temp;
  }
  return arr;
}
console.log(randSort1(arr));
```

- 方法二：

```js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function randSort2(arr) {
  var mixedArray = [];
  while (arr.length > 0) {
    var randomIndex = parseInt(Math.random() * arr.length);
    mixedArray.push(arr[randomIndex]);
    arr.splice(randomIndex, 1);
  }
  return mixedArray;
}
console.log(randSort2(arr));
```

- 方法三：

```js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
arr.sort(function() {
  return Math.random() - 0.5;
});
console.log(arr);
```

### 清空一个 js 数组

```js
var arrayList = ['a', 'b', 'c', 'd', 'e', 'f'];

// 1
arrayList = [];
// 2
arrayList.length = 0;
// 3
arrayList.splice(0, arrayList.length);
// 4
while (arrayList.length) {
  arrayList.pop();
}
```

### DOM 元素 e 的 e.getAttribute(propName)和 e.propName 有什么区别和联系

- e.getAttribute()，是标准 DOM 操作文档元素属性的方法，具有通用性可在任意文档上使用，返回元素在源文件中**设置的属性**
- e.propName 通常是在 HTML 文档中访问特定元素的**特性**，浏览器解析元素后生成对应对象（如 a 标签生成 HTMLAnchorElement），这些对象的特性会根据特定规则结合属性设置得到，对于没有对应特性的属性，只能使用 getAttribute 进行访问
- e.getAttribute()返回值是源文件中设置的值，类型是字符串或者 null（有的实现返回""）
- e.propName 返回值可能是字符串、布尔值、对象、undefined 等
- 大部分 attribute 与 property 是一一对应关系，修改其中一个会影响另一个，如 id，title 等属性
- 一些布尔属性`<input hidden/>`的检测设置需要 hasAttribute 和 removeAttribute 来完成，或者设置对应 property
- 像`<a href="../index.html">link</a>`中 href 属性，转换成 property 的时候需要通过转换得到完整 URL
- 一些 attribute 和 property 不是一一对应如：form 控件中`<input value="hello"/>`对应的是 defaultValue，修改或设置 value property 修改的是控件当前值，setAttribute 修改 value 属性不会改变 value property

### offsetWidth/offsetHeight,clientWidth/clientHeight 与 scrollWidth/scrollHeight 的区别

- offsetWidth/offsetHeight 返回值包含**content + padding + border**，效果与 e.getBoundingClientRect()相同
- clientWidth/clientHeight 返回值只包含**content + padding**，如果有滚动条，也**不包含滚动条**
- scrollWidth/scrollHeight 返回值包含**content + padding + 溢出内容的尺寸**

[Measuring Element Dimension and Location with CSSOM in Windows Internet Explorer 9](<http://msdn.microsoft.com/en-us/library/ie/hh781509(v=vs.85).aspx>)

![元素尺寸](img/element-size.png)

### XMLHttpRequest 通用属性和方法

1. `readyState`:表示请求状态的整数，取值：

- UNSENT（0）：对象已创建
- OPENED（1）：open()成功调用，在这个状态下，可以为 xhr 设置请求头，或者使用 send()发送请求
- HEADERS_RECEIVED(2)：所有重定向已经自动完成访问，并且最终响应的 HTTP 头已经收到
- LOADING(3)：响应体正在接收
- DONE(4)：数据传输完成或者传输产生错误

3. `onreadystatechange`：readyState 改变时调用的函数
4. `status`：服务器返回的 HTTP 状态码（如，200， 404）
5. `statusText`:服务器返回的 HTTP 状态信息（如，OK，No Content）
6. `responseText`:作为字符串形式的来自服务器的完整响应
7. `responseXML`: Document 对象，表示服务器的响应解析成的 XML 文档
8. `abort()`:取消异步 HTTP 请求
9. `getAllResponseHeaders()`: 返回一个字符串，包含响应中服务器发送的全部 HTTP 报头。每个报头都是一个用冒号分隔开的名/值对，并且使用一个回车/换行来分隔报头行
10. `getResponseHeader(headerName)`:返回 headName 对应的报头值
11. `open(method, url, asynchronous [, user, password])`:初始化准备发送到服务器上的请求。method 是 HTTP 方法，不区分大小写；url 是请求发送的相对或绝对 URL；asynchronous 表示请求是否异步；user 和 password 提供身份验证
12. `setRequestHeader(name, value)`:设置 HTTP 报头
13. `send(body)`:对服务器请求进行初始化。参数 body 包含请求的主体部分，对于 POST 请求为键值对字符串；对于 GET 请求，为 null

### focus/blur 与 focusin/focusout 的区别与联系

1. focus/blur 不冒泡，focusin/focusout 冒泡
2. focus/blur 兼容性好，focusin/focusout 在除 FireFox 外的浏览器下都保持良好兼容性，如需使用事件托管，可考虑在 FireFox 下使用事件捕获 elem.addEventListener('focus', handler, true)
3. 可获得焦点的元素：
   1. window
   2. 链接被点击或键盘操作
   3. 表单空间被点击或键盘操作
   4. 设置`tabindex`属性的元素被点击或键盘操作

### mouseover/mouseout 与 mouseenter/mouseleave 的区别与联系

1. mouseover/mouseout 是标准事件，**所有浏览器都支持**；mouseenter/mouseleave 是 IE5.5 引入的特有事件后来被 DOM3 标准采纳，现代标准浏览器也支持
2. mouseover/mouseout 是**冒泡**事件；mouseenter/mouseleave**不冒泡**。需要为**多个元素监听鼠标移入/出事件时，推荐 mouseover/mouseout 托管，提高性能**
3. 标准事件模型中 event.target 表示发生移入/出的元素,**vent.relatedTarget**对应移出/如元素；在老 IE 中 event.srcElement 表示发生移入/出的元素，**event.toElement**表示移出的目标元素，**event.fromElement**表示移入时的来源元素

例子：鼠标从 div#target 元素移出时进行处理，判断逻辑如下：

    <div id="target"><span>test</span></div>

    <script type="text/javascript">
    var target = document.getElementById('target');
    if (target.addEventListener) {
      target.addEventListener('mouseout', mouseoutHandler, false);
    } else if (target.attachEvent) {
      target.attachEvent('onmouseout', mouseoutHandler);
    }

    function mouseoutHandler(e) {
      e = e || window.event;
      var target = e.target || e.srcElement;

      // 判断移出鼠标的元素是否为目标元素
      if (target.id !== 'target') {
        return;
      }

      // 判断鼠标是移出元素还是移到子元素
      var relatedTarget = event.relatedTarget || e.toElement;
      while (relatedTarget !== target
        && relatedTarget.nodeName.toUpperCase() !== 'BODY') {
        relatedTarget = relatedTarget.parentNode;
      }

      // 如果相等，说明鼠标在元素内部移动
      if (relatedTarget === target) {
        return;
      }

      // 执行需要操作
      //alert('鼠标移出');

    }
    </script>

### sessionStorage,localStorage,cookie 区别

1. 都会在浏览器端保存，有大小限制，同源限制
2. cookie 会在请求时发送到服务器，作为会话标识，服务器可修改 cookie；web storage 不会发送到服务器
3. cookie 有 path 概念，子路径可以访问父路径 cookie，父路径不能访问子路径 cookie
4. 有效期：cookie 在设置的有效期内有效，默认为浏览器关闭；sessionStorage 在窗口关闭前有效，localStorage 长期有效，直到用户删除
5. 共享：sessionStorage 不能共享，localStorage 在同源文档之间共享，cookie 在同源且符合 path 规则的文档之间共享
6. localStorage 的修改会促发其他文档窗口的 update 事件
7. cookie 有 secure 属性要求 HTTPS 传输
8. 浏览器不能保存超过 300 个 cookie，单个服务器不能超过 20 个，每个 cookie 不能超过 4k。web storage 大小支持能达到 5M

### 应用程序存储和离线 web 应用

HTML5 新增应用程序缓存，允许 web 应用将应用程序自身保存到用户浏览器中，用户离线状态也能访问。 1.为 html 元素设置 manifest 属性:`<html manifest="myapp.appcache">`，其中后缀名只是一个约定，真正识别方式是通过`text/cache-manifest`作为 MIME 类型。所以需要配置服务器保证设置正确
2.manifest 文件首行为`CACHE MANIFEST`，其余就是要缓存的 URL 列表，每个一行，相对路径都相对于 manifest 文件的 url。注释以#开头
3.url 分为三种类型：`CACHE`:为默认类型。`NETWORK`：表示资源从不缓存。 `FALLBACK`:每行包含两个 url，第二个 URL 是指需要加载和存储在缓存中的资源， 第一个 URL 是一个前缀。任何匹配该前缀的 URL 都不会缓存，如果从网络中载入这样的 URL 失败的话，就会用第二个 URL 指定的缓存资源来替代。以下是一个文件例子：

```
CACHE MANIFEST

CACHE:
myapp.html
myapp.css
myapp.js

FALLBACK:
videos/ offline_help.html

NETWORK:
cgi/
```

### 客户端存储 localStorage 和 sessionStorage

- localStorage 有效期为永久，sessionStorage 有效期为顶层窗口关闭前
- 同源文档可以读取并修改 localStorage 数据，sessionStorage 只允许同一个窗口下的文档访问，如通过 iframe 引入的同源文档。
- Storage 对象通常被当做普通 javascript 对象使用：**通过设置属性来存取字符串值**，也可以通过**setItem(key, value)设置**，**getItem(key)读取**，**removeItem(key)删除**，**clear()删除所有数据**，**length 表示已存储的数据项数目**，**key(index)返回对应索引的 key**

```
localStorage.setItem('x', 1); // storge x->1
localStorage.getItem('x); // return value of x

// 枚举所有存储的键值对
for (var i = 0, len = localStorage.length; i < len; ++i ) {
    var name = localStorage.key(i);
    var value = localStorage.getItem(name);
}

localStorage.removeItem('x'); // remove x
localStorage.clear();  // remove all data
```

### cookie 及其操作

- cookie 是 web 浏览器存储的少量数据，最早设计为服务器端使用，作为 HTTP 协议的扩展实现。cookie 数据会自动在浏览器和服务器之间传输。
- 通过读写 cookie 检测是否支持
- cookie 属性有**名**，**值**，**max-age**，**path**, **domain**，**secure**；
- cookie 默认有效期为浏览器会话，一旦用户关闭浏览器，数据就丢失，通过设置**max-age=seconds**属性告诉浏览器 cookie 有效期
- cookie 作用域通过**文档源**和**文档路径**来确定，通过**path**和**domain**进行配置，web 页面同目录或子目录文档都可访问
- 通过 cookie 保存数据的方法为：为 document.cookie 设置一个符合目标的字符串如下
- 读取 document.cookie 获得'; '分隔的字符串，key=value,解析得到结果

```
document.cookie = 'name=qiu; max-age=9999; path=/; domain=domain; secure';

document.cookie = 'name=aaa; path=/; domain=domain; secure';
// 要改变cookie的值，需要使用相同的名字、路径和域，新的值
// 来设置cookie，同样的方法可以用来改变有效期

// 设置max-age为0可以删除指定cookie

//读取cookie，访问document.cookie返回键值对组成的字符串，
//不同键值对之间用'; '分隔。通过解析获得需要的值
```

[cookieUtil.js](https://github.com/qiu-deqing/google/blob/master/module/js/cookieUtil.js)：自己写的 cookie 操作工具

### DOM 事件模型是如何的,编写一个 EventUtil 工具类实现事件管理兼容

- DOM 事件包含捕获（capture）和冒泡（bubble）两个阶段：捕获阶段事件从 window 开始触发事件然后通过祖先节点一次传递到触发事件的 DOM 元素上；冒泡阶段事件从初始元素依次向祖先节点传递直到 window
- 标准事件监听 elem.addEventListener(type, handler, capture)/elem.removeEventListener(type, handler, capture)：handler 接收保存事件信息的 event 对象作为参数，event.target 为触发事件的对象，handler 调用上下文 this 为绑定监听器的对象，event.preventDefault()取消事件默认行为，event.stopPropagation()/event.stopImmediatePropagation()取消事件传递
- 老版本 IE 事件监听 elem.attachEvent('on'+type, handler)/elem.detachEvent('on'+type, handler)：handler 不接收 event 作为参数，事件信息保存在 window.event 中，触发事件的对象为 event.srcElement，handler 执行上下文 this 为 window 使用闭包中调用 handler.call(elem, event)可模仿标准模型，然后返回闭包，保证了监听器的移除。event.returnValue 为 false 时取消事件默认行为，event.cancleBubble 为 true 时取消时间传播
- 通常利用事件冒泡机制托管事件处理程序提高程序性能。

```
/**
 * 跨浏览器事件处理工具。只支持冒泡。不支持捕获
 * @author  (qiu_deqing@126.com)
 */

var EventUtil = {
    getEvent: function (event) {
        return event || window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    // 返回注册成功的监听器，IE中需要使用返回值来移除监听器
    on: function (elem, type, handler) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handler, false);
            return handler;
        } else if (elem.attachEvent) {
            var wrapper = function () {
              var event = window.event;
              event.target = event.srcElement;
              handler.call(elem, event);
            };
            elem.attachEvent('on' + type, wrapper);
            return wrapper;
        }
    },
    off: function (elem, type, handler) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handler, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, handler);
        }
    },
    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else if ('returnValue' in event) {
            event.returnValue = false;
        }
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else if ('cancelBubble' in event) {
            event.cancelBubble = true;
        }
    },
    /**
     * keypress事件跨浏览器获取输入字符
     * 某些浏览器在一些特殊键上也触发keypress，此时返回null
     **/
     getChar: function (event) {
        if (event.which == null) {
            return String.fromCharCode(event.keyCode);  // IE
        }
        else if (event.which != 0 && event.charCode != 0) {
            return String.fromCharCode(event.which);    // the rest
        }
        else {
            return null;    // special key
        }
     }
};
```

### 评价一下三种方法实现继承的优缺点,并改进

```
function Shape() {}

function Rect() {}

// 方法1
Rect.prototype = new Shape();

// 方法2
Rect.prototype = Shape.prototype;

// 方法3
Rect.prototype = Object.create(Shape.prototype);

Rect.prototype.area = function () {
  // do something
};
```

方法 1：

1. 优点：正确设置原型链实现继承
2. 优点：父类实例属性得到继承，原型链查找效率提高，也能为一些属性提供合理的默认值
3. 缺点：父类实例属性为引用类型时，不恰当地修改会导致所有子类被修改
4. 缺点：创建父类实例作为子类原型时，可能无法确定构造函数需要的合理参数，这样提供的参数继承给子类没有实际意义，当子类需要这些参数时应该在构造函数中进行初始化和设置
5. 总结：继承应该是继承方法而不是属性，为子类设置父类实例属性应该是通过在子类构造函数中调用父类构造函数进行初始化

方法 2：

1. 优点：正确设置原型链实现继承
2. 缺点：父类构造函数原型与子类相同。修改子类原型添加方法会修改父类

方法 3：

1. 优点：正确设置原型链且避免方法 1.2 中的缺点
2. 缺点：ES5 方法需要注意兼容性

改进：

1. 所有三种方法应该在子类构造函数中调用父类构造函数实现实例属性初始化

```
function Rect() {
    Shape.call(this);
}
```

2. 用新创建的对象替代子类默认原型，设置`Rect.prototype.constructor = Rect;`保证一致性
3. 第三种方法的 polyfill：

```
function create(obj) {
    if (Object.create) {
        return Object.create(obj);
    }

    function f() {};
    f.prototype = obj;
    return new f();
}
```

### 拷贝对象

- 浅拷贝： Object.assign
- 深拷贝： JSON.parse(JSON.stringify(obj))

### js 一些小技巧

https://blog.csdn.net/paincupid/article/details/50572053

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys

### js 浮点数运算不精确 如何解决?

### js urldecode https://www.cnblogs.com/z-one/p/6542955.html

### 位运算

### 强制类型转换和 2 种隐式类型转换?

### javascript 的本地对象,内置对象和宿主对象

### 静态属性怎么继承

### 在 Javascript 中什么是伪数组？如何将伪数组转化为标准数组？

答案：

伪数组（类数组）：无法直接调用数组方法或期望 length 属性有什么特殊的行为，但仍可以对真正数组遍历方法来遍历它们。典型的是函数的 argument 参数，还有像调用 getElementsByTagName,document.childNodes 之类的,它们都返回 NodeList 对象都属于伪数组。可以使用 Array.prototype.slice.call(fakeArray)将数组转化为真正的 Array 对象。

假设接第八题题干，我们要给每个 log 方法添加一个"(app)"前缀，比如'hello world!' ->'(app)hello world!'。方法如下：

```js
function log() {
  var args = Array.prototype.slice.call(arguments); //为了使用 unshift 数组方法，将 argument 转化为真正的数组
  args.unshift('(app)');

  console.log.apply(console, args);
}
```

### JavaScript 如何判断一个对象是空的？

- 第一种： `const isEmptyObject = obj => Object.getOwnPropertyNames(obj).length === 0`
- 第二种： `Object.keys(obj).length == 0`

### js 的作用域是什么？作用域是什么时候确定的？
