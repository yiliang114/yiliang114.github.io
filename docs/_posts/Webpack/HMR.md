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

### Webpack HMR 原理解析

> Hot Module Replacement（简称 HMR)

包含以下内容：

1.  热更新图
2.  热更新步骤讲解

![](https://segmentfault.com/img/remote/1460000022705602)

##### 第一步：webpack 对文件系统进行 watch 打包到内存中

webpack\-dev\-middleware 调用 webpack 的 api 对文件系统 watch，当文件发生改变后，webpack 重新对文件进行编译打包，然后保存到内存中。

webpack 将 bundle.js 文件打包到了内存中，不生成文件的原因就在于访问内存中的代码比访问文件系统中的文件更快，而且也减少了代码写入文件的开销。

这一切都归功于[memory\-fs](https://github.com/webpack/memory-fs)，memory\-fs 是 webpack\-dev\-middleware 的一个依赖库，webpack\-dev\-middleware 将 webpack 原本的 outputFileSystem 替换成了 MemoryFileSystem 实例，这样代码就将输出到内存中。

webpack\-dev\-middleware 中该部分源码如下:

```js
// compiler
// webpack-dev-middleware/lib/Shared.js
var isMemoryFs = !compiler.compilers && compiler.outputFileSystem instanceof MemoryFileSystem;
if (isMemoryFs) {
  fs = compiler.outputFileSystem;
} else {
  fs = compiler.outputFileSystem = new MemoryFileSystem();
}
```

##### 第二步：devServer 通知浏览器端文件发生改变

在启动 devServer 的时候，[sockjs](#)) 在服务端和浏览器端建立了一个 webSocket 长连接，以便将 webpack 编译和打包的各个阶段状态告知浏览器，最关键的步骤还是 `webpack-dev-server` 调用 webpack api 监听 compile 的 done 事件，当 compile 完成后，`webpack-dev-server` 通过 \_sendStatus 方法将编译打包后的新模块 hash 值发送到浏览器端。

```js
  // webpack-dev-server/lib/Server.js
  compiler.plugin('done', (stats) => {
    // stats.hash 是最新打包文件的 hash 值
    this._sendStats(this.sockets, stats.toJson(clientStats));
    this._stats = stats;
  });
  ...
  Server.prototype._sendStats = function (sockets, stats, force) {
    if (!force && stats &&
    (!stats.errors || stats.errors.length === 0) && stats.assets &&
    stats.assets.every(asset => !asset.emitted)
    ) { return this.sockWrite(sockets, 'still-ok'); }
    // 调用 sockWrite 方法将 hash 值通过 websocket 发送到浏览器端
    this.sockWrite(sockets, 'hash', stats.hash);
    if (stats.errors.length > 0) { this.sockWrite(sockets, 'errors', stats.errors); }
    else if (stats.warnings.length > 0) { this.sockWrite(sockets, 'warnings', stats.warnings); }      else { this.sockWrite(sockets, 'ok'); }
  };
```

##### 第三步：`webpack-dev-server`/client 接收到服务端消息做出响应

`webpack-dev-server` 修改了 webpack 配置中的 entry 属性，在里面添加了 webpack\-dev\-client 的代码，这样在最后的 bundle.js 文件中就会接收 websocket 消息的代码了。

`webpack-dev-server`/client 当接收到 type 为 hash 消息后会将 hash 值暂存起来，当接收到 type 为 ok 的消息后对应用执行 reload 操作。

在 reload 操作中，`webpack-dev-server`/client 会根据 hot 配置决定是刷新浏览器还是对代码进行热更新（HMR）。代码如下：

```js
  // webpack-dev-server/client/index.js
  hash: function msgHash(hash) {
      currentHash = hash;
  },
  ok: function msgOk() {
      // ...
      reloadApp();
  },
  // ...
  function reloadApp() {
    // ...
    if (hot) {
      log.info('[WDS] App hot update...');
      const hotEmitter = require('webpack/hot/emitter');
      hotEmitter.emit('webpackHotUpdate', currentHash);
      // ...
    } else {
      log.info('[WDS] App updated. Reloading...');
      self.location.reload();
    }
  }
```

##### 第四步：webpack 接收到最新 hash 值验证并请求模块代码

首先 webpack/hot/dev\-server（以下简称 dev\-server） 监听第三步 `webpack-dev-server`/client 发送的 `webpackHotUpdate` 消息，调用 webpack/lib/HotModuleReplacement.runtime（简称 HMR runtime）中的 check 方法，检测是否有新的更新。

在 check 过程中会利用 webpack/lib/JsonpMainTemplate.runtime（简称 jsonp runtime）中的两个方法 hotDownloadManifest 和 hotDownloadUpdateChunk。

hotDownloadManifest 是调用 AJAX 向服务端请求是否有更新的文件，如果有将发更新的文件列表返回浏览器端。该方法返回的是最新的 hash 值。

hotDownloadUpdateChunk 是通过 jsonp 请求最新的模块代码，然后将代码返回给 HMR runtime，HMR runtime 会根据返回的新模块代码做进一步处理，可能是刷新页面，也可能是对模块进行热更新。该 方法返回的就是最新 hash 值对应的代码块。

最后将新的代码块返回给 HMR runtime，进行模块热更新。

附：为什么更新模块的代码不直接在第三步通过 websocket 发送到浏览器端，而是通过 jsonp 来获取呢？

我的理解是，功能块的解耦，各个模块各司其职，dev\-server/client 只负责消息的传递而不负责新模块的获取，而这些工作应该有 HMR runtime 来完成，HMR runtime 才应该是获取新代码的地方。再就是因为不使用 `webpack-dev-server` 的前提，使用 webpack\-hot\-middleware 和 webpack 配合也可以完成模块热更新流程，在使用 webpack\-hot\-middleware 中有件有意思的事，它没有使用 websocket，而是使用的 EventSource。综上所述，HMR 的工作流中，不应该把新模块代码放在 websocket 消息中。

##### 第五步：HotModuleReplacement.runtime 对模块进行热更新

这一步是整个模块热更新（HMR）的关键步骤，而且模块热更新都是发生在 HMR runtime 中的 hotApply 方法中

```js
// webpack/lib/HotModuleReplacement.runtime
function hotApply() {
  // ...
  var idx;
  var queue = outdatedModules.slice();
  while (queue.length > 0) {
    moduleId = queue.pop();
    module = installedModules[moduleId];
    // ...
    // remove module from cache
    delete installedModules[moduleId];
    // when disposing there is no need to call dispose handler
    delete outdatedDependencies[moduleId];
    // remove "parents" references from all children
    for (j = 0; j < module.children.length; j++) {
      var child = installedModules[module.children[j]];
      if (!child) continue;
      idx = child.parents.indexOf(moduleId);
      if (idx >= 0) {
        child.parents.splice(idx, 1);
      }
    }
  }
  // ...
  // insert new code
  for (moduleId in appliedUpdate) {
    if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
      modules[moduleId] = appliedUpdate[moduleId];
    }
  }
  // ...
}
```

模块热更新的错误处理，如果在热更新过程中出现错误，热更新将回退到刷新浏览器，这部分代码在 dev\-server 代码中，简要代码如下：

```js
module.hot
  .check(true)
  .then(function(updatedModules) {
    if (!updatedModules) {
      return window.location.reload();
    }
    // ...
  })
  .catch(function(err) {
    var status = module.hot.status();
    if (['abort', 'fail'].indexOf(status) >= 0) {
      window.location.reload();
    }
  });
```

##### 第六步：业务代码需要做些什么？

当用新的模块代码替换老的模块后，但是我们的业务代码并不能知道代码已经发生变化，也就是说，当 hello.js 文件修改后，我们需要在 index.js 文件中调用 HMR 的 accept 方法，添加模块更新后的处理函数，及时将 hello 方法的返回值插入到页面中。代码如下

```js
// index.js
if (module.hot) {
  module.hot.accept('./hello.js', function() {
    div.innerHTML = hello();
  });
}
```
