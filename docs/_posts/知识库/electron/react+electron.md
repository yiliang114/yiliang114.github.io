---
title: react + electron
date: 2018-11-21
---

# 使用 create-react-app 创建 Electron 桌面应用

**如何创建一个最简单的 electron 桌面应用？**

[electron-quick-start](https://github.com/electron/electron-quick-start)

```
git clone https://github.com/electron/electron-quick-start.git
cd electron-quick-start
npm i
// 运行应用
npm start
```

这个时候就可以看到应用跑起来了。

**react+electron**

接下来使用`create-react-app`创建 electron 项目。

```
npm i -g create-react-app
create-react-app electron-react
cd electron-react
```

1. 安装 electron 以及添加启动命令

   ```js
   npm i -S electron

   // 在package.json 中添加electron 启动命令
    "electron-start": "electron . --env dev"
   ```

2. 在 react 的最外层目录创建 electron 的主进程文件 main.js， 内容直接拷贝`electron-quick-start`仓库中的 main.js

3. 在 React 项目中的 package.json 文件中增加 main 字段，值为"main.js"

4. 在文件 package.json 中添加字段 "homepage":"."

5. 还需要修改一下 main.js 的内容，以便于对应 dev 和 build 状态下都能够两个命令就运行我们的 electron 应用。

   ```
   // 声明一个全局变量
   // 获取命令中带的参数
   const argv = process
     .argv
     .slice(2)
   ```

```js
// 对 createWindow 函数中的内容进行修改
//判断是否是开发模式
if (argv && argv[1] == 'dev') {
  mainWindow.loadURL('http://localhost:3000/');
} else if (argv && argv[1] == 'build') {
  // window 加载 build 好的 html.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(_dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );
}
```

`mainWindow.loadURL("http://localhost:3000/")` 表示在开发模式下， electron 应用窗口加载的资源是 `ttp://localhost:3000/` 也就是我们的网页应用。

```js
mainWindow.loadURL(
  url.format({
    pathname: path.join(__dirname, './build/index.html'),
    protocol: 'file:',
    slashes: true,
  }),
);
```

表示的是 electron 加载的是静态的资源文件，其实就是 react 应用 build 之后的入口文件。

**因此，现在开发 electron 应用，只需要打开两个命令窗口分别运行 npm start 和 npm run electron-start 即可热更新~~**

### 引入 antd

```
yarn add antd
```

修改 `src/App.js`，引入 antd 的按钮组件。

```js
import React, { Component } from 'react';
import Button from 'antd/lib/button';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Button type="primary">Button</Button>
      </div>
    );
  }
}

export default App;
```

修改 `src/App.css`，在文件顶部引入 `antd/dist/antd.css`。

```css
@import '~antd/dist/antd.css';

.App {
  text-align: center;
}
```

#### 高级配置--- 按需加载 antd

上面的例子实际上加载了全部的 antd 组件的样式（对前端性能是个隐患）。

此时我们需要对 create-react-app 的默认配置进行自定义，这里我们使用 [react-app-rewired](https://github.com/timarney/react-app-rewired) （一个对 create-react-app 进行自定义配置的社区解决方案）。

引入 react-app-rewired 并修改 package.json 里的启动配置。

```
yarn add react-app-rewired --dev

```

```json
/_ package.json _/
"scripts": {
- "start": "react-scripts start",
+ "start": "react-app-rewired start",
- "build": "react-scripts build",
+ "build": "react-app-rewired build",
- "test": "react-scripts test --env=jsdom",
+ "test": "react-app-rewired test --env=jsdom",
  }

```

然后在项目根目录创建一个 `config-overrides.js` 用于修改默认配置。

```js
module.exports = function override(config, env) {
  // do stuff with the webpack config...
  return config;
};
```

##### 使用 babel-plugin-import

https://ant.design/docs/react/use-with-create-react-app-cn#使用-babel-plugin-import

[babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 是一个用于按需加载组件代码和样式的 babel 插件（[原理](https://ant.design/docs/react/getting-started-cn#按需加载)），现在我们尝试安装它并修改 `config-overrides.js` 文件。

```
yarn add babel-plugin-import --dev

```

```
- const { injectBabelPlugin } = require('react-app-rewired');

  module.exports = function override(config, env) {

- config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }], config);
  return config;
  };

```

然后移除前面在 `src/App.css` 里全量添加的 `@import '~antd/dist/antd.css';` 样式代码，并且按下面的格式引入模块。

```js
// src/App.js
import React, { Component } from 'react';

import { Button } from 'antd';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Button type="primary">Button</Button>
      </div>
    );
  }
}

export default App;
```

最后重启 `yarn start` 访问页面，antd 组件的 js 和 css 代码都会按需加载，你在控制台也不会看到这样的[警告信息](https://zos.alipayobjects.com/rmsportal/vgcHJRVZFmPjAawwVoXK.png)。关于按需加载的原理和其他方式可以阅读[这里](https://ant.design/docs/react/getting-started-cn#按需加载)。

### electron build

安装`electron-package`打包插件

```
cnpm i electron-package --save-dev

```

#### 正式打包

https://blog.csdn.net/arvin0/article/details/52690023

electron-packager 的打包基本命令是：

```
electron-packager <location of project> <name of project> <platform> <architecture> <electron version> <optional options>
```

命令说明：

- location of project：项目所在路径
- name of project：打包的项目名字
- platform：确定了你要构建哪个平台的应用（Windows、Mac 还是 Linux）
- architecture：决定了使用 x86 还是 x64 还是两个架构都用
- electron version：electron 的版本
- optional options：可选选项

package.json 里添加代码，
`"electron-build": "npm run build && electron-packager . --env build HelloWorld --win --out ./output --arch=x64 --version 2.0.0 --overwrite --icon=./public/favicon.ico --ignore=node_modules"`

### Create-react-app 与 Electron 中线程间的通信

将`create-react-app`与`electron`集成在了一个项目中。但是在 React 中无法使用`electron`。

当在 React 中使用`require('electron')`时就会报`TypeError: fs.existsSync is not a function`的错误。因为 React 中无法使用 Node.js 的模块.

解决方案如下

**创建`renderer.js`文件**

在项目`public/`目录下新建`renderer.js`文件,该文件是预加载的 js 文件，并且在该文件内可以使用所有的 Node.js 的 API。在`renderer.js`中添加

```js
global.electron = require('electron');
```

**修改`main.js`文件**

修改创建浏览器的入口代码,添加`preload`配置项。将`renderer.js`作为预加载文件

```js
win = new BrowserWindow({
  width: 800,
  height: 600,
  autoHideMenuBar: true,
  fullscreenable: false,
  webPreferences: {
    javascript: true,
    plugins: true,
    nodeIntegration: false, // 不集成 Nodejs
    webSecurity: false,
    preload: path.join(_dirname, './public/renderer.js'), // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
  },
});
```

**修改`piblic/index.html`文件**

在`<div id="root"></div>`前引入`renderer.js`文件

```html
<script>
  require('./renderer.js');
</script>
<div id="root"></div>
```

**在 React 组件中如下使用`electron`**

```js
const electron = window.electron;
```
