---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### mobx 不怎么需要关注 immutable 是因为它自始至终都只有一个引用对象。

### 如果不使用 immutable ，也不考虑内存的使用效率的话，其实 js 对象对 react 引起的问题就是，改变了子对象的内容，但是 react 还是认为它是同一个对象，而不进行渲染。immutable 主要解决这个问题。
