---
layout: CustomPages
title: 排序算法
date: 2020-08-25
aside: false
---

# 排序算法

常见的稳定排序算法有：

- 冒泡排序（Bubble Sort） — O(n²)
- 插入排序（Insertion Sort）— O(n²)
- 桶排序（Bucket Sort）— O(n); 需要 O(k) 额外空间
- 计数排序 (Counting Sort) — O(n+k); 需要 O(n+k) 额外空间
- 合并排序（Merge Sort）— O(nlogn); 需要 O(n) 额外空间
- 二叉排序树排序 （Binary tree sort） — O(n log n) 期望时间; O(n²)最坏时间; 需要 O(n) 额外空间
- 基数排序（Radix sort）— O(n·k); 需要 O(n) 额外空间

常见的不稳定排序算法有：

- 选择排序（Selection Sort）— O(n²)
- 希尔排序（Shell Sort）— O(nlogn)
- 堆排序（Heapsort）— O(nlogn)
- 快速排序（Quicksort）— O(nlogn) 期望时间, O(n²) 最坏情况; 对于大的、乱数串行一般相信是最快的已知排序

## 数组排序算法的复杂性

| 名称         |   最优   |      平均      |     最坏     |  内存  | 稳定 | 备注                                           |
| ------------ | :------: | :------------: | :----------: | :----: | :--: | ---------------------------------------------- |
| **冒泡排序** |    n     |      n^2       |     n^2      |   1    | Yes  |                                                |
| **插入排序** |    n     |      n^2       |     n^2      |   1    | Yes  |                                                |
| **选择排序** |   n^2    |      n^2       |     n^2      |   1    |  No  |                                                |
| **堆排序**   | n log(n) |    n log(n)    |   n log(n)   |   1    |  No  |                                                |
| **归并排序** | n log(n) |    n log(n)    |   n log(n)   |   n    | Yes  |                                                |
| **快速排序** | n log(n) |    n log(n)    |     n^2      | log(n) |  No  | 在 in-place 版本下，内存复杂度通常是 O(log(n)) |
| **希尔排序** | n log(n) | 取决于差距序列 | n (log(n))^2 |   1    |  No  |                                                |
| **计数排序** |  n + r   |     n + r      |    n + r     | n + r  | Yes  | r - 数组里最大的数                             |
| **基数排序** |  n \* k  |     n \* k     |    n \* k    | n + k  | Yes  | k - 最长 key 的升序                            |

|     算法     | 时间复杂度 | 空间复杂度 |
| :----------: | :--------: | :--------: |
|   选择排序   |     N2     |     1      |
|   插入排序   |    N~N2    |     1      |
|   希尔排序   |   NlogN    |     1      |
|   快速排序   |   NlogN    |    lgN     |
| 三向快速排序 |  N~NlogN   |    lgN     |
|   归并排序   |   NlogN    |     N      |
|    堆排序    |   NlogN    |     1      |

#### O(n^2)

- 插入排序
- 选择排序
- 希尔排序
- 冒泡排序

#### O(nlogn)

- 快排
- 归并排序
- 堆排序

#### O(n)

- 桶排序
- 计数排序
- 基数排序

## 详细

### 1. 冒泡排序（稳定）

时间复杂度 `O(n * n)` 原地排序 稳定排序。每次两两比较，大的放到后面。

复杂度：

- 最好 O(n)
- 最坏 O(n^2)
- 平均 O(n^2)

```js
function sort(a) {
  const len = b.length;
  // 外层，需要遍历的次数
  for (let i = 0; i < len - 1; i++) {
    // 内层，每次比较
    for (let j = i + 1; j < len; j++) {
      if (a[i] > a[j]) {
        // 大的放到后面
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
  }
  return a;
}
```

冒泡排序是最简单最容易理解的排序算法之一，其思想是通过无序区中相邻记录关键字间的比较和位置的交换,使关键字最小的记录如气泡一般逐渐往上“漂浮”直至“水面”。 冒泡排序的复杂度，在最好情况下，即正序有序，则只需要比较 n 次。故，为 O(n) ，最坏情况下，即逆序有序，则需要比较(n-1)+(n-2)+……+1，故，为 O(n²)。

```js
function maopao(arr) {
  var len = arr.length,
    j,
    tempValue;
  while (len > 0) {
    for (j = 0; j < len - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        tempValue = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tempValue;
      }
    }
    len--;
  }
  return arr;
}
```

#### 乌龟和兔子

在冒泡排序中，最大元素的移动速度是最快的，哪怕一开始最大元素处于序列开头，也可以在一轮内层循环之后，移动到序列末尾。而对于最小元素，每一轮内层循环只能向前挪动一位，如果最小元素在序列末尾，就需要 n-1 次交换才能移动到序列开头。这两种类型的元素分别被称为兔子和乌龟。

#### 代码实现：

```csharp
private static void BubbleSort(int[] array)
{
    for (var i = 0; i < array.Length - 1; i++)  // 若最小元素在序列末尾，需要 n-1 次交换，才能交换到序列开头
    {
        for (var j = 0; j < array.Length - 1; j++)
        {
            if (array[j] > array[j + 1])   // 若这里的条件是 >=，则变成不稳定排序
            {
                Swap(array, j, j+1);
            }
        }
    }
}
```

#### 优化

在非最坏的情况下，冒泡排序过程中，可以检测到整个序列是否已经排序完成，进而可以避免掉后续的循环：

```csharp
private static void BubbleSort(int[] array)
{
    for (var i = 0; i < array.Length - 1; i++)
    {
        var swapped = false;
        for (var j = 0; j < array.Length - 1; j++)
        {
            if (array[j] > array[j + 1])
            {
                Swap(array, j, j+1);
                swapped = true;
            }
        }

        if (!swapped)  // 没有发生交互，证明排序已经完成
        {
            break;
        }
    }
}
```

进一步地，在每轮循环之后，可以确认，最后一次发生交换的位置之后的元素，都是已经排好序的，因此可以不再比较那个位置之后的元素，大幅度减少了比较的次数：

```csharp
private static void BubbleSort(int[] array)
{
    var n = array.Length;
    for (var i = 0; i < array.Length - 1; i++)
    {
        var newn = 0;
        for (var j = 0; j < n - 1; j++)
        {
            if (array[j] > array[j + 1])
            {
                Swap(array, j, j+1);
                newn = j + 1;   // newn 以及之后的元素，都是排好序的
            }
        }

        n = newn;

        if (n == 0)
        {
            break;
        }
    }
}
```

更进一步地，为了优化之前提到的乌龟和兔子问题，可以进行双向的循环，正向循环把最大元素移动到末尾，逆向循环把最小元素移动到最前，这种优化过的冒泡排序，被称为鸡尾酒排序：

```csharp
private static void CocktailSort(int[] array)
{
    var begin = 0;
    var end = array.Length - 1;
    while (begin <= end)
    {
	var newBegin = end;
	var newEnd = begin;

	for (var j = begin; j < end; j++)
	{
	    if (array[j] > array[j + 1])
	    {
		Swap(array, j, j + 1);
		newEnd = j + 1;
	    }
	}

	end = newEnd - 1;

	for (var j = end; j > begin - 1; j--)
	{
	    if (array[j] > array[j + 1])
	    {
		Swap(array, j, j + 1);
		newBegin = j;
	    }
	}

	begin = newBegin + 1;
    }
}
```

### 2. 选择排序（不稳定）

选择排序：选中数组中第 i 小的值与第 i 个值进行调换位置。

原理：每次从无序序列选择一个最小的。每一轮从数组的未排序部分加一开始，找到一个最小的值的索引，然后与未排序将其放到未排序部分的最左位置。

复杂度：

- 最好 O(n^2)
- 最坏 O(n^2)
- 平均 O(n^2)

```js
// 选择排序是每次都在寻找最小值。 已排序部分是从小到大排好的
// 选择排序，从头至尾扫描序列，找出最小的一个元素，和第一个元素交换，接着从剩下的元素中继续这种选择和交换方式，最终得到一个有序序列。
// 时间复杂度 O(n * n) 原地排序 不稳定排序
function sort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    let min = i;
    // 找到第 n 个最小值。 在 arr[i + 1, arr.length - 1] 中找最小值索引， i+1 代表有序的下一个数，我们默认第一个元素是最小的
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    // 每次循环， a[i] 位都将是未选择出的数据中的最小值
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
    }
  }
  return arr;
}
```

### 3. 插入排序 （稳定）

插入排序：选中某个值，将这个值移动到 `a[i - 1] < a[i] < a[i + 1]` 位置。

原理：从有序序列中选择合适的位置进行插入

复杂度：

- 最好 O(n)
- 最坏 O(n^2)
- 平均 O(n^2)

```js
function sort(arr) {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    // 0 - i 已经是有序序列。
    for (let j = i; j > 0 && arr[j] < arr[j - 1]; j--) {
      swap(arr, j, j - 1);
      console.log(arr);
    }
  }
  return arr;
}

function swap(arr, a, b) {
  let x = arr[a];
  arr[a] = arr[b];
  arr[b] = x;
}
```

为当前元素保存一个副本，依次向前遍历前面的元素是否比自己大，如果比自己大就直接把前一个元素赋值到当前元素的位置，当前某位置的元素不再比当前元素大的时候，将当前元素的值赋值到这个位置。

```js
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j,
      temp = arr[i];
    for (j = i; j > 0 && arr[j - 1] > temp; j--) {
      arr[j] = arr[j - 1];
    }
    arr[j] = temp;
  }
}
```

```js
// 插入排序
const b = [3, 4, 6, 1, 3, 6, 32, 45, 21, 12],
  length = b.length;

function insertSort(a) {
  for (let i = 1; i < length - 1; i++) {
    // console.log(a[i])
    // 内循环执行完之后排序好前面的队列
    // i + 1 就是当前需要插入的值.
    for (let j = i + 1; j >= 0; j--) {
      if (a[j] < a[j - 1]) {
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
        // console.log('交换: ', a)
      } else {
        // 如果比当前最大的值还大，就不用继续比较了
        break;
      }
    }
  }
  return a;
}

console.log(insertSort(b));
```

优化版

```js
let intensifyInsertArray = copyArray(arr);
function intensifyInsertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i],
      j;
    for (j = i; j > 0 && arr[j - 1] > temp; j--) {
      arr[j] = arr[j - 1];
    }
    arr[j] = temp;
  }
  return arr;
}
```

插入排序也是一个简单的排序算法，它的思想是，每次只处理一个元素，从后往前查找，找到该元素合适的插入位置，最好的情况下，即正序有序(从小到大)，这样只需要比较 n 次，不需要移动。因此时间复杂度为 O(n) ，最坏的情况下，即逆序有序，这样每一个元素就需要比较 n 次，共有 n 个元素，因此实际复杂度为 O(n²) 。

#### 算法实现：

```csharp
private static void InsertionSort(int[] array)
{
    int i = 1;
    while (i < array.Length)
    {
	var j = i;
	while (j > 0 && array[j - 1] > array[j])
	{
	    Swap(array, j, j - 1);
	    j--;
	}

	i++;
    }
}
```

### 4. 希尔排序 (缩小增量排序， 不稳定)

希尔排序：类似插入排序，但是对调的间隔扩大（插入排序是相邻元素对调位置的）。

按步长进行分组，组内直接插入，缩小增量再次进行此步骤，增量为 1 时相当于一次直接插入。

复杂度：最好 O(n) - 最坏 O(n^s 1<s<2) - 平均 O(n^1.3)

```js
function sort(arr) {
  const len = arr.length;
  let h = 1;
  while (h < parseInt(len / 3)) {
    h = 3 * h + 1;
  }
  while (h >= 1) {
    for (let i = h; i < len; i++) {
      for (let j = i; j >= h && arr[j] < arr[j - h]; j -= h) {
        swap(arr, j, j - h);
        console.log(arr);
      }
    }
    h = parseInt(h / 3);
  }
  return arr;
}

function swap(arr, a, b) {
  let x = arr[a];
  arr[a] = arr[b];
  arr[b] = x;
}
```

```js
// 希尔排序
const b = [3, 4, 6, 1, 3, 6, 32, 45, 21, 12],
  length = b.length;

// 从 start 开始，间隔为 gap 数组进行插入排序
function insertSort(a, start, gap) {
  let temp;
  for (let i = start; i < length; i++) {
    for (let j = i + gap; j < length; j += gap) {
      console.log('比较 ', i, j, a[i], a[j], a[j] < a[i] ? '交换' : '不交换');
      if (a[j] < a[i]) {
        temp = a[j];
        a[j] = a[i];
        a[i] = temp;
      } else {
        break;
      }
    }
  }
  return a;
}

function hillSort(a) {
  for (let gap = parseInt(a.length / 2); gap >= 1; gap = parseInt(gap / 2)) {
    console.log('gap', gap);
    console.log('a', a);
    insertSort(a, 0, gap);
  }
  return a;
}

console.log(hillSort(b));
```

### 5. 快速排序（不稳定）

原理：分治+递归

复杂度：最好 O(nlgn) - 最坏 O(n^2) - 平均 O(nlgn)

快速排序：选中某个值，将小于该值的移动到左边，大于该值的移动到右边。然后进入左边和右边部分分别进行快速排序。

快速排序，其效率很高，而其基本原理：算法参考某个元素值，将小于它的值，放到左数组中，大于它的值的元素就放到右数组中，然后递归进行上一次左右数组的操作，返回合并的数组就是已经排好顺序的数组了。

选取 pivot 的方式：固定基准元 随机基准 三数取中

快排的优化：针对随机数组+有序数组+重复数组

1.当待排序序列的长度分割到一定大小后，使用插入排序<三数取中+插入排序>：效率提高一些，但是都解决不了重复数组的问题。

2.在一次分割结束后，可以把与 Key 相等的元素聚在一起，继续下次分割时，不用再对与 key 相等元素分割
<三数取中+插排+聚集相同元素>

```js
/**
 * 将数组arr分为两部分，前一部分整体小于后一部分
 */
function partition(arr, left, right) {
  // 交换数组最左元素与数组的中间元素
  let midIndex = ((left + right) / 2) >> 0;
  swap(arr, left, midIndex);
  // 基准元素
  const flagItem = arr[left];
  let i = left + 1,
    j = right;
  while (true) {
    while (i <= right && arr[i] < flagItem) {
      i++;
    }
    while (j >= left && arr[j] > flagItem) {
      j--;
    }
    if (i > j) {
      break;
    } else {
      swap(arr, i, j);
      i++;
      j--;
    }
  }
  swap(arr, left, j);
  return j;
}

function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) {
    return;
  }
  const mid = partition(arr, left, right);
  quickSort(arr, left, mid - 1);
  quickSort(arr, mid + 1, right);
}
```

```js
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let leftArr = [];
  let rightArr = [];
  let q = arr[0];
  for (let i = 1, l = arr.length; i < l; i++) {
    if (arr[i] > q) {
      rightArr.push(arr[i]);
    } else {
      leftArr.push(arr[i]);
    }
  }
  return [].concat(quickSort(leftArr), [q], quickSort(rightArr));
}
```

```js
const arr = [];
const str = 'SORTEXAMPLE';

for (let char of str) {
  arr.push(char);
}

function sort(arr, lo, hi) {
  if (hi <= lo + 1) return;
  let mid = partition(arr, lo, hi); // 切分方法
  sort(arr, lo, mid);
  sort(arr, mid + 1, hi);
}

function partition(arr, lo, hi) {
  let i = lo,
    j = hi + 1;
  let v = arr[lo];
  while (true) {
    while (arr[++i] < v) if (i == hi) break;
    while (v < arr[--j]) if (j == lo) break;
    if (i >= j) break;
    swap(arr, i, j);
    console.log(arr);
  }
  swap(arr, lo, j);
  console.log(arr);
  return j;
}

function swap(arr, a, b) {
  let x = arr[a];
  arr[a] = arr[b];
  arr[b] = x;
}

sort(arr, 0, arr.length - 1);

/**
 * 先将 lo 变为中间切分点，切分出一块大于和一块小于 arr[lo] 的区域
 * 然后分别切分调换，直到最小点
 */
/*
["S", "O", "R", "T", "E", "X", "A", "M", "P", "L", "E"]
["S", "O", "R", "E", "E", "X", "A", "M", "P", "L", "T"]
["S", "O", "R", "E", "E", "L", "A", "M", "P", "X", "T"]
["P", "O", "R", "E", "E", "L", "A", "M", "S", "X", "T"]
["P", "O", "M", "E", "E", "L", "A", "R", "S", "X", "T"]
["A", "O", "M", "E", "E", "L", "P", "R", "S", "X", "T"]
["A", "O", "M", "E", "E", "L", "P", "R", "S", "X", "T"]
["A", "L", "M", "E", "E", "O", "P", "R", "S", "X", "T"]
["A", "L", "E", "E", "M", "O", "P", "R", "S", "X", "T"]
["A", "E", "E", "L", "M", "O", "P", "R", "S", "X", "T"]
["A", "E", "E", "L", "M", "O", "P", "R", "S", "X", "T"]
 */
/**
 * 切分的对换方法
 * 找到切分点左侧大于切分点的值和右侧小于切分点的值进行调换。
 */
```

快排是经典的 divide & conquer 问题，如下用于描述快排的思想、伪代码、代码、复杂度计算以及快排的变形。

#### 快排的思想

如下的三步用于描述快排的流程：

- 在数组中随机取一个值作为标兵
- 对标兵左、右的区间进行划分(将比标兵大的数放在标兵的右面，比标兵小的数放在标兵的左面，如果倒序就反过来)
- 重复如上两个过程，直到选取了所有的标兵并划分(此时每个标兵决定的区间中只有一个值，故有序)

##### 伪代码

如下是快排的主体伪代码

```
QUCIKSORT(A, p, r)
if p < r
    q = PARTITION(A, p, r)
    QUICKSORT(A, p, q-1)
    QUICKSORT(A, q+1, r)
```

如下是用于选取标兵以及划分的伪代码

```
PARTITION(A, p, r)
x = A[r]
i = p - 1
for j = p to r - 1
	if A[j] <= x
		i++
		swap A[i] with A[j]
swap A[i+1] with A[j]
return i+1
```

##### 代码

```Swift
func quickSort(inout targetArray: [Int], begin: Int, end: Int) {
    if begin < end {
        let pivot = partition(&targetArray, begin: begin, end: end)
        quickSort(&targetArray, begin: begin, end: pivot - 1)
        quickSort(&targetArray, begin: pivot + 1, end: end)
    }
}

func partition(inout targetArray: [Int], begin: Int, end: Int) -> Int {
    let value = targetArray[end]
    var i = begin - 1
    for j in begin ..< end {
        if  targetArray[j] <= value {
            i += 1;
            swapTwoValue(&targetArray[i], b: &targetArray[j])
        }
    }
    swapTwoValue(&targetArray[i+1], b: &targetArray[end])
    return i+1
}

func swapTwoValue(inout a: Int, inout b: Int) {
    let c = a
    a = b
    b = c
}

var testArray :[Int] = [123,3333,223,231,3121,245,1123]

quickSort(&testArray, begin: 0, end: testArray.count-1)
```

##### 复杂度分析

在最好的情况下，每次 partition 都会把数组一分为二，所以时间复杂度 T(n) = 2T(n/2) + O(n)

解为 T(n) = O(nlog(n))

在最坏的情况下，数组刚好和想要的结果顺序相同，每次 partition 到的都是当前无序区中最小(或最大)的记录，因此只得到一个比上一次划分少一个记录的子序列。T(n) = O(n) + T(n-1)

解为 T(n) = O(n²)

在平均的情况下，快排的时间复杂度是 O(nlog(n))

##### 变形

可以利用快排的 PARTITION 思想求数组中第 K 大元素这样的问题，步骤如下：

- 在数组中随机取一个值作为标兵，左右分化后其顺序为 X
- 如果 X == Kth 说明这就是第 K 大的数
- 如果 X > Kth 说明第 K 大的数在标兵左边，继续在左边寻找第 Kth 大的数
- 如果 X < Kth 说明第 K 大的数在标兵右边，继续在右边需找第 Kth - X 大的数

这个问题的时间复杂度是 O(n)

T(n) = n + n/2 + n/4 + ... = O(n)

#### 三向快速排序

类似快速排序，但是分为了左中右三个部分，中间部分为等于当前值的所有值。适用于有大量重复元素的排序。

```js
const arr = [];
const str = 'SORTEXAMPLE';

for (let char of str) {
  arr.push(char);
}

function sort(arr, lo, hi) {
  if (hi <= lo) return;
  let lt = lo,
    i = lo + 1,
    gt = hi;
  let v = arr[lo];
  while (i <= gt) {
    if (arr[i] < v) swap(arr, lt++, i++);
    else if (arr[i] > v) swap(arr, i, gt--);
    else i++;
    console.log(arr);
  }
  sort(arr, lo, lt - 1);
  sort(arr, gt + 1, hi);
}

function swap(arr, a, b) {
  let x = arr[a];
  arr[a] = arr[b];
  arr[b] = x;
}

sort(arr, 0, arr.length - 1);

/**
 * 三向切分的快速排序指的是，将数组分为小于、等于和大于当前切分值的区域。
 * 切分点从开头字母开始
 * 擅长于有大量重复元素的情况
 */
/*
初始化状态
["S", "O", "R", "T", "E", "X", "A", "M", "P", "L", "E"]
O < S swap(arr, lt++, i++)
["O", "S", "R", "T", "E", "X", "A", "M", "P", "L", "E"]
R < S swap(arr, lt++, i++)
["O", "R", "S", "T", "E", "X", "A", "M", "P", "L", "E"]
T > S swap(arr, i, gt--)
["O", "R", "S", "E", "E", "X", "A", "M", "P", "L", "T"]
E < S
["O", "R", "E", "S", "E", "X", "A", "M", "P", "L", "T"]
E < S
["O", "R", "E", "E", "S", "X", "A", "M", "P", "L", "T"]
X > S
["O", "R", "E", "E", "S", "L", "A", "M", "P", "X", "T"]
["O", "R", "E", "E", "L", "S", "A", "M", "P", "X", "T"]
["O", "R", "E", "E", "L", "A", "S", "M", "P", "X", "T"]
["O", "R", "E", "E", "L", "A", "M", "S", "P", "X", "T"]
["O", "R", "E", "E", "L", "A", "M", "P", "S", "X", "T"]
S 切分完毕  ["O", "R", "E", "E", "L", "A", "M", "P",|<-| "S",|->| "X", "T"]
["O", "P", "E", "E", "L", "A", "M", "R", "S", "X", "T"]
["O", "M", "E", "E", "L", "A", "P", "R", "S", "X", "T"]
["M", "O", "E", "E", "L", "A", "P", "R", "S", "X", "T"]
["M", "E", "O", "E", "L", "A", "P", "R", "S", "X", "T"]
["M", "E", "E", "O", "L", "A", "P", "R", "S", "X", "T"]
["M", "E", "E", "L", "O", "A", "P", "R", "S", "X", "T"]
["M", "E", "E", "L", "A", "O", "P", "R", "S", "X", "T"]
["E", "M", "E", "L", "A", "O", "P", "R", "S", "X", "T"]
["E", "E", "M", "L", "A", "O", "P", "R", "S", "X", "T"]
["E", "E", "L", "M", "A", "O", "P", "R", "S", "X", "T"]
["E", "E", "L", "A", "M", "O", "P", "R", "S", "X", "T"]
["E", "E", "L", "A", "M", "O", "P", "R", "S", "X", "T"]
["E", "E", "A", "L", "M", "O", "P", "R", "S", "X", "T"]
["A", "E", "E", "L", "M", "O", "P", "R", "S", "X", "T"]
["A", "E", "E", "L", "M", "O", "P", "R", "S", "X", "T"]
["A", "E", "E", "L", "M", "O", "P", "R", "S", "T", "X"]
 */
```

### 6. 归并排序（稳定）

原理：两个有序序列的合并，方法：分治 + 递归

复杂度：最好 O(nlgn) - 最坏 O(nlgn) - 平均 O(nlgn)

归并排序：通过去中间值分割数组，然后再对子数组分割，分割到最小单位进行比较，然后逐个合并。还有一种（bottom to top）的方法是先将数组切分为若干段，然后进行合并排序。核心思想就是**分而治之**。

```cpp
/**
 * 归并数组的两个有序部分
 *
 * 将arr[left, mid], arr[mid, right]两部分归并
 */
template <typename T>
void __merge(T arr[], int left,int mid, int right){

  T tempArr[right - left + 1]; //创建临时空间
  for (int i = left; i <= right; i++) {
    tempArr[i - left] = arr[i];
  }

  // i，j分别为数组两部分的游标
  int i = left, j = mid + 1;
  for(int k = left; k <= right; k++) {

    //考虑越界的情况
    if( i > mid ) {
      arr[k] = tempArr[j - left];
      j ++;
    }
    else if(j > right) {
      arr[k] = tempArr[i - left];
      i ++;
    }
    //不越界
    else if(tempArr[i - left] < tempArr[j - left]) {
      arr[k] = tempArr[i - left];
      i ++;
    } else {
      arr[k] = tempArr[j - left];
      j ++;
    }
  }
}


/**
 * 递归使用归并排序，队arr[left, right]范围进行排序
 */
template <typename T>
void __mergeSort(T arr[], int left, int right){

  if (left >= right) {
    return;
  }

  int mid = (left + right) / 2;
  __mergeSort(arr, left, mid);
  __mergeSort(arr, mid + 1, right);
  //将两个数组进行归并
  if(arr[mid] > arr[mid+1]) { //这个判断可以很大程度提升再接近有序时的性能
    __merge(arr, left, mid, right);
  }
}
```

```js
// 归并排序。分治思想，从数组中间开始将数组分成两个部分，然后分别对两个部分进行排序
// 效率为O(n log n)
const b = [3, 4, 6, 1, 3, 6, 32, 45, 21, 12],
  length = b.length;

const mergeSort = arr => {
  const length = arr.length;
  if (length < 2) return arr;

  const midIndex = parseInt(length / 2);
  const left = arr.slice(0, midIndex),
    right = arr.slice(midIndex, length);

  return [...mergeSort(left), ...mergeSort(right)];
};

console.log(mergeSort(b));
```

优化版

```js
let intensifyMergeArray = copyArray(arr);
function intensifyMerge(arr, l, mid, r) {
  let i = l,
    j = mid + 1,
    newArr = arr.slice(l, r + 1);
  for (let m = l; m <= r; m++) {
    if (i > mid) {
      arr[m] = newArr[j - l];
      j++;
    } else if (j > r) {
      arr[m] = newArr[i - l];
      i++;
    } else if (newArr[i - l] < newArr[j - l]) {
      arr[m] = newArr[i - l];
      i++;
    } else {
      arr[m] = newArr[j - l];
      j++;
    }
  }
}

function intensifyMergeEvent(arr, l, r) {
  if (l >= r) return;

  let mid = Math.floor((l + r) / 2);
  intensifyMergeEvent(arr, l, mid);
  intensifyMergeEvent(arr, mid + 1, r);

  if (arr[mid] > arr[mid + 1]) {
    intensifyMerge(arr, l, mid, r);
  }
}

function intensifyMergeSort(arr) {
  intensifyMergeEvent(arr, 0, arr.length - 1);
}
```

### 7. 桶排序

```js
// 桶排序. 值都是大于 0 的， 并且差不多都是均匀分布
// 桶排序的时间复杂度为 O(m+n)
const b = [3, 4, 6, 1, 3, 6, 32, 45, 21, 12],
  length = b.length;

function bucketSort(a) {
  // 找到最大和最小值
  let min = (max = a[0]);

  // O(n)
  for (let i = 1; i < a.length; i++) {
    if (min > a[i]) {
      min = a[i];
    }
    if (max < a[i]) {
      max = a[i];
    }
  }

  let bucket = new Array(max + 1).fill(0);

  for (let i = 0; i < a.length; i++) {
    bucket[a[i]]++;
  }

  let result = [];
  for (let i = 0; i < bucket.length; i++) {
    if (typeof bucket[i] === 'number' && bucket[i] !== 0) {
      result = [...result, ...new Array(bucket[i]).fill(i)];
    }
  }

  return result;
}

console.log(bucketSort(b));
```

### 8. 基数排序（稳定）

原理：分配加收集

复杂度： O(d(n+r)) r 为基数 d 为位数 空间复杂度 O(n+r)

```js
// 基数排序
const b = [3, 4, 6, 1, 3, 6, 32, 45, 21, 12],
  length = b.length;

function insertSort(a) {
  for (let i = 0; i < length - 1; i++) {
    for (let j = i + 1; j < length; j++) {
      if (a[i] > a[j]) {
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
      }
      console.log(a);
    }
  }
  return a;
}

console.log(insertSort(b));
```

### 9. 计数排序

```js
// 计数排序
const b = [3, 4, 6, 1, 3, 6, 32, 45, 21, 12];

function insertSort(a) {
  let min = (max = 0);
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] > a[i]) {
        max = j;
      } else {
        min = i;
      }
    }
  }
  console.log('max', max, a[max]);
  console.log('min', min, a[min]);
  return a;
}

console.log(insertSort(b));
```

```js
/**
 * Assumes each of the n input elements is an integer in the range 0 --> k,
 * for some integer k. If k = O(n), then CountingSort runs in ϴ(n) time
 *
 * Notes:
 * - Requires no user input of min or max
 * - Supports negative numbers
 *
 * @complexity: O(k) where k is the range
 * @flow
 */
export default function CountingSort(elements) {
  let z = 0;
  let max = elements[0];
  let min = elements[0];
  for (let i = 1; i < elements.length; i++) {
    max = Math.max(max, elements[i]);
    min = Math.min(min, elements[i]);
  }
  const range = max - min;

  const finalArr = new Array(elements.length).fill(0);
  // Below is where algorithm may be inefficient (when range is too large)
  const countArr = new Array(range + 1 || 0).fill(0);

  for (let i = 0; i < elements.length; i++) {
    countArr[elements[i] - min]++;
  }

  for (let i = 0; i <= range; i++) {
    while (countArr[i]-- > 0) {
      finalArr[z++] = i + min;
    }
  }

  return finalArr;
}
```

### 10. 堆排序

原理：利用堆的特性

复杂度：O(nlogn) [平均 - 最好 - 最坏]

```js
// 堆排序
// 堆排序的思想就是堆的根肯定是最大的
// 1.把最大的与最后一个元素交换
// 2.除最后一个元素外, 对根节点进行一次堆重组(heapify)
// 3.重复1和2

function heapSort(tree, n) {
  // 先把一个数组组成一个堆
  buildHeap(tree, n);
  // 从最后一个节点开始
  for (let i = n - 1; i >= 0; i--) {
    swap(tree, i, 0);
    // 1.把最大的与最后一个元素交换
    heapify(tree, i, 0);
  }
}

// 根据数组创建一个堆
function buildHeap(tree, n) {
  // n = tree.length
  // last_node = tree.length - 1 也就是下标
  let last_node = n - 1;
  // 节点 i 的父节点的索引 i = (i - 1) / 2
  let parent = (last_node - 1) / 2;
  // 从最后一个父节点进行堆重组
  for (let i = parent; i >= 0; i--) {
    heapify(tree, n, i);
  }
}

// 交换两个元素的值
function swap(tree, max, i) {
  let temp = tree[i];
  tree[i] = tree[max];
  tree[max] = temp;
}

// 对第 i 个节点进行堆重组，n 为数组 tree 元素的个数
function heapify(tree, n, i) {
  // 递归出口
  if (i >= n) {
    return;
  }
  // 左孩子节点索引
  let c1 = 2 * i + 1;
  // 右孩子节点索引
  let c2 = 2 * i + 2;
  // 最大节点索引。 也就是根节点
  let max = i;
  if (c1 < n && tree[c1] > tree[max]) {
    max = c1;
  }
  if (c2 < n && tree[c2] > tree[max]) {
    max = c2;
  }
  // 说明不是 大根堆（每个节点的值都大于左右孩子节点），需要对其子树进行一次堆重组
  if (max != i) {
    // 交换 i 与 max 对应的值
    swap(tree, max, i);
    // 继续对子树进行堆重组
    heapify(tree, n, max);
  }
}

const arr = [1, 2, 3, 11, 13, 12, 9, 8, 10, 15, 14, 7];
heapSort(arr, arr.length);
console.log(arr);
```

堆排序：利用优先队列可以方便查找最大值的特点，逐个求出最大值，从右到左、从大到小排序。

```cpp
/**
 * shiftDown 沿着树不断调整位子
 * 比较左右子树，是否有比自己大的，如果有就和大的那个交换位置
 * 使得大的再上，小的在下
 * 为了维持堆的特性，还得把那个交换到子树上的较小元素拿去尝试对他进行shiftDown
 */
template <typename T>
void __shiftDown(T arr, int pos, int len) {
  while(2 * pos + 1 < len){
    int j = pos * 2 + 1;  //默认左孩子
    if(j + 1 < len) { //如果有右孩子
      if(arr[j + 1] > arr[j]) {
        j += 1;
      }
    }
    if(arr[pos] < arr[j]) {
      swap(arr[pos], arr[j]);
      pos = j;  //--这步容易忘，因为是循环，所以每次都要对pos进行shiftDown--
    } else {
      break;
    }
  }
}
/**
 * 通用堆排序
 */
template <typename T>
void heapSort(T arr[], int n)
{
  //Heapify
  for(int i = (n-1)/2; i >= 0; i-- ) {
    __shiftDown(arr, i, n);
  }
  //出堆，放到数组末尾
  for(int i = n - 1; i > 0; i--){
    swap(arr[i], arr[0]);
    __shiftDown(arr, 0, i);
  }
}
```

```java
// 堆排序
public void heapSort(int[] a) {
	if (null == a || a.length < 2) {
		return;
	}
	buildMaxHeap(a);

	for (int i = a.length - 1; i >= 0; i--) {
		int temp = a[0];
		a[0] = a[i];
		a[i] = temp;
		adjustHeap(a, i, 0);
	}
}

// 建堆
private void buildMaxHeap(int[] a) {
	for (int i = a.length/2; i >= 0; i--) {
		adjustHeap(a, a.length, i);
	}
}

// 调整堆
private void adjustHeap(int[] a, int size, int parent) {
	int left = 2 * parent + 1;
	int right = 2 * parent + 2;
	int largest = parent;

	if (left < size && a[left] > a[largest]) {
		largest = left;
	}

	if (right < size && a[right] > a[largest]) {
		largest = right;
	}

	if (parent != largest) {
		int temp = a[parent];
		a[parent] = a[largest];
		a[largest] = temp;
		adjustHeap(a, size, largest);
	}
}
```

#### 快速 排序的思想并实现一个快排？

"快速排序"的思想很简单，整个排序过程只需要三步：

（1）在数据集之中，找一个基准点

（2）建立两个数组，分别存储左边和右边的数组

（3）利用递归进行下次比较

```js
    <script type="text/javascript">

        function quickSort(arr){
            if(arr.length<=1){
                return arr;//如果数组只有一个数，就直接返回；
            }

            var num = Math.floor(arr.length/2);//找到中间数的索引值，如果是浮点数，则向下取整

            var numValue = arr.splice(num,1);//找到中间数的值
            var left = [];
            var right = [];

            for(var i=0;i<arr.length;i++){
                if(arr[i]<numValue){
                    left.push(arr[i]);//基准点的左边的数传到左边数组
                }
                else{
                   right.push(arr[i]);//基准点的右边的数传到右边数组
                }
            }

            return quickSort(left).concat([numValue],quickSort(right));//递归不断重复比较
        }

        alert(quickSort([32,45,37,16,2,87]));//弹出“2,16,32,37,45,87”

    </script>
```

#### 介绍一下桶排序和基数排序、快速排序

### 快速排序的思想并实现一个快排？

"快速排序"的思想很简单，整个排序过程只需要三步：

1. 在数据集之中，找一个基准点
2. 建立两个数组，分别存储左边和右边的数组
3. 利用递归进行下次比较

```js
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr; //如果数组只有一个数，就直接返回；
  }

  var num = Math.floor(arr.length / 2); //找到中间数的索引值，如果是浮点数，则向下取整

  var numValue = arr.splice(num, 1); //找到中间数的值
  var left = [];
  var right = [];

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < numValue) {
      left.push(arr[i]); //基准点的左边的数传到左边数组
    } else {
      right.push(arr[i]); //基准点的右边的数传到右边数组
    }
  }

  return quickSort(left).concat([numValue], quickSort(right)); //递归不断重复比较
}

alert(quickSort([32, 45, 37, 16, 2, 87])); //弹出“2,16,32,37,45,87”
```

### 说说你记得的所有的排序，他们的原理是什么？

冒泡排序：双层遍历，对比前后两个节点，如果满足条件，位置互换，直到遍历结束。
快速排序：去数组中间的那一个数，然后遍历所有数，小于该数的 push 到一个数组，大于该数的 push 到另外一个数组，然后递归去排序这两个数组，最后将所有结果连接起来。
选择排序：声明一个数组，每次去输入数组里面找数组中的最大值或者最小值，取出来后 push 到声明的数组中，直到输入数组为空。

## Code

```js
// 常见排序算法

/**
 * 交换数组中两元素位置
 * @param       : i, j: 待交换的两元素下标
 */
Array.prototype.swap = function(i, j) {
  const temp = this[i];
  this[i] = this[j];
  this[j] = temp;
};

/**
 * 冒泡排序
 * @param       : <Array> target数组
 * @description : 冒泡排序，更贴切的形容应该是沉底排序，每一轮内循环就是最大数沉底了。
 */
module.exports.bubbleSort = function bubbleSort(target) {
  for (var j = target.length; j > 0; j--) {
    for (var i = 0; i < j - 1; i++) {
      if (target[i] > target[i + 1]) {
        target.swap(i, i + 1);
      }
    }
  }
  return target;
};

/**
 * 选择排序
 * @param       : <Array> target数组
 * @description : 一次内循环得到最大值的下标，然后只交换一次次序，将最大值和内循环末尾对调。
 */
module.exports.selectSort = function selectSort(target) {
  for (var j = target.length; j > 0; j--) {
    var maxIndex = 0;
    for (var i = 1; i < j; i++) {
      maxIndex = target[maxIndex] > target[i] ? maxIndex : i;
    }
    target.swap(maxIndex, j - 1);
  }
  return target;
};

/**
 * 直接插入排序
 * @param       : <Array> target数组
 * @description : 将当前元素与前面元素逐一比较，比前方元素小时则将前方元素后移，直到比前方元素大则落位
 */
module.exports.straightInsertionSort = function straightInsertionSort(target) {
  for (let i = 1; i < target.length; i++) {
    var j = i;
    var base = target[i];
    while (j > 0 && base < target[j - 1]) {
      target[j] = target[j - 1];
      j--;
    }
    if (j < i) {
      target[j] = base;
    }
  }
  return target;
};

/**
 * 希尔排序
 * @param       : <Array> target数组
 * @description : 插入排序的改版：使用定好的偏移量分组，组内进行插入排序；减小偏移量重复进行分组排序直到偏移量为1.
 */
module.exports.shellSort = function shellSort(target) {
  const len = target.length;
  // 偏移量递减
  for (let dx = Math.floor(len / 2); dx > 0; dx = Math.floor(dx / 2)) {
    // 按偏移量分组[0,dx,2dx...], [1, 1+dx, 1+2dx...]
    for (let i = 0; i < dx; i++) {
      // 组内插入排序
      for (let j = i + dx; j < len; j += dx) {
        let k = j;
        let base = target[k];
        // 插入元素
        while (k > i && base < target[k - dx]) {
          target[k] = target[k - dx];
          k -= dx;
        }
        if (k < j) {
          target[k] = base;
        }
      }
    }
  }
  return target;
};

/**
 * 快速排序
 * @param       : <Array> target数组
 * @description : 选择一个元素将数组分隔成两部分，比该元素小的放该元素前面，比该元素大放后面；
 *                然后递归快速排序，最终得到一个排序后数组
 */
module.exports.quickSort = function quickSort(target) {
  // 先定义递归终止条件
  if (target.length < 2) {
    return target;
  }

  var baseIndex = 0;
  var left = [];
  var right = [];

  for (var i = 1; i < target.length; i++) {
    if (target[i] < target[baseIndex]) {
      left.push(target[i]);
    } else {
      right.push(target[i]);
    }
  }
  left = quickSort(left);
  right = quickSort(right);
  return left.concat(target[baseIndex], right); // 递归出口
};

/**
 * 原地快速排序
 * @param       : <Array> target
 * @description : 上面的快排每次都开辟一个数组，浪费空间。常规做法是两边查找到中间，两两交换位置
 */
function _inPlaceQuickSort(target, left, right) {
  // 先定义递归终止条件
  if (left >= right) {
    return target;
  }

  var base = target[left];
  var i = left;
  var j = right;
  while (i < j) {
    while (i < j && target[j] >= base) {
      j--;
    }
    target[i] = target[j];
    while (i < j && target[i] <= base) {
      i++;
    }
    target[j] = target[i];
  }
  target[i] = base;
  // 函数副作用已经改变了传入数组，但是用显式返回看起来更清晰
  target = _inPlaceQuickSort(target, left, i - 1);
  target = _inPlaceQuickSort(target, i + 1, right);
  return target;
}
module.exports.inPlaceQuickSort = function inPlaceQuickSort(target) {
  return _inPlaceQuickSort(target, 0, target.length - 1);
};

/**
 * 归并排序
 * @param       : <Array> target 要归并排序的数组
 * @description : 归并排序，将数组递归分割成两个子数组直至数组只有一个元素，然后将这两个有序数组合并成一个有序数组;
 */
function mergeSortedArray(arrA, arrB) {
  var result = [];
  var i = 0,
    j = 0,
    targetLen = arrA.length,
    toolLen = arrB.length;
  while (i < targetLen && j < toolLen) {
    if (arrA[i] < arrB[j]) {
      result.push(arrA[i++]);
    } else {
      result.push(arrB[j++]);
    }
  }
  while (i < targetLen) {
    result.push(arrA[i++]);
  }
  while (j < toolLen) {
    result.push(arrB[j++]);
  }
  return result;
}
module.exports.mergeSort = function mergeSort(target) {
  if (target.length === 1) {
    return target;
  }
  var mid = Math.floor(target.length / 2);
  var left = target.slice(0, mid);
  var right = target.slice(mid);
  return mergeSortedArray(mergeSort(left), mergeSort(right));
};

/**
 * 堆排序
 * @param       : <Array> target
 * @description : 通过构建大(小)根堆的方式进行排序，PS：使用函数副作用来进行原地排序
 */
// 递归调整 i~j 层的大根堆
function adjustMaxHeap(target, i, j) {
  let parent = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  // 比较父节点与左右叶子节点，取最大值的下标设为父节点下标
  if (left < j && target[parent] < target[left]) {
    parent = left;
  }
  if (right < j && target[parent] < target[right]) {
    parent = right;
  }
  // 只有父节点发生改变才会破坏大根堆结构，此时才需要继续调整下级大根堆
  if (parent != i) {
    target.swap(i, parent);
    adjustMaxHeap(target, parent, j);
  }
}
// 构建大根堆就是不断调整最大堆的过程，只要从最后一个父节点往上调整到第一个父节点，就能构建出大根堆
// 从0开始的n层堆的结构：len = 2^n - 1，第n层全是叶子，所以第n-1层的最后一个父节点就是floor(len/2)-1
function buildMaxHeap(target) {
  const len = target.length;
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    adjustMaxHeap(target, i, len);
  }
}

function sortMaxHeap(target) {
  for (let i = target.length - 1; i > 0; i--) {
    target.swap(0, i);
    adjustMaxHeap(target, 0, i);
  }
}
// 先构建一个大根堆，然后从最后一个元素开始交换堆顶元素，每次交换都调整根堆，直到数组头则完成排序
module.exports.heapSort = function heapSort(target) {
  buildMaxHeap(target);
  sortMaxHeap(target);
  return target;
};

/**
 * 堆排序提取部分记录
 * 从大数据中提取最大(小)的n条记录，也可以用小(大)根堆来实现
 * 先用数据集中前n条数据构造一个小根堆，然后将后面的数据依次通过这个小根堆：
 * 比堆顶小的数据直接丢弃，比堆顶大则替换堆顶，然后调整根堆。最后输出小根堆的排序
 */
module.exports.topSortViaHeap = function topSortViaHeap(target) {
  const len = 10;
  let ret = target.slice(0, len);
  buildMaxHeap(ret);
  for (var i = len; i < target.length; i++) {
    if (target[i] < ret[0]) {
      ret[0] = target[i];
      adjustMaxHeap(ret, 0, ret.length);
    }
  }
  sortMaxHeap(ret);
  return ret;
};
```
