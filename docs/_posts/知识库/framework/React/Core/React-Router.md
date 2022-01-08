---
title: react-router
date: '2020-10-26'
draft: true
---

### 路由管理

1. react-router 的使用需要注意的问题：
   1. 什么是 hash， history ，browserRouter，
2. Router 组件中嵌套 Route， 何种情况下应该嵌套 Switch，exact 精确的命中 path 渲染组件。
3. react-router ， react-router-dom， 以及 react-router-redux 的区别？

1.History

- 老浏览器的 history: 主要通过 hash 来实现，对应 createHashHistory
- 高版本浏览器: 通过 html5 里面的 history，对应 createBrowserHistory
- node 环境下: 主要存储在 memeory 里面，对应 createMemoryHistory

内部 createHistory 实现：

```js
// 内部的抽象实现
function createHistory(options = {}) {
  // ...
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
  };
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
  // ...
  const historyState = { key };
  // ...
  if (location.action === 'PUSH') {
    window.history.pushState(historyState, null, path);
  } else {
    window.history.replaceState(historyState, null, path);
  }
}
// createHashHistory的内部实现
function finishTransition(location) {
  // ...
  if (location.action === 'PUSH') {
    window.location.hash = path;
  } else {
    window.location.replace(window.location.pathname + window.location.search + '#' + path);
  }
}
// createMemoryHistory的内部实现
const entries = [];
function finishTransition(location) {
  // ...
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

### react 路由懒加载

<!-- https://segmentfault.com/a/1190000011128817
https://segmentfault.com/a/1190000010174260
https://segmentfault.com/a/1190000007141049 -->

### react-router 里的 `<Link>` 标签和 `<a>` 标签有什么区别

如何禁掉 `<a>` 标签默认事件，禁掉之后如何实现跳转。

先看 Link 点击事件 handleClick 部分源码

```js
if (that.props.onClick) that.props.onClick(event);

if (
  !event.defaultPrevented && // onClick prevented default
  event.button === 0 && // ignore everything but left clicks
  !that.props.target && // let browser handle "target=_blank" etc.
  !isModifiedEvent(event) // ignore clicks with modifier keys
) {
  event.preventDefault();

  var history = that.context.router.history;
  var that$props = that.props,
    replace = that$props.replace,
    to = that$props.to;

  if (replace) {
    history.replace(to);
  } else {
    history.push(to);
  }
}
```

Link 做了 3 件事情：

1. 有 onclick 那就执行 onclick
2. click 的时候阻止 a 标签默认事件（这样子点击`[123]()`就不会跳转和刷新页面）
3. 再取得跳转 href（即是 to），用 history（前端路由两种方式之一，history & hash）跳转，此时只是链接变了，并没有刷新页面

### 路由懒加载

[react-loadable](https://github.com/jamiebuilds/react-loadable)

<!-- https://www.jianshu.com/p/697669781276
https://www.cnblogs.com/alan2kat/p/7754846.html -->

```js
const Home = Loadable({ loader: () => import('../routers/Home'), loading: DelayLoading, delay: 3000 });
```
