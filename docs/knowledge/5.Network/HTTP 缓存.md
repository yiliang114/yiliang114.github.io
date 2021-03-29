---
title: HTTP 缓存
date: '2020-10-26'
draft: true
---

## HTTP 缓存

浏览器缓存机制有两种，一种为强缓存，一种为协商缓存。

- 强缓存
  - 直接从浏览器缓存中读取，不去后台查询是否过期
  - `Expires` 过期时间
  - `Cache-Control:max-age=3600` 过期秒数
- 协商缓存
  - 每次使用缓存之前先去后台确认一下
  - `Last-Modified` `If-Modified-Since` 上次修改时间
  - `ETag` `If-None-Match`

对于强缓存，浏览器在第一次请求的时候，会直接下载资源，然后缓存在本地，第二次请求的时候，直接使用缓存。
对于协商缓存，第一次请求缓存且保存缓存标识与时间，重复请求向服务器发送缓存标识和最后缓存时间，服务端进行校验，如果失效则使用缓存。

#### 强缓存 200 from cached

Expires 值是时间点
Cache-Control 值是 max-age: xxx（优先级更高）

#### 协商缓存 304 Not Modified

Last-Modified
If-Modified-Since 值是二进制时间

或者

ETag
If-None-Match 值是 hash 唯一标识串

#### 为什么要有 ETag

`HTTP1.1` 中 `ETag` 的出现主要是为了解决几个 `Last-Modified` 比较难解决的问题：

- 一些文件也许会周期性的更改，但是内容并不改变(仅仅改变的修改时间)，这个时候我们并不希望客户端认为这个文件被修改了，而重新 GET；
- 某些文件修改非常频繁，比如在秒以下的时间内进行修改，(比方说 1s 内修改了 N 次)，`If-Modified-Since` 能检查到的粒度是秒级的，使用 `ETag` 就能够保证这种需求下客户端在 1 秒内能刷新 N 次 cache。
- 某些服务器不能精确的得到文件的最后修改时间。

### 强缓存

Expires：服务端的响应头，第一次请求的时候，告诉客户端，该资源什么时候会过期。Expires 的缺陷是必须保证服务端时间和客户端时间严格同步。
Cache-control：max-age，表示该资源多少时间后过期，解决了客户端和服务端时间必须同步的问题，

### 强制缓存

强制缓存就是向浏览器缓存查找该请求结果，并根据该结果的缓存规则来决定是否使用该缓存结果的过程，强制缓存的情况主要有三种(暂不分析协商缓存过程)，如下：

不存在该缓存结果和缓存标识，强制缓存失效，则直接向服务器发起请求（跟第一次发起请求一致），如下图：

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/force-cache.png)

存在该缓存结果和缓存标识，但该结果已失效，强制缓存失效，则使用协商缓存(暂不分析)，如下图

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/consult-cache.png)

存在该缓存结果和缓存标识，且该结果尚未失效，强制缓存生效，直接返回该结果，如下图

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/force-cache-use.png)

> 那么强制缓存的缓存规则是什么？

当浏览器向服务器发起请求时，服务器会将缓存规则放入 HTTP 响应报文的 HTTP 头中和请求结果一起返回给浏览器，控制强制缓存的字段分别是 Expires 和 Cache-Control，其中 Cache-Control 优先级比 Expires 高。

#### Expires

Expires 是 HTTP/1.0 控制网页缓存的字段，其值为服务器返回该请求结果缓存的到期时间，即再次发起该请求时，如果客户端的时间小于 Expires 的值时，直接使用缓存结果。

> Expires 是 HTTP/1.0 的字段，但是现在浏览器默认使用的是 HTTP/1.1，那么在 HTTP/1.1 中网页缓存还是否由 Expires 控制？

到了 HTTP/1.1，Expire 已经被 Cache-Control 替代，原因在于 Expires 控制缓存的原理是使用客户端的时间与服务端返回的时间做对比，那么如果客户端与服务端的时间因为某些原因（例如时区不同；客户端和服务端有一方的时间不准确）发生误差，那么强制缓存则会直接失效，这样的话强制缓存的存在则毫无意义，那么 Cache-Control 又是如何控制的呢？

#### Cache-Control

在 HTTP/1.1 中，Cache-Control 是最重要的规则，主要用于控制网页缓存，主要取值为：

- public：所有内容都将被缓存（客户端和代理服务器都可缓存）

- private：所有内容只有客户端可以缓存，Cache-Control 的默认取值

- no-cache：客户端缓存内容，但是是否使用缓存则需要经过协商缓存来验证决定

- no-store：所有内容都不会被缓存，即不使用强制缓存，也不使用协商缓存

- max-age=xxx (xxx is numeric)：缓存内容将在 xxx 秒后失效

接下来，我们直接看一个例子，如下：

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-demo.png)

由上面的例子我们可以知道：

- HTTP 响应报文中 expires 的时间值，是一个绝对值

- HTTP 响应报文中 Cache-Control 为 max-age=600，是相对值

由于 Cache-Control 的优先级比 expires 高，那么直接根据 Cache-Control 的值进行缓存，意思就是说在 600 秒内再次发起该请求，则会直接使用缓存结果，强制缓存生效。

注：在无法确定客户端的时间是否与服务端的时间同步的情况下，Cache-Control 相比于 expires 是更好的选择，所以同时存在时，只有 Cache-Control 生效。

#### from memory cache and from disk cache

在浏览器中，浏览器会在 js 和图片等文件解析执行后直接存入内存缓存中，那么当刷新页面时只需直接从内存缓存中读取(from memory cache)；而 css 文件则会存入硬盘文件中，所以每次渲染页面都需要从硬盘读取缓存(from disk cache)。

### 协商缓存

协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程，主要有以下两种情况：

协商缓存生效，返回 304，如下

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-consult-304.png)

协商缓存失效，返回 200 和请求结果结果，如下

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-200.png)

同样，协商缓存的标识也是在响应报文的 HTTP 头中和请求结果一起返回给浏览器的，控制协商缓存的字段分别有：Last-Modified / If-Modified-Since 和 ETag / If-None-Match，其中 ETag / If-None-Match 的优先级比 Last-Modified / If-Modified-Since 高。

If-None-Match/ETag：缓存标识，对比缓存时使用它来标识一个缓存，第一次请求的时候，服务端会返回该标识给客户端，客户端在第二次请求的时候会带上该标识与服务端进行对比并返回 If-None-Match 标识是否表示匹配。
Last-modified/If-Modified-Since：第一次请求的时候服务端返回 Last-modified 表明请求的资源上次的修改时间，第二次请求的时候客户端带上请求头 If-Modified-Since，表示资源上次的修改时间，服务端拿到这两个字段进行对比

#### Last-Modified / If-Modified-Since

Last-Modified 是服务器响应请求时，返回该资源文件在服务器最后被修改的时间，如下。

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-lastmodify.png)

If-Modified-Since 则是客户端再次发起该请求时，携带上次请求返回的 Last-Modified 值，通过此字段值告诉服务器该资源上次请求返回的最后被修改时间。服务器收到该请求，发现请求头含有 If-Modified-Since 字段，则会根据 If-Modified-Since 的字段值与该资源在服务器的最后被修改时间做对比，若服务器的资源最后被修改时间大于 If-Modified-Since 的字段值，则重新返回资源，状态码为 200；否则则返回 304，代表资源无更新，可继续使用缓存文件，如下。

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/if-modified-since.png)

#### ETag / If-None-Match

ETag 是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)，如下。

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/etag.png)

If-None-Match 是客户端再次发起该请求时，携带上次请求返回的唯一标识 ETag 值，通过此字段值告诉服务器该资源上次请求返回的唯一标识值。服务器收到该请求后，发现该请求头中含有 If-None-Match，则会根据 If-None-Match 的字段值与该资源在服务器的 ETag 值做对比，一致则返回 304，代表资源无更新，继续使用缓存文件；不一致则重新返回资源文件，状态码为 200，如下。

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/etag-match.png)

注：Etag / If-None-Match 优先级高于 Last-Modified / If-Modified-Since，同时存在则只有 ETag / If-None-Match 生效。

### 优先级

Cache-Control > expires > Etag / If-None-Match > Last-Modified / If-Modified-Since

### 总结

强制缓存优先于协商缓存进行，若强制缓存(Expires 和 Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存(Last-Modified / If-Modified-Since 和 ETag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，重新获取请求结果，再存入浏览器缓存中；生效则返回 304，继续使用缓存，主要过程如下：

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-all.png)

浏览器的三级缓存原理：

1. 先去内存看，如果有，直接加载
2. 如果内存没有，择取硬盘获取，如果有直接加载
3. 如果硬盘也没有，那么就进行网络请求
4. 加载到的资源缓存到硬盘和内存

### 浏览器缓存可以分成 Service Worker、Memory Cache、Disk Cache 和 Push Cache？

### 讲讲 304 缓存的原理

- 服务器首先产生 ETag，服务器可在稍后使用它来判断页面是否已经被修改。本质上，客户端通过将该记号传回服务器要求服务器验证其（客户端）缓存
- 304 是 HTTP 状态码，服务器用来标识这个文件没修改，不返回内容，浏览器在接收到个状态码后，会使用浏览器已缓存的文件
- 客户端请求一个页面（A）。 服务器返回页面 A，并在给 A 加上一个 ETag。 客户端展现该页面，并将页面连同 ETag 一起缓存。 客户再次请求页面 A，并将上次请求时服务器返回的 ETag 一起传递给服务器。 服务器检查该 ETag，并判断出该页面自上次客户端请求之后还未被修改，直接返回响应 304（未修改——Not Modified）和一个空的响应体
