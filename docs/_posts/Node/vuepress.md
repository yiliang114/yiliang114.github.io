---
title: Vuepress
date: '2020-10-26'
draft: true
---

## Vuepress

VuePress 项目启动和编译打包是执行 `vuepress dev docs` 和 `vuepress build docs` 两个命令。

### 问题

1. 同时显示代码和效果的组件
2. 组件中如果有 window 之类的浏览器 API 的话，会编译失败。 通过 import 动态引入组件的方式，解决这个问题。

### 0.1.0

- [globby](https://www.npmjs.com/package/globby) 扫描文件，获取文件目录
- [chokidar](https://github.com/paulmillr/chokidar) 监听文件、文件夹改动，触发回调事件
- [yaml-front-matter](https://www.npmjs.com/package/yaml-front-matter) 提取传入的文本中的 yaml 或者 json 格式的内容，将配置内容转化为一个结果对象
- [portfinder](https://github.com/http-party/node-portfinder#readme) 获取一个可用的端口号

#### **1. prepare**

1.  _load options_ **resolveOptions** 加载配置文件
2.  _generate routes & user components registration code_ 自动生成路由

##### **resolveOptions**

1. 获取 vuepressDir 文件路径和 configPath 配置文件的路径
2. siteConfig 的 head 数组中，加入 description， 并为所有的 head 值，src 或者 href 加上 base 前缀
3. 用 **globby** 扫描文件夹，获取文件目录列表 pageFiles
4. 根据是否使用默认主题，加载主题的 Components， 主要是 Layout.vue 和 NotFound.vue 两个文件
5. 处理 pageFiles 中的每一个文件：
   1. 处理文件最终的路径，index 类的文件（readme.md） 处理成 `/`; 其余的文件会处理成 `文件名.html`
   2. 通过 `fs.readFileSync` 读取文件内容；
   3. 通过 `yaml-front-matter` 加载 md 文件顶部的 `yaml` 配置部分， 其余的内容都会保存在 `__content` s 这个属性里面。
   4. 根据提取的 `yaml` 配置内容获取 page 的 title 和 home 值， 如果没有的话，从 `__content` 中提取 `title` ，接着从 `__content` 中提取 `headers`， 也就是 md 中的 `h2` `h3` 标题。
   5. TODO: 最后需要将 `__content` 值给删除？

##### **genRoutesFile**

这一步会生成做了以下事情的代码：

循环上一步获得的 pages 数组，将每一项的 path 值组装处理，每一个文件都会在 route 的 beforeEnter 钩子中执行，先异步加载这个组件，加载完成之后注册这个组件，才进入页面。

这一步中 import 了一个叫 `Theme` 的组件，对应每一个文件（组件）所要加载的 Component， 路径是 `~theme`.

##### **genComponentRegistrationFile**

这一步会生成 将 `${sourceDir}/.vuepress/components` 文件夹下的所有组件都 import 进来并全局注册的代码。

#### 2. pagesWatcher and configWatcher

这两个 watcher 是通过 `chokidar` 来进行 watch 的，简单理解就是指定目标文件夹下有内容改变，就会重新执行 prepare 操作，也就是上面的扫描文件夹、内容全部会重新做一遍。 不过生成 code 之类的操作，应该会有缓存存储。

#### 3. webpack config

TODO: 移动图片

![image-20210604005758900](/Users/yiliang/Library/Application Support/typora-user-images/image-20210604005758900.png)

### Webpack Config

- webpack-chain 链式设置 webpack 的配置文件

**createBaseConfig** 函数返回的基本配置，主要设置了：

- output
- **filename**
- **publicPath**
- **devtool**
- 别名
- vue-loader
- babel-loader
- markdown-loader： 会先经过自定义的 markdownLoader 这个处理器，再经过 vue-loader 处理 TODO:
- url-loader file-loader 等处理 images 和 svg 等文件
- css-loader less-loader 相关的一些东西

**createClientConfig** 函数是在 **createBaseConfig** 函数返回的 **config** 基础之上做进一步的配置:

- 配置 **entry**
- merge siteConfig 中自定义配置的 **chainWebpack**

#### compiler 属性

- hooks 拥有 done 和 compilation 属性，用于监听事件，做对应的回调处理 TODO:

### Webpack 相关的包

- webpack：根据 webpack-chain 链式配置返回的对象 toConfig 函数执行的结果作为参数，创建一个 compiler 编译器
- webpack-serve：compiler 作为一个参数，并传入 port, host 之类的参数，启动一个服务，编译。
- webpack-merge: 合并多个 webpack 配置信息

```js
// 注册客户端入口
config.entry('app').add(path.resolve(__dirname, '../app/clientEntry.js'));
```

```js
// webpack 注入常量
config.plugin('injections').use(require('webpack/lib/DefinePlugin'), [
  {
    BASE_URL: JSON.stringify(siteConfig.base),
    GA_ID: siteConfig.ga ? JSON.stringify(siteConfig.ga) : false,
    SW_ENABLED: !!siteConfig.serviceWorker,
  },
]);
```

```js
// vue-router onReady 之后再挂载 app
router.onReady(() => {
  app.$mount('#app');

  // Register service worker
  if (process.env.NODE_ENV === 'production' && SW_ENABLED) {
    register(`${BASE_URL}service-worker.js`, {
      ready() {
        console.log('[vuepress:sw] Service worker is active.');
        app.$refs.layout.$emit('sw-ready');
      },
      cached() {
        console.log('[vuepress:sw] Content has been cached for offline use.');
        app.$refs.layout.$emit('sw-cached');
      },
      updated() {
        console.log('[vuepress:sw] Content updated.');
        app.$refs.layout.$emit('sw-updated');
      },
      offline() {
        console.log('[vuepress:sw] No internet connection found. App is running in offline mode.');
        app.$refs.layout.$emit('sw-offline');
      },
      error(err) {
        console.error('[vuepress:sw] Error during service worker registration:', err);
        app.$refs.layout.$emit('sw-error', err);
        if (GA_ID) {
          ga('send', 'exception', {
            exDescription: err.message,
            exFatal: false,
          });
        }
      },
    });
  }
});
```

- [register-service-worker](https://github.com/yyx990803/register-service-worker#readme)注册 service-worker 一些相关的钩子。

```js
// siteConfig.chainWebpack 的传参和处理

// siteConfig
module.exports = {
  chainWebpack: (config, isServer) => {
    // config is an instance of ChainableConfig
  },
};

// createClientConfig
// ...
if (options.siteConfig.chainWebpack) {
  options.siteConfig.chainWebpack(config, false /* isServer */);
}
// ...
```

### 0.5.0

- 添加了一个 eject 命令，用于弹出所有配置信息 ？TODO

```js
// TODO: config.plugin 只是注册个名字，使用中间件还是用的 use api ？
config
  .plugin('html')
  // using a fork of html-webpack-plugin to avoid it requiring webpack
  // internals from an incompatible version.
  .use(require('vuepress-html-webpack-plugin'), [
    {
      template: path.resolve(__dirname, 'app/index.dev.html'),
    },
  ]);
```

#### vuepress plugins

- vuepress-html-webpack-plugin 为了避免额外引入 webpack ？ fork 了 _html-webpack-plugin_

#### enhanceApp.js TODO

增加 App 的能力 ？

这个版本开始之后，开发者可以自己添加 enhanceApp.js 用来增强 App 的能力。

#### app 目录

- app.js 创建客户端 app 的文件，注册组件，混入 mixins ，new Router 并调用 enhanceApp 和 themeEnhanceApp 函数，用来增强 app 的能力 TODO. 最后创建 vue app 实例，最后返回。
- clientEntry.js 在 router onReady 回调里面挂载 app 实例到节点上。 如果是在生产模式下， 注册 service-worker

```js
// ClientOnly.js 在 markdown 中包裹只在浏览器端运行的组件
export default {
  functional: true,
  render(h, { parent, children }) {
    if (parent._isMounted) {
      return children;
    } else {
      parent.$once('hook:mounted', () => {
        parent.$forceUpdate();
      });
    }
  },
};
```

```js
// TODO: 为啥要额外监听 frontmatterEmitter
// also listen for frontmatter changes from markdown files
frontmatterEmitter.on('update', update);
```
