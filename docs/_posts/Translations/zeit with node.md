---
title: '【翻译】使用 Vercel 处理 Node.js 的请求体'
date: '2020-08-12'
draft: true
tags:
  - Vercel
  - serverless
---

# Handling Node.js Request Bodies with Vercel

Parse Node.js request bodies for use inside Serverless Functions deployed with Vercel.

In this guide, we will show you how to parse a [Node.js request body](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/), for use inside a [Serverless Function](https://vercel.com/docs/v2/serverless-functions/introduction) deployed to [Vercel](https://vercel.com/), without requiring a framework such as Express.

This guide assumes the request is sent with a [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) of [`application/json`](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON). However, many more content types can be parsed if required.

## [Step 1: Creating the Function](https://vercel.com/guides/handling-node-request-body#step-1:-creating-the-function)

To get started, create a project directory with an `/api` directory inside and `cd` into it:

```
mkdir req-body && mkdir req-body/api
```

Creating an `/api` directory inside of a `/req-body` project.

```
cd req-body
```

Moving into the `/req-body` project directory.

To illustrate the parsing of a request body, create an `index.js` file inside your `/api` directory with the following code:

```
module.exports = async (req, res) => {
  const { body } = req
  res.send(`Hello ${body.name}, you just parsed the request body!`)
}
```

An example of how to parse a request body using [Node.js](https://nodejs.org/dist/latest-v12.x/docs/api/) with a [Helper property](https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers).

This function takes a POST request, parses the body, and uses data from the body in the response.

The key part here is line 2. [Vercel](https://vercel.com/) adds a number of Express like [helper properties](https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers) to make wording with Node.js even easier.

**NOTE:** You can read more about [helper properties](https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers) either in the [blog post](https://vercel.com/blog/now-node-helpers) or in the [documentation](https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers).

With the `req.body` helper, the incoming `request` is parsed automatically, removing the need for third-party libraries or further code to handle the [ReadableStream](https://nodejs.org/api/stream.html#stream_class_stream_readable) format the `request` normally arrives in.

## [Step 2: Deploying the Function](https://vercel.com/guides/handling-node-request-body#step-2:-deploying-the-function)

Deploying your function to [Vercel](https://vercel.com/) can be done with a single command:

```
vercel
```

Deploying the app with the `vercel` command.

You have now created and deployed your project, all that's left to do is test that it works.

## [Step 3: Sending the Request](https://vercel.com/guides/handling-node-request-body#step-3:-sending-the-request)

To verify that the JSON is being parsed correctly, make a POST request to your new deployment using [curl](https://curl.haxx.se/) by executing the below code inside your terminal:

```bash
curl -X POST "https://your-deployments-url.now.sh/api" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Reader"
}'
```

Making a POST request using [curl](https://curl.haxx.se/).

**NOTE:** You should change the URL to match the one for your deployment given to you in the Vercel CLI.

You will receive a response similar to the following:

```
Hello Reader, you just parsed the request body!
```

An example response from making a POST request.

Congratulations, now you know how to parse request bodies with [Vercel](https://vercel.com/) in Node.js!

## [Bonus: Understanding Why this Works](https://vercel.com/guides/handling-node-request-body#bonus:-understanding-why-this-works)

When [Node.js](https://nodejs.org/docs/latest-v8.x/api/) receives a request, the [body](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#request-body) is in the format of a [ReadableStream](https://nodejs.org/api/stream.html#stream_class_stream_readable).

To get the data from the stream, you need to listen to its `data` and `end` events. To do this requires a few lines of code which you would much rather not have to repeat.

By using [helper properties](https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/node-js-helpers), the `request` is already parsed for you, allowing you to access the data
