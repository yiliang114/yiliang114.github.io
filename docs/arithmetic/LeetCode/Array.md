---
layout: CustomPages
title: LeetCode-Array
date: 2020-12-02
aside: false
draft: true
---

# Array

## 134.Gas Station(加油站)

https://leetcode-cn.com/problems/gas-station/

### 题目描述

```
There are N gas stations along a circular route, where the amount of gas at station i is gas[i].

You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from station i to its next station (i+1). You begin the journey with an empty tank at one of the gas stations.

Return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.
```

### 参考答案

1.暴力求解，时间复杂度 O(n^2)

> 我们可以一次遍历 gas，对于每一个 gas 我们依次遍历后面的 gas，计算 remian，如果 remain 一旦小于 0，就说明不行，我们继续遍历下一个

```js
// bad 时间复杂度0(n^2)
let remain = 0;
const n = gas.length;
for (let i = 0; i < gas.length; i++) {
  remain += gas[i];
  remain -= cost[i];
  let count = 0;
  while (remain >= 0) {
    count++;
    if (coun === n) return i;
    remain += gas[getIndex(i + count, n)];
    remain -= cost[getIndex(i + count, n)];
  }
  remain = 0;
}
retirn - 1;
```

2.比较巧妙的方法，时间复杂度是 O(n)

> 这个方法基于两点：
>
> 2-1:如果站点 i 到达站点 j 走不通,那么从 i 到 j 之间的站点(比如 k)出发一定都走不通。前提 i(以及 i 到 k 之间)不会拖累总体(即 remain >= 0)。
>
> 2-2:如果 cost 总和大于 gas 总和，无论如何也无法走到终点，这个比较好理解。因此假如存在一个站点出发能够到达终点，其实就说明 cost 总和一定小于等于 gas 总和

```js
const n = gas.length;
let total = 0;
let remain = 0;
let start = 0;

for (let i = 0; i < n; i++) {
  total += gas[i];
  total -= cost[i];

  remain += gas[i];
  remain -= cost[i];

  // 如果remain < 0,说明从start到i走不通
  // 并且从start到i走不通，那么所有的solution中包含start到i的肯定都走不通
  // 因此我们重新从i + 1开始作为start
  if (remain < 0) {
    remain = 0;
    start = i + 1;
  }
}
// 事实上，我们遍历一遍，也就确定了每一个元素作为start是否可以走完一圈

// 如果costu总和大于gas总和，无论如何也无法走到终点
return total >= 0 ? start : -1;
```

```js
/*
 * @lc app=leetcode id=134 lang=javascript
 *
 * [134] Gas Station
 */

function getIndex(index, n) {
  if (index > n - 1) {
    return index - n;
  }
  return index;
}
/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function(gas, cost) {
  // bad 时间复杂度O(n^2)
  //   let remain = 0;
  //   const n = gas.length;
  //   for (let i = 0; i < gas.length; i++) {
  //     remain += gas[i];
  //     remain -= cost[i];
  //     let count = 0;
  //     while (remain >= 0) {
  //       count++;
  //       if (count === n) return i;
  //       remain += gas[getIndex(i + count, n)];
  //       remain -= cost[getIndex(i + count, n)];
  //     }
  //     remain = 0;
  //   }
  //   return -1;
  // better solution 时间复杂度O(n)

  const n = gas.length;
  let total = 0;
  let remain = 0;
  let start = 0;

  for (let i = 0; i < n; i++) {
    total += gas[i];
    total -= cost[i];

    remain += gas[i];
    remain -= cost[i];

    // 如果remain < 0, 说明从start到i走不通
    // 并且从start到i走不通，那么所有的solution中包含start到i的肯定都走不通
    // 因此我们重新从i + 1开始作为start
    if (remain < 0) {
      remain = 0;
      start = i + 1;
    }
  }
  // 事实上，我们遍历一遍，也就确定了每一个元素作为start是否可以走完一圈

  // 如果cost总和大于gas总和，无论如何也无法走到终点
  return total >= 0 ? start : -1;
};
```
