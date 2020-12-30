---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 展示组件(Presentational component)和容器组件(Container component)之间有何不同

展示组件关心组件看起来是什么。展示专门通过 props 接受数据和回调，并且几乎不会有自身的状态，但当展示组件拥有自身的状态时，通常也只关心 UI 状态而不是数据的状态。

容器组件则更关心组件是如何运作的。容器组件会为展示组件或者其它容器组件提供数据和行为(behavior)，它们会调用 `Flux actions`，并将其作为回调提供给展示组件。容器组件经常是有状态的，因为它们是(其它组件的)数据源。

### (组件的)状态(state)和属性(props)之间有何不同

`State` 是一种数据结构，用于组件挂载时所需数据的默认值。`State` 可能会随着时间的推移而发生突变，但多数时候是作为用户事件行为的结果。

`Props`(properties 的简写)则是组件的配置。`props` 由父组件传递给子组件，并且就子组件而言，`props` 是不可变的(immutable)。组件不能改变自身的 props，但是可以把其子组件的 props 放在一起(统一管理)。Props 也不仅仅是数据--回调函数也可以通过 props 传递。

### 指出(组件)生命周期方法的不同

- `componentWillMount` -- 多用于根组件中的应用程序配置
- `componentDidMount` -- 在这可以完成所有没有 DOM 就不能做的所有配置，并开始获取所有你需要的数据；如果需要设置事件监听，也可以在这完成
- `componentWillReceiveProps` -- 这个周期函数作用于特定的 prop 改变导致的 state 转换
- `shouldComponentUpdate` -- 如果你担心组件过度渲染，`shouldComponentUpdate` 是一个改善性能的地方，因为如果组件接收了新的 `prop`， 它可以阻止(组件)重新渲染。shouldComponentUpdate 应该返回一个布尔值来决定组件是否要重新渲染
- `componentWillUpdate` -- 很少使用。它可以用于代替组件的 `componentWillReceiveProps` 和 `shouldComponentUpdate`(但不能访问之前的 props)
- `componentDidUpdate` -- 常用于更新 DOM，响应 prop 或 state 的改变
- `componentWillUnmount` -- 在这你可以取消网络请求，或者移除所有与组件相关的事件监听器

### 应该在 React 组件的何处发起 Ajax 请求

在 React 组件中，应该在 `componentDidMount` 中发起网络请求。这个方法会在组件第一次“挂载”(被添加到 DOM)时执行，在组件的生命周期中仅会执行一次。更重要的是，你不能保证在组件挂载之前 Ajax 请求已经完成，如果是这样，也就意味着你将尝试在一个未挂载的组件上调用 setState，这将不起作用。在 `componentDidMount` 中发起网络请求将保证这有一个组件可以更新了。

### 何为受控组件(controlled component)

在 HTML 中，类似 `<input>`, `<textarea>` 和 `<select>` 这样的表单元素会维护自身的状态，并基于用户的输入来更新。当用户提交表单时，前面提到的元素的值将随表单一起被发送。但在 React 中会有些不同，包含表单元素的组件将会在 state 中追踪输入的值，并且每次调用回调函数时，如 `onChange` 会更新 state，重新渲染组件。一个输入表单元素，它的值通过 React 的这种方式来控制，这样的元素就被称为"受控元素"。

### 何为高阶组件(higher order component)

高阶组件是一个以组件为参数并返回一个新组件的函数。HOC 运行你重用代码、逻辑和引导抽象。最常见的可能是 Redux 的 `connect` 函数。除了简单分享工具库和简单的组合，HOC 最好的方式是共享 React 组件之间的行为。如果你发现你在不同的地方写了大量代码来做同一件事时，就应该考虑将代码重构为可重用的 HOC。

练习

<hr />

- 写一个反转其输入的 HOC
- 写一个从 API 提供数据给传入的组件的 HOC
- 写一个实现 shouldComponentUpdate 来避免 reconciliation 的 HOC
- 写一个通过 `React.Children.toArray` 对传入组件的子组件进行排序的 HOC

### 怎么阻止组件的渲染

在组件的 `render` 方法中返回 `null` 并不会影响触发组件的生命周期方法

### 当渲染一个列表时，何为 key？设置 key 的目的是什么

Keys 会有助于 React 识别哪些 `items` 改变了，被添加了或者被移除了。Keys 应该被赋予数组内的元素以赋予(DOM)元素一个稳定的标识，选择一个 key 的最佳方法是使用一个字符串，该字符串能惟一地标识一个列表项。很多时候你会使用数据中的 IDs 作为 keys，当你没有稳定的 IDs 用于被渲染的 `items` 时，可以使用项目索引作为渲染项的 key，但这种方式并不推荐，如果 `items` 可以重新排序，就会导致 `re-render` 变慢。

### (在构造函数中)调用 super(props) 的目的是什么

在 `super()` 被调用之前，子类是不能使用 `this` 的，在 ES2015 中，子类必须在 `constructor` 中调用 `super()`。传递 `props` 给 `super()` 的原因则是便于(在子类中)能在 `constructor` 访问 `this.props`。

### react 中 key 的作用

key 是 React 中用于追踪哪些列表中元素被修改、删除或者被添加的辅助标识。在 diff 算法中，key 用来判断该元素节点是被移动过来的还是新创建的元素，减少不必要的元素重复渲染。

### react 中组件传值

父传子（组件嵌套浅）：父组件定义一个属性，子组件通过 this.props 接收。

子传父：父组件定义一个属性，并将一个回调函数赋值给定义的属性，然后子组件进行调用传过来的函数，并将参数传进去，在父组件的回调函数中即可获得子组件传过来的值。

### 在 constructor 中绑定事件函数的 this 指向

把一个对象的方法赋值给一个变量会造成 this 的丢失，所以需要绑定 this，把绑定放在构造函数中可以保证只绑定一次函数，如果放在 render 函数中绑定 this 的话每次渲染都会去绑定一次 this，那样是很耗费性能的。

### shouldComponentUpdate(nextProps, nextState)

当父组件被重新渲染时即 render 函数执行时，子组件就会默认被重新渲染，但很多时候是不需要重新渲染每一个子组件的。这时就可以使用 shouldComponentUpdate 来判断是否真的需要重新渲染子组件。仅仅一个判断，就可以节约很多的消耗。
所以对于父组件发生变化而子组件不变的情况，使用 shouldComponentUpdate 会提升性能。

```js
shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.content === this.props.content) {
        return false;
    } else {
        return true;
    }
}
```

### 使用 PureComponent

`PureComponent`内部帮我们实现了`shouldComponentUpdate`的比较，其他和 Component 一样。但是在 shouldComponentUpdate 进行的是一个**浅比较**，看看官方文档是怎么说的。

浅比较只比较第一层的基本类型和引用类型值是否相同

如果数据结构比较复杂，那么可能会导致一些问题，要么当你知道改变的时候调用`forceUpdate`,要么使用`immutable`来包装你的 state

### 无状态组件

无状态组件就是使用定义函数的方式来定义组件，这种组件相比于使用类的方式来定义的组件(有状态组件)，少了很多初始化过程，更加精简，所以要是可以使用无状态组件应当尽可能的使用无状态组件，会大幅度提升效率

### 展示组件(Presentational component)和容器组件(Container component)之间有何不同

- 展示组件关心组件看起来是什么。
  - 展示专门通过 props 接受数据和回调，并且几乎不会有自身的状态，但当展示组件拥有自身的状态时，通常也只关心 UI 状态而不是数据的状态。
- 容器组件则更关心组件是如何运作的。
  - 容器组件会为展示组件或者其它容器组件提供数据和行为(behavior)，它们会调用 Flux actions，并将其作为回调提供给展示组件。容器组件经常是有状态的，因为它们是(其它组件的)数据源。

### 类组件(Class component)和函数式组件(Functional component)之间有何不同

- 类组件不仅允许你使用更多额外的功能，如组件自身的状态和生命周期钩子，也能使组件直接访问 store 并维持状态
- 当组件仅是接收 props，并将组件自身渲染到页面时，该组件就是一个 '无状态组件(stateless component)'，可以使用一个纯函数来创建这样的组件。这种组件也被称为哑组件(dumb components)或展示组件

### React 创建组件的三种方式及区别

React 推出后，处于不同的原因先后出现四种定义 react 组件的方式，殊途同归。

具体的四种方式：

- 函数式定义，**无状态组件**
- es5 原生方式，`React.createClass` 定义的组件
- es6 形式，`extends React.Component` 定义的组件
- es6 形式，`extends React.PureComponent` 定义的组件

#### 无状态组件（stateless component）

创建无状态函数式组件形式是从 React 0.14 版本开始出现的。它是为了创建创建纯展示组件，这种组件只负责根据传入的`props`来展示，不涉及到要`state`状态的操作。

无状态函数式组件形式上表现为一个只带有一个`render`方法的组件类，通过函数形式或 ES6 箭头函数形式创建，并且该组件是无`state`状态的，具体的创建形式如下：

```
function HelloConponent(props,/* context*/){
  return <div>Hello {props.name}</div>
}
ReactDOM.render(<HelloConponent name="yiliang" />, mountNode)
```

无状态组件的创建形式使代码的可读性更好，减少了大量冗余代码，精简到只有一个 render 方法，初次之外无状态组件还有以下几个显著的特点：

1. **组件不会被实例化，不会再有组件实例化的过程，不需要分配多余的内存，整体渲染性能得到提升。**
2. **组件不能访问`this`对象。 无状态组件由于没有实例化的过程，所以无法访问组件的 this 对象，例如`this.ref`,`this.state` 等均不能访问。若想访问这些属性，就不能使用这种形式来创建组件。**
3. **组件无法访问生命周期函数。无状态组件是不需要生命周期管理和状态管理，所以底层实现这种形式的组件时不会实现组件的生命周期方法。**
4. **无状态组件只能访问输入的 props，同样的 props 会得到同样的渲染结果，不会有副作用。**

在大型项目中尽可能以简单的写法来分割原本庞大的组件，未来 React 也会这种面向无状态组件在譬如无意义的检查和内存分配领域进行一系列优化，所以**use more stateless component**

#### React.createClass

`React.createClass` 是 react 刚开始推荐的创建组件的方式，这是 ES5 的原生 Javascript 来实现的 React 组件。

不过这种创建形式已经不被推荐，尽量还是不要用这种写法了。

#### React.Component

`React.Component` 是以 ES6 的形式来创建 React 组件，是目前 React 目前极为推荐的创建有状态组件的方式，相对于`React.createClass`可以更好地实现代码复用。

```js
class TestComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text || 'text',
    };

    // ES6 类中函数必须手动绑定this
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      text: event.target.value,
    });
  }

  render() {
    return (
      <div>
        Input something:
        <input onChange={this.handleChange} value={this.state.text} />
      </div>
    );
  }
}

TestComponent.propTypes = {
  text: React.propTypes.string,
};
TestComponent.defaultProps = {
  text: 'default text',
};
```

`React.createClass` 创建的组件，每一个成员函数的 this 都由 React 自动绑定，无论何时使用，直接使用`this.methodName`即可。

跟`React.createClass` 不同，`React.Component` 创建的组件必须手动绑定 this，否则 this 不能获取**当前组件实例对象**。

为了绑定 this，有三种方法：

```js
// 在构造函数中
constructor(props) {
  super(props)
  this.methodName = this.methodName.bind(this)
}

// 在调用的时候绑定(1)
<button type="primary" onClick={this.methodName.bind(this)} />


// 在调用的时候绑定(2), 使用箭头函数来指定this的值。
<button type="primary" onClick={() => this.methodName()} />

```

##### React.createClass 与 React.Component 区别

[链接](https://www.cnblogs.com/wonyun/p/5930333.html)

1. 上述所说的函数 this 的绑定
2. 组件属性类型 propTypes 及其默认 props 属性 default 配置不同。React.createClass 使用`getDefaultProps`

#### React.PureComponent

在 React 组件的生命周期中，有一个 shouldComponentUpdate 方法，这个方法默认返回值是 true，这就以为这就算没有改变组件的`props` 和 `state` 也会导致组件的重绘。

#### 选择

1. 只要有可能，尽量使用无状态组件创建形式
2. 否则（如果需要 state，生命周期方法等），使用`React.Component` 这种 ES6 形式创建。

### 通信

其实 React 中的组件通信基本和 Vue 中的一致。同样也分为以下三种情况：

- 父子组件通信
- 兄弟组件通信
- 跨多层级组件通信
- 任意组件

### 父子通信

父组件通过 `props` 传递数据给子组件，子组件通过调用父组件传来的函数传递数据给父组件，这两种方式是最常用的父子通信实现办法。

这种父子通信方式也就是典型的单向数据流，父组件通过 `props` 传递数据，子组件不能直接修改 `props`， 而是必须通过调用父组件函数的方式告知父组件修改数据。

### 兄弟组件通信

对于这种情况可以通过共同的父组件来管理状态和事件函数。比如说其中一个兄弟组件调用父组件传递过来的事件函数修改父组件中的状态，然后父组件将状态传递给另一个兄弟组件。

### 跨多层次组件通信

如果你使用 16.3 以上版本的话，对于这种情况可以使用 Context API。

```js
// 创建 Context，可以在开始就传入值
const StateContext = React.createContext()
class Parent extends React.Component {
  render () {
    return (
      // value 就是传入 Context 中的值
      <StateContext.Provider value='yiliang114'>
        <Child />
      </StateContext.Provider>
    )
  }
}
class Child extends React.Component {
  render () {
    return (
      <ThemeContext.Consumer>
        // 取出值
        {context => (
          name is { context }
        )}
      </ThemeContext.Consumer>
    );
  }
}
```

### 任意组件

这种方式可以通过 Redux 或者 Event Bus 解决，另外如果你不怕麻烦的话，可以使用这种方式解决上述所有的通信情况

### HOC 是什么？相比 mixins 有什么优点？

很多人看到高阶组件（HOC）这个概念就被吓到了，认为这东西很难，其实这东西概念真的很简单，我们先来看一个例子。

```
function add(a, b) {
    return a + b
}
```

现在如果我想给这个 `add` 函数添加一个输出结果的功能，那么你可能会考虑我直接使用 `console.log` 不就实现了么。说的没错，但是如果我们想做的更加优雅并且容易复用和扩展，我们可以这样去做：

```
function withLog (fn) {
    function wrapper(a, b) {
        const result = fn(a, b)
        console.log(result)
        return result
    }
    return wrapper
}
const withLogAdd = withLog(add)
withLogAdd(1, 2)
```

其实这个做法在函数式编程里称之为高阶函数，大家都知道 React 的思想中是存在函数式编程的，高阶组件和高阶函数就是同一个东西。我们实现一个函数，传入一个组件，然后在函数内部再实现一个函数去扩展传入的组件，最后返回一个新的组件，这就是高阶组件的概念，作用就是为了更好的复用代码。

其实 HOC 和 Vue 中的 mixins 作用是一致的，并且在早期 React 也是使用 mixins 的方式。但是在使用 class 的方式创建组件以后，mixins 的方式就不能使用了，并且其实 mixins 也是存在一些问题的，比如：

- 隐含了一些依赖，比如我在组件中写了某个 `state` 并且在 `mixin` 中使用了，就这存在了一个依赖关系。万一下次别人要移除它，就得去 `mixin` 中查找依赖
- 多个 `mixin` 中可能存在相同命名的函数，同时代码组件中也不能出现相同命名的函数，否则就是重写了，其实我一直觉得命名真的是一件麻烦事。。
- 雪球效应，虽然我一个组件还是使用着同一个 `mixin`，但是一个 `mixin` 会被多个组件使用，可能会存在需求使得 `mixin` 修改原本的函数或者新增更多的函数，这样可能就会产生一个维护成本

HOC 解决了这些问题，并且它们达成的效果也是一致的，同时也更加的政治正确（毕竟更加函数式了）。

### 何时使用 Component 还是 PureComponent？

PureComponent 通过 prop 和 state 的浅比较来实现 shouldComponentUpdate，某些情况下可以用 PureComponent 提升性能

所谓浅比较(shallowEqual)，即 react 源码中的一个函数，然后根据下面的方法进行是不是 PureComponent 的判断，帮我们做了本来应该我们在 shouldComponentUpdate 中做的事情

```js
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState);
}
```

```js
shouldComponentUpdate(nextProps, nextState) {
    return (nextState.person !== this.state.person);
}
```

**什么时候不该用？**

PureComponent 中的判断逻辑是浅比较，如果当状态更新时是一个引用对象内部的更新，那么这个时候是不适用的

#### 组件的异步数据加载

我不想在一开始挂载组件的时候就去异步操作（或者可以直接懒加载，那就可以在 constructor 中直接去加载异步数据。。），比如说 modal 的异步数据加载，最好是在 visable === true 的时候进行 ajax，否则 ajax 消耗的事件影响首屏体验。

### react hoc

HOC(全称 Higher-order component)是一种 React 的进阶使用方法，主要还是为了便于组件的复用。HOC 就是一个方法，获取一个组件，返回一个更高级的组件。

https://segmentfault.com/a/1190000008112017?_ea=1553893

### 如何在 React 中创建组件?

    有两种可行的方法来创建一个组件：

    **Function Components:** 这是创建组件最简单的方式。这些是纯 JavaScript 函数，接受 props 对象作为第一个参数并返回 React 元素：

        ```jsx
        function Greeting({ message }) {
          return <h1>{`Hello, ${message}`}</h1>
        }
        ```

    **Class Components:** 你还可以使用 ES6 类来定义组件。上面的函数组件若使用 ES6 的类可改写为：

        ```jsx
        class Greeting extends React.Component {
          render() {
            return <h1>{`Hello, ${this.props.message}`}</h1>
          }
        }
        ```

    通过以上任意方式创建的组件，可以这样使用：

    ```jsx
      <Greeting message="semlinker"/>
    ```

    在 React 内部对函数组件和类组件的处理方式是不一样的，如：

    ```js
      // 如果 Greeting 是一个函数
      const result = Greeting(props); // <p>Hello</p>

      // 如果 Greeting 是一个类
      const instance = new Greeting(props); // Greeting {}
      const result = instance.render(); // <p>Hello</p>
    ```

### 何时使用类组件和函数组件?

    如果组件需要使用**状态或生命周期方法**，那么使用类组件，否则使用函数组件。

### 什么是 Pure Components?

    `React.PureComponent` 与 `React.Component` 完全相同，只是它为你处理了 `shouldComponentUpdate()` 方法。当属性或状态发生变化时，PureComponent 将对属性和状态进行**浅比较**。另一方面，一般的组件不会将当前的属性和状态与新的属性和状态进行比较。因此，在默认情况下，每当调用 `shouldComponentUpdate` 时，默认返回 true，所以组件都将重新渲染。

### 什么是受控组件?

    在随后的用户输入中，能够控制表单中输入元素的组件被称为受控组件，即每个状态更改都有一个相关联的处理程序。

    例如，我们使用下面的 handleChange 函数将输入框的值转换成大写：

    ```js
    handleChange(event) {
      this.setState({value: event.target.value.toUpperCase()})
    }
    ```

### 什么是非受控组件?

    非受控组件是在内部存储其自身状态的组件，当需要时，可以使用 ref 查询 DOM 并查找其当前值。这有点像传统的 HTML。

    在下面的 UserProfile 组件中，我们通过 ref 引用 `name` 输入框：

    ```jsx
    class UserProfile extends React.Component {
      constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.input = React.createRef()
      }

      handleSubmit(event) {
        alert('A name was submitted: ' + this.input.current.value)
        event.preventDefault()
      }

      render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
              {'Name:'}
              <input type="text" ref={this.input} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        );
      }
    }
    ```

    在大多数情况下，建议使用受控组件来实现表单。

### 什么是无状态组件?

    如果行为独立于其状态，则它可以是无状态组件。你可以使用函数或类来创建无状态组件。但除非你需要在组件中使用生命周期钩子，否则你应该选择函数组件。无状态组件有很多好处： 它们易于编写，理解和测试，速度更快，而且你可以完全避免使用`this`关键字。

### 什么是有状态组件?

    如果组件的行为依赖于组件的*state*，那么它可以被称为有状态组件。这些*有状态组件*总是*类组件*，并且具有在`constructor`中初始化的状态。

    ```js
    class App extends Component {
      constructor(props) {
        super(props)
        this.state = { count: 0 }
      }

      render() {
        // ...
      }
    }
    ```

### createElement() 和 cloneElement() 方法有什么区别?

    JSX 元素将被转换为 `React.createElement()` 函数来创建 React 元素，这些对象将用于表示 UI 对象。而 `cloneElement` 用于克隆元素并传递新的属性。

### 推荐的组件命名方法是什么?

    建议通过引用命名组件，而不是使用 `displayName`。

    使用 `displayName` 命名组件:

    ```js
    export default React.createClass({
      displayName: 'TodoApp',
      // ...
    })
    ```

    推荐的方式：

    ```js
    export default class TodoApp extends React.Component {
      // ...
    }
    ```

### 在组件类中方法的推荐顺序是什么?

    从 *mounting* 到 *render stage* 阶段推荐的方法顺序：

    `static` 方法
    `constructor()`
    `getChildContext()`
    `componentWillMount()`
    `componentDidMount()`
    `componentWillReceiveProps()`
    `shouldComponentUpdate()`
    `componentWillUpdate()`
    `componentDidUpdate()`
    `componentWillUnmount()`
    点击处理程序或事件处理程序，如 `onClickSubmit()` 或 `onChangeDescription()`
    用于渲染的getter方法，如 `getSelectReason()` 或 `getFooterContent()`
    可选的渲染方法，如 `renderNavigation()` 或 `renderProfilePicture()`
    `render()`

### 什么是 switching 组件?

    switching 组件是渲染多个组件之一的组件。我们需要使用对象将 prop 映射到组件中。

    例如，以下的 switching 组件将基于 `page` 属性显示不同的页面：

    ```jsx
    import HomePage from './HomePage'
    import AboutPage from './AboutPage'
    import ServicesPage from './ServicesPage'
    import ContactPage from './ContactPage'

    const PAGES = {
      home: HomePage,
      about: AboutPage,
      services: ServicesPage,
      contact: ContactPage
    }

    const Page = (props) => {
      const Handler = PAGES[props.page] || ContactPage

      return <Handler {...props} />
    }

    // The keys of the PAGES object can be used in the prop types to catch dev-time errors.
    Page.propTypes = {
      page: PropTypes.oneOf(Object.keys(PAGES)).isRequired
    }
    ```

### 怎么阻止组件的渲染

在组件的 render 方法中返回 null 并不会影响触发组件的生命周期方法

### 受控组件(controlled component)

一个输入表单元素，它的值通过 React 的这种方式来控制，这样的元素就被称为"受控元素"。

在 HTML 中，类似 `<input>`, `<textarea>` 和 `<select>` 这样的表单元素会维护自身的状态，并基于用户的输入来更新。但在 React 中会有些不同，包含表单元素的组件将会在 state 中追踪输入的值。

### 高阶组件 HOC (higher order component)

高阶组件是一个以组件为参数并返回一个新组件的函数。

HOC 允许你重用代码、逻辑和引导抽象。最常见的可能是 Redux 的 connect 函数。除了简单分享工具库和简单的组合，HOC 最好的方式是共享 React 组件之间的行为。如果你发现你在不同的地方写了大量代码来做同一件事时，就应该考虑将代码重构为可重用的 HOC。

```js
function add(a, b) {
  return a + b;
}
```

现在如果我想给这个 add 函数添加一个输出结果的功能，那么你可能会考虑我直接使用 console.log 不就实现了么。说的没错，但是如果我们想做的更加优雅并且容易复用和扩展，我们可以这样去做：

```js
function withLog(fn) {
  function wrapper(a, b) {
    const result = fn(a, b);
    console.log(result);
    return result;
  }
  return wrapper;
}
const withLogAdd = withLog(add);
withLogAdd(1, 2);
```

这个做法在函数式编程里称之为高阶函数，大家都知道 React 的思想中是存在函数式编程的，高阶组件和高阶函数就是同一个东西。我们实现一个函数，传入一个组件，然后在函数内部再实现一个函数去扩展传入的组件，最后返回一个新的组件，这就是高阶组件的概念，作用就是为了更好的复用代码。

### createElement 与 cloneElement 的区别是什么

> createElement 函数是 JSX 编译之后使用的创建 React Element 的函数，而 cloneElement 则是用于复制某个元素并传入新的 Props

### react 组件的划分业务组件技术组件？

- 根据组件的职责通常把组件分为 UI 组件和容器组件。
- UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。
- 两者通过`React-Redux` 提供`connect`方法联系起来

### react 的渲染过程中，兄弟节点之间是怎么处理的？也就是 key 值不一样的时候。

通常我们输出节点的时候都是 map 一个数组然后返回一个 ReactNode，为了方便 react 内部进行优化，我们必须给每一个 reactNode 添加 key，这个 key prop 在设计值处不是给开发者用的，而是给 react 用的，大概的作用就是给每一个 reactNode 添加一个身份标识，方便 react 进行识别，在重渲染过程中，如果 key 一样，若组件属性有所变化，则 react 只更新组件对应的属性；没有变化则不更新，如果 key 不一样，则 react 先销毁该组件，然后重新创建该组件。

### react 拖拽组件实现

https://www.zhihu.com/question/60339629

### React 父组件调用子组件的方法

https://blog.csdn.net/baidu_38151187/article/details/80582416

### React 非父子组件函数调用？ 以及传值方式

### portals 的典型使用场景是什么?

     当父组件拥有 `overflow: hidden` 或含有影响堆叠上下文的属性（z-index、position、opacity 等样式），且需要脱离它的容器进行展示时，React portal 就非常有用。例如，对话框、全局消息通知、悬停卡和工具提示。

### 如何设置非受控组件的默认值?

     在 React 中，表单元素的属性值将覆盖其 DOM 中的值。对于非受控组件，你可能希望能够指定其初始值，但不会控制后续的更新。要处理这种情形，你可以指定一个 **defaultValue** 属性来取代 **value** 属性。

     ```js
     render() {
       return (
         <form onSubmit={this.handleSubmit}>
           <label>
             User Name:
             <input
               defaultValue="John"
               type="text"
               ref={this.input} />
           </label>
           <input type="submit" value="Submit" />
         </form>
       );
     }
     ```

     这同样适用于 `select` 和 `textArea` 输入框。但对于 `checkbox` 和 `radio` 控件，需要使用 **defaultChecked**。

### 在 Pure Component 中使用渲染属性会有什么问题?

     如果在渲染方法中创建函数，则会否定纯组件的用途。因为浅属性比较对于新属性总是返回 false，在这种情况下，每次渲染都将为渲染属性生成一个新值。你可以通过将渲染函数定义为实例方法来解决这个问题。

### 如何使用渲染属性创建 HOC?

     可以使用带有渲染属性的常规组件实现大多数高阶组件（HOC）。例如，如果希望使用 withMouse HOC 而不是 `<Mouse>` 组件，则你可以使用带有渲染属性的常规 `<Mouse>` 组件轻松创建一个 HOC 组件。

     ```js
     function withMouse(Component) {
       return class extends React.Component {
         render() {
           return (
             <Mouse render={mouse => (
               <Component {...this.props} mouse={mouse} />
             )}/>
           );
         }
       }
     }
     ```

### 如何有条件地渲染组件?

    在某些情况下，你希望根据某些状态渲染不同的组件。 JSX 不会渲染 `false` 或 `undefined`，因此你可以使用 `&&` 运算符，在某个条件为 true 时，渲染组件中指定的内容。

    ```jsx
    const MyComponent = ({ name, address }) => (
      <div>
        <h2>{name}</h2>
        {address &&
          <p>{address}</p>
        }
      </div>
    )
    ```

    如果你需要一个 `if-else` 条件，那么使用三元运算符：

    ```jsx
    const MyComponent = ({ name, address }) => (
      <div>
        <h2>{name}</h2>
        {address
          ? <p>{address}</p>
          : <p>{'Address is not available'}</p>
        }
      </div>
    )
    ```

### 如何 memoize（记忆）组件?

    有可用于函数组件的 memoize 库。例如 `moize` 库可以将组件存储在另一个组件中。

    ```jsx
    import moize from 'moize'
    import Component from './components/Component' // this module exports a non-memoized component

    const MemoizedFoo = moize.react(Component)

    const Consumer = () => {
      <div>
        {'I will memoize the following entry:'}
        <MemoizedFoo/>
      </div>
    }
    ```

### React Mixins 是什么?

Mixins\* 是一种完全分离组件通用功能的方法。 Mixins 不应该被继续使用，可以用高阶组件或装饰器来替换。

最常用的 mixins 是 `PureRenderMixin`。当 props 和状态与之前的 props 和状态相等时，你可能在某些组件中使用它来防止不必要的重新渲染：

```js
const PureRenderMixin = require('react-addons-pure-render-mixin')
const Button = React.createClass({
  mixins: [PureRenderMixin],
  // ...
})
<!-- TODO: mixins are deprecated -->
```

### 为什么组件名称应该以大写字母开头?

    如果使用 JSX 渲染组件，则该组件的名称必须以大写字母开头，否则 React 将会抛出无法识别标签的错误。这种约定是因为只有 HTML 元素和 SVG 标签可以以小写字母开头。

    定义组件类的时候，你可以以小写字母开头，但在导入时应该使用大写字母。

    ```jsx
    class myComponent extends Component {
      render() {
        return <div />
      }
    }

    export default myComponent
    ```

    当在另一个文件导入时，应该以大写字母开头：

    ```jsx
    import MyComponent from './MyComponent'
    ```

### 为什么不需要使用继承?

     在 React 中，建议使用组合而不是继承来重用组件之间的代码。Props 和 composition 都为你提供了以一种明确和安全的方式自定义组件外观和行为所需的灵活性。但是，如果你希望在组件之间复用非 UI 功能，建议将其提取到单独的 JavaScript 模块中。之后的组件导入它并使用该函数、对象或类，而不需扩展它。

### 我可以在 React 应用程序中可以使用 web components 么?

     是的，你可以在 React 应用程序中使用 Web Components。尽管许多开发人员不会使用这种组合方式，但如果你使用的是使用 Web Components 编写的第三方 UI 组件，则可能需要这种组合。例如，让我们使用 Vaadin 提供的 Web Components 日期选择器组件：

     ```js
     import React, { Component } from 'react';
     import './App.css';
     import '@vaadin/vaadin-date-picker';

     class App extends Component {
       render() {
         return (
           <div className="App">
             <vaadin-date-picker label="When were you born?"></vaadin-date-picker>
           </div>
         );
       }
     }

     export default App;
     ```

### 什么是动态导入?

     动态导入语法是 ECMAScript 提案，目前不属于语言标准的一部分。它有望在不久的将来被采纳。在你的应用程序中，你可以使用动态导入来实现代码拆分。让我们举一个加法的例子：

     **Normal Import**
     ```js
     import { add } from './math';
     console.log(add(10, 20));
     ```

     **Dynamic Import**
     ```js
     import("./math").then(math => {
       console.log(math.add(10, 20));
     });
     ```

### 什么是 loadable 组件?

     如果你想要在服务端渲染的应用程序中实现代码拆分，建议使用 Loadable 组件，因为 React.lazy 和 Suspense 还不可用于服务器端渲染。Loadable 允许你将动态导入的组件作为常规的组件进行渲染。让我们举一个例子：

     ```js
     import loadable from '@loadable/component'

     const OtherComponent = loadable(() => import('./OtherComponent'))

     function MyComponent() {
       return (
         <div>
           <OtherComponent />
         </div>
       )
     }
     ```

     现在，其他组件将以单独的包进行加载。

### 什么是 suspense 组件?

     如果父组件在渲染时包含 dynamic import 的模块尚未加载完成，在此加载过程中，你必须使用一个 loading 指示器显示后备内容。这可以使用 **Suspense** 组件来实现。例如，下面的代码使用 Suspense 组件：

     ```js
     const OtherComponent = React.lazy(() => import('./OtherComponent'));

     function MyComponent() {
       return (
         <div>
           <Suspense fallback={<div>Loading...</div>}>
             <OtherComponent />
           </Suspense>
         </div>
       );
     }
     ```

     正如上面的代码中所展示的，懒加载的组件被包装在 Suspense 组件中。

### 什么是基于路由的代码拆分?

     进行代码拆分的最佳位置之一是路由。整个页面将立即重新渲染，因此用户不太可能同时与页面中的其他元素进行交互。因此，用户体验不会受到干扰。让我们以基于路由的网站为例，使用像 React Router 和 React.lazy 这样的库：

     ```js
     import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
     import React, { Suspense, lazy } from 'react';

     const Home = lazy(() => import('./routes/Home'));
     const About = lazy(() => import('./routes/About'));

     const App = () => (
       <Router>
         <Suspense fallback={<div>Loading...</div>}>
           <Switch>
             <Route exact path="/" component={Home}/>
             <Route path="/about" component={About}/>
           </Switch>
         </Suspense>
       </Router>
     );
     ```

     在上面的代码中，代码拆分将发生在每个路由层级。

### 什么是 Keyed Fragments ?

     使用显式 <React.Fragment> 语法声明的片段可能具有 key 。一般用例是将集合映射到片段数组，如下所示，

     ```js
     function Glossary(props) {
       return (
         <dl>
           {props.items.map(item => (
             // Without the `key`, React will fire a key warning
             <React.Fragment key={item.id}>
               <dt>{item.term}</dt>
               <dd>{item.description}</dd>
             </React.Fragment>
           ))}
         </dl>
       );
     }
     ```

     **注意：** 键是唯一可以传递给 Fragment 的属性。将来，可能会支持其他属性，例如事件处理程序。

### 如何每秒更新一个组件?

     你需要使用 `setInterval()` 来触发更改，但也需要在组件卸载时清除计时器，以防止错误和内存泄漏。

     ```js
     componentDidMount() {
       this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000)
     }

     componentWillUnmount() {
       clearInterval(this.interval)
     }
     ```

### 如何使用 React 和 ES6 导入和导出组件?

     导出组件时，你应该使用默认导出：

     ```jsx
     import React from 'react'
     import User from 'user'

     export default class MyProfile extends React.Component {
       render(){
         return (
           <User type="customer">
             //...
           </User>
         )
       }
     }
     ```

     使用 export 说明符，MyProfile 将成为成员并导出到此模块，此外在其他组件中你无需指定名称就可以导入相同的内容。

### 为什么 React 组件名称必须以大写字母开头?

     在 JSX 中，小写标签被认为是 HTML 标签。但是，含有 `.` 的大写和小写标签名却不是。

     `<component />` 将被转换为 `React.createElement('component')` (i.e, HTML 标签)
     `<obj.component />` 将被转换为 `React.createElement(obj.component)`
     `<Component />` 将被转换为 `React.createElement(Component)`

### 为什么组件的构造函数只被调用一次?

     React 协调算法假设如果自定义组件出现在后续渲染的相同位置，则它与之前的组件相同，因此重用前一个实例而不是创建新实例。

### 如何选择哪种方式创建组件

由于 React 团队已经声明 React.createClass 最终会被 React.Component 的类形式所取代。但是在找到 Mixins 替代方案之前是不会废弃掉 React.createClass 形式。所以：

> 能用 React.Component 创建的组件的就尽量不用 React.createClass 形式创建组件

除此之外，创建组件的形式选择还应该根据下面来决定：

> 1、只要有可能，尽量使用无状态组件创建形式。

> 2、否则（如需要 state、生命周期方法等），使用`React.Component`这种 es6 形式创建组件

### react 如何区别 component 和 dom

当用 ReactDOM.render 创造一个 dom tree 的时候，一般有三种方式:
(1) 第一个参数传 JSX 语法糖

```js
ReactDOM.render(<button color="blue">OK</button>, document.getElementById('root'));
```

React.createElement 会一个虚拟 dom 元素。

```js
ReactDOM.render(
    React.createElement({
        type：'botton',
        porps:{
            color:'blue',
            children:'OK!'
        }
    }),
    document.getElementById('root')
);
```

虚拟 dom 是一个 obj：具有一个 type 属性代表当前的节点类型，还有节点的属性 props
(2) 函数声明

```js
function RenderButton() {
  return <button color="blue">OK</button>;
}
ReactDOM.render(<RenderButton />, document.getElementById('root'));
```

类声明

```js
class DangerButton extends Component {
  render() {
    return <button color="blue">NOT OK</button>;
  }
}
ReactDOM.render(<DangerButton />, document.getElementById('root'));
```

如果我们组合三种方法创建一个节点：

```js
const DeleteAccount = () => {
  <div>
    <p>Are you sure?</p>
    <DangerButton>Yep</DangerButton>
    <botton color="blue">Cancel</botton>
  </div>;
};
```

React.createElement 会把这个 JSX 转换为如下的虚拟 DOM:

```js
const DeleteAccount = ()=>{
    type:'div',
    porps:{
        children:[{
            type:'p',
            props:{
                children:'Are you sure?'
            }
        },{
            type:'DangerButton',
            props:{
                children:'Yep'
            }
        },{
            type: 'botton',
            props: {
                color: 'blue',
                children: 'Cancel'
            }
        }]
    }
}
```

当 React 碰到 type 是 function|class 时，它就知道这是个组件了

### react 组件的通信

父子组件通信
传递 props
使用 context
子组件向父组件通信
利用回调函数
利用自定义事件机制
平级组件通信
各种数据流管理工具

### a 组件在 b 组件内，c 组件在 a 组件内，如何让他渲染出来，a 组件和 c 组件同级

### 实现组件有哪些方式？

React 推出后，出于不同的原因先后出现三种定义 react 组件的方式，殊途同归；具体的三种方式：

> 1.函数式定义的无状态组件

> 2.es5 原生方式 React.createClass 定义的组件

> 3.es6 形式的 extends React.Component 定义的组件

虽然有三种方式可以定义 react 的组件，那么这三种定义组件方式有什么不同呢？或者说为什么会出现对应的定义方式呢？下面就简单介绍一下。

### 组件不会被实例化，整体渲染性能得到提升

因为组件被精简成一个 render 方法的函数来实现的，由于是无状态组件，所以无状态组件就不会在有组件实例化的过程，无实例化过程也就不需要分配多余的内存，从而性能得到一定的提升。

### 组件不能访问 this 对象

无状态组件由于没有实例化过程，所以无法访问组件 this 中的对象，例如：this.ref、this.state 等均不能访问。若想访问就不能使用这种形式来创建组件
