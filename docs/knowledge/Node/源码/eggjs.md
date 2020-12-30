---
title: EggJS
date: '2020-10-26'
draft: true
---

# EggJS

### 基础

#### 编写 Controller

nodejs 中通过 Router 将用户的请求基于 method 和 url 分发到了对应的 controller 上。简单说，controller 负责解析用户的输入。

EggJS 框架推荐 Controller 层主要对用户的请求参数进行处理（校验、转换），然后调用 service 方法处理业务，得到业务结果后封装并返回。

### 目录

```
egg-project
├── package.json
├── app.js (可选)
├── agent.js (可选)
├── app
|   ├── router.js
│   ├── controller
│   |   └── home.js
│   ├── service (可选)
│   |   └── user.js
│   ├── middleware (可选)
│   |   └── response_time.js
│   ├── schedule (可选)
│   |   └── my_task.js
│   ├── public (可选)
│   |   └── reset.css
│   ├── view (可选)
│   |   └── home.tpl
│   └── extend (可选)
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js (可选)
├── config
|   ├── plugin.js
|   ├── config.default.js
│   ├── config.prod.js
|   ├── config.test.js (可选)
|   ├── config.local.js (可选)
|   └── config.unittest.js (可选)
└── test
    ├── middleware
    |   └── response_time.test.js
    └── controller
        └── home.test.js
```

框架约定的目录：

- `app/router.js`  用于配置 URL 路由规则。
- `app/controller/**`  用于解析用户的输入，处理后返回相应的结果。具体通过 router.js 根据请求的 method 和 url 来分发到 controller 上。
- `app/service/**`  用于编写业务逻辑层。
- `app/middleware/**`  用于编写中间件。
- `app/public/**`  用于放置静态资源。
- `app/extend/**`  用于框架的扩展 ？？？
- `config/config.{env}.js`  用于编写配置文件，例如 mysql 配置，模板引擎的配置等。
- `config/plugin.js`  用于配置需要加载的插件。
- `test/**`  用于单元测试
- `app.js`  和  `agent.js`  用于自定义启动时的初始化工作 ？？？
- `app/public/**`  用于放置静态资源
- `app/schedule/**`  用于定时任务
- `app/view/**`  用于放置模板文件
- `app/model/**`  用于放置领域模型

### 框架内置对象

EggJS 框架中内置的一些基础对象。

包括从 koa 中继承而来的四个对象：

- Application
- Context
- Request
- Response

以及框架拓展的一些对象：

- Controller
- Service
- Helper
- Config
- Logger

#### Application

继承于 koa.Application ，用于挂载一些全局的方法和对象。app 对象全局只有一个，在应用启动的时候被创建。

##### 访问方式

- Controller 实例中直接使用`this.ctx.app`

- Controller, Middleware, Helper, Service 中可以通过 `this.app` 访问到 `Application` 对象。例如： `this.app.config`

- 在 `app.js` 中 `app` 对象会作为第一个参数注入到入口函数中

  ```
  // app.js
  module.exports = app => {
      // 使用 app 对象
  }
  ```

##### 扩展方式 todo

#### Context

Context 是一个请求级别的对象，继承自 Koa.Context 。在每一次收到用户请求时，框架会实例化一个 Context 对象，这个对象封装了这次用户的请求信息，并提供了许多便捷的方法来获取请求参数或者设置响应信息。框架会将所有的  [Service](http://EggJS.org/zh-cn/basics/service.html)  挂载到 Context 实例上 `ctx.service.posts.refresh()`，一些插件也会将一些其他的方法和对象挂载到它上面（[egg-sequelize](https://github.com/EggJS/egg-sequelize)  会将所有的 model 挂载在 Context 上）。

##### 获取方式

最常见的 Context 实例获取方式是在  [Middleware](http://EggJS.org/zh-cn/basics/middleware.html), [Controller](http://EggJS.org/zh-cn/basics/controller.html)  以及  [Service](http://EggJS.org/zh-cn/basics/service.html)  中。在 Service 中获取和 Controller 中获取的方式一样。在 Middleware 中获取 Context 实例则和  [Koa](http://koajs.com/)  框架在中间件中获取 Context 对象的方式一致。

#### Request & Response

##### 获取方式

可以在 Context 的实例上获取到当前请求的 Request(`ctx.request`) 和 Response(`ctx.response`) 实例。

```
// app/controller/user.js
class UserController extends Controller {
 async fetch() {
   const { app, ctx } = this;
   const id = ctx.request.query.id;
   ctx.response.body = app.cache.get(id);
 }
}

```

- 如上面例子中的 `ctx.request.query.id` 和 `ctx.query.id` 是等价的，`ctx.response.body=` 和 `ctx.body=` 是等价的。
- 需要注意的是，获取 POST 的 body 应该使用 `ctx.request.body`，而不是 `ctx.body`。

#### Controller

框架提供了一个 Controller 基类，并推荐所有的 [Controller](http://EggJS.org/zh-cn/basics/controller.html) 都继承于该基类实现。这个 Controller 基类有下列属性：

- `ctx` - 当前请求的 [Context](http://EggJS.org/zh-cn/basics/objects.html#context) 实例。
- `app` - 应用的 [Application](http://EggJS.org/zh-cn/basics/objects.html#application) 实例。
- `config` - 应用的[配置](http://EggJS.org/zh-cn/basics/config.html)。
- `service` - 应用所有的 [service](http://EggJS.org/zh-cn/basics/service.html)。
- `logger` - 为当前 controller 封装的 logger 对象。

### egg 后台项目模板

TODO:

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

1. uuid.v1(); -->基于时间戳生成 （time-based）

2. uuid.v4(); -->随机生成 (random)

通常我们使用基于时间戳 v1() 生成的 UID，随机生成 v4() 还是有一定几率重复的。

```
eg:
    var UUID = require('uuid');
    var ID = UUID.v1();
```

#### csrf 跨域

```
missing csrf token. See https://EggJS.org/zh-cn/core/security.html#安全威胁csrf的防范
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

https://github.com/EggJS/awesome-egg

基于 egg 的上层框架:
https://github.com/alibaba/beidou
