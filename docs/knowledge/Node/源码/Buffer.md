---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# 深入浅出 Node.js（六）：Buffer 那些事儿

- 田永强

阅读数：364392012 年 4 月 16 日 00:00

作为前端的 JSer，是一件非常幸福的事情，因为在字符串上从来没有出现过任何纠结的问题。我们来看看 PHP 对字符串长度的判断结果：

```
<? php
echo strlen("0123456789");
echo strlen("零一二三四五六七八九");
echo mb_strlen("零一二三四五六七八九", "utf-8");
echo "\n";
```

以上三行判断分别返回 10、30、10。对于中国人而言，strlen 这个方法对于 Unicode 的判断结果是非常让人疑惑。而看看 JavaScript 中对字符串长度的判断，就知道这个 length 属性对调用者而言是多么友好。

```
console.log("0123456789".length); // 10
console.log("零一二三四五六七八九".length); /10
console.log("\u00bd".length); // 1
```

尽管在计算机内部，一个中文字和一个英文字占用的字节位数是不同的，但对于用户而言，它们拥有相同的长度。我认为这是 JavaScript 中 String 处理得精彩的一个点。正是由于这个原因，所有的数据从后端传输到前端被调用时，都是这般友好的字符串。所以对于前端工程师而言，他们是没有字 符串 Buffer 的概念的。如果你是一名前端工程师，那么从此在与 Node.js 打交道的过程中，一定要小心 Buffer 啦，因为它比传统的 String 要调皮一点。

## 你该小心 Buffer 啦

像许多计算机的技术一样，都是从国外传播过来的。那些以英文作为母语的传道者们应该没有考虑过英文以外的使用者，所以你有可能看到如下这样一段代码在向你描述如何在 data 事件中连接字符串。

```
var fs = require('fs');
var rs = fs.createReadStream('testdata.md');
var data = '';
rs.on("data", function (trunk){
    data += trunk;
});
rs.on("end", function () {
    console.log(data);
});
```

如果这个文件读取流读取的是一个纯英文的文件，这段代码是能够正常输出的。但是如果我们再改变一下条件，将每次读取的 buffer 大小变成一个奇数，以模拟一个字符被分配在两个 trunk 中的场景。

```
var rs = fs.createReadStream('testdata.md', {bufferSize: 11});
```

我们将会得到以下这样的乱码输出：

```
  事件循���和请求���象构成了 Node.js���异步 I/O 模型的���个基本���素，这也是典���的消费���生产者场景。
```

造成这个问题的根源在于 data += trunk 语句里隐藏的错误，在默认的情况下，trunk 是一个 Buffer 对象。这句话的实质是隐藏了 toString 的变换的：

```
data = data.toString() + trunk.toString();
```

由于汉字不是用一个字节来存储的，导致有被截破的汉字的存在，于是出现乱码。解决这个问题有一个简单的方案，是设置编码集：

```
var rs = fs.createReadStream('testdata.md', {encoding: 'utf-8', bufferSize: 11});
```

这将得到一个正常的字符串响应：

```
事件循环和请求对象构成了 Node.js 的异步 I/O 模型的两个基本元素，这也是典型的消费者生产者场景。
```

遗憾的是目前 Node.js 仅支持 hex、utf8、ascii、binary、base64、ucs2 几种编码的转换。对于那些因为历史遗留问题依旧还生存着的 GBK，GB2312 等编码，该方法是无能为力的。

## 有趣的 string_decoder

在这个例子中，如果仔细观察，会发现一件有趣的事情发生在设置编码集之后。我们提到 data += trunk 等价于 data = data.toString() + trunk.toString()。通过以下的代码可以测试到一个汉字占用三个字节，而我们按 11 个字节来截取 trunk 的话，依旧会存在一个汉字被分割在两个 trunk 中的情景。

```
console.log("事件循环和请求对象".length);
console.log(new Buffer("事件循环和请求对象").length);
```

按照猜想的 toString() 方式，应该返回的是事件循 xxx 和请求 xxx 象才对，其中“环”字应该变成乱码才对，但是在设置了 encoding（默认的 utf8）之后，结果却正常显示了，这个结果十分有趣。

![img](https://static001.infoq.cn/resource/image/f7/c3/f792578dd3a3b4b63d6c24c0cc27aac3.png)

在好奇心的驱使下可以探查到[ data 事件](https://github.com/joyent/node/blob/master/lib/fs.js#L1237)调用了 string_decoder 来进行编码补足的行为。通过 string_decoder 对象输出第一个截取 Buffer(事件循 xx) 时，只返回事件循这个字符串，保留 xx。第二次通过 string_decoder 对象输出时检测到上次保留的 xx，将上次剩余内容和本次的 Buffer 进行重新拼接输出。于是达到正常输出的目的。

string_decoder，目前在文件流读取和网络流读取中都有应用到，一定程度上避免了粗鲁拼接 trunk 导致的乱码错误。但是，遗憾在于 string_decoder 目前只支持 utf8 编码。它的思路其实还可以扩展到其他编码上，只是最终是否会支持目前尚不可得知。

## 连接 Buffer 对象的正确方法

那么万能的适应各种编码而且正确的拼接 Buffer 对象的方法是什么呢？我们从 Node.js 在 github 上的源码中找出这样一段[正确读取文件，并连接 buffer 对象的方法](https://github.com/joyent/node/blob/master/lib/fs.js#L107)：

```
var buffers = [];
var nread = 0;
readStream.on('data', function (chunk) {
    buffers.push(chunk);
    nread += chunk.length;
});
readStream.on('end', function () {
    var buffer = null;
    switch(buffers.length) {
        case 0: buffer = new Buffer(0);
            break;
        case 1: buffer = buffers[0];
            break;
        default:
            buffer = new Buffer(nread);
            for (var i = 0, pos = 0, l = buffers.length; i < l; i++) {
                var chunk = buffers[i];
                chunk.copy(buffer, pos);
                pos += chunk.length;
            }
        break;
    }
});
```

在 end 事件中通过细腻的连接方式，最后拿到理想的 Buffer 对象。这时候无论是在支持的编码之间转换，还是在不支持的编码之间转换（利用 iconv 模块转换），都不会导致乱码。

## 简化连接 Buffer 对象的过程

上述一大段代码仅只完成了一件事情，就是连接多个 Buffer 对象，而这种场景需求将会在多个地方发生，所以，采用一种更优雅的方式来完成该过程是必要的。笔者基于以上的代码封装出一个 bufferhelper 模块，用于更简洁地处理 Buffer 对象。可以通过 NPM 进行安装：

```
npm install bufferhelper
```

下面的例子演示了如何调用这个模块。与传统 data += trunk 之间只是 bufferHelper.concat(chunk) 的差别，既避免了错误的出现，又使得代码可以得到简化而有效地编写。

```
var http = require('http');
var BufferHelper = require('bufferhelper');
http.createServer(function (request, response) {
    var bufferHelper = new BufferHelper();
    request.on("data", function (chunk) {
    bufferHelper.concat(chunk);
    });
    request.on('end', function () {
    var html = bufferHelper.toBuffer().toString();
    response.writeHead(200);
    response.end(html);
    });

}).listen(8001);
```

所以关于 Buffer 对象的操作的最佳实践是：

- 保持编码不变，以利于后续编码转换
- 使用封装方法达到简洁代码的目的

## 参考

- https://github.com/joyent/node/blob/master/lib/fs.js#L107
- https://github.com/JacksonTian/bufferhelper

## 关于作者

田永强，新浪微博[ @朴灵](http://weibo.com/shyvo)，前端工程师，曾就职于 SAP，现就职于淘宝，花名朴灵，致力于 NodeJS 和 Mobile Web App 方面的研发工作。双修前后端 JavaScript，寄望将 NodeJS 引荐给更多的工程师。兴趣：读万卷书，行万里路。个人 Github 地 址：http://github.com/JacksonTian。

---

感谢[崔康](http://www.infoq.com/cn/bycategory.action?authorName=崔康)对本文的审校。
