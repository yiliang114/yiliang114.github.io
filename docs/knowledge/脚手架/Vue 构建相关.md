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
