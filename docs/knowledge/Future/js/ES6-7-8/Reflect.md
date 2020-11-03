---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

http://es6.ruanyifeng.com/?search=Reflect&x=13&y=8#docs/
https://www.jianshu.com/p/653bce04db0b

## Reflect

### Reflect 是什么，有什么作用？

`Reflect`是`ES6`引入的一个新的对象，他的主要作用有两点，一是将原生的一些零散分布在`Object`、`Function`或者全局函数里的方法(如`apply`、`delete`、`get`、`set`等等)，统一整合到`Reflect`上，这样可以更加方便更加统一的管理一些原生`API`。其次就是因为`Proxy`可以改写默认的原生 API，如果一旦原生`API`被改写可能就找不到了，所以`Reflect`也可以起到备份原生 API 的作用，使得即使原生`API`被改写了之后，也可以在被改写之后的`API`用上默认的`API`

### 什么是 Reflect？

为**操作对象**而提供的新 API

### 为什么要设计 Reflect？

1. 将 Object 对象的属于语言内部的方法放到 Reflect 对象上，即从 Reflect 对象上拿 Object 对象内部方法。
2. 将用 老 Object 方法 报错的情况，改为返回 false

   老写法

   ```js
   try {
     Object.defineProperty(target, property, attributes);
     // success
   } catch (e) {
     // failure
   }
   ```

   新写法

   ```jsx
   if (Reflect.defineProperty(target, property, attributes)) {
     // success
   } else {
     // failure
   }
   ```

3. 让 Object 操作变成函数行为

   老写法（命令式写法）

   ```js
   'name' in Object; //true
   ```

   新写法

   ```jsx
   Reflect.has(Object, 'name'); //true
   ```

4. Reflect 与 Proxy 是相辅相成的，在 Proxy 上有的方法，在 Reflect 就一定有

   ```jsx
   let target = {};
   let handler = {
     set(target, proName, proValue, receiver) {
       //确认对象的属性赋值成功
       let isSuccess = Reflect.set(target, proName, proValue, receiver);
       if (isSuccess) {
         console.log('成功');
       }
       return isSuccess;
     },
   };
   let proxy = new Proxy(target, handler);
   ```

**确保对象的属性能正确赋值，广义上讲，即确保对象的原生行为能够正常进行，这就是 Reflect 的作用**

### Reflect 的 API

注：由于和 Proxy 的 API 一致，所以参数就不解释了。

**（1）Reflect.get(target,property,receiver)**
**查找并返回**target 对象的 property 属性
**例 1：**

```jsx
let obj = {
  name: 'chen',
};
let result = Reflect.get(obj, 'name');
console.log(result); //chen
```

**例 2：**

```jsx
let obj = {
  //属性yu部署了getter读取函数
  get yu() {
    //this返回的是Reflect.get的receiver参数对象
    return this.name + this.age;
  },
};

let receiver = {
  name: 'shen',
  age: '18',
};

let result = Reflect.get(obj, 'yu', receiver);
console.log(result); //shen18
```

注意：如果 Reflect.get()的第一个参数不是对象，则会报错。

**（2）Reflect.set(target,propName,propValue,receiver)**
设置 target 对象的 propName 属性为 propValue
**例 1：**

```jsx
let obj = {
  name: 'chen',
};

let result = Reflect.set(obj, 'name', 'shi');
console.log(result); //true
console.log(obj.name); //shi
```

**例 2：原理同 3（1）的例 2**

```jsx
let obj = {
  age: 38,
  set setAge(value) {
    return (this.age = value);
  },
};

let receiver = {
  age: 28,
};

let result = Reflect.set(obj, 'setAge', 18, receiver);
console.log(result); //true
console.log(obj.age); //38
console.log(receiver.age); //18
```

**（3）Reflect.set 与 Proxy.set 联合使用,并且传入 receiver，则会进行定义属性操作**

```jsx
let obj = {
  name: 'chen',
};

let handler = {
  set(target, key, value, receiver) {
    console.log('Proxy拦截赋值操作');
    //Reflect完成赋值操作
    Reflect.set(target, key, value, receiver);
  },
  defineProperty(target, key, attribute) {
    console.log('Proxy拦截定义属性操作');
    //Reflect完成定义属性操作
    Reflect.defineProperty(target, key, attribute);
  },
};

let proxy = new Proxy(obj, handler);
proxy.name = 'ya';
//Proxy拦截赋值操作
//Proxy拦截定义属性操作
```

- **为什么 Reflect.set()传入 receiver 参数，就会触发定义属性的操作？**
  因为 Proxy.set()中的 receiver 是 Proxy 的实例（[详情见这篇文章](https://www.jianshu.com/p/5b8153c87949)），即 obj，而 Reflect.set 一旦传入 receiver，就会将属性赋值到 receiver 上面，也是 obj，所以就会触发 defineProperty 拦截。

**（4）Reflect.has(obj,name)**

```csharp
var obj= {
  name: "chen",
};
```

老写法

```bash
'name' in obj // true
```

新写法

```jsx
Reflect.has(obj, 'name'); // true
```

**（5）Reflect.deleteProperty(obj, name)**
删除对象的属性

老写法：

```cpp
delete obj.name;
```

新写法

```jsx
Reflect.deleteProperty(obj, 'name');
```

**（6）Reflect.construct(target, args)**

```jsx
function Person(name) {
  this.name = name;
}
```

new 的写法

```csharp
let person= new Person('chen')
```

Reflect.construct 的写法

```jsx
let person = Reflect.construct(Person, ['chen']);
```

**（7）Reflect.getPrototypeOf(obj)**
用于读取对象的**proto**属性，对应 Object.getPrototypeOf(obj)

**（8）Reflect.setPrototypeOf(obj, newProto)**
设置目标对象的原型（prototype），对应 Object.setPrototypeOf(obj, newProto)方法

**（9）Reflect.apply(func, thisArg, args)**
继承目标对象的特定方法

```bash
let array=[1,2,3,4,5,6]
```

老写法：

```tsx
let small = Math.min.apply(Math, array); //1
let big = Math.max.apply(Math, array); //6
let type = Object.prototype.toString.call(small); //"[object Number]"
```

新写法：

```jsx
const small = Reflect.apply(Math.min, Math, array);
const big = Reflect.apply(Math.max, Math, array);
//第三个参数是Object类型的就好，因为调用的是Object的原型方法toString
const type = Reflect.apply(Object.prototype.toString, small, []);
```

**（10）Reflect.defineProperty(target, propertyKey, attributes)**

```jsx
function MyDate() {
  ...
  ...
}
```

老写法

```jsx
Object.defineProperty(MyDate, 'now', {
  value: () => Date.now(),
});
```

新写法

```jsx
Reflect.defineProperty(MyDate, 'now', {
  value: () => Date.now(),
});
```

与 Proxy.defineProperty 配合使用

```jsx
let proxy = new Proxy(
  {},
  {
    defineProperty(target, prop, descriptor) {
      console.log(descriptor);
      return Reflect.defineProperty(target, prop, descriptor);
    },
  },
);

proxy.name = 'chen';
// {value: "chen", writable: true, enumerable: true, configurable: true}
p.name; // "chen"
```

如上，Proxy.defineProperty**对属性赋值设置拦截**，然后使用 Reflect.defineProperty**完成赋值**

**（11）Reflect.getOwnPropertyDescriptor(target, propertyKey)**
基本等同于 Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象

**（12）Reflect.isExtensible (target)**
对应 Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展

**（13）Reflect.preventExtensions(target)**
对应 Object.preventExtensions 方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功

**（14）Reflect.ownKeys (target)**
用于返回对象的所有属性
