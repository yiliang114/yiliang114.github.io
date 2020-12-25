---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 单项数据流和双向数据流区别？

### react 的生命周期，在哪个生命周期中设置 setState 不会引起重新渲染？

### react 项目中的`registerServiceWorker.js`文件是做什么的？

在生产中，我们注册一个服务工作者来从本地缓存服务资产。
这使得应用程序在以后的产品访问中加载速度更快，并使其具备离线功能。但是，这也意味着开发人员(和用户)将只看到在“N+1”访问页面时部署的更新，因为以前缓存的资源在后台更新。

### 一个页面图和快速的展现出来？

### react 核心架构是什么？react 的原理是什么？

### 高阶组件了解多少？

### 你们用的版本 react 是什么版本？有关注过 16.0 有什么新特性吗？

### 说一下 react 的生命周期;shouldUpdate 生命周期中有什么比较数据的好的方法吗？

生命周期图；

其中在 componentWillMount、componentDidMount 和 componentWillReceiveProps 三个生命周期中进行 setState 不会引起重新渲染。

shouldComponentUpdate 生命周期默认返回 true。
实际效果却是每个组件都完成 re-render 和 virtual-DOM diff 过程，虽然组件没有变更，这明显是一种浪费。react 的性能瓶颈主要表现在：对于 props 和 state 没有变化的组件，react 也要重新生成虚拟 DOM 及虚拟 DOM 的 diff。
这个时候，就是 shouldComponentUpdate 上场的时候了。该对齐进行优化。

优化主要有：

react 在发展的不同阶段提供两套官方方案：

- PureRenderMin
- PureComponent

#### PureRenderMin

一种是基于 ES5 的 React.createClass 创建的组件，配合该形式下的 mixins 方式来组合 PureRenderMixin 提供的 shouldComponentUpdate 方法。当然用 ES6 创建的组件也能使用该方案。

```js
import PureRenderMixin from 'react-addons-pure-render-mixin';
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
}
```

#### PureComponent

在 React 15.3.0 版本发布的针对 ES6 而增加的一个组件基类：React.PureComponent。这明显对 ES6 方式创建的组件更加友好。

```js
import React, { PureComponent } from 'react';
class Example extends PureComponent {
  render() {
    // ...
  }
}
```

它内部的 shouldComponentUpdate 方法都是浅比较(shallowCompare)props 和 state 对象的，即只比较对象的第一层的属性及其值是不是相同。

例如下面 state 对象变更为如下值：

```js
state = {
  value: { foo: 'bar' },
};
```

为 state 的 value 被赋予另一个对象，使 nextState.value 与 this.props.value 始终不等，导致浅比较通过不了。在实际项目中，这种嵌套的对象结果是很常见的，如果使用 PureRenderMin 或者 PureComponent 方式时起不到应有的效果。
**虽然可以通过深比较方式来判断，但是深比较类似于深拷贝，递归操作，性能开销比较大。**
为此，可以对组件尽可能的拆分，使组件的 props 和 state 对象数据达到扁平化，结合着使用 PureRenderMin 或者 PureComponent 来判断组件是否更新，可以更好地提升 react 的性能，不需要开发人员过多关心。

### 说一下 redux

- 使用 `react-redux` 中的`<Provider>`来绑定全局的一个 store;
- 使用 `react-redux` 中的`connect`来创建容器组件。

### redux 是在哪儿监听数据的？怎么监听的？

- 使用`redux-saga/effects`中的`takeLates`来监听最新的 action 以及`redux-saga`中的`createSagaMiddleware`来创建监听

#### 打包后的文件有看过吗？资源代码和逻辑代码是什么？

### react 题目

```js
this.state = {
 val: 0
    };

componentDidMount() {
    this.setState({ val: this.state.val + 1 }, () => {
 console.log("A ", this.state.val);
    });
    console.log("B ", this.state.val);
    setTimeout(() => {
 console.log("C ", this.state.val);
 this.setState({ val: this.state.val + 1 }, () => {
   console.log("D ", this.state.val);
 });
 setTimeout(() => {
   console.log("E ", this.state.val);
 }, 0);
 console.log("F ", this.state.val);
    }, 0);
  }
```

> 结果：
> App.js:31 B 0
> App.js:29 A 1
> App.js:33 C 1
> App.js:35 D 2
> App.js:40 F 2
> App.js:38 E 2

### jsx 是什么？

### UI 库中的 theme 主题是怎么实现的？

### 查看文件功能是怎么实现的？
