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

```css
.test {
  animation: mymove 5s infinite;
  @keyframes mymove {
    from {
      top: 0px;
    }
    to {
      top: 200px;
    }
  }
}
```
