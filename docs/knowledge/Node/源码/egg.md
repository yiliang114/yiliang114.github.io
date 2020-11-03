---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# egg

### Object.assign()

`Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

### curl

直接在 curl 命令后加上网址，就可以看到网页源码。

```
　$ curl www.sina.com
　
　　<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
　　<html><head>
　　<title>301 Moved Permanently</title>
　　</head><body>
　　<h1>Moved Permanently</h1>
　　<p>The document has moved <a href="http://www.sina.com.cn/">here</a>.</p>
　　</body></html>
```

### curl 的一个坑

默认 curl 请求的结果是 buffer， 此时 如果不转化为 json 格式的话， curl 命令请求会下载这个 buffer 自动转化为一个 txt 文件，而 web 端不会请求新内容。

解决这个问题的办法是将 buffer 使用 `JSON.parse(buffer)`转化为 json 格式，页面就能正常显示请求 api 返回的结果。

### router

#### 非 restful api

路由不能有多级。

```
router.get('api/sendUserInfo', controller.user.sendUserInfo);
```

这样的路由设计，当访问`localhost:7001/api/sendUserInfo`的时候 会 404， 因为无法找到对应的路由？？？

目前看到正确的 router 写法：

```
router.get('/sendUserInfo', controller.user.sendUserInfo);
```

#### restful api

```
router.resources('user', '/api/v2/user', controller.user);
```

get/post/put/delete … 对应数据库不同的操作，但是具体的映射关系是怎么样的，我还没很懂？？？

#### uuid

unique identifier 惟一标识符 -->> uid

在项目开发中我们常需要给某些数据定义一个唯一标识符，便于寻找，关联。

node-uuid 模块很好的提供了这个功能。

<https://github.com/broofa/node-uuid/>

使用起来很简单，两种：

1、uuid.v1(); -->基于时间戳生成 （time-based）

2、uuid.v4(); -->随机生成 (random)

通常我们使用基于时间戳 v1() 生成的 UID，随机生成 v4() 还是有一定几率重复的。

```
eg:
    var UUID = require('uuid');
    var ID = UUID.v1();
```

#### csrf 跨域

```
missing csrf token. See https://eggjs.org/zh-cn/core/security.html#安全威胁csrf的防范
```

```
在config.default.js中修改
module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '';

  // add your config here
  config.security = {
    csrf: {
      enable: false,
    },
  };
  return config;
};
```

#### request

```
wx.request({
  url: 'test.php', //仅为示例，并非真实的接口地址
  data: {
     x: '' ,
     y: ''
  },
  header: {
      'content-type': 'application/json' // 默认值
  },
  success: function(res) {
    console.log(res.data)
  }
})
```

按照文档,肯定是这么写.那就入坑了.

1. 'Content-Type': 'application/json'用在 get 请求中没问题.

POST 请求就不好使了.需要改成: "Content-Type": "application/x-www-form-urlencoded"

将 content-type 修改为小写后,post 请求成功.

### api 设计

感觉 service 应该更接近与原子性，service 中的每一个方法都对应一个原子操作，而那些需要请求复杂数据的请求，我认为应该在一个 controller 中 调用多个 service 操作，最后将数据在 controller 中组合，再返回给用户。

### 开源项目

https://github.com/eggjs/awesome-egg

基于 egg 的上层框架:
https://github.com/alibaba/beidou
