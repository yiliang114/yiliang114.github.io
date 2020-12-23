---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 浅拷贝

浅拷贝（shallow copy）：只复制指向某个对象的指针，而不复制对象本身，新旧对象共享一块内存

- `Object.assign`
- 展开运算符 `...`
- for 循环方式， 手动复制属性

```js
function shallowCopy(p, c) {
  var c = c || {};
  for (var i = 0; i < p.length; i++) {
    c[i] = p[i];
  }
  return c;
}
```

###

简单的做法：`JSON.parse(JSON.stringify(obj))`， 但是该方法也是有局限性的：

- 会忽略`undefined`
- 会忽略`symbol`
- 会忽略函数
- 不能解决循环引用的对象 （会报错）

如果你有这么一个循环引用对象，你会发现并不能通过该方法实现深拷贝；在遇到函数、 `undefined` 或者 `symbol` 的时候，该对象也不能正常的序列化。

```js
let a = {
  age: undefined,
  sex: Symbol('male'),
  jobs: function() {},
  name: 'yiliang114',
};
let b = JSON.parse(JSON.stringify(a));
console.log(b); // {name: "yck"}
```

你会发现在上述情况中，该方法会忽略掉函数和 `undefined` 。

但是在通常情况下，复杂数据都是可以序列化的，所以这个函数可以解决大部分问题。

如果你所需拷贝的对象含有内置类型并且不包含函数，可以使用 `MessageChannel`

```js
function structuralClone(obj) {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  });
}

var obj = {
  a: 1,
  b: {
    c: 2,
  },
};

obj.b.d = obj.b;

// 注意该方法是异步的
// 可以处理 undefined 和循环引用对象
const test = async () => {
  const clone = await structuralClone(obj);
  console.log(clone);
};
test();
```

- lodash，也有提供 `_.cloneDeep`

### 自封装深拷贝

思路：

1. 使用 for-in 遍历对象
2. 因为 for-in 会遍历原型链上的属性，所以需要判断属性是否在原型链上，不是原型链才拷贝
3. 判断属性值类型是原始类型和引用类型
4. 原始类型直接赋值（注意 null）
5. 引用类型判断是对象还是数组，**创建对应的空对象或空数组**，递归调用函数，将值赋值进去

```js
/**
 * 深度克隆
 * @param   origin 被拷贝的原对象
 * @param   target 拷贝出来的对象
 * @return         拷贝出来的对象
 */
function deepClone(origin, target) {
  target = target || {};

  for (let prop in origin) {
    //使用 for-in
    if (origin.hasOwnProperty(prop)) {
      //不是原型链上的
      if (typeof origin[prop] === 'object' && origin[prop]) {
        //是对象
        // 先判断是不是数组
        if (origin[prop] instanceof Array) {
          target[prop] = [];
          deepClone(origin[prop], target[prop]);
        }
        target[prop] = {};
        deepClone(origin[prop], target[prop]);
      } else {
        target[prop] = origin[prop];
      }
    }
  }
  return target;
}
```

```js
function deepClone(obj) {
  function isObject(o) {
    return (typeof o === 'object' || typeof o === 'function') && o !== null;
  }

  if (!isObject(obj)) {
    throw new Error('非对象');
  }

  let isArray = Array.isArray(obj);
  let newObj = isArray ? [...obj] : { ...obj };
  Reflect.ownKeys(newObj).forEach(key => {
    newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key];
  });

  return newObj;
}

let obj = {
  a: [1, 2, 3],
  b: {
    c: 2,
    d: 3,
  },
};
let newObj = deepClone(obj);
newObj.b.c = 1;
console.log(obj.b.c); // 2
```

```js
function deepClone(obj) {
  var _toString = Object.prototype.toString;

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true);
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime());
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    var flags = [];
    if (obj.global) {
      flags.push('g');
    }
    if (obj.multiline) {
      flags.push('m');
    }
    if (obj.ignoreCase) {
      flags.push('i');
    }

    return new RegExp(obj.source, flags.join(''));
  }

  var result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {};

  for (var key in obj) {
    result[key] = deepClone(obj[key]);
  }

  return result;
}

function A() {
  this.a = a;
}

var a = {
  name: 'qiu',
  birth: new Date(),
  pattern: /qiu/gim,
  container: document.body,
  hobbys: ['book', new Date(), /aaa/gim, 111],
};

var c = new A();
var b = deepClone(c);
console.log(c.a === b.a);
console.log(c, b);
```

```js
Object.prototype.clone = function() {
  var o = this.constructor === Array ? [] : {};
  for (var e in this) {
    o[e] = typeof this[e] === 'object' ? this[e].clone() : this[e];
  }
  return o;
};
```

```js
function clone(Obj) {
  var buf;

  if (Obj instanceof Array) {
    buf = []; //创建一个空的数组

    var i = Obj.length;

    while (i--) {
      buf[i] = clone(Obj[i]);
    }

    return buf;
  } else if (Obj instanceof Object) {
    buf = {}; //创建一个空对象

    for (var k in Obj) {
      //为这个对象添加新的属性

      buf[k] = clone(Obj[k]);
    }

    return buf;
  } else {
    return Obj;
  }
}
```

```js
// 不考虑原型
function deepClone(obj) {
  // null, undefined, function, non-object
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  var result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {};
  Object.keys(obj).forEach(function(key) {
    result[key] = deepClone(obj[key]);
  });
  return result;
}
```

### 深拷贝 - BFS

```js
// 如果是对象/数组，返回一个空的对象/数组，
// 都不是的话直接返回原对象
function getEmptyArrOrObj(item) {
  if (Object.prototype.toString.call(item) === '[object Array]') {
    return [];
  }
  if (Object.prototype.toString.call(item) === '[object Object]') {
    return {};
  }
  return item;
}

function deepCopyBFS(origin) {
  const queue = [];
  const map = new Map(); // 记录出现过的对象，处理环

  let target = getEmptyArrOrObj(origin);

  if (target !== origin) {
    // 说明origin是一个对象或数组，需要拷贝子代
    queue.push([origin, target]);
    map.set(origin, target);
  }

  while (queue.length) {
    let [ori, tar] = queue.shift(); // 出队

    for (let key in ori) {
      if (ori.hasOwnProperty(key)) {
        // 不在原型上

        if (map.get(ori[key])) {
          // 处理环
          tar[key] = map.get(ori[key]);
          continue;
        }

        tar[key] = getEmptyArrOrObj(ori[key]);
        if (tar[key] !== ori[key]) {
          queue.push(ori[key], tar[key]);
          map.set(ori[key], tar[key]);
        }
      }
    }
  }

  return target;
}
```

### 深拷贝 - DFS

```js
function deepCopyDFS(origin) {
  let stack = [];
  let map = new Map(); // 记录出现过的对象，用于处理环

  let target = getEmptyArrOrObj(origin);
  if (target !== origin) {
    stack.push([origin, target]);
    map.set(origin, target);
  }

  while (stack.length) {
    let [ori, tar] = stack.pop();
    for (let key in ori) {
      if (ori.hasOwnProperty(key)) {
        // 不在原型上
        // 处理环状
        if (map.get(ori[key])) {
          tar[key] = map.get(ori[key]);
          continue;
        }

        tar[key] = getEmptyArrOrObj(ori[key]);
        if (tar[key] !== ori[key]) {
          stack.push([ori[key], tar[key]]);
          map.set(ori[key], tar[key]);
        }
      }
    }
  }

  return target;
}
```

#### 测试上面的两个 deepCopy

```js
function getEmpty(o) {
  if (Object.prototype.toString.call(o) === '[object Object]') {
    return {};
  }
  if (Object.prototype.toString.call(o) === '[object Array]') {
    return [];
  }
  return o;
}

function deepCopyBFS(origin) {
  let queue = [];
  let map = new Map(); // 记录出现过的对象，用于处理环

  let target = getEmpty(origin);
  if (target !== origin) {
    queue.push([origin, target]);
    map.set(origin, target);
  }

  while (queue.length) {
    let [ori, tar] = queue.shift();
    for (let key in ori) {
      // 处理环状
      if (map.get(ori[key])) {
        tar[key] = map.get(ori[key]);
        continue;
      }

      tar[key] = getEmpty(ori[key]);
      if (tar[key] !== ori[key]) {
        queue.push([ori[key], tar[key]]);
        map.set(ori[key], tar[key]);
      }
    }
  }

  return target;
}

function deepCopyDFS(origin) {
  let stack = [];
  let map = new Map(); // 记录出现过的对象，用于处理环

  let target = getEmpty(origin);
  if (target !== origin) {
    stack.push([origin, target]);
    map.set(origin, target);
  }

  while (stack.length) {
    let [ori, tar] = stack.pop();
    for (let key in ori) {
      // 处理环状
      if (map.get(ori[key])) {
        tar[key] = map.get(ori[key]);
        continue;
      }

      tar[key] = getEmpty(ori[key]);
      if (tar[key] !== ori[key]) {
        stack.push([ori[key], tar[key]]);
        map.set(ori[key], tar[key]);
      }
    }
  }

  return target;
}

// test
[deepCopyBFS, deepCopyDFS].forEach(deepCopy => {
  console.log(deepCopy({ a: 1 }));
  console.log(deepCopy([1, 2, { a: [3, 4] }]));
  console.log(
    deepCopy(function() {
      return 1;
    }),
  );
  console.log(
    deepCopy({
      x: function() {
        return 'x';
      },
      val: 3,
      arr: [1, { test: 1 }],
    }),
  );

  let circle = {};
  circle.child = circle;
  console.log(deepCopy(circle));
});
```

### 深浅拷贝

```js
function clone(Obj) {
  var buf;
  if (Obj instanceof Array) {
    buf = []; // 创建一个空的数组
    var i = Obj.length;
    while (i--) {
      buf[i] = clone(Obj[i]);
    }
    return buf;
  } else if (Obj instanceof Object) {
    buf = {}; // 创建一个空对象
    for (var k in Obj) {
      // 为这个对象添加新的属性
      buf[k] = clone(Obj[k]);
    }
    return buf;
  } else {
    return Obj;
  }
}
```

```js
// js对象的深度克隆

function clone(Obj) {
  var buf;

  if (Obj instanceof Array) {
    buf = []; //创建一个空的数组

    var i = Obj.length;

    while (i--) {
      buf[i] = clone(Obj[i]);
    }

    return buf;
  } else if (Obj instanceof Object) {
    buf = {}; //创建一个空对象

    for (var k in Obj) {
      //为这个对象添加新的属性

      buf[k] = clone(Obj[k]);
    }

    return buf;
  } else {
    return Obj;
  }
}

// js数组去重

// 以下是数组去重的三种方法：

Array.prototype.unique1 = function() {
  var n = []; //一个新的临时数组

  for (
    var i = 0;
    i < this.length;
    i++ //遍历当前数组
  ) {
    //如果当前数组的第i已经保存进了临时数组，那么跳过，

    //否则把当前项push到临时数组里面

    if (n.indexOf(this[i]) == -1) n.push(this[i]);
  }

  return n;
};

Array.prototype.unique2 = function() {
  var n = {},
    r = []; //n为hash表，r为临时数组

  for (var i = 0; i < this.length; i++) {
    //遍历当前数组

    if (!n[this[i]]) {
      //如果hash表中没有当前项

      n[this[i]] = true; //存入hash表

      r.push(this[i]); //把当前数组的当前项push到临时数组里面
    }
  }
  return r;
};

Array.prototype.unique3 = function() {
  var n = [this[0]]; //结果数组

  for (
    var i = 1;
    i < this.length;
    i++ //从第二项开始遍历
  ) {
    //如果当前数组的第i项在当前数组中第一次出现的位置不是i，

    //那么表示第i项是重复的，忽略掉。否则存入结果数组

    if (this.indexOf(this[i]) == i) n.push(this[i]);
  }

  return n;
};

// js常用设计模式的实现思路，单例，工厂，代理，装饰，观察者模式等

// 1) 单例：　任意对象都是单例，无须特别处理

var obj = { name: 'michaelqin', age: 30 };

// 2) 工厂: 就是同样形式参数返回不同的实例
function Person() {
  this.name = 'Person1';
}
function Animal() {
  this.name = 'Animal1';
}

function Factory() {}
Factory.prototype.getInstance = function(className) {
  return eval('new ' + className + '()');
};

var factory = new Factory();
var obj1 = factory.getInstance('Person');
var obj2 = factory.getInstance('Animal');
console.log(obj1.name); // Person1
console.log(obj2.name); // Animal1

//3) 代理: 就是新建个类调用老类的接口,包一下
function Person() {}
Person.prototype.sayName = function() {
  console.log('michaelqin');
};
Person.prototype.sayAge = function() {
  console.log(30);
};

function PersonProxy() {
  this.person = new Person();
  var that = this;
  this.callMethod = function(functionName) {
    console.log('before proxy:', functionName);
    that.person[functionName](); // 代理
    console.log('after proxy:', functionName);
  };
}

var pp = new PersonProxy();
pp.callMethod('sayName'); // 代理调用Person的方法sayName()
pp.callMethod('sayAge'); // 代理调用Person的方法sayAge()

//4) 观察者: 就是事件模式，比如按钮的onclick这样的应用.
function Publisher() {
  this.listeners = [];
}
Publisher.prototype = {
  addListener: function(listener) {
    this.listeners.push(listener);
  },

  removeListener: function(listener) {
    delete this.listeners[listener];
  },

  notify: function(obj) {
    for (var i = 0; i < this.listeners.length; i++) {
      var listener = this.listeners[i];
      if (typeof listener !== 'undefined') {
        listener.process(obj);
      }
    }
  },
}; // 发布者

function Subscriber() {}
Subscriber.prototype = {
  process: function(obj) {
    console.log(obj);
  },
}; // 订阅者
var publisher = new Publisher();
publisher.addListener(new Subscriber());
publisher.addListener(new Subscriber());
publisher.notify({ name: 'michaelqin', ageo: 30 }); // 发布一个对象到所有订阅者
publisher.notify('2 subscribers will both perform process'); // 发布一个字符串到所有订阅者
```

#### 实现一个函数 clone，可以对 JavaScript 中的 5 种主要的数据类型（包括 Number、String、Object、Array、Boolean）进行值复制

```js
Object.prototype.clone = function() {
  var o = this.constructor === Array ? [] : {};

  for (var e in this) {
    o[e] = typeof this[e] === 'object' ? this[e].clone() : this[e];
  }

  return o;
};
```

### 实现数组的拷贝

```js
const a1 = [1, 2];
const a2 = a1.concat();
const a3 = a1.slice();
```

### 介绍下深度优先遍历和广度优先遍历，如何实现？

我是从 dom 节点的遍历来理解这个问题的

#### html 代码

[![image](https://user-images.githubusercontent.com/27856388/52606290-118a3180-2ead-11e9-86b7-d0feae6f8030.png)](https://user-images.githubusercontent.com/27856388/52606290-118a3180-2ead-11e9-86b7-d0feae6f8030.png)

我将用深度优先遍历和广度优先遍历对这个 dom 树进行查找

#### 深度优先遍历

---

深度优先遍历 DFS 与树的先序遍历比较类似。
假设初始状态是图中所有顶点均未被访问，则从某个顶点 v 出发，首先访问该顶点然后依次从它的各个未被访问的邻接点出发深度优先搜索遍历图，直至图中所有和 v 有路径相通的顶点都被访问到。若此时尚有其他顶点未被访问到，则另选一个未被访问的顶点作起始点，重复上述过程，直至图中所有顶点都被访问到为止。

```js
/*深度优先遍历三种方式*/
let deepTraversal1 = (node, nodeList = []) => {
  if (node !== null) {
    nodeList.push(node);
    let children = node.children;
    for (let i = 0; i < children.length; i++) {
      deepTraversal1(children[i], nodeList);
    }
  }
  return nodeList;
};
let deepTraversal2 = node => {
  let nodes = [];
  if (node !== null) {
    nodes.push(node);
    let children = node.children;
    for (let i = 0; i < children.length; i++) {
      nodes = nodes.concat(deepTraversal2(children[i]));
    }
  }
  return nodes;
};
// 非递归
let deepTraversal3 = node => {
  let stack = [];
  let nodes = [];
  if (node) {
    // 推入当前处理的node
    stack.push(node);
    while (stack.length) {
      let item = stack.pop();
      let children = item.children;
      nodes.push(item);
      // node = [] stack = [parent]
      // node = [parent] stack = [child3,child2,child1]
      // node = [parent, child1] stack = [child3,child2,child1-2,child1-1]
      // node = [parent, child1-1] stack = [child3,child2,child1-2]
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i]);
      }
    }
  }
  return nodes;
};
```

##### 输出结果

[![image](https://user-images.githubusercontent.com/27856388/52606984-88282e80-2eaf-11e9-8640-5220d1d2dc74.png)](https://user-images.githubusercontent.com/27856388/52606984-88282e80-2eaf-11e9-8640-5220d1d2dc74.png)

#### 广度优先遍历

---

广度优先遍历 BFS
从图中某顶点 v 出发，在访问了 v 之后依次访问 v 的各个未曾访问过的邻接点，然后分别从这些邻接点出发依次访问它们的邻接点，并使得“先被访问的顶点的邻接点先于后被访问的顶点的邻接点被访问，直至图中所有已被访问的顶点的邻接点都被访问到。 如果此时图中尚有顶点未被访问，则需要另选一个未曾被访问过的顶点作为新的起始点，重复上述过程，直至图中所有顶点都被访问到为止。

```js
let widthTraversal2 = node => {
  let nodes = [];
  let stack = [];
  if (node) {
    stack.push(node);
    while (stack.length) {
      let item = stack.shift();
      let children = item.children;
      nodes.push(item);
      // 队列，先进先出
      // nodes = [] stack = [parent]
      // nodes = [parent] stack = [child1,child2,child3]
      // nodes = [parent, child1] stack = [child2,child3,child1-1,child1-2]
      // nodes = [parent,child1,child2]
      for (let i = 0; i < children.length; i++) {
        stack.push(children[i]);
      }
    }
  }
  return nodes;
};
```

##### 输出结果

[![image](https://user-images.githubusercontent.com/27856388/52607770-63818600-2eb2-11e9-9f5e-fc3e87950cd2.png)](https://user-images.githubusercontent.com/27856388/52607770-63818600-2eb2-11e9-9f5e-fc3e87950cd2.png)

### 请分别用深度优先思想和广度优先思想实现一个拷贝函数？

话不多说直接放代码
发现了比较多的错误，但由于最近工作有点忙，一直没来得及纠正

#### 更改(0226)

```js
// 工具函数
let _toString = Object.prototype.toString;
let map = {
  array: 'Array',
  object: 'Object',
  function: 'Function',
  string: 'String',
  null: 'Null',
  undefined: 'Undefined',
  boolean: 'Boolean',
  number: 'Number',
};
let getType = item => {
  return _toString.call(item).slice(8, -1);
};
let isTypeOf = (item, type) => {
  return map[type] && map[type] === getType(item);
};
```

#### 深复制 深度优先遍历

```js
let DFSdeepClone = (obj, visitedArr = []) => {
  let _obj = {};
  if (isTypeOf(obj, 'array') || isTypeOf(obj, 'object')) {
    let index = visitedArr.indexOf(obj);
    _obj = isTypeOf(obj, 'array') ? [] : {};
    if (~index) {
      // 判断环状数据
      _obj = visitedArr[index];
    } else {
      visitedArr.push(obj);
      for (let item in obj) {
        _obj[item] = DFSdeepClone(obj[item], visitedArr);
      }
    }
  } else if (isTypeOf(obj, 'function')) {
    _obj = eval('(' + obj.toString() + ')');
  } else {
    _obj = obj;
  }
  return _obj;
};
```

#### 广度优先遍历

```js
let BFSdeepClone = obj => {
  let origin = [obj],
    copyObj = {},
    copy = [copyObj];
  // 去除环状数据
  let visitedQueue = [],
    visitedCopyQueue = [];
  while (origin.length > 0) {
    let items = origin.shift(),
      _obj = copy.shift();
    visitedQueue.push(items);
    if (isTypeOf(items, 'object') || isTypeOf(items, 'array')) {
      for (let item in items) {
        let val = items[item];
        if (isTypeOf(val, 'object')) {
          let index = visitedQueue.indexOf(val);
          if (!~index) {
            _obj[item] = {};
            //下次while循环使用给空对象提供数据
            origin.push(val);
            // 推入引用对象
            copy.push(_obj[item]);
          } else {
            _obj[item] = visitedCopyQueue[index];
            visitedQueue.push(_obj);
          }
        } else if (isTypeOf(val, 'array')) {
          // 数组类型在这里创建了一个空数组
          _obj[item] = [];
          origin.push(val);
          copy.push(_obj[item]);
        } else if (isTypeOf(val, 'function')) {
          _obj[item] = eval('(' + val.toString() + ')');
        } else {
          _obj[item] = val;
        }
      }
      // 将已经处理过的对象数据推入数组 给环状数据使用
      visitedCopyQueue.push(_obj);
    } else if (isTypeOf(items, 'function')) {
      copyObj = eval('(' + items.toString() + ')');
    } else {
      copyObj = obj;
    }
  }
  return copyObj;
};
```

#### 测试

```js
/**测试数据 */
// 输入 字符串String
// 预期输出String
let str = 'String';
var strCopy = DFSdeepClone(str);
var strCopy1 = BFSdeepClone(str);
console.log(strCopy, strCopy1); // String String 测试通过
// 输入 数字 -1980
// 预期输出数字 -1980
let num = -1980;
var numCopy = DFSdeepClone(num);
var numCopy1 = BFSdeepClone(num);
console.log(numCopy, numCopy1); // -1980 -1980 测试通过
// 输入bool类型
// 预期输出bool类型
let bool = false;
var boolCopy = DFSdeepClone(bool);
var boolCopy1 = BFSdeepClone(bool);
console.log(boolCopy, boolCopy1); //false false 测试通过
// 输入 null
// 预期输出 null
let nul = null;
var nulCopy = DFSdeepClone(nul);
var nulCopy1 = BFSdeepClone(nul);
console.log(nulCopy, nulCopy1); //null null 测试通过

// 输入undefined
// 预期输出undefined
let und = undefined;
var undCopy = DFSdeepClone(und);
var undCopy1 = BFSdeepClone(und);
console.log(undCopy, undCopy1); //undefined undefined 测试通过
//输入引用类型obj
let obj = {
  a: 1,
  b: () => console.log(1),
  c: {
    d: 3,
    e: 4,
  },
  f: [1, 2],
  und: undefined,
  nul: null,
};
var objCopy = DFSdeepClone(obj);
var objCopy1 = BFSdeepClone(obj);
console.log(objCopy === objCopy1); // 对象类型判断 false 测试通过
console.log(obj.c === objCopy.c); // 对象类型判断 false 测试通过
console.log(obj.c === objCopy1.c); // 对象类型判断 false 测试通过
console.log(obj.b === objCopy1.b); // 函数类型判断 false 测试通过
console.log(obj.b === objCopy.b); // 函数类型判断 false 测试通过
console.log(obj.f === objCopy.f); // 数组类型判断 false 测试通过
console.log(obj.f === objCopy1.f); // 数组类型判断 false 测试通过
console.log(obj.nul, obj.und); // 输出null，undefined 测试通过

// 输入环状数据
// 预期不爆栈且深度复制
let circleObj = {
  foo: {
    name: function() {
      console.log(1);
    },
    bar: {
      name: 'bar',
      baz: {
        name: 'baz',
        aChild: null, //待会让它指向obj.foo
      },
    },
  },
};
circleObj.foo.bar.baz.aChild = circleObj.foo;
var circleObjCopy = DFSdeepClone(circleObj);
var circleObjCopy1 = BFSdeepClone(circleObj);
console.log(circleObjCopy, circleObjCopy1); // 测试通过?
```

### JSON.stringify 和 JSON.parse

直接使用这个来用作深拷贝会有哪些问题

```js
// 可以拷贝普通函数、Date、RegExp和传统对象
// 没有拷贝原型、没有解决循环引用
function deepClone(obj) {
  if (typeof obj === 'function') {
    const str = obj.toString();
    /^function\s*\w*\s*\((.*)\)\s*\{([\s\S]*)/.exec(str); // 匹配函数体
    const args = RegExp.$1.split(',').map(item => item.trim());
    const str1 = RegExp.$2.slice(0, -1); // 去除末尾花括号
    return new Function(...args, str1);
  }
  if (!obj || typeof obj !== 'object') return obj;
  if (Object.prototype.toString.call(obj) === '[object Date]') return new Date(obj); /*  */
  if (Object.prototype.toString.call(obj) === '[object RegExp]') return new RegExp(obj);
  const cloneObj = Array.isArray(obj) ? [] : {};
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      // 保证只遍历实例属性
      cloneObj[i] = deepClone(obj[i]);
    }
  }
  return cloneObj;
}
const obj = {
  name: 'xm',
  birth: new Date(),
  desc: null,
  reg: /^123$/,
  ss: [1, 2, 3],
  fn: function test(num1, num2) {
    console.log(num1, num2);
  },
};

const obj2 = deepClone(obj);
console.log(obj, obj2);
obj.fn(1, 2);
obj2.fn(1, 2);
```

### 深拷贝的实现

```js
function cloneDeep(x) {
  const root = {};

  // 栈
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x,
    },
  ];

  while (loopList.length) {
    // 广度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res = parent;
    if (typeof key !== 'undefined') {
      res = parent[key] = {};
    }

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === 'object') {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k],
          });
        } else {
          res[k] = data[k];
        }
      }
    }
  }

  return root;
}
```

扩展：深拷贝和浅拷贝的区别
浅拷贝只是新开一个别名来引用这个内存区。即拷贝原对象的引用

深拷贝会重新开辟一个内存区，并把之前内存区的值复制进来，这样两个内存区初始值是一样的，但接下去的操作互不影响
[深拷贝终极探索](https://segmentfault.com/a/1190000016672263)

### 实现一个类型判断函数，需要鉴别出基本类型、function、null、NaN、数组、对象？

只需要鉴别这些类型那么使用 typeof 即可，要鉴别 null 先判断双等判断是否为 null，之后使用 typeof 判断，如果是 obejct 的话，再用 Array.isArray 判断
是否为数组，如果是数字再使用 isNaN 判断是否为 NaN,（需要注意的是 NaN 并不是 JavaScript 数据类型，而是一种特殊值）如下：

```js
function type(ele) {
  if (ele === null) {
    return null;
  } else if (typeof ele === 'object') {
    if (Array.isArray(ele)) {
      return 'array';
    } else {
      return typeof ele;
    }
  } else if (typeof ele === 'number') {
    if (isNaN(ele)) {
      return NaN;
    } else {
      return typeof ele;
    }
  } else {
    return typeof ele;
  }
}

console.log(type(1));
console.log(type(''));
console.log(type([]));
console.log(type({}));
console.log(type(() => {}));
console.log(type(null));
console.log(type(undefined));
console.log(type(NaN));
```

```js
function getType(ele) {
  return Object.prototype.toString
    .call(ele)
    .slice(8, -1)
    .toLowerCase();
}
function type1(ele) {
  const eleType = getType(ele);
  switch (eleType) {
    case 'number':
      return isNaN(ele) ? 'NaN' : 'number';
    default:
      return eleType;
  }
}

console.log(type1(1));
console.log(type1(''));
console.log(type1([]));
console.log(type1({}));
console.log(type1(() => {}));
console.log(type1(null));
console.log(type1(undefined));
console.log(type1(NaN));

// 有一定问题，把 undefined  null NaN 这些都转成了 string
```

### 请分别用深度优先思想和广度优先思想实现一个拷贝函数？

```js
// 工具函数
let _toString = Object.prototype.toString;
let map = {
  array: 'Array',
  object: 'Object',
  function: 'Function',
  string: 'String',
  null: 'Null',
  undefined: 'Undefined',
  boolean: 'Boolean',
  number: 'Number',
};
let getType = item => {
  return _toString.call(item).slice(8, -1);
};
let isTypeOf = (item, type) => {
  return map[type] && map[type] === getType(item);
};
```

深度复制

```js
let DFSdeepClone = (obj, visitedArr = []) => {
  let _obj = {};
  if (isTypeOf(obj, 'array') || isTypeOf(obj, 'object')) {
    let index = visitedArr.indexOf(obj);
    _obj = isTypeOf(obj, 'array') ? [] : {};
    if (~index) {
      // 判断环状数据
      _obj = visitedArr[index];
    } else {
      visitedArr.push(obj);
      for (let item in obj) {
        _obj[item] = DFSdeepClone(obj[item], visitedArr);
      }
    }
  } else if (isTypeOf(obj, 'function')) {
    _obj = eval('(' + obj.toString() + ')');
  } else {
    _obj = obj;
  }
  return _obj;
};
```

广度复制

```js
let BFSdeepClone = obj => {
  let origin = [obj],
    copyObj = {},
    copy = [copyObj];
  // 去除环状数据
  let visitedQueue = [],
    visitedCopyQueue = [];
  while (origin.length > 0) {
    let items = origin.shift(),
      _obj = copy.shift();
    visitedQueue.push(items);
    visitedCopyQueue.push(_obj);
    if (isTypeOf(items, 'object') || isTypeOf(items, 'array')) {
      for (let item in items) {
        let val = items[item];
        if (isTypeOf(val, 'object')) {
          let index = visitedQueue.indexOf(val);
          if (!~index) {
            _obj[item] = {};
            //下次while循环使用给空对象提供数据
            origin.push(val);
            // 推入引用对象
            copy.push(_obj[item]);
            visitedQueue.push(val);
          } else {
            _obj[item] = visitedCopyQueue[index];
          }
        } else if (isTypeOf(val, 'array')) {
          // 数组类型在这里创建了一个空数组
          _obj[item] = [];
          origin.push(val);
          copy.push(_obj[item]);
        } else if (isTypeOf(val, 'function')) {
          _obj[item] = eval('(' + val.toString() + ')');
        } else {
          _obj[item] = val;
        }
      }
    } else if (isTypeOf(items, 'function')) {
      copyObj = eval('(' + items.toString() + ')');
    } else {
      copyObj = obj;
    }
  }
  return copyObj;
};
```

测试

```js
/**测试数据 */
// 输入 字符串String
// 预期输出String
let str = 'String';
var strCopy = DFSdeepClone(str);
var strCopy1 = BFSdeepClone(str);
console.log(strCopy, strCopy1); // String String 测试通过
// 输入 数字 -1980
// 预期输出数字 -1980
let num = -1980;
var numCopy = DFSdeepClone(num);
var numCopy1 = BFSdeepClone(num);
console.log(numCopy, numCopy1); // -1980 -1980 测试通过
// 输入bool类型
// 预期输出bool类型
let bool = false;
var boolCopy = DFSdeepClone(bool);
var boolCopy1 = BFSdeepClone(bool);
console.log(boolCopy, boolCopy1); //false false 测试通过
// 输入 null
// 预期输出 null
let nul = null;
var nulCopy = DFSdeepClone(nul);
var nulCopy1 = BFSdeepClone(nul);
console.log(nulCopy, nulCopy1); //null null 测试通过

// 输入undefined
// 预期输出undefined
let und = undefined;
var undCopy = DFSdeepClone(und);
var undCopy1 = BFSdeepClone(und);
console.log(undCopy, undCopy1); //undefined undefined 测试通过
//输入引用类型obj
let obj = {
  a: 1,
  b: () => console.log(1),
  c: {
    d: 3,
    e: 4,
  },
  f: [1, 2],
  und: undefined,
  nul: null,
};
var objCopy = DFSdeepClone(obj);
var objCopy1 = BFSdeepClone(obj);
console.log(objCopy === objCopy1); // 对象类型判断 false 测试通过
console.log(obj.c === objCopy.c); // 对象类型判断 false 测试通过
console.log(obj.c === objCopy1.c); // 对象类型判断 false 测试通过
console.log(obj.b === objCopy1.b); // 函数类型判断 false 测试通过
console.log(obj.b === objCopy.b); // 函数类型判断 false 测试通过
console.log(obj.f === objCopy.f); // 数组类型判断 false 测试通过
console.log(obj.f === objCopy1.f); // 数组类型判断 false 测试通过
console.log(obj.nul, obj.und); // 输出null，undefined 测试通过

// 输入环状数据
// 预期不爆栈且深度复制
let circleObj = {
  foo: {
    name: function() {
      console.log(1);
    },
    bar: {
      name: 'bar',
      baz: {
        name: 'baz',
        aChild: null, //待会让它指向obj.foo
      },
    },
  },
};
circleObj.foo.bar.baz.aChild = circleObj.foo;
var circleObjCopy = DFSdeepClone(circleObj);
var circleObjCopy1 = BFSdeepClone(circleObj);
console.log(circleObjCopy, circleObjCopy1); // 测试通过?
```

扩展：深拷贝与浅拷贝
基本类型--名值存储在栈内存中，
引用数据类型--名存在栈内存中，值存在于堆内存中，但是栈内存会提供一个引用的地址指向堆内存中的值
因此在浅拷贝引用类型进行复制时，复制对值指向对是同一个地址

- 简单深拷贝

```js
function deepCopy(obj) {
  let newObj = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === 'object') {
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          newObj[key] = deepCopy(obj[key]);
        } else {
          //如果不是，简单复制
          newObj[key] = obj[key];
        }
      }
    }
  }
  return newObj;
}
```

- JSON 对象的 parse 和 stringify 也可以实现深拷贝
- JQ 的 extend 方法。
  \$.extend( [deep ], target, object1 [, objectN ] )

deep 表示是否深拷贝，为 true 为深拷贝，为 false，则为浅拷贝

target Object 类型 目标对象，其他对象的成员属性将被附加到该对象上。

object1 objectN 可选。 Object 类型 第一个以及第 N 个被合并的对象。

### 深浅拷贝

```js
let a = {
  age: 1,
};
let b = a;
a.age = 2;
console.log(b.age); // 2
```

从上述例子中我们可以发现，如果给一个变量赋值一个对象，那么两者的值会是同一个引用，其中一方改变，另一方也会相应改变。

通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个问题。

#### 浅拷贝

首先可以通过 `Object.assign` 来解决这个问题。

```js
let a = {
  age: 1,
};
let b = Object.assign({}, a);
a.age = 2;
console.log(b.age); // 1
```

当然我们也可以通过展开运算符（…）来解决

```js
let a = {
  age: 1,
};
let b = { ...a };
a.age = 2;
console.log(b.age); // 1
```

通常浅拷贝就能解决大部分问题了，但是当我们遇到如下情况就需要使用到深拷贝了

```js
let a = {
  age: 1,
  jobs: {
    first: 'FE',
  },
};
let b = { ...a };
a.jobs.first = 'native';
console.log(b.jobs.first); // native
```

浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，那么就又回到刚开始的话题了，两者享有相同的引用。要解决这个问题，我们需要引入深拷贝。

#### 深拷贝

这个问题通常可以通过 `JSON.parse(JSON.stringify(object))` 来解决。

```js
let a = {
  age: 1,
  jobs: {
    first: 'FE',
  },
};
let b = JSON.parse(JSON.stringify(a));
a.jobs.first = 'native';
console.log(b.jobs.first); // FE
```

但是该方法也是有局限性的：

- 会忽略 `undefined`
- 会忽略 `symbol`
- 不能序列化函数
- 不能解决循环引用的对象

```js
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
};
obj.c = obj.b;
obj.e = obj.a;
obj.b.c = obj.c;
obj.b.d = obj.b;
obj.b.e = obj.b.c;
let newObj = JSON.parse(JSON.stringify(obj));
console.log(newObj);
```

如果你有这么一个循环引用对象，你会发现你不能通过该方法深拷贝

![](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-042627.png)

在遇到函数、 `undefined` 或者 `symbol` 的时候，该对象也不能正常的序列化

```js
let a = {
  age: undefined,
  sex: Symbol('male'),
  jobs: function() {},
  name: 'yiliang114',
};
let b = JSON.parse(JSON.stringify(a));
console.log(b); // {name: "yck"}
```

你会发现在上述情况中，该方法会忽略掉函数和 `undefined` 。

但是在通常情况下，复杂数据都是可以序列化的，所以这个函数可以解决大部分问题，并且该函数是内置函数中处理深拷贝性能最快的。当然如果你的数据中含有以上三种情况下，可以使用 [lodash 的深拷贝函数](https://lodash.com/docs#cloneDeep)。

如果你所需拷贝的对象含有内置类型并且不包含函数，可以使用 `MessageChannel`

```js
function structuralClone(obj) {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  });
}

var obj = {
  a: 1,
  b: {
    c: b,
  },
}(
  // 注意该方法是异步的
  // 可以处理 undefined 和循环引用对象
  async () => {
    const clone = await structuralClone(obj);
  },
)();
```
