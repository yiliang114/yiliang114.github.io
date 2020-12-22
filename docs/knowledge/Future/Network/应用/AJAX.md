---
layout: CustomPages
title: 应用
date: 2020-11-21
aside: false
draft: true
---

### Ajax

`AJAX(Asynchronous Javascript And XML)`= 异步 `JavaScript` + `XML` 。在后台与服务器进行异步数据交换，不用重载整个网页，实现局部刷新。

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

### Ajax 是什么？Ajax 的交互模型？同步和异步的区别？如何解决跨域问题？

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

### 如何实现 ajax 请求

1.通过实例化一个 XMLHttpRequest 对象得到一个实例，调用实例的 open 方法为这次
ajax 请求设定相应的 http 方法、相应的地址和以及是否异步，当然大多数情况下我们都是选异步，
以异步为例，之后调用 send 方法 ajax 请求，这个方法可以设定需要发送的报文主体，然后通过
监听 readystatechange 事件，通过这个实例的 readyState 属性来判断这个 ajax 请求的状态，其中分为 0,1,2,3,4 这四种
状态，当状态为 4 的时候也就是接收数据完成的时候，这时候可以通过实例的 status 属性判断这个请求是否成功

```js
var xhr = new XMLHttpRequest();
xhr.open('get', 'aabb.php', true);
xhr.send(null);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      console.log(xhr.responseText);
    }
  }
};
```

```js
var request = new XMLHttpRequest(); // 新建 XMLHttpRequest 对象

request.onreadystatechange = function() {
  // 状态发生变化时，函数被回调
  if (request.readyState === 4) {
    // 成功完成
    // 判断响应结果:
    if (request.status === 200) {
      // 成功，通过 responseText 拿到响应的文本:
      return success(request.responseText);
    } else {
      // 失败，根据响应码判断失败原因:
      return fail(request.status);
    }
  } else {
    // HTTP 请求还在继续...
  }
};

// 发送请求:
request.open('GET', '/api/categories');
request.send();

alert('请求已发送，请等待响应...');
```

### ajax 的 readyState 有哪几个状态，含义分别是什么？

ajax 的 readyState 共有 5 个状态，分别是 0-4，其中每个数字的含义分别是 0 代表还没调用 open 方法，1 代表的是未调用 send 方法，也就是还没发送数据给服务器
2 代表的是还没有接收到响应，3 代表的是开始接收到了部分数据，4 代表的是接收完成，数据可以在客户端使用了。

### 手写 ajax，使用 Ajax 都有哪些优劣？

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

## 如何创建 Ajax

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

### 实际开发中用的 原生 Ajax 请求

```js
var util = {};

//获取 ajax 请求之后的json
util.json = function(options) {
  var opt = {
    url: '',
    type: 'get',
    data: {},
    success: function() {},
    error: function() {},
  };
  util.extend(opt, options);
  if (opt.url) {
    //IE兼容性处理：浏览器特征检查。检查该浏览器是否存在XMLHttpRequest这个api，没有的话，就用IE的api
    var xhr = XMLHttpRequest ? new XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP');

    var data = opt.data,
      url = opt.url,
      type = opt.type.toUpperCase();
    dataArr = [];
  }

  for (var key in data) {
    dataArr.push(key + '=' + data[key]);
  }

  if (type === 'GET') {
    url = url + '?' + dataArr.join('&');
    xhr.open(type, url.replace(/\?$/g, ''), true);
    xhr.send();
  }

  if (type === 'POST') {
    xhr.open(type, url, true);
    // 如果想要使用post提交数据,必须添加此行
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(dataArr.join('&'));
  }

  xhr.onload = function() {
    if (xhr.status === 200 || xhr.status === 304) {
      //304表示：用缓存即可。206表示获取媒体资源的前面一部分
      var res;
      if (opt.success && opt.success instanceof Function) {
        res = xhr.responseText;
        if (typeof res === 'string') {
          res = JSON.parse(res); //将字符串转成json
          opt.success.call(xhr, res);
        }
      }
    } else {
      if (opt.error && opt.error instanceof Function) {
        opt.error.call(xhr, res);
      }
    }
  };
};
```

### onreadystatechange 事件

> 注册 `onreadystatechange` 事件后，每当 `readyState` 属性改变时，就会调用 `onreadystatechange` 函数。

> `readyState`：（存有 `XMLHttpRequest` 的状态。从 `0` 到 `4` 发生变化）

- `0`: 请求未初始化
- `1`: 服务器连接已建立
- `2`: 请求已接收
- `3`: 请求处理中
- `4`: 请求已完成，且响应已就绪

### 事件的触发条件

![](http://img.smyhvae.com/20180307_1443.png)

### 事件的触发顺序

![](http://img.smyhvae.com/20180307_1445.png)

### form data, x-www-form-urlencoded 以及 raw 格式

1. form-data 形式因为有 boundary 进行隔离，所以既可以上传文件也可以上传键值对，采用了键值对的方式，所以也可以上传多个文件。最后会被转化为一条信息。
2. x-www-form-urlencoded 会将表单中的键值对都转化为以 & 相连的键值对字符串。
3. raw 可以上传任意格式的文本， 如 text xml json 等。 需要注意的是，选择 raw 形式传数据时需要在请求头中携带 Content-Type， 值为 application/json 等。
4. binary
   相当于**Content-Type:application/octet-stream**,从字面意思得知，只可以上传二进制数据，通常用来上传文件，由于没有键值，所以，一次只能上传一个文件。
5. multipart/form-data 与 x-www-form-urlencoded 区别：
   multipart/form-data：既可以上传文件等二进制数据，也可以上传表单键值对，只是最后会转化为一条信息；
   ​ x-www-form-urlencoded：只能上传键值对，并且键值对都是间隔分开的。

### 手写原生 ajax

简单 GET 请求

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

POST 请求则需要设置`RequestHeader`告诉后台传递内容的编码方式以及在 send 方法里传入对应的值

```js
xhr.open('POST', url, true);
xhr.setRequestHeader(('Content-Type': 'application/x-www-form-urlencoded'));
xhr.send('key1=value1&key2=value2');
```

### 介绍 Ajax

原理：
Ajax 的原理简单来说是在用户和服务器之间加了—个中间层(AJAX 引擎)，通过 XmlHttpRequest 对象来向服务器发异步请求，从服务器获得数据，然后用 javascript 来操作 DOM 而更新页面。使用户操作与服务器响应异步化。这其中最关键的一步就是从服务器获得请求数据
Ajax 的过程只涉及 JavaScript、XMLHttpRequest 和 DOM。XMLHttpRequest 是 ajax 的核心机制

// 1. 创建连接

```js
var xhr = null;
xhr = new XMLHttpRequest();
// 2. 连接服务器
xhr.open('get', url, true);
// 3. 发送请求
xhr.send(null);
// 4. 接受请求
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      success(xhr.responseText);
    } else {
      // fail
      fail && fail(xhr.status);
    }
  }
};
```

优点:

- 通过异步模式，提升了用户体验.
- 优化了浏览器和服务器之间的传输，减少不必要的数据往返，减少了带宽占用.
- Ajax 在客户端运行，承担了一部分本来由服务器承担的工作，减少了大用户量下的服务器负载。
- Ajax 可以实现动态不刷新（局部刷新）
  缺点：
- 安全问题 AJAX 暴露了与服务器交互的细节。
- 对搜索引擎的支持比较弱。
- 不容易调试。

### 防止重复发送 Ajax 请求

1. 用户点击之后按钮 disabled;
2. 函数节流
3. abort 掉上一个请求。

### Fetch API 相对于传统的 Ajax 有哪些改进？

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

### JS 异步解决方案的发展历程以及优缺点

1. 回调函数
   缺点：回调地狱，嵌套过多影响代码结构不能用 try catch 捕获错误，不能 return，缺乏顺序性 和可信任性
   优点：解决了同步的问题
1. promise
   缺点：无法取消 Promise ，错误需要通过回调函数来捕获
   优点：解决了回调的回调地狱，多重嵌套，promise 采用链式调用，可以利用 try,catch 捕获错误
1. generator
   优点：可以控制函数的执行，可以配合 co 函数库使用
1. Async/Await
   优点： 代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题
   缺点： await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低。

```js
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch('XXX1');
  await fetch('XXX2');
  await fetch('XXX3');
}
```

### 异步编程的实现方式？

回调函数

优点：简单、容易理解
缺点：不利于维护，代码耦合高
事件监听(采用时间驱动模式，取决于某个事件是否发生)：

优点：容易理解，可以绑定多个事件，每个事件可以指定多个回调函数
缺点：事件驱动型，流程不够清晰
发布/订阅(观察者模式)

类似于事件监听，但是可以通过‘消息中心’，了解现在有多少发布者，多少订阅者
Promise 对象

优点：可以利用 then 方法，进行链式写法；可以书写错误时的回调函数；
缺点：编写和理解，相对比较难
Generator 函数

优点：函数体内外的数据交换、错误处理机制
缺点：流程管理不方便
async 函数

优点：内置执行器、更好的语义、更广的适用性、返回的是 Promise、结构清晰。
缺点：错误处理机制

### ajax 求时,如何解释 json 数据

### 什么是 Ajax 和 JSON，它们的优缺点。

Ajax 是异步 JavaScript 和 XML，用于在 Web 页面中实现异步数据交互。

优点：

可以使得页面不重载全部内容的情况下加载局部内容，降低数据传输量
避免用户不断刷新或者跳转页面，提高用户体验
缺点：

对搜索引擎不友好（
要实现 ajax 下的前后退功能成本较大
可能造成请求数的增加
跨域问题限制
JSON 是一种轻量级的数据交换格式，ECMA 的一个子集

优点：轻量级、易于人的阅读和编写，便于机器（JavaScript）解析，支持复合数据类型（数组、对象、字符串、数字）

### 讲解原生 Js 实现 ajax 的原理。

Ajax 的全称是 Asynchronous JavaScript and XML，其中，Asynchronous 是异步的意思，它有别于传统 web 开发中采用的同步的方式。

Ajax 的原理简单来说通过 XmlHttpRequest 对象来向服务器发异步请求，从服务器获得数据，然后用 javascript 来操作 DOM 而更新页面。

XMLHttpRequest 是 ajax 的核心机制，它是在 IE5 中首先引入的，是一种支持异步请求的技术。简单的说，也就是 javascript 可以及时向服务器提出请求和处理响应，而不阻塞用户。达到无刷新的效果。

XMLHttpRequest 这个对象的属性有：

onreadystatechang 每次状态改变所触发事件的事件处理程序。
responseText 从服务器进程返回数据的字符串形式。
responseXML 从服务器进程返回的 DOM 兼容的文档数据对象。
status 从服务器返回的数字代码，比如常见的 404（未找到）和 200（已就绪）
status Text 伴随状态码的字符串信息
readyState 对象状态值
0 (未初始化) 对象已建立，但是尚未初始化（尚未调用 open 方法）
1 (初始化) 对象已建立，尚未调用 send 方法

2 (发送数据) send 方法已调用，但是当前的状态及 http 头未知

3 (数据传送中) 已接收部分数据，因为响应及 http 头不全，这时通过 responseBody 和 responseText 获取部分数据会出现错误，

4 (完成) 数据接收完毕,此时可以通过通过 responseXml 和 responseText 获取完整的回应数据

下面简单封装一个函数：（略长，点击打开）

View Code
上述代码大致表述了 ajax 的过程，释义自行 google，问题未完，那么知道什么是 Jsonp 和 pjax 吗？

答案：

Jsonp：(JSON with Padding)是一种跨域请求方式。主要原理是利用了 script 标签可以跨域请求的特点，由其 src 属性发送请求到服务器，服务器返回 js 代码，网页端接受响应，然后就直接执行了，这和通过 script 标签引用外部文件的原理是一样的。JSONP 由两部分组成：回调函数和数据，回调函数一般是由网页端控制，作为参数发往服务器端，服务器端把该函数和数据拼成字符串返回。

pjax：pjax 是一种基于 ajax+history.pushState 的新技术，该技术可以无刷新改变页面的内容，并且可以改变页面的 URL。（关键点：可以实现 ajax 无法实现的后退功能）pjax 是 ajax+pushState 的封装，同时支持本地存储、动画等多种功能。目前支持 jquery、qwrap、kissy 等多种版本。

### ajax 中有 3 个请求，如何顺序实现这 3 个请求？

### XMLHttpRequest 通用属性和方法

1. readyState:表示请求状态的整数，取值：

- UNSENT（0）：对象已创建
- OPENED（1）：open()成功调用，在这个状态下，可以为 xhr 设置请求头，或者使用 send()发送请求
- HEADERS_RECEIVED(2)：所有重定向已经自动完成访问，并且最终响应的 HTTP 头已经收到
- LOADING(3)：响应体正在接收
- DONE(4)：数据传输完成或者传输产生错误

1. onreadystatechange：readyState 改变时调用的函数
1. status：服务器返回的 HTTP 状态码（如，200， 404）
1. statusText:服务器返回的 HTTP 状态信息（如，OK，No Content）
1. responseText:作为字符串形式的来自服务器的完整响应
1. responseXML: Document 对象，表示服务器的响应解析成的 XML 文档
1. abort():取消异步 HTTP 请求
1. getAllResponseHeaders(): 返回一个字符串，包含响应中服务器发送的全部 HTTP 报头。每个报头都是一个用冒号分隔开的名/值对，并且使用一个回车换行来分隔报头行
1. getResponseHeader(headerName):返回 headName 对应的报头值
1. open(method, url, asynchronous [, user, password]):初始化准备发送到服务器上的请求。11.method 是 HTTP 方法，不区分大小写；url 是请求发送的相对或绝对 URL；asynchronous 表示请求是否异步；user 和 password 提供身份验证
1. setRequestHeader(name, value):设置 HTTP 报头
1. send(body):对服务器请求进行初始化。参数 body 包含请求的主体部分，对于 POST 请求为键值对字符串；对于 GET 请求，为 null

### 一个 XMLHttpRequest 实例有多少种状态？

### 其他

- 手写一个 xhr 请求函数， 其中的一些状态码

- fiddler charles 代理原理 proxyTable 的代理原理
- ajax 请求如何跨域携带 cookie ? 需要添加什么字段 ？

* 平时是如何写 ajax 请求的？
  - axios ？
  - ajax 其他相关的东西

- options 请求的作用，什么情况下会出现 options 请求， 以及如何解决或者取消 ？
  axios post 请求跨域会变成 options https://laravel-china.org/topics/6321/the-problem-of-sending-post-requests-to-options-when-axios-cross-domain-is-solved, 解决方法是 降级为简单请求。

* axios 封装
  token 携带： https://www.imooc.com/article/27751
  https://www.jb51.net/article/109444.htm

### 发送相关

Post 一个 file 的时候 file 放在哪的？
音频、视频 的流式请求需要如何进行处理？

- postman post 的时候 raw 和 x-www-form-urlencoded 的区别
  https://blog.csdn.net/wangjun5159/article/details/47781443

### axios post 请求的几种方式

https://segmentfault.com/a/1190000015261229?utm_source=tag-newest
