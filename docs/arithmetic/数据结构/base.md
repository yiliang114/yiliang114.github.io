---
layout: CustomPages
title: 算法基础
date: 2020-08-31
aside: false
---

## 算法基础

### 线性结构

数据结构我们可以从逻辑上分为线性结构和非线性结构。线性结构有
数组，栈，链表等， 非线性结构有树，图等。

> 其实我们可以称树为一种半线性结构。

需要注意的是，线性和非线性不代表存储结构是线性的还是非线性的，这两者没有任何关系，它只是一种逻辑上的划分。
比如我们可以用数组去存储二叉树。

一般而言，有前驱和后继的就是线性数据结构。比如数组和链表。其实一叉树就是链表。

#### 数组

数组是最简单的数据结构了，很多地方都用到它。 比如有一个数据列表等，用它是再合适不过了。
其实后面的数据结构很多都有数组的影子。

我们之后要讲的栈和队列其实都可以看成是一种`受限`的数组, 怎么个受限法呢？我们后面讨论。

我们来讲几个有趣的例子来加深大家对数组这种数据结构的理解。

##### React Hooks

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

#### 队列

队列是一种受限的序列，它只能够操作队尾和队首，并且只能只能在队尾添加元素，在队首删除元素。

队列作为一种最常见的数据结构同样有着非常广泛的应用， 比如消息队列

> "队列"这个名称,可类比为现实生活中排队（不插队的那种）

在计算机科学中, 一个 队列(queue) 是一种特殊类型的抽象数据类型或集合。集合中的实体按顺序保存。

队列基本操作有两种:

- 向队列的后端位置添加实体，称为入队
- 从队列的前端位置移除实体，称为出队。

队列中元素先进先出 FIFO (first in, first out)的示意：

我们前端在做性能优化的时候，很多时候会提到的一点就是“HTTP 1.1 的队头阻塞问题”，具体来说
就是 HTTP2 解决了 HTTP1.1 中的队头阻塞问题，但是为什么 HTTP1.1 有队头阻塞问题，HTTP2 究竟怎么解决的很多人都不清楚。

其实“队头阻塞”是一个专有名词，不仅仅这里有，交换器等其他都有这个问题，引起这个问题的根本原因是使用了`队列`这种数据结构。

对于同一个 tcp 连接，所有的 http1.0 请求放入队列中，只有前一个`请求的响应`收到了，然后才能发送下一个请求，这个阻塞主要发生在客户端。

这就好像我们在等红绿灯，即使旁边绿灯亮了，你的这个车道是红灯，你还是不能走，还是要等着。

`HTTP/1.0` 和 `HTTP/1.1`:
在`HTTP/1.0` 中每一次请求都需要建立一个 TCP 连接，请求结束后立即断开连接。
在`HTTP/1.1` 中，每一个连接都默认是长连接(persistent connection)。对于同一个 tcp 连接，允许一次发送多个 http1.1 请求，也就是说，不必等前一个响应收到，就可以发送下一个请求。这样就解决了 http1.0 的客户端的队头阻塞，而这也就是`HTTP/1.1`中`管道(Pipeline)`的概念了。
但是，`http1.1规定，服务器端的响应的发送要根据请求被接收的顺序排队`，也就是说，先接收到的请求的响应也要先发送。这样造成的问题是，如果最先收到的请求的处理时间长的话，响应生成也慢，就会阻塞已经生成了的响应的发送。也会造成队头阻塞。
可见，http1.1 的队首阻塞发生在服务器端。

`HTTP/2` 和 `HTTP/1.1`:

为了解决`HTTP/1.1`中的服务端队首阻塞，`HTTP/2`采用了`二进制分帧` 和 `多路复用` 等方法。
`二进制分帧`中，帧是`HTTP/2`数据通信的最小单位。在`HTTP/1.1`数据包是文本格式，而`HTTP/2`的数据包是二进制格式的，也就是二进制帧。采用帧可以将请求和响应的数据分割得更小，且二进制协议可以更高效解析。`HTTP/2`中，同域名下所有通信都在单个连接上完成，该连接可以承载任意数量的双向数据流。每个数据流都以消息的形式发送，而消息又由一个或多个帧组成。多个帧之间可以乱序发送，根据帧首部的流标识可以重新组装。
`多路复用`用以替代原来的序列和拥塞机制。在`HTTP/1.1`中，并发多个请求需要多个 TCP 链接，且单个域名有 6-8 个 TCP 链接请求限制。在`HHTP/2`中，同一域名下的所有通信在单个链接完成，仅占用一个 TCP 链接，且在这一个链接上可以并行请求和响应，互不干扰。

> [此网站](https://http2.akamai.com/demo)可以直观感受`HTTP/1.1`和`HTTP/2`的性能对比。

#### 栈

栈也是一种受限的序列，它只能够操作栈顶，不管入栈还是出栈，都是在栈顶操作。

在计算机科学中, 一个 栈(stack) 是一种抽象数据类型,用作表示元素的集合,具有两种主要操作:

push, 添加元素到栈的顶端(末尾);
pop, 移除栈最顶端(末尾)的元素.
以上两种操作可以简单概括为“后进先出(LIFO = last in, first out)”。

此外,应有一个 peek 操作用于访问栈当前顶端(末尾)的元素。（只返回不弹出）

> "栈"这个名称,可类比于一组物体的堆叠(一摞书,一摞盘子之类的)。

栈在很多地方都有着应用，比如大家熟悉的浏览器就有很多栈，其实浏览器的执行栈就是一个基本的栈结构，从数据结构上说，它就是一个栈。
这也就解释了，我们用递归的解法和用循环+栈的解法本质上是差不多。

比如如下 JS 代码：

```js
function bar() {
  const a = 1;
  const b = 2;
  console.log(a, b);
}
function foo() {
  const a = 1;
  bar();
}

foo();
```

> 我画的图没有画出执行上下文中其他部分（this 和 scope 等）， 这部分是闭包的关键，而我这里不是将闭包的，是为了讲解栈的。

> 社区中有很多“执行上下文中的 scope 指的是执行栈中父级声明的变量”说法，这是完全错误的， JS 是词法作用域，scope 指的是函数定义时候的父级，和执行没关系

栈常见的应用有进制转换，括号匹配，栈混洗，中缀表达式（用的很少），后缀表达式（逆波兰表达式）等。

> 合法的栈混洗操作，其实和合法的括号匹配表达式之间存在着一一对应的关系，
> 也就是说 n 个元素的栈混洗有多少种，n 对括号的合法表达式就有多少种。感兴趣的可以查找相关资料

#### 链表

链表是一种最基本数据结构，熟练掌握链表的结构和常见操作是基础中的基础。

##### React Fiber

很多人都说 fiber 是基于链表实现的，但是为什么要基于链表呢，可能很多人并没有答案，那么我觉得可以把这两个点（fiber 和链表）放到一起来讲下。

fiber 出现的目的其实是为了解决 react 在执行的时候是无法停下来的，需要一口气执行完的问题的。

上面已经指出了引入 fiber 之前的问题，就是 react 会阻止优先级高的代码（比如用户输入）执行。因此 fiber
打算自己自建一个`虚拟执行栈`来解决这个问题，这个虚拟执行栈的实现是链表。

Fiber 的基本原理是将协调过程分成小块，一次执行一块，然乎将运算结果保存起来，并判断是否有时间（react 自己实现了一个类似 requestIdleCallback 的功能）继续执行下一块。
如果有时间，则继续。 否则跳出，让浏览器主线程歇一会，执行别的优先级高的代码。

当协调过程完成（所有的小块都运算完毕）， 那么就会进入提交阶段， 真正的进行副作用（side effect）操作，比如更新 DOM，这个过程是没有办法取消的，原因就是这部分有副作用。

问题的关键就是将协调的过程划分为一块块的，最后还可以合并到一起，有点像 Map／Reduce。

React 必须重新实现遍历树的算法，从依赖于`内置堆栈的同步递归模型`，变为`具有链表和指针的异步模型`。

> Andrew 是这么说的： 如果你只依赖于[内置]调用堆栈，它将继续工作直到堆栈为空。。。

如果我们可以随意中断调用堆栈并手动操作堆栈帧，那不是很好吗？
这就是 React Fiber 的目的。 `Fiber 是堆栈的重新实现，专门用于 React 组件`。 你可以将单个 Fiber 视为一个`虚拟堆栈帧`。

react fiber 大概是这样的：

```js
let fiber = {
  tag: HOST_COMPONENT,
  type: 'div',
  return: parentFiber,
  children: childFiber,
  sibling: childFiber,
  alternate: currentFiber,
  stateNode: document.createElement('div'),
  props: { children: [], className: 'foo' },
  partialState: null,
  effectTag: PLACEMENT,
  effects: [],
};
```

从这里可以看出 fiber 本质上是个对象，使用 parent，child，sibling 属性去构建 fiber 树来表示组件的结构树，
return, children, sibling 也都是一个 fiber，因此 fiber 看起来就是一个链表。

> 细心的朋友可能已经发现了， alternate 也是一个 fiber， 那么它是用来做什么的呢？
> 它其实原理有点像 git， 可以用来执行 git revert ,git commit 等操作，这部分挺有意思，我会在我的《从零开发 git》中讲解

想要了解更多的朋友可以看[这个文章](https://github.com/dawn-plex/translate/blob/master/articles/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-to-walk-the-components-tree.md)

如果可以翻墙， 可以看[英文原文](https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-67f1014d0eb7)

[这篇文章](https://engineering.hexacta.com/didact-fiber-incremental-reconciliation-b2fe028dcaec)也是早期讲述 fiber 架构的优秀文章

我目前也在写关于《从零开发 react 系列教程》中关于 fiber 架构的部分，如果你对具体实现感兴趣，欢迎关注。

### 非线性结构

那么有了线性结构，我们为什么还需要非线性结构呢？ 答案是为了高效地兼顾静态操作和动态操作。
大家可以对照各种数据结构的各种操作的复杂度来直观感受一下。

#### 树

树的应用同样非常广泛，小到文件系统，大到因特网，组织架构等都可以表示为树结构，
而在我们前端眼中比较熟悉的 DOM 树也是一种树结构，而 HTML 作为一种 DSL 去描述这种树结构的具体表现形式。

树其实是一种特殊的`图`，是一种无环连通图，是一种极大无环图，也是一种极小连通图。

从另一个角度看，树是一种递归的数据结构。而且树的不同表示方法，比如不常用的`长子 + 兄弟`法，对于
你理解树这种数据结构有着很大用处， 说是一种对树的本质的更深刻的理解也不为过。

树的基本算法有前中后序遍历和层次遍历，有的同学对前中后这三个分别具体表现的访问顺序比较模糊，
其实当初我也是一样的，后面我学到了一点，你只需要记住：`所谓的前中后指的是根节点的位置，其他位置按照先左后右排列即可`。
比如前序遍历就是`根左右`, 中序就是`左根右`，后序就是`左右根`， 很简单吧？

我刚才提到了树是一种递归的数据结构，因此树的遍历算法使用递归去完成非常简单，
幸运的是树的算法基本上都要依赖于树的遍历。 但是递归在计算机中的性能一直都有问题，
因此掌握不那么容易理解的"命令式地迭代"遍历算法在某些情况下是有用的。

如果你使用迭代式方式去遍历的话，可以借助上面提到的`栈`来进行，可以极大减少代码量。

> 如果使用栈来简化运算，由于栈是 FILO 的，因此一定要注意左右子树的推入顺序。

树的重要性质：

- 如果树有 n 个顶点，那么其就有 n - 1 条边，这说明了树的顶点数和边数是同阶的。
- 任何一个节点到根节点存在`唯一`路径, 路径的长度为节点所处的深度

#### 二叉树

二叉树是节点度数不超过二的树（二叉树是每个结点最多有两个子树的树结构），是树的一种特殊子集，有趣的是二叉树这种被限制的树结构却能够表示和实现所有的树，
它背后的原理正是`长子 + 兄弟`法，用邓老师的话说就是`二叉树是多叉树的特例，但在有根且有序时，其描述能力却足以覆盖后者`。二叉树常被用于实现二叉查找树和二叉堆。

> 实际上， 在你使用`长子 + 兄弟`法表示树的同时，进行 45 度角旋转即可。

相关算法:

- [94.binary-tree-inorder-traversal](../problems/94.binary-tree-inorder-traversal.md)
- [102.binary-tree-level-order-traversal](../problems/102.binary-tree-level-order-traversal.md)
- [103.binary-tree-zigzag-level-order-traversal](../problems/103.binary-tree-zigzag-level-order-traversal.md)
- [144.binary-tree-preorder-traversal](../problems/144.binary-tree-preorder-traversal.md)
- [145.binary-tree-postorder-traversal](../problems/145.binary-tree-postorder-traversal.md)
- [199.binary-tree-right-side-view](../problems/199.binary-tree-right-side-view.md)

相关概念：

- 真二叉树 （所有节点的度数只能是偶数，即只能为 0 或者 2）

另外我也专门开设了[二叉树的遍历](./binary-tree-traversal.md)章节, 具体细节和算法可以去那里查看。

##### 堆

堆其实是一种优先级队列，在很多语言都有对应的内置数据结构，很遗憾 javascript 没有这种原生的数据结构。
不过这对我们理解和运用不会有影响。

需要注意的是优先队列不仅有堆一种，还有更复杂的，但是通常来说，我们会把两者做等价。

相关算法：

- [295.find-median-from-data-stream](../problems/295.find-median-from-data-stream.md)

##### 二叉查找树

#### 平衡树

database engine

##### AVL

##### 红黑树

#### 字典树(前缀树)

##### immutable 与 字典树

immutable 的底层就是 share + tree. 这样看的话，其实和字典树是一致的。

相关算法：

- [208.implement-trie-prefix-tree](../problems/208.implement-trie-prefix-tree.md)

### 图

前面讲的数据结构都可以看成是图的特例。 前面提到了二叉树完全可以实现其他树结构，
其实有向图也完全可以实现无向图和混合图，因此有向图的研究一直是重点考察对象。

### 图的表示方法

- 邻接矩阵(常见)

空间复杂度 O(n^2),n 为顶点个数。

优点：

1. 直观，简单。

2. 适用于稠密图

3. 判断两个顶点是否连接，获取入度和出度以及更新度数，时间复杂度都是 O(1)

- 关联矩阵
- 邻接表

1. 适用于稀疏图

### 时间复杂度

通常使用最差的时间复杂度来衡量一个算法的好坏。

常数时间 O(1) 代表这个操作和数据量没关系，是一个固定时间的操作，比如说四则运算。

对于一个算法来说，可能会计算出操作次数为 aN + 1，N 代表数据量。那么该算法的时间复杂度就是 O(N)。因为我们在计算时间复杂度的时候，数据量通常是非常大的，这时候低阶项和常数项可以忽略不计。

当然可能会出现两个算法都是 O(N) 的时间复杂度，那么对比两个算法的好坏就要通过对比低阶项和常数项了。

### 栈

#### 概念

栈是一个线性结构，在计算机中是一个相当常见的数据结构。

栈的特点是只能在某一端添加或删除数据，遵循先进后出的原则

#### 实现

每种数据结构都可以用很多种方式来实现，其实可以把栈看成是数组的一个子集，所以这里使用数组来实现

```js
class Stack {
  constructor() {
    this.stack = [];
  }
  push(item) {
    this.stack.push(item);
  }
  pop() {
    this.stack.pop();
  }
  peek() {
    return this.stack[this.getCount() - 1];
  }
  getCount() {
    return this.stack.length;
  }
  isEmpty() {
    return this.getCount() === 0;
  }
}
```

#### 应用

选取了 [LeetCode 上序号为 20 的题目](https://link.juejin.im/?target=https%3A%2F%2Fleetcode.com%2Fproblems%2Fvalid-parentheses%2Fsubmissions%2F1)

题意是匹配括号，可以通过栈的特性来完成这道题目

```
var isValid = function (s) {
  let map = {
    '(': -1,
    ')': 1,
    '[': -2,
    ']': 2,
    '{': -3,
    '}': 3
  }
  let stack = []
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]] < 0) {
      stack.push(s[i])
    } else {
      let last = stack.pop()
      if (map[last] + map[s[i]] != 0) return false
    }
  }
  if (stack.length > 0) return false
  return true
};
```

其实在 Vue 中关于模板解析的代码，就有应用到匹配尖括号的内容。

### 堆

#### 概念

堆通常是一个可以被看做一棵树的数组对象。

堆的实现通过构造**二叉堆**，实为二叉树的一种。这种数据结构具有以下性质。

- 任意节点小于（或大于）它的所有子节点
- 堆总是一棵完全树。即除了最底层，其他层的节点都被元素填满，且最底层从左到右填入。

将根节点最大的堆叫做**最大堆**或**大根堆**，根节点最小的堆叫做**最小堆**或**小根堆**。

优先队列也完全可以用堆来实现，操作是一模一样的。

#### 实现大根堆

堆的每个节点的左边子节点索引是 `i * 2 + 1`，右边是 `i * 2 + 2`，父节点是 `(i - 1) /2`。

堆有两个核心的操作，分别是 `shiftUp` 和 `shiftDown` 。前者用于添加元素，后者用于删除根节点。

`shiftUp` 的核心思路是一路将节点与父节点对比大小，如果比父节点大，就和父节点交换位置。

`shiftDown` 的核心思路是先将根节点和末尾交换位置，然后移除末尾元素。接下来循环判断父节点和两个子节点的大小，如果子节点大，就把最大的子节点和父节点交换。

```js
class MaxHeap {
  constructor() {
    this.heap = [];
  }
  size() {
    return this.heap.length;
  }
  empty() {
    return this.size() == 0;
  }
  add(item) {
    this.heap.push(item);
    this._shiftUp(this.size() - 1);
  }
  removeMax() {
    this._shiftDown(0);
  }
  getParentIndex(k) {
    return parseInt((k - 1) / 2);
  }
  getLeftIndex(k) {
    return k * 2 + 1;
  }
  _shiftUp(k) {
    // 如果当前节点比父节点大，就交换
    while (this.heap[k] > this.heap[this.getParentIndex(k)]) {
      this._swap(k, this.getParentIndex(k));
      // 将索引变成父节点
      k = this.getParentIndex(k);
    }
  }
  _shiftDown(k) {
    // 交换首位并删除末尾
    this._swap(k, this.size() - 1);
    this.heap.splice(this.size() - 1, 1);
    // 判断节点是否有左孩子，因为二叉堆的特性，有右必有左
    while (this.getLeftIndex(k) < this.size()) {
      let j = this.getLeftIndex(k);
      // 判断是否有右孩子，并且右孩子是否大于左孩子
      if (j + 1 < this.size() && this.heap[j + 1] > this.heap[j]) j++;
      // 判断父节点是否已经比子节点都大
      if (this.heap[k] >= this.heap[j]) break;
      this._swap(k, j);
      k = j;
    }
  }
  _swap(left, right) {
    let rightValue = this.heap[right];
    this.heap[right] = this.heap[left];
    this.heap[left] = rightValue;
  }
}
```

#### 堆

堆 是一种特殊的完全二叉树结构，通常，它有两种类型：最小堆 和 最大堆。
最小堆（min heap）是父节点的值恒小于等于子节点的值。
最大堆（max heap）是父节点的值恒大于等于子节点的值。

二叉堆的性质
任意节点小于（或大于）它的所有子节点，最小值（或最大值）在堆的根上。
堆总是一棵完全树。即除了最底层，其他层的节点都被元素填满，且最底层尽可能地从左到右填入。

#### 树

B-tree 树即 B 树，B 即 Balanced，平衡的意思。因为 B 树的原英文名称为 B-tree，而国内很多人喜欢把 B-tree 译作 B-树，其实，这是个非常不好的直译，很容易让人产生误解。如人们可能会以为 B-树是一种树，而 B 树又是另一种树。而事实上是，B-tree 就是指的 B 树。

先介绍下二叉搜索树 也就是 B 树 1.所有非叶子结点至多拥有两个儿子（Left 和 Right）； 2.所有结点存储一个关键字； 3.非叶子结点的左指针指向小于其关键字的子树，右指针指向大于其关键字的子树

#### 回溯

回溯法（back tracking）（探索与回溯法）是一种选优搜索法，又称为试探法，按选优条件向前搜索，以达到目标。但当探索到某一步时，发现原先选择并不优或达不到目标，就退回一步重新选择，这种走不通就退回再走的技术为回溯法，而满足回溯条件的某个状态的点称为“回溯点”。

白话：回溯法可以理解为通过选择不同的岔路口寻找目的地，一个岔路口一个岔路口的去尝试找到目的地。如果走错了路，继续返回来找到岔路口的另一条路，直到找到目的地。

#### 栈和队列的区别?

栈的插入和删除操作都是在一端进行的，而队列的操作却是在两端进行的。
队列先进先出，栈先进后出。
栈只允许在表尾一端进行插入和删除，而队列只允许在表尾一端进行插入，在表头一端进行删除

#### 栈和堆的区别？

栈区（stack）— 由编译器自动分配释放 ，存放函数的参数值，局部变量的值等。
堆区（heap） — 一般由程序员分配释放， 若程序员不释放，程序结束时可能由 OS 回收。
堆（数据结构）：堆可以被看成是一棵树，如：堆排序；
栈（数据结构）：一种先进后出的数据结构。

### 队列

#### 概念

队列是一个线性结构，特点是在某一端添加数据，在另一端删除数据，遵循先进先出的原则。

#### 实现

这里会讲解两种实现队列的方式，分别是单链队列和循环队列。

##### 单链队列

```
class Queue {
  constructor() {
    this.queue = []
  }
  enQueue(item) {
    this.queue.push(item)
  }
  deQueue() {
    return this.queue.shift()
  }
  getHeader() {
    return this.queue[0]
  }
  getLength() {
    return this.queue.length
  }
  isEmpty() {
    return this.getLength() === 0
  }
}
```

因为单链队列在出队操作的时候需要 O(n) 的时间复杂度，所以引入了循环队列。循环队列的出队操作平均是 O(1) 的时间复杂度。

##### 循环队列

```
class SqQueue {
  constructor(length) {
    this.queue = new Array(length + 1)
    // 队头
    this.first = 0
    // 队尾
    this.last = 0
    // 当前队列大小
    this.size = 0
  }
  enQueue(item) {
    // 判断队尾 + 1 是否为队头
    // 如果是就代表需要扩容数组
    // % this.queue.length 是为了防止数组越界
    if (this.first === (this.last + 1) % this.queue.length) {
      this.resize(this.getLength() * 2 + 1)
    }
    this.queue[this.last] = item
    this.size++
    this.last = (this.last + 1) % this.queue.length
  }
  deQueue() {
    if (this.isEmpty()) {
      throw Error('Queue is empty')
    }
    let r = this.queue[this.first]
    this.queue[this.first] = null
    this.first = (this.first + 1) % this.queue.length
    this.size--
    // 判断当前队列大小是否过小
    // 为了保证不浪费空间，在队列空间等于总长度四分之一时
    // 且不为 2 时缩小总长度为当前的一半
    if (this.size === this.getLength() / 4 && this.getLength() / 2 !== 0) {
      this.resize(this.getLength() / 2)
    }
    return r
  }
  getHeader() {
    if (this.isEmpty()) {
      throw Error('Queue is empty')
    }
    return this.queue[this.first]
  }
  getLength() {
    return this.queue.length - 1
  }
  isEmpty() {
    return this.first === this.last
  }
  resize(length) {
    let q = new Array(length)
    for (let i = 0; i < length; i++) {
      q[i] = this.queue[(i + this.first) % this.queue.length]
    }
    this.queue = q
    this.first = 0
    this.last = this.size
  }
}
```

### 链表

#### 概念

链表是一个线性结构，同时也是一个天然的递归结构。链表结构可以充分利用计算机内存空间，实现灵活的内存动态管理。但是链表失去了数组随机读取的优点，同时链表由于增加了结点的指针域，空间开销比较大。

#### 实现

**单向链表**

```
class Node {
  constructor(v, next) {
    this.value = v
    this.next = next
  }
}
class LinkList {
  constructor() {
    // 链表长度
    this.size = 0
    // 虚拟头部
    this.dummyNode = new Node(null, null)
  }
  find(header, index, currentIndex) {
    if (index === currentIndex) return header
    return this.find(header.next, index, currentIndex + 1)
  }
  addNode(v, index) {
    this.checkIndex(index)
    // 当往链表末尾插入时，prev.next 为空
    // 其他情况时，因为要插入节点，所以插入的节点
    // 的 next 应该是 prev.next
    // 然后设置 prev.next 为插入的节点
    let prev = this.find(this.dummyNode, index, 0)
    prev.next = new Node(v, prev.next)
    this.size++
    return prev.next
  }
  insertNode(v, index) {
    return this.addNode(v, index)
  }
  addToFirst(v) {
    return this.addNode(v, 0)
  }
  addToLast(v) {
    return this.addNode(v, this.size)
  }
  removeNode(index, isLast) {
    this.checkIndex(index)
    index = isLast ? index - 1 : index
    let prev = this.find(this.dummyNode, index, 0)
    let node = prev.next
    prev.next = node.next
    node.next = null
    this.size--
    return node
  }
  removeFirstNode() {
    return this.removeNode(0)
  }
  removeLastNode() {
    return this.removeNode(this.size, true)
  }
  checkIndex(index) {
    if (index < 0 || index > this.size) throw Error('Index error')
  }
  getNode(index) {
    this.checkIndex(index)
    if (this.isEmpty()) return
    return this.find(this.dummyNode, index, 0).next
  }
  isEmpty() {
    return this.size === 0
  }
  getSize() {
    return this.size
  }
}
```

#### 反转单向链表

该题目来自 [LeetCode](https://leetcode.com/problems/reverse-linked-list/description/)，题目需要将一个单向链表反转。思路很简单，使用三个变量分别表示当前节点和当前节点的前后节点，虽然这题很简单，但是却是一道面试常考题

以下是实现该算法的代码

```js
var reverseList = function(head) {
  // 判断下变量边界问题
  if (!head || !head.next) return head;
  // 初始设置为空，因为第一个节点反转后就是尾部，尾部节点指向 null
  let pre = null;
  let current = head;
  let next;
  // 判断当前节点是否为空
  // 不为空就先获取当前节点的下一节点
  // 然后把当前节点的 next 设为上一个节点
  // 然后把 current 设为下一个节点，pre 设为当前节点
  while (current) {
    next = current.next;
    current.next = pre;
    pre = current;
    current = next;
  }
  return pre;
};
```

### 树

#### 二叉树

树拥有很多种结构，二叉树是树中最常用的结构，同时也是一个天然的递归结构。

二叉树拥有一个根节点，每个节点至多拥有两个子节点，分别为：左节点和右节点。树的最底部节点称之为叶节点，当一颗树的叶数量数量为满时，该树可以称之为满二叉树。

#### 二分搜索树

二分搜索树也是二叉树，拥有二叉树的特性。但是区别在于二分搜索树每个节点的值都比他的左子树的值大，比右子树的值小。

这种存储方式很适合于数据搜索。如下图所示，当需要查找 6 的时候，因为需要查找的值比根节点的值大，所以只需要在根节点的右子树上寻找，大大提高了搜索效率。

#### 实现

```js
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
class BST {
  constructor() {
    this.root = null;
    this.size = 0;
  }
  getSize() {
    return this.size;
  }
  isEmpty() {
    return this.size === 0;
  }
  addNode(v) {
    this.root = this._addChild(this.root, v);
  }
  // 添加节点时，需要比较添加的节点值和当前
  // 节点值的大小
  _addChild(node, v) {
    if (!node) {
      this.size++;
      return new Node(v);
    }
    if (node.value > v) {
      node.left = this._addChild(node.left, v);
    } else if (node.value < v) {
      node.right = this._addChild(node.right, v);
    }
    return node;
  }
}
```

以上是最基本的二分搜索树实现，接下来实现树的遍历。

对于树的遍历来说，有三种遍历方法，分别是先序遍历、中序遍历、后序遍历。三种遍历的区别在于何时访问节点。在遍历树的过程中，每个节点都会遍历三次，分别是遍历到自己，遍历左子树和遍历右子树。如果需要实现先序遍历，那么只需要第一次遍历到节点时进行操作即可。

```
// 先序遍历可用于打印树的结构
// 先序遍历先访问根节点，然后访问左节点，最后访问右节点。
preTraversal() {
  this._pre(this.root)
}
_pre(node) {
  if (node) {
    console.log(node.value)
    this._pre(node.left)
    this._pre(node.right)
  }
}
// 中序遍历可用于排序
// 对于 BST 来说，中序遍历可以实现一次遍历就
// 得到有序的值
// 中序遍历表示先访问左节点，然后访问根节点，最后访问右节点。
midTraversal() {
  this._mid(this.root)
}
_mid(node) {
  if (node) {
    this._mid(node.left)
    console.log(node.value)
    this._mid(node.right)
  }
}
// 后序遍历可用于先操作子节点
// 再操作父节点的场景
// 后序遍历表示先访问左节点，然后访问右节点，最后访问根节点。
backTraversal() {
  this._back(this.root)
}
_back(node) {
  if (node) {
    this._back(node.left)
    this._back(node.right)
    console.log(node.value)
  }
}
```

以上的这几种遍历都可以称之为深度遍历，对应的还有种遍历叫做广度遍历，也就是一层层地遍历树。对于广度遍历来说，我们需要利用之前讲过的队列结构来完成。

```
breadthTraversal() {
  if (!this.root) return null
  let q = new Queue()
  // 将根节点入队
  q.enQueue(this.root)
  // 循环判断队列是否为空，为空
  // 代表树遍历完毕
  while (!q.isEmpty()) {
    // 将队首出队，判断是否有左右子树
    // 有的话，就先左后右入队
    let n = q.deQueue()
    console.log(n.value)
    if (n.left) q.enQueue(n.left)
    if (n.right) q.enQueue(n.right)
  }
}
```

接下来先介绍如何在树中寻找最小值或最大数。因为二分搜索树的特性，所以最小值一定在根节点的最左边，最大值相反

```
getMin() {
  return this._getMin(this.root).value
}
_getMin(node) {
  if (!node.left) return node
  return this._getMin(node.left)
}
getMax() {
  return this._getMax(this.root).value
}
_getMax(node) {
  if (!node.right) return node
  return this._getMin(node.right)
}
```

**向上取整和向下取整**，这两个操作是相反的，所以代码也是类似的，这里只介绍如何向下取整。既然是向下取整，那么根据二分搜索树的特性，值一定在根节点的左侧。只需要一直遍历左子树直到当前节点的值不再大于等于需要的值，然后判断节点是否还拥有右子树。如果有的话，继续上面的递归判断。

```
floor(v) {
  let node = this._floor(this.root, v)
  return node ? node.value : null
}
_floor(node, v) {
  if (!node) return null
  if (node.value === v) return v
  // 如果当前节点值还比需要的值大，就继续递归
  if (node.value > v) {
    return this._floor(node.left, v)
  }
  // 判断当前节点是否拥有右子树
  let right = this._floor(node.right, v)
  if (right) return right
  return node
}
```

**排名**，这是用于获取给定值的排名或者排名第几的节点的值，这两个操作也是相反的，所以这个只介绍如何获取排名第几的节点的值。对于这个操作而言，我们需要略微的改造点代码，让每个节点拥有一个 `size` 属性。该属性表示该节点下有多少子节点（包含自身）。

```
class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    // 修改代码
    this.size = 1
  }
}
// 新增代码
_getSize(node) {
  return node ? node.size : 0
}
_addChild(node, v) {
  if (!node) {
    return new Node(v)
  }
  if (node.value > v) {
    // 修改代码
    node.size++
    node.left = this._addChild(node.left, v)
  } else if (node.value < v) {
    // 修改代码
    node.size++
    node.right = this._addChild(node.right, v)
  }
  return node
}
select(k) {
  let node = this._select(this.root, k)
  return node ? node.value : null
}
_select(node, k) {
  if (!node) return null
  // 先获取左子树下有几个节点
  let size = node.left ? node.left.size : 0
  // 判断 size 是否大于 k
  // 如果大于 k，代表所需要的节点在左节点
  if (size > k) return this._select(node.left, k)
  // 如果小于 k，代表所需要的节点在右节点
  // 注意这里需要重新计算 k，减去根节点除了右子树的节点数量
  if (size < k) return this._select(node.right, k - size - 1)
  return node
}
```

接下来讲解的是二分搜索树中最难实现的部分：删除节点。因为对于删除节点来说，会存在以下几种情况

- 需要删除的节点没有子树
- 需要删除的节点只有一条子树
- 需要删除的节点有左右两条树

对于前两种情况很好解决，但是第三种情况就有难度了，所以先来实现相对简单的操作：删除最小节点，对于删除最小节点来说，是不存在第三种情况的，删除最大节点操作是和删除最小节点相反的，所以这里也就不再赘述。

```
delectMin() {
  this.root = this._delectMin(this.root)
  console.log(this.root)
}
_delectMin(node) {
  // 一直递归左子树
  // 如果左子树为空，就判断节点是否拥有右子树
  // 有右子树的话就把需要删除的节点替换为右子树
  if ((node != null) & !node.left) return node.right
  node.left = this._delectMin(node.left)
  // 最后需要重新维护下节点的 `size`
  node.size = this._getSize(node.left) + this._getSize(node.right) + 1
  return node
}
```

最后讲解的就是如何删除任意节点了。对于这个操作，T.Hibbard 在 1962 年提出了解决这个难题的办法，也就是如何解决第三种情况。

当遇到这种情况时，需要取出当前节点的后继节点（也就是当前节点右子树的最小节点）来替换需要删除的节点。然后将需要删除节点的左子树赋值给后继结点，右子树删除后继结点后赋值给他。

你如果对于这个解决办法有疑问的话，可以这样考虑。因为二分搜索树的特性，父节点一定比所有左子节点大，比所有右子节点小。那么当需要删除父节点时，势必需要拿出一个比父节点大的节点来替换父节点。这个节点肯定不存在于左子树，必然存在于右子树。然后又需要保持父节点都是比右子节点小的，那么就可以取出右子树中最小的那个节点来替换父节点。

```
delect(v) {
  this.root = this._delect(this.root, v)
}
_delect(node, v) {
  if (!node) return null
  // 寻找的节点比当前节点小，去左子树找
  if (node.value < v) {
    node.right = this._delect(node.right, v)
  } else if (node.value > v) {
    // 寻找的节点比当前节点大，去右子树找
    node.left = this._delect(node.left, v)
  } else {
    // 进入这个条件说明已经找到节点
    // 先判断节点是否拥有拥有左右子树中的一个
    // 是的话，将子树返回出去，这里和 `_delectMin` 的操作一样
    if (!node.left) return node.right
    if (!node.right) return node.left
    // 进入这里，代表节点拥有左右子树
    // 先取出当前节点的后继结点，也就是取当前节点右子树的最小值
    let min = this._getMin(node.right)
    // 取出最小值后，删除最小值
    // 然后把删除节点后的子树赋值给最小值节点
    min.right = this._delectMin(node.right)
    // 左子树不动
    min.left = node.left
    node = min
  }
  // 维护 size
  node.size = this._getSize(node.left) + this._getSize(node.right) + 1
  return node
}
```

#### 二叉树的先序，中序，后序遍历

先序遍历表示先访问根节点，然后访问左节点，最后访问右节点。

中序遍历表示先访问左节点，然后访问根节点，最后访问右节点。

后序遍历表示先访问左节点，然后访问右节点，最后访问根节点。

##### 递归实现

递归实现相当简单，代码如下

```js
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}
var traversal = function(root) {
  if (root) {
    // 先序
    console.log(root);
    traversal(root.left);
    // 中序
    // console.log(root);
    traversal(root.right);
    // 后序
    // console.log(root);
  }
};
```

对于递归的实现来说，只需要理解每个节点都会被访问三次就明白为什么这样实现了。

##### 非递归实现

非递归实现使用了栈的结构，通过栈的先进后出模拟递归实现。

以下是先序遍历代码实现

```js
function pre(root) {
  if (root) {
    let stack = [];
    // 先将根节点 push
    stack.push(root);
    // 判断栈中是否为空
    while (stack.length > 0) {
      // 弹出栈顶元素
      root = stack.pop();
      console.log(root);
      // 因为先序遍历是先左后右，栈是先进后出结构
      // 所以先 push 右边再 push 左边
      if (root.right) {
        stack.push(root.right);
      }
      if (root.left) {
        stack.push(root.left);
      }
    }
  }
}
```

以下是中序遍历代码实现

```js
function mid(root) {
  if (root) {
    let stack = [];
    // 中序遍历是先左再根最后右
    // 所以首先应该先把最左边节点遍历到底依次 push 进栈
    // 当左边没有节点时，就打印栈顶元素，然后寻找右节点
    // 对于最左边的叶节点来说，可以把它看成是两个 null 节点的父节点
    // 左边打印不出东西就把父节点拿出来打印，然后再看右节点
    while (stack.length > 0 || root) {
      if (root) {
        stack.push(root);
        root = root.left;
      } else {
        root = stack.pop();
        console.log(root);
        root = root.right;
      }
    }
  }
}
```

以下是后序遍历代码实现，该代码使用了两个栈来实现遍历，相比一个栈的遍历来说要容易理解很多

```js
function pos(root) {
  if (root) {
    let stack1 = [];
    let stack2 = [];
    // 后序遍历是先左再右最后根
    // 所以对于一个栈来说，应该先 push 根节点
    // 然后 push 右节点，最后 push 左节点
    stack1.push(root);
    while (stack1.length > 0) {
      root = stack1.pop();
      stack2.push(root);
      if (root.left) {
        stack1.push(root.left);
      }
      if (root.right) {
        stack1.push(root.right);
      }
    }
    while (stack2.length > 0) {
      console.log(s2.pop());
    }
  }
}
```

#### 中序遍历的前驱后继节点

实现这个算法的前提是节点有一个 `parent` 的指针指向父节点，根节点指向 `null` 。

<div align="center"><img src="https://user-gold-cdn.xitu.io/2018/4/24/162f61ad8e8588b7?w=682&h=486&f=png&s=41027" width=400 /></div>

如图所示，该树的中序遍历结果是 `4, 2, 5, 1, 6, 3, 7`

##### 前驱节点

对于节点 `2` 来说，他的前驱节点就是 `4` ，按照中序遍历原则，可以得出以下结论

1. 如果选取的节点的左节点不为空，就找该左节点最右的节点。对于节点 `1` 来说，他有左节点 `2` ，那么节点 `2` 的最右节点就是 `5`
2. 如果左节点为空，且目标节点是父节点的右节点，那么前驱节点为父节点。对于节点 `5` 来说，没有左节点，且是节点 `2` 的右节点，所以节点 `2` 是前驱节点
3. 如果左节点为空，且目标节点是父节点的左节点，向上寻找到第一个是父节点的右节点的节点。对于节点 `6` 来说，没有左节点，且是节点 `3` 的左节点，所以向上寻找到节点 `1` ，发现节点 `3` 是节点 `1` 的右节点，所以节点 `1` 是节点 `6` 的前驱节点

以下是算法实现

```js
function predecessor(node) {
  if (!node) return;
  // 结论 1
  if (node.left) {
    return getRight(node.left);
  } else {
    let parent = node.parent;
    // 结论 2 3 的判断
    while (parent && parent.right === node) {
      node = parent;
      parent = node.parent;
    }
    return parent;
  }
}
function getRight(node) {
  if (!node) return;
  node = node.right;
  while (node) node = node.right;
  return node;
}
```

##### 后继节点

对于节点 `2` 来说，他的后继节点就是 `5` ，按照中序遍历原则，可以得出以下结论

1. 如果有右节点，就找到该右节点的最左节点。对于节点 `1` 来说，他有右节点 `3` ，那么节点 `3` 的最左节点就是 `6`
2. 如果没有右节点，就向上遍历直到找到一个节点是父节点的左节点。对于节点 `5` 来说，没有右节点，就向上寻找到节点 `2` ，该节点是父节点 `1` 的左节点，所以节点 `1` 是后继节点

以下是算法实现

```js
function successor(node) {
  if (!node) return;
  // 结论 1
  if (node.right) {
    return getLeft(node.right);
  } else {
    // 结论 2
    let parent = node.parent;
    // 判断 parent 为空
    while (parent && parent.left === node) {
      node = parent;
      parent = node.parent;
    }
    return parent;
  }
}
function getLeft(node) {
  if (!node) return;
  node = node.left;
  while (node) node = node.left;
  return node;
}
```

#### 树的深度

**树的最大深度**：该题目来自 [Leetcode](https://leetcode.com/problems/maximum-depth-of-binary-tree/description/)，题目需要求出一颗二叉树的最大深度

以下是算法实现

```js
var maxDepth = function(root) {
  if (!root) return 0;
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
};
```

对于该递归函数可以这样理解：一旦没有找到节点就会返回 0，每弹出一次递归函数就会加一，树有三层就会得到 3。

### AVL 树

#### 概念

二分搜索树实际在业务中是受到限制的，因为并不是严格的 O(logN)，在极端情况下会退化成链表，比如加入一组升序的数字就会造成这种情况。

AVL 树改进了二分搜索树，在 AVL 树中任意节点的左右子树的高度差都不大于 1，这样保证了时间复杂度是严格的 O(logN)。基于此，对 AVL 树增加或删除节点时可能需要旋转树来达到高度的平衡。

#### 实现

因为 AVL 树是改进了二分搜索树，所以部分代码是于二分搜索树重复的，对于重复内容不作再次解析。

对于 AVL 树来说，添加节点会有四种情况

对于左左情况来说，新增加的节点位于节点 2 的左侧，这时树已经不平衡，需要旋转。因为搜索树的特性，节点比左节点大，比右节点小，所以旋转以后也要实现这个特性。

旋转之前：new < 2 < C < 3 < B < 5 < A，右旋之后节点 3 为根节点，这时候需要将节点 3 的右节点加到节点 5 的左边，最后还需要更新节点的高度。

对于右右情况来说，相反于左左情况，所以不再赘述。

对于左右情况来说，新增加的节点位于节点 4 的右侧。对于这种情况，需要通过两次旋转来达到目的。

首先对节点的左节点左旋，这时树满足左左的情况，再对节点进行一次右旋就可以达到目的。

```
class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.height = 1
  }
}

class AVL {
  constructor() {
    this.root = null
  }
  addNode(v) {
    this.root = this._addChild(this.root, v)
  }
  _addChild(node, v) {
    if (!node) {
      return new Node(v)
    }
    if (node.value > v) {
      node.left = this._addChild(node.left, v)
    } else if (node.value < v) {
      node.right = this._addChild(node.right, v)
    } else {
      node.value = v
    }
    node.height =
      1 + Math.max(this._getHeight(node.left), this._getHeight(node.right))
    let factor = this._getBalanceFactor(node)
    // 当需要右旋时，根节点的左树一定比右树高度高
    if (factor > 1 && this._getBalanceFactor(node.left) >= 0) {
      return this._rightRotate(node)
    }
    // 当需要左旋时，根节点的左树一定比右树高度矮
    if (factor < -1 && this._getBalanceFactor(node.right) <= 0) {
      return this._leftRotate(node)
    }
    // 左右情况
    // 节点的左树比右树高，且节点的左树的右树比节点的左树的左树高
    if (factor > 1 && this._getBalanceFactor(node.left) < 0) {
      node.left = this._leftRotate(node.left)
      return this._rightRotate(node)
    }
    // 右左情况
    // 节点的左树比右树矮，且节点的右树的右树比节点的右树的左树矮
    if (factor < -1 && this._getBalanceFactor(node.right) > 0) {
      node.right = this._rightRotate(node.right)
      return this._leftRotate(node)
    }

    return node
  }
  _getHeight(node) {
    if (!node) return 0
    return node.height
  }
  _getBalanceFactor(node) {
    return this._getHeight(node.left) - this._getHeight(node.right)
  }
  // 节点右旋
  //           5                    2
  //         /   \                /   \
  //        2     6   ==>       1      5
  //       /  \               /       /  \
  //      1    3             new     3    6
  //     /
  //    new
  _rightRotate(node) {
    // 旋转后新根节点
    let newRoot = node.left
    // 需要移动的节点
    let moveNode = newRoot.right
    // 节点 2 的右节点改为节点 5
    newRoot.right = node
    // 节点 5 左节点改为节点 3
    node.left = moveNode
    // 更新树的高度
    node.height =
      1 + Math.max(this._getHeight(node.left), this._getHeight(node.right))
    newRoot.height =
      1 +
      Math.max(this._getHeight(newRoot.left), this._getHeight(newRoot.right))

    return newRoot
  }
  // 节点左旋
  //           4                    6
  //         /   \                /   \
  //        2     6   ==>       4      7
  //             /  \         /   \      \
  //            5     7      2     5      new
  //                   \
  //                    new
  _leftRotate(node) {
    // 旋转后新根节点
    let newRoot = node.right
    // 需要移动的节点
    let moveNode = newRoot.left
    // 节点 6 的左节点改为节点 4
    newRoot.left = node
    // 节点 4 右节点改为节点 5
    node.right = moveNode
    // 更新树的高度
    node.height =
      1 + Math.max(this._getHeight(node.left), this._getHeight(node.right))
    newRoot.height =
      1 +
      Math.max(this._getHeight(newRoot.left), this._getHeight(newRoot.right))

    return newRoot
  }
}
```

### Trie

#### 概念

在计算机科学，**trie**，又称**前缀树**或**字典树**，是一种有序树，用于保存关联数组，其中的键通常是字符串。

简单点来说，这个结构的作用大多是为了方便搜索字符串，该树有以下几个特点

- 根节点代表空字符串，每个节点都有 N（假如搜索英文字符，就有 26 条） 条链接，每条链接代表一个字符
- 节点不存储字符，只有路径才存储，这点和其他的树结构不同
- 从根节点开始到任意一个节点，将沿途经过的字符连接起来就是该节点对应的字符串

#### 实现

总得来说 Trie 的实现相比别的树结构来说简单的很多，实现就以搜索英文字符为例。

```js
class TrieNode {
  constructor() {
    // 代表每个字符经过节点的次数
    this.path = 0;
    // 代表到该节点的字符串有几个
    this.end = 0;
    // 链接
    this.next = new Array(26).fill(null);
  }
}
class Trie {
  constructor() {
    // 根节点，代表空字符
    this.root = new TrieNode();
  }
  // 插入字符串
  insert(str) {
    if (!str) return;
    let node = this.root;
    for (let i = 0; i < str.length; i++) {
      // 获得字符先对应的索引
      let index = str[i].charCodeAt() - 'a'.charCodeAt();
      // 如果索引对应没有值，就创建
      if (!node.next[index]) {
        node.next[index] = new TrieNode();
      }
      node.path += 1;
      node = node.next[index];
    }
    node.end += 1;
  }
  // 搜索字符串出现的次数
  search(str) {
    if (!str) return;
    let node = this.root;
    for (let i = 0; i < str.length; i++) {
      let index = str[i].charCodeAt() - 'a'.charCodeAt();
      // 如果索引对应没有值，代表没有需要搜素的字符串
      if (!node.next[index]) {
        return 0;
      }
      node = node.next[index];
    }
    return node.end;
  }
  // 删除字符串
  delete(str) {
    if (!this.search(str)) return;
    let node = this.root;
    for (let i = 0; i < str.length; i++) {
      let index = str[i].charCodeAt() - 'a'.charCodeAt();
      // 如果索引对应的节点的 Path 为 0，代表经过该节点的字符串
      // 已经一个，直接删除即可
      if (--node.next[index].path == 0) {
        node.next[index] = null;
        return;
      }
      node = node.next[index];
    }
    node.end -= 1;
  }
}
```

### 并查集

#### 概念

并查集是一种特殊的树结构，用于处理一些不交集的合并及查询问题。该结构中每个节点都有一个父节点，如果只有当前一个节点，那么该节点的父节点指向自己。

这个结构中有两个重要的操作，分别是：

- Find：确定元素属于哪一个子集。它可以被用来确定两个元素是否属于同一子集。
- Union：将两个子集合并成同一个集合。

#### 实现

```js
class DisjointSet {
  // 初始化样本
  constructor(count) {
    // 初始化时，每个节点的父节点都是自己
    this.parent = new Array(count);
    // 用于记录树的深度，优化搜索复杂度
    this.rank = new Array(count);
    for (let i = 0; i < count; i++) {
      this.parent[i] = i;
      this.rank[i] = 1;
    }
  }
  find(p) {
    // 寻找当前节点的父节点是否为自己，不是的话表示还没找到
    // 开始进行路径压缩优化
    // 假设当前节点父节点为 A
    // 将当前节点挂载到 A 节点的父节点上，达到压缩深度的目的
    while (p != this.parent[p]) {
      this.parent[p] = this.parent[this.parent[p]];
      p = this.parent[p];
    }
    return p;
  }
  isConnected(p, q) {
    return this.find(p) === this.find(q);
  }
  // 合并
  union(p, q) {
    // 找到两个数字的父节点
    let i = this.find(p);
    let j = this.find(q);
    if (i === j) return;
    // 判断两棵树的深度，深度小的加到深度大的树下面
    // 如果两棵树深度相等，那就无所谓怎么加
    if (this.rank[i] < this.rank[j]) {
      this.parent[i] = j;
    } else if (this.rank[i] > this.rank[j]) {
      this.parent[j] = i;
    } else {
      this.parent[i] = j;
      this.rank[j] += 1;
    }
  }
}
```

### 位运算

位运算在算法中很有用，速度可以比四则运算快很多。

在学习位运算之前应该知道十进制如何转二进制，二进制如何转十进制。这里说明下简单的计算方式

- 十进制 `33` 可以看成是 `32 + 1` ，并且 `33` 应该是六位二进制的（因为 `33` 近似 `32`，而 `32` 是 2 的五次方，所以是六位），那么 十进制 `33` 就是 `100001` ，只要是 2 的次方，那么就是 1 否则都为 0
- 那么二进制 `100001` 同理，首位是 `2^5` ，末位是 `2^0` ，相加得出 33

#### 左移 <<

```js
10 << 1; // -> 20
```

左移就是将二进制全部往左移动，`10` 在二进制中表示为 `1010` ，左移一位后变成 `10100` ，转换为十进制也就是 20，所以基本可以把左移看成以下公式 `a * (2 ^ b)`

#### 算数右移 >>

```js
10 >> 1; // -> 5
```

算数右移就是将二进制全部往右移动并去除多余的右边，`10` 在二进制中表示为 `1010` ，右移一位后变成 `101` ，转换为十进制也就是 5，所以基本可以把右移看成以下公式 `int v = a / (2 ^ b)`

右移很好用，比如可以用在二分算法中取中间值

```js
13 >> 1; // -> 6
```

#### 按位操作

**按位与**

每一位都为 1，结果才为 1

```js
8 & 7; // -> 0
// 1000 & 0111 -> 0000 -> 0
```

**按位或**

其中一位为 1，结果就是 1

```js
8 | 7; // -> 15
// 1000 | 0111 -> 1111 -> 15
```

**按位异或**

每一位都不同，结果才为 1

```js
8 ^ 7; // -> 15
8 ^ 8; // -> 0
// 1000 ^ 0111 -> 1111 -> 15
// 1000 ^ 1000 -> 0000 -> 0
```

从以上代码中可以发现按位异或就是不进位加法

**面试题**：两个数不使用四则运算得出和

这道题中可以按位异或，因为按位异或就是不进位加法，`8 ^ 8 = 0` 如果进位了，就是 16 了，所以我们只需要将两个数进行异或操作，然后进位。那么也就是说两个二进制都是 1 的位置，左边应该有一个进位 1，所以可以得出以下公式 `a + b = (a ^ b) + ((a & b) << 1)` ，然后通过迭代的方式模拟加法

```js
function sum(a, b) {
  if (a == 0) return b;
  if (b == 0) return a;
  let newA = a ^ b;
  let newB = (a & b) << 1;
  return sum(newA, newB);
}
```
