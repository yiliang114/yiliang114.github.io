---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### proxy 代理？

### vue.js 的两个核心是什么？

### vue 常用的修饰符

### vue 中 key 值的作用

### vue 事件中如何使用 event 对象？

### Vue 组件中 data 为什么必须是函数

### vue 中子组件调用父组件的方法

### vue 中 keep-alive 组件的作用

### vue 中如何编写可复用的组件？

### 什么是 vue 生命周期和生命周期钩子函数？

### vue 生命周期钩子函数有哪些？

### vue 如何监听键盘事件中的按键？

### vue 更新数组时触发视图更新的方法

### vue 中对象更改检测的注意事项

### 解决非工程化项目初始化页面闪动问题

### 十个常用的自定义过滤器

### vue 等单页面应用及其优缺点

### 什么是 vue 的计算属性？

### vue 父组件如何向子组件中传递数据？

### vue 弹窗后如何禁止滚动条滚动？

### 计算属性的缓存和方法调用的区别

### vue 如何优化首屏加载速度？

### vm 实例属性

- `vm._renderProxy`
- `vm.$createElement`
- `vm._vnode`

```js
// render.js/initRender()
// 父 vnode
const parentVnode = (vm.$vnode = options._parentVnode);
```

```js
// init.js/initMixin()
// 实例本身，循环引用
vm._renderProxy = vm;
```

```js
// lifecycle.js/mountComponent()
// 渲染组件的容器 dom， 一般来说是值都是根节点的渲染 dom
vm.$el = el;
```

实例 template 节点转化成的渲染函数： `vm.$options.render`

```js
// entry-runtime-with-compiler.js
// 能够将 template 节点编译成 render 函数的函数
Vue.compile = compileToFunctions;
```
