---
title: vue 组件
date: '2020-10-26'
draft: true
---

## 组件

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

### vue 父子组件的标签一些特殊的地方

- class 值是不用传的，所以会存在一个样式泄漏的问题
- 普通的 click 事件也不需要子组件内部去做特殊处理，在父组件里使用子组件时，直接用 @click 就会透传

### vue component :is 实现多个组件之间的切换

动态组件切换。

### vue 抽象组件

不会实际渲染。例如 `router-view`

## 组件通信

组件通信一般分为以下几种情况：

- 父子组件通信
- 兄弟组件通信
- 跨多层级组件通信
- 任意组件

### 兄弟组件通信

通过 `this.$parent.$children`，在 `$children` 中可以通过组件 `name` 查询到需要的组件实例，然后进行通信。

### 父子组件通信

1. emit/props
2. `$parent.xxx`
3. provide/injected 跨多层次组件通信
4. event bus
5. Vuex
6. `$listeners` 和 `.sync`

### 任意组件

1. event bus
2. Vuex
