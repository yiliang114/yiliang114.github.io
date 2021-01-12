---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

### 浅拷贝

只复制指向某个对象的指针，而不复制对象本身，新旧对象共享一块内存

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

#### 数组的浅拷贝

```js
const a1 = [1, 2];
const a2 = a1.concat();
const a3 = a1.slice();
```

### 深拷贝

```js
function clone(obj) {
  var buf;
  if (obj instanceof Array) {
    buf = []; // 创建一个空的数组
    var i = obj.length;
    while (i--) {
      buf[i] = clone(obj[i]);
    }
    return buf;
  } else if (obj instanceof Object) {
    buf = {}; // 创建一个空对象
    for (var k in obj) {
      // 为这个对象添加新的属性
      buf[k] = clone(obj[k]);
    }
    return buf;
  } else {
    return obj;
  }
}
```

### 深拷贝

#### JSON.parse JSON.stringify

简单的做法：`JSON.parse(JSON.stringify(obj))`， 但是该方法也是有局限性的：

- 会忽略`undefined`
- 会忽略`symbol`
- 会忽略函数
- 不能解决循环引用的对象 （会报错）

这种方法有局限性，如果属性值是函数或者一个类的实例的时候，无法正确拷贝

#### MessageChannel

如果你所需拷贝的对象含有内置类型并且不包含函数，可以使用 `MessageChannel`。 这种方法有局限性，当属性值是函数的时候，会报错。

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

#### lodash

有提供 `_.cloneDeep`

### 自封装深拷贝

思路：

1. 使用 for-in 遍历对象
2. 因为 for-in 会遍历原型链上的属性，所以需要判断属性是否在原型链上，不是原型链才拷贝
3. 判断属性值类型是原始类型和引用类型
4. 原始类型直接赋值（注意 null）
5. 引用类型判断是对象还是数组，**创建对应的空对象或空数组**，递归调用函数，将值赋值进去

```js
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

### 实现一个函数 clone

可以对 JavaScript 中的 5 种主要的数据类型（包括 Number、String、Object、Array、Boolean）进行值复制

```js
Object.prototype.clone = function() {
  var o = this.constructor === Array ? [] : {};

  for (var e in this) {
    o[e] = typeof this[e] === 'object' ? this[e].clone() : this[e];
  }

  return o;
};
```

### 介绍下深度优先遍历和广度优先遍历，如何实现？

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
