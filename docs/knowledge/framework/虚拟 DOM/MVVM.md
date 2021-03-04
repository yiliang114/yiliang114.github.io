---
title: framework
date: 2020-11-21
draft: true
---

### MVVM

- `View`：界面
- `Model`：数据模型
- `ViewModel`：作为桥梁负责沟通 `View` 和 `Model`

> - 在 MVVM 中，UI 是通过数据驱动的，数据一旦改变就会相应的刷新对应的 UI，UI 如果改变，也会改变对应的数据。这种方式就可以在业务处理中只关心数据的流转，而无需直接和页面打交道。ViewModel 只关心数据和业务的处理，不关心 View 如何处理数据，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel

- 在 MVVM 中，最核心的也就是数据双向绑定，例如 Vue 中的数据劫持

不管是 React 还是 Vue，都不是 MVVM 框架，只是有借鉴 MVVM 的思路。拿 Vue 举例也是为了更好地理解 MVVM 的概念。

传统的 MVC 架构通常是使用控制器更新模型，视图从模型中获取数据去渲染。当用户有输入时，会通过控制器去更新模型，并且通知视图进行更新。但是 MVC 有一个巨大的缺陷就是**控制器承担的责任太大**了，随着项目愈加复杂，控制器中的代码会越来越**臃肿**，导致出现不利于**维护**的情况。

在 MVVM 架构中，引入了 **ViewModel** 的概念。ViewModel 只关心数据和业务的处理，不关心 View 如何处理数据，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel。

以 Vue 框架来举例，ViewModel 就是组件的实例。View 就是模板，Model 的话在引入 Vuex 的情况下是完全可以和组件分离的。

除了以上三个部分，其实在 MVVM 中还引入了一个隐式的 Binder 层，实现了 View 和 ViewModel 的绑定。

![img](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/167cf01bd8430243.jpg)

同样以 Vue 框架来举例，这个**隐式**的 Binder 层就是 Vue 通过解析模板中的插值和指令从而实现 View 与 ViewModel 的绑定。

对于 MVVM 来说，其实最重要的并不是通过双向绑定或者其他的方式将 View 与 ViewModel 绑定起来，**而是通过 ViewModel 将视图中的状态和用户的行为分离出一个抽象，这才是 MVVM 的精髓**。

1. `MVC`
   View 传送指令到 Controller
   Controller 完成业务逻辑后，要求 Model 改变状态
   Model 将新的数据发送到 View，用户得到反馈

所有通信都是单向的。

2. `MVVM`
   `Angular`它采用双向绑定（data-binding）：`View`的变动，自动反映在 `ViewModel`，反之亦然。
   组成部分 Model、View、ViewModel. View：UI 界面. ViewModel：它是 View 的抽象，负责 View 与 Model 之间信息转换，将 View 的 Command 传送到 Model；Model：数据访问层

### 原生 js 实现 MVVM

```js
<span id="box">
  <h1 id="text"></h1>
  <input type="text" id="input" oninput="inputChange(event)" />
  <button id="button" onclick="clickChange()">
    Click me
  </button>
</span>
```

```js
const input = document.getElementById('input');
const text = document.getElementById('text');
const button = document.getElementById('button');
const data = {
  value: '',
};
function defineProperty(obj, attr) {
  let val;
  Object.defineProperty(obj, attr, {
    set(newValue) {
      console.log('set');
      if (val === newValue) {
        return;
      }
      val = newValue;
      input.value = newValue;
      text.innerHTML = newValue;
    },
    get() {
      console.log('get');
      return val;
    },
  });
}
defineProperty(data, 'value');
function inputChange(event) {
  data.value = event.target.value;
}

function clickChange() {
  data.value = 'hello';
}
```

### 使用 JavaScript Proxy 实现简单的数据绑定

```html
<body>
  hello,world
  <input type="text" id="model" />
  <p id="word"></p>
</body>
<script>
  const model = document.getElementById('model');
  const word = document.getElementById('word');
  var obj = {};

  const newObj = new Proxy(obj, {
    get: function (target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function (target, key, value, receiver) {
      console.log('setting', target, key, value, receiver);
      if (key === 'text') {
        model.value = value;
        word.innerHTML = value;
      }
      return Reflect.set(target, key, value, receiver);
    },
  });

  model.addEventListener('keyup', function (e) {
    newObj.text = e.target.value;
  });
</script>
```
