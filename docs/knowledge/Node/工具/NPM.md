---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# 包与 npm

### 结构

完全符合 CommonJS 规范的包目录应该包含如下这些文件。

- package.json 包描述文件
- bin 存放可执行二进制文件的目录
- lib 用于存放 JavaScript 代码目录
- doc 用于存放文档的目录
- test 用于存放单元测试用例的代码

#### package.json

CommonJS 为起定义了一些必需的字段。

- name 包名。唯一的，避免对外发布时命名冲突
- description 包简介
- version 版本号
- keywords 关键词数组，用于做分类搜索
- maintainers 包维护者列表

权限认证

- contributors 贡献者列表
- bugs 一个可以反馈 bug 的页面或邮件
- licenses 包所使用的许可证列表
- repositories 托管源代码的文件位置
- **dependencies** 当前包所依赖的包列表
- directories 包目录说明
- implements 实现规范的列表
- scripts 脚本说明对象 被包管理器永安里安装、编译、测试、卸载包

补充

- author 包作者
- bin 一些包作者希望包可以作为命令行工具使用。配置好 bin 字段后，可通过 `npm install ... -g`将脚本添加到执行路径
- main 模块引入方法 require()在引入包时，会优先检查这个字段，并将其作为包中其余模块的入口。
- devDependencies 一些模块只在开发时需要依赖。可配置这个属性

### 钩子命令

package.json 中 script 字段的提出就是让包在安装或者卸载等过程中提供钩子机制

```js
"script": {
  "preinstall": "xxx.js",
  "install": "xxx.js",
  "uninstall": "xxx.js",
  "test": "xxx.js"
}
```

### 包发布

一个项目应该添加个 README.md 来介绍这个包的功能，开源项目还应该有个 LICENSE，来声明我们的开源协议。关于如何写好一个 README，我觉得至少应该写清楚名字、功能描述、使用指引、开原协议等。

正式发布这个包

注意：使用 npm 的源不要使用其他如：taobao 等源， 先去 npm 注册个账号，然后在命令行使用。

```
npm adduser # 根据提示输入用户名密码即可
```

现在在来一个命令你的包就可以成功发布了，

```
npm publish
```

现在你就可以像下载安装其他包一样使用这个你自己开发的工具了

```js
npm install translator-cli
```

关于包的更新

更新 npm 包也是使用 npm publish 命令发布，不过必须更改 npm 包的版本号，即 package.json 的 version 字段，否则会报错，同时我们应该遵 Semver(语义化版本号) 规范，npm 提供了 npm version 给我们升级版本

```js
// 升级补丁版本号
npm version patch

// 升级小版本号
npm version minor

// 升级大版本号
npm version major
```

### npm

全局设置 npm 源为淘宝源需要在 npmrc 文件中添加: `registry=https://registry.npm.taobao.org`

全局设置默认路径：

- window: nodejs 安装目录下 `node_modules/npm/.npmrc`
- mac: `~`下的`.npmrc`

### 20.介绍下 npm 模块安装机制，为什么输入 npm install 就可以自动安装对应的模块？

#### 1. npm 模块安装机制：

- 发出`npm install`命令
- 查询 node_modules 目录之中是否已经存在指定模块
  - 若存在，不再重新安装
  - 若不存在
    - npm 向 registry 查询模块压缩包的网址
    - 下载压缩包，存放在根目录下的`.npm`目录里
    - 解压压缩包到当前项目的`node_modules`目录

#### 2. npm 实现原理

输入 npm install 命令并敲下回车后，会经历如下几个阶段（以 npm 5.5.1 为例）：

1. **执行工程自身 preinstall**

当前 npm 工程如果定义了 preinstall 钩子此时会被执行。

1. **确定首层依赖模块**

首先需要做的是确定工程中的首层依赖，也就是 dependencies 和 devDependencies 属性中直接指定的模块（假设此时没有添加 npm install 参数）。

工程本身是整棵依赖树的根节点，每个首层依赖模块都是根节点下面的一棵子树，npm 会开启多进程从每个首层依赖模块开始逐步寻找更深层级的节点。

1. **获取模块**

获取模块是一个递归的过程，分为以下几步：

- 获取模块信息。在下载一个模块之前，首先要确定其版本，这是因为 package.json 中往往是 semantic version（semver，语义化版本）。此时如果版本描述文件（npm-shrinkwrap.json 或 package-lock.json）中有该模块信息直接拿即可，如果没有则从仓库获取。如 packaeg.json 中某个包的版本是 ^1.1.0，npm 就会去仓库中获取符合 1.x.x 形式的最新版本。
- 获取模块实体。上一步会获取到模块的压缩包地址（resolved 字段），npm 会用此地址检查本地缓存，缓存中有就直接拿，如果没有则从仓库下载。
- 查找该模块依赖，如果有依赖则回到第 1 步，如果没有则停止。

1. **模块扁平化（dedupe）**

上一步获取到的是一棵完整的依赖树，其中可能包含大量重复模块。比如 A 模块依赖于 loadsh，B 模块同样依赖于 lodash。在 npm3 以前会严格按照依赖树的结构进行安装，因此会造成模块冗余。

从 npm3 开始默认加入了一个 dedupe 的过程。它会遍历所有节点，逐个将模块放在根节点下面，也就是 node-modules 的第一层。当发现有**重复模块**时，则将其丢弃。

这里需要对**重复模块**进行一个定义，它指的是**模块名相同**且 **semver 兼容。\*\*每个 semver 都对应一段版本允许范围，如果两个模块的版本允许范围存在交集，那么就可以得到一个\*\*兼容**版本，而不必版本号完全一致，这可以使更多冗余模块在 dedupe 过程中被去掉。

比如 node-modules 下 foo 模块依赖 lodash@^1.0.0，bar 模块依赖 lodash@^1.1.0，则 **^1.1.0** 为兼容版本。

而当 foo 依赖 lodash@^2.0.0，bar 依赖 lodash@^1.1.0，则依据 semver 的规则，二者不存在兼容版本。会将一个版本放在 node_modules 中，另一个仍保留在依赖树里。

举个例子，假设一个依赖树原本是这样：

node_modules
-- foo
---- lodash@version1

-- bar
---- lodash@version2

假设 version1 和 version2 是兼容版本，则经过 dedupe 会成为下面的形式：

node_modules
-- foo

-- bar

-- lodash（保留的版本为兼容版本）

假设 version1 和 version2 为非兼容版本，则后面的版本保留在依赖树中：

node_modules
-- foo
-- lodash@version1

-- bar
---- lodash@version2

1. **安装模块**

这一步将会更新工程中的 node_modules，并执行模块中的生命周期函数（按照 preinstall、install、postinstall 的顺序）。

1. **执行工程自身生命周期**

当前 npm 工程如果定义了钩子此时会被执行（按照 install、postinstall、prepublish、prepare 的顺序）。

最后一步是生成或更新版本描述文件，npm install 过程完成。
