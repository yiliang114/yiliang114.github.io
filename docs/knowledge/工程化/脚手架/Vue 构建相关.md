---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### vue 统一错误处理

### vue webpack style 标签中处理 background-img 路径

https://blog.csdn.net/ddwddw4/article/details/82384397

### 怎么快速定位哪个组件出现性能问题

> 用 timeline 工具。 大意是通过 timeline 来查看每个函数的调用时常，定位出哪个函数的问题，从而能判断哪个组件出了问题

#### 打开线上 vue 项目的 devtools

步骤如下：

1. 找到 Vue 构造函数如 window.Vue
2. Vue.config.devtools=true
3. **VUE_DEVTOOLS_GLOBAL_HOOK**.emit('init', Vue)

### webpack 如何编译 vue 文件的 vue-loader ？ 还是 vue 编译器？

### 巨简单的 js 切分： Vue code split

https://blog.csdn.net/meishuixingdeququ/article/details/79393757

vue 全家桶 webpack 插件

- postcss
- build 压缩 js
- 分析 bundlejs
- 去除 console

### vue loader 的工作原理

### vue style scoped 问题， 模拟的局部作用域是如何实现的

### vue 的 style 标签，webpack 构建之后打包入 js 文件中还是打包成一个 css 文件？

### Vue-cli@3.x nginx 部署

由于我之前在工作中一直使用的 vue-cli@2.x 很久都没有更新，便刻意在新的项目中使用了 vue-cli@3.x，由于 vue-cli@3.x 的配置、项目结构的组织都有了一定程度的改变，决定记录一下便于以后自己查阅。

https://www.jb51.net/article/144049.htm

- vue config 打包是的配置
- nginx 如何配置
- https://segmentfault.com/a/1190000015428921 可用！！！
- vue-router history 模式 static 访问： https://www.cnblogs.com/xyyt/p/7718867.html
- linkActiveClass
- input v-model 的简写 不是直接 :value ？
- vue input 的键盘事件 https://blog.csdn.net/kuangshp128/article/details/78159562?locationNum=6&fps=1
- 通过 sync 实现数据双向绑定， 从而同步父子组件数据 https://www.cnblogs.com/penghuwan/p/7473375.html
- vue 的 input 实现监听可以使用 watch 来监听，也可以同时使用 v-model 和 @input 来实现， @input 之后的是 v-model 的监听事件

### vue-router

对于 vue 项目的路由，在 vue-cli@2.x 的时候，一般会默认为是 `Hash` 路由，也就是在路由中会带上一个 `#`。 不过为了 url 稍微好看一点，会将 `vue-router` 设置为 `history` 模式，可能还会加上 `base` ，即路由的前缀。示例：

```js
export default new Router({
  base: '/management/',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'admin-index',
      component: AdminIndex,
    },
  ],
});
```

当然，以我目前的使用习惯来说，`base` 带不带与 nginx 的 `location`配置有着比较密切的关系。

我先说不需要添加 `base` 的场景。

##### nginx 配置

如果你看过[vue-router h5 history](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90) 的话，一般你会对于

- Vue-cli3 webpack 配置
  https://blog.csdn.net/weixin_36065510/article/details/83989408

### vue-cli@3 中引用图片路径的问题

http://www.cnblogs.com/cckui/p/10315204.html

### vue-cli 如何新增自定义指令？

1. 创建局部指令

```js
var app = new Vue({
  el: '#app',
  data: {},
  // 创建指令(可以多个)
  directives: {
    // 指令名称
    dir1: {
      inserted(el) {
        // 指令中第一个参数是当前使用指令的 DOM
        console.log(el);
        console.log(arguments);
        // 对 DOM 进行操作
        el.style.width = '200px';
        el.style.height = '200px';
        el.style.background = '#000';
      },
    },
  },
});
```

2. 全局指令

```js
Vue.directive('dir2', {
  inserted(el) {
    console.log(el);
  },
});
```

3. 指令的使用

```html
<div id="app">
  <div v-dir1></div>
  <div v-dir2></div>
</div>
```

### Vue-cli@3 中 element 按需加载：

https://www.cnblogs.com/MrZouJian/p/8601416.html

### vue-cli 为什么 less scss 不需要额外在配置 webpack 的 rules 了？webpack 中的 generateLoader

- https://segmentfault.com/a/1190000010276830
- https://blog.csdn.net/zmhawk/article/details/75209161
- https://www.cnblogs.com/rainheader/p/6505366.html

### vue-cli webpack，提取 css

https://segmentfault.com/q/1010000015318571/a-1020000015323830

### vue-cli 打包 js 压缩代码

https://www.cnblogs.com/lafitewu/p/8309305.html

### vue loader 的实现原理，如何仿造一个 loader

### css less sass loader ？ style loader 的作用？

### vue-cli

vue-cli
​webpack
​vue-loader
​babel-loader
​css/less/scss/style-loader
​plugin: postcss/ uglify 等
​vue
​vuex
​vue-router
​
实现自定义保存
​nuxt

1. 路由分割、图片、数据懒加载
2. 数据日志、error、埋点上报
3. 日志可视化

### vue-cli 中自定义指令的使用

### vue-cli 开发环境使用全局常量

### vue-cli 生产环境使用全局常量

### vue-cli 提供的几种脚手架模板

### vue-cli 工程升级 vue 版本

### vue 打包后会生成哪些文件？

### 如何配置 vue 打包生成文件的路径？
