---
title: create-react-app 源码
date: "2020-10-26"
draft: true
---

## 入口

<!-- react 源码：https://react.jokcy.me/book/flow/perform-work.html -->

### /bin/react-scripts.js

cra 项目创建的项目目录结构，已经 package.json 中的 npm start 执行脚本 ![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/Ybwd8-image.png)

在 node_modules 中找到 react-scripts 文件夹，查看 /bin/react-scripts.js 文件执行的脚本内容 ![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/76cBP-image.png)

用的不是很多的 api:

1. `Array.prototype.findIndex()` 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置
2. `[].filter(Boolean)` 直接过滤到数组中 == false 的值，比如 undefined null 0 false 等

`node` 执行的过程中 `process` 这个全局变量有一个属性 `argv` 是此次脚本执行的所有的参数集合。 比如我们执行 `npm start` 的时候， `argv` 的值是

![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/yJEj7-image.png)

```js
const args = process.argv.slice(2);
```

所以 `args` 的值最终会是 `['start']`. 所以最终下面一段代码其实就是 `node ../scripts/start`

![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/kXXpZ-image.png).

### `/scripts/start.js`

整个 start.js 文件内容比较冗杂，其实这里是在做一些浏览器相关的事情以及 webpack-dev-server 的配置、执行工作。浏览器相关的事情我们暂时先忽略。

![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/5cdGj-image.png)

![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/a2Kk3-image.png)

webpack 具体如何配置不在这篇文章的讨论范围之内，这里我们只粗略看一下 entry output 以及 module。 entry 配置 webpack 打包的入口，output 则是输入目录文件，包括在 dev 阶段的时候临时产出目录。 module 则是 loader 的配置，比如 babel-loader 等。

![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/zDeYM-image.png)
![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/TkMbR-image.png)
忽略了 entry 中热加载相关的路径之后，入口文件是 `paths.appIndexJs`.

![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/eYRA4-image.png)

那么接下来就从 webpack 打包的入口文件开始看起 `src/index.js`

### `src/index.js`

暂时忽略 serviceWorker
![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/PtAGS-image.png)
这个文件中我们需要关注具体内容之前，先来想一个常见的问题。index.js 文件中明明没有调用 react 但是却引入了 react ?

我们通过将代码在精简一下复制到 babel 官网的编辑框中，选择 preset-react 之后，实际就会发现， 源代码中的 `<div>111</div>` 标签被编译成为了 `React.createElement("div", null, "111")`, 这里就出现了 React ，所以如果没有引入 React 编译之后的代码块（右侧部分）就找不到 React 是什么了。

![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/Z57F4-image.png)

接着问题又来了，js 文件中的标签为啥会被编译成为 `React.createElement()` 这种形式呢？主要还是因为上面说到的 webpack.config.js 文件中的 module 对 react app 项目中的文件经过了 babel-loader 的处理，处理过程中添加了 react 相关的预设。

![](https://chatflow-files-cdn-1252847684.file.myqcloud.com/hPD7T-image.png)

当用 JSX 语法写的标签被编译成 `React.createElement()` （实际这个函数返回的是一个代表 react 组件的对象， 后面会说到）之后，`ReactDOM.render` 函数将获得这个 react 对象和一个真实 dom 节点作为两个参数。
