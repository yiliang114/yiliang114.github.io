---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 父子组件的渲染顺序（生命周期函数执行顺序）

### 组件 keep-alive 的时候又是什么道理？

直接将组件缓存在了内存中，而没有直接走入销毁阶段。

### 引入组件的时候，什么时候需要 components 引入，什么时候直接使用就行了： 例子： qcvue 脚手架生成的页面。

### vue component :is 实现多个组件之间的切换

动态组件切换。

https://blog.csdn.net/qq_30758077/article/details/83069715

### vue 抽象组件

不会实际渲染。

https://www.cnblogs.com/ghost-xyx/p/7640204.html

### Vue 的父组件和子组件生命周期钩子执行顺序是什么

父组建： beforeCreate -> created -> beforeMount
子组件： -> beforeCreate -> created -> beforeMount -> mounted
父组件： -> mounted
总结：从外到内，再从内到外

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

### 组件的 keep-alive

代码在 component.js 中，如果 keep-alive 特性存在，那么组件在重复被创建的时候，会通过缓存机制，快速创建组件，以提升视图更新的性能。

`if(this.keep-alive){var cached = this.cache[id]}`
