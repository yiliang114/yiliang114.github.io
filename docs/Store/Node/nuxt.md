---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

## nuxtjs

- 安装 postcss 插件 以及 sass 插件（预处理器）

  ```
  npm install --save-dev node-sass sass-loader
  npm install --save-dev postcss-nested postcss-responsive-type postcss-hexrgba
  npm i less less-loader --save--dev
  ```

- rem 单位，是相对于 html 的根元素的字体大小的倍数。只要调整 html 的根元素字体的大小就能够对布局进行等比例缩放，从而做到自适应。https://www.cnblogs.com/dannyxie/p/6640903.html

https://github.com/code-tribe/nuxt-netlify-cms-starter

vuepress

有关 markdown 的处理。

https://app.netlify.com/teams/yiliang114/sites

## Nuxtjs

Nuxt.js 就是一个利用 Vue, webpack 和 Node.js 帮我们简单方便实现 SSR 的框架。

SSR 是 Server Side Render 的缩写，即服务器端渲染。在没有 SPA 之前，绝大多数的网页都是通过服务器渲染生成的：用户向服务器发送请求，服务器获取请求，然后再查询数据库，根据查询的数据动态的生成一张网页，最后将网页内容返回给浏览器端。

拿 Vue 来说，Vue.js 运行在浏览器中。发送一个请求，然后获得了后台返回的数据，最后通过 Vue.js 将数据渲染成需要的 HTML 片段。而 SSR 把将组件渲染成 HTML 这个工作拿到 Node 上来执行，在 Node 中我们将组件都渲染好，然后将渲染好的 HTML 直接发送给浏览器（客户端），这就是 Vue SSR。

SPA 因为内容是通过 Ajax 获取的，所以就有一个天然的缺陷，就是搜索引擎没法获取里面的内容。右键查看一个 SPA 网页的源代码，你会发现你里面几乎没什么内容。对于像博客，新闻这样的网站，这一点是不可接受的。

总结一下，SSR 带来的好处就是能够 SEO，顺便因为内容在服务器端已经渲染好了，还能够减少请求数量，对于一些比较老旧的浏览器（不支持 Vue.js），也能看到基础的内容。

### asyncData func

因为其实整个 html 结构都是 node 吐出来的，所以在 node 环境（服务端）如果要获取数据，为了保证渲染 nuxt 之前就已经获取到了需要的数据，Nuxt.js 添加了`asyncData`方法使得你能够在渲染组件之前异步获取数据。

不知道这里的 `asyncData` 函数，是不是通过封装 `mounted` 生命周期函数实现的？

`asyncData`方法会在组件（**限于页面组件**）每次加载之前被调用。它可以在服务端或路由更新之前被调用。

由于`asyncData`方法是在组件 **初始化** 前被调用的，所以在方法内是没有办法通过 `this` 来引用组件的实例对象。参数是一个 上下文对象 context。

context 主要包含：

- route
- store
- params route.params 的别名
- query route.query 的别名
- req
- res
- ...

```js
export default {
  data() {
    return { project: 'default' };
  },
  async asyncData({ req, error }) {
    const page = 0;
    let [pageRes, countRes] = await Promise.all([
      axios.get(`/api/post/page/${page}?scope=published`),
      axios.get('/api/post/count/published'),
    ]);
    return {
      posts: pageRes.data.list,
      count: countRes.data.result,
    };
  },
};
```

### 中间件

中间件允许开发者自定义一段函数在一个组件或者页面在渲染之前执行。每一个中间件应放置在 middleware/ 目录。文件名的名称将成为中间件名称(middleware/auth.js 将成为 auth 中间件)。

#### nuxtjs

- 安装 postcss 插件 以及 sass 插件（预处理器）

```
npm install --save-dev node-sass sass-loader
npm install --save-dev postcss-nested postcss-responsive-type postcss-hexrgba
npm i less less-loader --save--dev
```
