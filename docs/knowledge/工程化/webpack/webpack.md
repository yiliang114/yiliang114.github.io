---
title: webpack
date: 2020-11-21
aside: false
draft: true
---

## webpack

功能：

1. 打包 js
2. 加载图片，字体等资源
3. 将 bundle.[hash].js 插入 html 中
4. 清理旧的 dist 目录

- webpack 的入口文件怎么配置，多个入口怎么分割。
- webpack 配置用到 webpack.optimize.UglifyJsPlugin 这个插件，有没有觉得压缩速度很慢，有什么办法提升速度。
- webpack 的 loader 和 plugins 的区别
- 有没有去研究 webpack 的一些原理和机制，怎么实现的。
- gulp 和 webpack 有什么区别，为什么你要用 gulp?
- webpack 的原理, loader 和 plugin 是干什么的? 有自己手写过么 ?
- Rollup 和 webpack 区别, treeshaking 是什么?
- 前缀的处理方式： webpack 插件 postcss

- sourcemap
- webpack 常见的插件有哪一些
- webpack 打包一个 bundlejs
  https://www.jianshu.com/p/439764e3eff2
  理念就是将所有的资源都当成了一个模块, CSS,Image, JS 字体文件 都是资源, 都可以打包到一个 bundle.js 文件中.

- webpack 源码分析：<https://github.com/lihongxun945/diving-into-webpack>

- webpack 相关的配置
- 配置原理。
- webpack 打包去掉 console https://blog.csdn.net/neuq_zxy/article/details/78994349
- loader 执行的顺序是从右往左的。 https://blog.csdn.net/chengnuo628/article/details/52475446/
- rollup: 将小块的 js 打包成大的 js 包： https://www.cnblogs.com/tugenhua0707/p/8179686.html
- webpack 打包 https://www.cnblogs.com/ssh-007/p/7944491.html

### 谈谈你对 webpack 的看法

`WebPack` 是一个模块打包工具，你可以使用`WebPack`管理你的模块依赖，并编绎输出模块们所需的静态文件。它能够很好地管理、打包 Web 开发中所用到的`HTML、Javascript、CSS`以及各种静态文件（图片、字体等），让开发过程更加高效。对于不同类型的资源，`webpack`有对应的模块加载器。`webpack`模块打包器会分析模块间的依赖关系，最后 生成了优化且合并后的静态资源。

`webpack`的两大特色：

    1.code splitting（可以自动完成）

    2.loader 可以处理各种类型的静态文件，并且支持串联操作

`webpack` 是以`commonJS`的形式来书写脚本滴，但对 `AMD/CMD` 的支持也很全面，方便旧项目进行代码迁移。

`webpack`具有`requireJs`和`browserify`的功能，但仍有很多自己的新特性：

1. 对 CommonJS 、 AMD 、ES6 的语法做了兼容
2. 对 js、css、图片等资源文件都支持打包
3. 串联式模块加载器以及插件机制，让其具有更好的灵活性和扩展性，例如提供对 CoffeeScript、ES6 的支持
4. 有独立的配置文件 webpack.config.js
5. 可以将代码切割成不同的 chunk，实现按需加载，降低了初始化时间
6. 支持 SourceUrls 和 SourceMaps，易于调试
7. 具有强大的 Plugin 接口，大多是内部插件，使用起来比较灵活
8. webpack 使用异步 IO 并具有多级缓存。这使得 webpack 很快且在增量编译上更加快

### 简单介绍一下 webpack

##### webpack 概念

> 本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)，将项目当作一个整体，通过一个给定的的主文件，webpack 将从这个文件开始找到你的项目的所有依赖文件，使用 loaders 处理它们，最后打包成一个或多个浏览器可识别的 js 文件

组成：

- 入口(entry)
  入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
- 输出(output)
  output 属性告诉 webpack 在哪里输出它所创建的 bundles ，以及如何命名这些文件，默认值为 ./dist
- loader
  loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）
- 插件(plugins)
  loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量
- 模式
  通过选择 development 或 production 之中的一个，来设置 mode 参数，你可以启用相应模式下的 webpack 内置的优化
- devtool
  用于控制是否以及如何生成源代码映射，可以帮助开发快速定位错误

### webpack 的构建流程是什么

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
3. 确定入口：根据配置中的 entry 找出所有的入口文件
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

> 在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果

### 有哪些常见的 Loader？他们是解决什么问题的

css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
slint-loader：通过 SLint 检查 JavaScript 代码
babel-loader：把 ES6 转换成 ES5
file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去

### 有哪些常见的 Plugin？他们是解决什么问题的

define-plugin：定义环境变量
commons-chunk-plugin：提取公共代码

### loader plugin 的区别

loader 加载器
loader 是指 webpack 打包方案，对于很多文件例如 less,icon，图片等 webpack 不知道如何打包，通过 loader 来告诉 webapck 如何打包，让 webpack 拥有了加载和解析非 JavaScript 文件的能力
在 module.rules 中配置，也就是说他作为模块的解析规则而存在，类型为数组

Plugin 插件
plugin 是指插件包，plugins 里面的插件会帮助我们做一些其他的事情， 让 webpack 具有更多的灵活性，提升开发效率。
在 plugins 中单独配置。类型为数组，每一项是一个 plugin 的实例，参数都通过构造函数传入

对于 loader，它就是一个转换器，将 A 文件进行编译形成 B 文件，这里操作的是文件，比如将 A.scss 或 A.less 转变为 B.css，单纯的文件转换过程

plugin 是一个扩展器，它丰富了 wepack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点，执行广泛的任务。

### 编写过 webpack 的扩展嘛，Plugin 或者 loader

### 编写一个 loader

loader 简单来说就是一个函数，通过一个函数参数接受到源代码，并在函数内部对代码作出变更
newLoader.js

```js
module.exports = function (source) { // source代表的是源代码
    return source.replace('world', ‘wang’) // 将代码中的world替换成wang
}
```

此时也需要在 webpack.config.js 中进行配置

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
          path.resolve(__dirname, './loaders/newLoaders.js'), //  使用编写的loader
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
// 通过loader-utils处理参数
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

### 什么是 bundle,什么是 chunk，什么是 module

bundle 是由 webpack 打包出来的文件，chunk 是指 webpack 在进行模块的依赖分析的时候，代码分割出来的代码块。module 是开发中的单个模块

### webpack 如何配置跨域？

可以在 devServer 里面设置

```js
    devServer: {
        contentBase: './dist',  // 起一个在dist文件夹下的服务器
        open: true,    // 自动打开浏览器并访问服务器地址
        proxy: {   // 跨域代理
            '/api': 'http: //localhost:3000'  // 如果使用/api,会被转发（代理）到该地址
        },
        port: 8080,
        hot: true,  // 开启HMR功能
        hotOnly: true  // 即使HMR不生效，也不自动刷新
    },
```

### webpack 的热加载

websocket 打通的原理

### 有没有写过 plugin 或者 loader

### webpack 如何只打包更新修改过的文件

HMR 称为热模块替换,在前面我们知道 webpack-dev-server 在我们每次代码变更时都会自动刷新页面，但是我们想要的是只更新被修改代码都那部分页面显示，不希望页面全部刷新。这时候 HMR 可以来帮助我们实现这个功能

好处：

针对于样式调试更加方便
只会更新被修改代码的那部分显示

```js
...
    devServer: {
        contentBase: './dist',  // 起一个在dist文件夹下的服务器
        open: true,    // 自动打开浏览器并访问服务器地址
        proxy: {   // 跨域代理
            '/api': 'http: //localhost:3000'  // 如果使用/api,会被转发（代理）到该地址
        },
        hot: true,  // 开启HMR功能
        hotOnly: true  // 即使HMR不生效，也不自动刷新
    },
...
    plugins: [
    new HtmlWebpackPlugin({
        template: 'src/index.html'  // 模版html
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
    ],
...
```

### Webpack 热更新实现原理? 是如何做到在不刷新浏览器的前提下更新页面的

- Webpack 编译期，为需要热更新的 entry 注入热更新代码(EventSource 通信)
- 页面首次打开后，服务端与客户端通过 EventSource 建立通信渠道，把下一次的 hash 返回前端
- 客户端获取到 hash，这个 hash 将作为下一次请求服务端 hot-update.js 和 hot-update.json 的 hash
- 修改页面代码后，Webpack 监听到文件修改后，开始编译，编译完成后，发送 build 消息给客户端
- 客户端获取到 hash，成功后客户端构造 hot-update.js script 链接，然后插入主文档
- hot-update.js 插入成功后，执行 hotAPI 的 createRecord 和 reload 方法，获取到 Vue 组件的 render 方法，重新 render 组件， 继而实现 UI 无刷新更新。

### sourceMap 的原理

sourceMap 本质上是一种映射关系，打包出来的 js 文件中的代码可以映射到代码文件的具体位置。例如在打包后有代码错误，这种映射关系会帮助我们直接找到在源代码中的错误
[source map 的原理探究](https://www.cnblogs.com/Wayou/p/understanding_frontend_source_map.html)

### tree-shaking 的工作原理

Tree Shaking 可以剔除掉一个文件中未被引用掉部分(在 producton 环境下才会提出)，并且只支持 ES Modules 模块的引入方式，不支持 CommonJS 的引入方式。原因：ES Modules 是静态引入的方式，CommonJS 是动态的引入方式，Tree Shaking 只支持静态引入方式。
在开发环境下需要在 webpack 中配置，但是在生成环境下，由于已有默认配置可以不配置 optimization，但是 sideEffects 依然需要配置

[Tree-Shaking](https://github.com/LuoShengMen/StudyNotes/issues/457)

### code splitting 用的是什么插件

使用 Code Spliting 可以有两种方式
第一手动实现：
配置

```js
    entry: {
        lodash: './src/lodash.js',
        main: './src/index.js'
    }, // 入口文件
```

lodash.js

```js
import _ from 'lodash';
window._ = _;
```

第二：使用 optimization
同步代码：只需要在 webpack 中做 optimization 配置即可
异步代码：无需做任何配置，会自动进行代码分割，放入 dist 目录中

```js
    optimization: {
        splitChunks: {
            chunks: 'all'  // 遇到公用当类库时，自动的Code Spliting
        }
    },
```

### webpack 配置优化项目?

## webpack 配置文件

### webpack.config.js

webpack.config.js 是 webpack 的默认打包配置文件。也可以`npx webpack --config 配置文件名`手动设置

```js
/**
 * Wepack配置接口
 */
const path = require('path');

module.exports = {
  // 打包模式
  mode: 'production',
  // 入口
  entry: './index.js',
  // 出口
  output: {
    filename: 'bundle.js',
    // path 后必须是一个绝对位置
    path: path.resolve(__dirname, 'bundle'),
  },
};
```

其中`entry: "./index.js"`是一个简写，

```
entry: {
    main: "./index.js"
}
```

### mode

打包模式，有生产环境与发布环境两种，默认是发布环境。

- production
  - 代码被压缩为一行
- development
  - 代码不被压缩

### 多入口

最后都会讲其写入到 html 的 script 标签中

```js
entry:{
    main: 'a/index.js',
    sub: 'b/main.js'
}
// 多个入口是不可打包为同一个JS的，
output: {
    filename: '[name].js'
}
```

### 为打包出的 JS 加前缀

比如静态资源都放在 CDN 上，那么希望打包出 srcipt 的 src 是一个 http 地址
可这样做：

```
output: {
    publicPath: 'http://cdn.cn'
    filename: '[name].js'
}
```

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

### webpack 优化性能

一：提升 webpack 打包速度

- 1.跟上技术的迭代更新
- 2.尽可能少的模块使用 loader
- 3.plugin 尽可能精简并保证可靠
  例如尽可能使用官方的插件，并在合适的环境下使用对象的插件
- 4.resolve 参数合理配置
  当通过 import child from './child/child'形式引入文件时，会先去寻找.js 为后缀当文件，再去寻找.jsx 为后缀的文件

```js
resolve: {
   extensions: ['.js', '.jsx']，
  mainFiles: ['index', 'child']，  // 如果是直接引用一个文件夹，那么回去直接找index开头的文件，如果不存在再去找child开头的文件
  alias: {
   roshomon: path.resolve(__dirname, '../src/child');  // 别名替换，引入roshomon其实是引入../src/child
}
}
```

- 5.使用 DellPlugin 提高打包速度
  对于第三方库，只打包分析一次，后面的每次打包都不会重复打包第三方库
  webpack.dll.js

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['lodash'],
    react: ['react', 'react-dom'],
    jquery: ['jquery'],
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      // 使用该插件分析第三方库，并把库里面的映射关系放到[name].manifest.json里，并放在dll文件里
      name: '[name]',
      path: path.resolve(__dirname, '../dll/[name].manifest.json'),
    }),
  ],
};
```

webpack.common.js

```js
// 引用
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
// plugins配置
....
const plugins = [
	new HtmlWebpackPlugin({
		template: 'src/index.html'
	}),
	new CleanWebpackPlugin(['dist'], {
		root: path.resolve(__dirname, '../')
	})
];

const files = fs.readdirSync(path.resolve(__dirname, '../dll'));
files.forEach(file => {
	if(/.*\.dll.js/.test(file)) {
		plugins.push(new AddAssetHtmlWebpackPlugin({  // 将dll.js文件自动引入html
			filepath: path.resolve(__dirname, '../dll', file)
		}))
	}
	if(/.*\.manifest.json/.test(file)) {
		plugins.push(new webpack.DllReferencePlugin({ // 当打包第三方库时，会去manifest.json文件中寻找映射关系，如果找到了那么就直接从全局变量(即打包文件)中拿过来用就行，不用再进行第三方库的分析，以此优化打包速度
			manifest: path.resolve(__dirname, '../dll', file)
		}))
	}
})
```

package.json

```js
    "build:dll": "webpack --config ./build/webpack.dll.js"
```

- 6.控制包文件大小
  可以通过 treeShaking 或者拆分文件来优化打包速度
- 7.thread-loader, parallel-webpack,happywebpack 多进程打包
- 8.合理使用 sourceMap
- 9.结合 stats 分析打包结果
  通过命令生成一个关于打包情况的 stats 文件，并借助工具进行打包情况分析，通过分析打包的流程对相应内容进行优化
- 10.开发环境内存编译
- 11.开发环境无用插件剔除

### webpack 多页面打包配置

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

### 如何提高 webpack 构件速度的

利用 DllPlugin 预编译资源模块
使用 Happypack 加速代码构建

### webpack 优化问题：多页面提取公共资源

common-chunk-and-vendor-chunk

```js
optimization: {
    splitChunks: {
        cacheGroups: {
            commons: {
                chunks: "initial",
                          minChunks: 2,//最小重复的次数
                          minSize: 0//最小提取字节数
            },
            vendor: {
                test: /node_modules/,
                chunks: "initial",
                name: "vendor",
            }
        }
    }
}
```
