---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# Immutable 详解

Javascript 中的对象一般是可变的（mutable），因为使用了引用赋值，新的对象简单的引用了原始对象，改变新的对象将影响到原始对象。如`f00 = {a:1};bar = foo; bar.a = 2;`你会发现，此时`foo.a`也被改成了`2`。 虽然这样可以节约内存，但当应用复杂后，这就造成了非常大的隐患，`Mutable`带来的优点变得得不偿失。

为了解决这个问题，一般的做法是使用`shallowCopy`(浅拷贝)或`deepCopy`（深拷贝）来避免被修改，但这样做又造成了 CPU 和内存的浪费。

### mobx 不怎么需要关注 immutable 是因为它自始至终都只有一个引用对象。

### 如果不使用 immutable ，也不考虑内存的使用效率的话，其实 js 对象对 react 引起的问题就是，改变了子对象的内容，但是 react 还是认为它是同一个对象，而不进行渲染。immutable 主要解决这个问题。

# 什么是 Immutable Data

Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。

Immutable 实现的原理是**Persistent Data Structure**(持久化数据结构)，也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有的节点都复制一遍带来的性能损耗，Immutable 使用了**Stryctural Sharing**（结构共享），即如果对象中的一个节点发生变化

![](https://camo.githubusercontent.com/9e129aaf95d2a645a860dc26532796817e8085c0/687474703a2f2f696d672e616c6963646e2e636f6d2f7470732f69322f5442317a7a695f4b5858585858637458465858627262384f5658582d3631332d3537352e676966)

[链接](https://github.com/camsong/blog/issues/3)

## 文档

[immutable](https://www.cnblogs.com/feiying100/p/7063138.html)

[开发总结](http://react-china.org/t/react-redux-immutablejs/9948)

# Immutable

https://zhuanlan.zhihu.com/purerender/20295971

http://blog.csdn.net/ISaiSai/article/details/77878863

目录结构:

| -- actions #action 文件夹
| -- components #组件文件夹
| -- constants #ActionTypes 文件夹
| -- containers #容器文件夹(一般存放 APP.js)
| -- reducers #reducers 文件夹
| -- 以及一些其它基本文件
