---
title: XSS 跨站脚本攻击
date: 2020-11-21
draft: true
---

# XSS 跨站脚本攻击

XSS ( Cross Site Scripting ) 是指恶意攻击者利用网站没有对用户提交数据进行转义处理或者过滤不足的缺点，进而添加一些代码，嵌入到 web 页面中去。使别的用户访问都会执行相应的嵌入代码，从而盗取用户资料、利用用户身份进行某种动作或者对访问者进行病毒侵害的一种攻击方式。

## XSS 攻击的危害

- 盗用`Cookie`
- 破坏页面的正常结构，插入广告等恶意内容

## 类型

`XSS`攻击的核心原理是：不需要做任何的登录认证，它会通过合法的操作（比如在`url`中输入、在评论框中输入），向你的页面注入脚本（可能是`js`、`html`代码块等）。

### 1. 反射型

发出请求时，`XSS`代码出现在`url`中，作为输入提交到服务器端，服务器端解析后响应，`XSS`代码随响应内容一起传回给浏览器，最后浏览器解析执行`XSS`代码。这个过程像一次反射，所以叫反射型`XSS`。

**举个例子**

一个链接，里面的 query 字段中包含一个 script 标签，这个标签的 src 就是恶意代码，用户点击了这个链接后会先向服务器发送请求，服务器返回时也携带了这个 XSS 代码，然后浏览器将查询的结果写入 Html，这时恶意代码就被执行了。

并不是在 url 中没有包含 script 标签的网址都是安全的，可以使用[短网址](dwz.com)来让网址变得很短。

### 2. 存储型

存储型`XSS`和反射型`XSS`的差别在于，提交的代码会存储在服务器端（数据库、内存、文件系统等），下次请求时目标页面时不用再提交 XSS 代码。

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

## XSS 防御

对于 XSS 攻击来说，通常有两种方式可以用来防御。

- 转义字符(encode)
- CSP 内容安全策略
- 设置 Cookie 为 HttpOnly

### 转义字符

- 普通的输入 - 编码

  - 对用户输入数据进行 HTML Entity 编码（使用转义字符）
  - "
  - &
  - <
  - \>
  - 空格
  - < 转义为 \&lt;
  - > 转义为 \&gt;

- 富文本 - 过滤（黑名单、白名单）

  - 移除上传的 DOM 属性，如 onerror 等
  - 移除用户上传的 style 节点、script 节点、iframe 节点等

- 较正
  - 避免直接对 HTML Entity 解码
  - 使用 DOM Parse 转换，校正不配对的 DOM 标签和属性

### CSP

> 内容安全策略 ([CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP)) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/XSS)) 和数据注入攻击等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。

我们可以通过 CSP 来尽量减少 XSS 攻击。CSP 本质上也是建立白名单，规定了浏览器只能够执行特定来源的代码。

通常可以通过 HTTP Header 中的 `Content-Security-Policy` 来开启 CSP

- 只允许加载本站资源

  ```http
  Content-Security-Policy: default-src 'self'
  ```

- 只允许加载 HTTPS 协议图片

  ```http
  Content-Security-Policy: img-src https://*
  ```

- 允许加载任何来源框架

  ```http
  Content-Security-Policy: child-src 'none'
  ```

### 设置 Cookie 为 HttpOnly

设置了 HttpOnly 的 Cookie 可以防止 JavaScript 脚本调用，就无法通过 document.cookie 获取用户 Cookie 信息。

## 防御方法举例

- 使用 encodeURIComponent 对 url 中的参数进行编码(反射型 xss)，对一些关键字和特殊字符进行过滤(<>,?,script 等)，或对用户输入内容进行 URL 编码(encodeURIComponent);
- Cookie 不要存放用户名和密码，对 cookie 信息进行 MD5 等算法散列存放，必要时可以将 IP 和 cookie 绑定;
- 对用户的输入进行过滤(适用于所有类型的 xss 攻击)
- 对用户的输入使用 innerText 或者 textContent 进行设置，而不是使用 innerHTML 或者 outerHTML 进行设置
- 服务器端设置 cookie 为 httpOnly 让前端无法通过 js 获取到用户的 cookie
- 关键请求使用验证码，比如转账请求，避免恶意脚本发送这些关键请求
