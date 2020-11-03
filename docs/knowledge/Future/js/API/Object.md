---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### defineProperty

#### defineProperty, hasOwnProperty, propertyIsEnumerable 都是做什么用的？

Object.defineProperty(obj, prop, descriptor)用来给对象定义属性,有 value,writable,configurable,enumerable,set/get 等.hasOwnProerty 用于检查某一属性是不是存在于对象本身，继承来的父亲的属性不算．propertyIsEnumerable 用来检测某一属性是否可遍历，也就是能不能用 for..in 循环来取到

### Object.is() 与原来的比较操作符 ===、== 的区别？

- == 相等运算符，比较时会自动进行数据类型转换
- === 严格相等运算符，比较时不进行隐式类型转换
- Object.is 同值相等算法，在 === 基础上对 0 和 NaN 特别处理

```
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

### 说一说 es5 中 object 是如何存储的？

```js
var name = 'hehe';
var age = 27;
var job;
var arr = [1, 2, 3, 4];
var obj = { name: 'hehe', age: 27 };
```

这些都是如何存储的？

![值的存储](../images/object-store.png)

> 如果给定的字符串是回文，返回 true，反之，返回 false。
> 如果一个字符串忽略标点符号、大小写和空格，正着读和反着读一模一样，那么这个字符串就是 palindrome(回文)。

> 注意你需要去掉字符串多余的标点符号和空格，然后把字符串转化成小写来验证此字符串是否为回文。

```
function palindrome(str) {
  // Good luck!
  str = str.toLowerCase();
  var array = str.split("");

  var array1 = array.filter(function(ch) {
    return 'A'<=ch && ch <= 'z' || 1<=ch && ch <=9;
  });

  var re = true;
  for(var i=0, len = array1.length; i<=Math.floor(len/2); i++){
    if(array1[i] != array1[len-i-1]){
      re = false;
    }
  }
  return re;
}

palindrome("eye");
```

### Object.freeze 和 Object.seal 的区别

Object.preventExtension：禁止对象添加新属性并保留已有属性;
Object.seal：在一个现有对象上调用 Object.preventExtensions(..) 并把所有现有属性标记为 configurable:false;
Object.freeze：在一个现有对象上调用 Object.seal(..) 并把所有“数据访问”属性标记为 writable:false。
