---
title: Webpack4 配置教程
date: 2020-12-23
aside: false
---

# Webpack4 配置教程

## 1. 什么是`webpack`?

> 前端目前最主流的`javascript`打包工具，在它的帮助下，开发者可以轻松地实现加密代码、多平台兼容。而最重要的是，它为**前端工程化**提供了最好支持。`vue`、`react`等大型项目的脚手架都是利用 webpack 搭建。

## 2. 打包 js

### 1. 检验`webpack`规范支持

`webpack`支持`es6`, `CommonJS`, `AMD`。

创建`vendor`文件夹，其中`minus.js`、`multi.js`和`sum.js`分别用 CommonJS、AMD 和 ES6 规范编写。

在入口文件`app.js`中，我们分别用 3 中规范，引用`vendor`文件夹中的 js 文件。

```js
// ES6
import sum from './vendor/sum';
console.log('sum(1, 2) = ', sum(1, 2));

// CommonJs
var minus = require('./vendor/minus');
console.log('minus(1, 2) = ', minus(1, 2));

// AMD
require(['./vendor/multi'], function(multi) {
  console.log('multi(1, 2) = ', multi(1, 2));
});
```

### 2. 编写配置文件

`webpack.config.js`是 webpack 默认的配置文件名，其中配置如下：

```js
const path = require('path');

module.exports = {
  entry: {
    app: './app.js',
  },
  output: {
    publicPath: __dirname + '/dist/', // js引用路径或者CDN地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: 'bundle.js',
  },
};
```

注意`output.publicPath`参数，代表：**`js`文件内部引用其他文件的路径**。

### 3. 收尾

打包后的`js`文件会按照我们的配置放在`dist`目录下，这时，**需要创建一个`html`文件，引用打包好的`js`文件**。

然后在 Chrome 打开(**这节课只是打包`js`,不包括编译`es6`**)，就可以看到我们代码的运行结果了。

## 3. 编译 es6

### 1. 了解`babel`

说起编译`es6`，就必须提一下`babel`和相关的技术生态：

1. `babel-loader`: 负责 es6 语法转化
2. `babel-preset-env`: 包含 es6、7 等版本的语法转化规则
3. `babel-polyfill`: es6 内置方法和函数转化垫片
4. `babel-plugin-transform-runtime`: 避免 polyfill 污染全局变量

需要注意的是, `babel-loader`和`babel-polyfill`。前者负责语法转化，比如：箭头函数；后者负责内置方法和函数，比如：`new Set()`。

### 2. 安装相关库

这次，我们的`package.json`文件配置如下：

```js
{
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "webpack": "^4.15.1"
  },
  "dependencies": {
    "babel-polyfill": "^6.26.0",
    "babel-runtime": "^6.26.0"
  }
}
```

### 3. `webpack`中使用`babel`

> `babel`的相关配置，推荐单独写在`.babelrc`文件中。下面，我给出这次的相关配置：

```js
{
  "presets": [
    [
      "env",
      {
        "targets": {
          "browsers": ["last 2 versions"]
        }
      }
    ]
  ],
  "plugins": ["transform-runtime"]
}
```

在`webpack`配置文件中，关于`babel`的调用需要写在`module`模块中。对于相关的匹配规则，除了匹配`js`结尾的文件，还应该去除`node_module/`文件夹下的第三库的文件（发布前已经被处理好了）。

```js
module.exports = {
  entry: {
    app: './app.js',
  },
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
```

### 4. 最后：`babel-polyfill`

我们发现整个过程中并没有使用`babel-polyfill`。**它需要在我们项目的入口文件中被引入**，或者在`webpack.config.js`中配置。这里我们采用第一种方法编写`app.js`:

```js
import 'babel-polyfill';
let func = () => {};
const NUM = 45;
let arr = [1, 2, 4];
let arrB = arr.map(item => item * 2);

console.log(arrB.includes(8));
console.log('new Set(arrB) is ', new Set(arrB));
```

命令行中进行打包，然后编写`html`文件引用打包后的文件即可在不支持`es6`规范的老浏览器中看到效果了。

## 4. 多页面解决方案--提取公共代码

### 1. 准备工作

按照惯例，我们在`src/`文件夹下创建`pageA.js`和`pageB.js`分别作为两个入口文件。同时，这两个入口文件同时引用`subPageA.js`和`subPageB.js`，而`subPageA.js`和`subPageB.js`又同时引用`module.js`文件。

代码目录结构如下图所示：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/2.png)

希望大家理清逻辑关系，下面从底层往上层进行代码书写。

**`module.js`:**

```js
export default 'module';
```

**`subPageA.js`:**

```js
import './module';
export default 'subPageA';
```

**`subPageB.js`:**

```js
import './module';
export default 'subPageB';
```

正如我们所见，`subPageA.js`和`subPageB.js`同时引用`module.js`。

最后，我们封装入口文件。而为了让情况更真实，**这两个入口文件又同时引用了`lodash`这个第三方库**。

**`pageA.js`:**

```js
import './subPageA';
import './subPageB';

import * as _ from 'lodash';
console.log("At page 'A' :", _);

export default 'pageA';
```

**`pageB.js`:**

```js
import './subPageA';
import './subPageB';

import * as _ from 'lodash';
console.log("At page 'B' :", _);

export default 'pageB';
```

好了，到此为止，需要编写的代码已经完成了。

### 2. 编写`webpack`配置文件

首先我们应该安装先关的库，创建`package.json`，输入以下内容：

```json
{
  "devDependencies": {
    "webpack": "^4.15.1"
  },
  "dependencies": {
    "lodash": "^4.17.10"
  }
}
```

在命令行中运行`npm install`即可。

然后配置`webpack.config.js`文件。文件配置如下：

```js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  // 多页面应用
  entry: {
    pageA: './src/pageA.js',
    pageB: './src/pageB.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 注意: priority属性
        // 其次: 打包业务中公共代码
        common: {
          name: 'common',
          chunks: 'all',
          minSize: 1,
          priority: 0,
        },
        // 首先: 打包node_modules中的文件
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
};
```

着重来看`optimization.splitChunks`配置。我们将需要打包的代码放在`cacheGroups`属性中。

其中，每个键对值就是被打包的一部分。例如代码中的`common`和`vendor`。值得注意的是，针对第三方库（例如`lodash`）通过设置`priority`来让其先被打包提取，最后再提取剩余代码。

所以，上述配置中公共代码的提取顺序其实是：

```js
... ...
vendor: {
  name: "vendor",
  test: /[\\/]node_modules[\\/]/,
  chunks: "all",
  priority: 10
},
common: {
    name: "common",
    chunks: "all",
    minSize: 1,
    priority: 0
}
... ...
```

### 3. 打包和引用

命令行中运行`webpack`即可打包。可以看到，我们成功提取了公共代码，如下图所示：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/1.png)

最后，打包的结果在`dist/`文件夹下面，我们要在`index.html`中引用打包好的`js`文件,`index.html`代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <script src="./dist/common.chunk.js"></script>
    <script src="./dist/vendor.chunk.js"></script>
    <script src="./dist/pageA.bundle.js"></script>
    <script src="./dist/pageB.bundle.js"></script>
  </body>
</html>
```

使用 Chrome 或者 Firfox 打开`index.html`，并且打开控制台即可。

## 5. 单页面解决方案--代码分割和懒加载

### 1. 准备工作

此次代码的目录结构如下：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/3.png)

其中，`page.js`是入口文件,`subPageA.js`和`subPageB.js`共同引用`module.js`。下面，我们按照代码引用的逻辑，从底向上展示代码：

`module.js`:

```js
export default 'module';
```

`subPageA.js`:

```js
import './module';
console.log("I'm subPageA");
export default 'subPageA';
```

`subPageB.js`:

```js
import './module';
console.log("I'm subPageB");
export default 'subPageB';
```

请注意：subPageA.js 和 subPageB.js 两个文件中都执行了`console.log()`语句。之后将会看到`import()`和`require()`不同的表现形式：是否会自动执行 js 的代码？

### 2. 编写配置文件

下面编写`webpack`配置文件（很简单）：

```js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    page: './src/page.js', //
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
};
```

同时，关于第三方库，因为要在`page.js`中使用`lodash`，所以，`package.json`文件配置如下：

```json
{
  "devDependencies": {
    "webpack": "^4.15.1"
  },
  "dependencies": {
    "lodash": "^4.17.10"
  }
}
```

### 3. `import()`编写`page.js`

个人是非常推荐`import()`写法，因为和 es6 语法看起来很像。除此之外，`import()`可以通过注释的方法来指定打包后的 chunk 的名字。

除此之外，相信对`vue-router`熟悉的朋友应该知道，其官方文档的路由懒加载的配置也是通过`import()`来书写的。

下面，我们将书写`page.js`:

```js
import(/* webpackChunkName: 'subPageA'*/ './subPageA').then(function(subPageA) {
  console.log(subPageA);
});

import(/* webpackChunkName: 'subPageB'*/ './subPageB').then(function(subPageB) {
  console.log(subPageB);
});

import(/* webpackChunkName: 'lodash'*/ 'lodash').then(function(_) {
  console.log(_.join(['1', '2']));
});
export default 'page';
```

命令行中运行`webpack`，打包结果如下：
![](https://static.godbmw.com/images/webpack/webpack4系列教程/4.png)

我们创建`index.html`文件，通过`<script>`标签引入我们打包结果，需要注意的是：因为是单页应用，所以只要引用入口文件即可（即是上图中的`page.bundle.js`）。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <script src="./dist/page.bundle.js"></script>
  </body>
</html>
```

打开浏览器控制台，刷新界面，结果如下图所示：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/5.png)

图中圈出的部分，就是说明`import()`会自动运行`subPageA.js和subPageB.js`的代码。

在 NetWork 选项中，我们可以看到，懒加载也成功了：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/6.png)

### 4. `require()`编写`page.js`

`require.ensure()`不会自动执行`js`代码，请注意注释：

```js
require.ensure(
  ['./subPageA.js', './subPageB.js'], // js文件或者模块名称
  function() {
    var subPageA = require('./subPageA'); // 引入后需要手动执行，控制台才会打印
    var subPageB = require('./subPageB');
  },
  'subPage', // chunkName
);

require.ensure(
  ['lodash'],
  function() {
    var _ = require('lodash');
    _.join(['1', '2']);
  },
  'vendor',
);

export default 'page';
```

其实，根据我们编写的代码，`subPageA.js`和`subPageB.js`共同引用了`module.js`文件，我们可以将`module.js`体现抽离出来：

```js
require.include('./module.js'); // 将subPageA和subPageB共用的module.js打包在此page中

// ...
// 再输入上面那段代码
```

最终打包后，检验和引入方法与`import()`一致，这里不再冗赘。

## 5. 处理 CSS

### 1. 准备工作

众所周知，CSS 在 HTML 中的常用引入方法有`<link>`标签和`<style>`标签两种，所以这次就是结合`webpack`特点实现以下功能：

1. 将 css 通过 link 标签引入
2. 将 css 放在 style 标签里
3. 动态卸载和加载 css
4. 页面加载 css 前的`transform`

这次我们需要用到`css-loader`，`file-loader`等 LOADER，`package.json`如下：

```json
{
  "devDependencies": {
    "css-loader": "^1.0.0",
    "file-loader": "^1.1.11",
    "style-loader": "^0.21.0"
  }
}
```

其中，`base.css`代码如下：

```css
*,
body {
  margin: 0;
  padding: 0;
}
html {
  background: red;
}
```

`index.html`代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <script src="./dist/app.bundle.js"></script>
  </body>
</html>
```

### 2. `CSS`通过`<link>`标签引入

> link 标签通过引用 css 文件，所以需要借助`file-loader`来将 css 处理为文件。

`webpack.config.js`:

```js
const path = require('path');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 针对CSS结尾的文件设置LOADER
        use: [
          {
            loader: 'style-loader/url',
          },
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};
```

为了让效果更显著，编写如下`app.js`:

```js
let clicked = false;
window.addEventListener('click', function() {
  // 需要手动点击页面才会引入样式！！！
  if (!clicked) {
    import('./css/base.css');
  }
});
```

### 3. `CSS`放在`<style>`标签里

> 通常来说，`css`放在`style`标签里可以减少网络请求次数，提高响应时间。需要注意的是，_在老式 IE 浏览器中，对`style`标签的数量是有要求的_。

`app.js`和第二部分一样，`webpack.config.js`配置修改如下：

```js
const path = require('path');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 针对CSS结尾的文件设置LOADER
        use: [
          {
            loader: 'style-loader',
            options: {
              singleton: true, // 处理为单个style标签
            },
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true, // css代码压缩
            },
          },
        ],
      },
    ],
  },
};
```

### 4. 动态卸载和加载`CSS`

> `style-loader`为 css 对象提供了`use()`和`unuse()`两种方法，借助这两种方法，可以方便快捷地加载和卸载 css 样式。

首先，需要配置`webpack.config.js`:

```js
const path = require('path');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader/useable', // 注意此处的style-loader后面的 useable
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
};
```

然后，我们修改我们的`app.js`，来实现每 0.5s 换一次背景颜色：

```js
import base from './css/base.css'; // import cssObj from '...'
var flag = false;
setInterval(function() {
  // unuse和use 是 cssObj上的方法
  if (flag) {
    base.unuse();
  } else {
    base.use();
  }
  flag = !flag;
}, 500);
```

打包后打开`index.html`即可看到页面背景颜色闪动的效果。

### 5. 页面加载`css`前的`transform`

> 对于`css`的`transform`，简单来说：**在加载 css 样式前，可以更改 css**。这样，方便开发者根据业务需要，对 css 进行相关处理。

需要对`style-loader`增加`options.transform`属性，值为指定的 js 文件，所以, `webpack.config.js`配置如下：

```js
const path = require('path');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              transform: './css.transform.js', // transform 文件
            },
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
};
```

下面，我们编写`css.transform.js`，这个文件导出一个函数，传入的参数就是 css 字符串本身。

```js
module.exports = function(css) {
  console.log(css); // 查看css
  return window.innerWidth < 1000 ? css.replace('red', 'green') : css; // 如果屏幕宽度 < 1000, 替换背景颜色
};
```

在`app.js`中引入 css 文件即可：

```js
import base from './css/base.css';
```

我们打开控制台，如下图所示，当屏幕宽度小于 1000 时候，css 中的`red`已经被替换为了`green`。

![](https://static.godbmw.com/images/webpack/webpack4系列教程/8.png)

需要注意的是：`transform`是在 css 引入前根据需要修改，所以之后是不会改变的。所以上方代码不是响应式，当把屏幕宽度拉长到大于 1000 时候，依旧是绿色。重新刷新页面，才会是红色。

## 6. 处理 SCSS

### 1. 准备工作

为了方便叙述，这次代码目录的样式文件只有一个`scss`文件，以帮助我们了解核心 LOADER 的使用。

这次我们需要用到`node-sass`，`sass-loader`等 LOADER，`package.json`如下：

```json
{
  "devDependencies": {
    "css-loader": "^1.0.0",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "node-sass": "^4.9.2",
    "sass-loader": "^7.0.3",
    "style-loader": "^0.21.0",
    "webpack": "^4.16.0"
  }
}
```

其中，`base.scss`代码如下：

```scss
$bgColor: red !default;
*,
body {
  margin: 0;
  padding: 0;
}
html {
  background-color: $bgColor;
}
```

`index.html`代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <script src="./dist/app.bundle.js"></script>
  </body>
</html>
```

### 2. 编译打包`scss`

首先，在入口文件`app.js`中引入我们的 scss 样式文件：

```js
import './scss/base.scss';
```

下面，开始编写`webpack.config.js`文件:

```js
const path = require('path');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // 将 JS 字符串生成为 style 节点
          },
          {
            loader: 'css-loader', // 将 CSS 转化成 CommonJS 模块
          },
          {
            loader: 'sass-loader', // 将 Sass 编译成 CSS
          },
        ],
      },
    ],
  },
};
```

需要注意的是，`module.rules.use`数组中，loader 的位置。根据 webpack 规则：**放在最后的 loader 首先被执行**。所以，首先应该利用`sass-loader`将 scss 编译为 css，剩下的配置和处理 css 文件相同。

### 3. 检查打包结果

因为 scss 是 css 预处理语言，所以我们要检查下打包后的结果，打开控制台，如下图所示：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/9.png)

同时，对于其他的 css 预处理语言，处理方式一样，首先应该编译成 css，然后交给 css 的相关 loader 进行处理。[点我了解更多关于处理`css`的内容 >>>](http://yuanxin.me/#/passage/36)

## 7. SCSS 提取和懒加载

### 1. 准备工作

为了实现 SCSS 懒加载，我们使用了`extract-text-webpack-plugin`插件。

需要注意，**在安装插件的时候，应该安装针对`v4`版本的`extract-text-webpack-plugin`**。npm 运行如下命令：`npm install --save-dev extract-text-webpack-plugin@next`

其余配置，与第六课相似。`package.json`配置如下：

```json
{
  "devDependencies": {
    "css-loader": "^1.0.0",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "node-sass": "^4.9.2",
    "sass-loader": "^7.0.3",
    "style-loader": "^0.21.0",
    "webpack": "^4.16.0"
  }
}
```

关于我们的 scss 文件下的样式文件，`base.scss`:

```scss
// 网站默认背景色：red
$bgColor: red !default;
*,
body {
  margin: 0;
  padding: 0;
}
html {
  background-color: $bgColor;
}
```

`common.scss`:

```scss
// 覆盖原来颜色：green
html {
  background-color: green !important;
}
```

### 2. 使用`ExtractTextPlugin`

使用`extract-text-webpack-plugin`，需要在`webpack.config.js`的`plugins`选项和`rules`中`scss`的相关选项进行配置。

`webpack.config.js`:

```js
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          // 注意 1
          fallback: {
            loader: 'style-loader',
          },
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].min.css',
      allChunks: false, // 注意 2
    }),
  ],
};
```

在配置中，**注意 1**中的`callback`配置项，针对 不提取为单独`css`文件的`scss`样式 应该使用的 LOADER。即使用`style-loader`将 scss 处理成 css 嵌入网页代码。

**注意 2**中的`allChunks`必须指明为`false`。否则会包括异步加载的 CSS！

### 3. `SCSS`引用和懒加载

在项目入口文件`app.js`中，针对 scss 懒加载，需要引入以下配置代码：

```js
import 'style-loader/lib/addStyles';
import 'css-loader/lib/css-base';
```

剩下我们先设置背景色为红色，在用户点击鼠标后，懒加载`common.scss`，使背景色变为绿色。剩余代码如下：

```js
import './scss/base.scss';

var loaded = false;
window.addEventListener('click', function() {
  if (!loaded) {
    import(/* webpackChunkName: 'style'*/ './scss/common.scss').then(_ => {
      // chunk-name : style
      console.log('Change bg-color of html');
      loaded = true;
    });
  }
});
```

### 4. 打包和引入

根据我们在`app.js`中的`webpackChunkName`的配置，可以猜测，打包结果中有：`style.chunk.js` 文件。

命令行执行`webpack`打包后，`/dist/`目录中的打包结果如下：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/12.png)

最后，我们需要在 html 代码中引入打包结果中的、**非懒加载**的样式(`/dist/app.min.css`)和 js 文件(`/dist/app.bundle.js`)。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <link rel="stylesheet" href="./dist/app.min.css" />
  </head>
  <body>
    <script src="./dist/app.bundle.js"></script>
  </body>
</html>
```

_终_

## 8. JS-Tree-Shaking

### 1. 什么是`Tree Shaking`？

> 字面意思是摇树，一句话：**项目中没有使用的代码会在打包时候丢掉**。JS 的 Tree Shaking 依赖的是 ES2015 的模块系统（比如：`import`和`export`）

本文介绍`Js Tree Shaking`在`webpack v4`中的激活方法。

### 2. 不再需要`UglifyjsWebpackPlugin`

是的，在`webpack v4`中，不再需要配置`UglifyjsWebpackPlugin`。（详情请见：[文档](https://www.webpackjs.com/plugins/uglifyjs-webpack-plugin/)） 取而代之的是，更加方便的配置方法。

只需要配置`mode`为`"production"`，即可显式激活 `UglifyjsWebpackPlugin` 插件。

_注意：根据版本不同，更新的`webpack v4.x`不配置`mode`也会自动激活插件_

我们的`webpack.config.js`配置如下：

```js
const path = require('path');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  mode: 'production',
};
```

我们在`util.js`文件中输入以下内容：

```js
// util.js
export function a() {
  return 'this is function "a"';
}

export function b() {
  return 'this is function "b"';
}

export function c() {
  return 'this is function "c"';
}
```

然后在`app.js`中引用`util.js`的`function a()`函数：

```js
// app.js
import { a } from './vendor/util';
console.log(a());
```

命令行运行`webpack`打包后，打开打包后生成的`/dist/app.bundle.js`文件。然后，查找我们`a()`函数输出的字符串，如下图所示：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/14.png)

如果将查找内容换成 `this is function "c"` 或者 `this is function "b"`, 并没有相关查找结果。**说明`Js Tree Shaking`成功**。

### 3. 如何处理第三方`JS`库？

> 对于经常使用的第三方库（例如 jQuery、lodash 等等），如何实现`Tree Shaking`？下面以 lodash.js 为例，进行介绍。

#### 3.1 尝试 `Tree Shaking`

安装 lodash.js : `npm install lodash --save`

在 app.js 中引用 lodash.js 的一个函数：

```js
// app.js
import { chunk } from 'lodash';
console.log(chunk([1, 2, 3], 2));
```

命令行打包。如下图所示，打包后大小是 70kb。显然，只引用了一个函数，不应该这么大。并没有进行`Tree Shaking`。

![](https://static.godbmw.com/images/webpack/webpack4系列教程/15.png)

#### 3.2 第三方库的模块系统 版本

本文开头讲过，`js tree shaking` 利用的是 es 的模块系统。而 lodash.js 没有使用 CommonJS 或者 ES6 的写法。所以，**安装库对应的模块系统即可**。

安装 lodash.js 的 es 写法的版本：`npm install lodash-es --save`

小小修改一下`app.js`:

```js
// app.js
import { chunk } from 'lodash-es';
console.log(chunk([1, 2, 3], 2));
```

再次打包，打包结果只有 3.5KB（如下图所示）。显然，`tree shaking`成功。

![](https://static.godbmw.com/images/webpack/webpack4系列教程/16.png)

_友情提示：在一些对加载速度敏感的项目中使用第三方库，请注意库的写法是否符合 es 模板系统规范，以方便`webpack`进行`tree shaking`。_

_终_

## 9. CSS-Tree-Shaking

### 1. CSS 也有 Tree Shaking？

> 是滴，随着 webpack 的兴起，css 也可以进行 Tree Shaking： 以去除项目代码中用不到的 CSS 样式，仅保留被使用的样式代码。

为了方便理解 Tree Shaking 概念，并且与 JS Tree Shaking 进行横向比较，请查看：[webpack4 系列教程\(八\): JS Tree Shaking](https://godbmw.com/passage/48)

### 2. 项目环境仿真

因为 CSS Tree Shaking 并不像 JS Tree Shaking 那样方便理解，所以首先要先模拟一个真实的项目环境，来体现 CSS 的 Tree Shaking 的配置和效果。

我们首先编写 `/src/css/base.css` 样式文件，在文件中，我们编写了 3 个样式类。但在代码中，我们只会使用 `.box` 和 `.box--big` 这两个类。代码如下所示：

```css
/* base.css */
html {
  background: red;
}

.box {
  height: 200px;
  width: 200px;
  border-radius: 3px;
  background: green;
}

.box--big {
  height: 300px;
  width: 300px;
  border-radius: 5px;
  background: red;
}

.box-small {
  height: 100px;
  width: 100px;
  border-radius: 2px;
  background: yellow;
}
```

按照正常使用习惯，DOM 操作来实现样式的添加和卸载，是一贯技术手段。所以，入口文件 `/src/app.js` 中创建了一个 `<div>` 标签，并且将它的类设为 `.box`

```js
// app.js

import base from './css/base.css';

var app = document.getElementById('app');
var div = document.createElement('div');
div.className = 'box';
app.appendChild(div);
```

最后，为了让环境更接近实际环境，我们在`index.html`的一个标签，也引用了定义好的 `box-big` 样式类。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="stylesheet" href="./dist/app.min.css" />
    <title>Document</title>
  </head>
  <body>
    <div id="app">
      <div class="box-big"></div>
    </div>
    <script src="./dist/app.bundle.js"></script>
  </body>
</html>
```

按照我们的仿真的环境，最终 Tree Shaking 之后的效果应该是：**打包后的 css 文件不含有 `box-small` 样式类**。下面，就实现这个效果！

### 3. 认识下 `PurifyCSS`

没错，就是这货帮助我们进行 CSS Tree Shaking 操作。为了能准确指明要进行 Tree Shaking 的 CSS 文件，它还有好朋友 `glob-all` （另一个第三方库）。

`glob-all` 的作用就是帮助 `PurifyCSS` 进行路径处理，定位要做 Tree Shaking 的路径文件。

它们俩搭配起来，画风如下：

```js
const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');

let purifyCSS = new PurifyCSS({
  paths: glob.sync([
    // 要做CSS Tree Shaking的路径文件
    path.resolve(__dirname, './*.html'),
    path.resolve(__dirname, './src/*.js'),
  ]),
});
```

好了，这只是一个小小的 demo。下面我们要把它用到我们的`webpack.config.js`中来。

### 4. 编写配置文件

为了方便最后检查打包后的 css 文件，配置中还使用了 `extract-text-webpack-plugin` 这个插件。如果忘记了它的用法，请查看：

- [webpack4 系列教程\(六\): 处理 SCSS](https://godbmw.com/passage/37)
- [webpack4 系列教程\(五\): 处理 CSS](https://godbmw.com/passage/36)

所以，我们的`package.json`文件如下：

```json
{
  "devDependencies": {
    "css-loader": "^1.0.0",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "glob-all": "^3.1.0",
    "purify-css": "^1.2.5",
    "purifycss-webpack": "^0.7.0",
    "style-loader": "^0.21.0",
    "webpack": "^4.16.0"
  }
}
```

安装完相关插件后，我们需要在 webpack 的`plugins`配置中引用第三部分定义的代码。

然后结合`extract-text-webpack-plugin`的配置，编写如下`webpack.config.js`:

```js
// webpack.config.js
const path = require('path');
const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let extractTextPlugin = new ExtractTextPlugin({
  filename: '[name].min.css',
  allChunks: false,
});

let purifyCSS = new PurifyCSS({
  paths: glob.sync([
    // 要做CSS Tree Shaking的路径文件
    path.resolve(__dirname, './*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
    path.resolve(__dirname, './src/*.js'),
  ]),
});

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            options: {
              singleton: true,
            },
          },
          use: {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
        }),
      },
    ],
  },
  plugins: [extractTextPlugin, purifyCSS],
};
```

### 5. 结果分析

命令行运行`webpack`打包后，样式文件被抽离到了 `/dist/app.min.css` 文件中。文件内容如下图所示（_肯定好多朋友懒得手动打包_）：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/17.png)

我们在`index.html` 和 `src/app.js` 中引用的样式都被打包了，而没有被使用的样式类--`box-small`，就没有出现在图片中。成功！

_终_

## 10. 图片处理汇总

### 1. 准备工作

如项目代码目录展示的那样，除了常见的`app.js`作为入口文件，我们将用到的 3 张图片放在`/src/assets/img/`目录下，并在样式文件`base.css`中引用这些图片。

剩下的内容交给`webpack`打包处理即可。样式文件和入口 js 文件的代码分别如下所示：

```css
/* base.css */
*,
body {
  margin: 0;
  padding: 0;
}
.box {
  height: 400px;
  width: 400px;
  border: 5px solid #000;
  color: #000;
}
.box div {
  width: 100px;
  height: 100px;
  float: left;
}
.box .ani1 {
  background: url('./../assets/imgs/1.jpg') no-repeat;
}
.box .ani2 {
  background: url('./../assets/imgs/2.jpg') no-repeat;
}
.box .ani3 {
  background: url('./../assets/imgs/3.png') no-repeat;
}
```

```js
// app.js
import 'style-loader/lib/addStyles';
import 'css-loader/lib/css-base';

import './css/base.css';
```

在处理图片和进行`base64`编码的时候，需要使用`url-loader`。

在压缩图片的时候，要使用`img-loader`插件，并且针对不同的图片类型启用不同的子插件。

而`postcss-loader`和`postcss-sprites`则用来合成雪碧图，减少网络请求。

因此，在 npm 安装完相关插件后，`package.json`的内容如下所示：

```json
{
  "devDependencies": {
    "css-loader": "^1.0.0",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "file-loader": "^1.1.11",
    "imagemin": "^5.3.1",
    "imagemin-pngquant": "^5.1.0",
    "img-loader": "^3.0.0",
    "postcss-loader": "^2.1.6",
    "postcss-sprites": "^4.2.1",
    "style-loader": "^0.21.0",
    "url-loader": "^1.0.1",
    "webpack": "^4.16.1"
  }
}
```

同时，我们编写如下`index.html`(假设已经打包好了项目文件，现在直接引入)：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <link rel="stylesheet" href="./dist/app.min.css" />
  </head>
  <body>
    <div id="app">
      <div class="box">
        <div class="ani1"></div>
        <div class="ani2"></div>
        <div class="ani3"></div>
      </div>
    </div>
    <script src="./dist/app.bundle.js"></script>
  </body>
</html>
```

### 2. 图片处理 和 Base64 编码

#### 2.1 webpack 配置

为了方便样式提取，还是利用`extract-text-webpack-plugin`来提取样式文件。

同时，在`module.rules`选项中进行配置，以实现让 loader 识别图片后缀名，并且进行指定的处理操作。

代码如下：

```js
// webpack.config.js

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let extractTextPlugin = new ExtractTextPlugin({
  filename: '[name].min.css',
  allChunks: false,
});

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
          },
          use: [
            {
              loader: 'css-loader',
            },
          ],
        }),
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 20000, // size <= 20KB
              publicPath: 'static/',
              outputPath: 'static/',
            },
          },
        ],
      },
    ],
  },
  plugins: [extractTextPlugin],
};
```

通过配置`url-loader`的 limit 选项，可以根据图片大小来决定是否进行`base64`编码。这次配置的是：小于 20kb 的图片进行`base64`编码。

#### 2.2 打包结果

之前提到过，在项目中引入了 3 张图片，其中`3.png`是小于 20kb 的图片。在命令行中运行`webpack`进行打包，size 小于 20kb 的图片被编码，只打包了 2 个 size 大于 20kb 的图片文件：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/20.png)

打开浏览器的控制台，我们的图片已经被成功编码：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/21.png)

### 3. 图片压缩

#### 3.1 压缩配置

图片压缩需要使用`img-loader`，除此之外，针对不同的图片类型，还要引用不同的插件。比如，我们项目中使用的是 png 图片，因此，需要引入`imagemin-pngquant`，并且指定压缩率。

我们只需要在上面的配置文件中将下方代码：

```js
// ...
{
  test: /\.(png|jpg|jpeg|gif)$/,
  use: [
    {
      loader: "url-loader",
      options: {
        name: "[name]-[hash:5].min.[ext]",
        limit: 20000, // size <= 20KB
        publicPath: "static/",
        outputPath: "static/"
      }
    }
  ]
}
// ...
```

替换为下方代码即可，因为执行顺序问题，我们将 url-loader 的 limit 设置成 1kb，来防止压缩后的 png 图片被 base64 编码：

```js
// ...
{
  test: /\.(png|jpg|jpeg|gif)$/,
  use: [
    {
      loader: "url-loader",
      options: {
        name: "[name]-[hash:5].min.[ext]",
        limit: 1000, // size <= 1KB
        publicPath: "static/",
        outputPath: "static/"
      }
    },
    // img-loader for zip img
    {
      loader: "img-loader",
      options: {
        plugins: [
          require("imagemin-pngquant")({
            quality: "80" // the quality of zip
          })
        ]
      }
    }
  ]
}
// ...
```

#### 3.2 打包结果

运行 webpack 打包，查看打包结果：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/22.png)

是的，如你所见，10.5kb 大小的迅雷图标，被压缩到了 1.8kb。图片信息可以去 github 上查看，在文章开头有提及 github 地址。

#### 3.3 遗留问题

并没有解决`jpg`格式图片压缩。根据[`img-loader`的官方文档](https://www.npmjs.com/package/img-loader)，安装了`imagemin-mozjpeg`插件。

但是这个插件的最新版本是`7.0.0`，然而配置后，webpack 启动会用报错。

查看了 github 上的 issue，我将版本回退到`6.0.0`。可以安装，也可以配置运行，正常打包。但是打包后的 jpg 图片大小并没有变化，也就是说，并没有被压缩！！！

**希望有大佬可以指点一下小生，万分感谢**

### 4. 合成雪碧图

#### 4.1 webpack 配置

在之前的基础上，配置还是很简单的，loader 的引入和环境变量都在注释里面了：

```js
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let extractTextPlugin = new ExtractTextPlugin({
  filename: '[name].min.css',
  allChunks: false,
});

/*********** sprites config ***************/
let spritesConfig = {
  spritePath: './dist/static',
};
/******************************************/

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
          },
          use: [
            {
              loader: 'css-loader',
            },
            /*********** loader for sprites ***************/
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [require('postcss-sprites')(spritesConfig)],
              },
            },
            /*********************************************/
          ],
        }),
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 10000, // size <= 20KB
              publicPath: 'static/',
              outputPath: 'static/',
            },
          },
          {
            loader: 'img-loader',
            options: {
              plugins: [
                require('imagemin-pngquant')({
                  quality: '80',
                }),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [extractTextPlugin],
};
```

#### 4.2 效果展示

按照我们的配置，打包好的雪碧图被放入了`/dist/static/`目录下，如下图所示：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/23.png)

#### 4.3 雪碧图的实际应用

雪碧图是为了减少网络请求，所以被处理雪碧图的图片多为各式各样的 logo 或者大小相等的小图片。而对于大图片，还是不推荐使用雪碧图。

除此之外，雪碧图要配合 css 代码进行定制化使用。要通过 css 代码在雪碧图上精准定位需要的图片（可以理解成从雪碧图上裁取需要的图片），更多可以百度或者 google。

## 11. 字体文件处理

### 1. 准备字体文件和样式

如上面的代码目录所示，字体文件和样式都放在了`/src/assets/fonts/`目录下。[点我直接下载相关文件](https://github.com/dongyuanxin/webpack-demos/tree/master/demo11/src/assets/fonts)

### 2. 编写入口文件

为了提取 css 样式到单独文件，需要用到`ExtractTextPlugin`插件。在项目的入口文件需要引入`style-loader`和`css-loader`:

```js
// app.js
import 'style-loader/lib/addStyles';
import 'css-loader/lib/css-base';

import './assets/fonts/iconfont.css';
```

### 3. 处理字体文件

借助`url-loader`，可以识别并且处理`eot`、`woff`等结尾的字体文件。同时，根据字体文件大小，可以灵活配置是否进行`base64`编码。下面的 demo 就是当文件大小小于`5000B`的时候，进行`base64`编码。

```js
// webpack.config.js

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let extractTextPlugin = new ExtractTextPlugin({
  filename: '[name].min.css',
  allChunks: false,
});

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
          },
          use: [
            {
              loader: 'css-loader',
            },
          ],
        }),
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
              publicPath: 'fonts/',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  plugins: [extractTextPlugin],
};
```

### 4. 编写`index.html`

按照上面的配置，打包好的`css`和`js`均位于`/src/dist/`文件夹下。因此，需要在`index.html`中引入这两个文件（假设已经打包完毕）：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <link rel="stylesheet" href="./dist/app.min.css" />
  </head>

  <body>
    <div id="app">
      <div class="box">
        <i class="iconfont icon-xiazai"></i>
        <i class="iconfont icon-shoucang"></i>
        <i class="iconfont icon-erweima"></i>
        <i class="iconfont icon-xiangshang"></i>
        <i class="iconfont icon-qiehuanzuhu"></i>
        <i class="iconfont icon-sort"></i>
        <i class="iconfont icon-yonghu"></i>
      </div>
    </div>
    <script src="./dist/app.bundle.js"></script>
  </body>
</html>
```

### 5. 结果分析和验证

`CMD`中运行`webpack`进行打包，打包结果如下：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/25.png)

在 Chrome 中打开`index.html`，字体文件被正确引入：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/26.png)

## 12. 处理第三方 JavaScript 库

### 1. 如何使用和管理第三方`JS`库？

项目做大之后，开发者会更多专注在业务逻辑上，其他方面则尽力使用第三方`JS`库来实现。

由于`js`变化实在太快，所以出现了多种引入和管理第三方库的方法，常用的有 3 中：

1. CDN：`<script></script>`标签引入即可
2. npm 包管理： 目前最常用和最推荐的方法
3. 本地`js`文件：一些库由于历史原因，没有提供`es6`版本，需要手动下载，放入项目目录中，再手动引入。

针对第一种和第二种方法，各有优劣，有兴趣可以看这篇：[《CDN 使用心得：加速双刃剑》](https://godbmw.com/passage/60)

**针对第三种方法，如果没有`webpack`，则需要手动引入`import`或者`require`来加载文件；但是，`webpack`提供了`alias`的配置，配合`webpack.ProvidePlugin`这款插件，可以跳过手动入，直接使用！**

### 2. 编写入口文件

如项目目录图片所展示的，我们下载了`jquery.min.js`，放到了项目中。同时，我们也通过`npm`安装了`jquery`。

**为了尽可能模仿生产环境，`app.js`中使用了`$`来调用 jq，还使用了`jQuery`来调用 jq。**

因为正式项目中，由于需要的依赖过多，挂载到`window`对象的库，很容易发生命名冲突问题。此时，就需要重命名库。例如：`$`就被换成了`jQuery`。

```js
// app.js
$('div').addClass('new');

jQuery('div').addClass('old');

// 运行webpack后
// 浏览器打开 index.html, 查看 div 标签的 class
```

### 3. 编写配置文件

`webpack.ProvidePlugin`参数是键值对形式，键就是我们项目中使用的变量名，值就是键所指向的库。

`webpack.ProvidePlugin`会先从`npm`安装的包中查找是否有符合的库。

如果`webpack`配置了`resolve.alias`选项（理解成“别名”），那么`webpack.ProvidePlugin`就会顺着这条链一直找下去。

```js
// webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  resolve: {
    alias: {
      jQuery$: path.resolve(__dirname, 'src/vendor/jquery.min.js'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery', // npm
      jQuery: 'jQuery', // 本地Js文件
    }),
  ],
};
```

### 4. 结果分析和验证

老规矩，根绝上面配置，先编写一下`index.html`：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <div></div>
    <script src="./dist/app.bundle.js"></script>
  </body>
</html>
```

命令行运行`webpack`进行项目打包：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/28.png)

在 Chrome 中打开`index.html`。如下图所示，`<div>`标签已经被添加上了`old`和`new`两个样式类。证明在`app.js`中使用的`$`和`jQuery`都成功指向了`jquery`库。

![](https://static.godbmw.com/images/webpack/webpack4系列教程/29.png)

## 13. 自动生成 HTML 文件

### 1. 为什么要自动生成 HTML？

看过这个系列教程的朋友，都知道在之前的例子中，每次执行`webpack`打包生成`js`文件后，都必须在`index.html`中手动插入打包好的文件的路径。

但在真实生产环境中，一次运行`webpack`后，完整的`index.html`应该是被自动生成的。例如静态资源、js 脚本都被自动插入了。

为了实现这个功能，需要借助`HtmlWebpackPlugin`根据指定的`index.html`模板生成对应的 html 文件，还需要配合`html-loader`处理 html 文件中的`<img>`标签和属性。

### 2. 编写入口文件

编写`src/vendor/sum.js`文件，封装`sum()`函数作为示例，被其他文件引用（模块化编程）：

```js
export function sum(a, b) {
  return a + b;
}
```

编写入口文件`src/app.js`，引入上面编写的`sum()`函数，并且运行它，以方便我们在控制台检查打包结果：

```js
import { sum } from './vendor/sum';

console.log('1 + 2 =', sum(1, 2));
```

### 3. 编写 HTML 文件

根目录下的`index.html`会被`html-webpack-plugin`作为最终生成的 html 文件的模板。打包后，相关引用关系和文件路径都会按照正确的配置被添加进去。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <div></div>
    <img src="./src/assets/imgs/xunlei.png" />
  </body>
</html>
```

### 4. 编写`Webpack`配置文件

老规矩，`HtmlWebpackPlugin`是在`plugin`这个选项中配置的。常用参数含义如下：

- filename：打包后的 html 文件名称
- template：模板文件（例子源码中根目录下的 index.html）
- chunks：和`entry`配置中相匹配，支持多页面、多入口
- minify.collapseWhitespace：压缩选项

除此之外，因为我们在`index.html`中引用了`src/assets/imgs/`目录下的静态文件（图片类型）。需要用`url-loader`处理图片，然后再用`html-loader`声明。注意两者的处理顺序，`url-loader`先处理，然后才是`html-loader`处理。

```js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: __dirname + '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[hash:5].bundle.js',
    chunkFilename: '[name]-[hash:5].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src'],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 10000, // size <= 20KB
              publicPath: 'static/',
              outputPath: 'static/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['app'], // entry中的app入口才会被打包
      minify: {
        // 压缩选项
        collapseWhitespace: true,
      },
    }),
  ],
};
```

### 5. 结果和测试

运行`webpack`进行打包，下面是打包结果：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/33.png)

可以在`/dist/`中查看自动生成的`index.html`文件，如下图所示，脚本和静态资源路径都被正确处理了：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/31.png)

直接在 Chrome 打开`index.html`，并且打开控制台：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/32.png)

图片成功被插入到页面，并且 js 的运行也没有错误，成功。

## 14. Clean-Plugin-and-Watch-Mode

### 1. 什么是`Clean Plugin`和`Watch Mode`？

在实际开发中，由于需求变化，会经常改动代码，然后用 webpack 进行打包发布。由于改动过多，我们`/dist/`目录中会有很多版本的代码堆积在一起，乱七八糟。

为了让打包目录更简洁，**这时候需要`Clean Plugin`，在每次打包前，自动清理`/dist/`目录下的文件。**

除此之外，借助 webpack 命令本身的命令参数，**可以开启`Watch Mode`：监察你的所有文件,任一文件有所变动,它就会立刻重新自动打包。**

### 2. 编写入口文件和 js 脚本

入口文件`app.js`代码：

```js
console.log('This is entry js');

// ES6
import sum from './vendor/sum';
console.log('sum(1, 2) = ', sum(1, 2));

// CommonJs
var minus = require('./vendor/minus');
console.log('minus(1, 2) = ', minus(1, 2));

// AMD
require(['./vendor/multi'], function(multi) {
  console.log('multi(1, 2) = ', multi(1, 2));
});
```

`vendor/sum.js`:

```js
export default function(a, b) {
  return a + b;
}
```

`vendor/multi.js`:

```js
define(function(require, factory) {
  'use strict';
  return function(a, b) {
    return a * b;
  };
});
```

`vendor/minus.js`:

```js
module.exports = function(a, b) {
  return a - b;
};
```

### 3. 编写 webpack 配置文件

`CleanWebpackPlugin`参数传入数组，其中每个元素是每次需要清空的文件目录。

需要注意的是：**应该把`CleanWebpackPlugin`放在`plugin`配置项的最后一个**，因为 webpack 配置是倒序的（最后配置的最先执行）。以保证每次正式打包前，先清空原来遗留的打包文件。

```js
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');

module.exports = {
  entry: {
    app: './app.js',
  },
  output: {
    publicPath: __dirname + '/dist/', // js引用路径或者CDN地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name]-[hash:5].bundle.js',
    chunkFilename: '[name]-[hash:5].chunk.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['app'],
    }),
    new CleanWebpackPlugin(['dist']),
  ],
};
```

执行`webpack`打包，在控制台会首先输出一段关于相关文件夹已经清空的的提示，如下图所示：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/35.png)

### 4. 开启`Watch Mode`

直接在`webpack`命令后加上`--watch`参数即可：`webpack --watch`。

控制台会提示用户“开启 watch”。我改动了一次文件，改动被 webpack 侦听到，就会自动重新打包。如下图所示：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/36.png)

如果想看到详细的打包过程，可以使用：`webpack -w --progress --display-reasons --color`。控制台就会以花花绿绿的形式展示出打包过程，看起来比较酷炫：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/37.png)

## 15. 开发模式与 webpack-dev-server

### 1. 为什么需要开发模式？

在之前的课程中，我们都没有指定参数`mode`。但是执行`webpack`进行打包的时候，自动设置为`production`，但是控制台会爆出`warning`的提示。**而开发模式就是指定`mode`为`development`。**

在开发模式下，我们需要对代码进行调试。对应的配置就是：`devtool`设置为`source-map`。在非开发模式下，需要关闭此选项，以减小打包体积。

在开发模式下，还需要热重载、路由重定向、挂代理等功能，`webpack4`已经提供了`devServer`选项，启动一个本地服务器，让开发者使用这些功能。

### 2. 如何使用开发模式？

根据文章开头的`package.json`的配置，只需要在命令行输入：`npm run dev`即可启动开发者模式。

启动效果如下图所示：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/39.png)

虽然控制台输出了打包信息（假设我们已经配置了热重载），但是磁盘上并没有创建`/dist/`文件夹和打包文件。**控制台的打包文件的相关内容是存储在内存之中的。**

### 3. 编写一些需要的文件

首先，编写一下入口的 html 文件：

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    This is Index html
  </body>
</html>
```

然后，按照项目目录，简单封装下`/vendor/`下的三个 js 文件，以方便`app.js`调用：

```js
// minus.js
module.exports = function(a, b) {
  return a - b;
};

// multi.js
define(function(require, factory) {
  'use strict';
  return function(a, b) {
    return a * b;
  };
});

// sum.js
export default function(a, b) {
  console.log('I am sum.js');
  return a + b;
}
```

好了，准备进入正题。

### 4. 编写 webpack 配置文件

#### 4.1 配置代码

_由于配置内容有点多，所以放代码，再放讲解。_

`webpack.config.js`配置如下所示：

```js
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

module.exports = {
  entry: {
    app: './app.js',
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[hash:5].bundle.js',
    chunkFilename: '[name]-[hash:5].chunk.js',
  },
  mode: 'development', // 开发模式
  devtool: 'source-map', // 开启调试
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8000, // 本地服务器端口号
    hot: true, // 热重载
    overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
    proxy: {
      // 跨域代理转发
      '/comments': {
        target: 'https://m.weibo.cn',
        changeOrigin: true,
        logLevel: 'debug',
        headers: {
          Cookie: '',
        },
      },
    },
    historyApiFallback: {
      // HTML5 history模式
      rewrites: [{ from: /.*/, to: '/index.html' }],
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['app'],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
    }),
  ],
};
```

#### 4.2 模块热更新

模块热更新需要`HotModuleReplacementPlugin`和`NamedModulesPlugin`这两个插件，并且顺序不能错。并且指定`devServer.hot`为`true`。

有了这两个插件，在项目的 js 代码中可以针对侦测到变更的文件并且做出相关处理。

比如，我们启动开发模式后，修改了`vendor/sum.js`这个文件，此时，需要在浏览器的控制台打印一些信息。那么，`app.js`中就可以这么写：

```js
if (module.hot) {
  // 检测是否有模块热更新
  module.hot.accept('./vendor/sum.js', function() {
    // 针对被更新的模块, 进行进一步操作
    console.log('/vendor/sum.js is changed');
  });
}
```

每当`sum.js`被修改后，都可以自动执行回调函数。

#### 4.3 跨域代理

随着前后端分离开发的普及，跨域请求变得越来越常见。为了快速开发，可以利用`devServer.proxy`做一个代理转发，来绕过浏览器的跨域限制。

按照前面的配置文件，如果想调用微博的一个接口：`https://m.weibo.cn/comments/hotflow`。只需要在代码中对`/comments/hotflow`进行请求即可：

```js
$.get(
  '/comments/hotflow',
  {
    id: '4263554020904293',
    mid: '4263554020904293',
    max_id_type: '0',
  },
  function(data) {
    console.log(data);
  },
);
```

#### 4.4 HTML5--History

当项目使用`HTML5 History API` 时，任意的 404 响应都可能需要被替代为 `index.html`。

在 SPA（单页应用）中，任何响应直接被替代为`index.html`。

在 vuejs 官方的脚手架`vue-cli`中，开发模式下配置如下：

```js
// ...
historyApiFallback: {
  rewrites: [{ from: /.*/, to: '/index.html' }];
}
// ...
```

### 5. 编写入口文件

最后，在前面所有的基础上，让我们来编写下入口文件`app.js`：

```js
import sum from './vendor/sum';
console.log('sum(1, 2) = ', sum(1, 2));
var minus = require('./vendor/minus');
console.log('minus(1, 2) = ', minus(1, 2));
require(['./vendor/multi'], function(multi) {
  console.log('multi(1, 2) = ', multi(1, 2));
});

$.get(
  '/comments/hotflow',
  {
    id: '4263554020904293',
    mid: '4263554020904293',
    max_id_type: '0',
  },
  function(data) {
    console.log(data);
  },
);

if (module.hot) {
  // 检测是否有模块热更新
  module.hot.accept('./vendor/sum.js', function() {
    // 针对被更新的模块, 进行进一步操作
    console.log('/vendor/sum.js is changed');
  });
}
```

### 6. 效果检测

在命令行键入：`npm run dev`开启服务器后，会自动打开浏览器。如下图所示：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/40.png)

打开控制台，可以看到代码都正常运行没有出错。除此之外，由于开启了`source-map`，所以可以定位代码位置（下图绿框内）：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/41.png)

## 16. 开发模式和生产模式·实战

### 1. 如何分离开发环境和生产环境？

熟悉 Vuejs 或者 ReactJs 的脚手架的朋友应该都知道：在根目录下有一个`/build/`文件夹，专门放置`webpack`配置文件的相关代码。

不像我们前 15 节课的 demo (只有一个配置文件`webpack.config.js`)，**为了分离开发环境和生产环境，我们需要分别编写对应的`webpack`配置代码。**

毫无疑问，有一些插件和配置是两种环境共用的，所以应该提炼出来，避免重复劳动。如前文目录截图，`build/webpack.common.conf.js`就保存了两种环境都通用的配置文件。而`build/webpack.dev.conf.js`和`build/webpack.prod.conf.js`分别是开发和生产环境需要的特殊配置。

### 2. 编写`package.json`

类似上一节讲的，为了让命令更好调用，需要配置`scripts`选项。模仿`vue-cli`的命令格式，编写如下`package.json`:

```json
{
  "scripts": {
    "dev": "webpack-dev-server --env development --open --config build/webpack.common.conf.js",
    "build": "webpack --env production --config build/webpack.common.conf.js"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "clean-webpack-plugin": "^0.1.19",
    "css-loader": "^1.0.0",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "html-webpack-plugin": "^3.2.0",
    "jquery": "^3.3.1",
    "style-loader": "^0.21.0",
    "webpack": "^4.16.1",
    "webpack-cli": "^3.1.0",
    "webpack-dev-server": "^3.1.4",
    "webpack-merge": "^4.1.3"
  },
  "dependencies": {
    "babel-polyfill": "^6.26.0",
    "babel-runtime": "^6.26.0"
  }
}
```

按照配置，运行：

- `npm run dev`: 进入开发调试模式
- `npm run build`: 生成打包文件

还可以看出来，`build/webpack.common.conf.js`不仅仅是存放着两种环境的公共代码，还是`webpack`命令的入口文件。

### 3. 如何合并 webpack 的不同配置？

根据前面所讲，我们有 3 个配置文件。那么如何在`build/webpack.common.conf.js`中引入开发或者生产环境的配置，并且正确合并呢？

此时需要借助`webpack-merge`这个第三方库。下面是个示例代码：

```js
const merge = require('webpack-merge');

const productionConfig = require('./webpack.prod.conf');
const developmentConfig = require('./webpack.dev.conf');

const commonConfig = {}; // ... 省略

module.exports = env => {
  let config = env === 'production' ? productionConfig : developmentConfig;
  return merge(commonConfig, config); // 合并 公共配置 和 环境配置
};
```

### 4. 如何在代码中区分不同环境？

### 4.1 配置文件

如果这个 js 文件是 webpack 命令的入口文件，例如`build/webpack.common.conf.js`，那么`mode`的值（production 或者 development）会被自动传入`module.exports`的第一个参数，开发者可以直接使用。

如下面的代码，先判断是什么环境，然后再决定使用什么配置，最后 return 给 webpack：

```js
module.exports = env => {
  let config = env === 'production' ? productionConfig : developmentConfig;
  return merge(commonConfig, config); // 合并 公共配置 和 环境配置
};
```

### 4.2 项目文件

如果这个 js 文件是项目中的脚本文件，那么可以访问`process.env.NODE_ENV`这个变量来判断环境：

```js
if (process.env.NODE_ENV === 'development') {
  console.log('开发环境');
} else {
  console.log('生产环境');
}
```

### 5. 编写配置文件

### 5.1 编写公共配置文件

```js
// /build/webpack.common.conf.js

const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const productionConfig = require('./webpack.prod.conf.js'); // 引入生产环境配置文件
const developmentConfig = require('./webpack.dev.conf.js'); // 引入开发环境配置文件

/**
 * 根据不同的环境，生成不同的配置
 * @param {String} env "development" or "production"
 */
const generateConfig = env => {
  // 将需要的Loader和Plugin单独声明

  let scriptLoader = [
    {
      loader: 'babel-loader',
    },
  ];

  let cssLoader = [
    {
      loader: 'css-loader',
      options: {
        minimize: true,
        sourceMap: env === 'development' ? true : false, // 开发环境：开启source-map
      },
    },
  ];

  let styleLoader =
    env === 'production'
      ? ExtractTextPlugin.extract({
          // 生产环境：分离、提炼样式文件
          fallback: {
            loader: 'style-loader',
          },
          use: cssLoader,
        })
      : // 开发环境：页内样式嵌入
        cssLoader;

  return {
    entry: { app: './src/app.js' },
    output: {
      publicPath: env === 'development' ? '/' : __dirname + '/../dist/',
      path: path.resolve(__dirname, '..', 'dist'),
      filename: '[name]-[hash:5].bundle.js',
      chunkFilename: '[name]-[hash:5].chunk.js',
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /(node_modules)/, use: scriptLoader },
        { test: /\.css$/, use: styleLoader },
      ],
    },
    plugins: [
      // 开发环境和生产环境二者均需要的插件
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, '..', 'index.html'),
        chunks: ['app'],
        minify: {
          collapseWhitespace: true,
        },
      }),
      new webpack.ProvidePlugin({ $: 'jquery' }),
    ],
  };
};

module.exports = env => {
  let config = env === 'production' ? productionConfig : developmentConfig;
  return merge(generateConfig(env), config);
};
```

### 5.2 编写开发环境配置文件

```js
// /build/webpack.dev.conf.js

const webpack = require('webpack');

const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '../dist/'),
    port: 8000,
    hot: true,
    overlay: true,
    proxy: {
      '/comments': {
        target: 'https://m.weibo.cn',
        changeOrigin: true,
        logLevel: 'debug',
        headers: {
          Cookie: '',
        },
      },
    },
    historyApiFallback: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin()],
};
```

### 5.3 编写生产环境配置文件

```js
// /build/webpack.comm.conf.js

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');

module.exports = {
  mode: 'production',
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].min.css',
      allChunks: false, // 只包括初始化css, 不包括异步加载的CSS
    }),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
      verbose: true,
    }),
  ],
};
```

### 6. 其他文件

在项目目录截图中展示的样式文件，vendor 下的文件还有 app.js，代码就不一一列出了。完全可以根据自己的需要，写一些简单的代码，然后运行一下。毕竟前面的配置文件的架构和讲解才是最重要的。

这里仅仅给出源码地址（欢迎 Star 哦）：

- 入口文件`/src/app.js`：[https://github.com/dongyuanxin/webpack-demos/blob/master/demo16/src/app.js](https://github.com/dongyuanxin/webpack-demos/blob/master/demo16/src/app.js)
- `/src/style/`下的所有样式文件：[https://github.com/dongyuanxin/webpack-demos/tree/master/demo16/src/style](https://github.com/dongyuanxin/webpack-demos/tree/master/demo16/src/style)
- `/src/vendor/`下的所有脚本文件：[https://github.com/dongyuanxin/webpack-demos/tree/master/demo16/src/vendor](https://github.com/dongyuanxin/webpack-demos/tree/master/demo16/src/vendor)

### 7. 运行效果和测试

鼓捣这么半天，肯定要测试下，要不怎么才能知道正确性（_这才是另人激动的一步啦啦啦_）。

### 7.1 跑起来：开发模式

进入项目目录，运行`npm run dev`:

![](https://static.godbmw.com/images/webpack/webpack4系列教程/43.png)

成功跑起来，没出错（废话，都是被调试了好多次了哈哈哈）。

打开浏览器的控制台看一下：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/44.png)

很好，都是按照编写的`app.js`的逻辑输出的。

### 7.2 跑起来：生产模式

按`Ctrl+C`退出开发模式后，运行`npm run build`，如下图打包成功：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/45.png)

打包后的文件也放在了指定的位置：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/46.png)

直接点击`index.html`，并且打开浏览器控制台：

![](https://static.godbmw.com/images/webpack/webpack4系列教程/47.png)

ok, 符合`app.js`的输出：成功辨识了是否是开发环境！！！
