---
layout: CustomPages
title: Network
date: 2020-11-21
aside: false
draft: true
---

# http 头部信息

每一个 http 请求和响应都会带有响应的头部信息，XHR 对象提供了操作请求头部和响应头部信息的方法。

默认情况下，发送 ajax 请求时，还会发送下列头部信息：

- Accept: 浏览器能够显示的字符集
- Accept-Charset: 浏览器能够显示的字符集
- Accpet-Encoding: 浏览器能够处理的压缩编码
- Accept-Language: 浏览器当前设置的语言
- Connection: 浏览器与服务器之间的连接类型（keep-alive）
- Cookie: 当前页面设置的任何 cookie
- Host: 发出请求的页面所在域
- Referer: 发出请求的页面的 URL
- User-Agent: 浏览器的用户代理字段（跟 window.navigator.userAgent 值是一样的）
- :method: http 请求方法类型 GET/POST...

不同的浏览器实际发送的头部内容会有所不同，但是上面列出的信息基本上所有的浏览器都是会发送的。

原生操作 http 请求头部的方法：

- .setRequestHeader("name","value")
- .getResponseHeader('name')
- .getAllResponseHeaders()

特殊的一些头部字段：

- x-requested-with: 用来判断一个请求时传统的 http 请求还是 ajax 请求。XMLHttpRequest 表示 ajax 请求，例如 axios 中将全局的请求都声明为 ajax 请求。

事实上在服务端判断 request 来自 ajax 请求（异步）还是传统请求（同步）是通过判断请求中是否带有`x-requested-with` 属性，并且其值是否是`XMLHttpRequest`。 如果 request.getHeader("X-Requested-With") 的值为 XMLHttpRequest，则为 Ajax 异步请求。为 null，则为传统同步请求。

## http 普通请求和 ajax 请求

ajax 的请求，在请求头中多了一个“**X-Requested-With**”属性。

而通过浏览器的 url 请求，则没有这个“**X-Requested-With**”属性。

我一直以为通过浏览器的 url 请求就是 ajax 的 GET 请求，两者原理上是一样的？？？

两者本质区别是：

- Ajax （Asynchronous JavaScript and XML） 通过 XMLHttpRequest 对象请求服务器，服务器接收请求后返回数据，页面接收到数据之后实现局部刷新。
- 普通 http 请求通过 httpRequest 对象请求服务器，服务器接收请求之后返回数据，需要页面刷新？？？

跨域的时候，ajax 请求 “**X-Requested-With**”属性会丢失。

## 问题

nodejs 后台的网络请求模块是 httpRequest 对象发出的，这个难道是 同步的请求？

页面端的数据请求采用的是 XHR，是异步的。

在页面端的 http 普通请求，例如： 浏览器访问一个 url，网页加载 js,css,img 等静态资源都是；那么，是不是 ssr 的页面是没有 ajax 请求的？ 直接是 nodejs 等后台直接通过 httpRequest 获取到数据，渲染好之后再吐出来 html 等静态资源？？？

网页中请求数据可能会遇到一个跨域的问题，但是我理解应该只是局限于 ajax 请求才会存在这个问题。体现在网页请求接口存在跨域，但是 postman 或者直接使用 nodejs 的 http 发起请求是不会存在跨域问题的。而本质上，ajax 是一个 XMLHttpRequest 对象，而 http 请求本质上是 httpRequest 对象发起的。那么是不是可以推导出，在 java 后台中使用发起 http 请求（httpRequest）是不存在跨域问题的呢？

我理解的 http 请求是包含 ajax 请求的，然后用的比较多的 ajax 请求的场景就是 请求 api，用的比较多的 http 请求的场景比如说 浏览器访问一个 url 地址，或者 img 标签之类的，或者请求 js css 资源应该都算。但是该如何解释使用 axios 等库发起请求时 不设置 X-Requested-With 属性，请求也能异步且成功呢？我查看到的资料来看，axios 没有对请求头中的 X-Requested-With 做默认处理，在 chrome 开发者工具中的 network 中的 xhr 下，确实也能找到请求头中不含 X-Requested-With 的一个请求，结果也正常了。那就不明白这个区别到底在哪里了？？？

![img](https://reactchina.sxlcdn.com/uploads/default/original/2X/d/df46d1bc674f83a697fcb156c30a3a479621557e.jpeg)

![img](https://reactchina.sxlcdn.com/uploads/default/original/2X/c/c65f5adfdde3fe9e1057fb4e93bb269872ba72a2.jpeg)

#### axios 发两次请求

此时的请求头中配置了 X-Requested-With: XMLHttpRequest 表示了这是一个 ajax 请求，接着遇到了发出两次请求的现象。

https://segmentfault.com/q/1010000011677457/a-1020000011680121

跨域请求之前首先要发送 options 请求，询问服务器是否有权限访问，如果可以，则再进行下一步。

解释： http://www.ruanyifeng.com/blog/2016/04/cors.html

但是其实这个还是有点疑惑的？ 为什么 axios 在这里就会跨域了呢？ 为什么之前直接请求就不会请求两次，而且没有 options 这样的一个请求。

## 论点： 没有必要手动设置 X-Requested-With: XMLHttpRequest

- ajax 的回调来局部更新网页，axios fetch 之类的库能够通过 promise 或者 await 之类的方式拿到数据结果之后再局部更新

- vue 双向绑定，react 的 re-render 本身就能够直接局部更新网页

- ajax 默认是异步请求，而简单的 http 请求时同步的？ 如果需要同时并发异步请求并且确实能够实现的话，那么 ajax 确实应该存在，并且 axios 是需要手动设置 X-Requested-With: XMLHttpRequest ；如果不是的话，感觉没什么必要。
