---
title: React Dev Error
date: '2020-10-26'
draft: true
---

### 在哪些情况下，错误边界不会捕获错误?

以下是错误边界不起作用的情况：

在事件处理器内。
**setTimeout** 或 **requestAnimationFrame** 回调中的异步代码。
在服务端渲染期间。
错误边界代码本身中引发错误时。

### 为什么事件处理器不需要错误边界?

错误边界不会捕获事件处理程序中的错误。与 render 方法或生命周期方法不同，在渲染期间事件处理器不会被执行或调用。

如果仍然需要在事件处理程序中捕获错误，请使用下面的常规 JavaScript `try/catch` 语句：

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  handleClick = () => {
    try {
      // Do something that could throw
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>;
    }
    return <div onClick={this.handleClick}>Click Me</div>;
  }
}
```

上面的代码使用普通的 JavaScript try/catch 块而不是错误边界来捕获错误。

### try catch 与错误边界有什么区别?

Try catch 块使用命令式代码，而错误边界则是使用在屏幕上呈现声明性代码。

例如，以下是使用声明式代码的 try/catch 块：

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

而错误边界包装的声明式代码如下：

```js
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

因此，如果在组件树深处某个位置组件的 **componentDidUpdate** 方法中，发生了由 **setState** 引发的错误，它仍然会正确地冒泡到最近的错误边界。
