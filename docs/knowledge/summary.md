---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 30.两个数组合并成一个数组

请把两个数组 ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] 和 ['A', 'B', 'C', 'D']，合并为 ['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2', 'D']。

```js
function concatArr(arr1, arr2) {
  const arr = [...arr1];
  let currIndex = 0;
  for (let i = 0; i < arr2.length; i++) {
    const RE = new RegExp(arr2[i]);
    while (currIndex < arr.length) {
      ++currIndex;
      if (!RE.test(arr[currIndex])) {
        arr.splice(currIndex, 0, a2[i]);
        break;
      }
    }
  }
  return arr;
}
var a1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
var a2 = ['A', 'B', 'C', 'D'];
const arr = concatArr(a1, a2);
console.log(a1); // ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
console.log(a2); // ['A', 'B', 'C', 'D']
console.log(arr); // ['A1', 'A2', 'A', B1', 'B2', 'B', C1', 'C2', 'C', D1', 'D2', 'D']
```

### 31.改造下面的代码，使之输出 0 - 9，写出你能想到的所有解法。

```js
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

```js
for (var i = 0; i < 10; i++) {
  setTimeout(
    i => {
      console.log(i);
    },
    1000,
    i,
  );
}
```

### 33.下面的代码打印什么内容，为什么？

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

针对这题，在知乎上看到别人的回答说：

1. 函数表达式与函数声明不同，函数名只在该函数内部有效，并且此绑定是常量绑定。
2. 对于一个常量进行赋值，在 strict 模式下会报错，非 strict 模式下静默失败。
3. IIFE 中的函数是函数表达式，而不是函数声明。

实际上，有点类似于以下代码，但不完全相同，因为使用 const 不管在什么模式下，都会 TypeError 类型的错误

```js
const foo = (function() {
  foo = 10;
  console.log(foo);
})(foo)(); // Uncaught TypeError: Assignment to constant variable.
```

我的理解是，b 函数是一个相当于用 const 定义的常量，内部无法进行重新赋值，如果在严格模式下，会报错"Uncaught TypeError: Assignment to constant variable."
例如下面的：

```js
var b = 10;
(function b() {
  'use strict';
  b = 20;
  console.log(b);
})(); // "Uncaught TypeError: Assignment to constant variable."
```

### 34.简单改造下面的代码，使之分别打印 10 和 20。

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

我的解法：
1）打印 10

```js
var b = 10;
(function b(b) {
  window.b = 20;
  console.log(b);
})(b);
```

或者

```js
var b = 10;
(function b(b) {
  b.b = 20;
  console.log(b);
})(b);
```

2）打印 20

```js
var b = 10;
(function b(b) {
  b = 20;
  console.log(b);
})(b);
```

或

```js
var b = 10;
(function b() {
  var b = 20;
  console.log(b);
})();
```

### 38.下面代码中 a 在什么情况下会打印 1？

```js
var a = ?;
if(a == 1 && a == 2 && a == 3){
 	console.log(1);
}
```

题目如下

```js
var a = ?;
if(a == 1 && a == 2 && a == 3){
 	console.log(1);
}
```

答案解析 因为==会进行隐式类型转换 所以我们重写 toString 方法就可以了

```js
var a = {
  i: 1,
  toString() {
    return a.i++;
  },
};

if (a == 1 && a == 2 && a == 3) {
  console.log(1);
}
```

### 47.双向绑定和 vuex 是否冲突

在严格模式中使用 Vuex，当用户输入时，v-model 会试图直接修改属性值，但这个修改不是在 mutation 中修改的，所以会抛出一个错误。当需要在组件中使用 vuex 中的 state 时，有 2 种解决方案：
1、在 input 中绑定 value(vuex 中的 state)，然后监听 input 的 change 或者 input 事件，在事件回调中调用 mutation 修改 state 的值
2、使用带有 setter 的双向绑定计算属性。见以下例子（来自官方文档）：

```html
<input v-model="message" />
```

```js
computed: { message: { get () { return this.$store.state.obj.message }, set (value) { this.$store.commit('updateMessage', value) } } }
```

### 41.下面代码输出什么

```js
var a = 10;
(function() {
  console.log(a);
  a = 5;
  console.log(window.a);
  var a = 20;
  console.log(a);
})();
```

分别为 undefined 　 10 　 20，原因是作用域问题，在内部声名 var a = 20;相当于先声明 var a;然后再执行赋值操作，这是在ＩＩＦＥ内形成的独立作用域，如果把 var a=20 注释掉，那么 a 只有在外部有声明，显示的就是外部的Ａ变量的值了。结果Ａ会是 10 　 5 　 5

### 42.实现一个 sleep 函数

比如 sleep(1000) 意味着等待 1000 毫秒，可从 Promise、Generator、Async/Await 等角度实现

```js
const sleep = time => {
  return new Promise(resolve => setTimeout(resolve, time));
};

sleep(1000).then(() => {
  // 这里写你的骚操作
});
```

### 43.使用 sort() 对数组 [3, 15, 8, 29, 102, 22] 进行排序，输出结果

原题目：

使用 sort() 对数组 [3, 15, 8, 29, 102, 22] 进行排序，输出结果

我的答案：

[102, 15, 22, 29, 3, 8]

解析：
根据 MDN 上对 Array.sort()的解释，默认的排序方法会将数组元素转换为字符串，然后比较字符串中字符的 UTF-16 编码顺序来进行排序。所以'102' 会排在 '15' 前面。

### 50.实现 (5).add(3).minus(2) 功能。

例： 5 + 3 - 2，结果为 6

```js
Number.prototype.add = function(n) {
  return this.valueOf() + n;
};
Number.prototype.minus = function(n) {
  return this.valueOf() - n;
};
```

[![image](https://user-images.githubusercontent.com/13726966/55743276-79e83000-5a64-11e9-9227-39b7fe4b98de.png)](https://user-images.githubusercontent.com/13726966/55743276-79e83000-5a64-11e9-9227-39b7fe4b98de.png)

### 52.怎么让一个 div 水平垂直居中

```js
<div class="parent">
  <div class="child"></div>
</div>
```

1.

```
div.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

1.

```js
div.parent {
    position: relative;
}
div.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
/* 或者 */
div.child {
    width: 50px;
    height: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -25px;
    margin-top: -5px;
}
/* 或 */
div.child {
    width: 50px;
    height: 10px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
```

1.

```js
div.parent {
    display: grid;
}
div.child {
    justify-self: center;
    align-self: center;
}
```

1.

```js
div.parent {
    font-size: 0;
    text-align: center;
    &::before {
        content: "";
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
    }
}
div.child{
  display: inline-block;
  vertical-align: middle;
}
```

### 57.分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景。

display: none (不占空间，不能点击)（场景，显示出原来这里不存在的结构）
visibility: hidden（占据空间，不能点击）（场景：显示不会导致页面结构发生变动，不会撑开）
opacity: 0（占据空间，可以点击）（场景：可以跟 transition 搭配）

### 58.箭头函数与普通函数（function）的区别是什么？构造函数（function）可以使用 new 生成实例，那么箭头函数可以吗？为什么？

箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：

1、函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。

2、不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

3、不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。

4、不可以使用 new 命令，因为：

- 没有自己的 this，无法调用 call，apply。
- 没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 **proto**

new 过程大致是这样的：

```js
function newFunc(father, ...rest) {
  var result = {};
  result.__proto__ = father.prototype;
  var result2 = father.apply(result, rest);
  if ((typeof result2 === 'object' || typeof result2 === 'function') && result2 !== null) {
    return result2;
  }
  return result;
}
```

### 59.给定两个数组，写一个方法来计算它们的交集。

例如：给定 nums1 = [1, 2, 2, 1]，nums2 = [2, 2]，返回 [2, 2]。

```js
function union(arr1, arr2) {
  return arr1.filter(item => {
    return arr2.indexOf(item) > -1;
  });
}
const a = [1, 2, 2, 1];
const b = [2, 3, 2];
console.log(union(a, b)); // [2, 2]
```

### 61.介绍下如何实现 token 加密

jwt 举例

1. 需要一个 secret（随机数）
1. 后端利用 secret 和加密算法(如：HMAC-SHA256)对 payload(如账号密码)生成一个字符串(token)，返回前端
1. 前端每次 request 在 header 中带上 token
1. 后端用同样的算法解密

### 63.如何设计实现无缝轮播

简单来说，无缝轮播的核心是制造一个连续的效果。最简单的方法就是复制一个轮播的元素，当复制元素将要滚到目标位置后，把原来的元素进行归位的操作，以达到无缝的轮播效果。

贴一段轮播的核心代码：

```js
// scroll the notice
useEffect(() => {
  const requestAnimationFrame =
    window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
  const cancelAnimationFrame =
    window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;

  const scrollNode = noticeContentEl.current;
  const distance = scrollNode.clientWidth / 2;

  scrollNode.style.left = scrollNode.style.left || 0;
  window.__offset = window.__offset || 0;

  let requestId = null;
  const scrollLeft = () => {
    const speed = 0.5;
    window.__offset = window.__offset + speed;
    scrollNode.style.left = -window.__offset + 'px';
    // 关键行：当距离小于偏移量时，重置偏移量
    if (distance <= window.__offset) window.__offset = 0;
    requestId = requestAnimationFrame(scrollLeft);
  };
  requestId = requestAnimationFrame(scrollLeft);

  if (pause) cancelAnimationFrame(requestId);
  return () => cancelAnimationFrame(requestId);
}, [notice, pause]);
```

### 65. `a.b.c.d` 和 `a['b']['c']['d']`，哪个性能更高？

应该是 a.b.c.d 比 a['b']['c']['d'] 性能高点，后者还要考虑 [ ] 中是变量的情况，再者，从两种形式的结构来看，显然编译器解析前者要比后者容易些，自然也就快一点。

### 66.ES6 代码转成 ES5 代码的实现思路是什么

将 ES6 的代码转换为 AST 语法树，然后再将 ES6 AST 转为 ES5 AST，再将 AST 转为代码

### 68. 如何解决移动端 Retina 屏 1px 像素问题

1 伪元素 + transform scaleY(.5)
2 border-image
3 background-image
4 box-shadow

### 69. 如何把一个字符串的大小写取反（大写变小写小写变大写），例如 ’AbC' 变成 'aBc' 。

```js
function processString(s) {
  var arr = s.split('');
  var new_arr = arr.map(item => {
    return item === item.toUpperCase() ? item.toLowerCase() : item.toUpperCase();
  });
  return new_arr.join('');
}
console.log(processString('AbC'));
```

### 70. 介绍下 webpack 热更新原理，是如何做到在不刷新浏览器的前提下更新页面的

1.当修改了一个或多个文件； 2.文件系统接收更改并通知 webpack；
3.webpack 重新编译构建一个或多个模块，并通知 HMR 服务器进行更新；
4.HMR Server 使用 webSocket 通知 HMR runtime 需要更新，HMR 运行时通过 HTTP 请求更新 jsonp；
5.HMR 运行时替换更新中的模块，如果确定这些模块无法更新，则触发整个页面刷新。

### 71. 实现一个字符串匹配算法，从长度为 n 的字符串 S 中，查找是否存在字符串 T，T 的长度是 m，若存在返回所在位置。

```js
const find = (S, T) => {
  if (S.length < T.length) return -1;
  for (let i = 0; i < S.length; i++) {
    if (S.slice(i, i + T.length) === T) return i;
  }
  return -1;
};
```

### 72. 为什么普通 `for` 循环的性能远远高于 `forEach` 的性能，请解释其中的原因。

![image-20190512225510941](https://ws2.sinaimg.cn/large/006tNc79gy1g2yxbg4ta8j31gh0u048h.jpg)

- for 循环没有任何额外的函数调用栈和上下文；
- forEach 函数签名实际上是

```js
array.forEach(function(currentValue, index, arr), thisValue)
```

它不是普通的 for 循环的语法糖，还有诸多参数和上下文需要在执行的时候考虑进来，这里可能拖慢性能；

### 74. 使用 JavaScript Proxy 实现简单的数据绑定

```html
<body>
  hello,world
  <input type="text" id="model" />
  <p id="word"></p>
</body>
<script>
  const model = document.getElementById('model');
  const word = document.getElementById('word');
  var obj = {};

  const newObj = new Proxy(obj, {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
      console.log('setting', target, key, value, receiver);
      if (key === 'text') {
        model.value = value;
        word.innerHTML = value;
      }
      return Reflect.set(target, key, value, receiver);
    },
  });

  model.addEventListener('keyup', function(e) {
    newObj.text = e.target.value;
  });
</script>
```

### 76.输出以下代码运行结果

```js
// example 1
var a={}, b='123', c=123;
a[b]='b';
a[c]='c';
// 输出 c
console.log(a[b]);

---------------------
// example 2
var a={}, b=Symbol('123'), c=Symbol('123');
a[b]='b';
a[c]='c';
console.log(a[b]);

---------------------
// example 3
var a={}, b={key:'123'}, c={key:'456'};
a[b]='b';
a[c]='c';
console.log(a[b]);
```

### 77.算法题「旋转数组」

给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。

示例 1：

```js
输入: [1, 2, 3, 4, 5, 6, 7] 和 k = 3
输出: [5, 6, 7, 1, 2, 3, 4]
解释:
向右旋转 1 步: [7, 1, 2, 3, 4, 5, 6]
向右旋转 2 步: [6, 7, 1, 2, 3, 4, 5]
向右旋转 3 步: [5, 6, 7, 1, 2, 3, 4]
```

示例 2：

```js
输入: [-1, -100, 3, 99] 和 k = 2
输出: [3, 99, -1, -100]
解释:
向右旋转 1 步: [99, -1, -100, 3]
向右旋转 2 步: [3, 99, -1, -100]
```

因为步数有可能大于数组长度，所以要先取余

```js
function rotate(arr, k) {
  const len = arr.length;
  const step = k % len;
  return arr.slice(-step).concat(arr.slice(0, len - step));
}
// rotate([1, 2, 3, 4, 5, 6], 7) => [6, 1, 2, 3, 4, 5]
```

### 79.input 搜索如何防抖，如何处理中文输入

防抖就不说了，主要是这里提到的中文输入问题，其实看过 elementui 框架源码的童鞋都应该知道，elementui 是通过 compositionstart & compositionend 做的中文输入处理：
相关代码：

```html
<input
  ref="input"
  @compositionstart="handleComposition"
  @compositionupdate="handleComposition"
  @compositionend="handleComposition"
  \
/>
```

这 3 个方法是原生的方法，这里简单介绍下，官方定义如下 compositionstart 事件触发于一段文字的输入之前（类似于 keydown 事件，但是该事件仅在若干可见字符的输入之前，而这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）
简单来说就是切换中文输入法时在打拼音时(此时 input 内还没有填入真正的内容)，会首先触发 compositionstart，然后每打一个拼音字母，触发 compositionupdate，最后将输入好的中文填入 input 中时触发 compositionend。触发 compositionstart 时，文本框会填入 “虚拟文本”（待确认文本），同时触发 input 事件；在触发 compositionend 时，就是填入实际内容后（已确认文本）,所以这里如果不想触发 input 事件的话就得设置一个 bool 变量来控制。
[![image](https://user-images.githubusercontent.com/34699694/58140376-8f5e9580-7c71-11e9-987e-5fe39fce5e90.png)](https://user-images.githubusercontent.com/34699694/58140376-8f5e9580-7c71-11e9-987e-5fe39fce5e90.png)
根据上图可以看到

输入到 input 框触发 input 事件
失去焦点后内容有改变触发 change 事件
识别到你开始使用中文输入法触发**compositionstart **事件
未输入结束但还在输入中触发**compositionupdate **事件
输入完成（也就是我们回车或者选择了对应的文字插入到输入框的时刻）触发 compositionend 事件。

那么问题来了 使用这几个事件能做什么？
因为 input 组件常常跟 form 表单一起出现，需要做表单验证
[![image](https://user-images.githubusercontent.com/34699694/58140402-b1581800-7c71-11e9-97b9-9c696f3a0061.png)](https://user-images.githubusercontent.com/34699694/58140402-b1581800-7c71-11e9-97b9-9c696f3a0061.png)
为了解决中文输入法输入内容时还没将中文插入到输入框就验证的问题

我们希望中文输入完成以后才验证

### 81.打印出 1 - 10000 之间的所有对称数

例如：121、1331 等

81.打印出 1 - 10000 之间的所有对称数

例如：121、1331 等

```js
[...Array(10000).keys()].filter(x => {
  return (
    x.toString().length > 1 &&
    x ===
      Number(
        x
          .toString()
          .split('')
          .reverse()
          .join(''),
      )
  );
});
```

[![image](https://user-images.githubusercontent.com/16409424/58295339-52290d80-7e01-11e9-81db-4716426e039d.png)](https://user-images.githubusercontent.com/16409424/58295339-52290d80-7e01-11e9-81db-4716426e039d.png)

### 82.周一算法题之「移动零」

给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
示例:

```js
输入: [0, 1, 0, 3, 12];
输出: [1, 3, 12, 0, 0];
```

说明:

1. 必须在原数组上操作，不能拷贝额外的数组。
1. 尽量减少操作次数。

```js
function zeroMove(array) {
  let len = array.length;
  let j = 0;
  for (let i = 0; i < len - j; i++) {
    if (array[i] === 0) {
      array.push(0);
      array.splice(i, 1);
      i--;
      j++;
    }
  }
  return array;
}
```

### 101.修改以下 print 函数，使之输出 0 到 99，或者 99 到 0

要求：

> 1、只能修改 `setTimeout` 到 `Math.floor(Math.random() * 1000` 的代码
>
> 2、不能修改 `Math.floor(Math.random() * 1000`
>
> 3、不能使用全局变量

```js
function print(n) {
  setTimeout(() => {
    console.log(n);
  }, Math.floor(Math.random() * 1000));
}
for (var i = 0; i < 100; i++) {
  print(i);
}
```

```js
function print(n) {
  setTimeout(
    (() => {
      console.log(n);
      return () => {};
    }).call(n, []),
    Math.floor(Math.random() * 1000),
  );
}
for (var i = 0; i < 100; i++) {
  print(i);
}
```

### 102.不用加减乘除运算符，求整数的 7 倍

```js
/* -- 位运算 -- */

// 先定义位运算加法
function bitAdd(m, n) {
  while (m) {
    [m, n] = [(m & n) << 1, m ^ n];
  }
  return n;
}

// 位运算实现方式 1 - 循环累加7次
let multiply7_bo_1 = num => {
  let sum = 0,
    counter = new Array(7); // 得到 [empty × 7]
  while (counter.length) {
    sum = bitAdd(sum, num);
    counter.shift();
  }
  return sum;
};

// 位运算实现方式 2 - 二进制进3位(乘以8)后，加自己的补码(乘以-1)
let multiply7_bo_2 = num => bitAdd(num << 3, -num);

/* -- JS hack -- */

// hack 方式 1 - 利用 Function 的构造器 & 乘号的字节码
let multiply7_hack_1 = num => new Function(['return ', num, String.fromCharCode(42), '7'].join(''))();

// hack 方式 2 - 利用 eval 执行器 & 乘号的字节码
let multiply7_hack_2 = num => eval([num, String.fromCharCode(42), '7'].join(''));

// hack 方式 3 - 利用 SetTimeout 的参数 & 乘号的字节码
setTimeout(['window.multiply7_hack_3=(num)=>(7', String.fromCharCode(42), 'num)'].join(''));

/* -- 进制转换 -- */

// 进制转换方式 - 利用 toString 转为七进制整数；然后末尾补0(左移一位)后通过 parseInt 转回十进制
let multiply7_base7 = num => parseInt([num.toString(7), '0'].join(''), 7);
```

### 105.编程题

url 有三种情况

>

```js
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=&local_province_id=33
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=800&local_province_id=33
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=800,700&local_province_id=33
```

> 匹配 elective 后的数字输出（写出你认为的最优解法）:

```js
[] || ['800'] || ['800', '700'];
```

```js
function getUrlValue(url) {
  if (!url) return;
  let res = url.match(/(?<=elective=)(\d+(,\d+)*)/);
  return res ? res[0].split(',') : [];
}
```

### 106.分别写出如下代码的返回值

```js
String('11') == new String('11');
String('11') === new String('11');
```

true
false

new String() 返回的是对象

== 的时候，实际运行的是
String('11') == new String('11').toString();

=== 不再赘述。

### 107.考虑到性能问题，如何快速从一个巨大的数组中随机获取部分元素。

比如有个数组有 100K 个元素，从中不重复随机选取 10K 个元素。

由于随机从 100K 个数据中随机选取 10k 个数据，可采用统计学中随机采样点的选取进行随机选取，如在 0-50 之间生成五个随机数，然后依次将每个随机数进行加 50 进行取值，性能应该是最好的。

### 110.编程题，请写一个函数，完成以下功能

输入
`'1, 2, 3, 5, 7, 8, 10'`
输出
`'1~3, 5, 7~8, 10'`

### 111.编程题，写个程序把 entry 转换成如下对象

```js
var entry = {
  a: {
    b: {
      c: {
        dd: "abcdd"
      }
    },
    d: {
      xx: "adxx"
    },
    e: "ae"
  }
};
>
// 要求转换成如下对象
var output = {
  "a.b.c.dd": "abcdd",
  "a.d.xx": "adxx",
  "a.e": "ae"
};
```

```js
function flatObj(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let keyName = `${parentKey}${key}`;
      if (typeof obj[key] === 'object') flatObj(obj[key], keyName + '.', result);
      else result[keyName] = obj[key];
    }
  }
  return result;
}
```

### 112.编程题，写个程序把 entry 转换成如下对象（跟昨日题目相反）

```js
var entry = {
  "a.b.c.dd": "abcdd",
  "a.d.xx": "adxx",
  "a.e": "ae"
};
>
// 要求转换成如下对象
var output = {
  a: {
    b: {
      c: {
        dd: "abcdd"
      }
    },
    d: {
      xx: "adxx"
    },
    e: "ae"
  }
};
```

```js
var entry = {
  'a.b.c.dd': 'abcdd',
  'a.d.xx': 'adxx',
  'a.e': 'ae',
};

function map(entry) {
  const obj = Object.create(null);
  for (const key in entry) {
    const keymap = key.split('.');
    set(obj, keymap, entry[key]);
  }
  return obj;
}

function set(obj, map, val) {
  let tmp;
  if (!obj[map[0]]) obj[map[0]] = Object.create(null);
  tmp = obj[map[0]];
  for (let i = 1; i < map.length; i++) {
    if (!tmp[map[i]]) tmp[map[i]] = map.length - 1 === i ? val : Object.create(null);
    tmp = tmp[map[i]];
  }
}
console.log(map(entry));
```

### 113.编程题，根据以下要求，写一个数组去重函数（蘑菇街）

1. 如传入的数组元素为`[123, "meili", "123", "mogu", 123]`，则输出：`[123, "meili", "123", "mogu"]`
2. 如传入的数组元素为`[123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"]`，则输出：`[123, [1, 2, 3], [1, "2", 3], "meili"]`
3. 如传入的数组元素为`[123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili"]`，则输出：`[123, {a: 1}, {a: {b: 1}}, {a: "1"}, "meili"]`

```js
function filterArray(array) {
  var keys = {};
  if (array && array.length) {
    var rst = array.filter(val1 => {
      var str = JSON.stringify(val1);
      if (!keys[str]) {
        keys[str] = true;
        return true;
      } else {
        return false;
      }
    });
  }

  return rst;
}
// [123, "meili", "123", "mogu", 123]，则输出：[123, "meili", "123", "mogu"]
console.log(filterArray([123, 'meili', '123', 'mogu', 123]));
// [123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"]，则输出：[123, [1, 2, 3], [1, "2", 3], "meili"]
console.log(filterArray([123, [1, 2, 3], [1, '2', 3], [1, 2, 3], 'meili']));
// [123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili"]，则输出：[123, {a: 1}, {a: {b: 1}}, {a: "1"}, "meili"]
console.log(filterArray([123, { a: 1 }, { a: { b: 1 } }, { a: '1' }, { a: { b: 1 } }, 'meili']));
```

### 116.输出以下代码运行结果

```js
1 + "1";
>
2 * "2"[(1, 2)] + [2, 1];
>
"a" + +"b";
```

'11'
4
'1,22,1'
'aNaN'

//"a" + + "b"其实可以理解为
// + "b" -> NaN
//“a”+NaN

### 124.永久性重定向（301）和临时性重定向（302）对 SEO 有什么影响

1）301 redirect——301 代表永久性转移(Permanently Moved)，301 重定向是网页更改地址后对搜索引擎友好的最好方法，只要不是暂时搬移的情况,都建议使用 301 来做转址。
如果我们把一个地址采用 301 跳转方式跳转的话，搜索引擎会把老地址的 PageRank 等信息带到新地址，同时在搜索引擎索引库中彻底废弃掉原先的老地址。旧网址的排名等完全清零

2）302 redirect——302 代表暂时性转移(Temporarily Moved )，在前些年，不少 Black Hat SEO 曾广泛应用这项技术作弊，目前，各大主要搜索引擎均加强了打击力度，象 Google 前些年对 Business.com 以及近来对 BMW 德国网站的惩罚。即使网站客观上不是 spam，也很容易被搜寻引擎容易误判为 spam 而遭到惩罚。

### 125.算法题

如何将`[{id: 1}, {id: 2, pId: 1}, ...]` 的重复数组（有重复数据）转成树形结构的数组 `[{id: 1, child: [{id: 2, pId: 1}]}, ...]` （需要去重）

```js
const fn = arr => {
  const res = [];
  const map = arr.reduce((res, item) => ((res[item.id] = item), res), {});
  for (const item of Object.values(map)) {
    if (!item.pId) {
      res.push(item);
    } else {
      const parent = map[item.pId];
      parent.child = parent.child || [];
      parent.child.push(item);
    }
  }
  return res;
};
```

### 126.扑克牌问题

有一堆扑克牌，将牌堆第一张放到桌子上，再将接下来的牌堆的第一张放到牌底，如此往复；

> 最后桌子上的牌顺序为： (牌底) 1,2,3,4,5,6,7,8,9,10,11,12,13 (牌顶)；
>
> 问：原来那堆牌的顺序，用函数实现。

```js
function poke(arr) {
  let i = 1;
  let out = [];
  while (arr.length) {
    if (i % 2) {
      out.push(arr.shift());
    } else {
      arr.push(arr.shift());
    }
    i++;
  }
  return out;
}

function reverse(arr) {
  let i = 1;
  let out = [];
  while (arr.length) {
    if (i % 2) {
      out.unshift(arr.pop());
    } else {
      out.unshift(out.pop());
    }
    i++;
  }
  return out;
}

reverse([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
// [1, 12, 2, 8, 3, 11, 4, 9, 5, 13, 6, 10, 7]
```

### 127.如何用 css 或 js 实现多行文本溢出省略效果，考虑兼容性

单行：
overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
多行：
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3; //行数
overflow: hidden;
兼容：
p{position: relative; line-height: 20px; max-height: 40px;overflow: hidden;}
p::after{content: "..."; position: absolute; bottom: 0; right: 0; padding-left: 40px;
background: -webkit-linear-gradient(left, transparent, #fff 55%);
background: -o-linear-gradient(right, transparent, #fff 55%);
background: -moz-linear-gradient(right, transparent, #fff 55%);
background: linear-gradient(to right, transparent, #fff 55%);
}

### 129.输出以下代码执行结果

```js
function wait() {
  return new Promise(resolve => setTimeout(resolve, 10 * 1000));
}
>
async function main() {
  console.time();
  const x = wait();
  const y = wait();
  const z = wait();
  await x;
  await y;
  await z;
  console.timeEnd();
}
main();
```

### 130.输出以下代码执行结果，大致时间就好（不同于上题）

```js
function wait() {
  return new Promise(resolve => setTimeout(resolve, 10 * 1000));
}
>
async function main() {
  console.time();
  await wait();
  await wait();
  await wait();
  console.timeEnd();
}
main();
```

### 131.接口如何防刷

referer 校验
UA 校验
频率限制（1s 内接口调用次数限制）

把某个 key 加配料，带上时间戳，加密，请求时带上，过期或解密失败则 403。

### 132.实现一个 Dialog 类，Dialog 可以创建 dialog 对话框，对话框支持可拖拽（腾讯）

```js
class Dialog {
  constructor(text) {
    this.lastX = 0;
    this.lastY = 0;
    this.x;
    this.y;
    this.text = text || '';
    this.isMoving = false;
    this.dialog;
  }
  open() {
    const model = document.createElement('div');
    model.id = 'model';
    model.style = `
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        background-color:rgba(0,0,0,.3);
        display:flex;
        justify-content: center;
        align-items: center;`;
    model.addEventListener('click', this.close.bind(this));
    document.body.appendChild(model);
    this.dialog = document.createElement('div');
    this.dialog.style = `
        padding:20px;
        background-color:white`;
    this.dialog.innerText = this.text;
    this.dialog.addEventListener('click', e => {
      e.stopPropagation();
    });
    this.dialog.addEventListener('mousedown', this.handleMousedown.bind(this));
    document.addEventListener('mousemove', this.handleMousemove.bind(this));
    document.addEventListener('mouseup', this.handleMouseup.bind(this));
    model.appendChild(this.dialog);
  }
  close() {
    this.dialog.removeEventListener('mousedown', this.handleMousedown);
    document.removeEventListener('mousemove', this.handleMousemove);
    document.removeEventListener('mouseup', this.handleMouseup);
    document.body.removeChild(document.querySelector('#model'));
  }
  handleMousedown(e) {
    this.isMoving = true;
    this.x = e.clientX;
    this.y = e.clientY;
  }
  handleMousemove(e) {
    if (this.isMoving) {
      this.dialog.style.transform = `translate(${e.clientX - this.x + this.lastX}px,${e.clientY -
        this.y +
        this.lastY}px)`;
    }
  }
  handleMouseup(e) {
    this.lastX = e.clientX - this.x + this.lastX;
    this.lastY = e.clientY - this.y + this.lastY;
    this.isMoving = false;
  }
}
let dialog = new Dialog('Hello');
dialog.open();
```

### 133.用 setTimeout 实现 setInterval，阐述实现的效果与 setInterval 的差异

```js
function mySetInterval() {
  mySetInterval.timer = setTimeout(() => {
    arguments[0]();
    mySetInterval(...arguments);
  }, arguments[1]);
}

mySetInterval.clear = function() {
  clearTimeout(mySetInterval.timer);
};

mySetInterval(() => {
  console.log(11111);
}, 1000);

setTimeout(() => {
  // 5s 后清理
  mySetInterval.clear();
}, 5000);
```

### 136.如何实现骨架屏，说说你的思路

封装多个不同大小的模块
根据页面需求配置组合模块
请求数据并处理成功后替换
