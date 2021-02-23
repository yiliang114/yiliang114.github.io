---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### vue 统一错误处理

#### 打开线上 vue 项目的 devtools

步骤如下：

1. 找到 Vue 构造函数如 window.Vue
2. Vue.config.devtools=true
3. **VUE_DEVTOOLS_GLOBAL_HOOK**.emit('init', Vue)

### 巨简单的 js 切分： Vue code split

https://blog.csdn.net/meishuixingdeququ/article/details/79393757

vue 全家桶 webpack 插件

- postcss
- build 压缩 js
- 分析 bundlejs
- 去除 console

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

### Vue-cli@3 中 element 按需加载：

https://www.cnblogs.com/MrZouJian/p/8601416.html

### vue-cli 为什么 less scss 不需要额外在配置 webpack 的 rules 了？webpack 中的 generateLoader

- https://segmentfault.com/a/1190000010276830
- https://blog.csdn.net/zmhawk/article/details/75209161
- https://www.cnblogs.com/rainheader/p/6505366.html
