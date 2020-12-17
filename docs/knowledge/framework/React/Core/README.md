---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 使用 React 有何优点

- 只需查看 `render` 函数就会很容易知道一个组件是如何被渲染的
- JSX 的引入，使得组件的代码更加可读，也更容易看懂组件的布局，或者组件之间是如何互相引用的
- 支持服务端渲染，这可以改进 SEO 和性能
- 易于测试
- React 只关注 View 层，所以可以和其它任何框架(如 Backbone.js, Angular.js)一起使用

### React 的工作原理

React 会创建一个虚拟 DOM(virtual DOM)。当一个组件中的状态改变时，React 首先会通过 "diffing" 算法来标记虚拟 DOM 中的改变，第二步是调节(reconciliation)，会用 diff 的结果来更新 DOM。

### React 的工作原理

React 会创建一个虚拟 DOM(virtual DOM)。当一个组件中的状态改变时，React 首先会通过 "diffing" 算法来标记虚拟 DOM 中的改变，第二步是调节(reconciliation)，会用 diff 的结果来更新 DOM。

### 使用 React 有何优点

- JSX 的引入，使得组件的代码更加可读，也更容易看懂组件的布局，或者组件之间是如何互相引用的
- 支持服务端渲染，可改进 SEO 和性能
- 易于测试
- React 只关注 View 层，所以可以和其它任何框架(如 Backbone.js, Angular.js)一起使用

## React 属性与事件

### State 属性

state 对于模块属于自身属性。

react 的局部刷新提现在，只要组件的 state 的值发生了改变，组件的虚拟 DOM 就会发生改变，进而反应到真实 DOM 上刷新，并且 react 页面刷新，是 react 经过虚拟 DOM 经过 Diff 运算之后只会刷新需要更改的部分，而不会刷新整个页面。

**浏览器中 F12 console 中的 Rendering 标签中选择`Paint Flashing`， 页面中刷新的部分会高亮。**

### Props 属性

props 对于模块属于外来属性。

根据传入值的不同展示不同的内容。

### 事件与数据的双向绑定

点击事件： onClick={this.xxx.bind(this)}

**父子间通信：**子页面数据的更改，立即反馈到父组件上。

子组件向父组件传递数据只能通过事件的形式，父组件传一个函数到子组件的 props，通过这个函数获取到子组件传出的值。

```
 // 父组件
handleFunc(event) {
  this.setState({age: event.target.value})
}
<child  handleFunc={this.handleFunc.bind(this)}/>

// 子组件
<input type="text" onChange={this.props.handleFunc}
```

**bind 传参**：

```
this.changeInfo.bind(this,a,b,c)

changeInfo(a,b,c) { ... }
```

this 后面的参数都作为函数的参数被调用。这里需要知道`bind`与`apply`，以及`call`的区别。

为什么这里 input 使用 onChange 事件，而不用 onBlur 事件？？？

### 可复用组件

父子组件传参的时候属性验证:

```
// 对象定义完了之后,强制约束props的类型和 是否必须
BodyIndex.propTypes = {
  userid: React.PropTypes.number.isRequired,
  url:React.PropTypes.string.isRequired,
  text: React.PropTypes.string
}

// 父组件未传props，子组件默认值
const defaultProps = {
  username: '默认值'
}
BodyIndex.defaultProps = defaultProps
```

父组件传给子组件的 props 如果继续需要传递给孙子组件：

```
// 将父组件的属性全部传递给孙子组件
<bodyChild {...this.props} />
// 子组件额外再传递props给孙子组件
<bodyChild {...this.props} id={123} />
```

### 组件的 refs

React 虽然能够直接通过组件中的 state 的更改而改变组件的 UI 显示，但是不可避免地，如果在 React 中需要操作 dom 的话，有两种方式：

1. 为 dom 节点声明 id 值，通过 getElementById 以及 ReactDOM.findDOMNode 方法获取到真实的 DOM 节点。

   ```
   var mySubmitButton = document.getElementById('mySubmitButton')
   ReactDOM.findDOMNode(mySubmitButton).style.color = 'red'
   ```

2. 为 dom 节点声明 ref 值, 通过 refs 获取到 DOM 节点：

   ```
   <input ref="mySubmitButton" />
   // mySubmitButton 为 ref值
   console.log(this.refs.mySubmitButton)
   this.refs.mySubmitButton.style.color = 'red'
   ```

Refs 是访问到组件内部 DOM 节点唯一可靠的方法。Refs 会自动销毁对子组件的引用。

**不要在 render 或者 render 之前对 Refs 进行调用。**因为整个结构还没有生成好。

不要滥用 Refs，只有在 state 改变解决不了问题的时候才使用，避免性能问题。

### 独立组件间共享 Mixins

在多个组件间共用功能，共享代码。

比如有一个 log 方法，每一个组件都希望调用，避免每一个组件都写一遍。

```
const MixinLog = {
  log() {
    console.log('log')
  }
}

export default MixinLog
```

在 ES6 中使用 Mixins 需要`react-mixin`组件的支持。

```
cnpm -i --save react-mixin

// 引用
import ReactMixin from 'react-mixin'
import MixinLog from './mixins'

// 注册，类似于PropTypes的使用
ReactMixin(BodyIndex.prototype, MixinLog)

// 使用mixins.js中的log方法
MixinLog.log()
```

Mixins 的一个好处是，**mixins 对象可以和页面类似有自身的生命周期**：

```
const MixinLog = {
  componentDidMount() {
	console.log('componentDidMount')
  },
  log() {
  	console.log('log')
  }
}

export default MixinLog
```

比如可以把一些获取项目公用的默认属性，可以写到 Mixins 中。

## React 样式

### 内联样式

用 js 来写 css 样式，使用驼峰命名，值都需要引号。

```
render() {
  const styleComponentHeader = {
    header: {
      backgroundColor: "#333",
      color: "#FFF",
      paddingBottom: "15px"
    }
  }
  return (
  	<header style={styleComponentHeader.header}>
  		<h1>这是头部</h1>
  	</header>
  )
}

// 这样的方式跟ReactNative写CSS的方式很像，页面中被渲染出来时，这种方式被编译为内联样式。
```

**局限：**比如 hover 一些伪类不可以使用。

webpack 热加载不会监听 html 文件。

### 内联样式中的表达式

通过 state 属性的改变来改变 **css 即时样式**

```
  const styleComponentHeader = {
    header: {
      backgroundColor: "#333",
      color: "#FFF",
      paddingBottom: {this.state.minHeader} ? "8px" ： "15px"
    }
  }
```

### CSS 模块化

保证每个组件中样式不影响其他组件，类似于 vue 中的 scoped 声明。

需要安装两个插件:

- babel-plugin-react-html-attrs 安装这个插件之后可以把 className 写成 class
- style-loader
- css-loader

安装 style-loader 和 css-loader 之后需要在 webpack 配置文件中声明编译 css 的规则：

```
module: {
  loaders: [
    {
      ...
      // 处理js jsx
    },
    // 下面是添加css的loader，就是css模块化的配置方法。
    {
      test: /\.css$/,
      // 生成css链的规则
      loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]'
    }
  ]
}
```

jsx 中导入 css： `var footerCss = require('../footer.css')`

全局引用 css: `import '../app.css'` 这样就行了。

inspect 之后发现模块化的 css 被编译之后类名会根据 loader 中定义的方式来命名，这样就不会全局污染。

使用：`<footer className={footerCss.miniFooter}>`

还有两个参数能够灵活控制 css 的作用域：

- `:local(.normal){color: green;}`
- `:global(.normal){color: green;}`

### JSX 样式与 CSS 的互转

[CSS to React](https://staxmanade.com/CssToReact/)

### UI 框架

- [material-ui](http://www.material-ui.com/)
- [ant design](https://ant.design/index-cn)

### Ant Design

按需加载。

webpack 的配置需要更改一下，不需要 base64 形式的 css 名：

```
// 这是使用antd 的css 配置
{
  test: /\.css$/,
  loader: 'style-loader!css-loader'
}
```

# React

1. react 什么时候更新？ 父组件对子组件的影响？
2. PureComponent 的实际用处，怎么跟预期的不一样？
3. react 和 react-dom 的区别？
4. this.props.children 是什么作用？

   this.props.children 就是组件内嵌套的元素。

   ```
   class Father extends React.Component {
     render () {
       return (
         <div>
           {/* ... */}
           <Child author="HUnter">
             <h1>hello world</h1>
           </Child>
         </div>
       )
     }
   }
   class Child extends React.Component {
     render () {
       return (
         <div>
           <p>{this.props.author}</p>
           {this.props.children}
           {/* 相当于<h1>hello world</h1> */}
         </div>
       )
     }
   }
   ```

   ​

   ​

5. react 组件的三种创建方式
6. state 声明的位置问题，有什么区别
7. 父子组件之间通信，非父子组件之间如何数据交互（event，emitter·）？
8. 为什么要使用 immutablejs？
9. 什么时候要写 shoudComponentUpdate 来优化性能？不写的话，使用 immutable 之后默认只要 state 和 props 一小部分更新就会重新渲染？
10. 组件什么时候卸载？ 调用 unMounted 构造函数？什么时候又会重新创建？
11. 其他生命周期函数的执行时机在什么时候？针对每一个生命周期函数，一般会做什么事情，比如说在 componentDidMount 中 拉取 data
12. react 的 diff 算法怎么样的

### 我现在有一个 button，要用 react 在上面绑定点击事件，要怎么做？

```
class Demo {
  render() {
    return <button onClick={(e) => {
      alert('我点击了按钮')
    }}>
      按钮
    </button>
  }
}
```

### 你觉得你这样设置点击事件会有什么问题吗？

由于 onClick 使用的是匿名函数，所有每次重渲染的时候，会把该 onClick 当做一个新的 prop 来处理，会将内部缓存的 onClick 事件进行重新赋值，所以相对直接使用函数来说，可能有一点的性能下降（个人认为）。

修改

```
class Demo {

  onClick = (e) => {
    alert('我点击了按钮')
  }

  render() {
    return <button onClick={this.onClick}>
      按钮
    </button>
  }
}
```

当然你在内部声明的不是箭头函数，然后你可能需要在设置 onClick 的时候使用 bind 绑定上下文，这样的效果和先前的使用匿名函数差不多，因为 bind 会返回新的函数，也会被 react 认为是一个新的 prop。

### react 最佳实践

- 不考虑使用状态管理工具的话，可以在 componentDidMount 或者 componentDidUpdate 中去执行 ajax 获取数据，但是这样代码臃肿，结构混乱，性能降低，最好是将异步的请求数据交给 redux，ajax 操作都放到 action 中是最好的。
- 生命周期中逻辑太多不好，想办法放一部分到 rende 函数中，不过需要注意的是，render 函数中逻辑过多也会增加 re-render 时的计算时间。
- this.state = {} 不要有计算，比如 obj.name + “sss”之类的。
- 少用 state，多用 props，多用无状态组件（没有生命周期函数，没有 state？）
- 每一个 react 组件记得都需要 PropTypes 来规范，无状态组件的 PropTypes 规范也是需要的。
- 能用三元判断符，就不用 If ，直接放在 render()里
- 合理运用 context
- 使用 immutable data，是一种在创建之后就不可修改的对象。不可变对象可以让我们免于痛楚，并通过引用级别的比对检查来，改善渲染性能。 比如说在 shouldComponentUpdate.
- 代码分割，惰性加载
- 使用高阶组件 代理 mixins， 高阶组件 本质上来说，你可以由原始组件创造一个新的组件并且扩展它的行为。你可以在多种情况下使用它，比如授权：requireAuth({ role: 'admin' })(MyComponent)
- 使用 pureRender 优化可以减少重复加载的浪费，考虑好 shouldComponentUpdate 的设计。
- **保持数据扁平化：**API 经常会返回嵌套资源。这在 Flux 或基于 Redux 的架构中处理起来会非常困难。我们推荐使用 normalizr 之类的库将数据进行扁平化处理。
- 测试，redux 测试
- 组件级别的热加载。关于如何搭建热重载，可以参考 react-transform-boilerplate
- 代码规范，eslint
- 1. 能做成组件就尽量做成组件，细分化，do one thing and do it well；还能复用‘
  2. 基于第一点，只传入必要的 props, 再使用 immutablejs 或者 react.addons.update 来实现不可变数据结构，再结合 React.addons.PureRenderMixin 来减少 reRender
  3. 在 shouldComponentUpdate 中优化组件减少 reRender
  4. context 虽然没有官方文档，但还是很好用的。(不会的同学可以自己 google react context)
  5. 能不做 dom 操作就尽量不要，始终让 UI 能够基于 State 还原，尽量在 render()中把该做的做好
  6. propTypes, defaultProps 不要懒的去写，别人通过你的 propTypes 很容易理解组件，也容易 debug
  7. 在 store 和 action 中不要有 dom 操作或者访问 window.属性，让 store 和 action 中的逻辑只与数据打交道，好处：测试，服务器端渲染
  8. 推荐使用 ES6，arrow function"=>"和 destructuring {...this.props} var {a,b}=this.props 很好用
  9. npm 的 debug 包前后端公用很方便，开发的时候把组件渲染的每个步骤和动作都 log 下来，很容易在开发的时候就发现问题
  10. 使用 es6 时，事件 handler 尽量不要用这样偷懒的写法 onClick={e=>(this.doSomething("val"))},如果传递这个 function 给子组件，子组件就没法用 PureRenderMixin 来减少重复渲染了，因为这是个匿名函数
- **DOM 操作是不可避免的**
  但凡是上点儿规模的前端项目，没有 DOM 操作基本是不可能的。且不说最常见的后端「埋点」，你总得用 DOM API 去取值吧；就说一个最简单的，比如右手边这个「回到顶部」的按钮，你纯用 React 写一个试试。当然你会说什么 requestAnimationFrame，什么 ReactCSSTransitionGroup blah blah blah，真正到项目里你会发现还是 DOM API 简单。
- [pure render - 知乎专栏](http://zhuanlan.zhihu.com/purerender)
