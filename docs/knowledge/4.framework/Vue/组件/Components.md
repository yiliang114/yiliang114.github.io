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

### 父子通信

父组件通过 `props` 传递数据给子组件，子组件通过 `emit` 发送事件传递数据给父组件，这两种方式是最常用的父子通信实现办法。

这种父子通信方式也就是典型的单向数据流，父组件通过 `props` 传递数据，子组件不能直接修改 `props`， 而是必须通过发送事件的方式告知父组件修改数据。

另外这两种方式还可以使用语法糖 `v-model` 来直接实现，因为 `v-model` 默认会解析成名为 `value` 的 `prop` 和名为 `input` 的事件。

当然我们还可以通过访问 `$parent` 或者 `$children` 对象来访问组件实例中的方法和数据。

另外如果你使用 Vue 2.3 及以上版本的话还可以使用 `$listeners` 和 `.sync` 这两个属性。

`$listeners` 属性会将父组件中的 (不含 `.native` 修饰器的) `v-on` 事件监听器传递给子组件，子组件可以通过访问 `$listeners` 来自定义监听器。

`.sync` 属性是个语法糖，可以很简单的实现子组件与父组件通信

```html
<!--父组件中-->
<input :value.sync="value" />
<!--以上写法等同于-->
<input :value="value" @update:value="v => value = v"></comp>
<!--子组件中-->
<script>
  this.$emit('update:value', 1)
</script>
```

### 兄弟组件通信

对于这种情况可以通过查找父组件中的子组件实现，也就是 `this.$parent.$children`，在 `$children` 中可以通过组件 `name` 查询到需要的组件实例，然后进行通信。

### 跨多层次组件通信

对于这种情况可以使用 Vue 2.2 新增的 API `provide / inject`，虽然文档中不推荐直接使用在业务中，但是如果用得好的话还是很有用的。

假设有父组件 A，然后有一个跨多层级的子组件 B

```js
// 父组件 A
export default {
  provide: {
    data: 1,
  },
};
// 子组件 B
export default {
  inject: ['data'],
  mounted() {
    // 无论跨几层都能获得父组件的 data 属性
    console.log(this.data); // => 1
  },
};
```

### 父子组件通信

1. emit/props
2. `$parent.xxx`
3. provide/injected
4. event bus
5. Vuex

### 任意组件

这种方式可以通过 Vuex 或者 Event Bus 解决，另外如果你不怕麻烦的话，可以使用这种方式解决上述所有的通信情况
