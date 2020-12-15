---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# 包与 npm

### 包结构

包实际上是一个存档文件，及一个目录直接打包为.zip 或 tar.gz 格式的文件，安装后解压还原为目录。完全符合 CommonJS 规范的包目录应该包含如下这些文件。

- package.json
  - 包描述文件
- bin
  - 存放可执行二进制文件的目录
- lib
  - 用于存放 JavaScript 代码目录
- doc
  - 用于存放文档的目录
- test
  - 用于存放单元测试用例的代码

### package.json

CommonJS 为起定义了一些必需的字段。

- name
  - 包名。唯一的，避免对外发布时命名冲突
- description
  - 包简介
- version
  - 版本号
- keywords
  - 关键词数组，用于做分类搜索
- maintainers
  - 包维护者列表

权限认证

- contributors
  - 贡献者列表
- bugs
  - 一个可以反馈 bug 的页面或邮件
- licenses
  - 包所使用的许可证列表
- repositories
  - 托管源代码的文件位置
- **dependencies**
  - 当前包所依赖的包列表
- directories
  - 包目录说明
- implements
  - 实现规范的列表
- scripts
  - 脚本说明对象
  - 被包管理器永安里安装、编译、测试、卸载包

补充

- author
  - 包作者
- bin
  - 一些包作者希望包可以作为命令行工具使用。配置好 bin 字段后，可通过 `npm install ... -g`将脚本添加到执行路径
- main
  - 模块引入方法 require()在引入包时，会优先检查这个字段，并将其作为包中其余模块的入口。
- devDependencies
  - 一些模块只在开发时需要依赖。可配置这个属性

### npm 常用功能

- 查看帮助

  - npm -v
  - npm
  - npm <cmd\> -h
    - quick help on <cmd\>
  - npm -l
    - display full usage info
  - npm faq
  - npm help <term\>

- 安装依赖
  - npm install ...
    - 他会在当前目录下创建 node_modules，然后在下面创建 ... 目录，接着将包解压到这个目录下
  - npm install ... -g
    - 全局模块安装。并不意味着可以从任何地方 require()来引入它
    - -给 其实是将一个包安装为全局可用的可执行命令。他根据包描述文件中 bin 字段配置，将实际脚本链接到与 Node 可执行文件相同的路径下
  - 从本地安装
  - 本地安装只需指明 npm 指明 package.json 文件所在的位置即可

npm 钩子命令
package.json 中 script 字段的提出就是让包在安装或者卸载等过程中提供钩子机制

```js
"script": {
  "preinstall": "xxx.js",
  "install": "xxx.js",
  "uninstall": "xxx.js",
  "test": "xxx.js"
}
```

### 一个 npm 包发布

一个项目应该添加个 README.md 来介绍这个包的功能，开源项目还应该有个 LICENSE，来声明我们的开源协议。关于如何写好一个 README，我觉得至少应该写清楚名字、功能描述、使用指引、开原协议等。

正式发布这个包
注意：使用 npm 的源不要使用其他如：taobao

先去 npm 注册个账号，然后在命令行使用

```js
npm adduser # 根据提示输入用户名密码即可
```

现在在来一个命令你的包就可以成功发布了，

```js
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
