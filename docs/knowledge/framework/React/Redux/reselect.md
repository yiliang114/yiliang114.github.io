---
title: 懒加载的实现原理
date: '2020-10-26'
draft: true
---

# reselect

使用 redux 时，通常会创建很多 selector 来从 store 中读取数据。

redux 的 todomvc 代码实例：

```js
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
  }
};
```

**这个代码有一个潜在的问题，每当 state tree 改变时，selector 都要重新运行。当 state tree 特别大，或者 selector 计算特别耗时时，那么将代码严重的运行效率问题。**

https://www.jianshu.com/p/6e38c66366cd

https://www.jianshu.com/p/8d89c67dfefd
