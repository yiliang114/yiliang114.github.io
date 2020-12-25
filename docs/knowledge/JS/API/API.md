---
title: API
date: '2020-10-26'
draft: true
---

## 数组

Array.isArray 的兼容性

- Array 的原生 API:
  - filter 默认返回的是一个数组， 无论有或者没有， 都是一个 []
  - find 如果没有找到内容，则返回 undefined， 如果找到则返回一个 item 不是一个数组
  - 清空数组
  - 数组去重的 n 种方式
  - Array 对象自带的排序函数底层是怎么实现的
  - 如何遍历一个对象的属性
  - reduce curry 等

### 创建数组的几种方法？ 有什么不同？数组可以直接通过 length 来指定长度，自动扩展，自动清空。

### JavaScript 怎么清空数组？

```
var ary = [1,2,3,4];
ary.splice(0,ary.length);
console.log(ary); // 输出 []，空数组，即被清空了
```

### map

map 作用是生成一个新数组，遍历原数组，将每个元素拿出来做一些变换然后返回一个新数组，原数组不发生改变。

map 的回调函数接受三个参数，分别是当前索引元素，索引，原数组

```js
var arr = [1, 2, 3];
var arr2 = arr.map(item => item + 1);
arr; //[ 1, 2, 3 ]
arr2; // [ 2, 3, 4 ]
```

```js
['1', '2', '3'].map(parseInt);
// -> [ 1, NaN, NaN ]
```

- 第一个 parseInt('1', 0) -> 1
- 第二个 parseInt('2', 1) -> NaN
- 第三个 parseInt('3', 2) -> NaN

### filter

filter 的作用也是生成一个新数组，在遍历数组的时候将返回值为 true 的元素放入新数组，我们可以利用这个函数删除一些不需要的元素

filter 的回调函数接受三个参数，分别是当前索引元素，索引，原数组

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

## 字符串

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

## 对象

for in, for of, foreach, map 之类的区别

### Object.defineProperty()

- 对象属性描述符
- configurable
- enumerable
- 数据描述符
  - value
  - writable
- 存取描述符
  - get
  - set

### setTimeout、setInterval

常见的定时器函数有 `setTimeout`、`setInterval`、`requestAnimationFrame`，但 setTimeout、setInterval 并不是到了哪个时间就执行，**而是到了那个时间把任务加入到异步事件队列中**。

因为 JS 是单线程执行的，如果某些同步代码影响了性能，就会导致 setTimeout 不会按期执行。

而 setInterval 可能经过了很多同步代码的阻塞，导致不正确了，可以使用 setTimeout 每次获取 Date 值，计算距离下一次期望执行的时间还有多久来动态的调整。

[requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame) 自带函数节流功能，基本可以保证在 16.6 毫秒内只执行一次（不掉帧的情况下），并且该函数的延时效果是精确的，没有其他定时器时间不准的问题

### JS 中有那些内置对象

- 数据封装类对象
  - String、Array、Object、Boolean、Number
- 其他对象
  - Math、Date、RegExp、Error、Function、Arguments
- ES6 新增对象
  - Promise、Map、Set、Symbol、Proxy、Reflect

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

### Set、Map、WeakSet 和 WeakMap 的区别？

#### Set

- 表示有没有，成员的值都是唯一的，没有重复的值
- 可以接受一个数组（或可迭代的数据结构）作为参数
- 注：两个对象总是不相等的

属性：

- Set.prototype.constructor：构造函数，默认就是 Set 函数。
- Set.prototype.size：返回 Set 实例的成员总数。

方法：

- add(value)：添加某个值，返回 Set 结构本身。
  - `s.add(1).add(2).add(2)`;
- delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- has(value)：返回一个布尔值，表示该值是否为 Set 的成员。
- clear()：清除所有成员，没有返回值。

遍历方法

- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回键值对的遍历器
- forEach()：使用回调函数遍历每个成员

#### WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合。但与 Set 有几个区别：

- WeakSet 的成员**只能是对象**，而不能是其他类型的值
- WeakSet 中的对象都是弱引用
  - 如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存
  - 垃圾回收机制依赖引用计数，如果一个值的引用次数不为 0，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。
- WeakSet 不可遍历
  - 由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的
- WeakSet 结构中没有 clear 方法。

#### Map

类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，**各种类型的值（包括对象）都可以当作 Map 的键**。

遍历方法
Map 结构原生提供三个遍历器生成函数和一个遍历方法。

- keys()：返回键名的遍历器。
- values()：返回键值的遍历器。
- entries()：返回所有成员的遍历器。
- forEach()：遍历 Map 的所有成员。

#### WeakMap

WeakMap 的设计目的在于: 有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用，而一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放被引用对象占用的内存。

基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。

一个典型应用**场景**是，在网页的 DOM 元素上添加数据，就可以使用 WeakMap 结构。当该 DOM 元素被清除，其所对应的 WeakMap 记录就会自动被移除。

### 其他

- Array.from 等函数的兼容性

* String.lastIndexOf()

  - 方法返回指定值（本例中的'.'）在调用该方法的字符串中最后出现的位置，如果没找到则返回 -1。对于'filename'和'.hiddenfile'，lastIndexOf 的返回值分别为 0 和-1 无符号右移操作符(»>)
  - 将-1 转换为 4294967295，将-2 转换为 4294967294，这个方法可以保证边缘情况时文件名不变

* String.prototype.slice()
  - 从上面计算的索引处提取文件的扩展名。如果索引比文件名的长度大，结果为""

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

### 你使用什么语句遍历对象的属性和数组的元素？

**对象：**

- `for`循环：`for (var property in obj) { console.log(property); }`。但是，这还会遍历到它的继承属性，在使用之前，你需要加入`obj.hasOwnProperty(property)`检查。
- `Object.keys()`：`Object.keys(obj).forEach(function (property) { ... })`。`Object.keys()`方法会返回一个由一个给定对象的自身可枚举属性组成的数组。
- `Object.getOwnPropertyNames()`：`Object.getOwnPropertyNames(obj).forEach(function (property) { ... })`。`Object.getOwnPropertyNames()`方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括 Symbol 值作为名称的属性）组成的数组。

**数组：**

- `for` loops：`for (var i = 0; i < arr.length; i++)`。这里的常见错误是`var`是函数作用域而不是块级作用域，大多数时候你想要迭代变量在块级作用域中。ES2015 引入了具有块级作用域的`let`，建议使用它。所以就变成了：`for (let i = 0; i < arr.length; i++)`。
- `forEach`：`arr.forEach(function (el, index) { ... })`。这个语句结构有时会更精简，因为如果你所需要的只是数组元素，你不必使用`index`。还有`every`和`some`方法可以让你提前终止遍历。

大多数情况下，我更喜欢`.forEach`方法，但这取决于你想要做什么。`for`循环有更强的灵活性，比如使用`break`提前终止循环，或者递增步数大于一。

### Array

- map, filter, reduce

### hasOwnProperty

### 日期 Date

```js
var myDate = new Date();
myDate.getYear(); //获取当前年份(2位)
myDate.getFullYear(); //获取完整的年份(4位,1970-????)
myDate.getMonth(); //获取当前月份(0-11,0代表1月)
myDate.getDate(); //获取当前日(1-31)
myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
myDate.getHours(); //获取当前小时数(0-23)
myDate.getMinutes(); //获取当前分钟数(0-59)
myDate.getSeconds(); //获取当前秒数(0-59)
myDate.getMilliseconds(); //获取当前毫秒数(0-999)
myDate.toLocaleDateString(); //获取当前日期
var myTime = myDate.toLocaleTimeString(); //获取当前时间
myDate.toLocaleString(); //获取日期与时间
```

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

### `['1', '2', '3'].map(parseInt)` what & why ?

第一眼看到这个题目的时候，脑海跳出的答案是 [1, 2, 3]，但是**真正的答案是[1, NaN, NaN]**。

- 首先让我们回顾一下，map 函数的第一个参数 callback：

`var new_array = arr.map(function callback(currentValue[, index[, array]]) { // Return element for new_array }[, thisArg])`
这个 callback 一共可以接收三个参数，其中第一个参数代表当前被处理的元素，而第二个参数代表该元素的索引。

- 而 parseInt 则是用来解析字符串的，使字符串成为指定基数的整数。
  `parseInt(string, radix)`
  接收两个参数，第一个表示被处理的值（字符串），第二个表示为解析时的基数。
- 了解这两个函数后，我们可以模拟一下运行情况

1. parseInt('1', 0) //radix 为 0 时，且 string 参数不以“0x”和“0”开头时，按照 10 为基数处理。这个时候返回 1
2. parseInt('2', 1) //基数为 1（1 进制）表示的数中，最大值小于 2，所以无法解析，返回 NaN
3. parseInt('3', 2) //基数为 2（2 进制）表示的数中，最大值小于 3，所以无法解析，返回 NaN

- map 函数返回的是一个数组，所以最后结果为[1, NaN, NaN]

在 30-seconds-of-code 看到一个这个题的变形，分享一下

```js
let unary = fn => val => fn(val);
let parse = unary(parseInt);
console.log(['1.1', '2', '0.3'].map(parse));
```

这是今天在 [Advanced-Frontend 组织](https://github.com/Advanced-Frontend/Daily-Note-Question) 看到一个比较有意思的题目。
主要是讲**JS 的映射与解析**
早在 2013 年, 加里·伯恩哈德就在微博上发布了以下代码段:

```js
['10', '10', '10', '10', '10'].map(parseInt);
// [10, NaN, 2, 3, 4]
```

#### parseInt

`parseInt()` 函数解析一个字符串参数，并返回一个指定基数的整数 (数学系统的基础)。

```
const intValue = parseInt(string[, radix]);
```

`string` 要被解析的值。如果参数不是一个字符串，则将其转换为字符串(使用 ToString 抽象操作)。字符串开头的空白符将会被忽略。

`radix` 一个介于 2 和 36 之间的整数(数学系统的基础)，表示上述字符串的基数。默认为 10。
`返回值` 返回一个整数或 NaN

```js
parseInt(100); // 100
parseInt(100, 10); // 100
parseInt(100, 2); // 4 -> converts 100 in base 2 to base 10
```

**注意：**
在`radix`为 undefined，或者`radix`为 0 或者没有指定的情况下，JavaScript 作如下处理：

- 如果字符串 string 以"0x"或者"0X"开头, 则基数是 16 (16 进制).
- 如果字符串 string 以"0"开头, 基数是 8（八进制）或者 10（十进制），那么具体是哪个基数由实现环境决定。ECMAScript 5 规定使用 10，但是并不是所有的浏览器都遵循这个规定。因此，永远都要明确给出 radix 参数的值。
- 如果字符串 string 以其它任何值开头，则基数是 10 (十进制)。

#### map

`map()` 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。

```js
var new_array = arr.map(function callback(currentValue[,index[, array]]) {
 // Return element for new_array
 }[, thisArg])
```

可以看到`callback`回调函数需要三个参数, 我们通常只使用第一个参数 (其他两个参数是可选的)。
`currentValue` 是 callback 数组中正在处理的当前元素。
`index`可选, 是 callback 数组中正在处理的当前元素的索引。
`array`可选, 是 callback map 方法被调用的数组。
另外还有`thisArg`可选, 执行 callback 函数时使用的 this 值。

```js
const arr = [1, 2, 3];
arr.map(num => num + 1); // [2, 3, 4]
```

#### 回到真实的事例上

回到我们真实的事例上

```js
['1', '2', '3'].map(parseInt);
```

对于每个迭代`map`, `parseInt()`传递两个参数: **字符串和基数**。
所以实际执行的的代码是：

```js
['1', '2', '3'].map((item, index) => {
  return parseInt(item, index);
});
```

即返回的值分别为：

```js
parseInt('1', 0); // 1
parseInt('2', 1); // NaN
parseInt('3', 2); // NaN, 3 不是二进制
```

所以：

```js
['1', '2', '3'].map(parseInt);
// 1, NaN, NaN
```

由此，加里·伯恩哈德例子也就很好解释了，这里不再赘述

```js
['10', '10', '10', '10', '10'].map(parseInt);
// [10, NaN, 2, 3, 4]
```

#### 如何在现实世界中做到这一点

如果您实际上想要循环访问字符串数组, 该怎么办？ `map()`然后把它换成数字？使用编号!

```js
['10', '10', '10', '10', '10'].map(Number);
// [10, 10, 10, 10, 10]
```

### bind 源码的实现

```js
    Function.prototype.myCall = function (obj) {
      obj.fn = thislet args = [...arguments].splice(1)
      let result = obj.fn(...args)
      delete obj.fn
      return result
    }

    Function.prototype.myApply = function (obj) {
      obj.fn = thislet args = arguments[1]
      let result
      if (args) {
        result = obj.fn(...args)
      } else {
        result = obj.fn()
      }

      delete obj.fn

      return result
    }

    Function.prototype.myBind = function (obj) {
      let context = obj || windowlet that = thislet _args = [...arguments].splice(1)

      returnfunction () {
        let args = arguments// 产生副作用// return obj.fn(..._args, ...args)return that.apply(context, [..._args, ...args])
      }
    }

    functionmyFun (argumentA, argumentB) {
      console.log(this.value)
      console.log(argumentA)
      console.log(argumentB)
      returnthis.value
    }

    let obj = {
      value: 'ziyi2'
    }
    console.log(myFun.myCall(obj, 11, 22))
    console.log(myFun.myApply(obj, [11, 22]))
    console.log(myFun.myBind(obj, 33)(11, 22))

```

### js 对象校验是否含有多个键值

```js
['id', 'name', 'check'].every(key => Object.keys(project).includes(key));
```

### js 两个数组取差集

```js
arrayA.filter(key => !arrayB.includes(key));
```
