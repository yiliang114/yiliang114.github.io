---
layout: CustomPages
title: monitoring
date: 2020-11-21
aside: false
draft: true
---

### 在 js 中怎么捕获异常？写出来看看？应该在哪些场景下采用呢？

```js
try {
    ...
    throw ...
    ...
} catch (err) {
    ...
} finally {
    ...
}
```

通过 throw 语句抛出错误；理论上可以抛一切值，但实际上建议只抛 Error 对象；
try 块内 throw 的错误会导致停止执行，并将抛出的对象传给 catch 块；
从 ES2017 开始，如果不需要获取抛出的对象，则 catch 块 可以直接写为 catch { ... }
catch 块一般用于对错误进行处理；
finally 块中的语句不论是否抛出错误，都会执行。
该在什么场景下用？所有你不想让用户接手的错误处理都应该用。

通常在以下几点使用：

复杂逻辑代码库
发起 ajax、fetch 的时候
判断是否支持默写浏览器特性

```js
async function requestData() {
  try {
    if (this.loading) return
    this.loading = true
    await api.getData()
    ...
  } catch (err) {
    console.error(err)
  } finally {
    this.loading = false
  }
}
```

<http://km.oa.com/articles/show/240099?kmref=search&from_page=1&no=3>

### 前端监控

<http://tapd.oa.com/QCloud_2015/markdown_wikis/view/#1010103951008119219>

### 前端性能

<http://www.cnblogs.com/sunshq/p/5312231.html>

<https://www.cnblogs.com/libin-1/p/6501951.html>

1. boss 系统上报接收数据后台
2. 前端监控 emonitor （告警）

## 监控

对于代码运行错误，通常的办法是使用 `window.onerror` 拦截报错。该方法能拦截到大部分的详细报错信息，但是也有例外

- 对于跨域的代码运行错误会显示 `Script error.` 对于这种情况我们需要给 `script` 标签添加 `crossorigin` 属性
- 对于某些浏览器可能不会显示调用栈信息，这种情况可以通过 `arguments.callee.caller` 来做栈递归

对于异步代码来说，可以使用 `catch` 的方式捕获错误。比如 `Promise` 可以直接使用 `catch` 函数，`async await` 可以使用 `try catch`

但是要注意线上运行的代码都是压缩过的，需要在打包时生成 sourceMap 文件便于 debug。

对于捕获的错误需要上传给服务器，通常可以通过 `img` 标签的 `src` 发起一个请求。

### 监控设计

如何计算白屏时间和首屏渲染时间的，如何进行数据上报的，上报到监控系统展示是怎样的一个过程

### 监控问题

- 白屏时间和首屏时间的计算
- 性能监控平台是如何捕获错误的

### 前端如何做性能监控、异常监控？

性能监控，异常监控，基本在小公司，是没有实践基础的，可是在差不多的大厂中，他们会关注这个问题。
首先是性能监控，应该从这么几个维度来说：一个是 http 的方面，在后端 log 日志，流入 kafka，然后在 kafka 消费数据，可以准确的监控到哪些接口有异常？异常率是多少？
另一个方面，是前端的 Performance 的 api，在用户的实时使用的过程中，就会产生数据，这样就能实现页面性能监控。
前端异常监控，首先要明白什么是异常，html、css 这些东西，无非就是一个展示的问题，还不至于让页面白屏的事情发生，所谓的异常监控，其实就是 js 的异常监控。在前端领域，window.onerror 是进行 js 异常的监听事件。并且要知道，它在 IE 中，是不支持的，所以 IE 的监控，要使用 try catch 的方式进行捕获，比如我们可能还要注意到，遇到异步的时候，这个如何做 try catch 的异常捕获。
最后一个是前端 sdk 埋点，直接开发一个 js 文件，统计用户的 UV/PV 分析等等，比如用户的转化率之类的，这一块个人没有什么特别的实践，各位可以在网上百度看看。
