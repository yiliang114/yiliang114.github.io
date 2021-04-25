---
title: Webpack
date: 2020-11-21
draft: true
---

<!-- https://juejin.cn/post/6844904094281236487#heading-5 -->

## 基础

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)，能够很好地管理、打包 Web 开发中所用到的`HTML、Javascript、CSS`以及各种静态文件（图片、字体等），将项目当作一个整体，通过一个给定的的入口文件，webpack 将从这个文件开始找到你的项目的所有依赖文件，对于不同类型的资源，`webpack`有对应的模块加载器 loaders 。`webpack`模块打包器会分析模块间的依赖关系，优化且合并，最后打包成一个或多个浏览器可识别的 js 文件。

`webpack`的两大特色：

1. code splitting（可以自动完成）
2. loader 可以处理各种类型的静态文件，并且支持串联操作

特性：

1. 对 CommonJS 、 AMD 、ES6 的语法做了兼容
2. 对 js、css、图片等资源文件都支持打包
3. 有独立的配置文件 webpack.config.js
4. 可以将代码切割成不同的 chunk，实现按需加载，降低了初始化时间
5. 支持 SourceUrls 和 SourceMaps，易于调试
6. 具有强大的 Plugin 接口，大多是内部插件，使用起来比较灵活
7. webpack 使用异步 IO 并具有多级缓存。这使得 webpack 很快且在增量编译上更加快

组成：

- 入口(entry): 入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
- 输出(output): output 属性告诉 webpack 在哪里输出它所创建的 bundles ，以及如何命名这些文件，默认值为 ./dist
- loader: loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）
- 插件(plugins): loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量
- 模式: 通过选择 development 或 production 之中的一个，来设置 mode 参数，你可以启用相应模式下的 webpack 内置的优化
- devtool: 用于控制是否以及如何生成源代码映射，可以帮助开发快速定位错误
- 热加载: Webpack-hot-middleware, webpack-dev-server

### webpack.config.js

webpack 的默认打包配置文件。可以`npx webpack --config 配置文件名`手动设置

```js
/**
 * Webpack 配置接口
 */
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

webpack 构建流程是怎样的？

## loader plugin 的区别

### TODO: loader

loader 是用来处理不同类型的文件的，比如 markdown-loader, file-loader, css-loader 等。

对于 loader，它就是一个转换器，将 A 文件进行编译形成 B 文件，这里操作的是文件，比如将 A.scss 或 A.less 转变为 B.css，单纯的文件转换过程；

loader 是指 webpack 打包方案，对于很多文件例如 less,icon，图片等 webpack 不知道如何打包，通过 loader 来告诉 webpack 如何打包，让 webpack 拥有了加载和解析非 JavaScript 文件的能力

在 module.rules 中配置，也就是说他作为模块的解析规则而存在，类型为数组

当打包到非 JS 文件的时候，webpack 会在`module`中配置里查找，然后根据`rules`中的`test`选择一个 loader 来处理。loader 执行的顺序是从右往左的。

#### 常见的 Loader

- vue-loader
- css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
- style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
- eslint-loader：通过 SLint 检查 JavaScript 代码
- babel-loader：把 ES6 转换成 ES5
- file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
- url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去

### 常用 loader

#### file-loader 打包图片

当发现是图片，使用 file-loader 来打包 file-loader 做的事：

- 将图片移到 dist 目录下
- 给图片改个名字
- 将名字返回给引入模块的变量中

#### url-loader

将文件打包为 Base64 编码，当图片特别小（1~2k）的时候适用。但是大图片不使用，可以给它加上一个`limit`来限制

引入的小图片为什么被渲染成了 base64？ 这个是 webpack 里面的对应插件处理的.对于小于多少 K 以下的图片(规定的格式)直接转为 base64 格式渲染;具体配置在 webpack.base.conf.js 里面的 rules 里面的 url-loader 这样做的好处:在网速不好的时候先于内容加载和减少 http 的请求次数来减少网站服务器的负担

#### 打包样式

- `css-loader` 能帮我们分析出几个 CSS 文件之间的关系
- `style-loader` 在得到 css-loader 生成的文件后，style-loader 会将这段样式挂在到 header 标签中

#### 厂商前缀 postcss-loader

```js
use: [
  'style-loader', // creates style nodes from JS strings
  'css-loader', // translates CSS into CommonJS
  'postcss-loader', // compiles Sass to CSS, using Node Sass by default
];
```

它可以进行配置，要创建一个`postcss.config.js`文件

```js
module.exports = {
  plugins: [require('autoprefixer')],
};
```

`autoprefixer`这个插件可以帮我们添加厂商前缀

### 编写一个 loader

loader 简单来说就是一个函数，通过一个函数参数接受到源代码，并在函数内部对代码作出变更

```js
// newLoader.js
// source 代表的是源代码
module.exports = function(source) {
  return source.replace('world', 'wang'); // 将代码中的 world 替换成 wang
};
```

此时也需要在 `webpack.config.js` 中进行配置

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          path.resolve(__dirname, './loaders/newLoaders.js'), //  使用编写的 loader
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
};
```

loader 的使用还可以通过对象的形式使用例如

```js
use: [
  {
    loader: path.resolve(__dirname, './loaders/newLoaders.js'),
    options: {
      name: 'Wang',
    },
  },
];
```

loader 有两种方式获取 options 中传递的参数

```js
// 通过this.query访问参数
module.exports = function(source) {
  return source.replace('world', this.query.name);
};
// 通过 loader-utils 处理参数
const loaderUtils = require('loader-utils');

module.exports = function(source) {
  const options = loaderUtils.getOptions(this);
  return source.replace('world', options.name);
};
```

如果想要返回 err, 处理后源代码，source,或者其他内容，那么可以使用 this.callback

```js
const loaderUtils = require('loader-utils');
module.exports = function(source) {
  const options = loaderUtils.getOptions(this);
  const result = source.replace('world', options.name);
  this.callback(null, result);
};
```

如果想要在函数内部做异步处理那么可以使用 this.async()

```js
const loaderUtils = require('loader-utils');
module.exports = function(source) {
  const options = loaderUtils.getOptions(this);
  const result = source.replace('world', options.name);
  const callback = this.async(); // 声明一下内部有异步操作

  setTimeout(() => {
    const result = source.replace('dell', options.name);
    callback(null, result);
  }, 1000);
};
```

如果我们有多个 loader 需要使用，我们可以通过 resolveLoader 来统一使用 loaders 文件中 loader
如下配置

```js
       ....
	resolveLoader: {
		modules: ['node_modules', './loaders']
	},
	module: {
		rules: [{
			test: /\.js/,
			use: [
				{
					loader: 'replaceLoader',
				},
				{
					loader: 'newloaders',
					options: {
						name: 'Wang'
					}
				},
			]
		}]
	},
        ....
```

> 编写 loader 需要注意的是不要使用箭头函数，会导致 this 指向错误

### plugin

plugin 是用来处理经过 loader 处理编译之后的内容的，比如 uglify-plugin 等。

对于 plugin，它就是一个扩展器，它丰富了 webpack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点，执行广泛的任务。

plugin 是指插件包，plugins 里面的插件会帮助我们做一些其他的事情， 让 webpack 具有更多的灵活性，提升开发效率。
在 plugins 中单独配置。类型为数组，每一项是一个 plugin 的实例，参数都通过构造函数传入

使用`plugins`让打包变的便捷，可以在 webpack 打包的某时刻帮做一些事情，他很像一个生命周期函数

webpack 在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在特定的阶段钩入想要添加的自定义功能。Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好。

Plugin API:

1. compiler 暴露了和 Webpack 整个生命周期相关的钩子
1. compilation 暴露了与模块和依赖有关的粒度更小的事件钩子插件需要在其原型上绑定 apply 方法，才能访问 compiler 实例
1. 传给每个插件的 compiler 和 compilation 对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件找出合适的事件点去完成想要的功能
1. emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机)watch-run 当依赖的文件发生变化时会触发
1. 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住

### 有哪些常见的 Plugin？他们是解决什么问题的

define-plugin：定义环境变量
commons-chunk-plugin：提取公共代码
webpack 打包去掉 console https://blog.csdn.net/neuq_zxy/article/details/78994349
清理旧的 dist 目录
将 `bundle.[hash].js` 插入 html 中

### 常见 Plugin

#### html-webpack-plugin

html-webpack-plugin 会在打包结束后，自动生成一个 html 文件,并把打包生成的 js 自动引入到 HTML 中。
可以给这个 html 制定一个模板

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 插件
plugins: [
    new HtmlWebpackPlugin({
        template: 'src/index.html'
    })
],
```

#### clean-webpack-plugin

帮助打包时先清空 dist 目录

#### 你说一下 webpack 的一些 plugin，怎么使用 webpack 对项目进行优化。

正好最近在做 webpack 构建优化和性能优化的事儿，当时吹了大概 15~20 分钟吧，插件请见[webpack 插件归纳总结](https://segmentfault.com/a/1190000016816813)。

构建优化

1. 减少编译体积 ContextReplacementPlugin、IgnorePlugin、babel-plugin-import、babel-plugin-transform-runtime。
2. 并行编译 happypack、thread-loader、uglifyjsWebpackPlugin 开启并行
3. 缓存 cache-loader、hard-source-webpack-plugin、uglifyjsWebpackPlugin 开启缓存、babel-loader 开启缓存
4. 预编译 dllWebpackPlugin && DllReferencePlugin、auto-dll-webpack-plugin

性能优化

1. 减少编译体积 Tree-shaking、Scope Hositing。
2. hash 缓存 webpack-md5-plugin
3. 拆包 splitChunksPlugin、import()、require.ensure

### 编写一个 Plugin

plugin 插件是一个类，如下是一个 plugin 的基本结构

```js
class CopyrightWebpackPlugin {
	constructor(options){
		console.log(options) // options是插件传入的参数
	}
	apply(compiler) { // compiler是webpack的实例}
}
module.exports = CopyrightWebpackPlugin;
```

结构写好之后，需要 webpack 中引入使用插件

```js
const path = require('path');
const CopyRightWebpackPlugin = require('./plugins/copyright-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  plugins: [new CopyRightWebpackPlugin()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
};
```

接下啦完善 apply, 利用打包过程中 emit 的时刻来进行处理，添加一个 copyright.txt 文件，

```js
	apply(compiler) { // compiler是webpack的实例

		compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
			console.log('compiler');
		})

		compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb) => {
			compilation.assets['copyright.txt']= {  // compilation.assets是打包生成的文件，可以向其中添加内容
				source: function() {
					return 'copyright by dell lee'
				},
				size: function() {
					return 21;
				}
			};
			cb();
		})
	}
```

### Plugin 插件的原理是什么？

### Plugin 中有异步请求会阻塞后面的 Plugin 吗？

### 有自己手写过 loader 和 plugin 么 ?

## sourcemap

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

### sourcemap

开启和关闭是通过 webpack 配置中的 devtool。

但是当在开发模式下，`mode: 'development'` 的时候默认 devtool 是开启状态，也就是说，开发模式下 sourcemap 功能默认是开启的。想主动关闭 devtool 只需要配置 `devtool: 'none'`即可。

sourcemap 是一个影射关系。 当 sourcemap 功能被关闭的时候，在浏览器中执行代码出错时， 控制台打印出的错误信息是打包出来的文件的行数，对开发者来说非常不友好。但是通过 sourcemap，如果知道了打包出来的文件 main.js 中的 96 行出错了，它能通过这个影射关系知道 main.js 实际是对应 src 目录下 index.js 文件的第一行，这个时候浏览器控制台就会打印出错误信息，告诉开发者是 index.js 文件的第一行出错了。

主动开启 sourcemap 只要在 webpack 配置中，将 `devtool` 设置为 `source-map` 即可。

source-map 解析 error https://my.oschina.net/u/4296470/blog/3202142

#### 结构和还原

sourcemap 文件是长什么样子的， node 层是如何做还原的？

## webpack 如何实现动态加载

> 懒加载模块的原理

讲道理 webpack 动态加载就两种方式：import()和 require.ensure，不过他们实现原理是相同的。

我觉得这道题的重点在于动态的创建 script 标签，以及通过 jsonp 去请求 chunk，推荐的文章是： https://juejin.cn/post/6844903888319954952

## Dev-Server 是怎么跑起来

### webpack-dev-server 配置跨域

```js
module.exports = {
  // ...
  devServer: {
    contentBase: './dist', // 起一个在 dist 文件夹下的服务器
    open: true, // 自动打开浏览器并访问服务器地址
    proxy: {
      // 跨域代理
      '/api': 'http: //localhost:3000', // 如果使用 /api,会被转发（代理）到该地址
    },
    port: 8080,
    hot: true, // 开启 HMR 功能
    hotOnly: true, // 即使 HMR 不生效，也不自动刷新
  },
  // ...
};
```

## 对比

Rollup 和 Webpack 横纵向对比了一下(tree-shaking 有什么不一样? )

https://www.webpackjs.com/contribute/writing-a-plugin/

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
- chunk、bundle 和 module 有什么区别
- 有没有去研究 webpack 的一些原理和机制，怎么实现的

### 如何分 chunk?如何按需加载组件？

## webpack 如何打包 babel？
