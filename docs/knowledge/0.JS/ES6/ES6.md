---
title: ES6
date: 2020-12-29
draft: true
---

### ES6 的新特性

Class，模块化，箭头操作符，let/const 块作用域，字符串模板，解构，参数默认值/不定参数/拓展参数, Map/Set, Promise

### Class

在 JS 中并不存在类，`class` 只是语法糖，本质还是函数。

原理：类本身指向构造函数，所有方法定义在`prototype`上，可看作构造函数的另一种写法(`Class === Class.prototype.constructor`)

```js
class Animal {
  constructor() {
    this.type = 'animal';
  }
  says(say) {
    console.log(this.type + ' says ' + say);
  }
}

let animal = new Animal();
animal.says('hello'); //animal says hello

class Cat extends Animal {
  constructor() {
    super();
    this.type = 'cat';
  }
}

let cat = new Cat();
cat.says('hello'); //cat says hello
```

子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类没有自己的`this`对象，而是继承父类的`this`对象，然后再用子类的构造函数修改 this。如果不调用`super`方法，子类就得不到`this`对象。

#### 继承

- 实质

  - ES5 实质：先创造子类实例的`this`，再将父类的属性方法添加到`this`上(`Parent.apply(this)`)
  - ES6 实质：先将父类实例的属性方法加到`this`上(调用`super()`)，再用子类构造函数修改`this`

- super

  - 作为函数调用：只能在构造函数中调用`super()`，内部`this`指向继承的`当前子类`(`super()`调用后才可在构造函数中使用`this`)
  - 作为对象调用：在`普通方法`中指向`父类的对象`，在`静态方法`中指向`父类`

- 显示定义：使用`constructor() { super(); }`定义继承父类，没有书写则`显示定义`

- 子类继承父类：子类使用父类的属性方法时，必须在构造函数中调用

  ```
  super()
  ```

  ，否则得不到父类的

  ```
  this
  ```

  - 父类静态属性方法可被子类继承
  - 子类继承父类后，可从`super`上调用父类静态属性方法

- 实例：类相当于

  ```
  实例的
  ```

  ，所有在类中定义的属性方法都会被实例继承

  - 显式指定属性方法：使用`this`指定到自身上(使用`Class.hasOwnProperty()`可检测到)
  - 隐式指定属性方法：直接声明定义在对象上(使用`Class.__proto__.hasOwnProperty()`可检测到)

- 表达式

  - 类表达式：`const Class = class {}`
  - name 属性：返回紧跟`class`后的类名
  - 属性表达式：`[prop]`
  - Generator 方法：`* mothod() {}`
  - Async 方法：`async mothod() {}`

- this 指向：解构实例属性或方法时会报错

  - 绑定 this：`this.mothod = this.mothod.bind(this)`
  - 箭头函数：`this.mothod = () => this.mothod()`

- 属性定义位置

  - 定义在构造函数中并使用`this`指向
  - 定义在`类最顶层`

- **new.target**：确定构造函数是如何调用

> 重点难点

- 在实例上调用方法，实质是调用上的方法
- `Object.assign()`可方便地一次向类添加多个方法(`Object.assign(Class.prototype, { ... })`)
- 类内部所有定义的方法是不可枚举的(`non-enumerable`)
- 构造函数默认返回实例对象(`this`)，可指定返回另一个对象
- 取值函数和存值函数设置在属性的`Descriptor对象`上
- 类不存在变量提升
- 利用`new.target === Class`写出不能独立使用必须继承后才能使用的类
- 子类继承父类后，`this`指向子类实例，通过`super`对某个属性赋值，赋值的属性会变成子类实例的属性
- 使用`super`时，必须显式指定是作为函数还是作为对象使用
- `extends`不仅可继承类还可继承原生的构造函数

> 私有属性方法

```
const name = Symbol("name");
const print = Symbol("print");
class Person {
    constructor(age) {
        this[name] = "Bruce";
        this.age = age;
    }
    [print]() {
        console.log(`${this[name]} is ${this.age} years old`);
    }
}

```

> 继承混合类

```
function CopyProperties(target, source) {
    for (const key of Reflect.ownKeys(source)) {
        if (key !== "constructor" && key !== "prototype" && key !== "name") {
            const desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}
function MixClass(...mixins) {
    class Mix {
        constructor() {
            for (const mixin of mixins) {
                CopyProperties(this, new mixin());
            }
        }
    }
    for (const mixin of mixins) {
        CopyProperties(Mix, mixin);
        CopyProperties(Mix.prototype, mixin.prototype);
    }
    return Mix;
}
class Student extends MixClass(Person, Kid) {}

```

#### es6 class 的 new 实例和 es5 的 new 实例有什么区别？

在`ES6`中（和`ES5`相比），`class`的`new`实例有以下特点：

- `class`的构造参数必须是`new`来调用，不可以将其作为普通函数执行
- `es6` 的`class`不存在变量提升
- **最重要的是：es6 内部方法不可以枚举**。es5 的`prototype`上的方法可以枚举。

### 箭头函数与普通函数的区别？

- 简洁
- 普通 function 的声明在变量提升中是最高的，箭头函数没有函数提升
- 箭头函数没有属于自己的 this，arguments。
  - function 传统定义的函数，this 指向随着调用环境的改变而改变，而箭头 函数中的指向则是固定不变，一直指向定义环境的。箭头函数在定义之后，this 就不会发生改变了。
- 箭头函数不能作为构造函数，不能被 new，没有 prototype
- call 和 apply 方法只有参数，没有作用域

### 私有方法和私有属性

#### 现有的解决方案

私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。这是常见需求，有利于代码的封装，但 ES6 不提供，只能通过变通方法模拟实现。

还有一种方法是利用**Symbol 值的唯一性**，将私有方法的名字命名为一个 Symbol 值。

```js
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass {
  // 公有方法
  foo(baz) {
    this[bar](baz);
  }

  // 私有方法
  [bar](baz) {
    return (this[snaf] = baz);
  }

  // ...
}
```

上面代码中，bar 和 snaf 都是 Symbol 值，一般情况下无法获取到它们，因此达到了私有方法和私有属性的效果。但是也不是绝对不行，Reflect.ownKeys()依然可以拿到它们。

```js
const inst = new myClass();

Reflect.ownKeys(myClass.prototype);
// [ 'constructor', 'foo', Symbol(bar) ]
```

### 介绍下 Set、Map 和 WeakMap 的比较

Set

1. 成员不能重复
2. 只有健值，没有键名，有点类似数组。
3. 可以遍历，方法有 add,delete,has

Map

1. 本质上是健值对的集合，类似集合
2. 可以遍历，方法很多，可以干跟各种数据格式转换

weakMap

1. 只接受对象作为键名（null 除外）
2. 键名所指向的对象，不计入垃圾回收机制
3. 不能遍历，方法同 get,set,has,delete
