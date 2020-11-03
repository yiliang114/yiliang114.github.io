---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# vuex

## 安装

```
npm i --save vuex

yarn add vuex
```

一个模块化的打包系统，必须显示地通过`Vue.use()`来安装 Vuex：

```
import Vue from 'vue';
import Vuex from 'vuex;

Vue.use(Vuex);
```

当使用全局 script 标签引用 Vuex 时，不需要以上安装过程。

## Vuex 是什么

Vuex 是一个专为 vue 应用程序开发的状态管理模式，集中式存储应用的所有组件状态，并以相应的规则保证状态一种可预测的方式发生变化。

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

### 核心知识点

1. 什么是 vuex？
2. 使用 vuex 的核心概念
3. vuex 在 vue-cli 中的应用
4. 组件中使用 vuex 的值和修改值的地方？
5. 在 vuex 中使用异步修改
6. pc 端页面刷新时实现 vuex 缓存

### Store

调用 Vuex.Store 函数的例子：

```
export default new Vuex.Store({
  modules: {
    cart,
    products
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
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

```
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

#### vuex 异步：

是被分发的 action 会触发（commit）多次 mutation （也就是会执行多次 mutations 中的函数）

```
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

### new Vue

全局只创建了一个 Vue 实例还是有多少个组件就有多少个 Vue 实例？

### 考虑对于 vuex 的封装

#### 一般异步场景：

执行异步操作（比如拉取数据），在 getter 数据更新之后 vue 会自动对视图进行更新。到这里就结束了。

#### 多步异步场景：

比如：授权 action，异步接口返回结果之后，再考虑更新列表数据

（不过想了想，如果不使用状态机，这是一个伪需求，就不需要在 vuex 中存储授权接口的状态了。）

#### 基于页面 vuex store 的注入问题？

如果页面过多，对于每一个页面都会加载所有的 vuex store 运行 vuex tool 的时候感觉有点卡，觉得也不是很有必要。

参考： reducers 装载

### vuex 在使用中，初始化的部分

#### 安装 vuex

```
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

内部实现：

![imagepng](http://media.zhijianzhang.cn//file/2018/10/4bf5cd431af845a6814635362395d22f_image.png)

![imagepng](http://media.zhijianzhang.cn//file/2018/10/9fccaaca083c473e9c60b33eeaacf535_image.png)

`this._installedPlugins` 目前还是空的，因此不会执行到下面的 `plugin.install` 的部分。 `Vue.install(Vuex)` 调用 `use` 函数，根据判断条件， `Vuex` 这个 `plugin` 的安装是直接调用 `Vuex.install()` 函数。

todo: 这里不确定是不是没有传参数。

接下来就看看 `Vuex.install()` 函数。位于 `Vuex` 源码的 `src/store.js` 中。

![image-20181023103834377](/var/folders/wq/zdlyxhd53zg8j874jhk14hnr0000gn/T/abnerworks.Typora/image-20181023103834377.png)

这里的 `Vue` 是一个全局变量，可以看到，这里的 `install` 函数主要是执行 `applyMixin(Vue)` 。

`applyMixin()` 函数位于 `src/mixin.js` 中：

```
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
  ...
  }
```

这里在 Vue 版本大于 2 的时候，就执行 `Vue.mixin(...)` ，暂时就先不看 `Vue@1.x` 的 `applyMixin` 逻辑了。

![imagepng](http://media.zhijianzhang.cn//file/2018/10/8fb0094a0d0b4f67ab5ac6f1ad2453a7_image.png)

黄线框出的部分比较好理解，就是为 vue 实例创建一个 `$store` 属性，值是 `Vuex` 的实例 `store`。如果你不了解 `this.$options` 的值，可以参考官网 [\$options](https://cn.vuejs.org/v2/api/#vm-options)。 事实上，`this.$options` 能够获取当前的 vue 实例，在调用 `new Vue()` 初始化函数的时候传入的所有参数。

![imagepng](http://media.zhijianzhang.cn//file/2018/10/ccbfca617b0040efbcd1ea15e460f33e_image.png)

![imagepng](http://media.zhijianzhang.cn//file/2018/10/77675ecd9b224ce7b4ad83ca3abf753f_image.png)

也就是说，在 当前的 vue 实例中，直接通过 `this.$store` 能够获取到 `vuex` 的实例，也就是能够直接 `this.$store.commit(...)` `this.$store.dispatch(...)` 等操作。

Todo: 不过红色部分，我暂时不是很能理解，为什么明明 `Vue.use(Vuex)` 只在 `main.js` （可以理解为根组件）执行，但是所有的子组件中都能够通过 `this.$store.dispatch(...)` 这样来操作。

main.js

![imagepng](http://media.zhijianzhang.cn//file/2018/10/4e84021d763043098a55b3315fd42bbd_image.png)

store.js

![imagepng](http://media.zhijianzhang.cn//file/2018/10/19054c98613c4cb8aca824946390990a_image.png)

接着来看一下上文中的 `applyMixin(Vue)` 函数中出现的 `Vue.mixin(...)` 函数是如何实现的， 该函数定位位于 `src/global-api/mixin.js` 中。

![imagepng](http://media.zhijianzhang.cn//file/2018/10/6bef2da22edf4954bae88b5cfbe1af38_image.png)

很简单，就是将每一次 `Vue.mixin(...)` 传入的参数进行一次 merge，最后再将 merge 好之后的 vue 实例返回。

创建 vuex 实例

```
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

### 更好的双向绑定

https://github.com/maoberlehner/vuex-map-fields

我觉得应该是 mapStateSync 更好一点

### Generate.js 的理念

对于 actions （一般指异步请求而言）包含以下两个步骤：

1. start => 意味着开始填写数据
2. perform => （填写数据）并发送请求

所以 generate.js 的 actions 有两个函数，分别是 xxxStart 和 xxxPerform 覆盖异步函数的处理场景
