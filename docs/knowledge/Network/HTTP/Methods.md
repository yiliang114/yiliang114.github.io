---
layout: CustomPages
title: HTTP
date: 2020-11-21
aside: false
draft: true
---

### GET 和 POST 比较

#### 作用

GET 用于获取资源，而 POST 用于传输实体主体。

#### 参数

GET 和 POST 的请求都能使用额外的参数，但是 GET 的参数是以查询字符串出现在 URL 中，而 POST 的参数存储在实体主体中。不能因为 POST 参数存储在实体主体中就认为它的安全性更高，因为照样可以通过一些抓包工具（Fiddler）查看。

因为 URL 只支持 ASCII 码，因此 GET 的参数中如果存在中文等字符就需要先进行编码。例如 `中文` 会转换为 `%E4%B8%AD%E6%96%87`，而空格会转换为 `%20`。POST 参数支持标准字符集。

```
GET /test/demo_form.asp?name1=value1&name2=value2 HTTP/1.1
```

```
POST /test/demo_form.asp HTTP/1.1
Host: w3schools.com
name1=value1&name2=value2
```

#### 安全

安全的 HTTP 方法不会改变服务器状态，也就是说它只是可读的。

GET 方法是安全的，而 POST 却不是，因为 POST 的目的是传送实体主体内容，这个内容可能是用户上传的表单数据，上传成功之后，服务器可能把这个数据存储到数据库中，因此状态也就发生了改变。

安全的方法除了 GET 之外还有：HEAD、OPTIONS。

不安全的方法除了 POST 之外还有 PUT、DELETE。

#### 幂等性

幂等的 HTTP 方法，同样的请求被执行一次与连续执行多次的效果是一样的，服务器的状态也是一样的。换句话说就是，幂等方法不应该具有副作用（统计用途除外）。

所有的安全方法也都是幂等的。

在正确实现的条件下，GET，HEAD，PUT 和 DELETE 等方法都是幂等的，而 POST 方法不是。

GET /pageX HTTP/1.1 是幂等的，连续调用多次，客户端接收到的结果都是一样的：

```
GET /pageX HTTP/1.1
GET /pageX HTTP/1.1
GET /pageX HTTP/1.1
GET /pageX HTTP/1.1
```

POST /add_row HTTP/1.1 不是幂等的，如果调用多次，就会增加多行记录：

```
POST /add_row HTTP/1.1   -> Adds a 1nd row
POST /add_row HTTP/1.1   -> Adds a 2nd row
POST /add_row HTTP/1.1   -> Adds a 3rd row
```

DELETE /idX/delete HTTP/1.1 是幂等的，即使不同的请求接收到的状态码不一样：

```
DELETE /idX/delete HTTP/1.1   -> Returns 200 if idX exists
DELETE /idX/delete HTTP/1.1   -> Returns 404 as it just got deleted
DELETE /idX/delete HTTP/1.1   -> Returns 404
```

#### 可缓存

如果要对响应进行缓存，需要满足以下条件：

- 请求报文的 HTTP 方法本身是可缓存的，包括 GET 和 HEAD，但是 PUT 和 DELETE 不可缓存，POST 在多数情况下不可缓存的。
- 响应报文的状态码是可缓存的，包括：200, 203, 204, 206, 300, 301, 404, 405, 410, 414, and 501。
- 响应报文的 Cache-Control 首部字段没有指定不进行缓存。

#### XMLHttpRequest

为了阐述 POST 和 GET 的另一个区别，需要先了解 XMLHttpRequest：

> XMLHttpRequest 是一个 API，它为客户端提供了在客户端和服务器之间传输数据的功能。它提供了一个通过 URL 来获取数据的简单方式，并且不会使整个页面刷新。这使得网页只更新一部分页面而不会打扰到用户。XMLHttpRequest 在 AJAX 中被大量使用。

- 在使用 XMLHttpRequest 的 POST 方法时，浏览器会先发送 Header 再发送 Data。但并不是所有浏览器会这么做，例如火狐就不会。
- 而 GET 方法 Header 和 Data 会一起发送。

#### HTTP 协议的主要特点

- 简单快速
- 灵活
- **无连接**
- **无状态**

> 通常我们要答出以上四个内容。如果实在记不住，一定要记得后面的两个：**无连接、无状态**。

我们分别来解释一下。

##### 简单快速

> **简单**：每个资源（比如图片、页面）都通过 url 来定位。这都是固定的，在`http`协议中，处理起来也比较简单，想访问什么资源，直接输入 url 即可。

##### 灵活

> `http`协议的头部有一个`数据类型`，通过`http`协议，就可以完成不同数据类型的传输。

##### 无连接

> 连接一次，就会断开，不会继续保持连接。

##### 无状态

> 客户端和服务器端是两种身份。第一次请求结束后，就断开了，第二次请求时，**服务器端并没有记住之前的状态**，也就是说，服务器端无法区分客户端是否为同一个人、同一个身份。

> 有的时候，我们访问网站时，网站能记住我们的账号，这个是通过其他的手段（比如 `session`）做到的，并不是`http`协议能做到的。

#### 3 HTTP 报文的组成部分

![](http://img.smyhvae.com/20180306_1400.png)

> 在回答此问题时，我们要按照顺序回答：

- 先回答的是，`http`报文包括：**请求报文**和**响应报文**。
- 再回答的是，每个报文包含什么部分。
- 最后回答，每个部分的内容是什么

##### 请求报文包括：

![](http://img.smyhvae.com/20180228_1505.jpg)

- 请求行：包括请求方法、请求的`url`、`http`协议及版本。
- 请求头：一大堆的键值对。
- **空行**指的是：当服务器在解析请求头的时候，如果遇到了空行，则表明，后面的内容是请求体
- 请求体：数据部分。

##### 响应报文包括：

![](http://img.smyhvae.com/20180228_1510.jpg)

- 状态行：`http`协议及版本、状态码及状态描述。
- 响应头
- 空行
- 响应体

#### 4 HTTP 方法

包括：

- `GET`：获取资源
- `POST`：传输资源
- `put`：更新资源
- `DELETE`：删除资源
- `HEAD`：获得报文首部

> `HTTP`方法有很多，但是上面这五个方法，要求在面试时全部说出来，不要漏掉。

- `get` `和`post` 比较常见。
- `put` 和 `delete` 在实际应用中用的很少。况且，业务中，一般不删除服务器端的资源。
- `head` 可能偶尔用的到。

#### 7 持久链接/http 长连接

> 如果你能答出持久链接，这是面试官很想知道的一个点。

- **轮询**：`http1.0`中，客户端每隔很短的时间，都会对服务器发出请求，查看是否有新的消息，只要轮询速度足够快，例如`1`秒，就能给人造成交互是实时进行的印象。这种做法是无奈之举，实际上对服务器、客户端双方都造成了大量的性能浪费。
- **长连接**：`HTTP1.1`中，通过使用`Connection:keep-alive`进行长连接，。客户端只请求一次，但是服务器会将继续保持连接，当再次请求时，避免了重新建立连接。

> 注意，`HTTP 1.1`默认进行持久连接。在一次 `TCP` 连接中可以完成多个 `HTTP` 请求，但是对**每个请求仍然要单独发 header**，`Keep-Alive`不会永久保持连接，它有一个保持时间，可以在不同的服务器软件（如`Apache`）中设定这个时间。

#### 8 长连接中的管线化

> 如果能答出**管线化**，则属于加分项。

##### 管线化的原理

> 长连接时，**默认**的请求这样的：

```
	请求1 --> 响应1 -->请求2 --> 响应2 --> 请求3 --> 响应3
```

> 管线化就是，我把现在的请求打包，一次性发过去，你也给我一次响应回来。

##### 管线化的注意事项

> 面试时，不会深究管线化。如果真要问你，就回答：“我没怎么研究过，准备回去看看~”

##### HTTP method

1. 一台服务器要与 HTTP1.1 兼容，只要为资源实现**GET**和**HEAD**方法即可
2. **GET**是最常用的方法，通常用于**请求服务器发送某个资源**。
3. **HEAD**与 GET 类似，但**服务器在响应中值返回首部，不返回实体的主体部分**
4. **PUT**让服务器**用请求的主体部分来创建一个由所请求的 URL 命名的新文档，或者，如果那个 URL 已经存在的话，就用干这个主体替代它**
5. **POST**起初是用来向服务器输入数据的。实际上，通常会用它来支持 HTML 的表单。表单中填好的数据通常会被送给服务器，然后由服务器将其发送到要去的地方。
6. **TRACE**会在目的服务器端发起一个环回诊断，最后一站的服务器会弹回一个 TRACE 响应并在响应主体中携带它收到的原始请求报文。TRACE 方法主要用于诊断，用于验证请求是否如愿穿过了请求/响应链。
7. **OPTIONS**方法请求 web 服务器告知其支持的各种功能。可以查询服务器支持哪些方法或者对某些特殊资源支持哪些方法。
8. **DELETE**请求服务器删除请求 URL 指定的资源

#### http 请求的不同方法， get post put 等，post 和 get 有什么区别，哪一个安全等

- 后台接口上如何限制频率（将所有的 post 请求都转化为 get 请求，参照掘金和 api3.0），前端又该如何限制频率？
- 自己的网站上，页面请求的 cgi 地址如何写可以减少一次 dns 解析时间？
- 局域网（访问、权限）

- 网卡 ？ localhost 与 127.0.0.1 与 自身的 ip 访问有什么区别？
- 一个网站的地址输入之后发生的所有事情

* 静态资源文件的缓存机制，协商缓存和强缓存的区别及使用

- https（对是 https）有几次握手和挥手？https 的原理。http 有几次挥手和握手？TLS 的中文名？TLS 在哪一网络层？
- 你知道的负载均衡有哪些方法？我答 Dns 和 Nginx 可以？那么 Dns 怎么做负载均衡的原理？dns 是基于 tcp 还是 udp？Nginx 的原理？正向代理和反向代理的区别？
- 网络模型中有几层？Http 在哪一层 tcp 在哪一层？
- 项目中的 http 请求头方法
- 网络的模式从地到高有多少层？分别是什么？
- tcp 在哪一层？http 在哪一层？ip 在哪一层？tcp 的三次握手和四次挥手画图（当场画写 ack 和 seq 的值）？为什么 tcp 要三次握手四次挥手？

###### 代理工具

- 腾讯： [whistle](https://github.com/avwo/whistle) 各种插件 whistle.imwebenv
- 有赞： ZanProxy
- 阿里： https://github.com/alibaba/anyproxy.git

* https https://mp.weixin.qq.com/s/DIFf8VjduO5rviHkgR_8lg?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com

###### HTTP Method 请求方法

在 requestline 里面的方法部分，表示 HTTP 的操作类型，常见的几种请求方法如下：

- GET：浏览器通过地址访问页面均属于 get 请求
- POST：常见的表单提交
- HEAD ：跟 get 类似，区别在于只返回请求头
- PUT：表示添加资源
- DELETE：表示删除资源
- CONNECT： 多用于 HTTPS 和 WebSocket
- OPTIONS
- TRACE

### Post 和 Get 的区别？

> 要本质的东西，不要说 API 使用上的区别

GET 和 POST 本质上就是 TCP 链接，并无差别。但是由于 HTTP 的规定和浏览器/服务器的限制，导致他们在应用过程中体现出一些不同。 GET 和 POST 还有一个重大区别，简单的说：GET 产生一个 TCP 数据包；POST 产生两个 TCP 数据包。对于 GET 方式的请求，浏览器会把 http header 和 data 一并发送出去，服务器响应 200（返回数据）； 而对于 POST，浏览器先发送 header，服务器响应 100 continue，浏览器再发送 data，服务器响应 200 ok（返回数据）。 但是，比如你想在 GET 请求里带 body，一样可以发送 Expect: 100-continue 并等待 100 continue，这是符合标准的。

从前端的常规使用来说，由于服务器和浏览器的限制，出现了一些不同之处：

- GET 在浏览器回退时是无害的，而 POST 会再次提交请求。
- GET 产生的 URL 地址可以被书签收藏，而 POST 不可
- GET 请求会被浏览器主动 cache，而 POST 不会，除非手动设置。
- GET 请求只能进行 url 编码，而 POST 支持多种编码方式。
- GET 请求参数会被完整保留在浏览器历史记录里，而 POST 中的参数不会被保留。
- GET 请求在 URL 中传送的参数是有长度限制的(大多数浏览器限制在 2K，大多数服务器在 64K 左右)，而 POST 么有。
- 对参数的数据类型，GET 只接受 ASCII 字符，而 POST 没有限制。
- GET 比 POST 更不安全，因为参数直接暴露在 URL 上，所以不能用来传递敏感信息。
- GET 参数通过 URL 传递，POST 放在 Request body 中。

> [这个解释很棒](https://mp.weixin.qq.com/s?__biz=MzI3NzIzMzg3Mw==&mid=100000054&idx=1&sn=71f6c214f3833d9ca20b9f7dcd9d33e4#rd)

首先先引入副作用和幂等的概念。

副作用指对服务器上的资源做改变，搜索是无副作用的，注册是副作用的。

幂等指发送 M 和 N 次请求（两者不相同且都大于 1），服务器上资源的状态一致，比如注册 10 个和 11 个帐号是不幂等的，对文章进行更改 10 次和 11 次是幂等的。因为前者是多了一个账号（资源），后者只是更新同一个资源。

在规范的应用场景上说，Get 多用于无副作用，幂等的场景，例如搜索关键字。Post 多用于副作用，不幂等的场景，例如注册。

在技术上说：

- Get 请求能缓存，Post 不能
- Post 相对 Get 安全一点点，因为 Get 请求都包含在 URL 里（当然你想写到 `body` 里也是可以的），且会被浏览器保存历史纪录。Post 不会，但是在抓包的情况下都是一样的。
- URL 有长度限制，会影响 Get 请求，但是这个长度限制是浏览器规定的，不是 RFC 规定的
- Post 支持更多的编码类型且不对数据类型限制

先引入副作用和幂等的概念。

副作用指对服务器上的资源做改变，搜索是无副作用的，注册是副作用的。

幂等指发送 M 和 N 次请求（两者不相同且都大于 1），服务器上资源的状态一致，比如注册 10 个和 11 个帐号是不幂等的，对文章进行更改 10 次和 11 次是幂等的。

在规范的应用场景上说，Get 多用于无副作用，幂等的场景，例如搜索关键字。Post 多用于副作用，不幂等的场景，例如注册。

在技术上说：

- Get 请求能缓存，Post 不能
- Post 相对 Get 安全一点点，因为 Get 请求都包含在 URL 里，且会被浏览器保存历史纪录，Post 不会，但是在抓包的情况下都是一样的。
- Post 可以通过 request body 来传输比 Get 更多的数据，Get 没有这个技术
- URL 有长度限制，会影响 Get 请求，但是这个长度限制是浏览器规定的，不是 RFC 规定的
- Post 支持更多的编码类型且不对数据类型限制

- GET 在浏览器回退时是无害的，而 POST 会再次提交
- Get 请求能缓存，Post 不能
- Post 相对 Get 相对安全一些，因为 Get 请求都包含在 URL 中，而且会被浏览器保存记录，Post 不会。但是再抓包的情况下都是一样的。
- Post 可以通过 request body 来传输比 Get 更多的数据
- URL 有长度限制，会影响 Get 请求，但是这个长度限制是浏览器规定的
- Post 支持更多的编码类型且不对数据类型限制
- POST，浏览器先发送 header，服务器响应 100 continue，浏览器再发送 data，服务器响应 200 ok(返回数据)

先引入副作用和幂等的概念。
副作用指对服务器上的资源做改变，搜索是无副作用的，注册是副作用的。
幂等指发送 M 和 N 次请求（两者不相同且都大于 1），服务器上资源的状态一致，比如注册 10 个和 11 个帐号是不幂等的，对文章进行更改 10 次和 11 次是幂等的。
在规范的应用场景上说，Get 多用于无副作用，幂等的场景，例如搜索关键字。Post 多用于副作用，不幂等的场景，例如注册。

### Get 和 Post 请求在缓存方面的区别

get 和 post 在缓存方面的区别：

- get 请求类似于查找的过程，用户获取数据，可以不用每次都与数据库连接，所以可以使用缓存。
- post 不同，post 做的一般是修改和删除的工作，所以必须与数据库交互，所以不能使用缓存。因此 get 请求适合于请求缓存

### 发送 Get 请求和 Post 请求

> `get`请求举例：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <h1>Ajax 发送 get 请求</h1>
    <input type="button" value="发送get_ajax请求" id="btnAjax" />

    <script type="text/javascript">
      // 绑定点击事件
      document.querySelector('#btnAjax').onclick = function() {
        // 发送ajax 请求 需要 五步

        // （1）创建异步对象
        var ajaxObj = new XMLHttpRequest();

        // （2）设置请求的参数。包括：请求的方法、请求的url。
        ajaxObj.open('get', '02-ajax.php');

        // （3）发送请求
        ajaxObj.send();

        //（4）注册事件。 onreadystatechange事件，状态改变时就会调用。
        //如果要在数据完整请求回来的时候才调用，我们需要手动写一些判断的逻辑。
        ajaxObj.onreadystatechange = function() {
          // 为了保证 数据 完整返回，我们一般会判断 两个值
          if (ajaxObj.readyState == 4 && ajaxObj.status == 200) {
            // 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
            // 5.在注册的事件中 获取 返回的 内容 并修改页面的显示
            console.log('数据返回成功');

            // 数据是保存在 异步对象的 属性中
            console.log(ajaxObj.responseText);

            // 修改页面的显示
            document.querySelector('h1').innerHTML = ajaxObj.responseText;
          }
        };
      };
    </script>
  </body>
</html>
```

> `post` 请求举例：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <h1>Ajax 发送 get 请求</h1>
    <input type="button" value="发送put_ajax请求" id="btnAjax" />
    <script type="text/javascript">
      // 异步对象
      var xhr = new XMLHttpRequest();
      // 设置属性
      xhr.open('post', '02.post.php');
      // 如果想要使用post提交数据,必须添加此行
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      // 将数据通过send方法传递
      xhr.send('name=fox&age=18');
      // 发送并接受返回值
      xhr.onreadystatechange = function() {
        // 这步为判断服务器是否正确响应
        if (xhr.readyState == 4 && xhr.status == 200) {
          alert(xhr.responseText);
        }
      };
    </script>
  </body>
</html>
```

### POST 请求

POST 请求则需要设置`RequestHeader`告诉后台传递内容的编码方式以及在 send 方法里传入对应的值

```js
xhr.open('POST', url, true);
xhr.setRequestHeader(('Content-Type': 'application/x-www-form-urlencoded'));
xhr.send('key1=value1&key2=value2');
```

### GET 注意事项

- 如果不设置响应头 `Cache-Control: no-cache` 浏览器将会把响应缓存下来而且再也不无法重新提交请求。你也可以添加一个总是不同的 GET 参数，比如时间戳或者随机数

**Get 请求传参长度的误区**:

误区：我们经常说 get 请求参数的大小存在限制，而 post 请求的参数大小是无限制的。

实际上 HTTP 协议从未规定 GET/POST 的请求长度限制是多少。对 get 请求参数的限制是来源与浏览器或 web 服务器，浏览器或 web 服务器限制了 url 的长度。为了明确这个概念，我们必须再次强调下面几点:

- HTTP 协议 未规定 GET 和 POST 的长度限制
- GET 的最大长度显示是因为 浏览器和 web 服务器限制了 URI 的长度
- 不同的浏览器和 WEB 服务器，限制的最大长度不一样
- 要支持 IE，则最大长度为 2083byte，若只支持 Chrome，则最大长度 8182byte

`get`请求在`url`中`传递的参数有大小限制，基本是`2kb`，不同的浏览器略有不同。而 post 没有注意。
