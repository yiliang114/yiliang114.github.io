---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### node 中的 require 和 import

ES6 标准发布后，module 成为标准，标准的使用是以 export 指令导出接口，以 import 引入模块，但是在我们一贯的 node 模块中，我们采用的是 CommonJS 规范，使用 require 引入模块，使用 module.exports 导出接口。

#### require 时代的模块

node 的 module 遵循 CommonJS 规范，requirejs 遵循 AMD，seajs 遵循 CMD，虽各有不同，但总之还是希望保持较为统一的代码风格。

```js
// b.js
// ------------ node ---------
var m = require('./a');
m.a();

// ------------ AMD or CMD -------------
define(function(require, exports, module) {
  var m = require('./a');
  m.a();
});
```

#### ES6 中的 module

ES6 发布的 module 并没有直接采用 CommonJS，甚至连 require 都没有采用，也就是说 require 仍然只是 node 的一个私有的全局方法，module.exports 也只是 node 私有的一个全局变量属性。

##### export

```js
// a.js
export default function() {}
export function a() {}

var b = 'xxx';
export { b }; // 这是ES6的写法，实际上就是{b:b}
setTimeout(() => (b = 'ooo'), 1000);
export var c = 100;
```

##### import

import 的语法跟 require 不同，而且 import 必须放在文件的最开始，且前面不允许有其他逻辑代码，这和其他所有编程语言风格一致。

```js
import $ from 'jquery';
import * as _ from '_';
import { a, b, c } from './a';
import { default as alias, a as a_a, b, c } from './a';
```

##### as 关键字

简单的说就是取一个别名。export 中可以用，import 中其实可以用

```js
// a.js
var a = function() {};
export { a as fun };

// b.js
import { fun as a } from './a';
a();
```

##### default 关键字

在 export 的时候，可能会用到 default，说白了，它其实是别名的语法糖：

```js
// d.js
export default function() {}

// 等效于：
function a() {}
export { a as default };
```

在 import 的时候，可以这样用：

```js
import a from './d';

// 等效于，或者说就是下面这种写法的简写，是同一个意思
import { default as a } from './d';
```

这个语法糖的好处就是 import 的时候，可以省去花括号{}。简单的说，如果 import 的时候，你发现某个变量没有花括号括起来（没有\*号），那么你在脑海中应该把它还原成有花括号的 as 语法。

所以，下面这种写法你也应该理解了吧

```js
import $, { each, map } from 'jquery';
```

`import 后面第一个$是{defalut as $}`的替代写法。

##### \* 符号

\*就是代表所有，只用在 import 中，我们看下两个例子：

```js
import * as _ from '_';
```

在意义上和 `import _ from '_';`是不同的，虽然实际上后面的使用方法是一样的。它表示的是把'*'模块中的所有接口挂载到*这个对象上，所以可以用`_.each` 调用某个接口。

另外还可以通过`*`号直接继承某一个模块的接口：

```js
export * from '_';

// 等效于：
import * as all from '_';
export all;
```

`*`符号尽可能少用，它实际上是使用所有 `export` 的接口，但是很有可能你的当前模块并不会用到所有接口，可能仅仅是一个，所以最好的建议是使用花括号，用一个加一个。

#### 用 require 还是 import？

require 的使用非常简单，它相当于 module.exports 的传送门，module.exports 后面的内容是什么，require 的结果就是什么，对象、数字、字符串、函数……再把 require 的结果赋值给某个变量，相当于把 require 和 module.exports 进行平行空间的位置重叠。

而且 require 理论上可以运用在代码的任何地方，甚至不需要赋值给某个变量之后再使用，比如：

```js
require('./a')(); // a模块是一个函数，立即执行a模块函数
var data = require('./a').data; // a模块导出的是一个对象
var a = require('./a')[0]; // a模块导出的是一个数组
```

你在使用时，完全可以忽略模块化这个概念来使用 require，仅仅把它当做一个 node 内置的全局函数，它的参数甚至可以是表达式：

```js
require(process.cwd() + '/a');
```

但是 import 则不同，它是编译时的（require 是运行时的），它必须放在文件开头，而且使用格式也是确定的，不容置疑。它不会将整个模块运行后赋值给某个变量，而是只选择 import 的接口进行编译，**这样在性能上比 require 好很多**。

从理解上，require 是赋值过程，import 是解构过程，当然，require 也可以将结果解构赋值给一组变量，但是 import 在遇到 default 时，和 require 则完全不同：`var $ = require('jquery');` 和 `import $ from 'jquery'` 是完全不同的两种概念。

上面完全没有回答“改用 require 还是 import？”这个问题，因为这个问题就目前而言，根本没法回答，因为目前所有的引擎都还没有实现 import，我们在 node 中使用 babel 支持 ES6，也仅仅是将 ES6 转码为 ES5 再执行，import 语法会被转码为 require。这也是为什么在模块导出时使用 module.exports，在引入模块时使用 import 仍然起效，因为本质上，import 会被转码为 require 去执行。
