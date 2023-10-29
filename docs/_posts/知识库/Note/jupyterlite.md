---
title: jupyterlite
date: "2020-10-26"
draft: true
---

## jupyterlite

jupyterlite 的部署。

- jupyter 扩展的构建脚本， webpack 需要将扩展的入口文件特殊处理，不需要 hash 值。
- 通过 npm 包管理版本？
  - 为什么要通过这种形式呢？
    - 因为我们原来使用的 CI 系统是自研的，每次构建都会重新生成一个版本号，而线上系统在加载真正的静态资源之前，会先加载一个版本文件，内涵当前 region 最新的构建版本静态资源列表。再次加载。现在我们都往滔天的 CI 系统上进行迁移
