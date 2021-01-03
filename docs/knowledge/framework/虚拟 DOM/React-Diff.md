---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

## diff 算法?

- 把树形结构按照层级分解，只比较同级元素。
- 给列表结构的每个单元添加唯一的 key 属性，方便比较。
- React 只会匹配相同 class 的 component（这里面的 class 指的是组件的名字）
- 合并操作，调用 component 的 setState 方法的时候, React 将其标记为 - dirty.到每一个事件循环结束, React 检查所有标记 dirty 的 component 重新绘制.
- 选择性子树渲染。开发人员可以重写 shouldComponentUpdate 提高 diff 的性能

### 聊一聊你对 React 的 DOM diff 算法的理解

### 虚拟 DOM 的优缺点有哪些？

## React 中 keys 的作用是什么？

> Keys 是 React 用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识

- 在开发过程中，我们需要保证某个元素的 key 在其同级元素中具有唯一性。在 React Diff 算法中 React 会借助元素的 Key 值来判断该元素是新近创建的还是被移动而来的元素，从而减少不必要的元素重渲染。此外，React 还需要借助 Key 值来判断元素与本地状态的关联关系，因此我们绝不可忽视转换函数中 Key 的重要性

### React Diff 算法

react 虚拟 DOM 是什么? 如何实现? 说一下 diff 算法 ?
DIFF 算法为什么是 O(n)复杂度而不是 O(n^3)

### 什么是差异算法?

React 需要使用算法来了解如何有效地更新 UI 以匹配最新的树。差异算法将生成将一棵树转换为另一棵树的最小操作次数。然而，算法具有 O(n3) 的复杂度，其中 n 是树中元素的数量。在这种情况下，对于显示 1000 个元素将需要大约 10 亿个比较。这太昂贵了。相反，React 基于两个假设实现了一个复杂度为 O(n) 的算法：

两种不同类型的元素会产生不同的树结构。
开发者可以通过一个 key 属性，标识哪些子元素可以在不同渲染中保持稳定。

### 差异算法涵盖了哪些规则?

在区分两棵树时，React 首先比较两个根元素。根据根元素的类型，行为会有所不同。它在重构算法中涵盖了以下规则：

**不同类型的元素：**
每当根元素具有不同的类型时，React 将移除旧树并从头开始构建新树。例如，元素 <a> 到 <img>，或从 <Article> 到 <Comment> 的不同类型的元素引导完全重建。

**相同类型的 DOM 元素：**
当比较两个相同类型的 React DOM 元素时，React 查看两者的属性，保持相同的底层 DOM 节点，并仅更新已更改的属性。让我们以相同的 DOM 元素为例，除了 className 属性，

```js
<div className="show" title="ReactJS" />

<div className="hide" title="ReactJS" />
```

**相同类型的组件元素：**

当组件更新时，实例保持不变，以便在渲染之间保持状态。React 更新底层组件实例的 props 以匹配新元素，并在底层实例上调用 componentWillReceiveProps() 和 componentWillUpdate()。之后，调用 render() 方法，diff 算法对前一个结果和新结果进行递归。

**递归子节点：**
当对 DOM 节点的子节点进行递归时，React 会同时迭代两个子节点列表，并在出现差异时生成变异。例如，在子节点末尾添加元素时，在这两个树之间进行转换效果很好。

```js
<ul>
<li>first</li>
<li>second</li>
</ul>

<ul>
<li>first</li>
<li>second</li>
<li>third</li>
</ul>

```

**处理 Key：**

React 支持 key 属性。当子节点有 key 时，React 使用 key 将原始树中的子节点与后续树中的子节点相匹配。例如，添加 key 可以使树有效地转换，

```js
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

## diff 实现方式

### 虚拟 DOM 算法

DOM 是很慢的，如果我们创建一个简单的 div，然后把他的所有的属性都打印出来，你会看到：

```js
var div = document.createElement('div'),
  str = '';
for (var key in div) {
  str = str + ' ' + key;
}
console.log(str);
```

![image](https://user-images.githubusercontent.com/21194931/57016559-46588a00-6c4d-11e9-99a5-c9cc121e20eb.png)

可以看到，这些属性还是非常惊人的，包括样式的修饰特性、一般的特性、方法等等，如果我们打印出其长度，可以得到惊人的 227 个。
而这仅仅是一层，真正的 DOM 元素是非常庞大的，这是因为标准就是这么设计的，而且操作他们的时候你要小心翼翼，轻微的触碰就有可能导致页面发生重排，这是杀死性能的罪魁祸首。

而相对于 DOM 对象，原生的 JavaScript 对象处理起来更快，而且更简单，DOM 树上的结构信息我们都可以使用 JavaScript 对象很容易的表示出来。

```js
 var element = {
 tagName: 'ul',
 props: {
   id: 'list'
 },
 children: {
   {
tagName: 'li',
props: {
  class: 'item'
},
children: ['Item1']
   },
   {
tagName: 'li',
props: {
  class: 'item'
},
children: ['Item1']
   },
   {
tagName: 'li',
props: {
  class: 'item'
},
children: ['Item1']
   }
 }
    }
```

如上所示，对于一个元素，我们只需要一个 JavaScript 对象就可以很容易的表示出来，这个对象中有三个属性:

1. tagName: 用来表示这个元素的标签名。
2. props: 用来表示这元素所包含的属性。
3. children: 用来表示这元素的 children。

而上面的这个对象使用 HTML 表示就是：

```js
<ul id="list">
  <li class="item">Item 1</li>
  <li class="item">Item 2</li>
  <li class="item">Item 3</li>
</ul>
```

OK! 既然原来的 DOM 信息可以使用 JavaScript 来表示，那么反过来，我们就可以用这个 JavaScript 对象来构建一个真正的 DOM 树。

所以之前所说的状态变更的时候会从新构建这个 JavaScript 对象，然后呢，用新渲染的对象和旧的对象去对比， 记录两棵树的差异，记录下来的就是我们需要改变的地方。 这就是所谓的虚拟 DOM，包括下面的几个步骤：

用 JavaScript 对象来表示 DOM 树的结构； 然后用这个树构建一个真正的 DOM 树，插入到文档中。
当状态变更的时候，重新构造一个新的对象树，然后用这个新的树和旧的树作对比，记录两个树的差异。
把 2 所记录的差异应用在步骤一所构建的真正的 DOM 树上，视图就更新了。
Virtual DOM 的本质就是在 JS 和 DOM 之间做一个缓存，可以类比 CPU 和硬盘，既然硬盘这么慢，我们就也在他们之间添加一个缓存； 既然 DOM 这么慢，我们就可以在 JS 和 DOM 之间添加一个缓存。 CPU（JS）只操作内存（虚拟 DOM），最后的时候在把变更写入硬盘（DOM）。

### 算法实现

##### 1. 用 JavaScript 对象模拟 DOM 树

用 JavaScript 对象来模拟一个 DOM 节点并不难，你只需要记录他的节点类型（tagName）、属性（props）、子节点（children）。
element.js

```js
function Element(tagName, props, children) {
  this.tagName = tagName;
  this.props = props;
  this.children = children;
}
module.exports = function(tagName, props, children) {
  return new Element(tagName, props, children);
};
```

通过这个构造函数，我们就可以传入标签名、属性以及子节点了，tagName 可以在我们 render 的时候直接根据它来创建真实的元素，这里的 props 使用一个对象传入，可以方便我们遍历。

基本使用方法如下：

```js
var el = require('./element');

var ul = el('ul', { id: 'list' }, [
  el('li', { class: 'item' }, ['item1']),
  el('li', { class: 'item' }, ['item2']),
  el('li', { class: 'item' }, ['item3']),
]);
```

然而，现在的 ul 只是 JavaScript 表示的一个 DOM 结构，页面上并没有这个结构，所有我们可以根据 ul 构建一个真正的

：

```js
Element.prototype.render = function() {
  // 根据tagName创建一个真实的元素
  var el = document.createElement(this.tagName);
  // 得到这个元素的属性对象，方便我们遍历。
  var props = this.props;

  for (var propName in props) {
    // 获取到这个元素值
    var propValue = props[propName];

    // 通过setAttribute设置元素属性。
    el.setAttribute(propName, propValue);
  }

  // 注意： 这里的children，我们传入的是一个数组，所以，children不存在时我们用【】来替代。
  var children = this.children || [];

  //遍历children
  children.forEach(function(child) {
    var childEl = child instanceof Element ? child.render() : document.createTextNode(child);
    // 无论childEl是元素还是文字节点，都需要添加到这个元素中。
    el.appendChild(childEl);
  });

  return el;
};
```

所以，render 方法会根据 tagName 构建一个真正的 DOM 节点，然后设置这个节点的属性，最后递归的把自己的子节点也构建起来，所以只需要调用 ul 的 render 方法，通过 document.body.appendChild 就可以挂载到真实的页面了。

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>div</title>
</head>
<body>
  <script>

    function Element(tagName, props, children) {
 this.tagName = tagName;
 this.props = props;
 this.children = children;
    }


    var ul = new Element('ul', {id: 'list'}, [
   new Element('li', {class: 'item'}, ['item1']),
   new Element('li', {class: 'item'}, ['item2']),
   new Element('li', {class: 'item'}, ['item3'])
 ]);

    Element.prototype.render = function () {
 // 根据tagName创建一个真实的元素
 var el = document.createElement(this.tagName);
 // 得到这个元素的属性对象，方便我们遍历。
 var props = this.props;

 for (var propName in props) {
   // 获取到这个元素值
   var propValue = props[propName];

   // 通过setAttribute设置元素属性。
   el.setAttribute(propName, propValue);
 }

 // 注意： 这里的children，我们传入的是一个数组，所以，children不存在时我们用【】来替代。
 var children = this.children || [];

 //遍历children
 children.forEach(function (child) {
   var childEl = (child instanceof Element)
  ? child.render()
  : document.createTextNode(child);
   // 无论childEl是元素还是文字节点，都需要添加到这个元素中。
   el.appendChild(childEl);
 });

 return el;
    }

    var ulRoot = ul.render();
    document.body.appendChild(ulRoot);
  </script>
</body>
</html>
```

上面的这段代码，就可以渲染出下面的结果了：
![image](https://user-images.githubusercontent.com/21194931/57016634-b5ce7980-6c4d-11e9-93c1-21ab79f2df59.png)

##### 比较两颗虚拟 DOM 树的差异

比较两颗 DOM 数的差异是 Virtual DOM 算法中最为核心的部分，这也就是所谓的 Virtual DOM 的 diff 算法。 两个树的完全的 diff 算法是一个时间复杂度为 O(n3) 的问题。 但是在前端中，你会很少跨层地移动 DOM 元素，所以真实的 DOM 算法会对同一个层级的元素进行对比
![image](https://user-images.githubusercontent.com/21194931/57016644-c5e65900-6c4d-11e9-8e76-7e4b22ed4f64.png)
上图中，div 只会和同一层级的 div 对比，第二层级的只会和第二层级对比。 这样算法复杂度就可以达到 O(n)。

（1）深度遍历优先，记录差异
在实际的代码中，会对新旧两棵树进行一个深度优先的遍历，这样每一个节点就会有一个唯一的标记：
![image](https://user-images.githubusercontent.com/21194931/57016650-d8609280-6c4d-11e9-91da-fdecf51ad4d2.png)
上面的这个遍历过程就是深度优先，即深度完全完成之后，再转移位置。 在深度优先遍历的时候，每遍历到一个节点就把该节点和新的树进行对比，如果有差异的话就记录到一个对象里面。

```js
// diff函数，对比两颗树
    function diff(oldTree, newTree) {
 // 当前的节点的标志。因为在深度优先遍历的过程中，每个节点都有一个index。
 var index = 0;

 // 在遍历到每个节点的时候，都需要进行对比，找到差异，并记录在下面的对象中。
 var pathches = {};

 // 开始进行深度优先遍历
 dfsWalk(oldTree, newTree, index, pathches);

 // 最终diff算法返回的是一个两棵树的差异。
 return pathches;
    }

    // 对两棵树进行深度优先遍历。
    function dfsWalk(oldNode, newNode, index, pathches) {
 // 对比oldNode和newNode的不同，记录下来
 pathches[index] = [...];

 diffChildren(oldNode.children, newNode.children, index, pathches);
    }

    // 遍历子节点
    function diffChildren(oldChildren, newChildren, index, pathches) {
 var leftNode = null;
 var currentNodeIndex = index;
 oldChildren.forEach(function (child, i) {
   var newChild = newChildren[i];
   currentNodeIndex = (leftNode && leftNode.count)
   ? currentNodeIndex + leftNode.count + 1
   : currentNodeIndex + 1

   // 深度遍历子节点
   dfsWalk(child, newChild, currentNodeIndex, pathches);
   leftNode = child;
 });
    }
```

例如，上面的 div 和新的 div 有差异，当前的标记是 0， 那么我们可以使用数组来存储新旧节点的不同：

patches[0] = [{difference}, {difference}, ...]
同理使用 patches[1]来记录 p，使用 patches[3]来记录 ul，以此类推。

（2）差异类型

上面说的节点的差异指的是什么呢？ 对 DOM 操作可能会：

1. 替换原来的节点，如把上面的 div 换成了 section。
2. 移动、删除、新增子节点， 例如上面 div 的子节点，把 p 和 ul 顺序互换。
3. 修改了节点的属性。
   对于文本节点，文本内容可能会改变。 例如修改上面的文本内容 2 内容为 Virtual DOM2.
   　　所以，我们可以定义下面的几种类型：

```js
var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var TEXT = 3;
```

对于节点替换，很简单，判断新旧节点的 tagName 是不是一样的，如果不一样的说明需要替换掉。 如 div 换成了 section，就记录下：

```js
patches[0] = [
  {
    type: REPALCE,
    node: newNode, // el('section', props, children)
  },
];
```

除此之外，如果给 div 新增了属性 id 为 container，就记录下：

```js
pathches[0] = [
  {
    type: REPLACE,
    node: newNode,
  },
  {
    type: PROPS,
    props: {
      id: 'container',
    },
  },
];
```

如果是文本节点发生了变化，那么就记录下：

```js
pathches[2] = [
  {
    type: TEXT,
    content: 'virtual DOM2',
  },
];
```

那么如果我们把 div 的子节点重新排序了呢？ 比如 p、ul、div 的顺序换成了 div、p、ul，那么这个该怎么对比呢？ 如果按照同级进行顺序对比的话，他们就会被替换掉，如 p 和 div 的 tagName 不同，p 就会被 div 所代替，最终，三个节点就都会被替换，这样 DOM 开销就会非常大，而实际上是不需要替换节点的，只需要移动就可以了， 我们只需要知道怎么去移动。这里牵扯到了两个列表的对比算法，如下。

（3）列表对比算法
　　假设现在可以英文字母唯一地标识每一个子节点：

旧的节点顺序：

```js
a b c d e f g h i
```

现在对节点进行了删除、插入、移动的操作。新增 j 节点，删除 e 节点，移动 h 节点：

新的节点顺序：

```js
a b c h d f g i j
```

现在知道了新旧的顺序，求最小的插入、删除操作（移动可以看成是删除和插入操作的结合）。这个问题抽象出来其实是字符串的最小编辑距离问题（Edition Distance），最常见的解决算法是 Levenshtein Distance，通过动态规划求解，时间复杂度为 O(M \* N)。但是我们并不需要真的达到最小的操作，我们只需要优化一些比较常见的移动情况，牺牲一定 DOM 操作，让算法时间复杂度达到线性的（O(max(M, N))。具体算法细节比较多，这里不累述，有兴趣可以参考代码。

我们能够获取到某个父节点的子节点的操作，就可以记录下来：

```js
patches[0] = [{
  type: REORDER,
  moves: [{remove or insert}, {remove or insert}, ...]
}]
```

但是要注意的是，因为 tagName 是可重复的，不能用这个来进行对比。所以需要给子节点加上唯一标识 key，列表对比的时候，使用 key 进行对比，这样才能复用老的 DOM 树上的节点。

这样，我们就可以通过深度优先遍历两棵树，每层的节点进行对比，记录下每个节点的差异了。完整 diff 算法代码可见 diff.js。

3. 把差异引用到真正的 DOM 树上
   　　因为步骤一所构建的 JavaScript 对象树和 render 出来真正的 DOM 树的信息、结构是一样的。所以我们可以对那棵 DOM 树也进行深度优先的遍历，遍历的时候从步骤二生成的 patches 对象中找出当前遍历的节点差异，然后进行 DOM 操作。

```js
function patch(node, patches) {
  var walker = { index: 0 };
  dfsWalk(node, walker, patches);
}

function dfsWalk(node, walker, patches) {
  var currentPatches = patches[walker.index]; // 从patches拿出当前节点的差异

  var len = node.childNodes ? node.childNodes.length : 0;
  for (var i = 0; i < len; i++) {
    // 深度遍历子节点
    var child = node.childNodes[i];
    walker.index++;
    dfsWalk(child, walker, patches);
  }

  if (currentPatches) {
    applyPatches(node, currentPatches); // 对当前节点进行DOM操作
  }
}
```

applyPatches，根据不同类型的差异对当前节点进行 DOM 操作：

```js
function applyPatches(node, currentPatches) {
  currentPatches.forEach(function(currentPatch) {
    switch (currentPatch.type) {
      case REPLACE:
        node.parentNode.replaceChild(currentPatch.node.render(), node);
        break;
      case REORDER:
        reorderChildren(node, currentPatch.moves);
        break;
      case PROPS:
        setProps(node, currentPatch.props);
        break;
      case TEXT:
        node.textContent = currentPatch.content;
        break;
      default:
        throw new Error('Unknown patch type ' + currentPatch.type);
    }
  });
}
```

5. 结语
   　　 virtual DOM 算法主要实现上面步骤的三个函数： element、diff、patch，然后就可以实际的进行使用了。

```js
// 1. 构建虚拟DOM
var tree = el('div', { id: 'container' }, [
  el('h1', { style: 'color: blue' }, ['simple virtal dom']),
  el('p', ['Hello, virtual-dom']),
  el('ul', [el('li')]),
]);

// 2. 通过虚拟DOM构建真正的DOM
var root = tree.render();
document.body.appendChild(root);

// 3. 生成新的虚拟DOM
var newTree = el('div', { id: 'container' }, [
  el('h1', { style: 'color: red' }, ['simple virtal dom']),
  el('p', ['Hello, virtual-dom']),
  el('ul', [el('li'), el('li')]),
]);

// 4. 比较两棵虚拟DOM树的不同
var patches = diff(tree, newTree);

// 5. 在真正的DOM元素上应用变更
patch(root, patches);
```

当然这是非常粗糙的实践，实际中还需要处理事件监听等；生成虚拟 DOM 的时候也可以加入 JSX 语法。这些事情都做了的话，就可以构造一个简单的 ReactJS 了。

> 转载：[深入理解 react 中的虚拟 DOM、diff 算法](https://www.cnblogs.com/zhuzhenwei918/p/7271305.html)

### diff 算法

对比 Vdom 树差异的算法

#### 同层比对

新旧状态的比对时采用同层比对，当发现某节点不一致了直接替换该节点的子树。而不管它的子树是不是真的改动了。

#### key 值的使用

在列表循环的时候 React 会要求每一个列表项有一个**独一无二**，**稳定的 key 值**，它的目的是为了当状态改变时新旧状态的每一个列表项能够对应起来，方便比对。

Keys 是 React 用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识。
Diff 算法中 React 会借助元素的 Key 值来判断该元素是新近创建的还是被移动而来的元素，从而减少不必要的元素重渲染。此外，React 还需要借助 Key 值来判断元素与本地状态的关联关系

#### 合并操作

调用 component 的 setState 方法的时候, React 将其标记为 dirty.到每一个事件循环结束, React 检查所有标记 dirty 的 component 重新绘制

#### 虚拟 dom

首先需要明确的一点是 虚拟 dom 之间的比较，是存在于同一层级的 dom， 也就是说只会比较新旧 vnode 的 children ， 而不会拿 children 与 children 的 children 进行比较。

![](https://images2018.cnblogs.com/blog/998023/201805/998023-20180519212338609-1617459354.png)

##### diff 流程图

当数据发生改变时，set 方法会让调用`Dep.notify`通知所有订阅者 Watcher，订阅者就会调用`patch`给真实的 DOM 打补丁，更新相应的视图。

![](https://images2018.cnblogs.com/blog/998023/201805/998023-20180519212357826-1474719173.png)
