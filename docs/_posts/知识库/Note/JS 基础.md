---
title: JS 基础
date: "2020-10-26"
draft: true
---

## use strict

`use strict` 严格模式 （strict mode） 使得 Javascript 在更严格的条件下运行。

目的，主要有以下几个：

1. 使 JS 编码更加规范化的模式，消除 Javascript 语法的一些不合理、不严谨之处，减少一些怪异行为;
2. 消除代码运行的一些不安全之处，保证代码运行的安全；
3. 提高编译器效率，增加运行速度；
4. 为未来新版本的 Javascript 做好铺垫。

注：经过测试 IE6,7,8,9 均不支持严格模式。

**优点：**

- 无法再意外创建全局变量。
- 会使引起静默失败（silently fail，即：不报错也没有任何效果）的赋值操抛出异常。
- 试图删除不可删除的属性时会抛出异常（之前这种操作不会产生任何效果）。
- 要求函数的参数名唯一。
- 全局作用域下，`this`的值为`undefined`。
- 捕获了一些常见的编码错误，并抛出异常。
- 禁用令人困惑或欠佳的功能。

**缺点：**

- 缺失许多开发人员已经习惯的功能。
- 无法访问`function.caller`和`function.arguments`。
- 以不同严格模式编写的脚本合并后可能导致问题。
- 现在网站的 JS 都会进行压缩，一些文件用了严格模式，而另一些没有。这时这些本来是严格模式的文件，被 merge 后，这个串就到了文件的中间有指示严格模式，反而在压缩后浪费了字节。

## options 请求

<!-- https://www.imqianduan.com/nginx/preflight-options.html -->

## nginx 日志搜索

```
`tail -f /data/log/nginx/test.access.log|grep '/cockpit/cgi' -5`
```

## JS 会出现的 Error

### ReferenceError

如果 RHS 查询（取值查询）在所有前台的作用域中找寻不到所需的变量，引擎就会抛出`ReferenceError`异常

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
  const b = "bbb";
}
func();
// Cannot access 'b' before initialization
```

```js
var a = 100;
if (1) {
  a = 10;
  // 在当前块作用域中存在 a 使用 let/const 声明的情况下，给 a 赋值 10 时，只会在当前作用域找变量 a，
  // 而这时，还未到声明时候，所以控制台 ReferenceError: Cannot access 'a' before initialization
  let a = 1;
}
```

变量声明会提升， 赋值不会提升。

```js
console.log(employeeId);
var employeeId = "19000";
// undefined

(function () {
  console.log(typeof displayFunc);
  var displayFunc = function () {
    console.log("Hi I am inside displayFunc");
  };
})();
// undefined
```

内外作用域有同名的变量，就近原则。

```js
var employeeId = "1234abe";
(function () {
  console.log(employeeId);
  var employeeId = "122345";
})();
// undefined

var employeeId1 = "1234abe";
(function () {
  console.log(employeeId1);
  var employeeId1 = "122345";
  (function () {
    var employeeId1 = "abc1234";
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

TypeError`则代表作用域判别成功了，但是对结果的操作是非法或者不合理的。比如视图对一个非函数类型的值进行函数调用，或者引用`null`或`undefined`类型的值中的属性，那么引擎会抛出类型异常，`TypeError`.

## 实现 a === 1 && a === 2 && a === 3) === true

可以采用数据劫持来实现

```js
let current = 0;
Object.defineProperty(window, "a", {
  get() {
    current++;
    return current;
  },
});
console.log(a === 1 && a === 2 && a === 3); // true
```

## babel

### plugin 插件

- 按需加载插件的实现原理
- (vue 的) jsx 插件的实现原理

### babel 在转义的时候一些问题

babel 在 转义 const 的时候 会转成什么 但是 在运行的时候 为什么会有 const 的属性...

const 属性被编译成 var 的之后，属性会被一个 `_readOnlyError` 函数包起来，修改值的时候 就会 throw 一个 Error

## 为什么很多人宁可使用 for 循环也不愿意使用扩展运算符 ？

## 数组

### 类数组对象转换为数组

类数组对象：只包含使用从零开始，且自然递增的整数做键名，并且定义了 length 表示元素个数的对象，我们就认为他是类数组对象！类数组对象可以进行读写操作和遍历操作。

```js
var arrLike = {
  length: 4,
  2: "foo",
};
```

要将其转换为真正的数组可以使用各种 Array.prototype 方法(map(..)、indexOf(..) 等)

```js
var arr = Array.prototype.slice.call(arrLike);
var arr2 = arr.slice();
var arr = Array.from(arrLike);
```

常见的类数组:

1. arguments

```js
console.log(Array.isArray(arguments)); //false
console.log(arguments);
//node打印: {}
//chrome打印: Arguments [callee: ƒ, Symbol(Symbol.iterator): ƒ]
//因为arguments具有Symbol.iterator属性，所以它可以用扩展运算符(...arguments) 或 其他�使用迭代器的方法
```

2. dom 中

```js
//仅限浏览器中
const nodeList = document.querySelectorAll("*");
console.log(Array.isArray(nodeList));
```

3. 字符串 String

```js
const array = Array.from("abc");
console.log(array);
//["a", "b", "c"]
```

4. TypedArray

```js
const typedArray = new Int8Array(new ArrayBuffer(3));
console.log(Array.isArray(typedArray));
//false
```

5. {length:0} 是类数组的特殊情况，转换时可以执行成功，返回空数组[]

```js
console.log(Array.from({ length: 0 }));
//[]
console.log(Array.from(""));
//[]
```

### 清空数组

```js
var ary = [1, 2, 3, 4];
ary.splice(0, ary.length);
console.log(ary); // 输出 []，空数组，即被清空了
```

### 取数组的最大值（ES5、ES6)

```js
// ES5 的写法
Math.max.apply(null, [14, 3, 77, 30]);

// ES6 的写法
Math.max(...[14, 3, 77, 30]);

// reduce
[14, 3, 77, 30].reduce((accumulator, currentValue) => {
  return (accumulator =
    accumulator > currentValue ? accumulator : currentValue);
});

let arr = [12, 3, 77, 30].sort((a, b) => b - a);
arr[0];
```
