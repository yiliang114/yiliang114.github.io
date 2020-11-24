---
layout: CustomPages
title: 数据结构
date: 2020-08-31
aside: false
---

# 数据结构

## 简介

### 树

1. B+树的简单实现（未考虑并发）
   B+ 树是一种树数据结构，是一个 n 叉树，每个节点通常有多个孩子，一颗 B+树包含根节点、内部节点和叶子节点。根节点可能是一个叶子节点，也可能是一个包含两个或两个以上孩子节点的节点。
   B+ 树通常用于数据库和操作系统的文件系统中。 NTFS, ReiserFS, NSS, XFS, JFS, ReFS 和 BFS 等文件系统都在使用 B+树作为元数据索引。
   B+ 树元素自底向上插入，其特点是能够保持数据稳定有序，其插入与修改拥有较稳定的对数时间复杂度。
2. 字典树的构建

### cache

LRU 是 Least Recently Used 的缩写，即最近最少使用，是一种常用的页面置换算法，选择最近最久未使用的页面予以淘汰。该算法赋予每个页面一个访问字段，用来记录一个页面自上次被访问以来所经历的时间 t，当须淘汰一个页面时，选择现有页面中其 t 值最大的，即最近最久未使用的页面予以淘汰。
LFU（least frequently used (LFU) page-replacement algorithm）。即最不经常使用页置换算法，要求在页置换时置换引用计数最小的页，因为经常使用的页应该有一个较大的引用次数。但是有些页在开始时使用次数很多，但以后就不再使用，这类页将会长时间留在内存中，因此可以将引用计数寄存器定时右移一位，形成指数衰减的平均使用次数。

### 堆

堆是一种带有顺序结构的完全二叉树，分为大根堆和小根堆，根据完全二叉和父子大小关系，利用数组结构比较容易实现堆结果。另外 golang 本身的堆实现(container/heap.go)则使用了 sort 接口，更加灵活。

### 链表

golang 实现的单链表和双链表结构

### 线性表：数组与链表、队列与栈

介绍了基本数据结构之线性表的特点和原理以及 js 的算法实现。
由于 js 语言本身的特点，线性表在 js 中主要以数组的应用为主，而 js 数组本身也并不是传统意义上的连续线性表。

### 哈希表：js 对象与哈希表

js 对象大家都用的很多，但其底层的哈希表特性你是否清楚？
在这篇文章里，小茄会用最平白易懂的语言来讲哈希结构的原理、构造方法，当然，还有哈希表在 js 中的应用。

### 树：js 中的树与二叉树

树是一种带有层次的数据结构，分层特性可以用于实现数据存储和快速查找。
比较常见的应用场景就是各种目录结构，如文件目录、DOM 结构等，由于每指定一层就是一层筛选，所以可以用于快速查找。
js 中可以通过对象的哈希结构来实现树结构，两种数据结构结合，速度更快。

### 跳跃表

增加了向前指针的链表叫作跳表。跳表全称叫做跳跃表，简称跳表。跳表是一个随机化的数据结构，实质就是一种可以进行二分查找的有序链表。跳表在原有的有序链表上面增加了多级索引，通过索引来实现快速查找。跳表不仅能提高搜索性能，同时也可以提高插入和删除操作的性能。

## Code 说明

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

### Hash

```js
export default function Hash(key: string, mapLength: number = 50): number {
  return hashCode(key) % mapLength;
}

/**
 * Get the character code of a string
 */
function hashCode(string: string): number {
  let hash = 5381;
  let index = string.length;

  while (index) {
    hash = (hash * 33) ^ string.charCodeAt(--index);
  }

  return hash >>> 0;
}
```

### LinkedList

```js
// LinkedList
//
// ex. A list of objects with values and nexts to other values
//
// vowels: ['a', next] -> ['b', next] -> ['c', next]
//         ^^^^^^^^^^^   node             ^ data  ^ next
//
// Random Access: O(n)
// Insertion/Deletion: O(1)
//

export default class LinkedList {
  head: Node;

  tail: Node;

  integrity = new Set();

  constructor() {
    this.head = new Node({});
  }

  isEmpty(): boolean {
    return !!this.head;
  }

  revese(node: Node = this.head) {
    if (!node || !node.next) return node;
    const reversedNode = this.revese(node.next);
    node.next.next = node;
    node.next = null;
    return reversedNode;
  }

  delete(node: Node) {
    let curr = this.head;
    let prev = null;
    while (curr) {
      if (curr === node) {
        if (prev) {
          prev.next = curr.next;
          curr = null;
        } else {
          this.head = curr.next;
        }
        break;
      } else {
        prev = curr;
        curr = curr.next;
      }
    }
  }

  /**
   * Can be done with merge sort, can be O(nlogn) complexity
   * Similar to insertion sort
   * @complexity: O(n^2)
   */
  sort() {
    let { head } = this;

    while (head.hasNext()) {
      let innerHead = this.head;

      while (innerHead.hasNext()) {
        if (head.data > innerHead.data && head.data < innerHead.next.data) {
          // inserts
        }
        innerHead = innerHead.next;
      }
      head = head.next;
    }
  }

  /**
   * Find a node by its data
   */
  find(data: any): Node | false {
    let node = this.head;
    while (node.hasNext()) {
      if (node.data === data) {
        return node;
      }
      node = node.next;
    }
    return false;
  }

  insertAfter = this.insert;

  insert(data: any, begin?: Node): boolean {
    const node = new Node(data);
    if (begin && this.integrity.has(node)) return false;
    const headNext = (begin || this.head).next;

    this.integrity.add(node);
    this.head.next = node;
    this.head.next.next = headNext;

    return true;
  }

  toString() {
    const items = [];
    let node = this.head;
    items.push(node);

    while (node.next) {
      items.push(node.next);
      node = node.next;
    }

    return items;
  }
}

class Node {
  data: number | string = 0;

  next: Node | boolean = false;

  constructor(data: any = {}, next: Node | boolean = false) {
    this.data = data;
    this.next = next;
  }

  hasNext(): boolean {
    return this.next !== false;
  }

  /**
   * Remove first link
   */
  remove() {
    if (!this.isEmpty() && this.head.hasNext()) {
      this.head = this.head.next;
    }
  }

  /**
   * Append after node
   */
  append(data: any): boolean {
    const node = new Node(data);
    const { next } = this;

    node.next = next;
    this.next = node;

    return true;
  }
}
```

### DoublyLinkedList

```js
class Node {
  data: Object = {};

  next: Node | boolean = false;

  constructor(data: any = {}, next: Node | boolean = false) {
    this.data = data;
    this.next = next;
  }

  hasNext(): boolean {
    return this.next !== false;
  }
}

export default class DoublyLinkedList {
  head: Node;

  tail: Node;

  head: Node;

  integrity = new Set();

  constructor() {
    this.head = new Node({});
    this.tail = this.head;
  }

  isEmpty(): boolean {
    return !!this.head;
  }

  // Remove first link
  remove() {
    if (!this.isEmpty() && this.head.hasNext()) {
      this.head = this.head.next;
    }
  }

  has() {}

  next() {}

  // @TODO
  // insertList(list: DoublyLinkedList): bool {}

  /**
   * Append node to end of list
   */
  insert(data: any, begin?: Node): boolean {
    const target: Node = begin || this.tail;
    const node: Node = new Node(data);

    const tempNext = target.next;
    node.next = tempNext;

    target.next = node;

    return true;
  }
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

### HashMap

```js
/**
 * A Map is used to map keys to values. It uses a hash function to compute
 * an index that maps to a value. Order of insertino is not guaranteed in hash
 * maps.
 *
 * TODO: Bucket collision detection and handling
 * @flow
 */
import Hash from './Hash';

function HashMap() {
  this.items = [];
  this.mapLength = 50;
}

HashMap.prototype.insert = function insert(key: any, value: any): HashMap {
  const generatedHashCode = Hash(key, this.mapLength);
  this.items[generatedHashCode] = value;
  return this;
};

HashMap.prototype.all = function all(): any[] {
  return this.items.filter((i: any): boolean => !!i);
};

/**
 * Search
 *
 * TODO:   Convert bucket type to array, loop through when accessing
 * @desc   Complexity: N/A, depends on strength of hash
 */
HashMap.prototype.get = function get(key: any): any {
  const generatedHashCode = Hash(key, this.mapLength);
  return this.items[generatedHashCode];
};

HashMap.prototype.remove = function remove(key: any): HashMap {
  const generatedHashCode = Hash(key, this.mapLength);
  this.items.splice(generatedHashCode, 1);
  return this;
};

export default HashMap;
```

### PriorityQueue

```js
/**
 * A Priority Queue is a special kind of queue that sorts its values
 * This implementation uses numbers to denote the priority of elements
 *
 * Larger priority numbers denote a higher priority
 *
 * @flow
 */
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

### HashSet

```js
/**
 * Sets are unordered lists of objects
 *
 * Their order cannot be guaranteed to be the same as the order in
 * which they were inserted.
 *
 * @flow
 */
import Hash from './Hash';

function HashSet() {
  this.items = [];
  this.itemsLength = 0;
}

HashSet.prototype = {
  /**
   * Complexity: O(n)
   */
  add(value: any): boolean {
    this.items[Hash(value)] = value;
    this.itemsLength++;
    return true;
  },

  /**
   * Complexity: O(1)
   */
  contains(value: any): boolean {
    return !!this.items[Hash(value)];
  },

  /**
   * Complexity: O(1)
   */
  remove(value: any) {
    this.items[Hash(value)] = null;
    this.itemsLength--;
  },

  /**
   * Complexity: O(1)
   *
   * This complexity is a bit weird in Javascript. The array needs to be filtered
   * to remove null values, which are added when creating an array with a fixed
   * length (ex. array[42] = 'some')
   */
  all(): any[] {
    return this.items.filter((i: any): boolean => !!i); // eslint-disable-line
  },
};

export default HashSet;
```

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

### Tree

```js
class Node {
  children: Node[];

  value: string | null;

  constructor(value: any = null, children: Node[] = []) {
    this.children = children;
    this.value = value;
  }
}

export default class Tree {
  root: Node = new Node();

  add(node: Node, value: string): Node {
    const child = new Node(value);
    node.children.push(child);
    return child;
  }

  remove() {}

  find(value: any, node: Node): boolean {
    if (node.value === value) return true;
    if (node.children.length < 1) return false;

    for (const child of node.children) {
      this.find(value, child);
    }
  }
}
```

### Trie

```js
export default function PrefixTrie(words: Array<string>) {
  const trie = new Map();
  for (const word of words) {
    let tmp = trie;
    for (const char of Array.from(word)) {
      if (!tmp.has(char)) {
        tmp.set(char, new Map());
      }
      tmp = tmp.get(char);
    }
    tmp.set('END', null);
  }
  return trie;
}
```
