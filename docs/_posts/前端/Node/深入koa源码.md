---
title: 深入koa源码
date: 2020-11-30
draft: true
---

# Koa 源码

## 架构设计

koa 的实现都在仓库的`lib`目录下，如下图所示，只有 4 个文件：

![](https://static.godbmw.com/img/2019-06-18-deep-in-koa/1.png)

对于这四个文件，根据用途和封装逻辑，可以分为 3 类：req 和 res，上下文以及 application。

### req 和 res

对应的文件是：`request.js` 和 `response.js`。分别代表着客户端请求信息和服务端返回信息。

这两个文件在实现逻辑上完全一致。对外暴露都是一个对象，对象上的属性都使用了`getter`或`setter`来实现读写控制。

### 上下文

对应的文件是：`context.js`。存了运行环境的上下文信息，例如`cookies`。

除此之外，因为`request`和`response`都属于上下文信息，所以通过`delegate.js`库来实现了对`request.js`和`response.js`上所有属性的代理。例如以下代码：

```js
/**
 * Response delegation.
 */
delegate(proto, 'response')
  .method('attachment')
  .method('redirect');

/**
 * Request delegation.
 */

delegate(proto, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings');
```

使用代理的另外一个好处就是：更方便的访问 req 和 res 上的属性。比如在开发 koa 应用的时候，可以通过`ctx.headers`来读取客户端请求的头部信息，不需要写成`ctx.res.headers`了（这样写没错）。

**注意**：req 和 res 并不是在`context.js`中被绑定到上下文的，而是在`application`被绑定到上下文变量`ctx`中的。原因是因为每个请求的 req/res 都不是相同的。

### Application

对应的文件是: `application.js`。这个文件的逻辑是最重要的，它的作用主要是：

- 给用户暴露服务启动接口
- 针对每个请求，生成新的上下文
- 处理中间件，将其串联

#### 对外暴露接口

使用 koa 时候，我们常通过`listen`或者`callback`来启动服务器：

```js
const app = new Koa();
app.listen(3000); // listen启动
http.createServer(app.callback()).listen(3000); // callback启动
```

这两种启动方法是完全等价的。因为`listen`方法内部，就调用了`callback`，并且将它传给`http.createServer`。接着看一下`callback`这个方法主要做了什么：

1. 调用`koa-compose`将中间件串联起来（下文再讲）。
2. 生成传给`http.createServer()`的函数，并且返回。

- `http.createServer`传给函数参数的请求信息和返回信息，都被这个函数拿到了。并且传给`createContext`方法，生成本次请求的上下文。
- 将生成的上下文传给第 1 步生成的中间件调用链，**这就是为什么我们在中间件处理逻辑的时候能够访问`ctx`**

#### 生成新的上下文

这里上下文的方法对应的是`createContext`方法。这里我觉得更像语法糖，是为了让 koa 使用者使用更方便。比如以下这段代码：

```js
// this.request 是 request.js 暴露出来的对象，将其引用保存在context.request中
// 用户可以直接通过 ctx.属性名 来访问对应属性
const request = (context.request = Object.create(this.request));

// 这个req是本次请求信息，是由 http.createServer 传递给回调函数的
context.req = request.req = response.req = req;
```

读到这里，虽然可以解释 `context.headers` 是 `context.request.headers` 的语法糖这类问题。但是感觉怪怪的。就以这个例子，context.headers 访问的是 context.request 上的 headers，而不是本次请求信息上的`headers`。本次请求信息挂在了`context.req`上。

让我们再回到`reqeust.js`的源码，看到了`headers`的 getter 实现：

```js
get headers() {
  return this.req.headers;
}
```

所以，`context.request.headers` 就是 `context.request.req.headers`。而前面提及的`createContext`方法中的逻辑，`context.reqest`上的`req`属性就是由`http`模块函数传来的真实请求信息。 **感谢 [@theniceangel](https://github.com/theniceangel) 的评论指正**。

可以看到，koa 为了让开发者使用方便，在上下文上做了很多工作。

#### 中间件机制

中间件的设计是 koa 最重要的部分，实现上用到了`koa-compose`库来串联中间件，形成“洋葱模型”。关于这个库，放在第二篇关于 koa 核心库的介绍中说明。

application 中处理中间件的函数是`use`和`handleRequest`：

- `use`函数：传入`async/await`函数，并将其放入 application 实例上的`middleware`数组中。如果传入是 generator，会调用`koa-conver`库将其转化为`async/await`函数。
- `handleRequest(ctx, fnMiddleware)`函数：传入的`fnMiddleware`是已经串联好的中间件，函数所做的工作就是再其后再添加一个返回给客户端的函数和错误处理函数。返回给客户端的函数其实就是`respond`函数，里面通过调用`res.end()`来向客户端返回信息，整个流程就走完了。

## 核心库原理

### is-generator-function：判断 generator

koa2 种推荐使用 async 函数，koa1 推荐的是 generator。koa2 为了兼容，在调用`use`添加中间件的时候，会判断是否是 generator。如果是，则用`covert`库转化为 async 函数。

判断是不是 generator 的逻辑写在了 [is-generator-function](https://github.com/ljharb/is-generator-function) 库中，逻辑非常简单，通过判断`Object.prototype.toString.call` 的返回结果即可：

```js
function* say() {}
Object.prototype.toString.call(say); // 输出: [object GeneratorFunction]
```

### delegates：属性代理

[delegates](https://github.com/tj/node-delegates)和 koa 一样，这个库都是出自大佬 TJ 之手。它的作用就是属性代理。这个代理库常用的方法有`getter`，`setter`，`method` 和 `access`。

#### 用法

假设准备了一个对象`target`，为了方便访问其上`request`属性的内容，对`request`进行代理：

```js
const delegates = require('delegates');
const target = {
  request: {
    name: 'xintan',
    say: function() {
      console.log('Hello');
    },
  },
};

delegates(target, 'request')
  .getter('name')
  .setter('name')
  .method('say');
```

代理后，访问`request`将会更加方便：

```js
console.log(target.name); // xintan
target.name = 'xintan!!!';
console.log(target.name); // xintan!!!
target.say(); // Hello
```

#### 实现

对于 `setter` 和 `getter`方法，是通过调用对象上的 `__defineSetter__` 和 `__defineGetter__` 来实现的。下面是单独拿出来的逻辑：

```js
/**
 * @param {Object} proto 被代理对象
 * @param {String} property 被代理对象上的被代理属性
 * @param {String} name
 */
function myDelegates(proto, property, name) {
  proto.__defineGetter__(name, function() {
    return proto[property][name];
  });
  proto.__defineSetter__(name, function(val) {
    return (proto[property][name] = val);
  });
}

myDelegates(target, 'request', 'name');
console.log(target.name); // xintan
target.name = 'xintan!!!';
console.log(target.name); // xintan!!!
```

刚开始我的想法是更简单一些，就是直接让 `proto[name] = proto[property][name]`。但这样做有个缺点无法弥补，就是之后如果`proto[property][name]`改变，`proto[name]`获取不了最新的值。

对于`method`方法，实现上是在对象上创建了新属性，属性值是一个函数。这个函数调用的就是代理目标的函数。下面是单独拿出来的逻辑：

```js
/**
 *
 * @param {Object} proto 被代理对象
 * @param {String} property 被代理对象上的被代理属性
 * @param {String} method 函数名
 */
function myDelegates(proto, property, method) {
  proto[method] = function() {
    return proto[property][method].apply(proto[property], arguments);
  };
}

myDelegates(target, 'request', 'say');
target.say(); // Hello
```

因为是“代理”，所以这里不能修改上下文环境。`proto[property][method]`的上下文环境是 `proto[property]` ，需要`apply`重新指定。

koa 中也有对属性的`access`方法代理，这个方法就是`getter`和`setter`写在一起的语法糖。

### koa-compose：洋葱模型

#### 模拟洋葱模型

**koa 最让人惊艳的就是大名鼎鼎的“洋葱模型”**。以至于之前我在开发 koa 中间件的时候，一直有种 magic 的方法。经常疑惑，这里`await next()`，执行完之后的中间件又会重新回来继续执行未执行的逻辑。

这一段逻辑封装在了核心库[koa-compose](https://github.com/koajs/compose) 里面。源码也很简单，算上各种注释只有不到 50 行。为了方便说明和理解，我把其中一些意外情况检查的代码去掉：

```js
function compose(middleware) {
  return function(context) {
    return dispatch(0);

    function dispatch(i) {
      let fn = middleware[i];
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```

middleware 里面保存的就是开发者自定义的中间件处理逻辑。为了方便说明，我准备了 2 个中间件函数：

```js
const middleware = [
  async (ctx, next) => {
    console.log('a');
    await next();
    console.log('c');
  },

  async (ctx, next) => {
    console.log('b');
  },
];
```

现在，模拟在 koa 中对 compose 函数的调用，我们希望程序的输出是：`a b c`（正如使用 koa 那样）。运行以下代码即可：

```js
const fns = compose(middleware);
fns();
```

ok，目前已经模拟出来了一个不考虑异常情况的洋葱模型了。

#### 为什么会这样？

为什么会有洋葱穿透的的效果呢？回到上述的`compose`函数，闭包写法返回了一个新的函数，其实就是返回内部定义的`dispatch`函数。其中，参数的含义分别是：

- i: 当前执行到的中间件在所有中间件中的下标
- context: 上下文环境。所以我们在每个中间件中都可以访问到当前请求的信息。

在上面的测试用例中，`fns()` 其实就是 `dispatch(0)`。在`dispatch`函数中，通过参数 i 拿到了当前要运行的中间件`fn`。

然后，将当前请求的上下文环境(context)和 dispatch 处理的下一个中间件(next)，都传递给当前中间件。对应的代码段是：

```js
return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
```

那么，在中间件中执行 `await next()`，其实就是执行：`await dispatch.bind(null, i + 1)`。因此看起来，当前中间件会停止自己的逻辑，先处理下一个中间件的逻辑。

因为每个`dispatch`，都返回新的 Promsise。所以`async`会等到 Promise 状态改变后再回来继续执行自己的逻辑。

#### async/await 改写

最后，在不考虑 koa 的上下文环境的情况下，用 async/await 的提炼出了 compose 函数：

```js
function compose(middleware) {
  return dispatch(0);

  async function dispatch(i) {
    let fn = middleware[i];
    try {
      await fn(dispatch.bind(null, i + 1));
    } catch (err) {
      return err;
    }
  }
}
```

下面是它的使用方法：

```js
const middleware = [
  async next => {
    console.log('a');
    await next();
    console.log('c');
  },

  async next => {
    console.log('b');
  },
];

compose(middleware); // 输出a b c
```

## 手动实现玩具版 koa

### 准备

在开始前，安装一下需要用到的库：

```sh
npm install --save koa-compose koa-convert is-generator-function
```

### 测试文件

为了说明效果，先按照正常使用 koa 的逻辑编写了测试文件。当启动它的时候，它的预期行为是：

- 监听 3000 端口
- 加载中间件
- 浏览器访问`localhost:3000`，屏幕打印`hello`
- 服务器的控制台依次输出：1inner => 2innter => 2outer => 1outer

代码如下：

```js
const Koa = require('./lib/application');

const server = new Koa();

async function middleware1(ctx, next) {
  console.log('1 inner');
  await next();
  console.log('1 outer');
}

async function middleware2(ctx, next) {
  ctx.res.body = 'hello';
  console.log('2 inner');
  await next();
  console.log('2 outer');
}

server.use(middleware1);
server.use(middleware2);

server.listen(3000);
```

### 玩具 koa

只准备了一个文件，跑通上面的逻辑即可。文件是 `lib/application.js` 。

#### 构造函数

首先对外暴露的就是一个继承 Emitter 的 Application 类。整体框架如下：

```js
const http = require('http');
const Emitter = require('events');
const compose = require('koa-compose');

module.exports = class Application extends Emitter {
  constructor() {
    super();

    this.middleware = []; // 中间件
    this.context = {}; // 上下文
    this.request = {}; // 请求信息
    this.response = {}; // 返回信息
  }

  listen(...args) {}

  use(fn) {}

  callback() {}

  handleRequest(ctx, fnMiddleware) {}

  createContext(req, res) {}

  onerror(error) {
    console.log(`error occurs: ${error.message}`);
  }
};
```

继承 Emitter 事件类，是为了方便监听和处理报错。

#### use

将外面传入的中间件保存起来：

```js
use (fn) {
  this.middleware.push(fn)
  return this
}
```

#### createContext

主要用于创建上下文。外面可以通过访问 ctx 上的 req/res 拿到请求或者返回信息。

```js
createContext (req, res) {
  const context = Object.create(this.context)
  context.request = Object.create(this.request)
  context.response = Object.create(this.response)
  context.req = req
  context.res = res

  context.app = this
  context.state = {}

  return context
}
```

#### listen 和 callback

监听端口，启动服务器：

```js
listen (...args) {
  const server = http.createServer(this.callback())
  return server.listen(...args)
},
callback () {
  const fn = compose(this.middleware)
  this.on('error', this.onerror)

  return (req, res) => {
    const ctx = this.createContext(req, res)
    return this.handleRequest(ctx, fn)
  }
}
```

#### handleRequest

在 `callback` 方法中真是返回的内容，它的作用就是：处理请求，并且返回给客户端。

```js
handleRequest(ctx, fnMiddleware) {
  const res = ctx.res
  // res.statusCode = 404
  const handleResponse = () => {
    res.end(res.body)
  }

  return fnMiddleware(ctx)
    .then(handleResponse)
    .catch(this.onerror)
}
```

### 效果截图

启动 index.js 后，在浏览器访问本地 3000 端口：

![](https://static.godbmw.com/img/2019-06-21-deep-in-koa-3/1.png)

回到控制台，查看中间件的输出顺序是否正确：

![](https://static.godbmw.com/img/2019-06-21-deep-in-koa-3/2.png)
