---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### vuepress 的使用

1. 同时显示代码和效果的组件
2. 组件中如果有 window 之类的浏览器 API 的话，会编译失败。 通过 import 动态引入组件的方式，解决这个问题。

### Code

VuePress 项目启动和编译打包是执行 `vuepress dev docs` 和 `vuepress build docs` 两个命令。
