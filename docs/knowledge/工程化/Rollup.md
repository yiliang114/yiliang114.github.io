---
title: engineering
date: 2020-11-21
draft: true
---

## Rollup

下一代打包工具，这是 Rollup 对自己的定位。几乎所有的前端开发工程师一定都知道 webpack ， 因为在使用 Vue React 写项目的过程中几乎都会用到 webpack， 但是实际对于 Vue 和 React 源码稍有了解的同学一定知道，像 React、Vue 等框架的构建工具使用的都是 rollup。

### 其他

#### 命令配置

```
// 指定配置文件
rollup -c rollup.dev.config.js
// w 表示 watch m 表示生成 sourcemap
rollup -wm
```

### 打包

对于浏览器：

```
# compile to a <script> containing a self-executing function ('iife')
$ rollup main.js --file bundle.js --format iife
```

对于 Node.js:

```
# compile to a CommonJS module ('cjs')
$ rollup main.js --file bundle.js --format cjs
```

对于浏览器和 Node.js:

```js
# UMD format requires a bundle name
$ rollup main.js --file bundle.js --format umd --name "myBundle"
```

总结：

- 浏览器执行的包一般都会打包成 iife 立即执行函数
- node 默认的模块化是 cjs
- 如果包需要同时支持 node 以及浏览器的话，需要打包成 umd
