---
title: 实现一个简单的 Vue
date: '2020-10-26'
draft: true
---

### 实现 observer

我们在上面一部分讲到了 es5 的 Object.defineProperty()这个方法，vue 正式通过它来实现对一个对象属性的劫持的，在创建实例的时候 vue 会对 option 中的 data 对象进行一次数据格式化或者说初始化，给每个 data 的属性都设置上 get/set 进行对象劫持，代码如下：

```js
function Observer(data) {
  this.data = data;
  if (Array.isArray(data)) {
    protoAugment(data, arrayMethods); //arrayMethods实现对Array.prototype原型方法的拷贝;
    this.observeArray(data);
  } else {
    this.walk(data);
  }
}

Observer.prototype = {
  walk: function walk(data) {
    var that = this;
    Object.keys(data).forEach(function(key) {
      that.convert(key, data[key]);
    });
  },
  convert: function convert(key, val) {
    this.defineReactive(this.data, key, val);
  },
  defineReactive: function defineReactive(data, key, val) {
    var ochildOb = observer(val);
    var that = this;
    Object.defineProperty(data, key, {
      configurable: false,
      enumerable: true,
      get: function() {
        console.log(`i get the ${key}-->${val}`);
        return val;
      },
      set: function(newVal) {
        if (newVal == val) return;
        console.log(`haha.. ${key} changed oldVal-->${val} newVal-->${newVal}`);
        val = newVal;
        observer(newVal); //在这里对新设置的属性再一次进行get/set
      },
    });
  },
  observeArray: function observeArray(items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observer(items[i]);
    }
  },
};
function observer(data) {
  if (!data || typeof data !== 'object') return;
  return new Observer(data);
}
//让我们来试一下
var obj = { name: 'jasonCloud' };
var ob = observer(obj);
obj.name = 'wu';
//haha.. name changed oldVal-->jasonCloud newVal-->wu
obj.name;
//i get the name-->wu
```

到这一步我们只实现了对属性的 set/get 监听，但并没实现变化后 notify，那该怎样去实现呢？在 VUE 里面使用了订阅器 Dep，让其维持一个订阅数组，但有订阅者时就通知相应的订阅者 notify。

```js
let _id = 0;
/*
  Dep构造器用于维持$watcher检测队列；
*/
function Dep() {
  this.id = _id++;
  this.subs = [];
}

Dep.prototype = {
  constructor: Dep,
  addSub: function(sub) {
    this.subs.push(sub);
  },
  notify: function() {
    this.subs.forEach(function(sub) {
      if (typeof sub.update == 'function') sub.update();
    });
  },
  removeSub: function(sub) {
    var index = this.subs.indexOf(sub);
    if (index > -1) this.subs.splice(index, 1);
  },
  depend: function() {
    Dep.target.addDep(this);
  },
};

Dep.target = null; //定义Dep的一个属性，当watcher时Dep.targert=watcher实例对象
```

在这里构造器 Dep,维持内部一个数组 subs，当有订阅时就 addSub 进去，通知订阅者更新时就会调用 notify 方法通知到订阅者；我们现在合并一下这两段代码

```js
function Observer(data) {
  //省略的代码..
  this.dep = new Dep();
  //省略的代码..
}

Observer.prototype = {
  //省略的代码..

  defineReactive: function defineReactive(data, key, val) {
    //省略的代码..
    var dep = new Dep();

    Object.defineProperty(data, key, {
      configurable: false,
      enumerable: true,
      get: function() {
        if (Dep.target) {
          dep.depend();
          //省略的代码..
        }
        return val;
      },
      set: function(newVal) {
        //省略的代码..
        dep.notify();
      },
    });
  },
  observeArray: function observeArray(items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observer(items[i]);
    }
  },
};

function observer(data) {
  if (!data || typeof data !== 'object') return;
  return new Observer(data);
}
```

上面代码中有一个 protoAugment 方法，在 vue 中是实现对数组一些方法的重写，但他并不是直接在 Array.prototype.[xxx]直接进行重写这样会影响到所有的数组中的方法，显然是不明智的，vue 很巧妙的进行了处理，使其并不会影响到所有的 Array 上的方法，代码可以点击[这里](https://github.com/JasonCloud/wue/blob/master/src/js/observer.js)

到这里我们实现了数据的劫持，并定义了一个订阅器来存放订阅者，那么谁是订阅者呢？那就是 Watcher,下面让我们看看怎样实现 watcher

### 实现 Compile

compile 主要做的事情是解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图，如图所示：
![图片描述](https://segmentfault.com/img/bVBQY3?w=625&h=259)

因为遍历解析的过程有多次操作 dom 节点，为提高性能和效率，会先将跟节点`el`转换成文档碎片`fragment`进行解析编译操作，解析完成，再将`fragment`添加回原来的真实 dom 节点中

```js
function Compile(el) {
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);
  if (this.$el) {
    this.$fragment = this.node2Fragment(this.$el);
    this.init();
    this.$el.appendChild(this.$fragment);
  }
}
Compile.prototype = {
  init: function() {
    this.compileElement(this.$fragment);
  },
  node2Fragment: function(el) {
    var fragment = document.createDocumentFragment(),
      child;
    // 将原生节点拷贝到fragment
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  },
};
```

compileElement 方法将遍历所有节点及其子节点，进行扫描解析编译，调用对应的指令渲染函数进行数据渲染，并调用对应的指令更新函数进行绑定，详看代码及注释说明：

```js
Compile.prototype = {
  // ... 省略
  compileElement: function(el) {
    var childNodes = el.childNodes,
      me = this;
    [].slice.call(childNodes).forEach(function(node) {
      var text = node.textContent;
      var reg = /\{\{(.*)\}\}/; // 表达式文本
      // 按元素节点方式编译
      if (me.isElementNode(node)) {
        me.compile(node);
      } else if (me.isTextNode(node) && reg.test(text)) {
        me.compileText(node, RegExp.$1);
      }
      // 遍历编译子节点
      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node);
      }
    });
  },

  compile: function(node) {
    var nodeAttrs = node.attributes,
      me = this;
    [].slice.call(nodeAttrs).forEach(function(attr) {
      // 规定：指令以 v-xxx 命名
      // 如 <span v-text="content"></span> 中指令为 v-text
      var attrName = attr.name; // v-text
      if (me.isDirective(attrName)) {
        var exp = attr.value; // content
        var dir = attrName.substring(2); // text
        if (me.isEventDirective(dir)) {
          // 事件指令, 如 v-on:click
          compileUtil.eventHandler(node, me.$vm, exp, dir);
        } else {
          // 普通指令
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
        }
      }
    });
  },
};

// 指令处理集合
var compileUtil = {
  text: function(node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  },
  // ...省略
  bind: function(node, vm, exp, dir) {
    var updaterFn = updater[dir + 'Updater'];
    // 第一次初始化视图
    updaterFn && updaterFn(node, vm[exp]);
    // 实例化订阅者，此操作会在对应的属性消息订阅器中添加了该订阅者watcher
    new Watcher(vm, exp, function(value, oldValue) {
      // 一旦属性值有变化，会收到通知执行此更新函数，更新视图
      updaterFn && updaterFn(node, value, oldValue);
    });
  },
};

// 更新函数
var updater = {
  textUpdater: function(node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },
  // ...省略
};
```

这里通过递归遍历保证了每个节点及子节点都会解析编译到，包括了{{}}表达式声明的文本节点。指令的声明规定是通过特定前缀的节点属性来标记，如`中`v-text`便是指令，而`other-attr`不是指令，只是普通的属性。 监听数据、绑定更新函数的处理是在`compileUtil.bind()`这个方法中，通过`new Watcher()`添加回调来接收数据变化的通知

至此，一个简单的 Compile 就完成了，[完整代码](https://github.com/DMQ/mvvm/blob/master/js/compile.js)。接下来要看看 Watcher 这个订阅者的具体实现了

### 实现一个 Watcher

watcher 是实现 view 视图指令及数据和 model 层数据联系的管道，当在执行编译时候，他会把对应的属性创建一个 Watcher 对象让他和数据层 model 建立起联系。但数据发生变化是会触发 update 方法更新到视图上 view 中，反过来亦然。

```js
function Watcher(vm, expOrFn, cb) {
  this.vm = vm;
  this.cb = cb;
  this.expOrFn = expOrFn;
  this.depIds = {};
  var value = this.get(),
    valuetemp;
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      valuetemp = [];
      for (var i = 0, len = value.length; i < len; i++) {
        valuetemp.push(value[i]);
      }
    } else {
      valuetemp = {};
      for (var j in value) {
        valuetemp[j] = value[j];
      }
    }
    this.value = valuetemp;
  } else {
    this.value = value;
  }
}
Watcher.prototype = {
  update: function() {
    this.run();
  },
  run: function() {
    var val = this.get(),
      valuetemp;
    var oldVal = this.value;
    if (val !== oldVal) {
      if (typeof val === 'object' && val !== null) {
        if (Array.isArray(val)) {
          valuetemp = [];
          for (var i = 0, len = val.length; i < len; i++) {
            valuetemp.push(val[i]);
          }
        } else {
          valuetemp = {};
          for (var j in val) {
            valuetemp[j] = val[j];
          }
        }
        this.value = valuetemp;
      } else {
        this.value = val;
      }
      this.cb.call(this, val, oldVal);
    }
  },
  get: function() {
    Dep.target = this;
    var val = this.getVMVal();
    Dep.target = null;
    return val;
  },
  getVMVal: function() {
    var exps = this.expOrFn.split('.');
    var val = this.vm._data;
    exps.forEach(function(key) {
      val = val[key];
    });

    return val;
  },
  addDep: function(dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this);
      this.depIds[dep.id] = dep;
    }
  },
};
```

到现在还差一步就是将我们在容器中写的指令和{{}}让他和我们的 model 建立起连续并转化成，我们平时熟悉的 html 文档，这个过程也就是编译；编译简单的实现就是将我们定义的容器里面所有的子节点都获取到，然后通过对应的规则进行转换编译，为了提高性能，先创建一个文档碎片 createDocumentFragment（），然后操作都在碎片中进行，等操作成功后一次性 appendChild 进去；

```js
function Compile(el, vm) {
  this.$vm = vm;
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);
  if (this.$el) {
    this.$fragment = this.nodeToFragment(this.$el);
    this.init();
    this.$el.appendChild(this.$fragment);
    this.$vm.$option['mount'] && this.$vm.$option['mount'].call(this.$vm);
  }
}
```
