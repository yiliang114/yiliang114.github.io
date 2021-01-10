---
layout: CustomPages
title: 动态规划
date: 2020-11-14
aside: false
draft: true
---

## 动态规划

适用于动态规划的问题，需要满足**最优子结构**和**无后效性**，动态规划的求解过程，在于找到**状态转移方程**，进行**自底向上**的求解。

### 动态规划的规律

- 递归找解决方案经常会超时，因为递归类似 DFS，每个都在走到黑再回头。
- 求概率、步数、步骤这种使用 dp 更好一些。
- 当 DFS 算法超时时使用 dp 算法来做。
- 使用 `for (let j = 0; i != j && j < points.length; j++)` 来遍历并剔除 i 是及其错误的，这样会中断 for 循环。
- Number 的 toString 方法可以返回 2-36 进制的数字

### 递归搜索和动态规划 的理解的 blog

1. https://www.jianshu.com/p/5eb4da919efe
2. https://www.jianshu.com/p/6b3a2304f63f

## 例题

#### 连续子数组的最大和 [LeetCode 53](https://leetcode.com/problems/maximum-subarray/)

用 `dp[n`] 表示元素 n 作为末尾的连续序列的最大和，容易想到状态转移方程为`dp[n] = max(dp[n-1] + num[n], num[n])`，从第 1 个元素开始，自顶向上求解：

```cpp
int maxSubArray(vector<int>& nums) {
    int* dp = new int[nums.size()]();

    dp[0] = nums[0];
    int result = dp[0];

    for (int i = 1; i < nums.size(); i++) {
        dp[i] = max(dp[i-1] + nums[i], nums[i]);
        result = max(result, dp[i]);
    }

    return result;
}
```

类似前一个问题，这个问题当中，求解 `dp[i]` 只依赖 `dp[i-1]`，因此可以使用变量来存储，简化代码：

```cpp
int maxSubArray(int A[], int n) {
    int result = INT_MIN;
    int f = 0;
    for (int i=0; i < n; i++) {
        f = max(f + A[i], A[i]);
        result = max(result, f);
    }
    return result;
}
```

#### House Robber [LeetCode 198](https://leetcode.com/problems/house-robber/)

对于一个房子，有抢和不抢两种选择，容易得到状态转移方程 `dp[i+1] = max(dp[i-1] + nums[i], dp[i])`，示例代码如下：

```cpp
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 0) {
        return 0;
    }

    vector<int> dp = vector<int>(n + 1);

    dp[0] = 0;
    dp[1] = nums[0];

    for (int i = 1; i < nums.size(); i++) {
        int v = nums[i];
        dp[i+1] = max(dp[i-1] + v, dp[i]);
    }

    return dp[n];
}
```

同样的，可以使用两个变量简化代码：

```cpp
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 0) {
        return 0;
    }

    int prev1 = 0;
    int prev2 = 0;

    for (int i = 0; i < nums.size(); i++) {
        int v = nums[i];
        int temp = prev1;
        prev1 = max(prev2 + v, prev1);
        prev2 = temp;
    }

    return prev1;
}
```

#### 最小编辑距离 [LeetCode 72](https://leetcode.com/problems/edit-distance/)

用 `dp[i][j]` 表示从 `word[0..i)` 转换到 `word[0..j)` 的最小操作，使用动态规划求解：

```cpp
int minDistance(string word1, string word2) {
    int m = word1.size();
    int n = word2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    // 全部删除，操作数量为 i
    for (int i = 0; i <= m; i++) {
        dp[i][0] = i;
    }

    for (int j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            // 末尾字符相同，不需要编辑
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // 末尾字符不同，三种编辑情况，取最小值
                dp[i][j] = min(dp[i - 1][j - 1], min(dp[i][j - 1], dp[i - 1][j])) + 1;
            }
        }
    }

    return dp[m][n];
}
```

### Coins 硬币问题

```js
/**
 * You have n dollars. How many distinguishable ways can you represent that value with
 * 1, 5, 10, and 25 dollar bills?
 *
 * For example, when n is 6, [[1, 5], [5, 1]] are possible solutions
 */

const map = new Map();

export default function Coins(n: number) {
  if (n < 0) return 0;
  if (n === 0) return 1;
  if (map.has(n)) return map.get(n);
  const combinations = Coins(n - 1) + Coins(n - 5) + Coins(n - 10) + Coins(n - 25);
  map.set(n, combinations);
  return combinations;
}
```

### 动态规划

动态规划背后的基本思想非常简单。就是将一个问题拆分为子问题，一般来说这些子问题都是非常相似的，那么我们可以通过只解决一次每个子问题来达到减少计算量的目的。

一旦得出每个子问题的解，就存储该结果以便下次使用。

#### 斐波那契数列

斐波那契数列就是从 0 和 1 开始，后面的数都是前两个数之和

0，1，1，2，3，5，8，13，21，34，55，89....

那么显然易见，我们可以通过递归的方式来完成求解斐波那契数列

```js
function fib(n) {
  if (n < 2 && n >= 0) return n;
  return fib(n - 1) + fib(n - 2);
}
fib(10);
```

以上代码已经可以完美的解决问题。但是以上解法却存在很严重的性能问题，当 n 越大的时候，需要的时间是指数增长的，这时候就可以通过动态规划来解决这个问题。

动态规划的本质其实就是两点

1. 自底向上分解子问题
2. 通过变量存储已经计算过的解

根据上面两点，我们的斐波那契数列的动态规划思路也就出来了

1. 斐波那契数列从 0 和 1 开始，那么这就是这个子问题的最底层
2. 通过数组来存储每一位所对应的斐波那契数列的值

```js
function fib(n) {
  let array = new Array(n + 1).fill(null);
  array[0] = 0;
  array[1] = 1;
  for (let i = 2; i <= n; i++) {
    array[i] = array[i - 1] + array[i - 2];
  }
  return array[n];
}
fib(10);
```

#### 0 - 1 背包问题

该问题可以描述为：给定一组物品，每种物品都有自己的重量和价格，在限定的总重量内，我们如何选择，才能使得物品的总价格最高。每个问题只能放入至多一次。

假设我们有以下物品

| 物品 ID / 重量 | 价值 |
| :------------: | :--: |
|       1        |  3   |
|       2        |  7   |
|       3        |  12  |

对于一个总容量为 5 的背包来说，我们可以放入重量 2 和 3 的物品来达到背包内的物品总价值最高。

对于这个问题来说，子问题就两个，分别是放物品和不放物品，可以通过以下表格来理解子问题

| 物品 ID / 剩余容量 |  0  |  1  |  2  |  3  |  4  |  5  |
| :----------------: | :-: | :-: | :-: | :-: | :-: | :-: |
|         1          |  0  |  3  |  3  |  3  |  3  |  3  |
|         2          |  0  |  3  |  7  | 10  | 10  | 10  |
|         3          |  0  |  3  |  7  | 12  | 15  | 19  |

直接来分析能放三种物品的情况，也就是最后一行

- 当容量少于 3 时，只取上一行对应的数据，因为当前容量不能容纳物品 3
- 当容量 为 3 时，考虑两种情况，分别为放入物品 3 和不放物品 3
  - 不放物品 3 的情况下，总价值为 10
  - 放入物品 3 的情况下，总价值为 12，所以应该放入物品 3
- 当容量 为 4 时，考虑两种情况，分别为放入物品 3 和不放物品 3
  - 不放物品 3 的情况下，总价值为 10
  - 放入物品 3 的情况下，和放入物品 1 的价值相加，得出总价值为 15，所以应该放入物品 3
- 当容量 为 5 时，考虑两种情况，分别为放入物品 3 和不放物品 3
  - 不放物品 3 的情况下，总价值为 10
  - 放入物品 3 的情况下，和放入物品 2 的价值相加，得出总价值为 19，所以应该放入物品 3

以下代码对照上表更容易理解

```js
/**
 * @param {*} w 物品重量
 * @param {*} v 物品价值
 * @param {*} C 总容量
 * @returns
 */
function knapsack(w, v, C) {
  let length = w.length;
  if (length === 0) return 0;

  // 对照表格，生成的二维数组，第一维代表物品，第二维代表背包剩余容量
  // 第二维中的元素代表背包物品总价值
  let array = new Array(length).fill(new Array(C + 1).fill(null));

  // 完成底部子问题的解
  for (let i = 0; i <= C; i++) {
    // 对照表格第一行， array[0] 代表物品 1
    // i 代表剩余总容量
    // 当剩余总容量大于物品 1 的重量时，记录下背包物品总价值，否则价值为 0
    array[0][i] = i >= w[0] ? v[0] : 0;
  }

  // 自底向上开始解决子问题，从物品 2 开始
  for (let i = 1; i < length; i++) {
    for (let j = 0; j <= C; j++) {
      // 这里求解子问题，分别为不放当前物品和放当前物品
      // 先求不放当前物品的背包总价值，这里的值也就是对应表格中上一行对应的值
      array[i][j] = array[i - 1][j];
      // 判断当前剩余容量是否可以放入当前物品
      if (j >= w[i]) {
        // 可以放入的话，就比大小
        // 放入当前物品和不放入当前物品，哪个背包总价值大
        array[i][j] = Math.max(array[i][j], v[i] + array[i - 1][j - w[i]]);
      }
    }
  }
  return array[length - 1][C];
}
```

#### 最长递增子序列

最长递增子序列意思是在一组数字中，找出最长一串递增的数字，比如

0, 3, 4, 17, 2, 8, 6, 10

对于以上这串数字来说，最长递增子序列就是 0, 3, 4, 8, 10，可以通过以下表格更清晰的理解

| 数字 |  0  |  3  |  4  | 17  |  2  |  8  |  6  | 10  |
| :--: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 长度 |  1  |  2  |  3  |  4  |  2  |  4  |  4  |  5  |

通过以上表格可以很清晰的发现一个规律，找出刚好比当前数字小的数，并且在小的数组成的长度基础上加一。

这个问题的动态思路解法很简单，直接上代码

```js
function lis(n) {
  if (n.length === 0) return 0;
  // 创建一个和参数相同大小的数组，并填充值为 1
  let array = new Array(n.length).fill(1);
  // 从索引 1 开始遍历，因为数组已经所有都填充为 1 了
  for (let i = 1; i < n.length; i++) {
    // 从索引 0 遍历到 i
    // 判断索引 i 上的值是否大于之前的值
    for (let j = 0; j < i; j++) {
      if (n[i] > n[j]) {
        array[i] = Math.max(array[i], 1 + array[j]);
      }
    }
  }
  let res = 1;
  for (let i = 0; i < array.length; i++) {
    res = Math.max(res, array[i]);
  }
  return res;
}
```
