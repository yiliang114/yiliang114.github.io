---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### vue 父子组件的标签一些特殊的地方

- class 值是不用传的，所以会存在一个样式泄漏的问题
- 普通的 click 事件也不需要子组件内部去做特殊处理，在父组件里使用子组件时，直接用 @click 就会透传

### 子组件几个事件的差别

```js
this.$emit('update:value', this.visible);
this.$emit('change', this.visible);
```

### Vue 的父组件和子组件生命周期钩子执行顺序是什么

父组建： beforeCreate -> created -> beforeMount
子组件： -> beforeCreate -> created -> beforeMount -> mounted
父组件： -> mounted
总结：从外到内，再从内到外

### 引入组件的时候，什么时候需要 components 引入，什么时候直接使用就行了： 例子： qcvue 脚手架生成的页面。

### vue component :is 实现多个组件之间的切换

动态组件切换。

https://blog.csdn.net/qq_30758077/article/details/83069715

### vue 抽象组件

不会实际渲染。

https://www.cnblogs.com/ghost-xyx/p/7640204.html

### 在 Vue 中子组件为何不可以修改父组件传递的 Prop，如果修改了，Vue 是如何监控到属性的修改并给出警告的

子组件为何不可以修改父组件传递的 Prop
单向数据流，易于监测数据的流动，出现了错误可以更加迅速的定位到错误发生的位置。
如果修改了，Vue 是如何监控到属性的修改并给出警告的。

```js
if (process.env.NODE_ENV !== 'production') {
  var hyphenatedKey = hyphenate(key);
  if (isReservedAttribute(hyphenatedKey) || config.isReservedAttr(hyphenatedKey)) {
    warn('"' + hyphenatedKey + '" is a reserved attribute and cannot be used as component prop.', vm);
  }
  defineReactive$$1(props, key, value, function() {
    if (!isRoot && !isUpdatingChildComponent) {
      warn(
        'Avoid mutating a prop directly since the value will be ' +
          'overwritten whenever the parent component re-renders. ' +
          "Instead, use a data or computed property based on the prop's " +
          'value. Prop being mutated: "' +
          key +
          '"',
        vm,
      );
    }
  });
}
```

在 initProps 的时候，在 defineReactive 时通过判断是否在开发环境，如果是开发环境，会在触发 set 的时候判断是否此 key 是否处于 updatingChildren 中被修改，如果不是，说明此修改来自子组件，触发 warning 提示。

需要特别注意的是，当你从子组件修改的 prop 属于基础类型时会触发提示。 这种情况下，你是无法修改父组件的数据源的， 因为基础类型赋值时是值拷贝。你直接将另一个非基础类型（Object, array）赋值到此 key 时也会触发提示(但实际上不会影响父组件的数据源)， 当你修改 object 的属性时不会触发提示，并且会修改父组件数据源的数据。

### 组件 keep-alive 的时候又是什么道理？

直接将组件缓存在了内存中，而没有直接走入销毁阶段。

### 组件的 keep-alive

代码在 component.js 中，如果 keep-alive 特性存在，那么组件在重复被创建的时候，会通过缓存机制，快速创建组件，以提升视图更新的性能。

`if(this.keep-alive){var cached = this.cache[id]}`

### keep-alive 组件有什么作用

如果你需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 `keep-alive` 组件包裹需要保存的组件。

对于 `keep-alive` 组件来说，它拥有两个独有的生命周期钩子函数，分别为 `activated` 和 `deactivated` 。用 `keep-alive` 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 `deactivated` 钩子函数，命中缓存渲染后会执行 `actived` 钩子函数。

### keep-alive 有什么作用

在 Vue 中，每次切换组件时，都会重新渲染。如果有多个组件切换，又想让它们保持原来的状态，避免重新渲染，这个时候就可以使用 keep-alive。 keep-alive 可以使被包含的组件保留状态，或避免重新渲染。

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

### vue 全局和单个组件获取配置信息

#### 获取全局注册的组件

```js
Vue.options.components;
```

#### 获取当前组件注册的组件

```js
this.$options.components;
```
