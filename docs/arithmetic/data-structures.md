---
layout: CustomPages
title: 数据结构
date: 2020-08-31
aside: false
---

## 数据结构

## 简介

### 跳跃表

增加了向前指针的链表叫作跳表。跳表全称叫做跳跃表，简称跳表。跳表是一个随机化的数据结构，实质就是一种可以进行二分查找的有序链表。跳表在原有的有序链表上面增加了多级索引，通过索引来实现快速查找。跳表不仅能提高搜索性能，同时也可以提高插入和删除操作的性能。

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

## Code 说明

### BinarySearchTree

```js
class Node {
  data: number;

  parent: Node;

  left: Node;

  right: Node;

  constructor(data: number) {
    this.data = data;
  }

  isLeaf(): boolean {
    return !this.left && !this.right;
  }
}

export default class BinarySearchTree {
  root: Node;

  items = [];

  constructor(items: Array<number>) {
    for (const item of items) this.add(item);
  }

  toArray(node?: Node): boolean | void {
    if (!node) node = this.root;

    if (node.isLeaf()) {
      if (node.left) this.items.push(node.left.data);
      this.items.push(node.data);
      if (node.right) this.items.push(node.right.data);
      return true;
    }

    if (node.left) this.toArray(node.left);
    this.items.push(node.data);
    if (node.right) this.toArray(node.right);
  }

  add(element: number, root?: Node): boolean {
    let _root = root;

    if (!this.root) {
      this.root = new Node(element);
      return true;
    }

    if (!_root) _root = this.root;

    if (!_root.data) {
      _root.data = element;
      return true;
    }

    if (_root.data > element) {
      if (!_root.left) {
        _root.left = new Node(element);
        return true;
      }
      return this.add(element, _root.left);
    }

    if (!_root.right) {
      _root.right = new Node(element);
      return true;
    }

    return this.add(element, _root.right);
  }

  remove() {}

  find() {}
}
```

### BTree

```js
class TreeNode {
  keys: Array<number> = [];

  children: Array<TreeNode> = [];

  parent: TreeNode;

  isLeaf() {
    return this.children.length === 0;
  }

  findMiddleChild() {
    return this.children[Math.ceil(this.children.length / 2)];
  }
}

export default class BTree {
  root: TreeNode = new TreeNode();

  t: number = 3;

  search(value: number, node: TreeNode = this.root): string {
    // For each key of the node's keys
    for (let i = 0; i < node.keys.length; i++) {
      // If the value is less than the current key
      if (value === node.keys[i]) {
        return value;
      }
      if (value < node.keys[i]) {
        if (node.children[i].keys.length === 0) {
          return -1;
        }
        return this.search(value, node.children[i]);
      }
    }

    return '';
  }

  insert(value: number, node = this.root): boolean {
    // For each key of the node's keys
    for (let i = 0; i < node.keys.length; i++) {
      // If the value is less than the current key
      if (value === node.keys[i]) {
        return value;
      }
      if (value < node.keys[i]) {
        if (node.children[i].keys.length === 0) {
          return -1;
        }
        return this.search(value, node.children[i]);
      }
    }

    return true;
  }

  split(node: TreeNode) {
    // If the node doesn't need to be split, abort
    if (node.children.length < this.t) {
    } else {
      // Otherwise, Split

      // Find index of 'middle' key
      const middleIndex = Math.ceil(node.keys.length / 2);
    }
  }
}
```

### Queue

```js
/**
 * Last in, last out (LILO)
 *
 * @TODO: Wite a new implementation of a queue that uses a linked list. This will
 *        make the pop() method O(1) time
 *
 * @flow
 */
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

## Bloom Filter

A **bloom filter** is a space-efficient probabilistic
data structure designed to test whether an element
is present in a set. It is designed to be blazingly
fast and use minimal memory at the cost of potential
false positives. False positive matches are possible,
but false negatives are not – in other words, a query
returns either "possibly in set" or "definitely not in set".

Bloom proposed the technique for applications where the
amount of source data would require an impractically large
amount of memory if "conventional" error-free hashing
techniques were applied.

### Algorithm description

An empty Bloom filter is a bit array of `m` bits, all
set to `0`. There must also be `k` different hash functions
defined, each of which maps or hashes some set element to
one of the `m` array positions, generating a uniform random
distribution. Typically, `k` is a constant, much smaller
than `m`, which is proportional to the number of elements
to be added; the precise choice of `k` and the constant of
proportionality of `m` are determined by the intended
false positive rate of the filter.

Here is an example of a Bloom filter, representing the
set `{x, y, z}`. The colored arrows show the positions
in the bit array that each set element is mapped to. The
element `w` is not in the set `{x, y, z}`, because it
hashes to one bit-array position containing `0`. For
this figure, `m = 18` and `k = 3`.

![Bloom Filter](https://upload.wikimedia.org/wikipedia/commons/a/ac/Bloom_filter.svg)

### Operations

There are two main operations a bloom filter can
perform: _insertion_ and _search_. Search may result in
false positives. Deletion is not possible.

In other words, the filter can take in items. When
we go to check if an item has previously been
inserted, it can tell us either "no" or "maybe".

Both insertion and search are `O(1)` operations.

### Making the filter

A bloom filter is created by allotting a certain size.
In our example, we use `100` as a default length. All
locations are initialized to `false`.

#### Insertion

During insertion, a number of hash functions,
in our case `3` hash functions, are used to create
hashes of the input. These hash functions output
indexes. At every index received, we simply change
the value in our bloom filter to `true`.

#### Search

During a search, the same hash functions are called
and used to hash the input. We then check if the
indexes received _all_ have a value of `true` inside
our bloom filter. If they _all_ have a value of
`true`, we know that the bloom filter may have had
the value previously inserted.

However, it's not certain, because it's possible
that other values previously inserted flipped the
values to `true`. The values aren't necessarily
`true` due to the item currently being searched for.
Absolute certainty is impossible unless only a single
item has previously been inserted.

While checking the bloom filter for the indexes
returned by our hash functions, if even one of them
has a value of `false`, we definitively know that the
item was not previously inserted.

### False Positives

The probability of false positives is determined by
three factors: the size of the bloom filter, the
number of hash functions we use, and the number
of items that have been inserted into the filter.

The formula to calculate probablity of a false positive is:

( 1 - e <sup>-kn/m</sup> ) <sup>k</sup>

`k` = number of hash functions

`m` = filter size

`n` = number of items inserted

These variables, `k`, `m`, and `n`, should be picked based
on how acceptable false positives are. If the values
are picked and the resulting probability is too high,
the values should be tweaked and the probability
re-calculated.

### Applications

A bloom filter can be used on a blogging website. If
the goal is to show readers only articles that they
have never seen before, a bloom filter is perfect.
It can store hashed values based on the articles. After
a user reads a few articles, they can be inserted into
the filter. The next time the user visits the site,
those articles can be filtered out of the results.

Some articles will inevitably be filtered out by mistake,
but the cost is acceptable. It's ok if a user never sees
a few articles as long as they have other, brand new ones
to see every time they visit the site.

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Bloom_filter)
- [Bloom Filters by Example](http://llimllib.github.io/bloomfilter-tutorial/)
- [Calculating False Positive Probability](https://hur.st/bloomfilter/?n=4&p=&m=18&k=3)
- [Bloom Filters on Medium](https://blog.medium.com/what-are-bloom-filters-1ec2a50c68ff)
- [Bloom Filters on YouTube](https://www.youtube.com/watch?v=bEmBh1HtYrw)

```js
export default class BloomFilter {
  /**
   * @param {number} size - the size of the storage.
   */
  constructor(size = 100) {
    // Bloom filter size directly affects the likelihood of false positives.
    // The bigger the size the lower the likelihood of false positives.
    this.size = size;
    this.storage = this.createStore(size);
  }

  /**
   * @param {string} item
   */
  insert(item) {
    const hashValues = this.getHashValues(item);

    // Set each hashValue index to true.
    hashValues.forEach(val => this.storage.setValue(val));
  }

  /**
   * @param {string} item
   * @return {boolean}
   */
  mayContain(item) {
    const hashValues = this.getHashValues(item);

    for (let hashIndex = 0; hashIndex < hashValues.length; hashIndex += 1) {
      if (!this.storage.getValue(hashValues[hashIndex])) {
        // We know that the item was definitely not inserted.
        return false;
      }
    }

    // The item may or may not have been inserted.
    return true;
  }

  /**
   * Creates the data store for our filter.
   * We use this method to generate the store in order to
   * encapsulate the data itself and only provide access
   * to the necessary methods.
   *
   * @param {number} size
   * @return {Object}
   */
  createStore(size) {
    const storage = [];

    // Initialize all indexes to false
    for (let storageCellIndex = 0; storageCellIndex < size; storageCellIndex += 1) {
      storage.push(false);
    }

    const storageInterface = {
      getValue(index) {
        return storage[index];
      },
      setValue(index) {
        storage[index] = true;
      },
    };

    return storageInterface;
  }

  /**
   * @param {string} item
   * @return {number}
   */
  hash1(item) {
    let hash = 0;

    for (let charIndex = 0; charIndex < item.length; charIndex += 1) {
      const char = item.charCodeAt(charIndex);
      hash = (hash << 5) + hash + char;
      hash &= hash; // Convert to 32bit integer
      hash = Math.abs(hash);
    }

    return hash % this.size;
  }

  /**
   * @param {string} item
   * @return {number}
   */
  hash2(item) {
    let hash = 5381;

    for (let charIndex = 0; charIndex < item.length; charIndex += 1) {
      const char = item.charCodeAt(charIndex);
      hash = (hash << 5) + hash + char; /* hash * 33 + c */
    }

    return Math.abs(hash % this.size);
  }

  /**
   * @param {string} item
   * @return {number}
   */
  hash3(item) {
    let hash = 0;

    for (let charIndex = 0; charIndex < item.length; charIndex += 1) {
      const char = item.charCodeAt(charIndex);
      hash = (hash << 5) - hash;
      hash += char;
      hash &= hash; // Convert to 32bit integer
    }

    return Math.abs(hash % this.size);
  }

  /**
   * Runs all 3 hash functions on the input and returns an array of results.
   *
   * @param {string} item
   * @return {number[]}
   */
  getHashValues(item) {
    return [this.hash1(item), this.hash2(item), this.hash3(item)];
  }
}
```

### Disjoint Set

**Disjoint-set** data structure (also called a union–find data structure or merge–find set) is a data
structure that tracks a set of elements partitioned into a number of disjoint (non-overlapping) subsets.
It provides near-constant-time operations (bounded by the inverse Ackermann function) to _add new sets_,
to _merge existing sets_, and to _determine whether elements are in the same set_.
In addition to many other uses (see the Applications section), disjoint-sets play a key role in Kruskal's algorithm for finding the minimum spanning tree of a graph.

![disjoint set](https://upload.wikimedia.org/wikipedia/commons/6/67/Dsu_disjoint_sets_init.svg)

_MakeSet_ creates 8 singletons.

![disjoint set](https://upload.wikimedia.org/wikipedia/commons/a/ac/Dsu_disjoint_sets_final.svg)

After some operations of _Union_, some sets are grouped together.

#### References

- [Wikipedia](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)
- [By Abdul Bari on YouTube](https://www.youtube.com/watch?v=wU6udHRIkcc&index=14&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

#### Code

<!-- DisjointSetItem -->

```js
export default class DisjointSetItem {
  /**
   * @param {*} value
   * @param {function(value: *)} [keyCallback]
   */
  constructor(value, keyCallback) {
    this.value = value;
    this.keyCallback = keyCallback;
    /** @var {DisjointSetItem} this.parent */
    this.parent = null;
    this.children = {};
  }

  /**
   * @return {*}
   */
  getKey() {
    // Allow user to define custom key generator.
    if (this.keyCallback) {
      return this.keyCallback(this.value);
    }

    // Otherwise use value as a key by default.
    return this.value;
  }

  /**
   * @return {DisjointSetItem}
   */
  getRoot() {
    return this.isRoot() ? this : this.parent.getRoot();
  }

  /**
   * @return {boolean}
   */
  isRoot() {
    return this.parent === null;
  }

  /**
   * Rank basically means the number of all ancestors.
   *
   * @return {number}
   */
  getRank() {
    if (this.getChildren().length === 0) {
      return 0;
    }

    let rank = 0;

    /** @var {DisjointSetItem} child */
    this.getChildren().forEach(child => {
      // Count child itself.
      rank += 1;

      // Also add all children of current child.
      rank += child.getRank();
    });

    return rank;
  }

  /**
   * @return {DisjointSetItem[]}
   */
  getChildren() {
    return Object.values(this.children);
  }

  /**
   * @param {DisjointSetItem} parentItem
   * @param {boolean} forceSettingParentChild
   * @return {DisjointSetItem}
   */
  setParent(parentItem, forceSettingParentChild = true) {
    this.parent = parentItem;
    if (forceSettingParentChild) {
      parentItem.addChild(this);
    }

    return this;
  }

  /**
   * @param {DisjointSetItem} childItem
   * @return {DisjointSetItem}
   */
  addChild(childItem) {
    this.children[childItem.getKey()] = childItem;
    childItem.setParent(this, false);

    return this;
  }
}
```

<!-- DisjointSet -->

```js
import DisjointSetItem from './DisjointSetItem';

export default class DisjointSet {
  /**
   * @param {function(value: *)} [keyCallback]
   */
  constructor(keyCallback) {
    this.keyCallback = keyCallback;
    this.items = {};
  }

  /**
   * @param {*} itemValue
   * @return {DisjointSet}
   */
  makeSet(itemValue) {
    const disjointSetItem = new DisjointSetItem(itemValue, this.keyCallback);

    if (!this.items[disjointSetItem.getKey()]) {
      // Add new item only in case if it not presented yet.
      this.items[disjointSetItem.getKey()] = disjointSetItem;
    }

    return this;
  }

  /**
   * Find set representation node.
   *
   * @param {*} itemValue
   * @return {(string|null)}
   */
  find(itemValue) {
    const templateDisjointItem = new DisjointSetItem(itemValue, this.keyCallback);

    // Try to find item itself;
    const requiredDisjointItem = this.items[templateDisjointItem.getKey()];

    if (!requiredDisjointItem) {
      return null;
    }

    return requiredDisjointItem.getRoot().getKey();
  }

  /**
   * Union by rank.
   *
   * @param {*} valueA
   * @param {*} valueB
   * @return {DisjointSet}
   */
  union(valueA, valueB) {
    const rootKeyA = this.find(valueA);
    const rootKeyB = this.find(valueB);

    if (rootKeyA === null || rootKeyB === null) {
      throw new Error('One or two values are not in sets');
    }

    if (rootKeyA === rootKeyB) {
      // In case if both elements are already in the same set then just return its key.
      return this;
    }

    const rootA = this.items[rootKeyA];
    const rootB = this.items[rootKeyB];

    if (rootA.getRank() < rootB.getRank()) {
      // If rootB's tree is bigger then make rootB to be a new root.
      rootB.addChild(rootA);

      return this;
    }

    // If rootA's tree is bigger then make rootA to be a new root.
    rootA.addChild(rootB);

    return this;
  }

  /**
   * @param {*} valueA
   * @param {*} valueB
   * @return {boolean}
   */
  inSameSet(valueA, valueB) {
    const rootKeyA = this.find(valueA);
    const rootKeyB = this.find(valueB);

    if (rootKeyA === null || rootKeyB === null) {
      throw new Error('One or two values are not in sets');
    }

    return rootKeyA === rootKeyB;
  }
}
```

### 双向链表

在计算机科学中, 一个 **双向链表(doubly linked list)** 是由一组称为节点的顺序链接记录组成的链接数据结构。每个节点包含两个字段，称为链接，它们是对节点序列中上一个节点和下一个节点的引用。开始节点和结束节点的上一个链接和下一个链接分别指向某种终止节点，通常是前哨节点或 null，以方便遍历列表。如果只有一个前哨节点，则列表通过前哨节点循环链接。它可以被概念化为两个由相同数据项组成的单链表，但顺序相反。

![Doubly Linked List](https://upload.wikimedia.org/wikipedia/commons/5/5e/Doubly-linked-list.svg)

两个节点链接允许在任一方向上遍历列表。

在双向链表中进行添加或者删除节点时,需做的链接更改要比单向链表复杂得多。这种操作在单向链表中更简单高效,因为不需要关注一个节点（除第一个和最后一个节点以外的节点）的两个链接,而只需要关注一个链接即可。

#### 基础操作的伪代码

##### 插入

```text
Add(value)
  Pre: value is the value to add to the list
  Post: value has been placed at the tail of the list
  n ← node(value)
  if head = ø
    head ← n
    tail ← n
  else
    n.previous ← tail
    tail.next ← n
    tail ← n
  end if
end Add
```

##### 删除

```text
Remove(head, value)
  Pre: head is the head node in the list
       value is the value to remove from the list
  Post: value is removed from the list, true; otherwise false
  if head = ø
    return false
  end if
  if value = head.value
    if head = tail
      head ← ø
      tail ← ø
    else
      head ← head.next
      head.previous ← ø
    end if
    return true
  end if
  n ← head.next
  while n = ø and value = n.value
    n ← n.next
  end while
  if n = tail
    tail ← tail.previous
    tail.next ← ø
    return true
  else if n = ø
    n.previous.next ← n.next
    n.next.previous ← n.previous
    return true
  end if
  return false
end Remove
```

##### 反向遍历

```text
ReverseTraversal(tail)
  Pre: tail is the node of the list to traverse
  Post: the list has been traversed in reverse order
  n ← tail
  while n = ø
    yield n.value
    n ← n.previous
  end while
end Reverse Traversal
```

#### 复杂度

#### 时间复杂度

| Access | Search | Insertion | Deletion |
| :----: | :----: | :-------: | :------: |
|  O(n)  |  O(n)  |   O(1)    |   O(1)   |

##### 空间复杂度

O(n)

#### 参考

- [Wikipedia](https://en.wikipedia.org/wiki/Doubly_linked_list)
- [YouTube](https://www.youtube.com/watch?v=JdQeNxWCguQ&t=7s&index=72&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

#### Code

<!-- DoublyLinkedListNode -->

```js
export default class DoublyLinkedListNode {
  constructor(value, next = null, previous = null) {
    this.value = value;
    this.next = next;
    this.previous = previous;
  }

  toString(callback) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
```

<!-- DoublyLinkedList -->

```js
import DoublyLinkedListNode from './DoublyLinkedListNode';
import Comparator from '../../utils/comparator/Comparator';

export default class DoublyLinkedList {
  /**
   * @param {Function} [comparatorFunction]
   */
  constructor(comparatorFunction) {
    /** @var DoublyLinkedListNode */
    this.head = null;

    /** @var DoublyLinkedListNode */
    this.tail = null;

    this.compare = new Comparator(comparatorFunction);
  }

  /**
   * @param {*} value
   * @return {DoublyLinkedList}
   */
  prepend(value) {
    // Make new node to be a head.
    const newNode = new DoublyLinkedListNode(value, this.head);

    // If there is head, then it won't be head anymore.
    // Therefore, make its previous reference to be new node (new head).
    // Then mark the new node as head.
    if (this.head) {
      this.head.previous = newNode;
    }
    this.head = newNode;

    // If there is no tail yet let's make new node a tail.
    if (!this.tail) {
      this.tail = newNode;
    }

    return this;
  }

  /**
   * @param {*} value
   * @return {DoublyLinkedList}
   */
  append(value) {
    const newNode = new DoublyLinkedListNode(value);

    // If there is no head yet let's make new node a head.
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;

      return this;
    }

    // Attach new node to the end of linked list.
    this.tail.next = newNode;

    // Attach current tail to the new node's previous reference.
    newNode.previous = this.tail;

    // Set new node to be the tail of linked list.
    this.tail = newNode;

    return this;
  }

  /**
   * @param {*} value
   * @return {DoublyLinkedListNode}
   */
  delete(value) {
    if (!this.head) {
      return null;
    }

    let deletedNode = null;
    let currentNode = this.head;

    while (currentNode) {
      if (this.compare.equal(currentNode.value, value)) {
        deletedNode = currentNode;

        if (deletedNode === this.head) {
          // If HEAD is going to be deleted...

          // Set head to second node, which will become new head.
          this.head = deletedNode.next;

          // Set new head's previous to null.
          if (this.head) {
            this.head.previous = null;
          }

          // If all the nodes in list has same value that is passed as argument
          // then all nodes will get deleted, therefore tail needs to be updated.
          if (deletedNode === this.tail) {
            this.tail = null;
          }
        } else if (deletedNode === this.tail) {
          // If TAIL is going to be deleted...

          // Set tail to second last node, which will become new tail.
          this.tail = deletedNode.previous;
          this.tail.next = null;
        } else {
          // If MIDDLE node is going to be deleted...
          const previousNode = deletedNode.previous;
          const nextNode = deletedNode.next;

          previousNode.next = nextNode;
          nextNode.previous = previousNode;
        }
      }

      currentNode = currentNode.next;
    }

    return deletedNode;
  }

  /**
   * @param {Object} findParams
   * @param {*} findParams.value
   * @param {function} [findParams.callback]
   * @return {DoublyLinkedListNode}
   */
  find({ value = undefined, callback = undefined }) {
    if (!this.head) {
      return null;
    }

    let currentNode = this.head;

    while (currentNode) {
      // If callback is specified then try to find node by callback.
      if (callback && callback(currentNode.value)) {
        return currentNode;
      }

      // If value is specified then try to compare by value..
      if (value !== undefined && this.compare.equal(currentNode.value, value)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  /**
   * @return {DoublyLinkedListNode}
   */
  deleteTail() {
    if (!this.tail) {
      // No tail to delete.
      return null;
    }

    if (this.head === this.tail) {
      // There is only one node in linked list.
      const deletedTail = this.tail;
      this.head = null;
      this.tail = null;

      return deletedTail;
    }

    // If there are many nodes in linked list...
    const deletedTail = this.tail;

    this.tail = this.tail.previous;
    this.tail.next = null;

    return deletedTail;
  }

  /**
   * @return {DoublyLinkedListNode}
   */
  deleteHead() {
    if (!this.head) {
      return null;
    }

    const deletedHead = this.head;

    if (this.head.next) {
      this.head = this.head.next;
      this.head.previous = null;
    } else {
      this.head = null;
      this.tail = null;
    }

    return deletedHead;
  }

  /**
   * @return {DoublyLinkedListNode[]}
   */
  toArray() {
    const nodes = [];

    let currentNode = this.head;
    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  /**
   * @param {*[]} values - Array of values that need to be converted to linked list.
   * @return {DoublyLinkedList}
   */
  fromArray(values) {
    values.forEach(value => this.append(value));

    return this;
  }

  /**
   * @param {function} [callback]
   * @return {string}
   */
  toString(callback) {
    return this.toArray()
      .map(node => node.toString(callback))
      .toString();
  }

  /**
   * Reverse a linked list.
   * @returns {DoublyLinkedList}
   */
  reverse() {
    let currNode = this.head;
    let prevNode = null;
    let nextNode = null;

    while (currNode) {
      // Store next node.
      nextNode = currNode.next;
      prevNode = currNode.previous;

      // Change next node of the current node so it would link to previous node.
      currNode.next = prevNode;
      currNode.previous = nextNode;

      // Move prevNode and currNode nodes one step forward.
      prevNode = currNode;
      currNode = nextNode;
    }

    // Reset head and tail.
    this.tail = this.head;
    this.head = prevNode;

    return this;
  }
}
```

### 图

在计算机科学中, **图(graph)** 是一种抽象数据类型,
旨在实现数学中的无向图和有向图概念，特别是图论领域。

一个图数据结构是一个(由有限个或者可变数量的)顶点/节点/点和边构成的有限集。

如果顶点对之间是无序的,称为无序图,否则称为有序图;

如果顶点对之间的边是没有方向的,称为无向图,否则称为有向图;

如果顶点对之间的边是有权重的,该图可称为加权图。

![Graph](https://www.tutorialspoint.com/data_structures_algorithms/images/graph.jpg)

#### Code

<!-- GraphVertex -->

```js
import LinkedList from '../linked-list/LinkedList';

export default class GraphVertex {
  /**
   * @param {*} value
   */
  constructor(value) {
    if (value === undefined) {
      throw new Error('Graph vertex must have a value');
    }

    /**
     * @param {GraphEdge} edgeA
     * @param {GraphEdge} edgeB
     */
    const edgeComparator = (edgeA, edgeB) => {
      if (edgeA.getKey() === edgeB.getKey()) {
        return 0;
      }

      return edgeA.getKey() < edgeB.getKey() ? -1 : 1;
    };

    // Normally you would store string value like vertex name.
    // But generally it may be any object as well
    this.value = value;
    this.edges = new LinkedList(edgeComparator);
  }

  /**
   * @param {GraphEdge} edge
   * @returns {GraphVertex}
   */
  addEdge(edge) {
    this.edges.append(edge);

    return this;
  }

  /**
   * @param {GraphEdge} edge
   */
  deleteEdge(edge) {
    this.edges.delete(edge);
  }

  /**
   * @returns {GraphVertex[]}
   */
  getNeighbors() {
    const edges = this.edges.toArray();

    /** @param {LinkedListNode} node */
    const neighborsConverter = node => {
      return node.value.startVertex === this ? node.value.endVertex : node.value.startVertex;
    };

    // Return either start or end vertex.
    // For undirected graphs it is possible that current vertex will be the end one.
    return edges.map(neighborsConverter);
  }

  /**
   * @return {GraphEdge[]}
   */
  getEdges() {
    return this.edges.toArray().map(linkedListNode => linkedListNode.value);
  }

  /**
   * @return {number}
   */
  getDegree() {
    return this.edges.toArray().length;
  }

  /**
   * @param {GraphEdge} requiredEdge
   * @returns {boolean}
   */
  hasEdge(requiredEdge) {
    const edgeNode = this.edges.find({
      callback: edge => edge === requiredEdge,
    });

    return !!edgeNode;
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {boolean}
   */
  hasNeighbor(vertex) {
    const vertexNode = this.edges.find({
      callback: edge => edge.startVertex === vertex || edge.endVertex === vertex,
    });

    return !!vertexNode;
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {(GraphEdge|null)}
   */
  findEdge(vertex) {
    const edgeFinder = edge => {
      return edge.startVertex === vertex || edge.endVertex === vertex;
    };

    const edge = this.edges.find({ callback: edgeFinder });

    return edge ? edge.value : null;
  }

  /**
   * @returns {string}
   */
  getKey() {
    return this.value;
  }

  /**
   * @return {GraphVertex}
   */
  deleteAllEdges() {
    this.getEdges().forEach(edge => this.deleteEdge(edge));

    return this;
  }

  /**
   * @param {function} [callback]
   * @returns {string}
   */
  toString(callback) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
```

<!-- GraphEdge -->

```js
export default class GraphEdge {
  /**
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @param {number} [weight=1]
   */
  constructor(startVertex, endVertex, weight = 0) {
    this.startVertex = startVertex;
    this.endVertex = endVertex;
    this.weight = weight;
  }

  /**
   * @return {string}
   */
  getKey() {
    const startVertexKey = this.startVertex.getKey();
    const endVertexKey = this.endVertex.getKey();

    return `${startVertexKey}_${endVertexKey}`;
  }

  /**
   * @return {GraphEdge}
   */
  reverse() {
    const tmp = this.startVertex;
    this.startVertex = this.endVertex;
    this.endVertex = tmp;

    return this;
  }

  /**
   * @return {string}
   */
  toString() {
    return this.getKey();
  }
}
```

<!-- Graph -->

```js
export default class Graph {
  /**
   * @param {boolean} isDirected
   */
  constructor(isDirected = false) {
    this.vertices = {};
    this.edges = {};
    this.isDirected = isDirected;
  }

  /**
   * @param {GraphVertex} newVertex
   * @returns {Graph}
   */
  addVertex(newVertex) {
    this.vertices[newVertex.getKey()] = newVertex;

    return this;
  }

  /**
   * @param {string} vertexKey
   * @returns GraphVertex
   */
  getVertexByKey(vertexKey) {
    return this.vertices[vertexKey];
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {GraphVertex[]}
   */
  getNeighbors(vertex) {
    return vertex.getNeighbors();
  }

  /**
   * @return {GraphVertex[]}
   */
  getAllVertices() {
    return Object.values(this.vertices);
  }

  /**
   * @return {GraphEdge[]}
   */
  getAllEdges() {
    return Object.values(this.edges);
  }

  /**
   * @param {GraphEdge} edge
   * @returns {Graph}
   */
  addEdge(edge) {
    // Try to find and end start vertices.
    let startVertex = this.getVertexByKey(edge.startVertex.getKey());
    let endVertex = this.getVertexByKey(edge.endVertex.getKey());

    // Insert start vertex if it wasn't inserted.
    if (!startVertex) {
      this.addVertex(edge.startVertex);
      startVertex = this.getVertexByKey(edge.startVertex.getKey());
    }

    // Insert end vertex if it wasn't inserted.
    if (!endVertex) {
      this.addVertex(edge.endVertex);
      endVertex = this.getVertexByKey(edge.endVertex.getKey());
    }

    // Check if edge has been already added.
    if (this.edges[edge.getKey()]) {
      throw new Error('Edge has already been added before');
    } else {
      this.edges[edge.getKey()] = edge;
    }

    // Add edge to the vertices.
    if (this.isDirected) {
      // If graph IS directed then add the edge only to start vertex.
      startVertex.addEdge(edge);
    } else {
      // If graph ISN'T directed then add the edge to both vertices.
      startVertex.addEdge(edge);
      endVertex.addEdge(edge);
    }

    return this;
  }

  /**
   * @param {GraphEdge} edge
   */
  deleteEdge(edge) {
    // Delete edge from the list of edges.
    if (this.edges[edge.getKey()]) {
      delete this.edges[edge.getKey()];
    } else {
      throw new Error('Edge not found in graph');
    }

    // Try to find and end start vertices and delete edge from them.
    const startVertex = this.getVertexByKey(edge.startVertex.getKey());
    const endVertex = this.getVertexByKey(edge.endVertex.getKey());

    startVertex.deleteEdge(edge);
    endVertex.deleteEdge(edge);
  }

  /**
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @return {(GraphEdge|null)}
   */
  findEdge(startVertex, endVertex) {
    const vertex = this.getVertexByKey(startVertex.getKey());

    if (!vertex) {
      return null;
    }

    return vertex.findEdge(endVertex);
  }

  /**
   * @return {number}
   */
  getWeight() {
    return this.getAllEdges().reduce((weight, graphEdge) => {
      return weight + graphEdge.weight;
    }, 0);
  }

  /**
   * Reverse all the edges in directed graph.
   * @return {Graph}
   */
  reverse() {
    /** @param {GraphEdge} edge */
    this.getAllEdges().forEach(edge => {
      // Delete straight edge from graph and from vertices.
      this.deleteEdge(edge);

      // Reverse the edge.
      edge.reverse();

      // Add reversed edge back to the graph and its vertices.
      this.addEdge(edge);
    });

    return this;
  }

  /**
   * @return {object}
   */
  getVerticesIndices() {
    const verticesIndices = {};
    this.getAllVertices().forEach((vertex, index) => {
      verticesIndices[vertex.getKey()] = index;
    });

    return verticesIndices;
  }

  /**
   * @return {*[][]}
   */
  getAdjacencyMatrix() {
    const vertices = this.getAllVertices();
    const verticesIndices = this.getVerticesIndices();

    // Init matrix with infinities meaning that there is no ways of
    // getting from one vertex to another yet.
    const adjacencyMatrix = Array(vertices.length)
      .fill(null)
      .map(() => {
        return Array(vertices.length).fill(Infinity);
      });

    // Fill the columns.
    vertices.forEach((vertex, vertexIndex) => {
      vertex.getNeighbors().forEach(neighbor => {
        const neighborIndex = verticesIndices[neighbor.getKey()];
        adjacencyMatrix[vertexIndex][neighborIndex] = this.findEdge(vertex, neighbor).weight;
      });
    });

    return adjacencyMatrix;
  }

  /**
   * @return {string}
   */
  toString() {
    return Object.keys(this.vertices).toString();
  }
}
```

### 哈希表

在计算中, 一个 **哈希表(hash table 或 hash map)** 是一种实现 _关联数组(associative array)_
的抽象数据；类型, 该结构可以将 _键映射到值_。

哈希表使用 _哈希函数/散列函数_ 来计算一个值在数组或桶(buckets)中或槽(slots)中对应的索引,可使用该索引找到所需的值。

理想情况下,散列函数将为每个键分配给一个唯一的桶(bucket),但是大多数哈希表设计采用不完美的散列函数,这可能会导致"哈希冲突(hash collisions)",也就是散列函数为多个键(key)生成了相同的索引,这种碰撞必须
以某种方式进行处理。

![Hash Table](https://upload.wikimedia.org/wikipedia/commons/7/7d/Hash_table_3_1_1_0_1_0_0_SP.svg)

通过单独的链接解决哈希冲突

![Hash Collision](https://upload.wikimedia.org/wikipedia/commons/d/d0/Hash_table_5_0_1_1_1_1_1_LL.svg)

#### Code

<!-- HashTable -->

```js
import LinkedList from '../linked-list/LinkedList';

// Hash table size directly affects on the number of collisions.
// The bigger the hash table size the less collisions you'll get.
// For demonstrating purposes hash table size is small to show how collisions
// are being handled.
const defaultHashTableSize = 32;

export default class HashTable {
  /**
   * @param {number} hashTableSize
   */
  constructor(hashTableSize = defaultHashTableSize) {
    // Create hash table of certain size and fill each bucket with empty linked list.
    this.buckets = Array(hashTableSize)
      .fill(null)
      .map(() => new LinkedList());

    // Just to keep track of all actual keys in a fast way.
    this.keys = {};
  }

  /**
   * Converts key string to hash number.
   *
   * @param {string} key
   * @return {number}
   */
  hash(key) {
    // For simplicity reasons we will just use character codes sum of all characters of the key
    // to calculate the hash.
    //
    // But you may also use more sophisticated approaches like polynomial string hash to reduce the
    // number of collisions:
    //
    // hash = charCodeAt(0) * PRIME^(n-1) + charCodeAt(1) * PRIME^(n-2) + ... + charCodeAt(n-1)
    //
    // where charCodeAt(i) is the i-th character code of the key, n is the length of the key and
    // PRIME is just any prime number like 31.
    const hash = Array.from(key).reduce((hashAccumulator, keySymbol) => hashAccumulator + keySymbol.charCodeAt(0), 0);

    // Reduce hash number so it would fit hash table size.
    return hash % this.buckets.length;
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    const keyHash = this.hash(key);
    this.keys[key] = keyHash;
    const bucketLinkedList = this.buckets[keyHash];
    const node = bucketLinkedList.find({ callback: nodeValue => nodeValue.key === key });

    if (!node) {
      // Insert new node.
      bucketLinkedList.append({ key, value });
    } else {
      // Update value of existing node.
      node.value.value = value;
    }
  }

  /**
   * @param {string} key
   * @return {*}
   */
  delete(key) {
    const keyHash = this.hash(key);
    delete this.keys[key];
    const bucketLinkedList = this.buckets[keyHash];
    const node = bucketLinkedList.find({ callback: nodeValue => nodeValue.key === key });

    if (node) {
      return bucketLinkedList.delete(node.value);
    }

    return null;
  }

  /**
   * @param {string} key
   * @return {*}
   */
  get(key) {
    const bucketLinkedList = this.buckets[this.hash(key)];
    const node = bucketLinkedList.find({ callback: nodeValue => nodeValue.key === key });

    return node ? node.value.value : undefined;
  }

  /**
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return Object.hasOwnProperty.call(this.keys, key);
  }

  /**
   * @return {string[]}
   */
  getKeys() {
    return Object.keys(this.keys);
  }
}
```

### 堆 (数据结构)

在计算机科学中, 一个 **堆(heap)** 是一种特殊的基于树的数据结构，它满足下面描述的堆属性。

在一个 _最小堆(min heap)_ 中, 如果 `P` 是 `C` 的一个父级节点, 那么 `P` 的 key(或 value)应小于或等于 `C` 的对应值.

![最小堆](https://upload.wikimedia.org/wikipedia/commons/6/69/Min-heap.png)

在一个 _最大堆(max heap)_ 中, `P` 的 key(或 value)大于 `C` 的对应值。

![堆](https://upload.wikimedia.org/wikipedia/commons/3/38/Max-Heap.svg)

在堆“顶部”的没有父级节点的节点,被称之为根节点。

#### Code

<!-- Heap -->

```js
import Comparator from '../../utils/comparator/Comparator';

/**
 * Parent class for Min and Max Heaps.
 */
export default class Heap {
  /**
   * @constructs Heap
   * @param {Function} [comparatorFunction]
   */
  constructor(comparatorFunction) {
    if (new.target === Heap) {
      throw new TypeError('Cannot construct Heap instance directly');
    }

    // Array representation of the heap.
    this.heapContainer = [];
    this.compare = new Comparator(comparatorFunction);
  }

  /**
   * @param {number} parentIndex
   * @return {number}
   */
  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  /**
   * @param {number} parentIndex
   * @return {number}
   */
  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }

  /**
   * @param {number} childIndex
   * @return {number}
   */
  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  /**
   * @param {number} childIndex
   * @return {boolean}
   */
  hasParent(childIndex) {
    return this.getParentIndex(childIndex) >= 0;
  }

  /**
   * @param {number} parentIndex
   * @return {boolean}
   */
  hasLeftChild(parentIndex) {
    return this.getLeftChildIndex(parentIndex) < this.heapContainer.length;
  }

  /**
   * @param {number} parentIndex
   * @return {boolean}
   */
  hasRightChild(parentIndex) {
    return this.getRightChildIndex(parentIndex) < this.heapContainer.length;
  }

  /**
   * @param {number} parentIndex
   * @return {*}
   */
  leftChild(parentIndex) {
    return this.heapContainer[this.getLeftChildIndex(parentIndex)];
  }

  /**
   * @param {number} parentIndex
   * @return {*}
   */
  rightChild(parentIndex) {
    return this.heapContainer[this.getRightChildIndex(parentIndex)];
  }

  /**
   * @param {number} childIndex
   * @return {*}
   */
  parent(childIndex) {
    return this.heapContainer[this.getParentIndex(childIndex)];
  }

  /**
   * @param {number} indexOne
   * @param {number} indexTwo
   */
  swap(indexOne, indexTwo) {
    const tmp = this.heapContainer[indexTwo];
    this.heapContainer[indexTwo] = this.heapContainer[indexOne];
    this.heapContainer[indexOne] = tmp;
  }

  /**
   * @return {*}
   */
  peek() {
    if (this.heapContainer.length === 0) {
      return null;
    }

    return this.heapContainer[0];
  }

  /**
   * @return {*}
   */
  poll() {
    if (this.heapContainer.length === 0) {
      return null;
    }

    if (this.heapContainer.length === 1) {
      return this.heapContainer.pop();
    }

    const item = this.heapContainer[0];

    // Move the last element from the end to the head.
    this.heapContainer[0] = this.heapContainer.pop();
    this.heapifyDown();

    return item;
  }

  /**
   * @param {*} item
   * @return {Heap}
   */
  add(item) {
    this.heapContainer.push(item);
    this.heapifyUp();
    return this;
  }

  /**
   * @param {*} item
   * @param {Comparator} [comparator]
   * @return {Heap}
   */
  remove(item, comparator = this.compare) {
    // Find number of items to remove.
    const numberOfItemsToRemove = this.find(item, comparator).length;

    for (let iteration = 0; iteration < numberOfItemsToRemove; iteration += 1) {
      // We need to find item index to remove each time after removal since
      // indices are being changed after each heapify process.
      const indexToRemove = this.find(item, comparator).pop();

      // If we need to remove last child in the heap then just remove it.
      // There is no need to heapify the heap afterwards.
      if (indexToRemove === this.heapContainer.length - 1) {
        this.heapContainer.pop();
      } else {
        // Move last element in heap to the vacant (removed) position.
        this.heapContainer[indexToRemove] = this.heapContainer.pop();

        // Get parent.
        const parentItem = this.parent(indexToRemove);

        // If there is no parent or parent is in correct order with the node
        // we're going to delete then heapify down. Otherwise heapify up.
        if (
          this.hasLeftChild(indexToRemove) &&
          (!parentItem || this.pairIsInCorrectOrder(parentItem, this.heapContainer[indexToRemove]))
        ) {
          this.heapifyDown(indexToRemove);
        } else {
          this.heapifyUp(indexToRemove);
        }
      }
    }

    return this;
  }

  /**
   * @param {*} item
   * @param {Comparator} [comparator]
   * @return {Number[]}
   */
  find(item, comparator = this.compare) {
    const foundItemIndices = [];

    for (let itemIndex = 0; itemIndex < this.heapContainer.length; itemIndex += 1) {
      if (comparator.equal(item, this.heapContainer[itemIndex])) {
        foundItemIndices.push(itemIndex);
      }
    }

    return foundItemIndices;
  }

  /**
   * @return {boolean}
   */
  isEmpty() {
    return !this.heapContainer.length;
  }

  /**
   * @return {string}
   */
  toString() {
    return this.heapContainer.toString();
  }

  /**
   * @param {number} [customStartIndex]
   */
  heapifyUp(customStartIndex) {
    // Take the last element (last in array or the bottom left in a tree)
    // in the heap container and lift it up until it is in the correct
    // order with respect to its parent element.
    let currentIndex = customStartIndex || this.heapContainer.length - 1;

    while (
      this.hasParent(currentIndex) &&
      !this.pairIsInCorrectOrder(this.parent(currentIndex), this.heapContainer[currentIndex])
    ) {
      this.swap(currentIndex, this.getParentIndex(currentIndex));
      currentIndex = this.getParentIndex(currentIndex);
    }
  }

  /**
   * @param {number} [customStartIndex]
   */
  heapifyDown(customStartIndex = 0) {
    // Compare the parent element to its children and swap parent with the appropriate
    // child (smallest child for MinHeap, largest child for MaxHeap).
    // Do the same for next children after swap.
    let currentIndex = customStartIndex;
    let nextIndex = null;

    while (this.hasLeftChild(currentIndex)) {
      if (
        this.hasRightChild(currentIndex) &&
        this.pairIsInCorrectOrder(this.rightChild(currentIndex), this.leftChild(currentIndex))
      ) {
        nextIndex = this.getRightChildIndex(currentIndex);
      } else {
        nextIndex = this.getLeftChildIndex(currentIndex);
      }

      if (this.pairIsInCorrectOrder(this.heapContainer[currentIndex], this.heapContainer[nextIndex])) {
        break;
      }

      this.swap(currentIndex, nextIndex);
      currentIndex = nextIndex;
    }
  }

  /**
   * Checks if pair of heap elements is in correct order.
   * For MinHeap the first element must be always smaller or equal.
   * For MaxHeap the first element must be always bigger or equal.
   *
   * @param {*} firstElement
   * @param {*} secondElement
   * @return {boolean}
   */
  /* istanbul ignore next */
  pairIsInCorrectOrder(firstElement, secondElement) {
    throw new Error(`
      You have to implement heap pair comparision method
      for ${firstElement} and ${secondElement} values.
    `);
  }
}
```

<!-- MinHeap -->

```js
import Heap from './Heap';

export default class MinHeap extends Heap {
  /**
   * Checks if pair of heap elements is in correct order.
   * For MinHeap the first element must be always smaller or equal.
   * For MaxHeap the first element must be always bigger or equal.
   *
   * @param {*} firstElement
   * @param {*} secondElement
   * @return {boolean}
   */
  pairIsInCorrectOrder(firstElement, secondElement) {
    return this.compare.lessThanOrEqual(firstElement, secondElement);
  }
}
```

<!-- MaxHeap -->

```js
import Heap from './Heap';

export default class MaxHeap extends Heap {
  /**
   * Checks if pair of heap elements is in correct order.
   * For MinHeap the first element must be always smaller or equal.
   * For MaxHeap the first element must be always bigger or equal.
   *
   * @param {*} firstElement
   * @param {*} secondElement
   * @return {boolean}
   */
  pairIsInCorrectOrder(firstElement, secondElement) {
    return this.compare.greaterThanOrEqual(firstElement, secondElement);
  }
}
```

### 链表

在计算机科学中, 一个 **链表** 是数据元素的线性集合, 元素的线性顺序不是由它们在内存中的物理位置给出的。 相反, 每个元素指向下一个元素。它是由一组节点组成的数据结构,这些节点一起,表示序列。

在最简单的形式下，每个节点由数据和到序列中下一个节点的引用(换句话说，链接)组成。这种结构允许在迭代期间有效地从序列中的任何位置插入或删除元素。

更复杂的变体添加额外的链接，允许有效地插入或删除任意元素引用。链表的一个缺点是访问时间是线性的(而且难以管道化)。

更快的访问，如随机访问，是不可行的。与链表相比，数组具有更好的缓存位置。

![Linked List](https://upload.wikimedia.org/wikipedia/commons/6/6d/Singly-linked-list.svg)

#### 基本操作的伪代码

##### 插入

```text
Add(value)
  Pre: value is the value to add to the list
  Post: value has been placed at the tail of the list
  n ← node(value)
  if head = ø
    head ← n
    tail ← n
  else
    tail.next ← n
    tail ← n
  end if
end Add
```

```
Prepend(value)
 Pre: value is the value to add to the list
 Post: value has been placed at the head of the list
 n ← node(value)
 n.next ← head
 head ← n
 if tail = ø
   tail ← n
 end
end Prepend
```

##### 搜索

```text
Contains(head, value)
  Pre: head is the head node in the list
       value is the value to search for
  Post: the item is either in the linked list, true; otherwise false
  n ← head
  while n != ø and n.value != value
    n ← n.next
  end while
  if n = ø
    return false
  end if
  return true
end Contains
```

##### 删除

```text
Remove(head, value)
  Pre: head is the head node in the list
       value is the value to remove from the list
  Post: value is removed from the list, true, otherwise false
  if head = ø
    return false
  end if
  n ← head
  if n.value = value
    if head = tail
      head ← ø
      tail ← ø
    else
      head ← head.next
    end if
    return true
  end if
  while n.next != ø and n.next.value != value
    n ← n.next
  end while
  if n.next != ø
    if n.next = tail
      tail ← n
    end if
    n.next ← n.next.next
    return true
  end if
  return false
end Remove
```

##### 遍历

```text
Traverse(head)
  Pre: head is the head node in the list
  Post: the items in the list have been traversed
  n ← head
  while n != 0
    yield n.value
    n ← n.next
  end while
end Traverse
```

##### 反向遍历

```text
ReverseTraversal(head, tail)
  Pre: head and tail belong to the same list
  Post: the items in the list have been traversed in reverse order
  if tail != ø
    curr ← tail
    while curr != head
      prev ← head
      while prev.next != curr
        prev ← prev.next
      end while
      yield curr.value
      curr ← prev
    end while
   yield curr.value
  end if
end ReverseTraversal
```

#### 复杂度

##### 时间复杂度

| Access | Search | Insertion | Deletion |
| :----: | :----: | :-------: | :------: |
|  O(n)  |  O(n)  |   O(1)    |   O(1)   |

##### 空间复杂度

O(n)

#### Code

```js
export default class LinkedListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }

  toString(callback) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
```

```js
import LinkedListNode from './LinkedListNode';
import Comparator from '../../utils/comparator/Comparator';

export default class LinkedList {
  /**
   * @param {Function} [comparatorFunction]
   */
  constructor(comparatorFunction) {
    /** @var LinkedListNode */
    this.head = null;

    /** @var LinkedListNode */
    this.tail = null;

    this.compare = new Comparator(comparatorFunction);
  }

  /**
   * @param {*} value
   * @return {LinkedList}
   */
  prepend(value) {
    // Make new node to be a head.
    const newNode = new LinkedListNode(value, this.head);
    this.head = newNode;

    // If there is no tail yet let's make new node a tail.
    if (!this.tail) {
      this.tail = newNode;
    }

    return this;
  }

  /**
   * @param {*} value
   * @return {LinkedList}
   */
  append(value) {
    const newNode = new LinkedListNode(value);

    // If there is no head yet let's make new node a head.
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;

      return this;
    }

    // Attach new node to the end of linked list.
    this.tail.next = newNode;
    this.tail = newNode;

    return this;
  }

  /**
   * @param {*} value
   * @return {LinkedListNode}
   */
  delete(value) {
    if (!this.head) {
      return null;
    }

    let deletedNode = null;

    // If the head must be deleted then make next node that is differ
    // from the head to be a new head.
    while (this.head && this.compare.equal(this.head.value, value)) {
      deletedNode = this.head;
      this.head = this.head.next;
    }

    let currentNode = this.head;

    if (currentNode !== null) {
      // If next node must be deleted then make next node to be a next next one.
      while (currentNode.next) {
        if (this.compare.equal(currentNode.next.value, value)) {
          deletedNode = currentNode.next;
          currentNode.next = currentNode.next.next;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    // Check if tail must be deleted.
    if (this.compare.equal(this.tail.value, value)) {
      this.tail = currentNode;
    }

    return deletedNode;
  }

  /**
   * @param {Object} findParams
   * @param {*} findParams.value
   * @param {function} [findParams.callback]
   * @return {LinkedListNode}
   */
  find({ value = undefined, callback = undefined }) {
    if (!this.head) {
      return null;
    }

    let currentNode = this.head;

    while (currentNode) {
      // If callback is specified then try to find node by callback.
      if (callback && callback(currentNode.value)) {
        return currentNode;
      }

      // If value is specified then try to compare by value..
      if (value !== undefined && this.compare.equal(currentNode.value, value)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  /**
   * @return {LinkedListNode}
   */
  deleteTail() {
    const deletedTail = this.tail;

    if (this.head === this.tail) {
      // There is only one node in linked list.
      this.head = null;
      this.tail = null;

      return deletedTail;
    }

    // If there are many nodes in linked list...

    // Rewind to the last node and delete "next" link for the node before the last one.
    let currentNode = this.head;
    while (currentNode.next) {
      if (!currentNode.next.next) {
        currentNode.next = null;
      } else {
        currentNode = currentNode.next;
      }
    }

    this.tail = currentNode;

    return deletedTail;
  }

  /**
   * @return {LinkedListNode}
   */
  deleteHead() {
    if (!this.head) {
      return null;
    }

    const deletedHead = this.head;

    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    return deletedHead;
  }

  /**
   * @param {*[]} values - Array of values that need to be converted to linked list.
   * @return {LinkedList}
   */
  fromArray(values) {
    values.forEach(value => this.append(value));

    return this;
  }

  /**
   * @return {LinkedListNode[]}
   */
  toArray() {
    const nodes = [];

    let currentNode = this.head;
    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  /**
   * @param {function} [callback]
   * @return {string}
   */
  toString(callback) {
    return this.toArray()
      .map(node => node.toString(callback))
      .toString();
  }

  /**
   * Reverse a linked list.
   * @returns {LinkedList}
   */
  reverse() {
    let currNode = this.head;
    let prevNode = null;
    let nextNode = null;

    while (currNode) {
      // Store next node.
      nextNode = currNode.next;

      // Change next node of the current node so it would link to previous node.
      currNode.next = prevNode;

      // Move prevNode and currNode nodes one step forward.
      prevNode = currNode;
      currNode = nextNode;
    }

    // Reset head and tail.
    this.tail = this.head;
    this.head = prevNode;

    return this;
  }
}
```

### 优先队列

在计算机科学中, **优先级队列(priority queue)** 是一种抽象数据类型, 它类似于常规的队列或栈, 但每个元素都有与之关联的“优先级”。

在优先队列中, 低优先级的元素之前前面应该是高优先级的元素。 如果两个元素具有相同的优先级, 则根据它们在队列中的顺序是它们的出现顺序即可。

优先队列虽通常用堆来实现,但它在概念上与堆不同。优先队列是一个抽象概念，就像“列表”或“图”这样的抽象概念一样;

正如列表可以用链表或数组实现一样，优先队列可以用堆或各种其他方法实现,例如无序数组。

#### Code

```js
import MinHeap from '../heap/MinHeap';
import Comparator from '../../utils/comparator/Comparator';

// It is the same as min heap except that when comparing two elements
// we take into account its priority instead of the element's value.
export default class PriorityQueue extends MinHeap {
  constructor() {
    // Call MinHip constructor first.
    super();

    // Setup priorities map.
    this.priorities = new Map();

    // Use custom comparator for heap elements that will take element priority
    // instead of element value into account.
    this.compare = new Comparator(this.comparePriority.bind(this));
  }

  /**
   * Add item to the priority queue.
   * @param {*} item - item we're going to add to the queue.
   * @param {number} [priority] - items priority.
   * @return {PriorityQueue}
   */
  add(item, priority = 0) {
    this.priorities.set(item, priority);
    super.add(item);
    return this;
  }

  /**
   * Remove item from priority queue.
   * @param {*} item - item we're going to remove.
   * @param {Comparator} [customFindingComparator] - custom function for finding the item to remove
   * @return {PriorityQueue}
   */
  remove(item, customFindingComparator) {
    super.remove(item, customFindingComparator);
    this.priorities.delete(item);
    return this;
  }

  /**
   * Change priority of the item in a queue.
   * @param {*} item - item we're going to re-prioritize.
   * @param {number} priority - new item's priority.
   * @return {PriorityQueue}
   */
  changePriority(item, priority) {
    this.remove(item, new Comparator(this.compareValue));
    this.add(item, priority);
    return this;
  }

  /**
   * Find item by ite value.
   * @param {*} item
   * @return {Number[]}
   */
  findByValue(item) {
    return this.find(item, new Comparator(this.compareValue));
  }

  /**
   * Check if item already exists in a queue.
   * @param {*} item
   * @return {boolean}
   */
  hasValue(item) {
    return this.findByValue(item).length > 0;
  }

  /**
   * Compares priorities of two items.
   * @param {*} a
   * @param {*} b
   * @return {number}
   */
  comparePriority(a, b) {
    if (this.priorities.get(a) === this.priorities.get(b)) {
      return 0;
    }
    return this.priorities.get(a) < this.priorities.get(b) ? -1 : 1;
  }

  /**
   * Compares values of two items.
   * @param {*} a
   * @param {*} b
   * @return {number}
   */
  compareValue(a, b) {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }
}
```

### 队列

在计算机科学中, 一个 **队列(queue)** 是一种特殊类型的抽象数据类型或集合。集合中的实体按顺序保存。

队列基本操作有两种: 向队列的后端位置添加实体，称为入队，并从队列的前端位置移除实体，称为出队。

队列中元素先进先出 FIFO (first in, first out)的示意

![Queue](https://upload.wikimedia.org/wikipedia/commons/5/52/Data_Queue.svg)

#### Code

```js
import LinkedList from '../linked-list/LinkedList';

export default class Queue {
  constructor() {
    // We're going to implement Queue based on LinkedList since the two
    // structures are quite similar. Namely, they both operate mostly on
    // the elements at the beginning and the end. Compare enqueue/dequeue
    // operations of Queue with append/deleteHead operations of LinkedList.
    this.linkedList = new LinkedList();
  }

  /**
   * @return {boolean}
   */
  isEmpty() {
    return !this.linkedList.head;
  }

  /**
   * Read the element at the front of the queue without removing it.
   * @return {*}
   */
  peek() {
    if (!this.linkedList.head) {
      return null;
    }

    return this.linkedList.head.value;
  }

  /**
   * Add a new element to the end of the queue (the tail of the linked list).
   * This element will be processed after all elements ahead of it.
   * @param {*} value
   */
  enqueue(value) {
    this.linkedList.append(value);
  }

  /**
   * Remove the element at the front of the queue (the head of the linked list).
   * If the queue is empty, return null.
   * @return {*}
   */
  dequeue() {
    const removedHead = this.linkedList.deleteHead();
    return removedHead ? removedHead.value : null;
  }

  /**
   * @param [callback]
   * @return {string}
   */
  toString(callback) {
    // Return string representation of the queue's linked list.
    return this.linkedList.toString(callback);
  }
}
```

### 栈

在计算机科学中, 一个 **栈(stack)** 是一种抽象数据类型,用作表示元素的集合,具有两种主要操作:

- **push**, 添加元素到栈的顶端(末尾);
- **pop**, 移除栈最顶端(末尾)的元素.

以上两种操作可以简单概括为“后进先出(LIFO = last in, first out)”。

此外,应有一个 `peek` 操作用于访问栈当前顶端(末尾)的元素。

"栈"这个名称,可类比于一组物体的堆叠(一摞书,一摞盘子之类的)。

栈的 push 和 pop 操作的示意

![Stack](https://upload.wikimedia.org/wikipedia/commons/b/b4/Lifo_stack.png)

#### Code

```js
import LinkedList from '../linked-list/LinkedList';

export default class Stack {
  constructor() {
    // We're going to implement Stack based on LinkedList since these
    // structures are quite similar. Compare push/pop operations of the Stack
    // with prepend/deleteHead operations of LinkedList.
    this.linkedList = new LinkedList();
  }

  /**
   * @return {boolean}
   */
  isEmpty() {
    // The stack is empty if its linked list doesn't have a head.
    return !this.linkedList.head;
  }

  /**
   * @return {*}
   */
  peek() {
    if (this.isEmpty()) {
      // If the linked list is empty then there is nothing to peek from.
      return null;
    }

    // Just read the value from the start of linked list without deleting it.
    return this.linkedList.head.value;
  }

  /**
   * @param {*} value
   */
  push(value) {
    // Pushing means to lay the value on top of the stack. Therefore let's just add
    // the new value at the start of the linked list.
    this.linkedList.prepend(value);
  }

  /**
   * @return {*}
   */
  pop() {
    // Let's try to delete the first node (the head) from the linked list.
    // If there is no head (the linked list is empty) just return null.
    const removedHead = this.linkedList.deleteHead();
    return removedHead ? removedHead.value : null;
  }

  /**
   * @return {*[]}
   */
  toArray() {
    return this.linkedList.toArray().map(linkedListNode => linkedListNode.value);
  }

  /**
   * @param {function} [callback]
   * @return {string}
   */
  toString(callback) {
    return this.linkedList.toString(callback);
  }
}
```

### 树

- [二叉搜索树](binary-search-tree)
- [AVL 树](avl-tree)
- [红黑树](red-black-tree)
- [线段树](segment-tree) - with min/max/sum range queries examples
- [芬威克树/Fenwick Tree](fenwick-tree) (Binary Indexed Tree)

在计算机科学中, **树(tree)** 是一种广泛使用的抽象数据类型(ADT)— 或实现此 ADT 的数据结构 — 模拟分层树结构, 具有根节点和有父节点的子树,表示为一组链接节点。

树可以被(本地地)递归定义为一个(始于一个根节点的)节点集, 每个节点都是一个包含了值的数据结构, 除了值,还有该节点的节点引用列表(子节点)一起。
树的节点之间没有引用重复的约束。

一棵简单的无序树; 在下图中:

标记为 7 的节点具有两个子节点, 标记为 2 和 6;
一个父节点,标记为 2,作为根节点, 在顶部,没有父节点。

![Tree](https://upload.wikimedia.org/wikipedia/commons/f/f7/Binary_tree.svg)

#### Code

```js
import Comparator from '../../utils/comparator/Comparator';
import HashTable from '../hash-table/HashTable';

export default class BinaryTreeNode {
  /**
   * @param {*} [value] - node value.
   */
  constructor(value = null) {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.value = value;

    // Any node related meta information may be stored here.
    this.meta = new HashTable();

    // This comparator is used to compare binary tree nodes with each other.
    this.nodeComparator = new Comparator();
  }

  /**
   * @return {number}
   */
  get leftHeight() {
    if (!this.left) {
      return 0;
    }

    return this.left.height + 1;
  }

  /**
   * @return {number}
   */
  get rightHeight() {
    if (!this.right) {
      return 0;
    }

    return this.right.height + 1;
  }

  /**
   * @return {number}
   */
  get height() {
    return Math.max(this.leftHeight, this.rightHeight);
  }

  /**
   * @return {number}
   */
  get balanceFactor() {
    return this.leftHeight - this.rightHeight;
  }

  /**
   * Get parent's sibling if it exists.
   * @return {BinaryTreeNode}
   */
  get uncle() {
    // Check if current node has parent.
    if (!this.parent) {
      return undefined;
    }

    // Check if current node has grand-parent.
    if (!this.parent.parent) {
      return undefined;
    }

    // Check if grand-parent has two children.
    if (!this.parent.parent.left || !this.parent.parent.right) {
      return undefined;
    }

    // So for now we know that current node has grand-parent and this
    // grand-parent has two children. Let's find out who is the uncle.
    if (this.nodeComparator.equal(this.parent, this.parent.parent.left)) {
      // Right one is an uncle.
      return this.parent.parent.right;
    }

    // Left one is an uncle.
    return this.parent.parent.left;
  }

  /**
   * @param {*} value
   * @return {BinaryTreeNode}
   */
  setValue(value) {
    this.value = value;

    return this;
  }

  /**
   * @param {BinaryTreeNode} node
   * @return {BinaryTreeNode}
   */
  setLeft(node) {
    // Reset parent for left node since it is going to be detached.
    if (this.left) {
      this.left.parent = null;
    }

    // Attach new node to the left.
    this.left = node;

    // Make current node to be a parent for new left one.
    if (this.left) {
      this.left.parent = this;
    }

    return this;
  }

  /**
   * @param {BinaryTreeNode} node
   * @return {BinaryTreeNode}
   */
  setRight(node) {
    // Reset parent for right node since it is going to be detached.
    if (this.right) {
      this.right.parent = null;
    }

    // Attach new node to the right.
    this.right = node;

    // Make current node to be a parent for new right one.
    if (node) {
      this.right.parent = this;
    }

    return this;
  }

  /**
   * @param {BinaryTreeNode} nodeToRemove
   * @return {boolean}
   */
  removeChild(nodeToRemove) {
    if (this.left && this.nodeComparator.equal(this.left, nodeToRemove)) {
      this.left = null;
      return true;
    }

    if (this.right && this.nodeComparator.equal(this.right, nodeToRemove)) {
      this.right = null;
      return true;
    }

    return false;
  }

  /**
   * @param {BinaryTreeNode} nodeToReplace
   * @param {BinaryTreeNode} replacementNode
   * @return {boolean}
   */
  replaceChild(nodeToReplace, replacementNode) {
    if (!nodeToReplace || !replacementNode) {
      return false;
    }

    if (this.left && this.nodeComparator.equal(this.left, nodeToReplace)) {
      this.left = replacementNode;
      return true;
    }

    if (this.right && this.nodeComparator.equal(this.right, nodeToReplace)) {
      this.right = replacementNode;
      return true;
    }

    return false;
  }

  /**
   * @param {BinaryTreeNode} sourceNode
   * @param {BinaryTreeNode} targetNode
   */
  static copyNode(sourceNode, targetNode) {
    targetNode.setValue(sourceNode.value);
    targetNode.setLeft(sourceNode.left);
    targetNode.setRight(sourceNode.right);
  }

  /**
   * @return {*[]}
   */
  traverseInOrder() {
    let traverse = [];

    // Add left node.
    if (this.left) {
      traverse = traverse.concat(this.left.traverseInOrder());
    }

    // Add root.
    traverse.push(this.value);

    // Add right node.
    if (this.right) {
      traverse = traverse.concat(this.right.traverseInOrder());
    }

    return traverse;
  }

  /**
   * @return {string}
   */
  toString() {
    return this.traverseInOrder().toString();
  }
}
```

##### AvlTree

```js
import BinarySearchTree from '../binary-search-tree/BinarySearchTree';

export default class AvlTree extends BinarySearchTree {
  /**
   * @param {*} value
   */
  insert(value) {
    // Do the normal BST insert.
    super.insert(value);

    // Let's move up to the root and check balance factors along the way.
    let currentNode = this.root.find(value);
    while (currentNode) {
      this.balance(currentNode);
      currentNode = currentNode.parent;
    }
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  remove(value) {
    // Do standard BST removal.
    super.remove(value);

    // Balance the tree starting from the root node.
    this.balance(this.root);
  }

  /**
   * @param {BinarySearchTreeNode} node
   */
  balance(node) {
    // If balance factor is not OK then try to balance the node.
    if (node.balanceFactor > 1) {
      // Left rotation.
      if (node.left.balanceFactor > 0) {
        // Left-Left rotation
        this.rotateLeftLeft(node);
      } else if (node.left.balanceFactor < 0) {
        // Left-Right rotation.
        this.rotateLeftRight(node);
      }
    } else if (node.balanceFactor < -1) {
      // Right rotation.
      if (node.right.balanceFactor < 0) {
        // Right-Right rotation
        this.rotateRightRight(node);
      } else if (node.right.balanceFactor > 0) {
        // Right-Left rotation.
        this.rotateRightLeft(node);
      }
    }
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateLeftLeft(rootNode) {
    // Detach left node from root node.
    const leftNode = rootNode.left;
    rootNode.setLeft(null);

    // Make left node to be a child of rootNode's parent.
    if (rootNode.parent) {
      rootNode.parent.setLeft(leftNode);
    } else if (rootNode === this.root) {
      // If root node is root then make left node to be a new root.
      this.root = leftNode;
    }

    // If left node has a right child then detach it and
    // attach it as a left child for rootNode.
    if (leftNode.right) {
      rootNode.setLeft(leftNode.right);
    }

    // Attach rootNode to the right of leftNode.
    leftNode.setRight(rootNode);
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateLeftRight(rootNode) {
    // Detach left node from rootNode since it is going to be replaced.
    const leftNode = rootNode.left;
    rootNode.setLeft(null);

    // Detach right node from leftNode.
    const leftRightNode = leftNode.right;
    leftNode.setRight(null);

    // Preserve leftRightNode's left subtree.
    if (leftRightNode.left) {
      leftNode.setRight(leftRightNode.left);
      leftRightNode.setLeft(null);
    }

    // Attach leftRightNode to the rootNode.
    rootNode.setLeft(leftRightNode);

    // Attach leftNode as left node for leftRight node.
    leftRightNode.setLeft(leftNode);

    // Do left-left rotation.
    this.rotateLeftLeft(rootNode);
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateRightLeft(rootNode) {
    // Detach right node from rootNode since it is going to be replaced.
    const rightNode = rootNode.right;
    rootNode.setRight(null);

    // Detach left node from rightNode.
    const rightLeftNode = rightNode.left;
    rightNode.setLeft(null);

    if (rightLeftNode.right) {
      rightNode.setLeft(rightLeftNode.right);
      rightLeftNode.setRight(null);
    }

    // Attach rightLeftNode to the rootNode.
    rootNode.setRight(rightLeftNode);

    // Attach rightNode as right node for rightLeft node.
    rightLeftNode.setRight(rightNode);

    // Do right-right rotation.
    this.rotateRightRight(rootNode);
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateRightRight(rootNode) {
    // Detach right node from root node.
    const rightNode = rootNode.right;
    rootNode.setRight(null);

    // Make right node to be a child of rootNode's parent.
    if (rootNode.parent) {
      rootNode.parent.setRight(rightNode);
    } else if (rootNode === this.root) {
      // If root node is root then make right node to be a new root.
      this.root = rightNode;
    }

    // If right node has a left child then detach it and
    // attach it as a right child for rootNode.
    if (rightNode.left) {
      rootNode.setRight(rightNode.left);
    }

    // Attach rootNode to the left of rightNode.
    rightNode.setLeft(rootNode);
  }
}
```

##### binary-search-tree

```js
import BinaryTreeNode from '../BinaryTreeNode';
import Comparator from '../../../utils/comparator/Comparator';

export default class BinarySearchTreeNode extends BinaryTreeNode {
  /**
   * @param {*} [value] - node value.
   * @param {function} [compareFunction] - comparator function for node values.
   */
  constructor(value = null, compareFunction = undefined) {
    super(value);

    // This comparator is used to compare node values with each other.
    this.compareFunction = compareFunction;
    this.nodeValueComparator = new Comparator(compareFunction);
  }

  /**
   * @param {*} value
   * @return {BinarySearchTreeNode}
   */
  insert(value) {
    if (this.nodeValueComparator.equal(this.value, null)) {
      this.value = value;

      return this;
    }

    if (this.nodeValueComparator.lessThan(value, this.value)) {
      // Insert to the left.
      if (this.left) {
        return this.left.insert(value);
      }

      const newNode = new BinarySearchTreeNode(value, this.compareFunction);
      this.setLeft(newNode);

      return newNode;
    }

    if (this.nodeValueComparator.greaterThan(value, this.value)) {
      // Insert to the right.
      if (this.right) {
        return this.right.insert(value);
      }

      const newNode = new BinarySearchTreeNode(value, this.compareFunction);
      this.setRight(newNode);

      return newNode;
    }

    return this;
  }

  /**
   * @param {*} value
   * @return {BinarySearchTreeNode}
   */
  find(value) {
    // Check the root.
    if (this.nodeValueComparator.equal(this.value, value)) {
      return this;
    }

    if (this.nodeValueComparator.lessThan(value, this.value) && this.left) {
      // Check left nodes.
      return this.left.find(value);
    }

    if (this.nodeValueComparator.greaterThan(value, this.value) && this.right) {
      // Check right nodes.
      return this.right.find(value);
    }

    return null;
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  contains(value) {
    return !!this.find(value);
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  remove(value) {
    const nodeToRemove = this.find(value);

    if (!nodeToRemove) {
      throw new Error('Item not found in the tree');
    }

    const { parent } = nodeToRemove;

    if (!nodeToRemove.left && !nodeToRemove.right) {
      // Node is a leaf and thus has no children.
      if (parent) {
        // Node has a parent. Just remove the pointer to this node from the parent.
        parent.removeChild(nodeToRemove);
      } else {
        // Node has no parent. Just erase current node value.
        nodeToRemove.setValue(undefined);
      }
    } else if (nodeToRemove.left && nodeToRemove.right) {
      // Node has two children.
      // Find the next biggest value (minimum value in the right branch)
      // and replace current value node with that next biggest value.
      const nextBiggerNode = nodeToRemove.right.findMin();
      if (!this.nodeComparator.equal(nextBiggerNode, nodeToRemove.right)) {
        this.remove(nextBiggerNode.value);
        nodeToRemove.setValue(nextBiggerNode.value);
      } else {
        // In case if next right value is the next bigger one and it doesn't have left child
        // then just replace node that is going to be deleted with the right node.
        nodeToRemove.setValue(nodeToRemove.right.value);
        nodeToRemove.setRight(nodeToRemove.right.right);
      }
    } else {
      // Node has only one child.
      // Make this child to be a direct child of current node's parent.
      /** @var BinarySearchTreeNode */
      const childNode = nodeToRemove.left || nodeToRemove.right;

      if (parent) {
        parent.replaceChild(nodeToRemove, childNode);
      } else {
        BinaryTreeNode.copyNode(childNode, nodeToRemove);
      }
    }

    // Clear the parent of removed node.
    nodeToRemove.parent = null;

    return true;
  }

  /**
   * @return {BinarySearchTreeNode}
   */
  findMin() {
    if (!this.left) {
      return this;
    }

    return this.left.findMin();
  }
}
```

```js
import BinarySearchTreeNode from './BinarySearchTreeNode';

export default class BinarySearchTree {
  /**
   * @param {function} [nodeValueCompareFunction]
   */
  constructor(nodeValueCompareFunction) {
    this.root = new BinarySearchTreeNode(null, nodeValueCompareFunction);

    // Steal node comparator from the root.
    this.nodeComparator = this.root.nodeComparator;
  }

  /**
   * @param {*} value
   * @return {BinarySearchTreeNode}
   */
  insert(value) {
    return this.root.insert(value);
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  contains(value) {
    return this.root.contains(value);
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  remove(value) {
    return this.root.remove(value);
  }

  /**
   * @return {string}
   */
  toString() {
    return this.root.toString();
  }
}
```

##### FenwickTree

```js
export default class FenwickTree {
  /**
   * Constructor creates empty fenwick tree of size 'arraySize',
   * however, array size is size+1, because index is 1-based.
   *
   * @param  {number} arraySize
   */
  constructor(arraySize) {
    this.arraySize = arraySize;

    // Fill tree array with zeros.
    this.treeArray = Array(this.arraySize + 1).fill(0);
  }

  /**
   * Adds value to existing value at position.
   *
   * @param  {number} position
   * @param  {number} value
   * @return {FenwickTree}
   */
  increase(position, value) {
    if (position < 1 || position > this.arraySize) {
      throw new Error('Position is out of allowed range');
    }

    for (let i = position; i <= this.arraySize; i += i & -i) {
      this.treeArray[i] += value;
    }

    return this;
  }

  /**
   * Query sum from index 1 to position.
   *
   * @param  {number} position
   * @return {number}
   */
  query(position) {
    if (position < 1 || position > this.arraySize) {
      throw new Error('Position is out of allowed range');
    }

    let sum = 0;

    for (let i = position; i > 0; i -= i & -i) {
      sum += this.treeArray[i];
    }

    return sum;
  }

  /**
   * Query sum from index leftIndex to rightIndex.
   *
   * @param  {number} leftIndex
   * @param  {number} rightIndex
   * @return {number}
   */
  queryRange(leftIndex, rightIndex) {
    if (leftIndex > rightIndex) {
      throw new Error('Left index can not be greater than right one');
    }

    if (leftIndex === 1) {
      return this.query(rightIndex);
    }

    return this.query(rightIndex) - this.query(leftIndex - 1);
  }
}
```

##### red-black-tree

```js
import BinarySearchTree from '../binary-search-tree/BinarySearchTree';

// Possible colors of red-black tree nodes.
const RED_BLACK_TREE_COLORS = {
  red: 'red',
  black: 'black',
};

// Color property name in meta information of the nodes.
const COLOR_PROP_NAME = 'color';

export default class RedBlackTree extends BinarySearchTree {
  /**
   * @param {*} value
   * @return {BinarySearchTreeNode}
   */
  insert(value) {
    const insertedNode = super.insert(value);

    // if (!this.root.left && !this.root.right) {
    if (this.nodeComparator.equal(insertedNode, this.root)) {
      // Make root to always be black.
      this.makeNodeBlack(insertedNode);
    } else {
      // Make all newly inserted nodes to be red.
      this.makeNodeRed(insertedNode);
    }

    // Check all conditions and balance the node.
    this.balance(insertedNode);

    return insertedNode;
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  remove(value) {
    throw new Error(`Can't remove ${value}. Remove method is not implemented yet`);
  }

  /**
   * @param {BinarySearchTreeNode} node
   */
  balance(node) {
    // If it is a root node then nothing to balance here.
    if (this.nodeComparator.equal(node, this.root)) {
      return;
    }

    // If the parent is black then done. Nothing to balance here.
    if (this.isNodeBlack(node.parent)) {
      return;
    }

    const grandParent = node.parent.parent;

    if (node.uncle && this.isNodeRed(node.uncle)) {
      // If node has red uncle then we need to do RECOLORING.

      // Recolor parent and uncle to black.
      this.makeNodeBlack(node.uncle);
      this.makeNodeBlack(node.parent);

      if (!this.nodeComparator.equal(grandParent, this.root)) {
        // Recolor grand-parent to red if it is not root.
        this.makeNodeRed(grandParent);
      } else {
        // If grand-parent is black root don't do anything.
        // Since root already has two black sibling that we've just recolored.
        return;
      }

      // Now do further checking for recolored grand-parent.
      this.balance(grandParent);
    } else if (!node.uncle || this.isNodeBlack(node.uncle)) {
      // If node uncle is black or absent then we need to do ROTATIONS.

      if (grandParent) {
        // Grand parent that we will receive after rotations.
        let newGrandParent;

        if (this.nodeComparator.equal(grandParent.left, node.parent)) {
          // Left case.
          if (this.nodeComparator.equal(node.parent.left, node)) {
            // Left-left case.
            newGrandParent = this.leftLeftRotation(grandParent);
          } else {
            // Left-right case.
            newGrandParent = this.leftRightRotation(grandParent);
          }
        } else {
          // Right case.
          if (this.nodeComparator.equal(node.parent.right, node)) {
            // Right-right case.
            newGrandParent = this.rightRightRotation(grandParent);
          } else {
            // Right-left case.
            newGrandParent = this.rightLeftRotation(grandParent);
          }
        }

        // Set newGrandParent as a root if it doesn't have parent.
        if (newGrandParent && newGrandParent.parent === null) {
          this.root = newGrandParent;

          // Recolor root into black.
          this.makeNodeBlack(this.root);
        }

        // Check if new grand parent don't violate red-black-tree rules.
        this.balance(newGrandParent);
      }
    }
  }

  /**
   * Left Left Case (p is left child of g and x is left child of p)
   * @param {BinarySearchTreeNode|BinaryTreeNode} grandParentNode
   * @return {BinarySearchTreeNode}
   */
  leftLeftRotation(grandParentNode) {
    // Memorize the parent of grand-parent node.
    const grandGrandParent = grandParentNode.parent;

    // Check what type of sibling is our grandParentNode is (left or right).
    let grandParentNodeIsLeft;
    if (grandGrandParent) {
      grandParentNodeIsLeft = this.nodeComparator.equal(grandGrandParent.left, grandParentNode);
    }

    // Memorize grandParentNode's left node.
    const parentNode = grandParentNode.left;

    // Memorize parent's right node since we're going to transfer it to
    // grand parent's left subtree.
    const parentRightNode = parentNode.right;

    // Make grandParentNode to be right child of parentNode.
    parentNode.setRight(grandParentNode);

    // Move child's right subtree to grandParentNode's left subtree.
    grandParentNode.setLeft(parentRightNode);

    // Put parentNode node in place of grandParentNode.
    if (grandGrandParent) {
      if (grandParentNodeIsLeft) {
        grandGrandParent.setLeft(parentNode);
      } else {
        grandGrandParent.setRight(parentNode);
      }
    } else {
      // Make parent node a root
      parentNode.parent = null;
    }

    // Swap colors of granParent and parent nodes.
    this.swapNodeColors(parentNode, grandParentNode);

    // Return new root node.
    return parentNode;
  }

  /**
   * Left Right Case (p is left child of g and x is right child of p)
   * @param {BinarySearchTreeNode|BinaryTreeNode} grandParentNode
   * @return {BinarySearchTreeNode}
   */
  leftRightRotation(grandParentNode) {
    // Memorize left and left-right nodes.
    const parentNode = grandParentNode.left;
    const childNode = parentNode.right;

    // We need to memorize child left node to prevent losing
    // left child subtree. Later it will be re-assigned to
    // parent's right sub-tree.
    const childLeftNode = childNode.left;

    // Make parentNode to be a left child of childNode node.
    childNode.setLeft(parentNode);

    // Move child's left subtree to parent's right subtree.
    parentNode.setRight(childLeftNode);

    // Put left-right node in place of left node.
    grandParentNode.setLeft(childNode);

    // Now we're ready to do left-left rotation.
    return this.leftLeftRotation(grandParentNode);
  }

  /**
   * Right Right Case (p is right child of g and x is right child of p)
   * @param {BinarySearchTreeNode|BinaryTreeNode} grandParentNode
   * @return {BinarySearchTreeNode}
   */
  rightRightRotation(grandParentNode) {
    // Memorize the parent of grand-parent node.
    const grandGrandParent = grandParentNode.parent;

    // Check what type of sibling is our grandParentNode is (left or right).
    let grandParentNodeIsLeft;
    if (grandGrandParent) {
      grandParentNodeIsLeft = this.nodeComparator.equal(grandGrandParent.left, grandParentNode);
    }

    // Memorize grandParentNode's right node.
    const parentNode = grandParentNode.right;

    // Memorize parent's left node since we're going to transfer it to
    // grand parent's right subtree.
    const parentLeftNode = parentNode.left;

    // Make grandParentNode to be left child of parentNode.
    parentNode.setLeft(grandParentNode);

    // Transfer all left nodes from parent to right sub-tree of grandparent.
    grandParentNode.setRight(parentLeftNode);

    // Put parentNode node in place of grandParentNode.
    if (grandGrandParent) {
      if (grandParentNodeIsLeft) {
        grandGrandParent.setLeft(parentNode);
      } else {
        grandGrandParent.setRight(parentNode);
      }
    } else {
      // Make parent node a root.
      parentNode.parent = null;
    }

    // Swap colors of granParent and parent nodes.
    this.swapNodeColors(parentNode, grandParentNode);

    // Return new root node.
    return parentNode;
  }

  /**
   * Right Left Case (p is right child of g and x is left child of p)
   * @param {BinarySearchTreeNode|BinaryTreeNode} grandParentNode
   * @return {BinarySearchTreeNode}
   */
  rightLeftRotation(grandParentNode) {
    // Memorize right and right-left nodes.
    const parentNode = grandParentNode.right;
    const childNode = parentNode.left;

    // We need to memorize child right node to prevent losing
    // right child subtree. Later it will be re-assigned to
    // parent's left sub-tree.
    const childRightNode = childNode.right;

    // Make parentNode to be a right child of childNode.
    childNode.setRight(parentNode);

    // Move child's right subtree to parent's left subtree.
    parentNode.setLeft(childRightNode);

    // Put childNode node in place of parentNode.
    grandParentNode.setRight(childNode);

    // Now we're ready to do right-right rotation.
    return this.rightRightRotation(grandParentNode);
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} node
   * @return {BinarySearchTreeNode}
   */
  makeNodeRed(node) {
    node.meta.set(COLOR_PROP_NAME, RED_BLACK_TREE_COLORS.red);

    return node;
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} node
   * @return {BinarySearchTreeNode}
   */
  makeNodeBlack(node) {
    node.meta.set(COLOR_PROP_NAME, RED_BLACK_TREE_COLORS.black);

    return node;
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} node
   * @return {boolean}
   */
  isNodeRed(node) {
    return node.meta.get(COLOR_PROP_NAME) === RED_BLACK_TREE_COLORS.red;
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} node
   * @return {boolean}
   */
  isNodeBlack(node) {
    return node.meta.get(COLOR_PROP_NAME) === RED_BLACK_TREE_COLORS.black;
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} node
   * @return {boolean}
   */
  isNodeColored(node) {
    return this.isNodeRed(node) || this.isNodeBlack(node);
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} firstNode
   * @param {BinarySearchTreeNode|BinaryTreeNode} secondNode
   */
  swapNodeColors(firstNode, secondNode) {
    const firstColor = firstNode.meta.get(COLOR_PROP_NAME);
    const secondColor = secondNode.meta.get(COLOR_PROP_NAME);

    firstNode.meta.set(COLOR_PROP_NAME, secondColor);
    secondNode.meta.set(COLOR_PROP_NAME, firstColor);
  }
}
```

##### segment-tree

```js
import isPowerOfTwo from '../../../algorithms/math/is-power-of-two/isPowerOfTwo';

export default class SegmentTree {
  /**
   * @param {number[]} inputArray
   * @param {function} operation - binary function (i.e. sum, min)
   * @param {number} operationFallback - operation fallback value (i.e. 0 for sum, Infinity for min)
   */
  constructor(inputArray, operation, operationFallback) {
    this.inputArray = inputArray;
    this.operation = operation;
    this.operationFallback = operationFallback;

    // Init array representation of segment tree.
    this.segmentTree = this.initSegmentTree(this.inputArray);

    this.buildSegmentTree();
  }

  /**
   * @param {number[]} inputArray
   * @return {number[]}
   */
  initSegmentTree(inputArray) {
    let segmentTreeArrayLength;
    const inputArrayLength = inputArray.length;

    if (isPowerOfTwo(inputArrayLength)) {
      // If original array length is a power of two.
      segmentTreeArrayLength = 2 * inputArrayLength - 1;
    } else {
      // If original array length is not a power of two then we need to find
      // next number that is a power of two and use it to calculate
      // tree array size. This is happens because we need to fill empty children
      // in perfect binary tree with nulls.And those nulls need extra space.
      const currentPower = Math.floor(Math.log2(inputArrayLength));
      const nextPower = currentPower + 1;
      const nextPowerOfTwoNumber = 2 ** nextPower;
      segmentTreeArrayLength = 2 * nextPowerOfTwoNumber - 1;
    }

    return new Array(segmentTreeArrayLength).fill(null);
  }

  /**
   * Build segment tree.
   */
  buildSegmentTree() {
    const leftIndex = 0;
    const rightIndex = this.inputArray.length - 1;
    const position = 0;
    this.buildTreeRecursively(leftIndex, rightIndex, position);
  }

  /**
   * Build segment tree recursively.
   *
   * @param {number} leftInputIndex
   * @param {number} rightInputIndex
   * @param {number} position
   */
  buildTreeRecursively(leftInputIndex, rightInputIndex, position) {
    // If low input index and high input index are equal that would mean
    // the we have finished splitting and we are already came to the leaf
    // of the segment tree. We need to copy this leaf value from input
    // array to segment tree.
    if (leftInputIndex === rightInputIndex) {
      this.segmentTree[position] = this.inputArray[leftInputIndex];
      return;
    }

    // Split input array on two halves and process them recursively.
    const middleIndex = Math.floor((leftInputIndex + rightInputIndex) / 2);
    // Process left half of the input array.
    this.buildTreeRecursively(leftInputIndex, middleIndex, this.getLeftChildIndex(position));
    // Process right half of the input array.
    this.buildTreeRecursively(middleIndex + 1, rightInputIndex, this.getRightChildIndex(position));

    // Once every tree leaf is not empty we're able to build tree bottom up using
    // provided operation function.
    this.segmentTree[position] = this.operation(
      this.segmentTree[this.getLeftChildIndex(position)],
      this.segmentTree[this.getRightChildIndex(position)],
    );
  }

  /**
   * Do range query on segment tree in context of this.operation function.
   *
   * @param {number} queryLeftIndex
   * @param {number} queryRightIndex
   * @return {number}
   */
  rangeQuery(queryLeftIndex, queryRightIndex) {
    const leftIndex = 0;
    const rightIndex = this.inputArray.length - 1;
    const position = 0;

    return this.rangeQueryRecursive(queryLeftIndex, queryRightIndex, leftIndex, rightIndex, position);
  }

  /**
   * Do range query on segment tree recursively in context of this.operation function.
   *
   * @param {number} queryLeftIndex - left index of the query
   * @param {number} queryRightIndex - right index of the query
   * @param {number} leftIndex - left index of input array segment
   * @param {number} rightIndex - right index of input array segment
   * @param {number} position - root position in binary tree
   * @return {number}
   */
  rangeQueryRecursive(queryLeftIndex, queryRightIndex, leftIndex, rightIndex, position) {
    if (queryLeftIndex <= leftIndex && queryRightIndex >= rightIndex) {
      // Total overlap.
      return this.segmentTree[position];
    }

    if (queryLeftIndex > rightIndex || queryRightIndex < leftIndex) {
      // No overlap.
      return this.operationFallback;
    }

    // Partial overlap.
    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);

    const leftOperationResult = this.rangeQueryRecursive(
      queryLeftIndex,
      queryRightIndex,
      leftIndex,
      middleIndex,
      this.getLeftChildIndex(position),
    );

    const rightOperationResult = this.rangeQueryRecursive(
      queryLeftIndex,
      queryRightIndex,
      middleIndex + 1,
      rightIndex,
      this.getRightChildIndex(position),
    );

    return this.operation(leftOperationResult, rightOperationResult);
  }

  /**
   * Left child index.
   * @param {number} parentIndex
   * @return {number}
   */
  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  /**
   * Right child index.
   * @param {number} parentIndex
   * @return {number}
   */
  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }
}
```

### 字典树

在计算机科学中, **字典树(trie,中文又被称为”单词查找树“或 ”键树“)**, 也称为数字树,有时候也被称为基数树或前缀树（因为它们可以通过前缀搜索）,它是一种搜索树--一种已排序的数据结构,通常用于存储动态集或键为字符串的关联数组。

与二叉搜索树不同, 树上没有节点存储与该节点关联的键; 相反,节点在树上的位置定义了与之关联的键。一个节点的全部后代节点都有一个与该节点关联的通用的字符串前缀, 与根节点关联的是空字符串。

值对于字典树中关联的节点来说,不是必需的,相反,值往往和相关的叶子相关,以及与一些键相关的内部节点相关。

有关字典树的空间优化示意,请参阅紧凑前缀树

![Trie](https://upload.wikimedia.org/wikipedia/commons/b/be/Trie_example.svg)

#### Code

```js
import HashTable from '../hash-table/HashTable';

export default class TrieNode {
  /**
   * @param {string} character
   * @param {boolean} isCompleteWord
   */
  constructor(character, isCompleteWord = false) {
    this.character = character;
    this.isCompleteWord = isCompleteWord;
    this.children = new HashTable();
  }

  /**
   * @param {string} character
   * @return {TrieNode}
   */
  getChild(character) {
    return this.children.get(character);
  }

  /**
   * @param {string} character
   * @param {boolean} isCompleteWord
   * @return {TrieNode}
   */
  addChild(character, isCompleteWord = false) {
    if (!this.children.has(character)) {
      this.children.set(character, new TrieNode(character, isCompleteWord));
    }

    const childNode = this.children.get(character);

    // In cases similar to adding "car" after "carpet" we need to mark "r" character as complete.
    childNode.isCompleteWord = childNode.isCompleteWord || isCompleteWord;

    return childNode;
  }

  /**
   * @param {string} character
   * @return {TrieNode}
   */
  removeChild(character) {
    const childNode = this.getChild(character);

    // Delete childNode only if:
    // - childNode has NO children,
    // - childNode.isCompleteWord === false.
    if (childNode && !childNode.isCompleteWord && !childNode.hasChildren()) {
      this.children.delete(character);
    }

    return this;
  }

  /**
   * @param {string} character
   * @return {boolean}
   */
  hasChild(character) {
    return this.children.has(character);
  }

  /**
   * Check whether current TrieNode has children or not.
   * @return {boolean}
   */
  hasChildren() {
    return this.children.getKeys().length !== 0;
  }

  /**
   * @return {string[]}
   */
  suggestChildren() {
    return [...this.children.getKeys()];
  }

  /**
   * @return {string}
   */
  toString() {
    let childrenAsString = this.suggestChildren().toString();
    childrenAsString = childrenAsString ? `:${childrenAsString}` : '';
    const isCompleteString = this.isCompleteWord ? '*' : '';

    return `${this.character}${isCompleteString}${childrenAsString}`;
  }
}
```

```js
import TrieNode from './TrieNode';

// Character that we will use for trie tree root.
const HEAD_CHARACTER = '*';

export default class Trie {
  constructor() {
    this.head = new TrieNode(HEAD_CHARACTER);
  }

  /**
   * @param {string} word
   * @return {Trie}
   */
  addWord(word) {
    const characters = Array.from(word);
    let currentNode = this.head;

    for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
      const isComplete = charIndex === characters.length - 1;
      currentNode = currentNode.addChild(characters[charIndex], isComplete);
    }

    return this;
  }

  /**
   * @param {string} word
   * @return {Trie}
   */
  deleteWord(word) {
    const depthFirstDelete = (currentNode, charIndex = 0) => {
      if (charIndex >= word.length) {
        // Return if we're trying to delete the character that is out of word's scope.
        return;
      }

      const character = word[charIndex];
      const nextNode = currentNode.getChild(character);

      if (nextNode == null) {
        // Return if we're trying to delete a word that has not been added to the Trie.
        return;
      }

      // Go deeper.
      depthFirstDelete(nextNode, charIndex + 1);

      // Since we're going to delete a word let's un-mark its last character isCompleteWord flag.
      if (charIndex === word.length - 1) {
        nextNode.isCompleteWord = false;
      }

      // childNode is deleted only if:
      // - childNode has NO children
      // - childNode.isCompleteWord === false
      currentNode.removeChild(character);
    };

    // Start depth-first deletion from the head node.
    depthFirstDelete(this.head);

    return this;
  }

  /**
   * @param {string} word
   * @return {string[]}
   */
  suggestNextCharacters(word) {
    const lastCharacter = this.getLastCharacterNode(word);

    if (!lastCharacter) {
      return null;
    }

    return lastCharacter.suggestChildren();
  }

  /**
   * Check if complete word exists in Trie.
   *
   * @param {string} word
   * @return {boolean}
   */
  doesWordExist(word) {
    const lastCharacter = this.getLastCharacterNode(word);

    return !!lastCharacter && lastCharacter.isCompleteWord;
  }

  /**
   * @param {string} word
   * @return {TrieNode}
   */
  getLastCharacterNode(word) {
    const characters = Array.from(word);
    let currentNode = this.head;

    for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
      if (!currentNode.hasChild(characters[charIndex])) {
        return null;
      }

      currentNode = currentNode.getChild(characters[charIndex]);
    }

    return currentNode;
  }
}
```
