---
layout: CustomPages
title: webpack
date: 2020-11-21
aside: false
draft: true
---

# React Webpack

### 1. 创建项目

```
mkdir zero-react-webpack
cd zero-react-webpack
npm init -y
```

### 2. 安装包

分别安装`webpack-cli`,`babel-core`,`babel-loader`,`babel-preset-es2015`,`babel-preset-react`,`react`,`react-dom`

```
cnpm i --save-dev webpack-cli babel-core babel-loader babel-preset-es2015 babel-preset-react
cnpm i --save react react-dom
```

### 3. 查看 webpack 版本

```
webpack -v // 如果全局安装了webpack,这个命令查询的是全局的webpack版本
```

### 4. 创建目录

```
mkdir src dist
touch src/app.js src/index.js dist/index.html webpack.config.js
```

### 5. code

```
// src/app.js
import React, { Component } from 'react'

class App extends Component {
    render() {
        return (
            <h1>Hello React.</h1>
        )
    }
}

export default App
```

```
// src/index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(
    <App />,
    document.getElementById('app')
)
```

```
//webpack.config.js
const path = require('path');
module.exports = {
    entry: path.resolve(__dirname, './src/index.js'), //指定入口文件，程序从这里开始编译,__dirname当前所在目录, ../表示上一级目录, ./同级目录
    output: {
        path: path.resolve(__dirname, './dist'), // 输出的路径
        filename: 'bundle.js'  // 打包后文件
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['react', 'es2015'],
                    }
                },
                exclude: /node_modules/
            }
        ]
    }
}
```

```
// dist/index.html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <div id="app"></div>
    <script src="bundle.js"></script>
</body>

</html>
```

### 6. run

1. 添加`npm scripts`

   ```
   "start": "webpack"
   ```

   修改完之后的`package.json`是这样的：

   ```
   {
     "name": "zero-react-webpack",
     "version": "1.0.0",
     "description": "",
     "main": "index.js",
     "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1",
       "start": "webpack"
     },
     "keywords": [],
     "author": "",
     "license": "ISC",
     "devDependencies": {
       "babel-core": "^6.26.0",
       "babel-loader": "^7.1.4",
       "babel-preset-es2015": "^6.24.1",
       "babel-preset-react": "^6.24.1",
       "webpack": "^4.1.1",
       "webpack-cli": "^2.0.10"
     },
     "dependencies": {
       "react": "^16.2.0",
       "react-dom": "^16.2.0"
     }
   }

   ```

2. 直接在命令行运行`webpack`

   **注意：**直接在命令行运行`webpack`，如果全区安装了 webpack，会优先使用全区安装的 webpack 版本进行打包处理。

   **一般来说没什么问题，但是需要注意 webpack@3.x 和 webpack@4.x 的配置文件的一些区别。**比如说@4.x 不认`module`中声明的`loaders`,而只能使用`rules`。

### 7. webpack-dev-server

`webpack`虽然提供了`webpack --watch`的命令来动态监听文件的改变并实时打包，输出新的`bundle.js`文件，但是文件多了之后打包速度会很慢，此外这样打包的方式不能做到`hot replace`，即每次编译之后，还需要手动刷新浏览器。

`webpack-dev-server`能够克服上面的两个问题。`webpack-dev-server`主要是启动了一个`express` 的`http`服务器，类似于`http-server`。`webpack-dev-server`监听资源文件的改动并且实时编译，编译好的文件并不会输出到配置文件中声明的`output`目录中，而是会保存在内存中。

#### 1. 启动

如果不进行设定的话，默认是在当前目录下。

```
// content-base 目录
webpack-dev-server --content-base ./dist
```

这个时候还要注意的一点就是在`webpack.config.js`文件里面，如果配置了`output`的`publicPath`这个字段的值的话，在`index.html`文件里面也应该做出调整。**因为 webpack-dev-server 伺服的文件是相对 publicPath 这个路径的**。因此，如果你的`webpack.config.js`配置成这样的：

```
    module.exports = {
        entry: './src/js/index.js',
        output: {
            path: './dist/js',
            filename: 'bundle.js'，
            publicPath: '/assets/'
        }
    }
```

那么，在`index.html`文件当中引入的路径也发生相应的变化:

```
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Demo</title>
    </head>
    <body>
        <script src="assets/bundle.js"></script>
    </body>
    </html>
```

如果在`webpack.config.js`里面没有配置`output`的`publicPath`的话，那么`index.html`最后引入的文件`js文件`路径应该是下面这样的。

```
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Demo</title>
    </head>
    <body>
        <script src="bundle.js"></script>
    </body>
    </html>
```

#### 4. Automatic Refresh

`webpack-dev-server`支持 2 种自动刷新的方式：

- Iframe mode
- inline mode

[webpack-dev-server](https://segmentfault.com/a/1190000006670084)
