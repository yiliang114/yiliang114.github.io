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

### vue 中使用 jsx

https://juejin.im/post/5affa64df265da0b93488fdd
https://zhuanlan.zhihu.com/p/37920151

### 引入 ts 之后的问题
