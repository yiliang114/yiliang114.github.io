---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

## v-model

首先，官网上说了，`v-model` 只是一层语法糖，实际还是由 `vue` 做了一些工作完成了双向绑定。

### vue 事件

#### v-model.lazy

能够将 `input` 组件的 `input` 事件（实际上是 HTML5 的 `oninput` 事件），修改为 `change` 事件（实际上是 `HTML5` 的 `onchange` 事件）。

说一下 `oninput` 事件 和 `onchange` 事件的区别： `oninput` 事件在元素值发生变化是立即触发， `onchange` 在元素失去焦点时触发。另外一点不同是 `onchange` 事件也可以作用于 `keygen` 和 `select` 元素。

https://zhidao.baidu.com/question/1434448272545863859.html

input 的值用 v-model="name"绑定的，直接修改 name 值并不会触发原生的 change 事件。

使用 v-model.lazy， 用不用 lazy 的区别在于，不用的时候 是实时监听 input value 的改变，而使用 lazy 的时候，是一般在 input 按了回车或者 blur 的时候触发一次，就像字面意思“懒同步”。

![imagepng](http://media.zhijianzhang.cn//file/2018/11/36ce916c157b480eab608c8bed9f364a_image.png)

从原理上解释 `change` 事件 和 `input` 事件之后，对应 `input` 组件的 `@input` 事件 和 `@change` 事件一个是实时监听，一个是在回车或者失去焦点之后触发。 所以啊，一般来说，使用 `v-model` 之后就不用再使用 `@input` 了。 使用 `@change` 之后就不用再使用 `@keyup.enter` 和 `@blur` 了。使用 `v-model.lazy` 之后就不用再使用 `@input` 、 `@keyup.enter` 和 `@blur` 了。

[实例代码](https://jsbin.com/fofuviwogu/edit?html,js,console,output)

`@change` 事件传的函数，带有一个 `events` 作为参数， `event.target.value` 是当前 `input` 的 `value` 值：

[实例代码](https://jsbin.com/wetivivuva/1/edit?js,console,output)

### v-model 实现原理

```vue
<input v-model="name">
```

其实他相当于下面这个：

```vue
<input v-bind:value="name" v-on:input="name=$event.target.value">
```

自从`html5`开始 `input`每次输入都会触发 `oninput` 事件，所以输入时 `input`的内容会绑定到 `name` 中，于是`name` 的值就被改变。

https://www.jb51.net/article/115742.htm

#### .number

#### .sync

update 事件

#### .trim

#### 在自定义组件中使用 v-model

https://blog.csdn.net/u010320804/article/details/79486034

要点在于， `v-model` 编译之后会被转化为 `v-bind` 和 `v-on` 事件， `v-bind` 将 `value` 指定到 `input` 中， 而`v-on` 会监听 `input` 事件，自动来改变 `value` 的值。

#### 事件

![imagepng](http://media.zhijianzhang.cn//file/2018/11/13741f3a972d41fe9de82a1bb260700d_image.png)

有一个比较特别的地方是，点击 `input` 上的事件， 可以直接通过 `event` 来获取，而不用在函数的参数中声明一个 `event` 形参。这里我估计是 `vue` 的 `$event` 默认了指定了 `event`。 这里要去研究一下，为什么可以这样？

### vue 双向绑定原理

vue 的数据双向绑定是通过数据劫持结合发布者-订阅者模式的方式来实现的。
直接通过代码来看，首先初始化了一个 vue 实例，并打印出 options 中声明的 data 值：

```js
var vm = new Vue({
  data: {
    obj: {
      a: 1,
    },
  },
  created: function() {
    console.log(this.obj);
  },
});
```

打印的结果如下：

![image.png](https://img.hacpai.com/file/2019/04/image-085db5b8.png)

在 options 的 data 中声明的 a 属性具有 get 和 set 方法，这是 vue 在初始化的时候通过 `Object.defineProperty()` 函数来实现数据劫持的。顾名思义就是在这个属性被 set 和 get 的时候都会触发这里声明的 get 和 set 方法。

##### MVVM

model view 以及 ViewModel. 包括两个方面，数据改变更新视图，视图变化更新数据。

###### data 改变如何更新 view

这里触发的事件流程是这样的：

1. 属性变化
2. 因为 data 中的属性都被 vue 通过 `Object.defineProperty()` 函数添加了 get 和 set 函数，所以其实 data 改变了是会被 Object.defineProperty 监听到的
3. 执行 set 方法来更新视图

###### 实现过程

我们知道数据双向绑定，首先要通过对数据进行劫持监听，所以我们需要设置几个监听器 Observer，用来监听所有的属性。如果属性发生变化了，就需要告诉订阅者 Watcher 看是否需要进行更新视图。 因为订阅者可能有很多个（简单说就是多个视图中都用到了某一个 data 属性），所以我们需要有一个消息订阅器 Dep 来专门收集这些订阅者，并在监听器 Observer 和 订阅者 Watcher 之间进行统一管理。接着我们还需要一个指令解析器 Compile，对每个节点元素进行扫描和解析，将相关指令初始化成为一个订阅者 Watcher， 并替换模板数据或者绑定相对应的函数，此时当订阅者 Watcher 接收到相应属性的变化，就会执行对应的更新函数，从而更新视图。

步骤如下：

1. 实现一个监听器 Observer 用来劫持并监听所有属性，如果有变动，就通知订阅者。
2. 实现一个订阅者 Watcher， 可以收到属性变化的通知并执行相应的函数，从而更新视图。
3. 实现一个解释器 Compile 可以扫描和解析每一个节点的相关指令。并根据初始化模板数据以及初始化相应的订阅器。

缺一张流程图。

###### 实现一个 Observer

核心部分就是上面说过的 Object.defineProperty.

### vue 组件中声明普通（非 data）变量

![imagepng](http://media.zhijianzhang.cn//file/2019/01/2d02e966c50541268512ffdab5b9f9c1_image.png)
为什么这样直接声明变量是有问题的，这个跟 vue 的编译时和运行时的顺序可能有一定的关系。
