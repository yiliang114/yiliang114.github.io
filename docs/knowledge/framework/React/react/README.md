---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# 全家桶

map set

http://wiki.jikexueyuan.com/project/es6/set-map.html

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

### 62.redux 为什么要把 reducer 设计成纯函数

redux 的设计思想就是不产生副作用，数据更改的状态可回溯，所以 redux 中处处都是纯函数

### 85.react-router 里的 `<Link>` 标签和 `<a>` 标签有什么区别

如何禁掉 `<a>` 标签默认事件，禁掉之后如何实现跳转。

先看 Link 点击事件 handleClick 部分源码

```js
if (that.props.onClick) that.props.onClick(event);

if (
  !event.defaultPrevented && // onClick prevented default
  event.button === 0 && // ignore everything but left clicks
  !that.props.target && // let browser handle "target=_blank" etc.
  !isModifiedEvent(event) // ignore clicks with modifier keys
) {
  event.preventDefault();

  var history = that.context.router.history;
  var that$props = that.props,
    replace = that$props.replace,
    to = that$props.to;

  if (replace) {
    history.replace(to);
  } else {
    history.push(to);
  }
}
```

Link 做了 3 件事情：

1. 有 onclick 那就执行 onclick
2. click 的时候阻止 a 标签默认事件（这样子点击`[123]()`就不会跳转和刷新页面）
3. 再取得跳转 href（即是 to），用 history（前端路由两种方式之一，history & hash）跳转，此时只是链接变了，并没有刷新页面

### react 面试题

1. mixin、hoc、render props、react-hooks 的优劣如何？
1. 你是如何理解 fiber 的?
1. 你对 Time Slice 的理解?
1. react-redux 是如何工作的?
1. redux 与 mobx 的区别?
1. redux 异步中间件之间的优劣?
1. redux 中如何进行异步操作?
1. React 如何进行组件/逻辑复用?
   https://github.com/xiaomuzhu/front-end-interview/blob/master/docs/### guide/react.md
