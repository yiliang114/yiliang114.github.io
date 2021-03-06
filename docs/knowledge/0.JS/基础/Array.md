---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 判断数组的方式

1. Object.prototype.toString.call()
2. instanceof
3. Array.isArray()

性能方面：判断数据 Array.isArray() 性能最好，instanceof 次之，Object.prototype.toString.call() 第三
功能方面：`Object.prototype.toString.call()` 所有的类型都可以判断, 可以理解为是 100% 准确。

`Object.prototype.toString.call()` 能够得到的值, 8 种: number, boolean, string, undefined, symbol, object, function, bigint。

instanceof 只能判断对象原型，原始类型不可以。

```js
[] instanceof Object; // true
```

Array.isArray 优于 instanceof ，因为 Array.isArray 可以检测出 frames, Array.isArray() 是 ES5 新增的方法，当使用 ie8 的时候就会出现问题。当不存在 Array.isArray() ，可以用 Object.prototype.toString.call() 实现。

如果浏览器支持 Array.isArray()可以直接判断否则需进行必要判断

```js
function isArray(value) {
  // ECMAScript 5 feature
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
}
```

#### 2. instanceof

`instanceof` 的内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`。

使用 `instanceof`判断一个对象是否为数组，`instanceof` 会判断这个对象的原型链上是否会找到对应的 `Array` 的原型，找到返回 `true`，否则返回 `false`。

```js
[] instanceof Array; // true
```

但 `instanceof` 只能用来判断对象类型，原始类型不可以。并且所有对象类型 instanceof Object 都是 true。

```js
[] instanceof Object; // true
```

### ['1', '2', '3'].map(parseInt)

map 会给函数传递 3 个参数： (elem, index, array) 而 parseInt 接收两个参数(sting, radix)，其中 radix 代表进制。省略 radix 或 radix = 0，则数字将以十进制解析。 因此，map 遍历 ["1", "2", "3"]，相应 parseInt 接收参数如下

```js
parseInt('1', 0); // 1
parseInt('2', 1); // NaN
parseInt('3', 2); // NaN
```

因为二进制里面，没有数字 3,导致出现超范围的 radix 赋值和不合法的进制解析，才会返回 NaN 所以["1", "2", "3"].map(parseInt) 答案也就是：[1, NaN, NaN]

### Array(...)和 Array.of(...) 的区别

Array(...)的作用是接受参数返回一个数组，但是有一个陷阱，如果只传入一个参数，并且这个参数是数 字的话，那么不会构造一个值为这个数字的单个元素的数组，而是构造一个空数组

```js
var a = Array(3);
a.length; // 3
a[0]; // undefined
```

Array.of(..)解决掉了这个陷阱

```js
var b = Array.of(3);
b.length; // 1
b[0]; // 3
var c = Array.of(1, 2, 3);
c.length; // 3
c; // 1,2,3
```

### Array 对象自带的排序函数 sort 底层是怎么实现的？

长度小于多少的时候采用 ？ 大于多少的时候采用 ？

### 创建数组的几种方法

有什么不同？数组可以直接通过 length 来指定长度，自动扩展，自动清空。

### 类数组对象转换为数组

类数组对象：只包含使用从零开始，且自然递增的整数做键名，并且定义了 length 表示元素个数的对象，我们就认为他是类数组对象！类数组对象可以进行读写操作和遍历操作。

```js
var arrLike = {
  length: 4,
  2: 'foo',
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
const nodeList = document.querySelectorAll('*');
console.log(Array.isArray(nodeList));
```

3. 字符串 String

```js
const array = Array.from('abc');
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
console.log(Array.from(''));
//[]
```

### 清空数组

```js
var ary = [1, 2, 3, 4];
ary.splice(0, ary.length);
console.log(ary); // 输出 []，空数组，即被清空了
```

### 使用 sort() 对数组 [3, 15, 8, 29, 102, 22] 进行排序，输出结果

[102, 15, 22, 29, 3, 8]

根据 MDN 上对 Array.sort()的解释，默认的排序方法会将数组元素转换为字符串，然后比较字符串中字符的 UTF-16 编码顺序来进行排序。所以'102' 会排在 '15' 前面。

### 用 Array 的 reduce 方法实现 map 方法（头条一面）

```js
const selfMap2 = function(fn, context) {
  let arr = Array.prototype.slice.call(this);
  // 这种实现方法和循环的实现方法有异曲同工之妙，利用reduce contact起数组中每一项
  // 不过这种有个弊端，会跳过稀疏数组中为空的项
  return arr.reduce((pre, cur, index) => {
    return [...pre, fn.call(context, cur, index, this)];
  }, []);
};
```

### 给出数组超过半数的数字，不存在的话输出没有（要求时间复杂度最低）

```js
function moreThanHalfNum(numbers) {
  // write code here
  var obj = {};
  var len = numbers.length;
  numbers.forEach(function(s) {
    if (obj[s]) {
      obj[s]++;
    } else {
      obj[s] = 1;
    }
  });
  for (var i in obj) {
    if (obj[i] > Math.floor(len / 2)) {
      return i;
    }
  }
  return 0;
}
```

### 取数组的最大值（ES5、ES6)

```js
// ES5 的写法
Math.max.apply(null, [14, 3, 77, 30]);

// ES6 的写法
Math.max(...[14, 3, 77, 30]);

// reduce
[14, 3, 77, 30].reduce((accumulator, currentValue) => {
  return (accumulator = accumulator > currentValue ? accumulator : currentValue);
});

let arr = [12, 3, 77, 30].sort((a, b) => b - a);
arr[0];
```

### 实现 flatten 扁平化函数

编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

```js
Array.from(new Set(arr.flat(Infinity))).sort((a, b) => {
  return a - b;
});
```

**竟然原生就有这个 flat 函数，用来拍平数组**
flat 函数的参数是层级。Infinity 无限大。 会拍平数组中的所有数组值。

递归实现

```js
function flatten(arr) {
  let temp = [];
  arr.map(item => {
    if (Array.isArray(item)) {
      temp.push(...flatten(item));
    } else {
      temp.push(item);
    }
  });
  return temp;
}
```

使用 es6 的 reduce 函数

```js
const flatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
```
