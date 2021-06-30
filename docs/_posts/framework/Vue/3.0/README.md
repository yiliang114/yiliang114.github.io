---
title: vue 3
date: '2020-10-26'
draft: true
---

<!-- https://juejin.cn/post/6844904050014552072-->
<!-- https://github.com/cuixiaorui/mini-vue/blob/master/README_CN.md -->

### 为什么不用 class

class 提案被撤回， 并且 class 因为会有副作用不能 tree sharking。类被封装成了一个 IIFE(立即执行函数)，然后返回一个构造函数。Vue 3 的源代码完全没有使用 class 关键字！（只在测试代码和示例代码里用到了 class 关键字）。

### vue 3 源码的阅读顺序

1. 先读 reactivity，能最快了解 Vue 3 的新特性；
2. 再读 runtime，理解组件和生命周期的实现；
3. 如果还有时间再读 compiler，理解编译优化过程。

如果你想省时间，可以直接看所有 `__tests__` 目录里的测试用例来了解 Vue 3 的所有功能。
