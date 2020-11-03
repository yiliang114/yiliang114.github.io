---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# mobx

mobx 是一个状态管理工具，可以把应用变为响应式。

# 核心概念

## observable state （可观察状态）

ES7 装饰器： @observable

```
class Todo {
  @observable name = 'yiliang'
}
```

## derivation (衍生)

所有可以通过 state 自动计算出来的值都算衍生，这些推导或计算的值，范围包括从简单的值（如未完成的 todo 数量），到复杂的值（如一个表示 todo 的可视化 html）。

- computed values ：从当前可观察状态中衍生出的值。

### computed values

当依赖数据变化时会自动计算更新。通过@computed 装饰器调用的 setter / getter 函数进行使用。

```
class Todo {
  @observable name = 'yiliang'
  @computed get getNameLength() {
    return this.name.length
  }
}
```

## reactions (响应)

与衍生很类似，主要的区别是 reactions 这些函数不产生值，而是自动地执行一些任务，这些任务通过与 IO 相关。他们保证了在正确的时间自动地更新 DOM 或者发起网络请求。

## actions （动作）

Mobx 里启用严格模式 “ useStrict ”时，只有在 actions 中，才可以修改 mobx 中的 state 值。

注意当使用装饰器模式时，@action 中的 this 没有绑定在当前这个实例上，要用`@action.bound` 来绑定使得 this 绑定在实例对象上。

```
@action.bound setName() {
	this.name = 'yiliang'
}
```

# 实现原理

mobx 最关键的函数在于`autorun`。

```
const obj = observable({
  a:1,
  b:2
})
autorun(() => {
  console.log(obj.a)
})

obj.b = 3 // 没有打印
obj.a = 2 // 控制台输出2
```

`auturun` 这个函数非常智能，用到了什么属性，就会和这个属性挂上钩，只要这个属性改变就会触发回调。没有用到的属性，无论怎么修改都不会触发回调。

## autorun 的用途

使用`autorun`实现`mobx-react`非常简单，核心思想是将 react 组件最外层包上`autorun`，这样代码中所有用到的属性就会被监听，一旦 observable 的数据发生了修改，就直接 forceUpdate（observe 的回调函数就是 react 的 render 函数）重新执行。而且精确命中，效率最高。

## 依赖收集

autoRun 的专业名词叫做依赖收集

Mobx 使用了 Object.defineProperty 拦截 getter 和 setter

https://zhuanlan.zhihu.com/p/25585910?refer=purerender

# MobX-React

上面简单介绍了 mobx 的使用，我们知道 react 组件中 state 变化之后，要通过 setState 来触发视图的更新。mobx 能够为 react 组件定义 state，以及如何修改 state。而`mobx-react` 提供了将 react 组件转变为响应式组件，确保 state 改变时可以强制刷新组件。

```
@observer
class TodoComponent extends React.Component {
  // ...
}
```

# React + MobX 的使用步骤

1. 定义 observable state

   ```
   class Store {
     @observable data = []
     @observable name = ''
     @computed get getData() {
       return data
     }
     @action.bound setName(value) {
       this.name = value
     }
   }
   ```

2. 创建视图。 通过 React 创建视图时，推荐无状态组件，即组件内部没有 state 和生命周期函数，只通过 props 获得数据。

   ```
   @observer
   class MyComponent extends React.Component {

   }
   ```

3. 通过调用 mobx 中的 actions 改变状态

   ```
   @observer
   class MyComponent extends React.Component {
     render() {
       let store = {this.props}
       return (
       	<div>
       		<input onChange={store.setName} />
       	</div>
       )
     }
   }
   ```

   ​

## mobx 零碎的一些知识点

### @observable

在 store 中 带有`@observable` 的是 公共属性？

不再使用 state，而是将数据存储到一个公共的缓存中了，其中缓存中数据的修改都会引起`@observer`中的数据的修改，对应到`React`中就是会导致页面的视图重新渲染．

### 如何避免一次操作（修改多个状态），只渲染一次视图？

todo

### @action

mobx 3.x 版本中的严格模式开启的情况下，要想改变 state 只能通过 action，但是 4.x 移除了 useStrict，如果不开启严格模式的话，在组件的函数中是能够直接修改 state 的，这一点不知道怎么解决？

### @computed 和自定义 get 函数

首先这两者解决方法都会得到一个相同的结果，但使用@computed 的意义在于它能够由 MobX 进行更智能的优化。

如果我不使用 computed 属性，直接使用自定义的 getTheValue 函数的话，那么只要 value 改变，所有用到 getTheValue 函数的地方都将重新计算。

如果使用了@computed get getValue，那么 getValue 将会被缓存，如果 value 没有改变，那么 getValue 也不会改变，其它组件也不会收到通知。

此外如果你读取 getValue 的值，你通常会得到一个缓存的值，而不带@computed 装饰器，则会重新计算。

## ES6 WeakMap

https://blog.csdn.net/qq_30100043/article/details/53462945

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap

<<<<<<< HEAD

### [mobx 源码解读 1](http://www.cnblogs.com/rubylouvre/p/6058045.html)

如何自己实现一个 mobx： https://zhuanlan.zhihu.com/p/26559530

https://www.zhihu.com/question/65851408

# https://www.zhihu.com/collection/133852951

### inject 参数 与 直接 import 的区别

`mobx-react` 包还提供了 `Provider` 组件，它使用了 React 的上下文(context)机制，可以用来向下传递 `stores`。 要连接到这些 stores，需要传递一个 stores 名称的列表给 `inject`，这使得 stores 可以作为组件的 `props` 使用。

_注意: 从 mobx-react 4 开始，注入 stores 的语法发生了变化，应该一直使用 inject(stores)(component)或 @inject(stores) class Component...。 直接传递 store 名称给 observer 的方式已废弃。_

### transaction

尝试用 transaction ，但是不知道为什么一直没有效果。

```
  constructor() {
    this.initData()
  }

  initData = async () => {
    let result = await getBaseInfo()
    runInAction("上面的action修饰不到", () => {
      // console.log('runInAction...')
      this.baseInfo = result.data
    })

    result = await getExtractInfo()
    runInAction("上面的action修饰不到", () => {
      this.extractInfo = result.data
    })

    result = await getExtractStatus()
    runInAction("上面的action修饰不到", () => {
      this.extractStatus = result.data
    })
  }
```

```
  // ????
  constructor() {
    transaction(()=>{
        this.initData()
    })
  }

  initData = async () => {
    let result = await getBaseInfo()
    runInAction("上面的action修饰不到", () => {
      // console.log('runInAction...')
      this.baseInfo = result.data
    })

    result = await getExtractInfo()
    runInAction("上面的action修饰不到", () => {
      this.extractInfo = result.data
    })

    result = await getExtractStatus()
    runInAction("上面的action修饰不到", () => {
      this.extractStatus = result.data
    })
  }
```

## mobx 积累

### runInAction

action 只能影响当前运行的函数，而不能影响函数中的异步回调函数，因此需要对异步回调函数也使用 action 标注。如果是用 async function，则可以使用 runInAction 函数来解决。

```
class Store {
  @observable name = '';
  @action load = async () => {
    const data = await getData();
    runInAction(() => {
this.name = data.name;
    });
  }
}
```

但是 为什么下面这样不行呢？这样就不用额外的 runInAction 了啊 不是很方便么？！！！！！

```
class Store {
  @observable name = '';
  @action load = async () => {
    this.data = await getData();
  }
}
```

### computed

加上@compute 的作用在于可以使用 mobx 的缓存策略自动优化系统，当计算结果不变的情况下，不会引起无用的渲染，有了这个属性，才真的可以做到在 JSX 中只有 render 函数，所有组件需要的数据只有两种：基础数据和可以通过基础数据计算转化的数据。

```
@computed get getValue() {
    return this.value * 10;
  }
  getTheValue() {
    return this.value * 10;
  }
```

https://www.zhihu.com/search?type=content&q=mobx

https://juejin.im/entry/58562b8a8e450a006c9d7db7

https://juejin.im/entry/598306fa6fb9a03c367ced24

https://juejin.im/search?query=mobx

http://react-china.org/search?q=mobx

读文档啊 少年！

http://cn.mobx.js.org/refguide/action.html
