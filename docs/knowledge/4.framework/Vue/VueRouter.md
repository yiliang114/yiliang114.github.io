---
title: VueRouter
date: '2020-10-26'
draft: true
---

## VueRouter

有两种形式的路由：

1. hash 模式
2. history 模式. History 模式是 HTML5 新推出的功能，比之 Hash URL 更加美观

哈希值发生变化时，不会向服务器请求数据，可以通过 `hashchange` 事件来监听到 URL 的变化，从而进行跳转页面。

前端路由实现起来其实很简单，本质就是监听 URL 的变化，然后匹配路由规则，继而对不同的组件进行渲染，显示相应的页面，并且无须刷新。

## 源码解析

### 路由初始化

当根组件调用 `beforeCreate` 钩子函数时，会执行以下代码

```js
beforeCreate () {
// 只有根组件有 router 属性，所以根组件初始化时会初始化路由
  if (isDef(this.$options.router)) {
    this._routerRoot = this
    this._router = this.$options.router
    this._router.init(this)
    Vue.util.defineReactive(this, '_route', this._router.history.current)
  } else {
    this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
  }
  registerInstance(this, this)
}
```

接下来看下路由初始化会做些什么

```js
init(app /* Vue component instance */) {
    // 保存组件实例
    this.apps.push(app)
    // 如果根组件已经有了就返回
    if (this.app) {
      return
    }
    this.app = app
    // 赋值路由模式
    const history = this.history
    // 判断路由模式，以哈希模式为例
    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      // 添加 hashchange 监听
      const setupHashListener = () => {
        history.setupListeners()
      }
      // 路由跳转
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }
    // 该回调会在 transitionTo 中调用
    // 对组件的 _route 属性进行赋值，触发组件渲染
    history.listen(route => {
      this.apps.forEach(app => {
        app._route = route
      })
    })
  }
```

在路由初始化时，核心就是进行路由的跳转，改变 URL 然后渲染对应的组件。接下来来看一下路由是如何进行跳转的。

### 路由跳转

```js
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  // 获取匹配的路由信息
  const route = this.router.match(location, this.current)
  // 确认切换路由
  this.confirmTransition(route, () => {
    // 以下为切换路由成功或失败的回调
    // 更新路由信息，对组件的 _route 属性进行赋值，触发组件渲染
    // 调用 afterHooks 中的钩子函数
    this.updateRoute(route)
    // 添加 hashchange 监听
    onComplete && onComplete(route)
    // 更新 URL
    this.ensureURL()
    // 只执行一次 ready 回调
    if (!this.ready) {
      this.ready = true
      this.readyCbs.forEach(cb => { cb(route) })
    }
  }, err => {
  // 错误处理
    if (onAbort) {
      onAbort(err)
    }
    if (err && !this.ready) {
      this.ready = true
      this.readyErrorCbs.forEach(cb => { cb(err) })
    }
  })
}
```

在路由跳转中，需要先获取匹配的路由信息，所以先来看下如何获取匹配的路由信息

```js
function match(raw: RawLocation, currentRoute?: Route, redirectedFrom?: Location): Route {
  // 序列化 url
  // 比如对于该 url 来说 /abc?foo=bar&baz=qux#hello
  // 会序列化路径为 /abc
  // 哈希为 #hello
  // 参数为 foo: 'bar', baz: 'qux'
  const location = normalizeLocation(raw, currentRoute, false, router);
  const { name } = location;
  // 如果是命名路由，就判断记录中是否有该命名路由配置
  if (name) {
    const record = nameMap[name];
    // 没找到表示没有匹配的路由
    if (!record) return _createRoute(null, location);
    const paramNames = record.regex.keys.filter(key => !key.optional).map(key => key.name);
    // 参数处理
    if (typeof location.params !== 'object') {
      location.params = {};
    }
    if (currentRoute && typeof currentRoute.params === 'object') {
      for (const key in currentRoute.params) {
        if (!(key in location.params) && paramNames.indexOf(key) > -1) {
          location.params[key] = currentRoute.params[key];
        }
      }
    }
    if (record) {
      location.path = fillParams(record.path, location.params, `named route "${name}"`);
      return _createRoute(record, location, redirectedFrom);
    }
  } else if (location.path) {
    // 非命名路由处理
    location.params = {};
    for (let i = 0; i < pathList.length; i++) {
      // 查找记录
      const path = pathList[i];
      const record = pathMap[path];
      // 如果匹配路由，则创建路由
      if (matchRoute(record.regex, location.path, location.params)) {
        return _createRoute(record, location, redirectedFrom);
      }
    }
  }
  // 没有匹配的路由
  return _createRoute(null, location);
}
```

接下来看看如何创建路由

```js
// 根据条件创建不同的路由
function _createRoute(record: ?RouteRecord, location: Location, redirectedFrom?: Location): Route {
  if (record && record.redirect) {
    return redirect(record, redirectedFrom || location);
  }
  if (record && record.matchAs) {
    return alias(record, location, record.matchAs);
  }
  return createRoute(record, location, redirectedFrom, router);
}

export function createRoute(
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter,
): Route {
  const stringifyQuery = router && router.options.stringifyQuery;
  // 克隆参数
  let query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}
  // 创建路由对象
  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : [],
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery);
  }
  // 让路由对象不可修改
  return Object.freeze(route);
}
// 获得包含当前路由的所有嵌套路径片段的路由记录
// 包含从根路由到当前路由的匹配记录，从上至下
function formatMatch(record: ?RouteRecord): Array<RouteRecord> {
  const res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res;
}
```

至此匹配路由已经完成，我们回到 `transitionTo` 函数中，接下来执行 `confirmTransition`

```js
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  // 确认切换路由
  this.confirmTransition(route, () => {}
}
confirmTransition(route: Route, onComplete: Function, onAbort?: Function) {
  const current = this.current
  // 中断跳转路由函数
  const abort = err => {
    if (isError(err)) {
      if (this.errorCbs.length) {
        this.errorCbs.forEach(cb => {
          cb(err)
        })
      } else {
        warn(false, 'uncaught error during route navigation:')
        console.error(err)
      }
    }
    onAbort && onAbort(err)
  }
  // 如果是相同的路由就不跳转
  if (
    isSameRoute(route, current) &&
    route.matched.length === current.matched.length
  ) {
    this.ensureURL()
    return abort()
  }
  // 通过对比路由解析出可复用的组件，需要渲染的组件，失活的组件
  const { updated, deactivated, activated } = resolveQueue(
    this.current.matched,
    route.matched
  )

  function resolveQueue(
      current: Array<RouteRecord>,
      next: Array<RouteRecord>
    ): {
      updated: Array<RouteRecord>,
      activated: Array<RouteRecord>,
      deactivated: Array<RouteRecord>
    } {
      let i
      const max = Math.max(current.length, next.length)
      for (i = 0; i < max; i++) {
        // 当前路由路径和跳转路由路径不同时跳出遍历
        if (current[i] !== next[i]) {
          break
        }
      }
      return {
        // 可复用的组件对应路由
        updated: next.slice(0, i),
        // 需要渲染的组件对应路由
        activated: next.slice(i),
        // 失活的组件对应路由
        deactivated: current.slice(i)
      }
  }
  // 导航守卫数组
  const queue: Array<?NavigationGuard> = [].concat(
    // 失活的组件钩子
    extractLeaveGuards(deactivated),
    // 全局 beforeEach 钩子
    this.router.beforeHooks,
    // 在当前路由改变，但是该组件被复用时调用
    extractUpdateHooks(updated),
    // 需要渲染组件 enter 守卫钩子
    activated.map(m => m.beforeEnter),
    // 解析异步路由组件
    resolveAsyncComponents(activated)
  )
  // 保存路由
  this.pending = route
  // 迭代器，用于执行 queue 中的导航守卫钩子
  const iterator = (hook: NavigationGuard, next) => {
  // 路由不相等就不跳转路由
    if (this.pending !== route) {
      return abort()
    }
    try {
    // 执行钩子
      hook(route, current, (to) => {
        // 只有执行了钩子函数中的 next，才会继续执行下一个钩子函数
        // 否则会暂停跳转
        // 以下逻辑是在判断 next() 中的传参
        if (to === false || isError(to)) {
          // next(false)
          this.ensureURL(true)
          abort(to)
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' &&
            (typeof to.path === 'string' || typeof to.name === 'string'))
        ) {
        // next('/') 或者 next({ path: '/' }) -> 重定向
          abort()
          if (typeof to === 'object' && to.replace) {
            this.replace(to)
          } else {
            this.push(to)
          }
        } else {
        // 这里执行 next
        // 也就是执行下面函数 runQueue 中的 step(index + 1)
          next(to)
        }
      })
    } catch (e) {
      abort(e)
    }
  }
  // 经典的同步执行异步函数
  runQueue(queue, iterator, () => {
    const postEnterCbs = []
    const isValid = () => this.current === route
    // 当所有异步组件加载完成后，会执行这里的回调，也就是 runQueue 中的 cb()
    // 接下来执行 需要渲染组件的导航守卫钩子
    const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid)
    const queue = enterGuards.concat(this.router.resolveHooks)
    runQueue(queue, iterator, () => {
    // 跳转完成
      if (this.pending !== route) {
        return abort()
      }
      this.pending = null
      onComplete(route)
      if (this.router.app) {
        this.router.app.$nextTick(() => {
          postEnterCbs.forEach(cb => {
            cb()
          })
        })
      }
    })
  })
}
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
  // 队列中的函数都执行完毕，就执行回调函数
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
      // 执行迭代器，用户在钩子函数中执行 next() 回调
      // 回调中判断传参，没有问题就执行 next()，也就是 fn 函数中的第二个参数
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  // 取出队列中第一个钩子函数
  step(0)
}
```

接下来介绍导航守卫

```js
const queue: Array<?NavigationGuard> = [].concat(
  // 失活的组件钩子
  extractLeaveGuards(deactivated),
  // 全局 beforeEach 钩子
  this.router.beforeHooks,
  // 在当前路由改变，但是该组件被复用时调用
  extractUpdateHooks(updated),
  // 需要渲染组件 enter 守卫钩子
  activated.map(m => m.beforeEnter),
  // 解析异步路由组件
  resolveAsyncComponents(activated),
);
```

第一步是先执行失活组件的钩子函数

```js
function extractLeaveGuards(deactivated: Array<RouteRecord>): Array<?Function> {
  // 传入需要执行的钩子函数名
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true);
}
function extractGuards(records: Array<RouteRecord>, name: string, bind: Function, reverse?: boolean): Array<?Function> {
  const guards = flatMapComponents(records, (def, instance, match, key) => {
    // 找出组件中对应的钩子函数
    const guard = extractGuard(def, name);
    if (guard) {
      // 给每个钩子函数添加上下文对象为组件自身
      return Array.isArray(guard)
        ? guard.map(guard => bind(guard, instance, match, key))
        : bind(guard, instance, match, key);
    }
  });
  // 数组降维，并且判断是否需要翻转数组
  // 因为某些钩子函数需要从子执行到父
  return flatten(reverse ? guards.reverse() : guards);
}
export function flatMapComponents(matched: Array<RouteRecord>, fn: Function): Array<?Function> {
  // 数组降维
  return flatten(
    matched.map(m => {
      // 将组件中的对象传入回调函数中，获得钩子函数数组
      return Object.keys(m.components).map(key => fn(m.components[key], m.instances[key], m, key));
    }),
  );
}
```

第二步执行全局 beforeEach 钩子函数

```js
beforeEach(fn: Function): Function {
    return registerHook(this.beforeHooks, fn)
}
function registerHook(list: Array<any>, fn: Function): Function {
  list.push(fn)
  return () => {
    const i = list.indexOf(fn)
    if (i > -1) list.splice(i, 1)
  }
}
```

在 VueRouter 类中有以上代码，每当给 VueRouter 实例添加 beforeEach 函数时就会将函数 push 进 beforeHooks 中。

第三步执行 `beforeRouteUpdate` 钩子函数，调用方式和第一步相同，只是传入的函数名不同，在该函数中可以访问到 `this` 对象。

第四步执行 `beforeEnter` 钩子函数，该函数是路由独享的钩子函数。

第五步是解析异步组件。

```js
export function resolveAsyncComponents(matched: Array<RouteRecord>): Function {
  return (to, from, next) => {
    let hasAsync = false;
    let pending = 0;
    let error = null;
    // 该函数作用之前已经介绍过了
    flatMapComponents(matched, (def, _, match, key) => {
      // 判断是否是异步组件
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;
        // 成功回调
        // once 函数确保异步组件只加载一次
        const resolve = once(resolvedDef => {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // 判断是否是构造函数
          // 不是的话通过 Vue 来生成组件构造函数
          def.resolved = typeof resolvedDef === 'function' ? resolvedDef : _Vue.extend(resolvedDef);
          // 赋值组件
          // 如果组件全部解析完毕，继续下一步
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });
        // 失败回调
        const reject = once(reason => {
          const msg = `Failed to resolve async component ${key}: ${reason}`;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason) ? reason : new Error(msg);
            next(error);
          }
        });
        let res;
        try {
          // 执行异步组件函数
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          // 下载完成执行回调
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            const comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });
    // 不是异步组件直接下一步
    if (!hasAsync) next();
  };
}
```

以上就是第一个 `runQueue` 中的逻辑，第五步完成后会执行第一个 `runQueue` 中回调函数

```js
// 该回调用于保存 `beforeRouteEnter` 钩子中的回调函数
const postEnterCbs = [];
const isValid = () => this.current === route;
// beforeRouteEnter 导航守卫钩子
const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
// beforeResolve 导航守卫钩子
const queue = enterGuards.concat(this.router.resolveHooks);
runQueue(queue, iterator, () => {
  if (this.pending !== route) {
    return abort();
  }
  this.pending = null;
  // 这里会执行 afterEach 导航守卫钩子
  onComplete(route);
  if (this.router.app) {
    this.router.app.$nextTick(() => {
      postEnterCbs.forEach(cb => {
        cb();
      });
    });
  }
});
```

第六步是执行 `beforeRouteEnter` 导航守卫钩子，`beforeRouteEnter` 钩子不能访问 `this` 对象，因为钩子在导航确认前被调用，需要渲染的组件还没被创建。但是该钩子函数是唯一一个支持在回调中获取 `this` 对象的函数，回调会在路由确认执行。

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```

下面来看看是如何支持在回调中拿到 `this` 对象的

```js
function extractEnterGuards(
  activated: Array<RouteRecord>,
  cbs: Array<Function>,
  isValid: () => boolean,
): Array<?Function> {
  // 这里和之前调用导航守卫基本一致
  return extractGuards(activated, 'beforeRouteEnter', (guard, _, match, key) => {
    return bindEnterGuard(guard, match, key, cbs, isValid);
  });
}
function bindEnterGuard(
  guard: NavigationGuard,
  match: RouteRecord,
  key: string,
  cbs: Array<Function>,
  isValid: () => boolean,
): NavigationGuard {
  return function routeEnterGuard(to, from, next) {
    return guard(to, from, cb => {
      // 判断 cb 是否是函数
      // 是的话就 push 进 postEnterCbs
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(() => {
          // 循环直到拿到组件实例
          poll(cb, match.instances, key, isValid);
        });
      }
    });
  };
}
// 该函数是为了解决 issus #750
// 当 router-view 外面包裹了 mode 为 out-in 的 transition 组件
// 会在组件初次导航到时获得不到组件实例对象
function poll(
  cb, // somehow flow cannot infer this is a function
  instances: Object,
  key: string,
  isValid: () => boolean,
) {
  if (
    instances[key] &&
    !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
  ) {
    cb(instances[key]);
  } else if (isValid()) {
    // setTimeout 16ms 作用和 nextTick 基本相同
    setTimeout(() => {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}
```

第七步是执行 `beforeResolve` 导航守卫钩子，如果注册了全局 `beforeResolve` 钩子就会在这里执行。

第八步就是导航确认，调用 `afterEach` 导航守卫钩子了。

以上都执行完成后，会触发组件的渲染

```js
history.listen(route => {
  this.apps.forEach(app => {
    app._route = route;
  });
});
```

以上回调会在 `updateRoute` 中调用

```js
updateRoute(route: Route) {
    const prev = this.current
    this.current = route
    this.cb && this.cb(route)
    this.router.afterHooks.forEach(hook => {
      hook && hook(route, prev)
    })
}
```

至此，路由跳转已经全部分析完毕。核心就是判断需要跳转的路由是否存在于记录中，然后执行各种导航守卫函数，最后完成 URL 的改变和组件的渲染。

单页应用，如何实现其路由功能

## 路由原理

hash 主要依赖 location.hash 来改动 URL,达到不刷新跳转的效果.每次 hash 改变都会触发 hashchange 事件(来响应路由的变化,比如页面的更换)
history 主要利用了 HTML5 的 historyAPI 来实现,用 pushState 和 replaceState 来操作浏览历史记录栈

#### hash

hash 出现在 URL 中，但不会被包含在 http 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。

特点：hash 虽然在 URL 中，但不被包括在 HTTP 请求中；用来指导浏览器动作，hash 不会重加载页面。

window.location.hash = route.fullPath

执行 router.push(url) 的操作的时候， 会执行 updateRoute 函数， 通过一个全局 mixins 会执行 this.\_route = route 这样一个操作。因为 `_route` 是响应式的，所以就会重新执行 render 函数 ？？ （好像这逻辑有问题）

`www.test.com/#/` 就是 Hash URL，当 `#` 后面的哈希值发生变化时，可以通过 `hashchange` 事件来监听到 URL 的变化，从而进行跳转页面，并且无论哈希值如何变化，服务端接收到的 URL 请求永远是 `www.test.com`。

```js
window.addEventListener('hashchange', () => {
  // ... 具体逻辑
});
```

Hash 模式相对来说更简单，并且兼容性也更好。

#### history

主要是两个 api:

- pushState
- popState

执行 router.push(url) 的操作的时候，会执行 pushState(url) 这样的操作，直接更新一个状态。

History 模式是 HTML5 新推出的功能，主要使用 `history.pushState` 和 `history.replaceState` 改变 URL。

通过 History 模式改变 URL 同样不会引起页面的刷新，只会更新浏览器的历史记录。

```js
// 新增历史记录
history.pushState(stateObject, title, URL);
// 替换当前历史记录
history.replaceState(stateObject, title, URL);
```

当用户做出浏览器动作时，比如点击后退按钮时会触发 `popState` 事件

```js
window.addEventListener('popstate', e => {
  // e.state 就是 pushState(stateObject) 中的 stateObject
  console.log(e.state);
});
```

history 利用了 html5 history interface 中新增的 pushState() 和 replaceState() 方法。这两个方法应用于浏览器记录栈，在当前已有的 back、forward、go 基础之上，它们提供了对历史记录修改的功能。只是当它们执行修改时，虽然改变了当前的 URL ，但浏览器不会立即向后端发送请求。

原理：
hash 模式的原理是 onhashchange 事件，可以在 window 对象上监听这个事件。
history ：hashchange 只能改变 ## 后面的代码片段，history api （pushState、replaceState、go、back、forward） 则给了前端完全的自由，通过在 window 对象上监听 popState()事件。

$route是“路由信息对象”，包括path，params，hash，query，fullPath，matched，name等路由信息参数。
$router 是“路由实例”对象包括了路由的跳转方法，钩子函数等。

1. 一个是 hash, 一个看起来像真实的路径
2. hash 值不会被带到服务器上去
3. push 的时候实现原理不一样
   1. hash 模式的话，主要是将 location.hash = route.fullPath

#### 如何做到修改 url 参数页面不刷新

HTML5 引入了 history.pushState() 和 history.replaceState() 方法，它们分别可以添加和修改历史记录条目。

```js
let stateObj = {
  foo: 'bar',
};

history.pushState(stateObj, 'page 2', 'bar.html');
```

假设当前页面为 foo.html，执行上述代码后会变为 bar.html，点击浏览器后退，会变为 foo.html，但浏览器并不会刷新。 pushState() 需要三个参数: 一个状态对象, 一个标题 (目前被忽略), 和 (可选的) 一个 URL. 让我们来解释下这三个参数详细内容：

状态对象 — 状态对象 state 是一个 JavaScript 对象，通过 pushState () 创建新的历史记录条目。无论什么时候用户导航到新的状态，popstate 事件就会被触发，且该事件的 state 属性包含该历史记录条目状态对象的副本。状态对象可以是能被序列化的任何东西。原因在于 Firefox 将状态对象保存在用户的磁盘上，以便在用户重启浏览器时使用，我们规定了状态对象在序列化表示后有 640k 的大小限制。如果你给 pushState() 方法传了一个序列化后大于 640k 的状态对象，该方法会抛出异常。如果你需要更大的空间，建议使用 sessionStorage 以及 localStorage.
标题 — Firefox 目前忽略这个参数，但未来可能会用到。传递一个空字符串在这里是安全的，而在将来这是不安全的。二选一的话，你可以为跳转的 state 传递一个短标题。
URL — 该参数定义了新的历史 URL 记录。注意，调用 pushState() 后浏览器并不会立即加载这个 URL，但可能会在稍后某些情况下加载这个 URL，比如在用户重新打开浏览器时。新 URL 不必须为绝对路径。如果新 URL 是相对路径，那么它将被作为相对于当前 URL 处理。新 URL 必须与当前 URL 同源，否则 pushState() 会抛出一个异常。该参数是可选的，缺省为当前 URL。

#### 两种模式对比

- Hash 模式只可以更改 `#` 后面的内容，History 模式可以通过 API 设置任意的同源 URL
- History 模式可以通过 API 添加任意类型的数据到历史记录中，Hash 模式只能更改哈希值，也就是字符串
- Hash 模式无需后端配置，并且兼容性好。History 模式在用户手动输入地址或者刷新页面的时候会发起 URL 请求，后端需要配置 `index.html` 页面用于匹配不到静态资源的时候

1. 一个是 hash, 一个看起来像真实的路径
2. hash 值不会被带到服务器上去
3. push 的时候实现原理不一样
   1. hash 模式的话，主要是将 location.hash = route.fullPath

哈希路由的哈希值 nginx 不能收到。全部的操作、页面的变化都只存在于浏览器上。

#### router 的动态路由

```js
router.addRoutes(routes(formatterRoutes, formatterMenus)); // 动态路由
```

## 常见问题

### $route 和 $router 的区别

`$route` 是路由信息对象，包括 path，params，hash，query，fullPath，matched，name 等路由信息参数。而 `$router` 是路由实例对象，包括了路由的跳转方法，钩子函数等。

### 路由跳转

- 声明式（标签跳转） `<router-link :to="index">`
- 编程式（ js 跳转） `router.push('index')`

### 导航钩子

三种

- 全局导航钩子
  - router.beforeEach(to, from, next),
  - router.beforeResolve(to, from, next),
  - router.afterEach(to, from ,next)
- 组件内钩子
  - beforeRouteEnter,
  - beforeRouteUpdate,
  - beforeRouteLeave
- 单独路由独享组件
  - beforeEnter

首页可以控制导航跳转，beforeEach，afterEach 等，一般用于页面 title 的修改。一些需要登录才能调整页面的重定向功能。

- beforeEach 主要有 3 个参数 to，from，next：
- to：route 即将进入的目标路由对象，
- from：route 当前导航正要离开的路由
- next：function 一定要调用该方法 resolve 这个钩子。执行效果依赖 next 方法的调用参数。可以控制网页的跳转。

### vue 怎么实现页面的权限控制

利用 vue-router 的 beforeEach 事件，可以在跳转页面前判断用户的权限（利用 cookie 或 token），是否能够进入此页面，如果不能则提示错误或重定向到其他页面，在后台管理系统中这种场景经常能遇到。

router 的全局守卫可以放一个全局鉴权。但是需要注意的是， App.vue 的 mounted 和 created 执行的额时机都要比守卫函数执行的早 ？ App.vue 里面的逻辑应该有一部分不能被阻塞

router.beforeEach 能否 async

#### router 的权限

1. 方案一： 维护一个统一的路由，根据用户的权限，过滤得到有权限的路由，只注册有权限的路由
2. 方案二：注册全部的路由，通过 meta 属性以及 router 的守卫，每次进入路由之前去校验是否有权限。

#### vue-router 的监听原理

前端路由实现起来其实很简单，本质就是监听 URL 的变化，然后匹配路由规则，显示相应的页面，并且无须刷新。目前单页面使用的路由就只有两种实现方式

- hash 模式
- history 模式

##### hash

`www.test.com/#/` 就是 Hash URL，当 `#` 后面的哈希值发生变化时，不会向服务器请求数据，可以通过 `hashchange` 事件来监听到 URL 的变化，从而进行跳转页面。

##### history

主要是两个 api:

- pushState
- popState

执行 router.push(url) 的操作的时候，会执行 pushState(url) 这样的操作，直接更新一个状态。当用户做出浏览器动作时，比如点击后退按钮时会触发 `popState` 事件. 状态会直接通过 `history.state.key` 获取，通过 `router-view` 这个抽象组件来渲染不同组件。

但是 pushState 这个 api 有一定的兼容性问题，ie10 以上 safari6 以上 安卓 4.2 以上。。不行的话只能使用 hash 模式。

pushState() 需要三个参数: 一个状态对象, 一个标题 (目前被忽略), 和 (可选的) 一个 URL。

##### updateRoute

执行 router.push(url) 的操作的时候， 会执行 updateRoute 函数， 通过一个全局 mixins 会执行 this.\_route = route 这样一个操作。因为 `_route` 是响应式的，router-view 组件内部使用到了这个值，所以就会重新执行 render 函数。

#### router 的哈希模式与 history 有什么不同，hash 值能被监听改变么？

1. 一个是 hash, 一个看起来像真实的路径
2. hash 值不会被带到服务器上去
3. push 的时候实现原理不一样
   1. hash 模式的话，主要是将 location.hash = route.fullPath