---
layout: CustomPages
title: 前端与数据结构-链表
date: 2020-11-21
aside: false
draft: true
---

# 链表

## Reversed Linked List Traversal

The task is to traverse the given linked list in reversed order.

For example for the following linked list:

```
12 → 99 → 37
```

The order of traversal should be:

```
37 → 99 → 12
```

The time complexity is `O(n)` because we visit every node only once.

```js
function reverseTraversalRecursive(node, callback) {
  if (node) {
    reverseTraversalRecursive(node.next, callback);
    callback(node.value);
  }
}

export default function reverseTraversal(linkedList, callback) {
  reverseTraversalRecursive(linkedList.head, callback);
}
```

## Linked List Traversal

The task is to traverse the given linked list in straight order.

For example for the following linked list:

```
12 → 99 → 37
```

The order of traversal should be:

```
12 → 99 → 37
```

The time complexity is `O(n)` because we visit every node only once.

```js
export default function traversal(linkedList, callback) {
  let currentNode = linkedList.head;

  while (currentNode) {
    callback(currentNode.value);
    currentNode = currentNode.next;
  }
}
```
