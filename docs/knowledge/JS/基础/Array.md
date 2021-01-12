---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

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

### 数组

Array.isArray 的兼容性
Array 对象自带的排序函数底层是怎么实现的
如何遍历一个对象的属性
创建数组的几种方法？ 有什么不同？数组可以直接通过 length 来指定长度，自动扩展，自动清空。

### JavaScript 怎么清空数组？

```js
var ary = [1, 2, 3, 4];
ary.splice(0, ary.length);
console.log(ary); // 输出 []，空数组，即被清空了
```

### reduce

reduce 可以将数组中的元素通过回调函数最终转换为一个值。
如果我们想实现一个功能将函数里的元素全部相加得到一个值，可能会这样写代码

```js
const arr = [1, 2, 3];
let total = 0;
for (let i = 0; i < arr.length; i++) {
  total += arr[i];
}
console.log(total); //6
```

但是如果我们使用 reduce 的话就可以将遍历部分的代码优化为一行代码

```js
const arr = [1, 2, 3];
const sum = arr.reduce((acc, current) => acc + current, 0);
console.log(sum);
```

对于 reduce 来说，它接受两个参数，分别是回调函数和初始值，接下来我们来分解上述代码中 reduce 的过程

- 首先初始值为 0，该值会在执行第一次回调函数时作为第一个参数传入
- 回调函数接受四个参数，分别为累计值、当前元素、当前索引、原数组，后三者想必大家都可以明白作用，这里着重分析第一个参数
- 在一次执行回调函数时，当前值和初始值相加得出结果 1，该结果会在第二次执行回调函数时当做第一个参数传入
- 所以在第二次执行回调函数时，相加的值就分别是 1 和 2，以此类推，循环结束后得到结果 6。

### 用 reduce 实现 map 的功能

```js
Array.prototype.map = function(callback) {
  const array = this;
  return array.reduce((acc, cur, index) => {
    acc.push(callback(cur, index, array));
    return acc;
  }, []);
};
```

测试：

```js
var m = [1, 2, 3, 4, 5].map(function(v, i, arr) {
  return v + v;
});
console.log(m);
```

```js
var array = [
  {
    selector: 'sss',
    rules: 'rrrr',
  },
  {
    selector: 'sss2',
    rules: 'rrr3',
  },
];

function transform(array, key, value) {
  return array.reduce((obj, item) => {
    obj[item[key]] = (obj[item[key]] || []).concat(item[value]);
    return obj;
  }, {});
}

var tree = transform(array, 'selector', 'rules');

console.log(tree);
```

### Array 对象自带的排序函数底层是怎么实现的？

### Map、FlatMap 和 Reduce

`Map` 作用是生成一个新数组，遍历原数组，将每个元素拿出来做一些变换然后 `append` 到新的数组中。

```js
[1, 2, 3].map(v => v + 1);
// -> [2, 3, 4]
```

`Map` 有三个参数，分别是当前索引元素，索引，原数组

```js
['1', '2', '3'].map(parseInt);
//  parseInt('1', 0) -> 1
//  parseInt('2', 1) -> NaN
//  parseInt('3', 2) -> NaN
```

`FlatMap` 和 `map` 的作用几乎是相同的，但是对于多维数组来说，会将原数组降维。可以将 `FlatMap` 看成是 `map` + `flatten` ，目前该函数在浏览器中还不支持。

```js
[1, [2], 3].flatMap(v => v + 1);
// -> [2, 3, 4]
```

如果想将一个多维数组彻底的降维，可以这样实现

```js
const flattenDeep = arr => (Array.isArray(arr) ? arr.reduce((a, b) => [...a, ...flattenDeep(b)], []) : [arr]);

flattenDeep([1, [[2], [3, [4]], 5]]);
```

`Reduce` 作用是数组中的值组合起来，最终得到一个值

```js
function a() {
  console.log(1);
}

function b() {
  console.log(2);
}

[a, b].reduce((a, b) => a(b()));
// -> 2 1
```

### 请说明`.forEach`循环和`.map()`循环的主要区别，它们分别在什么情况下使用？

为了理解两者的区别，我们看看它们分别是做什么的。

**`forEach`**

- 遍历数组中的元素。
- 为每个元素执行回调。
- 无返回值。

```js
const a = [1, 2, 3];
const doubled = a.forEach((num, index) => {
  // 执行与 num、index 相关的代码
});

// doubled = undefined
```

**`map`**

- 遍历数组中的元素
- 通过对每个元素调用函数，将每个元素“映射（map）”到一个新元素，从而创建一个新数组。

```js
const a = [1, 2, 3];
const doubled = a.map(num => {
  return num * 2;
});

// doubled = [2, 4, 6]
```

`.forEach`和`.map()`的主要区别在于`.map()`返回一个新的数组。如果你想得到一个结果，但不想改变原始数组，用`.map()`。如果你只需要在数组上做迭代修改，用`forEach`。

### for in, for of, foreach, map 之类的区别

### flat 拍平数组

已知如下数组：

> `var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];`
>
> 编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

```js
Array.from(new Set(arr.flat(Infinity))).sort((a, b) => {
  return a - b;
});
```

**竟然原生就有这个 flat 函数，用来拍平数组**

### 有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣

Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()

性能方面：Array.isArray()性能最好，instanceof 次之，Object.prototype.toString.call()第三

功能方面：
`Object.prototype.toString.call()` 所有的类型都可以判断, instanceof 只能判断对象原型，原始类型不可以。

```js
[] instanceof Object; // true
```

Array.isArray 优于 instanceof ，因为 Array.isArray 可以检测出 iframes，Array.isArray()是 ES5 新增的方法，当不存在 Array.isArray() ，可以用 Object.prototype.toString.call() 实现

#### 1. Object.prototype.toString.call()

每一个继承 Object 的对象都有 `toString` 方法，如果 `toString` 方法没有重写的话，会返回 `[Object type]`，其中 type 为对象的类型。但当除了 Object 类型的对象外，其他类型直接使用 `toString` 方法时，会直接返回都是内容的字符串，所以我们需要使用 call 或者 apply 方法来改变 toString 方法的执行上下文。

```js
const an = ['Hello', 'An'];
an.toString(); // "Hello,An"
Object.prototype.toString.call(an); // "[object Array]"
```

这种方法对于所有基本的数据类型都能进行判断，即使是 null 和 undefined 。

```js
Object.prototype.toString.call('An'); // "[object String]"
Object.prototype.toString.call(1); // "[object Number]"
Object.prototype.toString.call(Symbol(1)); // "[object Symbol]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(function() {}); // "[object Function]"
Object.prototype.toString.call({ name: 'An' }); // "[object Object]"
```

`Object.prototype.toString.call()` 常用于判断浏览器内置对象时。

更多实现可见 [谈谈 Object.prototype.toString](https://juejin.im/post/591647550ce4630069df1c4a)

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

#### 3. Array.isArray()

- 功能：用来判断对象是否为数组

- instanceof 与 isArray

  当检测 Array 实例时，`Array.isArray` 优于 `instanceof` ，因为 `Array.isArray` 可以检测出 `iframes`

  ```js
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  xArray = window.frames[window.frames.length - 1].Array;
  var arr = new xArray(1, 2, 3); // [1,2,3]

  // Correctly checking for Array
  Array.isArray(arr); // true
  Object.prototype.toString.call(arr); // true
  // Considered harmful, because doesn't work though iframes
  arr instanceof Array; // false
  ```

- `Array.isArray()` 与 `Object.prototype.toString.call()`

  `Array.isArray()`是 ES5 新增的方法，当不存在 `Array.isArray()` ，可以用 `Object.prototype.toString.call()` 实现。

  ```js
  if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }
  ```

### Iterator 是什么，有什么作用？(重要)

- `Iterator`是`ES6`中一个很重要概念，它并不是对象，也不是任何一种数据类型。因为`ES6`新增了`Set`、`Map`类型，他们和`Array`、`Object`类型很像，`Array`、`Object`都是可以遍历的，但是`Set`、`Map`都不能用 for 循环遍历，解决这个问题有两种方案，一种是为`Set`、`Map`单独新增一个用来遍历的`API`，另一种是为`Set`、`Map`、`Array`、`Object`新增一个统一的遍历`API`，显然，第二种更好，`ES6`也就顺其自然的需要一种设计标准，来统一所有可遍历类型的遍历方式。`Iterator`正是这样一种标准。或者说是一种规范理念
- 就好像`JavaScript`是`ECMAScript`标准的一种具体实现一样，`Iterator`标准的具体实现是`Iterator`遍历器。`Iterator`标准规定，所有部署了`key`值为`[Symbol.iterator]`，且`[Symbol.iterator]`的`value`是标准的`Iterator`接口函数(标准的`Iterator`接口函数: 该函数必须返回一个对象，且对象中包含`next`方法，且执行`next()`能返回包含`value/done`属性的`Iterator`对象)的对象，都称之为可遍历对象，`next()`后返回的`Iterator`对象也就是`Iterator`遍历器

```js
//obj就是可遍历的，因为它遵循了Iterator标准，且包含[Symbol.iterator]方法，方法函数也符合标准的Iterator接口规范。
//obj.[Symbol.iterator]() 就是Iterator遍历器
let obj = {
  data: ['hello', 'world'],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false,
          };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  },
};
```

`ES6`给`Set`、`Map`、`Array`、`String`都加上了`[Symbol.iterator]`方法，且`[Symbol.iterator]`方法函数也符合标准的`Iterator`接口规范，所以`Set`、`Map`、`Array`、`String`默认都是可以遍历的

```js
//Array
let array = ['red', 'green', 'blue'];
array[Symbol.iterator]() //Iterator遍历器
array[Symbol.iterator]().next() //{value: "red", done: false}

//String
let string = '1122334455';
string[Symbol.iterator]() //Iterator遍历器
string[Symbol.iterator]().next() //{value: "1", done: false}

//set
let set = new Set(['red', 'green', 'blue']);
set[Symbol.iterator]() //Iterator遍历器
set[Symbol.iterator]().next() //{value: "red", done: false}

//Map
let map = new Map();
let obj= {map: 'map'};
map.set(obj, 'mapValue');
map[Symbol.iterator]().next()  {value: Array(2), done: false}

```

### 检查一个变量是否是数组?

- `Array.isArray(obj)`
  - ECMAScript 5 种的函数，当使用 ie8 的时候就会出现问题。
- `obj instanceof Array`
  - 当用来检测在不同的 window 或 iframe 里构造的数组时会失败。这是因为每一个 iframe 都有它自己的执行环境，彼此之间并不共享原型链，所以此时的判断一个对象是否为数组就会失败。此时我们有一个更好的方式去判断一个对象是否为数组。
- `Object.prototype.toString.call(obj) == '[object Array]'`
  - 这个方法比较靠谱
- `obj.constructor === Array`
  - constructor 属性返回对创建此对象的函数的引用

```js
function(value){
   // ECMAScript 5 feature
	if(typeof Array.isArray === 'function'){
		return Array.isArray(value);
	}else{
	   return Object.prototype.toString.call(value) === '[object Array]';
	}
}
```

如果浏览器支持 Array.isArray()可以直接判断否则需进行必要判断

```js
/**
 * 判断一个对象是否是数组，参数不是对象或者不是数组，返回false
 *
 * @param {Object} arg 需要测试是否为数组的对象
 * @return {Boolean} 传入参数是数组返回true，否则返回false
 */
function isArray(arg) {
  if (typeof arg === 'object') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return false;
}
```

### reduce

[mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

> `arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])` 如果没有提供 initialValue 则第一个值除外

发现一个有意思的东西？

```js
var files = ['111', '222', '333', '444'];
var result = files.reduce((content, filename) => {
  console.log('content', content);
  console.log('filename', filename);
  return content + filename;
}, '');
console.log(result);
```

```js
var files = ['111', '222', '333', '444'];
var result = files.reduce((content, filename) => {
  console.log('content', content);
  console.log('filename', filename);
  return content + filename;
});
console.log(result);
```

reduce
