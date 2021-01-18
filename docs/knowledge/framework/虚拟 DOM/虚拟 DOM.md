---
title: 虚拟 DOM
date: 2020-12-30
draft: true
---

## 虚拟 DOM

传统的 DOM 操作是直接在 DOM 上操作的，当需要修改一系列元素中的值时，就会直接对 DOM 进行操作。而采用 Virtual DOM 则会对需要修改的 DOM 进行比较（DIFF），从而只选择需要修改的部分。也因此对于不需要大量修改 DOM 的应用来说，采用 Virtual DOM 并不会有优势。

操作 DOM 是很耗费性能的一件事情，通过 JS 对象来模拟 DOM 对象，毕竟操作 JS 对象比操作 DOM 省时的多。

### 虚拟 DOM 和 真实 DOM 的对比

DOM 完全不属于 javascript (也不在 Javascript 引擎中存在). Javascript 其实是一个非常独立的引擎，DOM 其实是浏览器引出的一组让 Javascript 操作 HTML 文档的 API 而已。在即时编译的时代，调用 DOM 的开销是很大的。而 Virtual DOM 的执行完全都在 Javascript 引擎中，完全不会有这个开销。

### 理解虚拟 DOM

虚拟 DOM 的实现也就是以下三步:

1. 通过 JS 来模拟创建 DOM 对象
2. 判断两个对象的差异
3. 渲染差异

虚拟的 DOM 的核心思想是：对复杂的文档 DOM 结构，提供一种方便的工具，进行最小化地 DOM 操作。这句话，也许过于抽象，却基本概况了虚拟 DOM 的设计思想

![image](https://user-images.githubusercontent.com/21194931/57016337-2d9ba480-6c4c-11e9-92e5-8350b26abf8f.png)

DOM 很慢，而 javascript 很快，用 javascript 对象可以很容易地表示 DOM 节点。DOM 节点包括标签、属性和子节点，通过 vElement 表示如下。

```js
//虚拟dom，参数分别为标签名、属性对象、子DOM列表
var vElement = function(tagName, props, children) {
  //保证只能通过如下方式调用：new vElement
  if (!(this instanceof vElement)) {
    return new vElement(tagName, props, children);
  }
  //可以通过只传递tagName和children参数
  if (util.isArray(props)) {
    children = props;
    props = {};
  }
  //设置虚拟dom的相关属性
  this.tagName = tagName;
  this.props = props || {};
  this.children = children || [];
  this.key = props ? props.key : void 666;
  var count = 0;
  util.each(this.children, function(child, i) {
    if (child instanceof vElement) {
      count += child.count;
    } else {
      children[i] = '' + child;
    }
    count++;
  });
  this.count = count;
};
```

通过 vElement，我们可以很简单地用 javascript 表示 DOM 结构。比如

```js
var vdom = vElement('div', { id: 'container' }, [
  vElement('h1', { style: 'color:red' }, ['simple virtual dom']),
  vElement('p', ['hello world']),
  vElement('ul', [vElement('li', ['item #1']), vElement('li', ['item #2'])]),
]);
```

上面的 javascript 代码可以表示如下 DOM 结构：

```html
<div id="container">
  <h1 style="color:red">simple virtual dom</h1>
  <p>hello world</p>
  <ul>
    <li>item #1</li>
    <li>item #2</li>
  </ul>
</div>
```

既然我们可以用 JS 对象表示 DOM 结构，那么当数据状态发生变化而需要改变 DOM 结构时，我们先通过 JS 对象表示的虚拟 DOM 计算出实际 DOM 需要做的最小变动，然后再操作实际 DOM，从而避免了粗放式的 DOM 操作带来的性能问题。
如下图所示，两个虚拟 DOM 之间的差异已经标红：
![image](https://user-images.githubusercontent.com/21194931/57016318-165cb700-6c4c-11e9-9f62-70a6ca6fc9e1.png)

### 虚拟 DOM 的原理

![image](https://user-images.githubusercontent.com/21194931/57016318-165cb700-6c4c-11e9-9f62-70a6ca6fc9e1.png)

虚拟 DOM 则是在 DOM 的基础上建立了一个抽象层，我们对数据和状态所做的任何改动，都会被自动且高效的同步到虚拟 DOM，最后再批量同步到 DOM 中。

> 虚拟 DOM 会使得 App 只关心数据和组件的执行结果，中间产生的 DOM 操作不需要 App 干预，而且通过虚拟 DOM 来生成 DOM，会有一项非常可观收益——性能

props（properties 特性）是在调用时候被调用者设置的，只设置一次，一般没有额外变化
可以把任意类型的数据传递给组件，尽可能的把 props 当做数据源，不要在组件内部设置 props ，0.15.x 已经废弃了 setProps 的方法

> 1、this.props.children
> 2、this.props.xxx

state 用来确定组件的状态，不同状态可以展示不同的视图（控制下拉菜单的隐藏显示）
可以通过 setState 方法来设置 state //this.setState(obj|function(state){})

一旦 props 或者 state 发生改变，组件都会重新渲染
所有人都知道 DOM 慢，渲染一个空的 DIV，浏览器需要为这个 DIV 生成几百个属性，而虚拟 DOM 只有 6 个。
所以说减少不必要的重排重绘以及 DOM 读写能够对页面渲染性能有大幅提升
那么我们来看看虚拟 DOM 是怎么做的。React 会在内存中维护一个虚拟 DOM 树，当我们对这个树进行读或写的时候，实际上是对虚拟 DOM 进行的。当数据变化时，然后 React 会自动更新虚拟 DOM，然后拿新的虚拟 DOM 和旧的虚拟 DOM 进行对比，找到有变更的部分，得出一个 Patch，然后将这个 Patch 放到一个队列里，最终批量更新这些 Patch 到 DOM 中。
这样的机制可以保证即便是根节点数据的变化，最终表现在 DOM 上的修改也只是受这个数据影响的部分，这样可以保证非常高效的渲染。
但也是有一定的缺陷的——首次渲染大量 DOM 时因为多了一层虚拟 DOM 的计算，会比 innerHTML 插入方式慢。
![image](https://user-images.githubusercontent.com/21194931/57016316-0ba22200-6c4c-11e9-9d2f-a4589c554107.png)

这是一个简单单完整的 React 组件【类】，细节大家先不用太在意细节，了解机制就可以。
props 主要作用是提供数据来源，可以简单的理解为 props 就是构造函数的参数。
state 唯一的作用是控制组件的表现，用来存放会随着交互变化状态，比如开关状态等。
JSX 做的事情就是根据 state 和 props 中的值，结合一些视图层面的逻辑，输出对应的 DOM 结构

我们知道前端的 DOM 是一棵树，对于一个 element 来说，我们需要关注的是这个 element 的
tagName、属性、以及子元素，而这完全可以用一个 js 对象来表示，比如，使用 tagName 属性
来说明标签名，将所有的属性和值作为一个对象表示为 props，children 属性来表示这个 element 的
子元素，同样有了这个 js 对象，我们就可以构建一棵真实的 DOM 树，我们可以在每一次元素也就是 js 对象
有任何变动的时候来重新构造一棵树，将这棵新的树与旧的 DOM 数进行比对，找出真正差异的地方，然后
将这些差异应用在真实的 DOM 中，也就实现了一个简单的 Virtual DOM 算法。

##### VDOM：三个 part

- 虚拟节点类，将真实 `DOM`节点用 `js` 对象的形式进行展示，并提供 `render` 方法，将虚拟节点渲染成真实 `DOM`
- 节点 `diff` 比较：对虚拟节点进行 `js` 层面的计算，并将不同的操作都记录到 `patch` 对象
- `re-render`：解析 `patch` 对象，进行 `re-render`

##### 补充 1：VDOM 的必要性？

- **创建真实 DOM 的代价高**：真实的 `DOM` 节点 `node` 实现的属性很多，而 `vnode` 仅仅实现一些必要的属性，相比起来，创建一个 `vnode` 的成本比较低。
- **触发多次浏览器重绘及回流**：使用 `vnode` ，相当于加了一个缓冲，让一次数据变动所带来的所有 `node` 变化，先在 `vnode` 中进行修改，然后 `diff` 之后对所有产生差异的节点集中一次对 `DOM tree` 进行修改，以减少浏览器的重绘及回流。

##### 补充 2：vue 为什么采用 vdom？

> 引入 `Virtual DOM` 在性能方面的考量仅仅是一方面。

- 性能受场景的影响是非常大的，不同的场景可能造成不同实现方案之间成倍的性能差距，所以依赖细粒度绑定及 `Virtual DOM` 哪个的性能更好还真不是一个容易下定论的问题。
- `Vue` 之所以引入了 `Virtual DOM`，更重要的原因是为了解耦 `HTML`依赖，这带来两个非常重要的好处是：

> - 不再依赖 `HTML` 解析器进行模版解析，可以进行更多的 `AOT` 工作提高运行时效率：通过模版 `AOT` 编译，`Vue` 的运行时体积可以进一步压缩，运行时效率可以进一步提升；
> - 可以渲染到 `DOM` 以外的平台，实现 `SSR`、同构渲染这些高级特性，`Weex`等框架应用的就是这一特性。

> 综上，`Virtual DOM` 在性能上的收益并不是最主要的，更重要的是它使得 `Vue` 具备了现代框架应有的高级特性。

### Virtual DOM

可以通过 JS 对象来渲染出对应的 DOM。通过 JS 来模拟 DOM 并且渲染对应的 DOM 只是第一步，难点在于如何判断新旧两个 JS 对象的**最小差异**并且实现**局部更新** DOM。

首先 DOM 是一个多叉树的结构，如果需要完整的对比两颗树的差异，那么需要的时间复杂度会是 O(n ^ 3)，这个复杂度肯定是不能接受的。于是 React 团队优化了算法，实现了 O(n) 的复杂度来对比差异。 实现 O(n) 复杂度的关键就是只对比同层的节点，而不是跨层对比，这也是考虑到在实际业务中很少会去跨层的移动 DOM 元素。 所以判断差异的算法就分为了两步

- 首先从上至下，从左往右遍历对象，也就是树的深度遍历，这一步中会给每个节点添加索引，便于最后渲染差异
- 一旦节点有子元素，就去判断子元素是否有不同

在第一步算法中我们需要判断新旧节点的 `tagName` 是否相同，如果不相同的话就代表节点被替换了。如果没有更改 `tagName` 的话，就需要判断是否有子元素，有的话就进行第二步算法。

在第二步算法中，我们需要判断原本的列表中是否有节点被移除，在新的列表中需要判断是否有新的节点加入，还需要判断节点是否有移动。

举个例子来说，假设页面中只有一个列表，我们对列表中的元素进行了变更

```
// 假设这里模拟一个 ul，其中包含了 5 个 li
[1, 2, 3, 4, 5]
// 这里替换上面的 li
[1, 2, 5, 4]
```

从上述例子中，我们一眼就可以看出先前的 `ul` 中的第三个 `li` 被移除了，四五替换了位置。

那么在实际的算法中，我们如何去识别改动的是哪个节点呢？这就引入了 `key` 这个属性，想必大家在 Vue 或者 React 的列表中都用过这个属性。这个属性是用来给每一个节点打标志的，用于判断是否是同一个节点。

当然在判断以上差异的过程中，我们还需要判断节点的属性是否有变化等等。

当我们判断出以上的差异后，就可以把这些差异记录下来。当对比完两棵树以后，就可以通过差异去局部更新 DOM，实现性能的最优化。

当然了 Virtual DOM 提高性能是其中一个优势，其实**最大的优势**还是在于：

1. 将 Virtual DOM 作为一个兼容层，让我们还能对接非 Web 端的系统，实现跨端开发。
2. 同样的，通过 Virtual DOM 我们可以渲染到其他的平台，比如实现 SSR、同构渲染等等。
3. 实现组件的高度抽象化

### Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法。

尤大大的回答：

1. 原生 DOM 操作 vs. 通过框架封装操作。
   这是一个性能 vs. 可维护性的取舍。框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快，因为框架的 DOM 操作层需要应对任何上层 API 可能产生的操作，它的实现必须是普适的。针对任何一个 benchmark，我都可以写出比任何框架更快的手动优化，但是那有什么意义呢？在构建一个实际应用的时候，你难道为每一个地方都去做手动优化吗？出于可维护性的考虑，这显然不可能。框架给你的保证是，你在不需要手动优化的情况下，我依然可以给你提供过得去的性能。
2. 对 React 的 Virtual DOM 的误解。
   React 从来没有说过 “React 比原生操作 DOM 快”。React 的基本思维模式是每次有变动就整个重新渲染整个应用。如果没有 Virtual DOM，简单来想就是直接重置 innerHTML。很多人都没有意识到，在一个大型列表所有数据都变了的情况下，重置 innerHTML 其实是一个还算合理的操作... 真正的问题是在 “全部重新渲染” 的思维模式下，即使只有一行数据变了，它也需要重置整个 innerHTML，这时候显然就有大量的浪费。

我们可以比较一下 innerHTML vs. Virtual DOM 的重绘性能消耗：

innerHTML: render html string O(template size) + 重新创建所有 DOM 元素 O(DOM size)
Virtual DOM: render Virtual DOM + diff O(template size) + 必要的 DOM 更新 O(DOM change)
Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是！它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。可以看到，innerHTML 的总计算量不管是 js 计算还是 DOM 操作都是和整个界面的大小相关，但 Virtual DOM 的计算量里面，只有 js 计算和界面大小相关，DOM 操作是和数据的变动量相关的。前面说了，和 DOM 操作比起来，js 计算是极其便宜的。这才是为什么要有 Virtual DOM：它保证了 1）不管你的数据变化多少，每次重绘的性能都可以接受；2) 你依然可以用类似 innerHTML 的思路去写你的应用。

1. MVVM vs. Virtual DOM
   相比起 React，其他 MVVM 系框架比如 Angular, Knockout 以及 Vue、Avalon 采用的都是数据绑定：通过 Directive/Binding 对象，观察数据变化并保留对实际 DOM 元素的引用，当有数据变化时进行对应的操作。MVVM 的变化检查是数据层面的，而 React 的检查是 DOM 结构层面的。MVVM 的性能也根据变动检测的实现原理有所不同：Angular 的脏检查使得任何变动都有固定的
   O(watcher count) 的代价；Knockout/Vue/Avalon 都采用了依赖收集，在 js 和 DOM 层面都是 O(change)：

脏检查：scope digest O(watcher count) + 必要 DOM 更新 O(DOM change)
依赖收集：重新收集依赖 O(data change) + 必要 DOM 更新 O(DOM change)可以看到，Angular 最不效率的地方在于任何小变动都有的和 watcher 数量相关的性能代价。但是！当所有数据都变了的时候，Angular 其实并不吃亏。依赖收集在初始化和数据变化的时候都需要重新收集依赖，这个代价在小量更新的时候几乎可以忽略，但在数据量庞大的时候也会产生一定的消耗。
MVVM 渲染列表的时候，由于每一行都有自己的数据作用域，所以通常都是每一行有一个对应的 ViewModel 实例，或者是一个稍微轻量一些的利用原型继承的 "scope" 对象，但也有一定的代价。所以，MVVM 列表渲染的初始化几乎一定比 React 慢，因为创建 ViewModel / scope 实例比起 Virtual DOM 来说要昂贵很多。这里所有 MVVM 实现的一个共同问题就是在列表渲染的数据源变动时，尤其是当数据是全新的对象时，如何有效地复用已经创建的 ViewModel 实例和 DOM 元素。假如没有任何复用方面的优化，由于数据是 “全新” 的，MVVM 实际上需要销毁之前的所有实例，重新创建所有实例，最后再进行一次渲染！这就是为什么题目里链接的 angular/knockout 实现都相对比较慢。相比之下，React 的变动检查由于是 DOM 结构层面的，即使是全新的数据，只要最后渲染结果没变，那么就不需要做无用功。

Angular 和 Vue 都提供了列表重绘的优化机制，也就是 “提示” 框架如何有效地复用实例和 DOM 元素。比如数据库里的同一个对象，在两次前端 API 调用里面会成为不同的对象，但是它们依然有一样的 uid。这时候你就可以提示 track by uid 来让 Angular 知道，这两个对象其实是同一份数据。那么原来这份数据对应的实例和 DOM 元素都可以复用，只需要更新变动了的部分。或者，你也可以直接 track by $index 来进行 “原地复用”：直接根据在数组里的位置进行复用。在题目给出的例子里，如果 angular 实现加上 track by $index 的话，后续重绘是不会比 React 慢多少的。甚至在 dbmonster 测试中，Angular 和 Vue 用了 track by \$index 以后都比 React 快: dbmon (注意 Angular 默认版本无优化，优化过的在下面）

顺道说一句，React 渲染列表的时候也需要提供 key 这个特殊 prop，本质上和 track-by 是一回事。

1. 性能比较也要看场合
   在比较性能的时候，要分清楚初始渲染、小量数据更新、大量数据更新这些不同的场合。Virtual DOM、脏检查 MVVM、数据收集 MVVM 在不同场合各有不同的表现和不同的优化需求。Virtual DOM 为了提升小量数据更新时的性能，也需要针对性的优化，比如 shouldComponentUpdate 或是 immutable data。

初始渲染：Virtual DOM > 脏检查 >= 依赖收集
小量数据更新：依赖收集 >> Virtual DOM + 优化 > 脏检查（无法优化） > Virtual DOM 无优化
大量数据更新：脏检查 + 优化 >= 依赖收集 + 优化 > Virtual DOM（无法/无需优化）>> MVVM 无优化
不要天真地以为 Virtual DOM 就是快，diff 不是免费的，batching 么 MVVM 也能做，而且最终 patch 的时候还不是要用原生 API。在我看来 Virtual DOM 真正的价值从来都不是性能，而是它 1) 为函数式的 UI 编程方式打开了大门；2) 可以渲染到 DOM 以外的 backend，比如 ReactNative。

1. 总结
   以上这些比较，更多的是对于框架开发研究者提供一些参考。主流的框架 + 合理的优化，足以应对绝大部分应用的性能需求。如果是对性能有极致需求的特殊情况，其实应该牺牲一些可维护性采取手动优化：比如 Atom 编辑器在文件渲染的实现上放弃了 React 而采用了自己实现的 tile-based rendering；又比如在移动端需要 DOM-pooling 的虚拟滚动，不需要考虑顺序变化，可以绕过框架的内置实现自己搞一个。

### Virtual Dom 算法简述

既然我们已经通过 JS 来模拟实现了 DOM，那么接下来的难点就在于如何判断旧的对象和新的对象之间的差异。

DOM 是多叉树的结构，如果需要完整的对比两颗树的差异，那么需要的时间复杂度会是 O(n ^ 3)，这个复杂度肯定是不能接受的。于是 React 团队优化了算法，实现了 O(n) 的复杂度来对比差异。

实现 O(n) 复杂度的关键就是只对比同层的节点，而不是跨层对比，这也是考虑到在实际业务中很少会去跨层的移动 DOM 元素。

所以判断差异的算法就分为了两步

- 首先从上至下，从左往右遍历对象，也就是树的深度遍历，这一步中会给每个节点添加索引，便于最后渲染差异
- 一旦节点有子元素，就去判断子元素是否有不同

### Virtual Dom 算法实现

#### 树的递归

首先我们来实现树的递归算法，在实现该算法前，先来考虑下两个节点对比会有几种情况

1. 新的节点的 `tagName` 或者 `key` 和旧的不同，这种情况代表需要替换旧的节点，并且也不再需要遍历新旧节点的子元素了，因为整个旧节点都被删掉了
2. 新的节点的 `tagName` 和 `key`（可能都没有）和旧的相同，开始遍历子树
3. 没有新的节点，那么什么都不用做

```js
import { StateEnums, isString, move } from './util';
import Element from './element';

export default function diff(oldDomTree, newDomTree) {
  // 用于记录差异
  let pathchs = {};
  // 一开始的索引为 0
  dfs(oldDomTree, newDomTree, 0, pathchs);
  return pathchs;
}

function dfs(oldNode, newNode, index, patches) {
  // 用于保存子树的更改
  let curPatches = [];
  // 需要判断三种情况
  // 1.没有新的节点，那么什么都不用做
  // 2.新的节点的 tagName 和 `key` 和旧的不同，就替换
  // 3.新的节点的 tagName 和 key（可能都没有） 和旧的相同，开始遍历子树
  if (!newNode) {
  } else if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
    // 判断属性是否变更
    let props = diffProps(oldNode.props, newNode.props);
    if (props.length) curPatches.push({ type: StateEnums.ChangeProps, props });
    // 遍历子树
    diffChildren(oldNode.children, newNode.children, index, patches);
  } else {
    // 节点不同，需要替换
    curPatches.push({ type: StateEnums.Replace, node: newNode });
  }

  if (curPatches.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(curPatches);
    } else {
      patches[index] = curPatches;
    }
  }
}
```

#### 判断属性的更改

判断属性的更改也分三个步骤

1. 遍历旧的属性列表，查看每个属性是否还存在于新的属性列表中
2. 遍历新的属性列表，判断两个列表中都存在的属性的值是否有变化
3. 在第二步中同时查看是否有属性不存在与旧的属性列列表中

```js
function diffProps(oldProps, newProps) {
  // 判断 Props 分以下三步骤
  // 先遍历 oldProps 查看是否存在删除的属性
  // 然后遍历 newProps 查看是否有属性值被修改
  // 最后查看是否有属性新增
  let change = [];
  for (const key in oldProps) {
    if (oldProps.hasOwnProperty(key) && !newProps[key]) {
      change.push({
        prop: key,
      });
    }
  }
  for (const key in newProps) {
    if (newProps.hasOwnProperty(key)) {
      const prop = newProps[key];
      if (oldProps[key] && oldProps[key] !== newProps[key]) {
        change.push({
          prop: key,
          value: newProps[key],
        });
      } else if (!oldProps[key]) {
        change.push({
          prop: key,
          value: newProps[key],
        });
      }
    }
  }
  return change;
}
```

#### 判断列表差异算法实现

这个算法是整个 Virtual Dom 中最核心的算法，且让我一一为你道来。
这里的主要步骤其实和判断属性差异是类似的，也是分为三步

1. 遍历旧的节点列表，查看每个节点是否还存在于新的节点列表中
2. 遍历新的节点列表，判断是否有新的节点
3. 在第二步中同时判断节点是否有移动

PS：该算法只对有 `key` 的节点做处理

```js
function listDiff(oldList, newList, index, patches) {
  // 为了遍历方便，先取出两个 list 的所有 keys
  let oldKeys = getKeys(oldList);
  let newKeys = getKeys(newList);
  let changes = [];

  // 用于保存变更后的节点数据
  // 使用该数组保存有以下好处
  // 1.可以正确获得被删除节点索引
  // 2.交换节点位置只需要操作一遍 DOM
  // 3.用于 `diffChildren` 函数中的判断，只需要遍历
  // 两个树中都存在的节点，而对于新增或者删除的节点来说，完全没必要
  // 再去判断一遍
  let list = [];
  oldList &&
    oldList.forEach(item => {
      let key = item.key;
      if (isString(item)) {
        key = item;
      }
      // 寻找新的 children 中是否含有当前节点
      // 没有的话需要删除
      let index = newKeys.indexOf(key);
      if (index === -1) {
        list.push(null);
      } else list.push(key);
    });
  // 遍历变更后的数组
  let length = list.length;
  // 因为删除数组元素是会更改索引的
  // 所有从后往前删可以保证索引不变
  for (let i = length - 1; i >= 0; i--) {
    // 判断当前元素是否为空，为空表示需要删除
    if (!list[i]) {
      list.splice(i, 1);
      changes.push({
        type: StateEnums.Remove,
        index: i,
      });
    }
  }
  // 遍历新的 list，判断是否有节点新增或移动
  // 同时也对 `list` 做节点新增和移动节点的操作
  newList &&
    newList.forEach((item, i) => {
      let key = item.key;
      if (isString(item)) {
        key = item;
      }
      // 寻找旧的 children 中是否含有当前节点
      let index = list.indexOf(key);
      // 没找到代表新节点，需要插入
      if (index === -1 || key == null) {
        changes.push({
          type: StateEnums.Insert,
          node: item,
          index: i,
        });
        list.splice(i, 0, key);
      } else {
        // 找到了，需要判断是否需要移动
        if (index !== i) {
          changes.push({
            type: StateEnums.Move,
            from: index,
            to: i,
          });
          move(list, index, i);
        }
      }
    });
  return { changes, list };
}

function getKeys(list) {
  let keys = [];
  let text;
  list &&
    list.forEach(item => {
      let key;
      if (isString(item)) {
        key = [item];
      } else if (item instanceof Element) {
        key = item.key;
      }
      keys.push(key);
    });
  return keys;
}
```

#### 遍历子元素打标识

对于这个函数来说，主要功能就两个

1. 判断两个列表差异
2. 给节点打上标记

总体来说，该函数实现的功能很简单

```js
function diffChildren(oldChild, newChild, index, patches) {
  let { changes, list } = listDiff(oldChild, newChild, index, patches);
  if (changes.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(changes);
    } else {
      patches[index] = changes;
    }
  }
  // 记录上一个遍历过的节点
  let last = null;
  oldChild &&
    oldChild.forEach((item, i) => {
      let child = item && item.children;
      if (child) {
        index = last && last.children ? index + last.children.length + 1 : index + 1;
        let keyIndex = list.indexOf(item.key);
        let node = newChild[keyIndex];
        // 只遍历新旧中都存在的节点，其他新增或者删除的没必要遍历
        if (node) {
          dfs(item, node, index, patches);
        }
      } else index += 1;
      last = item;
    });
}
```

#### 渲染差异

通过之前的算法，我们已经可以得出两个树的差异了。既然知道了差异，就需要局部去更新 DOM 了，下面就让我们来看看 Virtual Dom 算法的最后一步骤

这个函数主要两个功能

1. 深度遍历树，将需要做变更操作的取出来
2. 局部更新 DOM

整体来说这部分代码还是很好理解的

```js
let index = 0;
export default function patch(node, patchs) {
  let changes = patchs[index];
  let childNodes = node && node.childNodes;
  // 这里的深度遍历和 diff 中是一样的
  if (!childNodes) index += 1;
  if (changes && changes.length && patchs[index]) {
    changeDom(node, changes);
  }
  let last = null;
  if (childNodes && childNodes.length) {
    childNodes.forEach((item, i) => {
      index = last && last.children ? index + last.children.length + 1 : index + 1;
      patch(item, patchs);
      last = item;
    });
  }
}

function changeDom(node, changes, noChild) {
  changes &&
    changes.forEach(change => {
      let { type } = change;
      switch (type) {
        case StateEnums.ChangeProps:
          let { props } = change;
          props.forEach(item => {
            if (item.value) {
              node.setAttribute(item.prop, item.value);
            } else {
              node.removeAttribute(item.prop);
            }
          });
          break;
        case StateEnums.Remove:
          node.childNodes[change.index].remove();
          break;
        case StateEnums.Insert:
          let dom;
          if (isString(change.node)) {
            dom = document.createTextNode(change.node);
          } else if (change.node instanceof Element) {
            dom = change.node.create();
          }
          node.insertBefore(dom, node.childNodes[change.index]);
          break;
        case StateEnums.Replace:
          node.parentNode.replaceChild(change.node.create(), node);
          break;
        case StateEnums.Move:
          let fromNode = node.childNodes[change.from];
          let toNode = node.childNodes[change.to];
          let cloneFromNode = fromNode.cloneNode(true);
          let cloenToNode = toNode.cloneNode(true);
          node.replaceChild(cloneFromNode, toNode);
          node.replaceChild(cloenToNode, fromNode);
          break;
        default:
          break;
      }
    });
}
```

### vdom 是什么？为什么会存在 vdom？

在 MVVM 开发方式中，页面的变化都是用数据去驱动的，而数据更新后，到底要去改那一块的 DOM 哪？
虽然可以先删除那个部分再按照当前新的数据去重新生成一个新的页面或生成那一个部分（jQuery 做法），但是这样肯定非常耗费性能的。
而且 JS 操作 DOM 是非常复杂，JS 操作 DOM 越多，控制与页面的耦合度就越高，代码越难以维护。

虚拟 DOM，即用 JS 对象来描述 DOM 树结构，Diff 算法则是找旧 VDOM 与新的 VDOM 的最小差异，然后再把差异渲染出来

描述一个 DOM 节点

- tag 标签名
- attrs DOM 属性键值对
- children DOM 字节点数组 或 文本内容

### vdom 如何应用，核心 API 是什么

- 创建虚拟节点
  - h('标签名', {...属性...}, [...子元素...])
  - h('标签名', {...属性...}, '文本内容')
- 将 VNode 添加到一个 DOM 元素内
  - patch(DOM_obj, vnode);
- 用一个新的 vnode 来和旧的 vnode 进行比较，得出新旧 dom 的差异
- patch(vnode, newVnode)

### 虚拟 dom 的三个步骤

- createElement(): 用 js 对象（虚拟树）描述真实的 dom 对象（真实树）
- diff(oldnode,newNode) 对比新旧两个树的区别
- patch(): 将差异应用到真实树上

### 数据更新的 diff 机制

视图更新效率主要在大列表和深层数据更新这两方面。大多数研究都是对于大列表数据的更新，代码在 directive/repeat.js 中。首先，diff(data,oldvalue)，先比较新旧两个列表的 view model 的数据状态，然后差量更新 dom。第一步，遍历一遍新列表里的每一项，如果该项的 vm 之前就存在，则打一个\_rensed 的标，如果不存在对应的 vm 就创建一个新的。第二部：遍历一遍就得列表的每一项，如果\_rensed 的标没有被打上（其实就是指\_rensed=false）则说明新列表中已经没有它了，就销毁这个 vm。`this.uncacheVm(vm),vm.$destory()`。第三步：整理新的 vm 在试图上的顺序，同时还原之前打上的\_rensed 标，全部赋值为 false。就渲染完成了。

### Real DOM 和 Virtual DOM 有什么区别?

以下是 Real DOM 和 Virtual DOM 之间的主要区别：

| Real DOM                          | Virtual DOM                   |
| --------------------------------- | ----------------------------- |
| 更新速度慢                        | 更新速度快                    |
| DOM 操作非常昂贵                  | DOM 操作非常简单              |
| 可以直接更新 HTML                 | 你不能直接更新 HTML           |
| 造成太多内存浪费                  | 更少的内存消耗                |
| 如果元素更新了，创建新的 DOM 节点 | 如果元素更新，则更新 JSX 元素 |

### 为什么虚拟 dom 会提高性能

> 虚拟 dom 相当于在 js 和真实 dom 中间加了一个缓存，利用 dom diff 算法避免了没有必要的 dom 操作，从而提高性能

**具体实现步骤如下**

- 用 JavaScript 对象结构表示 DOM 树的结构；然后用这个树构建一个真正的 DOM 树，插到文档当中
- 当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异
- 把 2 所记录的差异应用到步骤 1 所构建的真正的 DOM 树上，视图就更新

### virtual dom 原理实现

用 JavaScript 模拟 DOM 树，并渲染这个 DOM 树
比较新老 DOM 树，得到比较的差异对象
把差异对象应用到渲染的 DOM 树。

### Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法。

#### 1. 原生 DOM 操作 vs. 通过框架封装操作。

这是一个性能 vs. 可维护性的取舍。框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快，因为框架的 DOM 操作层需要应对任何上层 API 可能产生的操作，它的实现必须是普适的。针对任何一个 benchmark，我都可以写出比任何框架更快的手动优化，但是那有什么意义呢？在构建一个实际应用的时候，你难道为每一个地方都去做手动优化吗？出于可维护性的考虑，这显然不可能。框架给你的保证是，你在不需要手动优化的情况下，我依然可以给你提供过得去的性能。

#### 2. 对 React 的 Virtual DOM 的误解。

React 从来没有说过 “React 比原生操作 DOM 快”。React 的基本思维模式是每次有变动就整个重新渲染整个应用。如果没有 Virtual DOM，简单来想就是直接重置 innerHTML。很多人都没有意识到，在一个大型列表所有数据都变了的情况下，重置 innerHTML 其实是一个还算合理的操作... 真正的问题是在 “全部重新渲染” 的思维模式下，即使只有一行数据变了，它也需要重置整个 innerHTML，这时候显然就有大量的浪费。

我们可以比较一下 innerHTML vs. Virtual DOM 的重绘性能消耗：

- innerHTML: render html string O(template size) + 重新创建所有 DOM 元素 O(DOM size)
- Virtual DOM: render Virtual DOM + diff O(template size) + 必要的 DOM 更新 O(DOM change)

Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是！它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。可以看到，innerHTML 的总计算量不管是 js 计算还是 DOM 操作都是和整个界面的大小相关，但 Virtual DOM 的计算量里面，只有 js 计算和界面大小相关，DOM 操作是和数据的变动量相关的。前面说了，和 DOM 操作比起来，js 计算是极其便宜的。这才是为什么要有 Virtual DOM：它保证了 1）不管你的数据变化多少，每次重绘的性能都可以接受；2) 你依然可以用类似 innerHTML 的思路去写你的应用。

#### 3. MVVM vs. Virtual DOM

相比起 React，其他 MVVM 系框架比如 Angular, Knockout 以及 Vue、Avalon 采用的都是数据绑定：通过 Directive/Binding 对象，观察数据变化并保留对实际 DOM 元素的引用，当有数据变化时进行对应的操作。MVVM 的变化检查是数据层面的，而 React 的检查是 DOM 结构层面的。MVVM 的性能也根据变动检测的实现原理有所不同：Angular 的脏检查使得任何变动都有固定的
O(watcher count) 的代价；Knockout/Vue/Avalon 都采用了依赖收集，在 js 和 DOM 层面都是 O(change)：

- 脏检查：scope digest O(watcher count) + 必要 DOM 更新 O(DOM change)
- 依赖收集：重新收集依赖 O(data change) + 必要 DOM 更新 O(DOM change)可以看到，Angular 最不效率的地方在于任何小变动都有的和 watcher 数量相关的性能代价。但是！当所有数据都变了的时候，Angular 其实并不吃亏。依赖收集在初始化和数据变化的时候都需要重新收集依赖，这个代价在小量更新的时候几乎可以忽略，但在数据量庞大的时候也会产生一定的消耗。

MVVM 渲染列表的时候，由于每一行都有自己的数据作用域，所以通常都是每一行有一个对应的 ViewModel 实例，或者是一个稍微轻量一些的利用原型继承的 "scope" 对象，但也有一定的代价。所以，MVVM 列表渲染的初始化几乎一定比 React 慢，因为创建 ViewModel / scope 实例比起 Virtual DOM 来说要昂贵很多。这里所有 MVVM 实现的一个共同问题就是在列表渲染的数据源变动时，尤其是当数据是全新的对象时，如何有效地复用已经创建的 ViewModel 实例和 DOM 元素。假如没有任何复用方面的优化，由于数据是 “全新” 的，MVVM 实际上需要销毁之前的所有实例，重新创建所有实例，最后再进行一次渲染！这就是为什么题目里链接的 angular/knockout 实现都相对比较慢。相比之下，React 的变动检查由于是 DOM 结构层面的，即使是全新的数据，只要最后渲染结果没变，那么就不需要做无用功。

Angular 和 Vue 都提供了列表重绘的优化机制，也就是 “提示” 框架如何有效地复用实例和 DOM 元素。比如数据库里的同一个对象，在两次前端 API 调用里面会成为不同的对象，但是它们依然有一样的 uid。这时候你就可以提示 track by uid 来让 Angular 知道，这两个对象其实是同一份数据。那么原来这份数据对应的实例和 DOM 元素都可以复用，只需要更新变动了的部分。或者，你也可以直接 track by $index 来进行 “原地复用”：直接根据在数组里的位置进行复用。在题目给出的例子里，如果 angular 实现加上 track by $index 的话，后续重绘是不会比 React 慢多少的。甚至在 dbmonster 测试中，Angular 和 Vue 用了 track by \$index 以后都比 React 快: dbmon (注意 Angular 默认版本无优化，优化过的在下面）

顺道说一句，React 渲染列表的时候也需要提供 key 这个特殊 prop，本质上和 track-by 是一回事。

#### 4. 性能比较也要看场合

在比较性能的时候，要分清楚初始渲染、小量数据更新、大量数据更新这些不同的场合。Virtual DOM、脏检查 MVVM、数据收集 MVVM 在不同场合各有不同的表现和不同的优化需求。Virtual DOM 为了提升小量数据更新时的性能，也需要针对性的优化，比如 shouldComponentUpdate 或是 immutable data。

- 初始渲染：Virtual DOM > 脏检查 >= 依赖收集
- 小量数据更新：依赖收集 >> Virtual DOM + 优化 > 脏检查（无法优化） > Virtual DOM 无优化
- 大量数据更新：脏检查 + 优化 >= 依赖收集 + 优化 > Virtual DOM（无法/无需优化）>> MVVM 无优化

不要天真地以为 Virtual DOM 就是快，diff 不是免费的，batching 么 MVVM 也能做，而且最终 patch 的时候还不是要用原生 API。在我看来 Virtual DOM 真正的价值从来都不是性能，而是它 1) 为函数式的 UI 编程方式打开了大门；2) 可以渲染到 DOM 以外的 backend，比如 ReactNative。

#### 5. 总结

以上这些比较，更多的是对于框架开发研究者提供一些参考。主流的框架 + 合理的优化，足以应对绝大部分应用的性能需求。如果是对性能有极致需求的特殊情况，其实应该牺牲一些可维护性采取手动优化：比如 Atom 编辑器在文件渲染的实现上放弃了 React 而采用了自己实现的 tile-based rendering；又比如在移动端需要 DOM-pooling 的虚拟滚动，不需要考虑顺序变化，可以绕过框架的内置实现自己搞一个。

### 什么是 Virtual DOM?

`Virtual DOM` (VDOM) 是 _Real DOM_ 的内存表示形式。UI 的展示形式被保存在内存中并与真实的 DOM 同步。这是在调用的渲染函数和在屏幕上显示元素之间发生的一个步骤。整个过程被称为 _reconciliation_。

Real DOM vs Virtual DOM

|           Real DOM           |       Virtual DOM        |
| :--------------------------: | :----------------------: |
|           更新较慢           |         更新较快         |
|      可以直接更新 HTML       |    无法直接更新 HTML     |
| 如果元素更新，则创建新的 DOM | 如果元素更新，则更新 JSX |
|       DOM 操作非常昂贵       |     DOM 操作非常简单     |
|        较多的内存浪费        |       没有内存浪费       |

### Virtual DOM 如何工作?

`Virtual DOM` 分为三个简单的步骤。

每当任何底层数据发生更改时，整个 UI 都将以 Virtual DOM 的形式重新渲染。
![vdom](images/vdom1.png)

然后计算先前 Virtual DOM 对象和新的 Virtual DOM 对象之间的差异。
![vdom2](images/vdom2.png)

一旦计算完成，真实的 DOM 将只更新实际更改的内容。
![vdom3](images/vdom3.png)

### Shadow DOM 和 Virtual DOM 之间有什么区别?

[Shadow DOM](https://developers.google.com/web/fundamentals/web-components/shadowdom?hl=zh-cn) 是一种浏览器技术，它解决了构建网络应用的脆弱性问题。Shadow DOM 修复了 CSS 和 DOM。它在网络平台中引入作用域样式。 无需工具或命名约定，你即可使用原生 JavaScript 捆绑 CSS 和标记、隐藏实现详情以及编写独立的组件。`Virtual DOM` 是一个由 JavaScript 库在浏览器 API 之上实现的概念。

### 为什么使用 Virtual DOM，直接操作 DOM 的弊端是什么？

操作 DOM 是非常昂贵的，因为一个普通的 DOM 上有非常多的属性和方法，页面的性能问题很多都是由 DOM 操作引起的。

VDOM 的意义在于实现了对 DOM 的抽象，从而配合 Diff 算法来比对新旧状态切换时页面需要更新的最小 DOM 范围。
