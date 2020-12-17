---
title: 懒加载的实现原理
date: '2020-10-26'
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

```
<SampleButton id="sample" borderWidth={2} onClick={onButtonClick} style={{ color: 'red'}} />
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

```
Counter.propTypes = {
    caption: PropTypes.string.isRequired,
    initValue: PropTypes.number
}
```

propTypes 虽然能够在开发阶段发现代码的问题，但是放在产品环境中就不太合适了。产品环境下耗费资源，并且 console 中输出错误信息对用户来说没有什么意义。所以最好的方式是，开发者在代码中定义 propTypes， 在开发过程避免犯错，但是在发布产品时，用一种自动的方式将 propTypes 去掉，这样最终部署到产品的代码会更优 。**`babel-react-optimize`**具有这个功能，确保只在发布产品中使用它。

#### state

组件的内部状态。React 组件不能修改传入的 prop，所以需要记录组件自身的数据变化，就使用 state。

**初始化 state：**

```
// 通过判断逻辑，来给定state属性的值
constructor(prop) {
    ...
    this.state = {
        count: props.initValue || 0
    }
}
```

不够让这样的判断逻辑充斥组件的构造函数并不是一件美观的事情，而且容易遗漏。我们可以使用 React 的 defaultProps 功能，让代码更加容易读懂。

```
Counter.defaultProps = {
    initValue: 0
}
```

有了这样的设定，`this.state`初始化中可以省略判断条件，可以认为代码执行到这，必定有 initValue 值：

```
this.state = {
    count: props.initValue
}
```

**读取和更新 state：**

通过`this.state`可以读取到组件当前的 state，改变组件 state 必须使用`this.setState`函数。

如果直接修改`this.state`的值，虽然事实上改变了组件的内部状态，但只是野蛮地修改了 state，却没有驱动组件进行重新渲染，既然组件没有重新渲染，也不会反应`this.state`值得变化； 而`this.setState`函数做的事情就是，首先改变`this.setState`的值，然后驱动组件经历更新过程。

#### prop 和 state 对比

组件不应该改变 prop 的值，而 state 存在的目的就是让组件来改变的。

假如父组件包含多个子组件，然后把一个 JavaScript 对象作为 props 值传给这几个子组件，如果一个子组件去修改 props 中的值，可能让程序陷入一团混乱之中，这就违背了 React 设计的初衷。

### React 组件的生命周期

React 严格定义了组件的生命周期，经历如下三个过程：

- 装载过程(Mount), 也就是把组件第一个在 DOM 树种进行 渲染的过程。
- 更新过程(Update), 当组件被重新渲染的过程。
- 卸载过程(Unmount), 组件从 DOM 中删除的过程。

#### 装载

组件第一次被渲染的时候，一次调用的函数是：

- constructor

  ES6 构造函数，创造一个组件类的实例。需要注意的是，并不是每一个组件都需要定义自己的构造函数。无状态的 React 组件往往就不需要定义构造函数。一个 React 组件需要构造函数，一般是为了：

  - 初始化 state
  - 绑定成员函数的 this 环境：ES6 语法下类的每个成员函数在执行时的 this 并不是和类实例自动绑定的。

- getInitialState

  getInitialState 这个函数的返回值用来初始化组件的 state，但是这个方法只有用`React.createClass`方法创造的组件类才会用到。ES6 语法下，这个函数不会产生作用。

- getDefaultProps

  getDefaultProps 这个函数的返回值可以作为 props 的初始值。同样这个方法只有用`React.createClass`方法创造的组件类才会用到。ES6 语法下，这个函数不会产生作用。

- componentWillMount

  render 函数调用之前调用。执行这个函数时，还没有任何渲染的结果，即使调用`this.setState`修改状态也不会引发重新绘制。在 componentWillMount 函数中做的事情，都可以提前到 constructor 中去做。可以认为这个函数存在的目的是为了和 componentDidMount 对称。

- render

  所有 React 组件的父类`React.Component`类对除了 render 函数之外的生命周期函数都有默认实现。需要注意的是，render 函数是一个纯函数，完全根据`this.state` 和 `this.props`来决定返回的结果，而且不要产生任何副作用。在 render 函数中取调用`this.setState`毫无以为是错误的，因为一个纯函数不应该引起状态的变化。

- componentDidMount

  render 函数调用之后调用。需要注意的是，render 函数被调用之后，componentDidMount 函数并不会立即被调用，componentDidMount 函数被调用的时候，render 函数返回的东西已经引发了渲染，组件已经被挂载到 DOM 树上了。

**如果一个父组件中有多个子组件，会按照子组件的顺序依次调用子组件各自的 constructor、componentWillMount、render 函数，等所有子组件的这单个函数都执行完了之后，才会执行第一个子组件的 componentDidMount 函数。**

componentWillMount 函数都是紧贴自己的 render 函数之前调用，componentDidMount 函数是当所有子组件的 render 函数都调用了之后，子组件的 componentDidMount 函数（顺序）一起被调用。

因为 render 函数本身并不往 DOM 树上渲染或者装载内容，它只是返回一个 JSX 表示的对象。然后由 React 库来根据返回对象决定如何渲染。

componentWillMount 和 componentDidMount 函数还有一个区别是： componentWillMount 可以在服务器端被调用，也可以再浏览器被调用；而（**同构时**）componentDidMount 只能在浏览器被调用，服务器端使用 React 时不会被调用。

在实际开发中，可能会需要让 React 和 其他 UI 库配合使用。比如，React 和 jquery 配合，需要使用 componentDidMount 函数，当 componentDidMount 被执行时，React 组件对应的 DOM 已经存在，所有的事件处理函数也都已经设置好，这时就可以调用 Jquery 的代码，让 jquery 在已经绘制的 DOM 的基础上增强新的功能。

在 componentDidMount 中调用 jquery 代码只处理了装载过程，要和 jquery 完全结合，又要考虑 React 的更新过程，就要使用 componentDidUpdate 函数。

#### 更新过程

组件能够随着用户操作改变展示的内容，提供更好的用户体验。当 props 或者 state 被修改时，就会引发组件的更新过程。

更新过程调用的生命周期函数：

- componentWilReceiveProps(nextProps)

  只要父组件的 render 函数被调用，在 render 函数里被渲染的子组件就会经历更新过程，不管父组件传给子组件的 props 有没有改变，都会触发子组件的 componentWillReceiveProps。

  通过`this.setState`方法触发的更新过程不会调用这个函数。每个组件都可以通过`this.forceUpdate`函数强行引发一次重绘。

- shouldComponentUpdate(nextProps, nextState)

  shouldComponentUpdate 这个函数决定了一个组件什么时候不需要渲染。shouldComponentUpdate 和 render 函数是 React 生命周期函数中唯二两个要求有返回结果的函数。shouldComponentUpdate 函数返回一个布尔值，告诉 React 这个组件在这次更新过程中是否要继续。

  在更新过程中，React 库首先调用 shouldComponentUpdate 函数，如果函数返回的是 true，就是继续更新过程，接下来调用 render 函数，反之 如果得到一个 false，那就立即停止更新过程，也就不会引发后续的渲染了。

  React.Component 中默认的实现方式就是 shouldComponentUpdate 函数返回 true，也就是每次更新都会重新渲染，如果我们要追求更高的性能，就不能满足于默认实现，需要定制这个函数。

  ```
  shouldComponentUpdate(nextProps, nextState) {
      return (nextProps.caption !== this.props.caption) || (nextState.count !== this.state.count)
  }

  // 只有当caption 或者state 中的count值改变，shouldComponentUpdate函数才会返回true。
  // 通过this.setState()函数引发更新过程，并不是立即更新组件的state值，在执行到函数shouldComponentUpdate时，this.state 依然是 this.setState 函数执行之前的值，所以我们要做的实际上就是在 nextProps、nextState、this.props 和 this.state 中互相对比。

  // 通过调用一次 this.forceUpdate函数 子组件的render 函数就不会被调用了，因为强刷没有引发组件内部状态的更新，也完全没必要重新绘制子组件。
  ```

- componentWillUpdate

  如果 shouldComponentUpdate 函数返回 true， React 接下来就会依次执行 ComponentWillUpdate、render、ComponentDidUpdate 函数。

- render

- componentDidUpdate

  componentDidUpdate 函数无论更新过程发生在服务器端还是浏览器端，该函数都会被调用。 当 React 组件更新时，原有的内容被重新绘制了，这时候就需要在 componentDidUpdate 函数中再次调用 Jquery 代码。

并不是所有的更新都会执行全部函数。

React 做服务端渲染时，基本不会经历更新过程，因为服务端只需要产出 HTML 字符串，一个装载过程就足够产出 HTML 代码了。

#### 卸载过程

React 组件的卸载过程只涉及一个函数 componentWillUnmount 当组件要从 DOM 树上删除之前，对应的 componentWillUnmount 函数会被调用。

componentWillUnmount 中的工作往往和 componentDidMount 有关。比如在 componentDidMount 中用非 React 的方法创造了一些 DOM 元素，如果撒手不管可能会造成内存泄漏，那就需要在 componentWillUnmount 中把这些创造的 DOM 元素清理掉。

### 组件向外传递数据
