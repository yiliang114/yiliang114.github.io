---
title: 设计高质量的 React 组件
date: "2020-10-26"
draft: true
---

## 设计高质量的 React 组件

### 划分组件边界的原则

组件的划分满足 **高内聚** 和 **低耦合** 的原则。

高内聚是指把逻辑紧密相关的内容放在一个组件里。React 展示内容的 JSX，定义行为的 JavaScript，甚至定义样式的 CSS 都可以放在一个 JavaScript 文件中，React 天生具有高内聚的特点。

低耦合是指不同组件之间的依赖关系要尽量弱化，也就是每一个组件都需要独立。

### React 组件的数据种类

React 的两种数据—prop 和 state。 无论 prop 或者 state 的改变都会引发组件的重新渲染。

#### prop

外部传给组件的数据。

```html
<SampleButton id="sample" borderWidth={2} onClick={onButtonClick} style={{
color: 'red'}} />
```

HTML 组件属性的值都是字符串类型，即使是内嵌的 JavaScript，也依然是字符串表示代码。React 组件的 prop 所能支持的类型除了字符串之外，可以是任何 JavaScript 语言支持的数据类型。

当 prop 的类型不是字符串类型时，在 JSX 必须用`{}`，`style`的双花括号是因为对象。

React 组件要反馈数据给外部世界，也可以用 prop，传递一个函数。

如果组件的构造函数中没有调用`super(props)`, 那么组件实例被构造之后，类实例的所有成员函数就无法通过`this.props`访问到父组件传递过来的 props 值。 很明显，给`this.props`赋值是`React.Component`构造函数的工作之一。

`this.onButtonClick =this.onButtonClick.bind(this);` 为成员函数绑定当前 this 的执行环境，因为 ES6 方法创建的 React 组件并不自动绑定 this 到当前实例对象。

**ES6 解构赋值：**`const { caption} = this.props;`

**propTypes 检查：**

- 组件支持哪些 prop
- 每个 prop 应该是什么样的格式

```js
Counter.propTypes = {
  caption: PropTypes.string.isRequired,
  initValue: PropTypes.number,
};
```

propTypes 虽然能够在开发阶段发现代码的问题，但是放在产品环境中就不太合适了。产品环境下耗费资源，并且 console 中输出错误信息对用户来说没有什么意义。所以最好的方式是，开发者在代码中定义 propTypes， 在开发过程避免犯错，但是在发布产品时，用一种自动的方式将 propTypes 去掉，这样最终部署到产品的代码会更优 。**`babel-react-optimize`**具有这个功能，确保只在发布产品中使用它。

#### state

组件的内部状态。React 组件不能修改传入的 prop，所以需要记录组件自身的数据变化，就使用 state。

**初始化 state：**

```js
// 通过判断逻辑，来给定state属性的值
constructor(prop) {
    ...
    this.state = {
        count: props.initValue || 0
    }
}
```

不够让这样的判断逻辑充斥组件的构造函数并不是一件美观的事情，而且容易遗漏。我们可以使用 React 的 defaultProps 功能，让代码更加容易读懂。

```js
Counter.defaultProps = {
  initValue: 0,
};
```

有了这样的设定，`this.state`初始化中可以省略判断条件，可以认为代码执行到这，必定有 initValue 值：

```js
this.state = {
  count: props.initValue,
};
```

**读取和更新 state：**

通过`this.state`可以读取到组件当前的 state，改变组件 state 必须使用`this.setState`函数。

如果直接修改`this.state`的值，虽然事实上改变了组件的内部状态，但只是野蛮地修改了 state，却没有驱动组件进行重新渲染，既然组件没有重新渲染，也不会反应`this.state`值得变化； 而`this.setState`函数做的事情就是，首先改变`this.setState`的值，然后驱动组件经历更新过程。

#### prop 和 state 对比

组件不应该改变 prop 的值，而 state 存在的目的就是让组件来改变的。

假如父组件包含多个子组件，然后把一个 JavaScript 对象作为 props 值传给这几个子组件，如果一个子组件去修改 props 中的值，可能让程序陷入一团混乱之中，这就违背了 React 设计的初衷。
