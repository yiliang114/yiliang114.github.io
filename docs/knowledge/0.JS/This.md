---
title: This
date: 2020-10-26
draft: true
---

## This

### 用法和优先级

1. 单纯的函数调用，这是默认绑定
2. 作为对象方法调用，这是隐式绑定
3. 通过 apply, call, bind 方法调用，这是显示绑定
4. 通过 new 绑定，最终指向的是 new 出来的对象

优先级： new > 显示 > 隐式 > 默认

### 值的判断

```js
let a = {
  b: function() {
    console.log(this);
  },
  c: () => {
    console.log(this);
  },
};

// 普通 function 函数谁调用，this 的值就指向谁
a.b(); // a
// 如果是箭头函数，继承外层函数的 this 即声明箭头函数处的 this
a.c(); // window

let d = a.b;
d(); // window
```

```js
function foo() {
  console.log(this.a);
}
var a = 1;
foo();

var obj = {
  a: 2,
  foo: foo,
};
obj.foo();

// 以上两者情况 `this` 只依赖于调用函数前的对象，优先级是第二个情况大于第一个情况

// 以下情况是优先级最高的，`this` 只会绑定在 `c` 上，不会被任何方式修改 `this` 指向
var c = new foo();
c.a = 3;
console.log(c.a);

// 还有种就是利用 call，apply，bind 改变 this，这个优先级仅次于 new
```

以上几种情况明白了，很多代码中的 `this` 应该就没什么问题了，下面让我们看看箭头函数中的 `this`

```js
function a() {
  return () => {
    return () => {
      console.log(this);
    };
  };
}
console.log(a()()());
```

箭头函数其实是没有 `this` 的，这个函数中的 `this` 只取决于他外面的第一个不是箭头函数的函数的 `this`。

## bind, call, bind

三个函数的作用都是用来动态改变当前函数的 this 指针， 并且三个函数的第一个参数都是新的 this 指向值。

**区别**:

1. call 和 apply 都是立即执行，执行过程中遇到 this 就改变为指向的值，bind 不是立即执行，而是返回一个函数，需要手动执行。
2. apply 的参数是一个数组，call 接受逗号分隔的参数作为后面的参数，而 bind 只有一个 this 参数。

```js
Foo.call(this, name);
Foo.apply(this, [name]);
Foo.bind(this)(name);
```

一个简单的记忆方法是，从`call`中的 C 联想到逗号分隔（comma-separated），从`apply`中的 A 联想到数组（array）。

### 如果对一个函数进行多次 bind，那么上下文会是什么呢？

```js
let a = {};
let fn = function() {
  console.log(this);
};
fn.bind().bind(a)(); // => ?
```

不管我们给函数 bind 几次，fn 中的 this 永远由第一次 bind 决定，所以结果永远是 window。
