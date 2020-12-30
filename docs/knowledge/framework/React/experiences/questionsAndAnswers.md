---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### react 的生命周期，在哪个生命周期中设置 setState 不会引起重新渲染？

| 生命周期                  | 调用次数        | 能否使用 setSate() |
| ------------------------- | --------------- | ------------------ |
| getDefaultProps           | 1(全局调用一次) | 否                 |
| getInitialState           | 1               | 否                 |
| componentWillMount        | 1               | 是                 |
| render                    | >=1             | 否                 |
| componentDidMount         | 1               | 是                 |
| componentWillReceiveProps | >=0             | 是                 |
| shouldComponentUpdate     | >=0             | 否                 |
| componentWillUpdate       | >=0             | 否                 |
| componentDidUpdate        | >=0             | 否                 |
| componentWillUnmount      | 1               | 否                 |

### react 项目中的`registerServiceWorker.js`文件是做什么的？

在生产中，我们注册一个服务工作者来从本地缓存服务资产。
这使得应用程序在以后的产品访问中加载速度更快，并使其具备离线功能。但是，这也意味着开发人员(和用户)将只看到在“N+1”访问页面时部署的更新，因为以前缓存的资源在后台更新。

也就是实现 PWA。

### react 核心架构是什么？react 的原理是什么？

### 核心架构

- O(n) 复杂度的的 diff 算法。
  > ![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/react-diff.png)
  > React 通过 updateDepth 对 Virtual DOM 树进行层级控制，只会对相同颜色方框内的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。
  > [详细学习](https://blog.csdn.net/u011413061/article/details/77823299)
- react 的生命周期
  ![react-lifecycle.png](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/react-lifecycle.png)
- setState 实现机制

### react 的工作原理

react 引用了虚拟 DOM 的机制，在浏览器端用 Javascript 实现了一套 DOM API。。

虚拟 DOM 的原理：React 会在内存中维护一个虚拟 DOM 树，对这个树进行读或写，实际上是对虚拟 DOM 进行。当数据变化时，React 会自动更新虚拟 DOM，然后将新的虚拟 DOM 和旧的虚拟 DOM 进行对比，找到变更的部分，得出一个 diff，然后将 diff 放到一个队列里，最终批量更新这些 diff 到 DOM 中。

虚拟 DOM 的优点：

最终表现在 DOM 上的修改只是变更的部分，可以保证非常高效的渲染。

虚拟 DOM 的缺点：

首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，会比 innerHTML 插入慢。

### 高阶组件了解多少？

React 中高阶组件是一个普通的函数。接受一个组件作为参数，并且其返回值也为一个 react 组件。

其实，高阶组件的函数体的实现大部分都是“增强型组件”的实现，在实现中利用传递给高阶组件的参数定制化“增强型组件”的实现。

### 你们用的版本 react 是什么版本？有关注过 16.0 有什么新特性吗？

最近使用的是 16.0 的版本。

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

  // 上述的ErrorBoundary就是一个“错误边界”，然后我们可以这样来使用它：

  <ErrorBoundary>
    <MyWidget />
  </ErrorBoundary>;
  ```

  > Erro Boundaries 本质上也是一个组件，通过增加了新的生命周期函数 componentDidCatch 使其变成了一个新的组件，这个特殊组件可以捕获其子组件树中的 js 错误信息，输出错误信息或者在报错条件下，显示默认错误页。
  > **注意一个 Error Boundaries 只能捕获其子组件中的 js 错误，而不能捕获其组件本身的错误和非子组件中的 js 错误。**

### 说一下 react 的生命周期;shouldUpdate 生命周期中有什么比较数据的好的方法吗？

生命周期图；

其中在 componentWillMount、componentDidMount 和 componentWillReceiveProps 三个生命周期中进行 setState 不会引起重新渲染。

shouldComponentUpdate 生命周期默认返回 true。
实际效果却是每个组件都完成 re-render 和 virtual-DOM diff 过程，虽然组件没有变更，这明显是一种浪费。react 的性能瓶颈主要表现在：对于 props 和 state 没有变化的组件，react 也要重新生成虚拟 DOM 及虚拟 DOM 的 diff。
这个时候，就是 shouldComponentUpdate 上场的时候了。该对齐进行优化。

优化主要有：

react 在发展的不同阶段提供两套官方方案：

- PureRenderMin
- PureComponent

### PureRenderMin

一种是基于 ES5 的 React.createClass 创建的组件，配合该形式下的 mixins 方式来组合 PureRenderMixin 提供的 shouldComponentUpdate 方法。当然用 ES6 创建的组件也能使用该方案。

```js
import PureRenderMixin from 'react-addons-pure-render-mixin';
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
}
```

### PureComponent

在 React 15.3.0 版本发布的针对 ES6 而增加的一个组件基类：React.PureComponent。这明显对 ES6 方式创建的组件更加友好。

```js
import React, { PureComponent } from 'react';
class Example extends PureComponent {
  render() {
    // ...
  }
}
```

它内部的 shouldComponentUpdate 方法都是浅比较(shallowCompare)props 和 state 对象的，即只比较对象的第一层的属性及其值是不是相同。

例如下面 state 对象变更为如下值：

```js
state = {
  value: { foo: 'bar' },
};
```

为 state 的 value 被赋予另一个对象，使 nextState.value 与 this.props.value 始终不等，导致浅比较通过不了。在实际项目中，这种嵌套的对象结果是很常见的，如果使用 PureRenderMin 或者 PureComponent 方式时起不到应有的效果。
**虽然可以通过深比较方式来判断，但是深比较类似于深拷贝，递归操作，性能开销比较大。**
为此，可以对组件尽可能的拆分，使组件的 props 和 state 对象数据达到扁平化，结合着使用 PureRenderMin 或者 PureComponent 来判断组件是否更新，可以更好地提升 react 的性能，不需要开发人员过多关心。

### 说一下 redux

- 使用 `react-redux` 中的`<Provider>`来绑定全局的一个 store;
- 使用 `react-redux` 中的`connect`来创建容器组件。

### redux 是在哪儿监听数据的？怎么监听的？

- 使用`redux-saga/effects`中的`takeLates`来监听最新的 action 以及`redux-saga`中的`createSagaMiddleware`来创建监听

### jsx 是什么？

它是 JavaScript 的语法扩展。我们建议将它与 React 一起使用来描述 UI 应该是什么样子。JSX 可能会提醒您一种模板语言，但它具有 JavaScript 的全部功能。

JSX 为我们提供了创建 React 元素方法:React.createElement();

JSX 本身也是一个表达式，在编译后，JSX 表达式会变成普通的 JavaScript 对象。

### AMD 与 CMD 区别

- AMD 推崇依赖前置，在定义模块的时候就要声明其依赖的模块
- CMD 推崇就近依赖，只有在用到某个模块的时候再去 require

AMD 和 CMD 最大的区别是对依赖模块的执行时机处理不同，注意不是加载的时机或者方式不同

### 一个扩展知识

#### CommonJS

CommonJS 是服务器端模块的规范，Node.js 采用了这个规范。
根据 CommonJS 规范，一个单独的文件就是一个模块。加载模块使用 require 方法，该方法读取一个文件并执行，最后返回文件内部的 exports 对象。

- require ：加载模块文件
- 返回模块的 exports 对象

#### AMD 和 CMD

都是异步加载

AMD 规范的实现代表是 require.js；AMD 推崇依赖前置
CMD 规范的实现代表是 sea.js；CMD 推崇依赖就近

简单来说,就是 sea.js 属于懒加载,require.js 属于预加载.

> 在这里,顺便扩展一下预加载和懒加载的优缺点

> 预加载:当第一次访问时将所有的文件加载出来
>
> - 优点:第一次访问完成以后, 再次访问的速度会很快
> - 缺点:第一次加载页面要等待很久.
>   懒加载:使用的时候才会加载对应的文件.
> - 优点:第一次访问速度相对快点
> - 缺点:再访问其他新的模块时速度会变慢.

#### ES6Module

- 通过 import 命令来加载其它模块提供的功能。
- 通过 export 命令用于规定模块的对外接口。

#### commonjs vs es6module

- ES6 在编译时就能确定模块的依赖关系 而 CommonJS 只能在运行时确定模块的依赖关系。

### 手势密码的使用什么关键组件来开发的？

PanResponder

### 数据是怎么存储的？

采用的 0-8 的 9 个数字来存储的

### UI 库中的 theme 主题是怎么实现的？

添加默认主题只需要在项目的根目录所在文件`App.js`中使用`createTheme()`方法创建主题,然后将创建的主题通过`ThemeProvider`装饰器传递给整个 APP 的子元素，我们通过改变`ThemeProvider`的`theme`属性的值来改变主题

### 是怎么传到 createAPP 中的？

### 查看文件功能是怎么实现的？

在安卓和 iOS 上各自实现了一个有文件路径、文件标题、文件类型的打开文件的功能。

### react, flux 和 redux 的关系？

简单来说：

Flux 本身是一套单向数据流的设计框架。
Redux 是其中的一种具体实现。
React 和 redux 总是一起出现，是因为如果单单使用 react，它仅仅是一个 view 的框架，不足以提供足够的前端管理和使用功能。而 redux 的引用就好像 react+MC 一样，赋予了 react 完整的生态系统。当然 redux 不是基于 mvc 的。简单说，redux+react 换了个更直接的法子实现了 MVC 能提供的数据管理功能。

### mvc \mvp 和 mvvm 区别

### MVC 模式

所谓 MVC 开发模式，主要讲的是在开发交互应用时，怎么将不同功能的代码拆分到不同的文件或区块，以便降低代码的耦合度，提高代码的可读性和健壮性。

MVC 来源于服务器端的开发。前端开发中也引入了 MVC 的概念。（Model-View-Controller）

在通常的开发中，除了简单的 Model、View 以外的所有部分都被放在了 Controller 里面。Controller 负责显示界面、响应用户的操作、网络请求以及与 Model 交互。这就导致了 Controller：

- 逻辑复杂，难以维护。
- 和 View 紧耦合，无法测试。

* Model（模型）- 相当于 angular1.x 中的 service
  前端开发的 Model 相当于后台数据的镜像或缓存池，它和服务器端 MVC 中的 Model 概念一脉相承；
* View（视图）- 相当于 angular1.x 中的 view
  View 对应页面的呈现，主要指的是和 HTML、CSS 相关的代码，它和服务器端 MVC 中的 View 概念也非常相近；
  > view 和 controller 是可以直接交互的。
* Controller（控制器） - 相当于 angular1.x 中的 ctrl
  在前端应用中，用户和网页之间的交互主要是通过操作事件（例如点击鼠标、键盘输入等）实现的，所以前端的 controller 这里可以简单理解为各种交互事件的 handler。
  > 前端 controller 的概念比较杂，比如 angularjs 中的 controller 被定义为一个作用域（`$scope`）的闭包，这个闭包可以和一段 HTML 模板绑定在一起，最终将数据渲染到模板中形成页面。

![mvc](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/mvc.png)

### MVVM 模式

- Model
- View
- ViewModel

![mvvm](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/mvvm.png)

一个 MVC 的增强版，我们正式连接了视图和控制器，并将表示逻辑从 Controller 移出放到一个新的对象里，即 View Model。MVVM 听起来很复杂，但它本质上就是一个精心优化的 MVC 架构。

- Model 代表你的基本业务逻辑
- ViewModel 将前面两者联系在一起的对象
  > 就是 View 和 Model 层的粘合剂，他是一个放置用户输入验证逻辑，视图显示逻辑，发起网络请求和其他各种各样的代码的极好的地方。说白了，就是把原来 ViewController 层的业务逻辑和页面逻辑等剥离出来放到 ViewModel 层。它采用双向绑定（data-binding）：View 的变动，自动反映在 ViewModel，反之亦然。这样开发者就不用处理接收事件和 View 更新的工作，框架已经帮你做好了。
- View 层，就是 ViewController 层和 view，他的任务就是从 ViewModel 层获取数据，然后显示。(显示内容)

### mvp 模式

- View： 对应于 Activity，负责 View 的绘制以及与用户交互
- Model： 依然是业务逻辑和实体模型
- Presenter： 负责完成 View 于 Model 间的交互

![mvp](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/mvp.png)

View 不直接与 Model 交互，而是通过与 Presenter 交互来与 Model 间接交互。

Presenter 与 View 的交互是通过接口来进行的。

通常 View 与 Presenter 是一对一的，但复杂的 View 可能绑定多个 Presenter 来处理逻辑

这些大公司招聘都是高级工程师起步，所以对简历上的项目会刨根问底。很多很多问题都是由项目中拓展开的，像优化相关的东西，还有前面提到的 require.js、promise、gulp，项目中用到了某项技术，高级工程师的要求是：不仅会用，更要知道其原理。对自己的提醒：项目中用到的技术，不能说完全掌握其原理吧，但大致的实现还是有必要了解一下的。

介绍一下你做的这个项目，进一步细问：整个项目有哪些模块，你主要负责哪些
你在项目中的角色
你在项目中做的最出彩的一个地方
碰到过什么样的困难，怎么解决的
（如果你是这个项目的负责人），任务怎么分配的，有没有关注过团队成员的成长问题
前端安全问题：CSRF 和 XSS
其他

阿里、网易的面试几乎都是围绕项目展开的，所以提醒自己搬砖的时候多想想、多看看，多站在一个高度去看整个项目：用到什么技术，技术实现原理是什么，项目框架怎么搭建的，采取安全措施了吗…
