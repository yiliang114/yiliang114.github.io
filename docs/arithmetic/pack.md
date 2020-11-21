---
layout: CustomPages
title: 背包问题
date: 2020-08-31
aside: false
draft: true
---

# 背包问题

## SF/ALGs/pack/01.js

```js
/**
 * 01 背包问题
 *
 * 有 N 件物品和一个容量为 V 的背包。
 * 放入第 i 件物品耗费的费用是 Ci ，得到的 价值是 Wi。
 * 求解将哪些物品装入背包可使价值总和最大。
 *
 * F[i, v] = max{F[i − 1, v], F[i − 1, v − Ci ] + Wi }
 *
 * @param Cost
 * @param Worth
 * @param V
 * @returns {*}
 */
function pack(Cost, Worth, V) {
  var n = Cost.length;
  var dp = [];
  while (dp.push(new Array(V + 1).fill(0)) < n + 1);

  for (var i = 1; i < n + 1; i++) {
    for (var j = 1; j < V + 1; j++) {
      dp[i][j] = dp[i - 1][j];
      if (j > Cost[i - 1]) {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - Cost[i - 1]] + Worth[i - 1]);
      }
    }
  }

  for (var i = 1; i < dp.length; i++) {
    console.log(dp[i].slice(1));
  }

  return dp[n][V];
}

console.log(pack([5, 4, 7, 2, 6], [12, 3, 10, 3, 6], 15), 25);
```

## SF/ALGs/pack/02.js

```js
/**
 * 2 完全背包问题
 * 有 N 种物品和一个容量为 V 的背包，
 * 每种物品都有无限件可用。放入第 i 种物品 的费用是 Ci，价值是 Wi。
 * 求解：将哪些物品装入背包，可使这些物品的耗费的费用总和不超过背包容量，且价值总和最大。
 *
 * F[i, v] = max{F[i − 1, v − k*Ci ] + k*Wi | 0 ≤ k*Ci ≤ v}
 *
 * @param Cost
 * @param Worth
 * @param V
 */
function pack(Cost, Worth, V) {
  var n = Cost.length;
  var dp = [];
  while (dp.push(new Array(V + 1).fill(0)) < n + 1);

  for (var i = 1; i < n + 1; i++) {
    for (var v = 1; v < V + 1; v++) {
      var c = Cost[i - 1];
      var w = Worth[i - 1];
      var count = Math.floor(v / c);
      var max = 0;
      for (var t = 0; t <= count; t++) {
        var newV = dp[i - 1][v - t * c] + t * w;
        if (newV > max) max = newV;
      }
      dp[i][v] = max;
    }
  }

  for (var i = 1; i < dp.length; i++) {
    console.log(dp[i].slice(1));
  }

  return dp[n][V];
}

console.log(pack([3, 2, 1], [7, 3, 1], 16));
console.log(pack([3, 2, 1], [7, 3, 1], 17));
console.log(pack([5, 4, 7, 2, 6], [12, 3, 10, 3, 6], 15));
console.log(pack([5, 4, 7, 2, 6], [12, 3, 10, 3, 6], 17));
```

## SF/ALGs/pack/03.js

```js
/**
 * 3 多重背包问题
 * 有 N 种物品和一个容量为 V 的背包。
 * 第 i 种物品最多有 Mi 件可用，每件耗费的 空间是 Ci ，价值是 Wi 。
 * 求解将哪些物品装入背包可使这些物品的耗费的空间总和不超 过背包容量，且价值总和最大。
 *
 * F[i，v] = max{F[i − 1, v − k∗Ci ] + k∗Wi | 0 ≤ k ≤ Mi }
 *
 * @param Cost
 * @param Worth
 * @param Much
 * @param V
 */
function pack(Cost, Worth, Much, V) {
  var n = Cost.length;
  var dp = [];
  while (dp.push(new Array(V + 1).fill(0)) < n + 1);

  for (var i = 1; i < n + 1; i++) {
    for (var v = 1; v < V + 1; v++) {
      var c = Cost[i - 1];
      var w = Worth[i - 1];
      var count = Math.min(Math.floor(v / c), Much[i - 1]);
      var max = 0;
      for (var t = 0; t <= count; t++) {
        var newV = dp[i - 1][v - t * c] + t * w;
        if (newV > max) max = newV;
      }
      dp[i][v] = max;
    }
  }

  for (var i = 1; i < dp.length; i++) {
    console.log(dp[i].slice(1));
  }

  return dp[n][V];
}

console.log(pack([5, 4, 7, 2, 6], [12, 3, 10, 3, 6], [2, 2, 1, 2, 7], 15));
console.log(pack([5, 4, 7, 2, 6], [12, 3, 10, 3, 6], [3, 2, 1, 2, 7], 15));
console.log(pack([5, 4, 7, 2, 6], [12, 3, 10, 3, 6], [3, 2, 1, 2, 7], 17));
```
