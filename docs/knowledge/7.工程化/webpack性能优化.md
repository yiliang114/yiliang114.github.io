---
title: webpack 性能优化
date: 2020-11-21
draft: true
---

<!-- https://segmentfault.com/a/1190000021952886 -->

## webpack 性能优化

从两个方面考虑：

1. 有哪些方式可以减少 Webpack 的打包时间
2. 有哪些方式可以让 Webpack 打出来的包更小. 优化这一点为主。

### 优化 webpack 打包速度

1. happack 插件？
2. 使用 dll 插件优化打包时间
3. 将变动很少的模块划分出 webpack 的主 bundlejs

UglifyJsPlugin 压缩很慢，如何提高速度? 缓存原理，压缩只重新压缩改变的，还有就是减少冗余的代码，压缩只用于生产阶段.

build 环境下一般会对输出的 js 文件再进一步所压缩处理（但是会丢失 sourcemap， 线上出问题无法及时定位）， 同时会去 console 提升性能，去 console 可以使用 webpack 插件或者自行封装一个根据环境变量决定是否输出的 log 方法

生产模式：

- 关闭 sourcemap (选择)
- webpack 配置给 `optimization: { minimize: true }`
- 添加 externals 分离出一些大的包，比如 vue

开发模式：

- 按需打包
- babel-loader ts(x) 处理之后上层加一层 cache-loader 用来缓存
- dll
- happack
- 开发环境去除所有跟 minimize, chunk 之类的配置

模块按需编译：https://zhuanlan.zhihu.com/p/137120584

From 掘金：

解题思路

- speed-measure-webpack-plugin
- 排除三方库，防止二次打包
- thread-loader
- cache-loader
- HappyPack
- parallel-webpack
  ...

可能追加的面试题：

- 未优化前构建需要多少时间，优化后构建需要多少时间？
- 有没有分析是什么问题导致构建速率变慢？

#### webpack 打包慢

1. 配置 externals
2. 进阶方法 DllPlugin 和 DllReferencePlugin
3. HappyPack 开启多进程编译，但是也并不一定支持所有 loader 都适合
4. babel-loader 开启缓存
5. 模块按需加载

#### 你说一下 webpack 的一些 plugin，怎么使用 webpack 对项目进行优化。

构建优化

1. 减少编译体积 ContextReplacementPlugin、IgnorePlugin、babel-plugin-import、babel-plugin-transform-runtime。
2. 并行编译 happypack、thread-loader、uglifyjsWebpackPlugin 开启并行
3. 缓存 cache-loader、hard-source-webpack-plugin、uglifyjsWebpackPlugin 开启缓存、babel-loader 开启缓存
4. 预编译 dllWebpackPlugin && DllReferencePlugin、auto-dll-webpack-plugin

性能优化

1. 减少编译体积 Tree-shaking、Scope Hositing。
2. hash 缓存 webpack-md5-plugin
3. 拆包 splitChunksPlugin、import()、require.ensure

#### 优化 Loader

对于 Loader 来说，影响打包效率首当其冲必属 Babel 了。因为 Babel 会将代码转为字符串生成 AST，然后对 AST 继续进行转变最后再生成新的代码，项目越大，**转换代码越多，效率就越低**。

首先我们可以**优化 Loader 的文件搜索范围**

```js
module.exports = {
  module: {
    rules: [
      {
        // js 文件才使用 babel
        test: /\.js$/,
        loader: 'babel-loader',
        // 只在 src 文件夹下查找
        include: [resolve('src')],
        // 不会去查找的路径。  `node_modules` 中使用的代码都是编译过的
        exclude: /node_modules/,
      },
    ],
  },
};
```

当然这样做还不够，还可以将 Babel 编译过的文件**缓存**起来，下次只需要编译更改过的代码文件即可，这样可以大幅度加快打包时间

```js
loader: 'babel-loader?cacheDirectory=true';
```

#### cache-loader

在性能开销较大的 loader 前面使用这个 loader 能够缓存住上一次的结果

#### HappyPack

受限于 Node 是单线程运行的，所以 Webpack 在打包的过程中也是单线程的，特别是在执行 Loader 的时候，长时间编译的任务很多，这样就会导致等待的情况。

**HappyPack 可以将 Loader 的同步执行转换为并行的**，这样就能充分利用系统资源来加快打包效率了

```js
module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [resolve('src')],
        exclude: /node_modules/,
        // id 后面的内容对应下面
        loader: 'happypack/loader?id=happybabel',
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader?cacheDirectory'],
      // 开启 4 个线程
      threads: 4,
    }),
  ],
};
```

#### DllPlugin

**DllPlugin 可以将特定的类库提前打包然后引入**。这种方式可以极大的减少打包类库的次数，只有当类库更新版本才有需要重新打包，并且也实现了将公共代码抽离成单独文件的优化方案。

接下来我们就来学习如何使用 DllPlugin

```js
// 单独配置在一个文件中
// webpack.dll.conf.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // 想统一打包的类库
    vendor: ['react'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].dll.js',
    library: '[name]-[hash]',
  },
  plugins: [
    new webpack.DllPlugin({
      // name 必须和 output.library 一致
      name: '[name]-[hash]',
      // 该属性需要与 DllReferencePlugin 中一致
      context: __dirname,
      path: path.join(__dirname, 'dist', '[name]-manifest.json'),
    }),
  ],
};
```

然后我们需要执行这个配置文件生成依赖文件，接下来我们需要使用 `DllReferencePlugin` 将依赖文件引入项目中

```js
// webpack.conf.js
module.exports = {
  // ...省略其他配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      // manifest 就是之前打包出来的 json 文件
      manifest: require('./dist/vendor-manifest.json'),
    }),
  ],
};
```

#### 代码压缩

在 Webpack3 中，我们一般使用 `UglifyJS` 来压缩代码，但是这个是单线程运行的，为了加快效率，我们可以使 `webpack-parallel-uglify-plugin` 来并行运行 `UglifyJS`，从而提高效率。

在 Webpack4 中，我们就不需要以上这些操作了，只需要将 `mode` 设置为 `production` 就可以默认开启以上功能。代码压缩也是我们必做的性能优化方案，当然我们不止可以压缩 JS 代码，还可以压缩 HTML、CSS 代码，并且在压缩 JS 代码的过程中，我们还可以通过配置实现比如删除 `console.log` 这类代码的功能。

#### 其他小的优化点

- `resolve.extensions`：用来表明文件后缀列表，默认查找顺序是 `['.js', '.json']`，如果你的导入文件没有添加后缀就会按照这个顺序查找文件。我们应该尽可能减少后缀列表长度，然后将出现频率高的后缀排在前面
- `resolve.alias`：可以通过别名的方式来映射一个路径，能让 Webpack 更快找到路径

### 优化开发速度(开发环境热更新缓慢)

现象： 做了简单的 router code split 之后，由于项目引入的资源过大，app.js 以及一些 chunk 还是达到了 10 几甚至 20 几 M ，导致在 dev 环境下 ， 页面刷新也很慢。（build 之后其实相对还好， 开启 gzip 之后也就几百 k）。刷新加载需要很多秒.

因为是老项目，页面非常多而大的 SPA, 编译速度很慢， 接手初期的启动速度需要 1 分钟以上，每次保存的热加载，需要 5s 左右，肉眼可见的等待时间。

处理方式：

1. 利用原生的 vue-cli 脚手架，将不同业务的页面拆开为多页应用。
2. 加入 cache-loader ?

分析：

导致 chunk 大有可能的原因：

1. 引入的包过多，多大。 最有可能的冗余包：
   1. ant icon
   2. moment.js
2. 代理的网络的原因，因为有时候本地加载开发资源时间是几百毫秒级别，有时候是好多秒，造成了开发阶段的体验很差。

确认自己的猜想：

1. vue ui 或者安装 webpack 的一个插件可视化查看造成 chunk 大的原因

解决方案:

1. 开发环境继续拆包
2. 编译缓存，hapack cache-loader 继续缓存被编译的部分，让热加载更新的部分只更新修改的部分（尽可能少）
3. 排查网络原因

#### webpack 优化性能

生产环境的解决办法。 但是一般在开发环境不会有帮助，这些优化都是不会开启的。

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
- 7.thread-loader, parallel-webpack,happy,webpack 多进程打包
- 8.合理使用 sourceMap
- 9.结合 stats 分析打包结果
  通过命令生成一个关于打包情况的 stats 文件，并借助工具进行打包情况分析，通过分析打包的流程对相应内容进行优化
- 10.开发环境内存编译
- 11.开发环境无用插件剔除

### 减少 Webpack 打包后的文件体积 (性能优化)

#### code split

在生产环境用 cdn 替换本地的 npm 包的时候，会遇到一个问题，本地会有 lock 文件对 npm 依赖进行所版本管理，但是很多时候 cdn 引入的都是最新的线上 min 文件，造成了本地环境与线上环境变现不一致的情况。

背景： 使用 echarts 经查看本地安装的是 4.8.0，线上的 cdn 引用的是 latest 版本（近几天刚刚发布了 5.0 版本）， 通过查看 github 上的 readme 和 changelog 知道有些 api 进行了更新 TODO: ， 所以导致原来的属性配置，线条产生了变化（估计应该是默认值变了 ？）

解决办法： cdn 锁版本，跟 npm 依赖安装的包版本保持一致即可。 不过后续更新版本可能需要手动更新 cdn 的版本号。

步骤：

1. vue-router 中的通过 webpack 的 `() => import` or `require.ensure` API 能够自动进行代码分割
2. 通过 analyzer 进行分析 js 包的大小，webpack 中的 externals 能够拆分包，通过外链 cdn 的形式引入

#### 按需加载

babel-import-plugin 原理是啥？

利用 Tree Shaking 来处理， 减少依赖加载的内容。

使用按需加载，将每个路由页面单独打包为一个文件。不仅仅路由可以按需加载，对于 `lodash` 这种大型类库同样可以使用这个功能。

#### webpack 打包 vue 速度太慢怎么办？

1. 使用`webpack-bundle-analyzer`对项目进行模块分析生成 report，查看 report 后看看哪些模块体积过大，然后针对性优化，比如我项目中引用了常用的 UI 库 element-ui 和 v-charts 等

2. 配置 webpack 的`externals`，官方文档的解释：防止将某些`import`的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖。
   所以，可以将体积大的库分离出来：

```js
// ...
externals: {
    'element-ui': 'Element',
    'v-charts': 'VCharts'
}
```

3. 然后在`main.js`中移除相关库的 import

4. 在`index.html`模板文件中，添加相关库的`cdn`引用，如：

```html
<script src="https://unpkg.com/element-ui@2.10.0/lib/index.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/v-charts/lib/index.min.js"></script>
```

#### vue-cli@3 的 cdn 打包处理

包大小分析：https://cli.vuejs.org/zh/guide/cli-service.html#%E4%BD%BF%E7%94%A8%E5%91%BD%E4%BB%A4

#### webpack 优化问题：多页面提取公共资源

common-chunk-and-vendor-chunk

```js
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2, //最小重复的次数
          minSize: 0, //最小提取字节数
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
        },
      },
    },
  },
};
```

### 总结

构建优化

1. 减少编译体积 ContextReplacementPugin、IgnorePlugin、babel-plugin-import、babel-plugin-transform-runtime。
2. 并行编译 happypack、thread-loader、uglifyjsWebpackPlugin 开启并行
3. 缓存 cache-loader、hard-source-webpack-plugin、uglifyjsWebpackPlugin 开启缓存、babel-loader 开启缓存
4. 预编译 dllWebpackPlugin && DllReferencePlugin、auto-dll-webapck-plugin

性能优化

1. 减少编译体积 Tree-shaking、Scope Hositing。
2. hash 缓存 webpack-md5-plugin
3. 拆包 splitChunksPlugin、import()、require.ensure
