---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

## Vue-Diff

### 在 diff 的过程中，指针的具体如何移动？及哪些部分发生了变化？

### insertedVnodeQueue 又是何用？为何一直带着？

### 在移动这部分直接操作的 oldChildren，然而 oldChildren 会发生移动么？那么到底是谁发生了移动呢？

### 匹配成功后进行的 patchVnode 是做了什么？为什么的有的紧接着要进行 dom 操作，有的没有？

### vnode 的转换过程 和 dom-diff 的过程

https://juejin.im/post/5c8e5e4951882545c109ae9c#heading-5

### key 的作用

1. 让 vue 精准的追踪到每一个元素，高效的更新虚拟 DOM。
2. 触发过渡

```html
<transition>
  <span :key="text">{{ text }}</span>
</transition>
```

当 text 改变时，这个元素的 key 属性就发生了改变，在渲染更新时，Vue 会认为这里新产生了一个元素，而老的元素由于 key 不存在了，所以会被删除，从而触发了过渡。

采用 diff 算法来对比新旧虚拟节点，从而更新节点。

在 vue 的 diff 函数中。在交叉对比的时候，当新节点跟旧节点头尾交叉对比没有结果的时候，会根据新节点的 key 去对比旧节点数组中的 key，从而找到相应旧节点（这里对应的是一个 key => index 的 map 映射）。如果没找到就认为是一个新增节点。而如果没有 key，那么就会采用一种遍历查找的方式去找到对应的旧节点。一种一个 map 映射，另一种是遍历查找。相比而言。map 映射的速度更快。

使用 key 可以使得 DOM diff 更加高效，避免不必要的列表项更新。假设 `todo.id` 对此列表是唯一且稳定的，如果将此数据作为唯一键，那么 React 将能够对元素进行重新排序，而无需重新创建它们。

vue 部分源码如下：

```js
// vue项目  src/core/vdom/patch.js  -488行
// oldCh 是一个旧虚拟节点数组，
if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
idxInOld = isDef(newStartVnode.key)
  ? oldKeyToIdx[newStartVnode.key]
  : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
```

创建 map 函数

```js
function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key;
  const map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}
```

遍历寻找

```js
// sameVnode 是对比新旧节点是否相同的函数
function findIdxInOld(node, oldCh, start, end) {
  for (let i = start; i < end; i++) {
    const c = oldCh[i];

    if (isDef(c) && sameVnode(node, c)) return i;
  }
}
```

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
