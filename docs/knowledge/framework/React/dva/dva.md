---
layout: CustomPages
title: dva
date: 2020-11-21
aside: false
draft: true
---

## dva 是什么

dva 是阿里体验技术部开发的 React 应用框架，命名是根据守望先锋中的任务 D.va 而来。 主要用于解决组件之间的通行问题，
在以前 react 项目中解决数据流问题会引入 redux，又由于 redux 没有异步操作，所以需要引入 redux-saga 或 redux-thunk,这样的缺点就是
引入多个库，致使项目结构复杂。而现在：

> dva = React-Router + Redux + Redux-saga

将上面三个 React 工具库包装在一起，简化了 API，让开发 React 应用更加方便和快捷。

- 了解 dva 之前可以先去了解 redux-saga.

dva 的最简结构：

```
import dva from 'dva';
const App = () => <div>Hello dva</div>;

// 创建应用
const app = dva();
app.model(model)
// 注册视图
app.router(() => <App />);
// 启动应用
app.start('#root');
```

## 数据流图

![image](https://user-images.githubusercontent.com/21194931/56455493-812b0a00-6391-11e9-866b-a70f6ceefb9f.png)

## 核心概念

- State：一个对象，保存整个应用状态
- View：React 组件构成的视图层
- Action：一个对象，描述事件
- connect 方法：一个函数，绑定 State 到 View
- dispatch 方法：一个函数，发送 Action 到 State

### state 和 view

state 是用于数据存储保存全局状态。view 是 react 组件构成的 UI 层，当 state 变化时会触发 ui 层视图的变化。

### Action 和 dispatch

action 是用于描述一个事件的一个对象

```
{
    type: 'submit-form-data',
    payload: formData
}
```

dispatch 则用来发送 Action 到 State

### connect

connect 是一个函数，绑定 State 到 View，connect 方法返回的也是一个 React 组件，通常称为容器组件，是用于生成 State 到 Prop 的映射

```
// 第一种写法这里使用来修饰器@
@connect((state) => {
  return {
    dept: state.dept,
    version: state.version,
  };
})

// 第二种写法
connect(({ state}) => ({state}))(App);
```

## Model

dva 中的 model 是所有的应用逻辑都定义在里面

model 的栗子 🌰：

```
export default {
    namespace: 'modelName',
    state: {
      num: 0
    }，
    subscriptions: {
      setup({dispatch,history}){
        return history.listen(({pathname, query})=>{
          dosomething....
        })
      }
    }
    effects: {
        *addAfter1Second({payload}, { call, put, select }) {
          yield call(delay, 1000);
          yield put({ type: 'add' , payload: 10});
          const num =  yield select(state => state.modelNmae.num);
          console.log(num)
      },
    },
    reducers: {
      add(state, action) {
        return{
          ...state,
          num: action.payload
        }
      },
  },
}
```

model 对象的属性由 namespace,state, effect,reducers,subscriptions 组成。

### namespace 和 state

namespace 当前 Model 的名称。整个应用的 State，由多个小的 Model 的 State 以 namespace 为 key 合成,当在 ui 层触发变化时，可以利用 namespace 来区分触发那个 model 的方法。从而改变 state.

```
dispatch({
  type: 'modelname/add',
  payload: 10
})
```

数据保存在 state，直接决定了视图层的输出.

### effects 和 reducers

effects 和 reducers 都是 action 的处理器，不同的是 reducers 处理的是同步的 action,effects 处理的是异步的 action,effects 是基于 redux-saga 实现，effect 是一个 Generator 函数，内部使用 yield 关键字，标识每一步的操作。effect 提供了供内部使用的三个方法。

- call: 执行异步函数，一般用于请求数据
- put: 相当与 dispatch，发出一个 action,触法一个同步的 action
- select: 可以用于获取全局的状态 state

### subscriptions

subscriptions 一般用于监听路由变化，当满足某些要求时，可以触发一些事件

### React 和 Vue 对比

相同点:

数据驱动视图，提供响应式的视图组件
都有 Virtual DOM，组件化开发，通过 props 参数进行父子组件数据的传递，都实现 webComponents 规范
数据流动单向
都支持服务端渲染
都有支持 native 的方案，React 的 React native，Vue 的 weex
不同点：

社区：React 社区还是要比 vue 大很多；

开发模式：React 在 view 层侵入性还是要比 Vue 大很多的,React 严格上只针对 MVC 的 view 层，Vue 则是 MVVM 模式的一种实现；

数据绑定：Vue 有实现了双向数据绑定，React 数据流动是单向的

数据渲染：对于大规模数据渲染，React 要比 Vue 更快，渲染机制启动时候要做的工作比较多；

数据更新方面：Vue 由于采用依赖追踪，默认就是优化状态：你动了多少数据，就触发多少更新，不多也不少。React 在复杂的应用里有两个选择:

(1). 手动添加 shouldComponentUpdate 来避免不需要的 vdom re-render。 (2).Components 尽可能都用 pureRenderMixin，然后采用 redux 结构 + Immutable.js；

开发风格的偏好：React 推荐的做法是 JSX + inline style，也就是把 HTML 和 CSS 全都写进 JavaScript 了，即"all in js"；Vue 进阶之后推荐的是使用 webpack + vue-loader 的单文件组件格式，即 html,css,js 写在同一个文件；

使用场景：React 配合 Redux 架构适合超大规模多人协作的复杂项目;Vue 则适合小快灵的项目。对于需要对 DOM 进行很多自定义操作的项目，Vue 的灵活性优于 React；

Vue 要比 React 更好上手，具体可能体现在很多人不熟悉 React 的 JSX 语法和函数式编程的思想，以及想要发挥出 React 的最大威力需要学习它一系列生态的缘故；

Vue 着重提高开发效率,让前端程序员更快速方便的开发应用。React 着重于变革开发思想，提升前端程序员编程的深度与创造力,让前端工程师成为真正的程序员而不是 UI 的构建者；

### react 和 vue 你都使用过，说说它们的区别？

[关于 Vue 和 React 区别的一些笔记](https://www.jianshu.com/p/eb06903c8bf7)

### react 和 vue 更新机制的区别

React 组件的属性

React 是一个单纯的 view 层框架,官方推荐使用 JSX 预发来维护组件的状态.通过 Props 和 state 来共同决定组件的表现.

- Props
  正如 prop 的英文意思[属性]一样,Props 中的数据主要用来定义和描述组件的属性,该数据是由父组件在声明 React 组件的时候设置,就好比我们给一个 img 标签设置一个 src 属性一样,我们可以给自定义的 React 组件设置许多属性. 这些属性定义了 React 组件的表现形式,父组件可以通过修改 Props 中的属性来控制子组件的表现.
- state
  同样的,state 表示[状态],那么 state 中的数据主要用来控制组件内部的状态. 也就是说组件内部的变化,不需要同外部有交互的数据,都可以有组件自己通过 state 来控制.
  React 虚拟树更新原则

React 中应用虚拟 DOM 来更新快速更新 DOM,那么更新虚拟 DOM 的原则主要是以下几种:

- 不同元素
  如果更新前后是两种不同类型的 DOM 元素,那就没什么说的,直接销毁原来的节点,创建新的节点.(比如原来是 div,更新为 span)在这个过程中,原来节点的 componentWillUnmount 函数被触犯, 新节点的 componentWillMount 和 componentDidMount 依次被触发. 需要特别指出的是,当前更新节点的所有子节点都会被销毁重建,而不管子节点是否有更新. 简单的来说,就是根变了,那么这个根上的所有叶子都要更新了.
- 相同元素,不同属性
  当节点类型没有发生变化,而只是熟悉变化的话,React 就智能多了,只会更新变化的部分. 好比是一个元素有多个 CSS 样式,如果只变化了一个样式,那么 React 也只更新一个. 当元素不是叶子节点的时候,也就是一个组件元素的时候,会继续深入的去比较子元素来更新子元素.
- 子元素变动.
  当子元素有变动的时候,React 会更新子元素.
  子元素的变动指的是资源的类型/属性/位置等的变动. 类型和属性的变动会触发更新,这个比较好理解.子元素的位置变动,指的是如果一个资源原来在第一位,更新后到第二位了,React 会认为这是一种变动,从而触发更新.
- key 属性的重要作用
  这样看起来 React 也没有那么智能.那么这个时候就要引入一个很重要的 key 属性.React 通过给子组件一个 key 属性.来唯一标识一个子组件,如果更新前后的组件 key 值一样,并且除了位置之外其他属性没有变化,那么就不会触发更新.

Vue 的数据

Vue 是一个传统意义上的 mvc 模型.通过实例化一个 vue 对象来绑定 dom 和 data 的关系,也就是绑定 view 和 model.通过对 model 中每个属性添加[反射]来完成监视器的注册. 当 model 中的数据模型变化时,watcher 会重新计算,从而引发 view 层的更新.

这也就是理解了为什么 Vue 是单向数据流了

Vue 的更新.

上面提到,vue 的更新是 model 中数据的变化引发在初始化时注入的 watcher 的变化,从而引起 view 层的更新.只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会一次推入到队列中。

根据以上特点,我们知道 vue 中的组件更新是有 model 数据的更新引起的,因为 view 和 model 在初始化时已经完成绑定,所以当 model 发生变化时,哪些 view 需要变化已经很明确了,所以就不需要像 React 那般去判断比对了

[Vue 和 React 的视图更新机制对比](https://juejin.im/post/5c17568a6fb9a04a006eeb92)

### MVC、MVVM 了区别，数据双向绑定和单向绑定实现方式

[MVC、MVVM 和单向数据流的对比](https://blog.csdn.net/woshinannan741/article/details/76034586)
[浅谈 MVVM 是如何实现数据双向绑定的？](https://blog.csdn.net/weixin_43196700/article/details/82758237)
[MVC/MVP/MVVM 区别——MVVM 就是 angular，视图和数据双向绑定](https://www.cnblogs.com/bonelee/p/7297974.html)

### virtual dom 原理实现

用 JavaScript 模拟 DOM 树，并渲染这个 DOM 树
比较新老 DOM 树，得到比较的差异对象
把差异对象应用到渲染的 DOM 树。

[详解](https://segmentfault.com/a/1190000016647776)

### Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法。

尤大大的回答：

1. 原生 DOM 操作 vs. 通过框架封装操作。
   这是一个性能 vs. 可维护性的取舍。框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快，因为框架的 DOM 操作层需要应对任何上层 API 可能产生的操作，它的实现必须是普适的。针对任何一个 benchmark，我都可以写出比任何框架更快的手动优化，但是那有什么意义呢？在构建一个实际应用的时候，你难道为每一个地方都去做手动优化吗？出于可维护性的考虑，这显然不可能。框架给你的保证是，你在不需要手动优化的情况下，我依然可以给你提供过得去的性能。
2. 对 React 的 Virtual DOM 的误解。
   React 从来没有说过 “React 比原生操作 DOM 快”。React 的基本思维模式是每次有变动就整个重新渲染整个应用。如果没有 Virtual DOM，简单来想就是直接重置 innerHTML。很多人都没有意识到，在一个大型列表所有数据都变了的情况下，重置 innerHTML 其实是一个还算合理的操作... 真正的问题是在 “全部重新渲染” 的思维模式下，即使只有一行数据变了，它也需要重置整个 innerHTML，这时候显然就有大量的浪费。

我们可以比较一下 innerHTML vs. Virtual DOM 的重绘性能消耗：

innerHTML: render html string O(template size) + 重新创建所有 DOM 元素 O(DOM size)
Virtual DOM: render Virtual DOM + diff O(template size) + 必要的 DOM 更新 O(DOM change)
Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是！它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。可以看到，innerHTML 的总计算量不管是 js 计算还是 DOM 操作都是和整个界面的大小相关，但 Virtual DOM 的计算量里面，只有 js 计算和界面大小相关，DOM 操作是和数据的变动量相关的。前面说了，和 DOM 操作比起来，js 计算是极其便宜的。这才是为什么要有 Virtual DOM：它保证了 1）不管你的数据变化多少，每次重绘的性能都可以接受；2) 你依然可以用类似 innerHTML 的思路去写你的应用。

1. MVVM vs. Virtual DOM
   相比起 React，其他 MVVM 系框架比如 Angular, Knockout 以及 Vue、Avalon 采用的都是数据绑定：通过 Directive/Binding 对象，观察数据变化并保留对实际 DOM 元素的引用，当有数据变化时进行对应的操作。MVVM 的变化检查是数据层面的，而 React 的检查是 DOM 结构层面的。MVVM 的性能也根据变动检测的实现原理有所不同：Angular 的脏检查使得任何变动都有固定的
   O(watcher count) 的代价；Knockout/Vue/Avalon 都采用了依赖收集，在 js 和 DOM 层面都是 O(change)：

脏检查：scope digest O(watcher count) + 必要 DOM 更新 O(DOM change)
依赖收集：重新收集依赖 O(data change) + 必要 DOM 更新 O(DOM change)可以看到，Angular 最不效率的地方在于任何小变动都有的和 watcher 数量相关的性能代价。但是！当所有数据都变了的时候，Angular 其实并不吃亏。依赖收集在初始化和数据变化的时候都需要重新收集依赖，这个代价在小量更新的时候几乎可以忽略，但在数据量庞大的时候也会产生一定的消耗。
MVVM 渲染列表的时候，由于每一行都有自己的数据作用域，所以通常都是每一行有一个对应的 ViewModel 实例，或者是一个稍微轻量一些的利用原型继承的 "scope" 对象，但也有一定的代价。所以，MVVM 列表渲染的初始化几乎一定比 React 慢，因为创建 ViewModel / scope 实例比起 Virtual DOM 来说要昂贵很多。这里所有 MVVM 实现的一个共同问题就是在列表渲染的数据源变动时，尤其是当数据是全新的对象时，如何有效地复用已经创建的 ViewModel 实例和 DOM 元素。假如没有任何复用方面的优化，由于数据是 “全新” 的，MVVM 实际上需要销毁之前的所有实例，重新创建所有实例，最后再进行一次渲染！这就是为什么题目里链接的 angular/knockout 实现都相对比较慢。相比之下，React 的变动检查由于是 DOM 结构层面的，即使是全新的数据，只要最后渲染结果没变，那么就不需要做无用功。

Angular 和 Vue 都提供了列表重绘的优化机制，也就是 “提示” 框架如何有效地复用实例和 DOM 元素。比如数据库里的同一个对象，在两次前端 API 调用里面会成为不同的对象，但是它们依然有一样的 uid。这时候你就可以提示 track by uid 来让 Angular 知道，这两个对象其实是同一份数据。那么原来这份数据对应的实例和 DOM 元素都可以复用，只需要更新变动了的部分。或者，你也可以直接 track by $index 来进行 “原地复用”：直接根据在数组里的位置进行复用。在题目给出的例子里，如果 angular 实现加上 track by $index 的话，后续重绘是不会比 React 慢多少的。甚至在 dbmonster 测试中，Angular 和 Vue 用了 track by \$index 以后都比 React 快: dbmon (注意 Angular 默认版本无优化，优化过的在下面）

顺道说一句，React 渲染列表的时候也需要提供 key 这个特殊 prop，本质上和 track-by 是一回事。

1. 性能比较也要看场合
   在比较性能的时候，要分清楚初始渲染、小量数据更新、大量数据更新这些不同的场合。Virtual DOM、脏检查 MVVM、数据收集 MVVM 在不同场合各有不同的表现和不同的优化需求。Virtual DOM 为了提升小量数据更新时的性能，也需要针对性的优化，比如 shouldComponentUpdate 或是 immutable data。

初始渲染：Virtual DOM > 脏检查 >= 依赖收集
小量数据更新：依赖收集 >> Virtual DOM + 优化 > 脏检查（无法优化） > Virtual DOM 无优化
大量数据更新：脏检查 + 优化 >= 依赖收集 + 优化 > Virtual DOM（无法/无需优化）>> MVVM 无优化
不要天真地以为 Virtual DOM 就是快，diff 不是免费的，batching 么 MVVM 也能做，而且最终 patch 的时候还不是要用原生 API。在我看来 Virtual DOM 真正的价值从来都不是性能，而是它 1) 为函数式的 UI 编程方式打开了大门；2) 可以渲染到 DOM 以外的 backend，比如 ReactNative。

1. 总结
   以上这些比较，更多的是对于框架开发研究者提供一些参考。主流的框架 + 合理的优化，足以应对绝大部分应用的性能需求。如果是对性能有极致需求的特殊情况，其实应该牺牲一些可维护性采取手动优化：比如 Atom 编辑器在文件渲染的实现上放弃了 React 而采用了自己实现的 tile-based rendering；又比如在移动端需要 DOM-pooling 的虚拟滚动，不需要考虑顺序变化，可以绕过框架的内置实现自己搞一个。

附上尤大的回答链接
链接：https://www.zhihu.com/question/31809713/answer/53544875

### 为什么 Vuex 的 mutation 和 Redux 的 reducer 中不能做异步操作？

如果在 mutation 中做了异步操作，在 dev-tools 中会立即打印一个 snapshot，而此时异步操作还没有执行完，此时的 snapshot 的信息是错误的。

而在 action 中做异步操作 dev-tools 会等等异步操作执行完才去打印 mutation 的一个 snapshot,这样便于我们回查 time-travel,查看在某个 mutation 里的变化。

### 聊聊 Vue 的双向数据绑定，Model 如何改变 View，View 又是如何改变 Model 的

- viewmodel 将 el 指向的模板转换成（一个东西） | string-loader 将引入到模块中 html 变成字符串
- 利用模板引擎将数据渲染上去，如果有指令，对指令进行处理，如@click 就会给指定的按钮绑点击事件
- 渲染之后的那个东西转成字符串放入到页面中

> 结论: 视图产生用户操作，viewmodel 就能马上得知, 因为 viewmodel 将自己作用范围的视图做了编译/rerender 等处理，并且根据指令来操作了 dom
> 所以被重新渲染到页面中的视图已经与 viewmodel 做了某些程度的绑定

[详解](https://www.jianshu.com/p/4cfbeddc5db6)

### 在 Vue 中子组件为何不可以修改父组件传递的 Prop，如果修改了，Vue 是如何监控到属性的修改并给出警告的

子组件为何不可以修改父组件传递的 Prop
单向数据流，易于监测数据的流动，出现了错误可以更加迅速的定位到错误发生的位置。
如果修改了，Vue 是如何监控到属性的修改并给出警告的。

```js
if (process.env.NODE_ENV !== 'production') {
  var hyphenatedKey = hyphenate(key)
  if (
    isReservedAttribute(hyphenatedKey) ||
    config.isReservedAttr(hyphenatedKey)
  ) {
    warn(
      '"' +
        hyphenatedKey +
        '" is a reserved attribute and cannot be used as component prop.',
      vm
    )
  }
  defineReactive$$1(props, key, value, function() {
    if (!isRoot && !isUpdatingChildComponent) {
      warn(
        'Avoid mutating a prop directly since the value will be ' +
          'overwritten whenever the parent component re-renders. ' +
          "Instead, use a data or computed property based on the prop's " +
          'value. Prop being mutated: "' +
          key +
          '"',
        vm
      )
    }
  })
}
```

在 initProps 的时候，在 defineReactive 时通过判断是否在开发环境，如果是开发环境，会在触发 set 的时候判断是否此 key 是否处于 updatingChildren 中被修改，如果不是，说明此修改来自子组件，触发 warning 提示。

需要特别注意的是，当你从子组件修改的 prop 属于基础类型时会触发提示。 这种情况下，你是无法修改父组件的数据源的， 因为基础类型赋值时是值拷贝。你直接将另一个非基础类型（Object, array）赋值到此 key 时也会触发提示(但实际上不会影响父组件的数据源)， 当你修改 object 的属性时不会触发提示，并且会修改父组件数据源的数据。

### vuex

state: 状态中心
mutations: 更改状态
actions: 异步更改状态
getters: 获取状态
modules: 将 state 分成多个 modules，便于管理

### 双向绑定和 vuex 是否冲突

在严格模式下使用会比较难处理
https://vuex.vuejs.org/zh/guide/forms.html

### Vue 的响应式原理中 Object.defineProperty 有什么缺陷？为什么在 Vue3.0 采用了 Proxy，抛弃了 Object.defineProperty

Object.defineProperty 无法监控到数组下标的变化，导致通过数组下标添加元素，不能实时响应；

Object.defineProperty 只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历。Proxy 可以劫持整个对象，并返回一个新的对象。
[Proxy 与 Object.defineProperty 的对比](https://github.com/LuoShengMen/StudyNotes/issues/455)

### Proxy 相比于 defineProperty 的优势

[Proxy 与 Object.defineProperty 的对比](https://github.com/LuoShengMen/StudyNotes/issues/455)

### vue 的双向绑定机制？详细介绍

[vue 的双向绑定原理及实现](https://www.cnblogs.com/libin-1/p/6893712.html)

### 原生 js 实现 MVVM

```js
<span id='box'>
  <h1 id='text'></h1>
  <input type='text' id='input' oninput='inputChange(event)' />
  <button id='button' onclick='clickChange()'>
    Click me
  </button>
</span>
```

```js
    <script>
        const input = document.getElementById('input');
        const text = document.getElementById('text');
        const button = document.getElementById('button');
        const data = {
            value: ''
        }
        function defineProperty(obj, attr) {
            let val
            Object.defineProperty(obj, attr, {
                set(newValue) {
                    console.log('set')
                    if (val === newValue) {
                        return;
                    }
                    val = newValue;
                    input.value = newValue;
                    text.innerHTML = newValue;
                },
                get() {
                    console.log('get');
                    return val
                }
            })
        }
        defineProperty(data, 'value')
        function inputChange(event) {
            data.value = event.target.value
        }

        function clickChange() {
            data.value = 'hello'
        }
    </script>
```

[用 Proxy 与 Object.defineProperty 实现双向绑定](https://github.com/LuoShengMen/StudyNotes/issues/474)

### 实现 vue 中的 on,emit,off,once，手写代码

```js
// 参照 vue 源码实现
var EventEmiter = function() {
  this._events = {}
}
EventEmiter.prototype.on = function(event, cb) {
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.on(event[i], cb)
    }
  } else {
    ;(this._events[event] || (this._events[event] = [])).push(cb)
  }
  return this
}
EventEmiter.prototype.once = function(event, cb) {
  function on() {
    this.off(event, cb)
    cb.apply(this, arguments)
  }
  on.fn = cb
  this.on(event, on)
  return this
}
EventEmiter.prototype.off = function(event, cb) {
  if (!arguments.length) {
    this._events = Object.create(null)
    return this
  }
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.off(event[i], cb)
    }
    return this
  }
  if (!cb) {
    this._events[event] = null
    return this
  }
  if (cb) {
    let cbs = this._events[event]
    let i = cbs.length
    while (i--) {
      if (cb === cbs[i] || cb === cbs[i].fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return this
  }
}
EventEmiter.prototype.emit = function(event) {
  let cbs = this._events[event]
  let args = Array.prototype.slice.call(arguments, 1)
  if (cbs) {
    for (let i = 0, l = cbs.length; i < l; i++) {
      cbs[i].apply(this, args)
    }
  }
}
```

### vue 项目中如何约束 rxjs 数据的类型

[Vue、Type escript 和 RxJS 与 Vue-Rx 的结合](https://blog.csdn.net/li420520/article/details/83832214)
[Vue、Type escript 和 RxJS 与 Vue-Rx 的结合](https://www.jianshu.com/p/bb7d032e8238)

### Vue 的父组件和子组件生命周期钩子执行顺序是什么

父组建： beforeCreate -> created -> beforeMount
子组件： -> beforeCreate -> created -> beforeMount -> mounted
父组件： -> mounted
总结：从外到内，再从内到外

### Vue 重写方法来实现数组的劫持

```js
const aryMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
const arrayAugmentations = []
aryMethods.forEach(method => {
  // 这里是原生 Array 的原型方法
  let original = Array.prototype[method]

  // 将 push, pop 等封装好的方法定义在对象 arrayAugmentations 的属性上
  // 注意：是实例属性而非原型属性
  arrayAugmentations[method] = function() {
    console.log('我被改变啦!')

    // 调用对应的原生方法并返回结果
    return original.apply(this, arguments)
  }
})
let list = ['a', 'b', 'c']
// 将我们要监听的数组的原型指针指向上面定义的空数组对象
// 这样就能在调用 push, pop 这些方法时走进我们刚定义的方法，多了一句 console.log
list.__proto__ = arrayAugmentations
list.push('d') // 我被改变啦！
// 这个 list2 是个普通的数组，所以调用 push 不会走到我们的方法里面。
let list2 = ['a', 'b', 'c']
list2.push('d') // 不输出内容
```

### vue-router 原理

说简单点，vue-router 的原理就是通过对 URL 地址变化的监听，继而对不同的组件进行渲染。
每当 URL 地址改变时，就对相应的组件进行渲染。原理是很简单，实现方式可能有点复杂，主要有 hash 模式和 history 模式。

### v-if 和 v-show 的区别

v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。

v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

相比之下，v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。

一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

### vue 在 v-for 时给每项元素绑定事件需要用事件代理吗？为什么

在 vue 中 vue 做了处理
如果我们自己在非 vue 中需要对很多元素添加事件的时候，可以通过将事件添加到它们的父节点而将事件委托给父节点来触发处理函数

### vue 怎么实现页面的权限控制

利用 vue-router 的 beforeEach 事件，可以在跳转页面前判断用户的权限（利用 cookie 或 token），是否能够进入此页面，如果不能则提示错误或重定向到其他页面，在后台管理系统中这种场景经常能遇到。

### keep-alive 有什么作用

在 Vue 中，每次切换组件时，都会重新渲染。如果有多个组件切换，又想让它们保持原来的状态，避免重新渲染，这个时候就可以使用 keep-alive。 keep-alive 可以使被包含的组件保留状态，或避免重新渲染。

### 计算属性有什么作用

先来看一下计算属性的定义：
当其依赖的属性的值发生变化的时，计算属性会重新计算。反之则使用缓存中的属性值。
计算属性和 vue 中的其它数据一样，都是响应式的，只不过它必须依赖某一个数据实现，并且只有它依赖的数据的值改变了，它才会更新。

### $route和$router 的区别

\$route 是路由信息对象，包括 path，params，hash，query，fullPath，matched，name 等路由信息参数。

而 \$router 是路由实例对象，包括了路由的跳转方法，钩子函数等

### watch 的作用是什么

watch 主要作用是监听某个数据值的变化。和计算属性相比除了没有缓存，作用是一样的。

借助 watch 还可以做一些特别的事情，例如监听页面路由，当页面跳转时，我们可以做相应的权限控制，拒绝没有权限的用户访问页面。

### vuex 原理

vuex 的原理其实非常简单，它为什么能实现所有的组件共享同一份数据？
因为 vuex 生成了一个 store 实例，并且把这个实例挂在了所有的组件上，所有的组件引用的都是同一个 store 实例。
store 实例上有数据，有方法，方法改变的都是 store 实例上的数据。由于其他组件引用的是同样的实例，所以一个组件改变了 store 上的数据， 导致另一个组件上的数据也会改变，就像是一个对象的引用。
如果对 vuex 的实现有兴趣，可以看看我自己造的一个 vue 轮子对应的 vuex 插件。它实现了除 vuex 模块外的所有功能。

### react 面试题

1. mixin、hoc、render props、react-hooks 的优劣如何？
1. 你是如何理解 fiber 的?
1. 你对 Time Slice 的理解?
1. react-redux 是如何工作的?
1. redux 与 mobx 的区别?
1. redux 异步中间件之间的优劣?
1. redux 中如何进行异步操作?
1. React 如何进行组件/逻辑复用?
   https://github.com/xiaomuzhu/front-end-interview/blob/master/docs/### guide/react.md
