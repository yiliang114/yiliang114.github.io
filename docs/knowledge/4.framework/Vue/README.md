---
title: Vue 问题汇总
date: '2020-10-26'
draft: true
---

### Vue 问题汇总

1. 响应式原理
2. vue 生命钩子函数执行分析
3. vue 模板编译、渲染函数原理分析
4. 了解 Vue3 吗，相对于 Vue2 做了哪些优化

### vue 统一错误处理

### 打开线上 vue 项目的 devtools

步骤如下：

1. 找到 Vue 构造函数如 window.Vue
2. Vue.config.devtools=true
3. **VUE_DEVTOOLS_GLOBAL_HOOK**.emit('init', Vue)

### vue style scoped 问题， 模拟的局部作用域是如何实现的

### vue 的 style 标签，webpack 构建之后打包入 js 文件中还是打包成一个 css 文件？
