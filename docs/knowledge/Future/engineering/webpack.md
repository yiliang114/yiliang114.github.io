---
layout: CustomPages
title: engineering
date: 2020-11-21
aside: false
draft: true
---

## webpack questions

- 入口怎么配置
- 多页应用怎么进行配置
- UglifyJsPlugin 压缩很慢，如何提高速度
  - 缓存原理，压缩只重新压缩改变的，还有就是减少冗余的代码，压缩只用于生产阶段
- js css 的编译，html 文件的打包
- webpack-dev-server 的使用
- 图片资源的处理
- 代码分割，js 代码大小控制
- 打包速度优化
- 如何批量引入组件，require.context
- webpack 的劣势在哪里

### webpack 打包原理

初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
编译：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理。
输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统。

### 写一个 loader 和插件

两者有什么区别，作用场景分别是咋样的。

### webpack

为什么 很多 image 的 src 中，特别是使用 v-for 循环渲染的 image @总是找不到？
