---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 几种插槽类型

- 具名
- 匿名
- 默认
- 插槽作用域

### vue 的 slot 实现原理

1.  2.5 与 2.6 中的插槽使用方式有变化

### 具名插槽

https://segmentfault.com/a/1190000012996217?utm_source=tag-newest
https://juejin.im/post/5cb0564e5188251acb530087

slot 和 slot-scope 属性从 3.0 开始会被废弃，取而代之的是内置指令 v-slot，可以缩写为【#】

### 封装 vue 组件的时候，需要透传 slot 的模板内容。

场景：封装 ant d v 的 Empty 控件
解决方案。https://blog.csdn.net/xuxu_qkz/article/details/81115022

新封装的组件（子组件）

```vue
<template>
  <a-empty image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original">
    <span slot="description">
      <!-- <slot name="description">暂无数据</slot> -->
      <slot>暂无数据</slot>
    </span>
  </a-empty>
</template>
```

调用（父组件）

```vue
<template>
  <Empty>
    <!-- <a slot="description" href="/abc">还未编辑仪表盘，点击此处去编辑</a> -->
    <a href="/abc">还未编辑仪表盘，点击此处去编辑</a>
  </Empty>
</template>
```

### vm.$scopedSlots和vm.$slots 的理解和基本使用

https://www.jianshu.com/p/3af8552449fb

this.$slots 访问静态插槽的内容，每个插槽都是一个 VNode 数组
this.$scopedSlots 访问作用域插槽，每个作用域插槽都是一个返回若干 VNode 的函数：

如果一个组件只声明了一个 `slot-scope` 属性的话， 在 `$scopedSlots` 会多一个 default 函数，函数的参数就是 `slot-scope` ， 函数的返回结果是一个 VNode。 如果除了 `slot-scope` 之外还声明了 slot 的话，会出现在 `this.$scopedSlots` 的 指定属性中，也是一个函数。

所有的 $slots 现在都会作为函数暴露在 $scopedSlots 中。**如果你在使用渲染函数，不论当前插槽是否带有作用域，我们都推荐始终通过 \$scopedSlots 访问它们。** 这不仅仅使得在未来添加作用域变得简单，也可以让你最终轻松迁移到所有插槽都是函数的 Vue 3。

#### scopedSlots

如果要用渲染函数向子组件中传递作用域插槽，可以利用 VNode 数据对象中的 scopedSlots 字段：

```js
render: function (createElement) {
  // `<div><child v-slot="props"><span>{{ props.text }}</span></child></div>`
  return createElement('div', [
    createElement('child', {
      // 在数据对象中传递 `scopedSlots`
      // 格式为 { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: function (props) {
          return createElement('span', props.text)
        }
      }
    })
  ])
}
```
