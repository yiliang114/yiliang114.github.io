---
title: babel
date: '2020-10-26'
draft: true
---

## babel

babel 是一个 JS 解码器，可以将 ES6 代码转为 ES5 代码，从而在现有环境执行。让开发者提前使用最新的 JS 语法(ES6/ES7)，而不用等浏览器全部兼容。Babel 默认只转换新的 JS 句法(syntax)，而不转换新的 API。

### stage 几个阶段的区别

### 配置文件 `.babelrc`

存放在项目的根目录下面。基本格式如下：

```js
{
  "presets": [],
  "plugins": []
}
```

presets (预设)字段设定转码规则，官方提供以下的规则集，你可以根据需要安装。

- babel-preset-es2015 用于解析 ES6
- babel-preset-react 用于解析 JSX
- babel-preset-stage-0 用于解析 ES7

然后，将这些规则加入 `.babelrc`

```js
  {
    "presets": [
      "es2015",
      "react",
      "stage-0"
    ],
    "plugins": []
  }
```

#### preset 预设

#### plugin 插件

transform-runtime 以及 stage-2 说一下他们的作用

- stage-1，stage-2，stage-3

- 按需加载插件的实现原理
- (vue 的) jsx 插件的实现原理

##### babel-polyfill

https://blog.csdn.net/chjj0904/article/details/79169821
Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，
以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。
举例来说，ES6 在 Array 对象上新增了 Array.from 方法。Babel 就不会转码这个方法。如果想让这个方法运行，必须使用 babel-polyfill，为当前环境提供一个垫片

##### babel-register

babel-register 字面意思能看出来，这是 babel 的一个注册器，它在底层改写了 node 的 require 方法，引入 babel-register 之后所有 require 并以.es6, .es, .jsx 和 .js 为后缀的模块都会经过 babel 的转译

### babel 不支持 proxy

### 为什么很多人宁可使用 for 循环也不愿意使用扩展运算符 ？

### ES6 代码转成 ES5 代码的实现思路是什么

将 ES6 的代码转换为 AST 语法树，然后再将 ES6 AST 转为 ES5 AST，再将 AST 转为代码
