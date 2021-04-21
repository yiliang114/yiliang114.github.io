---
title: Omi
date: 2020-11-21
draft: true
---

## Omi 是什么？

Omi 是一款跨框架的框架，基于 Web Components 设计，支持 PC Web、移动 H5 和小程序开发。

<!-- https://github.com/Tencent/omi -->

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

## Omiv

介绍一下 omiv ， 这是一个 Vue 中的一个状态管理工具，目前主要是由我在开发。目前来看，与 Vuex 最大的差别是在可以直接修改 store 中的值，其实我并不是很喜欢 mutation ，尽管配合 mutation 可以使用 devtools ，state 的时间旅行等。

与 Vuex 类似的 api , 会有依赖收集的过程。监听数据的改变，主动去渲染组件。 之所以会叫 omiv 是因为依赖收集的思想是借鉴的 omi ， 依赖收集，需要手动声明 use 或者 useSelf 去注入。

Vuex 为什么需要 mutation action 之类的操作：

1. 时间旅行， devtools
2. 按照规范办事情，开发过程中容易理解，不容易出错。
3. 直接改变数组或者对象，没法直接更新视图。所以要求我们主动在 mutation 中替换整个对象或者数组中的值

omiv 能否解决上面的问题：

1. 可以做到，obaa 可以针对每一次被观察的对象执行回调
2. 不行，就是有时候还蛮方便的。虽然不容易出错，但是增加了很多的麻烦
3. omiv 直接修改数组或者对象可以进行响应式更新。

总结：

1. vuex 很好，代码很优雅，生态也很好
2. 想探索一下是否还有其他解决方案，vue 生态里状态管理，暂时没有其他很好的选择， mobx-vue 了解不多，看 star 的话并不是特别多

vue-omiv-ssr

#### omiv 的定位

0.3 版本升级到 1.0 版本的跨越是因为我引入了 install 函数，并且使用了 mixins 的方式去直接收集 vm.\$options 中 omiv 的字段，原作者大概是因为 api 跨度有点大，直接升级了一个大版本。 但是 install 函数的引入，是为了接近 Vue 的插件生态，所有的 Vue 插件都是通过 Vue.use(Plugin) 的形式去安装，全局注入一个 Vue 对象的。

#### omiv 的理念

vue 的双向数据流 改为了 单向数据流，从组件数据修改 dom 自动更新到数据更新，依赖检测到之后主动去更新 dom 视图。

#### vuex 的缺陷（我认为的）

1. 不能拥有多个 store （module 不算）
2. mutation 太多有点烦

#### omiv 的优点

1. 支持多个 store 注入
2. 不需要 commit , 直接操作 data

#### omiv 的缺陷

1. 依赖收集，目前尚且还需要手动声明 use 和 useSelf。
2. 组件更新机制，有点暴力。
3. 模块化。
4. devtools

## 你做了哪一部分的工作
