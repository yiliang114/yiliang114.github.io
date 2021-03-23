---
title: API
date: '2020-10-26'
draft: true
---

## Computed

有缓存的响应式数据，当其依赖的属性的值发生变化的时，计算属性会重新计算。反之则使用缓存中的属性值。

`new Watcher(vm, expFn,)`

```js
// watcher
class Watcher {
  constructor() {
    // ...
    this.value = his.lazy ? undefined : this.get();
  }
  get() {
    // 压入当前 watcher 到 Dep.target 中
    pushTarget(this);
    let value;
    const vm = this.vm;
    try {
      // 执行 getter 的时候，拿 computed 举例， expFn 就是 computed 表达式，执行一遍
      // 就会触发表达式中的 props 或者 data 的观察的对象的 getter
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`);
      } else {
        throw e;
      }
    } finally {
      if (this.deep) {
        traverse(value);
      }
      this.cleanupDeps();
    }
    return value;
  }
}
```

pushTarget 设置的是一个 watcher 实例，携带一个 expFn ， 也就是依赖的函数或者说，值改变之后需要重新执行的函数。此时 Dep.target 就是这个实例值。

每一个被观察的属性，都会声明一个 Dep 类来收集依赖。 getter 函数中会执行

```js
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        // 依赖收集
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          //  `Observer` 类在定义响应式属性时对于纯对象和数组的处理方式是不同
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    }
   }
  }
```

```js
dep.depend();
```

```js
// Dep.js
depend() {
    if (Dep.target) {
    	// 加入当前实例
      Dep.target.addDep(this);
    }
  }
```

```js
// Watcher.js
  addDep(dep: Dep) {
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
     	  // 依赖中加入 watcher
        dep.addSub(this);
      }
    }
  }

  // 也就是说， 整个过程就是 watcher.addDep(dep), dep.addSub(watcher)
```

## Watch

watch 主要作用是监听某个数据值的变化。和计算属性相比除了没有缓存，作用是一样的。

### computed 和 watch 区别

`computed` 是计算属性，依赖其他属性计算值，并且 `computed` 的值有缓存，只有当计算值变化才会返回内容。

`watch` 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。

所以一般来说需要依赖别的属性来动态获得值的时候可以使用 `computed`，对于监听到值的变化需要做一些复杂业务逻辑的情况可以使用 `watch`。

## Data

### Vue 组件 data 为什么必须是函数

组件复用时所有组件实例都会共享 `data`，如果 `data` 是对象的话，就会造成一个组件修改 `data` 以后会影响到其他所有组件，所以需要将 `data` 写成函数，每次用到就调用一次函数获得新的数据。

使用 `new Vue()` 的方式的时候，无论我们将 `data` 设置为对象还是函数都是可以的，因为 `new Vue()` 的方式是生成一个根组件，该组件不会复用，也就不存在共享 `data` 的情况了。
