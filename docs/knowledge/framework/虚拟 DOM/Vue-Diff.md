---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 在 diff 的过程中，指针的具体如何移动？及哪些部分发生了变化？

### insertedVnodeQueue 又是何用？为何一直带着？

### 在移动这部分直接操作的 oldChildren，然而 oldChildren 会发生移动么？那么到底是谁发生了移动呢？

### 匹配成功后进行的 patchVnode 是做了什么？为什么的有的紧接着要进行 dom 操作，有的没有？

### key 的作用

1. 让 vue 精准的追踪到每一个元素，高效的更新虚拟 DOM。
2. 触发过渡

```html
<transition>
  <span :key="text">{{ text }}</span>
</transition>
```

当 text 改变时，这个元素的 key 属性就发生了改变，在渲染更新时，Vue 会认为这里新产生了一个元素，而老的元素由于 key 不存在了，所以会被删除，从而触发了过渡。

### vnode 的转换过程 和 dom-diff 的过程

https://juejin.im/post/5c8e5e4951882545c109ae9c#heading-5

### index 不能作为 key 的原因

循环比较虚拟 dom， 会一层一层进行遍历。

通俗描述原因： 本来不一样的东西，现在变成一样了。。。。 因为 key 变成一样了，就判断是同个东西

场景：

1. 中间插入节点
2. 中间删除节点

会徒增很多的比较。

### Diff 算法

- 同个节点，会用 patch 进行打补丁操作
- 不同节点，会进行 insert 和 delete 操作
- 判断为一样的类型
  - key
  - tag
  - 如果是 input 标签的话，需要 type 也一样。
