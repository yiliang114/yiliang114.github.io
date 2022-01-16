---
title: vue 3
date: '2020-10-26'
draft: true
---

<!-- https://juejin.cn/post/6844904050014552072-->
<!-- https://github.com/cuixiaorui/mini-vue/blob/master/README_CN.md -->

## vue@3 源码

### 为什么不用 class

class 提案被撤回， 并且 class 因为会有副作用不能 tree sharking。类被封装成了一个 IIFE(立即执行函数)，然后返回一个构造函数。Vue 3 的源代码完全没有使用 class 关键字！（只在测试代码和示例代码里用到了 class 关键字）。

### vue 3 源码的阅读顺序

1. 先读 reactivity，能最快了解 Vue 3 的新特性；
2. 再读 runtime，理解组件和生命周期的实现；
3. 如果还有时间再读 compiler，理解编译优化过程。

如果你想省时间，可以直接看所有 `__tests__` 目录里的测试用例来了解 Vue 3 的所有功能。

## 重启 vue-next

dom 原生 api：

1. createElement() 创建元素节点
2. crateTextNode() 创建文本节点
3. createAttribute() 创建属性节点
4. appendChild() 方法向节点添加最后一个子节点
5. insertBefore() 在指定的子节点之前插入新的子节点

```js
var attr = document.createAttribute('属性名');
attr.value = '属性值';

parent.insertBefore(newChild, oldChild);
```

### 文档和材料

官方文档：
https://v3.cn.vuejs.org/guide/installation.html#vite

### 内置原生指令

#### v-cloak

源码中有很多地方都特别注意跳过这个指令的处理，比如 app.mount 函数在兼容 vue2 的 html 属性时。

```html
<div v-cloak>
  {{ message }}
</div>
```

`<div>` 不会显示，直到编译结束。
