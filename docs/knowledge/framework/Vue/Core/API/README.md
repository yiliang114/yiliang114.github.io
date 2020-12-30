---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

https://segmentfault.com/q/1010000007688303

vue 组件 slot 插槽

### event

js 的 事件机制，什么时候排队，什么时候执行，sleep(min)

### ref

vue ref 和 \$refs
https://www.cnblogs.com/xumqfaith/p/7743387.html

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

## 组件中 data 什么时候可以使用对象

这道题目其实更多考的是 JS 功底。

组件复用时所有组件实例都会共享 `data`，如果 `data` 是对象的话，就会造成一个组件修改 `data` 以后会影响到其他所有组件，所以需要将 `data` 写成函数，每次用到就调用一次函数获得新的数据。

当我们使用 `new Vue()` 的方式的时候，无论我们将 `data` 设置为对象还是函数都是可以的，因为 `new Vue()` 的方式是生成一个根组件，该组件不会复用，也就不存在共享 `data` 的情况了。

### Vue 重写方法来实现数组的劫持

```js
const aryMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
const arrayAugmentations = [];
aryMethods.forEach(method => {
  // 这里是原生 Array 的原型方法
  let original = Array.prototype[method];

  // 将 push, pop 等封装好的方法定义在对象 arrayAugmentations 的属性上
  // 注意：是实例属性而非原型属性
  arrayAugmentations[method] = function() {
    console.log('我被改变啦!');

    // 调用对应的原生方法并返回结果
    return original.apply(this, arguments);
  };
});
let list = ['a', 'b', 'c'];
// 将我们要监听的数组的原型指针指向上面定义的空数组对象
// 这样就能在调用 push, pop 这些方法时走进我们刚定义的方法，多了一句 console.log
list.__proto__ = arrayAugmentations;
list.push('d'); // 我被改变啦！
// 这个 list2 是个普通的数组，所以调用 push 不会走到我们的方法里面。
let list2 = ['a', 'b', 'c'];
list2.push('d'); // 不输出内容
```

### keep-alive 有什么作用

在 Vue 中，每次切换组件时，都会重新渲染。如果有多个组件切换，又想让它们保持原来的状态，避免重新渲染，这个时候就可以使用 keep-alive。 keep-alive 可以使被包含的组件保留状态，或避免重新渲染。

### 实现 vue 中的 on,emit,off,once，手写代码

```js
// 参照 vue 源码实现
var EventEmiter = function() {
  this._events = {};
};
EventEmiter.prototype.on = function(event, cb) {
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.on(event[i], cb);
    }
  } else {
    (this._events[event] || (this._events[event] = [])).push(cb);
  }
  return this;
};
EventEmiter.prototype.once = function(event, cb) {
  function on() {
    this.off(event, cb);
    cb.apply(this, arguments);
  }
  on.fn = cb;
  this.on(event, on);
  return this;
};
EventEmiter.prototype.off = function(event, cb) {
  if (!arguments.length) {
    this._events = Object.create(null);
    return this;
  }
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.off(event[i], cb);
    }
    return this;
  }
  if (!cb) {
    this._events[event] = null;
    return this;
  }
  if (cb) {
    let cbs = this._events[event];
    let i = cbs.length;
    while (i--) {
      if (cb === cbs[i] || cb === cbs[i].fn) {
        cbs.splice(i, 1);
        break;
      }
    }
    return this;
  }
};
EventEmiter.prototype.emit = function(event) {
  let cbs = this._events[event];
  let args = Array.prototype.slice.call(arguments, 1);
  if (cbs) {
    for (let i = 0, l = cbs.length; i < l; i++) {
      cbs[i].apply(this, args);
    }
  }
};
```

### vue 项目中如何约束 rxjs 数据的类型

[Vue、Type escript 和 RxJS 与 Vue-Rx 的结合](https://blog.csdn.net/li420520/article/details/83832214)
[Vue、Type escript 和 RxJS 与 Vue-Rx 的结合](https://www.jianshu.com/p/bb7d032e8238)

### Vue 的父组件和子组件生命周期钩子执行顺序是什么

父组建： beforeCreate -> created -> beforeMount
子组件： -> beforeCreate -> created -> beforeMount -> mounted
父组件： -> mounted
总结：从外到内，再从内到外

### vue 怎么实现页面的权限控制

利用 vue-router 的 beforeEach 事件，可以在跳转页面前判断用户的权限（利用 cookie 或 token），是否能够进入此页面，如果不能则提示错误或重定向到其他页面，在后台管理系统中这种场景经常能遇到。

### 计算属性有什么作用

先来看一下计算属性的定义：
当其依赖的属性的值发生变化的时，计算属性会重新计算。反之则使用缓存中的属性值。
计算属性和 vue 中的其它数据一样，都是响应式的，只不过它必须依赖某一个数据实现，并且只有它依赖的数据的值改变了，它才会更新。

### watch 的作用是什么

watch 主要作用是监听某个数据值的变化。和计算属性相比除了没有缓存，作用是一样的。

借助 watch 还可以做一些特别的事情，例如监听页面路由，当页面跳转时，我们可以做相应的权限控制，拒绝没有权限的用户访问页面。
