---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### fill

创建有 n 个元素，并且默认值都是 m 的数组： `var a = (new Array(n)).fill(m)`

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

### Array.prototype.map 的第二个参数

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

### 数组的哪些操作会改变数组？

- pop
- push
- shift
- unshift
- sort
- reverse
- splice(删除)

### 请说明下列方法功能：

| 方法             | 功能                                                                  | 是否改变原数组 | 备注             |
| ---------------- | --------------------------------------------------------------------- | -------------- | ---------------- |
| push             | 添加元素到数组的末尾                                                  | √              |                  |
| pop              | 删除数组末尾的元素                                                    | √              |                  |
| shift            | 删除数组头部的元素                                                    | √              | 第一次写错啦     |
| unshift          | 添加元素到数组的头部                                                  | √              | 第一次写错啦     |
| splice(pos,n)    | 通过索引,从 pos 位置开始删除 n 个元素                                 | √              | 第一次写错啦     |
| slice(start,end) | 返回一个新的数组，包含从`start`到`end`(不包括该元素）的数组中的元素。 | ×              | 和 splice 记混啦 |
| sort             | 数组排序                                                              | √              |                  |
| reverse          | 数组倒序                                                              | √              | 是改变原数组的   |
| slice()          | 复制整个数组                                                          | ×              |                  |
| indexOf          | 找出某个元素在数组中的索引                                            | ×              |                  |

### 数组 Array 对象常用方法

修改器方法
下面的这些方法会**改变调用它们的对象自身的值**：

- Array.prototype.pop()
  - 删除数组的最后一个元素，并返回这个元素。
- Array.prototype.push()

  - 在数组的末尾增加一个或多个元素，并返回数组的新长度。

- Array.prototype.shift()
  - 删除数组的第一个元素，并返回这个元素。
- Array.prototype.unshift()

  - 在数组的开头增加一个或多个元素，并返回数组的新长度。

- Array.prototype.splice()

  - 在任意的位置给数组添加或删除任意个元素。

- Array.prototype.reverse()
  - 颠倒数组中元素的排列顺序，即原先的第一个变为最后一个，原先的最后一个变为第一个。
- Array.prototype.sort()

  - 对数组元素进行排序，并返回当前数组。

- Array.prototype.fill()
  - 将数组中指定区间的所有元素的值，都替换成某个固定的值。
- Array.prototype.copyWithin()
  - 在数组内部，将一段元素序列拷贝到另一段元素序列上，覆盖原有的值。

访问方法
下面的这些方法绝对不会改变调用它们的对象的值，只会返回一个新的数组或者返回一个其它的期望值。

- Array.prototype.join()
  - 连接所有数组元素组成一个字符串。把数组中的所有元素放入一个字符串中
- Array.prototype.slice()
  - 抽取当前数组中的一段元素组合成一个新数组。
- Array.prototype.concat()

  - 返回一个由当前数组和其它若干个数组或者若干个非数组值组合而成的新数组。

- Array.prototype.includes()

  - 判断当前数组是否包含某指定的值，如果是返回 true，否则返回 false。

- Array.prototype.indexOf()
  - 返回数组中第一个与指定值相等的元素的索引，如果找不到这样的元素，则返回 -1。
- Array.prototype.lastIndexOf()

  - 返回数组中最后一个（从右边数第一个）与指定值相等的元素的索引，如果找不到这样的元素，则返回 -1。

- Array.prototype.toSource()
  - 返回一个表示当前数组字面量的字符串。遮蔽了原型链上的 Object.prototype.toSource() 方法。
- Array.prototype.toString()
  - 返回一个由所有数组元素组合而成的字符串。遮蔽了原型链上的 Object.prototype.toString() 方法。
- Array.prototype.toLocaleString()
  - 返回一个由所有数组元素组合而成的本地化后的字符串。遮蔽了原型链上的 Object.prototype.toLocaleString() 方法。

迭代方法

在下面的众多遍历方法中，有很多方法都需要指定一个回调函数作为参数。在每一个数组元素都分别执行完回调函数之前，数组的 length 属性会被缓存在某个地方，所以，如果你在回调函数中为当前数组添加了新的元素，那么那些新添加的元素是不会被遍历到的。此外，如果在回调函数中对当前数组进行了其它修改，比如改变某个元素的值或者删掉某个元素，那么随后的遍历操作可能会受到未预期的影响。总之，不要尝试在遍历过程中对原数组进行任何修改，虽然规范对这样的操作进行了详细的定义，但为了可读性和可维护性，请不要这样做。

- Array.prototype.forEach()

  - 为数组中的每个元素执行一次回调函数。

- Array.prototype.map()
  - 返回一个由回调函数的返回值组成的新数组。
- Array.prototype.reduce()
  - 从左到右为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。
- Array.prototype.filter()

  - 将所有在过滤函数中返回 true 的数组元素放进一个新数组中并返回。

- Array.prototype.every()
  - 如果数组中的每个元素都满足测试函数，则返回 true，否则返回 false。
- Array.prototype.some()

  - 如果数组中至少有一个元素满足测试函数，则返回 true，否则返回 false。

- Array.prototype.find()
  - 找到第一个满足测试函数的元素并返回那个元素的值，如果找不到，则返回 undefined。
- Array.prototype.findIndex()
  - 找到第一个满足测试函数的元素并返回那个元素的索引，如果找不到，则返回 -1。
- Array.prototype.keys()
  - 返回一个数组迭代器对象，该迭代器会包含所有数组元素的键。
- Array.prototype.entries()
  - 返回一个数组迭代器对象，该迭代器会包含所有数组元素的键值对。

### Array 对象自带的排序函数底层是怎么实现的？

### map, filter, reduce

map, filter, reduce 各自有什么作用？

`map` 作用是生成一个新数组，遍历原数组，将每个元素拿出来做一些变换然后放入到新的数组中。

```
[1, 2, 3].map(v => v + 1) // -> [2, 3, 4]
```

另外 `map` 的回调函数接受三个参数，分别是当前索引元素，索引，原数组

```
['1','2','3'].map(parseInt)
```

- 第一轮遍历 `parseInt('1', 0) -> 1`
- 第二轮遍历 `parseInt('2', 1) -> NaN`
- 第三轮遍历 `parseInt('3', 2) -> NaN`

`filter` 的作用也是生成一个新数组，在遍历数组的时候将返回值为 `true` 的元素放入新数组，我们可以利用这个函数删除一些不需要的元素

```
let array = [1, 2, 4, 6]
let newArray = array.filter(item => item !== 6)
console.log(newArray) // [1, 2, 4]
```

和 `map` 一样，`filter` 的回调函数也接受三个参数，用处也相同。

最后我们来讲解 `reduce` 这块的内容，同时也是最难理解的一块内容。`reduce` 可以将数组中的元素通过回调函数最终转换为一个值。

如果我们想实现一个功能将函数里的元素全部相加得到一个值，可能会这样写代码

```
const arr = [1, 2, 3]
let total = 0
for (let i = 0; i < arr.length; i++) {
  total += arr[i]
}
console.log(total) //6
```

但是如果我们使用 `reduce` 的话就可以将遍历部分的代码优化为一行代码

```
const arr = [1, 2, 3]
const sum = arr.reduce((acc, current) => acc + current, 0)
console.log(sum)
```

对于 `reduce` 来说，它接受两个参数，分别是回调函数和初始值，接下来我们来分解上述代码中 `reduce` 的过程

- 首先初始值为 `0`，该值会在执行第一次回调函数时作为第一个参数传入
- 回调函数接受四个参数，分别为累计值、当前元素、当前索引、原数组，后三者想必大家都可以明白作用，这里着重分析第一个参数
- 在一次执行回调函数时，当前值和初始值相加得出结果 `1`，该结果会在第二次执行回调函数时当做第一个参数传入
- 所以在第二次执行回调函数时，相加的值就分别是 `1` 和 `2`，以此类推，循环结束后得到结果 `6`

想必通过以上的解析大家应该明白 `reduce` 是如何通过回调函数将所有元素最终转换为一个值的，当然 `reduce` 还可以实现很多功能，接下来我们就通过 `reduce` 来实现 `map` 函数

```
const arr = [1, 2, 3]
const mapArray = arr.map(value => value * 2)
const reduceArray = arr.reduce((acc, current) => {
  acc.push(current * 2)
  return acc
}, [])
console.log(mapArray, reduceArray) // [2, 4, 6]
```

如果你对这个实现还有困惑的话，可以根据上一步的解析步骤来分析过程。

### js 两个数组取差集

```js
arrayA.filter(key => !arrayB.includes(key));
```

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

### 列举一下 JavaScript 数组和对象有哪些原生方法？

- 数组：

  - arr.concat(arr1, arr2, arrn);
  - arr.join(",");
  - arr.sort(func);
  - arr.pop();
  - arr.push(e1, e2, en);
  - arr.shift();
  - unshift(e1, e2, en);
  - arr.reverse();
  - arr.slice(start, end);
  - arr.splice(index, count, e1, e2, en);
  - arr.indexOf(el);
  - arr.includes(el); // ES6

- 对象：
  - object.hasOwnProperty(prop);
  - object.propertyIsEnumerable(prop);
  - object.valueOf();
  - object.toString();
  - object.toLocaleString();
  - Class.prototype.isPropertyOf(object);

### Array.splice() 与 Array.splice() 的区别？

- slice -- “读取”数组指定的元素，不会对原数组进行修改

  - 语法：arr.slice(start, end)
  - start 指定选取开始位置（含）
  - end 指定选取结束位置（不含）

- splice

  - “操作”数组指定的元素，会修改原数组，返回被删除的元素
  - 语法：arr.splice(index, count, [insert Elements])
  - index 是操作的起始位置
  - count = 0 插入元素，count > 0 删除元素
  - [insert Elements] 向数组新插入的元素

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

### 21.有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣

Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()

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

### filter

```js
var b = [['A', 'B', 'C'], ['D', 'E'], ['F']];

// 获取二维数组铺平展开的下标值
spreadArrayIndex = array => {
  if (array instanceof Array && array[0] instanceof Array) {
    const indexResult = array.map((list, index) => {
      const target = list.filter((item, idx) => {
        if (item === value) {
          return idx;
        }
      });
      if (target.length !== 0) {
        return target[0];
      }
    });
    if (indexResult.length !== 0) {
      return indexResult[0];
    }
  }
};

// 获得二维数组的总长度
sumArrayNum = array => {
  // 二维数组
  if (array instanceof Array && array[0] instanceof Array) {
    const lengthArray = array.map(item => item.length);
    return lengthArray.reduce((total, num) => total + num);
  }
};

console.log();
var b = ['D', 'E'];
b.map((item, idx) => {
  console.log(item, idx, item === 'D');
  if (item === 'D') {
    console.log('D: ', idx);
    return idx;
  }
});

// 获取一维数组下标
var b = ['D', 'E'];
var idx = b.indexOf('D');
console.log(idx);

// 获取二维数组下标
var b = [['A', 'B', 'C'], ['D', 'E'], ['F']];
var target = b.filter(item => item.indexOf('D') > -1);
if (target && target[0]) {
  var idx1 = b.indexOf(target[0]);
  var idx2 = target[0].indexOf('D');
  console.log(idx1, idx2);
}
var total = 0;
for (var i = 0; i < idx1; i++) {
  total += b[i].length;
}
total += idx2 + 1;
console.log(total);

// 获取平铺之后二维数组下标
function spreadArrayIndex(array, value) {
  // var b = [['A', 'B', 'C'], ['D', 'E'], ['F']]
  if (array instanceof Array && array[0] instanceof Array) {
    var target = array.filter(item => item.indexOf(value) > -1);
    if (target && target[0]) {
      var idx1 = array.indexOf(target[0]);
      var idx2 = target[0].indexOf(value);
      // console.log(idx1, idx2)
    }
    var total = 0;
    for (var i = 0; i < idx1; i++) {
      total += array[i].length;
    }
    total += idx2 + 1;
    // console.log(total)
    return total;
  }
}

// 获取子元素是对象的二维数组平铺之后的下标
function spreadArrayObjectIndex(ArrayObject, value) {
  // var b = [[{ name: 'A' }, { name: 'B' }, { name: 'C' }], [{ name: 'D' }, { name: 'E' }], [{ name: 'F' }]]
  if (ArrayObject instanceof Array && ArrayObject[0] instanceof Array && ArrayObject[0][0] instanceof Object) {
    var targetX = ArrayObject.filter(xitem => {
      var result = xitem.map(yitem => yitem.name === value);
      return result.includes(true);
    });
    var idxX = ArrayObject.indexOf(targetX[0]);
    var targetY = targetX[0].filter(item => item.name === value);
    var idxY = targetX[0].indexOf(targetY[0]);

    // console.log(idxX, idxY)
    var total = 0;
    for (var i = 0; i < idxX; i++) {
      total += ArrayObject[i].length;
    }
    total += idxY;
    console.log(total);
    return total;
  }
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
