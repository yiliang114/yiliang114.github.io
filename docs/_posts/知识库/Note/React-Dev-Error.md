---
title: React Dev Error
date: "2020-10-26"
draft: true
---

## React Dev Error

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

```jsx
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

因此，如果在组件树深处某个位置组件的 **componentDidUpdate** 方法中，发生了由 **setState** 引发的错误，它仍然会正确地冒泡到最近的错误边界。

### react 16.0 有什么新特性

16.0 的新特性有：

- Components can now return arrays and strings from render.
- Improved error handling with introduction of "error boundaries". Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed.

  > 通过引入“错误边界”改进了错误处理。 错误边界是 React 组件，可以在其子组件树中的任何位置捕获 JavaScript 错误，记录这些错误并显示回退 UI，而不是崩溃的组件树。 - 翻译

  > 什么是 Error Boundaries?
  > 单一组件内部错误，不应该导致整个应用报错并显示空白页，而 Error Boundaries 解决的就是这个问题。
  > Error Boundaries 的实现
  > 需要在组件中定义个新的生命周期函数——componentDidCatch(error, info)

  ```js
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
      // Display fallback UI
      this.setState({ hasError: true });
      // You can also log the error to an error reporting service
      logErrorToMyService(error, info);
    }

    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
      }
      return this.props.children;
    }
  }
  ```

  // 上述的 ErrorBoundary 就是一个“错误边界”，然后我们可以这样来使用它：

```jsx
<ErrorBoundary>
  <MyWidget />{" "}
</ErrorBoundary>
```

> Error Boundaries 本质上也是一个组件，通过增加了新的生命周期函数 componentDidCatch 使其变成了一个新的组件，这个特殊组件可以捕获其子组件树中的 js 错误信息，输出错误信息或者在报错条件下，显示默认错误页。
> **注意一个 Error Boundaries 只能捕获其子组件中的 js 错误，而不能捕获其组件本身的错误和非子组件中的 js 错误。**

### 每次组件渲染时调用函数的常见错误是什么?

你需要确保在将函数作为参数传递时未调用该函数。

```jsx
render() {

// Wrong: handleClick is called instead of passed as a reference!
return <button onClick={this.handleClick()}>{'Click Me'}</button>
}
```

相反地，传递函数本身应该没有括号：

```jsx
render() {

// Correct: handleClick is passed as a reference!
return <button onClick={this.handleClick}>{'Click Me'}</button>
}
```
