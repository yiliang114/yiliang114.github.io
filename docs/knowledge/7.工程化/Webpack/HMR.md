---
title: Webpack HMR
date: 2020-11-21
draft: true
---

## HMR(Hot Module Replacement) 热更新

https://juejin.cn/post/6844904008432222215

相比于 LiveLoad 有以下优点：

- 可以实现局部更新，避免多余的资源请求，提高开发效率
- 在更新的时候可以保存应用原有状态
- 在代码修改和页面更新方面，实现所见即所得

在 webpack-dev-server 中实现「HMR」的核心就是 HotModuleReplacementPlugin ，它是「Webpack」内置的「Plugin」。在我们平常开发中，之所以改一个文件，例如 .vue 文件，会触发「HMR」，是因为在 vue-loader 中已经内置了使用 HotModuleReplacementPlugin 的逻辑。

### Webpack 热更新实现原理? 是如何做到在不刷新浏览器的前提下更新页面的

1. 当修改了一个或多个文件；
2. 文件系统接收更改并通知 webpack；
3. webpack 重新编译构建一个或多个模块，并通知 HMR 服务器进行更新；
4. HMR Server 使用 webSocket 通知 HMR runtime 需要更新，HMR 运行时通过 HTTP 请求更新 jsonp；
5. HMR 运行时替换更新中的模块，如果确定这些模块无法更新，则触发整个页面刷新。

- Webpack 编译期，为需要热更新的 entry 注入热更新代码(EventSource 通信)
- 页面首次打开后，服务端与客户端通过 EventSource 建立通信渠道，把下一次的 hash 返回前端
- 客户端获取到 hash，这个 hash 将作为下一次请求服务端 hot-update.js 和 hot-update.json 的 hash
- 修改页面代码后，Webpack 监听到文件修改后，开始编译，编译完成后，发送 build 消息给客户端
- 客户端获取到 hash，成功后客户端构造 hot-update.js script 链接，然后插入主文档
- hot-update.js 插入成功后，执行 hotAPI 的 createRecord 和 reload 方法，获取到 Vue 组件的 render 方法，重新 render 组件， 继而实现 UI 无刷新更新。

### webpack 如何只打包更新修改过的文件

HMR 称为热模块替换,在前面我们知道 webpack-dev-server 在我们每次代码变更时都会自动刷新页面，但是我们想要的是只更新被修改代码都那部分页面显示，不希望页面全部刷新。这时候 HMR 可以来帮助我们实现这个功能

好处：

针对于样式调试更加方便
只会更新被修改代码的那部分显示

```js
module.exports = {
  // ...
  devServer: {
    contentBase: './dist', // 起一个在dist文件夹下的服务器
    open: true, // 自动打开浏览器并访问服务器地址
    proxy: {
      // 跨域代理
      '/api': 'http: //localhost:3000', // 如果使用/api,会被转发（代理）到该地址
    },
    hot: true, // 开启HMR功能
    hotOnly: true, // 即使HMR不生效，也不自动刷新
  },
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html', // 模版html
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  // ...
};
```

### webpack-dev-server HMR

究其底层实现，是有两个关键的点：

1. 与本地服务器建立「socket」连接，注册 hash 和 ok 两个事件，发生文件修改时，给客户端推送 hash 事件。客户端根据 hash 事件中返回的参数来拉取更新后的文件。

2. HotModuleReplacementPlugin 会在文件修改后，生成两个文件，用于被客户端拉取使用。例如：

hash.hot-update.json

```json
{
  "c": {
    "chunkname": true
  },
  "h": "d69324ef62c3872485a2"
}
```

chunkname.d69324ef62c3872485a2.hot-update.js，这里的 chunkname 即上面 c 中对于 key。

```js
webpackHotUpdate("main",{
   "./src/test.js":
  (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    eval(....)
  })
})
```

### webpack-dev-server 和 dev-middleware、hotMiddleware 的区别，原理能说说吗？

## 详细过程

1. webpack-dev-middleware 是用来处理文件打包到哪里，到内存读取速度更快。
2. devServer 在监听 compiler done 后，利用 socket 告诉 devServer/client 修改模块的 hash
3. HMR.runtime 利用 HTTP 请求 hash.hot-update.json 获取更新模块列表 hotDownloadManifest `{"h":"11ba55af05df7c2d3d13","c":{"index-wrap":true}}`
4. 再通过 HTTP (jsonp) 获取更新模块的 js `index-wrap.7466b9e256c084c8463f.hot-update.js`

返回执行

```js
webpackHotUpdate('index-wrap', {
  // ....
});
```

`webpackHotUpdate` 做了三件事

1. 找到过期的模块和依赖并从缓存中删除

```js
delete installedModules[moduleId];
delete outdatedDependencies[moduleId];
```

2. 遍历所有的 module.children，重新 installedModules 所有的子模块
3. 最后将自身模块的内容做替换修改

```js
modules[moduleId] = appliedUpdate[moduleId];
```

5. 最后代码替换之后并没有重新执行，需要手动注册需要重新执行的模块方法. HMR-Plugin 将热更新代码注入到 浏览器运行代码中，也就是 HRM runtime） HRM runtime 删除过期的模块，替换为新的模块，然后开始执行相关代码

```js
if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!');
    printMe();
  });
}
```
