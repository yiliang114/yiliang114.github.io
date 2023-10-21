---
title: Omi
date: 2020-11-21
draft: true
---

## Omi 是什么？

Omi 是一款跨框架的框架，基于 Web Components 设计，支持 PC Web、移动 H5 和小程序开发。

JSX + Web Components + JSONProxy 响应式的类 React 框架。

使用组件的时候，会先声明一个 Store 实例， 通过 options 中的 use 或者 useSelf 属性，手动挂载依赖收集之后，在 store 值发生改变时，会自动执行组件实例的 update 操作，做到响应式。

### 如何做到跨端的？

1. web Components 是原生的 api， 理论上写的组件库， vue/react/angular 之类的库都能够直接运行。
2. 小程序端主要还是 omi + kbone 来实现，kbone 貌似提供了很多的转义组件，通过 omi 以及其响应式的能力，就能够很好得处理数据状态管理。 自定义标签 + 状态管理。

### 特性

超小的尺寸，7 kb (gzip)

- 局部 CSS，HTML+ Scoped CSS + JS 组成可复用的组件。不用担心组件的 CSS 会污染组件外的，Omi 会帮你处理好一切
- 更自由的更新，每个组件都有 update 方法，自由选择时机进行更新。你也可以和 obajs 或者 mobx 一起使用来实现自动更新
- 模板引擎可替换，开发者可以重写 Omi.template 方法来使用任意模板引擎
- 完全面向对象，函数式和面向对象各有优劣，Omi 使用完全的面向对象的方式来构建 Web 程序
- ES6+ 和 ES5 都可以，Omi 提供了 ES6+ 和 ES5 的两种开发方案。你可以自有选择你喜爱的方式

## Web Components

<!-- https://zhuanlan.zhihu.com/p/97907370 -->

好处： 跨端，内容封闭
坏处： 全局的 css 不受用了

通过使用 Custom Elements 创建内联的 CSS 和 JavaScript 的自定义元素。需要说明的是它不是 React， Vue 或者 Angular 的框架的替代方案，它是一个全新的概念。

### 原生的 API 生命周期

| Lifecycle method | When it gets called                       |
| ---------------- | ----------------------------------------- |
| `install`        | 准备插入到文档                            |
| `installed`      | 插入到文档之后                            |
| `uninstall`      | 从文档中移除                              |
| `beforeUpdate`   | update 之前                               |
| `updated`        | update 之后                               |
| `beforeRender`   | `render()` 之前                           |
| `receiveProps`   | 父元素重新渲染触发，返回 false 可阻止更新 |

### css 处理

<!-- https://www.zhangxinxu.com/wordpress/2021/02/web-components-import-css/ -->
<!-- https://developer.mozilla.org/zh-CN/docs/Web/Web_Components -->

## JSONPatcherProxy

https://github.com/Palindrom/JSONPatcherProxy

监听或代理任意对象的任意变化

## 解决的问题

1. 跨端的问题

## api

### define

### 与 Vue React 有什么不同， 为什么会选用它而不是 Vue 或者 React

### use api ？

### Omi 的原理， Omiv 可以监听数组下标变化的原理

### Shadow DOM

https://aotu.io/notes/2016/06/24/Shadow-DOM/index.html

## Omi + Web Components

https://segmentfault.com/a/1190000017091755?utm_source=tag-newest
http://www.ruanyifeng.com/blog/2019/08/web_components.html

### 跨端的能力是如何实现的？web components
