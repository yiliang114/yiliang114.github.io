---
title: v-model
date: '2020-10-26'
draft: true
---

## v-model

`v-model` 只是一层语法糖，实际还是由 `vue` 做了一些工作完成了双向绑定。

```html
<input v-model="name" />
```

相当于下面这个：

```html
<input v-bind:value="name" v-on:input="name=$event.target.value" />
```

自从`html5`开始 `input`每次输入都会触发 `oninput` 事件，所以输入时 `input`的内容会绑定到 `name` 中，于是`name` 的值就被改变。

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

### v-model.lazy

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

### vue 组件中声明普通（非 data）变量

![imagepng](http://media.zhijianzhang.cn//file/2019/01/2d02e966c50541268512ffdab5b9f9c1_image.png)
为什么这样直接声明变量是有问题的，这个跟 vue 的编译时和运行时的顺序可能有一定的关系。
