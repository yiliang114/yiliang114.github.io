---
layout: CustomPages
title: 前端与数据结构-高频真题解析
date: 2020-11-16
aside: false
draft: true
---

## 高频真题解析

主要介绍的解题方法是：

- 线性法及优化线性法
- 切分法
- 快速选择算法
- 最小堆法
- 分治法

### 算法分析

###### 扩展一

例题：如果给定的两个数组是没有经过排序处理的，应该怎么找出中位数呢？

![](http://s0.lgstatic.com/i/image2/M01/91/50/CgotOV2InpmAMCH-AACt9UBVjdM117.png)

###### 解法 1：直观方法

先将两个数组合并在一起，然后排序，再选出中位数。时间复杂度是：O((m+n)× og(m+n))。

![](http://s0.lgstatic.com/i/image2/M01/91/30/CgoB5l2InpqADa6YACUXrW-nt7c325.gif)

###### 解法 2：快速选择算法

快速选择算法，可以在 O(n) 的时间内从长度为 n 的没有排序的数组中取出第 k 小的数，运用了快速排序的思想。

假如将 nums1\[\] 与 nums2\[\] 数组组合成一个数组变成 nums\[\]：{2, 5, 3, 1, 6, 8, 9, 7, 4}，那么如何在这个没有排好序的数组中找到第 k 小的数呢？

1\. 随机地从数组中选择一个数作为基准值，比如 7。一般而言，随机地选择基准值可以避免最坏的情况出现。

![](http://s0.lgstatic.com/i/image2/M01/91/50/CgotOV2InpuAQV-WAB7LzfFC6cc207.gif)

2\. 将数组排列成两个部分，以基准值作为分界点，左边的数都小于基准值，右边的都大于基准值。

![](http://s0.lgstatic.com/i/image2/M01/91/50/CgotOV2InpyAWKEsACyLx0hVqIg915.gif)

3\. 判断一下基准值所在位置 p：

1.  如果 p 刚好等于 k，那么基准值就是所求数，直接返回。

2.  如果 k < p，即基准值太大，搜索的范围应该缩小到基准值的左边。

3.  如果 k > p，即基准值太小，搜索的范围应该缩小到基准值的右边。此时需要找的应该是第 k - p 小的数，因为前 p 个数被淘汰。

![](http://s0.lgstatic.com/i/image2/M01/91/30/CgoB5l2Inp-ANdNWAFfawadYn4g058.gif)

4\. 重复第一步，直到基准值的位置 p 刚好就是要找的 k。

**代码实现**

public int findKthLargest(int\[\] nums, int k) {
    return quickSelect(nums, 0, nums.length - 1, k);
}

//  随机取一个基准值，这里取最后一个数作为基准值
int quickSelect(int\[\] nums, int low, int high, int k) {
    int pivot = low;

//  比基准值小的数放左边，把比基准值大的数放右边
    for (int j = low; j < high; j++) {
      if (nums\[j\] <= nums\[high\]) {
          swap(nums, pivot++, j);
      }
    }
    swap(nums, pivot, high);

//  判断基准值的位置是不是第  k  大的元素
    int count = high - pivot + 1;
    //  如果是，就返回结果。
    if (count == k) return nums\[pivot\];
    //  如果发现基准值小了，继续往右边搜索
    if (count > k) return quickSelect(nums, pivot + 1, high, k);
    //  如果发现基准值大了，就往左边搜索
    return quickSelect(nums, low, pivot - 1, k - count);

}

**时间复杂度**

时间复杂度为什么是 O(n)。分析如下。

为了方便推算，假设每次都选择中间的那个数作为基准值。

1.  设函数的时间执行函数为 T(n)，第一次运行的时候，把基准值和所有的 n 个元素进行比较，然后将输入规模减半并递归，所以 T(n) = T(n/2) + n。

2.  当规模减半后，新的基准值只和 n/2 个元素进行比较，因此 T(n/2) = T(n/4) + n/2。

3.  以此类推：

T(n/4) = T(n/8) + n/4

…

T(2) = T(1) + 2

T(1) = 1

将上面的公式逐个代入后得到 T(n) = 1 + 2 + … + n/8 + n/4 + n/2 + n = 2×n，所以  O(T(n)) = O(n)。

**空间复杂度**

如果不考虑递归对栈的开销，那么算法并没有使用额外的空间，swap 操作都是直接在数组里完成，因此空间复杂度为 O(1)。

###### 解法 3：数组“组合”

把这两个数组“虚拟”地组合在一起，即它们是分开的，但是在访问它们的元素时，把它们看成是一个数组。那么就能运用快速选择的算法。

**代码实现**

double findMedianArrays(int\[\] nums1, int\[\] nums2) {
    int m = nums1.length;
    int n = nums2.length;

int k = (m + n) / 2;

return (m + n) % 2 == 1 ?
        findKthLargest(nums1, nums2, k + 1) :
        (findKthLargest(nums1, nums2, k) + findKthLargest(nums1, nums2, k + 1)) / 2.0;
}

double findKthLargest(int\[\] nums1, int\[\] nums2, int k) {
    return quickSelect(nums1, nums2, 0, nums1.length + nums2.length - 1, k);
}

double quickSelect(int\[\] nums1, int\[\] nums2, int low, int high, int k) {
    int pivot = low;

// use quick sort's idea
    // put nums that are <= pivot to the left
    // put nums that are  > pivot to the right
    for (int j = low; j < high; j++) {
        if (getNum(nums1, nums2, j) <= getNum(nums1, nums2, high)) {
            swap(nums1, nums2, pivot++, j);
        }
    }
    swap(nums1, nums2, pivot, high);

// count the nums that are > pivot from high
    int count = high - pivot + 1;
    // pivot is the one!
    if (count == k) return getNum(nums1, nums2, pivot);
    // pivot is too small, so it must be on the right
    if (count > k) return quickSelect(nums1, nums2, pivot + 1, high, k);
    // pivot is too big, so it must be on the left
    return quickSelect(nums1, nums2, low, pivot - 1, k - count);
}

int getNum(int\[\] nums1, int\[\] nums2, int index) {
    return (index < nums1.length) ? nums1\[index\] : nums2\[index - nums1.length\];
}

void swap(int\[\] nums1, int\[\] nums2, int i, int j) {
    int m = nums1.length;

if (i < m && j < m) {
        swap(nums1, i, j);
    } else if (i >= m && j >= m) {
        swap(nums2, i - m, j - m);
    } else if (i < m && j >= m) {
        int temp = nums1\[i\];
        nums1\[i\] = nums2\[j - m\];
        nums2\[j - m\] = temp;
    }
}

void swap(int\[\] nums, int i, int j) {
    int temp = nums\[i\];
    nums\[i\] = nums\[j\];
    nums\[j\] = temp;
}

因为这道题的解法与之前讲的快速选择算法非常类似，差别在于将两个数组合在一起考虑。因此大家可以自己分析一下代码。

时间复杂度是 O(m+n)，空间复杂度 O(1)。

###### 扩展二

例题：有一万个服务器，每个服务器上存储了十亿个没有排好序的数，现在要找所有数当中的中位数，怎么找？

对于分布式地大数据处理，应当考虑两个方面的限制：

1.  每台服务器进行算法计算的复杂度限制，包括时间和空间复杂度

2.  服务器与服务器之间进行通信时的网络带宽限制

##### 限制 1：空间复杂度

假设存储的数都是 32 位整型，即 4 个字节，那么 10 亿个数需占用 40 亿字节，大约 4GB

- 归并排序至少得需要 4GB 的内存

- 快速排序的空间复杂度为 log(n)，即大约 30 次堆栈压入

用非递归的方法去实现快速排序，代码如下。

```java
//  每次只需将数组中的某个起始点和终点，即一个范围，压入堆栈中，压入  30  个范围的大小约为  30×2×4=240  字节
class Range {
    public int low;
    public int high;

public Range(int low, int high) {
        this.low = low;
        this.high = high;
    }
}

//  不使用递归写法，压入堆栈的还包括程序中的其他变量等，假设需要  100  字节，总共需要  30×100=3K  字节
void quickSort(int\[\] nums) {
    Stack<Range> stack = new Stack<>();

Range range = new Range(0, nums.length - 1);
    stack.push(range);

while (!stack.isEmpty()) {
        range = stack.pop();

int pivot = partition(nums, range.low, range.high);

if (pivot - 1 > range.low) {
            stack.push(new Range(range.low, pivot - 1));
        }

if (pivot + 1 < range.high) {
            stack.push(new Range(pivot + 1, range.high));
        }
    }
}

//  快速排序对内存的开销非常小
int partition(int\[\] nums, int low, int high) {
    int pivot = randRange(low, high), i = low;
    swap(nums, pivot, high);

for (int j = low; j < high; j++) {
        if (nums\[j\] <= nums\[high\]) {
            swap(nums, i++, j);
        }
    }

swap(nums, i, high);

return i;
}
```

如上，利用一个栈 stack 来记录每次进行快速排序时的范围。一旦发现基准值左边还有未处理完的数，就将左边的范围区间压入到栈里；如果发现基准值右边还有未处理完的数，就将右边的范围区间压入到栈里。其中，处理基准值的 partition 函数非常重要，之前已经介绍过。

###### 限制 2：网络带宽

在实际应用中，这是最重要的考量因素，很多大型的云服务器都是按照流量来进行收费，如何有效地限制流量，避免过多的服务器之间的通信，就是要考量的重点，并且，实际上它与算法的时间复杂度有很大的关系。

**解决方案**

借助扩展一的思路。

1\. 从 1 万 个服务器中选择一个作为主机(master server)。这台主机将扮演主导快速选择算法的角色。![](http://s0.lgstatic.com/i/image2/M01/91/30/CgoB5l2Inp-ADWduAACy1HlNYdU966.png)

2\. 在主机上随机选择一个基准值，然后广播到其他各个服务器上。

![](http://s0.lgstatic.com/i/image2/M01/91/50/CgotOV2InqCADiJBADbDhpQ_g34352.gif)

3\. 每台服务器都必须记录下最后小于、等于或大于基准值数字的数量：less count，equal count，greater count。

![](http://s0.lgstatic.com/i/image2/M01/91/50/CgotOV2InqOAW68SAEJNyDb5D5o855.gif)

4\. 每台服务器将 less count，equal count 以及 greater count 发送回主机。

5\. 主机统计所有的 less count，equal count 以及 greater count，得出所有比基准值小的数的总和 total less count，等于基准值的总和 total equal count，以及大于基准值的总和 total greater count。进行如下判断。

1.  如果 total less count >= total count / 2，表明基准值太大。

2.  如果 total less count + total equal count >= total count / 2，表明基准值即为所求结果。

3.  否则，total less count + total equal count < total count / 2 表明基准值太小。

6\. 后面两种情况，主机会把新的基准值广播给各个服务器，服务器根据新的基准值的大小判断往左半边或者右半边继续进行快速选择。直到最后找到中位数。

**时间复杂度**

整体的时间复杂度是 O(nlog(n))，主机和各个其他服务器之间的通信总共也需要 nlog(n)次，每次通信需要传递一个基准值以及三个计数值。

如果用一些组播网络(Multicast Network)，可以有效地节省更多的带宽。

## 高频真题解析-2

这节课继续学习另外三种高频题：

- 合并区间和无重叠区间
- 火星字典
- 基本计算器

### 例题分析一

LeetCode 第 56 题：给出一个区间的集合，请合并所有重叠的区间。

**示例 1**

输入: \[\[1,3\], \[2,6\], \[8,10\], \[15,18\]\]

输出: \[\[1,6\], \[8,10\], \[15,18\]\]

解释: 区间 \[1,3\] 和 \[2,6\] 重叠，将它们合并为 \[1,6\]。

**示例 2**

输入: \[\[1,4\], \[4,5\]\]

输出: \[\[1,5\]\]

解释: 区间 \[1,4\] 和 \[4,5\] 可被视为重叠区间。

###### 解题思路：贪婪法

在分析一些比较复杂的问题时，可以从比较简单的情况着手来寻找突破口，先来看看两个区间会出现多少种情况。

假设有区间 a 和 b，区间 a 的起始时间要早于 b 的起始时间。那么它们之间有如下 3 种可能会出现的情况。

![](http://s0.lgstatic.com/i/image2/M01/91/1B/CgotOV2IeoeAXmexAABQeDb1BWQ016.png)

1.  情况一：两个区间没有任何重叠的部分，因此区间不会发生融合。

2.  情况二和三：区间有重叠。

3.  新区间的起始时间是 a 的起始时间，这个不变；

4.  新区间的终止时间是 a 的终止时间和 b 的终止时间的最大值，这个就是融合两个区间的最基本的思想。

给定了 n 个区间，如何有效地融合它们呢？以下是一种很直观也是非常有效的做法。 ![](http://s0.lgstatic.com/i/image2/M01/91/1B/CgotOV2IeomAZY5oAFqba-5PZJc045.gif)

1.  先将所有的区间按照起始时间的先后顺序排序，从头到尾扫描一遍

2.  定义两个变量 previous 和 current，分别表示前一个区间和当前的区间

3.  如果没有融合，那么当前区间就变成了新的前一个区间，下一个区间成为新的当前区间

4.  如果发生了融合，更新前一个区间的结束时间。

这个就是贪婪算法。

**代码实现**

int\[\]\[\] merge(int\[\]\[\] intervals) {
    //  将所有的区间按照起始时间的先后顺序排序
    Arrays.sort(intervals, (i1, i2) -> Integer.compare(i1\[0\], i2\[0\]));

//  定义一个  previous  变量，初始化为  null
    int\[\] previous = null;
    //  定义一个  result  变量，用来保存最终的区间结果
    List<int\[\]> result = new ArrayList<>();

//  从头开始遍历给定的所有区间
    for (int\[\] current : intervals) {
        //  如果这是第一个区间，或者当前区间和前一个区间没有重叠，那么将当前区间加入到结果中
        if (previous == null || current\[0\] > previous\[1\]) {
            result.add(previous = current);
        } else { //  否则，两个区间发生了重叠，更新前一个区间的结束时间
            prev\[1\] = Math.max(previous\[1\], current\[1\]);
        }
    }

return result.toArray(new int\[result.size()\]\[\]);
 }

### 算法分析

时间复杂度 O(nlog(n))，因为一开始要对数组进行排序。

空间复杂度为 O(n)，因为用了一个额外的 result 数组来保存结果。

注意：和区间相关的问题，有非常多的变化，融合区间可以说是最基本也是最常考的一个。

###### 例题分析二

LeetCode 第 435 题：给定一个区间的集合，找到需要移除区间的最小数量，使剩余区间互不重叠。

注意:

1.  可以认为区间的终点总是大于它的起点。

2.  区间 \[1,2\] 和 \[2,3\] 的边界相互“接触”，但没有相互重叠。

**示例 1**

输入: \[ \[1,2\], \[2,3\], \[3,4\], \[1,3\] \]

输出: 1

**解释**: 移除 \[1,3\] 后，剩下的区间没有重叠。

**示例 2**

输入: \[ \[1,2\], \[1,2\], \[1,2\] \]

输出: 2

**解释**: 你需要移除两个 \[1,2\] 来使剩下的区间没有重叠。

**示例 3**

输入: \[ \[1,2\], \[2,3\] \]

输出: 0

**解释**: 你不需要移除任何区间，因为它们已经是无重叠的了。

### 解题思路一： 暴力法

这道题是上一道题的一种变形，暴力法就是将各个区间按照起始时间的先后顺序排序，然后找出所有的组合，最后对每种组合分别判断各个区间有没有互相重叠。

### 算法分析

1.  排序需要 O(nlog(n)) 的时间复杂度。

2.  找出所有组合，按照前一节课里提到的从一个字符串里找出所有子序列的组合个数的方法，取出 n 个区间，有 Cnn 种，算上空的集合，那么一共有  Cn0 + Cn1 + Cn2 + … Cnn = 2n。

3.  对每种组合进行判断是否重叠，k 个区间，需要 O(k) 的时间复杂度。

4.  总体时间复杂度为  Cn0 x 0 + Cn1×1 + Cn2×2 + … + Cnk \* k + … + Cnn×n = n×2n-1。

由于 n×2n-1 已经远大于 nlog(n)，所以排序的时间复杂度就可以忽略不计，整体的时间复杂度就是 O(n×2n)。

建议：一定要记一些常见的时间复杂度计算公式，对于在面试中能准确快速地分析复杂度是非常有帮助的。

###### 解题思路二：另一种暴力法

对于暴力法，还有另外的分析方法。用两个变量 prev 和 curr 分别表示前一个区间和当前区间。

1.  如果当前区间和前一个区间没有发生重叠，则尝试保留当前区间，表明此处不需要删除操作。

2.  题目要求最少的删除个数，只有在这样的情况下，才不需要做任何删除操作。

3.  在这种情况下，虽然两个区间没有重叠，但是也要考虑尝试删除当前区间的情况。

4.  对比哪种情况所需要删除的区间最少。

举例：有如下的几个区间 A、B、C，其中 A 是前一个区间，B 是当前区间，A 和 B 没有重叠。

![](http://s0.lgstatic.com/i/image2/M01/90/FB/CgoB5l2IeomAJypIAAA1_CqUqGA909.png)

1.  如果只考虑保留 B 的情况，而不考虑把 B 删除的情况，那么就会错过一个答案，因为在这个情况下，把 B 删除，只剩下 A 和 C，它们互不重叠，也能得到最优的解。

2.  遇到 A 和 B 相互重叠的情况时，必须要考虑把 B 删除掉。

![](http://s0.lgstatic.com/i/image2/M01/91/1B/CgotOV2IeomAasCyABO9nAPnBLM742.gif)

为什么不把 A 删除呢？因为如果把 A 删了，B 和 C 还是可能会重叠，则需要删除掉更多的区间，不满足题目要求。

![](http://s0.lgstatic.com/i/image2/M01/90/FB/CgoB5l2IeoqAMYGUAB4TTFLJ7aA153.gif)

### 代码实现

//  在主体函数里，先将区间按照起始时间的先后顺序排序，然后调用递归函数
int eraseOverlapIntervals(int\[\]\[\] intervals) {
    Arrays.sort(intervals, (i1, i2) -> Integer.compare(i1\[0\], i2\[0\]));
    return eraseOverlapIntervals(-1, 0, intervals);
}

//  递归函数里，先检查是否已经处理完所有的区间，是，表明不需要删除操作，直接返回
int eraseOverlapIntervals(int prev, int curr, int\[\]\[\] intervals) {
    if (curr == intervals.length) {
        return 0;
    }

int taken = Integer.MAX_VALUE, nottaken;

if (prev == -1 || intervals\[prev\]\[1\] <= intervals\[curr\]\[0\]) {
        //  只有当 prev, curr 没有发生重叠的时候，才可以选择保留当前的区间 curr
        taken = eraseOverlapIntervals(curr, curr + 1, intervals);
    }

//  其他情况，可以考虑删除掉 curr 区间，看看删除了它之后会不会产生最好的结果
    nottaken = eraseOverlapIntervals(prev, curr + 1, intervals) + 1;

return Math.min(taken, nottaken);

}

###### 解题思路二：贪婪法

### 按照起始时间排序

**举例**：有四个区间 A，B，C，D，A 跨度很大，B 和 C 重叠，C 和 D 重叠，而 B 和 D 不重叠。

**解法**：要尽可能少得删除区间，那么当遇到了重叠的时候，应该把区间跨度大，即结束比较晚的那个区间删除。因为如果不删除它，它会和剩下的其他区间发生重叠的可能性非常大。

当发现 A 和 B 重叠，如果不删除 A，就得牺牲 B，C，D，而正确的答案是只需要删除 A 和 C 即可。

按照上述思想求解，实现过程如下。

1\. A 和 B 重叠，由于 A 结束得比较晚，此时删除区间 A，保留区间 B。

![](http://s0.lgstatic.com/i/image2/M01/90/FB/CgoB5l2IeouALsHDACoIa6RqiFk139.gif)

2\. B 和 C 重叠，由于 C 结束得晚，把区间 C 删除，保留区间 B。

![](http://s0.lgstatic.com/i/image2/M01/91/1B/CgotOV2IeouAVgkTACrf8XPAR8o811.gif)

3\. B 和 D 不重叠，结束，一共只删除了 2 个区间。

![](http://s0.lgstatic.com/i/image2/M01/90/FB/CgoB5l2IeoyAS7VEABGI5Z_ovpM719.gif)

**代码实现**

int eraseOverlapIntervals(int\[\]\[\] intervals) {
    if (intervals.length == 0) return 0;

//  将所有区间按照起始时间排序
    Arrays.sort(intervals, (i1, i2) -> Integer.compare(i1\[0\], i2\[0\]));

//  用一个变量  end  记录当前的最小结束时间点，以及一个  count  变量记录到目前为止删除掉了多少区间
    int end = intervals\[0\]\[1\], count = 0;

//  从第二个区间开始，判断一下当前区间和前一个区间的结束时间
    for (int i = 1; i < intervals.length; i++) {
        //  当前区间和前一个区间有重叠，即当前区间的起始时间小于上一个区间的结束时间，end 记录下两个结束时间的最小值，把结束时间晚的区间删除，计数加 1。
        if (intervals\[i\]\[0\] < end) {
            end = Math.min(end, intervals\[i\]\[1\]);
            count++;
        } else {
            end = intervals\[i\]\[1\];
        }
    }

//  如果没有发生重叠，根据贪婪法，更新  end  变量为当前区间的结束时间
    return count;

}

### 按照结束时间排序

**题目演变**：在给定的区间中，最多有多少个区间相互之间是没有重叠的？

思路：假如求出了最多有 m 个区间是互相之间没有重叠的，则最少需要将 n−m 个区间删除才行。即，删掉“害群之马”，则剩下的就不会互相冲突了。

为什么按照结束时间排序会有助于我们统计出没有重叠的区间最大个数呢？举例说明如下。

假设今天有很多活动要举行，每个活动都有固定的时间，选择哪些活动，才能使参加的活动最多，然后在时间上不会互相重叠呢？

如果我们按照活动的起始时间去挑选，某个活动虽然开始得早，但是很有可能会持续一整天，就没有时间去参加其他活动了。如果按照活动的结束时间选，先挑那些最早结束的，就会尽可能节省出更多的时间来参加更多的活动。

根据这个思路，这道题也可以按照结束时间排序处理，于是，区间的顺序就是 {B, C, D, A}。

![](http://s0.lgstatic.com/i/image2/M01/91/1B/CgotOV2IeoyAMCcNAABEWLc4h90512.png)

实现：目标就是统计有多少个没有重叠的情况发生。若当前的区间和前一个区间没有重叠的时候，计数器加 1，同时，用当前的区间去和下一个区间比较。

**代码实现**

int eraseOverlapIntervals(int\[\]\[\] intervals) {
    if (intervals.length == 0) return 0;

//  按照结束时间将所有区间进行排序
    Arrays.sort(intervals, (i1, i2) -> Integer.compare(i1\[1\], i2\[1\]));

//  定义一个变量  end  用来记录当前的结束时间，count  变量用来记录有多少个没有重叠的区间
    int end = intervals\[0\]\[1\], count = 1;

//  从第二个区间开始遍历剩下的区间
    for (int i = 1; i < intervals.length; i++) {
        //  当前区间和前一个结束时间没有重叠，那么计数加  1，同时更新一下新的结束时间
        if (intervals\[i\]\[0\] >= end) {
            end = intervals\[i\]\[1\];
            count++;
        }
    }

//  用总区间的个数减去没有重叠的区间个数，即为最少要删除掉的区间个数
    return intervals.length - count;
}

关于区间的问题，LeetCode 上还有很多类似的题目，大家一定要去做做。

### 例题分析三

LeetCode   第 269 题，火星字典：现有一种使用字母的全新语言，这门语言的字母顺序与英语顺序不同。假设，您并不知道其中字母之间的先后顺序。但是，会收到词典中获得一个不为空的单词列表。因为是从词典中获得的，所以该单词列表内的单词已经按这门新语言的字母顺序进行了排序。您需要根据这个输入的列表，还原出此语言中已知的字母顺序。

**示例 1**

输入:

\[ "wrt", "wrf","er","ett", "rftt"\]

输出: "wertf"

**示例 2**

输入:

\[ "z", "x"\]

输出: "zx"

**示例 3**

输入:

\[ "z",  "x","z"\]

输出: ""

解释: 此顺序是非法的，因此返回 ""。

### 解题思路

首先，确定字符串排序方法。

理解题意，关键是搞清楚给定的输入字符串是怎么排序的？

举例：假如我们有这些单词 bar，bat，algorithm，cook，cog，那么按照字符顺序，应该怎么排呢？

正确的排序应该是：algorithm bat bar cog cook。

解法：

- 逐位地比较两个相邻的字符串

- 第一个字母出现的顺序越早，排位越靠前

- 第一个字母相同时，比较第二字母，以此类推

注意：两个字符串某个相同的位置出现了不同，就立即能得出它们的顺序，无需继续比较字符串剩余字母。

### **求解示例 1**

输入是：

wrt
wrf
er
ett
rftt

解法：

1\. 比较以 w 开头的字符串，它们是 wrt 和 wrf，之所以 wrt 会排在 wrf 之前，是因为 t 比 f 在火星字典里出现的顺序要早。此时将这两个字母的关系表达为 t -> f。

![](http://s0.lgstatic.com/i/image2/M01/91/1B/CgotOV2Ieo2AUKzRAB96MtWjhn0834.gif)

2\. 比较 wrf 和 er，第一个字母开始不同，因此，得出 w 排在 e 之前，记为 w -> e。

![](http://s0.lgstatic.com/i/image2/M01/90/FB/CgoB5l2Ieo2AHp2gABsjRhdqs-o833.gif)

3\. 比较 er 和 ett，从第二个字母开始不一样，因此，得出 r 排在 t 之前，记为 r -> t。

![](http://s0.lgstatic.com/i/image2/M01/91/1B/CgotOV2Ieo6AGzbmABkoJlXVd6Q543.gif)

4\. 比较 ett 和 rftt，从第一个字母开始不一样，得出 e 排在 r 之前，记为 e -> r。

![](http://s0.lgstatic.com/i/image2/M01/90/FB/CgoB5l2Ieo-AQsABACwHvWpfLUM265.gif)

梳理上述关系，得 t -> f，w -> e，r -> t，e -> r

拓扑排序得到正确顺序：将每个字母看成是图里的顶点，它们之间的关系就好比是连接顶点与顶点的变，而且是有向边，所以这个图是一个有向图。最后对这个有向图进行拓扑排序，就可以得出最终的结果。 ![](http://s0.lgstatic.com/i/image2/M01/91/1B/CgotOV2Ieo-AL2rOAAA-SDWivvo697.png)

**代码实现**

包括两大步骤，第一步是根据输入构建一个有向图；第二步是对这个有向图进行拓扑排序。

```java
//  基本情况处理，比如输入为空，或者输入的字符串只有一个
String alienOrder(String\[\] words) {
    if (words == null || words.length == 0)
        return null;
    if (words.length == 1) {
        return words\[0\];
    }

//  构建有向图：定义一个邻接链表  adjList，也可以用邻接矩阵
    Map<Character, List<Character>> adjList = new HashMap<>();

for (int i = 0; i < words.length - 1; i++) {
        String w1 = words\[i\], w2 = words\[i + 1\];
        int n1 = w1.length(), n2 = w2.length();

boolean found = false;

for (int j = 0; j < Math.max(w1.length(), w2.length()); j++) {
            Character c1 = j < n1 ? w1.charAt(j) : null;
            Character c2 = j < n2 ? w2.charAt(j) : null;

if (c1 != null && !adjList.containsKey(c1)) {
                adjList.put(c1, new ArrayList<Character>());
            }

if (c2 != null && !adjList.containsKey(c2)) {
                adjList.put(c2, new ArrayList<Character>());
            }

if (c1 != null && c2 != null && c1 != c2 && !found) {
                adjList.get(c1).add(c2);
                found = true;
            }
        }
    }

Set<Character> visited = new HashSet<>();
    Set<Character> loop = new HashSet<>();
    Stack<Character> stack = new Stack<Character>();

for (Character key : adjList.keySet()) {
        if (!visited.contains(key)) {
            if (!topologicalSort(adjList, key, visited, loop, stack)) {
                return "";
            }
        }
    }

StringBuilder sb = new StringBuilder();

while (!stack.isEmpty()) {
        sb.append(stack.pop());
    }

return sb.toString()；

}

//  将当前节点  u  加入到  visited  集合以及  loop  集合中。
boolean topologicalSort(Map<Character, List<Character>> adjList, char u,
                        Set<Character> visited, Set<Character> loop, Stack<Character> stack) {
    visited.add(u);
    loop.add(u);

if (adjList.containsKey(u)) {
        for (int i = 0; i < adjList.get(u).size(); i++) {
            char v = adjList.get(u).get(i);

if (loop.contains(v))
                return false;

if (!visited.contains(v)) {
                if (!topologicalSort(adjList, v, visited, loop, stack)) {
                    return false;
                }
            }
        }
    }

loop.remove(u);

stack.push(u);

return true;
}
```

```js
var alienOrder = function(words) {
  if (words.length === 0) {
    return '';
  }

  const len = words.length;
  let map = {}; // value is the prerequisite of key
  let charPreReqCount = {};
  let i;
  let queue = [];
  let result = [];
  let hasCycle = false;

  for (i = 0; i < len; i++) {
    const chars = words[i].split('');

    let j = 0;

    for (j = 0; j < chars.length; j++) {
      if (!map[chars[j]]) {
        map[chars[j]] = [];
        charPreReqCount[chars[j]] = 0;
      }
    }

    if (i === 0 || words[i] === words[i - 1]) {
      continue;
    }

    const cur = words[i];
    const prev = words[i - 1];
    j = 0;

    while (j < cur.length && j < prev.length && cur.charAt(j) === prev.charAt(j)) {
      j++;
    }

    if (j < prev.length && map[prev.charAt(j)].indexOf(cur.charAt(j)) === -1) {
      map[prev.charAt(j)].push(cur.charAt(j));

      charPreReqCount[cur.charAt(j)]++;
    }
  }

  Object.keys(charPreReqCount).forEach(char => {
    if (charPreReqCount[char] === 0) {
      queue.push(char);
    }
  });

  while (queue.length > 0) {
    const char = queue.shift();

    result.push(char);

    for (i = 0; i < map[char].length; i++) {
      charPreReqCount[map[char][i]]--;

      if (charPreReqCount[map[char][i]] === 0) {
        queue.push(map[char][i]);
      }
    }
  }

  // detect cycle
  Object.keys(charPreReqCount).forEach(function(char) {
    if (charPreReqCount[char] !== 0) {
      hasCycle = true;
    }
  });

  return hasCycle ? '' : result.join('');
};
```

用深度优先的方法进行拓扑排序，一定要借用下面三者。

1.  visited 集合，用来记录哪些顶点已经被访问过。

2.  stack 堆栈，从某个顶点出发，访问完了所有其他顶点，最后才把当前的这个顶点加入到堆栈里。即，若要该点加入到 stack 里，必须先把跟它有联系的顶点都处理完。举例说明，如果我要学习课程 A，得先把课程 B，C 以及 D 都看完。

3.  loop 集合，为了有效防止有向图里出现环的情况。举例说明如下。

假如我们有这么一个有向图。

![](http://s0.lgstatic.com/i/image2/M01/90/FB/CgoB5l2Ieo-AfXiGAB41ZU6ORu4144.gif)

- 从 A 开始对这个图进行深度优先的遍历，那么当访问到顶点 D 的时候，visited 集合以及 loop 集合都是 {A, B, C, D}。

- 当从 D 继续遍历到 B 的时候，发现 B 已经在 loop 集合里。

- 因此得出结论，在这一轮遍历中，出现了环。

为什么不能单单用 visited 集合来帮助判断呢？例如下面情况。

![](http://s0.lgstatic.com/i/image2/M01/91/1B/CgotOV2IepCADkCaAAA9qnc1K_8002.png)

- 从 D 访问 B 的时候，如果判断因为 B 已经被访问过了，于是得出这里就有一个环，显然判断错误。

- 当每一轮访问结束后，都必须要把 loop 集合清空，才能把其他顶点也加入到堆栈里。

- 否则，当 D 遇到 B 的时候，也会认为这里有环出现，而提前终止程序，无法将它加入到堆栈中。

###### 例题分析四

LeetCode 第 772 题，基本计算器：实现一个基本的计算器来计算简单的表达式字符串。

说明：

- 表达式字符串可以包含左括号 ( 和右括号 )，加号 + 和减号 -，非负整数和空格。

- 表达式字符串只包含非负整数， +  -  \*  / 操作符，左括号 ( ，右括号 ) 和空格。整数除法需要向下截断。

**示例 1**：

"1 + 1" = 2

" 6-4 / 2 " = 4

"2×(5+5×2)/3+(6/2+8)" = 21

"(2+6×3+5- (3×14/7+2)×5)+3" = -12

###### 解题思路一：只有加号

例题：若表达式里只有数字和加法符号，没有减法，也没有空格，并且输入的表达式一定合法，那么应该如何处理？例如：1+2+10。

解法：一旦遇到了数字就不断地相加。

### 代码实现

//  转换，将字符串的字符放入到一个优先队列中
int calculate(String s) {
    Queue<Character> queue = new LinkedList<>();
    for (char c : s.toCharArray()) {
        queue.offer(c);
    }

//  定义两个变量，num  用来表示当前的数字，sum  用来记录最后的和
    int num = 0, sum = 0;

//  遍历优先队列，从队列中一个一个取出字符
    while (!queue.isEmpty()) {
        char c = queue.poll();

//  如果当前字符是数字，那么就更新  num  变量，如果遇到了加号，就把当前的  num  加入到  sum  里，num  清零
        if (Character.isDigit(c)) {
            num = 10 \* num + c - '0';
        } else {
            sum += num;
            num = 0;
        }
    }

sum += num; //  最后没有加号，再加一次

return sum;

}

### 代码扩展一

如上，在返回 sum 之前，我们还进行了一次额外的操作：sum += num，就是为了要处理结束时的特殊情况。若在表达式的最后添加上一个”+”，也能实现同样的效果，代码实现如下。

```java
int calculate(String s) {
    Queue<Character> queue = new LinkedList<>();
    for (char c : s.toCharArray()) {
        queue.offer(c);
    }
    queue.add('+'); //  在末尾添加一个加号

while (!queue.isEmpty()) {
        ...
    }

return sum;
}

```

如上，在优先队列的最后添加一个加号。

### 代码扩展二

若输入的时候允许空格，如何处理？代码实现如下。

```java
int calculate(String s) {
//     ...
    for (char c : s.toCharArray()) {
        if (c != ' ') queue.offer(c);
    }
//     ...
}
```

如上，在添加到优先队列的时候，过滤到那些空格就好了。

###### 解题思路二：引入减号

例题：若表达式支持减法，应该怎么处理？例如：1 + 2 - 10。

解法 1：借助两个 stack，一个 stack 专门用来放数字；一个 stack 专门用来放符号。

解法 2：将表达式看作 1 + 2 + (-10)，把 -10 看成一个整体，同时，利用一个变量 sign 来表示该数字前的符号，这样即可沿用解法。

解法 2 的具体操作如下。 ![](http://s0.lgstatic.com/i/image2/M01/91/1B/CgotOV2IepKAGgQSAIKuyG7w9pk329.gif)

### 代码实现

```java
int calculate(String s) {
    Queue<Character> queue = new LinkedList<>();
    for (char c : s.toCharArray()) {
        if (c != ' ') queue.offer(c);
    }
    queue.add('+');

char sign = '+'; //  添加一个符号标志变量

int num = 0, sum = 0;

while (!queue.isEmpty()) {
        char c = queue.poll();

if (Character.isDigit(c)) {
            num = 10 \* num + c - '0';
        } else {
            //  遇到了符号，表明我们要开始统计一下当前的结果了
            if (sign == '+') { //数字的符号是  +
                sum += num;
            } else if (sign == '-') { //  数字的符号是  -
                sum -= num;
            }

num = 0;
            sign = c;
        }
    }

return sum;
}
```

###### 解题思路三：引入乘除

例题：若引入乘法和除法，如何处理？举个例子：1 + 2 x 10。

解法：要考虑符号的优先级问题，不能再简单得对 sum 进行单向的操作。当遇到乘号的时候：sum = 1，num = 2，而乘法的优先级比较高，得先处理 2 x 10 才能加 1。对此，就把它们暂时记录下来，具体操作如下。 ![](http://s0.lgstatic.com/i/image2/M01/90/FB/CgoB5l2IepSAeUhVAFLy8rXwn-M290.gif)

### 代码实现

```java
int calculate(String s) {
    Queue<Character> queue = new LinkedList<>();
    for (char c : s.toCharArray()) {
        if (c != ' ') queue.offer(c);
    }
    queue.add('+');

char sign = '+';
    int num = 0;

//  定义一个新的变量  stack，用来记录要被处理的数
    Stack<Integer> stack = new Stack<>();

while (!queue.isEmpty()) {
        char c = queue.poll();

if (Character.isDigit(c)) {
            num = 10 \* num + c - '0';
        } else {
            if (sign == '+') {
                stack.push(num); //  遇到加号，把当前的数压入到堆栈中
            } else if (sign == '-') {
                stack.push(-num); //  减号，把当前数的相反数压入到堆栈中
            } else if (sign == '\*') {
                stack.push(stack.pop() \* num); //  乘号，把前一个数从堆栈中取出，然后和当前的数相乘，再放回堆栈
            } else if (sign == '/') {
                stack.push(stack.pop() / num); //  除号，把前一个数从堆栈中取出，然后除以当前的数，再把结果放回堆栈
            }

num = 0;
            sign = c;
        }
    }

int sum = 0;

//  堆栈里存储的都是各个需要相加起来的结果，把它们加起来，返回总和即可
    while (!stack.isEmpty()) {
        sum += stack.pop();
    }
    return sum;

}
```

###### 解题思路四：引入小括号

例题：如何支持小括号？

解法：小括号里的表达式优先计算。

1.  先利用上面的方法计算小括号里面的表达式。

2.  当遇到一个左括号的时候，可以递归地处理；当遇到了右括号，表明小括号里面的处理完毕，递归应该返回。

### 代码实现

```java
//  在主函数里调用一个递归函数
int calculate(String s) {
    Queue<Character> queue = new LinkedList<>();
    for (char c : s.toCharArray()) {
        if (c != ' ') queue.offer(c);
    }
    queue.offer('+');

return calculate(queue);
}

int calculate(Queue<Character> queue) {
    char sign = '+';
    int num = 0;

Stack<Integer> stack = new Stack<>();

while (!queue.isEmpty()) {
        char c = queue.poll();

if (Character.isDigit(c)) {
            num = 10 \* num + c - '0';
        }
        //  遇到一个左括号，开始递归调用，求得括号里的计算结果，将它赋给当前的  num
        else if (c == '(') {
            num = calculate(queue);
        }
        else {
            if (sign == '+') {
                stack.push(num);
            } else if (sign == '-') {
                stack.push(-num);
            } else if (sign == '\*') {
                stack.push(stack.pop() \* num);
            } else if (sign == '/') {
                stack.push(stack.pop() / num);
            }

num = 0;
            sign = c;

//  遇到右括号，就可以结束循环，直接返回当前的总和
            if (c == ')') {
                break;
            }
        }
    }

int sum = 0;
    while (!stack.isEmpty()) {
        sum += stack.pop();
    }
    return sum;

}

```

## 高频真题解析-3

这节课将分析三道比较难的题目，希望能帮助大家拓宽解题的思路。主要内容包括：

- 正则表达式匹配
- 柱状图中的最大矩形
- 实现 strStr() 函数

###### 例题分析一

LeetCode 第 10 题，正则表达式匹配：给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '.' 和 '\*' 的正则表达式匹配。

- '.' 匹配任意单个字符

- '\*' 匹配零个或多个前面的那一个元素

注意：所谓匹配，是要涵盖整个字符串 s 的，而不是部分字符串。

说明：

- s 可能为空，且只包含从 a-z 的小写字母。

- p 可能为空，且只包含从 a-z 的小写字母，以及字符 . 和 \*。

**示例 1**

输入:

s = "aa"

p = "a"

输出: false

解释: "a" 无法匹配 "aa" 整个字符串。

**示例 2**

输入:

s = "aa"

p = "a\*"

输出: true

解释: 因为 '\*' 代表可以匹配零个或多个前面的那一个元素, 在这里前面的元素就是 'a'。因此，字符串 "aa" 可被视为 'a' 重复了一次。

**示例 3**

输入:

s = "ab"

p = ".\*"

输出: true

解释: ".\*" 表示可匹配零个或多个('\*')任意字符('.')。

**示例 4**

输入:

s = "aab"

p = "c\*a\*b"

输出: true

解释: 因为 '\*' 表示零个或多个，这里 'c' 为 0 个, 'a' 被重复一次。因此可以匹配字符串 "aab"。

**示例 5**

输入:

s = "mississippi"

p = "mis\*is\*p\*."

输出: false

解释：'p'与'i'无法匹配。

###### 解题思路

不要害怕，这道题只要求实现正则表达式里的两个小功能。

### 判断 s 和 p 匹配

举例：给定两个字符串 s 和 p，判断 s 和 p 是否匹配。

解法：s 和 p 必须要相等。定义两个指针 i 和 j，分别指向 s 和 p 的第一个字符，然后逐个去比较，一旦发现不相等，就立即知道 s 和 p 不匹配。

![](http://s0.lgstatic.com/i/image2/M01/91/1C/CgotOV2Ie1iAL3rjAFNmGn6rmB8556.gif)

此时，假设 s 字符串的长度为 m，p 字符串的长度为 n，s 和 p 匹配的条件就是 s 和 p 从头到尾一直匹配，即 i == m 同时 j == n 是 s 和 p 匹配的唯一条件。

### 点匹配符 '.'

'.' 匹配任意单个字符，首先要明确的是，它是一一对应关系，和 '\*' 匹配符不一样。举例说明如下。

输入:

s = "leetcode"

p = "l..tc..e"

输出: true

因为 '.' 可以匹配任何字符，即，一旦遇上了 '.' 匹配符，可以让 i 指针和 j 指针同时跳到下一个位置。

![](http://s0.lgstatic.com/i/image2/M01/90/FC/CgoB5l2Ie1mAHiTeAFyyE_vrAho862.gif)

**星匹配符  '\*' **

'\*' 匹配符较难，先要理解这个星匹配符的定义。题目“ '\*' 匹配零个或多个前面的那一个元素”中包含三个重要的信息：

1.  它匹配的是 p 字符串中，该 '\*' 前面的那个字符。

2.  它可以匹配零个或多个。

3.  '\*' 匹配符前面必须有一个非星的字符。

因此，在分析 '\*' 匹配符的时候，一定要把 '\*' 以及它前面的一个字符看作为一个整体， '\*' 不能单独作为一个个体来看(例如点匹配符)。例如，p 字符串是 a \*，则把 (a\*) 当作一个整体来看。

![](http://s0.lgstatic.com/i/image2/M01/91/1C/CgotOV2Ie1qAJ0yjABmVlo21Z_k078.gif)

对 p 字符串说明如下。

![](http://s0.lgstatic.com/i/image2/M01/90/FC/CgoB5l2Ie1uAfvGOAFXqP1fgpyo624.gif)

- p 可以表示空字符串，因为 '\*' 可以匹配 0 个前面的字符，即当有 0 个 a 的时候，为空字符串。

- a\* 还能匹配一个 a，两个 a，三个 a，一直到无穷个 a。

- 当 p 等于 '.\*' 的时候，可以表示一个空字符串，也可以表示一个点，两个点，三个点，一直到无穷个点。即它可以表示任何长度的一段字符串，包括空串。

### 举例说明

输入：

s = "aaabcd"

p = "ac\*a\*b.."

1\. 用两个指针 i 和 j 分别指向 s 和 p 的开头。

![](http://s0.lgstatic.com/i/image2/M01/91/1C/CgotOV2Ie1uAWy3YACOzTjqASVU474.gif)

2\. 在 p 字符串里，a 的下一个字符是 c，不是 '\*'，比较 s\[i\] 和 p\[j\]。因为它们都是字符 a，所以这个位置匹配正确，i 和 j 同时指向下一个。此时 j 的下一个字符是 '\*'，要将 c\* 当作一个整体去看待。 ![](http://s0.lgstatic.com/i/image2/M01/90/FC/CgoB5l2Ie1uAQkfIAD7sMK4b0q0916.gif)

3\. 将 c\* 看成是空字符，p 如下所示。

![](http://s0.lgstatic.com/i/image2/M01/91/1C/CgotOV2Ie1yATZ7aACaSPwysGtw610.gif)

4\. 若匹配中不一致即 c\* 不能当作空字符串，则当作一个 c 字符，此时 p 如下。

![](http://s0.lgstatic.com/i/image2/M01/91/1C/CgotOV2Ie1yAYdqYACtak4duJdY791.gif)

5\. 若不行，则看作两个 c。

以此类推，应用了回溯的思想。

对于将 c\* 作为空字符串的情况。每一次，都要看看当前 j 指向的字符的下一个是不是 '\*'。如果是 '\*'，就要作为整体考虑。很明显，a 的下一个字符是 '\*'。

![](http://s0.lgstatic.com/i/image2/M01/90/FC/CgoB5l2Ie12AJf14ACHySIotppY330.gif)

同样，先将 a\* 作为空字符串看待。此时，a != b，两个字符串不匹配，因此回溯.现在将 a\* 看成是一个 a，此时 a = a，两个位置的字符匹配。

![](http://s0.lgstatic.com/i/image2/M01/91/1C/CgotOV2Ie16AEWe2AGU2311QM54850.gif)

j 的下一个字符不是 '\*'，而是点号，比较 s\[i\] 和 p\[j\]，发现 a != b。于是再次回溯，将 a\* 看成是两个 a，回到刚才的位置。

![](http://s0.lgstatic.com/i/image2/M01/90/FC/CgoB5l2Ie1-AAfhyAMUVWpoQPio071.gif)

最后遇到了两个点号，由于点号可以匹配任何字符，因此可以直接忽略。i 和 j 同时往前一步，再次遇到了点号。i 和 j 继续往前一步。

![](http://s0.lgstatic.com/i/image2/M01/91/1C/CgotOV2Ie1-AAKtMAGRVK2beFJI055.gif)

此时，i 和 j 都已经同时结束了各自的遍历，表明 s 和 p 是匹配的。

提示：重点是把这种回溯的思想掌握好。对于这道题，可以采用递归的写法，也可以采用动态规划的写法。

###### 递归法一

一开始，用两个指针 i 和 j 分别指向字符串 s 和 p 的第一个字符，当我们发现它们指向的字符相同时，我们同时往前一步移动指针 i 和 j。

接下来重复进行相同的操作，即，若将函数定义为 isMatch(String s, int i, String p, int j) 的话，通过传递 i 和 j，就能实现重复利用匹配逻辑的效果。

当遇到点匹配符的时候，方法类似。

来看看当遇到星匹配符的情况，举例说明如下。要不断地用 a\* 去表示一个空字符串，一个 a，两个 a，一直到多个 a……

![](http://s0.lgstatic.com/i/image2/M01/90/FC/CgoB5l2Ie1-AJzGVAACAxM7kNrk693.png)

当 a\* 表示空字符串的时候，i 和 j 应该如何调整呢？此时 i 保持不变，j+2，递归调用函数的时候，变成 isMatch(s, i, p, j + 2)。

![](http://s0.lgstatic.com/i/image2/M01/91/1C/CgotOV2Ie2CAAZ6aAEk53IJKbK4406.gif)

此时，指向的字符和 j 指向的字符不匹配，于是回溯，回到原来的位置。11:57

用 a\* 去表示一个 a，i 指向的字符与 a 匹配，那么 i+1。指针 j，已经完成了用 a\* 去表示一个 a 的任务，接下来要指向 b，调用的时候应该是 isMatch(s, i + 1, p, j + 2)。

![](http://s0.lgstatic.com/i/image2/M01/90/FC/CgoB5l2Ie2CARkM9AD_zVAmy1eI036.gif)

i 指向的字符和 j 指向的字符不匹配，又进行回溯，但是不用回到最开始的位置。已知用 a\* 去表示空字符串不行，表示一个 a 也不行，那么尝试两个 a 字符，于是，i 再往前一步，用 a\* 去匹配两个 a，i 就到了 b 的位置上，调用的时候就是 isMatch(s, i + 2, p, j + 2)。

![](http://s0.lgstatic.com/i/image2/M01/91/1C/CgotOV2Ie2GALJKxAEMDpEqq9pU613.gif)

不断地这样操作，一旦遇到了 '\*' 组合，就不断地尝试，直到最后满足匹配；或者尝试过所有的可能还是不行则表示 s 和 p 无法匹配。

### 代码实现

根据上面的思路，一起来写递归的实现。主体函数如下。

```java
boolean isMatch(String s, String p) {
    if (s == null || p == null) {
        return false;
    }

return isMatch(s, 0, p, 0);
}

主体函数非常简单，一开始做简单的判断，只要 s 和 p 有一个为 null，就表示不匹配。

注意：面试的时候，一定要注意对这些基本情况的考量，千万不要认为输入的值都是有效的。

接下来实现递归函数。

boolean isMatch(String s, int i, String p, int j) {
    int m = s.length();
    int n = p.length();

//  看看 pattern 和字符串是否都扫描完毕
    if (j == n) {
        return i == m;
    }

// next char is not '\*':  必须满足当前字符并递归到下一层
    if (j == n - 1 || p.charAt(j + 1) != '\*') {
        return (i < m) &&

(p.charAt(j) == '.' || s.charAt(i) == p.charAt(j)) &&
            isMatch(s, i + 1, p, j + 1);
    }

// next char is '\*',  如果有连续的 s\[i\]出现并且都等于 p\[j\]，一直尝试下去
    if (j < n - 1 && p.charAt(j + 1) == '\*') {
        while ((i < m) && (p.charAt(j) == '.' || s.charAt(i) == p.charAt(j))) {
            if (isMatch(s, i, p, j + 2)) {
                return true;
            }
            i++;
        }
    }

//  接着继续下去
    return isMatch(s, i, p, j + 2);
}
```

1.  函数接受四个输入参数，s 字符串，p 字符串，i 指针，j 指针。

2.  开始时计算 s 字符串和 p 字符串的长度，分别记为 m 和 n。

3.  当 j 指针遍历完了 p 字符串后，可以跳出递归，而 i 也刚好遍历完，说明 s 和 p 完全匹配。

4.  判断 j 字符的下一个是不是 '\*'，不是，则递归地调用 isMatch 函数，i + 1，j + 1。

5.  若是，则不断地将它和 '\*' 作为一个整体，分别去表示空字符串，一个字符，两个字符，依此类推。如果其中一种情况能出现 s 和 p 的匹配，就返回 true。

6.  while 循环是整个递归算法的核心，前提条件如下。

7.  i 指向的字符必须要能和 j 指向的字符匹配，其中 j 指向的可能是点匹配符。

8.  若无法匹配，i++，即用 '\*' 组合去匹配更长的一段字符串。

9.  当 i 字符和 j 字符不相同，或者 i 已经遍历完了 s 字符串，同时 j 字符后面跟着一个 '\*'的情况，只能用 '\*'组合去表示一个空字符串，然后递归下去。

## 递归法二

上法是从前往后进行递归地调用，现在从后往前地分析这个问题。例如：

s = "aaabcd"
p = "a\*b.d"

![](http://s0.lgstatic.com/i/image2/M01/90/FC/CgoB5l2Ie2GAFb2VAAB2VFYCpQA482.png)

实现过程如下所示。

![](http://s0.lgstatic.com/i/image2/M01/91/1C/CgotOV2Ie2GAA1bPAGMu3IFkH1Y793.gif)

1.  p 字符串的最后一个字符 d 必须要和 s 字符串的最后一个字符相同，才能使 p 有可能与 s 匹配，那么当它们都相同的时候，问题规模也缩小。

2.  p 字符串的最后一个字符不是 '\*'，而是点号。它可以匹配 s 字符串里的任意一个字符，且它是最后一个，所以对应的就是 s 字符串里的 c，很明显互相匹配，继续缩小问题规模。

3.  同样，b 不是 '\*'，比较它与 s 字符串的最后一个字符是否相同，是，则继续缩小问题规模。

4.  遇到 '\*'，'\*'可以表示一个空字符串，与前一个字符表示空字符串的时候，将问题变成了判断两个字符串是否匹配，其中，s 等于 aaa，而 p 是空字符串，很明显不能匹配。

5.  用 a\* 去表示一个 a。

6.  p 的最后一个还是 '\*'，用同样的策略。

7.  继续用 a\* 去表示一个 a。

8.  用 a\* 去表示空字符串。

9.  最后 s 和 p 都变成了空字符串，互相匹配。

### 代码实现

主函数代码如下。

```java
boolean isMatch(String s, String p) {
    if (s == null || p == null) return false;

return isMatch(s, s.length(), p, p.length());
}

在主函数里，进行一些简单基础的判断，如果 s 和 p 有一个是 null，则返回 false。

递归函数代码如下。

boolean isMatch(String s, int i, String p, int j) {
    if (j == 0) return i == 0;
    if (i == 0) {
        return j > 1 && p.charAt(j - 1) == '\*' && isMatch(s, i, p, j - 2);
    }

if (p.charAt(j - 1) != '\*') {
        return isMatch(s.charAt(i - 1), p.charAt(j - 1)) &&
               isMatch(s, i - 1, p, j - 1);
    }

return  isMatch(s, i, p, j - 2) || isMatch(s, i - 1, p, j) &&
            isMatch(s.charAt(i - 1), p.charAt(j - 2));
}

boolean isMatch(char a, char b) {
    return a == b || b == '.';
}
```

1.  递归函数的输入参数有四个，分别是字符串 s，当前字符串 s 的下标，字符串 p，以及字符串 p 的当前下标。由主函数可以看到，两个字符串的下标都是从最后一位开始。

2.  若 p 字符串为空，并且如果 s 字符串也为空，就表示匹配。

3.  当 p 字符串不为空，而 s 字符串为空，如上例所示，当 s 为空字符串，而 p 等于 a\*，此时只要 p 总是由 '\*'组合构成，一定能满足匹配，否则不行。

4.  若 p 的当前字符不是 '\*'，判断当前的两个字符是否相等，如果相等，就递归地看前面的字符。

5.  否则，如果 p 的当前字符是 '\*'：

6.  用 '\*' 组合表示空字符串，看看是否能匹配；

7.  用 '\*' 组合表示一个字符，看看能否匹配。

###### 动态规划法

递归的方法比较好理解，但是容易造成重叠计算。为了避免重叠计算，可以用动态规划，自底向上地实现刚才的策略。

### 代码实现

```java
//  分别用  m  和  n  表示  s  字符串和  p  字符串的长度
boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();

//  定义一个二维布尔矩阵  dp
    boolean\[\]\[\] dp = new boolean\[m + 1\]\[n + 1\];

//  当两个字符串的长度都为  0，也就是空字符串的时候，它们互相匹配
    dp\[0\]\[0\] = true;

for (int j = 1; j <= n; j++) {
        dp\[0\]\[j\] = j > 1 && p.charAt(j - 1) == '\*' && dp\[0\]\[j - 2\];
    }

for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            // p  的当前字符不是  '\*'，判断当前的两个字符是否相等，如果相等，就看  dp\[i-1\]\[j-1\]  的值，因为它保存了前一个匹配的结果
            if (p.charAt(j - 1) != '\*') {
                dp\[i\]\[j\] = dp\[i - 1\]\[j - 1\] &&
                   isMatch(s.charAt(i - 1), p.charAt(j - 1));
            } else {
                dp\[i\]\[j\] = dp\[i\]\[j - 2\] || dp\[i - 1\]\[j\] &&
                   isMatch(s.charAt(i - 1), p.charAt(j - 2));
            }
        }
    }

return dp\[m\]\[n\];
}

boolean isMatch(char a, char b) {
    return a == b || b == '.';

}
```

注意：

- 初始化二维矩阵第一行的所有值时，当 s 字符串为空，对于 p 字符串的任何一个位置，要使到这个位置的子串能和空字符串匹配，要求该子串都是由一系列的 '\*' 组合构成。

- 对二维矩阵填表，运用到的逻辑跟递归一摸一样。

- p 的当前字符不是 '\*'，判断当前的两个字符是否相等。如果相等，就看  dp\[i-1\]\[j-1\]  的值，因为它保存了前一个匹配的结果。

- 如果 p 的当前字符是 '\*'：

- 用 '\*' 组合表示空字符串，能否匹配，也就是  dp\[i\]\[j - 2\]；

- 用 '\*' 组合表示一个字符，能否匹配，也就是  dp\[i - 1\]\[j\] 。

### 复杂度分析

运用动态规划，把时间复杂度控制在 O(n2)，而空间复杂度也是 O(n2)。

建议：LeetCode 上有一道跟这题十分类似的题目，第 44 题，通配符匹配。分析例题的思路，所运用的策略，以及代码的实现，都有很多非常相似的地方。大家一定要去做做看，举一反三才能加深印象。
