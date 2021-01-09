---
title: lerna
date: 2020-11-21
draft: true
---

## Lerna

http://www.sosout.com/2018/07/21/lerna-repo.html

A tool for managing JavaScript projects with multiple packages.https://lernajs.io/
在设计框架的时候，经常做的事儿 是进行模块拆分，继而提供插件或集成 机制，这样是非常好的做法。但问题也 随之而来，当你的模块模块非常多时， 你该如何管理你的模块呢?

- 法 1:每个模块都建立独立的仓库
- 法 2:所有模块都放到 1 个仓库里

法 1 虽然看起来干净，但模块多时， 依赖安装，不同版本兼容等，会导致模 块间依赖混乱，出现非常多的重复依赖， 极其容易造成版本问题。这时法 2 就显 得更加有效，对于测试，代码管理，发 布等，都可以做到更好的支持。Lerna 就是基于这种初衷而产生的 专门用于管理 Node.js 多模块的工具， 当然，前提是你有很多模块需要管理。你可以通过 npm 全局模块来安装 Lerna，官方推荐直接使用 Lerna 2.x 版本。

### 命令

```bash
# 初始化
lerna init

# 发布
lerna publish
```
