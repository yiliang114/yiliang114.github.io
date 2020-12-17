---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

https://segmentfault.com/q/1010000007688303

vue 组件 slot 插槽

#### Vue 的 v-for 为什么需要添加 key 属性

为什么 key 不能使用 index 而一定要用一个唯一不变的值？
尽量用 id。 如果使用 index 的话，往数组的末尾添加元素的话问题不大，但是往数组的首位添加元素的话，就会有问题了。 原本 key 值为 0 的 item
value 变了，导致组件重新渲染； key 为 1 ， 2， 3， 4 ... 等也是如此，那就相当于说所有的 item 都重新更新了一遍，哪怕其他 item 没有任何变化。
优化的点：

1. 将所有拥有 id 的 v-for 循环 key 都更换成 id
2. 没有 id 的循环，例如 字符串数组，当然如果字符串元素不会重复的话也无妨，如果会重复的话，最好再加上一个出现次数，那么就能够保证所有的 key 都是唯一的。

##### vue watch 不生效

watch 生命周期函数是什么时候初始化的，如果通过 props 传值的时候，子组件已经拿到了值(已经不是 undefined 了)。 那么在注册 watch 的时候， 就不会被触发了。

props 值代理到子组件的 this 上，应该在子组件的 created 函数之前。

### v-for

v-for 中 注册事件，使用事件委托

### event

js 的 事件机制，什么时候排队，什么时候执行，sleep(min)

### ref

vue ref 和 \$refs
https://www.cnblogs.com/xumqfaith/p/7743387.html

### 自定义指令(v-check, v-focus) 的方法有哪些? 它有哪些钩子函数? 还有哪些钩子函数参数

- 全局定义指令：在 vue 对象的 directive 方法里面有两个参数, 一个是指令名称, 另一个是函数。
- 组件内定义指令：directives
- 钩子函数: bind(绑定事件出发)、inserted(节点插入时候触发)、update(组件内相关更新)
- 钩子函数参数： el、binding

### 说出至少 4 种 vue 当中的指令和它的用法

v-if(判断是否隐藏)、v-for(把数据遍历出来)、v-bind(绑定属性)、v-model(实现双向绑定)

### vue 如何自定义一个过滤器？

```html
<div id="app">
  <input type="text" v-model="msg" />
  {{msg| capitalize }}
</div>
```

```js
var vm = new Vue({
  el: '#app',
  data: {
    msg: '',
  },
  filters: {
    capitalize: function(value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
});
```

全局定义过滤器

```js
Vue.filter('capitalize', function(value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});
```

过滤器接收表达式的值 (msg) 作为第一个参数。capitalize 过滤器将会收到 msg 的值作为第一个参数。

### 对 keep-alive 的了解？

keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染。
在 vue 2.1.0 版本之后，keep-alive 新加入了两个属性: include(包含的组件缓存) 与 exclude(排除的组件不缓存，优先级大于 include) 。

使用方法

<keep-alive include='include_components' exclude='exclude_components'>
  <component>
    <!-- 该组件是否缓存取决于include和exclude属性 -->
  </component>
</keep-alive>
参数解释
include - 字符串或正则表达式，只有名称匹配的组件会被缓存
exclude - 字符串或正则表达式，任何名称匹配的组件都不会被缓存
include 和 exclude 的属性允许组件有条件地缓存。二者都可以用“，”分隔字符串、正则表达式、数组。当使用正则或者是数组时，要记得使用v-bind 。

使用示例

<!-- 逗号分隔字符串，只有组件a与b被缓存。 -->
<keep-alive include="a,b">
  <component></component>
</keep-alive>

<!-- 正则表达式 (需要使用 v-bind，符合匹配规则的都会被缓存) -->
<keep-alive :include="/a|b/">
  <component></component>
</keep-alive>

<!-- Array (需要使用 v-bind，被包含的都会被缓存) -->
<keep-alive :include="['a', 'b']">
  <component></component>
</keep-alive>

## computed 和 watch 区别

`computed` 是计算属性，依赖其他属性计算值，并且 `computed` 的值有缓存，只有当计算值变化才会返回内容。

`watch` 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。

所以一般来说需要依赖别的属性来动态获得值的时候可以使用 `computed`，对于监听到值的变化需要做一些复杂业务逻辑的情况可以使用 `watch`。

另外 `computed` 和 `watch` 还都支持对象的写法，这种方式知道的人并不多。

```
vm.$watch('obj', {
    // 深度遍历
    deep: true,
    // 立即触发
    immediate: true,
    // 执行的函数
    handler: function(val, oldVal) {}
})
var vm = new Vue({
  data: { a: 1 },
  computed: {
    aPlus: {
      // this.aPlus 时触发
      get: function () {
        return this.a + 1
      },
      // this.aPlus = 1 时触发
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
```

## keep-alive 组件有什么作用

如果你需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 `keep-alive` 组件包裹需要保存的组件。

对于 `keep-alive` 组件来说，它拥有两个独有的生命周期钩子函数，分别为 `activated` 和 `deactivated` 。用 `keep-alive` 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 `deactivated` 钩子函数，命中缓存渲染后会执行 `actived` 钩子函数。

## v-show 与 v-if 区别

`v-show` 只是在 `display: none` 和 `display: block` 之间切换。无论初始条件是什么都会被渲染出来，后面只需要切换 CSS，DOM 还是一直保留着的。所以总的来说 `v-show` 在初始渲染时有更高的开销，但是切换开销很小，更适合于频繁切换的场景。

`v-if` 的话就得说到 Vue 底层的编译了。当属性初始为 `false` 时，组件就不会被渲染，直到条件为 `true`，并且切换条件时会触发销毁/挂载组件，所以总的来说在切换时开销更高，更适合不经常切换的场景。

并且基于 `v-if` 的这种惰性渲染机制，可以在必要的时候才去渲染组件，减少整个页面的初始渲染开销。

## 组件中 data 什么时候可以使用对象

这道题目其实更多考的是 JS 功底。

组件复用时所有组件实例都会共享 `data`，如果 `data` 是对象的话，就会造成一个组件修改 `data` 以后会影响到其他所有组件，所以需要将 `data` 写成函数，每次用到就调用一次函数获得新的数据。

当我们使用 `new Vue()` 的方式的时候，无论我们将 `data` 设置为对象还是函数都是可以的，因为 `new Vue()` 的方式是生成一个根组件，该组件不会复用，也就不存在共享 `data` 的情况了。
