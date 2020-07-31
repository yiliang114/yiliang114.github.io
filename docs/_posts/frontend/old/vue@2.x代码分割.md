---
title: 'vue@2.x代码分割'
date: '2018-10-13'
tags:
  - vue
  - webpack
---

## vue code split

### 背景

最近开发的一个项目使用了 `vue`+ `element-ui` 的技术栈，当然，还有其他的一些工具库，比如 `axios`。

说一下我的开发步骤，基础结构是通过 `vue-cli@2.x` 创建的，手动的加入了 `axios` `vuex` , `vue-router` 是脚手架自带的。

### code split

#### 1. 路由懒加载

使用 `vue-router` 的时候，如果按照默认配置，所有的路由都会被打包到一个 `bundle.js` 文件中去（bundle 文件名一般是 `app.js`）。

进入 `router/index.js` 文件中，只需要将所有类似 `import Home from '@/components/home';` 替换为 `const Home = () => import('@/components/home')`

其余部分不需要变。就能以最简单的形式做到根据路由来划分 webpack 打包的模块。这个时候 执行 `npm run build` 是就能看到多了很多小的 js 文件， 并且`app.js` 文件的体积也减小了。

附上代码示例：

```js
import Vue from 'vue'
import Router from 'vue-router'
const AdminIndex = () => import('@/components/admin-index')
const Home = () => import('@/components/home')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'admin-index',
      component: AdminIndex
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    }
  ]
})
```

#### 2. 组件懒加载

跟路由懒加载的形式一样，也是使用 `() => import('xxx')` 的形式。
如果对于一个容器组件中，`import` 很多个组件进来，使用组件懒加载，能够继续减小首次加载的文件大小。示例代码：

```html
<template>
  <div>
    <HomeHeader />
    <SearchContainer />
    <HomeFooter />
  </div>
</template>

<script>
  import HomeHeader from './home-header'
  import HomeFooter from './home-footer'
  import SearchContainer from './containers/search-container'
  import LoadingComponent from '@/components/common/loading'

  export default {
    name: 'home',
    components: {
      HomeHeader,
      HomeFooter,
      SearchContainer,
      LoadingComponent
    }
  }
</script>
```

优化之前：
![20181012235553709png](https://chatflow-files-cdn-1252847684.file.myqcloud.com//file/2018/10/9c533c8ed9c04091b395c14ea1123941_20181012235553709.png)
![20181013002145418png](https://chatflow-files-cdn-1252847684.file.myqcloud.com//file/2018/10/eadb9c08e5ab40088f4288d4ff5caaea_20181013002145418.png)

组件懒加载优化之后：

```html
<template>
  <div>
    <HomeHeader />
    <SearchContainer />
    <HomeFooter />
  </div>
</template>

<script>
  const HomeHeader = () => import('./home-header')
  const HomeFooter = () => import('./home-footer')
  const SearchContainer = () => import('./containers/search-container')
  export default {
    name: 'home',
    components: {
      HomeHeader,
      HomeFooter,
      SearchContainer
    }
  }
</script>
```

![20181013002333147png](https://chatflow-files-cdn-1252847684.file.myqcloud.com//file/2018/10/4e247f6c3ee94e55a12336990a99276f_20181013002333147.png)

从文件的个数中，不知道有没有看出什么？

**`app.js` 是属于 项目的公共部分的代码**。**而声明一个 `const HomeHeader = () => import("./home-header");` 类似的组件，就会创建一个 `n.js` 文件**，达到了继续拆分比较大的 js 包的目的。

所以其实只要你愿意，可以一部分组件使用 `const HomeHeader = () => import("./home-header");` 另一部分组件使用 `import HomeHeader from "./home-header";` 。

不过总的来说，除非一个组件过于庞大了，在我开发过程中，才会想着用组件拆分的形式。每一个小组件都这样拆分，最终得到很多很多个小的 js 文件，反而是因为网络请求的原因，拖慢加载速度的。

#### 3. webpack-bundle-analyzer

在做一个项目的一开始，其实我都没有去考虑过性能优化、code split 的事情，只有当逻辑越来越多，开发的时候明显感觉到页面加载速度慢了，network 里看到 `bundle.js` 体积巨大了，才会想着去做优化的考虑。

emmm 所以到底应该怎么拆？拆哪些部分？这个需要`webpack-bundle-analyzer` 来帮忙，code split 也要有理有据。

#### 安装和配置

如果你跟我一样，使用的是 `vue-cli@2.9.x` 的话，`webpack-bundle-analyzer` 插件是已经安装了的，webpack 也配置好了的。

反正你就全局搜索一下 `webpack-bundle-analyzer` 就好了，看看 `package.json` 中有没有依赖，`webpack` 配置中有没有，一般只在`webpack.prod.conf.js` 中，因为开发环境下也不会去看的。

如果实在没有，那就手动安装和配置好了。

```bash
npm intall webpack-bundle-analyzer –save-dev
```

在 build/webpack.prod.config.js 中添加配置:

```js
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}
```

在 `package.json` 的 `script` 中添加：

```bash
“analyz”: “NODE_ENV=production npm_config_report=true npm run build”
```

如果你是 window 用户的话，应该是：

```bash
“analyz”: “set NODE_ENV=production npm_config_report=true npm run build”
```

执行： `npm run analyz`

等项目 build 完了之后，就会自动打开一个页面了，

![20181013004902726png](https://chatflow-files-cdn-1252847684.file.myqcloud.com//file/2018/10/ef1c7fdab7cf4a6f87cbbb96d9702688_20181013004902726.png)

#### 4. element-ui 库的优化

重点终于来了（不是标题党。。。。）。从上面的图中我们可以看到，`vendor.xxx.js` 实在是有点大，webpack build 完了之后，也细心的为我们标注出了 `big`:
![20181013005117948png](https://chatflow-files-cdn-1252847684.file.myqcloud.com//file/2018/10/5db8706427a240a7abb42ac89d04561d_20181013005117948.png)

解决办法是对于 `element-ui` 这个 ui 库从 `vendor.xx.js` 文件中剥离出来，最简单的办法就是使用 公共的 cdn 了。这里再做一层更彻底的剥离，将`vue`, `vuex`, `vue-router`,`axios` 等依赖文件，全部使用 cdn。
![20181013005418947png](https://chatflow-files-cdn-1252847684.file.myqcloud.com//file/2018/10/cdadfa3c1e8943b0963780702e65ee7e_20181013005418947.png)

看好这些依赖的版本，直接去 百度搜索相关的 cdn 文件。下面我直接贴我修改之后的代码：

#### index.html

```html
...
<link
  rel="stylesheet"
  href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"
/>

...
<body>
  <div id="app"></div>
  <!-- cdn 加速，减小 vendor.js 体积 -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.17-beta.0/vue.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vuex/3.0.1/vuex.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.1/vue-router.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
  <script src="https://unpkg.com/element-ui/lib/index.js"></script>
  <!-- built files will be auto injected -->
</body>
```

#### package.json

上面引入过 cdn 文件的依赖， 全都可以去掉了。

#### main.js

删除或者注释跟`element` 相关的代码：

```js
import ElementUI from 'element-ui';
...
import 'element-ui/lib/theme-chalk/index.css';
...
Vue.use(ElementUI);
...
```

#### webpack.base.conf.js

在 webpack 配置中添加外部扩展：

```js
module.exports = {
...
      // 外部扩展，通过 cdn 引入，不会被webpack打包
	  externals: {
	    'vue': 'Vue',
	    'vue-router': 'VueRouter',
	    'vuex': 'Vuex',
	    'axios': 'axios'
	  }
  }
```

这个时候已经好了，清除一下项目 `node_modules` 中的删除的不需要的依赖吧， `uninstall` 也行，直接删除整个 `node_modules` 文件夹，重新 `npm install` 也行。

处理完 `node_modules` 之后， `npm start` 再次看一下我们优化之后的结果：
![20181013010649788png](https://chatflow-files-cdn-1252847684.file.myqcloud.com//file/2018/10/f0faba77619947589ddf243965b072ba_20181013010649788.png)

开发状态下的 `app.js` 明显已经变小了，build 之后的文件也是。

这里需要注意的一点是，依赖库使用 cdn 文件来加载话，网络请求的速度与 cdn 的速度有关，如果不放心别人的 cdn ，将上述的 cdn 文件内容下载到本地放在 `static` 目录下当做静态文件即可。

建议使用 CDN 引入依赖的用户在链接地址上锁定版本，以免将来升级时受到非兼容性更新的影响。

vue 项目的 code split ，差不多就是这样了。感谢阅读， Happy Coding ！
