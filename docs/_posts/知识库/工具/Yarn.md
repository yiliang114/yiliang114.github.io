---
title: Yarn
date: '2020-10-26'
draft: true
---

### 更好的 NPM 替代品:Yarn

Yarn 是开源 JavaScript 包管理器， 由于 npm 在扩展内部使用时遇到了大小、 性能和安全等问题，Facebook 携手来自 Exponent、Google 和 Tilde 的工程师， 在大型 JavaScript 框架上打造和测试 了 Yarn，以便其尽可能适用于多人开 发。Yarn 承诺比各大流行 npm 包的安装 更可靠，且速度更快。根据你所选的工 作包的不同，Yarn 可以将安装时间从数 分钟减少至几秒钟。Yarn 还兼容 npm 注 册表，但包安装方法有所区别。其使用 了 lockfiles 和一个决定性安装算法， 能够为参与一个项目的所有用户维持相 同的节点模块(node_modules)目录结 构，有助于减少难以追踪的 bug 和在多 台机器上复制。

Yarn 还致力于让安装更快速可靠， 支持缓存下载的每一个包和并行操作， 允许在没有互联网连接的情况下安装 (如果此前有安装过的话)。此外， Yarn 承诺同时兼容 npm 和 Bower 工作流， 让你限制安装模块的授权许可。
2016 年 10 月份, Yarn 在横空出世 不到一周的时间里，github 上的 star 数已经过万，可以看出大厂及社区的活 跃度，以及解决问题的诚意，大概无出 其右了!

替换的原因:
在 Facebook 的大规模 的不太好;npm 都工作 npm 拖慢了公司的 ci 工作流; 对一个检查所有的模块也是相当低效的;npm 被设计为是不确定性的，而 Facebook 工程师需要为他们的 DevOps 工作流提供一直和可依赖的系统。

与 hack npm 限制的做法相反， Facebook 编写了 Yarn:

- Yarn 的本地缓存文件做的更好;
- Yarn 可以并行它的一些操作，这加速了对新模块的安装处理;
- Yarn 使用 lockfiles，并用确定的 算法来创建一个所有跨机器上都一样的文件。 出于安全考虑，在安装进程里，Yarn 不允许编写包的开发者去执行其 他代码。

很多人说和 ruby 的 gem 机制类似， 都生成 lockfile。确实是一个很不错的 改进，在速度上有很大改进，配置 cnpm 等国内源来用，还是相当爽的。

### yarn

- yarn.lock

### npm

- package.json.lock

#### npm 命令

```
npm version xxx
```

### yarn 命令合集

https://www.cnblogs.com/Jimc/p/10108821.html

### Yarn Workspace

https://www.jianshu.com/p/990afa30b6fe
