---
title: es7 装饰器
date: '2020-10-26'
draft: true
---

es7 https://github.com/rccoder/blog/issues/23

## JS 装饰器

`Decorator` 其实是语法糖，实则调用 Object.defineProperty，可以添加、修改对象属性。`Decorator` 是 ES7 的一个新语法，目前仍处于第 2 阶段提案中，正如其“装饰器”的叫法所表达的，他通过添加`@方法名`可以对一些对象进行装饰包装然后返回一个被包装过的对象，可以装饰的对象包括：类，属性，方法等。

> 在使用它之前需要引入 babel 模块 `transform-decorators-legacy` 编译成 ES5 或 ES6。

### 1. 类的装饰

当装饰的对象是类时，我们操作的就是这个类本身，即装饰器函数的第一个参数，就是所要装饰的目标类。

```js
@decorator
class A {}

// 等同于
class A {}
A = decorator(A) || A;
123456;
```

**示例**：添加一个日志装饰器

```js
@log
class MyClass {}

function log(target) {
  // 这个 target 在这里就是 MyClass 这个类
  target.prototype.logger = () => `${target.name} 被调用`;
}

const test = new MyClass();
test.logger(); // MyClass 被调用
123456789;
```

由于装饰器是表达式，我们也可以在装饰器后面再添加个参数：

```js
@log('hi')
class MyClass {}

function log(text) {
  return function(target) {
    target.prototype.logger = () => `${text}，${target.name} 被调用`;
  };
}

const test = new MyClass();
test.logger(); // hello，MyClass 被调用
1234567891011;
```

### 2. 属性或方法的装饰

对于类属性或方法的装饰本质是操作其描述符，可以把此时的装饰器理解成是 `Object.defineProperty(obj, prop, descriptor)`的语法糖。

```js
class C {
  @readonly(false)
  method() {
    console.log('cat');
  }
}

function readonly(value) {
  return function(target, key, descriptor) {
    /**
     * 此处 target 为 C.prototype;
     * key 为 method;
     * 原 descriptor 为：{ value: f, enumarable: false, writable: true, configurable: true }
     */
    descriptor.writable = value;
    return descriptor;
  };
}

const c = new C();
c.method = () => console.log('dog');

c.method(); // cat
123456789101112131415161718192021;
```

### 请介绍一下装饰者模式，并实现

在不改变元对象的基础上，对这个对象进行包装和拓展（包括添加属性和方法），从而使这个对象可以有更复杂的功能。

### 装饰器

https://segmentfault.com/p/1210000009968000/read
