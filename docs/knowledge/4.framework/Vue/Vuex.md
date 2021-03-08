---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### vuex 的原理 ？对 vuex 的理解

vuex 只能使用在 vue 上，很大的程度是因为其高度依赖于 vue 的 computed 依赖检测系统以及其插件系统。其的实现方式完完全全的使用了 vue 自身的响应式设计，依赖监听、依赖收集都属于 vue 对对象 Property set get 方法的代理劫持。

vuex 中的 store 本质就是没有 template 的隐藏着的 vue 组件。

vuex 生成了一个 store 实例，并且把这个实例挂在了所有的组件上，所有的组件引用的都是同一个 store 实例。由于其他组件引用的是同样的实例，所以一个组件改变了 store 上的数据， 导致另一个组件上的数据也会改变，就像是一个对象的引用。

### Vuex 底层实现

vuex 仅仅是作为 vue 的一个插件而存在，不像 Redux,MobX 等库可以应用于所有框架，vuex 只能使用在 vue 上，很大的程度是因为其高度依赖于 vue 的 computed 依赖检测系统以及其插件系统，vuex 整体思想诞生于 flux,可其的实现方式完完全全的使用了 vue 自身的响应式设计，依赖监听、依赖收集都属于 vue 对对象 Property set get 方法的代理劫持。最后一句话结束 vuex 工作原理，vuex 中的 store 本质就是没有 template 的隐藏着的 vue 组件；

vuex 的原理其实非常简单，它为什么能实现所有的组件共享同一份数据？
因为 vuex 生成了一个 store 实例，并且把这个实例挂在了所有的组件上，所有的组件引用的都是同一个 store 实例。
store 实例上有数据，有方法，方法改变的都是 store 实例上的数据。由于其他组件引用的是同样的实例，所以一个组件改变了 store 上的数据， 导致另一个组件上的数据也会改变，就像是一个对象的引用。
如果对 vuex 的实现有兴趣，可以看看我自己造的一个 vue 轮子对应的 vuex 插件。它实现了除 vuex 模块外的所有功能。

### 模块

state: 状态中心
mutations: 更改状态
actions: 异步更改状态
getters: 获取状态
modules: 将 state 分成多个 modules，便于管理

### 状态自管理应用

包含三个部分：

- **state**, 数据源
- **view**， 以声明方式将**state**映射到视图
- **actions**, 响应在**view**上的用户输入导致的状态变化

但是如果应用遇到**多个组件共享状态**时，单向数据流的简洁性很容易被破坏：

- 多个视图依赖于同一状态
- 来自不同视图的行为需要变更同一状态

对于问题一，传参的方法对于多层嵌套的组件将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。对于问题二，我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致无法维护的代码。

把组件的共享状态抽取出来，以一个全局单例模式管理。？在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为。

## 开始

每一个 Vuex 应用的核心就是**store**(仓库)。 store 基本上就是一个容器，包含应用中的大部分**状态（state）**。

### Store

调用 Vuex.Store 函数的例子：

```js
export default new Vuex.Store({
  modules: {
    cart,
    products,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
```

传入参数： modules、strict、plugins

### mutations and actions

mutations 是一个函数，类比于 redux 中的 reducer， 实际会接收 被触发的 action 和 payload， 相应会对 state 改变。

actions 是一个函数，接收一个 context 参数包含 commit 方法 和 state 值， commit 方法是触发 mutations 的一种方式。

### commit and dispatch

commit 函数是用来触发单个 action 的，

dispatch 函数是用来分发单个 action 的， 但是在单个 action 中，可以触发多次某个 mutations 中的函数，也就是同步改变 state 值。

### mapGetters and mapActions

mapActions 实际上是将 actions 映射到 Store.dispatch 函数中，所以在 mapActions 函数输入参数之后，被 vue 组件调用的方法实际上是经过 Store.dispatch 来调用的。

### 简而言之

#### vuex 同步：

是被分发的 action 只触发（commit）一次 mutation （也就是只执行一次 mutations 中的函数）

```js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

#### vuex 异步：

是被分发的 action 会触发（commit）多次 mutation （也就是会执行多次 mutations 中的函数）

```js
actions: {
  checkout ({ commit, state }, products) {
    // 把当前购物车的物品备份起来
    const savedCartItems = [...state.cart.added]
    // 发出结账请求，然后乐观地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接受一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

### 考虑对于 vuex 的封装

#### 一般异步场景：

执行异步操作（比如拉取数据），在 getter 数据更新之后 vue 会自动对视图进行更新。到这里就结束了。

#### 多步异步场景：

比如：授权 action，异步接口返回结果之后，再考虑更新列表数据

（不过想了想，如果不使用状态机，这是一个伪需求，就不需要在 vuex 中存储授权接口的状态了。）

### vuex 在使用中，初始化的部分

#### 安装 vuex

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
```

内部实现：

![](http://media.zhijianzhang.cn//file/2018/10/4bf5cd431af845a6814635362395d22f_image.png)

![](http://media.zhijianzhang.cn//file/2018/10/9fccaaca083c473e9c60b33eeaacf535_image.png)

`this._installedPlugins` 目前还是空的，因此不会执行到下面的 `plugin.install` 的部分。 `Vue.install(Vuex)` 调用 `use` 函数，根据判断条件， `Vuex` 这个 `plugin` 的安装是直接调用 `Vuex.install()` 函数。

todo: 这里不确定是不是没有传参数。

接下来就看看 `Vuex.install()` 函数。位于 `Vuex` 源码的 `src/store.js` 中。

这里的 `Vue` 是一个全局变量，可以看到，这里的 `install` 函数主要是执行 `applyMixin(Vue)` 。

`applyMixin()` 函数位于 `src/mixin.js` 中：

```js
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
  ...
  }
```

这里在 Vue 版本大于 2 的时候，就执行 `Vue.mixin(...)` ，暂时就先不看 `Vue@1.x` 的 `applyMixin` 逻辑了。

![](http://media.zhijianzhang.cn//file/2018/10/8fb0094a0d0b4f67ab5ac6f1ad2453a7_image.png)

黄线框出的部分比较好理解，就是为 vue 实例创建一个 `$store` 属性，值是 `Vuex` 的实例 `store`。如果你不了解 `this.$options` 的值，可以参考官网 [\$options](https://cn.vuejs.org/v2/api/#vm-options)。 事实上，`this.$options` 能够获取当前的 vue 实例，在调用 `new Vue()` 初始化函数的时候传入的所有参数。

![](http://media.zhijianzhang.cn//file/2018/10/ccbfca617b0040efbcd1ea15e460f33e_image.png)

![](http://media.zhijianzhang.cn//file/2018/10/77675ecd9b224ce7b4ad83ca3abf753f_image.png)

也就是说，在 当前的 vue 实例中，直接通过 `this.$store` 能够获取到 `vuex` 的实例，也就是能够直接 `this.$store.commit(...)` `this.$store.dispatch(...)` 等操作。

Todo: 不过红色部分，我暂时不是很能理解，为什么明明 `Vue.use(Vuex)` 只在 `main.js` （可以理解为根组件）执行，但是所有的子组件中都能够通过 `this.$store.dispatch(...)` 这样来操作。

main.js

![](http://media.zhijianzhang.cn//file/2018/10/4e84021d763043098a55b3315fd42bbd_image.png)

store.js

![](http://media.zhijianzhang.cn//file/2018/10/19054c98613c4cb8aca824946390990a_image.png)

接着来看一下上文中的 `applyMixin(Vue)` 函数中出现的 `Vue.mixin(...)` 函数是如何实现的， 该函数定位位于 `src/global-api/mixin.js` 中。

![](http://media.zhijianzhang.cn//file/2018/10/6bef2da22edf4954bae88b5cfbe1af38_image.png)

很简单，就是将每一次 `Vue.mixin(...)` 传入的参数进行一次 merge，最后再将 merge 好之后的 vue 实例返回。

创建 vuex 实例

```js
const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});
```

### 更好的双向绑定

https://github.com/maoberlehner/vuex-map-fields

我觉得应该是 mapStateSync 更好一点

### Generate.js 的理念

对于 actions （一般指异步请求而言）包含以下两个步骤：

1. start => 意味着开始填写数据
2. perform => （填写数据）并发送请求

所以 generate.js 的 actions 有两个函数，分别是 xxxStart 和 xxxPerform 覆盖异步函数的处理场景

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

- action 类似于 mutation, 不同在于：action 提交的是 mutation,而不是直接变更状态
- action 可以包含任意异步操作

### vue 中 ajax 请求代码应该写在组件的 methods 中还是 vuex 的 action 中

如果请求来的数据不是要被其他组件公用，仅仅在请求的组件内使用，就不需要放入 vuex 的 state 里。如果被其他地方复用，请将请求放入 action 里，方便复用，并包装成 promise 返回

### 不用 vuex 会带来什么问题

- 可维护性会下降，你要修改数据，你得维护多个地方
- 可读性下降，因为一个组件里的数据，你根本就看不出来是从哪里来的
- 增加耦合，大量的上传派发，会让耦合性大大的增加，本来 Vue 用 Component 就是为了减少耦合，现在这么用，和组件化的初衷相背

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
- vue element 全量数据关键词搜索高亮小微逻辑是在搜索结果到达 vuex 之前就对 data 进行替换。
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

### 为什么 Vuex 的 mutation 和 Redux 的 reducer 中不能做异步操作？

如果在 mutation 中做了异步操作，在 dev-tools 中会立即打印一个 snapshot，而此时异步操作还没有执行完，此时的 snapshot 的信息是错误的。

而在 action 中做异步操作 dev-tools 会等等异步操作执行完才去打印 mutation 的一个 snapshot,这样便于我们回查 time-travel,查看在某个 mutation 里的变化。

### vuex 动态加载 namespace， 整个 store 树一起加载会很慢

- 首先，vuex 里面并不推荐使用 redux 的状态机，success error 等状态，都能够触发不同的自定义异步事件，至于 loading 的状态，应该是根据 vuex getter 中获取的数据，是否符合预期，符合预期就显示，如果不符合预期，比如报错了，如果不使用全局通知的话怎么全局显示 是一个问题？这就是状态机的必要之处吧？ 想一想这里如何进行处理。 如果能用全局通知的话，状态机似乎就真的没啥用了。
