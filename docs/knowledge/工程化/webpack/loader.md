---
title: webpack
date: 2020-11-21
aside: false
draft: true
---

# Loader

当打包到非 JS 文件的时候，webpack 会在`module`中配置里查找，然后根据`rules`中的`test`选择一个 loader 来处理。

## 打包静态资源

### 打包图片

#### file-loader

当发现是图片，使用 file-loader 来打包
file-loader 做的事：

- 将图片移到 dist 目录下
- 给图片改个名字
- 将名字返回给引入模块的变量中

```js
module: {
    rules: [{
        test: /\.jpg$/,
        use: {
            loader: 'file-loader'
        }
    }]
},
```

#### 配置项

让图片打包出来的名字与拓展名与原来一样
`'[name].[ext]'` 这种语法叫 `placehoder` 即占位符

```js
rules: [
  {
    test: /\.jpg$/,
    use: {
      loader: 'file-loader',
      // option 为配置参数
      options: {
        // 图片打包出来的名字和后缀原来的一样
        name: '[name]_[hash].[ext]',
      },
    },
  },
];
```

#### url-loader

将文件打包为 Base64 编码，当图片特别小（1~2k）的时候适用。

但是大图片不使用，可以给它加上一个`limit`来限制

```js
rules: [
  {
    test: /\.(jpg|png|gif)$/,
    use: {
      loader: 'url-loader',
      // option 为配置参数
      options: {
        limit: 2048,
      },
    },
  },
];
```

### 打包样式

```js
{
    test: /\.css$/,
    // 一种文件多个Loader就使用数组
    use: [
        'style-loader', 'css-loader'
    ]
}
```

- `css-loader` 能帮我们分析出几个 CSS 文件之间的关系
- `style-loader` 在得到 css-loader 生成的文件后，style-loader 会将这段样式挂在到 header 标签中

#### [使用 sass](https://webpack.js.org/loaders/sass-loader/)

loader 是**有顺序**的，顺序是：从数组的最后一个依次向前处理。

```js
use: [
  'style-loader', // creates style nodes from JS strings
  'css-loader', // translates CSS into CommonJS
  'sass-loader', // compiles Sass to CSS, using Node Sass by default
];
```

#### [厂商前缀 postcss-loader](https://webpack.js.org/loaders/postcss-loader/)

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

#### importLoaders

在 sass 文件中又 使用`@import`的方式去引入了其他文件，可能就会导致在打包时直接走 css-loader，而不会去走下面的两个 loader

`importLoaders`就是让`@import`方式引入方式的文件也走下面的两个 loader

```js
use: [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
    },
  },
  'sass-loader',
  'postcss-loader',
];
```

#### CSS modules

css-loader 直接将其打包注入到 header 中，可能造成 CSS 的干扰。即一个文件中引入了一个 CSS，其他地方都会受到影响

解决方法是配置`modules`：

```js
{
    loader: "css-loader",
    options:{
        importLoaders: 2,
        modules: true
    }
},
```

引入样式时使用 `style.className` 方式：

```js
import style form './style.sass'
// 添加样式

const img = new Image();
img.src = girl;

img.classList.add(style.girl)
```

#### 打包字体

打包时如果有字体文件的话打包又会报错，因为不认识字体文件。而对字体文件的打包只需要`file-loader`就可以了

```js
{
    test: /\.(eot|ttf|svg)$/,
    use: {
        loader: 'file-loader'
    }
}
```

### 介绍下 webpack 热更新原理，是如何做到在不刷新浏览器的前提下更新页面的

1. 当修改了一个或多个文件； 2.文件系统接收更改并通知 webpack；
2. webpack 重新编译构建一个或多个模块，并通知 HMR 服务器进行更新；
3. HMR Server 使用 webSocket 通知 HMR runtime 需要更新，HMR 运行时通过 HTTP 请求更新 jsonp；
4. HMR 运行时替换更新中的模块，如果确定这些模块无法更新，则触发整个页面刷新。

### loader

##### 常用的 loader

- file-loader 打包图片、txt 文件等，这个 loader 的作用是将匹配的文件移动到 dist 目录的指定目录下，可能会被默认的 webpack 配置改名。
- url-loader 跟 file-loader 的作用很像，能够实现全部的 file-loader 的功能。

##### file-loader

webpack 4 默认只知道 js 的打包。

对于其他形式的文件，都需要手动写到配置文件中。

比如对于 jpg 形式的文件，需要手动指定 loader， 并安装该 loader。 webpack 会将图片打包输出到 dist 目录下面。test 属性表示在 js 文件中使用 require 或者 import 之类的语法的时候，遇到以 `.jpg` 结尾的文件，就使用 `file-loader` 这个 loader 去处理。

```
npm install file-loader --save-dev
```

```
  module: {
    rules: [{
      test: /\.jpg$/,
      use: {
        loader: 'file-loader'
      }
    }]
  }
```

通过 webpack 打包之后， img require 之后输出的内容实际上是打包后的文件名（相对于 dist 目录下的文件），默认是在 dist 目录下。

```
const img = require('../img/shifen.jpeg')
console.log(img)
```

上面的对于 file-loader 的配置在移动 jpg 文件到 dist 目录下之后，默认会对 jpg 文件重命名，文件名变成一串 hash 值。通过 webpack 的官网文档可以知道，默认的输出名称是 `[hash].[ext]`。 如果我们对于打包之后的文件名有要求，可以额外给与 file-loader 一些配置。第一个 name 表示打包之后的文件名，属性中的 name 表示文件的实际名称，ext 表示文件的实际后缀。`'[name].[ext]'` 这种命名的方式被称之为 `placeholder` 占位符。

```
  module: {
    rules: [{
    	// 多种文件后缀, 正则表达式语法
      test: /\.(jpg|png|gif)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }
    }]
  }
```

##### url-loader

url-loader 能够实现 file-loader 的全部功能，在实际使用中，比较常见的形式是使用 url-loader 将图片转化成 base64 字符串的形式，作为 js 代码的一部分输出到 bundle.js 中。 带来的好处有 html 文件引用这张图片的时候，会可以直接渲染而不需要额外再发起一次 http 请求图片。不过也正是因为这个原因，如果图片很大的话，意味着 bundle.js 文件的也会相应变的很大，html 加载 js 文件的时候就会很长。

url-loader 最佳的使用形式是，对于比较小的图片，使用这个 loader 直接打包成 base64 的形式到 bundle.js 中，减少 http 请求的时间。(当然这里需要对比一下 雪碧图的处理方式)；如果图片很大的话，就使用 file-loader 将图片移动到 dist 目录下，这样能够让 bundlejs 快速加载完成，页面能够快速显示出来。

```
  module: {
    rules: [{
      // 多种文件后缀, 正则表达式语法
      test: /\.(jpg|png|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          // 输出的文件夹，是相对于 dist 目录的
          outputPath: 'images/',
          limit: 10240
        }
      }
    }]
  }
```

limit 字段表示，如果处理的文件大于 10kb 的话，就直接移动文件到 dist 目录下面（此时的功能与 file-loader 一模一样），而如果小于 10kb 的话就把图片转化为 base64 的形式。

所以 url-loader 对比 file-loader 非常类似，只是多了一个 limit 的配置项。

##### css-loader/style-loader

webpack 处理样式文件最基本的配置需要用这两个 loader

```
// 在 js 文件中直接引入 css 文件
import './style.css'

...

// 直接通过这样的形式添加类名
dom.classList.add('className')
```

webpack config 中添加的配置

```
    {
      // 多种文件后缀, 正则表达式语法
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
```

##### scss-loader

对于 scss 文件的处理。 需要安装 scss-loader 和 node-scss 两个包

```
npm install sass-loader node-sass webpack --save-dev
```

webpack 配置. webpack 中 use 如果调用了多个 loader ，执行顺序是从后到前， 也就是说，这里是先执行 scss-loader ，再执行 css-loader , 最后再执行 style-loader。 先执行 scss-loader 将 scss 代码翻译成 css ，再将翻译好的 css 内容给到 css-loader, 而最后的 style-loader 做的工作是将 css 内容挂载到页面上。

```
    {
      // 多种文件后缀, 正则表达式语法
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'scss-loader']
    }
```

对于 scss 文件中使用 `@import './index.scss'` 这种形式的时候，引入的 `index.scss` 文件只会继续用 `css-loader` 进行处理（因为它觉得已经经过 postcss-loader 和 scss-loader 的处理了）而不会使用 `sass-loader` 后面的 `postcss-loader`, 通过给 `css-loader` 添加 `importLoaders: 2` 来重新执行前端的 loader:

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
```

##### 浏览器厂商前缀处理 postcss-loader

我们写样式属性的时候，比如一般只写 `transform: translate(100px, 100px)` ，但是对于不同浏览器需要带上不同的前缀 `-webkit- xxx`， 如果需要开发者直接在 css 中写前缀是一件很麻烦的事情。 Postcss-loader 配合 autoprefixer 插件能够帮助我们直接做这个事情。

我理解 postcss-loader 是一个后处理器了。

使用 postcss-loader 要求我们在使用之前在项目的 根目录下创建一个 postcss.config.js 配置文件:

```
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

##### css module

css 模块化的功能。 因为直接通过 `import './style.scss'` 引入的样式文件是全局的，会作用于所有的 dom 上。

通过将 `css-loader` 的 `modules` 模块化开启，再通过修改一下样式文件的引入方式，就可以做到不产生全局的样式了。

```
import style from  './style.scss'
dom.classList.add(style.className)
```

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          modules: true,
        },
      },
    ],
  },
};
```

##### 打包字体文件(icons)

字体 icon 文件一般在下载之后会有这些文件。

并且需要在样式文件中先声明这些类名，以及引入上面的字体文件。

当 webpack 在打包 当前这个 css 文件时，会去加载指定路径下的 eot svg ttf 文件，但是此时 css 文件已经被打包到 dist 目录中去了，而对于这三种类型的文件，webpack 并不知道如何进行处理。 其实只需要将这 4 个文件简单移动到 dist 目录下去即可。所以这里只需要用到 webpack 的 file-loader 就好：

```js
     // 处理字体、icon 文件
    {
      test: /\.(woff|eot|svg|ttf)$/,
      use: {
        loader: 'file-loader'
      }
    },
```

当然此时打包出来的文件默认地址是在 dist 的目录下的。

##### 使用 plugins 让打包更快捷

webpack 插件可以在 webpack 运行到某一时刻的时候，帮助开发者做一些事情。比如下面的 `html-webpack-plugin` 插件是在打包完成之后，创建一个 html 文件。

1. 移动 index.html 文件。 `html-webpack-plugin` 会在打包结束后，自动生成一个 html 文件，并把打包生成的 js 文件自动引入到 html 文件中。 不过如果没有指定模板，自动生成的 html 文件中啥也没有，可以指定自定义的 template 传入，那么插件的作用就是在模板文件最后引入打包生成的 js 文件，并在 dist 目录下创建。

2. 重新打包的时候，希望 webpack 先将 dist 目录先清空之后，再打包，这样能保证 dist 目录每次都是干净的，不会有上次打包的内容。

#### sourcemap (3.7 - 3.9 开始部分)

开启和关闭是通过 webpack 配置中的 devtool。

但是当在开发模式下，`mdoe: 'development'` 的时候默认 devtool 是开启状态，也就是说，开发模式下 sourcemap 功能默认是开启的。想主动关闭 devtool 只需要配置 `devtool: 'none'`即可。

sourcemap 是一个影射关系。 当 sourcemap 功能被关闭的时候，在浏览器中执行代码出错时， 控制台打印出的错误信息是打包出来的文件的行数，对开发者来说非常不友好。但是通过 sourcemap，如果知道了打包出来的文件 main.js 中的 96 行出错了，它能通过这个影射关系知道 main.js 实际是对应 src 目录下 index.js 文件的第一行，这个时候浏览器控制台就会打印出错误信息，告诉开发者是 index.js 文件的第一行出错了。

主动开启 sourcemap 只要在 webpack 配置中，将 `devtool` 设置为 `source-map` 即可。

source-map 解析 error https://my.oschina.net/u/4296470/blog/3202142

#### webpackDevServer

#### react babel 配置 (3.10-3.13)
