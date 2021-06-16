---
title: 'Vue.js 3.0 的变化'
date: '2020-08-17'
tags:
  - vue 3
  - vue
---

### 快速体验 Composition API

#### vs. Options APIs

如下图所示：

![image.png](https://s0.lgstatic.com/i/image/M00/01/FD/CgqCHl6v6kKAEB86AANiAJDnjVQ357.png)

Vue.js 3.0 核⼼优势：

- 没有 this，没烦恼；
- 更好的类型推导能⼒（`TypeScript`）；
- 更友好的 `Tree-shaking` ⽀持（渐进式体验）；
- 更⼤的代码压缩空间；
- 更灵活的逻辑复⽤能⼒。

#### 逻辑复用案例

对于逻辑复用这块我们可以通过几个小案例来体会一下。

**案例一、常用功能性状态复用：**

![](https://s0.lgstatic.com/i/image/M00/01/FD/CgqCHl6v6kyASlkDAAENklOYlj0705.png)

**案例二、获取数据逻辑复用：**

![](https://s0.lgstatic.com/i/image/M00/01/FD/CgqCHl6v6mOAcMILAAD_9U0vYHo031.png)

**案例三、BOM API 封装：**

![](https://s0.lgstatic.com/i/image/M00/01/FD/Ciqc1F6v6myAQliaAAHwBa16R38975.png)

### 基于 Webpack 构建

由于 Vue CLI 自身还没有很好的支持 Vue.js 3.0 版本，所以对于 3.0 项目的构建，我们还是需要直接使用 Webpack 构建。这里我们分享一个基于 Webpack 构建 Vue.js 3.0 的基本操作。

以下是具体命令行操作：

![4](https://s0.lgstatic.com/i/image/M00/01/FD/Ciqc1F6v6nWAX5aTAANGepPtsvc770.png)

项目结构设计如下：

```
└─ vue-next-sample ····························· project root
   ├─ public ··································· static dir
   │  └─ index.html ···························· index template
   ├─ src ······································ source dir
   │  ├─ App.vue ······························· root component (sfc)
   │  └─ main.js ······························· app entry
   ├─ package.json ····························· package file
   └─ webpack.config.js ························ webpack config
```

其中 Webpack 的核心配置如下：

![](https://s0.lgstatic.com/i/image/M00/01/FD/CgqCHl6v6oGAeKLEAANJ8E2ZEDA820.png)

### 基于 Vue CLI experimental

Vue CLI 对 Vue.js 3.0 的支持目前是以一个[插件（vue\-cli\-plugin\-vue\-next）](https://github.com/vuejs/vue-cli-plugin-vue-next)的形式实现的，目前属于实验阶段（experimental）。

具体使用方法如下：

![](https://s0.lgstatic.com/i/image/M00/01/FD/CgqCHl6v6omAOOrAAAIRJLu2wak852.png)

这里你需要注意，千万不要在成熟项⽬中使⽤这个插件直接升级项目，这会导致很多问题，后面 Vue 官方会给出 2.x 项目升级到 3.0 的迁移工具，到时候再视情况决定是否使用。

### 结合 Official Libraries

最后这一块内容是关于官方的几个库的最新版本，以及如何去结合 Vue.js 3.0 使用：

#### Vue Router

[`vue-router`](https://github.com/vuejs/vue-router-next) 一直以来是使用 Vue.js 开发 SPA 类型应用必不可少的，针对 3.0，`vue-router` 也有一些调整。

注册（定义）路由的用法：

![](https://s0.lgstatic.com/i/image/M00/01/FD/Ciqc1F6v6pKAaRIRAAHzDZjGLng133.png)

组件中获取当前路由信息的方法：

![](https://s0.lgstatic.com/i/image/M00/01/FD/CgqCHl6v6p2AG_EpAAEJL03CUDk536.png)

#### Vuex

对于 [`Vuex`](https://github.com/vuejs/vuex/tree/4.0)，API 改动是最小的，基本上没有什么变化。

创建 Store 的方法：

![](https://s0.lgstatic.com/i/image/M00/01/FD/Ciqc1F6v6qeAJtdfAAFPEAP3Tos147.png)

组件中使用 Store 的方式一（跟 2.x 一样）：

![](https://s0.lgstatic.com/i/image/M00/01/FD/CgqCHl6v6q6Af8R9AAFcCB1sJGY955.png)

方式二，使用 useStore API（推荐）：

![](https://s0.lgstatic.com/i/image/M00/01/FD/Ciqc1F6v6raAHqIEAAJm6pO4Vnw344.png)

除此之外，Vue.js 官方还给出了目前官方的一些周边库的状态，下表为：Official Libraries Vue 3.0 Support Status

| Project               | Status                                                                                                                                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vue\-router           | Alpha [\[Proposed RFCs\]](https://github.com/vuejs/rfcs/pulls?q=is%3Apr+is%3Aopen+label%3Arouter) [\[GitHub\]](https://github.com/vuejs/vue-router-next) [\[npm\]](https://unpkg.com/browse/vue-router@4.0.0-alpha.7/) |
| vuex                  | Alpha, with same API [\[GitHub\]](https://github.com/vuejs/vuex/tree/4.0) [\[npm\]](https://unpkg.com/browse/vuex@4.0.0-alpha.1/)                                                                                      |
| vue\-class\-component | Alpha [\[GitHub\]](https://github.com/vuejs/vue-class-component/tree/next) [\[npm\]](https://unpkg.com/browse/vue-class-component@8.0.0-alpha.2/)                                                                      |
| vue\-cli              | Experimental support via vue\-cli\-plugin\-vue\-next                                                                                                                                                                   |
| eslint\-plugin\-vue   | Alpha [\[GitHub\]](https://github.com/vuejs/eslint-plugin-vue) [\[npm\]](https://unpkg.com/browse/eslint-plugin-vue@7.0.0-alpha.0/)                                                                                    |
| vue\-test\-utils      | Pre\-alpha [\[GitHub\]](https://github.com/vuejs/vue-test-utils-next) [\[npm\]](https://www.npmjs.com/package/@vue/test-utils)                                                                                         |
| vue\-devtools         | WIP                                                                                                                                                                                                                    |
| jsx                   | WIP                                                                                                                                                                                                                    |
