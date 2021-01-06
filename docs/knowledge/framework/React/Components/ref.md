---
title: React Ref
date: '2020-10-26'
draft: true
---

### 在 React 中，refs 的作用是什么

Refs 可以用于获取一个 DOM 节点或者 React 组件的引用。何时使用 refs 的好的示例有管理焦点/文本选择，触发命令动画，或者和第三方 DOM 库集成。你应该避免使用 String 类型的 Refs 和内联的 ref 回调。Refs 回调是 React 所推荐的。

ref 允许我们访问 DOM 元素，我们通过在组件中指定 ref 属性，属性值为一个回调函数，这个回调函数接受一个 DOM 元素或者 react 组件
作为参数，当我们不得不要直接访问 DOM 元素的时候才去使用它，如我需要在组件加载完成就立即让组件中的表单有焦点，即触发
focus 事件

### 组件的真实节点

有时需要从组件获取真实 DOM 的节点，这时就要用到 ref 属性。

需要注意的是，由于 this.refs.[refName] 属性获取的是真实 DOM ，所以必须等到虚拟 DOM 插入文档以后，才能使用这个属性，否则会报错。上面代码中，通过为组件指定 Click 事件的回调函数，确保了只有等到真实 DOM 发生 Click 事件之后，才会读取 this.refs.[refName] 属性。

### 如何创建 refs?

这里有两种方案
这是最近增加的一种方案。`refs` 是使用 `React.createRef()` 方法创建的，并通过 `ref` 属性添加到 React 元素上。为了在整个组件中使用*refs*，只需将 `ref` 分配给构造函数中的实例属性。

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

你也可以使用 ref 回调函数的方案，而不用考虑 React 版本。例如，访问搜索栏组件中的 `input` 元素如下：

```jsx
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.txtSearch = null;
    this.state = { term: '' };
    this.setInputSearchRef = e => {
      this.txtSearch = e;
    };
  }

  onInputChange(event) {
    this.setState({ term: this.txtSearch.value });
  }

  render() {
    return <input value={this.state.term} onChange={this.onInputChange.bind(this)} ref={this.setInputSearchRef} />;
  }
}
```

你也可以在使用 **closures** 的函数组件中使用 `refs`。

**注意：** 你也可以使用内联引用回调，尽管这不是推荐的方法。

### 为什么 String Refs 被弃用?

如果你以前使用过 React，你可能会熟悉旧的 API，其中的 `ref` 属性是字符串，如 `ref={'textInput'}`，并且 DOM 节点的访问方式为`this.refs.textInput`。我们建议不要这样做，因为字符串引用有以下问题，并且被认为是遗留问题。字符串 refs 在 React v16 版本中被移除。

它们强制 React 跟踪当前执行的组件。这是有问题的，因为它使 React 模块有状态，这会导致在 bundle 中复制 React 模块时会导致奇怪的错误。
它们是不可组合的 - 如果一个库把一个 ref 传给子元素，则用户无法对其设置另一个引用。
它们不能与静态分析工具一起使用，如 Flow。Flow 无法猜测出 `this.refs` 上的字符串引用的作用及其类型。Callback refs 对静态分析更友好。
使用 "render callback" 模式（比如： <DataGrid renderRow={this.renderRow} />），它无法像大多数人预期的那样工作。

```jsx
class MyComponent extends Component {
  renderRow = index => {
    // This won't work. Ref will get attached to DataTable rather than MyComponent:
    return <input ref={'input-' + index} />;

    // This would work though! Callback refs are awesome.
    return <input ref={input => (this['input-' + index] = input)} />;
  };

  render() {
    return <DataTable data={this.props.data} renderRow={this.renderRow} />;
  }
}
```
