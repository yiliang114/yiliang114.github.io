---
title: webpack
date: 2020-11-21
aside: false
---

# mooc webpack4 note

webpack 是一个模块打包工具。能够将符合要求的 `es module` 的模块打包到一起。

webpack 4. 0 支持类似 parcel 零配置打包 js ，不过需要注意的是 webpack 4 只认识简单的 import 和 export 语法。

#### tree sharing

顾名思义，就是通过将多余的代码给“摇晃”掉，在开发中我们经常使用一些第三方库，而这些第三方库只使用了这个库的一部门功能或代码，未使用的代码也要被打包进来，这样出口文件会非常大， `tree-sharking` 帮我们解决了这个问题，它可以将各个模块中没有使用的方法过滤掉，只对有效代码进行打包。

`tree-sharking` 是通过在 Webpack 中配置 `babel-plugin-import` 插件来实现的。

需要注意的是，tree sharking 对于如何 import 模块是有要求的，这就是为什么 react 中经常看到 `import * as React from 'react'` 的原因。

在 b.js 中通过`import a from './a.js'`，来调用，那么就无法使用 tree sharking，这时候我们可以怎么办呢？可以这么写`import * as a from './a.js'`

#### npx

阮一峰老师关于 npx 的介绍：<http://www.ruanyifeng.com/blog/2019/02/npx.html>

比如在一个项目中安装了 webpack （注意是非全局安装的）, 此时执行命令 `webpack -v` 一般是会报错的，因为 webpack 不是被安装在全局的。而如果执行的是 `npx webpack -v` 的话，将会正常显示 webpack 的版本信息，原因是 npx 命令会去当前项目的 `node_modules` 文件夹下去寻找 `webpack` 模块找到的话再执行这个命令。 这个特性跟 `npm script` 中的脚本被执行很类似。

另一个 npx 的优点就是避免 nodejs 包的全局安装。`npx create-react-app my-react-app` 这样的形式会先下载 `create-react-app` 到本地的一个临时文件夹中，并运行 `create-react-app my-react-app` , 运行结束之后会删除这个临时文件夹，等到下次再次执行 `npx` 命令的时候再次下载。

#### 安装特定版本的 webpack

```
npm i -D webpack@xxx.yy.cc
```

如果你不知道具体的版本号，可以先通过下面的命令获取到所有的 webpack 版本号：

```
npm info webpack
```

#### webpack-cli

必须安装这个包的作用是，`webpack-cli`是保证我们能够在命令行中运行 `webpack` 命令，如果没有安装 `wbepack-cli` 的话，将不能够执行 `npx webpack`

### webpack 配置

默认的配置文件的名字是 `webpack.config.js`. 默认没有配置文件的情况，执行 webpack 打包的命令中最少需要包含入口文件 `npx webpack index.js`.

配置文件 `webpack.config.js` 是一个 `commonjs` 的规范，即 `module.exports = {...}`

如果开发者想自定义 webpack 配置文件名的话，在执行 webpack 的时候需要手动指定配置文件名 `npx webpack --config xxx.js` , 其中 `xxx.js` 是用户自定义的配置文件。

#### entry

入口文件

```
entry: './src/index.js'
// 上面是简写
entry: {
    main: './src/index.js'
}
```

#### output

出口文件。 filename 指打包出的文件名，path 指打包出的文件存放的文件夹，需要给一个绝对路径，因此需要使用到 nodejs 的 path 模块。

```
const path = require('path)
...
output: {
    filename: 'bundle.js',
    path: path.__resolve(__dirname, 'dist')
}
```

对于 `path` 模块，在 `nodejs` 中需要手动引入之后才能够使用。

如果对于同一个文件，想打包多次，并生成不同的文件名：

```
entry: {
    main: './src/index.js',
    sub: './src/index.js',
}
output: {
    filename: '[name].js',
    path: path.__resolve(__dirname, 'dist')
}
```

output 对象中的 filename 属性中， 占位符 `[name]` 表示的值就是 `entry` 对象中的键名。这样执行 `npx webpack` 打包结束之后， `html-webpack-plugin` 插件会将两个打包出来的 js 文件都引入到 html 文件中。

output 对象中的 `publicPath` 属性可以用于把所有打包出来的内容文件加上一个前缀，经常用于 html 文件中直接引用 cdn 地址，而不是 dist 目录下的相对路径。所以说，这里可以结合七牛云的 node 接口，在 build 完了之后，通过 node 接口将 js 文件 css 文件全部上传到 七牛云上去，`publicPath` 就是 cdn 的前缀，这样每次都只要发送 html 到服务器上就可以了。

#### webpack 输出 info

- hash： 本地打包对应的唯一哈希值
- version： webpack 的版本
- time： 打包花费的时间
- build at ：打包开始时间
- asset： 打包出的结果文件
- size： 打包文件打包
- chunks：对应的是当前打包的结果文件的 id （index）
- chunk：如果只有一个输入文件的话，chunk 值就是 main ；对应如果有多个入口的项目，chunk 值就是在配置文件中的 entry 对应的值。
- Entrypoint: 入口文件名称，并且 webpack 会列出依赖的文件
- WARNING: 可能会警告没有填上 mode ，配置文件中 mode 默认值是 production，这个模式下 bundle.js 会被压缩（压成一行？），如果 mode 值是 development 的话，bundle.js 就不会被压缩。

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

![image.png](https://img.hacpai.com/file/2019/05/image-1da85c9f.png)

并且需要在样式文件中先声明这些类名，以及引入上面的字体文件。

![image.png](https://img.hacpai.com/file/2019/05/image-8d085785.png)

当 webpack 在打包 当前这个 css 文件时，会去加载指定路径下的 eot svg ttf 文件，但是此时 css 文件已经被打包到 dist 目录中去了，而对于这三种类型的文件，webpack 并不知道如何进行处理。 其实只需要将这 4 个文件简单移动到 dist 目录下去即可。所以这里只需要用到 webpack 的 file-loader 就好：

```
     // 处理字体、icon 文件
    {
      test: /\.(woff|eot|svg|ttf)$/,
      use: {
        loader: 'file-loader'
      }
    },
```

当然此时打包出来的文件默认地址是在 dist 的目录下的。

![image.png](https://img.hacpai.com/file/2019/05/image-ebf0eb92.png)

##### 使用 plugins 让打包更快捷

webpack 插件可以在 webpack 运行到某一时刻的时候，帮助开发者做一些事情。比如下面的 `html-webpack-plugin` 插件是在打包完成之后，创建一个 html 文件。

1. 移动 index.html 文件。 `html-webpack-plugin` 会在打包结束后，自动生成一个 html 文件，并把打包生成的 js 文件自动引入到 html 文件中。 不过如果没有指定模板，自动生成的 html 文件中啥也没有，可以指定自定义的 template 传入，那么插件的作用就是在模板文件最后引入打包生成的 js 文件，并在 dist 目录下创建。

   ![image.png](https://img.hacpai.com/file/2019/05/image-db395fe9.png)

2. 重新打包的时候，希望 webpack 先将 dist 目录先清空之后，再打包，这样能保证 dist 目录每次都是干净的，不会有上次打包的内容。

   ![image.png](https://img.hacpai.com/file/2019/05/image-e64fb03c.png)

#### sourcemap (3.7 - 3.9 开始部分)

开启和关闭是通过 webpack 配置中的 devtool。

但是当在开发模式下，`mdoe: 'development'` 的时候默认 devtool 是开启状态，也就是说，开发模式下 sourcemap 功能默认是开启的。想主动关闭 devtool 只需要配置 `devtool: 'none'`即可。

sourcemap 是一个影射关系。 当 sourcemap 功能被关闭的时候，在浏览器中执行代码出错时， 控制台打印出的错误信息是打包出来的文件的行数，对开发者来说非常不友好。但是通过 sourcemap，如果知道了打包出来的文件 main.js 中的 96 行出错了，它能通过这个影射关系知道 main.js 实际是对应 src 目录下 index.js 文件的第一行，这个时候浏览器控制台就会打印出错误信息，告诉开发者是 index.js 文件的第一行出错了。

主动开启 sourcemap 只要在 webpack 配置中，将 `devtool` 设置为 `source-map` 即可。

#### webpackDevServer

#### react babel 配置 (3.10-3.13)
