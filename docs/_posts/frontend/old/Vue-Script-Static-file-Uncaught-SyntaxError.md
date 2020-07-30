---
title: Vue-Script-Static-file-Uncaught-SyntaxError
date: 2020-03-14 17:06:38
tags:
  - vue
# vssue-id: 17
---

### Vue Script Static file Uncaught SyntaxError

Vue Script Static file Uncaught SyntaxError: Unexpected token <

#### 背景

**Vue 项目 index.html 中的 script 标签引用 static 目录下的文件时报错**
![在这里插入图片描述](https://chatflow-files-cdn-1252847684.file.myqcloud.com/20181018213544254.png)

```
Uncaught SyntaxError: Unexpected token <
```

#### 先贴一下代码：

```html
<body>
  <div id="app"></div>

  <script src="https://unpkg.com/element-ui/lib/index.js"></script>
  <script src="./static/moment.min.js"></script>

  <!-- built files will be auto injected -->
</body>
```

![在这里插入图片描述](https://chatflow-files-cdn-1252847684.file.myqcloud.com/20181018214240409.png)

##### 分析

额，其实如果不看上面那个报错的话，还能直接发现一个很明显的问题，就是我引用的 `moment.min.js` 路径写错了。但是在实际的开发过程中，竟然没有报 `404 not found` ， 于是就没有注意到这个低级错误。

##### 排错

事后诸葛亮，我们还是来看一下，这个问题的排查过程。

点击控制台报错的详情，进入 `Source`：
![在这里插入图片描述](https://chatflow-files-cdn-1252847684.file.myqcloud.com/20181018215149962.png)
E ...
看起来还是一个很头疼的问题呢，看`Source` 没用。点击 `Network` 看看吧：
![在这里插入图片描述](https://chatflow-files-cdn-1252847684.file.myqcloud.com/2018101821532527.png)

咦... 怎么没有内容显示出来。因为手贱，其实我已经将这些 build 之后的文件都发到服务器上去了。我们看看访问服务器上页面的 `Network`：

![在这里插入图片描述](https://chatflow-files-cdn-1252847684.file.myqcloud.com/20181018215614602.png)
震惊了竟然出现了 `nginx` 画面之后，我懂了。因为服务器上的静态资源是通过`nginx` 来路由的，针对没有路由到的文件（因为我还没有做专门的 `error.html`）就会显示这个初始的 `nginx welcome page` 。于是我想到了肯定是因为路径写错啦！

##### 事后分析

那么到底为什么，因为路径写错了，就显示了
![在这里插入图片描述](https://chatflow-files-cdn-1252847684.file.myqcloud.com/20181018213544254.png)

打开 `dist` 文件夹中的 `index.html` 文件：
![在这里插入图片描述](https://chatflow-files-cdn-1252847684.file.myqcloud.com/20181018220611110.png)

这里的 html 标签不写双引号是 `HTML5` 的一个特性。如果是 HTML5 以前的版本，标准写法是需要加双引号的。不过还是加上吧，感觉这不是一个好的规范，忽略即可。

`script` 标签将去请求 `src=` 后面跟随的路径的返回结果（一般是 js 的代码块），填充到 `script` 标签内。想一想下面两个`script` 标签：
![在这里插入图片描述](https://chatflow-files-cdn-1252847684.file.myqcloud.com/20181018221051321.png)

而实际去请求 `http://localhost:8080/static/js/moment.min.js` 这个地址返回的是一段 `html` 代码，也就是
![在这里插入图片描述](https://chatflow-files-cdn-1252847684.file.myqcloud.com/20181018215149962.png)

下面来模仿一下这个 err, 你自己也可以试试：
![在这里插入图片描述](https://chatflow-files-cdn-1252847684.file.myqcloud.com/20181018221629848.png)
再访问一下这个页面，你就会看到同样的错误了。

![在这里插入图片描述](https://chatflow-files-cdn-1252847684.file.myqcloud.com/20181018221644107.png)

#### 最后

是个小问题，但是背后的原理一细想，还是有很多的，我们要知道为什么错了，以及要多一点寻找根本的耐心。

Happy Coding!
