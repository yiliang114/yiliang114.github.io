---
title: Omi
date: 2020-11-21
draft: true
---

## Omi

- 是什么？ 解决的问题.
- 与 Vue React 有什么不同， 为什么会选用它而不是 Vue 或者 React
- 跨端的能力是如何实现的？
- use api ？
- 你做了哪一部分的工作

### Shadow DOM

https://aotu.io/notes/2016/06/24/Shadow-DOM/index.html

### Omi + Web Components

https://segmentfault.com/a/1190000017091755?utm_source=tag-newest

http://www.ruanyifeng.com/blog/2019/08/web_components.html

### Web Components

好处： 跨端，内容封闭
坏处： 全局的 css 不受用了

### 原生的 API 生命周期

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
