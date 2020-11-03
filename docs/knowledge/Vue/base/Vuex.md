---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### vuex 是什么？哪种功能场景使用它？

vuex 是 vue 框架中状态管理。在多个组件中都会使用到，并且组件之间是非父子关系的状态，可以放到 vuex 中在多个组件中共享使用。场景有：单页应用中，组件之间的状态，比如登录状态等。

```js
// 新建 store.js
import Vue from 'vue'
import Vuex form 'vuex'

// TODO: ?
Vue.use(Vuex)

export default new Vuex.store({
	//...code
})

//main.js
import store from './store'
...
```

### mutation 如何触发 store 改变的？ store 的值改变又是如何通知视图进行变化的

## vuex 相关

### vuex 有哪几种属性

有 5 种，分别是 state、getter、mutation、action、module

### vuex 的 store 特性是什么

- vuex 就是一个仓库，仓库里放了很多对象。其中 state 就是数据源存放地，对应于一般 vue 对象里面的 data
- state 里面存放的数据是响应式的，vue 组件从 store 读取数据，若是 store 中的数据发生改变，依赖这相数据的组件也会发生更新
- 它通过 mapState 把全局的 state 和 getters 映射到当前组件的 computed 计算属性

### vuex 的 getter 特性是什么

- getter 可以对 state 进行计算操作，它就是 store 的计算属性
- 虽然在组件内也可以做计算属性，但是 getters 可以在多给件之间复用
- 如果一个状态只在一个组件内使用，是可以不用 getters

### vuex 的 mutation 特性是什么

- action 类似于 muation, 不同在于：action 提交的是 mutation,而不是直接变更状态
- action 可以包含任意异步操作

### vue 中 ajax 请求代码应该写在组件的 methods 中还是 vuex 的 action 中

如果请求来的数据不是要被其他组件公用，仅仅在请求的组件内使用，就不需要放入 vuex 的 state 里

如果被其他地方复用，请将请求放入 action 里，方便复用，并包装成 promise 返回

### 不用 vuex 会带来什么问题

- 可维护性会下降，你要修改数据，你得维护多个地方
- 可读性下降，因为一个组件里的数据，你根本就看不出来是从哪里来的
- 增加耦合，大量的上传派发，会让耦合性大大的增加，本来 Vue 用 Component 就是为了减少耦合，现在这么用，和组件化的初衷相背

### vuex 原理

vuex 仅仅是作为 vue 的一个插件而存在，不像 Redux,MobX 等库可以应用于所有框架，vuex 只能使用在 vue 上，很大的程度是因为其高度依赖于 vue 的 computed 依赖检测系统以及其插件系统，vuex 整体思想诞生于 flux,可其的实现方式完完全全的使用了 vue 自身的响应式设计，依赖监听、依赖收集都属于 vue 对对象 Property set get 方法的代理劫持。最后一句话结束 vuex 工作原理，vuex 中的 store 本质就是没有 template 的隐藏着的 vue 组件；

### 使用 Vuex 只需执行 Vue.use(Vuex)，并在 Vue 的配置中传入一个 store 对象的示例，store 是如何实现注入的？

[美团](https://tech.meituan.com/vuex_code_analysis.html)

Vue.use(Vuex) 方法执行的是 install 方法，它实现了 Vue 实例对象的 init 方法封装和注入，使传入的 store 对象被设置到 Vue 上下文环境的$store 中。因此在 Vue Component 任意地方都能够通过 this.$store 访问到该 store。

### state 内部支持模块配置和模块嵌套，如何实现的？[美团](https://tech.meituan.com/vuex_code_analysis.html)

在 store 构造方法中有 makeLocalContext 方法，所有 module 都会有一个 local context，根据配置时的 path 进行匹配。所以执行如 dispatch('submitOrder', payload)这类 action 时，默认的拿到都是 module 的 local state，如果要访问最外层或者是其他 module 的 state，只能从 rootState 按照 path 路径逐步进行访问。

### 在执行 dispatch 触发 action(commit 同理)的时候，只需传入(type, payload)，action 执行函数中第一个参数 store 从哪里获取的？

[美团](https://tech.meituan.com/vuex_code_analysis.html)

store 初始化时，所有配置的 action 和 mutation 以及 getters 均被封装过。在执行如 dispatch('submitOrder', payload)的时候，actions 中 type 为 submitOrder 的所有处理方法都是被封装后的，其第一个参数为当前的 store 对象，所以能够获取到 { dispatch, commit, state, rootState } 等数据。

### Vuex 如何区分 state 是外部直接修改，还是通过 mutation 方法修改的？

[美团](https://tech.meituan.com/vuex_code_analysis.html)

Vuex 中修改 state 的唯一渠道就是执行 commit('xx', payload) 方法，其底层通过执行 this.\_withCommit(fn) 设置\_committing 标志变量为 true，然后才能修改 state，修改完毕还需要还原\_committing 变量。外部修改虽然能够直接修改 state，但是并没有修改\_committing 标志位，所以只要 watch 一下 state，state change 时判断是否\_committing 值为 true，即可判断修改的合法性。

### 调试时的"时空穿梭"功能是如何实现的？

[美团](https://tech.meituan.com/vuex_code_analysis.html)

devtoolPlugin 中提供了此功能。因为 dev 模式下所有的 state change 都会被记录下来，'时空穿梭' 功能其实就是将当前的 state 替换为记录中某个时刻的 state 状态，利用 store.replaceState(targetState) 方法将执行 this.\_vm.state = state 实现。

### vuex 是什么？怎么使用？哪种功能场景使用它？

只用来读取的状态集中放在 store 中； 改变状态的方式是提交 mutations，这是个同步的事物； 异步逻辑应该封装在 action 中。
在 main.js 引入 store，注入。新建了一个目录 store，….. export 。
场景有：单页应用中，组件之间的状态、音乐播放、登录状态、加入购物车
图片描述

- state
  Vuex 使用单一状态树,即每个应用将仅仅包含一个 store 实例，但单一状态树和模块化并不冲突。存放的数据状态，不可以直接修改里面的数据。
- mutations
  mutations 定义的方法动态修改 Vuex 的 store 中的状态或数据。
- getters
  类似 vue 的计算属性，主要用来过滤一些数据。
- action
  actions 可以理解为通过将 mutations 里面处里数据的方法变成可异步的处理数据的方法，简单的说就是异步操作数据。view 层通过 store.dispath 来分发 action。

```js
const store = new Vuex.Store({
  //store 实例
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment(context) {
      context.commit('increment');
    },
  },
});
```

modules
项目特别复杂的时候，可以让每一个模块拥有自己的 state、mutation、action、getters,使得结构非常清晰，方便管理。

```js

const moduleA = {
state: { ... },
mutations: { ... },
actions: { ... },
getters: { ... }
}
const moduleB = {
state: { ... },
mutations: { ... },
actions: { ... }
}

const store = new Vuex.Store({
modules: {
a: moduleA,
b: moduleB
})
```

### 其他

- 挂载时机
- 通知
- 插件

### vuex 原理

vuex 的原理其实非常简单，它为什么能实现所有的组件共享同一份数据？
因为 vuex 生成了一个 store 实例，并且把这个实例挂在了所有的组件上，所有的组件引用的都是同一个 store 实例。
store 实例上有数据，有方法，方法改变的都是 store 实例上的数据。由于其他组件引用的是同样的实例，所以一个组件改变了 store 上的数据， 导致另一个组件上的数据也会改变，就像是一个对象的引用。
如果对 vuex 的实现有兴趣，可以看看我自己造的一个 vue 轮子对应的 vuex 插件。它实现了除 vuex 模块外的所有功能。

### vuex 和 mobx 为什么不需要 immutable， redux 不使用 redux 会怎样

### vuex 订阅机制

### vuex 中的 action 触发模块、根模块

https://blog.csdn.net/wbiokr/article/details/80685559

### vuex 直接修改 state 与 commit 改变的区别

https://blog.csdn.net/a460550542/article/details/82620693

### vuex 插件

https://segmentfault.com/a/1190000012184535

### vuex 如何进行订阅

### 说一说 vuex 的原理，什么时候被挂载到 vue 上的，mutation 和 action 又是什么时候会被触发的。

### vuex 的动态加载模块的机器

### 今天遇到一个问题，vuex 中通过 commit 调用一个 mutation 传一个 undefined 的值将不会改变 state 中的值？ 探究一下源码中为何会这样。

### Generate-vuex 的原理和简单实现逻辑(1.0 版本和 1.1 版本需要分别进行说明)

- 1.1 版本的预加载 types 逻辑
- 描述 vuex-pathify 这个插件给我带来的灵感

- vue 项目目录 assets 和 static 的区别
  assets 里面的会被 webpack 打包进你的代码里，而 static 里面的，就直接引用了。
  一般在 static 里面放一些类库的文件，在 assets 里面放属于该项目的资源文件。
  如上面所说的 reset.css 会放在 static 文件夹中比较好

- vue watch 深度监听对象， watch 是如何实现的 ？
- vue element 全量数据关键词搜索高亮 xiaowei 逻辑是在搜索结果到达 vuex 之前就对 data 进行替换。
- vscode 从 0 开始安装 vue react 插件，eslint 规则，自动格式化，主题，nodejs 调试等
- vue 中的 style lang=less 的时候 webpack 为什么需要安装 less-loader， webpack module 的规则中配置的 less-loader 是对 less 文件进行编译的，那么 .vue 文件是被如何编译成 html 文件 less 文件 和 js 文件的

### vuex 旧列表数据

vuex 旧列表数据在页面进行切换的时候，在 vuex 中还存在旧数据，但是页面需要请求新数据的时候，列表一般会给 loading 状态，而不能直接显示旧数据。这个时候就需要有一个标示位： status. 拉取接口的状态。

所以这时候 vuex 的 generate state 就来了。。将每一个接口的 status data params error 都存储在 vuex 中。

#### 值说明

- status 用于表示接口的请求状态，请求 pedding performing done 等， 用于显示列表的 loading 状态以及 await 一些结果可以直接在组件中进行根据 status 进行不同显示。 目前考虑暂时没有什么弊端
- data state 中的状态不再是一个具体的值，而是将所有接口名为一个 state 对象名，data 是对象一个属性，用于获取最后的结果。弊端很多： 获取值的时候很麻烦，更新也很麻烦（不能对组件和 vuex 进行双向绑定了）
- params 如果某一个接口公用同一个 params， 每一个对象中都维护一个各自的 params 简直蛋疼
- error

### vuex

- [你有写过 vuex 中 store 的插件吗？](https://github.com/haizlin/fe-interview/issues/539)
- [你有使用过 vuex 的 module 吗？主要是在什么场景下使用？](https://github.com/haizlin/fe-interview/issues/538)
- [vuex 中 actions 和 mutations 有什么区别？](https://github.com/haizlin/fe-interview/issues/537)
- [vuex 使用 actions 时不支持多参数传递怎么办？](https://github.com/haizlin/fe-interview/issues/413)
- [你觉得 vuex 有什么缺点？](https://github.com/haizlin/fe-interview/issues/412)
- [你觉得要是不用 vuex 的话会带来哪些问题？](https://github.com/haizlin/fe-interview/issues/411)
- [vuex 怎么知道 state 是通过 mutation 修改还是外部直接修改的？](https://github.com/haizlin/fe-interview/issues/393)
- [请求数据是写在组件的 methods 中还是在 vuex 的 action 中？](https://github.com/haizlin/fe-interview/issues/392)
- [怎么监听 vuex 数据的变化？](https://github.com/haizlin/fe-interview/issues/391)
- [vuex 的 action 和 mutation 的特性是什么？有什么区别？](https://github.com/haizlin/fe-interview/issues/390)
- [页面刷新后 vuex 的 state 数据丢失怎么解决？](https://github.com/haizlin/fe-interview/issues/389)
- [vuex 的 state、getter、mutation、action、module 特性分别是什么？](https://github.com/haizlin/fe-interview/issues/388)
- [vuex 的 store 有几个属性值？分别讲讲它们的作用是什么？](https://github.com/haizlin/fe-interview/issues/387)
- [你理解的 vuex 是什么呢？哪些场景会用到？不用会有问题吗？有哪些特性？](https://github.com/haizlin/fe-interview/issues/386)
- [使用 vuex 的优势是什么？](https://github.com/haizlin/fe-interview/issues/385)
- [有用过 vuex 吗？它主要解决的是什么问题？推荐在哪些场景用？](https://github.com/haizlin/fe-interview/issues/384)
