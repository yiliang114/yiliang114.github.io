---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

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

应该是 `a.b.c.d` 比 `a['b']['c']['d']` 性能高点，后者还要考虑 [ ] 中是变量的情况，再者，从两种形式的结构来看，显然编译器解析前者要比后者容易些，自然也就快一点。

### 66. ES6 代码转成 ES5 代码的实现思路是什么

将 ES6 的代码转换为 AST 语法树，然后再将 ES6 AST 转为 ES5 AST，再将 AST 转为代码

### 68. 如何解决移动端 Retina 屏 1px 像素问题

1 伪元素 + transform scaleY(.5)
2 border-image
3 background-image
4 box-shadow

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

- for 循环没有任何额外的函数调用栈和上下文；
- forEach 函数签名实际上是

```js
array.forEach(function(currentValue, index, arr), thisValue)
```

它不是普通的 for 循环的语法糖，还有诸多参数和上下文需要在执行的时候考虑进来，这里可能拖慢性能；

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

### 107.考虑到性能问题，如何快速从一个巨大的数组中随机获取部分元素。

比如有个数组有 100K 个元素，从中不重复随机选取 10K 个元素。

由于随机从 100K 个数据中随机选取 10k 个数据，可采用统计学中随机采样点的选取进行随机选取，如在 0-50 之间生成五个随机数，然后依次将每个随机数进行加 50 进行取值，性能应该是最好的。

### 124.永久性重定向（301）和临时性重定向（302）对 SEO 有什么影响

1）301 redirect——301 代表永久性转移(Permanently Moved)，301 重定向是网页更改地址后对搜索引擎友好的最好方法，只要不是暂时搬移的情况,都建议使用 301 来做转址。
如果我们把一个地址采用 301 跳转方式跳转的话，搜索引擎会把老地址的 PageRank 等信息带到新地址，同时在搜索引擎索引库中彻底废弃掉原先的老地址。旧网址的排名等完全清零

2）302 redirect——302 代表暂时性转移(Temporarily Moved )，在前些年，不少 Black Hat SEO 曾广泛应用这项技术作弊，目前，各大主要搜索引擎均加强了打击力度，象 Google 前些年对 Business.com 以及近来对 BMW 德国网站的惩罚。即使网站客观上不是 spam，也很容易被搜寻引擎容易误判为 spam 而遭到惩罚。

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

### 131.接口如何防刷

referer 校验
UA 校验
频率限制（1s 内接口调用次数限制）
把某个 key 加配料，带上时间戳，加密，请求时带上，过期或解密失败则 403。
