---
title: Error
date: 2020-12-26
draft: true
---

## JS 会出现的 Error

`TypeError`与`ReferenceError`的区别：

> `ReferenceError`： 如果 RHS 查询（取值查询）在所有前台的作用域中找寻不到所需的变量，引擎就会抛出`ReferenceError`异常。
> `ReferenceError`同作用域判别失败相关，而`TypeError`则代表作用域判别成功了，但是对结果的操作是非法或者不合理的。比如视图对一个非函数类型的值进行函数调用，或者引用`null`或`undefined`类型的值中的属性，那么引擎会抛出类型异常，`TypeError`.

### ReferenceError

没有声明的变量直接使用就会报 ReferenceError 错

```js
console.log(employeeId);
// ReferenceError: employeeId is not defined
```

### Cannot access 'b' before initialization

如果往外寻找变量能够找到，但是因为变量未提升，先使用后声明就会报错。但是如果变量能够提升，就会输出 undefined。

```js
function func() {
  function a() {
    console.log(b);
  }
  a();
  const b = 'bbb';
}
func();
// Cannot access 'b' before initialization
```

变量声明会提升， 赋值不会提升。

```js
console.log(employeeId);
var employeeId = '19000';
// undefined

(function() {
  console.log(typeof displayFunc);
  var displayFunc = function() {
    console.log('Hi I am inside displayFunc');
  };
})();
// undefined
```

内外作用域有同名的变量，就近原则。

```js
var employeeId = '1234abe';
(function() {
  console.log(employeeId);
  var employeeId = '122345';
})();
// undefined

var employeeId1 = '1234abe';
(function() {
  console.log(employeeId1);
  var employeeId1 = '122345';
  (function() {
    var employeeId1 = 'abc1234';
  })();
})();
// undefined
```

### TypeError

TypeError: Assignment to constant variable

常量的值在设定之后就不能再更改。

```js
const a = 2;
a = 3; // TypeError: Assignment to constant variable.
```
