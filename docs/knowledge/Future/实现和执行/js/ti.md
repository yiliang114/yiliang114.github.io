---
title: 类型转换
date: '2020-11-02'
draft: true
---

### 当一个 DOM 节点被点击时候，我们希望能够执行一个函数，应该怎么做？

直接在 DOM 里绑定事件：<div onclick=”test()”></div>
在 JS 里通过 onclick 绑定：xxx.onclick = test
通过事件添加进行绑定：addEventListener(xxx, ‘click’, test)
那么问题来了，Javascript 的事件流模型都有什么？

“事件冒泡”：事件开始由最具体的元素接受，然后逐级向上传播
“事件捕捉”：事件由最不具体的节点先接收，然后逐级向下，一直到最具体的
“DOM 事件流”：三个阶段：事件捕捉，目标阶段，事件冒泡

### 看下列代码输出为何？解释原因。

```js
var a;
alert(typeof a); // undefined
alert(b); // 报错
```

解释：Undefined 是一个只有一个值的数据类型，这个值就是“undefined”，在使用 var 声明变量但并未对其赋值进行初始化时，这个变量的值就是 undefined。而 b 由于未声明将报错。注意未申明的变量和声明了未赋值的是不一样的。

### 看下列代码,输出什么？解释原因。

```js
var a = null;
alert(typeof a); //object
```

解释：null 是一个只有一个值的数据类型，这个值就是 null。表示一个空指针对象，所以用 typeof 检测会返回”object”。

### 看下列代码,输出什么？解释原因。

```js
var undefined;
undefined == null; // true
1 == true; // true
2 == true; // false
0 == false; // true
0 == ''; // true
NaN == NaN; // false
[] == false; // true
[] == ![]; // true
```

undefined 与 null 相等，但不恒等（===）

一个是 number 一个是 string 时，会尝试将 string 转换为 number

尝试将 boolean 转换为 number，0 或 1

尝试将 Object 转换成 number 或 string，取决于另外一个对比量的类型

所以，对于 0、空字符串的判断，建议使用 “===” 。“===”会先判断两边的值类型，类型不匹配时为 false。

那么问题来了，看下面的代码，输出什么，foo 的类型为什么？

```js
var foo = '11' + 2 - '1';
console.log(foo);
console.log(typeof foo);
```

执行完后 foo 的值为 111，foo 的类型为 Number。

```js
var foo = '11' + 2 + '1'; //体会加一个字符串'1' 和 减去一个字符串'1'的不同
console.log(foo);
console.log(typeof foo);
```

执行完后 foo 的值为 1121(此处是字符串拼接)，foo 的类型为 String。

### 看代码给答案。

```js
var a = new Object();
a.value = 1;
b = a;
b.value = 2;
alert(a.value);
```

答案：2（考察引用数据类型细节）

### 已知数组 var stringArray = [“This”, “is”, “Baidu”, “Campus”]，Alert 出”This is Baidu Campus”。

答案：alert(stringArray.join(" "))

那么问题来了，已知有字符串 foo="get-element-by-id",写一个 function 将其转化成驼峰表示法"getElementById"。

```js
function combo(msg) {
  var arr = msg.split('-');
  var len = arr.length; //将 arr.length 存储在一个局部变量可以提高 for 循环效率
  for (var i = 1; i < len; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1, arr[i].length - 1);
  }
  msg = arr.join('');
  return msg;
}
```

(考察基础 API)

### var numberArray = [3,6,2,4,1,5]; （考察基础 API）

### 实现对该数组的倒排，输出[5,1,4,2,6,3]

### 实现对该数组的降序排列，输出[6,5,4,3,2,1]

```js
var numberArray = [3, 6, 2, 4, 1, 5];
numberArray.reverse(); // 5,1,4,2,6,3
numberArray.sort(function(a, b) {
  //6,5,4,3,2,1
  return b - a;
});
```

### 输出今天的日期，以 YYYY-MM-DD 的方式，比如今天是 2014 年 9 月 26 日，则输出 2014-09-26

```js
var d = new Date();
// 获取年，getFullYear()返回 4 位的数字
var year = d.getFullYear();
// 获取月，月份比较特殊，0 是 1 月，11 是 12 月
var month = d.getMonth() + 1;
// 变成两位
month = month < 10 ? '0' + month : month;
// 获取日
var day = d.getDate();
day = day < 10 ? '0' + day : day;
alert(year + '-' + month + '-' + day);
```

### 将字符串”<tr><td>{$id}</td><td>{$name}</td></tr>”中的{$id}替换成10，{$name}替换成 Tony （使用正则表达式）

答案："<tr><td>{$id}</td><td>{$id}\_{$name}</td></tr>".replace(/{$id}/g, '10').replace(/{\$name}/g, ‘Tony’);

### 为了保证页面输出安全，我们经常需要对一些特殊的字符进行转义，请写一个函数 escapeHtml，将<, >, &, “进行转义

```js
function escapeHtml(str) {
return str.replace(/[<>”&]/g, function(match) {
switch (match) {
case “<”:
return “<”;
case “>”:
return “>”;
case “&”:
return “&”;
case “\””:
return “"”;
}
});
}
```

### foo = foo||bar ，这行代码是什么意思？为什么要这样写？

答案：if(!foo) foo = bar; //如果 foo 存在，值不变，否则把 bar 的值赋给 foo。

短路表达式：作为"&&"和"||"操作符的操作数表达式，这些表达式在进行求值时，只要最终的结果已经可以确定是真或假，求值过程便告终止，这称之为短路求值。

### 看下列代码，将会输出什么?(变量声明提升)

```js
var foo = 1;
function(){
console.log(foo);
var foo = 2;
console.log(foo);
}
```

答案：输出 undefined 和 2。上面代码相当于：

```js
var foo = 1;
function(){
var foo;
console.log(foo); //undefined
foo = 2;
console.log(foo); // 2;
}
```

函数声明与变量声明会被 JavaScript 引擎隐式地提升到当前作用域的顶部，但是只提升名称不会提升赋值部分。

### 用 js 实现随机选取 10--100 之间的 10 个数字，存入一个数组，并排序。

```js
var iArray = [];
function getRandom(istart, iend){
var iChoice = iend - istart +1;
return Math.floor(Math.random() \* iChoice + istart);
}
for(var i=0; i<10; i++){
iArray.push(getRandom(10,100));
}
iArray.sort();
```

### 把两个数组合并，并删除第二个元素。

```js
var array1 = ['a', 'b', 'c']
var bArray = ['d', 'e', 'f']
var cArray = array### concat(bArray)
cArray.splice(1, 1)
```

### 有这样一个 URL：http://item.taobao.com/item.htm?a=1&b=2&c=&d=xxx&e，请写一段JS程序提取URL中的各个GET参数(参数名和参数个数不确定)，将其按key-value形式返回到一个json结构中，如{a:'1', b:'2', c:'', d:'xxx', e:undefined}。

答案：

```js
function serilizeUrl(url) {
  var result = {};
  url = url.split('?')[1];
  var map = url.split('&');
  for (var i = 0, len = map.length; i < len; i++) {
    result[map[i].split('=')[0]] = map[i].split('=')[1];
  }
  return result;
}
```

### 正则表达式构造函数 var reg=new RegExp("xxx")与正则表达字面量 var reg=//有什么不同？匹配邮箱的正则表达式？

答案：当使用 RegExp()构造函数的时候，不仅需要转义引号（即\"表示"），并且还需要双反斜杠（即\\表示一个\）。使用正则表达字面量的效率更高。

邮箱的正则匹配：

1
var regMail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})\$/;

### 看下面代码，给出输出结果。

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 0);
}
```

答案：4 4 4。

原因：Javascript 事件处理器在线程空闲之前不会运行。那么问题来了，如何让上述代码输出 1 2 3？

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(
    (function(a) {
      //改成立即执行函数
      console.log(a);
    })(i),
    0,
  );
}
```

1 //输出
2
3

### 写一个 function，清除字符串前后的空格。（兼容所有浏览器）

使用自带接口 trim()，考虑兼容性：

```js
if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^\s+/, '').replace(/\s+\$/, '');
  };
}

// test the function
var str = ' \t\n test string '.trim();
alert(str == 'test string'); // alerts "true"
```

### Javascript 中 callee 和 caller 的作用？

答案：

caller 是返回一个对函数的引用，该函数调用了当前函数；

callee 是返回正在被执行的 function 函数，也就是所指定的 function 对象的正文。

那么问题来了？如果一对兔子每月生一对兔子；一对新生兔，从第二个月起就开始生兔子；假定每对兔子都是一雌一雄，试问一对兔子，第 n 个月能繁殖成多少对兔子？（使用 callee 完成）

```js
var result = [];
function fn(n) {
  //典型的斐波那契数列
  if (n == 1) {
    return 1;
  } else if (n == 2) {
    return 1;
  } else {
    if (result[n]) {
      return result[n];
    } else {
      //argument.callee()表示 fn()
      result[n] = arguments.callee(n - 1) + arguments.callee(n - 2);
      return result[n];
    }
  }
}
```

中级 Javascript：

### 实现一个函数 clone，可以对 JavaScript 中的 5 种主要的数据类型（包括 Number、String、Object、Array、Boolean）进行值复制

考察点 1：对于基本数据类型和引用数据类型在内存中存放的是值还是指针这一区别是否清楚
考察点 2：是否知道如何判断一个变量是什么类型的
考察点 3：递归算法的设计

```js
// 方法一：
Object.prototype.clone = function() {
  var o = this.constructor === Array ? [] : {};
  for (var e in this) {
    o[e] = typeof this[e] === 'object' ? this[e].clone() : this[e];
  }
  return o;
};
```

//方法二：
/\*\*

- 克隆一个对象
- @param Obj
- @returns

  ```js
  function clone(Obj) {
    var buf;
    if (Obj instanceof Array) {
      buf = []; //创建一个空的数组
      var i = Obj.length;
      while (i--) {
        buf[i] = clone(Obj[i]);
      }
      return buf;
    } else if (Obj instanceof Object) {
      buf = {}; //创建一个空对象
      for (var k in Obj) {
        //为这个对象添加新的属性
        buf[k] = clone(Obj[k]);
      }
      return buf;
    } else {
      //普通变量直接赋值
      return Obj;
    }
  }
  ```

### 如何消除一个数组里面重复的元素？

```js
var arr = [1, 2, 3, 3, 4, 4, 5, 5, 6, 1, 9, 3, 25, 4];

function deRepeat() {
  var newArr = [];
  var obj = {};
  var index = 0;
  var l = arr.length;
  for (var i = 0; i < l; i++) {
    if (obj[arr[i]] == undefined) {
      obj[arr[i]] = 1;
      newArr[index++] = arr[i];
    } else if (obj[arr[i]] == 1) continue;
  }
  return newArr;
}
var newArr2 = deRepeat(arr);
alert(newArr2); //输出 1,2,3,4,5,6,9,25
```

### 小贤是一条可爱的小狗(Dog)，它的叫声很好听(wow)，每次看到主人的时候就会乖乖叫一声(yelp)。从这段描述可以得到以下对象：

```js
function Dog() {
this.wow = function() {
alert(’Wow’);
}
this.yelp = function() {
this.wow();
}
}
```

小芒和小贤一样，原来也是一条可爱的小狗，可是突然有一天疯了(MadDog)，一看到人就会每隔半秒叫一声(wow)地不停叫唤(yelp)。请根据描述，按示例的形式用代码来实。（继承，原型，setInterval）

答案：

```js
function MadDog() {
  this.yelp = function() {
    var self = this;
    setInterval(function() {
      self.wow();
    }, 500);
  };
}
MadDog.prototype = new Dog();

//for test
var dog = new Dog();
dog.yelp();
var madDog = new MadDog();
madDog.yelp();
```

### 下面这个 ul，如何点击每一列的时候 alert 其 index?（闭包）

```html
<ul id="”test”">
  <li>这是第一条</li>
  <li>这是第二条</li>
  <li>这是第三条</li>
</ul>
```

答案：

```js
// 方法一：
var lis = document.getElementById('2223').getElementsByTagName('li');
for (var i = 0; i < 3; i++) {
  lis[i].index = i;
  lis[i].onclick = function() {
    alert(this.index);
  };
}
```

```js
//方法二：
var lis = document.getElementById('2223').getElementsByTagName('li');
for (var i = 0; i < 3; i++) {
  lis[i].index = i;
  lis[i].onclick = (function(a) {
    return function() {
      alert(a);
    };
  })(i);
}
```

### 编写一个 JavaScript 函数，输入指定类型的选择器(仅需支持 id，class，tagName 三种简单 CSS 选择器，无需兼容组合选择器)可以返回匹配的 DOM 节点，需考虑浏览器兼容性和性能。

答案：（过长，点击打开）

View Code

### 请评价以下代码并给出改进意见。

```js
if (window.addEventListener) {
  var addListener = function(el, type, listener, useCapture) {
    el.addEventListener(type, listener, useCapture);
  };
} else if (document.all) {
  addListener = function(el, type, listener) {
    el.attachEvent('on' + type, function() {
      listener.apply(el);
    });
  };
}
```

评价：

不应该在 if 和 else 语句中声明 addListener 函数，应该先声明；
不需要使用 window.addEventListener 或 document.all 来进行检测浏览器，应该使用能力检测；
由于 attachEvent 在 IE 中有 this 指向问题，所以调用它时需要处理一下
改进如下：

```js
function addEvent(elem, type, handler) {
  if (elem.addEventListener) {
    elem.addEventListener(type, handler, false);
  } else if (elem.attachEvent) {
    elem['temp' + type + handler] = handler;
    elem[type + handler] = function() {
      elem['temp' + type + handler].apply(elem);
    };
    elem.attachEvent('on' + type, elem[type + handler]);
  } else {
    elem['on' + type] = handler;
  }
}
```

### 给 String 对象添加一个方法，传入一个 string 类型的参数，然后将 string 的每个字符间价格空格返回，例如：

addSpace("hello world") // -> 'h e l l o w o r l d'

```js
String.prototype.spacify = function() {
  return this.split('').join(' ');
};
```

接着上述答题，那么问题来了

1）直接在对象的原型上添加方法是否安全？尤其是在 Object 对象上。(这个我没能答出？希望知道的说一下。)

2）函数声明与函数表达式的区别？

答案：在 Javscript 中，解析器在向执行环境中加载数据时，对函数声明和函数表达式并非是一视同仁的，解析器会率先读取函数声明，并使其在执行任何代码之前可用（可以访问），至于函数表达式，则必须等到解析器执行到它所在的代码行，才会真正被解析执行。（函数声明提升）

### 定义一个 log 方法，让它可以代理 console.log 的方法。

可行的方法一：

```js
function log(msg) {
  console.log(msg);
}
log('hello world!'); // hello world!
```

如果要传入多个参数呢？显然上面的方法不能满足要求，所以更好的方法是：

```js
function log() {
  console.log.apply(console, arguments);
}
```

那么问题来了，apply 和 call 方法的异同？

答案：

对于 apply 和 call 两者在作用上是相同的，即是调用一个对象的一个方法，以另一个对象替换当前对象。将一个函数的对象上下文从初始的上下文改变为由 thisObj 指定的新对象。

但两者在参数上有区别的。对于第一个参数意义都一样，但对第二个参数： apply 传入的是一个参数数组，也就是将多个参数组合成为一个数组传入，而 call 则作为 call 的参数传入（从第二个参数开始）。 如 func.call(func1,var1,var2,var3)对应的 apply 写法为：func.apply(func1,[var1,var2,var3]) 。

### 说出以下函数的作用是？空白区域应该填写什么？

```js
//define
(function(window) {
  function fn(str) {
    this.str = str;
  }

  fn.prototype.format = function() {
    var arg = ______;
    return this.str.replace(_____, function(a, b) {
      return arg[b] || '';
    });
  };
  window.fn = fn;
})(window);

//use
(function() {
  var t = new fn('<p><a href="{0}">{1}</a><span>{2}</span></p>');
  console.log(t.format('http://www.alibaba.com', 'Alibaba', 'Welcome'));
})();
```

答案：访函数的作用是使用 format 函数将函数的参数替换掉{0}这样的内容，返回一个格式化后的结果：

第一个空是：arguments
第二个空是：/\{(\d+)\}/ig

### 写一个快速排序

### 在一个 ui li 有 10 个 i,实现点击对应的 li,输出对应的下标

### 判断链表是否有环

### 输出二叉树的最小深度

### 手写一个组合继承

### 深拷贝方案有哪些,手写一个深拷贝

### 代码题:用面向对象语法,数组去重

### 编程实现输出一个数组中第 N 大的数据?

### 代码题: 实现数组的随机排序

### js:写一个递归,就是每隔 5 秒调用一个自身,一共 100 次。
