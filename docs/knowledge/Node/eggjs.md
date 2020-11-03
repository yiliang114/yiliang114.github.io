---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# eggjs

### 基础

#### 编写 Controller

nodejs 中通过 Router 将用户的请求基于 method 和 url 分发到了对应的 controller 上。简单说，controller 负责解析用户的输入。

eggjs 框架推荐 Controller 层主要对用户的请求参数进行处理（校验、转换），然后调用 service 方法处理业务，得到业务结果后封装并返回。

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

eggjs 框架中内置的一些基础对象。

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

Context 是一个请求级别的对象，继承自 Koa.Context 。在每一次收到用户请求时，框架会实例化一个 Context 对象，这个对象封装了这次用户的请求信息，并提供了许多便捷的方法来获取请求参数或者设置响应信息。框架会将所有的  [Service](http://eggjs.org/zh-cn/basics/service.html)  挂载到 Context 实例上 `ctx.service.posts.refresh()`，一些插件也会将一些其他的方法和对象挂载到它上面（[egg-sequelize](https://github.com/eggjs/egg-sequelize)  会将所有的 model 挂载在 Context 上）。

##### 获取方式

最常见的 Context 实例获取方式是在  [Middleware](http://eggjs.org/zh-cn/basics/middleware.html), [Controller](http://eggjs.org/zh-cn/basics/controller.html)  以及  [Service](http://eggjs.org/zh-cn/basics/service.html)  中。在 Service 中获取和 Controller 中获取的方式一样。在 Middleware 中获取 Context 实例则和  [Koa](http://koajs.com/)  框架在中间件中获取 Context 对象的方式一致。

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

框架提供了一个 Controller 基类，并推荐所有的 [Controller](http://eggjs.org/zh-cn/basics/controller.html) 都继承于该基类实现。这个 Controller 基类有下列属性：

- `ctx` - 当前请求的 [Context](http://eggjs.org/zh-cn/basics/objects.html#context) 实例。
- `app` - 应用的 [Application](http://eggjs.org/zh-cn/basics/objects.html#application) 实例。
- `config` - 应用的[配置](http://eggjs.org/zh-cn/basics/config.html)。
- `service` - 应用所有的 [service](http://eggjs.org/zh-cn/basics/service.html)。
- `logger` - 为当前 controller 封装的 logger 对象。

### egg 后台项目模板
