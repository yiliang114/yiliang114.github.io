---
title: SSR
date: '2020-10-26'
draft: true
---

# SSR

## SSR 和 客户端渲染有什么区别

### 服务端渲染 VS 预渲染（Prerendering）

如果你调研服务器端渲染(SSR)只是用来改善少数营销页面（例如 `/`, `/about`, `/contact` 等）的 SEO，那么你可能需要**预渲染**。无需使用 web 服务器实时动态编译 HTML，而是使用预渲染方式，在构建时(build time)简单地生成针对特定路由的静态 HTML 文件。优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点。

### 为什么使用服务端渲染（ssr）

与传统 SPA 相比，服务端渲染的（ssr）的优势主要在于：

- 更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。
- 更快的内容到达时间。无需等待所有的 Javascript 都下载完成并执行。

使用 SSR 时还需要有一些权衡之处：

- 开发条件所限。浏览器的特定代码，只能在某些生命周期钩子函数中使用；一些外部扩展库可能需要特殊处理，才能在服务器渲染应用程序中运行。
- 涉及构建设置和部署的更多需求，服务端渲染应用程序，需要处于 Nodejs server 运行环境。
- 更多的服务器端负载。

## 用 SSR 遇到过什么难题

### SSR 怎么保证客户端和服务端的数据同步

## 实现 Vue SSR

![](http://7xq6al.com1.z0.glb.clouddn.com/vue-ssr.jpg)

**其基本实现原理**

- app.js 作为客户端与服务端的公用入口，导出 Vue 根实例，供客户端 entry 与服务端 entry 使用。客户端 entry 主要作用挂载到 DOM 上，服务端 entry 除了创建和返回实例，还进行路由匹配与数据预获取。
- webpack 为客服端打包一个 Client Bundle ，为服务端打包一个 Server Bundle 。
- 服务器接收请求时，会根据 url，加载相应组件，获取和解析异步数据，创建一个读取 Server Bundle 的 BundleRenderer，然后生成 html 发送给客户端。
- 客户端混合，客户端收到从服务端传来的 DOM 与自己的生成的 DOM 进行对比，把不相同的 DOM 激活，使其可以能够响应后续变化，这个过程称为客户端激活 。为确保混合成功，客户端与服务器端需要共享同一套数据。在服务端，可以在渲染之前获取数据，填充到 stroe 里，这样，在客户端挂载到 DOM 之前，可以直接从 store 里取数据。首屏的动态数据通过 `window.__INITIAL_STATE__`发送到客户端

> Vue SSR 的实现，主要就是把 Vue 的组件输出成一个完整 HTML, vue-server-renderer 就是干这事的

- `Vue SSR`需要做的事多点（输出完整 HTML），除了`complier -> vnode`，还需如数据获取填充至 HTML、客户端混合（hydration）、缓存等等。
  相比于其他模板引擎（ejs, jade 等），最终要实现的目的是一样的，性能上可能要差点

### vue-server-render

### ssr 的一些框架

- https://github.com/fmfe/genesis
- nuxt

### 区别

- `vue-server-renderer` 服务端渲染，一般 vue 的 ssr 都是通过它来完成的
- vuepress 是预渲染，

### demo

https://www.jianshu.com/p/c6a07755b08d
https://github.com/wmui/vue-ssr-demo/blob/master/package.json

## Vue SSR 有什么特点？

1. 前后端公用一套模板引擎
2. SPA 的优秀用户体验
3. SEO 的支持
4. 首屏渲染速度

但是也有美中不足
关键问题一：稳定性（问题分析，异常容灾）
关键问题二：性能（Vnode 慢，HTTP 慢）
关键问题三：差异（DOM、BOM、Cookie、API）
关键问题四：上手难度（Vue 全家桶、Nodejs 基础）

### 关键问题一：稳定性

SSR 生命周期出现异常怎么办？

1. 使用 lodash 处理接口判空
2. 使用 errorHandler 函数捕获接口异常
3. 捕获整个 Vue 生命周期异常
4. PM2、监控、日志管理
5. 异常熔断、自动降级（从 SSR 链接跳转到 SPA）
6. 可控全局降级，应对突发大流量

### 关键问题二：性能

页面请求 waiting 时间过长？

1. 静态页面应用长缓存
2. 针对未登陆用户应用短缓存
3. TCP 长连接优化
4. 服务端请求走内网
5. 优化异步任务流程

### 关键问题三：差异

SSR 与 CSR 环境差异怎么处理？

1. 封装接口，统一接口调用规范
2. Cookie 的统一处理
3. 组件库、插件、工具函数的兼容
4. 通过 URL 参数降级，方便查看接口调用

### 关键问题四：上手难度

毫无 Vue SSR 开发经验如何快速上手？

1. 强大的 asyncData 函数，脱离 vuex
2. 规范制定（context, errorHandler）
3. 维护开发文档
4. 沟通交流，技术分享

### 规划

1. 架构分离（npm 包，配置化，cli）
2. 可靠性优化（单元测试，内存泄漏检测）
3. HTTP 优化（更优的服务端通信方式）

## 前后端同构（微医）

结合了 SSR 和 CSR ，公用一套模板引擎。

https://zdk.f2er.net/wx/detail/5dc344ebdad4401af3f21ba5

https://www.infoq.cn/article/qlewqsit7oshkugw18e5

优雅降级的配置

https://zhuanlan.zhihu.com/p/266199299

Nginx 相关配置

```
upstream static_env {
  server x.x.x.x:port1; //html静态文件服务器
}
upstream nodejs_env {
  server x.x.x.x:port2; //node渲染服务器
}

server {
  listen 80;
  server_name xxx;
  ... // 其他配置
  location ^~ /zyindex/ {
    proxy_pass http://static_env; //将非ssr目录的请求转发到静态HTML文件服务器
  }
  location ^~ /zyindex/ssr/ {
    proxy_pass http://nodejs_env; //将ssr目录的请求转发node渲染服务器
    proxy_intercept_errors on; // 开启拦截响应状态码
    error_page 403 404 408 500 501 502 503 504 = 200 @static_page; // 若响应异常,将这些异常状态码改为200响应，并指向下面的新规则@static_page
  }
  location @static_page {
    rewrite_log on;
    error_log logs/rewrite.log notice;
    rewrite /zyindex/ssr/(.*)$ /zyindex/$1 last; // 去掉ssr目录后重新定向地址，将请求Node渲染服务器转发到静态HTML文件服务器
  }
}
```

## Genesis

https://fmfe.github.io/genesis-docs/guide/

### ssr

https://www.infoq.cn/article/qlewqsit7oshkugw18e5

### vue ssr + 大型项目目录

ssr 是什么？
ssr 如何做；
改造你 vue 项目进行 ssr；

缓存架构；
vue 一些底层 API 的运用；
vue 插件的开发；

Axios 源码分析；
大型项目中的 API 层；
二次封装 Axios 实例；
