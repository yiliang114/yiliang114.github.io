---
title: NodeJS
date: '2020-10-26'
draft: true
---

### node.js stream 和 buffer 有什么区别?

- buffer: 为数据缓冲对象，是一个类似数组结构的对象，可以通过指定开始写入的位置及写入的数据长度，往其中写入二进制数据
- stream: 是对 buffer 对象的高级封装，其操作的底层还是 buffer 对象，stream 可以设置为可读、可写，或者即可读也可写，在 nodejs 中继承了 EventEmitter 接口，可以监听读入、写入的过程。具体实现有文件流，http-response 等

### stream 的异步

request 会返回一个可读流， 可以直接使用 pipe 函数，但是因为 pipe 函数是一个异步操作，如果 pipe 操作写一个
可写流，不能直接使用 await 进行同步执行，stream 有一个 finish 事件，表示 pipe 操作的完成，这样就不会出现在 pipe 操作还没有结束的时候，另外的读取文件操作会显示文件长度为 0 的问题。

```js
function getFileFromUrl(url, filename) {
  return new Promise(resolve => {
    request(url)
      .pipe(fs.createWriteStream(filename))
      .on('finish', resolve);
  });
}
```

### node 文件的读和写

如果 node 文件不是很大的话， 可以直接通过 fs 的 readFile 和 writeFile 进行操作，但是如果文件比较大的话，就推荐直接使用 stream 进行操作了。
