---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 安全地使用索引作为键的条件是什么?

有三个条件可以确保，使用索引作为键是安全的：

列表项是静态的，它们不会被计算，也不会更改。
列表中的列表项没有 ids 属性。
列表不会被重新排序或筛选。

### keys 是否需要全局唯一?

数组中使用的键在其同级中应该是唯一的，但它们不需要是全局唯一的。也就是说，你可以在两个不同的数组中使用相同的键。例如，下面的 book 组件在不同的组件中使用相同的数组：

```js
function Book(props) {
  const index = (
    <ul>
      {props.pages.map(page => (
        <li key={page.id}>{page.title}</li>
      ))}
    </ul>
  );
  const content = props.pages.map(page => (
    <div key={page.id}>
      <h3>{page.title}</h3>
      <p>{page.content}</p>
      <p>{page.pageNumber}</p>
    </div>
  ));
  return (
    <div>
      {index}
      <hr />
      {content}
    </div>
  );
}
```

### 索引作为键的影响是什么?

Keys 应该是稳定的，可预测的和唯一的，这样 React 就能够跟踪元素。

在下面的代码片段中，每个元素的键将基于列表项的顺序，而不是绑定到即将展示的数据上。这将限制 React 能够实现的优化。

```jsx
{
  todos.map((todo, index) => <Todo {...todo} key={index} />);
}
```

假设 `todo.id` 对此列表是唯一且稳定的，如果将此数据作为唯一键，那么 React 将能够对元素进行重新排序，而无需重新创建它们。

```jsx
{
  todos.map(todo => <Todo {...todo} key={todo.id} />);
}
```

### 写 React / Vue 项目时为什么要在组件中写 key，其作用是什么

- 自己的答案：

react 和 vue 都是采用 diff 算法，在组件中写入 key 值，在新老节点对比时，根据·可以值不同，可以准确找到需要渲染的节点，这样可以减少渲染的时间，优化性能。

- 别人的答案：

vue 和 react 都是采用 diff 算法来对比新旧虚拟节点，从而更新节点。在 vue 的 diff 函数中。可以先了解一下 diff 算法。
在交叉对比的时候，当新节点跟旧节点头尾交叉对比没有结果的时候，会根据新节点的 key 去对比旧节点数组中的 key，从而找到相应旧节点（这里对应的是一个 key => index 的 map 映射）。如果没找到就认为是一个新增节点。而如果没有 key，那么就会采用一种遍历查找的方式去找到对应的旧节点。一种一个 map 映射，另一种是遍历查找。相比而言。map 映射的速度更快。

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

- 思考：

知其然知其所以然，我需要看源码，需要更加深入

```

```
