---
layout: CustomPages
title: dva
date: 2020-11-21
aside: false
draft: true
---

# dva + react + antd

[入门](https://juejin.im/entry/5879a63c1b69e600582da314)

[快速构建](https://segmentfault.com/a/1190000008819650)

[入门](https://www.jianshu.com/p/69f13e9123d9)

[dva 入门：手把手教你写应用](https://github.com/sorrycc/blog/issues/8)

[从 0 开始实现 react 版本的 hackernews (基于 dva)](https://github.com/sorrycc/blog/issues/9)

[云谦博客](https://github.com/sorrycc/blog/issues)

[1](https://www.cnblogs.com/zhangbob/p/7421527.html)

[用 react+antd+dva 数据流框架写的 cnode 项目](https://cnodejs.org/topic/591d041eba8670562a40f235)

[12 步 30 分钟，完成用户管理的 CURD 应用 (react+dva+antd)](http://web.jobbole.com/89688/)

[[React+dva+webpack+antd-mobile 实战分享](https://segmentfault.com/a/1190000010002714)

[2](http://blog.csdn.net/qq_31655965/article/details/72716557)

[3](https://www.v2ex.com/t/373731)

[4](http://www.templatesy.com/Article/723.html)

安装

```
cnpm i -g dva-cli
dva -v
```

创建应用

```
dva new dva-quickstart
```

启动程序

```
cd dva-quickstart
npm start
```

使用 antd 框架

```
npm i --save antd babel-plugin-import
```

编辑`.roadhogrc.mock.js`, 是 babel-plugin-import （按需加载）插件生效

```
export default {
    "extraBabelPlugins" : [
        "transform-runtime",
        [
            "import", {
                "libraryName": "antd",
                "style": "css"
            }
        ]
    ]
};

```

定义路由

新建 route component: `routes/products.js`

[原文](https://www.cnblogs.com/yuanyuan0809/p/7171761.html)
