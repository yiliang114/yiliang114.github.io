---
title: engineering
date: 2020-11-21
draft: true
---

<!-- https://segmentfault.com/a/1190000038708512 -->
<!-- https://segmentfault.com/a/1190000022227140 -->

## Rollup

下一代打包工具，这是 Rollup 对自己的定位。几乎所有的前端开发工程师一定都知道 webpack ， 因为在使用 Vue React 写项目的过程中几乎都会用到 webpack， 但是实际对于 Vue 和 React 源码稍有了解的同学一定知道，像 React、Vue 等框架的构建工具使用的都是 rollup。

vue react 都是通过 rollup 来打包的，一般来说会被打包成比较小的 js 文件，能够对一些冗余代码做一定的优化。rollup 功能单一，一般来说只能处理模块化打包 （只能处理 js 文件）。webpack 功能强大，能够处理几乎所有文件。

### Rollup 和 webpack 区别

webpack 更适合打包组件库、应用程序之类的应用，而 rollup 更适合打包纯 js 的类库。

rollup 打包出来的体积都比 webpack 略小一些，通过查看打包出来的代码，webpack 打包出来的文件里面有很多 `__webpack_require__`工具函数的定义，可读性也很差，而 rollup 打包出来的 js 会简单一点。

rollup:

1. 打包你的 js 文件的时候如果发现你的无用变量，会将其删掉。
2. 所有资源放同一个地方，一次性加载,利用 tree-shake 特性来 剔除未使用的代码，减少冗余
3. 可以将你的 js 中的代码，编译成你想要的格式
4. rollup 只处理函数和顶层的 import/export 变量，不能把没用到的类的方法消除掉

webpack:

1. 代码拆分
2. 拆分代码、按需加载
3. 静态资源导入（如 js、css、图片、字体等）
   拥有如此强大的功能，所以 webpack 在进行资源打包的时候，就会产生很多冗余的代码。
