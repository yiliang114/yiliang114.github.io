---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

<!-- https://github.com/youngwind/blog/issues/113 -->

## Service Worker

PWA 之所以能离线，是 Service Worker 的功劳。Service Worker 是一个特殊的 Web Worker，独立于页面主线程运行，它能够拦截和处理网络请求，并且配合 Cache Storage API，开发者可以自由的对页面发 送的 HTTP 请求进行管理，这就是为什么 Service Worker 能让 Web 站点离线的原因。

Service Worker 的工作方式也衍生出了几种不同的请求控制策略，network First,cache First,network Only,cache Only 和 fastest，对于不同类型的请求， 我们应该采取不同的策略，静态文件，我们可以选择 cache First 或者 fastest，甚 至 cache Only，对于依赖后端数据的 AJAX 请求，我们应该选择 network First 或者 network Only，保证数据的实时性。
Service Worker 从在浏览器注册到进入工作状态和最终销毁会经历不同的阶 段，下图比较清楚的画出了 Service Worker 的生命周期。
在整个生命周期中，Service Worker 会抛出不同的事件，如 install,active,fetch 等，可以通过 self.addEventListener 来监听。
比如，监听网络请求事件，这里我们采用的策略是 cache First。

```js
// service-worker.js
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    }),
  );
});
```

这里只是简单的介绍了一下 Service Worker，详细的使用文档可以参考怎么 使用 Service Worker。Service Worker 它并不只是能够缓存离线文件，后台同步和 Web Push 都是依 赖于 Service Worker 工作的，因此它的重要性不言而喻。

#### PushNotification

Push Notification 其实是两个 API 的结合，Notification API 和 Push API。
Notification API 提供了开发者可以给用户发送通知的能力，包括申请显示 通知权限，发起通知，以及定制通知的类型等等。Notification API 的历史比较 早，最早可以追溯到 2010 年，2011 年纳入标准，时至今日，Notication API 已经获 得了大多数平台的支持，包括 Chrome、Edge、Firefox、Safari 等的支持，比较可 惜的是，iOS Safari 至今还不支持。
Push API，则是让服务器能够向用户发送离线消息，即使用户当前并没有 打开你的页面，甚至没有打开浏览器。浏览器在接到消息推送时，会唤醒对应的 Service Worker，并抛出 push 事件，开发者接收到事件之后调用 Notification API 弹出通知，这就完成了整个接受和展示的流程。

```js
// service-worker.js
self.addEventListener('push', event => {
  event.waitUntil(
    // Process the event and display a notification.
    self.registration.showNotification('Hey!'),
  );
});
self.addEventListener('notificationclick', event => {
  // Do something with the event
  event.notification.close();
});
self.addEventListener('notificationclose', event => {
  // Do something with the event
});
```

在之前的分享和文章中，很少提及 Web Push，这并不是因为它不重要，而 是因为它在国内被支持程度非常低，支持 Web Push 的成本比 App Manifest 或者 Service Worker 要高的多，它需要浏览器厂商提供消息推送服务，截止到本文截 稿，国内只有 UC 即将发布的 U2 内核的浏览器才支持 Web Push API，Chrome 也因为其 依赖的 FCM/GCM 无法访问而导致 Web Push 无法使用。
浏览器接收到离线消息需要完成两个过程:

1. 浏览器订阅通知;
2. 服务器发送通知。 浏览器订阅通知，是指开发者调用 API 在消息服务器注册，具体过程如下图
   所示，通过服务器提供的 Public Key 从浏览器获取 Push Subscription 对象，Push Subcription 包含浏览器对应的消息服务器的地址和一些密钥认证数据，将它发送 到服务器，服务器将这些数据存储，发送离线消息需要使用到这些数据。订阅通知 的过程就完成了。
   服务器发送通知，服务器用 Private Key 将消息加密发送到之前保存的 Push Subcription 中对应的消息服务器，消息服务器解密消息后将消息推送到用户的浏 览器，浏览器唤醒 Service Worker，这就完成了整个消息推送的过程。

除了 Web App Manifest、Service Worker、Push API 这三个关键的技术 外，PWA 还包含很多优化的准则，比如 PRPL 模式，App Shell 模型，Credential Management API，等等。PWA 不是某一种特定的技术，换句话来说，PWA 是采用各种技术达到站点用户体验非常好的 Web App。单单从技术上讲，已经能够很好地弥补 传统 Web 的劣势了。

#### PWA 开发门槛也在降低

为了降低 PWA 的开发门槛，业界也推出了相应的工具。
例如，百度推出的 Lavas 就是一个开源的命令行工具，可以通过它来快速创建 PWA 项目。它提供了多种常用的 APP Shell 给用户选择，降低了开发成本，也简化了 工作流程，让 PWA 项目变得易于管理。

### Service Worker

Service Worker 是运行在浏览器背后的**独立线程**，一般可以用来实现缓存功能。使用 Service Worker 的话，传输协议必须为 **HTTPS**。因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。

Service Worker 实现缓存功能一般分为三个步骤：首先需要先注册 Service Worker，然后监听到 `install` 事件以后就可以缓存需要的文件，那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去请求数据。以下是这个步骤的实现：

```js
// index.js
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('sw.js')
    .then(function(registration) {
      console.log('service worker 注册成功');
    })
    .catch(function(err) {
      console.log('servcie worker 注册失败');
    });
}
// sw.js
// 监听 `install` 事件，回调中缓存所需文件
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll(['./index.html', './index.js']);
    }),
  );
});

// 拦截所有请求事件
// 如果缓存中已经有请求的数据就直接用缓存，否则去请求数据
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        return response;
      }
      console.log('fetch source');
    }),
  );
});
```

打开页面，可以在开发者工具中的 `Application` 看到 Service Worker 已经启动了

![img](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/11/1626b1e8eba68e1c.jpg)

在 Cache 中也可以发现我们所需的文件已被缓存

![img](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/11/1626b20dfc4fcd26.jpg)

当我们重新刷新页面可以发现我们缓存的数据是从 Service Worker 中读取的

![img](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/11/1626b20e4f8f3257.jpg)

### Service Worker

Service Worker 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。使用 Service Worker 的话，传输协议必须为 HTTPS。因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。

Service Worker 实现缓存功能一般分为三个步骤：首先需要先注册 Service Worker，然后监听到 install 事件以后就可以缓存需要的文件，那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去请求数据。以下是这个步骤的实现：

```js
// index.js
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('sw.js')
    .then(function(registration) {
      console.log('service worker 注册成功');
    })
    .catch(function(err) {
      console.log('servcie worker 注册失败');
    });
}
// sw.js
// 监听 `install` 事件，回调中缓存所需文件
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll(['./index.html', './index.js']);
    }),
  );
});

// 拦截所有请求事件
// 如果缓存中已经有请求的数据就直接用缓存，否则去请求数据
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        return response;
      }
      console.log('fetch source');
    }),
  );
});
```

打开页面，可以在开发者工具中的 Application 看到 Service Worker 已经启动了
![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/serviceWorker.png)

在 Cache 中也可以发现我们所需的文件已被缓存
![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-worker.png)

当我们重新刷新页面可以发现我们缓存的数据是从 Service Worker 中读取的
![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/reload-worker.png)

### Service Worker

> Service workers 本质上充当 Web 应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们旨在（除其他之外）使得能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。他们还允许访问推送通知和后台同步 API

**目前该技术通常用来做缓存文件，提高首屏速度**

```js
// index.js
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('sw.js')
    .then(function(registration) {
      console.log('service worker 注册成功');
    })
    .catch(function(err) {
      console.log('servcie worker 注册失败');
    });
}
// sw.js
// 监听 `install` 事件，回调中缓存所需文件
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll(['./index.html', './index.js']);
    }),
  );
});

// 拦截所有请求事件
// 如果缓存中已经有请求的数据就直接用缓存，否则去请求数据
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        return response;
      }
      console.log('fetch source');
    }),
  );
});
```

> 打开页面，可以在开发者工具中的 Application 看到 Service Worker 已经启动了

![](https://user-gold-cdn.xitu.io/2018/3/28/1626b1e8eba68e1c?w=1770&h=722&f=png&s=192277)

> 在 Cache 中也可以发现我们所需的文件已被缓存

![](https://user-gold-cdn.xitu.io/2018/3/28/1626b20dfc4fcd26?w=1118&h=728&f=png&s=85610)

当我们重新刷新页面可以发现我们缓存的数据是从 Service Worker 中读取的

### ServiceWorker

ServiceWorker 是浏览器在后台独立于网页运行的脚本，也可以这样理解，它是浏览器和服务端之间的代理服务器。ServiceWorker 非常强大，可以实现包括推送通知和后台同步等功能，更多功能还在进一步扩展，但其最主要的功能是**实现离线缓存**。

#### 1\. 使用限制

越强大的东西往往越危险，所以浏览器对 ServiceWorker 做了很多限制：

- 在 ServiceWorker 中无法直接访问 DOM，但可以通过 postMessage 接口发送的消息来与其控制的页面进行通信；

- ServiceWorker 只能在本地环境下或 HTTPS 网站中使用；

- ServiceWorker 有作用域的限制，一个 ServiceWorker 脚本只能作用于当前路径及其子路径；

- 由于 ServiceWorker 属于实验性功能，所以兼容性方面会存在一些问题，具体兼容情况请看下面的截图。

![Drawing 3.png](https://s0.lgstatic.com/i/image/M00/31/43/Ciqc1F8MKYGAMRqhAACGt0bNhOM842.png)

ServiceWorker 在浏览器中的支持情况

#### 2\. 使用方法

在使用 ServiceWorker 脚本之前先要通过“注册”的方式加载它。常见的注册代码如下所示：

```js
if ('serviceWorker' in window.navigator) {
  window.navigator.serviceWorker
    .register('./sw.js')
    .then(console.log)
    .catch(console.error)
} else {
  console.warn('浏览器不支持 ServiceWorker!')

```

首先考虑到浏览器的兼容性，判断 window.navigator 中是否存在 serviceWorker 属性，然后通过调用这个属性的 register 函数来告诉浏览器 ServiceWorker 脚本的路径。

浏览器获取到 ServiceWorker 脚本之后会进行解析，解析完成会进行安装。可以通过监听 “install” 事件来监听安装，但这个事件只会在第一次加载脚本的时候触发。要让脚本能够监听浏览器的网络请求，还需要激活脚本。

在脚本被激活之后，我们就可以通过监听 fetch 事件来拦截请求并加载缓存的资源了。

下面是一个利用 ServiceWorker 内部的 caches 对象来缓存文件的示例代码。

```js
const CACHE_NAME = 'ws';
let preloadUrls = ['/index.css'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(preloadUrls);
    }),
  );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return caches
        .open(CACHE_NAME)
        .then(function(cache) {
          const path = event.request.url.replace(self.location.origin, '');
          return cache.add(path);
        })
        .catch(e => console.error(e));
    }),
  );
});
```

这段代码首先监听 install 事件，在回调函数中调用了 event.waitUntil() 函数并传入了一个 Promise 对象。event.waitUntil 用来监听多个异步操作，包括缓存打开和添加缓存路径。如果其中一个操作失败，则整个 ServiceWorker 启动失败。

然后监听了 fetch 事件，在回调函数内部调用了函数 event.respondWith() 并传入了一个 Promise 对象，当捕获到 fetch 请求时，会直接返回 event.respondWith 函数中 Promise 对象的结果。

在这个 Promise 对象中，我们通过 caches.match 来和当前请求对象进行匹配，如果匹配上则直接返回匹配的缓存结果，否则返回该请求结果并缓存。

### Service Worker 如何保证离线缓存资源更新

Service workers 基本上充当应用同服务器之间的代理服务器，可以用于拦截请求，也就意味着可以在离线环境下响应请求，从而提供更好的离线体验。同时，它还可以接收服务器推送和后台同步 API
[详解](https://www.jianshu.com/p/b14d76eb594e)

#### Web Worker 和 webSocket

> worker 主线程:

1. 通过 worker = new Worker( url ) 加载一个 JS 文件来创建一个 worker，同时返回一个 worker 实例。
2. 通过 worker.postMessage( data ) 方法来向 worker 发送数据。
3. 绑定 worker.onmessage 方法来接收 worker 发送过来的数据。
4. 可以使用 worker.terminate() 来终止一个 worker 的执行。

`WebSocket`是`Web`应用程序的传输协议，它提供了双向的，按序到达的数据流。他是一个`HTML5`协议，`WebSocket`的连接是持久的，他通过在客户端和服务器之间保持双工连接，服务器的更新可以被及时推送给客户端，而不需要客户端以一定时间间隔去轮询。

### Service Worker 离线缓存实战

#### 背景

Service Worker（以下简称“sw”）网站缓存，以实现离线状态下，网站仍然可以正常使用。

尤其对于个人博客这种以内容为主体的静态网站，离线访问和缓存优化尤其重要；并且 Ajax 交互较少，离线访问和缓存优化的实现壁垒因此较低。

#### 环境准备

虽然 sw 要求必须在 https 环境下才可以使用，但是为了方便开发者，通过`localhost`或者`127.0.0.1`也可以正常加载和使用。

利用 cnpm 下载`http-server`：`npm install http-server -g`

进入存放示例代码的文件目录，启动静态服务器：`http-server -p 80`

最后，准备下 html 代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <img src="./image.png" height="300" width="300" />
    <img
      src="https://user-gold-cdn.xitu.io/2017/10/4/50e8f96bbcb3bc644a083a409ce0ce2d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1"
    />
    <h3>一些提示信息sdfsf</h3>
    <ul>
      <li>浏览器是否支持：<span id="isSupport"></span></li>
      <li>service worker是否注册成功：<span id="isSuccess"></span></li>
      <li>当前注册状态：<span id="state"></span></li>
      <li>当前service worker状态：<span id="swState"></span></li>
    </ul>
    <script src="/script.js"></script>
  </body>
</html>
```

#### 注册 Service Worker

我们通过`script.js`来判断浏览器是否支持 serviceWorker，并且加载对应的代码。`script.js`内容如下：

```js
window.addEventListener('load', event => {
  // 判断浏览器是否支持
  if ('serviceWorker' in navigator) {
    console.log('支持');
    window.navigator.serviceWorker
      .register('/sw.js', {
        scope: '/',
      })
      .then(registration => {
        console.log('注册成功');
      })
      .catch(error => {
        console.log('注册失败', error.message);
      });
  } else {
    console.log('不支持');
  }
});
```

##### 注册时机

如上所示，最好在页面资源加载完成的事件(`window.onload`)之后注册 serviceWorker 线程。**因为 serviceWorker 也会浪费资源和网络 IO**，不能因为它而影响正常情况下（网络信号 ok 的情况）的使用体验。

##### 拦截作用域

之后，我们需要用 serviceWorker 线程来拦截资源请求，但不是所有的资源都能被拦截，**这主要是看 serviceWorker 的作用域：它只管理其路由和子路由下的资源文件**。

例如上面代码中，`/sw.js`是 serviceWorker 脚本，它拦截根路径下的所有静态资源。如果是`/static/sw.js`，就只拦截`/static/`下的静态资源。

开发者也可以通过传递`scope`参数，来指定作用域。

#### Service Worker 最佳实践

笔者爬了很久的坑，中途看了很多人的博客，包括张鑫旭老师的文章。但是实践的时候都出现了问题，直到读到了百度团队的文章才豁然开朗。

为了让`sw.js`的逻辑更清晰，这里仅仅展示最后总结出来的最优代码。如果想了解更多，可以跳到本章最后一个部分《参考链接》。

##### sw 的生命周期

对于 sw，它的生命周期有 3 个部分组成：install -> waiting -> activate。开发者常监听的生命周期是 install 和 activate。

这里需要注意的是：两个事件的回调监听函数的参数上都有`waitUntil`函数。**开发者传递到它的`promise`可以让浏览器了解什么时候此状态完成**。

如果难理解，可以看下面这段代码：

```js
const VERSION = 'v1';

self.addEventListener('install', event => {
  // ServiceWoker注册后，立即添加缓存文件，
  // 当缓存文件被添加完后，才从install -> waiting
  event.waitUntil(
    caches.open(VERSION).then(cache => {
      return cache.addAll(['./index.html', './image.png']);
    }),
  );
});
```

##### 更新 Service Worker 代码

对于缓存的更新，可以通过定义版本号的方式来标识，例如上方代码中的 VERSION 变量。但对于 ServiceWorker 本身的代码更新，需要别的机制。

简单来说，分为以下两步：

1. 在 install 阶段，调用 `self.skipWaiting()`  跳过 waiting 阶段，直接进入 activate 阶段
1. 在 activate 阶段，调用 `self.clients.claim()`  更新客户端 ServiceWorker

代码如下：

```js
const VERSION = 'v1';

// 添加缓存
self.addEventListener('install', event => {
  // 跳过 waiting 状态，然后会直接进入 activate 阶段
  event.waitUntil(self.skipWaiting());
});

// 缓存更新
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all([
        // 更新所有客户端 Service Worker
        self.clients.claim(),

        // 清理旧版本
        cacheNames.map(cacheName => {
          // 如果当前版本和缓存版本不一样
          if (cacheName !== VERSION) {
            return caches.delete(cacheName);
          }
        }),
      ]);
    }),
  );
});
```

##### 再探更新

上一部分说了更新 sw 的 2 个步骤，但是为什么这么做呢？

因为对于同一个 sw.js 文件，浏览器可以检测到它已经更新（假设旧代码是 sw1，新代码是 sw2）。由于 sw1 还在运行，以及默认只运行一个同名的 sw 代码，所以 sw2 处于 waiting 状态。**所以需要强制跳过 waiting 状态** 。

进入 activate 后，还需要取得“控制权”，并且弃用旧代码 sw1。上方的代码顺便清理了旧版本的缓存。

##### 资源拦截

在代码的最后，需要监听 `fetch`  事件，并且进行拦截。如果命中，返回缓存；如果未命中，放通请求，并且将请求后的资源缓存下来。

代码如下：

```js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 如果 Service Workder 有自己的返回
      if (response) {
        return response;
      }

      let request = event.request.clone();
      return fetch(request).then(httpRes => {
        // http请求的返回已被抓到，可以处置了。

        // 请求失败了，直接返回失败的结果就好了。。
        if (!httpRes || httpRes.status !== 200) {
          return httpRes;
        }

        // 请求成功的话，将请求缓存起来。
        let responseClone = httpRes.clone();
        caches.open(VERSION).then(cache => {
          cache.put(event.request, responseClone);
        });

        return httpRes;
      });
    }),
  );
});
```

#### 效果测试

启动服务后，进入 `localhost` ，打开 devtools 面板。可以看到资源都通过 ServiceWorker 缓存加载进来了。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/233327/1554261787790-8516ca44-1872-4e8d-b063-25dab02682b7.png#align=left&display=inline&height=364&name=image.png&originHeight=455&originWidth=1608&size=81057&status=done&width=1286)

现在，我们打开离线模式，

![image.png](https://cdn.nlark.com/yuque/0/2019/png/233327/1554261882352-6ef567ff-b6c7-4916-aa5c-89fbbfc9d68f.png#align=left&display=inline&height=520&name=image.png&originHeight=650&originWidth=907&size=62316&status=done&width=726)

离线模式下照样可以访问：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/233327/1554261936715-57129714-6312-4e72-8679-7563ff529b83.png#align=left&display=inline&height=725&name=image.png&originHeight=906&originWidth=1920&size=401854&status=done&width=1536)

最后，我们修改一下 html 的代码，并且更新一下 sw.js 中标识缓存版本的变量 VERSION：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/233327/1554262033555-b36bfb5a-16ee-4079-a400-b2239a93ee9c.png#align=left&display=inline&height=733&name=image.png&originHeight=916&originWidth=1920&size=285955&status=done&width=1536)

在第 2 次刷新后，通过上图可以看到，缓存版本内容已更新到 v2，并且左侧内容区已经被改变。

## Web Worker

### Web Worker 和 webSocket

> worker 主线程:

1. 通过 worker = new Worker( url ) 加载一个 JS 文件来创建一个 worker，同时返回一个 worker 实例。
2. 通过 worker.postMessage( data ) 方法来向 worker 发送数据。
3. 绑定 worker.onmessage 方法来接收 worker 发送过来的数据。
4. 可以使用 worker.terminate() 来终止一个 worker 的执行。

`WebSocket`是`Web`应用程序的传输协议，它提供了双向的，按序到达的数据流。他是一个`HTML5`协议，`WebSocket`的连接是持久的，他通过在客户端和服务器之间保持双工连接，服务器的更新可以被及时推送给客户端，而不需要客户端以一定时间间隔去轮询。

### Web Worker

现代浏览器为 JavaScript 创造的 多线程环境。可以新建并将部分任务分配到 worker 线程并行运行，两个线程可 独立运行，互不干扰，可通过自带的 消息机制 相互通信
用法：

```js
const worker = new Worker('work.js');

// 向主进程推送消息
worker.postMessage('Hello World');

// 监听主进程来的消息
worker.onmessage = function(event) {
  console.log('Received message ' + event.data);
};
```

限制：
同源限制
无法使用 document / window / alert / confirm
无法加载本地资源

### 简述 Web Worker

HTML5 则提出了 Web Worker 标准，表示 js 允许多线程，但是子线程完全受主线程控制并且不能操作 dom，只有主线程可以操作 dom，所以 js 本质上依然是单线程语言。
web worker 就是在 js 单线程执行的基础上开启一个子线程，进行程序处理，而不影响主线程的执行，当子线程执行完之后再回到主线程上，在这个过程中不影响主线程的执行。子线程与主线程之间提供了数据交互的接口 postMessage 和 onmessage，来进行数据发送和接收

```js
var worker = new Worker('./worker.js'); //创建一个子线程
worker.postMessage('Hello');
worker.onmessage = function(e) {
  console.log(e.data); //Hi
  worker.terminate(); //结束线程
};
//worker.js
onmessage = function(e) {
  console.log(e.data); //Hello
  postMessage('Hi'); //向主进程发送消息
};
```

### Web Worker 应用

- 处理密集型数学计算
- 大数据集排序
- 数据处理(压缩、音频分析、图像处理等)
- 高流量网络通信

### web worker 与多线程

现如今人们也意识到，单线程在保证了执行顺序的同时也限制了 javascript 的效率，因此开发出了 web worker 技术。这项技术号称让 javascript 成为一门多线程语言。

然而，使用 web worker 技术开的多线程有着诸多限制，例如：所有新线程都受主线程的完全控制，不能独立执行。这意味着这些“线程” 实际上应属于主线程的子线程。另外，这些子线程并没有执行 I/O 操作的权限，只能为主线程分担一些诸如计算等任务。所以严格来讲这些线程并没有完整的功能，也因此这项技术并非改变了 javascript 语言的单线程本质。

可以预见，未来的 javascript 也会一直是一门单线程的语言。

### 写一个简易的 WebServer

一个简易的 Server 的流程如下：

- 1.建立连接，接受一个客户端连接。
- 2.接受请求，从网络中读取一条 HTTP 请求报文。
- 3.处理请求，访问资源。
- 4.构建响应，创建带有 header 的 HTTP 响应报文。
- 5.发送响应，传给客户端。

省略流程 3，大体的程序与调用的函数逻辑如下：

- socket() 创建套接字
- bind() 分配套接字地址
- listen() 等待连接请求
- accept() 允许连接请求
- read()/write() 数据交换
- close() 关闭连接
