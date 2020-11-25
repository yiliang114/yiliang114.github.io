---
layout: CustomPages
title: 深度优先和广度优先搜索
date: 2020-08-30
aside: false
---

## 深度优先和广度优先搜索

### BFS

bfs 是发散可能性的写法，一次性尝试所有可能性。

```js
let mark = [
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
];

function bfs(rect) {
  let queue = [];
  queue.push({ i: 0, j: 0 });

  while (queue.length != 0) {
    let position = queue.shift();
    if (
      position.i > 0 &&
      !mark[position.i - 1][position.j] &&
      rect[position.i - 1][position.j] > rect[position.i][position.j]
    )
      queue.push({ i: position.i - 1, j: position.j });
    if (
      position.i < rect.length - 1 &&
      !mark[position.i + 1][position.j] &&
      rect[position.i + 1][position.j] > rect[position.i][position.j]
    )
      queue.push({ i: position.i + 1, j: position.j });
    if (
      position.j > 0 &&
      !mark[position.i][position.j - 1] &&
      rect[position.i][position.j - 1] > rect[position.i][position.j]
    )
      queue.push({ i: position.i, j: position.j - 1 });
    if (
      position.j < rect[0].length - 1 &&
      !mark[position.i][position.j + 1] &&
      rect[position.i][position.j + 1] > rect[position.i][position.j]
    )
      queue.push({ i: position.i, j: position.j + 1 });
    mark[position.i][position.j] = true;
  }
}

const rect = [
  [1, 2, 3, 5],
  [3, 3, 6, 8],
  [1, 4, 5, 6],
  [9, 3, 6, 7],
];

bfs(rect);
```

### DFS

dfs 是升入可能性的写法，一次深入尝试一种方案。 实现了简单的深度优先搜索。

```js
let mark = [
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
];

function dfs(rect, i, j, count) {
  mark[i][j] = true;
  count++;
  if (i == rect.length - 1 && j == rect[0].length - 1) {
    console.log(count);
  }
  if (i > 0 && !mark[i - 1][j] && rect[i - 1][j] > rect[i][j]) dfs(rect, i - 1, j, count);
  if (i < rect.length - 1 && !mark[i + 1][j] && rect[i + 1][j] > rect[i][j]) dfs(rect, i + 1, j, count);
  if (j > 0 && !mark[i][j - 1] && rect[i][j - 1] > rect[i][j]) dfs(rect, i, j - 1, count);
  if (j < rect[0].length - 1 && !mark[i][j + 1] && rect[i][j + 1] > rect[i][j]) dfs(rect, i, j + 1, count);
  mark[i][j] = false;
}

const rect = [
  [1, 2, 2, 5],
  [3, 3, 6, 8],
  [1, 4, 5, 6],
  [9, 3, 6, 7],
];

dfs(rect, 0, 0, 0);
```
