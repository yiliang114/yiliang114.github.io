---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### mobx 一个天坑

如果对数组要求严格的地方，一定要记得将 observable 的数组 （实际上是个 object）转化为 Array

#### mobx

https://www.jianshu.com/p/505d9d9fe36a

#### mobx 最佳实践

https://segmentfault.com/a/1190000009412641

https://www.jianshu.com/p/2fb42dee32dd

#### extendObservable

扩展可观察对象

# mobx 解决 redux 的痛点

第一点，mobx 中数据的每一次更新，都会定点的重绘特定组件，整个过程不需要`shouldComponentUpdate`的参与。`<App />`中的所有组件都不在需要再管理重绘剪枝。

第二点，如果需要更新内层数据，只需像下方的代码一样，直接赋值。重绘操作会自动进行：

```
appInfo.list[0].roomInfo.rateList[0].score = 90;
```

## mobx 定时向服务端同步数据：

```
reaction(
    () => this.toJS(),
    todo => fetch('/todos/' + todo.id, {
        method: 'PUT',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(todo)
    })
)
```

## react 性能优化

在使用 react 的过程中，我们绕不开渲染性能优化问题，因为默认情况下 react 组件的 shouldComponentUpdate 函数会一直返回 true，这回导致所有的组件都会进行耗时的虚拟 DOM 比较。在使用 redux 作为 react 的逻辑层框架时，我们可以使用经典的 PureComponent+ShallowCompare 的方式进行渲染性能优化。

那么在使用 mobx 作为 react 的 store 时，我们该如何进行渲染性能优化呢？

### 路由懒加载

[react-loadable](https://github.com/jamiebuilds/react-loadable)

https://www.jianshu.com/p/697669781276

https://www.cnblogs.com/alan2kat/p/7754846.html

```
const Home = Loadable({ loader: () => import('../routers/Home'), loading: DelayLoading, delay: 3000 })
```

### React 高阶组件（Higher-Order Components）

高阶组件定义：

```
a higher-order component is a function that takes a component and returns a new component.
```

高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件。

http://react-china.org/t/react-higher-order-components/14949

### 区分 mobx 中的数组和对象

因为 element instanceof Object 数组和对象都是 true
