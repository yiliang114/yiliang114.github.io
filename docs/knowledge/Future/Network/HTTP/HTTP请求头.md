---
layout: CustomPages
title: HTTP
date: 2020-11-21
aside: false
draft: true
---

### Accept 和 Content-Type

Accept 请求头用来告知客户端可以处理的内容类型，这种内容类型用 MIME 类型来表示。服务器使用 Content-Type 应答头通知客户端它的选择。

Accept: text/html
Accept: image/_
Accept: text/html, application/xhtml+xml, application/xml;q=0.9, _/\*;q=0.8
1.Accept 属于请求头， Content-Type 属于实体头。
Http 报头分为通用报头，请求报头，响应报头和实体报头。
请求方的 http 报头结构：通用报头|请求报头|实体报头
响应方的 http 报头结构：通用报头|响应报头|实体报头

2.Accept 代表发送端（客户端）希望接受的数据类型。
比如：Accept：text/xml;
代表客户端希望接受的数据类型是 xml 类型

Content-Type 代表发送端（客户端|服务器）发送的实体数据的数据类型。
比如：Content-Type：text/html;
代表发送端发送的数据格式是 html。

二者合起来，
Accept:text/xml；
Content-Type:text/html
即代表希望接受的数据类型是 xml 格式，本次请求发送的数据的数据格式是 html。

## 请求头

请求头包含哪些字段

<https://blog.csdn.net/yicixing7/article/details/79320821>

- cache-control

- user-agent

- origin

- connection

http 长连接？

http1.1 与 1.0 的区别

http 报文的包装方式，是如何将一个 tcp 包包装起来的。

### http 的请求报文是什么样的？

请求报文有 4 部分组成:

- 请求行 请求行包括：请求方法字段、URL 字段、HTTP 协议版本字段。它们用空格分隔。例如，GET /index.html HTTP/1.1。
- 请求头部 请求头部:请求头部由关键字/值对组成，每行一对，关键字和值用英文冒号“:”分隔
- 空行
- 请求体 请求体: post put 等请求携带的数据

### http 的响应报文是什么样的？

请求报文有 4 部分组成:

- 响应行 由协议版本，状态码和状态码的原因短语组成，例如 HTTP/1.1 200 OK。
- 响应头 响应部首组成
- 空行
- 响应体 服务器响应的数据

### HTTP 首部

|     通用字段      |                      作用                       |
| :---------------: | :---------------------------------------------: |
|   Cache-Control   |                 控制缓存的行为                  |
|    Connection     | 浏览器想要优先使用的连接类型，比如 `keep-alive` |
|       Date        |                  创建报文时间                   |
|      Pragma       |                    报文指令                     |
|        Via        |               代理服务器相关信息                |
| Transfer-Encoding |                  传输编码方式                   |
|      Upgrade      |               要求客户端升级协议                |
|      Warning      |              在内容中可能存在错误               |

|      请求字段       |                作用                |
| :-----------------: | :--------------------------------: |
|       Accept        |        能正确接收的媒体类型        |
|   Accept-Charset    |         能正确接收的字符集         |
|   Accept-Encoding   |      能正确接收的编码格式列表      |
|   Accept-Language   |        能正确接收的语言列表        |
|       Expect        |        期待服务端的指定行为        |
|        From         |           请求方邮箱地址           |
|        Host         |            服务器的域名            |
|      If-Match       |          两端资源标记比较          |
|  If-Modified-Since  | 本地资源未修改返回 304（比较时间） |
|    If-None-Match    | 本地资源未修改返回 304（比较标记） |
|     User-Agent      |             客户端信息             |
|    Max-Forwards     |    限制可被代理及网关转发的次数    |
| Proxy-Authorization |      向代理服务器发送验证信息      |
|        Range        |        请求某个内容的一部分        |
|       Referer       |    表示浏览器所访问的前一个页面    |
|         TE          |            传输编码方式            |

|      响应字段      |            作用            |
| :----------------: | :------------------------: |
|   Accept-Ranges    |   是否支持某些种类的范围   |
|        Age         | 资源在代理缓存中存在的时间 |
|        ETag        |          资源标识          |
|      Location      |   客户端重定向到某个 URL   |
| Proxy-Authenticate |  向代理服务器发送验证信息  |
|       Server       |         服务器名字         |
|  WWW-Authenticate  |   获取资源需要的验证信息   |

|     实体字段     |               作用               |
| :--------------: | :------------------------------: |
|      Allow       |        资源的正确请求方式        |
| Content-Encoding |          内容的编码格式          |
| Content-Language |          内容使用的语言          |
|  Content-Length  |        request body 长度         |
| Content-Location |        返回数据的备用地址        |
|   Content-MD5    | Base64 加密格式的内容 MD5 检验值 |
|  Content-Range   |          内容的位置范围          |
|   Content-Type   |          内容的媒体类型          |
|     Expires      |          内容的过期时间          |
|  Last_modified   |        内容的最后修改时间        |

### 和缓存有关的请求头有哪些？优先级是怎样的？

和缓存有关的请求头有 Cache-Control、If-Match、If-None-Match、If-Modified-Since、If-Unmodified-Since，在缓存中
总体来说是 Cache-Control 优先于 Expires，Cache-Control 中会需要检测 Cache-Control 是否过期，过期的话检验会优先检测 Etag，
也就是 If-Match、If-None-Match,不一致则验证 Last-Modify 请求头也就是 If-Modified-Since、If-Unmodified-Since。

### 常见的 HTTP 头部

可以将 HTTP 首部分为通用首部、请求首部、响应首部、实体首部，通用首部表示一些通用信息，如 Date 表示报文创建时间，请求首部就是请求报文中
独有的，如 cookie、和缓存相关的 If-Modified-Since，响应首部就是响应报文中独有的，如 set-cookie 和重定向有关的 location，实体首部用来
描述实体部分，如 Allow 用来描述可执行的请求方法，Content-Type 描述主体类型，Content-Encoding 描述主体的编码方式

### http 的状态码请求方式，以及 HTTP HEAD（HTTP 头）

#### HTTP Method 请求方法

在 requestline 里面的方法部分，表示 HTTP 的操作类型，常见的几种请求方法如下：

- GET：浏览器通过地址访问页面均属于 get 请求
- POST：常见的表单提交
- HEAD ：跟 get 类似，区别在于只返回请求头
- PUT：表示添加资源
- DELETE：表示删除资源
- CONNECT： 多用于 HTTPS 和 WebSocket
- OPTIONS
- TRACE

### 其他

- 了解 http 协议。说一下 200 和 304 的理解和区别(协商缓存和强制缓存的区别，流程，还有一些细节，提到了 expires,Cache-Control,If-none-match,- Etag,last-Modified 的匹配和特征)
- cache-control 中 public 和 private 有什么区别

### 首部

- http 常见的请求头包含
  - cache-control
  - user-agent
  - origin
  - Connection
  - ...

首部分为请求首部和响应首部，并且部分首部两种通用，接下来我们就来学习一部分的常用首部。

**通用首部**

|     通用字段      |                      作用                       |
| :---------------: | :---------------------------------------------: |
|   Cache-Control   |                 控制缓存的行为                  |
|    Connection     | 浏览器想要优先使用的连接类型，比如 `keep-alive` |
|       Date        |                  创建报文时间                   |
|      Pragma       |                    报文指令                     |
|        Via        |               代理服务器相关信息                |
| Transfer-Encoding |                  传输编码方式                   |
|      Upgrade      |               要求客户端升级协议                |
|      Warning      |              在内容中可能存在错误               |

**请求首部**

|      请求首部       |                作用                |
| :-----------------: | :--------------------------------: |
|       Accept        |        能正确接收的媒体类型        |
|   Accept-Charset    |         能正确接收的字符集         |
|   Accept-Encoding   |      能正确接收的编码格式列表      |
|   Accept-Language   |        能正确接收的语言列表        |
|       Expect        |        期待服务端的指定行为        |
|        From         |           请求方邮箱地址           |
|        Host         |            服务器的域名            |
|      If-Match       |          两端资源标记比较          |
|  If-Modified-Since  | 本地资源未修改返回 304（比较时间） |
|    If-None-Match    | 本地资源未修改返回 304（比较标记） |
|     User-Agent      |             客户端信息             |
|    Max-Forwards     |    限制可被代理及网关转发的次数    |
| Proxy-Authorization |      向代理服务器发送验证信息      |
|        Range        |        请求某个内容的一部分        |
|       Referer       |    表示浏览器所访问的前一个页面    |
|         TE          |            传输编码方式            |

**响应首部**

|    **响应首部**    |          **作用**          |
| :----------------: | :------------------------: |
|   Accept-Ranges    |   是否支持某些种类的范围   |
|        Age         | 资源在代理缓存中存在的时间 |
|        ETag        |          资源标识          |
|      Location      |   客户端重定向到某个 URL   |
| Proxy-Authenticate |  向代理服务器发送验证信息  |
|       Server       |         服务器名字         |
|  WWW-Authenticate  |   获取资源需要的验证信息   |

**实体首部**

|   **实体首部**   |             **作用**             |
| :--------------: | :------------------------------: |
|      Allow       |        资源的正确请求方式        |
| Content-Encoding |          内容的编码格式          |
| Content-Language |          内容使用的语言          |
|  Content-Length  |        request body 长度         |
| Content-Location |        返回数据的备用地址        |
|   Content-MD5    | Base64 加密格式的内容 MD5 检验值 |
|  Content-Range   |          内容的位置范围          |
|   Content-Type   |          内容的媒体类型          |
|     Expires      |          内容的过期时间          |
|  Last-modified   |        内容的最后修改时间        |

# 四、HTTP 首部

有 4 种类型的首部字段：通用首部字段、请求首部字段、响应首部字段和实体首部字段。

各种首部字段及其含义如下（不需要全记，仅供查阅）：

## 通用首部字段

|    首部字段名     |                    说明                    |
| :---------------: | :----------------------------------------: |
|   Cache-Control   |               控制缓存的行为               |
|    Connection     | 控制不再转发给代理的首部字段、管理持久连接 |
|       Date        |             创建报文的日期时间             |
|      Pragma       |                  报文指令                  |
|      Trailer      |             报文末端的首部一览             |
| Transfer-Encoding |         指定报文主体的传输编码方式         |
|      Upgrade      |               升级为其他协议               |
|        Via        |            代理服务器的相关信息            |
|      Warning      |                  错误通知                  |

## 请求首部字段

|     首部字段名      |                      说明                       |
| :-----------------: | :---------------------------------------------: |
|       Accept        |            用户代理可处理的媒体类型             |
|   Accept-Charset    |                  优先的字符集                   |
|   Accept-Encoding   |                 优先的内容编码                  |
|   Accept-Language   |             优先的语言（自然语言）              |
|    Authorization    |                  Web 认证信息                   |
|       Expect        |              期待服务器的特定行为               |
|        From         |               用户的电子邮箱地址                |
|        Host         |               请求资源所在服务器                |
|      If-Match       |              比较实体标记（ETag）               |
|  If-Modified-Since  |               比较资源的更新时间                |
|    If-None-Match    |        比较实体标记（与 If-Match 相反）         |
|      If-Range       |      资源未更新时发送实体 Byte 的范围请求       |
| If-Unmodified-Since | 比较资源的更新时间（与 If-Modified-Since 相反） |
|    Max-Forwards     |                 最大传输逐跳数                  |
| Proxy-Authorization |         代理服务器要求客户端的认证信息          |
|        Range        |               实体的字节范围请求                |
|       Referer       |            对请求中 URI 的原始获取方            |
|         TE          |                传输编码的优先级                 |
|     User-Agent      |              HTTP 客户端程序的信息              |

## 响应首部字段

|     首部字段名     |             说明             |
| :----------------: | :--------------------------: |
|   Accept-Ranges    |     是否接受字节范围请求     |
|        Age         |     推算资源创建经过时间     |
|        ETag        |        资源的匹配信息        |
|      Location      |   令客户端重定向至指定 URI   |
| Proxy-Authenticate | 代理服务器对客户端的认证信息 |
|    Retry-After     |   对再次发起请求的时机要求   |
|       Server       |    HTTP 服务器的安装信息     |
|        Vary        |   代理服务器缓存的管理信息   |
|  WWW-Authenticate  |   服务器对客户端的认证信息   |

## 实体首部字段

|    首部字段名    |          说明          |
| :--------------: | :--------------------: |
|      Allow       | 资源可支持的 HTTP 方法 |
| Content-Encoding | 实体主体适用的编码方式 |
| Content-Language |   实体主体的自然语言   |
|  Content-Length  |     实体主体的大小     |
| Content-Location |   替代对应资源的 URI   |
|   Content-MD5    |   实体主体的报文摘要   |
|  Content-Range   |   实体主体的位置范围   |
|   Content-Type   |   实体主体的媒体类型   |
|     Expires      | 实体主体过期的日期时间 |
|  Last-Modified   | 资源的最后修改日期时间 |

### 请描述以下 request 和 response headers：

- Diff. between Expires, Date, Age and If-Modified-...
- Do Not Track
- Cache-Control
- Transfer-Encoding
- ETag
- X-Frame-Options

### refer 不属于浏览器 response headers 的字段
