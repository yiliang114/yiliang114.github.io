---
layout: CustomPages
title: framework
date: 2020-11-21
aside: false
draft: true
---

# Virtual Dom

[代码地址](https://github.com/KieSun/My-wheels/tree/master/Virtual%20Dom)

## 为什么需要 Virtual Dom

众所周知，操作 DOM 是很耗费性能的一件事情，既然如此，我们可以考虑通过 JS 对象来模拟 DOM 对象，毕竟操作 JS 对象比操作 DOM 省时的多。

举个例子

```js
// 假设这里模拟一个 ul，其中包含了 5 个 li
;[1, 2, 3, 4, 5][
  // 这里替换上面的 li
  (1, 2, 5, 4)
]
```

从上述例子中，我们一眼就可以看出先前的 ul 中的第三个 li 被移除了，四五替换了位置。

如果以上操作对应到 DOM 中，那么就是以下代码

```js
// 删除第三个 li
ul.childNodes[2].remove()
// 将第四个 li 和第五个交换位置
let fromNode = ul.childNodes[4]
let toNode = node.childNodes[3]
let cloneFromNode = fromNode.cloneNode(true)
let cloenToNode = toNode.cloneNode(true)
ul.replaceChild(cloneFromNode, toNode)
ul.replaceChild(cloenToNode, fromNode)
```

当然在实际操作中，我们还需要给每个节点一个标识，作为判断是同一个节点的依据。所以这也是 Vue 和 React 中官方推荐列表里的节点使用唯一的 `key` 来保证性能。

那么既然 DOM 对象可以通过 JS 对象来模拟，反之也可以通过 JS 对象来渲染出对应的 DOM

以下是一个 JS 对象模拟 DOM 对象的简单实现

```js
export default class Element {
  /**
   * @param {String} tag 'div'
   * @param {Object} props { class: 'item' }
   * @param {Array} children [ Element1, 'text']
   * @param {String} key option
   */
  constructor(tag, props, children, key) {
    this.tag = tag
    this.props = props
    if (Array.isArray(children)) {
      this.children = children
    } else if (isString(children)) {
      this.key = children
      this.children = null
    }
    if (key) this.key = key
  }
  // 渲染
  render() {
    let root = this._createElement(
      this.tag,
      this.props,
      this.children,
      this.key
    )
    document.body.appendChild(root)
    return root
  }
  create() {
    return this._createElement(this.tag, this.props, this.children, this.key)
  }
  // 创建节点
  _createElement(tag, props, child, key) {
    // 通过 tag 创建节点
    let el = document.createElement(tag)
    // 设置节点属性
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        const value = props[key]
        el.setAttribute(key, value)
      }
    }
    if (key) {
      el.setAttribute('key', key)
    }
    // 递归添加子节点
    if (child) {
      child.forEach(element => {
        let child
        if (element instanceof Element) {
          child = this._createElement(
            element.tag,
            element.props,
            element.children,
            element.key
          )
        } else {
          child = document.createTextNode(element)
        }
        el.appendChild(child)
      })
    }
    return el
  }
}
```

## Virtual Dom 算法简述

既然我们已经通过 JS 来模拟实现了 DOM，那么接下来的难点就在于如何判断旧的对象和新的对象之间的差异。

DOM 是多叉树的结构，如果需要完整的对比两颗树的差异，那么需要的时间复杂度会是 O(n ^ 3)，这个复杂度肯定是不能接受的。于是 React 团队优化了算法，实现了 O(n) 的复杂度来对比差异。

实现 O(n) 复杂度的关键就是只对比同层的节点，而不是跨层对比，这也是考虑到在实际业务中很少会去跨层的移动 DOM 元素。

所以判断差异的算法就分为了两步

- 首先从上至下，从左往右遍历对象，也就是树的深度遍历，这一步中会给每个节点添加索引，便于最后渲染差异
- 一旦节点有子元素，就去判断子元素是否有不同

## Virtual Dom 算法实现

### 树的递归

首先我们来实现树的递归算法，在实现该算法前，先来考虑下两个节点对比会有几种情况

1. 新的节点的 `tagName` 或者 `key` 和旧的不同，这种情况代表需要替换旧的节点，并且也不再需要遍历新旧节点的子元素了，因为整个旧节点都被删掉了
2. 新的节点的 `tagName` 和 `key`（可能都没有）和旧的相同，开始遍历子树
3. 没有新的节点，那么什么都不用做

```js
import { StateEnums, isString, move } from './util'
import Element from './element'

export default function diff(oldDomTree, newDomTree) {
  // 用于记录差异
  let pathchs = {}
  // 一开始的索引为 0
  dfs(oldDomTree, newDomTree, 0, pathchs)
  return pathchs
}

function dfs(oldNode, newNode, index, patches) {
  // 用于保存子树的更改
  let curPatches = []
  // 需要判断三种情况
  // 1.没有新的节点，那么什么都不用做
  // 2.新的节点的 tagName 和 `key` 和旧的不同，就替换
  // 3.新的节点的 tagName 和 key（可能都没有） 和旧的相同，开始遍历子树
  if (!newNode) {
  } else if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
    // 判断属性是否变更
    let props = diffProps(oldNode.props, newNode.props)
    if (props.length) curPatches.push({ type: StateEnums.ChangeProps, props })
    // 遍历子树
    diffChildren(oldNode.children, newNode.children, index, patches)
  } else {
    // 节点不同，需要替换
    curPatches.push({ type: StateEnums.Replace, node: newNode })
  }

  if (curPatches.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(curPatches)
    } else {
      patches[index] = curPatches
    }
  }
}
```

### 判断属性的更改

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
  let change = []
  for (const key in oldProps) {
    if (oldProps.hasOwnProperty(key) && !newProps[key]) {
      change.push({
        prop: key
      })
    }
  }
  for (const key in newProps) {
    if (newProps.hasOwnProperty(key)) {
      const prop = newProps[key]
      if (oldProps[key] && oldProps[key] !== newProps[key]) {
        change.push({
          prop: key,
          value: newProps[key]
        })
      } else if (!oldProps[key]) {
        change.push({
          prop: key,
          value: newProps[key]
        })
      }
    }
  }
  return change
}
```

### 判断列表差异算法实现

这个算法是整个 Virtual Dom 中最核心的算法，且让我一一为你道来。
这里的主要步骤其实和判断属性差异是类似的，也是分为三步

1. 遍历旧的节点列表，查看每个节点是否还存在于新的节点列表中
2. 遍历新的节点列表，判断是否有新的节点
3. 在第二步中同时判断节点是否有移动

PS：该算法只对有 `key` 的节点做处理

```js
function listDiff(oldList, newList, index, patches) {
  // 为了遍历方便，先取出两个 list 的所有 keys
  let oldKeys = getKeys(oldList)
  let newKeys = getKeys(newList)
  let changes = []

  // 用于保存变更后的节点数据
  // 使用该数组保存有以下好处
  // 1.可以正确获得被删除节点索引
  // 2.交换节点位置只需要操作一遍 DOM
  // 3.用于 `diffChildren` 函数中的判断，只需要遍历
  // 两个树中都存在的节点，而对于新增或者删除的节点来说，完全没必要
  // 再去判断一遍
  let list = []
  oldList &&
    oldList.forEach(item => {
      let key = item.key
      if (isString(item)) {
        key = item
      }
      // 寻找新的 children 中是否含有当前节点
      // 没有的话需要删除
      let index = newKeys.indexOf(key)
      if (index === -1) {
        list.push(null)
      } else list.push(key)
    })
  // 遍历变更后的数组
  let length = list.length
  // 因为删除数组元素是会更改索引的
  // 所有从后往前删可以保证索引不变
  for (let i = length - 1; i >= 0; i--) {
    // 判断当前元素是否为空，为空表示需要删除
    if (!list[i]) {
      list.splice(i, 1)
      changes.push({
        type: StateEnums.Remove,
        index: i
      })
    }
  }
  // 遍历新的 list，判断是否有节点新增或移动
  // 同时也对 `list` 做节点新增和移动节点的操作
  newList &&
    newList.forEach((item, i) => {
      let key = item.key
      if (isString(item)) {
        key = item
      }
      // 寻找旧的 children 中是否含有当前节点
      let index = list.indexOf(key)
      // 没找到代表新节点，需要插入
      if (index === -1 || key == null) {
        changes.push({
          type: StateEnums.Insert,
          node: item,
          index: i
        })
        list.splice(i, 0, key)
      } else {
        // 找到了，需要判断是否需要移动
        if (index !== i) {
          changes.push({
            type: StateEnums.Move,
            from: index,
            to: i
          })
          move(list, index, i)
        }
      }
    })
  return { changes, list }
}

function getKeys(list) {
  let keys = []
  let text
  list &&
    list.forEach(item => {
      let key
      if (isString(item)) {
        key = [item]
      } else if (item instanceof Element) {
        key = item.key
      }
      keys.push(key)
    })
  return keys
}
```

### 遍历子元素打标识

对于这个函数来说，主要功能就两个

1. 判断两个列表差异
2. 给节点打上标记

总体来说，该函数实现的功能很简单

```js
function diffChildren(oldChild, newChild, index, patches) {
  let { changes, list } = listDiff(oldChild, newChild, index, patches)
  if (changes.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(changes)
    } else {
      patches[index] = changes
    }
  }
  // 记录上一个遍历过的节点
  let last = null
  oldChild &&
    oldChild.forEach((item, i) => {
      let child = item && item.children
      if (child) {
        index =
          last && last.children ? index + last.children.length + 1 : index + 1
        let keyIndex = list.indexOf(item.key)
        let node = newChild[keyIndex]
        // 只遍历新旧中都存在的节点，其他新增或者删除的没必要遍历
        if (node) {
          dfs(item, node, index, patches)
        }
      } else index += 1
      last = item
    })
}
```

### 渲染差异

通过之前的算法，我们已经可以得出两个树的差异了。既然知道了差异，就需要局部去更新 DOM 了，下面就让我们来看看 Virtual Dom 算法的最后一步骤

这个函数主要两个功能

1. 深度遍历树，将需要做变更操作的取出来
2. 局部更新 DOM

整体来说这部分代码还是很好理解的

```js
let index = 0
export default function patch(node, patchs) {
  let changes = patchs[index]
  let childNodes = node && node.childNodes
  // 这里的深度遍历和 diff 中是一样的
  if (!childNodes) index += 1
  if (changes && changes.length && patchs[index]) {
    changeDom(node, changes)
  }
  let last = null
  if (childNodes && childNodes.length) {
    childNodes.forEach((item, i) => {
      index =
        last && last.children ? index + last.children.length + 1 : index + 1
      patch(item, patchs)
      last = item
    })
  }
}

function changeDom(node, changes, noChild) {
  changes &&
    changes.forEach(change => {
      let { type } = change
      switch (type) {
        case StateEnums.ChangeProps:
          let { props } = change
          props.forEach(item => {
            if (item.value) {
              node.setAttribute(item.prop, item.value)
            } else {
              node.removeAttribute(item.prop)
            }
          })
          break
        case StateEnums.Remove:
          node.childNodes[change.index].remove()
          break
        case StateEnums.Insert:
          let dom
          if (isString(change.node)) {
            dom = document.createTextNode(change.node)
          } else if (change.node instanceof Element) {
            dom = change.node.create()
          }
          node.insertBefore(dom, node.childNodes[change.index])
          break
        case StateEnums.Replace:
          node.parentNode.replaceChild(change.node.create(), node)
          break
        case StateEnums.Move:
          let fromNode = node.childNodes[change.from]
          let toNode = node.childNodes[change.to]
          let cloneFromNode = fromNode.cloneNode(true)
          let cloenToNode = toNode.cloneNode(true)
          node.replaceChild(cloneFromNode, toNode)
          node.replaceChild(cloenToNode, fromNode)
          break
        default:
          break
      }
    })
}
```

## 最后

Virtual Dom 算法的实现也就是以下三步

1. 通过 JS 来模拟创建 DOM 对象
2. 判断两个对象的差异
3. 渲染差异

```js
let test4 = new Element('div', { class: 'my-div' }, ['test4'])
let test5 = new Element('ul', { class: 'my-div' }, ['test5'])

let test1 = new Element('div', { class: 'my-div' }, [test4])

let test2 = new Element('div', { id: '11' }, [test5, test4])

let root = test1.render()

let pathchs = diff(test1, test2)
console.log(pathchs)

setTimeout(() => {
  console.log('开始更新')
  patch(root, pathchs)
  console.log('结束更新')
}, 1000)
```

当然目前的实现还略显粗糙，但是对于理解 Virtual Dom 算法来说已经是完全足够的了。

### 说说你对 MVC 和 MVVM 的理解

1. `MVC`
   View 传送指令到 Controller
   Controller 完成业务逻辑后，要求 Model 改变状态
   Model 将新的数据发送到 View，用户得到反馈

所有通信都是单向的。

2. `MVVM`
   `Angular`它采用双向绑定（data-binding）：`View`的变动，自动反映在 `ViewModel`，反之亦然。
   组成部分 Model、View、ViewModel. View：UI 界面. ViewModel：它是 View 的抽象，负责 View 与 Model 之间信息转换，将 View 的 Command 传送到 Model；Model：数据访问层

### 虚拟 dom

首先需要明确的一点是 虚拟 dom 之间的比较，是存在于同一层级的 dom， 也就是说只会比较新旧 vnode 的 children ， 而不会拿 children 与 children 的 children 进行比较。

![](https://images2018.cnblogs.com/blog/998023/201805/998023-20180519212338609-1617459354.png)

#### diff 流程图

当数据发生改变时，set 方法会让调用`Dep.notify`通知所有订阅者 Watcher，订阅者就会调用`patch`给真实的 DOM 打补丁，更新相应的视图。

![](https://images2018.cnblogs.com/blog/998023/201805/998023-20180519212357826-1474719173.png)

# 一、什么是虚拟 DOM？

传统的 DOM 操作是直接在 DOM 上操作的，当需要修改一系列元素中的值时，就会直接对 DOM 进行操作。而采用 Virtual DOM 则会对需要修改的 DOM 进行比较（DIFF），从而只选择需要修改的部分。也因此对于不需要大量修改 DOM 的应用来说，采用 Virtual DOM 并不会有优势。开发者就可以创建出可交互的 UI。
在 React 中，render 执行的结果得到的并不是真正的 DOM 节点，结果仅仅是轻量级的 JavaScript 对象，我们称之为 virtual DOM。

虚拟 DOM 是 react 的一大亮点，具有 batching(批处理)和高效的 Diff 算法。这让我们可以无需担心性能问题而”毫无顾忌”的随时“刷新”整个页面，由虚拟 DOM 来确保只对界面上真正变化的部分进行实际的 DOM 操作。在实际开发中基本无需关心虚拟 DOM 是如何运作的，但是理解其运行机制不仅有助于更好的理解 React 组件的生命周期，而且对于进一步优化 React 程序也会有很大帮助。

# 二 .为什么需要虚拟 DOM

DOM 是很慢的，其元素非常庞大，页面的性能问题鲜有由 js 引起的，大部分都是由 DOM 操作引起的。如果对前端工作进行抽象的话，主要就是维护状态和更新视图；而更新视图和维护状态都需要 DOM 操作。其实近年来，前端的框架主要发展方向就是解放 DOM 操作的复杂性。

在 jQuery 出现以前，我们直接操作 DOM 结构，这种方法复杂度高，兼容性也较差；有了 jquery 强大的选择器以及高度封装的 API，我们可以更方便的操作 DOM，jQuery 帮我们处理兼容性问题，同时也使 DOM 操作变得简单；但是聪明的程序员不可能满足于此，各种 MVVM 框架应运而生，有 AngularJS、avalon、vue.js 等，MVVM 使用数据双向绑定，使得我们完全不需要操作 DOM 了，更新了状态视图会自动更新，更新了视图数据状态也会自动更新，可以说 MMVM 使得前端的开发效率大幅提升，但是其大量的事件绑定使得其在复杂场景下的执行性能堪忧；有没有一种兼顾开发效率和执行效率的方案呢？ReactJS 就是一种不错的方案，虽然其将 JS 代码和 HTML 代码混合在一起的设计有不少争议，但是其引入的 Virtual DOM(虚拟 DOM)却是得到大家的一致认同的。

# 三 、虚拟 DOM 和 真实 DOM 的对比

DOM 完全不属于 javascript (也不在 Javascript 引擎中存在).。Javascript 其实是一个非常独立的引擎，DOM 其实是浏览器引出的一组让 Javascript 操作 HTML 文档的 API 而已。在即时编译的时代，调用 DOM 的开销是很大的。而 Virtual DOM 的执行完全都在 Javascript 引擎中，完全不会有这个开销。

# 四.理解虚拟 DOM

虚拟的 DOM 的核心思想是：对复杂的文档 DOM 结构，提供一种方便的工具，进行最小化地 DOM 操作。这句话，也许过于抽象，却基本概况了虚拟 DOM 的设计思想
![image](https://user-images.githubusercontent.com/21194931/57016337-2d9ba480-6c4c-11e9-92e5-8350b26abf8f.png)

DOM 很慢，而 javascript 很快，用 javascript 对象可以很容易地表示 DOM 节点。DOM 节点包括标签、属性和子节点，通过 VElement 表示如下。

```
//虚拟dom，参数分别为标签名、属性对象、子DOM列表
var VElement = function(tagName, props, children) {
    //保证只能通过如下方式调用：new VElement
    if (!(this instanceof VElement)) {
        return new VElement(tagName, props, children);
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
        if (child instanceof VElement) {
            count += child.count;
        } else {
            children[i] = '' + child;
        }
        count++;
    });
    this.count = count;
}
```

通过 VElement，我们可以很简单地用 javascript 表示 DOM 结构。比如

```
var vdom = velement('div', { 'id': 'container' }, [
    velement('h1', { style: 'color:red' }, ['simple virtual dom']),
    velement('p', ['hello world']),
    velement('ul', [velement('li', ['item #1']), velement('li', ['item #2'])]),
]);
```

上面的 javascript 代码可以表示如下 DOM 结构：

```
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

# 五、 虚拟 DOM 的原理

下图
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

### VDOM：三个 part

- 虚拟节点类，将真实 `DOM`节点用 `js` 对象的形式进行展示，并提供 `render` 方法，将虚拟节点渲染成真实 `DOM`
- 节点 `diff` 比较：对虚拟节点进行 `js` 层面的计算，并将不同的操作都记录到 `patch` 对象
- `re-render`：解析 `patch` 对象，进行 `re-render`

### 补充 1：VDOM 的必要性？

- **创建真实 DOM 的代价高**：真实的 `DOM` 节点 `node` 实现的属性很多，而 `vnode` 仅仅实现一些必要的属性，相比起来，创建一个 `vnode` 的成本比较低。
- **触发多次浏览器重绘及回流**：使用 `vnode` ，相当于加了一个缓冲，让一次数据变动所带来的所有 `node` 变化，先在 `vnode` 中进行修改，然后 `diff` 之后对所有产生差异的节点集中一次对 `DOM tree` 进行修改，以减少浏览器的重绘及回流。

### 补充 2：vue 为什么采用 vdom？

> 引入 `Virtual DOM` 在性能方面的考量仅仅是一方面。

- 性能受场景的影响是非常大的，不同的场景可能造成不同实现方案之间成倍的性能差距，所以依赖细粒度绑定及 `Virtual DOM` 哪个的性能更好还真不是一个容易下定论的问题。
- `Vue` 之所以引入了 `Virtual DOM`，更重要的原因是为了解耦 `HTML`依赖，这带来两个非常重要的好处是：

> - 不再依赖 `HTML` 解析器进行模版解析，可以进行更多的 `AOT` 工作提高运行时效率：通过模版 `AOT` 编译，`Vue` 的运行时体积可以进一步压缩，运行时效率可以进一步提升；
> - 可以渲染到 `DOM` 以外的平台，实现 `SSR`、同构渲染这些高级特性，`Weex`等框架应用的就是这一特性。

> 综上，`Virtual DOM` 在性能上的收益并不是最主要的，更重要的是它使得 `Vue` 具备了现代框架应有的高级特性。

### Virtual DOM

什么是 Virtual DOM？为什么 Virtual DOM 比原生 DOM 快？

大家都知道操作 DOM 是很慢的，为什么慢的原因已经在「**浏览器渲染原理**」章节中说过，这里就不再赘述了。

那么相较于 DOM 来说，操作 JS 对象会快很多，并且我们也可以通过 JS 来模拟 DOM

```
const ul = {
  tag: 'ul',
  props: {
    class: 'list'
  },
  children: {
    tag: 'li',
    children: '1'
  }
}
```

上述代码对应的 DOM 就是

```
<ul class='list'>
  <li>1</li>
</ul>
```

那么既然 DOM 可以通过 JS 对象来模拟，反之也可以通过 JS 对象来渲染出对应的 DOM。当然了，通过 JS 来模拟 DOM 并且渲染对应的 DOM 只是第一步，难点在于如何判断新旧两个 JS 对象的**最小差异**并且实现**局部更新** DOM。

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
