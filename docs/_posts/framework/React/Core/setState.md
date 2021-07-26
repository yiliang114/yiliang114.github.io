---
title: setState
date: '2020-10-26'
draft: true
---

## setState

`setState` 的调用并不会马上引起 `state` 的改变。因为 `setState` 是个异步 API，只有同步代码运行完毕才会执行。

异步的原因可能，`setState` 可能会导致 DOM 的重绘，如果调用一次就马上去进行重绘，那么调用多次就会造成不必要的性能损失。设计成异步的话，就可以将多次调用放入一个队列中，在恰当的时候统一进行更新过程。

如果需要对 `state` 数据更改监听，`setState` 提供第二个参数，就是用来监听 `state` 里面数据的更改，当数据更改完成，调用回调函数。

### 为什么不能直接更新状态?

如果你尝试直接改变状态，那么组件将不会重新渲染。正确方法应该是使用 `setState()` 方法。它调度组件状态对象的更新。当状态更改时，组件通将会重新渲染。

```js
this.setState({ message: 'Hello World' });
```

**注意：** 你可以在 `constructor` 中或使用最新的 JavaScript 类属性声明语法直接设置状态对象。

### 为什么建议传递给 setState 的参数是一个 callback 而不是一个对象

setState 它是一个异步函数，他会合并多次修改，降低 diff 算法的比对频率。这样也会提升性能。

因为 this.props 和 this.state 的**更新是异步的**，**不能依赖它们的值**去计算下一个 state。

### 回调函数作为 `setState()` 参数的目的是什么?

当 setState 完成和组件渲染后，回调函数将会被调用。由于 `setState()` 是异步的，回调函数用于任何后续的操作。

**注意：** 建议使用生命周期方法而不是此回调函数。

```js
setState({ name: 'John' }, () => console.log('The name has updated and component re-rendered'));
```

### 为什么我们需要将函数传递给 setState() 方法?

这背后的原因是 `setState()` 是一个异步操作。出于性能原因，React 会对状态更改进行批处理，因此在调用 `setState()` 方法之后，状态可能不会立即更改。这意味着当你调用 `setState()` 方法时，你不应该依赖当前状态，因为你不能确定当前状态应该是什么。这个问题的解决方案是将一个函数传递给 `setState()`，该函数会以上一个状态作为参数。通过这样做，你可以避免由于 `setState()` 的异步性质而导致用户在访问时获取旧状态值的问题。

假设初始计数值为零。在连续三次增加操作之后，该值将只增加一个。

```js
// assuming this.state.count === 0
this.setState({ count: this.state.count + 1 });
this.setState({ count: this.state.count + 1 });
this.setState({ count: this.state.count + 1 });
// this.state.count === 1, not 3
```

如果将函数传递给 `setState()`，则 count 将正确递增。

```js
this.setState((prevState, props) => ({
  count: prevState.count + props.increment,
}));
// this.state.count === 3 as expected
```

### 为什么函数比对象更适合于 `setState()`?

出于性能考虑，React 可能将多个 `setState()` 调用合并成单个更新。这是因为我们可以异步更新 `this.props` 和 `this.state`，所以不应该依赖它们的值来计算下一个状态。

以下的 counter 示例将无法按预期更新：

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

首选方法是使用函数而不是对象调用 `setState()`。该函数将前一个状态作为第一个参数，当前时刻的 props 作为第二个参数。

```js
// Correct
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment,
}));
```

### 如何使用 setState 防止不必要的更新?

你可以把状态的当前值与已有的值进行比较，并决定是否重新渲染页面。如果没有更改，你需要返回 `null` 以阻止渲染，否则返回最新的状态值。例如，用户配置信息组件将按以下方式实现条件渲染：

```jsx
getUserProfile = user => {
  const latestAddress = user.address;
  this.setState(state => {
    if (state.address === latestAddress) {
      return null;
    } else {
      return { title: latestAddress };
    }
  });
};
```

### setState 循环调用风险

如果在`shouldComponentUpdate`或`componentWillUpdate` 方法里调用 this.setState 方法，就会造成崩溃。

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/setStateCercle.png)

### setState 步骤

1. 将传递给 setState 的对象合并到组件的当前状态，触发所谓的调和过程（Reconciliation）
2. 然后生成新的 DOM 树并和旧的 DOM 树使用 Diff 算法对比
3. 根据对比差异对界面进行最小化重渲染

### `setState()` 和 `replaceState()` 方法之间有什么区别?

当你使用 `setState()` 时，当前和先前的状态将被合并。`replaceState()` 会抛出当前状态，并仅用你提供的内容替换它。通常使用 `setState()`，除非你出于某种原因确实需要删除所有以前的键。你还可以在 `setState()` 中将状态设置为 `false`/`null`，而不是使用 `replaceState()`。

### 是否可以在不调用 setState 方法的情况下，强制组件重新渲染?

默认情况下，当组件的状态或属性改变时，组件将重新渲染。如果你的 `render()` 方法依赖于其他数据，你可以通过调用 `forceUpdate()` 来告诉 React，当前组件需要重新渲染。

```js
component.forceUpdate(callback);
```

建议避免使用 `forceUpdate()`，并且只在 `render()` 方法中读取 `this.props` 和 `this.state`。

### 更新状态中的对象有哪些可能的方法?

用一个对象调用 `setState()` 来与状态合并：

- 使用 `Object.assign()` 创建对象的副本：

```js
const user = Object.assign({}, this.state.user, { age: 42 });
this.setState({ user });
```

- 使用扩展运算符：

```js
const user = { ...this.state.user, age: 42 };
this.setState({ user });
```

使用一个函数调用 `setState()`：

```js
this.setState(prevState => ({
  user: {
    ...prevState.user,
    age: 42,
  },
}));
```

### React setState 笔试题，下面的代码输出什么？

```js
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0,
    };
  }

  componentDidMount() {
    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val); // 第 1 次 log

    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val); // 第 2 次 log

    setTimeout(() => {
      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val); // 第 3 次 log

      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val); // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
}
```

0 0 2 3

1. 第一次和第二次都是在 react 自身生命周期内，触发时 isBatchingUpdates 为 true，所以并不会直接执行更新 state，而是加入了 dirtyComponents，所以打印时获取的都是更新前的状态 0。

2. 两次 setState 时，获取到 this.state.val 都是 0，所以执行时都是将 0 设置成 1，在 react 内部会被合并掉，只执行一次。设置完成后 state.val 值为 1。

3. setTimeout 中的代码，触发时 isBatchingUpdates 为 false，所以能够直接进行更新，所以连着输出 2，3。

### React 中 setState 什么时候是同步的，什么时候是异步的？

在 React 中，如果是由 React 引发的事件处理（比如通过 onClick 引发的事件处理），调用 setState 不会同步更新 this.state，除此之外的 setState 调用会同步执行 this.state。所谓“除此之外”，指的是绕过 React 通过 addEventListener 直接添加的事件处理函数，还有通过 setTimeout/setInterval 产生的异步调用。简单说就是只在合成事件和钩子函数中是“异步”的，在原生事件和 setTimeout 中都是同步的。

**原因：**在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中回头再说，而 isBatchingUpdates 默认是 false，也就表示 setState 会同步更新 this.state，但是，有一个函数 batchedUpdates，这个函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会调用这个 batchedUpdates，造成的后果，就是由 React 控制的事件处理过程 setState 不会同步更新 this.state。

简单来说就是当 setState 方法调用的时候 React 就会重新调用 render 方法来重新渲染组件；setState 通过一个队列来更新 state,当调用 setState 方法的时候会将需要更新的 state 放入这个状态队列中，这个队列会高效的批量更新 state;

![image](https://user-images.githubusercontent.com/21194931/56218832-3448ea00-6098-11e9-99f9-fe1652e08afc.png)

[详解: 深入 setState 机制](https://github.com/sisterAn/blog/issues/26)

### 异步更新

考虑到性能问题，setState 使用一个**队列机制**来更新 state。
当执行 setState 时，会将需要更新的 state**浅合并**后放入状态队列，不会立即更新 state。而如果不使用 setState，而直接修改 state 的值就不会放入状态队列，下一次调用 setState 对状态队列进行更新的时候可能会造成不可预知的错误。

例子：

```js
// 假设 state.count === 0
this.setState({ count: state.count + 1 });
this.setState({ count: state.count + 1 });
this.setState({ count: state.count + 1 });
// state.count === 1, 而不是 3
```

本质上等同于：

```js
// 假设 state.count === 0
Object.assign(state, { count: state.count + 1 }, { count: state.count + 1 }, { count: state.count + 1 });
// {count: 1}
```

**解决方法**为： **传递一个签名为 (state, props) => newState 的函数作为参数。** 向 setState 中传入函数时，这个函数不会被浅合并，一定会执行，是一个原子性更新操作。

```js
// 正确用法
this.setState((prevState, props) => ({
  count: prevState.count + props.increment,
}));
```
