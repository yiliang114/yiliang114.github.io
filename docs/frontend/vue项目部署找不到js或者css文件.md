---
title: 'vue项目部署找不到js或者css文件'
date: '2020-03-14 17:06:38'
# permalink: "/pages/2226be53ab41bd60"
---

### vue 项目部署找不到 js css 文件

![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20190105154109600.png)
很多时候 `npm run build` 之后， `index.html` 文件中 webpack 自动插入的 js 文件 css 文件的相对目录总是不对，发布到服务器上之后，nginx 找不到文件。

#### vue-cli@3

在 vue-cli@3 中你需要为你 webpack 插入到 `index.html` 中 的所有文件添加一个 `baseUrl`. 你需要在项目的根目录新建一个 `vue.config.js`, 添加如下内容：

```js
...
module.exports = {
  baseUrl: isProd
    ? '/baseXXX/'
    : '/',
    ....
}
```

这里需要注意的是 dev 环境下不需要添加 `baseUrl` 。

#### vue-cli@2

针对 非 vue-cli@3 生成的项目，你如果不关心 webpack 里面是如何实现的，你只需要找到 `config/index.js` ， 修改其中的 `build` 中的 `assetsPublicPath` 即可。

为了验证一下是否可行，你可以本地 build 一下，然后查看 `dist/index.html` 中引用的 js css 文件的路径是否携带上你刚刚设置的 `assetsPublicPath` 即可。

而关心为啥这样设置就可以的同学们，继续看 `build/webpack.base.conf.js` 文件，
![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20190105153832561.png)

非 `production` mode 下，是在`config/index.js` 中设置的，这里的 `publicPath` 默认是
![在这里插入图片描述](https://chatflow-files-cdn-1256085166.file.myqcloud.com/20190105153930278.png)
