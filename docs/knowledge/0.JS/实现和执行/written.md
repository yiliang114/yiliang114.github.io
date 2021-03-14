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

// ~~等价于Math.floor(),|0 也等价于Math.floor()
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

```js
let a = { [Symbol.toPrimitive]: (i => () => ++i)(0) };
if (a == 1 && a == 2 && a == 3) {
  console.log('1');
}
```

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

js API requestAnimationFrame 实现

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

### Object.assign() 的模拟实现

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
