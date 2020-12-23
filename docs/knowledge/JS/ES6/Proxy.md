---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# Proxy 与 Object.defineProperty 的对比

### 前言

> Object.defineProperty() 和 ES2015 中新增的 Proxy 对象,会经常用来做数据劫持(数据劫持:在访问或者修改对象的某个属性时，通过一段代码拦截这个行为，进行额外的操作或者修改返回结果)，数据劫持的典型应用就是我们经常在面试中遇到的双向数据绑定。

### Object.defineProperty

> Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象
> 语法：
>
> Object.defineProperty(obj, prop, descriptor)

- obj：要在其上定义属性的对象。
- prop：要定义或修改的属性的名称。
- descriptor：将被定义或修改的属性描述符。
  >

```js
var o = {}; // 创建一个新对象
// 在对象中添加一个属性与数据描述符的示例
Object.defineProperty(o, 'a', {
  value: 37,
  writable: true,
  enumerable: true,
  configurable: true,
});
// 对象o中有一个值为37的属性a
```

> [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)这样描述属性描述符：
> 数据描述符和存取描述符。数据描述符是一个具有值的属性，该值可能是可写的，也可能不是可写的。存取描述符是由 getter-setter 函数对描述的属性。描述符必须是这两种形式之一；不能同时是两者。两个属性描述符的具体介绍可以查看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#%E5%B1%9E%E6%80%A7%E6%8F%8F%E8%BF%B0%E7%AC%A6)，这里不再缀诉。
> 示例：

```js
// 正确
Object.defineProperty({}, 'a', {
  value: 37,
  writable: true,
  enumerable: true,
  configurable: true,
});
// 正确
var value = 37;
Object.defineProperty({}, 'a', {
  get: function() {
    return value;
  },
  set: function(newValue) {
    value = newValue;
  },
  enumerable: true,
  configurable: true,
}) >
  // 报错
  Object.defineProperty({}, 'a', {
    value: 37,
    get: function() {
      return 1;
    },
  });
```

>

#### Setters 和 Getters

> 下面的例子展示了如何实现一个自存档对象。 当设置 temperature 属性时，archive 数组会获取日志条目

```js
function Archiver() {
  var temperature = null
  var archive = []
>
  Object.defineProperty(this, 'temperature', {
    get: function() {
      console.log('get!')
      return temperature
    },
    set: function(value) {
      console.log('set!')
      temperature = value
      archive.push({ val: temperature })
    }
  })
>
  this.getArchive = function() {
    return archive
  }
}
>
var arc = new Archiver()
arc.temperature // 'get!'
arc.temperature = 11 // 'set!'
arc.temperature = 13 // 'set!'
arc.getArchive() // [{ val: 11 }, { val: 13 }]
```

>

### 存在对问题

> 一、不能监听数组的变化
> 数组的以下几个方法不会触发 set,push、pop、shift、unshift、splice、sort、reverse

```js
let arr = [1, 2, 3];
let obj = {};
Object.defineProperty(obj, 'arr', {
  get() {
    console.log('get arr');
    return arr;
  },
  set(newVal) {
    console.log('set', newVal);
    arr = newVal;
  },
});
obj.arr.push(4); // 只会打印 get arr, 不会打印 set
obj.arr = [1, 2, 3, 4]; // 这个能正常 set
```

> 二、必须遍历对象的每个属性
> 使用 Object.defineProperty() 多数要配合 Object.keys() 和遍历，于是多了一层嵌套

```js
Object.keys(obj).forEach(key => {
  Object.defineProperty(obj, key, {
    // ...
  });
});
```

> 三、必须深层遍历嵌套的对象
> 如果嵌套对象，那就必须逐层遍历，直到把每个对象的每个属性都调用 Object.defineProperty() 为止。 Vue 的源码中就能找到这样的逻辑 (叫做 walk 方法)。

### Proxy

> Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等），ES6 原生提供 Proxy 构造函数，用来生成 一个 Proxy 实例。
> 语法：
>
> let p = new Proxy(target, handler);

- target: 用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
- handler: 一个对象，其属性是当执行一个操作时定义代理的行为的函数
  示例：
  >

```js
let target = {};
let handler = {
  get: function(obj, name) {
    console.log('get');
    return name in obj ? obj[name] : 37;
  },
  set: function(obj, name, value) {
    console.log('set');
    obj[name] = value;
  },
};
let p = new Proxy(target, handler);
p.a = 1; // 进行set操作，并且操作会被转发到目标
p.b = undefined; // 进行set操作，并且操作会被转发到目标
console.log(p.a, p.b); // 1, undefined ，进行get操作
console.log('c' in p, p.c); // false, 37  进行get操作
console.log(target); // {a: 1, b: undefined}. 操作已经被正确地转发
```

> 在例子中，通过 new Proxy(target, handler)返回了一个 Prosy 实例，在访问或者添加实例对象的某个属性时
> ，调用了 get 或者 set 操作，在 get 操作中，在当对象不存在属性名时，会返回 37.除了进行 get 和 set 操作外，还会进行无操作转发代理，代理会将所有应用到它的操作转发到这个目标对象上。

### 解决问题

> 一、针对对象
> Proxy 是针对 整个对象 obj 的。因此无论 obj 内部包含多少个 key ，都可以走进 set。(并不需要通过 Object.keys() 的遍历)，解决了上述 Object.defineProperty() 的第二个问题

```js
let obj = {
  name: 'Eason',
  age: 30,
};
let handler = {
  get(target, key, receiver) {
    console.log('get', key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log('set', key, value);
    return Reflect.set(target, key, value, receiver);
  },
};
let proxy = new Proxy(obj, handler);
proxy.name = 'Zoe'; // set name Zoe
proxy.age = 18; // set age 18
```

> Reflect.get 和 Reflect.set 可以理解为类继承里的 super，即调用原来的方法
>
> 二、支持数组
> Proxy 不需要对数组的方法进行重载，省去了众多 hack，减少代码量等于减少了维护成本，而且标准的就是最好的

```js
let arr = [1, 2, 3];
let proxy = new Proxy(arr, {
  get(target, key, receiver) {
    console.log('get', key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log('set', key, value);
    return Reflect.set(target, key, value, receiver);
  },
});
proxy.push(4);
// 能够打印出很多内容
// get push     (寻找 proxy.push 方法)
// get length   (获取当前的 length)
// set 3 4      (设置 proxy[3] = 4)
// set length 4 (设置 proxy.length = 4)
```

> 三、嵌套支持
> Proxy 也是不支持嵌套的，这点和 Object.defineProperty() 是一样的。因此也需要通过逐层遍历来解决。Proxy 的写法是在 get 里面递归调用 Proxy 并返回

```js
let obj = {
  info: {
    name: 'eason',
    blogs: ['webpack', 'babel', 'cache'],
  },
};
let handler = {
  get(target, key, receiver) {
    console.log('get', key);
    // 递归创建并返回
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], handler);
    }
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log('set', key, value);
    return Reflect.set(target, key, value, receiver);
  },
};
let proxy = new Proxy(obj, handler);
// 以下两句都能够进入 set
proxy.info.name = 'Zoe';
proxy.info.blogs.push('proxy');
```

>

### 扩展

>

#### 实现构造函数

> 方法代理可以轻松地通过一个新构造函数来扩展一个已有的构造函数,这个例子使用了 construct 和 apply。

```js
function extend(sup, base) {
  var descriptor = Object.getOwnPropertyDescriptor(base.prototype, 'constructor');
  base.prototype = Object.create(sup.prototype);
  var handler = {
    construct: function(target, args) {
      var obj = Object.create(base.prototype);
      this.apply(target, obj, args);
      return obj;
    },
    apply: function(target, that, args) {
      sup.apply(that, args);
      base.apply(that, args);
    },
  };
  var proxy = new Proxy(base, handler);
  descriptor.value = proxy;
  Object.defineProperty(base.prototype, 'constructor', descriptor);
  return proxy;
}
var Person = function(name) {
  this.name = name;
};
var Boy = extend(Person, function(name, age) {
  this.age = age;
});
Boy.prototype.sex = 'M';
var Peter = new Boy('Peter', 13);
console.log(Peter.sex); // "M"
console.log(Peter.name); // "Peter"
console.log(Peter.age); // 13
```

>

#### 面试题

> 什么样的 a 可以满足 (a === 1 && a === 2 && a === 3) === true 呢？这里我们就可以采用数据劫持来实现

```js
let current = 0;
Object.defineProperty(window, 'a', {
  get() {
    current++;
    return current;
  },
});
console.log(a === 1 && a === 2 && a === 3); // true
```

>

### 总结

> Proxy / Object.defineProperty 两者的区别：

- 当使用 defineProperty，我们修改原来的 obj 对象就可以触发拦截，而使用 proxy，就必须修改代理对象，即 Proxy 的实例才可以触发拦截
- defineProperty 必须深层遍历嵌套的对象。 Proxy 不需要对数组的方法进行重载，省去了众多 hack，减少代码量等于减少了维护成本，而且标准的就是最好的
  > Proxy 对比 defineProperty 的优势
- Proxy 的第二个参数可以有 13 种拦截方法，这比起 Object.defineProperty() 要更加丰富
- Proxy 作为新标准受到浏览器厂商的重点关注和性能优化，相比之下 Object.defineProperty() 是一个已有的老方法
- Proxy 的兼容性不如 Object.defineProperty() (caniuse 的数据表明，QQ 浏览器和百度浏览器并不支持 Proxy，这对国内移动开发来说估计无法接受，但两者都支持 Object.defineProperty())
- 不能使用 polyfill 来处理兼容性
  > 接下来我们将会分别用 Proxy / Object.defineProperty 来实现双向绑定

# 用 Proxy 与 Object.defineProperty 实现双向绑定

### 前言

> 上文我们讲了[Proxy 与 Object.defineProperty 的对比](https://github.com/LuoShengMen/StudyNotes/issues/455)，Proxy 与 Object.defineProperty 最典型的应用就是用于实现双向数据绑定。但实现双向数据绑定的方法不止于此。

- 发布者-订阅者模式（backbone.js）：一般通过 sub, pub 的方式实现数据和视图的绑定监听
- 脏值检查（angular.js） ：通过脏值检测的方式比对数据是否有变更，来决定是否更新视图
- 数据劫持（vue.js）：采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调
  > 不过我们今天只讲一讲如何使用 Proxy 与 Object.defineProperty 来实现双向数据绑定。

### 双向数据绑定

> 简单来说双向数据绑定就是数据和 UI 建立双向的通信通道，可以通过数据来更新 UI 显示，也可以通过 UI 的操做来更新数据。下图可以很好的说明一切
> ![image](https://user-images.githubusercontent.com/21194931/58619925-73559680-82f8-11e9-9848-c6af48e3914e.png)

### 实现思路

> 实现一个简单的双向数据绑定并不难，我们来看一个简单的例子
> html:

```js
<span id="box">
  <h1 id="text"></h1>
  <input type="text" id="input" oninput="inputChange(event)" />
  <button id="button" onclick="clickChange()">
    Click me
  </button>
</span>
```

> js:

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
>
        function clickChange() {
            data.value = 'hello'
        }
    </script>
```

> 但是想要实现 Vue 的双向数据绑定并没有这么简单，我们知道 Vue 的双向数据绑定是通过数据劫持结合发布者-订阅者模式的方式来实现的，那么我们起码要做以下三个步骤： 1.实现一个监听器 Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者。 2.实现一个订阅者 Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图。 3.实现一个解析器 Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器。
> 流程图如下：
> ![image](https://user-images.githubusercontent.com/21194931/58623762-48237500-8301-11e9-8a69-75b342eaa7ab.png)

#### 实现 Observer

> 使用 Object.defineProperty 定义一个 Observer

```js
function defineProperty(obj, key, value) {
  Observer(value) // 递归遍历所有子属性
  Object.defineProperty(obj, key, {
    enumerable: true, // 可枚举
    configurable: false, // 不能再define
    set(newValue) {
      if (value === newValue) {
        return
      }
      value = newValue
      console.log(`set ${key}: ${newValue}`)
    },
    get() {
      console.log(`get ${key}: ${value}`)
      return value
    }
  })
}
>
function Observer(data) {
  if (!data || typeof data !== 'object') {
    // 非对象即终止遍历
    return
  }
  Object.keys(data).forEach(function(key) {
    defineReactive(data, key, data[key]) // 监听所有对象属性
  })
}
```

>

#### 实现 Dep

> 创建一个用来存储订阅者 Watcher 的订阅器，订阅器 Dep 主要负责收集订阅者，然后再属性变化的时候执行对应订阅者的更新函数。

```js
function Dep() {
  this.list = [];
}
Dep.prototype = {
  addSub: function(watcher) {
    this.list.push(watcher);
  },
  notify: function() {
    this.list.forEach(function(watcher) {
      watcher.update();
    });
  },
};
```

>

#### 实现 Watcher

> 既然实现了一个订阅器，那么就需要一个订阅者，订阅者 Watcher 在初始化的时候需要将自己添加进订阅器 Dep 中，
> 1、在自身实例化时往属性订阅器(dep)里面添加自己
> 2、待属性变动 dep.notice()通知时，能调用自身的 update()方法，并触发回调，更新视图

```js
function Watcher(obj, key, cb) {
  this.cb = cb;
  this.obj = obj;
  this.key = key;
  // 此处为了触发属性的getter，从而在dep添加自己
  this.value = this.get();
}
Watcher.prototype = {
  update: function() {
    this.run(); // 属性值变化收到通知
  },
  run: function() {
    var value = this.get(); // 取到最新值
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.obj, value, oldVal); // 执行Compile中绑定的回调，更新视图
    }
  },
  get: function() {
    Dep.target = this; // 将当前订阅者指向自己
    var value = this.obj[this.key]; // 触发getter，添加自己到属性订阅器中
    Dep.target = null; // 添加完毕，重置
    return value;
  },
};
```

> 实现了订阅器和订阅者之后，需要将订阅器添加进入订阅者，将 Observer 改造以下植入订阅器。如果不好理解可以结合 watcher 一起看。

```js
function defineProperty(obj, key, value) {
  Observer(value); // 递归遍历所有子属性
  var dep = new Dep(); // 生成一个Dep实例
  Object.defineProperty(obj, key, {
    enumerable: true, // 可枚举
    configurable: false, // 不能再define
    set(newValue) {
      if (value === newValue) {
        return;
      }
      value = newValue;
      console.log(`set ${key}: ${newValue}`);
      dep.notify(); // 如果数据变化，通知所有订阅者
    },
    get() {
      if (Dep.target) {
        dep.addSub(Dep.target); // 在这里添加一个订阅者，这里的Dep.target是指订阅器本身
      }
      console.log(`get ${key}: ${value}`);
      return value;
    },
  });
}
```

> Observer 改造完成后，已经具备了监听数据， 添加订阅器和数据变化通知订阅者的功能。接下来就是将 watcher 添加进入订阅者，模拟实现 Compile，并进行数据初始化。

#### 模拟实现 Compile

> 我们这里不解析指令所以直接写出 watcher,并添加进去订阅者

```js
function inputChange(event) {
  data.value = event.target.value
}
>
function clickChange() {
  data.value = '你好 世界'
}
function renderInput(newValue) {
  if (input) {
    input.value = newValue
  }
}
>
function renderText(newValue) {
  if (text) {
    text.innerHTML = newValue
  }
}
new Watcher(data, 'value', renderInput)
new Watcher(data, 'value', renderText)
```

> 数据初始化

```js
let data = {
  value: '',
};
Observer(data);
```

> 这样一个简单的基于 Object.defineProperty 的双向数据绑定就完成了。

### Proxy

> 由于 Object.defineProperty 在数组监控方面的不足，我们可以采用 Proxy，只需要修改 Observer 即可实现上面例子的功能

```js
function Observer(target) {
  var dep = new Dep(); // 生成一个Dep实例
  let handler = {
    get: function(obj, name) {
      console.log('get');
      const prop = obj[name];
      if (Dep.target) {
        dep.addSub(Dep.target); // 在这里添加一个订阅者，这里的Dep.target是指订阅器本身
      }
      if (typeof prop === 'undefined') return;
      if (!prop.isBindingProxy && typeof prop === 'object') {
        obj[name] = new Proxy(prop, proxyHandler);
      }
      return obj[name];
    },
    set: function(obj, name, value) {
      Reflect.set(target, name, value);
      obj[name] = value;
      dep.notify(); // 如果数据变化，通知所有订阅者
    },
  };
  let p = new Proxy(target, handler);
}
```

### Proxy

Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作。 Vue3.0 中将会通过 Proxy 来替换原本的 Object.defineProperty 来实现数据响应式。

```js
let p = new Proxy(target, handler);
```

`target` 代表需要添加代理的对象，`handler` 用来自定义对象中的操作，比如可以用来自定义 set 或者 get 函数。

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    set(target, property, value, receiver) {
      setBind(value, property);
      return Reflect.set(target, property, value);
    },
    get(target, property, receiver) {
      getLogger(target, property);
      return Reflect.get(target, property, receiver);
    },
  };
  return new Proxy(obj, handler);
};

let obj = { a: 1 };
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`);
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`);
  },
);
p.a = 2; // 控制台输出：监听到属性a改变
p.a; // 'a' = 2
```

自定义 set 和 get 函数的方式，在原本的逻辑中插入了我们的函数逻辑，实现了在对对象任何属性进行读写时发出通知。

当然这是简单版的响应式实现，如果需要实现一个 Vue 中的响应式，需要我们在 get 中收集依赖，在 set 派发更新，之所以 Vue3.0 要使用 Proxy 替换原本的 API 原因在于 Proxy 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好，并且原本的实现有一些数据更新不能监听到，但是 Proxy 可以完美监听到任何方式的数据改变，唯一缺陷可能就是浏览器的兼容性不好了。

### Proxy

Proxy 是 ES6 中新增的功能，可以用来自定义对象中的操作

```js
let p = new Proxy(target, handler);
// `target` 代表需要添加代理的对象
// `handler` 用来自定义对象中的操作
```

可以很方便的使用 Proxy 来实现一个数据绑定和监听

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property);
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      setBind(value);
      return Reflect.set(target, property, value);
    },
  };
  return new Proxy(obj, handler);
};

let obj = { a: 1 };
let value;
let p = onWatch(
  obj,
  v => {
    value = v;
  },
  (target, property) => {
    console.log(`Get '${property}' = ${target[property]}`);
  },
);
p.a = 2; // bind `value` to `2`
p.a; // -> Get 'a' = 2
```

### Proxy

[Proxy](./Proxy.md)

http://es6.ruanyifeng.com/#docs/proxy
Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

```js
var obj = new Proxy(
  {},
  {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
      console.log(`setting ${key}!`);
      return Reflect.set(target, key, value, receiver);
    },
  },
);
```

Proxy 支持的拦截操作一览，一共 13 种。

- get(target, propKey, receiver)
  - 拦截对象属性的读取，比如 proxy.foo 和 proxy['foo']。
- set(target, propKey, value, receiver)
  - 拦截对象属性的设置，比如 proxy.foo = v 或 proxy['foo'] = v，返回一个布尔值。
- has(target, propKey)
  - 拦截 propKey in proxy 的操作，返回一个布尔值。
- deleteProperty(target, propKey)
  - 拦截 delete proxy[propKey]的操作，返回一个布尔值。
- ownKeys(target)
  - 拦截 Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in 循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而 Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
- getOwnPropertyDescriptor(target, propKey)
  - 拦截 Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
- defineProperty(target, propKey, propDesc)
  - 拦截 Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
- preventExtensions(target)
  - 拦截 Object.preventExtensions(proxy)，返回一个布尔值。
- getPrototypeOf(target)
  - 拦截 Object.getPrototypeOf(proxy)，返回一个对象。
- isExtensible(target)
  - 拦截 Object.isExtensible(proxy)，返回一个布尔值。
- setPrototypeOf(target, proto)
  - 拦截 Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- apply(target, object, args)
  - 拦截 Proxy 实例作为函数调用的操作，比如 proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
- construct(target, args)
  - 拦截 Proxy 实例作为构造函数调用的操作，比如 new proxy(...args)。

* 如何将项目里面的所有的 require 的模块语法换成 import 的 ES6 的语法？
* babel 是如何将 es6 代码编译成 es5 的
* 手写 Object.create 函数的 ployfill

### Proxy

Proxy 可以实现什么功能？

如果你平时有关注 Vue 的进展的话，可能已经知道了在 Vue3.0 中将会通过 `Proxy` 来替换原本的 `Object.defineProperty` 来实现数据响应式。 Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作。

```
let p = new Proxy(target, handler)
```

`target` 代表需要添加代理的对象，`handler` 用来自定义对象中的操作，比如可以用来自定义 `set` 或者 `get` 函数。

接下来我们通过 `Proxy` 来实现一个数据响应式

```
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: 1 }
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`)
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`)
  }
)
p.a = 2 // 监听到属性a改变
p.a // 'a' = 2
```

在上述代码中，我们通过自定义 `set` 和 `get` 函数的方式，在原本的逻辑中插入了我们的函数逻辑，实现了在对对象任何属性进行读写时发出通知。

当然这是简单版的响应式实现，如果需要实现一个 Vue 中的响应式，需要我们在 `get` 中收集依赖，在 `set` 派发更新，之所以 Vue3.0 要使用 `Proxy` 替换原本的 API 原因在于 `Proxy` 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好，并且原本的实现有一些数据更新不能监听到，但是 `Proxy` 可以完美监听到任何方式的数据改变，唯一缺陷可能就是浏览器的兼容性不好了。

### Proxy 是什么，有什么作用？

`Proxy`是`ES6`新增的一个构造函数，可以理解为 JS 语言的一个代理，用来改变 JS 默认的一些语言行为，包括拦截默认的`get/set`等底层方法，使得 JS 的使用自由度更高，可以最大限度的满足开发者的需求。比如通过拦截对象的`get/set`方法，可以轻松地定制自己想要的`key`或者`value`。下面的例子可以看到，随便定义一个`myOwnObj`的`key`,都可以变成自己想要的函数`

```js
function createMyOwnObj() {
  //想把所有的key都变成函数，或者Promise,或者anything
  return new Proxy(
    {},
    {
      get(target, propKey, receiver) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let randomBoolean = Math.random() > 0.5;
            let Message;
            if (randomBoolean) {
              Message = `你的${propKey}运气不错，成功了`;
              resolve(Message);
            } else {
              Message = `你的${propKey}运气不行，失败了`;
              reject(Message);
            }
          }, 1000);
        });
      },
    },
  );
}

let myOwnObj = createMyOwnObj();

myOwnObj.hahaha
  .then(result => {
    console.log(result); //你的hahaha运气不错，成功了
  })
  .catch(error => {
    console.log(error); //你的hahaha运气不行，失败了
  });

myOwnObj.wuwuwu
  .then(result => {
    console.log(result); //你的wuwuwu运气不错，成功了
  })
  .catch(error => {
    console.log(error); //你的wuwuwu运气不行，失败了
  });
```
