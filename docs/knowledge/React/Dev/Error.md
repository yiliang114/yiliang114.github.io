---
title: 懒加载的实现原理
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
       }

       render() {
         if (this.state.error) {
           return <h1>Caught an error.</h1>
         }
         return <div onClick={this.handleClick}>Click Me</div>
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

### React 16 中未捕获的错误的行为是什么?

     在 React 16 中，未被任何错误边界捕获的错误将导致整个 React 组件树的卸载。这一决定背后的原因是，与其显示已损坏的界面，不如完全移除它。例如，对于支付应用程序来说，显示错误的金额比什么都不提供更糟糕。

### 放置错误边界的正确位置是什么?

     错误边界使用的粒度由开发人员根据项目需要决定。你可以遵循这些方法中的任何一种：

     可以包装顶层路由组件以显示整个应用程序中常见的错误消息。
     你还可以将单个组件包装在错误边界中，以防止它们奔溃时影响到应用程序的其余部分。

### 从错误边界跟踪组件堆栈有什么好处?

     除了错误消息和 JavaScript 堆栈，React 16 将使用错误边界的概念显示带有文件名和行号的组件堆栈。例如，BuggyCounter 组件显示组件堆栈信息：

     ![stacktrace](images/error_boundary.png)
