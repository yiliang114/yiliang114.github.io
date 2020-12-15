---
layout: CustomPages
title: 技术驱动
date: 2020-11-21
aside: false
draft: true
---

### 组件

- 容器组件 (class)
- 展示组件 (state less)

### 路由

- 显示声明（文件形式）
- options:
  - 是否路由懒加载（code splitting）
  - 单页、多页、pwa

### 状态管理

#### mobx:

- 全局公用状态： store => props

- 局部私有状态： react state

### 插件

- data mock

- proxy api

- eslint

- 单元测试

- 强制文件目录校验，强制的函数写法。

### 预设

- babel
- 组件库

其实想了想 mobx 也没什么东西能够再封装了。 Redux-Saga 中的 Effects 对应 mobx 普通的 action， 异步操作可以配合 runInAction 使用 await 或者 promise 回调。

### Todo

- mobx 似乎之前有多次渲染的问题。

- set store 和 get store 不同步。尝试弄一下 promise。类似 redux 中的 set store
