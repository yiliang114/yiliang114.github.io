---
title: vue 样式
date: "2021-01-03"
draft: true
---

### scoped 样式穿透

scoped 虽然避免了组件间样式污染，但是很多时候我们需要修改组件中的某个样式，但是又不想去除 scoped 属性。

1. 使用 `/deep/`

```html
<!-- Parent -->
<template>
  <div class="wrap">
    <Child />
  </div>
</template>

<style lang="scss" scoped>
  .wrap /deep/ .box {
    background: red;
  }
</style>

<!-- Child -->
<template>
  <div class="box"></div>
</template>
```

2. 使用两个 style 标签

```html
<!-- Parent -->
<template>
  <div class="wrap">
    <Child />
  </div>
</template>

<style lang="scss" scoped>
  /* 其他样式 */
</style>
<style lang="scss">
  .wrap .box {
    background: red;
  }
</style>

<!-- Child -->
<template>
  <div class="box"></div>
</template>
```

### vue style 样式穿透

原理 https://segmentfault.com/a/1190000017508285

### vue style scoped 问题， 模拟的局部作用域是如何实现的

### vue 的 style 标签，webpack 构建之后打包入 js 文件中还是打包成一个 css 文件？
