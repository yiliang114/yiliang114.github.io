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
