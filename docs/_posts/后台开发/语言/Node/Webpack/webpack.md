---
title: Webpack
date: 2020-11-21
draft: true
---

<!-- https://juejin.cn/post/6844904094281236487#heading-5 -->

## 基础

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)，能够很好地管理、打包 Web 开发中所用到的`HTML、Javascript、CSS`以及各种静态文件（图片、字体等）。它将项目当作一个整体，通过一个给定的的入口文件，webpack 将从这个文件开始找到你的项目的所有依赖文件，对于不同类型的资源，`webpack`有对应的模块加载器 loaders 。`webpack`模块打包器会分析模块间的依赖关系，优化且合并，最后打包成一个或多个浏览器可识别的 js 文件。

`webpack`的两大特色：

1. code splitting（可以自动完成）
2. loader 可以处理各种类型的静态文件，并且支持串联操作

组成：

- 入口(entry): 指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
- 输出(output): output 属性告诉 webpack 在哪里输出它所创建的 bundles
- loader: loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）
- plugins: 插件可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量
- 模式: 通过选择 development 或 production 之中的一个，来设置
- devtool: 用于控制是否以及如何生成源代码映射，可以帮助开发快速定位错误
- 热加载: webpack-hot-middleware, webpack-dev-server

### 配置文件

webpack 的默认打包配置文件 `webpack.config.js`。可以`npx webpack --config 配置文件名`手动设置

```js
const path = require('path');

module.exports = {
  // 打包模式，有生产环境与发布环境两种，默认是发布环境。production 代码被压缩为一行。development 代码不被压缩。
  mode: 'production',
  // 入口 简写
  entry: './index.js',
  // entry: {
  //   main: './index.js',
  // },
  // 出口
  output: {
    // 静态资源都放在 CDN
    publicPath: 'http://cdn.cn',
    filename: 'bundle.js',
    // path 后必须是一个绝对位置
    path: path.resolve(__dirname, 'bundle'),
  },
};
```

### module, chunk, bundle

module 是开发中的单个模块，chunk 是指 webpack 在进行模块的依赖分析的时候，代码分割出来的代码块，bundle 是由 webpack 打包出来的文件。

## webpack 构建流程和打包原理

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
3. 确定入口：根据配置中的 entry 找出所有的入口文件
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

> 在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果

### 简述

初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
编译：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理。
输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统。

## sourcemap

开启和关闭是通过 webpack 配置中的 devtool。

但是当在开发模式下，`mode: 'development'` 的时候默认 devtool 是开启状态，也就是说，开发模式下 sourcemap 功能默认是开启的。想主动关闭 devtool 只需要配置 `devtool: 'none'`即可。

sourcemap 是一个影射关系。 当 sourcemap 功能被关闭的时候，在浏览器中执行代码出错时， 控制台打印出的错误信息是打包出来的文件的行数，对开发者来说非常不友好。但是通过 sourcemap，如果知道了打包出来的文件 main.js 中的 96 行出错了，它能通过这个影射关系知道 main.js 实际是对应 src 目录下 index.js 文件的第一行，这个时候浏览器控制台就会打印出错误信息，告诉开发者是 index.js 文件的第一行出错了。

主动开启 sourcemap 只要在 webpack 配置中，将 `devtool` 设置为 `source-map` 即可。

source-map 解析 error https://my.oschina.net/u/4296470/blog/3202142

### devtool

devtool 就是去配置 sourcemap，方便调试，能准确定位到代码错误

- cheap
  - 定位到行，不定位到列（提示性能）
- module
  - 把依赖模块中的代码一并做映射
- eval
  - 使用 eval 形式做 sourcemap 映射
- inline
  - 行内的映射关系

最好的配置：

```js
// 开发时
devtool: 'cheap-module-eval-source-map',
// 线上环境：
devtool: 'cheap-module-source-map'
```

#### webpack 多页面打包配置

在 entry 中配置多入口，并在 plugins 中配置多个 HtmlWebpackPlugin

```js
// config配置
const configs = {
	entry: {
		index: './src/index.js',
		list: './src/list.js',
		detail: './src/detail.js',
	},
        ......其他配置
}
// 根据配置自动生成HtmlWebpackPlugin
	Object.keys(configs.entry).forEach(item => {
		plugins.push(
			new HtmlWebpackPlugin({
				template: 'src/index.html',
				filename: `${item}.html`,
				chunks: ['runtime', 'vendors', item]  // 只引入需要的打包生成文件，不需要引入其他多余的文件
			})
		)
	});
configs.plugins = makePlugins(configs);
```

#### tree sharking

https://www.codenong.com/j5f0ea1785188252e4c4cfdc1/

#### webpack 去掉 console 和 debugger 的插件

uglifyjs-webpack-plugin
https://www.jianshu.com/p/d95fd59bbef8

terser-webpack-plugin

有啥不同

### sourceMap 的原理

sourceMap 本质上是一种映射关系，打包出来的 js 文件中的代码可以映射到代码文件的具体位置。例如在打包后有代码错误，这种映射关系会帮助我们直接找到在源代码中的错误
[source map 的原理探究](https://www.cnblogs.com/Wayou/p/understanding_frontend_source_map.html)

### 结构和还原

sourcemap 文件是长什么样子的， node 层是如何做还原的？

## `__pure__`

js 代码压缩过程中，某些从其他依赖中引入的函数，压缩工具很难判断其是否有副作用，因此可能会将某些不需要的代码保存下来。 针对 uglifyjs 或者 terserjs，可以通过 `/*@__PURE__*/` 或者 `/*#__PURE__*/` 这样的标签来显式声明定义是不包含副作用的。压缩工具在获取到这个信息之后，就可以放心的将未被使用的定义代码直接删除了。

在 [terser online](https://xem.github.io/terser-online/) 中尝试如下代码，观察编译结果的区别：

```js
(function() {
  const unused = window.unknown();
  const used = 'used';

  console.log(used);
})();
```

上面的代码中，因为 `window.unknown()` 这个函数的调用细节对 terser 是不透明的，压缩工具无法判明使用是否会存在副作用。虽然 unused 这个变量没有被使用到，但是为了避免副作用丢失，terser 只能将 `window.unknown()` 调用保留下来。最终生成的压缩代码为：

```js
!(function() {
  window.unknown();
  console.log('used');
})();
```

而如果将代码加上显式声明：

```js
(function() {
  const unused = /*#__PURE__*/ window.unknown();
  const used = 'used';

  console.log(used);
})();
```

那么，terser 就可以放心的将整个调用删除。最终的压缩结果为：

```js
console.log('used');
```

## webpack 如何实现动态加载

webpack 动态加载就两种方式：import()和 require.ensure，不过他们实现原理是相同的。

我觉得这道题的重点在于动态的创建 script 标签，以及通过 jsonp 去请求 chunk，推荐的文章是： https://juejin.cn/post/6844903888319954952

## 其他

- 入口怎么配置，多页应用怎么进行配置, 多个入口怎么分割。多个 entry ？
- 如何批量引入组件，require.context
- webpack 的劣势在哪里
- 前端工程化的理解、如何自己实现一个文件打包，比如一个 JS 文件里同时又 ES5 和 ES6 写的代码，如何编译兼容他们
- markdown 是如何进行解析并最终渲染成为 html 的？
- 为什么 webpack 的 externals 处理并引入 cdn 之后就可以直接运行了 ？
- 有没有做过优化相关的？webpack 做了哪些优化？
- cache-loader 和 hard-source-webpack-plugin 的区别是什么？
- webpack, rollup 与 vite 之间的区别是什么
- webpack 的 loader 和 plugin 区别是什么，有没有写过 loader 和 plugin
- webpack 打包速度过慢怎么办
- webpack 配置用到 webpack.optimize.UglifyJsPlugin 这个插件，有没有觉得压缩速度很慢，有什么办法提升速度。
- webpack 是怎么把 es6 的语法编译成 es5 甚至更低版本的
- babel 把 ES6 转成 ES5 或者 ES3 之类的原理是什么，有没有去研究
