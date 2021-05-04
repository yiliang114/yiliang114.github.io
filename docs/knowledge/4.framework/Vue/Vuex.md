---
title: Vuex
date: '2020-10-26'
draft: true
---

### Vuex 底层实现

vuex 仅仅是作为 vue 的一个插件而存在，不像 Redux,MobX 等库可以应用于所有框架，vuex 只能使用在 vue 上，很大的程度是因为其高度依赖于 vue 的 computed 依赖检测系统以及其插件系统，vuex 整体思想诞生于 flux,可其的实现方式完完全全的使用了 vue 自身的响应式设计，依赖监听、依赖收集都属于 vue 对对象 Property set get 方法的代理劫持。最后一句话结束 vuex 工作原理，vuex 中的 store 本质就是没有 template 的隐藏着的 vue 组件；

vuex 的原理其实非常简单，它为什么能实现所有的组件共享同一份数据？
因为 vuex 生成了一个 store 实例，并且把这个实例挂在了所有的组件上，所有的组件引用的都是同一个 store 实例。
store 实例上有数据，有方法，方法改变的都是 store 实例上的数据。由于其他组件引用的是同样的实例，所以一个组件改变了 store 上的数据， 导致另一个组件上的数据也会改变，就像是一个对象的引用。

#### vuex 的原理 ？对 vuex 的理解

vuex 只能使用在 vue 上，很大的程度是因为其高度依赖于 vue 的 computed 依赖检测系统以及其插件系统。其的实现方式完完全全的使用了 vue 自身的响应式设计，依赖监听、依赖收集都属于 vue 对对象 Property set get 方法的代理劫持。

vuex 中的 store 本质就是没有 template 的隐藏着的 vue 组件。

vuex 生成了一个 store 实例，并且把这个实例挂在了所有的组件上，所有的组件引用的都是同一个 store 实例。由于其他组件引用的是同样的实例，所以一个组件改变了 store 上的数据， 导致另一个组件上的数据也会改变，就像是一个对象的引用。

### vuex 是什么？怎么使用？哪种功能场景使用它？

只用来读取的状态集中放在 store 中；getters 类似 vue 的计算属性，主要用来计算缓存一些数据； 改变状态的方式是提交 mutations，这是个同步的事物； 异步逻辑应该封装在 action 中，dispatch 来分发 action。

### vuex 的原理 ？对 vuex 的理解

vuex 只能使用在 vue 上，很大的程度是因为其高度依赖于 vue 的 computed 依赖检测系统以及其插件系统。其的实现方式完完全全的使用了 vue 自身的响应式设计，依赖监听、依赖收集都属于 vue 对对象 Property set get 方法的代理劫持。

vuex 中的 store 本质就是没有 template 的隐藏着的 vue 组件。

vuex 生成了一个 store 实例，并且把这个实例挂在了所有的组件上，所有的组件引用的都是同一个 store 实例。由于其他组件引用的是同样的实例，所以一个组件改变了 store 上的数据， 导致另一个组件上的数据也会改变，就像是一个对象的引用。

### vuex 的 store 特性是什么

- vuex 就是一个仓库，仓库里放了很多对象。其中 state 就是数据源存放地，对应于一般 vue 对象里面的 data
- state 里面存放的数据是响应式的，vue 组件从 store 读取数据，若是 store 中的数据发生改变，依赖这相数据的组件也会发生更新
- 它通过 mapState 把全局的 state 和 getters 映射到当前组件的 computed 计算属性

### 好处

- 可维护性会下降，你要修改数据，你得维护多个地方
- 可读性下降，因为一个组件里的数据，你根本就看不出来是从哪里来的
- 增加耦合，大量的上传派发，会让耦合性大大的增加，本来 Vue 用 Component 就是为了减少耦合，现在这么用，和组件化的初衷相背

### Vuex 如何区分 state 是外部直接修改，还是通过 mutation 方法修改的？

Vuex 中修改 state 的唯一渠道就是执行 commit('xx', payload) 方法，其底层通过执行 `this._withCommit(fn)` 设置`_committing` 标志变量为 true，然后才能修改 state，修改完毕还需要还原`_committing` 变量。外部修改虽然能够直接修改 state，但是并没有修改`_committing` 标志位，所以只要 watch 一下 state，state change 时判断是否`_committing` 值为 true，即可判断修改的合法性。

### 调试时的"时空穿梭"功能是如何实现的？

devtoolPlugin 中提供了此功能。因为 dev 模式下所有的 state change 都会被记录下来，'时空穿梭' 功能其实就是将当前的 state 替换为记录中某个时刻的 state 状态，利用 store.replaceState(targetState) 方法将执行 this.\_vm.state = state 实现。

### 为什么 Vuex 的 mutation 和 Redux 的 reducer 中不能做异步操作？

如果在 mutation 中做了异步操作，在 dev-tools 中会立即打印一个 snapshot，而此时异步操作还没有执行完，此时的 snapshot 的信息是错误的。

而在 action 中做异步操作 dev-tools 会等等异步操作执行完才去打印 mutation 的一个 snapshot,这样便于我们回查 time-travel,查看在某个 mutation 里的变化。

### Generate-vuex 的原理和简单实现逻辑(1.0 版本和 1.1 版本需要分别进行说明)

- 1.1 版本的预加载 types 逻辑
- 描述 vuex-pathify 这个插件给我带来的灵感

- vue 项目目录 assets 和 static 的区别
  assets 里面的会被 webpack 打包进你的代码里，而 static 里面的，就直接引用了。
  一般在 static 里面放一些类库的文件，在 assets 里面放属于该项目的资源文件。
  如上面所说的 reset.css 会放在 static 文件夹中比较好

- vue watch 深度监听对象， watch 是如何实现的 ？
- vue element 全量数据关键词搜索高亮小微逻辑是在搜索结果到达 vuex 之前就对 data 进行替换。
- vscode 从 0 开始安装 vue react 插件，eslint 规则，自动格式化，主题，nodejs 调试等
- vue 中的 style lang=less 的时候 webpack 为什么需要安装 less-loader， webpack module 的规则中配置的 less-loader 是对 less 文件进行编译的，那么 .vue 文件是被如何编译成 html 文件 less 文件 和 js 文件的
