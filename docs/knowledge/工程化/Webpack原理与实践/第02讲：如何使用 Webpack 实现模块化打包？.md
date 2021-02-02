---
draft: true
---

#### 让配置文件支持智能提示

VSCode 对于代码的自动提示是根据成员的类型推断出来的，换句话说，如果 VSCode 知道当前变量的类型，就可以给出正确的智能提示。即便你没有使用 TypeScript 这种类型友好的语言，也可以通过类型注释的方式去标注变量的类型。

默认 VSCode 并不知道 Webpack 配置对象的类型，我们通过 import 的方式导入 Webpack 模块中的 Configuration 类型，然后根据类型注释的方式将变量标注为这个类型，这样我们在编写这个对象的内部结构时就可以有正确的智能提示了，具体代码如下所示：

```js
// ./webpack.config.js
import { Configuration } from 'webpack';

/**
 * @type {Configuration}
 */
const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
};

module.exports = config;
```

需要注意的是：我们添加的 import 语句只是为了导入 Webpack 配置对象的类型，这样做的目的是为了标注 config 对象的类型，从而实现智能提示。在配置完成后一定要记得注释掉这段辅助代码，因为在 Node.js 环境中默认还不支持 import 语句，如果执行这段代码会出现错误。

```js
// ./webpack.config.js

// 一定记得运行 Webpack 前先注释掉这里。
// import { Configuration } from 'webpack'

/**
 * @type {Configuration}
 */
const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
};

module.exports = config;
```

没有智能提示的效果，如下所示：
![没有智能提示.gif](https://s0.lgstatic.com/i/image3/M01/8B/55/Cgq2xl6dX_6AS601AGOWR9tvy7w230.gif)

加上类型标注实现智能提示的效果，如下所示：
![加上智能提示.gif](https://s0.lgstatic.com/i/image3/M01/05/10/CgoCgV6dX8WAT4jvAJhTWS1vldA516.gif)

使用  import  语句导入  Configuration  类型的方式固然好理解，但是在不同的环境中还是会有各种各样的问题，例如我们这里在 Node.js 环境中，就必须要额外注释掉这个导入类型的语句，才能正常工作。

所以我一般的做法是直接在类型注释中使用  import  动态导入类型，具体代码如下：

```js
// ./webpack.config.js
/** @type {import('webpack').Configuration} */
const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
};
module.exports = config;
```

这种方式同样也可以实现载入类型，而且相比于在代码中通过  import  语句导入类型更为方便，也更为合理。

不过需要注意一点，这种导入类型的方式并不是 ES Modules 中的  [Dynamic Imports](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import#%E5%8A%A8%E6%80%81import)，而是 TypeScript 中提供特性。虽然我们这里只是一个 JavaScript 文件，但是在 VSCode 中的类型系统都是基于 TypeScript 的，所以可以直接按照这种方式使用，详细信息你可以参考这种  [import\-types](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types)  的文档。

其次，这种 @type 类型注释的方式是基于  [JSDo](https://jsdoc.app)[c](https://jsdoc.app/tags-type.html)  实现的。JSDoc 中类型注释的用法还有很多，详细可以参考[官方文档中对 @type 标签的介绍](https://jsdoc.app/tags-type.html)。
