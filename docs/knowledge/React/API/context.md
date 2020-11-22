---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 举例说明如何使用 context?

     **Context** 旨在共享可被视为全局的数据，用于 React 组件树。例如，在下面的代码中，允许手动通过一个 theme 属性来设置按钮组件的样式。

     ```js
     //Lets create a context with a default theme value "luna"
     const ThemeContext = React.createContext('luna');
     // Create App component where it uses provider to pass theme value in the tree
     class App extends React.Component {
       render() {
         return (
           <ThemeContext.Provider value="nova">
             <Toolbar />
           </ThemeContext.Provider>
         );
       }
     }
     // A middle component where you don't need to pass theme prop anymore
     function Toolbar(props) {
       return (
         <div>
           <ThemedButton />
         </div>
       );
     }
     // Lets read theme value in the button component to use
     class ThemedButton extends React.Component {
       static contextType = ThemeContext;
       render() {
         return <Button theme={this.context} />;
       }
     }
     ```

### 在 context 中默认值的目的是什么?

     当在组件树中的组件没有匹配到在其上方的 Provider 时，才会使用 defaultValue 参数。这有助于在不包装组件的情况下单独测试组件。下面的代码段提供了默认的主题值 Luna。

     ```js
     const defaultTheme = "Luna";
     const MyContext = React.createContext(defaultTheme);
     ```

### 你是怎么使用 contextType?

     ContextType 用于消费 context 对象。ContextType 属性可以通过两种方式使用：

     **contextType as property of class:**
     可以为类的 contextType 属性分配通过 React.createContext() 创建的 context 对象。之后，你可以在任何生命周期方法和 render 函数中使用 `this.context` 引用该上下文类型最近的当前值。

     让我们在 MyClass 上按如下方式设置 contextType 属性：

     ```js
     class MyClass extends React.Component {
       componentDidMount() {
         let value = this.context;
         /* perform a side-effect at mount using the value of MyContext */
       }
       componentDidUpdate() {
         let value = this.context;
         /* ... */
       }
       componentWillUnmount() {
         let value = this.context;
         /* ... */
       }
       render() {
         let value = this.context;
         /* render something based on the value of MyContext */
       }
     }
     MyClass.contextType = MyContext;
     ```

     **Static field**
     你可以使用静态类属性来初始化 contextType 属性：

     ```js
     class MyClass extends React.Component {
       static contextType = MyContext;
       render() {
         let value = this.context;
         /* render something based on the value */
       }
     }
     ```

### 什么是 consumer?

     Consumer 是一个订阅上下文更改的 React 组件。它需要一个函数作为子元素，该函数接收当前上下文的值作为参数，并返回一个 React 元素。传递给函数 value 参数的参数值将等于在组件树中当前组件最近的 Provider 元素的 value 属性值。举个简单的例子：

     ```js
     <MyContext.Consumer>
       {value => /* render something based on the context value */}
     </MyContext.Consumer>
     ```
