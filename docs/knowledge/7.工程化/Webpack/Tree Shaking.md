---
title: Tree Shaking
date: 2020-11-21
draft: true
---

<!-- https://juejin.cn/post/6844903544756109319 -->
<!-- https://juejin.cn/post/6844903549290151949 -->
<!-- https://juejin.cn/post/6844903687412776974 -->

## Tree Shaking

Tree shaking 是一种通过清除多余代码方式来优化项目打包体积的技术，它可以将各个模块中没有使用的方法过滤掉，只对有效代码进行打包。

因为 ES6 模块的出现，ES6 模块依赖关系是确定的，`和运行时的状态无关`，可以进行可靠的静态分析，这就是 Tree shaking 的基础。

### Tree Shaking 工作原理

Tree Shaking 可以剔除掉一个文件中未被引用掉部分(在 production 环境下才会提出)，并且只支持 ES Modules 模块的引入方式，不支持 CommonJS 的引入方式。

原因：ES Modules 是静态引入的方式，CommonJS 是动态的引入方式，Tree Shaking 只支持静态引入方式。

在开发环境下需要在 webpack 中配置，但是在生产环境下，由于已有默认配置可以不配置 optimization，但是 sideEffects 依然需要配置

**Tree Shaking 可以实现删除项目中未被引用的代码**，如果你使用 Webpack 4 的话，开启生产环境就会自动启动这个优化功能。

如果项目中使用了 babel 的话， `@babel/preset-env` 默认将模块转换成 CommonJs 语法，因此需要设置 module：false，webpack2 后已经支持 ESModule。

#### 工作原理

虽然 tree shaking 的概念在 1990 就提出了，但知道 ES6 的 ES6-style 模块出现后才真正被利用起来。这是因为 tree shaking 只能在静态 modules 下工作。ECMAScript 6 模块加载是静态的,因此整个依赖树可以被静态地推导出解析语法树。所以在 ES6 中使用 tree shaking 是非常容易的。而且，tree shaking 不仅支持 import/export 级别，而且也支持 statement(声明)级别。

在 ES6 以前，我们可以使用 CommonJS 引入模块：require()，这种引入是动态的，也意味着我们可以基于条件来导入需要的代码：

```js
let dynamicModule;
// 动态导入
if (condition) {
  myDynamicModule = require('foo');
} else {
  myDynamicModule = require('bar');
}
```

CommonJS 的动态特性模块意味着 tree shaking 不适用。因为它是不可能确定哪些模块实际运行之前是需要的或者是不需要的。在 ES6 中，进入了完全静态的导入语法：import。这也意味着下面的导入是不可行的：

```js
// 不可行，ES6 的 import 是完全静态的
if (condition) {
  myDynamicModule = require('foo');
} else {
  myDynamicModule = require('bar');
}
```

我们只能通过导入所有的包后再进行条件获取。如下：

```js
import foo from 'foo';
import bar from 'bar';

if (condition) {
  // foo.xxxx
} else {
  // bar.xxx
}
```

ES6 的 import 语法完美可以使用 tree shaking，因为可以在代码不运行的情况下就能分析出不需要的代码。

#### 如何使用 Tree shaking

从 webpack 2 开始支持实现了 Tree shaking 特性，webpack 2 正式版本内置支持 ES2015 模块（也叫做 harmony 模块）和未引用模块检测能力。新的 webpack 4 正式版本，扩展了这个检测能力，通过 package.json 的 sideEffects 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 “pure(纯的 ES2015 模块)”，由此可以安全地删除文件中未使用的部分。

本项目中使用的是 webpack4,只需要将 mode 设置为 production 即可开启 tree shaking

```js
entry: './src/index.js',
mode: 'production', // 设置为 production 模式
output: {
path: path.resolve(\_\_dirname, 'dist'),
filename: 'bundle.js'
},
```

如果是使用 webpack2,可能你会发现 tree shaking 不起作用。因为 babel 会将代码编译成 CommonJs 模块，而 tree shaking 不支持 CommonJs。所以需要配置不转义：

```js
options: {
  presets: [['es2015', { modules: false }]];
}
```

#### 总结

tree shaking 不支持动态导入（如 CommonJS 的 require()语法），只支持纯静态的导入（ES6 的 import/export）
webpack 中可以在项目 package.json 文件中，添加一个 “sideEffects” 属性,手动指定由副作用的脚本

### Es6Module 在静态分析的时候怎么知道 函数是否需要 tree-shake 掉

### require 引入的模块 webpack 能做 Tree Shaking 吗？

不能，Tree Shaking 需要静态分析，只有 ES6 的模块才支持。

### 什么样的函数会被 Tree Shaking 掉 ？

### 纯函数的什么？ 为什么 vue react 都抛弃了 class 的形式

啥叫没有副作用 ？

### code splitting 用的是什么插件

使用 Code Splitting 可以有两种方式

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
            chunks: 'all'  // 遇到公用当类库时，自动的 Code Splitting
        }
    },
```

### 组件库如何做按需加载

1. `babel-plugin-import`
2. es module 形式

`tree-sharking` 是通过在 Webpack 中配置 `babel-plugin-import` 插件来实现的。

### 注意点

tree sharking 对于如何 import 模块是有要求的，这就是为什么 react 中经常看到 `import * as React from 'react'` 的原因。

在 b.js 中通过`import a from './a.js'`，来调用，那么就无法使用 tree sharking，这时候我们可以怎么办呢？可以这么写`import * as a from './a.js'`

## sideEffects （副作用）

side effects 是指那些当 import 的时候会执行一些动作，但是不一定会有任何 export。比如 ployfill,ployfills 不对外暴露方法给主程序使用。

tree shaking 不能自动的识别哪些代码属于 side effects，因此手动指定这些代码显得非常重要，如果不指定可能会出现一些意想不到的问题。

在 webpack 中，是通过 package.json 的 sideEffects 属性来实现的。

```json
{
  "name": "tree-shaking",
  "sideEffects": false
}
```

如果所有代码都不包含副作用，我们就可以简单地将该属性标记为 false，来告知 webpack，它可以安全地删除未用到的 export 导出。

如果你的代码确实有一些副作用，那么可以改为提供一个数组：

```js
{
  "name": "tree-shaking",
  "sideEffects": [
    "./src/common/polyfill.js"
  ]
}
```

两个原则：

1. 被 import 的文件中没有 export 被使用，若包含副作用代码：

   1. sideEffects 为 false，则副作用也被删除。即 module 整个模块都不会被打包；
   2. sideEffects 为 true 或副作用列表中包含 module.js，则会仅保留其副作用代码。

2. 被 import 的文件中属性、接口被使用，未被使用的其余 export 都会被删除；无论 sidesEffects 设置什么值，其中的副作用代码始终会被保留。

测试：

可以测试下 lodash-es，把其 package.json 中的 sideEffects 设置为 true，会发现虽然只使用一个子模块，但全部子模块都被打包处理了

## 文档

[你的 Tree-Shaking 并没什么卵用](https://juejin.cn/post/6844903549290151949)

[Tree-Shaking](https://github.com/LuoShengMen/StudyNotes/issues/457)
