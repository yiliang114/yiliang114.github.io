---
title: Fiber
date: '2020-10-26'
draft: true
---

### 什么是 React Fiber?

Fiber 是 React v16 中新的 `reconciliation` 引擎，或核心算法的重新实现。React Fiber 的目标是提高对动画，布局，手势，暂停，中止或者重用任务的能力及为不同类型的更新分配优先级，及新的并发原语等领域的适用性。

### React Fiber 的主要目标是什么?

`React Fiber` 的目标是提高其在动画、布局和手势等领域的适用性。它的主要特性是 **incremental rendering**: 将渲染任务拆分为小的任务块并将任务分配到多个帧上的能力。

### Fiber

React16 将内部组件层改成 Fiber 这种数据结构，因此它的架构名也改叫 Fiber 架构。Fiber 节点拥有 return, child, sibling 三个属性，分别对应父节点， 第一个孩子， 它右边的兄弟， 有了它们就足够将一棵树变成一个链表， 实现深度优化遍历。

#### alternate

在任何情况下，每个组件实例最多有两个 fiber 何其关联。一个是被 commit 过后的 fiber，即它所包含的副作用已经被应用到了 DOM 上了，称它为 current fiber；另一个是现在未被 commit 的 fiber，称为 work-in-progress fiber。

current fiber 的 alternate 是 work-in-progress fiber， 而 work-in-progress fiber 的 alternate 是 current fiber。

#### Hooks 为什么要用数组

Hooks 的本质就是一个数组。 那么为什么 hooks 要用数组？ 我们可以换个角度来解释，如果不用数组会怎么样？

```js
function Form() {
  // 1. Use the name state variable
  const [name, setName] = useState('Mary');

  // 2. Use an effect for persisting the form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Use the surname state variable
  const [surname, setSurname] = useState('Poppins');

  // 4. Use an effect for updating the title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

基于数组的方式，Form 的 hooks 就是 [hook1, hook2, hook3, hook4],
我们可以得出这样的关系， hook1 就是[name, setName] 这一对，
hook2 就是 persistForm 这个。

如果不用数组实现，比如对象，Form 的 hooks 就是

```js
{
  'key1': hook1,
  'key2': hook2,
  'key3': hook3,
  'key4': hook4,
}
```

那么问题是 key1，key2，key3，key4 怎么取呢？

关于 React hooks 的本质研究，更多请查看[React hooks: not magic, just arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)

React 将`如何确保组件内部hooks保存的状态之间的对应关系`这个工作交给了
开发人员去保证，即你必须保证 HOOKS 的顺序严格一致，具体可以看 React 官网关于 Hooks Rule 部分。
