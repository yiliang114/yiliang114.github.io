---
title: Vue Note
date: "2020-10-26"
draft: true
---

## Vue Note

1. 最基础的复用是 抽离一个公共组件，通过 props 传值。
2. slot
3. 组件继承

### mixin

`mixin` 用于全局混入，会影响到每个组件实例，通常插件都是这样做初始化的。

```js
Vue.mixin({
  beforeCreate() {
    // 这种方式会影响到每个组件的 beforeCreate 钩子函数
  },
});
```

虽然文档不建议我们在应用中直接使用 `mixin`，但是如果不滥用的话也是很有帮助的，比如可以全局混入封装好的 `ajax` 或者一些工具函数等等。

`mixins` 应该是我们最常使用的扩展组件的方式了。如果多个组件中有相同的业务逻辑，就可以将这些逻辑剥离出来，通过 `mixins` 混入代码，比如上拉下拉加载数据这种逻辑等等。

另外需要注意的是 `mixins` 混入的钩子函数会先于组件内的钩子函数执行，并且在遇到同名选项的时候也会有选择性的进行合并。

### extend

这个 API 很少用到，作用是扩展组件生成一个构造器，通常会与 `$mount` 一起使用。

```js
// 创建组件构造器
let Component = Vue.extend({
  template: "<div>test</div>",
});
// 挂载到 #app 上
new Component().$mount("#app");
// 除了上面的方式，还可以用来扩展已有的组件
let SuperComponent = Vue.extend(Component);
new SuperComponent({
  created() {
    console.log(1);
  },
});
new SuperComponent().$mount("#app");
```

### 提取 npm 包

### 直接内嵌一个 js 文件，写入参数即可，插入一段 dom 的形式

### 打开线上 vue 项目的 devtools

步骤如下：

1. 找到 Vue 构造函数如 window.Vue
2. Vue.config.devtools=true
3. **VUE_DEVTOOLS_GLOBAL_HOOK**.emit('init', Vue)
