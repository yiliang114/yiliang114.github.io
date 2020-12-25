---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### constructor 和 getInitialState 有什么区别?

当使用 ES6 类时，你应该在构造函数中初始化状态，而当你使用 `React.createClass()` 时，就需要使用 `getInitialState()` 方法。

使用 ES6 类:

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* initial state */
    };
  }
}
```

使用 `React.createClass()`:

```js
const MyComponent = React.createClass({
  getInitialState() {
    return {
      /* initial state */
    };
  },
});
```

**注意：** 在 React v16 中 `React.createClass()` 已被弃用和删除，请改用普通的 JavaScript 类。

### 在 React 中如何使用装饰器?

你可以装饰你的类组件，这与将组件传递到函数中是一样的。 装饰器是修改组件功能灵活且易读的方式。

```jsx
@setTitle('Profile')
class Profile extends React.Component {
  //....
}

/*
  title is a string that will be set as a document title
  WrappedComponent is what our decorator will receive when
  put directly above a component class as seen in the example above
*/
const setTitle = title => WrappedComponent => {
  return class extends React.Component {
    componentDidMount() {
      document.title = title;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};
```

### 在使用 ES6 类的 React 中 `super()` 和 `super(props)` 有什么区别?

当你想要在 `constructor()` 函数中访问 `this.props`，你需要将 props 传递给 `super()` 方法。

使用 `super(props)`:

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props); // { name: 'John', ... }
  }
}
```

使用 `super()`:

```js
class MyComponent extends React.Component {
  constructor(props) {
    super();
    console.log(this.props); // undefined
  }
}
```

在 `constructor()` 函数之外，访问 `this.props` 属性会显示相同的值。

阅读资源：

[为什么我们要写 super(props)？](https://overreacted.io/zh-hans/why-do-we-write-super-props/)

### 如何在 attribute 引号中访问 props 属性?

React (或 JSX) 不支持属性值内的变量插值。下面的形式将不起作用：

```jsx
<img className="image" src="images/{this.props.image}" />
```

但你可以将 JS 表达式作为属性值放在大括号内。所以下面的表达式是有效的：

```jsx
<img className="image" src={'images/' + this.props.image} />
```

使用模板字符串也是可以的：

```jsx
<img className="image" src={`images/${this.props.image}`} />
```

### 什么是 React proptype 数组?

如果你要规范具有特定对象格式的数组的属性，请使用 `React.PropTypes.shape()` 作为 `React.PropTypes.arrayOf()` 的参数。

```js
ReactComponent.propTypes = {
  arrayWithShape: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      color: React.PropTypes.string.isRequired,
      fontSize: React.PropTypes.number.isRequired,
    }),
  ).isRequired,
};
```

### 如何在没有 ES6 的情况下创建 React 类组件

如果你不使用 ES6，那么你可能需要使用 create-react-class 模块。对于默认属性，你需要在传递对象上定义 getDefaultProps() 函数。而对于初始状态，必须提供返回初始状态的单独 getInitialState 方法。

```js
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Jhohn',
    };
  },
  getInitialState: function() {
    return { message: this.props.message };
  },
  handleClick: function() {
    console.log(this.state.message);
  },
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  },
});
```

**注意：** 如果使用 createReactClass，则所有方法都会自动绑定。也就是说，你不需要在事件处理程序的构造函数中使用 .bind(this)。

### 是否可以在没有 JSX 的情况下使用 React?

是的，使用 React 不强制使用 JSX。实际上，当你不想在构建环境中配置编译环境时，这是很方便的。每个 JSX 元素只是调用 React.createElement(component, props, ...children) 的语法糖。例如，让我们来看一下使用 JSX 的 greeting 示例：

```jsx
class Greeting extends React.Component {
  render() {
    return <div>Hello {this.props.message}</div>;
  }
}

ReactDOM.render(<Greeting message="World" />, document.getElementById('root'));
```

你可以在没有 JSX 的情况下编写相同的功能，如下所示：

```js
class Greeting extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.message}`);
  }
}

ReactDOM.render(React.createElement(Greeting, { message: 'World' }, null), document.getElementById('root'));
```

### 在 React 中 statics 对象是否能与 ES6 类一起使用?

不行，`statics` 仅适用于 `React.createClass()`：

```js
someComponent = React.createClass({
  statics: {
    someMethod: function() {
      // ..
    },
  },
});
```

但是你可以在 ES6+ 的类中编写静态代码，如下所示：

```js
class Component extends React.Component {
  static propTypes = {
    // ...
  };

  static someMethod() {
    // ...
  }
}
```

### React 是如何为一个属性声明不同的类型?

你可以使用 `PropTypes` 中的 `oneOfType()` 方法。

例如，如下所示 size 的属性值可以是 `string` 或 `number` 类型。

```js
Component.PropTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
```

### 我可以导入一个 SVG 文件作为 React 组件么?

你可以直接将 SVG 作为组件导入，而不是将其作为文件加载。此功能仅在 `react-scripts@2.0.0` 及更高版本中可用。

```jsx
import { ReactComponent as Logo } from './logo.svg';

const App = () => (
  <div>
    {/* Logo is an actual react component */}
    <Logo />
  </div>
);
```

### 为什么不建议使用内联引用回调或函数?

如果将 ref 回调定义为内联函数，则在更新期间它将会被调用两次。首先使用 null 值，然后再使用 DOM 元素。这是因为每次渲染的时候都会创建一个新的函数实例，因此 React 必须清除旧的 ref 并设置新的 ref。

```jsx
class UserForm extends Component {
  handleSubmit = () => {
    console.log('Input Value is: ', this.input.value);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref={input => (this.input = input)} /> // Access DOM input in handle submit
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

但我们期望的是当组件挂载时，ref 回调只会被调用一次。一个快速修复的方法是使用 ES7 类属性语法定义函数。

```jsx
class UserForm extends Component {
  handleSubmit = () => {
    console.log('Input Value is: ', this.input.value);
  };

  setSearchInput = input => {
    this.input = input;
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref={this.setSearchInput} /> // Access DOM input in handle submit
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

### 在 React 中什么是渲染劫持?

渲染劫持的概念是控制一个组件将从另一个组件输出什么的能力。实际上，这意味着你可以通过将组件包装成高阶组件来装饰组件。通过包装，你可以注入额外的属性或产生其他变化，这可能会导致渲染逻辑的更改。实际上它不支持劫持，但通过使用 HOC，你可以使组件以不同的方式工作。

### React.createClass

```js
`React.createClass`是react刚开始推荐的创建组件的方式，这是ES5的原生的JavaScript来实现的React组件，其形式如下：
var InputControlES5 = React.createClass({
propTypes: {//定义传入props中的属性各种类型
    initialValue: React.PropTypes.string
},
defaultProps: { //组件默认的props对象
    initialValue: ''
},
// 设置 initial state
getInitialState: function() {//组件相关的状态对象
    return {
        text: this.props.initialValue || 'placeholder'
    };
},
handleChange: function(event) {
    this.setState({ //this represents react component instance
        text: event.target.value
    });
},
render: function() {
    return (
        <div>
            Type something:
            <input onChange={this.handleChange} value={this.state.text} />
        </div>
    );
}
});
InputControlES6.propTypes = {
initialValue: React.PropTypes.string
};
InputControlES6.defaultProps = {
initialValue: ''
};
```

与无状态组件相比，React.createClass 和后面要描述的 React.Component 都是创建有状态的组件，这些组件是要被实例化的，并且可以访问组件的生命周期方法。但是随着 React 的发展，React.createClass 形式自身的问题暴露出来：

React.createClass 会自绑定函数方法（不像 React.Component 只绑定需要关心的函数）导致不必要的性能开销，增加代码过时的可能性。
React.createClass 的 mixins 不够自然、直观；React.Component 形式非常适合高阶组件（Higher Order Components–HOC）,它以更直观的形式展示了比 mixins 更强大的功能，并且 HOC 是纯净的 JavaScript，不用担心他们会被废弃。HOC 可以参考无状态组件(Stateless Component) 与高阶组件。

### React.Component

React.Component 是以 ES6 的形式来创建 react 的组件的，是 React 目前极为推荐的创建有状态组件的方式，最终会取代 React.createClass 形式；相对于 React.createClass 可以更好实现代码复用。将上面 React.createClass 的形式改为 React.Component 形式如下：

```js
class InputControlES6 extends React.Component {
  constructor(props) {
    super(props);
    // 设置 initial state
    this.state = {
      text: props.initialValue || 'placeholder',
    };
    // ES6 类中函数必须手动绑定
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
        Type something:
        <input onChange={this.handleChange} value={this.state.text} />
      </div>
    );
  }
}
InputControlES6.propTypes = {
  initialValue: React.PropTypes.string,
};
InputControlES6.defaultProps = {
  initialValue: '',
};
```

### React.createClass 与 React.Component 区别

> 根据上面展示代码中二者定义组件的语法格式不同之外，二者还有很多重要的区别，下面就描述一下二者的主要区别。

#### 函数 this 自绑定

React.createClass 创建的组件，其每一个成员函数的 this 都有 React 自动绑定，任何时候使用，直接使用 this.method 即可，函数中的 this 会被正确设置。

```js
const Contacts = React.createClass({
  handleClick() {
    console.log(this); // React Component instance
  },
  render() {
    return <div onClick={this.handleClick}></div>;
  },
});
```

React.Component 创建的组件，其成员函数不会自动绑定 this，需要开发者手动绑定，否则 this 不能获取当前组件实例对象。

```js
class Contacts extends React.Component {
  constructor(props) {
super(props);
  }
  handleClick() {
console.log(this); // null
  }
  render() {
return (
  <div onClick={this.handleClick}></div>
);
  }
```

当然，React.Component 有三种手动绑定方法：可以在构造函数中完成绑定，也可以在调用时使用 method.bind(this)来完成绑定，还可以使用 arrow function 来绑定。拿上例的 handleClick 函数来说，其绑定可以有：

```js
  constructor(props) {
 super(props);
 this.handleClick = this.handleClick.bind(this); //构造函数中绑定
}
  <div onClick={this.handleClick.bind(this)}></div> //使用bind来绑定
  <div onClick={()=>this.handleClick()}></div> //使用arrow function来绑定
```

#### 组件属性类型 propTypes 及其默认 props 属性 defaultProps 配置不同

> React.createClass 在创建组件时，有关组件 props 的属性类型及组件默认的属性会作为组件实例的属性来配置，其中 defaultProps 是使用 getDefaultProps 的方法来获取默认组件属性的

```js
const TodoItem = React.createClass({
propTypes: { // as an object
    name: React.PropTypes.string
},
getDefaultProps(){   // return a object
    return {
        name: ''
    }
}
render(){
    return <div></div>
}
})
```

React.Component 在创建组件时配置这两个对应信息时，他们是作为组件类的属性，不是组件实例的属性，也就是所谓的类的静态属性来配置的。对应上面配置如下：

```js
class TodoItem extends React.Component {
static propTypes = {//类的静态属性
    name: React.PropTypes.string
};
static defaultProps = {//类的静态属性
    name: ''
};
...
}
```

#### 组件初始状态 state 的配置不同

```js
var SomeMixin = {
  doSomething() {},
};
const Contacts = React.createClass({
  mixins: [SomeMixin],
  handleClick() {
    this.doSomething(); // use mixin
  },
  render() {
    return <div onClick={this.handleClick}></div>;
  },
});
```

但是遗憾的是 React.Component 这种形式并不支持 Mixins，至今 React 团队还没有给出一个该形式下的官方解决方案；但是 React 开发者社区提供一个全新的方式来取代 Mixins,那就是 Higher-Order Components

### 怎么看待现在 react 不推荐使用 class 组件，而使用函数式组件了？

https://www.zhihu.com/question/343314784
