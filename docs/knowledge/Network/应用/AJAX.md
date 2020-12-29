---
layout: CustomPages
title: AJAX
date: 2020-11-21
aside: false
draft: true
---

### AJAX

`AJAX(Asynchronous Javascript And XML)`= 异步 `JavaScript` + `XML` 。在后台与服务器进行异步数据交换，不用重载整个网页，实现局部刷新。

Ajax 是什么：

1. 通过异步模式，提升了用户体验
2. 优化了浏览器和服务器之间的传输，减少不必要的数据往返，减少了带宽占用
3. Ajax 在客户端运行，承担了一部分本来由服务器承担的工作，减少了大用户量下的服务器负载。

Ajax 的最大的特点：

1. Ajax 可以实现动态不刷新（局部刷新）
2. readyState 属性 状态 有 5 个可取值： 0 = 未初始化，1 = 启动， 2 = 发送，3 = 接收，4 = 完成

Ajax 同步和异步的区别:

1. 同步：提交请求 -> 等待服务器处理 -> 处理完毕返回，这个期间客户端浏览器不能干任何事
2. 异步：请求通过事件触发 -> 服务器处理（这是浏览器仍然可以作其他事情）-> 处理完毕
   ajax.open 方法中，第 3 个参数是设同步或者异步。

Ajax 的缺点：

1. Ajax 不支持浏览器 back 按钮
2. 安全问题 Ajax 暴露了与服务器交互的细节
3. 对搜索引擎的支持比较弱
4. 破坏了程序的异常机制
5. 不容易调试

创建一个 ajax 请求的步骤：

- 创建 XMLHttpRequest 对象， 也就是创建一个异步调用对象
- 建一个新的 HTTP 请求,并指定该 HTTP 请求的方法、URL 及验证信息
- 设置响应 HTTP 请求状态变化的函数
- 发送 HTTP 请求
- 获取异步调用返回的数据

```js
function ajax(url, handler) {
  var xhr;
  xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      handler(xhr.responseXML);
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}
```

- 创建 XMLHttpRequest 对象

```js
if (window.XMLHttpRequest) {
  // Mozilla, Safari, IE7+ ...
  httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) {
  // IE 6 and older
  httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
}
```

- 绑定 onreadystatechange 事件

```js
httpRequest.onreadystatechange = function() {
  // Process the server response here.
};
```

- 向服务器发送请求

```js
httpRequest.open('GET', 'http://www.example.org/some.file', true);
httpRequest.send();
```

完整的例子

```js
function ajax(url, cb) {
  let xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = ActiveXObject('Microsoft.XMLHTTP');
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      cb(xhr.responseText);
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}
```

### 如何创建 Ajax

1. `XMLHttpRequest` 的工作原理
2. 兼容性处理。 `XMLHttpRequest`只有在高级浏览器中才支持。在回答问题时，这个兼容性问题不要忽略。
3. 事件的触发条件
4. 事件的触发顺序。`XMLHttpRequest`有很多触发事件，每个事件是怎么触发的。

### 发送 Ajax 请求的五个步骤（XMLHttpRequest 的工作原理）

1. 创建`XMLHttpRequest` 对象。
2. 使用`open`方法设置请求的参数。`open(method, url, 是否异步)`。
3. 发送请求。
4. 注册事件。 注册`onreadystatechange`事件，状态改变时就会调用。如果要在数据完整请求回来的时候才调用，我们需要手动写一些判断的逻辑。
5. 获取返回的数据，更新 UI。

### Ajax 与 Cookie

- ajax 会自动带上同源的 cookie，不会带上不同源的 cookie
- 可以通过前端设置 withCredentials 为 true， 后端设置 Header 的方式让 ajax 自动带上不同源的 cookie，但是这个属性对同源请求没有任何影响。会被自动忽略。

```js
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://example.com/', true);
xhr.withCredentials = true;
xhr.send(null);
```

#### 创建 Ajax 的过程

1. 创建`XMLHttpRequest`对象,也就是创建一个异步调用对象.
2. 创建一个新的`HTTP`请求,并指定该`HTTP`请求的方法、`URL`及验证信息.
3. 设置响应`HTTP`请求状态变化的函数.
4. 发送`HTTP`请求.
5. 获取异步调用返回的数据.
6. 使用 JavaScript 和 DOM 实现局部刷新.

```js
var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() {
  if ((xmlHttp.readyState === 4) & (xmlHttp.status === 200)) {
  }
};
xmlHttp.open('GET', 'demo.php', 'true');
xmlHttp.send();
```

### httpRequest.readyState 的值

- 0 (未初始化) or (请求还未初始化)
- 1 (正在加载) or (已建立服务器链接)
- 2 (加载成功) or (请求已接受)
- 3 (交互) or (正在处理请求)
- 4 (完成) or (请求已完成并且响应已准备好)

ajax 的 readyState 共有 5 个状态，分别是 0-4，其中每个数字的含义分别是 0 代表还没调用 open 方法，1 代表的是未调用 send 方法，也就是还没发送数据给服务器
2 代表的是还没有接收到响应，3 代表的是开始接收到了部分数据，4 代表的是接收完成，数据可以在客户端使用了。

### 访问服务端返回的数据

- httpRequest.responseText
  - 服务器以文本字符的形式返回
- httpRequest.responseXML
  - 以 XMLDocument 对象方式返回，之后就可以使用 JavaScript 来处理

### Ajax 和 Fetch 区别

ajax 是使用 XMLHttpRequest 对象发起的，但是用起来很麻烦，所以 ES6 新规范就有了 fetch，fetch 发一个请求不用像 ajax 那样写一大堆代码。
使用 fetch 无法取消一个请求，这是因为 fetch 基于 Promise，而 Promise 无法做到这一点。
在默认情况下，fetch 不会接受或者发送 cookies
fetch 没有办法原生监测请求的进度，而 XMLHttpRequest 可以
fetch 只对网络请求报错，对 400，500 都当做成功的请求，需要封装去处理
fetch 由于是 ES6 规范，兼容性上比不上 XMLHttpRequest

#### Fetch API 相对于传统的 Ajax 有哪些改进？

fetch 和 XMLHttpRequest 相比，主要有以下优点:

- 语法简洁，更加语义化
- 基于标准 Promise 实现，支持 async/await
- 同构方便，使用 isomorphic-fetch

Ajax 和 Fetch 区别:

- ajax 是使用 XMLHttpRequest 对象发起的，但是用起来很麻烦，所以 ES6 新规范就有了 fetch，fetch 发一个请求不用像 ajax 那样写一大堆代码。
- 使用 fetch 无法取消一个请求，这是因为 fetch 基于 Promise，而 Promise 无法做到这一点。
- 在默认情况下，fetch 不会接受或者发送 cookies
- fetch 没有办法原生监测请求的进度，而 XMLHttpRequest 可以
- fetch 只对网络请求报错，对 400，500 都当做成功的请求，需要封装去处理
- fetch 由于是 ES6 规范，兼容性上比不上 XMLHttpRequest

### 手写 ajax

```js
var XHR = null;
if (window.XMLHttpRequest) {
  // 非IE内核
  XHR = new XMLHttpRequest();
} else if (window.ActiveXObject) {
  // IE内核,这里早期IE的版本写法不同,具体可以查询下
  XHR = new ActiveXObject('Microsoft.XMLHTTP');
} else {
  XHR = null;
}

if (XHR) {
  XHR.open('GET', 'ajaxServer.action');

  XHR.onreadystatechange = function() {
    // readyState值说明
    // 0,初始化,XHR对象已经创建,还未执行open
    // 1,载入,已经调用open方法,但是还没发送请求
    // 2,载入完成,请求已经发送完成
    // 3,交互,可以接收到部分数据

    // status值说明
    // 200:成功
    // 404:没有发现文件、查询或URl
    // 500:服务器产生内部错误
    if (XHR.readyState == 4 && XHR.status == 200) {
      // 这里可以对返回的内容做处理
      // 一般会返回JSON或XML数据格式
      console.log(XHR.responseText);
      // 主动释放,JS本身也会回收的
      XHR = null;
    }
  };
  XHR.send();
}
```

### form data, x-www-form-urlencoded 以及 raw 格式

1. form-data 形式因为有 boundary 进行隔离，所以既可以上传文件也可以上传键值对，采用了键值对的方式，所以也可以上传多个文件。最后会被转化为一条信息。
2. x-www-form-urlencoded 会将表单中的键值对都转化为以 & 相连的键值对字符串。
3. raw 可以上传任意格式的文本， 如 text xml json 等。 需要注意的是，选择 raw 形式传数据时需要在请求头中携带 Content-Type， 值为 application/json 等。
4. binary
   相当于**Content-Type:application/octet-stream**,从字面意思得知，只可以上传二进制数据，通常用来上传文件，由于没有键值，所以，一次只能上传一个文件。
5. multipart/form-data 与 x-www-form-urlencoded 区别：
   multipart/form-data：既可以上传文件等二进制数据，也可以上传表单键值对，只是最后会转化为一条信息；
   ​ x-www-form-urlencoded：只能上传键值对，并且键值对都是间隔分开的。

#### postman post 的时候 raw 和 x-www-form-urlencoded 的区别

https://blog.csdn.net/wangjun5159/article/details/47781443

### 防止重复发送 Ajax 请求

1. 用户点击之后按钮 disabled;
2. 函数节流
3. abort 掉上一个请求。
