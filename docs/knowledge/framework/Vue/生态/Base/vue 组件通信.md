---
title: Vue 组件通信
date: '2020-10-26'
draft: true
---

## Vue 组件通信

组件通信一般分为以下几种情况：

- 父子组件通信
- 兄弟组件通信
- 跨多层级组件通信
- 任意组件

对于以上每种情况都有多种方式去实现，接下来就来学习下如何实现。

### 父子通信

父组件通过 `props` 传递数据给子组件，子组件通过 `emit` 发送事件传递数据给父组件，这两种方式是最常用的父子通信实现办法。

这种父子通信方式也就是典型的单向数据流，父组件通过 `props` 传递数据，子组件不能直接修改 `props`， 而是必须通过发送事件的方式告知父组件修改数据。

另外这两种方式还可以使用语法糖 `v-model` 来直接实现，因为 `v-model` 默认会解析成名为 `value` 的 `prop` 和名为 `input` 的事件。这种语法糖的方式是典型的双向绑定，常用于 UI 控件上，但是究其根本，还是通过事件的方法让父组件修改数据。

当然我们还可以通过访问 `$parent` 或者 `$children` 对象来访问组件实例中的方法和数据。

另外如果你使用 Vue 2.3 及以上版本的话还可以使用 `$listeners` 和 `.sync` 这两个属性。

`$listeners` 属性会将父组件中的 (不含 `.native` 修饰器的) `v-on` 事件监听器传递给子组件，子组件可以通过访问 `$listeners` 来自定义监听器。

`.sync` 属性是个语法糖，可以很简单的实现子组件与父组件通信

```html
<!--父组件中-->
<input :value.sync="value" />
<!--以上写法等同于-->
<input :value="value" @update:value="v => value = v"></comp>
<!--子组件中-->
<script>
  this.$emit('update:value', 1)
</script>
```

### 兄弟组件通信

对于这种情况可以通过查找父组件中的子组件实现，也就是 `this.$parent.$children`，在 `$children` 中可以通过组件 `name` 查询到需要的组件实例，然后进行通信。

### 跨多层次组件通信

对于这种情况可以使用 Vue 2.2 新增的 API `provide / inject`，虽然文档中不推荐直接使用在业务中，但是如果用得好的话还是很有用的。

假设有父组件 A，然后有一个跨多层级的子组件 B

```js
// 父组件 A
export default {
  provide: {
    data: 1,
  },
};
// 子组件 B
export default {
  inject: ['data'],
  mounted() {
    // 无论跨几层都能获得父组件的 data 属性
    console.log(this.data); // => 1
  },
};
```

### 父子组件通信

1. emit/props
2. `$parent.xxx`
3. provide/injected
4. event bus
5. Vuex

### 任意组件

这种方式可以通过 Vuex 或者 Event Bus 解决，另外如果你不怕麻烦的话，可以使用这种方式解决上述所有的通信情况

### vue 父子组件中通信有 10 中方式

https://www.cnblogs.com/lhb25/p/10-way-of-vue-data-interact.html

### 非父子间通信

- `$emit`
- `$on`

### 组件之间的传值？

**父组件与子组件传值**

<!-- 父组件通过标签上面定义传值 -->

```html
<template>
  <main :obj="data"></main>
</template>
<script>
  //引入子组件
  import Main form "./main"

  export default{
      name:"parent",
      data(){
          return {
              data:"我要向子组件传递数据"
          }
      },
      //初始化组件
      components:{
          Main
      }
  }
</script>

//子组件通过props方法接受数据

<template>
  <div>{{data}}</div>
</template>
<script>
  export default {
    name: 'son',
    //接受父组件传值
    props: ['data'],
  };
</script>
```

**子组件向父组件传递数据**

<!-- 子组件通过 $emit 方法传递参数 -->

```html
<template>
  <div v-on:click="events"></div>
</template>
<script>
  // 引入子组件
  import Main form "./main"

  export default{
    methods:{
      events:function(){

      }
    }
  }
</script>

<template>
  <div>{{ data }}</div>
</template>
<script>
  export default {
    name: 'son',
    //接受父组件传值
    props: ['data'],
  };
</script>
```

### 组件之间的传值？

1. 父组件与子组件传值

<!-- 父组件通过标签上面定义传值 -->

```html
<template>
  <main :obj="data"></main>
</template>
<script>
  //引入子组件
  import Main form "./main"

  export default{
      name:"parent",
      data(){
          return {
              data:"我要向子组件传递数据"
          }
      },
      //初始化组件
      components:{
          Main
      }
  }
</script>

//子组件通过props方法接受数据
<template>
  <div>{{data}}</div>
</template>
<script>
  export default {
    name: 'son',
    //接受父组件传值
    props: ['data'],
  };
</script>
```

2. 子组件向父组件传递数据

<!-- 子组件通过 $emit 方法传递参数 -->

```html
<template>
  <div v-on:click="events"></div>
</template>
<script>
  //引入子组件
  import Main form "./main"

  export default{
      methods:{
          events:function(){

          }
      }
  }
</script>

//

<template>
  <div>{{data}}</div>
</template>
<script>
  export default {
    name: 'son',
    //接受父组件传值
    props: ['data'],
  };
</script>
```

### Vue 组件间的参数传递

1. 父组件与子组件传值
   父组件传给子组件：子组件通过 props 方法接受数据;
   子组件传给父组件：`$emit` 方法传递参数

2. 非父子组件间的数据传递，兄弟组件传值
   eventBus，就是创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件。项目比较小时，用这个比较合适。

3. Vuex
