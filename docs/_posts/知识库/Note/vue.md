---
title: vue
date: 2020-10-22
draft: true
---

### vue 编译节点

注释节点 type = 3

```js
comment(text) {
  currentParent.children.push({
    // 注释节点 type = 3
    type: 3,
    text,
    // 同时这个属性也是
    isComment: true
  })
}
```
