---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# 路由

React 中路由主要有两种方式：

- hash 路由
- history 路由

[react-router 原理](https://blog.csdn.net/qq_36223144/article/details/83247008)

# react-router

## 引入 router

## 如何配置按需加载

https://segmentfault.com/a/1190000007141049

# react-router

### 一、 基本用法

安装：

```
npm i -S react react-router
```

使用时，路由器 `Router`就是 React 的一个组件。`Router`组件本身只是一个容器，真正的路由要通过`Route`组件定义。

```
import { Router, Route, hashHistory } from 'react-router';

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
  </Router>
), document.getElementById('app'));
```

上面代码中，用户访问根路由`/`（比如`http://www.example.com/`），组件`APP`就会加载到`document.getElementById('app')`。

你可能还注意到，`Router`组件有一个参数`history`，它的值`hashHistory`表示，路由的切换由 URL 的 hash 变化决定，即 URL 的`#`部分发生变化。举例来说，用户访问`http://www.example.com/`，实际会看到的是`http://www.example.com/#/`。

`Route`组件定义了 URL 路径与组件的对应关系。你可以同时使用多个`Route`组件。

```
<Router history={hashHistory}>
  <Route path="/" component={App}/>
  <Route path="/repos" component={Repos}/>
  <Route path="/about" component={About}/>
</Router>
```

上面代码中，用户访问`/repos`（比如`http://localhost:8080/#/repos`）时，加载`Repos`组件；访问`/about`（`http://localhost:8080/#/about`）时，加载`About`组件。

###

# 路由管理

1. react-router 的使用需要注意的问题：
   1. 什么是 hash， history ，browserRouter，
2. Router 组件中嵌套 Route， 何种情况下应该嵌套 Switch，exact 精确的命中 path 渲染组件。
3. react-router ， react-router-dom， 以及 react-router-redux 的区别？

### react 路由懒加载

https://segmentfault.com/a/1190000011128817
https://segmentfault.com/a/1190000010174260
https://segmentfault.com/a/1190000007141049

### react router

https://segmentfault.com/a/1190000011137828

### react router 传值

https://blog.csdn.net/qq_23158083/article/details/68488831

### 利用 react-router-dom 进行页面跳转

不会重新刷新页面：

https://blog.csdn.net/cen_cs/article/details/77977385

https://segmentfault.com/a/1190000011137828

### 前端路由原理

前端路由实现起来其实很简单，本质就是监听 URL 的变化，然后匹配路由规则，显示相应的页面，并且无须刷新页面。目前前端使用的路由就只有两种实现方式。

- Hash 模式
- History 模式

#### Hash 模式

`www.test.com/#/` 就是 Hash URL，当 # 后面的哈希值发生变化时，可以通过 hashchange 事件来监听到 URL 的变化，从而进行跳转页面，并且无论哈希值如何变化，服务端接收到的 URL 请求永远是 www.test.com。

```js
window.addEventListener('hashchange', () => {
  // ... 具体逻辑
});
```

#### History 模式

History 模式是 HTML5 新推出的功能，主要使用 `history.pushState` 和 `history.replaceState` 改变 URL。

通过 History 模式改变 URL 同样不会引起页面的刷新，只会更新浏览器的历史记录。

```js
// 新增历史记录
history.pushState(stateObject, title, URL);
// 替换当前历史记录
history.replaceState(stateObject, title, URL);
```

当用户做出浏览器动作时，比如点击后退按钮时会触发 popState 事件

```js
window.addEventListener('popstate', e => {
  // e.state 就是 pushState(stateObject) 中的 stateObject
  console.log(e.state);
});
```

#### 两种模式对比

- Hash 模式只可以更改 # 后面的内容，History 模式可以通过 API 设置任意的同源 URL
- History 模式可以通过 API 添加任意类型的数据到历史记录中，Hash 模式只能更改哈希值，也就是字符串
- Hash 模式无需后端配置，并且兼容性好。History 模式在用户手动输入地址或者刷新页面的时候会发起 URL 请求，后端需要配置 index.html 页面用于匹配不到静态资源的时候

### react-router 路由系统的实现原理？

- 实现原理：location 与 components 之间的同步

* 路由的职责是保证 UI 和 URL 的同步
* 在 react-router 中，URL 对应 Location 对象，UI 由 react components 决定
* 因此，路由在 react-router 中就转变成 location 与 components 之间的同步

### react 路由懒加载

https://www.jianshu.com/p/697669781276

### react 获取当前路由：

```
import { browserHistory } from 'react-router';
browserHistory.getCurrentLocation().pathname
```

### React Router V4 有什么好处?

     以下是 React Router V4 模块的主要优点：

     在React Router v4（版本4）中，API完全与组件有关。路由器可以显示为单个组件（<BrowserRouter>），它包装特定的子路由器组件（<Route>）。
     您无需手动设置历史记录。路由器模块将通过使用<BrowserRouter>组件包装路由来处理历史记录。
     通过仅添加特定路由器模块（Web，core 或 native）来减少应用大小。

### 什么是 React Router?

     React Router 是一个基于 React 之上的强大路由库，可以帮助您快速地向应用添加视图和数据流，同时保持 UI 与 URL 同步。

### React Router 与 history 库的区别?

     React Router 是`history`库的包装器，它处理浏览器的`window.history`与浏览器和哈希历史的交互。它还提供了内存历史记录，这对于没有全局历史记录的环境非常有用，例如移动应用程序开发（React Native）和使用 Node 进行单元测试。

### 在 React Router v4 中的`<Router>`组件是什么?

     React Router v4 提供了以下三种类型的 `<Router>` 组件:

     `<BrowserRouter>`
     `<HashRouter>`
     `<MemoryRouter>`

     以上组件将创建*browser*，*hash*和*memory*的 history 实例。React Router v4 通过`router`对象中的上下文使与您的路由器关联的`history`实例的属性和方法可用。

### `history` 中的 `push()` 和 `replace()` 方法的目的是什么?

     一个 history 实例有两种导航方法：

     `push()`
     `replace()`

     如果您将 history 视为一个访问位置的数组，则`push()`将向数组添加一个新位置，`replace()`将用新的位置替换数组中的当前位置。

### 如何使用在 React Router v4 中以编程的方式进行导航?

     在组件中实现操作路由/导航有三种不同的方法。

     **使用`withRouter()`高阶函数：**

         `withRouter()`高阶函数将注入 history 对象作为组件的 prop。该对象提供了`push()`和`replace()`方法，以避免使用上下文。

         ```jsx
         import { withRouter } from 'react-router-dom' // this also works with 'react-router-native'

         const Button = withRouter(({ history }) => (
           <button
             type='button'
             onClick={() => { history.push('/new-location') }}
           >
             {'Click Me!'}
           </button>
         ))
         ```

     **使用`<Route>`组件和渲染属性模式：**

         `<Route>`组件传递与`withRouter()`相同的属性，因此您将能够通过 history 属性访问到操作历史记录的方法。

         ```jsx
         import { Route } from 'react-router-dom'

         const Button = () => (
           <Route render={({ history }) => (
             <button
               type='button'
               onClick={() => { history.push('/new-location') }}
             >
               {'Click Me!'}
             </button>
           )} />
         )
         ```

     **使用上下文:**

         建议不要使用此选项，并将其视为不稳定的API。

         ```jsx
         const Button = (props, context) => (
           <button
             type='button'
             onClick={() => {
               context.history.push('/new-location')
             }}
           >
             {'Click Me!'}
           </button>
         )

         Button.contextTypes = {
           history: React.PropTypes.shape({
             push: React.PropTypes.func.isRequired
           })
         }
         ```

### 如何在 React Router v4 中获取查询字符串参数?

     在 React Router v4 中并没有内置解析查询字符串的能力，因为多年来一直有用户希望支持不同的实现。因此，使用者可以选择他们喜欢的实现方式。建议的方法是使用 [query-string](https://www.npmjs.com/package/query-string) 库。

     ```javascript
     const queryString = require('query-string');
     const parsed = queryString.parse(props.location.search);
     ```

     如果你想要使用原生 API 的话，你也可以使用 `URLSearchParams` ：

     ```javascript
     const params = new URLSearchParams(props.location.search)
     const foo = params.get('name')
     ```

     如果使用 `URLSearchParams` 的话您应该为 IE11 使用*polyfill*。

### 为什么你会得到 "Router may have only one child element" 警告?

     此警告的意思是`Router`组件下仅能包含一个子节点。

     你必须将你的 Route 包装在`<Switch>`块中，因为`<Switch>`是唯一的，它只提供一个路由。

     首先，您需要在导入中添加`Switch`：

     ```javascript
     import { Switch, Router, Route } from 'react-router'
     ```

     然后在`<Switch>`块中定义路由：

     ```jsx
     <Router>
       <Switch>
         <Route {/* ... */} />
         <Route {/* ... */} />
       </Switch>
     </Router>
     ```

### 如何在 React Router v4 中将 params 传递给 `history.push` 方法?

     在导航时，您可以将 props 传递给`history`对象：

     ```javascript
     this.props.history.push({
       pathname: '/template',
       search: '?name=sudheer',
       state: { detail: response.data }
     })
     ```

     `search`属性用于在`push()`方法中传递查询参数。

### 如何实现默认页面或 404 页面?

     `<Switch>`呈现匹配的第一个孩子`<Route>`。 没有路径的`<Route>`总是匹配。所以你只需要简单地删除 path 属性，如下所示：

     ```jsx
     <Switch>
       <Route exact path="/" component={Home}/>
       <Route path="/user" component={User}/>
       <Route component={NotFound} />
     </Switch>
     ```

### 如何在 React Router v4 上获取历史对象?

     创建一个导出`history`对象的模块，并在整个项目中导入该模块。

         例如， 创建`history.js`文件:

         ```javascript
         import { createBrowserHistory } from 'history'

         export default createBrowserHistory({
           /* pass a configuration object here if needed */
         })
         ```

     您应该使用`<Router>`组件而不是内置路由器。在`index.js`文件中导入上面的`history.js`：

         ```jsx
         import { Router } from 'react-router-dom'
         import history from './history'
         import App from './App'

         ReactDOM.render((
           <Router history={history}>
             <App />
           </Router>
         ), holder)
         ```

     您还可以使用类似于内置历史对象的`history`对象的push方法：

         ```javascript
         // some-other-file.js
         import history from './history'

         history.push('/go-here')
         ```

### 登录后如何执行自动重定向?

     `react-router`包在 React Router 中提供了`<Redirect>`组件。渲染`<Redirect>`将导航到新位置。与服务器端重定向一样，新位置将覆盖历史堆栈中的当前位置。

     ```javascript
     import React, { Component } from 'react'
     import { Redirect } from 'react-router'

     export default class LoginComponent extends Component {
       render() {
         if (this.state.isLoggedIn === true) {
           return <Redirect to="/your/redirect/page" />
         } else {
           return <div>{'Login Please'}</div>
         }
       }
     }
     ```

### 如何为 React Router 添加 Google Analytics?

     在 `history` 对象上添加一个监听器以记录每个页面的访问：

     ```javascript
     history.listen(function (location) {
       window.ga('set', 'page', location.pathname + location.search)
       window.ga('send', 'pageview', location.pathname + location.search)
     })
     ```

### react-router 实现方式，单页面应用相关东西

1.History

- 老浏览器的 history: 主要通过 hash 来实现，对应 createHashHistory
- 高版本浏览器: 通过 html5 里面的 history，对应 createBrowserHistory
- node 环境下: 主要存储在 memeory 里面，对应 createMemoryHistory

内部 createHistory 实现：

```js
// 内部的抽象实现
function createHistory(options={}) {
  ...
  return {
    listenBefore, // 内部的hook机制，可以在location发生变化前执行某些行为，AOP的实现
    listen, // location发生改变时触发回调
    transitionTo, // 执行location的改变
    push, // 改变location
    replace,
    go,
    goBack,
    goForward,
    createKey, // 创建location的key，用于唯一标示该location，是随机生成的
    createPath,
    createHref,
    createLocation, // 创建location
  }
}
```

createLocation 方法:

```js
function createLocation() {
  return {
    pathname, // url的基本路径
    search, // 查询字段
    hash, // url中的hash值
    state, // url对应的state字段
    action, // 分为push、replace、pop三种
    key, // 生成方法为: Math.random().toString(36).substr(2, length)
  };
}
```

三种方法各自执行 URL 前进的方式：

- createBrowserHistory: pushState、replaceState
- createHashHistory: location.hash=\*\*\* location.replace()
- createMemoryHistory: 在内存中进行历史记录的存储
  伪代码实现

```js
// createBrowserHistory(HTML5)中的前进实现
function finishTransition(location) {
  ...
  const historyState = { key };
  ...
  if (location.action === 'PUSH') ) {
    window.history.pushState(historyState, null, path);
  } else {
    window.history.replaceState(historyState, null, path)
  }
}
// createHashHistory的内部实现
function finishTransition(location) {
  ...
  if (location.action === 'PUSH') ) {
    window.location.hash = path;
  } else {
    window.location.replace(
    window.location.pathname + window.location.search + '#' + path
  );
  }
}
// createMemoryHistory的内部实现
entries = [];
function finishTransition(location) {
  ...
  switch (location.action) {
    case 'PUSH':
      entries.push(location);
      break;
    case 'REPLACE':
      entries[current] = location;
      break;
  }
}
```

React-router 的基本原理:
URL 对应 Location 对象，而 UI 是由 react 的 components 来决定的，这样就转变成 location 与 components 之间的同步问题

### React-router 中的 Link 和 Route 的区别

- route 是配置，link 是使用
- 静态跳转：通过 Link 组件实现静态跳转
  必须以写入组件的方式实现跳转
  无法跳到历史记录中的前一个界面，后一个界面，前 N 个界面，后 N 个界面
- 动态跳转：通过 Route 注入 component 中的 route 属性实现动态跳转
  从 Route 组件中传入 component 中的 router 属性对象解决了这个问题
- NavLink 是 Link 的一个特定版本，会在匹配上当前的 url 的时候给已经渲染的元素添加参数

### react-router 里的 Link 标签和 a 标签有什么区别，如何禁掉 a 标签默认事件，禁掉之后如何实现跳转

是 react-router 里实现路由跳转的链接，一般配合 使用，react-router 接管了其默认的链接跳转行为，区别于传统的页面跳转， 的“跳转”行为只会触发相匹配的 对应的页面内容更新，而不会刷新整个页面。 而 标签就是普通的超链接了，用于从当前页面跳转到 href 指向的另一个页面（非锚点情况）
