---
title: Babel
date: '2020-10-26'
draft: true
---

<!-- https://blog.csdn.net/zy444263/article/details/86513190 -->

AST 以及 AST 有啥应用 (babel/ Tree-shaking 以及之前有人用 AST 来实现 微信小程序动态执行代码)

## AST

<!-- https://zhuanlan.zhihu.com/p/361683562 -->

抽象语法树（Abstract Syntax Tree）简称 AST，是源代码的抽象语法结构的树状表现形式。webpack、eslint 等很多工具库的核心都是通过抽象语法树这个概念来实现对代码的检查、分析等操作。

### 词法分析和语法分析

JavaScript 是解释型语言，一般通过 词法分析 -> 语法分析 -> 语法树，就可以开始解释执行了。

词法分析：也叫扫描，是将字符流转换为记号流(tokens)，它会读取我们的代码然后按照一定的规则合成一个个的标识。

语法分析：也称解析器，将词法分析出来的数组转换成树的形式，同时验证语法。语法如果有错的话，抛出语法错误。语法分析最终的结果成 AST。

### AST 能做什么

1. 语法检查、代码风格检查、格式化代码、语法高亮、错误提示、自动补全等
2. 代码混淆压缩
3. 优化变更代码，改变代码结构等

## Babel

babel 是一个 JS 解码器，可以将 ES6 代码转为 ES5 代码，从而在现有环境执行。让开发者提前使用最新的 JS 语法(ES6/ES7)，而不用等浏览器全部兼容。Babel 默认只转换新的 JS 句法(syntax)，而不转换新的 API。babel 转换代码其实就是用了 AST，babel 与 AST 就有着很一种特别的关系。

### babel 工作流程

babel 的转译过程分为三个阶段：parsing、transforming、generating，以 ES6 代码转译为 ES5 代码为例，babel 转译的具体过程如下：

1. 解析：将代码字符串解析成抽象语法树。babylon 将 ES6/ES7 代码解析成 AST。
   1. 词法分析：将代码(字符串)分割为 token 流，即语法单元成的数组
   2. 语法分析：分析 token 流(上面生成的数组)并生成 AST
2. 转换：对抽象语法树进行转换操作。plugin 用 babel-traverse 对 AST 树进行遍历转译, 得到新的 AST 树。
3. 再建：根据变换后的抽象语法树再生成代码字符串。新 AST 通过 babel-generator 转换成 ES5。

最重要的是第二步：转换，需要通过插件来定义转换规则

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

- 按需加载插件的实现原理
- (vue 的) jsx 插件的实现原理

##### babel-polyfill

https://blog.csdn.net/chjj0904/article/details/79169821
Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，
以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。
举例来说，ES6 在 Array 对象上新增了 Array.from 方法。Babel 就不会转码这个方法。如果想让这个方法运行，必须使用 babel-polyfill，为当前环境提供一个垫片

##### babel-register

babel-register 字面意思能看出来，这是 babel 的一个注册器，它在底层改写了 node 的 require 方法，引入 babel-register 之后所有 require 并以.es6, .es, .jsx 和 .js 为后缀的模块都会经过 babel 的转译

### presets 和 plugins 的区别

presets 其实是多个 plugin 的集合。如果某一个插件集合还不能满足我们的需要，就需要添加其他的插件。

例如，我们在做 vue 和 react 开发的时候需要用到 jsx ，这个时候就需要一些其他的插件：`transform-vue-jsx`.

需要 polyfill 的支持，但是又不想直接引入 polyfill(有弊端)，可以使用 `transform-runtime`

### transform-runtime 以及 stage-2 说一下他们的作用

env: env 则代指最新的标准，包括了 latest 和 es20xx 各年份

### stage 几个阶段的区别

1. Stage 0 - 稻草人: 只是一个想法，可能是 babel 插件。
2. Stage 1 - 提案: 初步尝试。
3. Stage 2 - 初稿: 完成初步规范。
4. Stage 3 - 候选: 完成规范和浏览器初步实现。
5. Stage 4 - 完成: 将被添加到下一年度发布。

### @babel/core 与 @babel/preset-env

### 写过 babel 插件吗？是用来干什么？怎么写的？

### babel-polyfill 和 babel-transform-runtime 的区别

1. babel-polyfill
   由于 babel 默认只转换新的 JavaScript 语法，但对于一些新的 API 是不进行转化的（比如内建的 Promise、WeakMap，静态方法如 Array.from 或者 Object.assign），那么为了能够转化这些东西，我们就需要使用 babel-polyfill 这个插件
   由于 babel-polyfill 是个运行时垫片，所以需要声明在 dependencies 而非 devDependencies 里

2. babel-plugin-transform-runtime
   由于使用 babel-polyfill，会产生以下问题：
   1. babel-polyfill 会将需要转化的 API 进行直接转化，这就导致用到这些 API 的地方会存在大量的重复代码
   2. babel-polyfill 是直接在全局作用域里进行垫片，所以会污染全局作用域

所以，babel 同时提供了 babel-plugin-transform-runtime 这一插件，它的好处在于：

1. 需要用到的垫片，会使用引用的方式引入，而不是直接替换，避免了垫片代码的重复
2. 由于使用引用的方式引入，所以不会直接污染全局作用域。这就对于库和工具的开发带来了好处
   但是 babel-plugin-transform-runtime 仍然不能单独作用。因为有一些静态方法，如"foobar".includes("foo")仍然需要引入 babel-polyfill 才能使用

babel、babel-polyfill 的区别：

babel-polyfill：模拟一个 es6 环境，提供内置对象如 Promise 和 WeakMap
引入 babel-polyfill 全量包后文件会变得非常大。它提供了诸如 Promise，Set 以及 Map 之类的内置插件，这些将污染全局作用域,可以编译原型链上的方法。

babel-plugin-transform-runtime & babel-runtime：转译器将这些内置插件起了别名 core-js，这样你就可以无缝的使用它们，并且无需使用 polyfill。但是无法编译原型链上的方法

runtime 编译器插件做了以下三件事：

1. 当你使用 generators/async 函数时，自动引入 babel-runtime/regenerator 。
1. 自动引入 babel-runtime/core-js 并映射 ES6 静态方法和内置插件。
1. 移除内联的 Babel helper 并使用模块 babel-runtime/helpers 代替。

### babel 几个不同插件的有什么不同的作用，register-babel jsx-babel 等

### babel 在转义的时候一些问题

babel 在 转义 const 的时候 会转成什么 但是 在运行的时候 为什么会有 const 的属性...

const 属性被编译成 var 的之后，属性会被一个 `_readOnlyError` 函数包起来，修改值的时候 就会 throw 一个 Error

### Babel 是如何编译 let 和 const?

首先来看下编译结果：

```js
let value = 'a';
// babel编译后：
var value = 'a';
```

可以看到 Babel 是将 let 编译成了 var，那再来一个例子：

```js
if (false) {
  let value = 'a';
}
console.log(value); // value is not defined
```

如果 babel 将 let 编译为 var 因该打印 undefined,为何会报错呢，babel 是这样编译的：

```js
if (false) {
  var _value = 'a';
}
console.log(value);
```

babel 是改变量名，使内外层的变量名称不一样。 const 修改值时报错，以及重复声明报错怎么实现的呢？其实在编译时就报错了

### 为什么很多人宁可使用 for 循环也不愿意使用扩展运算符 ？

## 拿 AST 能干啥

1. 给 await 函数自动注入 try catch （没有实践过）
2. 移除 console.log 之类的。 webpack 插件做的事。
