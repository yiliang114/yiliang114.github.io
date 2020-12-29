---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### Set

`Set`是`ES6`引入的一种类似`Array`的新的数据结构，`Set`实例的成员类似于数组`item`成员，区别是`Set`实例的成员都是唯一，不重复的。这个特性可以轻松地实现数组去重

没有重复值得 Array,重复值会被自动过滤掉

### Map

`Map`是`ES6`引入的一种类似`Object`的新的数据结构，`Map`可以理解为是`Object`的超集，打破了以传统键值对形式定义对象，对象的`key`不再局限于字符串，也可以是`Object`。可以更加全面的描述对象的属性。Map 解决的是 Object 的键值对中键只能是字符串的问题。Map 是 Es6 提供的新的数据结构，是键值对的集合。Map 的“键”不限于字符串。各种类型的值（包括对象）都可以当做键。

对象缺陷: key 必须是字符串

Map 就是支持全类型的 key(如:number)

```js
var m = new Map([
  ['Michael', 95],
  ['Bob', 75],
  ['Tracy', 85],
]);
m.get('Michael'); // 95

var m = new Map(); // 空 Map
m.set('Adam', 67); // 添加新的 key-value
m.set('Bob', 59);
m.has('Adam'); // 是否存在 key 'Adam': true
m.get('Adam'); // 67
m.delete('Adam'); // 删除 key 'Adam'
m.get('Adam'); // undefined
```

### WeakMap

WeakMap 结构与 Map 结构基本类似，唯一的区别就是 WeakMap 只接受对象作为键名（null 除外），而且键名所指向的对象不计入垃圾回收机制。

WeakMap 专用场景：它的键所对应的对象可能会在将来消失。

典型应用：一个对应 DOM 元素的 WeakMap 结构，当某个 DOM 元素被清除，其所对应的 WeakMap 记录就会自动被移除。

有时候我们会把对象作为一个对象的键用来存放属性值，普通集合类型比如简单对象会阻止垃圾回收器对这些作为属性键存在的对象的回收，有造成内存泄漏的危险。而 WeakMap,WeakSet 则更加安全些，这些作为属性键的对象如果没有别的变量在引用它们，则会被回收释放掉。

### 介绍下 Set、Map、WeakSet 和 WeakMap 的比较

Set

1. 成员不能重复
2. 只有健值，没有键名，有点类似数组。
3. 可以遍历，方法有 add,delete,has

weakSet

1. 成员都是对象
2. 成员都是弱引用，随时可以消失。 可以用来保存 DOM 节点，不容易造成内存泄漏
3. 不能遍历，方法有 add,delete,has

Map

1. 本质上是健值对的集合，类似集合
2. 可以遍历，方法很多，可以干跟各种数据格式转换

weakMap

1. 直接受对象作为键名（null 除外），不接受其他类型的值作为键名
2. 键名所指向的对象，不计入垃圾回收机制
3. 不能遍历，方法同 get,set,has,delete
