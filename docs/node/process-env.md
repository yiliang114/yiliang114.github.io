---
title: process-env
date: 2020-03-14 17:06:38
# permalink: /pages/b15d572f3b5dd62c
---

### Node process.env

在看一些前框框架实现的源码的时候，经常会看到类似如下的代码：

```js
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod.js')
} else {
  module.exports = require('./dev.js')
}
```

node 中有全局变量 process 表示当前 node 进程，process（进程）其实就是存在 nodejs 中的一个全局变量，process.env 包含着关于系统环境的信息。但是 process.env 中并不存在 NODE_ENV 这个东西。其实 NODE_ENV 只是一个用户自定义的变量。

而具体 `process.env.xxx` 中的 `xxx` 是开发者自己定义的。比如上述的：

```bash
process.env.NODE_ENV
// 或者
process.env.VUE_CLI_DEBUG = true
process.env.PORT
```

#### window 设置环境变量

```bash
set NODE_ENV=dev
```

#### Unix 设置环境变量

```bash
export NODE_ENV=dev
```

#### 直接在 js 代码中设置环境变量

```js
process.env.VUE_CLI_DEBUG = true
```

#### package.json 中设置环境变量

```js
"scripts": {
  "start-win": "set NODE_ENV=dev && node app.js",
  "start-unix": "export NODE_ENV=dev && node app.js",
 }
```

#### 解决 window 和 unix 命令不一致的问题

安装 `npm i cross-env --save-dev`

```js
"scripts": {
  "start-win": "cross-en NODE_ENV=dev && node app.js",
 }
```

#### unix 永久设置环境变量

```bash
# 所有用户都生效
vim /etc/profile
# 当前用户生效
vim ~/.bash_profile
```

最后修改完成后需要运行如下语句令系统重新加载

```bash
# 修改/etc/profile文件后
source /etc/profile
# 修改~/.bash_profile文件后
source ~/.bash_profile
```
