---
title: '【翻译】使用 Vercel 处理 Node.js 的请求体'
date: '2020-08-16'
category: 翻译
tags:
  - Vercel
  - serverless
---

# 使用 Vercel 处理 Node.js 的请求体

在使用 Vercel 部署的 Serverless 函数中解析 Node.js 的请求体。

在本篇指南中，我们将向你展示如何在使用 [Vercel](https://vercel.com/) 部署的 [Serverless 函数](https://vercel.com/docs/v2/serverless-functions/introduction)中解析一个 [Node.js 的请求体](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/)， 而不需要额外导入一个框架，例如 Express。

本篇指南假设请求发送时携带有值是 [`application/json`](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON) 的 [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) 的请求头。但是，如果需要的话，可以解析更多的内容类型（其他的 `Content-Type`）。

## [步骤 1: 创建一个函数](https://vercel.com/guides/handling-node-request-body#step-1:-creating-the-function)

首先，创建一个项目目录，并在其里面创建一个 `/api` 目录， 接着再 `cd` 进去：

```shell
mkdir req-body && mkdir req-body/api
```

在 `/req-body` 项目内部创建一个 `/api` 目录。

```shell
cd req-body
```

进入 `/req-body` 项目目录。

为了说明请求体的解析，请使用以下代码在您的 `/api` 目录中创建一个 `index.js` 文件

```js
module.exports = async (req, res) => {
  const { body } = req
  res.send(`Hello ${body.name}, you just parsed the request body!`)
}
```

这是一个通过使用带有[Helper 属性](https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers) 的 [Node.js](https://nodejs.org/dist/latest-v12.x/docs/api/) 解析请求体的示例。

这个函数接受一个 POST 请求，解析请求体，并在响应中使用来自请求体的数据。

这里的关键部分是第 2 行。[Vercel](https://vercel.com/) 添加了许多类似 Express 的 [helper properties](https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers)，使使用 Node.js 的更加容易。

**NOTE:** 您可以在[博客](https://vercel.com/blog/now-node-helpers) 或者 [文档](https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers) 阅读更多有关 [helper 属性](https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers)。

使用`req.body`的帮助器，将自动解析传入的`request`，从而无需第三方库或其他代码来处理 `request` 正常抵达时候的默认格式 [ReadableStream](https://nodejs.org/api/stream.html#stream_class_stream_readable)。

## [步骤 2: 部署函数](https://vercel.com/guides/handling-node-request-body#step-2:-deploying-the-function)

用一个命令就可以部署您的函数到 [Vercel](https://vercel.com/)：

```
vercel
```

使用`vercel`命令部署应用。现在您已经创建并部署了项目，剩下要做的就是测试它是否有效。

## [步骤 3: 发送请求](https://vercel.com/guides/handling-node-request-body#step-3:-sending-the-request)

要验证是否正确解析了 JSON，请通过在终端内执行以下代码，使用 [curl](https://curl.haxx.se/) 向新部署发出 POST 请求：

```bash
curl -X POST "https://your-deployments-url.now.sh/api" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Reader"
}'
```

使用 [curl](https://curl.haxx.se/) 发出 POST 请求

**NOTE:** 这里您应该更换成您自己刚刚部署的 URL ，使其与在 Vercel CLI 中为您的部署提供的 URL 匹配。

您将收到类似于以下的回复:

```
Hello Reader, you just parsed the request body!
```

发出 POST 请求的示例响应

恭喜，现在您知道如何在 [Vercel](https://vercel.com/) 使用 Node.js 解析请求请求体了。

## [最后: 理解它是如何工作的](https://vercel.com/guides/handling-node-request-body#bonus:-understanding-why-this-works)

当 [Node.js](https://nodejs.org/docs/latest-v8.x/api/) 接收到一个请求，请求体（返回体）是 [ReadableStream](https://nodejs.org/api/stream.html#stream_class_stream_readable) 格式的。

要从 `Stream` 中获取数据，您需要监听其 `data` 和 `end` 事件。要做到这一点，需要几行代码，而您更希望不要重复。

您可以通过使用 [helper 属性](https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers) 直接访问请求体中的数据， 因为它已经为您解析了请求体。
