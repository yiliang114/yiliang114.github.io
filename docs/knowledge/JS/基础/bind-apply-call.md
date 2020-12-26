---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 自封装 bind

- 因为 bind 的使用方法是 某函数.bind(某对象，...剩余参数),所以需要在 Function.prototype 上进行编程
- 将传递的参数中的某对象和剩余参数使用 apply 的方式在一个回调函数中执行即可
- 要在第一层获取到被绑定函数的 this，因为要拿到那个函数用 apply

```js
/**
 * 简单版本
 */
Function.prototype.myBind = (that, ...args) => {
  const funcThis = this;
  return function(..._args) {
    return funcThis.apply(that, args.concat(_args));
  };
};

Function.prototype.mybind = function(ctx) {
  var that = this;
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    return that.apply(ctx, args.concat(args, Array.prototype.slice.call(arguments)));
  };
};
```

```js
/**
 * 自封装bind方法
 * @param  {对象} target [被绑定的this对象， 之后的arguments就是被绑定传入参数]
 * @return {[function]}  [返回一个新函数，这个函数就是被绑定了this的新函数]
 */
Function.prototype.myBind = function(target) {
  target = target || window;
  var self = this;
  var args = [].slice.call(arguments, 1);
  var temp = function() {};
  var F = function() {
    var _args = [].slice.call(arguments, 0);
    return self.apply(this instanceof temp ? this : target, args.concat(_args));
  };
  temp.prototype = this.prototype; //维护原型关系
  F.prototype = new temp();
  return F;
};
```

### 简单实现 Function.bind 函数？

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(that) {
    var func = this,
      args = arguments;
    return function() {
      return func.apply(that, Array.prototype.slice.call(args, 1));
    };
  };
}
// 只支持 bind 阶段的默认参数：
func.bind(that, arg1, arg2)();

// 不支持以下调用阶段传入的参数：
func.bind(that)(arg1, arg2);
```

**null，undefined 的区别？**

- undefined 表示不存在这个值。
- undefined :是一个表示"无"的原始值或者说表示"缺少值"，就是此处应该有一个值，但是还没有定义。当尝试读取时会返回 undefined
- 例如变量被声明了，但没有赋值时，就等于 undefined

- null 表示一个对象被定义了，值为“空值”
- null : 是一个对象(空对象, 没有任何属性和方法)
- 例如作为函数的参数，表示该函数的参数不是对象；

- 在验证 null 时，一定要使用　=== ，因为 == 无法分别 null 和　 undefined

### 自封装 apply

- 首先要先原型上即 Function.prototype 上编程
- 需要拿到函数的引用， 在这里是 this
- 让 传入对象.fn = this
- 执行 传入对象.fn(传入参数)
- 返回执行结果

```js
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  context = context || window;
  context.fn = this;
  let result;
  // 处理参数和 call 有区别
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
};
```

### 请解释 Function.prototype.bind

bind()主要作用是是接受参数，返回一个新的函数，第一个参数为需要绑定的对象，接下来的参数作为传入函数的参数。函数内的 this 会被绑定到第一个参数的对象。

```js
function add(x, y) {
  return this.y + x;
}
let o = { y: 2 };
let m = add.bind(o, 3);
m(); // 5
```

### 手写 call、apply 及 bind 函数

call、apply 及 bind 函数内部实现是怎么样的？

首先从以下几点来考虑如何实现这几个函数

- 不传入第一个参数，那么上下文默认为 `window`
- 改变了 `this` 指向，让新的对象可以执行该函数，并能接受参数

那么我们先来实现 `call`

```js
Function.prototype.myCall = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  context = context || window;
  context.fn = this;
  const args = [...arguments].slice(1);
  const result = context.fn(...args);
  delete context.fn;
  return result;
};
```

以下是对实现的分析：

- 首先 `context` 为可选参数，如果不传的话默认上下文为 `window`
- 接下来给 `context` 创建一个 `fn` 属性，并将值设置为需要调用的函数
- 因为 `call` 可以传入多个参数作为调用函数的参数，所以需要将参数剥离出来
- 然后调用函数并将对象上的函数删除

以上就是实现 `call` 的思路，`apply` 的实现也类似，区别在于对参数的处理，所以就不一一分析思路了

```js
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  context = context || window;
  context.fn = this;
  let result;
  // 处理参数和 call 有区别
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
};
```

`bind` 的实现对比其他两个函数略微地复杂了一点，因为 `bind` 需要返回一个函数，需要判断一些边界问题，以下是 `bind` 的实现

```js
Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  const that = this;
  const args = [...arguments].slice(1);
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new that(...args, ...arguments);
    }
    return that.apply(context, args.concat(...arguments));
  };
};
```

以下是对实现的分析：

- 前几步和之前的实现差不多，就不赘述了
- `bind` 返回了一个函数，对于函数来说有两种方式调用，一种是直接调用，一种是通过 `new` 的方式，我们先来说直接调用的方式
- 对于直接调用来说，这里选择了 `apply` 的方式实现，但是对于参数需要注意以下情况：因为 `bind` 可以实现类似这样的代码 `f.bind(obj, 1)(2)`，所以我们需要将两边的参数拼接起来，于是就有了这样的实现 `args.concat(...arguments)`
- 最后来说通过 `new` 的方式，在之前的章节中我们学习过如何判断 `this`，对于 `new` 的情况来说，不会被任何方式改变 `this`，所以对于这种情况我们需要忽略传入的 `this`

### bind、call 和 apply 各自有什么区别？

**思路引导：**

首先肯定是说出三者的不同，如果自己实现过其中的函数，可以尝试说出自己的思路。然后可以聊一聊 `this` 的内容，有几种规则判断 `this` 到底是什么，`this` 规则会涉及到 `new`，那么最后可以说下自己对于 `new` 的理解。

### call, apply, bind 的区别和作用？

三个函数的作用都是用来动态改变当前函数的 this 指针， 并且三个函数的第一个参数都是新的 this 指向值

#### 区别：

1. call 和 apply 都是直接执行一个函数，执行过程中遇到 this 就改变为指向的值
2. bind 是在函数执行之前就已经强行修改了 this 的值，并且最终返回的结果是一个函数，需要手动执行
3. call 与 apply 的区别是 apply 的参数是一个数组， 而 bind 只有一个 this 参数。
   ```js
   Foo.call(this, name);
   Foo.apply(this, [name]);
   Foo.bind(this)(name);
   ```

### call，apply，bind 三者用法和区别

参数、绑定规则（显示绑定和强绑定），运行效率（最终都会转换成一个一个的参数去运行）、运行情况（`call`，`apply` 立即执行，`bind` 是`return` 出一个 `this` “固定”的函数，这也是为什么 `bind` 是强绑定的一个原因）

注：“固定”这个词的含义，它指的固定是指只要传进去了 `context`，则 `bind` 中 `return` 出来的函数 `this` 便一直指向 `context`，除非 `context` 是个变量

### call 和 apply 的区别是什么，哪个性能更好一些

1. 参数传递方式不一样：call 是需要参数按顺序传递进去，apply 接受参数数组，第二个参数可以是 Array 的实例，也可以是 arguments 对象
2. 第一个参数 this 都是指定的上下文，他可以是任何一个 JavaScript 对象
3. call 比 apply 的性能要好，平常可以多用 call, call 传入参数的格式正是内部所需要的格式
   https://github.com/Rashomon511/LearningRecord/issues/28

### call, apply, bind 区别

首先说下前两者的区别。

`call` 和 `apply` 都是为了解决改变 `this` 的指向。作用都是相同的，只是传参的方式不同。

除了第一个参数外，`call` 可以接收一个参数列表，`apply` 只接受一个参数数组。

```js
let a = {
  value: 1,
};
function getValue(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
}
getValue.call(a, 'yiliang114', '24');
getValue.apply(a, ['yiliang114', '24']);
```

#### 模拟实现 call 和 apply

可以从以下几点来考虑如何实现

- 不传入第一个参数，那么默认为 `window`
- 改变了 this 指向，让新的对象可以执行该函数。那么思路是否可以变成给新的对象添加一个函数，然后在执行完以后删除？

```js
Function.prototype.myCall = function(context) {
  var context = context || window;
  // 给 context 添加一个属性
  // getValue.call(a, 'yiliang114', '24') => a.fn = getValue
  context.fn = this;
  // 将 context 后面的参数取出来
  var args = [...arguments].slice(1);
  // getValue.call(a, 'yiliang114', '24') => a.fn('yiliang114', '24')
  var result = context.fn(...args);
  // 删除 fn
  delete context.fn;
  return result;
};
```

以上就是 `call` 的思路，`apply` 的实现也类似

```js
Function.prototype.myApply = function(context) {
  var context = context || window;
  context.fn = this;

  var result;
  // 需要判断是否存储第二个参数
  // 如果存在，就将第二个参数展开
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }

  delete context.fn;
  return result;
};
```

`bind` 和其他两个方法作用也是一致的，只是该方法会返回一个函数。并且我们可以通过 `bind` 实现柯里化。

同样的，也来模拟实现下 `bind`

```js
Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  var that = this;
  var args = [...arguments].slice(1);
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new that(...args, ...arguments);
    }
    return that.apply(context, args.concat(...arguments));
  };
};
```

### call 和 apply 的区别？

- 例子中用 add 来替换 sub，add.call(sub,3,1) == add(3,1) ，所以运行结果为：alert(4);
- 注意：js 中的函数其实是对象，函数名是对 Function 对象的引用。

```js
function add(a, b) {
  alert(a + b);
}
function sub(a, b) {
  alert(a - b);
}
add.call(sub, 3, 1);
```

### call 和 apply 有什么区别？

`.call`和`.apply`都用于调用函数，第一个参数将用作函数内 this 的值。然而，`.call`接受逗号分隔的参数作为后面的参数，而`.apply`接受一个参数数组作为后面的参数。一个简单的记忆方法是，从`call`中的 C 联想到逗号分隔（comma-separated），从`apply`中的 A 联想到数组（array）。

```js
function add(a, b) {
  return a + b;
}

console.log(add.call(null, 1, 2)); // 3
console.log(add.apply(null, [1, 2])); // 3
```

### apply 和 call 的作用和区别?

apply(thisObj[, argArray]);
call(thisObj[, arg1[, arg2[, [,...argN]]]])

都可以用来代替另一个对象调用一个方法，将一个函数的对象上下文从初始的上下文改变为由 thisObj 指定的新对象。

不同之处：

- apply 最多有两个参数，新 this 对象和一个数组 argArray(参数)。
- call 可以接受多个参数，第一个参数与 apply 一样，后面则是一串参数列表。

第一个参数与 apply 一样，后面则是一串参数列表

### bind 函数实现

```js
// 第一版，实现改变this
Function.prototype.bind2 = function(context) {
  var self = this; // 需要改变this的函数
  var partArgs = Array.prototype.slice.call(arguments, 1);
  return function() {
    var args = partArgs.concat(Array.prototype.slice.call(arguments, 0));
    return self.apply(context, args);
  };
};
// 第二版，当返回的函数被当作构造函数调用时，this指向构造对象
Function.prototype.bind2 = function(context) {
  var self = this; // 需要改变this的函数
  var partArgs = Array.prototype.slice.call(arguments, 1);
  var bound = function() {
    var args = partArgs.concat(Array.prototype.slice.call(arguments, 0));
    return self.apply(this instanceof bound ? this : context, args);
  };
  var fNop = function() {};
  fNop.prototype = self.prototype;
  bound.prototype = new fNop();
  return bound;
};
```

### call apply bind , 区别是什么

bind 返回的是绑定 this 之后的函数，需要手动再次执行
call 与 bind 一样传入的第一个参数是 this， 后面跟的参数是函数的参数， 函数立即执行
apply 第一个参数是 this， 后面需要跟一个数组， 函数也是立即执行

### 手动实现 call,apply, bind 方法

call 实现

```js
Function.prototype.call2 = function(context) {
  context = context || window;
  context.fn = this;
  var args = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
  }
  var result = eval('context.fn(' + args + ')');
  delete context.fn;
  return result;
};
```

apply 实现

```js
Function.prototype.apply = function(context, arr) {
  context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']');
    }
    result = eval('context.fn(' + args + ')');
  }

  delete context.fn;
  return result;
};
```

bind 实现

```js
Function.prototype.bind = function(oThis) {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }

  var aArgs = Array.prototype.slice.call(arguments, 1),
    fToBind = this,
    fNOP = function() {},
    fBound = function() {
      // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
      // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
      // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
      return fToBind.apply(
        this instanceof fNOP && oThis ? this : oThis || window,
        aArgs.concat(Array.prototype.slice.call(arguments)),
      );
    };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();

  return fBound;
};
```
