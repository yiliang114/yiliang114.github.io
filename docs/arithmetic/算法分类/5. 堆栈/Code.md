---
layout: CustomPages
title: Stack and Queue Code
date: 2020-11-29
aside: false
draft: true
---

# Stack and Queue Code

### Stack

```js
/**
 * Stacks allow data to be popped and pushed to a stack
 * Last in, first out (LIFO)
 *
 * ---
 * |a|
 * |b|
 * |c|
 * ---
 *
 * stack.pop()
 *
 * ---
 * |b|
 * |c|
 * ---   -> a
 *
 * stack.push(d)
 *
 * ---
 * |d|
 * |b|
 * |c|
 * ---   -> b
 *
 * @flow
 */
export default class Stack {
  items: [];

  constructor(items?: any[]) {
    this.items = items || [];
  }

  pop(): any {
    const isEnd = !!this.items.length;

    if (isEnd) {
      const item = this.items[this.items.length - 1];
      this.items.splice(this.items.length - 1, 1);
      return item;
    }

    return false;
  }

  push(item: any): Stack {
    this.items.push(item);
    return this;
  }

  empty(): boolean {
    return this.items.length === 0;
  }

  peek(): any {
    return this.items[this.items.length - 1];
  }
}
```

### Queue

```js
export default class Queue<T> {
  items: T[];

  constructor(items: T[] = []) {
    this.items = items;
  }

  push(item: T): T[] {
    this.items.push(item);
    return this.items;
  }

  pop(): T {
    return this.items.shift();
  }

  take(): T {
    const [item] = this.items.splice(0, 1);
    return item;
  }

  size(): number {
    return this.items.length;
  }
}

class Node {
  next = null;

  constructor(data = {}) {
    this.data = data;
  }
}

export class QueueLinkedList {
  first = null;

  last = null;

  /**
   * Add an item to the queue
   */
  add(data) {
    const node = new Node(data);
    let { last, first } = this;

    if (first === null) {
      first = node;
    }
    if (last !== null) {
      last.next = node;
    }
    last = node;
  }

  /**
   * Take an item from the queue
   */
  remove() {
    let { first } = this;
    const { data } = first;
    if (first === null) {
      return null;
    }
    if (first.next === null) {
      this.last = null;
      first = null;
    } else {
      first = first.next;
    }
    return data;
  }
}
```

### PriorityQueue

```js
import MaxHeap from './MaxHeap';

export class PriorityNode<T> {
  priority: number;

  data: T;
}

export default class PriorityQueue {
  items: Array<PriorityNode>;

  constructor(items: Array<PriorityNode>) {
    this.heap = new MaxHeap();
  }

  insert(node: PriorityNode) {}
}
```

### DAG

```js
import Queue from './Queue';

export class Node {
  id: number;

  parents: Array<number> = [];

  children: Array<number> = [];

  pi: number = Infinity;

  weight: number;

  data: any;
}

/**
 * d(v): distance from start to vertex v
 *       Initially assume that d(v) is infinity
 *
 * pi(v): predecessor on current best path to d(v)
 *
 * Optimal Substructure: Substructures of shortest path are shortest paths
 *
 * Relaxation: If there is a shorter path to d(v), update d(v) and pi(v)
 *             if (d(v) > d(u) + weight(u, v))
 *                d(v) = d(u) + weight(u, v))
 *                pi(v) = u
 */
export default class DAGAdjacencyList {
  /**
   * Space complexity: Θ(|V|^2)
   *
   * Vertex List:
   *  [1    =>    [1, 3]]
   *  [2    =>    [2, 4]]
   *  [3    =>    [3, 5]]
   *   ^ the index ^ the outgoing vertexes from node 1. Node.children property
   *
   * Vertex matrixes are better for graphs that are more dense
   */
  adjacencyList: Node[] = [];

  /**
   * Depth-First Search (DFS)
   * @param {number} the starting node
   * @param {number} the node to search for
   *
   * @TODO: Prevent cycles
   * @TODO: Add runtime
   */
  breadthFirstSearch(target: Node): boolean | Node {
    const queue = new Queue();

    if (!this.adjacencyList[target.id]) {
      return false;
    }

    // Push the node's immediate children of the first node
    this.adjacencyList[0].children.forEach(child => queue.push(this.adjacencyList[child]));

    while (queue.size() > 0) {
      const currentSearchNode = queue.pop();

      if (currentSearchNode.id === target.id) {
        return currentSearchNode;
      }

      this.adjacencyList[currentSearchNode.id].children.forEach(child => queue.push(this.adjacencyList[child]));
    }

    return false;
  }

  // Single Source Shortest Path (SSSP)
  // shortestPath(node: number, target: number): bool {

  /**
   * Depth-First Search is most easily implemented recursively
   * @TODO: Implement this using a Stack instead of implementing recursively
   *        to avoid call stack overflow
   * @param {number} node
   * @param {number} target
   */
  depthFirstSearch(node: Node, target: Node): boolean {
    const { children } = this.adjacencyList[node.id];

    // Base case
    if (node === target) return true;

    // Recursively DFS each child of the given node
    for (let i = 0; i < children; i++) {
      if (this.depthFirstSearch(children[i], target) === true) {
        return true;
      }
    }

    return false;
  }

  /**
   * A DAG must have at least one vertex that has no incoming edges
   * (no nodes pointing to it)
   */
  hasCycle() {}

  insert(node: Node) {
    // Add the node to the adjacency list
    if (!this.adjacencyList[node.id]) {
      this.adjacencyList[node.id] = node;
    }

    // Add the node to each parent
    if (node.parents) {
      node.parents.forEach((parent: number) => {
        this.adjacencyList[parent].children.push(node.id);
      });
    }
  }
}

export class DAGMatrix {
  /**
   * Space complexity: Θ(|V| + |E|)
   *
   * Vertex Matrix:
   *  Each array location represents a list of verticies
   *  For example, the array indexs (1, 4) will represent if the relationship
   *  between node 1 to node 4 exists.
   *
   * Vertex matrixes are better for graphs that are more dense
   */
  adjacencyMatrix: boolean[][] = [];
}
```

### LRU

```js
class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

class DLL {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  add(val) {
    const node = new Node(val);
    const { tail } = this;
    if (tail) {
      node.prev = tail;
      node.next = null;
      this.tail = node;
      this.tail.next = node;
    }
    if (!this.head) this.head = node;
    this.tail = node;
    this.size++;
    return node;
  }

  remove(node) {
    const { next } = node;
    const { prev } = node;
    if (!prev && !next) {
      this.head = null;
      this.tail = null;
    }
    if (prev) {
      prev.next = next;
      if (next) next.prev = prev;
    }
    node.prev = null;
    node.next = null;
    this.size--;
  }
}

/**
 * @param {number} capacity
 */
const LRUCache = function(capacity) {
  this.capacity = capacity;
  this.map = new Map();
  this.dll = new DLL();
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  if (!this.map.has(key)) return -1;
  const item = this.map.get(key);
  // move item to front of DLL
  this.dll.remove(item);
  const { head } = this.dll;
  if (head) {
    head.prev = item;
    item.next = head;
  }
  item.prev = null;
  this.dll.head = item;
  return item.val;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  // delete in doubly linked list
  if (this.dll.size === this.capacity) {
    this.map.delete(this.dll.tail.val);
    this.dll.remove(this.dll.tail);
  }
  const node = this.dll.add(value);
  this.map.set(key, node);
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
```
