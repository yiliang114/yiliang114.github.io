---
title: String
date: '2020-10-26'
draft: true
---

### String.slice() 和 String.substring(),String.substr()的区别

Syntax: string.slice(start, stop);
Syntax: string.substring(start, stop);
返回一个字符串，左包含，右不包含

Syntax:String.substr(start, num);
返回字符串,包含 start 开始,num 为字符数

slice VS substring

相同：

1.  如果 start == stop,return 一个空字符串
2.  stop 如果被省略，则直接扫至字符串尾
3.  如果 start 或 stop 大于了字符串长度，则会被替换成字符串长度

不同：

substring():

- 1.如果 start > stop,则会交换这两个参数
- 2.如果 start or stop 是负数或 NaN，会把它当成 0 对待

slice():

- 1.如果 start > stop,不会交换这两个参数，返回空字符串””
- 2.如果 start,or stop 是负数，且绝对值小于字符串长度，则开头\结尾是 start\stop+字符串长度
- 3.如果 start or stop 是负数，且绝对值大于字符串长度，则当作 0 处理

### new String('a') 和 'a' 是一样的么?

### new String

JS 与其他面向对象语言一样有相应的构造器，比如说，可以通过以下两种方式来创建一个字符串：

```js
var a = 'woot';
var b = new String('woot');
a + b; // => 'wootwoot'
```

然而要是对这两个变量使用 typeof 和 instanceof 操作符，事情就变得有意思了：

```js
typeof a; // string
typeof b; // object
a instanceof String; // false
b instanceof String; // true
```

而事实上，这两个变量值绝对都是货真价实的字符串：

```js
a.substr == b.substr;
```

而且使用 == 操作符判定两者相等，而使用 === 操作符判定时并不相同：

```js
a == b; // true
a === b; // false
```

另外值得注意的是， typeof 不会把 null 识别为类型 null：

```js
typeof null == 'object'; // 很不幸，结果为 true
```

数组也不例外，就算是通过 [] 这种方式定义数组也是如此：

```js
typeof [] == 'object'; // 很不幸，结果为 true
```

### String 和 string 有什么区别？

String 是构造函数，而"string"是变量的一种类型

```js
typeof String; // "function"
typeof string; // "undefined"
typeof 'string'; // "string"
```
