---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

new Watcher(vm, expFn,)

```js
// watcher
class Watcher {
  constructor() {
    ...
    this.value = his.lazy
        ? undefined
        : this.get();
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

### Set

```js
dep.notify();
```

```js
// 通知订阅者 dep
  notify() {
    const subs = this.subs.slice();
    if (process.env.NODE_ENV !== "production" && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id);
    }
    // 遍历所有的 subs, 每一个 watcher 都需要执行 update()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
```

### computed：

https://segmentfault.com/q/1010000015451612
https://blog.csdn.net/w845386392/article/details/80596574

### Computed setter: 解决方法！

https://segmentfault.com/q/1010000010358438

### Vue computed 实现

- 建立与其他属性（如：data、 Store）的联系；
- 属性改变后，通知计算属性重新计算

> 实现时，主要如下

- 初始化 data， 使用 `Object.defineProperty` 把这些属性全部转为 `getter/setter`。
- 初始化 `computed`, 遍历 `computed` 里的每个属性，每个 computed 属性都是一个 watch 实例。每个属性提供的函数作为属性的 getter，使用 Object.defineProperty 转化。
- `Object.defineProperty getter` 依赖收集。用于依赖发生变化时，触发属性重新计算。
- 若出现当前 computed 计算属性嵌套其他 computed 计算属性时，先进行其他的依赖收集
