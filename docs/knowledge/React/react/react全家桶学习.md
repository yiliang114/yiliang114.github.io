---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# React 全家桶学习

## 背景

一个完整的 APP 需要去构思 APP 的：

- 产品功能
- 逻辑过程
- UI 设计
- APP 调用的接口

## 接口和数据怎么办？

数据的增删改查必然需要有数据和接口的支持。介绍一个 json 转 api 的小工具 [json-server](https://github.com/typicode/json-server), 可以帮助我们很快跑起来一个带本地数据库的 restful api 风格的服务端程序。

## 说明

### 技术栈

- react

- react-router

- redux

- react-redux

- react-router-redux

- [redux-saga](https://github.com/redux-saga/redux-saga)

- [immutable](https://github.com/facebook/immutable-js)

- [reselect](https://github.com/reactjs/reselect)

- [antd](http://blog.csdn.net/awaw00/article/details/54692493)

  ​

### 目录结构

```
│  .babelrc                          #babel配置文件
│  package-lock.json
│  package.json
│  README.MD
│  webpack.config.js                 #webpack生产配置文件
│  webpack.dev.config.js             #webpack开发配置文件
│
├─dist
├─public                             #公共资源文件
└─src                                #项目源码
    │  index.html                    #index.html模板
    │  index.js                      #入口文件
    │
    ├─component                      #组建库
    │  └─Hello
    │          Hello.js
    │
    ├─pages                          #页面目录
    │  ├─Counter
    │  │      Counter.js
    │  │
    │  ├─Home
    │  │      Home.js
    │  │
    │  ├─Page1
    │  │  │  Page1.css                #页面样式
    │  │  │  Page1.js
    │  │  │
    │  │  └─images                    #页面图片
    │  │          brickpsert.jpg
    │  │
    │  └─UserInfo
    │          UserInfo.js
    │
    ├─redux
    │  │  reducers.js
    │  │  store.js
    │  │
    │  ├─actions
    │  │      counter.js
    │  │      userInfo.js
    │  │
    │  ├─middleware
    │  │      promiseMiddleware.js
    │  │
    │  └─reducers
    │          counter.js
    │          userInfo.js
    │
    └─router                        #路由文件
            Bundle.js
            router.js

```

## 流程

### init 项目

```
mkdir react-family && cd react-family
npm init -y
```

### webpack

webpack 实际上是在配置文件中指定了入口和输出文件夹，把入口文件经过处理之后，生成一个`bundle.js`。

1. 安装 webpack

   ```
   npm install --save-dev webpack

   // 全局安装webpack
   npm install --g webpack
   ```

2) 配置文件

   ```
   touch webpack.dev.config.js

   // 内容
   const path = require('path');

   module.exports = {

       /*入口*/
       entry: path.join(__dirname, 'src/index.js'),

       /*输出到dist文件夹，输出文件名字为bundle.js*/
       output: {
           path: path.join(__dirname, './dist'),
           filename: 'bundle.js'
       }
   };
   ```

3) 使用 webpack 编译文件

   ```
   webpack --config webpack.dev.config.js

   // 这里需要webpack 全局安装，好像提示安装webpack-cli？？？
   ```

   ​

### babel

转换编译： Babel 把用最新标准编写的 Javascript 代码向下编译成随处可用的版本。

通俗的说，我们使用 ES7 ES6 等标准来编写代码，Babel 会把代码转成 ES5。

- babel-core 调用 babel 的 API 进行转码
- babel-loader
- babel-preset-es2015 用于解析 ES6
- babel-preset-react 用于解析 JSX
- babel-preset-stage-0 用于解析 ES7

```
npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-0
```

新建`babel`配置文件`.babelrc`

```
{
  "presets": [
    "es2015",
    "react",
    "stage-0"
  ],
  "plugins": [

  ]
}
```

修改`webpack.dev.config.js`，增加`babel-loader`！

```
 /*src文件夹下面的以.js结尾的文件，要使用babel解析*/
 /*cacheDirectory是用来缓存编译结果，下次编译加速*/
 module: {
     rules: [{
         test: /\.js$/,
         use: ['babel-loader?cacheDirectory=true'],
         include: path.join(__dirname, 'src')
     }]
 }
```

现在我们简单测试下，是否能正确转义 ES6~

修改 `src/index.js`

```
 /*使用es6的箭头函数*/
 var func = str => {
     document.getElementById('app').innerHTML = str;
 };
 func('我现在在使用Babel!');
```

在`package.json`中新添加一条 script 脚本：

```
   "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack --config webpack.dev.config.js"
  }

```

执行打包命令： `npm start`

Q: `babel-preset-state-0`,`babel-preset-state-1`,`babel-preset-state-2`,`babel-preset-state-3`有什么区别？

A: 每一级包含上一级的功能，比如 `state-0`包含`state-1`的功能，以此类推。`state-0`功能最全。

### react

[react-family](https://github.com/brickspert/blog/issues/1)

## ReactFamily

### 注意点

react-router 4.x 和 2.x 是 官方同时维护的两个版本。需要注意使用。
