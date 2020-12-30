---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

[React 性能优化](https://segmentfault.com/a/1190000006254212)

[React 进阶—性能优化](https://segmentfault.com/a/1190000008925295)

# 性能优化

1. shouldComponentUpdate 的使用，immutable 的使用，PureRender， PureComponent 的使用
2. 比如对一些按钮事件的延迟操作。

## 性能优化

这小节内容集中在组件的性能优化上，这一方面的性能优化也基本集中在 `shouldComponentUpdate` 这个钩子函数上做文章。

> PS：下文中的 state 指代了 state 及 props

在 `shouldComponentUpdate` 函数中我们可以通过返回布尔值来决定当前组件是否需要更新。这层代码逻辑可以是简单地浅比较一下当前 `state` 和之前的 `state` 是否相同，也可以是判断某个值更新了才触发组件更新。一般来说不推荐完整地对比当前 `state` 和之前的 `state` 是否相同，因为组件更新触发可能会很频繁，这样的完整对比性能开销会有点大，可能会造成得不偿失的情况。

当然如果真的想完整对比当前 `state` 和之前的 `state` 是否相同，并且不影响性能也是行得通的，可以通过 immutable 或者 immer 这些库来生成不可变对象。这类库对于操作大规模的数据来说会提升不错的性能，并且一旦改变数据就会生成一个新的对象，对比前后 `state` 是否一致也就方便多了，同时也很推荐阅读下 immer 的源码实现。

另外如果只是单纯的浅比较一下，可以直接使用 `PureComponent`，底层就是实现了浅比较 `state`。

```js
class Test extends React.PureComponent {
  render() {
    return <div>PureComponent</div>;
  }
}
```

这时候你可能会考虑到函数组件就不能使用这种方式了，如果你使用 16.6.0 之后的版本的话，可以使用 `React.memo` 来实现相同的功能。

```js
const Test = React.memo(() => <div>PureComponent</div>);
```

通过这种方式我们就可以既实现了 `shouldComponentUpdate` 的浅比较，又能够使用函数组件。

### react 性能优化方案

- 重写`shouldComponentUpdate`来避免不必要的 dom 操作
- 使用 production 版本的 react.js
- 使用 key 来帮助 React 识别列表中所有子组件的最小变化

### react 是如何进行渲染和性能优化的，看 react 的源码，render 函数等

https://zhuanlan.zhihu.com/p/43145754

### 对于渲染属性来说是否必须将 prop 属性命名为 render?

即使模式名为 `render props`，你也不必使用名为 render 的属性名来使用此模式。也就是说，组件用于知道即将渲染内容的任何函数属性，在技术上都是一个 `render props`。让我们举一个名为 children 渲染属性的示例：

```js
<Mouse
  children={mouse => (
    <p>
      The mouse position is {mouse.x}, {mouse.y}
    </p>
  )}
/>
```

实际上，以上的 children 属性不一定需要在 JSX 元素的 `attributes` 列表中命名。反之，你可以将它直接放在元素内部：

```js
<Mouse>
  {mouse => (
    <p>
      The mouse position is {mouse.x}, {mouse.y}
    </p>
  )}
</Mouse>
```

当使用上述的技术，需要在 propTypes 中明确声明 children 必须为函数类型：

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired,
};
```

### 在使用 context 时，如何解决性能方面的问题?

Context 使用引用标识来确定何时重新渲染，当 Provider 的父元素重新渲染时，会有一些问题即可能会在 Consumers 中触发无任何意图的渲染。 例如，下面的代码将在每次 Provider 重新渲染时，重新渲染所有的 Consumers，这是因为渲染 Provider 时，始终会为 value 属性创建一个新的对象：

```js
class App extends React.Component {
  render() {
    return (
      <Provider value={{ something: 'something' }}>
        <Toolbar />
      </Provider>
    );
  }
}
```

可以通过把 value 的值提升到父状态中来解决这个问题：

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: { something: 'something' },
    };
  }

  render() {
    return (
      <Provider value={this.state.value}>
        <Toolbar />
      </Provider>
    );
  }
}
```
