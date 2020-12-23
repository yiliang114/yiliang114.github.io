---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 如何理解 json

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。它是基于 JavaScript 的一个子集。数据格式简单, 易于读写, 占用带宽小。

### 如何在 JSON 中序列化以下对象？

```js
const a = {
  key1: Sysmnol(),
  key2: 0,
};
// 这个过程中发生了什么
console.log(Json.stringify(a));
```

返回 `{"key2":0}`
![](https://user-images.githubusercontent.com/21194931/61197363-06128f00-a707-11e9-8547-9a30d9904913.png)

所以 stringify 并不能将所有的数据类型在不丢失信息的情况下转换成字符串，上面的 Map 就在转换的过程中变成了一对{}，解决方法就是用 stringify 可处理的数据结构替换 Map

### `XML`和`JSON`的区别？

1. 数据体积方面。JSON 相对于 XML 来讲，数据的体积小，传递的速度更快些。
2. 数据交互方面。JSON 与 JavaScript 的交互更加方便，更容易解析处理，更好的数据交互。
3. 数据描述方面。JSON 对数据的描述性比 XML 较差。
4. 传输速度方面。JSON 的速度要远远快于 XML。
