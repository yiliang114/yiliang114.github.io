---
title: 浏览器缓存
date: '2020-10-26'
draft: true
---

## 浏览器缓存

### 说一下浏览器的缓存机制

浏览器缓存机制有两种，一种为强缓存，一种为协商缓存。
对于强缓存，浏览器在第一次请求的时候，会直接下载资源，然后缓存在本地，第二次请求的时候，直接使用缓存。
对于协商缓存，第一次请求缓存且保存缓存标识与时间，重复请求向服务器发送缓存标识和最后缓存时间，服务端进行校验，如果失效则使用缓存。

强缓存方案
Exprires：服务端的响应头，第一次请求的时候，告诉客户端，该资源什么时候会过期。Exprires 的缺陷是必须保证服务端时间和客户端时间严格同步。
Cache-control：max-age，表示该资源多少时间后过期，解决了客户端和服务端时间必须同步的问题，

协商缓存方案
If-None-Match/ETag：缓存标识，对比缓存时使用它来标识一个缓存，第一次请求的时候，服务端会返回该标识给客户端，客户端在第二次请求的时候会带上该标识与服务端进行对比并返回 If-None-Match 标识是否表示匹配。
Last-modified/If-Modified-Since：第一次请求的时候服务端返回 Last-modified 表明请求的资源上次的修改时间，第二次请求的时候客户端带上请求头 If-Modified-Since，表示资源上次的修改时间，服务端拿到这两个字段进行对比

#### 缓存分类

- 强缓存
  - 直接从浏览器缓存中读取，不去后台查询是否过期
  - `Exprise` 过期时间
  - `Cache-Control:max-age=3600` 过期秒数
- 协商缓存
  - 每次使用缓存之前先去后台确认一下
  - `Last-Modified` `If-Modified-Since` 上次修改时间
  - `Etag` `If-None-Match`
- 如何区别
  - 是否设置了`no-cache`

### 缓存过程分析

浏览器与服务器通信的方式为应答模式，即是：浏览器发起 HTTP 请求 – 服务器响应该请求。那么浏览器第一次向服务器发起该请求后拿到请求结果，会根据响应报文中 HTTP 头的缓存标识，决定是否缓存结果，是则将请求结果和缓存标识存入浏览器缓存中，简单的过程如下图：

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/http-cache.png)

由上图我们可以知道：

- 浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识

- 浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存中

以上两点结论就是浏览器缓存机制的关键，他确保了每个请求的缓存存入与读取，只要我们再理解浏览器缓存的使用规则，那么所有的问题就迎刃而解了，本文也将围绕着这点进行详细分析。为了方便大家理解，这里我们根据是否需要向服务器重新发起 HTTP 请求将缓存过程分为两个部分，分别是强制缓存和协商缓存。

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

了解强制缓存的过程后，我们拓展性的思考一下：

> 浏览器的缓存存放在哪里，如何在浏览器中判断强制缓存是否生效？

这里我们以博客的请求为例，状态码为灰色的请求则代表使用了强制缓存，请求对应的 Size 值则代表该缓存存放的位置，分别为 from memory cache 和 from disk cache。

> 那么 from memory cache 和 from disk cache 又分别代表的是什么呢？什么时候会使用 from disk cache，什么时候会使用 from memory cache 呢？

from memory cache 代表使用内存中的缓存，from disk cache 则代表使用的是硬盘中的缓存，浏览器读取缓存的顺序为 memory –> disk。

虽然我已经直接把结论说出来了，但是相信有不少人对此不能理解，那么接下来我们一起详细分析一下缓存读取问题，这里仍让以我的博客为例进行分析：

访问https://heyingye.github.io/ –> 200 –> 关闭博客的标签页 –> 重新打开https://heyingye.github.io/ –> 200(from disk cache) –> 刷新 –> 200(from memory cache)

过程如下：

- 访问https://heyingye.github.io/

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-github.png)

- 关闭博客的标签页

- 重新打开https://heyingye.github.io/

- 刷新

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-reopen.png)

> 看到这里可能有人小伙伴问了，最后一个步骤刷新的时候，不是同时存在着 from disk cache 和 from memory cache 吗？

对于这个问题，我们需要了解内存缓存(from memory cache)和硬盘缓存(from disk cache)，如下:

- 内存缓存(from memory cache)：内存缓存具有两个特点，分别是快速读取和时效性：

- 快速读取：内存缓存会将编译解析后的文件，直接存入该进程的内存中，占据该进程一定的内存资源，以方便下次运行使用时的快速读取。

- 时效性：一旦该进程关闭，则该进程的内存则会清空。

- 硬盘缓存(from disk cache)：硬盘缓存则是直接将缓存写入硬盘文件中，读取缓存需要对该缓存存放的硬盘文件进行 I/O 操作，然后重新解析该缓存内容，读取复杂，速度比内存缓存慢。

在浏览器中，浏览器会在 js 和图片等文件解析执行后直接存入内存缓存中，那么当刷新页面时只需直接从内存缓存中读取(from memory cache)；而 css 文件则会存入硬盘文件中，所以每次渲染页面都需要从硬盘读取缓存(from disk cache)。

### 协商缓存

协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程，主要有以下两种情况：

协商缓存生效，返回 304，如下

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-consult-304.png)

协商缓存失效，返回 200 和请求结果结果，如下

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-200.png)

同样，协商缓存的标识也是在响应报文的 HTTP 头中和请求结果一起返回给浏览器的，控制协商缓存的字段分别有：Last-Modified / If-Modified-Since 和 Etag / If-None-Match，其中 Etag / If-None-Match 的优先级比 Last-Modified / If-Modified-Since 高。

#### Last-Modified / If-Modified-Since

Last-Modified 是服务器响应请求时，返回该资源文件在服务器最后被修改的时间，如下。

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-lastmodify.png)

If-Modified-Since 则是客户端再次发起该请求时，携带上次请求返回的 Last-Modified 值，通过此字段值告诉服务器该资源上次请求返回的最后被修改时间。服务器收到该请求，发现请求头含有 If-Modified-Since 字段，则会根据 If-Modified-Since 的字段值与该资源在服务器的最后被修改时间做对比，若服务器的资源最后被修改时间大于 If-Modified-Since 的字段值，则重新返回资源，状态码为 200；否则则返回 304，代表资源无更新，可继续使用缓存文件，如下。

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/if-modified-since.png)

#### Etag / If-None-Match

Etag 是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)，如下。

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/etag.png)

If-None-Match 是客户端再次发起该请求时，携带上次请求返回的唯一标识 Etag 值，通过此字段值告诉服务器该资源上次请求返回的唯一标识值。服务器收到该请求后，发现该请求头中含有 If-None-Match，则会根据 If-None-Match 的字段值与该资源在服务器的 Etag 值做对比，一致则返回 304，代表资源无更新，继续使用缓存文件；不一致则重新返回资源文件，状态码为 200，如下。

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/etag-match.png)

注：Etag / If-None-Match 优先级高于 Last-Modified / If-Modified-Since，同时存在则只有 Etag / If-None-Match 生效。

### 总结

强制缓存优先于协商缓存进行，若强制缓存(Expires 和 Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存(Last-Modified / If-Modified-Since 和 Etag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，重新获取请求结果，再存入浏览器缓存中；生效则返回 304，继续使用缓存，主要过程如下：

![](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/cache-all.png)

### ETag 是这个字符串是怎么生成的？

在 REST 架构下，ETag 值可以通过 Guid、整数、长整形、字符串四种类型的参数传入 SetETag 方法，
WCF 服务发回给客户端的 HTTP 响应头中就包含了 ETag 值。另外 OutgoingResponse 类也有字符串属性：ETag 直接给它赋值也能在 HTTP 响应头中写入 ETag 值

计算 ETag 值时，需要考虑两个问题：计算与存储。如果一个 ETag 值只需要很小的代价以及占用很低的存储空间，那么我们可以在每次需要发送给客户端 ETag 值值的时候计算一遍就行行了。相反的，我们需要将之前就已经计算并存储好的 ETag 值发送给客户端。之前说：将时间戳作为字符串作为一种廉价的方式来获取 ETag 值。对于不是经常变化的消息，它是一种足够好的方案。注意：如果将时间戳做为 ETag 值，通常不应该用 Last-Modified 的值。由于 HTTP 机制中，所以当我们在通过服务校验资源状态时，客户端不需要进行相应的改动。计算 ETag 值开销最大的一般是计算采用哈希算法
获取资源的表述值。可以只计算资源的哈希值，也可以将头信息和头信息的值也包含进去。如果包含头信息，那么注意不要包含计算机标识的头信息。同样也应该避免包含 Expires、Cache-Control 和 Vary 头信息。注意：在通过哈希算法计算 ETag 值时，先要组装资源的表述。若组装也比较耗时，可以采用生成 GUID 的方式。优化 ETag 值的获取

ETag 有两种类型：强 ETag(strong ETag)与弱 ETag(weak ETag)。

- 强 ETag 表示形式："22FAA065-2664-4197-9C5E-C92EA03D0A16"。
- 弱 ETag 表现形式：w/"22FAA065-2664-4197-9C5E-C92EA03D0A16"。强、弱 ETag 类型的出现与 Apache 服务器计算 ETag 的方式有关。Apache 默认通过 FileEtag 中 FileEtag INode Mtime Size 的配置自动生成 ETag(当然也可以通过用户自定义的方式)。假设服务端的资源频繁被修改(如 1 秒内修改了 N 次)，此时如果有用户将 Apache 的配置改为 MTime，由于 MTime 只能精确到秒，那么就可以避免强 ETag 在 1 秒内的 ETag 总是不同而频繁刷新 Cache(如果资源在秒级经常被修改，也可以通过 Last-Modified 来解决)

### 浏览器缓存可以分成 Service Worker、Memory Cache、Disk Cache 和 Push Cache，那请求的时候 from memory cache 和 from disk

### cache 的依据是什么，哪些数据什么时候存放在 Memory Cache 和 Disk Cache 中？

- 缓存位置上来说分为四种，并且各自有优先级，当依次查找缓存且都没有命中的时候，才会去请求网络。

- Service Worker
- Memory Cache
- Disk Cache
- Push Cache

  1.Service Worker
  Service Worker 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。使用 Service Worker 的话，传输协议必须为 HTTPS。因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。Service Worker 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。
  Service Worker 实现缓存功能一般分为三个步骤：首先需要先注册 Service Worker，然后监听到 install 事件以后就可以缓存需要的文件，那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去请求数据.
  当 Service Worker 没有命中缓存的时候，我们需要去调用 fetch 函数获取数据。也就是说，如果我们没有在 Service Worker 命中缓存的话，会根据缓存查找优先级去查找数据。但是不管我们是从 Memory Cache 中还是从网络请求中获取的数据，浏览器都会显示我们是从 Service Worker 中获取的内容。

  2.Memory Cache
  Memory Cache 也就是内存中的缓存，主要包含的是当前中页面中已经抓取到的资源,例如页面上已经下载的样式、脚本、图片等。读取内存中的数据肯定比磁盘快,内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。 一旦我们关闭 Tab 页面，内存中的缓存也就被释放了。

> 那么既然内存缓存这么高效，我们是不是能让数据都存放在内存中呢？
> 这是不可能的。计算机中的内存一定比硬盘容量小得多，操作系统需要精打细算内存的使用，所以能让我们使用的内存必然不多。
> 当我们访问过页面以后，再次刷新页面，可以发现很多数据都来自于内存缓存
> 内存缓存中有一块重要的缓存资源是 preloader 相关指令（例如）下载的资源。总所周知 preloader 的相关指令已经是页面优化的常见手段之一，它可以一边解析 js/css 文件，一边网络请求下一个资源。
> 需要注意的事情是，内存缓存在缓存资源时并不关心返回资源的 HTTP 缓存头 Cache-Control 是什么值，同时资源的匹配也并非仅仅是对 URL 做匹配，还可能会对 Content-Type，CORS 等其他特征做校验

3.Disk Cache
Disk Cache 也就是存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，比之 Memory Cache 胜在容量和存储时效性上。
在所有浏览器缓存中，Disk Cache 覆盖面基本是最大的。它会根据 HTTP Herder 中的字段判断哪些资源需要缓存，哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求。并且即使在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据。绝大部分的缓存都来自 Disk Cache，关于 HTTP 的协议头中的缓存字段，我们会在下文进行详细介绍。

浏览器会把哪些文件丢进内存中？哪些丢进硬盘中？
关于这点，网上说法不一，不过以下观点比较靠得住：

> - 对于大文件来说，大概率是不存储在内存中的，反之优先
> - 当前系统内存使用率高的话，文件优先存储进硬盘

4.Push Cache
Push Cache（推送缓存）是 HTTP/2 中的内容，当以上三种缓存都没有命中时，它才会被使用。它只在会话（Session）中存在，一旦会话结束就被释放，并且缓存时间也很短暂，在 Chrome 浏览器中只有 5 分钟左右，同时它也并非严格执行 HTTP 头中的缓存指令。

> - 所有的资源都能被推送，并且能够被缓存,但是 Edge 和 Safari 浏览器支持相对比较差
> - 可以推送 no-cache 和 no-store 的资源
> - 一旦连接被关闭，Push Cache 就被释放
> - 多个页面可以使用同一个 HTTP/2 的连接，也就可以使用同一个 Push Cache。这主要还是依赖浏览器的实现而定，出于对性能的考虑，有的浏览器会对相同域名但不同的 tab 标签使用同一个 HTTP 连接。
> - Push Cache 中的缓存只能被使用一次
> - 浏览器可以拒绝接受已经存在的资源推送
> - 你可以给其他域名推送资源

如果以上四种缓存都没有命中的话，那么只能发起请求来获取资源了。

那么为了性能上的考虑，大部分的接口都应该选择好缓存策略，通常浏览器缓存策略分为两种：强缓存和协商缓存，并且缓存策略都是通过设置 HTTP Header 来实现的。

[详解](https://www.jianshu.com/p/54cc04190252)

### 讲讲 304 缓存的原理

- 服务器首先产生 ETag，服务器可在稍后使用它来判断页面是否已经被修改。本质上，客户端通过将该记号传回服务器要求服务器验证其（客户端）缓存
- 304 是 HTTP 状态码，服务器用来标识这个文件没修改，不返回内容，浏览器在接收到个状态码后，会使用浏览器已缓存的文件
- 客户端请求一个页面（A）。 服务器返回页面 A，并在给 A 加上一个 ETag。 客户端展现该页面，并将页面连同 ETag 一起缓存。 客户再次请求页面 A，并将上次请求时服务器返回的 ETag 一起传递给服务器。 服务器检查该 ETag，并判断出该页面自上次客户端请求之后还未被修改，直接返回响应 304（未修改——Not Modified）和一个空的响应体
