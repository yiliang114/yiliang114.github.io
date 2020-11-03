---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

## 引领未来的用户界面开发

### 背景

React 本质上是一个“状态机”， 可以帮助开发者管理复杂的随着时间而变化的状态。它以一个精简的模型实现了这一点。React 只关心两件事：

1. 更新 DOM
2. 响应事件

React 不处理 ajax、路由和数据存储，也不规定数据组织方式。 它不是一个 Model-View-Controller 框架， 它只是 MVC 里面的 V。React 的精简允许你将它集成到各种各样的系统中。

在每次状态改变时，使用 JavaScript 重新渲染整个页面会异常慢，这应该归咎于读取和更新 DOM 的性能问题。 React 运用一个虚拟的 DOM 实现了一个非常强大的渲染系统，在 React 中对 DOM 只更新不读取。

React 就像高性能的 3D 游戏引擎，以渲染函数为基础。这些函数读入当前的状态，将其转换为目标页面上的一个虚拟表现。只要 React 被告知状态有变化，它就会重新运行这些函数，计算出页面的一个新的虚拟表现，接着自动地把结果转换成必要的 DOM 更新来反映新的表现。

乍一看，这种方式应该比通常的 JavaScript 方案（按需更新每一个元素）要慢, 但 React 确实是这么做的:它使用了非常高效的算法，计算出虚拟页面当前版本和新版间的差异，基于这些差异对 DOM 进行必要的最少更新。

React 赢就赢在最小化了重绘，并避免了不必要的 DOM 操作，这两点都是公认的性能瓶颈。用户界面越复杂，就越容易发生这样的情况，一个用户交互触发一个更新，而这个更新触发另外-一个更新，一个接一个。 如果没有恰当地把这些更新放到一起的话，性能就会大幅度降低。更糟糕的是，有时候 DOM 元素在达到最终状态前，会被更新好多次。

React 的虚拟表示差异算法，不但能够把这些问题的影响降到最低(通过在单个周期内进行最小的更新)，还能简化应用的维护成本。当用户输人或者有其他更新导致状态改变时，我们只要简单地通知 React 状态改变了，它就能自动化地处理剩下的事情。我们无须深入到详细的过程之中。

React 在整个应用中只使用单个事件处理器，并且会把所有的事件委托到这个处理器上。这一点也提升了 React 的性能，因为如果有很多事件处理器也会导致性能问题。

### JSX

在 React 中，组件是用于分离关注点的，而不是被当作模板或处理显示逻辑的。在使用 React 时，你必须接受这样的事实，那就是 HTML 标签以及生成这些标签的代码之间存在着内在的紧密联系。该设计允许你在构建标签结构时充分利用 JavaScript 的强大能力，而不必在笨拙的模板语言上浪费时间。

React 包含了一种可选的类 HTML 标记语言。不过在继续之前，我们要先说清楚一件事， 对于那些厌恶在 JavaScript 中写 HTML 标签以及那些还不明确 JSX 用处的人，请考虑在 React 中使用 JSX 的下列好处:

- 允许使用熟悉的语法来定义 HTML 元素树。
- 提供更加语义化且易懂的标签。
- 程序结构更容易被直观化。
- 抽象了 React Element 的创建过程。
- 可以随时掌控 HTML 标签以及生成这些标签的代码。
- 是原生的 JavaScript。

在本章里我们会探索 JSX 的诸多优点，如何使用 JSX,以及将它与 HTML 区分开来的一些注意事项。记住，JSX 并不是必需的。如果你决定不使用它，则可以直接跳到本章的结尾了解在 React 中不使用 JSX 的一些小提示。

#### 什么是 JSX

JSX 即 JavaScript XML ，一种在 React 组件内部构建标签的类 XML 语法。React 在不使用 JSX 的情况下一样可以工作，然而使用 JSX 可以提高组件的可读性，因此推荐你使用 JSX。

与以往在 JavaScript 中嵌入 HTML 标签的几种方案相比，JSX 有如下几点明显的特征:

1. JSX 是一-种句法变换一 每-一个 JSX 节点都对应着一个 JavaScript 函数。
2. JSX 既不提供也不需要运行时库。
3. JSX 并没有改变或添加 JavaScript 的语义一它 只是简单的函数调用而已。

与 HTML 的相似之处赋予了 JSX 在 React 中强大的表现力。下面我们将要讨论使用 JSX 的好处以及它在程序中发挥的作用，同时还会讨论 JSX 与 HTML 的关键区别。

#### 使用 JSX 的好处

1. 更加熟悉。JSX 对于熟悉 HTML 的开发者能够更容易、轻松阅读和贡献代码。
2. 更加语义化。JSX 还能够将 JavaScript 代码转换为更加语义化、更加有意义的标签。这种设计为我们提供了使用类 HTML 语法来声明组件结构和数据流向的能力，我们知道它们后续会被转换为原生的 JavaScript。JSX 允许你在应用程序中使用所有预定义的 HTML5 标签及自定义组件。稍后会讲述更多关于自定义组件的内容，而这里只是简单地说明 JSX 是如何做到让 JavaScript 更具可读性的。
3. 函数作用域内， 使用 JSX 语法的版本与使用原生 的 Javascript 相比，其标签的意图变得更加直观，可读性也更高。
4. 抽象化。 对于 React 版本的升级，使用 JSX 的开发者不需要改变代码能够直接正常运行，这是因为 JSX 的编译器抽象了将标签转化为 JS 的过程，所以对使用 JSX 的人来说，升级是无痛的。JSX 提供的抽象能力能够减少代码在项目开发过程中的改动。
5. 关注点分离。最后，也是 React 的核心，旨在将 HTML 标签以及生成这些标签的代码内在地紧密联系在一起。在 React 中，你不需要把整个应用程序甚至单个组件的关注点分离成视图和模板文件。相反，React 鼓励你为每-一个关注点创造-一个独立的组件，并把所有的逻辑和标签封装在其中。JSX 以干净且简洁的方式保证了组件中的标签与所有业务逻辑的相互分离。它不仅提供了一个清晰、直观的方式来描述组件树，同时还让你的应用程序更加符合逻辑。

#### 子节点

在 HTML 中，使用 `<h2>Questions</h2>` 来渲染-一个 header 元素，这里的 `"Questions"` 就是 h2 元素的子文本节点。而在 JSX 中，我们的目标是用下面的方式来表示它:
`<Divider>Questions</Divider>`
React 将开始标签与结束标签之间的所有子节点保存在一个名为`this .props.children`的特殊组件属性中。在这个例子中，`this.props .children == [ "Questions"]` 。

掌握了这-一点后，你就可以将硬编码的 `"Questions"` 换为变量 `this.props.children` 了。现在 React 会把你放在 `<Divider>`标签之间的任何东西渲染出来。

```js
var Divider = React.createClass({
  render: function() {
    return (
      <div className="divider">
        <h2>{this.props.children}</h2>
        <hr />
      </div>
    );
  },
});
```

至此，你就可以像使用任何 HTML 元素-样使用 `<Divider>` 组件了。
`<Divider>Questions</Divider>`
当我们把上面的 JSX 代码转换为 JavaScript 时，会得到下面的结果:

```js
var Divider = React.createClass({
  displayName: 'Divider',
  render: function() {
    return React.createElement(
      'div',
      { className: 'divider' },
      React.createElement('h2', null, this.props.children),
      React.createElement('hr', null),
    );
  },
});
```

而最终渲染输出的结果正如你所期待的那样：

```html
<div className="divider">
  <h2>Questions</h2>
  <hr />
</div>
```

#### JSX 与 HTML 的区别

1. JSX 的属性值可以动态设置， 可以使用变量，函数返回值等
2. 下面三个非 DOM 特殊属性只在 JSX 中存在：
   1. key
   2. ref
   3. dangerousSetInnerHTML

### React 绑定 this

https://blog.csdn.net/weixin_34249678/article/details/92728169?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase

https://www.jianshu.com/p/f070f64ac9b2

### 总结

#### 基础

1. 虚拟 DOM 与 JSX
2. 组件生命周期与数据操作
3. 组件通信
4. ReactDOM 与表单
5. React 与 es6
6. 自定义组件

#### 进阶

1. react 动画
2. 高阶组件
3. Hooks
4. React 与 TS
5. ant design
6. react 性能优化

#### 生态

1. router
2. 可视化
3. 数据管理 redux, mobx
4. 企业级框架 antd-pro
5. 单元测试

### react 的自定义事件和原生事件的区别

React 并不是将 click 事件绑在该 div 的真实 DOM 上，而是在 document 处监听所有支持的事件，当事件发生并冒泡至 document 处时，React 将事件内容封装并交由真正的处理函数运行。
详情请参考文章 蚂蚁金服-Nekron 大佬的文章 React 合成事件和 DOM 原生事件混用须知

### setState 是异步还是同步的

不要着急回答是异步的，再上问的基础上 setState 也可以是同步的。
setState 只在合成事件和钩子函数中是“异步”的，在原生事件和 setTimeout 中都是同步的。
详情请阅读 饿了么-虹晨大佬的文章
你真的理解 setState 吗？

### redux 和 vuex 的区别

redux 是 flux 的一种实现，redux 不单单可以用在 react 上面。
vuex 是 redux 的基础上进行改变，对仓库的管理更加明确。
数据流向不一样，vuex 的同异步有不同的流向，而 redux 的同异步是一样的。
redux 使用的是不可变的数据，而 vuex 的数据是可变的，redux 每次修改更新数据，其实就是用新的数据替换旧的数据，而 vuex 是直接修改原数据。

### react 和 vue 的 diff 过程有什么区别

React 是这么干的：你给我一个数据，我根据这个数据生成一个全新的 Virtual DOM，然后跟我上一次生成的 Virtual DOM 去 diff，得到一个 Patch，然后把这个 Patch 打到浏览器的 DOM 上去。完事。并且这里的 Patch 显然不是完整的 Virtual DOM，而是新的 Virtual DOM 和上一次的 Virtual DOM 经过 diff 后的差异化的部分。
Vue 在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。
React 每当应用的状态被改变时，全部子组件都会重新渲染。
这可以通过 shouldComponentUpdate 这个生命周期方法来进行控制。
React diff 的是 Dom，而 Vue diff 的是数据。

## React

- 为什么要绑定 this
- setState 是同步还是异步，立即获取值的操作
- 自定义事件原理， 冒泡、捕获
- hooks
- diff 原理
- fiber
- mobx content 以及 redux 几种状态管理的区别

### 部分源码

#### 组件编译

ReactDOM.render 渲染一个 App 标签到一个 id 节点上去。 JSX 的语法会被 babel 编译成 js, jsx 会有一个 h 函数，是用于将 App 标签编译成渲染 js 节点的，这就是为什么要 import React 的原理，因为在编译之后需要调用 React.createElement 这个函数 ？

### 与 vue 主要的不同

- 数据流

### 主要

- 异步渲染
- 事件系统
- fiber
