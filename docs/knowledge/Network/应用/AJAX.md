---
title: AJAX
date: 2020-11-21
draft: true
---

### AJAX

`AJAX(Asynchronous Javascript And XML)`= 异步 `JavaScript` + `XML` 。

创建一个 ajax 请求的步骤：

- 创建 XMLHttpRequest 对象， 也就是创建一个异步调用对象
- 建一个新的 HTTP 请求,并指定该 HTTP 请求的方法、URL 及验证信息
- 设置响应 HTTP 请求状态变化的函数
- 发送 HTTP 请求
- 获取异步调用返回的数据

```js
function ajax(url, cb) {
  let xhr;
  // 创建 XMLHttpRequest 对象
  if (window.XMLHttpRequest) {
    // `XMLHttpRequest`只有在高级浏览器中才支持
    xhr = new XMLHttpRequest();
  } else {
    xhr = ActiveXObject('Microsoft.XMLHTTP');
  }
  // 绑定 onreadystatechange 事件
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      //  获取异步调用返回的数据
      cb(xhr.responseText);
    }
  };
  // 向服务器发送请求
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

### httpRequest.readyState 的值

- 0 (未初始化) or (请求还未初始化)
- 1 (正在加载) or (已建立服务器链接)
- 2 (加载成功) or (请求已接受)
- 3 (交互) or (正在处理请求)
- 4 (完成) or (请求已完成并且响应已准备好)

ajax 的 readyState 共有 5 个状态，分别是 0-4，其中每个数字的含义分别是 0 代表还没调用 open 方法，1 代表的是未调用 send 方法，也就是还没发送数据给服务器
2 代表的是还没有接收到响应，3 代表的是开始接收到了部分数据，4 代表的是接收完成，数据可以在客户端使用了。

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

### 使用 Promise 封装一个 AJAX

```js
const ajax = obj => {
  return new Promise((resolve, reject) => {
    let method = obj.method || 'GET';

    // 创建 xhr
    let xhr;
    if (window.XMLHTTPRequest) {
      xhr = new XMLHTTPRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // 超时
    xhr.ontimeout = function() {
      reject({
        errorType: 'timeout_error',
        xhr: xhr,
      });
    };
    // 报错
    xhr.onerror = function() {
      reject({
        errorType: 'onerror',
        xhr: xhr,
      });
    };
    // 监听 statuschange
    xhr.onreadystatechange = function() {
      if (xhr.readState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          resolve(xhr.responseText);
        } else {
          reject({
            errorType: 'onerror',
            xhr: xhr,
          });
        }
      }
    };

    // 发送请求
    if (method === 'POST') {
      xhr.open('POST', obj.url, true);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(JSON.parse(obj.data));
    } else {
      let query = '';
      for (let key in obj.data) {
        query += `&${encodeURIComponent(key)}=${encodeURIComponent(obj.data[key])}`;
      }
      // The substring() method returns the part of the string between the start and end indexes, or to the end of the string.
      query.substring(1);
      xhr.open('GET', obj.url, +'?' + query, true);
      xhr.send();
    }
  });
};
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

### POST 提交数据的方式

服务端通常是根据请求头（headers）中的 Content-Type 字段来获知请求中的消息主体是用何种方式编码，再对主体进行解析。所以说到 POST 提交数据方案，包含了 Content-Type 和消息主体编码方式两部分。下面就正式开始介绍它们：

- `application/x-www-form-urlencoded`

这是最常见的 POST 数据提交方式。浏览器的原生 `<form>` 表单，如果不设置 enctype 属性，那么最终就会以 `application/x-www-form-urlencoded` 方式提交数据。上个小节当中的例子便是使用了这种提交方式。可以看到 body 当中的内容和 GET 请求是完全相同的。

- `multipart/form-data`

这又是一个常见的 POST 数据提交的方式。我们使用表单上传文件时，必须让 `<form>` 表单的 enctype 等于 `multipart/form-data`。直接来看一个请求示例：

    POST http://www.example.com HTTP/1.1
    Content-Type:multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA

    ------WebKitFormBoundaryrGKCBY7qhFd3TrwA
    Content-Disposition: form-data; name="text"

    title
    ------WebKitFormBoundaryrGKCBY7qhFd3TrwA
    Content-Disposition: form-data; name="file"; filename="chrome.png"
    Content-Type: image/png

    PNG ... content of chrome.png ...
    ------WebKitFormBoundaryrGKCBY7qhFd3TrwA--

这个例子稍微复杂点。首先生成了一个 boundary 用于分割不同的字段，为了避免与正文内容重复，boundary 很长很复杂。然后 `Content-Type` 里指明了数据是以 `multipart/form-data` 来编码，本次请求的 boundary 是什么内容。消息主体里按照字段个数又分为多个结构类似的部分，每部分都是以 --boundary 开始，紧接着是内容描述信息，然后是回车，最后是字段具体内容（文本或二进制）。如果传输的是文件，还要包含文件名和文件类型信息。消息主体最后以 --boundary-- 标示结束。关于 `multipart/form-data` 的详细定义，请前往 [RFC1867](http://www.ietf.org/rfc/rfc1867.txt) 查看（或者相对友好一点的 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)）。

这种方式一般用来上传文件，各大服务端语言对它也有着良好的支持。

上面提到的这两种 POST 数据的方式，都是浏览器原生支持的，而且现阶段标准中原生 `<form>` 表单也只支持这两种方式（通过 `<form>` 元素的 enctype 属性指定，默认为 `application/x-www-form-urlencoded`。其实 enctype 还支持 text/plain，不过用得非常少）。

随着越来越多的 Web 站点，尤其是 WebApp，全部使用 Ajax 进行数据交互之后，我们完全可以定义新的数据提交方式，例如 `application/json`，`text/xml`，乃至 `application/x-protobuf` 这种二进制格式，只要服务器可以根据 `Content-Type` 和 `Content-Encoding` 正确地解析出请求，都是没有问题的。

#### postman post 的时候 raw 和 x-www-form-urlencoded 的区别

https://blog.csdn.net/wangjun5159/article/details/47781443

### 防止重复发送 Ajax 请求

1. 用户点击之后按钮 disabled;
2. 函数节流
3. abort 掉上一个请求。

### http 普通请求和 ajax 请求

ajax 的请求，在请求头中多了一个“**X-Requested-With**”属性。

而通过浏览器的 url 请求，则没有这个“**X-Requested-With**”属性。

我一直以为通过浏览器的 url 请求就是 ajax 的 GET 请求，两者原理上是一样的？？？

两者本质区别是：

- Ajax （Asynchronous JavaScript and XML） 通过 XMLHttpRequest 对象请求服务器，服务器接收请求后返回数据，页面接收到数据之后实现局部刷新。
- 普通 http 请求通过 httpRequest 对象请求服务器，服务器接收请求之后返回数据，需要页面刷新？？？

跨域的时候，ajax 请求 “**X-Requested-With**”属性会丢失。
