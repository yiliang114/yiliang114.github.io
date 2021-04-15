---
title: Tree Shaking
date: 2020-11-21
draft: true
---

<!-- TODO: -->

## Tree Shaking

[你的 Tree-Shaking 并没什么卵用](https://juejin.cn/post/6844903549290151949)

### tree sharing

顾名思义，就是通过将多余的代码给“摇晃”掉，在开发中我们经常使用一些第三方库，而这些第三方库只使用了这个库的一部门功能或代码，未使用的代码也要被打包进来，这样出口文件会非常大， `tree-sharking` 帮我们解决了这个问题，它可以将各个模块中没有使用的方法过滤掉，只对有效代码进行打包。

`tree-sharking` 是通过在 Webpack 中配置 `babel-plugin-import` 插件来实现的。

需要注意的是，tree sharking 对于如何 import 模块是有要求的，这就是为什么 react 中经常看到 `import * as React from 'react'` 的原因。

在 b.js 中通过`import a from './a.js'`，来调用，那么就无法使用 tree sharking，这时候我们可以怎么办呢？可以这么写`import * as a from './a.js'`

### Tree Shaking 工作原理

Tree Shaking 可以剔除掉一个文件中未被引用掉部分(在 production 环境下才会提出)，并且只支持 ES Modules 模块的引入方式，不支持 CommonJS 的引入方式。原因：ES Modules 是静态引入的方式，CommonJS 是动态的引入方式，Tree Shaking 只支持静态引入方式。
在开发环境下需要在 webpack 中配置，但是在生成环境下，由于已有默认配置可以不配置 optimization，但是 sideEffects 依然需要配置

[Tree-Shaking](https://github.com/LuoShengMen/StudyNotes/issues/457)

**Tree Shaking 可以实现删除项目中未被引用的代码**，比如

```js
// test.js
export const a = 1;
export const b = 2;
// index.js
import { a } from './test.js';
```

对于以上情况，`test` 文件中的变量 `b` 如果没有在项目中使用到的话，就不会被打包到文件中。

如果你使用 Webpack 4 的话，开启生产环境就会自动启动这个优化功能。

### 什么样的函数会被 Tree Shaking 掉 ？

### 纯函数的什么？ 为什么 vue react 都抛弃了 class 的形式

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

<!-- TODO: -->

### require 引入的模块 webpack 能做 Tree Shaking 吗？

不能，Tree Shaking 需要静态分析，只有 ES6 的模块才支持。

### Es6Module 在静态分析的时候怎么知道 函数是否需要 tree-shake 掉
