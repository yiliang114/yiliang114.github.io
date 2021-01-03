---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 什么是 WebKit

WebKit 是一个开源的浏览器内核，由渲染引擎(WebCore)和 JS 解释引擎(JSCore)组成

通常所说的 WebKit 指的是 WebKit(WebCore)，主要工作是进行 HTML/CSS 渲染。WebKit 一直是 Safari 和 Chrome(之前) 使用的浏览器内核，后来 Chrome 改用 Blink 内核。

### 介绍一下你对浏览器内核的理解？

主要分成两部分：渲染引擎(layout engineer 或 Rendering Engine)和 JS 引擎。

- 渲染引擎：负责取得网页的内容（HTML、XML、图像等等）、整理讯息（例如加入 CSS 等），以及计算网页的显示方式，然后会输出至显示器或打印机。浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不相同。所有网页浏览器、电子邮件客户端以及其它需要编辑、显示网络内容的应用程序都需要内核
- JS 引擎则：解析和执行 javascript 来实现网页的动态效果

最开始渲染引擎和 JS 引擎并没有区分的很明确，后来 JS 引擎越来越独立，内核就倾向于只指渲染引擎。

### 功能检测（feature detection）、功能推断（feature inference）和使用 UA 字符串之间有什么区别？

**功能检测（feature detection）**

功能检测包括确定浏览器是否支持某段代码，以及是否运行不同的代码（取决于它是否执行），以便浏览器始终能够正常运行代码功能，而不会在某些浏览器中出现崩溃和错误。例如：

```js
if ('geolocation' in navigator) {
  // 可以使用 navigator.geolocation
} else {
  // 处理 navigator.geolocation 功能缺失
}
```

**功能推断（feature inference）**

功能推断与功能检测一样，会对功能可用性进行检查，但是在判断通过后，还会使用其他功能，因为它假设其他功能也可用，例如：

```js
// 通过判断 getElementsByTagName 存在，来推断 getElementById 这个 api 也可用
if (document.getElementsByTagName) {
  element = document.getElementById(id);
}
```

非常不推荐这种方式。功能检测更能保证万无一失。

**UA 字符串**

这是一个浏览器报告的字符串，可以通过`navigator.userAgent`访问。可以识别请求用户代理的应用类型、操作系统、应用供应商和应用版本 但是这个字符串很难解析并且很可能存在欺骗性。不要使用这种方式。

#### 如何获取 UA

```js
const { appName, appVersion, appCodeName, userAgent } = window.navigator;
```

#### 检测浏览器版本版本有哪些方式？

- 根据 navigator.userAgent // UA.toLowerCase().indexOf('chrome')
- 根据 window 对象的成员 // 'ActiveXObject' in window

#### 请指出浏览器特性检测，特性推断和浏览器 UA 字符串嗅探的区别

- 特性检测：为特定浏览器的特性进行测试，并仅当特性存在时即可应用特性。
- User-Agent 检测：最早的浏览器嗅探即用户代理检测，服务端（以及后来的客户端）根据 UA 字符串屏蔽某些特定的浏览器查看网站内容。
- 特性推断：尝试使用多个特性但仅验证了其中之一。根据一个特性的存在推断另一个特性是否存在。问题是，推断是假设并非事实，而且可能导致可维护性的问题。

### 如何判断浏览器类型？

```js
var userAgent = navigator.userAgent; // 取得浏览器的 userAgent 字符串
var isOpera = userAgent.indexOf('Opera') > -1;
//判断是否Opera浏览器
if (isOpera) {
  return 'Opera';
}
//判断是否Firefox浏览器
if (userAgent.indexOf('Firefox') > -1) {
  return 'FF';
}
//判断是否chorme浏览器
if (userAgent.indexOf('Chrome') > -1) {
  return 'Chrome';
}
//判断是否Safari浏览器
if (userAgent.indexOf('Safari') > -1) {
  return 'Safari';
}
//判断是否IE浏览器
if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
  return 'IE';
}
//判断是否Edge浏览器
if (userAgent.indexOf('Trident') > -1) {
  return 'Edge';
}
```

### 获取 URL 中参数值（QueryString）的 4 种方法

```js
// 这个默认值，所以只能从浏览器中获取
function getParamFromUrl(name, url = window.location.href) {
  if (!name) return;
  //  new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  // 区别在于，多加了一个头部和尾部
  const regex = new RegExp(name + '=([^&]*)', 'i');
  const [, result] = url.match(regex) || [];
  return result;
}

const url = 'http://baidu.com/group/show/305819#_Toc484527154';
console.log('getParamFromUrl', getParamFromUrl('kmref', url));
console.log('getParamFromUrl', getParamFromUrl('from_page', url));
console.log('getParamFromUrl', getParamFromUrl('1221', url));
console.log('getParamFromUrl', getParamFromUrl('1221'));

function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  // 哈希值的部分就不占用了
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

console.log('getParamFromUrl', getParamFromUrl('from_page', url + '#'));
```

#### 正则法

```js
function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}
// 这样调用：
alert(GetQueryString('参数名1'));
alert(GetQueryString('参数名2'));
alert(GetQueryString('参数名3'));
```

```js
new RegExp(pattern, attributes);
```

attributes 的属性列举：

- i 执行对大小写不敏感的匹配。
- g 执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）。
- m 执行多行匹配。

#### split 拆分法

```js
function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf('?') != -1) {
    var str = url.substr(1);
    strs = str.split('&');
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
    }
  }
  return theRequest;
}
var Request = new Object();
Request = GetRequest();
// var 参数1,参数2,参数3,参数N;
// 参数1 = Request['参数1'];
// 参数2 = Request['参数2'];
// 参数3 = Request['参数3'];
// 参数N = Request['参数N'];
```

#### 又见正则

通过 JS 获取 url 参数，这个经常用到。比如说一个 url：[http://wwww.jb51.net/?q=js,我们想得到参数 q 的值，那可以通过以下函数调用即可](http://wwww.jb51.net/?q=js,%E6%88%91%E4%BB%AC%E6%83%B3%E5%BE%97%E5%88%B0%E5%8F%82%E6%95%B0q%E7%9A%84%E5%80%BC%EF%BC%8C%E9%82%A3%E5%8F%AF%E4%BB%A5%E9%80%9A%E8%BF%87%E4%BB%A5%E4%B8%8B%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E5%8D%B3%E5%8F%AF)

```js
function GetQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
  var context = '';
  if (r != null) context = r[2];
  reg = null;
  r = null;
  return context == null || context == '' || context == 'undefined' ? '' : context;
}
alert(GetQueryString('q'));
```

#### 单个参数的获取方法

```js
function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  if (url.indexOf('?') != -1) {
    //判断是否有参数
    var str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
    strs = str.split('='); //用等号进行分隔 （因为知道只有一个参数 所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
    alert(strs[1]); //直接弹出第一个参数 （如果有多个参数 还要进行循环的）
  }
}
```

### 你做的页面在哪些流览器测试过？这些浏览器的内核分别是什么?

IE: trident 内核
Firefox：gecko 内核
Safari:webkit 内核
Opera:以前是 presto 内核，Opera 现已改用 Google Chrome 的 Blink 内核
Chrome:Blink(基于 webkit，Google 与 Opera Software 共同开发)
对于 Android 手机而言，使用率最高的就是 Webkit 内核。
