---
title: '【源码解析】koa 源码阅读'
date: '2020-09-03'
draft: true
---

# 【源码解析】koa 源码阅读

## 简易版的 koa

```js
const http = require('http');

class Context {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }
}

function compose(middleware) {
  return ctx => {
    const dispatch = i => {
      const fn = middleware[i];
      if (i === middleware.length) {
        // 没有要执行的中间件了
        return Promise.resolve();
      }
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    };
    return dispatch(0);
  };
}

class Application {
  constructor() {
    this.middleware = [];
  }
  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
  callback() {
    return async (req, res) => {
      const ctx = new Context(req, res);
      const fn = compose(this.middleware);
      try {
        await fn(ctx);
      } catch (e) {
        console.error(e);
        ctx.res.statusCode = 500;
        ctx.res.end('Internel Server Error');
      }
      ctx.res.end(ctx.body);
    };
  }
  use(fn) {
    this.middleware.push(fn);
  }
}

module.exports = Application;
```

#### test

```js
const Koa = require('./koa');

const app = new Koa();

app.use(async (ctx, next) => {
  console.log('middleware 1 start');
  await next();
  console.log('middleware 1 end');
});

app.use(async (ctx, next) => {
  console.log('middleware 2 start');
  await next();
  console.log('middleware 2 end');
});

app.use(async (ctx, next) => {
  console.log('middleware 3 start');
  await next();
  console.log('middleware 3 end');
  ctx.body = 'hello, world';
});

app.listen(3000);
```
