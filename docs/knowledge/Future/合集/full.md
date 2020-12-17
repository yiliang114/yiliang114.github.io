---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 基础

闭包
JS 基本数据类型
作用域以及作用域链，上下文执行栈和作用域链的区别
前端性能优化
事件
原型链
继承

#### css

1. 说一下你了解 CSS 盒模型。
2. 说一下 box-sizing 的应用场景。
3. 说一下你了解的弹性 FLEX 布局.
4. 说一下一个未知宽高元素怎么上下左右垂直居中。

#### js

- 说一下原型链，对象，构造函数之间的一些联系。
- DOM 事件的绑定的几种方式
- 原型、原型链
  - 通过原型链实现继承
- 继承
- this 的使用场景
  - bind apply call 三次 this
- 闭包
- 声明一个对象的几种方法
- 限频、节流
- 跨域
  - options
- es6 以及新的特性：
  - proxy
  - 变量提升解释
  - 块级作用域
- amd cmd
  - seajs 是什么，seajs 如何加载 vuejs 的项目
- for of for in forEach map filter reduce
- 柯里化
- 手写从 url 中获取参数
- 手写一个事件类 on emit off 等

### 技术栈

1. 说一下你项目中用到的技术栈，以及觉得得意和出色的点，以及让你头疼的点，怎么解决的。
2. 有没有了解 http2.0,websocket,https，说一下你的理解以及你所了解的特性。

#### 详细 2

1. webpack 的入口文件怎么配置，多个入口怎么分割啥的，我也没太听清楚。
2. 我看到你的项目用到了 Babel 的一个插件：transform-runtime 以及 stage-2，你说一下他们的作用。
3. 我看到你的 webpack 配置用到 webpack.optimize.UglifyJsPlugin 这个插件，有没有觉得压缩速度很慢，有什么办法提升速度。
4. 简历上看见你了解 http 协议。说一下 200 和 304 的理解和区别
5. DOM 事件中 target 和 currentTarget 的区别
6. 说一下你平时怎么解决跨域的。以及后续 JSONP 的原理和实现以及 cors 怎么设置。
7. 说一下深拷贝的实现原理。
8. 说一下项目中觉得可以改进的地方以及做的很优秀的地方？
9. 有没有自己写过 webpack 的 loader,他的原理以及啥的，记得也不太清楚。
10. 有没有去研究 webpack 的一些原理和机制，怎么实现的。
11. babel 把 ES6 转成 ES5 或者 ES3 之类的原理是什么，有没有去研究。
12. git 大型项目的团队合作，以及持续集成啥的。
13. 什么是函数柯里化？以及说一下 JS 的 API 有哪些应用到了函数柯里化的实现？
14. ES6 的箭头函数 this 问题，以及拓展运算符。
15. JS 模块化 Commonjs,UMD,CMD 规范的了解，以及 ES6 的模块化跟其他几种的区别，以及出现的意义。
16. 说一下 Vue 实现双向数据绑定的原理，以及 vue.js 和 react.js 异同点，如果让你选框架，你怎么怎么权衡这两个框架，分析一下。
17. 我看你也写博客，说一下草稿的交互细节以及实现原理。
18. 怎么获取一个元素到视图顶部的距离。
19. getBoundingClientRect 获取的 top 和 offsetTop 获取的 top 区别
20. 事件委托
21. 二分查找的时间复杂度怎么求，是多少
22. XSS 是什么，攻击原理，怎么预防。4.线性顺序存储结构和链式存储结构有什么区别？以及优缺点。
23. 分析一下移动端日历，PC 端日历以及桌面日历的一些不同和需要注意的地方。
24. 白板写代码，用最简洁的代码实现数组去重。
25. 怎么实现草稿，多终端同步，以及冲突问题？

http 缓存原理， cookie
http 状态码
url 输入浏览器地址栏后的过程
请你描述下用户从输入 url 到看到完整页面这个过程发生的事情，尽可能的详细。会涉及到 http 协议，缓存等等，然后可以发散出页面比较慢的问题，怎么去优化，怎么更好的利用缓存，你用过哪些非常规的优化方法等等
输入网址到出现页面的过程（IP 解析，DNS 解析等）
DNS 是怎么解析的
TCP 连接是怎么建立的？详细讲下三次握手
三次握手为什么第二次握手时需要发送多一个 SYN 包
HTTP 请求头的组成

前端安全（中间人劫持）
跨域

模块化 seajs cmd amd 等

操作 DOM 比较耗费资源，请问怎么减少消耗
简化操作 DOM 的 API 或者库
VDOM

JS 的事件循环机制
事件循环中队列中的事件有先后顺序吗
setTimeout 设定为 0ms 会直接执行吗，如果设置为 5s 会一定在 5s 后执行吗
JS 延后加载， 怎么缩短 JS 的加载时间
解析 HTML 的过程
加载 JS 和 CSS 会阻塞浏览器的渲染吗
下载 JS 和 CSS 会阻塞吗
操作 DOM 树为什么比操作 VDOM 树要慢
HTML 文件的解析过程
为什么会生成 CSSOM 树
CSS 没有选择器
为什么生成了 CSSOM 树这样的结构
加载 JS 和 CSS 会阻塞浏览器的渲染吗
假设有一个页面的 header 有 10 个 link 包含 CSS，每个下载 10s，中间 body 中有一个 div 包含所有类，div 下面有 10 个 script，每个下载 10s，请问下载的时间是多久？
接上题，如果刷新了以后页面加载需要多久
Service Worker 是什么，操作 API 是怎么样的过程
Memory Cache 是什么，怎么操作
Disk Cache 是什么，怎么操作
Push Cache 是什么，怎么操作
如果假设都没有命中上述的缓存，确实发送了网络请求，请问 TCP 连接建立几次
请求过程中 session 一般时间是多久
请问每个 session 在服务器如果都是在有效时间内都是存在的吗，假设有 20 个 session，服务器的这些连接在这段时间都是存在的吗

display，position，XMLHttpRequest，正则，Jquery 绑定事件，cookie
BOM 浏览器信息

浏览器兼容性举例
全文单词首字母大写

正向代理反向代理

项目经验

### 基础

### css

- rem em px 单位的区别。 em 相对于父元素，rem 相对于根元素。
- 响应式布局是如何做的 ？
- 媒体查询
- margin 的合并
- 高度塌陷的问题，如何解决
- 水平居中、垂直居中 transform
- 盒模型
- bfc
- 相对定位、绝对定位
- flex 布局
- fixed 是相对谁定位 如果加上 transform 会出现问题吗
- 伪类的作用
- 纯 css 换行

### 网络

- 三次握手、四次挥手
- 常见状态码
- post 与 get
- http 的缓存，以及怎么设置， 强缓存、协商缓存
- https 是什么，有点缺点
- url 输入到显示的过程
- dns 的作用，可靠连接有哪些
- 浏览器页面渲染的流程是什么

### 浏览器

- sessionStorge , localStorge , cookie , Web Storage
- 首次进入的时候，
- 缓存
- 请指出 document load 和 document ready 的区别
- Doctype

### 异步

- promise 解决的问题
- promise 与事件循环，settimeout 以及 react 的下一次循环

### 安全

- xss
- csrf

### 框架

- react 与 vue 的生命周期
- diff 算法
- 虚拟 dom 与真实 dom 的影射
- 为什么 for 循环的 id 不能使用 index

#### react

- 绑定 this
- setState
- 事件原理， 冒泡、捕获
- hooks
- diff 原理
- fiber

#### vue

- 双向绑定原理
- 指令原理
- vue 如何实现代码的复用
- router 的 hash 和 history 有什么区别
- vuex 的使用场景
- 几种通信原理
- sync
- render
- 计算属性是如何做到属性值改变才重新计算（缓存）
- v-if v-show
  - 回流和重绘

### webpack

- 对 webpack 有了解吗？chunk、bundle 和 module 有什么区别
- https://juejin.im/post/5bee888fe51d4557fe34e356 webpack 部分

### 性能优化

- code split
- 首屏？
- 骨架屏

### 项目

babel
深度克隆
去重 排序

### vue

- router 的哈希模式与 history 有什么不同，hash 值能被监听改变么？
- JSON.stringify 和 JSON.parse() 不足之处
- 页面预渲染（seo 优化问题） https://www.cnblogs.com/Lovebugs/p/8759741.html
- webpack 插件、loader
- webpack plugins 与 module 之类的区别
- webpack 的热重载
- .native 事件
- 输入框中文输入法下的回车事件
- ff 的默认事件
- vue 为什么不支持低版本的浏览器
- 浏览器内核举例
- vue @ 3 支持到什么版本
- 引入的小图片为什么被渲染成了 base64
  - 这个是 webpack 里面的对应插件处理的.对于小于多少 K 以下的图片(规定的格式)直接转为 base64 格式渲染;具体配置在 webpack.base.conf.js 里面的 rules 里面的 url-loader 这样做的好处:在网速不好的时候先于内容加载和减少 http 的请求次数来减少网站服务器的负担
- CSSbackground 引入图片打包后,访问路径错误：因为打包后图片是在根目录下,你用相对路径肯定报错啊… 你可以魔改 webpack 的配置文件里面的 static 为./static…但是不建议。你若是把图片什么丢到 assets 目录下,然后相对路径,打包后是正常的
- 反向代理与正向代理的区别
- v-if 与 v-show 的区别
- lock 文件的作用：lock 文件的作用是统一版本号， 锁版本。 不然不同的人，不同的时间安装的包可能不一样
- package.json 里面的 dependencies 和 devDependencies 的差异
- fonticon 的原理
- setTimeout、Promise、Async/Await 的区别
- react-router 里的 <Link> 标签和 标签有什么区别? Link 的本质也是 a 标签。只不过在 Link 中禁用了 a 标签的默认事件，改用了 history 对象提供的方法进行跳转。
- vue 中的 ref 是什么？ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 \$refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例。

### 小程序

- mpvue
- taro
- uni-app

### 源码

react:
https://github.com/BetaSu/just-react

### 技术

对 vuex 的理解
vue 从 data 到渲染页面的整个过程
虚拟 dom
怎么看待组件嵌套很多层级的组件
组件设计原则
介绍状态机
对 http2 的了解
pwa 的使用
对新技术的了解
websocket 的使用场景
对 MVC MVP MVVM 的了解
对 SEO 的了解
redux - 是怎么实现的， 实现过程

### 项目

介绍做过的项目
遇到的问题以及解决方案

### 开放

三年内的职业规划
跳槽原因
同事怎么看待你
你的优点、缺点
你还能提高的地方

### 工作流程

项目开发流程

### 算法

js 二叉树
算法题 - 十多个台阶，每次走一步到两步，有多少种情况

### 技术相关 - 1 面

技术一面主要判断对基础知识的掌握

- 描述一个你遇到过的技术问题，你是如何解决的？
  - 这个问题很常见，有没有遇到过很不常见的问题？比如在网上根本搜不到解决方法的？
- 是否有设计过通用的组件？
  - 请设计一个 Dialog（弹出层） / Suggestion（自动完成） / Slider（图片轮播） 等组件
  - 你会提供什么接口？
  - 调用过程是怎样的？可能会遇到什么细节问题？
- 更细节的问题推荐参考 <https://github.com/darcyclarke/Front-end-Developer-Interview-Questions/>

### 技术相关 - 2 面

技术二面主要判断技术深度及广度

- 你最擅长的技术是什么？
  - 你觉得你在这个技术上的水平到什么程度了？你觉得最高级别应该是怎样的？
- 浏览器及性能
  - 一个页面从输入 URL 到页面加载完的过程中都发生了什么事情？越详细越好
    - （这个问既考察技术深度又考察技术广度，其实要答好是相当难的，注意越详细越好）
  - 谈一下你所知道的页面性能优化方法？
    - 这些优化方法背后的原理是什么？
    - 除了这些常规的，你还了解什么最新的方法么？
  - 如何分析页面性能？
- 其它
  - 除了前端以外还了解什么其它技术么？
  - 对计算机基础的了解情况，比如常见数据结构、编译原理等

### 兴趣相关

- 最近在学什么？接下来半年你打算学习什么？
- 做什么方面的事情最让你有成就感？需求设计？规划？具体开发？
- 后续想做什么？3 年后你希望自己是什么水平？

### 主动性相关

FEX 和很多其它团队不一样，我们没有 PM 天天跟在你后面催你做事情，所以你需要自主去发现和解决问题，主动性是我们最看重的软素质之一

- 在之前做过的项目中，有没有什么功能或改进点是由你提出来的？
- 是否有参与和改进其它开源项目

# 慕课网高级 JS 面试题

## 基础知识

1. es6 常用语法
   1. 模块化的使用和编译环境
   2. class 和构造函数的区别
   3. promise 的用法
   4. es6 其他常用的功能
2. 原型高级应用
   1. 原型如何实际应用
   2. 原型如何满足扩展
3. 异步全面讲解
   1. 什么是单线程，与异步有什么关系
   2. 什么是 event-loop
   3. 目前解决异步的方案有哪些
   4. 如果只用 jquery 如何进行解决异步
   5. promise 标准
   6. async/await 的使用

![image-20190824170755044](http://media.zhijianzhang.cn/image-20190824170755044.png)

## 框架原理

1. 虚拟 DOM

   1. 什么是 vdom 为什么要使用 vdom
   2. vdom 如何使用，核心函数有什么
   3. diff 算法

2. MVVM vue

   1. jquery 和现在使用 vue 和 React 框架的区别
   2. 如何理解 MVVM
   3. vue 如何实现响应式
   4. vue 如何解析模板
   5. 介绍 vue 的实现流程

3. 组件化 和 React

   1. 对组件化的理解
   2. JSX 是什么
   3. JSX 和 vdom 有什么区别
   4. 简述 React 和 setState
   5. 比较 React 和 Vue

![image-20190824170838520](http://media.zhijianzhang.cn/image-20190824170838520.png)

## 混合开发

1. hybrid
   1. hybrid 是什么，为什么要用
   2. hybrid 如何更新上线
2. bybrid vs h5 区别
3. 前端客户端通信 jsBridge
   1. js 如何与客户端进行通信

![image-20190824170928826](http://media.zhijianzhang.cn/image-20190824170928826.png)

## 热爱编程

1. 读书博客
2. 开源
3. 如何写博客，如何做开源

![image-20190824170941397](http://media.zhijianzhang.cn/image-20190824170941397.png)

## ES6

开发环境需要配置 babel 编译成 es5。 babel is a JavaScript compiler。

### export import 语法

- export 很多个属性，import 的时候使用 {} 解构
- export default 一个默认属性，import 的时候导入的就是整个对象

### 开发环境配置

#### babel

```bash
npm install --save-dev babel-core babel-preset-es2015 babel-preset-latest --registry=https://registry.npm.taobao.org
```

在项目下新建一个 `.babelrc` 文件，内容如下：

```json
{
  "preset": ["es2015", "latest"],
  "plugins": []
}
```

全局安装 `babel-cli` (手动编译)

```bash
npm i -g babel-cli

babel index.js
```

#### webpack

```bash
npm i webpack babel-loader --save-dev --registry=https://registry.npm.taobao.org
```

配置 `webpack.config.js`
配置 `package.json` 中的 `scripts`
运行 `npm start`

#### rollup.js

vue react 都是通过 rollup 来打包的，一般来说会被打包成比较小的 js 文件，能够对一些冗余代码做一定的优化。

```js
cnpm i rollup rollup-plugin-node-resolve rollup-plugin-babel babel-plugin-external-helpers babel-preset-latest babel-core --save-dev
```

配置 `.babelrc`:

```json
{
  "preset": [
    "latest",
    {
      "es2015": {
        "modules": false
      }
    }
  ],
  "plugins": ["external-helpers"]
}
```

配置 `rollup.config.js`

rollup 功能单一，一般来说只能处理模块化打包 （只能处理 js 文件）。webpack 功能强大，能够处理几乎所有文件。

工具要尽量功能单一，可继承，可扩展。

gulp 的功能也比较单一。

#### 关于 js 众多模块化标准

1. 没有模块化， 需要什么引什么
2. AMD 成为标准，require.js （也有 CMD）
3. 前端打包工具，nodejs 模块化可以被使用（CMD）
4. ES6 出现，想统一现在所有模块化标准
5. nodejs 积极支持，浏览器尚未统一（浏览器中还是得编译，es6 语法支持不完全）
6. 你可以自造 lib，但是不要自造标准

#### 模块化问题解答

语法：import export
环境：babel 编译 es6 语法，模块化可以用 webpack 和 rollup
扩展：说一下自己对模块化标准统一的期待

### class 和普通构造函数有和区别

class 是 es6 中比较标准和比较统一的模块化语法，可以说是升级了以前的构造函数。

#### 解答:

1. class 在语法上更加贴合面向对象的写法
2. class 实现实现继承更加易读、易理解
3. 更易与后端工程师或者有 java 等面向对象语言经验的开发者的使用
4. 本质还是语法糖，还是使用 prototype

#### js 构造函数

通过原型链实现代码的复用。

```js
function MathHandle(x, y) {
  this.x = x;
  this.y = y;
}
MathHandle.prototype.add = function() {
  return this.x + this.y;
};

var a = new MathHandle(1, 2);
console.log(a.add());
```

#### class 语法

模拟 java c# 等高级的面向对象的语言的做法。

```js
class MathHandle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add() {
    return this.x + this.y;
  }
}
var a = new MathHandle(1, 2);
console.log(a.add());
```

#### 语法糖

```js
class MathHandle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add() {
    return this.x + this.y;
  }
}

// 这种语法糖形式，看起来和实际原理不一样的东西
typeof MathHandle; // "function"
// 构造函数的（显式）原型里面默认有一个 constructor 属性，等于构造函数本身
MathHandle === MathHandle.prototype.constructor; // true
// 每一个 new 出来的实例，都拥有一个隐式原型，等于构造函数的显式原型
m.__proto__ === MathHandle.prototype; // true
```

#### 继承

```js
function Animal() {
  this.eat = function() {};
}

function Dog() {
  this.bark = function() {};
}
// 需要继承的构造函数的显式原型赋值成为被调用继承的构造函数创建出来的实例
// 低级构造函数的显式原型赋值成高级构造函数的实例
Dog.prototype = new Animal();

var hashiqi = new Dog();
```

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {}
}

class Dog extends Animal {
  constructor(name) {
    super(name);
    this.name = name;
  }
  say() {}
}

const dog = new Dog('哈士奇');
```

### Promise 的基本使用

promise 出现的目的是解决回调地狱。

普通的异步加载过程：

```js
function loadImg(src, callback, fail) {
  var img = document.createElement('img')
  img.onload = funciton() {
    callback(img)
  }
  img.onerror = function() {
    fail()
  }
  img.src = src
}

var src = 'https://xxx.jpg'
loadImg(src, function(img) {
  console.log(img.width)
}, function() {
  console.log('fail')
})
```

promise 的语法：

```js
function loadImg(src) {
  return new Promise((resolve, reject) => {
    var img = document.createElement('img');
    img.onload = function() {
      resolve(img);
    };
    img.onerror = function() {
      reject();
    };
    img.src = src;
  });
}
var src =
  'https://ss0.bdstatic.com/6KYTfyqn1Ah3otqbppnN2DJv/zheguilogo/8b83961cd845269d7a3677ef9efa0751_originalsize.jpeg';
loadImg(src)
  .then(
    img => {
      console.log(img.width);
    },
    () => {
      console.log('fail');
    },
  )
  .then(img => {
    // promise 的链式调用，需要前面的 then 中 return 出值或者一个新的 promise
    console.log(img);
  });
```

### ES6 其他常用功能

1. let/const
2. 多行字符串/模板变量
3. 解构赋值
4. 块级作用域

   ```js
   var obj = { a: 1, b: 2 };
   for (var item in obj) {
     console.log(item);
   }
   console.log(item); // 'b'

   const obj = { a: 1, b: 2 };
   for (let item in obj) {
     console.log(item);
   }
   console.log(item); // undefined
   ```

5. 函数默认参数
6. 箭头函数（this 彻底解决之前 this 指向全局 window 的问题）
   ```js
   let arr = [1, 2, 3];
   arr.map(function(item) {
     // this 指向了 window ...
     console.log('js', this);
   });
   ```

## 原型 (实际应用)

1. zepto 和 jquery 中的实际应用
2. 说一个原型的实际应用
3. 原型如何提醒它的扩展性 （jquery 的插件机制）

## 异步

#### 什么是单线程，和异步有什么关系

1. 单线程： 只有一个线程，只能做一键事情
2. 原因：避免 DOM 渲染的冲突
   - 浏览器需要渲染 dom
   - js 可以修改 dom 结构
   - js 执行的时候，浏览器 dom 渲染会停止
   - 两端 js 也不能同时执行（都修改 dom 就会冲突）
   - web worker 支持多线程，但是不能访问 dom
3. 解决方案： 异步（比较高效的一个选择）

#### 什么是 event loop

#### 是否用过 jquery 的 deferred

#### Promise 的基本使用和原理

#### 介绍一下 async await （和 promise 的区别和联系）

#### 总结一下当前的 js 异步解决方案

## 我们喜欢什么样的面试者

- 基础扎实
  - 从多年的经验看，那些发展好的同学都具备扎实的基础知识
  - 比如只懂 jQuery 不懂 JavaScript 是不行的哦
  - 如果了解计算机基础会更好，因为我们将面临很多非前端技术的问题
- 主动思考
  - 被动完成任务的同学在这里进步会很慢
  - 你需要有自己的想法，而不是仅仅完成任务
- 爱学习
  - 前端领域知识淘汰速度很快，所以最好能经常学习和接触新东西
- 有深度
  - 遇到问题时多研究背后深层次的原因，而不是想办法先绕过去
  - 比如追踪某个 Bug 一直了解它本质的原因
- 有视野
  - 创新往往来自于不同学科的交集，如果你了解的领域越多，就越有可能有新想法

### 基础面

- 页面布局
- DOM 事件
- HTTP 协议
- 面向对象
- 原型链
- 通信
- 安全
- 算法

#### 面试准备

1. JD 描述分析
2. 业务分析
3. 技术栈准备
4. 自我介绍

#### 模拟一面

1. 面试技巧，页面布局类
2. css 盒模型 DOM 事件类
3. HTTP 协议类 原型链类
4. 面向对象类 通信类
5. 前端安全类 前端算法类（短时间内搞不定）

#### 模拟二面

1. 面试技巧
2. 渲染机制类
3. js 运行机制
4. 页面性能
5. 错误监控

#### 模拟三面

1. 面试技巧
2. 业务能力
3. 团队协作能力
4. 带人能力

#### 模拟终面（hr）

1. 面试技巧
2. 职业竞争力
3. 职业规划（不能说走一步看一步）

#### 总结

1. 注意事项
2. 复习指南

### 背景

校招更看重能力，其次是（基本）知识。

社招的知识更看重深度，以及架构上的能力。业务代码抽象能力，项目把控能力。经验体现在，协调其他人快速进行开发。

面试环节：

1. 一面：主要去测试基础知识点（HTML/CSS/JS）
2. 二面、三面：基础之上的延伸，深入原理。例如： 用 vue 做了什么。 先会问项目中的一些东西，接着就会落脚到 vue 上，比如 vue 的生命周期，vue 的工作原理是什么，有没有看过源码，你觉得源码有什么缺点，如果让你改进你怎么改进。 或者认为它的框架有什么优点。
3. 三面、四面：一般情况下不会面技术。技术负责人、业务负责人。不再关注技术点。职业生涯里，在哪一个项目有没有做过哪些事情，你的角色是什么，你推动了什么，你改变了什么。
4. 终面：沟通，性格，潜力。

### 面试准备

#### 职位描述分析 1

职位描述：

可能会存在下面几点：

1. PC 端、移动端
2. H5 (Hybrid 或者 纯 h5 动画、3d 效果)
3. 数据 mock （从调试接口从体现）
4. 建立前端组件库（是否有组件库经验、是否读过其他组件库的源码）
5. 对现有系统的优化和重构

任职要求：

1. html5 最新规范，熟练运用移动端
2. 熟悉 js 面向对象编程
3. 熟悉 web 标准（最新），html 语义化，用 vue react 开发的过程中遇到过什么问题，如何解决的
4. 具有前端构架分析与设计能力（1-2 年里很少）准备一个现在项目的架构，目录如何设计、复用性如何设计、模块化如何设计、自动化测试如何测、上线流日志。都要想清楚。
5. 代码质量易读易维护，高质量。 每一个函数的功能要单一（不要写成一坨），能抽象的尽量抽象。
6. 用户体验、用户可用性。观察是否流畅，卡不卡等，如何进行排查，或者收集用户的反馈。原本是怎么样的，做了什么增强了用户体验。
7. 强烈兴趣。github 上看比较火的项目中用了什么东西， service worker ， pwa 等。 多看一些前沿技术博客。（需要准备，但不是重点内容）
8. scss less （算是基础）
9. 环境搭建（webpack gulp 等，需要自己手动搭建过， grunt 与 gulp 的区别）的流程。

#### 职位描述分析 2

1. canvas css3 （动画： 1. dom 动画 2. svg 动画 3. canvas 动画）运营活动 h5 一般需要 canvas css3 做 GPU 加速
2. 微信开发过程中常见的坑
3. web 标准 => es6 HTML5 Typescript
4. （可用性，可访问性）前端监控，如何捕获前端异常，异常分几种：1. js 即时运行异常 2. 资源加载错误

#### 业务分析或者实战模拟

直接打开他们业务，观察业务技术栈。

1. 导航类组件 ？ 基本布局？简单动画效果（css3 动画）
2. jquery 事件委托。
3. webpack 的目录，一般都是 sourcemap 生成的。
4. elements 中直接看 head。
   1. meta content='webkit' 是啥意思？双核浏览器渲染。
   2. meta http-equiv 兼容性
   3. dns-prefetch 预解析。 图片懒加载。 js 懒加载
5. localstorage
6. 字体。 fronts 自定义字体，图标。
7. 日期选择器的处理，算法比较麻烦的。
8. script 外链异步加载的方式有几种

#### 技术栈准备

jquery vue react node

jquery 源码按照博客写的过一遍。

scss less post-css

webpack

#### 自我介绍

学历、工作经历（时间-公司-岗位-职责-技术栈-业绩（重要，带来哪些成就、想出哪些产出、有输出什么技术方案，解决哪些技术问题））、开源项目。

##### 自我陈述

1. 把握面试的沟通方向。 （前端负责人？ 问题： 项目有几个人，在项目中承担什么样的角色，项目管理还是技术管理，你做出了什么样的成绩。 项目是怎么进行分配的，团队怎么进行协作，技术管理上如何配合，技术难点是如何解决的）

   1. 比如分析了他们的网站所用到的技术或者效果，把它的实现方式分析了一遍，又自己实现了一遍不同的方式。在自我陈述的时候就可以说，我平时比较习惯研究一些网站，喜欢去看技术原理，或者好玩的点，自己比较喜欢思考，也愿意去尝试去做有没有更好的方式。

2) 豁达、自信的适度发挥。

   即时收住，被欣赏。

   ![image-20190824195833657](http://media.zhijianzhang.cn/image-20190824195833657.png)

nodejs 日志排查，上线发布。

nginx 配置详解

#### 面试准备、自我陈述

##### 实例

- 自如谈兴趣、巧妙示实例、适时讨疑问
- 节奏要适宜（问题可能会简单，慢慢来）、切忌小聪明 （枚举出所有能解决的方式）

##### 实战（二、三面问经验）

- 方向要对，过程要细（技术决策，大体要说清楚。 如果知道得越多，说的要多细）
- 胆子要大，心态要和（做算法时要去猜）

### 一面/二面

主要是面试基础知识。

面试技巧：

1. 准备基础知识
2. 知识点要准备系统化，梳理相关的知识点
3. 沟通需要简洁，一语中的。直接说出答案
4. 内心需要诚实。（了解比较少，请教面试官。不能不懂装懂或者看过忘记了）
5. 态度要谦虚
6. 回答要灵活（不能把绝对的答案说的太死）

#### 面试模拟

- 页面布局
- css 盒模型
- dom 事件
- http 协议 https http2
- 面向对象
- 原型链 （说清楚始末）
- 通信（跨域，前后端通信）
- 安全 （CSRF XSS）慕课网
- 算法

##### 页面布局

题目：假如高度已知，请写出三栏布局，其中左栏右栏宽度各位 300px 中间自适应。

1. 浮动

   ```js
     // html
     <section class="layout">
       <div class="left"></div>
       <div class="right"></div>
       <div class="center">中间内容</div>
     </section>

     // css
       .layout div {
         min-height: 100px;
       }

       .layout .left {
         float: left;
         width: 300px;
         background-color: red;
       }

       .layout .right {
         float: right;
         width: 300px;
         background-color: blue;
       }

       .layout .center {
         background-color: yellow;
       }
   ```

2. 绝对定位

   ```js
   // html
     <section class="layout">
       <div class="left"></div>
       <div class="right"></div>
       <div class="center">中间内容</div>
     </section>
   // css
       .layout div {
         position: absolute;
         min-height: 100px;
       }

       .layout .left {
         left: 0;
         width: 300px;
         background-color: red;
       }

       .layout .right {
         right: 0;
         width: 300px;
         background-color: blue;
       }

       .layout .center {
         left: 300px;
         right: 300px;
         background-color: yellow;
       }
   ```

3. flex-box

   ```js
   // html
     <section class="layout">
       <div class="left"></div>
       <div class="center">中间内容</div>
       <div class="right"></div>
     </section>
   // css
       .layout {
         display: flex;
       }

       .layout div {
         min-height: 100px;
       }

       .layout .left {
         width: 300px;
         background-color: red;
       }

       .layout .right {
         width: 300px;
         background-color: blue;
       }

       .layout .center {
         flex: 1;
         background-color: yellow;
       }

   ```

4. 表格布局

   ```js
   // html
     <section class="layout">
       <div class="left"></div>
       <div class="center">中间内容</div>
       <div class="right"></div>
     </section>
   // css
   /* 设置容器 */
       .layout {
         width: 100%;
         display: table;
         height: 100px;
       }

       .layout>div {
         display: table-cell;
       }

       /* 设置元素 */
       .layout .left {
         width: 300px;
         background-color: red;
       }

       .layout .right {
         width: 300px;
         background-color: blue;
       }

       .layout .center {
         background-color: yellow;
       }
   ```

5. 网格布局 grid

   ```js
   // html
     <section class="layout">
       <div class="left"></div>
       <div class="center">中间内容</div>
       <div class="right"></div>
     </section>
   // css
       /* 设置容器 */
       .layout {
         width: 100%;
         display: grid;
         /* 行 */
         grid-template-rows: 100px;
         /* 列 */
         grid-template-columns: 300px auto 300px;
       }

       /* 设置元素 */
       .layout .left {
         background-color: red;
       }

       .layout .right {
         background-color: blue;
       }

       .layout .center {
         background-color: yellow;
       }
   ```

（真的有这么简单？）延伸：

###### 这几种方式各自的优缺点有哪些？

浮动的局限性，浮动之后会脱离文档流，需要清除浮动，但是它的兼容性比较好。

绝对定位书写简单，写的很快一般也不容易出问题，但是因为容器已经脱离文档流了，意味着下面所有的子元素都必须脱离文档流，就导致了这个方案的可使用性比较差。

flex 布局，css 3 中为了解决上述两个布局的缺陷出现的。属于比较完美的，尤其是在移动端基本都是 flex 布局。flex 兼容性一般，pc 上的 ie8 是不支持 flex 的。

表格布局在很多场景中表现很好，比如三栏布局，表格布局很轻易就做到了。表格布局的兼容性很好，flex 布局不兼容的时候就会使用表格布局了。缺点：其中的某一个单元格高度超出的时候，两侧的高度也是自动增高的，有一些场景是不需要这样的特性的。

网格布局（之前的网格布局都是模拟的），作为一个新的技术，css 代码能够写的比较少。

###### 如果去掉高度已知条件（比如中间内容较多，左右也自动增高）哪个方案就不能用了？

不改动的情况下 flex 布局 和 table 布局基本都是能够通用的。其他情况都需要做改动。

其他几种方案为啥不能用 ？

浮动布局左侧 右侧 如果没有遮挡物的时候，中间部分的文本就会往左靠。 如果想让中间部分的文本中间对齐的话，需要创建 BFC

![image-20190825162009221](http://media.zhijianzhang.cn/image-20190825162009221.png)

###### 这几种方案兼容性如何？

浮动、绝对定位以及表格布局的兼容性最好。

###### 最佳选择是哪一种？

手写代码的时候，标签的语义化需要注意掌握。页面布局理解深刻。

##### 页面布局的变通

###### 三栏布局

- 左右宽度固定，中间自适应
- 上下高度固定，中间自适应 （常见）

###### 两栏布局

- 左宽度固定，右自适应
- 右宽度固定，左自适应
- 上宽度固定，下自适应
- 下宽度固定，上自适应

#### DOM 事件类

##### DOM 事件的级别

1. DOM0

   ```
   element.onclick = function(){}
   ```

2. DOM2

   ```
   element.addEventListener('click', function(){}, flase) // bool 指定冒泡还是捕获
   ```

3. DOM3

   ```
   element.addEventListener('keyup', function(){}, false) // dom3 增加了很多事件类型
   ```

##### DOM 事件模型

指的就是冒泡和捕获。冒泡是目标元素向上，捕获是从上往下

##### DOM 事件流

事件流是一个事件发生之后如何进行传递的过程。一个完整的事件流分三个阶段：捕获、目标阶段、冒泡。

##### 描述 DOM 事件捕获的具体流程

捕获是从上到下的过程。 第一个接触到的对象是 window, 接着是 document, 再是 html 标签，接着是 body 元素，再一层一层父级元素，最后到目标元素。获取 body 标签 `document.body` ， 或者 html 标签 `document.documentElement`.

##### Event 对象的常见应用

```
event.preventDefault() // 阻止默认事件，比如阻止 a 标签的跳转行为

event.stopPropagation() // 阻止冒泡。

event.stopImmediatePropagation() // 如果一个对象绑定了两个函数，一般来说两个函数会被依次执行。 如果在回调函数 A 中调用 stopImmediatePropagation 之后就不会再执行回调函数 B 了。

// 事件委托（代理） 只做一次绑定。
event.currentTarget // 当前绑定事件的元素
event.target // 当前被点击的元素
```

##### 自定义事件

如何自定义事件， 自动触发。（ vue 里面以及普通 js 中 ？ ）

```
var evt = new Event('custom')
// 在 dom 上注册事件
element.addEventListener('custom', function(){
	console.log('custom')
})
// 自定义触发事件
element.dispatch('evt')
```

Event 和 CustomEvent 的用法都是一致的，不过后者可以在后面跟随一个 obj 传需要传的参数。

#### HTTP 协议类

##### HTTP 协议的主要特点

简单快速、灵活、无连接、无状态（后面两个重要）

##### HTTP 报文的组成部分

http 就是建立在 tcp 连接之上的应用（层？）http 报文是由请求报文和相应报文组成的。

请求报文：

    1. 请求行。请求行包含 http 方法，页面地址，http 协议以及版本

2. 请求头。 一些 key-value 值告诉服务端需要什么内容 3. 空行。分离请求头和请求体 4. 请求体

响应报文：

1. 状态行
2. 响应头
3. 空行
4. 响应体

##### HTTP 方法

GET, POST, PUT, DELETE, HEAD

HEAD 方法用于获取报文首部

##### POST 和 GET 的区别

1. GET 在浏览器回退时是无害的，而 POST 会再次提交请求 （记）
2. GET 产生的 URL 地址可以被收藏，而 POST 不可以
3. GET 请求会被浏览器主动缓存，而 POST 不会，除非手动设置 （记）
4. GET 请求只能进行 URL 编码，而 POST 支持多种编码方式
5. GET 请求参数会被完整保存在浏览器的历史记录里，而 POST 中的参数不会被保留 （记）
   为了防止 CSRF 攻击好多人都会把 GET 请求改成 POST 请求
6. GET 请求在 URL 中传送的参数是有长度限制的（基本是 2 kb，不同浏览器不一样，因为 http 协议对长度是有限制的，会被截断），而 POST 没有限制 （记）
7. 对参数的数据类型，GET 只接受 ASCII 字符，而 POST 没有限制
8. GET 比 POST 更不安全，因为参数直接暴露在 URL 上，所以不能用来传入敏感信息
9. GET 参数通过 URL 传递，POST 放在 Request Body 中 （记）

##### HTTP 状态码

1xx: 指示信息
2xx: 成功 200 206
3xx: 重定向 301 永久重定向 302 临时重定向 304 缓存
4xx: 客户端错误 400 401 未授权 403 资源禁止被访问 404 资源不存在
5xx: 服务端错误 500 503

##### 什么是持久连接

我们知道 HTTP 协议采用“请求-应答”模式，当使用普通模式，即非 Keep-Alive 模式时，每个请求/应答客户和服务器都要新建一个连接，完成之后立即断开连接（HTTP 协议为无连接的协议）；当使用 Keep-Alive 模式（又称持久连接、连接重用）时，Keep-Alive 功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive 功能避免了建立或者重新建立连接。

http 1.1 之后支持

##### 管线化其他内容

![image-20190825194158893](http://media.zhijianzhang.cn/image-20190825194158893.png)

#### 原型链

##### 创建对象有几种方法

##### 原型、构造函数、实例、原型链

![image-20190825194534988](http://media.zhijianzhang.cn/image-20190825194534988.png)

\> PS：任何一个函数，如果在前面加了`new`，那就是构造函数。

**### 原型、构造函数、实例三者之间的关系**

![](http://img.smyhvae.com/20180306_2107.png)

\1. 构造函数通过 `new` 生成实例

\2. 构造函数也是函数，构造函数的`prototype`指向原型。（所有的函数有`prototype`属性，但实例没有 `prototype`属性）

\3. 原型对象中有 `constructor`，指向该原型的构造函数。

\> 上面的三行，代码演示：

\```js

**var** **Foo** = **function** (name) {

​ **this\*\***.\*\*name = name;

}

**var** fn = **new** **Foo**('smyhvae');

\```

\> 上面的代码中，`Foo.prototype.constructor === Foo`的结果是`true`：

![](http://img.smyhvae.com/20180306_2120.png)

\> `Object`是原型链的顶端。

\- 原型可以起到继承的作用。原型里的方法都可以被不同的实例共享：

\```js

//_给 Foo 的原型添加 say 函数_

**Foo\*\***.**prototype**.\***\*say** = **function** () {

​ console**.**log('');

}

\```

**\*\*原型链的关键\*\***：在访问一个实例的时候，如果实例本身没找到此方法或属性，就往原型上找。如果还是找不到，继续往上一级的原型上找。

\- `instanceof`的**\*\*作用\*\***：用于判断**\*\*实例\*\***属于哪个**\*\*构造函数\*\***。

\- `instanceof`的**\*\*原理\*\***：判断实例对象的`__proto__`属性，和构造函数的`prototype`属性，是否为同一个引用（是否指向同一个地址）。

\> - **\*\*注意 1\*\***：虽然说，实例是由构造函数 new 出来的，但是实例的`__proto__`属性引用的是构造函数的`prototype`。也就是说，实例的`__proto__`属性与构造函数本身无关。

\> - **\*\*注意 2\*\***：在原型链上，原型的上面可能还会有原型，以此类推往上走，继续找`__proto__`属性。这条链上如果能找到， instanceof 的返回结果也是 true。

比如说：

\- `foo instance of Foo`的结果为 true，因为`foo.__proto__ === M.prototype`为`true`。

\- **\*\*\*\***`foo instance of Objecet`\***\*的结果也为 true\*\***，为`Foo.prototype.__proto__ === Object.prototype`为`true`。

\> 但我们不能轻易的说：`foo` 一定是 由`Object`创建的实例`。这句话是错误的。我们来看下一个问题就明白了。

**### 分析一个问题**

**\*\*问题：\*\***已知 A 继承了 B，B 继承了 C。怎么判断 a 是由 A**\*\*直接生成\*\***的实例，还是 B 直接生成的实例呢？还是 C 直接生成的实例呢？

\> 分析：这就要用到原型的`constructor`属性了。

\- `foo.__proto__.constructor === M`的结果为`true`，但是 `foo.__proto__.constructor === Object`的结果为`false`。

\- 所以，用 `consturctor`判断就比用 `instanceof`判断，更为严谨。

\- 将此空对象的隐式原型指向其构造函数的显示原型。

\- 执行构造函数（传入相应的参数，如果没有参数就不用传），同时 `this` 指向这个新实例。

\- 如果返回值是一个新对象，那么直接返回该对象；如果无返回值或者返回一个非对象值，那么就将步骤（1）创建的对象返回。

#### 面向对象

类的声明

生成实例

如何实现继承

继承的几种方式

#### 通信类

##### 什么是同源策略及限制

协议、端口、域名有一个不一样就是不同源

![image-20190825195714942](http://media.zhijianzhang.cn/image-20190825195714942.png)

##### 前后端如何进行通信

ajax （同源下的策略）

websocket （不限制是否同源）

cors （支持跨域通信也支持跨域通信）

##### 如何创建 ajax

手写的 ajax 是否兼容 IE ， IE 下面的 ajax 与普通浏览器的 ajax 对象不一样

![image-20190825195900133](http://media.zhijianzhang.cn/image-20190825195900133.png)

##### 跨域通信的几种方式

1. JSONP

2. Hash url 中 # 号后面的内容， hash 修改页面不刷新， search 修改会刷新页面

   利用 window.onhashChange 获取修改的 hash

3. postMessage （HTML5 新增）

4. WebSocket

5. CORS （添加 http 请求头允许跨域通信）

#### 安全类

1. CSRF

   跨站请求伪造。条件： 1. 用户在 A 网站确实登录过。 2. A 网站接口存在漏洞，会下发登录态。

   防御：1. token 验证 2. Referer 验证（页面来源验证） 3. 隐藏令牌

   ![image-20190825200601295](http://media.zhijianzhang.cn/image-20190825200601295.png)

2. XSS

   跨域脚本攻击

3) SQL 注入跟前端关系不大

#### 算法类

1. 排序。 快排、选择、希尔、冒泡排序的时间、空间复杂度以及稳定性。

   ![image-20190825201055647](http://media.zhijianzhang.cn/image-20190825201055647.png)

2. 堆栈、队列、链表

3. 递归

4. 波兰式和逆波兰式 （解决乘除类）

### 二面、三面

知识体系的深度（浏览器原理，js 引擎）

#### 渲染机制

什么是 DOCTYPE 及作用

浏览器的渲染过程

重排 Reflow

重绘 Repaint

#### js 运行机制

如果理解 js 的单线程

什么是任务队列

什么是 event loop

同步任务会存放入任务栈中。如果遇到 settimeout 或者 ajax 请求之类的，不会直接存放入任务栈中。同步任务执行完毕之后，过了 settimeout 中设置的时间，就会被放到异步任务队列中。

###### 异步任务

1. settimeout 和 setinterval
2. DOM 事件
3. ES6 的 promise

#### 页面性能

保证页面加载的流畅，提升页面性能的方法有哪些？

- 资源压缩合并，减少 HTTP 请求，开启 gzip 压缩

- 非核心代码的异步加载

  - 异步加载方式
    - 动态脚本加载
    - defer
    - async
  - 异步加载的区别
    - defer 是 HTML 解析完之后才会执行，如果是多个按照循序依次执行
    - async 是在加载完之后立即执行，如果是多个，执行顺序和加载顺序无关，哪一个先加载完毕先执行

- 利用浏览器缓存

  - 缓存分类

    - Expires
    - Cache-control

  - 缓存原理

    - Last-Modified If-Modified-Since

    - Etag If-None-Match

* 使用 CDN

* DNS 预解析(啥叫预解析？ 很多浏览器中（打开）的 a 标签的预解析开关，但是对于 https 的链接，默认是关闭的，打开的话提升性能)

  - http-equiv="x-dns-prefetch-control" content="on"
  - rel="dns-prefetch"

#### 错误监控

提交代码之前。

线上的错误收集。

##### 前端错误的分类

1. 即时运行错误： 代码错误

2. 资源加载错误

##### 错误的捕获方式

###### 即时运行错误的捕获方式

1. try catch
2. window.onerror 或者 window.addEventListener('error', function(){}, false) 这个只能捕获即时运行错误，资源加载错误因为不会冒泡，所以不会被 window.onerror 捕获到。

###### 资源加载错误

1. object.onerror 比如说是一个 img 标签，这里就是 img 的 onerror 事件，就可以捕获到， script 标签也是。

2. performance.getEntries 高级浏览器才有。这个 api 可以获取到所有已经加载资源的加载时长，可以间接获取到未加载的资源。

3. Error 事件捕获 window.addEventListener('error', function(){}, true) 只是不能冒泡，但是捕获是可以的。

###### 跨域的 js 运行错误可以捕获吗？ 错误是什么，应该怎么处理？

![image-20190825223144340](http://media.zhijianzhang.cn/image-20190825223144340.png)

上报错误的基本原理

1. 采用 ajax 上报
2. 利用 Image src 上报 (new Image ()).src = "xxxx"

### 三面、四面

（技术、业务负责人）

准备好要说的项目后面的技术原理和难点。

项目架构，基础能力，人员安排组织， 遇到过什么问题，攻克什么难题（需要把握时间，组织好时间）

想办法把准备的东西说出来，引导找时机。

##### 考察能力

1. 业务能力

   - 我做过什么业务（最好能用几句话描述做过的事情）
   - 负责的业务有什么业绩 （用户量提升了多少，性能提升了多少， 需要数据）
   - 使用了什么技术方案（技术栈）
   - 突破了什么技术难点（别人做不到的，我做到了）
   - 遇到了什么问题（肯定有遇到的问题，证明深入）
   - 最大的收获是什么（技术上得到了成长，业务上有什么总结）
   - ![image-20190825224138747](http://media.zhijianzhang.cn/image-20190825224138747.png)

2. 团队协作能力（保持愉快的合作氛围，要让别人觉得你乐于与别人合作）通过其他事情描述的过程中体现出来（不要直接说这个）。

   ![image-20190825224356384](http://media.zhijianzhang.cn/image-20190825224356384.png)

3) 事务推动能力（跨部门，跨组，说一说这里的经验）

   1. vuex 插件的推动
   2. 前端监控系统
   3. 专利

   ![image-20190825224757911](http://media.zhijianzhang.cn/image-20190825224757911.png)

4) 带人能力

   ![image-20190825224851209](http://media.zhijianzhang.cn/image-20190825224851209.png)

5) 其他能力

   ![image-20190825224918220](http://media.zhijianzhang.cn/image-20190825224918220.png)

#### 终面 HR

乐观积极、上进、果断。

![image-20190825225011456](http://media.zhijianzhang.cn/image-20190825225011456.png)

##### 话题

1. 职业竞争力

   业务能力，我想做什么方向上做到最好的坚持。

   ![image-20190825225158140](http://media.zhijianzhang.cn/image-20190825225158140.png)

2. 职业规划

   希望公司里有一些周分享之类的。

   多赞美 hr 和公司。

   ![image-20190825225435751](http://media.zhijianzhang.cn/image-20190825225435751.png)

![image-20190825230056651](http://media.zhijianzhang.cn/image-20190825230056651.png)

![image-20190825230214093](http://media.zhijianzhang.cn/image-20190825230214093.png)

![image-20190825230234104](http://media.zhijianzhang.cn/image-20190825230234104.png)

## js

### 浏览器

事件冒泡，捕获，事件代理
浏览器事件循环
跨域的几种方式，cors 的头，需要设置哪些

### 网络

##### TCP 三次握手和四次挥手的全过程

三次握手：
第一次握手：客户端发送 syn 包(syn=x)到服务器，并进入 SYN_SEND 状态，等待服务器确认；
第二次握手：服务器收到 syn 包，必须确认客户的 SYN（ack=x+1），同时自己也发送一个 SYN 包（syn=y），即 SYN+ACK 包，此时服务器进入 SYN_RE 状态；
第三次握手：客户端收到服务器的 SYN ＋ ACK 包，向服务器发送确认包 ACK(ack=y+1)，此包发送完毕，客户端和服务器进入 ESTABLISHED 状态，完次握手。
握手过程中传送的包里不包含数据，三次握手完毕后，客户端与服务器才正式开始传送数据。理想状态下，TCP 连接一旦建立，在通信双方中的任何一动关闭连接之前，TCP 连接都将被一直保持下去。
四次挥手
与建立连接的“三次握手”类似，断开一个 TCP 连接则需要“四次握手”。
第一次挥手：主动关闭方发送一个 FIN，用来关闭主动方到被动关闭方的数据传送，也就是主动关闭方告诉被动关闭方：我已经不 会再给你发数据了然，在 fin 包之前发送出去的数据，如果没有收到对应的 ack 确认报文，主动关闭方依然会重发这些数据)，但是，此时主动关闭方还可 以接受数据。
第二次挥手：被动关闭方收到 FIN 包后，发送一个 ACK 给对方，确认序号为收到序号+1（与 SYN 相同，一个 FIN 占用一个序号）。
第三次挥手：被动关闭方发送一个 FIN，用来关闭被动关闭方到主动关闭方的数据传送，也就是告诉主动关闭方，我的数据也发送完了，不会再给你发了。
第四次挥手：主动关闭方收到 FIN 后，发送一个 ACK 给被动关闭方，确认序号为收到序号+1，至此，完成四次挥手。

##### TCP 的三次握手过程？为什么会采用三次握手，若采用二次握手可以吗？

    建立连接的过程是利用客户服务器模式，假设主机A为客户端，主机B为服务器端。
    （1）TCP的三次握手过程：主机A向B发送连接请求；主机B对收到的主机A的报文段进行确认；主机A再次对主机B的确认进行确认。
    （2）采用三次握手是为了防止失效的连接请求报文段突然又传送到主机B，因而产生错误。失效的连接请求报文段是指：主机A发出的连接请求没有收到主机B的确认，于是经过一段时间后，主机A又重新向主机B发送连接请求，且建立成功，顺序完成数据传输。考虑这样一种特殊情况，主机A第一次发送的连接请求并没有丢失，而是因为网络节点导致延迟达到主机B，主机B以为是主机A又发起的新连接，于是主机B同意连接，并向主机A发回确认，但是此时主机A根本不会理会，主机B就一直在等待主机A发送数据，导致主机B的资源浪费。
    （3）采用两次握手不行，原因就是上面说的实效的连接请求的特殊情况。

##### TCP 三次握手的过程，为什么是三次而不是两次或者四次？

第一次握手：客户端发送一个 syn（同步）包（syn=x）给服务器，进入 SYN_SEND 状态，等待服务器确认

第二次握手：服务端收到客户端发送的同步包，确认客户端的同步请求（ack=x+1）,同时也发送一个同步包，
也就是一个 ACK 包+SYN 包服务器进入 SYN_RECV 状态

第三次握手：客户端收到服务器的 SYN+ACK 包，向服务器发送一个确认包，此包发送完毕，客户端和服务器进入
ESTABLISHED 状态，完成三次握手

不是两次是为了防止已经失效的连接请求报文段突然又传送到了服务端，因而产生错误，比如有一个因网络延迟的请求
发送到了服务端，服务端收到这个同步报文之后进行确认，如果此时是两次握手，那么此时连接建立，但是客户端并没有发出
建立连接的请求，服务端却一直等待客户端发送数据，这样服务端的资源就白白浪费了。

不是四次的话是因为完全没有必要，三次已经足够了

参考：

[计算机网络之面试常考](https://www.nowcoder.com/discuss/1937)

[tcp 为什么要三次握手，而不能二次握手？](http://blog.csdn.net/xumin330774233/article/details/14448715)

[TCP 为什么是三次握手，为什么不是两次或四次？](https://www.zhihu.com/question/24853633)

##### TCP 的四次挥手

第一次：主动关闭方发送一个 FIN 包，用来关闭主动关闭方到被动关闭方的数据传送，也就是告诉另一方我不再发送数据了，但此时仍可以接收数据

第二次：被动关闭方收到 FIN 包之后，发送一个确认（ACK）包给对方

第三次：被动关闭方发送一个 FIN 包，告诉对方不带发送数据

第四次：主动关闭方收到 FIN 包之后，发送一个 ACK 包给对方，至此完成四次挥手

##### 说说 TCP 传输的三次握手四次挥手策略\*\*

- 为了准确无误地把数据送达目标处，TCP 协议采用了三次握手策略。用 TCP 协议把数据包送出去后，TCP 不会对传送 后的情况置之不理，它一定会向对方确认是否成功送达。握手过程中使用了 TCP 的标志：SYN 和 ACK

- 发送端首先发送一个带 SYN 标志的数据包给对方。接收端收到后，回传一个带有 SYN/ACK 标志的数据包以示传达确认信息。 最后，发送端再回传一个带 ACK 标志的数据包，代表“握手”结束。 若在握手过程中某个阶段莫名中断，TCP 协议会再次以相同的顺序发送相同的数据包

##### 断开一个 TCP 连接则需要“四次握手”：\*\*

- 第一次挥手：主动关闭方发送一个 FIN，用来关闭主动方到被动关闭方的数据传送，也就是主动关闭方告诉被动关闭方：我已经不 会再给你发数据了(当然，在 fin 包之前发送出去的数据，如果没有收到对应的 ack 确认报文，主动关闭方依然会重发这些数据)，但是，此时主动关闭方还可 以接受数据

- 第二次挥手：被动关闭方收到 FIN 包后，发送一个 ACK 给对方，确认序号为收到序号+1（与 SYN 相同，一个 FIN 占用一个序号）

- 第三次挥手：被动关闭方发送一个 FIN，用来关闭被动关闭方到主动关闭方的数据传送，也就是告诉主动关闭方，我的数据也发送完了，不会再给你发数据了

- 第四次挥手：主动关闭方收到 FIN 后，发送一个 ACK 给被动关闭方，确认序号为收到序号+1，至此，完成四次挥手

##### tcp 为什么三次握手而不是两次或者四次

##### https 与 http

##### 输入一个 url 的过程

浏览器缓存 首先是查找浏览器缓存,浏览器会缓存 DNS 记录一段时间。系统缓存 如果在浏览器缓存里没有找到需要的记录，浏览器会做一个系统调用来
查找这个网址的对应 DNS 信息。 路由器缓存 如果在系统缓存里没有找到找到对应的 IP，请求会发向路由器，它一般会有自己的 DNS 缓存。
第一步 浏览器查找该域名的 IP 地址
第二步 浏览器根据解析得到的 IP 地址向 web 服务器发送一个 HTTP 请求
第三步 服务器收到请求并进行处理
第四步 服务器返回一个响应
第五步 浏览器对该响应进行解码，渲染显示。
第六步 页面显示完成后，浏览器发送异步请求。

从 HTTP 请求回来 ，产生流式的数据，DOM 的构建、CSS 计算、渲染、绘制，都是尽可能的流式处理前一步的产出，不需要等待上一步完全接受才开始处理，所以我们在浏览网页的时候，才会逐步出现页面

> - 浏览器接受 url 开启一个网络请求线程
> - 浏览器发出一个完整的 http 请求
> - 服务器接收请求到后台接收请求
> - 使用 http 请求请求页面
> - 把请求回来的 html 代码解析成 DOM 树
> - CSS 的可视化格式模型解析
> - 根据 CSS 属性对元素进行渲染，得到内存中的位图
> - 对位图的合成
> - 绘制页面

浏览器的工作流程大致就是：构建 DOM 树-构建 CSSOM-构建渲染树-布局-绘制
[你不知道的浏览器页面渲染机制](https://mp.weixin.qq.com/s/XUgIBKDxAY5EqKdaBkIg4A)
[前端开发者应该明白的浏览器工作原理](https://mp.weixin.qq.com/s/OLlmh9eCjng2Z-0kYwIB2Q)

##### 手写 ajax 整个过程

- 创建 XMLHttpRequest 对象

```js
if (window.XMLHttpRequest) {
  // Mozilla, Safari, IE7+ ...
  httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) {
  // IE 6 and older
  httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
}
```

- 绑定 onreadystatechange 事件

```js
httpRequest.onreadystatechange = function() {
  // Process the server response here.
};
```

- 向服务器发送请求

```js
httpRequest.open('GET', 'http://www.example.org/some.file', true);
httpRequest.send();
```

完整的例子

```js
function ajax(url, cb) {
  let xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = ActiveXObject('Microsoft.XMLHTTP');
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      cb(xhr.responseText);
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}
```

### 基础

instanceof
类继承

### 什么是原型 什么是原型链， `__proto__` 与 prototype 之间的差别

1. 所有的引用类型（数组，对象，函数），都有一个隐式原型链, `__proto__` 值是一个普通的对象
2. 所有的函数，都有一个显示原型链, `prototype` 值也是一个普通的对象
3. 所有引用类型的隐式原型链的值与其构造函数的显示原型链的值是相等的

当试图得到一个对象的某个属性的时候，如果这个对象本身没有这个属性，那么就会去它的 `__proto__` 中（即它的构造函数的 prototype 中） 寻找。如果它的构造函数的原型链上也没有的话，就再往构造函数的隐式原型链上去寻找，一直到找不到为止。 这个链式结构叫做原型链。

最顶层是 `Object.prototype.__proto__ === null`

for in 是遍历对象的。for in 在高级浏览器中会屏蔽来自原型链的属性，通过 hasOwnProperty 还可以再检察一下。
for of 一般是用来遍历数组，只遍历数组的元素值，不遍历数组对象上挂载的属性。

闭包说白了就是能够读取其他函数内部变量的函数。因为 js 没有块级作用域作用域，只有函数作用域和全局作用域，所以通过一个函数包一下，返回一个函数就可以读取到函数内部的变量，给外部访问。

this: this 的值是在执行的时候才能确认，定义的时候不能确认

### javascript 中 apply、call 和 bind 的区别：

1. bind 返回的是一个函数，需要再次手动执行。
2. call 第二个参数以后的参数都跟调用的函数意义对应，而使用 apply 的时候，函数的参数都是放在数组中的，作为第二个参数。

#### 限频防抖函数手写

```js
// debounce
function debounce(fn, delay) {
  delay = delay || 500;
  let timer;
  return function() {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

```js
// throttle
function throttle(fn, delay) {
  delay = delay || 500;
  let timer;
  return function() {
    let args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, delay);
    }
  };
}
```

### es6

AMD 是 RequireJS 在推广过程中对模块定义的规范化产出， 异步加载模块。commonJS 运行于服务器端，node.js 的模块系统。

AMD CMD commonjs 的不同。

### 代码题

多种方式数组去重
多种方式声明一个数组
8 中排序方法实现

## css

### 基础

盒模型

### 浮动

### flexbox 布局

### position 和 display

### 布局

几种居中方式

## 浏览器

### 页面渲染过程

### 性能优化

### web 安全

## Vue

双向绑定原理， computed

事件循环机制

### vue-router

hashchange 事件
另一个模式是如何处理的 ？

### Vuex

订阅机制

## React

fiber 是什么
setState 是同步还是异步

## vue 和 react 不同

## Webpack

## Omiv

### web Components

## 项目难点

### console

1. 意图配置的 tag 输入框，多 tag 下拉框的位置计算
2. 页面跳转的处理，vuex 存储 next（）
3. 轮询接口的封装
4. requestid 捕捉器
5. vuex 的小封装

### h5

1. 1px 那个问题，以前是直接通过 dpi 进行缩放，现在的解决是通过媒体查询，进行缩放
2. h5 的输入框、键盘的处理，安卓 ios 等等会有不同的表现
