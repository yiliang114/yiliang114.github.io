---
layout: CustomPages
title: 部分题目
date: 2020-09-04
aside: false
draft: true
---

# JS

## Array

### 给定一个整数数组，求其中三个整数的最大乘积

```javascript
var unsortedArray = [-10, 7, 29, 30, 5, -10, -70];

computeProduct(unsortedArray); // 21000

function sortIntegers(a, b) {
  return a - b;
}

// Greatest product is either (min1 * min2 * max1 || max1 * max2 * max3)
function computeProduct(unsorted) {
  var sortedArray = unsorted.sort(sortIntegers),
    product1 = 1,
    product2 = 1,
    array_n_element = sortedArray.length - 1;

  // Get the product of three largest integers in sorted array
  for (var x = array_n_element; x > array_n_element - 3; x--) {
    product1 = product1 * sortedArray[x];
  }

  product2 = sortedArray[0] * sortedArray[1] * sortedArray[array_n_element];

  if (product1 > product2) return product1;

  return product2;
}
```

### 数组-连续-求和

已知未排序的数组包含（n-1）个 n 个连续数字（定义了边界），请在 O（n）时间中找到缺失的数字

```javascript
// The output of the function should be 8
var arrayOfIntegers = [2, 5, 1, 4, 9, 6, 3, 7];
var upperBound = 9;
var lowerBound = 1;

findMissingNumber(arrayOfIntegers, upperBound, lowerBound); // 8

function findMissingNumber(arrayOfIntegers, upperBound, lowerBound) {
  // Iterate through array to find the sum of the numbers
  var sumOfIntegers = 0;
  for (var i = 0; i < arrayOfIntegers.length; i++) {
    sumOfIntegers += arrayOfIntegers[i];
  }

  // Find theoretical sum of the consecutive numbers using a variation of Gauss Sum.
  // Formula: [(N * (N + 1)) / 2] - [(M * (M - 1)) / 2];
  // N is the upper bound and M is the lower bound

  upperLimitSum = (upperBound * (upperBound + 1)) / 2;
  lowerLimitSum = (lowerBound * (lowerBound - 1)) / 2;

  theoreticalSum = upperLimitSum - lowerLimitSum;

  return theoreticalSum - sumOfIntegers;
}
```

- **[1.3](#array--unique) Removing duplicates of an array and returning an array of only unique elements**

  ```javascript
  // ES6 Implementation
  var array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

  Array.from(new Set(array)); // [1, 2, 3, 5, 9, 8]

  // ES5 Implementation
  var array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

  uniqueArray(array); // [1, 2, 3, 5, 9, 8]

  function uniqueArray(array) {
    var hashmap = {};
    var unique = [];

    for (var i = 0; i < array.length; i++) {
      // If key returns undefined (unique), it is evaluated as false.
      if (!hashmap.hasOwnProperty(array[i])) {
        hashmap[array[i]] = 1;
        unique.push(array[i]);
      }
    }

    return unique;
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/ZLNwze?editors=0012

- **[1.4](#array--largest-difference) Given an array of integers, find the largest difference between two elements such that the element of lesser value must come before the greater element**

  ```javascript
  var array = [7, 8, 4, 9, 9, 15, 3, 1, 10];
  // [7, 8, 4, 9, 9, 15, 3, 1, 10] would return `11` based on the difference between `4` and `15`
  // Notice: It is not `14` from the difference between `15` and `1` because 15 comes before 1.

  findLargestDifference(array);

  function findLargestDifference(array) {
    // If there is only one element, there is no difference
    if (array.length <= 1) return -1;

    // currentMin will keep track of the current lowest
    var currentMin = array[0];
    var currentMaxDifference = 0;

    // We will iterate through the array and keep track of the current max difference
    // If we find a greater max difference, we will set the current max difference to that variable
    // Keep track of the current min as we iterate through the array, since we know the greatest
    // difference is yield from `largest value in future` - `smallest value before it`

    for (var i = 1; i < array.length; i++) {
      if (array[i] > currentMin && array[i] - currentMin > currentMaxDifference) {
        currentMaxDifference = array[i] - currentMin;
      } else if (array[i] <= currentMin) {
        currentMin = array[i];
      }
    }

    // If negative or 0, there is no largest difference
    if (currentMaxDifference <= 0) return -1;

    return currentMaxDifference;
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/MJdLWJ?editors=0012

- **[1.5](#array--product-other-than-itself) Given an array of integers, return an output array such that output[i] is equal to the product of all the elements in the array other than itself. (Solve this in O(n) without division)**

  ```javascript
  var firstArray = [2, 2, 4, 1];
  var secondArray = [0, 0, 0, 2];
  var thirdArray = [-2, -2, -3, 2];

  productExceptSelf(firstArray); // [8, 8, 4, 16]
  productExceptSelf(secondArray); // [0, 0, 0, 0]
  productExceptSelf(thirdArray); // [12, 12, 8, -12]

  function productExceptSelf(numArray) {
    var product = 1;
    var size = numArray.length;
    var output = [];

    // From first array: [1, 2, 4, 16]
    // The last number in this case is already in the right spot (allows for us)
    // to just multiply by 1 in the next step.
    // This step essentially gets the product to the left of the index at index + 1
    for (var x = 0; x < size; x++) {
      output.push(product);
      product = product * numArray[x];
    }

    // From the back, we multiply the current output element (which represents the product
    // on the left of the index, and multiplies it by the product on the right of the element)
    var product = 1;
    for (var i = size - 1; i > -1; i--) {
      output[i] = output[i] * product;
      product = product * numArray[i];
    }

    return output;
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/OWYdJK?editors=0012

* **[1.6](#array--intersection) Find the intersection of two arrays. An intersection would be the common elements that exists within both arrays. In this case, these elements should be unique!**

  ```javascript
  var firstArray = [2, 2, 4, 1];
  var secondArray = [1, 2, 0, 2];

  intersection(firstArray, secondArray); // [2, 1]

  function intersection(firstArray, secondArray) {
    // The logic here is to create a hashmap with the elements of the firstArray as the keys.
    // After that, you can use the hashmap's O(1) look up time to check if the element exists in the hash
    // If it does exist, add that element to the new array.

    var hashmap = {};
    var intersectionArray = [];

    firstArray.forEach(function(element) {
      hashmap[element] = 1;
    });

    // Since we only want to push unique elements in our case... we can implement a counter to keep track of what we already added
    secondArray.forEach(function(element) {
      if (hashmap[element] === 1) {
        intersectionArray.push(element);
        hashmap[element]++;
      }
    });

    return intersectionArray;

    // Time complexity O(n), Space complexity O(n)
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/vgwbEb?editors=0012

## Strings

- **[2.1](#string--reverse) Given a string, reverse each word in the sentence**
  `"Welcome to this Javascript Guide!"` should be become `"emocleW ot siht tpircsavaJ !ediuG"`

  ```javascript
  var string = 'Welcome to this Javascript Guide!';

  // Output becomes !ediuG tpircsavaJ siht ot emocleW
  var reverseEntireSentence = reverseBySeparator(string, '');

  // Output becomes emocleW ot siht tpircsavaJ !ediuG
  var reverseEachWord = reverseBySeparator(reverseEntireSentence, ' ');

  function reverseBySeparator(string, separator) {
    return string
      .split(separator)
      .reverse()
      .join(separator);
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/VPOONZ?editors=0012

- **[2.2](#string--anagram) Given two strings, return true if they are anagrams of one another**
  `"Mary" is an anagram of "Army"`

  ```javascript
  var firstWord = 'Mary';
  var secondWord = 'Army';

  isAnagram(firstWord, secondWord); // true

  function isAnagram(first, second) {
    // For case insensitivity, change both words to lowercase.
    var a = first.toLowerCase();
    var b = second.toLowerCase();

    // Sort the strings, and join the resulting array to a string. Compare the results
    a = a
      .split('')
      .sort()
      .join('');
    b = b
      .split('')
      .sort()
      .join('');

    return a === b;
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/NdVVVj?editors=0012

* **[2.3](#string--palindrome) Check if a given string is a palindrome**
  `"racecar" is a palindrome. "race car" should also be considered a palindrome. Case sensitivity should be taken into account`

  ```javascript
  isPalindrome('racecar'); // true
  isPalindrome('race Car'); // true

  function isPalindrome(word) {
    // Replace all non-letter chars with "" and change to lowercase
    var lettersOnly = word.toLowerCase().replace(/\s/g, '');

    // Compare the string with the reversed version of the string
    return (
      lettersOnly ===
      lettersOnly
        .split('')
        .reverse()
        .join('')
    );
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/xgNNNB?editors=0012

- **[2.3](#string--palindrome) Check if a given string is a isomorphic**

  ```
  For two strings to be isomorphic, all occurrences of a character in string A can be replaced with another character
  to get string B. The order of the characters must be preserved. There must be one-to-one mapping for ever char of
  string A to every char of string B.

  `paper` and `title` would return true.
  `egg` and `sad` would return false.
  `dgg` and `add` would return true.
  ```

  ```javascript
  isIsomorphic('egg', 'add'); // true
  isIsomorphic('paper', 'title'); // true
  isIsomorphic('kick', 'side'); // false

  function isIsomorphic(firstString, secondString) {
    // Check if the same lenght. If not, they cannot be isomorphic
    if (firstString.length !== secondString.length) return false;

    var letterMap = {};

    for (var i = 0; i < firstString.length; i++) {
      var letterA = firstString[i],
        letterB = secondString[i];

      // If the letter does not exist, create a map and map it to the value
      // of the second letter
      if (letterMap[letterA] === undefined) {
        // If letterB has already been added to letterMap, then we can say: they are not isomorphic.
        if (secondString.indexOf(letterB) < i) {
          return false;
        } else {
          letterMap[letterA] = letterB;
        }
      } else if (letterMap[letterA] !== letterB) {
        // Eles if letterA already exists in the map, but it does not map to
        // letterB, that means that A is mapping to more than one letter.
        return false;
      }
    }
    // If after iterating through and conditions are satisfied, return true.
    // They are isomorphic
    return true;
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/mRZgaj?editors=0012

## Stacks and Queues

- **[3.1](#stack-queue--stack-as-queue) Implement enqueue and dequeue using only two stacks**

  ```javascript
  var inputStack = []; // First stack
  var outputStack = []; // Second stack

  // For enqueue, just push the item into the first stack
  function enqueue(stackInput, item) {
    return stackInput.push(item);
  }

  function dequeue(stackInput, stackOutput) {
    // Reverse the stack such that the first element of the output stack is the
    // last element of the input stack. After that, pop the top of the output to
    // get the first element that was ever pushed into the input stack
    if (stackOutput.length <= 0) {
      while (stackInput.length > 0) {
        var elementToOutput = stackInput.pop();
        stackOutput.push(elementToOutput);
      }
    }

    return stackOutput.pop();
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/mRYYZV?editors=0012

* **[3.2](#stack-queue--parentheses-balancing) Create a function that will evaluate if a given expression has balanced parentheses -- Using stacks**
  In this example, we will only consider "{}" as valid parentheses
  `{}{}` would be considered balancing. `{{{}}` is not balanced

  ```javascript
  var expression = '{{}}{}{}';
  var expressionFalse = '{}{{}';

  isBalanced(expression); // true
  isBalanced(expressionFalse); // false
  isBalanced(''); // true

  function isBalanced(expression) {
    var checkString = expression;
    var stack = [];

    // If empty, parentheses are technically balanced
    if (checkString.length <= 0) return true;

    for (var i = 0; i < checkString.length; i++) {
      if (checkString[i] === '{') {
        stack.push(checkString[i]);
      } else if (checkString[i] === '}') {
        // Pop on an empty array is undefined
        if (stack.length > 0) {
          stack.pop();
        } else {
          return false;
        }
      }
    }

    // If the array is not empty, it is not balanced
    if (stack.pop()) return false;
    return true;
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/egaawj?editors=0012

## Recursion

- **[4.1](#recursion--decimal-to-binary) Write a recursive function that returns the binary string of a given decimal number**
  Given `4` as the decimal input, the function should return `100`

  ```javascript
  decimalToBinary(3); // 11
  decimalToBinary(8); // 1000
  decimalToBinary(1000); // 1111101000

  function decimalToBinary(digit) {
    if (digit >= 1) {
      // If digit is not divisible by 2 then recursively return proceeding
      // binary of the digit minus 1, 1 is added for the leftover 1 digit
      if (digit % 2) {
        return decimalToBinary((digit - 1) / 2) + 1;
      } else {
        // Recursively return proceeding binary digits
        return decimalToBinary(digit / 2) + 0;
      }
    } else {
      // Exit condition
      return '';
    }
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/OWYYKb?editors=0012

* **[4.2](#recursion--binary-search) Write a recursive function that performs a binary search**

  ```javascript
  function recursiveBinarySearch(array, value, leftPosition, rightPosition) {
    // Value DNE
    if (leftPosition > rightPosition) return -1;

    var middlePivot = Math.floor((leftPosition + rightPosition) / 2);
    if (array[middlePivot] === value) {
      return middlePivot;
    } else if (array[middlePivot] > value) {
      return recursiveBinarySearch(array, value, leftPosition, middlePivot - 1);
    } else {
      return recursiveBinarySearch(array, value, middlePivot + 1, rightPosition);
    }
  }
  ```

  **View on Codepen:** http://codepen.io/kennymkchan/pen/ygWWmK?editors=0012

**[⬆ back to top](#table-of-contents)**

## Numbers

- **[5.1](#numbers--power-of-two) Given an integer, determine if it is a power of 2. If so,
  return that number, else return -1. (0 is not a power of two)**

  ```javascript
  isPowerOfTwo(4); // true
  isPowerOfTwo(64); // true
  isPowerOfTwo(1); // true
  isPowerOfTwo(0); // false
  isPowerOfTwo(-1); // false

  // For the non-zero case:
  function isPowerOfTwo(number) {
    // `&` uses the bitwise n.
    // In the case of number = 4; the expression would be identical to:
    // `return (4 & 3 === 0)`
    // In bitwise, 4 is 100, and 3 is 011. Using &, if two values at the same
    // spot is 1, then result is 1, else 0. In this case, it would return 000,
    // and thus, 4 satisfies are expression.
    // In turn, if the expression is `return (5 & 4 === 0)`, it would be false
    // since it returns 101 & 100 = 100 (NOT === 0)

    return number & (number - 1 === 0);
  }

  // For zero-case:
  function isPowerOfTwoZeroCase(number) {
    return number !== 0 && (number & (number - 1)) === 0;
  }
  ```

* **[6.2](#javascript--use-strict) Describe the functionality of the `use strict;` directive**

  ```
  the `use strict` directive defines that the Javascript should be executed in `strict mode`.
  One major benefit that strict mode provides is that it prevents developers from using
  undeclared variables. Older versions of javascript would ignore this directive declaration
  ```

  ```javascript
  // Example of strict mode
  'use strict';

  catchThemAll();
  function catchThemAll() {
    x = 3.14; // Error will be thrown
    return x * x;
  }
  ```

## 基础的算法题

### 判断一个字符串是否是回文

回文是指将字符串翻转之后的值跟翻转之前的值相等。比如 `mamam`, `ava` .

这里主要的考察是 `reverse` 的实现， 刚好 JS 的数组（注意是数组，而不是字符串）就有 `reverse` 函数。直接利用现成的函数，将字符串转换成数组。

```js
function checkPalindrome(str) {
  return (
    str ===
    str
      .split('')
      .reverse()
      .join('')
  );
}
```

### 整型数组去重

比如输入: `[1,13,24,11,11,14,1,2]`
输出: `[1,13,24,11,14,2]`

这道问题有不止一个解法。

- 第一种解法，主要考察个人对 Object 的使用，利用 key 来进行筛选。
- 直接使用 ES6 的 Set 去重。

```js
function unique(arr) {
  const hashTable = {};
  const data = [];
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i];
    if (!hashTable[key]) {
      hashTable[key] = true;
      data.push(key);
    }
  }
  return data;
}

function unique1(arr) {
  return Array.from(new Set(arr));
}
```

### 统计一个字符串出现最多的字母

给出一段英文连续的英文字符窜，找出重复出现次数最多的字母

输入: `afjghdfraaaasdenas`
输出: `a`

前面出现过去重的算法，这里需要是统计重复次数。

```js
function findMaxDuplicateChar(str) {
  // 单个字符串
  if (str.length == 1) {
    return str;
  }
  let charObj = {},
    maxChar = str[0],
    maxValue = 1;
  for (let i = 0; i < str.length; i++) {
    if (!charObj[str[i]]) {
      charObj[str[i]] = 1;
    } else {
      charObj[str[i]] += 1;
    }

    if (charObj[str[i]] > maxValue) {
      maxChar = str[i];
      maxValue = charObj[str[i]];
    }
  }
  return maxChar;
}
```

### 随机生成指定长度的字符串

实现一个算法，随机生成指制定长度的字符窜。

比如给定 长度 8 输出 `4ldkfg9j`

```js
function randomString(n) {
  const str = 'abcdefghijklmnopqrstuvwxyz9876543210';
  const len = str.length;
  let tmp = '';
  for (let i = 0; i < n; i++) {
    tmp += str[Math.floor(Math.random() * len)];
  }
  return tmp;
}
```

### 找出下列正数组的最大差值

比如:
输入: `[10,5,11,7,8,9]`
输出: 6

```js
function getMaxProfit(arr) {
  let minPrice = arr[0];
  let maxProfit = 0;
  for (let i = 0; i < arr.length; i++) {
    let currentPrice = arr[i];
    minPrice = Math.min(minPrice, currentPrice);
    let potentialProfit = currentPrice - minPrice;
    maxProfit = Math.max(maxProfit, potentialProfit);
  }
  return maxProfit;
}
```

### 不借助临时变量，进行两个整数的交换

输入 a = 2, b = 4 输出 a = 4, b =2

这种问题非常巧妙，需要大家跳出惯有的思维，利用 a , b 进行置换。

主要是利用 + – 去进行运算，类似 a = a + ( b – a) 实际上等同于最后 的 a = b;

```js
function swap(a, b) {
  b = b - a;
  a = a + b;
  b = a - b;
  return [a, b];
}

module.exports = swap;
```

### 使用 canvas 绘制一个有限度的斐波那契数列的曲线？

数列长度限定在 9.

斐波那契数列，又称黄金分割数列，指的是这样一个数列：0、1、1、2、3、5、8、13、21、34、……在数学上，斐波纳契数列主要考察递归的调用。我们一般都知道定义

```js
fibo[i] = fibo[i - 1] + fibo[i - 2];
```

生成斐波那契数组的方法

```js
function getFibonacci(n) {
  var fibarr = [];
  var i = 0;
  while (i < n) {
    if (i <= 1) {
      fibarr.push(i);
    } else {
      fibarr.push(fibarr[i - 1] + fibarr[i - 2]);
    }
    i++;
  }

  return fibarr;
}
```

剩余的工作就是利用 canvas arc 方法进行曲线绘制了

DEMO（http://codepen.io/Jack_Pu/pen/LRaxZB）

### 实现类似 getElementsByClassName 的功能

自己实现一个函数，查找某个 DOM 节点下面的包含某个 class 的所有 DOM 节点？不允许使用原生提供的 getElementsByClassName querySelectorAll 等原生提供 DOM 查找函数。

```js
function queryClassName(node, name) {
  var starts = '(^|[ \n\r\t\f])',
    ends = '([ \n\r\t\f]|$)';
  var array = [],
    regex = newRegExp(starts + name + ends),
    elements = node.getElementsByTagName('*'),
    length = elements.length,
    i = 0,
    element;
  while (i < length) {
    element = elements[i];
    if (regex.test(element.className)) {
      array.push(element);
    }
    i += 1;
  }
  return array;
}
```

###0 使用 JS 实现二叉查找树(Binary Search Tree)

一般叫全部写完的概率比较少，但是重点考察你对它的理解和一些基本特点的实现。 二叉查找树，也称二叉搜索树、有序二叉树（英语：ordered binary tree）是指一棵空树或者具有下列性质的二叉树：

任意节点的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
任意节点的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
任意节点的左、右子树也分别为二叉查找树；
没有键值相等的节点。二叉查找树相比于其他数据结构的优势在于查找、插入的时间复杂度较低。为 O(log n)。二叉查找树是基础性数据结构，用于构建更为抽象的数据结构，如集合、multiset、关联数组等。

在写的时候需要足够理解二叉搜素树的特点，需要先设定好每个节点的数据结构

```js
class Node {
  constructor(data, left, right) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}
```

树是有节点构成，由根节点逐渐延生到各个子节点，因此它具备基本的结构就是具备一个根节点，具备添加，查找和删除节点的方法.

```js

classBinarySearchTree{

constructor(){
this.root = null;
}

insert(data){
letn = newNode(data,null,null);
if(!this.root){
returnthis.root = n;
}
let currentNode = this.root;
let parent = null;
while(1){
parent = currentNode;
if(data < currentNode.data){
currentNode = currentNode.left;
if(currentNode === null){
parent.left = n;
break;
}
}else{
currentNode = currentNode.right;
if(currentNode === null){
parent.right = n;
break;
}
}
}
}

remove(data){
this.root = this.removeNode(this.root,data)
}

removeNode(node,data){
if(node == null){
returnnull;
}

    if(data == node.data){
      // no children node
      if(node.left == null && node.right == null){
        returnnull;
      }
      if(node.left == null){
        returnnode.right;
      }
      if(node.right == null){
        returnnode.left;
      }

      let getSmallest = function(node){
        if(node.left === null && node.right == null){
          returnnode;
        }
        if(node.left != null){
          returnnode.left;
        }
        if(node.right !== null){
          returngetSmallest(node.right);
        }

      }
      let temNode = getSmallest(node.right);
      node.data = temNode.data;
      node.right = this.removeNode(temNode.right,temNode.data);
      returnnode;

    }elseif(data < node.data){
      node.left = this.removeNode(node.left,data);
      returnnode;
    }else{
      node.right = this.removeNode(node.right,data);
      returnnode;
    }

}

find(data){
varcurrent = this.root;
while(current != null){
if(data == current.data){
break;
}
if(data < current.data){
current = current.left;
}else{
current = current.right
}
}
returncurrent.data;
}

}

module.exports = BinarySearchTree;
```

### 堆排序

在 100000 个浮点数中找出最大的 1000 个数，时间复杂度最优 （用 堆排序 O(nlogn)）

## 字符串是否对称

```js
/// solution

function isBalanced(string) {
  let count = 0;
  for (let letter of string) {
    if (letter === '{') {
      count++;
    }
    if (letter === '}') {
      count--;

      // if a closing bracket doesn't have a matching
      // opening bracket, we should return early.
      if (count < 0) {
        return false;
      }
    }
  }
  return count === 0;
}

/// tests

import { test } from 'ava';

test(t => t.is(isBalanced('}{'), false));
test(t => t.is(isBalanced('{{}'), false));
test(t => t.is(isBalanced('{}{}'), true));
test(t => t.is(isBalanced('foo { bar { baz } boo }'), true));
test(t => t.is(isBalanced('foo { bar { baz }'), false));
test(t => t.is(isBalanced('foo { bar } }'), false));
```

# Java

## 小米-中国牛市

背包问题，可以设一个大小为 2 的背包。

状态转移方程如下：

```html
dp[i, j] = max(dp[i, j-1], prices[j] - prices[jj] + dp[i-1, jj]) { jj in range of [0, j-1] } = max(dp[i, j-1], prices[j]
+ max(dp[i-1, jj] - prices[jj]))
```

```java
public int calculateMax(int[] prices) {
    int n = prices.length;
    int[][] dp = new int[3][n];
    for (int i = 1; i <= 2; i++) {
        int localMax = dp[i - 1][0] - prices[0];
        for (int j = 1; j < n; j++) {
            dp[i][j] = Math.max(dp[i][j - 1], prices[j] + localMax);
            localMax = Math.max(localMax, dp[i - 1][j] - prices[j]);
        }
    }
    return dp[2][n - 1];
}
```

## 微软-LUCKY STRING

- 斐波那契数列可以预计算；
- 从头到尾遍历字符串的过程，每一轮循环都使用一个 Set 来保存从 i 到 j 出现的字符，并且 Set 保证了字符都不同，因此 Set 的大小就是不同字符的个数。

```java
Set<Integer> fibSet = new HashSet<>(Arrays.asList(1, 2, 3, 5, 8, 13, 21, 34, 55, 89));
Scanner in = new Scanner(System.in);
String str = in.nextLine();
int n = str.length();
Set<String> ret = new HashSet<>();
for (int i = 0; i < n; i++) {
    Set<Character> set = new HashSet<>();
    for (int j = i; j < n; j++) {
        set.add(str.charAt(j));
        int cnt = set.size();
        if (fibSet.contains(cnt)) {
            ret.add(str.substring(i, j + 1));
        }
    }
}
String[] arr = ret.toArray(new String[ret.size()]);
Arrays.sort(arr);
for (String s : arr) {
    System.out.println(s);
}
```

## 微软-Spring Outing

下面以 N = 3，K = 4 来进行讨论。

初始时，令第 0 个地方成为待定地点，也就是呆在家里。

从第 4 个地点开始投票，每个人只需要比较第 4 个地方和第 0 个地方的优先级，里，如果超过半数的人选择了第 4 个地方，那么更新第 4 个地方成为待定地点。

从后往前不断重复以上步骤，不断更新待定地点，直到所有地方都已经投票。

上面的讨论中，先令第 0 个地点成为待定地点，是因为这样的话第 4 个地点就只需要和这个地点进行比较，而不用考虑其它情况。如果最开始先令第 1 个地点成为待定地点，那么在对第 2 个地点进行投票时，每个人不仅要考虑第 2 个地点与第 1 个地点的优先级，也要考虑与其后投票地点的优先级。

```java
int N = in.nextInt();
int K = in.nextInt();
int[][] votes = new int[N][K + 1];
for (int i = 0; i < N; i++) {
    for (int j = 0; j < K + 1; j++) {
        int place = in.nextInt();
        votes[i][place] = j;
    }
}
int ret = 0;
for (int place = K; place > 0; place--) {
    int cnt = 0;
    for (int i = 0; i < N; i++) {
        if (votes[i][place] < votes[i][ret]) {
            cnt++;
        }
    }
    if (cnt > N / 2) {
        ret = place;
    }
}
System.out.println(ret == 0 ? "otaku" : ret);
```

## 去哪儿-二分查找

对于有重复元素的有序数组，二分查找需要注意以下要点：

- if (val <= A[m]) h = m;
- 因为 h 的赋值为 m 而不是 m - 1，因此 while 循环的条件也就为 l < h。（如果是 m - 1 循环条件为 l <= h）

```java
public int getPos(int[] A, int n, int val) {
    int l = 0, h = n - 1;
    while (l < h) {
        int m = l + (h - l) / 2;
        if (val <= A[m]) h = m;
        else l = m + 1;
    }
    return A[h] == val ? h : -1;
}
```

## 去哪儿-首个重复字符

```java
public char findFirstRepeat(String A, int n) {
    boolean[] hasAppear = new boolean[256];
    for (int i = 0; i < n; i++) {
        char c = A.charAt(i);
        if(hasAppear[c]) return c;
        hasAppear[c] = true;
    }
    return ' ';
}
```

## 去哪儿-寻找 Coder

```java
public String[] findCoder(String[] A, int n) {
    List<Pair<String, Integer>> list = new ArrayList<>();
    for (String s : A) {
        int cnt = 0;
        String t = s.toLowerCase();
        int idx = -1;
        while (true) {
            idx = t.indexOf("coder", idx + 1);
            if (idx == -1) break;
            cnt++;
        }
        if (cnt != 0) {
            list.add(new Pair<>(s, cnt));
        }
    }
    Collections.sort(list, (o1, o2) -> (o2.getValue() - o1.getValue()));
    String[] ret = new String[list.size()];
    for (int i = 0; i < list.size(); i++) {
        ret[i] = list.get(i).getKey();
    }
    return ret;
}

// 牛客网无法导入 javafx.util.Pair，这里就自己实现一下 Pair 类
private class Pair<T, K> {
    T t;
    K k;

    Pair(T t, K k) {
        this.t = t;
        this.k = k;
    }

    T getKey() {
        return t;
    }

    K getValue() {
        return k;
    }
}
```

## 美团-最大差值

贪心策略。

```java
public int getDis(int[] A, int n) {
    int max = 0;
    int soFarMin = A[0];
    for (int i = 1; i < n; i++) {
        if(soFarMin > A[i]) soFarMin = A[i];
        else max = Math.max(max, A[i]- soFarMin);
    }
    return max;
}
```

## 美团-字符串计数

字符串都是小写字符，可以把字符串当成是 26 进制。但是字典序的比较和普通的整数比较不同，是从左往右进行比较，例如 "ac" 和 "abc"，字典序的比较结果为 "ac" > "abc"，如果按照整数方法比较，因为 "abc" 是三位数，显然更大。

由于两个字符串的长度可能不想等，在 s1 空白部分和 s2 对应部分进行比较时，应该把 s1 的空白部分看成是 'a' 字符进行填充的。

还有一点要注意的是，s1 到 s2 长度为 len<sub>i</sub> 的字符串个数只比较前面 i 个字符。例如 'aaa' 和 'bbb' ，长度为 2 的个数为 'aa' 到 'bb' 的字符串个数，不需要考虑后面部分的字符。

在统计个数时，从 len1 开始一直遍历到最大合法长度，每次循环都统计长度为 i 的子字符串个数。

```java
String s1 = in.next();
String s2 = in.next();
int len1 = in.nextInt();
int len2 = in.nextInt();
int len = Math.min(s2.length(), len2);
int[] subtractArr = new int[len];
for (int i = 0; i < len; i++) {
    char c1 = i < s1.length() ? s1.charAt(i) : 'a';
    char c2 = s2.charAt(i);
    subtractArr[i] = c2 - c1;
}
int ret = 0;
for (int i = len1; i <= len; i++) {
    for (int j = 0; j < i; j++) {
        ret += subtractArr[j] * Math.pow(26, i - j - 1);
    }
}
System.out.println(ret - 1);
```

## 美团-平均年龄

```java
int W = in.nextInt();
double Y = in.nextDouble();
double x = in.nextDouble();
int N = in.nextInt();
while (N-- > 0) {
    Y++; // 老员工每年年龄都要加 1
    Y += (21 - Y) * x;
}
System.out.println((int) Math.ceil(Y));
```

## 百度-蘑菇阵

这题用回溯会超时，需要用 DP。

dp[i][j] 表示到达 (i,j) 位置不会触碰蘑菇的概率。对于 N\*M 矩阵，如果 i == N || j == M，那么 (i,j) 只能有一个移动方向；其它情况下能有两个移动方向。

考虑以下矩阵，其中第 3 行和第 3 列只能往一个方向移动，而其它位置可以有两个方向移动。

```java
int N = in.nextInt();
int M = in.nextInt();
int K = in.nextInt();
boolean[][] mushroom = new boolean[N][M];
while (K-- > 0) {
    int x = in.nextInt();
    int y = in.nextInt();
    mushroom[x - 1][y - 1] = true;
}
double[][] dp = new double[N][M];
dp[0][0] = 1;
for (int i = 0; i < N; i++) {
    for (int j = 0; j < M; j++) {
        if (mushroom[i][j]) dp[i][j] = 0;
        else {
            double cur = dp[i][j];
            if (i == N - 1 && j == M - 1) break;
            if (i == N - 1) dp[i][j + 1] += cur;
            else if (j == M - 1) dp[i + 1][j] += cur;
            else {
                dp[i][j + 1] += cur / 2;
                dp[i + 1][j] += cur / 2;
            }
        }
    }
}
System.out.printf("%.2f\n", dp[N - 1][M - 1]);
```
