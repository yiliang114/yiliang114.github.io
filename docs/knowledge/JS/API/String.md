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

---

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

### js 的字符串类型有哪些方法？ replace

### new String('a') 和 'a' 是一样的么?

### 原生 js 字符串方法有哪些？

简单分为获取类方法，获取类方法有 charAt 方法用来获取指定位置的字符，获取指定位置字符的 unicode 编码的 charCodeAt 方法，
与之相反的 fromCharCode 方法，通过传入的 unicode 返回字符串。查找类方法有 indexof()、lastIndexOf()、search()、match()
方法。截取类的方法有 substring、slice、substr 三个方法，其他的还有 replace、split、toLowerCase、toUpperCase 方法。

### 原生 js 字符串截取方法有哪些？有什么区别？

js 字符串截取方法有 substring、slice、substr 三个方法，substring 和 slice 都是指定截取的首尾索引值，不同的是传递负值的时候
substring 会当做 0 来处理，而 slice 传入负值的规则是-1 指最后一个字符，substr 方法则是第一个参数是开始截取的字符串，第二个是截取的字符数量，
和 slice 类似，传入负值也是从尾部算起的。

### 字符串常用 API

- String.prototype.split()
  - 通过分离字符串成字串，将字符串对象分割成字符串数组。将一个字符串分割为子字符串，将结果作为字符串数组返回，若字符串中存在多个分割符号，亦可分割。
- String.prototype.slice(start, end)

  - 摘取一个字符串区域，返回一个新的字符串。

- String.prototype.substr(start, len)
  - 通过指定字符数返回在指定位置开始的字符串中的字符。
- String.prototype.substring()

  - 返回在字符串中指定两个下标之间的字符。

- String.prototype.trim()
  - 从字符串的开始和结尾去除空格
- String.prototype.concat()

  - 连接两个字符串文本，并返回一个新的字符串。

- String.prototype.match()
  - 使用正则表达式与字符串相比较。
- String.prototype.replace()
  - 被用来在正则表达式和字符串直接比较，然后用新的子串来替换被匹配的子串。
- String.prototype.search()
  - 对正则表达式和指定字符串进行匹配搜索，返回第一个出现的匹配项的下标。
- String.prototype.toString()
  - 返回用字符串表示的特定对象。重写 Object.prototype.toString 方法。
