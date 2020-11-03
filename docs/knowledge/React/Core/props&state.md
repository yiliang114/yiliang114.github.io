---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 为什么在 DOM 元素上展开 props 需要小心?

    当我们展开属性时，我们会遇到添加未知 HTML 属性的风险，这是一种不好的做法。相反，我们可以使用属性解构和`...rest` 运算符，因此它只添加所需的 props 属性。例如，

    ```jsx
    const ComponentA = () =>
      <ComponentB isDisplay={true} className={'componentStyle'} />

    const ComponentB = ({ isDisplay, ...domProps }) =>
      <div {...domProps}>{'ComponentB'}</div>
    ```

### 如何监听状态变化?

     当状态更改时将调用以下生命周期方法。你可以将提供的状态和属性值与当前状态和属性值进行比较，以确定是否发生了有意义的改变。

     ```
     componentWillUpdate(object nextProps, object nextState)
     componentDidUpdate(object prevProps, object prevState)
     ```

### 你怎么说 props 是只读的?

     当你将组件声明为函数或类时，它决不能修改自己的属性。让我们来实现一个 capital 的函数：

     ```javascript
     function capital(amount, interest) {
        return amount + interest;
     }
     ```

     上面的函数称为“纯”函数，因为它不会尝试更改输入，并总是为相同的输入返回相同的结果。因此，React 有一条规则，即“所有 React 组件的行为都必须像纯函数一样”。

### 什么时候组件的 props 属性默认为 true?

     如果没有传递属性值，则默认为 true。此行为可用，以便与 HTML 的行为匹配。例如，下面的表达式是等价的：

     ```javascript
     <MyInput autocomplete />

     <MyInput autocomplete={true} />
     ```

     **注意：** 不建议使用此方法，因为它可能与 ES6 对象 shorthand 混淆（例如，{name}，它是{ name:name } 的缩写）

### 为什么你不能更新 React 中的 props?

     React 的哲学是 props 应该是 *immutable* 和 *top-down*。这意味着父级可以向子级发送任何属性值，但子级不能修改接收到的属性。

### 什么是渲染属性?

     **Render Props** 是一种简单的技术，用于使用值为函数的 prop 属性在组件之间共享代码。下面的组件使用返回 React 元素的 render 属性：

     ```jsx
     <DataProvider render={data => (
       <h1>{`Hello ${data.target}`}</h1>
     )}/>
     ```

     像 React Router 和 DownShift 这样的库使用了这种模式。
