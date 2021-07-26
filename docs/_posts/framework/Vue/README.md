---
title: Vue 问题汇总
date: '2020-10-26'
draft: true
---

### 打开线上 vue 项目的 devtools

步骤如下：

1. 找到 Vue 构造函数如 window.Vue
2. Vue.config.devtools=true
3. **VUE_DEVTOOLS_GLOBAL_HOOK**.emit('init', Vue)

### vue-cli 环境变量

会自动引入 VUE_APP 开头的环境变量， 以及 NODE_ENV 但是需要注意的是，NODE_ENV 如果通过使用 env 之后 build 就不会自动注入设置为 production 了。。。 探究一下

### vue 统一错误处理

### JSX 是什么？ 怎么与 babel 有关系？