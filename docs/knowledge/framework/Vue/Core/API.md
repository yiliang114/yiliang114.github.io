---
title: API
date: '2020-10-26'
draft: true
---

## Computed

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

### 通知

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

### Computed setter 解决方法

```js
computed: {
  route: {
    get(){
      return this.$store.state.curTab.route
    },
    set(val){}
  }
}
```

### Vue computed 实现

- 建立与其他属性（如：data、 Store）的联系；
- 属性改变后，通知计算属性重新计算

> 实现时，主要如下

- 初始化 data， 使用 `Object.defineProperty` 把这些属性全部转为 `getter/setter`。
- 初始化 `computed`, 遍历 `computed` 里的每个属性，每个 computed 属性都是一个 watch 实例。每个属性提供的函数作为属性的 getter，使用 Object.defineProperty 转化。
- `Object.defineProperty getter` 依赖收集。用于依赖发生变化时，触发属性重新计算。
- 若出现当前 computed 计算属性嵌套其他 computed 计算属性时，先进行其他的依赖收集

### 计算属性有什么作用

先来看一下计算属性的定义：
当其依赖的属性的值发生变化的时，计算属性会重新计算。反之则使用缓存中的属性值。
计算属性和 vue 中的其它数据一样，都是响应式的，只不过它必须依赖某一个数据实现，并且只有它依赖的数据的值改变了，它才会更新。

### 计算属性有什么作用

先来看一下计算属性的定义：
当其依赖的属性的值发生变化的时，计算属性会重新计算。反之则使用缓存中的属性值。
计算属性和 vue 中的其它数据一样，都是响应式的，只不过它必须依赖某一个数据实现，并且只有它依赖的数据的值改变了，它才会更新。

## Watch

### watch 的作用是什么

watch 主要作用是监听某个数据值的变化。和计算属性相比除了没有缓存，作用是一样的。

借助 watch 还可以做一些特别的事情，例如监听页面路由，当页面跳转时，我们可以做相应的权限控制，拒绝没有权限的用户访问页面。

### computed 和 watch 区别

`computed` 是计算属性，依赖其他属性计算值，并且 `computed` 的值有缓存，只有当计算值变化才会返回内容。

`watch` 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。

所以一般来说需要依赖别的属性来动态获得值的时候可以使用 `computed`，对于监听到值的变化需要做一些复杂业务逻辑的情况可以使用 `watch`。

另外 `computed` 和 `watch` 还都支持对象的写法，这种方式知道的人并不多。

```js
vm.$watch('obj', {
  // 深度遍历
  deep: true,
  // 立即触发
  immediate: true,
  // 执行的函数
  handler: function(val, oldVal) {},
});
var vm = new Vue({
  data: { a: 1 },
  computed: {
    aPlus: {
      // this.aPlus 时触发
      get: function() {
        return this.a + 1;
      },
      // this.aPlus = 1 时触发
      set: function(v) {
        this.a = v - 1;
      },
    },
  },
});
```

## Filter

### vue 如何自定义一个过滤器？

```html
<div id="app">
  <input type="text" v-model="msg" />
  {{msg| capitalize }}
</div>
```

```js
var vm = new Vue({
  el: '#app',
  data: {
    msg: '',
  },
  filters: {
    capitalize: function(value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
});
```

全局定义过滤器

```js
Vue.filter('capitalize', function(value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});
```

过滤器接收表达式的值 (msg) 作为第一个参数。capitalize 过滤器将会收到 msg 的值作为第一个参数。

## Data

### Vue 组件 data 为什么必须是函数

- 每个组件都是 Vue 的实例。
- 组件共享 data 属性，当 data 的值是同一个引用类型的值时，改变其中一个会影响其他

组件中的 data 写成一个函数，数据以函数返回值形式定义，这样每复用一次组件，就会返回一份新的 data。如果单纯的写成对象形式，就使得所有组件实例共用了一份 data，造成了数据污染。

组件复用时所有组件实例都会共享 `data`，如果 `data` 是对象的话，就会造成一个组件修改 `data` 以后会影响到其他所有组件，所以需要将 `data` 写成函数，每次用到就调用一次函数获得新的数据。

当我们使用 `new Vue()` 的方式的时候，无论我们将 `data` 设置为对象还是函数都是可以的，因为 `new Vue()` 的方式是生成一个根组件，该组件不会复用，也就不存在共享 `data` 的情况了。
