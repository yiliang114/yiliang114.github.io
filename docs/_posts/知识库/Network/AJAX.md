---
title: AJAX
date: 2020-11-21
draft: true
---

## AJAX

`AJAX(Asynchronous Javascript And XML)`= 异步 `JavaScript` + `XML` 。

### 发送 ajax 请求的步骤

1. 创建`XMLHttpRequest` 对象。`XMLHttpRequest`只有在高级浏览器中才支持。在回答问题时，这个兼容性问题不要忽略。
2. 使用`open`方法设置请求的参数。`open(method, url, 是否异步)`。
3. 注册事件。 注册`onreadystatechange`事件，状态改变时就会调用。如果要在数据完整请求回来的时候才调用，我们需要手动写一些判断的逻辑。
4. 发送请求。
5. 获取返回的数据。

```js
var XHR = null;
if (window.XMLHttpRequest) {
  // 非 IE 内核
  XHR = new XMLHttpRequest();
} else if (window.ActiveXObject) {
  // IE内核,这里早期IE的版本写法不同,具体可以查询下
  XHR = new ActiveXObject('Microsoft.XMLHTTP');
} else {
  XHR = null;
}

if (XHR) {
  // open(method, url, 是否异步)
  XHR.open('GET', 'ajaxServer.action');
  XHR.onreadystatechange = function() {
    // readyState值说明
    // 0: 初始化, XHR对象已经创建, 还未执行 open
    // 1: 已建立服务器连接, 但是还没发送请求（send 方法）
    // 2: 请求已接受，还没有接收到响应
    // 3: 正在处理请求，开始接收到了部分数据
    // 4: 请求已完成并且响应已准备好

    // status值说明
    // 200: 成功
    // 404: not find
    // 500: 服务器产生内部错误
    if (XHR.readyState == 4 && XHR.status == 200) {
      // 这里可以对返回的内容做处理
      // 一般会返回 JSON 或 XML 数据格式
      console.log(XHR.responseText);
      // 主动释放, JS 本身也会回收的
      XHR = null;
    }
  };
  // 发送请求
  XHR.send();
}
```

### 防止重复发送 ajax 请求

1. 用户点击之后按钮 disabled;
2. 函数节流
3. abort 掉上一个请求。

### http 普通请求和 ajax 请求

ajax 的请求，在请求头中多了一个“**X-Requested-With**”属性。跨域的时候，ajax 请求 “**X-Requested-With**”属性会丢失。

### ajax 与 Cookie

- ajax 会自动带上同源的 cookie，不会带上不同源的 cookie
- 可以通过前端设置 withCredentials 为 true， 后端设置 Header 的方式让 ajax 自动带上不同源的 cookie，但是这个属性对同源请求没有任何影响。会被自动忽略。

### ajax 和 Fetch 区别

- XMLHttpRequest 使用麻烦，fetch API 简单
- fetch 由于是 ES6 规范，兼容性上比不上 XMLHttpRequest
- 因为 fetch 基于 Promise，所以 fetch 无法取消一个请求，Promise 无法取消一个请求。
- fetch 没有办法原生监测请求的进度，而 XMLHttpRequest 可以
- fetch 只对网络请求报错，对 400，500 都当做成功的请求，需要封装去处理

Fetch 优点：

- 语法简洁，更加语义化
- 基于标准 Promise 实现，支持 async/await
- 同构方便，使用 isomorphic-fetch
