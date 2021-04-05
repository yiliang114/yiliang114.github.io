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
5. vue 框架的整个周期，比如 vue 的初始化，发生了什么？vue 的模板解析，是如何进行的？如何形成 AST？render 函数的生成？什么是依赖收集？什么是 patch？数据更新策略等等。
6. 混入 mixins、\$options，vuex、router 他们各自如何通过这些 api，实现各自的功能？

### vue 统一错误处理

### 打开线上 vue 项目的 devtools

步骤如下：

1. 找到 Vue 构造函数如 window.Vue
2. Vue.config.devtools=true
3. **VUE_DEVTOOLS_GLOBAL_HOOK**.emit('init', Vue)

### vue-cli 环境变量

会自动引入 VUE_APP 开头的环境变量， 以及 NODE_ENV 但是需要注意的是，NODE_ENV 如果通过使用 env 之后 build 就不会自动注入设置为 production 了。。。 探究一下

### vue 渲染大量数据时应该怎么优化？

Object.freeze 冻结对象，不让 vue 劫持. 以及使用 虚拟列表

### ssr

- ssr 是在什么场景下做的。
- 双端怎么做同构？区别在哪里？
