---
layout: CustomPages
title: JQuery
date: 2020-11-21
aside: false
draft: true
---

# jquery 源码

最主要的几个部分，1. 变量常量正则的初始化 2. 工具方法`$.fn` 3. 状态`$.ready` 4. 对元素属性的操作有 attr(),prop(),addClass()之类的方法 5. dom 操作，样式操作 6. ajax 封装 7. 模块化 8. 动画 animation() 9. 位置和尺寸 offset() 10. window.jQuery = window.\$ = jQuery

虽然 jq 有作用域提升机制，但是 9000 多行的代码基本上只有全局都会用到的变量和正则定义在代码最开头，而每个模块一开始又会定义一些在本模块中用到的变量正则等。

1. jq 的闭包结构是 function 参数是 window 和 undefined，传入的参数是 window，避免污染全局变量。这样的写法代码压缩的时候参数会成为 w 和 u
2. jq 的无 new 构造，可以直接用\$进行构造，这很便捷，但是实质上还是 new jq()

```
var jquery = function(selector,context){
    return new Jquery.fn.init(selector,context,rootjQuery)
}
jQuery.fn = jQuery.prototype = {
    // jQuery构造器
    init: function(selector,context,rootjQuery)
}
// 然后将init函数的原型属性设置为jq.fn
jQuery.fn.init.prototype = jQuery.fn
```

\$()这种调用方式实际上调用的是 new jq fn init 函数，也就是说，构造实例的工作实际上是 init 函数完成的。然后 jQuery.fn.init.prototype 设置为 jQuery.fn，那么使用 new jq fn init 生成的对象的原型就是 jq fn，那么所有挂载在 jq fn 上面的函数就相当于挂载到了 jq fn init 函数生成的对象上，所以这样生成的对象都能够使用 jq fn 上的原型方法。嗯。。。所以其实 jq fn init prototy = jq fn = jq prototype 所以，无 new 的构造其实是跟直接 new 是一样的。

3. jq 的方法重载。读这部分源码的时候发现很复杂很繁琐，因为 jq 是为了通用性更强，兼容更多的情况。比如说获取和设置标签属性都可以用`$().attr()`,获取和设置 css 属性都可以用`$().css()`，jQuery()有更多的功能，比如说传入 dom 和传入对象，传入数组的 dom，传入 html 字符串等等，就是一个方法实现了很多的功能，又是 get 又是 set
4. jq 内部常常用 extend 来扩展静态方法和实例方法。但是在内部实际上存在 jq fn extend 与 jq extend。基本上我理解的 jq extend 扩展的静态方法，可以直接使用`$.xxx`进行使用，因为`$`是 jq 对象，而使用 jq fn extend 扩展的实例方法需要使用`$().xxx`进行调用，因为`$().xxx`才是一个实例。但是需要注意的是事实上有一部分的方法是 jq extend = jq fn extend = function(){}这样来声明的，就是说两个 extend 函数共用了同一个方法，却实现了不同的功能，这主要是 js 中的 this 不同，jq extend 中的 this 是 jq 对象，所以方法都扩展在 jq 类上。而 jq fn extend 中的 this 是指向 fn 对象的，因为 jq fn = jq prototype 所以这也就增加了原型方法，也就是实例对象的方法。
5. 链式调用，最重要的步骤是`return this`，就能实现链式调用。jq 支持的回溯（指可以链式调用中可以回到上一步的对象），是依靠添加了 prevObject 这个属性实现的，这个属性是由 pushStack()方法生成的，具体的实现忘了，跟内部管理的栈相关。当链式调用执行 end()方法后，内部就返回了 jq 对象的 prevObject 属性，完成回溯。
6. 预定义常用方法。首先定义了一个对象、字符串和数组变量，然后通过这三个来定义对应的对象、字符串数组的方法入 concat slice push 等等 如 core_slice = 字符串名.slice 然后再实际调用的时候就直接 core_slice.call(this)，来替代 Array.prototype.slice.call(this)。如果不这么做的话，每次都要从 Array 中找，而且还需要判断变量的类型是否是 string。

# vue 源码

vue 主要作为 view 部分，主要做了三件事：

- 通过 observer 对数据 data 进行了监听，并且提供订阅某个数据项变化的能力
- 把 template 解析为一段 document fragment 碎片，然后解析其中的指令 directive，得到每个指令所依赖的数据项和其更新的办法，比如`v-text=‘message’`被解析之后依赖的数据项为`this.$data.message` 更新试图的方法为`node.textContent = this.$data.message`
- 通过 watcher 把上述两部分结合起来，把指令中依赖的数据项订阅在 observer 上，这样数据变化时就会触发 observer，进而就能触发数据更新视图的方法，于是就达到了关联的效果。

## 虚拟 dom 的三个步骤

- createElement(): 用 js 对象（虚拟树）描述真实的 dom 对象（真实树）
- diff(oldnode,newNode) 对比新旧两个树的区别
- patch(): 将差异应用到真实树上

## 数据更新的 diff 机制

视图更新效率主要在大列表和深层数据更新这两方面。大多数研究都是对于大列表数据的更新，代码在 directive/repeat.js 中。首先，diff(data,oldvalue)，先比较新旧两个列表的 view model 的数据状态，然后差量更新 dom。第一步，遍历一遍新列表里的每一项，如果该项的 vm 之前就存在，则打一个\_rensed 的标，如果不存在对应的 vm 就创建一个新的。第二部：遍历一遍就得列表的每一项，如果\_rensed 的标没有被打上（其实就是指\_rensed=false）则说明新列表中已经没有它了，就销毁这个 vm。`this.uncacheVm(vm),vm.$destory()`。第三步：整理新的 vm 在试图上的顺序，同时还原之前打上的\_rensed 标，全部赋值为 false。就渲染完成了。

## 组件的 keeplive

代码在 component.js 中，如果 keeplive 特性存在，那么组件在重复被创建的时候，会通过缓存机制，快速创建组件，以提升视图更新的性能。`if(this.keepalive){var cached = this.cache[id]}`

## 数据监听机制

Object.defineProperty 这个 api，为一个属性设置特殊的 getter 和 setter，然后再 setter 中触发一个函数，就可以达到监听的效果。

## 代码结构

src 里面有 entries 入口，coompiler 编译器，core 里面有 observer cdom instance 之类的代码，server 是服务端渲染相关。

## vue 构造函数

入口： `web-runtime-with-compiler.js` 到`web-runtime.js`,`core/index.js`,`instance/index.js`。`instance/index.js`中声明了 vue 构造方法主要是调用了`vue.prototype._init()`，然后再调用了`initMixin()`,`stateMixin`,`eventsMixin`,`lifeCyleMixin`,`renderMixin`,以 Vue 构造函数为参数调用了 5 个方法，最后导出 vue，主要是在 prototype 上挂载方法和属性。然后又导入 initGlobalAPI 和 isServerRendering 依赖，又将 Vue 作为参数传入给 initGlobalAPI，再挂载上 Vue 版本信息等。initGlobalAPI 的作用是在 Vue 构造函数上挂载静态属性和方法。然后`web-runtime.js`主要是写入并覆盖 Vue.configshuxing ，配置上工具方法，安装 vue 平台的指令和组件，最后声明挂载函数（\$mount）。最后处理的是`web-runtime-with-compiler.js`，做的工作是先缓存一下`mount`函数。然后再 Vue 上挂载 compiler。

总结一下就是 Vue prototype 属性方法挂载是在 instance 中处理的，静态属性方法是在 global-api 中处理的，runtime.js 主要是添加和挂载平台配置的。

https://www.cnblogs.com/aaronjs/p/3279314.html
https://www.cnblogs.com/coco1s/p/5261646.html
https://github.com/chokcoco/jQuery-
