---
layout: CustomPages
title: framework
date: 2020-11-21
aside: false
draft: true
---

### MVVM

什么是 MVVM？比之 MVC 有什么区别？

首先先申明一点，不管是 React 还是 Vue，它们都不是 MVVM 框架，只是有借鉴 MVVM 的思路。文中拿 Vue 举例也是为了更好地理解 MVVM 的概念。

接下来先说下 View 和 Model：

- View 很简单，就是用户看到的视图
- Model 同样很简单，一般就是本地数据和数据库中的数据

基本上，我们写的产品就是通过接口从数据库中读取数据，然后将数据经过处理展现到用户看到的视图上。当然我们还可以从视图上读取用户的输入，然后又将用户的输入通过接口写入到数据库中。但是，如何将数据展示到视图上，然后又如何将用户的输入写入到数据中，不同的人就产生了不同的看法，从此出现了很多种架构设计。

传统的 MVC 架构通常是使用控制器更新模型，视图从模型中获取数据去渲染。当用户有输入时，会通过控制器去更新模型，并且通知视图进行更新。

![MVC](./images/167cad938817eb7e.jpg)

但是 MVC 有一个巨大的缺陷就是**控制器承担的责任太大**了，随着项目愈加复杂，控制器中的代码会越来越**臃肿**，导致出现不利于**维护**的情况。

在 MVVM 架构中，引入了 **ViewModel** 的概念。ViewModel 只关心数据和业务的处理，不关心 View 如何处理数据，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel。

![img](./images/167ced454926a458.jpg)

以 Vue 框架来举例，ViewModel 就是组件的实例。View 就是模板，Model 的话在引入 Vuex 的情况下是完全可以和组件分离的。

除了以上三个部分，其实在 MVVM 中还引入了一个隐式的 Binder 层，实现了 View 和 ViewModel 的绑定。

![img](./images/167cf01bd8430243.jpg)

同样以 Vue 框架来举例，这个**隐式**的 Binder 层就是 Vue 通过解析模板中的插值和指令从而实现 View 与 ViewModel 的绑定。

对于 MVVM 来说，其实最重要的并不是通过双向绑定或者其他的方式将 View 与 ViewModel 绑定起来，**而是通过 ViewModel 将视图中的状态和用户的行为分离出一个抽象，这才是 MVVM 的精髓**。

### 前端 MV 框架的意义

- 早期前端都是比较简单，基本以页面为工作单元，内容以浏览型为主，也偶尔有简单的表单操作，基本不
  太需要框架。
- 随着 AJAX 的出现，Web2.0 的兴起，人们可以在页面上可以做比较复杂的事情了，然后前端框架才真正
  出现了。
- 如果是页面型产品，多数确实不太需要它，因为页面中的 JavaScript 代码，处理交互的绝对远远超过处理
  模型的，但是如果是应用软件类产品，这就太需要了。
- 长期做某个行业软件的公司，一般都会沉淀下来一些业务组件，主要体现在数据模型、业务规则和业务流
  程，这些组件基本都存在于后端，在前端很少有相应的组织。
- 从协作关系上讲，很多前端开发团队每个成员的职责不是很清晰，有了前端的 MV 框架，这个状况会大有
  改观。
- 之所以感受不到 MV\*框架的重要性，是因为 Model 部分代码较少，View 的相对多一些。如果主要在操作
  View 和 Controller，那当然 jQuery 这类库比较好用了。

### MVVM 由以下三个内容组成

- `View`：界面
- `Model`：数据模型
- `ViewModel`：作为桥梁负责沟通 `View` 和 `Model`

> - 在 JQuery 时期，如果需要刷新 UI 时，需要先取到对应的 DOM 再更新 UI，这样数据和业务的逻辑就和页面有强耦合
> - 在 MVVM 中，UI 是通过数据驱动的，数据一旦改变就会相应的刷新对应的 UI，UI 如果改变，也会改变对应的数据。这种方式就可以在业务处理中只关心数据的流转，而无需直接和页面打交道。ViewModel 只关心数据和业务的处理，不关心 View 如何处理数据，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel

- 在 MVVM 中，最核心的也就是数据双向绑定，例如 Angluar 的脏数据检测，Vue 中的数据劫持

### MVVM

MVVM 是 Model-View-ViewModel 的缩写。MVVM 由以下三个内容组成

- View：界面
- Model：数据模型
- ViewModel：作为桥梁负责沟通 View 和 Model, 是一个同步 View 和 Model 的对象。

在 JQuery 时期，如果需要刷新 UI 时，需要先取到对应的 DOM 再更新 UI，这样数据和业务的逻辑就和页面有强耦合。

在 MVVM 架构下，View 和 Model 之间并没有直接的联系，而是通过 ViewModel 进行交互，Model 和 ViewModel 之间的交互是双向的， 因此 View 数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上。

ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而 View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作 DOM, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

在 MVVM 中，UI 是通过数据驱动的，数据一旦改变就会相应的刷新对应的 UI，UI 如果改变，也会改变对应的数据。这种方式就可以在业务处理中只关心数据的流转，而无需直接和页面打交道。ViewModel 只关心数据和业务的处理，不关心 View 如何处理数据，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel。

在 MVVM 中，最核心的也就是数据双向绑定，例如 Angluar 的脏数据检测，Vue 中的数据劫持。

### 什么是 MVC/MVP/MVVM/Flux？

- MVC(Model-View-Controller)
  - V->C, C->M, M->V
  - 通信都是单向的；C 只起路由作用，业务逻辑都部署在 V
  - Backbone

* MVP(Model-View-Presenter)

  - V<->P, P<->M
  - 通信都是双向的；V 和 M 不发生联系(通过 P 传)；V 非常薄，逻辑都部署在 P
  - Riot.js

* MVVM(Model-View-ViewModel)

  - V->VM, VM<->M
  - 采用双向数据绑定：View 和 ViewModel 的变动都会相互映射到对象上面
  - Angular

* Flux(Dispatcher-Store-View)

  - Action->Dispatcher->Store->View, View->Action
  - Facebook 为了解决在 MVC 应用中碰到的工程性问题提出一个架构思想
  - 基于一个简单的原则：数据在应用中单向流动（单向数据流）
  - React(Flux 中 View，只关注表现层)

### mvvm 和 mvc 区别？

mvc 和 mvvm 其实区别并不大。都是一种设计思想。主要就是 mvc 中 Controller 演变成 mvvm 中的 viewModel。mvvm 主要解决了 mvc 中大量的 DOM 操作使页面渲染性能降低，加载速度变慢，影响用户体验。和当 Model 频繁发生变化，开发者需要主动更新到 View 。

### 脏数据检测

当触发了指定事件后会进入脏数据检测，这时会调用 `$digest` 循环遍历所有的数据观察者，判断当前值是否和先前的值有区别，如果检测到变化的话，会调用 `$watch` 函数，然后再次调用 `$digest` 循环直到发现没有变化。循环至少为二次 ，至多为十次。

脏数据检测虽然存在低效的问题，但是不关心数据是通过什么方式改变的，都可以完成任务，但是这在 Vue 中的双向绑定是存在问题的。并且脏数据检测可以实现批量检测出更新的值，再去统一更新 UI，大大减少了操作 DOM 的次数。所以低效也是相对的，这就仁者见仁智者见智了。

### 数据劫持

- `Vue` 内部使用了 `Obeject.defineProperty()` 来实现双向绑定，通过这个函数可以监听到 `set` 和 `get`的事件

```js
var data = { name: 'yck' };
observe(data);
let name = data.name; // -> get value
data.name = 'yyy'; // -> change value

function observe(obj) {
  // 判断类型
  if (!obj || typeof obj !== 'object') {
    return;
  }
  Object.keys(data).forEach(key => {
    defineReactive(data, key, data[key]);
  });
}

function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log('get value');
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log('change value');
      val = newVal;
    },
  });
}
```

> 以上代码简单的实现了如何监听数据的 set 和 get 的事件，但是仅仅如此是不够的，还需要在适当的时候给属性添加发布订阅

```html
<div>
  {{name}}
</div>
```

> 在解析如上模板代码时，遇到 `{{name}}` 就会给属性 `name` 添加发布订阅

```js
// 通过 Dep 解耦
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    // sub 是 Watcher 实例
    this.subs.push(sub);
  }
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}
// 全局属性，通过该属性配置 Watcher
Dep.target = null;

function update(value) {
  document.querySelector('div').innerText = value;
}

class Watcher {
  constructor(obj, key, cb) {
    // 将 Dep.target 指向自己
    // 然后触发属性的 getter 添加监听
    // 最后将 Dep.target 置空
    Dep.target = this;
    this.cb = cb;
    this.obj = obj;
    this.key = key;
    this.value = obj[key];
    Dep.target = null;
  }
  update() {
    // 获得新值
    this.value = this.obj[this.key];
    // 调用 update 方法更新 Dom
    this.cb(this.value);
  }
}
var data = { name: 'yck' };
observe(data);
// 模拟解析到 `{{name}}` 触发的操作
new Watcher(data, 'name', update);
// update Dom innerText
data.name = 'yyy';
```

> 接下来,对 defineReactive 函数进行改造

```js
function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val);
  let dp = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log('get value');
      // 将 Watcher 添加到订阅
      if (Dep.target) {
        dp.addSub(Dep.target);
      }
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log('change value');
      val = newVal;
      // 执行 watcher 的 update 方法
      dp.notify();
    },
  });
}
```

> 以上实现了一个简易的双向绑定，核心思路就是手动触发一次属性的 getter 来实现发布订阅的添加

### Proxy 与 Object.defineProperty 对比

`Object.defineProperty` 虽然已经能够实现双向绑定了，但是他还是有缺陷的。

1. 只能对属性进行数据劫持，所以需要深度遍历整个对象
2. 对于数组不能监听到数据的变化

虽然 Vue 中确实能检测到数组数据的变化，但是其实是使用了 hack 的办法，并且也是有缺陷的。

```js
const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);
// hack 以下几个函数
const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
methodsToPatch.forEach(function(method) {
  // 获得原生函数
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    // 调用原生函数
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // 触发更新
    ob.dep.notify();
    return result;
  });
});
```

反观 Proxy 就没以上的问题，原生支持监听数组变化，并且可以直接对整个对象进行拦截，所以 Vue 也将在下个大版本中使用 Proxy 替换 Object.defineProperty

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

### javascript 实现数据双向绑定的三种方式小结

http://www.techweb.com.cn/network/system/2017-08-08/2570103.shtml

本篇文章主要介绍了 javascript 实现数据双向绑定的三种方式小结，前端的视图层和数据层有时需要实现双向绑定，目前实现数据双向绑定主要有三种，有兴趣的可以了解一下。

**前端数据的双向绑定方法**

前端的视图层和数据层有时需要实现双向绑定(two-way-binding)，例如 mvvm 框架，数据驱动视图，视图状态机等，研究了几个目前主流的数据双向绑定框架，总结了下。目前实现数据双向绑定主要有以下三种。

**1、手动绑定**

比较老的实现方式，有点像观察者编程模式，主要思路是通过在数据对象上定义 get 和 set 方法(当然还有其它方法)，调用时手动调用 get 或 set 数据，改变数据后出发 UI 层的渲染操作；以视图驱动数据变化的场景主要应用与 input、select、textarea 等元素，当 UI 层变化时，通过监听 dom 的 change，keypress，keyup 等事件来出发事件改变数据层的数据。整个过程均通过函数调用完成。

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>data-binding-method-set</title>
</head>
<body>
  <input q-value="value" type="text" id="input">
  <div q-text="value" id="el"></div>
  <script>
    var elems = [document.getElementById('el'), document.getElementById('input')];

    var data = {
      value: 'hello!'
    };

    var command = {
      text: function(str){
        this.innerHTML = str;
      },
      value: function(str){
        this.setAttribute('value', str);
      }
    };

    var scan = function(){
      /**
       * 扫描带指令的节点属性
       */
      for(var i = 0, len = elems.length; i < len; i++){
        var elem = elems[i];
        elem.command = [];
        for(var j = 0, len1 = elem.attributes.length; j < len1; j++){
          var attr = elem.attributes[j];
          if(attr.nodeName.indexOf('q-') >= 0){
            /**
             * 调用属性指令，这里可以使用数据改变检测
             */
            command[attr.nodeName.slice(2)].call(elem, data[attr.nodeValue]);
            elem.command.push(attr.nodeName.slice(2));
          }
        }
      }
    }

    /**
     * 设置数据后扫描
     */
    function mvSet(key, value){
      data[key] = value;
      scan();
    }
    /**
     * 数据绑定监听
     */
    elems[1].addEventListener('keyup', function(e){
      mvSet('value', e.target.value);
    }, false);

    scan();

    /**
     * 改变数据更新视图
     */
    setTimeout(function(){
      mvSet('value', 'fuck');
    },1000)

  </script>
</body>
</html>
```

**2、脏检查机制**

以典型的 mvvm 框架 angularjs 为代表，angular 通过检查脏数据来进行 UI 层的操作更新。关于 angular 的脏检测，有几点需要了解些： - 脏检测机制并不是使用定时检测。 - 脏检测的时机是在数据发生变化时进行。 - angular 对常用的 dom 事件，xhr 事件等做了封装， 在里面触发进入 angular 的 digest 流程。 - 在 digest 流程里面， 会从 rootscope 开始遍历， 检查所有的 watcher。 （关于 angular 的具体设计可以看其他文档，这里只讨论数据绑定），那我们看下脏检测该如何去做：主要是通过设置的数据来需找与该数据相关的所有元素，然后再比较数据变化，如果变化则进行指令操作

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>data-binding-drity-check</title>
</head>

<body>
  <input q-event="value" ng-bind="value" type="text" id="input">
  <div q-event="text" ng-bind="value" id="el"></div>
  <script>

  var elems = [document.getElementById('el'), document.getElementById('input')];

  var data = {
    value: 'hello!'
  };

  var command = {
    text: function(str) {
      this.innerHTML = str;
    },
    value: function(str) {
      this.setAttribute('value', str);
    }
  };

  var scan = function(elems) {
    /**
     * 扫描带指令的节点属性
     */
    for (var i = 0, len = elems.length; i < len; i++) {
      var elem = elems[i];
      elem.command = {};
      for (var j = 0, len1 = elem.attributes.length; j < len1; j++) {
        var attr = elem.attributes[j];
        if (attr.nodeName.indexOf('q-event') >= 0) {
          /**
           * 调用属性指令
           */
          var dataKey = elem.getAttribute('ng-bind') || undefined;
          /**
           * 进行数据初始化
           */
          command[attr.nodeValue].call(elem, data[dataKey]);
          elem.command[attr.nodeValue] = data[dataKey];
        }
      }
    }
  }

  /**
   * 脏循环检测
   * @param {[type]} elems [description]
   * @return {[type]}    [description]
   */
  var digest = function(elems) {
    /**
     * 扫描带指令的节点属性
     */
    for (var i = 0, len = elems.length; i < len; i++) {
      var elem = elems[i];
      for (var j = 0, len1 = elem.attributes.length; j < len1; j++) {
        var attr = elem.attributes[j];
        if (attr.nodeName.indexOf('q-event') >= 0) {
          /**
           * 调用属性指令
           */
          var dataKey = elem.getAttribute('ng-bind') || undefined;

          /**
           * 进行脏数据检测，如果数据改变，则重新执行指令，否则跳过
           */
          if(elem.command[attr.nodeValue] !== data[dataKey]){

            command[attr.nodeValue].call(elem, data[dataKey]);
            elem.command[attr.nodeValue] = data[dataKey];
          }
        }
      }
    }
  }

  /**
   * 初始化数据
   */
  scan(elems);

  /**
   * 可以理解为做数据劫持监听
   */
  function $digest(value){
    var list = document.querySelectorAll('[ng-bind='+ value + ']');
    digest(list);
  }

  /**
   * 输入框数据绑定监听
   */
  if(document.addEventListener){
    elems[1].addEventListener('keyup', function(e) {
      data.value = e.target.value;
      $digest(e.target.getAttribute('ng-bind'));
    }, false);
  }else{
    elems[1].attachEvent('onkeyup', function(e) {
      data.value = e.target.value;
      $digest(e.target.getAttribute('ng-bind'));
    }, false);
  }

  setTimeout(function() {
    data.value = 'fuck';
    /**
     * 这里问啥还要执行$digest这里关键的是需要手动调用$digest方法来启动脏检测
     */
    $digest('value');
  }, 2000)

  </script>
</body>
</html>
```

**3、前端数据劫持(Hijacking)**

第三种方法则是 avalon 等框架使用的数据劫持方式。基本思路是使用 Object.defineProperty 对数据对象做属性 get 和 set 的监听，当有数据读取和赋值操作时则调用节点的指令，这样使用最通用的=等号赋值就可以了。具体实现如下：

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>data-binding-hijacking</title>
</head>

<body>
  <input q-value="value" type="text" id="input">
  <div q-text="value" id="el"></div>
  <script>


  var elems = [document.getElementById('el'), document.getElementById('input')];

  var data = {
    value: 'hello!'
  };

  var command = {
    text: function(str) {
      this.innerHTML = str;
    },
    value: function(str) {
      this.setAttribute('value', str);
    }
  };

  var scan = function() {
    /**
     * 扫描带指令的节点属性
     */
    for (var i = 0, len = elems.length; i < len; i++) {
      var elem = elems[i];
      elem.command = [];
      for (var j = 0, len1 = elem.attributes.length; j < len1; j++) {
        var attr = elem.attributes[j];
        if (attr.nodeName.indexOf('q-') >= 0) {
          /**
           * 调用属性指令
           */
          command[attr.nodeName.slice(2)].call(elem, data[attr.nodeValue]);
          elem.command.push(attr.nodeName.slice(2));

        }
      }
    }
  }

  var bValue;
  /**
   * 定义属性设置劫持
   */
  var defineGetAndSet = function(obj, propName) {
    try {
      Object.defineProperty(obj, propName, {

        get: function() {
          return bValue;
        },
        set: function(newValue) {
          bValue = newValue;
          scan();
        },

        enumerable: true,
        configurable: true
      });
    } catch (error) {
      console.log("browser not supported.");
    }
  }
  /**
   * 初始化数据
   */
  scan();

  /**
   * 可以理解为做数据劫持监听
   */
  defineGetAndSet(data, 'value');

  /**
   * 数据绑定监听
   */
  if(document.addEventListener){
    elems[1].addEventListener('keyup', function(e) {
      data.value = e.target.value;
    }, false);
  }else{
    elems[1].attachEvent('onkeyup', function(e) {
      data.value = e.target.value;
    }, false);
  }

  setTimeout(function() {
    data.value = 'fuck';
  }, 2000)
  </script>
</body>

</html>
```

但值得注意的是 defineProperty 支持 IE8 以上的浏览器，这里可以使用**defineGetter** 和 **defineSetter** 来做兼容但是浏览器兼容性的原因，直接用 defineProperty 就可以了。至于 IE8 浏览器仍需要使用其它方法来做 hack。如下代码可以对 IE8 进行 hack，defineProperty 支持 IE8。例如使用 es5-shim.js 就可以了。（IE8 以下浏览器忽略）

### 请简单实现双向数据绑定 mvvm

```html
<input id="input" />
```

```js
const data = {};
const input = document.getElementById('input');
Object.defineProperty(data, 'text', {
  set(value) {
    input.value = value;
    this.value = value;
  },
});
input.onchange = function(e) {
  data.text = e.target.value;
};
```
