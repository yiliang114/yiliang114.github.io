---
title: 类型转换
date: '2020-11-02'
draft: true
---

### 总结

```js
// 使用箭头函数缩减代码
// 处理输入，可以用.map，需要注意其所有参数
// 此外其他迭代方法也需要掌握。
let line = readline().split(' ');
line = line.map(e => parseInt(e, 10));

// 去重
arr = [...new Set(arr)];
// 升序,排序可以用sort，默认是字典序,并且可以根据需要定制，需要深入掌握
arr.sort((a, b) => a - b);
// 迭代输出
arr.forEach(i => console.log(i));
// 求最大值，使用扩展运算符...
max = Math.max.call(...arr);
// 复制数组
arr2 = [...arr1];
arr2 = arr.concat();
arr2 = arr.slice();

// 善用解构
// 变量赋值
const [a, b, c, d, e] = [1, 2, 3, 4, 5]; // a=1,b=2,c=3,d=4,e=5
// 交换变量值
let x = 1,
  y = 2;
[x, y] = [y, x];
// 题外话：字符串中的字符是无法交换的
let str = 'ab';
[str[0], str[1]] = [str[1], str[0]]; // 无效，"ab"
// 不过可以将字符串拆成字符数组后就可以交换了
str = str.split(''); // ["a","b"]
[str[0], str[1]] = [str[1], str[0]]; // ["b","a"]

// 善用位操作符
// 求数组一半长度
halfLen = a.length >> 1;

// 不过需要注意右移运算符>>优先级别加号+还低，例如
console.log(3 + ((5 - 3) >> 1)); // 2
console.log(3 + ~~((5 - 3) / 2)); // 4

// 因此在于其他操作符号想结合时候可以适当增加括号,例如求中位
mid = left + ((right - left) >> 1);
mid = left + ~~((right - left) / 2);
// 不建议使用mid = (left + right)>>1;，因为加号操作可能造成溢出

// ~~等价于Math.floor(),|0也等价于Math.floor()
halfLen = ~~(a.length / 2);
halfLen = (a.length / 2) | 0;

// 判断奇偶
evenNum & (1 === 0); // 偶数
oddNum & (1 === 1); // 奇数

// 善用异或
5 ^ (5 === 0);
5 ^ 5 ^ 6 ^ 6 ^ (7 === 7);

// 判断数是否是2的幂次方
num & (num - 1 === 0);

// 翻转数的第K位
num ^= 1 << k;

// 将第K位设为0
num &= ~(1 << k);

// 将第K位设为1
num |= 1 << K;

// 判断第K位是否为0
num & (1 << k === 0);
```

### 面代码中 a 在什么情况下会打印 1？

```js
var a = ?;
if(a == 1 && a == 2 && a == 3){
 	console.log(1);
}
```

考察隐式转换,重写 toString 方法即可

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

```js
let a = {
  i: 1,
  valueOf() {
    return a.i++;
  },
};

if (a == 1 && a == 2 && a == 3) {
  console.log('1');
}
```

```js
var a = [1, 2, 3];
a.join = a.shift;
if (a == 1 && a == 2 && a == 3) {
  console.log('1');
}
```

```
let a = {[Symbol.toPrimitive]: ((i) => () => ++i) (0)};
if(a == 1 && a == 2 && a == 3) {
  console.log('1');
}
```

### Object.assign()的模拟实现

实现一个 Object.assign 大致思路如下：

1. 判断原生 Object 是否支持该函数，如果不存在的话创建一个函数 assign，并使用 Object.defineProperty 将该函数绑定到 Object 上。

2. 判断参数是否正确（目标对象不能为空，我们可以直接设置{}传递进去,但必须设置值）。

3. 使用 Object() 转成对象，并保存为 to，最后返回这个对象 to。

4. 使用 for..in 循环遍历出所有可枚举的自有属性。并复制给新的目标对象（使用 hasOwnProperty 获取自有属性，即非原型链上的属性）。

实现代码如下，这里为了验证方便，使用 assign2 代替 assign。注意此模拟实现不支持 symbol 属性，因为 ES5 中根本没有 symbol 。

```js
if (typeof Object.assign2 != 'function') {
  // Attention 1
  Object.defineProperty(Object, 'assign2', {
    value: function(target) {
      'use strict';
      if (target == null) {
        // Attention 2
        throw new TypeError('Cannot convert undefined or null to object');
      }

      // Attention 3
      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          // Attention 2
          // Attention 4
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true,
  });
}
```

### 笔试题

```js
var obj = {
  '2': 3,
  '3': 4,
  length: 2,
  splice: Array.prototype.splice,
  push: Array.prototype.push,
};
obj.push(1);
obj.push(2);
console.log(obj);
```

输出稀疏数组[,,1,2]
1.call push 这个方法如果对象有 length 属性，length 属性会加 1 并且返回，这个是在某本书的上看到的，一直记得。 2.调用 push 方法的时候会在调用对象的 key=length 的地方做一个赋值，不管前面 key 有没有值，也就是说在调用 push 的时候 对象实际被理解为了[0:undefined,1:undefined,2:3,3:4]

### 实现 (5).add(3).minus(2) 功能

```js
Number.prototype.add = function(value) {
  let number = parseFloat(value);
  if (typeof number !== 'number' || Number.isNaN(number)) {
    throw new Error('请输入数字或者数字字符串～');
  }
  return this + number;
};
Number.prototype.minus = function(value) {
  let number = parseFloat(value);
  if (typeof number !== 'number' || Number.isNaN(number)) {
    throw new Error('请输入数字或者数字字符串～');
  }
  return this - number;
};
console.log((5).add(3).minus(2));
```

### 输出以下代码的执行结果并解释为什么

```js
var a = { n: 1 };
var b = a;
a.x = a = { n: 2 };

console.log(a.x);
console.log(b.x);
```

输出：

```js
a.x; //  undefined
b.x; //  {n: 2}
```

运算赋优先级问题，此前 a 和 b 都是指向{n:1}，a.x 执行之后 x 值为 undefined，a 和 b 指向{n:1,x:undefined},接下来执行赋值运算，a 指向变更成了{n:2},此时都 a.x= a,实际上是 b.x=a,b 指向了{n:1,x:{n: 2}},此时 a.x 输出 undefined,b.x 输出{n:2}

### {1:222, 2:123, 5:888}，请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null]

```js
let data = { 1: 222, 2: 123, 5: 888 };
let arr = Array.from({ length: 12 }).map((it, i) => data[i + 1] || null);
用时更少;

let obj = { 1: 222, 2: 123, 5: 888 };
let res = Array.from({ length: 12 }).fill(null);
keys(obj).forEach(it => (res[it - 1] = obj[it]));
```

### 要求设计 LazyMan 类，实现以下功能

```js
LazyMan('Tony');
// Hi I am Tony

LazyMan('Tony')
  .sleep(10)
  .eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan('Tony')
  .eat('lunch')
  .sleep(10)
  .eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan('Tony')
  .eat('lunch')
  .eat('dinner')
  .sleepFirst(5)
  .sleep(10)
  .eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
```

答案：

```js
class LazyManClass {
  constructor(name) {
    this.taskList = [];
    this.name = name;
    console.log(`Hi I am ${this.name}`);
    setTimeout(() => {
      this.next();
    }, 0);
  }
  eat(name) {
    var that = this;
    var fn = (function(n) {
      return function() {
        console.log(`I am eating ${n}`);
        that.next();
      };
    })(name);
    this.taskList.push(fn);
    return this;
  }
  sleepFirst(time) {
    var that = this;
    var fn = (function(t) {
      return function() {
        setTimeout(() => {
          console.log(`等待了${t}秒...`);
          that.next();
        }, t * 1000);
      };
    })(time);
    this.taskList.unshift(fn);
    return this;
  }
  sleep(time) {
    var that = this;
    var fn = (function(t) {
      return function() {
        setTimeout(() => {
          console.log(`等待了${t}秒...`);
          that.next();
        }, t * 1000);
      };
    })(time);
    this.taskList.push(fn);
    return this;
  }
  next() {
    var fn = this.taskList.shift();
    fn && fn();
  }
}
function LazyMan(name) {
  return new LazyManClass(name);
}
LazyMan('Tony')
  .eat('lunch')
  .eat('dinner')
  .sleepFirst(5)
  .sleep(4)
  .eat('junk food');
```

### 实现 destructuringArray 方法，达到如下效果

```js
// destructuringArray( [1,[2,4],3], "[a,[b],c]" );
// result
// { a:1, b:2, c:3 }
```

实现：

```js
destructuringArray = (value, keys) => {
  let obj = {};
  let arr = JSON.parse(keys.replace(/\w+/g, '"$&"'));
  console.log(arr);
  const iterate = (value, keys) => {
    keys.forEach((item, index) => {
      if (Array.isArray(item)) iterate(value[index], item);
      else obj[item] = value[index];
    });
  };
  iterate(value, arr);
  console.log(obj);
  return obj;
};
```

### js 获取当前时间戳？获取一个月有多少天？

JS 获取当前时间戳的方法
//方法一

```js
var timestamp = new Date().getTime();
console.log(timestamp); //1495302061441
```

//方法二

```js
var timestamp2 = new Date().valueOf();
console.log(timestamp2); //1495302061447
```

//方法三

```js
var timestamp3 = Date.parse(new Date());
console.log(timestamp3); //1495302061000
```

获取一个月多少天？
方法一：new Date()第 3 个参数默认为 1，就是每个月的 1 号，把它设置为 0 时， new Date()会返回上一个月的最后一天，然后通过 getDate()方法得到天数

```js
function getMonthDay(year, month) {
  let days = new Date(year, month + 1, 0).getDate();
  return days;
}
```

方法二:
可以把每月的天数写在数组中再判断时闰年还是平年确定 2 月分的天数

```js
function getDays(year) {
   let days = [31,28,31,...]
  if ( (year % 4 ===0) && (year % 100 !==0 || year % 400 ===0) ) {
        days[1] = 29
  }
}
```

### 如何实现以下函数?柯里化

理解柯里化 ：用闭包把参数保存起来，当参数的数量足够执行函数了，就开始执行函数

```js
dd(2, 5); // 7
add(2)(5); // 7
```

基本实现：

```js
function add() {
  let data = Array.prototype.slice.call(arguments);
  if (data.length > 1) {
    return data.reduce((source, item) => source + item, 0);
  } else {
    let sum;
    sum = (sum || 0) + data[0];
    return add.bind(this, sum);
  }
}
```

进化版：

> 当一个对象转换成原始值时，先查看对象是否有 valueOf 方法，如果有并且返回值是一个原始值，
> 那么直接返回这个值，否则没有 valueOf 或返回的不是原始值，那么调用 toString 方法，返回字符串表示

```js
function add() {
  let data = Array.prototype.slice.call(arguments);
  if (data.length > 1) {
    return data.reduce((source, item) => source + item, 0);
  } else {
    let sum = data[0];
    function tmp(b) {
      // 使用闭包
      sum = sum + b;
      return tmp;
    }
    tmp.valueOf = function() {
      return sum;
    };
    tmp.toString = function() {
      return sum + '';
    };
    return tmp;
  }
}
```

老外版本：

```js
const add = (a, b) => {
  if (a && b) return a + b;
  else
    return (buffAdd = b => {
      return a + b;
    });
};
```

参数固定版本：

```js
var curry = function(final, arity) {
  var curried = function() {
    // this是每次的参数列表
    // 每次slice()保证curry后的函数仍然是无状态的
    var new_args = this.slice();
    for (arg_key in arguments) {
      new_args.push(arguments[arg_key]);
    }

    if (new_args.length >= arity) {
      return final.apply(null, new_args);
    } else {
      return curried.bind(new_args);
    }
  };

  return curried.bind([]);
};

var sum4 = function(a, b) {
  return a + b;
};

var add = curry(sum4, sum4.length);

console.log(add(2, 5));
console.log(add(2)(5));
```

最终版

```js
function add() {
  let data = [].concat(Array.prototype.slice.call(arguments));
  function tmp() {
    // 使用闭包
    data = data.concat(Array.prototype.slice.call(arguments));
    return tmp;
  }
  tmp.valueOf = function() {
    return data.reduce((source, item) => source + item, 0);
  };
  tmp.toString = function() {
    return data.reduce((source, item) => source + item, 0);
  };
  return tmp;
}
```

有关性能的一些事：

- 存取 arguments 对象通常要比存取命名参数要慢一些。
- 一些老版本的浏览器在 arguments.length 的实现上相当慢。
- 使用 fn.apply() 和 fn.call() 要比直接调用 fn() 要慢点。
- 创建大量嵌套作用域和闭包会带来开销，无论是内容还是速度上。
- 大多数瓶颈来自 DOM 操作

扩展：

- 柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。
- 偏函数即局部应用则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数
  [函数柯里化](https://github.com/LuoShengMen/StudyNotes/issues/481)

### ES6 的 Set 内部实现

实现：

```js
function Set() {
  var items = {};
  var length = 0;
  //判断元素是否存在
  this.has = function(val) {
    return items.hasOwnProperty(val);
  };
  //增加操作
  this.add = function(val) {
    if (!this.has(val)) {
      items[val] = val;
      length++;
      return true;
    }
    return false;
  };
  // 删除操作
  this.remove = function(val) {
    if (this.has(val)) {
      delete items[val];
      length -= 1;
      return true;
    }
    return false;
  };
  // 清除
  this.clear = function() {
    items = {};
    length = 0;
    return true;
  };
  //获取大小
  this.size = function() {
    return length;
  };
  //获取属性
  this.values = function() {
    return Object.keys(items);
  };
}
var set = new Set();
set.add(1);
set.add(2);
set.add(3);
set.add('a');
```

求并集：

```js
this.union = function(otherSet) {
  var unionSet = new Set(); //存放结果
  var values = this.values();
  for (var i = 0; i < values.length; i++) {
    unionSet.add(values[i]); //放入当前集合中的元素
  }
  values = otherSet.values();
  for (var i = 0; i < values.length; i++) {
    unionSet.add(values[i]); //放入另一个集合的元素
  }
  return unionSet;
};
```

交集：

```js
this.intersection = function(otherSet) {
  var intersectionSet = new Set(); //存放结果
  var values = this.values();
  for (var i = 0; i < values.length; i++) {
    if (otherSet.has(values[i])) {
      //只放入两个集合共有的元素
      intersectionSet.add(values[i]);
    }
  }
  return intersectionSet;
};
```

差集：

```js
this.difference = function(otherSet) {
  var differenceSet = new Set(); //存放结果
  var values = this.values();
  for (var i = 0; i < values.length; i++) {
    if (!otherSet.has(values[i])) {
      //只放入集合otherSet中没有的
      differenceSet.add(values[i]);
    }
  }
  return differenceSet;
};
```

### js 实现一个拖拽？

首先是三个事件，分别是 mousedown，mousemove，mouseup
当鼠标点击按下的时候，需要一个 tag 标识此时已经按下，可以执行 mousemove 里面的具体方法。

clientX，clientY 标识的是鼠标的坐标，分别标识横坐标和纵坐标，并且我们用 offsetX 和 offsetY 来表示元素的元素的初始坐标，移动的举例应该是：
鼠标移动时候的坐标-鼠标按下去时候的坐标。

也就是说定位信息为：

鼠标移动时候的坐标-鼠标按下去时候的坐标+元素初始情况下的 offetLeft.

还有一点也是原理性的东西，也就是拖拽的同时是绝对定位，我们改变的是绝对定位条件下的 left
以及 top 等等值。
div:

```js
  <div class="drag" style="left:0;top:0;width:100px;height:100px">按住拖动</div>

<style>
        .drag {
            background-color: skyblue;
            position: absolute;
            line-height: 100px;
            text-align: center;
        }
 </style>
```

js:

```js
// 获取DOM元素
let dragDiv = document.getElementsByClassName('drag')[0];
// 鼠标按下事件 处理程序
let putDown = function(event) {
  dragDiv.style.cursor = 'pointer';
  let offsetX = parseInt(dragDiv.style.left); // 获取当前的x轴距离
  let offsetY = parseInt(dragDiv.style.top); // 获取当前的y轴距离
  let innerX = event.clientX - offsetX; // 获取鼠标在方块内的x轴距
  let innerY = event.clientY - offsetY; // 获取鼠标在方块内的y轴距
  // 按住鼠标时为div添加一个border
  dragDiv.style.borderStyle = 'solid';
  dragDiv.style.borderColor = 'red';
  dragDiv.style.borderWidth = '3px';
  // 鼠标移动的时候不停的修改div的left和top值
  document.onmousemove = function(event) {
    dragDiv.style.left = event.clientX - innerX + 'px';
    dragDiv.style.top = event.clientY - innerY + 'px';
    // 边界判断
    if (parseInt(dragDiv.style.left) <= 0) {
      dragDiv.style.left = '0px';
    }
    if (parseInt(dragDiv.style.top) <= 0) {
      dragDiv.style.top = '0px';
    }
    if (parseInt(dragDiv.style.left) >= window.innerWidth - parseInt(dragDiv.style.width)) {
      dragDiv.style.left = window.innerWidth - parseInt(dragDiv.style.width) + 'px';
    }
    if (parseInt(dragDiv.style.top) >= window.innerHeight - parseInt(dragDiv.style.height)) {
      dragDiv.style.top = window.innerHeight - parseInt(dragDiv.style.height) + 'px';
    }
  };
  // 鼠标抬起时，清除绑定在文档上的mousemove和mouseup事件
  // 否则鼠标抬起后还可以继续拖拽方块
  document.onmouseup = function() {
    document.onmousemove = null;
    document.onmouseup = null;
    // 清除border
    dragDiv.style.borderStyle = '';
    dragDiv.style.borderColor = '';
    dragDiv.style.borderWidth = '';
  };
};
// 绑定鼠标按下事件
dragDiv.addEventListener('mousedown', putDown, false);
```

### 如何把一个字符串的大小写取反（大写变小写小写变大写），例如 ’AbC' 变成 'aBc'

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

### 实现一个持续的动画效果

js 定时器实现

```js
var e = document.getElementById('e');
var flag = true;
var left = 0;
setInterval(() => {
  left == 0 ? (flag = true) : left == 100 ? (flag = false) : '';
  flag ? (e.style.left = ` ${left++}px`) : (e.style.left = ` ${left--}px`);
}, 1000 / 60);
```

js APIrequestAnimationFrame 实现

```js
//兼容性处理
window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
var e = document.getElementById('e');
var flag = true;
var left = 0;

function render() {
  left == 0 ? (flag = true) : left == 100 ? (flag = false) : '';
  flag ? (e.style.left = ` ${left++}px`) : (e.style.left = ` ${left--}px`);
}

(function animloop() {
  render();
  requestAnimFrame(animloop);
})();
```

优势：
浏览器可以优化并行的动画动作，更合理的重新排列动作序列，并把能够合并的动作放在一个渲染周期内完成，从而呈现出更流畅的动画效果
解决毫秒的不精确性
避免过度渲染（渲染频率太高、tab 不可见暂停等等）
注：requestAnimFrame 和 定时器一样也头一个类似的清除方法 cancelAnimationFrame

css 实现：

```js
animation:mymove 5s infinite;
@keyframes mymove {
from {top:0px;}
to {top:200px;}
}
```

### 如何每隔三个数加一个逗号，还要考虑小数点的情况

```js
function transform(number){
    var num = number.toString()
    var numArr = num.split('.')
    var [num, dotNum] = numArr


    var operateNum = num.split('').reverse()
    var result = [], len = operateNum.length
    for(var i = 0; i< len; i++){
         result.push(operateNum[i])
         if(((i+1) % 3 === 0) && (i !== len-1)){
              result.push(',')
        }
    }

    if(dotNum){
         result.reverse().push('.'， ...dotNum)
         return result.join('')
    }else{
         return result.reverse().join('')
    }

}

```

### 实现鼠标滑过头像显示简介

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .div1 {
        width: 100px;
        height: 100px;
        background-color: red;
        border-radius: 50px;
      }
      .div2 {
        width: 100px;
        height: 200px;
        margin-top: 10px;
        background-color: black;
        display: none;
      }
    </style>
  </head>
  <body>
    <div class="div1"></div>
    <div class="div2"></div>

    <script type="text/javascript">
      var d1 = document.getElementsByClassName('div1')[0];
      var d2 = document.getElementsByClassName('div2')[0];
      var timer;
      d1.addEventListener('mouseenter', function() {
        timer = window.setTimeout(function() {
          d2.style.display = 'block';
        }, 300);
      });
      d1.addEventListener('mouseout', function() {
        window.clearTimeout(timer);
        d2.style.display = 'none';
      });
    </script>
  </body>
</html>
```

### 一行代码实现 100 个值的数组，并且值是数组下标

一行代码实现方式:
一：

```js
var arr = Array.from(new Array(100).keys());
```

二：

```js
var arr = Object.keys(Array.from({ length: 100 }));
```

三：

```js
var arr = Object.keys(Array.apply(null, { length: 100 })).map(item => +item);
```

四：

```js
var arr = Array.from({ length: 100 }, (v, k) => k);
```

五：

```js
var arr = Array.from(Array(100), (v, k) => k);
```

六：

```js
var arr = new Array(100)
  .toString()
  .split(',')
  .map((item, index) => index);
```

扩展：循环方式：

实现方法一：循环赋值

```js
var arr1 = new Array(100);
for (var i = 0; i < arr1.length; i++) {
  arr1[i] = i;
}
console.log(arr1);
```

实现方法二：push 方法实现

```js
var arr2 = new Array();
for (var i = 0; i < 100; i++) {
  arr2.push(i);
}
console.log(arr2);
```

实现方法三：while

```js
var arr3 = new Array();
var i = 0;
while (i < 100) {
  arr3.push(i);
  i++;
}
console.log(arr3);
```

实现方法四：do while

```js
var arr4 = new Array();
var i = 0;
do {
  arr4.push(i);
  i++;
} while (i < 100);
console.log(arr4);
```

实现方法五：定时器

```js
var arr9 = [];
var i = 0;
var timer = setInterval(function() {
  arr9[i] = i++;
  if (i >= 100) {
    clearInterval(timer);
    console.log(arr9);
  }
}, 1);
```

实现方法六：递归

```js
var arr = [];
var i = 0;
function MakeArray(num) {
  if (i < num) {
    arr[i] = i++;
    MakeArray(num);
  }
  return arr;
}
console.log(MakeArray(100));
```

### 实现以下代码

1.创建长度为 5 的空数组 arr 2.生成一个(2-32)之间的随机整数 rand 3.把 rand 插入到数组 arr 内，如果数组内已存在 rand 相同的数字，则重新生成随机数插入到 arr 内。使用递归实现，不能使用 for/while 循环 4.最终输出长度为 5，且内容不重复的数组

```js
const RandomNumBoth = (Min, Max) => {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
};
const getNewArr = (arr, i) => {
  let num = RandomNumBoth(2, 32);
  if (i < 5) {
    if (arr.indexOf(num) === -1) {
      arr[i] = num;
      i++;
      getNewArr(arr, i);
    } else {
      getNewArr(arr, i);
    }
  }
  return arr;
};
let arr = Array.from(new Array(5));
let i = 0;
getNewArr(arr, i);
```

扩展：随机数获取
Math.random() 这个函数可以生成 [0,1) 的一个随机数
一、min ≤ r ≤ max

```js
function RandomNumBoth(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}
```

二、min ≤ r < max

```js
function RandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.floor(Rand * Range); //舍去
  return num;
}
```

三、min < r ≤ max

```js
function RandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  if (Math.round(Rand * Range) == 0) {
    return Min + 1;
  }
  var num = Min + Math.round(Rand * Range);
  return num;
}
```

四、min < r < max

```js
function RandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  if (Math.round(Rand * Range) == 0) {
    return Min + 1;
  } else if (Math.round(Rand * Max) == Max) {
    index++;
    return Max - 1;
  } else {
    var num = Min + Math.round(Rand * Range) - 1;
    return num;
  }
}
```

### 打印出 1 - 10000 之间的所有对称数

```js
var isPalindrome = function(x) {
  let str = x.toString().split('');
  return str.join() === str.reverse().join();
};
let arr = [];
for (let i = 1; i < 100000; i++) {
  if (isPalindrome(i)) {
    arr.push(i);
  }
}
console.log(arr);
```

### 请实现一个 add 函数，满足以下功能

> add(1); // 1
> add(1)(2); // 3
> add(1)(2)(3)；// 6
> add(1)(2, 3); // 6
> add(1, 2)(3); // 6
> add(1, 2, 3); // 6

```js
function add() {
  let args = [...arguments];
  let addfun = function() {
    args.push(...arguments);
    return addfun;
  };
  addfun.toString = function() {
    return args.reduce((a, b) => {
      return a + b;
    });
  };
  return addfun;
}
```

```js
function currying(fn, length) {
  length = length || fn.length; // 注释 1
  return function(...args) {
    // 注释 2
    return args.length >= length // 注释 3
      ? fn.apply(this, args) // 注释 4
      : currying(fn.bind(this, ...args), length - args.length); // 注释 5
  };
}
```

```js
const currying = fn =>
  (judge = (...args) => (args.length >= fn.length ? fn(...args) : (...arg) => judge(...args, ...arg)));
```

其中注释部分

注释 1：第一次调用获取函数 fn 参数的长度，后续调用获取 fn 剩余参数的长度

注释 2：currying 包裹之后返回一个新函数，接收参数为 ...args

注释 3：新函数接收的参数长度是否大于等于 fn 剩余参数需要接收的长度

注释 4：满足要求，执行 fn 函数，传入新函数的参数

注释 5：不满足要求，递归 currying 函数，新的 fn 为 bind 返回的新函数（bind 绑定了 ...args 参数，未执行），新的 length 为 fn 剩余参数的长度

### 使以下代码正常运行

```js
let a = [1, 2, 3, 4, 5];
a.multiply();
console.log(a); // [1, 2, 3, 4, 5, 1, 4, 9, 16, 25]
```

```js
Object.prototype.multiply = function() {
  let arr = this;
  a = arr.concat(arr.map(item => item * item));
};
```

### 实现 convert 方法，把原始 list 转换成树形结构，要求尽可能降低时间复杂度

以下数据结构中，id 代表部门编号，name 是部门名称，parentId 是父部门编号，为 0 代表一级部门，现在要求实现一个 convert 方法，把原始 list 转换成树形结构，parentId 为多少就挂载在该 id 的属性 children 数组下，结构如下

```js
// 原始 list 如下
let list =[
    {id:1,name:'部门A',parentId:0},
    {id:2,name:'部门B',parentId:0},
    {id:3,name:'部门C',parentId:1},
    {id:4,name:'部门D',parentId:1},
    {id:5,name:'部门E',parentId:2},
    {id:6,name:'部门F',parentId:3},
    {id:7,name:'部门G',parentId:2},
    {id:8,name:'部门H',parentId:4}
];
const result = convert(list, ...);

// 转换后的结果如下
let result = [
    {
      id: 1,
      name: '部门A',
      parentId: 0,
      children: [
        {
          id: 3,
          name: '部门C',
          parentId: 1,
          children: [
            {
              id: 6,
              name: '部门F',
              parentId: 3
            }, {
              id: 16,
              name: '部门L',
              parentId: 3
            }
          ]
        },
        {
          id: 4,
          name: '部门D',
          parentId: 1,
          children: [
            {
              id: 8,
              name: '部门H',
              parentId: 4
            }
          ]
        }
      ]
    },
  ···
];
```

解法：

```js
const convert = list => {
  const res = [];
  const map = list.reduce((res, v) => ((res[v.id] = v), res), {});
  console.log(map);
  for (const item of list) {
    if (item.parentId === 0) {
      res.push(item);
      continue;
    }
    if (item.parentId in map) {
      const parent = map[item.parentId];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
  }
  return res;
};
```

### 已知数据格式，实现一个函数 fn 找出链条中所有的父级 id

```js
const data = [
  {
    id: 1,
    name: '222',
    children: [
      {
        id: 2,
        name: '34',
        children: [
          {
            id: 112,
            name: '334',
          },
          {
            id: 112,
            name: '354',
          },
        ],
      },
    ],
  },
];
const fn = value => {
  let graph = [];
  const mapData = new Map();
  function ParentMap(data, parentId) {
    parentId = parentId || 0;
    data.forEach(item => {
      mapData[item.id] = { ...item, parentId };
      if (item.children) {
        ParentMap(item.children, item.id);
      }
    });
  }
  ParentMap(data);
  function getId(data, value) {
    graph.unshift(data[value].id);
    if (data[value].parentId !== 0) {
      getId(data, data[value].parentId);
    }
  }
  getId(mapData, value);
  return graph;
};
```

### 不借助第三者交换 a，b 两个值

```js
/* 方法一 */
a = a + b;
b = a - b;
a = a - b;

/* 方法二 */
a = a - b;
b = a + b;
a = b - a;

/* 方法三 */
a = { a: b, b: a };
b = a.b;
a = a.a;

/* 方法四 */
a = [a, b];
b = a[0];
a = a[1];

/* 方法五 */
[a, b] = [b, a];
```

### 格式化金钱，每千分位加逗号

```js
function format(str) {
  let s = '';
  let count = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    s = str[i] + s;
    count++;
    if (count % 3 == 0 && i != 0) {
      s = ',' + s;
    }
  }
  return s;
}
function format(str) {
  return str.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
```

### 给定一个整数无序数组和变量 sum,是否存在数组中任意两项和使等于 sum 的值，是则返回 true

```js
const findSum = (arr, val) => {
  let searchValues = new Set();
  searchValues.add(val - arr[0]);
  for (let i = 1, length = arr.length; i < length; i++) {
    let searchVal = val - arr[i];
    if (searchValues.has(arr[i])) {
      return true;
    } else {
      searchValues.add(searchVal);
    }
  }
  return false;
};

const findSum = (arr, sum) => arr.some((set => n => set.has(n) || !set.add(sum - n))(new Set()));
```

### Async/Await 如何通过同步的方式实现异步

Async/Await 就是一个自执行的 generate 函数。利用 generate 函数的特性把异步的代码写成“同步”的形式。

```js
var fetch = require('node-fetch');

function* gen() {
  // 这里的*可以看成 async
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url); // 这里的yield可以看成 await
  console.log(result.bio);
}
var g = gen();
var result = g.next();

result.value
  .then(function(data) {
    return data.json();
  })
  .then(function(data) {
    g.next(data);
  });
```

### 修改以下 print 函数，使之输出 0 到 99，或者 99 到 0

要求：

1. 只能修改 setTimeout 到 Math.floor(Math.random() \* 1000 的代码
2. 不能修改 Math.floor(Math.random() \* 1000
3. 不能使用全局变量

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

### 不用加减乘除运算符，求整数的 7 倍

可以使用三类方式：位运算加法、JS hack、进制转换。实现方式分别如下：

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

### 如何对数组进行排序？如：[2, [1,2], 3, "2", "a", "b", "a", [1, 2]]，重排序后[2, [1, 2], 3, "2", "a", "b"]

> 个人答案

```js
function deleteCopy(arr) {
  var map = {};
  var newarr = [];
  arr.forEach(item => {
    if (!map[JSON.stringify(item)]) {
      newarr.push(item);
      map[JSON.stringify(item)] = 1;
    }
  });
  return newarr;
}
```

### 根据以下代码，写出结果

```js
// 第一组
alert(a);
a();
var a = 3;
function a() {
  alert(10);
}
alert(a);
a = 6;
a();

//------------分割线------------------
// 第二组
alert(a);
a();
var a = 3;
var a = function() {
  // 函数表达式
  alert(10);
};
alert(a);
a = 6;
a();
```

> 考点其实就两个，第一变量声明提前，第二函数声明优先于变量声明！但是函数表达式并不会被提升！！

第一部分的代码片段会被引擎理解为如下形式：

```js
function a() {
  // 变量声明、函数声明会被提升，函数声明有先有变量申明
  alert(10);
}
var a;
alert(a);
a();
a = 3;
alert(a);
a = 6;
a();
```

第一部分运行结果：

1.函数声明优先于变量声明，所以，刚开始，a 就是 function a(){alert(10)} ，就会看到这个函数。

2.a()，执行函数，就是出现 alert(10)。

3.执行了 var a=3; 所以 alert(a)就是显示 3 。

4.由于 a 不是一个函数了，所以往下在执行到 a()的时候， 报错。

第二部的代码片段会被引擎理解为：

```js
var a;
alert(a);
a();
a = 3;
a = function() {
  // 函数表达式
  alert(10);
};
alert(a);
a = 6;
a();
```

第二部分运行结果：
1.underfind

2.报错在之前说过，预解析是把带有 var 和 function 关键字的事先声明，但不会赋值。所以一开始是 underfind，然后报错是因为执行到 a()的时候，a 并不是一个函数。因为报错了，错误会冒泡上浮，知道 catch 或者是最上层，所以不会继续执行下去。

> 备注

```js
//函数表达式，和变量声明同等
var a = function() {
  alert(10);
};
//函数声明，优于变量声明
function a() {
  alert(10);
}
```
