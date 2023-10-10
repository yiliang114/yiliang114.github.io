---
title: Immutable
date: "2020-10-26"
draft: true
---

### Immutable 详解

Javascript 中的对象一般是可变的（mutable），因为使用了引用赋值，新的对象简单的引用了原始对象，改变新的对象将影响到原始对象。如`f00 = {a:1};bar = foo; bar.a = 2;`你会发现，此时`foo.a`也被改成了`2`。 虽然这样可以节约内存，但当应用复杂后，这就造成了非常大的隐患，`Mutable`带来的优点变得得不偿失。

为了解决这个问题，一般的做法是使用`shallowCopy`(浅拷贝)或`deepCopy`（深拷贝）来避免被修改，但这样做又造成了 CPU 和内存的浪费。

Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。

Immutable 实现的原理是**Persistent Data Structure**(持久化数据结构)，也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有的节点都复制一遍带来的性能损耗，Immutable 使用了**Stryctural Sharing**（结构共享），即如果对象中的一个节点发生变化

### redux 的 immutable 使用 immutable 之前和之后有什么区别？

### immutable.js 的作用， 配合 redux 、reselect 使用的时候，是不是就需要再手动浅拷贝了？
