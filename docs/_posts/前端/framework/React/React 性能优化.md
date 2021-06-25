---
title: React 性能优化
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

### react 最佳实践

- 不考虑使用状态管理工具的话，可以在 componentDidMount 或者 componentDidUpdate 中去执行 ajax 获取数据，但是这样代码臃肿，结构混乱，性能降低，最好是将异步的请求数据交给 redux，ajax 操作都放到 action 中是最好的。
- 生命周期中逻辑太多不好，想办法放一部分到 render 函数中，不过需要注意的是，render 函数中逻辑过多也会增加 re-render 时的计算时间。
- this.state = {} 不要有计算，比如 obj.name + “sss”之类的。
- 少用 state，多用 props，多用无状态组件（没有生命周期函数，没有 state？）
- 每一个 react 组件记得都需要 PropTypes 来规范，无状态组件的 PropTypes 规范也是需要的。
- 能用三元判断符，就不用 If ，直接放在 render()里
- 合理运用 context
- 使用 immutable data，是一种在创建之后就不可修改的对象。不可变对象可以让我们免于痛楚，并通过引用级别的比对检查来，改善渲染性能。 比如说在 shouldComponentUpdate.
- 代码分割，惰性加载
- 使用高阶组件 代理 mixins， 高阶组件 本质上来说，你可以由原始组件创造一个新的组件并且扩展它的行为。你可以在多种情况下使用它，比如授权：requireAuth({ role: 'admin' })(MyComponent)
- 使用 pureRender 优化可以减少重复加载的浪费，考虑好 shouldComponentUpdate 的设计。
- **保持数据扁平化：**API 经常会返回嵌套资源。这在 Flux 或基于 Redux 的架构中处理起来会非常困难。我们推荐使用 normalizr 之类的库将数据进行扁平化处理。
- 测试，redux 测试
- 组件级别的热加载。关于如何搭建热重载，可以参考 react-transform-boilerplate
- 代码规范，eslint
- 1. 能做成组件就尽量做成组件，细分化，do one thing and do it well；还能复用‘
  2. 基于第一点，只传入必要的 props, 再使用 immutablejs 或者 react.addons.update 来实现不可变数据结构，再结合 React.addons.PureRenderMixin 来减少 reRender
  3. 在 shouldComponentUpdate 中优化组件减少 reRender
  4. context 虽然没有官方文档，但还是很好用的。(不会的同学可以自己 google react context)
  5. 能不做 dom 操作就尽量不要，始终让 UI 能够基于 State 还原，尽量在 render()中把该做的做好
  6. propTypes, defaultProps 不要懒的去写，别人通过你的 propTypes 很容易理解组件，也容易 debug
  7. 在 store 和 action 中不要有 dom 操作或者访问 window.属性，让 store 和 action 中的逻辑只与数据打交道，好处：测试，服务器端渲染
  8. 推荐使用 ES6，arrow function"=>"和 destructuring {...this.props} var {a,b}=this.props 很好用
  9. npm 的 debug 包前后端公用很方便，开发的时候把组件渲染的每个步骤和动作都 log 下来，很容易在开发的时候就发现问题
  10. 使用 es6 时，事件 handler 尽量不要用这样偷懒的写法 onClick={e=>(this.doSomething("val"))},如果传递这个 function 给子组件，子组件就没法用 PureRenderMixin 来减少重复渲染了，因为这是个匿名函数
- **DOM 操作是不可避免的**
  但凡是上点儿规模的前端项目，没有 DOM 操作基本是不可能的。且不说最常见的后端「埋点」，你总得用 DOM API 去取值吧；就说一个最简单的，比如右手边这个「回到顶部」的按钮，你纯用 React 写一个试试。当然你会说什么 requestAnimationFrame，什么 ReactCSSTransitionGroup blah blah blah，真正到项目里你会发现还是 DOM API 简单。

### 部分源码

#### 组件编译

ReactDOM.render 渲染一个 App 标签到一个 id 节点上去。 JSX 的语法会被 babel 编译成 js, jsx 会有一个 h 函数，是用于将 App 标签编译成渲染 js 节点的，这就是为什么要 import React 的原理，因为在编译之后需要调用 React.createElement 这个函数 ？

### react 性能优化

在使用 react 的过程中，我们绕不开渲染性能优化问题，因为默认情况下 react 组件的 shouldComponentUpdate 函数会一直返回 true，这回导致所有的组件都会进行耗时的虚拟 DOM 比较。在使用 redux 作为 react 的逻辑层框架时，我们可以使用经典的 PureComponent+ShallowCompare 的方式进行渲染性能优化。

那么在使用 mobx 作为 react 的 store 时，我们该如何进行渲染性能优化呢？

### 组件的异步数据加载

我不想在一开始挂载组件的时候就去异步操作（或者可以直接懒加载，那就可以在 constructor 中直接去加载异步数据。。），比如说 modal 的异步数据加载，最好是在 visable === true 的时候进行 ajax，否则 ajax 消耗的事件影响首屏体验。

```js
import { observable, action, configure, runInAction, transaction } from 'mobx';
import { getBaseInfo, getExtractStatus, getExtractInfo } from '../../services/apis';

configure({ enforceActions: true });

class SupernatantStore {
  @observable visible = false;
  @observable baseInfo = [];
  @observable extractInfo = [];
  @observable extractStatus = [];

  // 一般很多人都会在组件初始化的时候进行ajax 操作
  // 但是实际页面在首屏渲染的时候就会挂载组件，执行constructor操作
  // constructor() {
  //   this.initData()
  // }

  initData = async () => {
    let result = await getBaseInfo();
    runInAction('上面的action修饰不到', () => {
      // console.log('runInAction...')
      this.baseInfo = result.data;
    });

    result = await getExtractInfo();
    runInAction('上面的action修饰不到', () => {
      this.extractInfo = result.data;
    });

    result = await getExtractStatus();
    runInAction('上面的action修饰不到', () => {
      this.extractStatus = result.data;
    });
  };

  @action changeVisible = bool => {
    this.visible = typeof bool === 'boolean' ? bool : false;
    // 这里优化组件的加载速度，只有在modal 显示的时候才会请求数据
    this.visible && this.initData();
  };
}

export default new SupernatantStore();
```

或者 其实 我比较常用的一种简单的懒加载方式：

主要实现的原理也是 根据组件是否 **可见** 或者 **loading** 状态下 来选择是否 return dom。

```jsx
{
  this.state.current < steps.length - 1 && (
    <div>
      <Button type="primary" onClick={() => this.next()}>
        下一步
      </Button>
      <Button style={{ marginLeft: 8 }} onClick={() => this.next()}>
        取消
      </Button>
    </div>
  );
}
```

### state or store？

这里有一条原则：只要是 别的组件不要使用到的属性（自产自销的那种。。。）， 那么久放在 state 中吧，毕竟如果强行放入 store 中，对于属性的操作，还不是得再实现一个 change 函数来改变属性的值，那跟 setState 有什么区别？ （唯一区别可能是 setState 的异步性。。。）

### Stateless Component or Class or PureComponent ？

stateless Component（无状态组件）只用作展示，一般不包含复杂逻辑。 已经很接近 一般的函数了。除了必须引入 React 。。。。

原则是： 如果组件使用 props 就可以的话（使用 state 并没有带来任何便利。。每个组件的 state 就像一个私有作用域，外部如果想要访问 很麻烦很麻烦。。。），直接上 stateless Component， 代码更简单。
