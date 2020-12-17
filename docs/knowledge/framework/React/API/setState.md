---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 当你调用 setState 的时候，发生了什么事？

- 将传递给 setState 的对象合并到组件的当前状态，触发所谓的调和过程（Reconciliation）
- 然后生成新的 DOM 树并和旧的 DOM 树使用 Diff 算法对比
- 根据对比差异对界面进行最小化重渲染

### setState 第二个参数的作用

因为 setState 是一个异步的过程，所以说执行完 setState 之后不能立刻更改 state 里面的值。如果需要对 state 数据更改监听，setState 提供第二个参数，就是用来监听 state 里面数据的更改，当数据更改完成，调用回调函数。

### 为什么建议传递给 setState 的参数是一个 callback 而不是一个对象

setState 它是一个异步函数，他会合并多次修改，降低 diff 算法的比对频率。这样也会提升性能。

因为 this.props 和 this.state 的**更新是异步的**，**不能依赖它们的值**去计算下一个 state。

# setState

`setState` 在 React 中是经常使用的一个 API，但是它存在一些问题，可能会导致犯错，核心原因就是因为这个 API 是异步的。

首先 `setState` 的调用并不会马上引起 `state` 的改变，并且如果你一次调用了多个 `setState` ，那么结果可能并不如你期待的一样。

```js
handle() {
  // 初始化 `count` 为 0
  console.log(this.state.count) // -> 0
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 })
  console.log(this.state.count) // -> 0
}
```

第一，两次的打印都为 0，因为 `setState` 是个异步 API，只有同步代码运行完毕才会执行。`setState` 异步的原因我认为在于，`setState` 可能会导致 DOM 的重绘，如果调用一次就马上去进行重绘，那么调用多次就会造成不必要的性能损失。设计成异步的话，就可以将多次调用放入一个队列中，在恰当的时候统一进行更新过程。

第二，虽然调用了三次 `setState` ，但是 `count` 的值还是为 1。因为多次调用会合并为一次，只有当更新结束后 `state` 才会改变，三次调用等同于如下代码

```js
Object.assign({}, { count: this.state.count + 1 }, { count: this.state.count + 1 }, { count: this.state.count + 1 });
```

当然你也可以通过以下方式来实现调用三次 `setState` 使得 `count` 为 3

```js
handle() {
  this.setState((prevState) => ({ count: prevState.count + 1 }))
  this.setState((prevState) => ({ count: prevState.count + 1 }))
  this.setState((prevState) => ({ count: prevState.count + 1 }))
}
```

如果你想在每次调用 `setState` 后获得正确的 `state` ，可以通过如下代码实现

```js
handle() {
    this.setState((prevState) => ({ count: prevState.count + 1 }), () => {
        console.log(this.state)
    })
}
```

### 为什么建议传递给 setState 的参数是一个 callback 而不是一个对象

因为 `this.props` 和 `this.state` 的更新可能是异步的，不能依赖它们的值去计算下一个 state。

## setState

`setState` 在 React 中是经常使用的一个 API，但是它存在一些的问题经常会导致初学者出错，核心原因就是因为这个 API 是异步的。

首先 `setState` 的调用并不会马上引起 `state` 的改变，并且如果你一次调用了多个 `setState` ，那么结果可能并不如你期待的一样。

```
handle() {
  // 初始化 `count` 为 0
  console.log(this.state.count) // -> 0
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 })
  console.log(this.state.count) // -> 0
}
```

第一，两次的打印都为 0，因为 `setState` 是个异步 API，只有同步代码运行完毕才会执行。`setState` 异步的原因我认为在于，`setState` 可能会导致 DOM 的重绘，如果调用一次就马上去进行重绘，那么调用多次就会造成不必要的性能损失。设计成异步的话，就可以将多次调用放入一个队列中，在恰当的时候统一进行更新过程。

第二，虽然调用了三次 `setState` ，但是 `count` 的值还是为 1。因为多次调用会合并为一次，只有当更新结束后 `state` 才会改变，三次调用等同于如下代码

```
Object.assign(
  {},
  { count: this.state.count + 1 },
  { count: this.state.count + 1 },
  { count: this.state.count + 1 },
)w
```

当然你也可以通过以下方式来实现调用三次 `setState` 使得 `count` 为 3

```
handle() {
  this.setState((prevState) => ({ count: prevState.count + 1 }))
  this.setState((prevState) => ({ count: prevState.count + 1 }))
  this.setState((prevState) => ({ count: prevState.count + 1 }))
}
```

如果你想在每次调用 `setState` 后获得正确的 `state` ，可以通过如下代码实现

```
handle() {
    this.setState((prevState) => ({ count: prevState.count + 1 }), () => {
        console.log(this.state)
    })
}
```

### 回调函数作为 `setState()` 参数的目的是什么?

    当 setState 完成和组件渲染后，回调函数将会被调用。由于 `setState()` 是异步的，回调函数用于任何后续的操作。

    **注意：** 建议使用生命周期方法而不是此回调函数。

    ```js
    setState({ name: 'John' }, () => console.log('The name has updated and component re-rendered'))
    ```

    阅读资源：

    [掘金 - 揭密React setState](https://juejin.im/post/5b87d14e6fb9a01a18268caf)
    [setState 如何知道该做什么?](https://overreacted.io/zh-hans/how-does-setstate-know-what-to-do/)

### 为什么我们需要将函数传递给 setState() 方法?

    这背后的原因是 `setState()` 是一个异步操作。出于性能原因，React 会对状态更改进行批处理，因此在调用 `setState()` 方法之后，状态可能不会立即更改。这意味着当你调用 `setState()` 方法时，你不应该依赖当前状态，因为你不能确定当前状态应该是什么。这个问题的解决方案是将一个函数传递给 `setState()`，该函数会以上一个状态作为参数。通过这样做，你可以避免由于 `setState()` 的异步性质而导致用户在访问时获取旧状态值的问题。

    假设初始计数值为零。在连续三次增加操作之后，该值将只增加一个。

    ```js
    // assuming this.state.count === 0
    this.setState({ count: this.state.count + 1 })
    this.setState({ count: this.state.count + 1 })
    this.setState({ count: this.state.count + 1 })
    // this.state.count === 1, not 3
    ```

    如果将函数传递给 `setState()`，则 count 将正确递增。

    ```js
    this.setState((prevState, props) => ({
      count: prevState.count + props.increment
    }))
    // this.state.count === 3 as expected
    ```

### setState 的第二个参数是什么，作用又是什么？

setState 的第二个参数是一个回调函数，组件更新完后执行的回调函数（setState 函数是异步的）

## 传入 setState 函数的第二个参数的作用是什么？

> 该函数会在 setState 函数调用完成并且组件开始重渲染的时候被调用，我们可以用该函数来监听渲染是否完成：

```
this.setState(
  { username: 'tylermcginnis33' },
  () => console.log('setState has finished and the component has re-rendered.')
)
```

```
this.setState((prevState, props) => {
  return {
    streak: prevState.streak + props.count
  }
})
```

### 如果在构造函数中使用 `setState()` 会发生什么?

    当你使用 `setState()` 时，除了设置状态对象之外，React 还会重新渲染组件及其所有的子组件。你会得到这样的错误：*Can only update a mounted or mounting component.*。因此我们需要在构造函数中使用 `this.state` 初始化状态。

### `setState()` 和 `replaceState()` 方法之间有什么区别?

     当你使用 `setState()` 时，当前和先前的状态将被合并。`replaceState()` 会抛出当前状态，并仅用你提供的内容替换它。通常使用 `setState()`，除非你出于某种原因确实需要删除所有以前的键。你还可以在 `setState()` 中将状态设置为 `false`/`null`，而不是使用 `replaceState()`。

### 是否可以在不调用 setState 方法的情况下，强制组件重新渲染?

    默认情况下，当组件的状态或属性改变时，组件将重新渲染。如果你的 `render()` 方法依赖于其他数据，你可以通过调用 `forceUpdate()` 来告诉 React，当前组件需要重新渲染。

    ```js
    component.forceUpdate(callback)
    ```

    建议避免使用 `forceUpdate()`，并且只在 `render()` 方法中读取 `this.props` 和 `this.state`。

### 为什么函数比对象更适合于 `setState()`?

     出于性能考虑，React 可能将多个 `setState()` 调用合并成单个更新。这是因为我们可以异步更新 `this.props` 和 `this.state`，所以不应该依赖它们的值来计算下一个状态。

     以下的 counter 示例将无法按预期更新：

     ```js
     // Wrong
     this.setState({
       counter: this.state.counter + this.props.increment,
     })
     ```

     首选方法是使用函数而不是对象调用 `setState()`。该函数将前一个状态作为第一个参数，当前时刻的 props 作为第二个参数。

     ```js
     // Correct
     this.setState((prevState, props) => ({
       counter: prevState.counter + props.increment
     }))
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

### 你认为状态更新是如何合并的?

     当你在组件中调用 setState() 方法时，React 会将提供的对象合并到当前状态。例如，让我们以一个使用帖子和评论详细信息的作为状态变量的 Facebook 用户为例：

     ```js
       constructor(props) {
         super(props);
         this.state = {
           posts: [],
           comments: []
         };
       }
     ```

     现在，你可以独立调用 setState() 方法，单独更新状态变量：

     ```js
      componentDidMount() {
         fetchPosts().then(response => {
           this.setState({
             posts: response.posts
           });
         });

         fetchComments().then(response => {
           this.setState({
             comments: response.comments
           });
         });
       }
     ```

     如上面的代码段所示，`this.setState({comments})` 只会更新 comments 变量，而不会修改或替换 posts 变量。

### 更新状态中的对象有哪些可能的方法?

     用一个对象调用 `setState()` 来与状态合并：

         * 使用 `Object.assign()` 创建对象的副本：

             ```js
             const user = Object.assign({}, this.state.user, { age: 42 })
             this.setState({ user })
             ```

         * 使用扩展运算符：

             ```js
             const user = { ...this.state.user, age: 42 }
             this.setState({ user })
             ```

     使用一个函数调用 `setState()`：

         ```js
         this.setState(prevState => ({
           user: {
             ...prevState.user,
             age: 42
           }
         }))
         ```

### React 中 setState 什么时候是同步的，什么时候是异步的？

> 在 React 中，如果是由 React 引发的事件处理（比如通过 onClick 引发的事件处理），调用 setState 不会同步更新 this.state，除此之外的 setState 调用会同步执行 this.state。所谓“除此之外”，指的是绕过 React 通过 addEventListener 直接添加的事件处理函数，还有通过 setTimeout/setInterval 产生的异步调用。

- 原因:在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中回头再说，而 isBatchingUpdates 默认是 false，也就表示 setState 会同步更新 this.state，但是，有一个函数 batchedUpdates，这个函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会调用这个 batchedUpdates，造成的后果，就是由 React 控制的事件处理过程 setState 不会同步更新 this.state。

简单来说就是当 setState 方法调用的时候 React 就会重新调用 render 方法来重新渲染组件；setState 通过一个队列来更新 state,当调用 setState 方法的时候会将需要更新的 state 放入这个状态队列中，这个队列会高效的批量更新 state;
![image](https://user-images.githubusercontent.com/21194931/56218832-3448ea00-6098-11e9-99f9-fe1652e08afc.png)

[详解: 深入 setState 机制](https://github.com/sisterAn/blog/issues/26)

### React setState 笔试题，下面的代码输出什么？

```
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }

  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
};
```

0 0 2 3

1、第一次和第二次都是在 react 自身生命周期内，触发时 isBatchingUpdates 为 true，所以并不会直接执行更新 state，而是加入了 dirtyComponents，所以打印时获取的都是更新前的状态 0。

2、两次 setState 时，获取到 this.state.val 都是 0，所以执行时都是将 0 设置成 1，在 react 内部会被合并掉，只执行一次。设置完成后 state.val 值为 1。

3、setTimeout 中的代码，触发时 isBatchingUpdates 为 false，所以能够直接进行更新，所以连着输出 2，3。

可参考 19 题

### 18.React 中 setState 什么时候是同步的，什么时候是异步的？

在 React 中，如果是由 React 引发的事件处理（比如通过 onClick 引发的事件处理），调用 setState 不会同步更新 this.state，除此之外的 setState 调用会同步执行 this.state。所谓“除此之外”，指的是绕过 React 通过 addEventListener 直接添加的事件处理函数，还有通过 setTimeout/setInterval 产生的异步调用。

**原因：**在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中回头再说，而 isBatchingUpdates 默认是 false，也就表示 setState 会同步更新 this.state，但是，有一个函数 batchedUpdates，这个函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会调用这个 batchedUpdates，造成的后果，就是由 React 控制的事件处理过程 setState 不会同步更新 this.state。

### 19.React setState 笔试题，下面的代码输出什么？

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

1. 第一次和第二次都是在 react 自身生命周期内，触发时 isBatchingUpdates 为 true，所以并不会直接执行更新 state，而是加入了 dirtyComponents，所以打印时获取的都是更新前的状态 0。

2. 两次 setState 时，获取到 this.state.val 都是 0，所以执行时都是将 0 设置成 1，在 react 内部会被合并掉，只执行一次。设置完成后 state.val 值为 1。

3. setTimeout 中的代码，触发时 isBatchingUpdates 为 false，所以能够直接进行更新，所以连着输出 2，3。

输出： 0 0 2 3
