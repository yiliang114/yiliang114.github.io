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

![值的存储](https://wire.cdn-go.cn/wire-cdn/b23befc0/blog/images/object-store.png)

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

### js 对象校验是否含有多个键值

```js
['id', 'name', 'check'].every(key => Object.keys(project).includes(key));
```

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

### 你使用什么语句遍历对象的属性和数组的元素？

**对象：**

- `for`循环：`for (var property in obj) { console.log(property); }`。但是，这还会遍历到它的继承属性，在使用之前，你需要加入`obj.hasOwnProperty(property)`检查。
- `Object.keys()`：`Object.keys(obj).forEach(function (property) { ... })`。`Object.keys()`方法会返回一个由一个给定对象的自身可枚举属性组成的数组。
- `Object.getOwnPropertyNames()`：`Object.getOwnPropertyNames(obj).forEach(function (property) { ... })`。`Object.getOwnPropertyNames()`方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括 Symbol 值作为名称的属性）组成的数组。

**数组：**

- `for` loops：`for (var i = 0; i < arr.length; i++)`。这里的常见错误是`var`是函数作用域而不是块级作用域，大多数时候你想要迭代变量在块级作用域中。ES2015 引入了具有块级作用域的`let`，建议使用它。所以就变成了：`for (let i = 0; i < arr.length; i++)`。
- `forEach`：`arr.forEach(function (el, index) { ... })`。这个语句结构有时会更精简，因为如果你所需要的只是数组元素，你不必使用`index`。还有`every`和`some`方法可以让你提前终止遍历。

大多数情况下，我更喜欢`.forEach`方法，但这取决于你想要做什么。`for`循环有更强的灵活性，比如使用`break`提前终止循环，或者递增步数大于一。

### 如何防止在 JavaScript 中修改对象 ?

```js
var employee = {
  name: 'yiliang',
};

//Freeze the object
Object.freeze(employee);

// Seal the object
Object.seal(employee);

console.log(Object.isExtensible(employee)); // false
console.log(Object.isSealed(employee)); // true
console.log(Object.isFrozen(employee)); // true

employee.name = 'xyz'; // fails silently unless in strict mode
employee.age = 30; // fails silently unless in strict mode
delete employee.name; // fails silently unless it's in strict mode
```

### 合并两个对象

```js
const merge = (toObj, fromObj) => Object.assign(toObj, fromObj);
```

```js
function merge(toObj, fromObj) {
  // Make sure both of the parameter is an object
  if (typeof toObj === 'object' && typeof fromObj === 'object') {
    for (var pro in fromObj) {
      // Assign only own properties not inherited properties
      if (fromObj.hasOwnProperty(pro)) {
        // Assign property and value
        toObj[pro] = fromObj[pro];
      }
    }
  } else {
    throw 'Merge function can apply only on object';
  }
}
```

```js
/**
 * 判断对象是否为函数，如果当前运行环境对可调用对象（如正则表达式）
 * 的typeof返回'function'，采用通用方法，否则采用优化方法
 *
 * @param {Any} arg 需要检测是否为函数的对象
 * @return {boolean} 如果参数是函数，返回true，否则false
 */
function isFunction(arg) {
  if (arg) {
    if (typeof /./ !== 'function') {
      return typeof arg === 'function';
    } else {
      return Object.prototype.toString.call(arg) === '[object Function]';
    }
  } // end if
  return false;
}
```
