---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

## for in

```js
const obj = {
  id: 1,
  name: 'zhangsan',
  age: 18,
};

for (let key in obj) {
  console.log(key + '---' + obj[key]);
}
```

### for in 的缺陷

`for in` 语句用来列举对象的属性(成员)，如下

```js
var obj = {
  name: 'jack',
  getName: function() {
    return this.name;
  },
};
//输出 name,getName
for (var atr in obj) {
  console.log(atr);
}
```

注意了吗，没有输出 obj 的 toString，valueOf 等内置属性（或称内置成员，隐藏属性和预定义属性）。即 `for in` 用来列举对象的显示成员（自定义成员）。

如果重写了内置属性呢，下面就重写 obj 的 toString

```js
var obj = {
  name: 'jack',
  getName: function() {
    return this.name;
  },
  toString: function() {
    return "I'm jack.";
  },
};
for (var atr in obj) {
  console.log(atr);
}
```

会输出什么呢？
1、IE6/7/8 下和没有重写 toString 一样，仍然只输出 name,getName
2、IE9/Firefox/Chrome/Opera/Safari 下则输出 name,getName,toString

如果给内置原型添加属性/方法，那么 for in 时也是可遍历的

```js
Object.prototype.clone = function() {};
var obj = {
  name: 'jack',
  age: 33,
};
// name, age, clone
for (var n in obj) {
  console.log(n);
}
```

给 Object.prototype 添加了方法 clone，for in 时所有浏览器都显示了 clone。

但有时我们为了兼容 ES5 或后续版本，会在不支持 ES5 的浏览器上（IE6/7/8）去扩展内置构造器的原型，这时 for in 在各浏览器中就不同了。如下

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(scope) {
    var fn = this;
    return function() {
      fn.apply(scope, arguments);
    };
  };
}
function greet(name) {
  console.log(this.greet + ', ' + name);
}
for (var n in greet) {
  console.log(n);
}
```

IE6/7/8 输出了 bind，其它浏览器则无。因为现代浏览器中 bind 是原生支持的，for in 不到，IE6/7/8 则是给 Function.prototype 添加了 bind。

总结下：在跨浏览器的设计中，我们不能依赖于 for in 来获取对象的成员名称，一般使用 hasOwnProperty 来判断下。

## for of

### for of 的原理

`for of` 通过方法调用(遍历器方法)来实现集合的遍历。数组、Maps、Sets 以及其他我们讨论过的对象之间有个共同点：有迭代器方法。

`for of` 工作原理：迭代器(iterator)有一个 next 方法，for 循环会不断调用这个 iterator.next 方法来获取下一个值,直到返回值中的 done 属性为 true 的时候结束循环。

Iterator 的作用有三个：

1. 为各种数据结构， 提供一个统一的、 简便的访问接口。
2. 使得数据结构的成员能够按某种次序排列；
3. ES6 创造了一种新的遍历命令 for...of 循环， Iterator 接口主要供 for...of 消费。

Iterator 的遍历过程是这样的:

4. 创建一个指针对象， 指向当前数据结构的起始位置。 也就是说， 遍历器对象本质上， 就是一个指针对象。
5. 第一次调用指针对象的 next 方法， 可以将指针指向数据结构的第一个成员。
6. 第二次调用指针对象的 next 方法， 指针就指向数据结构的第二个成员。
7. 不断调用指针对象的 next 方法， 直到它指向数据结构的结束位置。

每一次调用 next 方法， 都会返回数据结构的当前成员的信息。 具体来说， 就是返回一个包含 value 和 done 两个属性的对象。 其中， value 属性是当前成员的值， done 属性是一个布尔值， 表示遍历是否结束。

### Object 需要用到...运算符 与 for of 遍历怎么办呢?

如果我们要使用它的话，Object 身上需要有一个 Symbol.iterator 属性代码如下：

```js
let obj = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: function() {
    // index用来记遍历圈数
    let index = 0;
    let next = () => {
      return {
        value: this[index],
        done: this.length == ++index,
      };
    };
    return {
      next,
    };
  },
};

// console.log(obj.length)
console.log([...obj]); //(2) ["a", "b"]

for (let p of obj) {
  console.log(p); //"a"  "b"
}
```

## for in 和 for of 的区别是什么？

for-in 用于遍历对象更好
for-of 用于遍历数组更好

使用 for in 会遍历数组所有的可枚举属性，包括原型。所以**for-in 用于遍历对象更好**。

记住，for in 遍历的是数组的索引（即键名），而 for of 遍历的是数组元素值。

### for-in 遍历数组的坏处？

- `for-in`赋给 index 的值不是实际的数字，而是字符串 “0”、“1”、“2”，此时很可能在无意之间进行字符串算数计算，例如：“2” + 1 == “21”，这给编码过程带来极大的不便。
- 作用于数组的 for-in 循环体除了遍历数组元素外，还会遍历自定义属性。举个例子，如果你的数组中有一个可枚举属性 myArray.name，循环将额外执行一次，遍历到名为“name”的索引。就连数组原型链上的属性都能被访问到。
- 在某些情况下，这段代码可能按照随机顺序遍历数组元素， 也就是说不能保证顺序。

```js
var list = [
  { name: 'hehe', age: 12 },
  { name: 'zz', age: 34 },
];
for (var item of list) {
  console.log(`${item.name} is ${item.age} years old.`);
}

for (var index in list) {
  console.log(`${list[index].name} is ${list[index].age} years old.`);
}
```

## forEach

forEach（）使用三个参数调用该 函数：数组元素、元素的索引和数组本身。注意: forEach() 对于空数组是不会执行回调函数的。

### 写一个能遍历对象和数组的通用 forEach 函数

```js
var obj = { x: 100, y: 200, z: 300 };
var arr = [1, 2, 3, 4, 5, 6];

function foreach(obj, fn) {
  var key;
  if (obj instanceof Array) {
    obj.forEach(function(item, index) {
      fn(index, item);
    });
  } else {
    for (key in obj) {
      fn(key, obj[key]);
    }
  }
}

foreach(arr, function(index, item) {
  console.log(index + '-' + item);
});

foreach(obj, function(key, value) {
  console.log(key, value);
});
```

### foreach 跳出循环

```js
try {
  arr.forEach((item, index) => {
    if (item === 'b') throw new Error('exist');
    console.log(item);
  });
} catch (e) {
  if (e.message == 'exist') throw e;
} finally {
  console.log('done');
}
```

程序最后可以终止退出循环，所以使用 try...catch 通过抛出异常的方式来终止程序继续执行是可行。

#### foreach 不能异步原因

foreach 源码：

```js
// ...

Array.prototype.forEach = function(callback, thisArg) {
  var len = O.length >>> 0;
  k = 0;
  // 7. Repeat, while k < len
  while (k < len) {
    if (k in O) {
      // ...
      callback.call(T, kValue, k, O);
    }
    k++;
  }
};
// ...
```

可以看到代码中有一个 while 循环一直在调用 callback 回调函数，判断这里应该是异步并行调用的，因为我们只是在将 foreach 中的 callback 使用了 async/await 来等待异步返回操作，而本身这个 foreach 并没有使用 async/await 来等待异步返回。

使用 foreach 时其实也就相当于调用了一个封装了 while 或者 for 循环的函数，这个函数本身并没有使用 async/await 来处理异步，所以使用时在回调函数里面加上 async/await 是没有作用的，遍历的方式有很多种，那么我们在需要遍历处理异步的时候，最好还是使用 for 或者 while 来实现，不管是封装一个新的函数，或者是直接使用来遍历都可以避免这个问题。

### JavaScript forEach 不支持 async/await

```
const Promise = require('bluebird');

async function oo(data) {
  console.log('oo begin:', data);
  await Promise.delay(1000 * data);
  console.log('oo done:', data);
  return data;
}

async function xx(data) {
  await data.forEach(async function(val) {
    console.log('xx return:', await oo(val));
  });
  console.log('xx done.');
}

xx([1, 2, 3]);
```

这个是执行结果：

```
oo begin: 1
xx done.
oo done: 1
xx return: 1
```

### for...in 和 for...of 有什么区别？

如果看到问题十六，那么就很好回答。问题十六提到了 ES6 统一了遍历标准，制定了可遍历对象，那么用什么方法去遍历呢？答案就是用`for...of`。ES6 规定，有所部署了载了`Iterator`接口的对象(可遍历对象)都可以通过`for...of`去遍历，而`for..in`仅仅可以遍历对象

- 这也就意味着，数组也可以用`for...of`遍历，这极大地方便了数组的取值，且避免了很多程序用`for..in`去遍历数组的恶习

### es6 in

感觉其实就是 for in 的拆分出来的

```js
!('key' in obj); //不包含
obj.hasOwnProperty('key'); //包含
```

### 为什么普通 for 循环的性能远远高于 forEach 的性能，请解释其中的原因

区别：
一个按顺序遍历，一个使用 iterator 迭代器遍历；
从数据结构来说，画重点：
for 循环是随机访问元素，foreach 是顺序链表访问元素；
性能上：
对于 arraylist，是顺序表，使用 for 循环可以顺序访问，速度较快；使用 foreach 会比 for 循环稍慢一些。
对于 linkedlist，是单链表，使用 for 循环每次都要从第一个元素读取 next 域来读取，速度非常慢；使用 foreach 可以直接读取当前结点，数据较快；

### for of , for in 和 forEach,map 的区别

- for...of 循环：具有 iterator 接口，就可以用 for...of 循环遍历它的成员(属性值)。for...of 循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象、Generator 对象，以及字符串。for...of 循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。对于普通的对象，for...of 结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。可以中断循环。
- for...in 循环：遍历对象自身的和继承的可枚举的属性, 不能直接获取属性值。可以中断循环。
- forEach: 只能遍历数组，不能中断，没有返回值(或认为返回值是 undefined)
- map: 只能遍历数组，不能中断，返回值是修改后的数组

## 循环一个对象

1. for in

   ```js
   const obj = {
     id: 1,
     name: 'zhangsan',
     age: 18,
   };
   for (let key in obj) {
     console.log(key + '---' + obj[key]);
   }
   ```

2. Object.keys（obj） Object.values（obj）
3. 使用 Object.getOwnPropertyNames(obj)
   ```js
   const obj = {
     id: 1,
     name: 'zhangsan',
     age: 18,
   };
   Object.getOwnPropertyNames(obj).forEach(function(key) {
     console.log(key + '---' + obj[key]);
   });
   ```

## 停止 for 循环

break 可以停止 for...in 和 for...of 循环， 不能停止 forEach 循环。

### 几种循环方式的区别和介绍
