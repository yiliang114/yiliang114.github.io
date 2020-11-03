---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 介绍下 Set、Map、WeakSet 和 WeakMap 的区别？

- Set
  成员唯一、无序且不重复
  [value, value]，键值与键名是一致的（或者说只有键值，没有键名）
  可以遍历，方法有：add、delete、has
- WeakSet
  成员都是对象
  成员都是弱引用，可以被垃圾回收机制回收，可以用来保存 DOM 节点，不容易造成内存泄漏
  不能遍历，方法有 add、delete、has
- Map
  本质上是键值对的集合，类似集合
  可以遍历，方法很多可以跟各种数据格式转换
- WeakMap
  只接受对象最为键名（null 除外），不接受其他类型的值作为键名
  键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
  不能遍历，方法有 get、set、has、delete

扩展：Object 与 Set、Map

1. Object 与 Set

```js
const properties1 = {
  width: 1,
  height: 1,
};
console.log(properties1['width'] ? true : false);
// Set
const properties2 = new Set();
properties2.add('width');
properties2.add('height');
console.log(properties2.has('width'));
```

2. Object 与 Map
   JS 中的对象（Object），本质上是键值对的集合（hash 结构）

```js
const data = {};
const element = document.getElementsByClassName('App');
data[element] = 'metadata';
console.log(data['[object HTMLCollection]']); // "metadata"
```

但当以一个 DOM 节点作为对象 data 的键，对象会被自动转化为字符串[Object HTMLCollection]，所以说，Object 结构提供了 字符串-值 对应，Map 则提供了 值-值 的对应

### Set 是什么，有什么作用？

`Set`是`ES6`引入的一种类似`Array`的新的数据结构，`Set`实例的成员类似于数组`item`成员，区别是`Set`实例的成员都是唯一，不重复的。这个特性可以轻松地实现数组去重

### Map 是什么，有什么作用？

`Map`是`ES6`引入的一种类似`Object`的新的数据结构，`Map`可以理解为是`Object`的超集，打破了以传统键值对形式定义对象，对象的`key`不再局限于字符串，也可以是`Object`。可以更加全面的描述对象的属性

### 介绍下 Set、Map、WeakSet 和 WeakMap 的区别？

Set

1. 成员不能重复
2. 只有健值，没有健名，有点类似数组。
3. 可以遍历，方法有 add,delete,has

weakSet

1. 成员都是对象
2. 成员都是弱引用，随时可以消失。 可以用来保存 DOM 节点，不容易造成内存泄漏
3. 不能遍历，方法有 add,delete,has

Map

1. 本质上是健值对的集合，类似集合
2. 可以遍历，方法很多，可以干跟各种数据格式转换

weakMap

1. 直接受对象作为健名（null 除外），不接受其他类型的值作为健名
2. 健名所指向的对象，不计入垃圾回收机制
3. 不能遍历，方法同 get,set,has,delete

### Map

Map 解决的是 Object 的键值对中键只能是字符串的问题。Map 是 Es6 提供的新的数据结构，是键值对的集合。Map 的“键”不限于字符串。各种类型的值（包括对象）都可以当做键。

### WeakMap

WeakMap 结构与 Map 结构基本类似，唯一的区别就是 WeakMap 只接受对象作为键名（null 除外），而且键名所指向的对象不计入垃圾回收机制。

WeakMap 专用场景：它的键所对应的对象可能会在将来消失。

典型应用：一个对应 DOM 元素的 WeakMap 结构，当某个 DOM 元素被清除，其所对应的 WeakMap 记录就会自动被移除。

有时候我们会把对象作为一个对象的键用来存放属性值，普通集合类型比如简单对象会阻止垃圾回收器对这些作为属性键存在的对象的回收，有造成内存泄漏的危险。而 WeakMap,WeakSet 则更加安全些，这些作为属性键的对象如果没有别的变量在引用它们，则会被回收释放掉。
