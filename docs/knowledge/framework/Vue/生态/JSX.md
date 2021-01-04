---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### JSX 中指令是否还可用？

很不幸的告诉你，大多数指令并不能在 JSX 中使用，对于原生指令，只有 v-show 是支持的。

大部分指令在 JSX 中可以使用表达式来替代，如：条件运算符(?:)替代 v-if、array.map 替代 v-for

对于自定义的指令，可以使用如下方式使用：

```js
const directives = [{ name: 'my-dir', value: 123, modifiers: { abc: true } }];

return <div {...{ directives }} />;
```

### 使用 jsx 的优劣

好处：

1. 更加灵活的表达
2. 自定义的渲染函数，ant d 中的 table ， customRender 之类的渲染函数，能够更加自由的填充开发者想填写的内容
3. html 模板与数据处于一个地方，单文件组件 template 的需要上下移动
4. 与 TS 结合比较好， template 模板部分 vue 2.0 暂时不能很好支持
5. 不是很确定：通常情况下， spa 不会去线上编译模板代码，所以只是开发阶段的编译速度会增加，因为 template 会被编译成 render 函数，tsx/jsx 讲道理好像没有这个过程，html 标签会直接通过 h 函数被编译成 vnode
6. 对于需要做两个技术栈的开发者来说 是好事。

坏处：

1. render 函数的写法需要有一定的基础
2. 与 TS 结合之后，mixins 的写法有一定的误解性， 因为需要类型推导，所以 只能通过 Vue.extend 来实现一个 mixins ，每一个 mixins 需要写成一个 vue 类，而不是 options 的一部分，一个简单的对象即可

### 引入 ts 之后的问题

### vue 中使用 jsx

https://juejin.im/post/5affa64df265da0b93488fdd
https://zhuanlan.zhihu.com/p/37920151
