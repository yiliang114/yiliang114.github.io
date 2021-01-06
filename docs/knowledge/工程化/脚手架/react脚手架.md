---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### React 脚手架

https://www.one-tab.com/page/f_TSL8zKTZ2qb6q5ERPwGw

create-react-app
​ react
​ redux
​ saga/thunk/promise
​ select ？
​ 数据不可变？ Api

### React 项目构建

1. webpack 的配置，需要热更新的话用 webpack 配置和 webpack-dev-server 配置有什么不同？
2. webpack 中如何引入对 es6， less ，sass ，postcss 编译相关的插件
3. webpack 和 webpack-dev-server 执行命令及参数的意义是什么
4. webpack 打印彩色日志？ 如何设置 proxy，设置 host 以及端口，以及需要设置目录的别称。
5. 需要安装哪些 babel 库，分别作用是什么
6. 设置 mock 数据，可以使用 json-server

### react 项目 发布

https://blog.csdn.net/hesonggg/article/details/78109631

### react 对于 iframe 的融合

http://blog.lotp.xyz/2016/12/01/How-to-Use-Postmessage-to-Communicate-with-iframe-in-React/

lbs 页面

### registerServiceWorker 怎么使用？ 在 create-react-app 中的这个

### react 的 pwa 实现，简单的项目都不不需要 electron 了。

### import Helmet from 'react-helmet'; Helmet 是干嘛用的

### babel-plugin-import 按需加载插件

### 如何在 React 中启用生产模式?

    你应该使用 Webpack 的 `DefinePlugin` 方法将 `NODE_ENV` 设置为 `production`，通过它你可以去除 propType 验证和额外警告等内容。除此之外，如果你压缩代码，如使用 Uglify 的死代码消除，以去掉用于开发的代码和注释，它将大大减少包的大小。

### 什么是 CRA 及其好处?

    `create-react-app` CLI 工具允许你无需配置步骤，快速创建和运行 React 应用。

    让我们使用 *CRA* 来创建 Todo 应用：

    ```shell
    # Installation
    $ npm install -g create-react-app

    # Create new project
    $ create-react-app todo-app
    $ cd todo-app

    # Build, test and run
    $ npm run build
    $ npm run test
    $ npm start
    ```

    它包含了构建 React 应用程序所需的一切：

    React, JSX, ES6, 和 Flow 语法支持。
    ES6 之外的语言附加功能，比如对象扩展运算符。
    AutoPrefixed CSS，因此你不在需要 -webkit- 或其他前缀。
    一个快速的交互式单元测试运行程序，内置了对覆盖率报告的支持。
    一个实时开发服务器，用于警告常见错误。
    一个构建脚本，用于打包用于生产中包含 hashes 和 sourcemaps 的 JS、CSS 和 Images 文件。

### 在 `create-react-app` 项目中导入 polyfills 的方法有哪些?

     **从 `core-js` 中手动导入:**

         创建一个名为 `polyfills.js` 文件，并在根目录下的 `index.js` 文件中导入它。运行 `npm install core-js` 或 `yarn add core-js` 并导入你所需的功能特性：

         ```js
         import 'core-js/fn/array/find'
         import 'core-js/fn/array/includes'
         import 'core-js/fn/number/is-nan'
         ```

     **使用 Polyfill 服务:**

         通过将以下内容添加到 `index.html` 中来获取自定义的特定于浏览器的 polyfill：

         ```html
         <script src='https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes'></script>
         ```

         在上面的脚本中，我们必须显式地请求 `Array.prototype.includes` 特性，因为它没有被包含在默认的特性集中。

### 如何在 create-react-app 中使用 https 而不是 http?

     你只需要使用 `HTTPS=true` 配置。你可以编辑 `package.json` 中的 scripts 部分：

     ```json
     "scripts": {
       "start": "set HTTPS=true && react-scripts start"
     }
     ```

     或直接运行 `set HTTPS=true && npm start`

### 如何避免在 create-react-app 中使用相对路径导入?

     在项目的根目录中创建一个名为 `.env` 的文件，并写入导入路径：

     ```
     NODE_PATH=src/app
     ```

     然后重新启动开发服务器。现在，你应该能够在没有相对路径的情况下导入 `src/app` 内的任何内容。

### 如何在 `create-react-app` 中使用 TypeScript?

     当您创建一个新项目带有`--scripts-version`选项值为`react-scripts-ts`时便可将 TypeScript 引入。

     生成的项目结构如下所示：

     ```
     my-app/
     ├─ .gitignore
     ├─ images.d.ts
     ├─ node_modules/
     ├─ public/
     ├─ src/
     │  └─ ...
     ├─ package.json
     ├─ tsconfig.json
     ├─ tsconfig.prod.json
     ├─ tsconfig.test.json
     └─ tslint.json
     ```

### 如何在 DevTools 中调试 forwardRefs?

     **React.forwardRef**接受渲染函数作为参数，DevTools 使用此函数来确定为 ref 转发组件显示的内容。例如，如果您没有使用 displayName 属性命名 render 函数，那么它将在 DevTools 中显示为“ForwardRef”，

     ```js
     const WrappedComponent = React.forwardRef((props, ref) => {
       return <LogProps {...props} forwardedRef={ref} />;
     });
     ```

     但如果你命名 render 函数，那么它将显示为 **“ForwardRef(myFunction)”**

     ```js
     const WrappedComponent = React.forwardRef(
       function myFunction(props, ref) {
         return <LogProps {...props} forwardedRef={ref} />;
       }
     );
     ```

     作为替代方案，您还可以为 forwardRef 函数设置 displayName 属性，

     ```js
     function logProps(Component) {
       class LogProps extends React.Component {
         // ...
       }

       function forwardRef(props, ref) {
         return <LogProps {...props} forwardedRef={ref} />;
       }

       // Give this component a more helpful display name in DevTools.
       // e.g. "ForwardRef(logProps(MyComponent))"
       const name = Component.displayName || Component.name;
       forwardRef.displayName = `logProps(${name})`;

       return React.forwardRef(forwardRef);
     }
     ```

### 什么是 NextJS 及其主要特征?

     Next.js 是一个流行的轻量级框架，用于使用 React 构建静态和服务端渲染应用程序。它还提供样式和路由解决方案。以下是 NextJS 提供的主要功能：

     默认服务端渲染
     自动代码拆分以加快页面加载速度
     简单的客户端路由 (基于页面)
     基于 Webpack 的开发环境支持 (HMR)
     能够使用 Express 或任何其他 Node.js HTTP 服务器
     可自定义你自己的 Babel 和 Webpack 配置

### 什么是代码拆分?

     Code-Splitting 是 Webpack 和 Browserify 等打包工具所支持的一项功能，它可以创建多个 bundles，并可以在运行时动态加载。React 项目支持通过 dynamic import() 特性进行代码拆分。例如，在下面的代码片段中，它将使 moduleA.js 及其所有唯一依赖项作为单独的块，仅当用户点击 'Load' 按钮后才加载。

     **moduleA.js**
     ```js
     const moduleA = 'Hello';

     export { moduleA };
     ```
     **App.js**
     ```js
     import React, { Component } from 'react';

     class App extends Component {
       handleClick = () => {
         import('./moduleA')
           .then(({ moduleA }) => {
             // Use moduleA
           })
           .catch(err => {
             // Handle failure
           });
       };

       render() {
         return (
           <div>
             <button onClick={this.handleClick}>Load</button>
           </div>
         );
       }
     }

     export default App;
     ```

### getDerivedStateFromError 的目的是什么?

     在子代组件抛出异常后会调用此生命周期方法。它以抛出的异常对象作为参数，并返回一个值用于更新状态。该生命周期方法的签名如下：

     ```js
     static getDerivedStateFromError(error)
     ```

     让我们举一个包含上述生命周期方法的错误边界示例，来说明 getDerivedStateFromError 的目的：

     ```js
     class ErrorBoundary extends React.Component {
       constructor(props) {
         super(props);
         this.state = { hasError: false };
       }

       static getDerivedStateFromError(error) {
         // Update state so the next render will show the fallback UI.
         return { hasError: true };
       }

       render() {
         if (this.state.hasError) {
           // You can render any custom fallback UI
           return <h1>Something went wrong.</h1>;
         }

         return this.props.children;
       }
     }
     ```

### 错误处理期间调用哪些方法?

     在渲染期间，生命周期方法内或任何子组件的构造函数中出现错误时，将会调用以下方法：

     static getDerivedStateFromError()
     componentDidCatch()

### displayName 类属性的用途是什么?

     displayName 被用于调试信息。通常，你不需要显式设置它，因为它是从定义组件的函数或类的名称推断出来的。如果出于调试目的或在创建高阶组件时显示不同的名称，可能需要显式设置它。

     例如，若要简化调试，请选择一个显示名称，以表明它是 withSubscription HOC 的结果。

     ```js
     function withSubscription(WrappedComponent) {
       class WithSubscription extends React.Component {/* ... */}
       WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
       return WithSubscription;
     }

     function getDisplayName(WrappedComponent) {
       return WrappedComponent.displayName || WrappedComponent.name || 'Component';
     }
     ```

### 什么是 Flow?

     *Flow* 是一个静态类型检查器，旨在查找 JavaScript 中的类型错误。与传统类型系统相比，Flow 类型可以表达更细粒度的区别。例如，与大多数类型系统不同，Flow 能帮助你捕获涉及 `null` 的错误。

### Flow 和 PropTypes 有什么区别?

     Flow 是一个静态分析工具（静态检查器），它使用该语言的超集，允许你在所有代码中添加类型注释，并在编译时捕获整个类的错误。PropTypes 是一个基本类型检查器（运行时检查器），已经被添加到 React 中。除了检查传递给给定组件的属性类型外，它不能检查其他任何内容。如果你希望对整个项目进行更灵活的类型检查，那么 Flow/TypeScript 是更合适的选择。

### 在 React 中如何使用 Font Awesome 图标?

     接下来的步骤将在 React 中引入 Font Awesome：

     安装 `font-awesome`:

     ```shell
     $ npm install --save font-awesome
     ```

     在 `index.js` 文件中导入 `font-awesome`:

     ```js
     import 'font-awesome/css/font-awesome.min.css'
     ```

     在 `className` 中添加 Font Awesome 类:

     ```js
     render() {
       return <div><i className={'fa fa-spinner'} /></div>
     }
     ```

### 什么 是 React 开发者工具?

     *React Developer Tools* 允许您检查组件层次结构，包括组件属性和状态。它既可以作为浏览器扩展（用于 Chrome 和 Firefox ），也可以作为独立的应用程序（用于其他环境，包括 Safari、IE 和 React Native）。

     可用于不同浏览器或环境的官方扩展。
     **Chrome插件**
     **Firefox插件**
     **独立应用** （ Safari，React Native 等）

### 在 Chrome 中为什么 DevTools 没有加载本地文件?

     如果您在浏览器中打开了本地 HTML 文件（`file://...`），则必须先打开*Chrome Extensions*并选中“允许访问文件URL”。

### 如何在 React 中使用 Polymer?

     创建 Polymer 元素：

         ```jsx
         <link rel='import' href='../../bower_components/polymer/polymer.html' />
         Polymer({
           is: 'calender-element',
           ready: function() {
             this.textContent = 'I am a calender'
           }
         })
         ```

     通过在 HTML 文档中导入 Polymer 组件，来创建该组件对应的标签。例如，在 React 应用程序的 `index.html` 文件中导入。

         ```html
         <link rel='import' href='./src/polymer-components/calender-element.html'>
         ```

     在 JSX 文件中使用该元素：

         ```js
         import React from 'react'

         class MyComponent extends React.Component {
           render() {
             return (
               <calender-element />
             )
           }
         }

         export default MyComponent
         ```

### 为什么 React 选项卡不会显示在 DevTools 中?

     当页面加载时，*React DevTools*设置一个名为`__REACT_DEVTOOLS_GLOBAL_HOOK__`的全局变量，然后 React 在初始化期间与该钩子通信。如果网站没有使用 React，或者如果 React 无法与 DevTools 通信，那么它将不会显示该选项卡。

### 如何实现 Server Side Rendering 或 SSR?

    React 已经配备了用于处理 Node 服务器上页面渲染的功能。你可以使用特殊版本的 DOM 渲染器，它遵循与客户端相同的模式。

    ```jsx
    import ReactDOMServer from 'react-dom/server'
    import App from './App'

    ReactDOMServer.renderToString(<App />)
    ```

    此方法将以字符串形式输出常规 HTML，然后将其作为服务器响应的一部分放在页面正文中。在客户端，React 检测预渲染的内容并无缝地衔接。

### 在 React 中什么是严格模式?

    `React.StrictMode` 是一个有用的组件，用于突出显示应用程序中的潜在问题。就像 `<Fragment>`，`<StrictMode>` 一样，它们不会渲染任何额外的 DOM 元素。它为其后代激活额外的检查和警告。这些检查仅适用于开发模式。

    ```jsx
    import React from 'react'

    function ExampleApplication() {
      return (
        <div>
          <Header />
          <React.StrictMode>
            <div>
              <ComponentOne />
              <ComponentTwo />
            </div>
          </React.StrictMode>
          <Footer />
        </div>
      )
    }
    ```

    在上面的示例中，*strict mode* 检查仅应用于 `<ComponentOne>` 和 `<ComponentTwo>` 组件。

### 什么是 React 流行的特定 linters?

     ESLint 是一个流行的 JavaScript linter。有一些插件可以分析特定的代码样式。在 React 中最常见的一个是名为 `eslint-plugin-react` npm 包。默认情况下，它将使用规则检查许多最佳实践，检查内容从迭代器中的键到一组完整的 prop 类型。另一个流行的插件是 `eslint-plugin-jsx-a11y`，它将帮助修复可访问性的常见问题。由于 JSX 提供的语法与常规 HTML 略有不同，因此常规插件无法获取 `alt` 文本和 `tabindex` 的问题。

### 如何用 React 漂亮地显示 JSON?

     我们可以使用 `<pre>` 标签，以便保留 `JSON.stringify()` 的格式：


     ```jsx
     const data = { name: 'John', age: 42 }

     class User extends React.Component {
       render() {
         return (
           <pre>
             {JSON.stringify(data, null, 2)}
           </pre>
         )
       }
     }

     React.render(<User />, document.getElementById('container'))
     ```

### 为什么 `isMounted()` 是一个反模式，而正确的解决方案是什么?

`isMounted()` 的主要场景是避免在组件卸载后调用 `setState()`，因为它会发出警告。

    ```js
    if (this.isMounted()) {
      this.setState({...})
    }
    ```

    在调用 `setState()` 之前检查 `isMounted()` 会消除警告，但也会破坏警告的目的。使用 `isMounted()` 有一种代码味道，因为你要检查的唯一原因是你认为在卸载组件后可能持有引用。

    最佳解决方案是找到在组件卸载后调用 `setState()` 的位置，并修复它们。这种情况最常发生在回调中，即组件正在等待某些数据并在数据到达之前卸载。理想情况下，在卸载之前，应在 `componentWillUnmount()` 中取消任何回调。

### React 中支持哪些指针事件?

    *Pointer Events* 提供了处理所有输入事件的统一方法。在过去，我们有一个鼠标和相应的事件监听器来处理它们，但现在我们有许多与鼠标无关的设备，比如带触摸屏的手机或笔。我们需要记住，这些事件只能在支持 *Pointer Events* 规范的浏览器中工作。

    目前以下事件类型在 *React DOM* 中是可用的：

    `onPointerDown`
    `onPointerMove`
    `onPointerUp`
    `onPointerCancel`
    `onGotPointerCapture`
    `onLostPointerCaptur`
    `onPointerEnter`
    `onPointerLeave`
    `onPointerOver`
    `onPointerOut`

### 在 React v16 中是否支持自定义 DOM 属性?

    是的，在过去 React 会忽略未知的 DOM 属性。如果你编写的 JSX 属性 React 无法识别，那么 React 将跳过它。例如：

    ```jsx
    <div mycustomattribute={'something'} />
    ```

    在 React 15 中将在 DOM 中渲染一个空的 div：

    ```html
    <div />
    ```

    在 React 16 中，任何未知的属性都将会在 DOM 显示：

    ```html
    <div mycustomattribute='something' />
    ```

    这对于应用特定于浏览器的非标准属性，尝试新的 DOM APIs 与集成第三方库来说非常有用。

### 在 JSX 中如何进行循环?

    你只需使用带有 ES6 箭头函数语法的 `Array.prototype.map` 即可。例如，`items` 对象数组将会被映射成一个组件数组：

    ```jsx
    <tbody>
      {items.map(item => <SomeComponent key={item.id} name={item.name} />)}
    </tbody>
    ```

    你不能使用 `for` 循环进行迭代：

    ```jsx
    <tbody>
      for (let i = 0; i < items.length; i++) {
        <SomeComponent key={items[i].id} name={items[i].name} />
      }
    </tbody>
    ```

    这是因为 JSX 标签会被转换成函数调用，并且你不能在表达式中使用语句。但这可能会由于 `do` 表达式而改变，它们是第一阶段提案。

### 如何使用 React label 元素?

    如果你尝试使用标准的 `for` 属性将 `<label>` 元素绑定到文本输入框，那么在控制台将会打印缺少 HTML 属性的警告消息。

    ```jsx
    <label for={'user'}>{'User'}</label>
    <input type={'text'} id={'user'} />
    ```

    因为 `for` 是 JavaScript 的保留字，请使用 `htmlFor` 来替代。

    ```jsx
    <label htmlFor={'user'}>{'User'}</label>
    <input type={'text'} id={'user'} />
    ```

### 在 React 状态中删除数组元素的推荐方法是什么?

     更好的方法是使用 `Array.prototype.filter()` 方法。

     例如，让我们创建用于更新状态的 `removeItem()` 方法。

     ```js
     removeItem(index) {
       this.setState({
         data: this.state.data.filter((item, i) => i !== index)
       })
     }
     ```

### 在 React 中是否可以不在页面上渲染 HTML 内容?

     可以使用最新的版本 (>=16.2)，以下是可能的选项：

     ```jsx
     render() {
       return false
     }
     ```

     ```jsx
     render() {
       return null
     }
     ```

     ```jsx
     render() {
       return []
     }
     ```

     ```jsx
     render() {
       return <React.Fragment></React.Fragment>
     }
     ```

     ```jsx
     render() {
       return <></>
     }
     ```

     返回 `undefined` 是无效的。

### 如何在页面加载时聚焦一个输入元素?

     你可以为 `input` 元素创建一个 `ref`，然后在 `componentDidMount()` 方法中使用它：

     ```jsx
     class App extends React.Component{
       componentDidMount() {
         this.nameInput.focus()
       }

       render() {
         return (
           <div>
             <input
               defaultValue={'Won\'t focus'}
             />
             <input
               ref={(input) => this.nameInput = input}
               defaultValue={'Will focus'}
             />
           </div>
         )
       }
     }

     ReactDOM.render(<App />, document.getElementById('app'))
     ```

### 我们如何在浏览器中找到当前正在运行的 React 版本?

     你可以使用 `React.version` 来获取版本：

     ```jsx
     const REACT_VERSION = React.version

     ReactDOM.render(
       <div>{`React version: ${REACT_VERSION}`}</div>,
       document.getElementById('app')
     )
     ```

### 在 React 中如何定义常量?

     你可以使用 ES7 的 `static` 来定义常量。

     ```js
     class MyComponent extends React.Component {
       static DEFAULT_PAGINATION = 10
     }
     ```

### 在 React 中如何以编程方式触发点击事件?

     你可以使用 ref 属性通过回调函数获取对底层的 `HTMLinputeElement` 对象的引用，并将该引用存储为类属性，之后你就可以利用该引用在事件回调函数中， 使用 `HTMLElement.click` 方法触发一个点击事件。这可以分为两个步骤：

     在 render 方法创建一个 ref：

         ```jsx
         <input ref={input => this.inputElement = input} />
         ```

     在事件处理器中触发点击事件

         ```js
         this.inputElement.click()
         ```

### 在 React 中是否可以使用 async/await?

     如果要在 React 中使用 `async`/`await`，则需要 *Babel* 和 [transform-async-to-generator](https://babeljs.io/docs/en/babel-plugin-transform-async-to-generator) 插件。

### React 项目常见的文件结构是什么?

     React 项目文件结构有两种常见的实践。

     **按功能或路由分组:**

         构建项目的一种常见方法是将 CSS，JS 和测试用例放在一起，按功能或路由分组。

         ```
         common/
         ├─ Avatar.js
         ├─ Avatar.css
         ├─ APIUtils.js
         └─ APIUtils.test.js
         feed/
         ├─ index.js
         ├─ Feed.js
         ├─ Feed.css
         ├─ FeedStory.js
         ├─ FeedStory.test.js
         └─ FeedAPI.js
         profile/
         ├─ index.js
         ├─ Profile.js
         ├─ ProfileHeader.js
         ├─ ProfileHeader.css
         └─ ProfileAPI.js
         ```

     **按文件类型分组:**

         另一种流行的项目结构组织方法是将类似的文件组合在一起。

         ```
         api/
         ├─ APIUtils.js
         ├─ APIUtils.test.js
         ├─ ProfileAPI.js
         └─ UserAPI.js
         components/
         ├─ Avatar.js
         ├─ Avatar.css
         ├─ Feed.js
         ├─ Feed.css
         ├─ FeedStory.js
         ├─ FeedStory.test.js
         ├─ Profile.js
         ├─ ProfileHeader.js
         └─ ProfileHeader.css
         ```
