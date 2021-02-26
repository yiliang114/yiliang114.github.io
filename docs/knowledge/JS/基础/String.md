---
title: String
date: '2020-10-26'
draft: true
---

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
