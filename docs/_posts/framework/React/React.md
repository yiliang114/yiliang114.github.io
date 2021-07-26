---
title: React
date: '2020-10-26'
draft: true
---

## React

### 概念

React 不是 `MV*` 框架，是一个用于构建用户界面的 JavaScript 库，侧重于 View 层。

React 支持所有流行的浏览器，包括 Internet Explorer 9 和更高版本，但旧版本的浏览器（如 IE 9 和 IE 10）需要一些 polyfill。如果你使用 **es5-shim and es5-sham** polyfill，那么它甚至支持不支持 ES5 方法的旧浏览器。

React 的优点：

1. React 只关注 View 层，易于与框架（Angular，Backbone）集成，因为它只是一个视图库。
2. 虚拟 DOM + diff 算法 -> 不直接操作 DOM 对象
3. Components 组件，使用 `Virtual DOM` 提高应用程序的性能。
4. JSX 的引入，使得组件的代码更加可读，也更容易看懂组件的布局，或者组件之间是如何互相引用的。
5. State 触发视图的渲染 -> 单向数据绑定
6. 支持服务端渲染，可改进 SEO 和性能。
7. 使用 Jest 等工具轻松编写单元与集成测试。

### 虚拟 DOM 原理

React 会在内存中维护一个虚拟 DOM 树，对这个树进行读或写，实际上是对虚拟 DOM 进行。当数据变化时，React 会自动更新虚拟 DOM，然后将新的虚拟 DOM 和旧的虚拟 DOM 进行对比，找到变更的部分，得出一个 diff，然后将 diff 放到一个队列里，最终批量更新这些 diff 到 DOM 中。

优点：

1. 最终表现在 DOM 上的修改只是变更的部分，可以保证非常高效的渲染。

缺点：

1. 首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，会比 innerHTML 插入慢。

### 什么是 JSX?

一个类似 XML 的语法扩展。它是 `React.createElement()` 函数提供语法糖.

在下面的示例中，`<h1>` 内的文本标签会作为 JavaScript 函数返回给渲染函数。

```jsx
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>{'Welcome to React world!'}</h1>
      </div>
    );
  }
}
```

以上示例 render 方法中的 JSX 将会被转换为以下内容：

```js
React.createElement('div', null, React.createElement('h1', null, 'Welcome to React world!'));
```

编译函数，指定 h 函数。

```js
/** @jsx h */
```

jsx 文件顶部可以指定 pragma, 默认情况下是 `React.createElement` 这也就是为什么，js 文件中需要默认引入 react 的原因。

### react 有什么坑点

1. JSX 做表达式判断时候，需要强转为 boolean 类型
2. 尽量不要在 componentWillReviceProps 里使用 setState，如果一定要使用，那么需要判断结束条件，不然会出现无限重渲染，导致页面崩溃。(实际不是 componentWillReviceProps 会无限重渲染，而是 componentDidUpdate)
3. 给组件添加 ref 时候，尽量不要使用匿名函数，因为当组件更新的时候，匿名函数会被当做新的 prop 处理，让 ref 属性接受到新函数的时候，react 内部会先清空 ref，也就是会以 null 为回调参数先执行一次 ref 这个 props，然后在以该组件的实例执行一次 ref，所以用匿名函数做 ref 的时候，有的时候去 ref 赋值后的属性会取到 null
4. 遍历子节点的时候，不要用 index 作为组件的 key 进行传入
