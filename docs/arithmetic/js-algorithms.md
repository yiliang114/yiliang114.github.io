---
layout: CustomPages
title: 前端与数据结构-JS
date: 2020-09-04
aside: false
draft: true
---

# SF/js-algorithms/CTCI/ch1/1.4.js

```js
/**
 * Given a string, write a function to check if it is a permutation of a
 * palindrome. A palindrome is a word or phrase that is the same forwards and
 * backwards. A permutation is a rearrangement of letters.
 * The palindrome does not need to be limited to just dictionary words.
 */

/**
 *
 * O(N) time
 * O(N) space
 * @param {*} str the string to check
 * @return true if str is a permutaiton of a palindrome
 */
export default function palindromePermutation(str: string) {
  // create new string that ignores whitespace
  // for each character, use it as a key and icrment the value in a hash table
  // have a flag that allows only one character to appear once
  // check if all the values in the hash table === 2 or if at most one === 1
  const newStr = str.replace(/ /g, '').toLowerCase();
  const charCount = new Map();
  for (let i = 0; i < newStr.length; i++) {
    if (!charCount.get(newStr[i])) {
      charCount.set(newStr[i], 1);
    } else {
      charCount.set(newStr[i], charCount.get(newStr[i]) + 1);
    }
  }

  let flagCount = 0;
  for (let i = 0; i < newStr.length; i++) {
    if (charCount.get(newStr[i]) === 1) {
      flagCount += 1;
    }
    if (flagCount === 2) {
      return false;
    }
  }
  return true;
}
```

# SF/js-algorithms/CTCI/ch4/4.3.js

```js
/*
	List of Depths: Given a binary tree, design an algorithm which creates
	a linked list of all the nodes at each depth (e.g., if you have a tree with depth 0,
	you'll have 0 linked lists).
 */

export default function Node(value) {
  this.value = value;
  this.left = null;
  this.right = null;
}

Node.prototype.insert = function(value) {
  if (value < this.value) {
    if (!this.left) {
      return (this.left = new Node(value));
    }
    return this.left.insert(value);
  }

  return this.right ? this.right.insert(value) : (this.right = new Node(value));
};

Node.prototype.print = function() {
  const leftstr = this.left ? `${this.left.print()}, ` : '';
  return leftstr + this.value + (this.right ? `, ${this.right.print()}` : '');
};

const root = new Node(0); // start with a node at 0

Node.prototype.listify = function() {
  const lists = [[this.value]];
  let nextQueue = [this.right, this.left];

  let queue;

  while (nextQueue.length !== 0) {
    queue = nextQueue;
    nextQueue = [];
    const newlist = [];
    while (queue.length !== 0) {
      const node = queue.pop();
      if (node) {
        if (node.left) {
          nextQueue.unshift(node.left);
        }
        if (node.right) {
          nextQueue.unshift(node.right);
        }
        newlist.push(node.value);
      }
    }
    lists.push(newlist);
  }

  return lists;
};

root.listify();
```

# SF/js-algorithms/Complexity/Quadratic/README.md

Question 1

A quadratic algorithm with processing time T(n) = cn2 uses 500 elementary operations for processing 10 data items. How many will it use for processing 1000 data items?

T(10) = c · 10^2 = 500, that is

c = 500/100 = 5

T(1000) = 5 · 10002 = 5 · 10^6

that is, 5 million operations to process 1000 data items.

In fact, we need not compute c, because T(1000)

T(10) = c · 10^6

c · 10^2 = 10^4, so

that T(1000) = 10^4 · T(10) = 10^4 · 500, or 5 million.

source: M.J.Dinneen, G. Gimel’farb, M. C. Wilson: Introduction to Algorithms and Data Structures. 4th ed. (e-book), 2016, p.18/210.

# SF/js-algorithms/Complexity/Question1.js

```js
let a = 0;
const N = Infinity;
for (let i = 0; i < N; i++) {
  for (let j = N; j > i; j--) {
    a = a + i + j;
  }
}

// ANSWER: O(n^2)
```

# SF/js-algorithms/Complexity/Question2.js

```js
let j;
let k = 0;
const n = Infinity;
for (let i = n / 2; i <= n; i++) {
  for (j = 2; j <= n; j *= 2) {
    k += n / 2;
  }
}

// ANSWER: O(nLogn)
```

# SF/js-algorithms/Complexity/Question3.js

```js
let a = 0;
let i = n;
while (i > 0) {
  a += i;
  i /= 2;
}

// ANSWER: O(Logn)
```

# SF/js-algorithms/Complexity/Question4.js

```js
let a = 0;
const N = Infinity;
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    for (let k = 0; k < N; k++) {
      a = a + i + j;
    }
  }
}

// ANSWER: O(N^3)
```

# SF/js-algorithms/Complexity/README.md

### Complexity

# Examples of O(1)

- Accessing the length of an array
- Modulo Operator
- Setting/Accessing object values

# Examples of O(n)

- Iterating over elements in an array
- `.find()`, `.map()`, `.filter()`
- `===`, iterates over each char to check equality

# Examples of O(n^2)

- Nested `for` loop
- Assigning new values inside a `for` loop
- `===` inside a `for` loop: iterates over each char to check equality of each char

# SF/js-algorithms/DynamicProgramming/Coins.js

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

# SF/js-algorithms/General/ChSorting.js

```js
// Implement a method that sort words, but instead of using the normal
// alphabet a, b, c, ..., x, y, z, we have ch that goes between h and i
// in the sort order. So the alphabet becomes a, b, ... h, ch, i, ... x, y, z.

// Observations:
// will need for loop to check 'ch'
// compare words character by character
//
// Three cases:
// only a index is 'ch'
// only b index is 'ch'
// both a and b indicies are 'ch'
// neither are 'ch'

function isCh(word, i) {
  return i + 1 < word.length && word[i] === 'c' && word[i + 1] === 'h';
}

function compareTwoWords(a, b) {
  for (let i = 0, j = 0; i < a.length && j < b.length; i++, j++) {
    const aIsCh = isCh(a, i);
    const bIsCh = isCh(b, j);
    if (aIsCh || bIsCh) {
      if (aIsCh && bIsCh) {
        i++;
        j++;
        continue;
      }
      if (aIsCh) return b[j] <= 'h' ? 1 : -1;
      return a[i] <= 'h' ? -1 : 1;
    }
    if (a[i] === b[i]) {
      continue;
    }
    return a[i] < b[j] ? 1 : -1;
  }
  return 0;
}

export default function sortWords(words) {
  return words.sort(compareTwoWords);
}

// Test:
// console.log(sortWords(['indigo', 'charisma', 'hotel']));
```

# SF/js-algorithms/General/ParenthesesMatching.js

```js
import Stack from '../DataStructures/Stack';

const start = ['{', '(', '['];
const endings = ['}', ')', ']'];

const endingMappings = {
  '}': '{',
  ')': '(',
  ']': '[',
};

export default function isBalanced(string: string): boolean {
  const stack = new Stack();

  for (const char of Array.from(string)) {
    if (start.includes(char)) {
      stack.push(char);
      continue;
    }
    if (endings.includes(char)) {
      if (stack.empty()) return false;
      if (stack.pop() !== endingMappings[char]) return false;
    }
  }

  return stack.empty();
}
```

# SF/js-algorithms/General/PermutationStrings.js

```js
/**
 * Given two strings, write a method to decide if one is a permutation of the
 * other.
 * @flow
 */

/**
 * Complexity: O(n)
 */
export default function PermutationString(first: string, second: string): boolean {
  if (first.length !== second.length) return false;

  const _first: Map<string, number> = new Map();

  for (const char of first) {
    if (_first.has(char)) {
      const some = _first.get(char);
      _first.set(char, some + 1);
    } else {
      _first.set(char, 1);
    }
  }

  for (const _char of second) {
    if (_first.has(_char)) {
      const foo = _first.get(_char);
      if (foo) {
        _first.set(_char, foo - 1);
      }
    }
  }

  for (const val of _first.values()) {
    if (val !== 0) return false;
  }

  return true;
}

/**
 * Complexity: O(nlogn)
 */
export function PermutationStringInPlace(first: string, second: string): boolean {
  if (first.length !== second.length) return false;

  const _first = first.split('').sort();
  const _second = second.split('').sort();

  for (let i = 0; i < _first.length; i++) {
    if (_first[i] !== _second[i]) return false;
  }

  return true;
}
```

# SF/js-algorithms/General/PrintKDistance.js

```js
// Given a string S, and an integer K, rearrange the string such that
// similar characters are at least K distance apart.

// Example:

// S = AAABBBCC, K = 3
// Result : ABCABCABC (all 'A's are 3 distance apart, similarly with
// B's and C's)

// S = AAABC, K=2 : Not possible. (EDIT : k=3 is not possible).

// S = AAADBBCC, K = 2:
// Result: ABCABCDA

function PrintKDistance(string) {
  const chars = Array.from(string);
  const map = new Map();

  for (const char of chars) {
    if (map.has(char)) {
      map.set(char, map.get(char) + 1);
    } else {
      map.set(char, 1);
    }
  }

  let str = '';

  const itr = 1000;
  let i = 0;

  while (map.size > 0) {
    for (const key of map.keys()) {
      str += key;
      // Decrement key
      map.set(key, map.get(key) - 1);
      // If key = 0, remove
      if (map.get(key) === 0) {
        map.delete(key);
      }
    }
    if (i > itr) {
      break;
    }
    i++;
  }

  return str;
}

PrintKDistance('AAABBBCC');
```

# SF/js-algorithms/LeetCode/Hard/212.js

```js
const findWordsAux = (board, trie, i, j, char, visited, ans) => {
  if (i < 0 || j < 0 || i >= board.length || j >= board[0].length) return;
  if (visited[i][j] === 1) return;
  if (!trie.has(board[i][j])) return;
  char += board[i][j];
  const child = trie.get(board[i][j]);
  if (child.has('END')) {
    ans.push(char);
  }
  visited[i][j] = 1;
  findWordsAux(board, child, i, j - 1, char, visited, ans);
  findWordsAux(board, child, i, j + 1, char, visited, ans);
  findWordsAux(board, child, i - 1, j, char, visited, ans);
  findWordsAux(board, child, i + 1, j, char, visited, ans);
  visited[i][j] = 0;
};

const createTrie = words => {
  const trie = new Map();
  for (const word of words) {
    let tmp = trie;
    for (const char of Array.from(word)) {
      if (!tmp.has(char)) {
        tmp.set(char, new Map());
      }
      tmp = tmp.get(char);
    }
    tmp.set('END', null);
  }
  return trie;
};

/**
 * @param {character[][]} board
 * @param {string[]} words
 * @return {string[]}
 */
export default function findWords(board, words) {
  // build a trie
  const trie = createTrie(words);
  const ans = [];
  const visited = [];
  for (let i = 0; i < board.length; i++) {
    visited[i] = [];
    for (let j = 0; j < board[i].length; j++) {
      visited[i][j] = 0;
    }
  }
  // Iterate over each position and call recursively
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      findWordsAux(board, trie, i, j, '', visited, ans);
    }
  }
  return Array.from(new Set(ans));
}
```

# SF/js-algorithms/LeetCode/Medium/102.js

```js
// 102. Binary Tree Level Order Traversal

// Given a binary tree, return the level order traversal of its nodes' values. (ie, from left to right, level by level).

// For example:
// Given binary tree [3,9,20,null,null,15,7],

//     3
//    / \
//   9  20
//     /  \
//    15   7
// return its level order traversal as:

// [
//   [3],
//   [9,20],
//   [15,7]
// ]

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
export default function levelOrder(root) {
  if (!root) return [];
  const queue = [];
  queue.push(root);
  const ans = [];
  const depths = new Map();
  depths.set(root, 0);
  let prev;
  let arr = [];
  while (queue.length) {
    const item = queue.shift();
    const depth = depths.get(item);
    if (!prev || (prev && depths.get(prev) !== depths.get(item))) {
      arr = [];
      ans.push(arr);
    }
    arr.push(item.val);
    if (item.left) {
      depths.set(item.left, depth + 1);
      queue.push(item.left);
    }
    if (item.right) {
      depths.set(item.right, depth + 1);
      queue.push(item.right);
    }
    prev = item;
  }
  return ans;
}
```

# SF/js-algorithms/LeetCode/Medium/11.js

```js
// Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of line i is at (i, ai) and (i, 0). Find two lines, which together with x-axis forms a container, such that the container contains the most water.

// Note: You may not slant the container and n is at least 2.

/**
 * @param {number[]} height
 * @return {number}
 */
export default function maxArea(height) {
  let width = height.length - 1;
  let lo = 0;
  let hi = height.length - 1;
  let max = 0;
  while (lo < hi) {
    const loVal = height[lo];
    const hiVal = height[hi];
    max = Math.max(max, width * Math.min(hiVal, loVal));
    if (loVal < hiVal) {
      lo++;
    } else {
      hi--;
    }
    width--;
  }
  return max;
}
```

# SF/js-algorithms/LeetCode/Medium/117.js

```js
// 117. Populating Next Right Pointers in Each Node II

// Given a binary tree

// struct Node {
//   int val;
//   Node *left;
//   Node *right;
//   Node *next;
// }
// Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to NULL.

// Initially, all next pointers are set to NULL.

/**
 * // Definition for a Node.
 * function Node(val,left,right,next) {
 *    this.val = val;
 *    this.left = left;
 *    this.right = right;
 *    this.next = next;
 * };
 */
/**
 * @param {Node} root
 * @return {Node}
 */
export default function connect(root) {
  // BFS
  if (!root) return root;
  const depth = new Map();
  // For each level of tree, point
  const queue = [];
  queue.push(root);
  depth.set(root, 0);
  let prev;
  while (queue.length) {
    const item = queue.shift();
    const d = depth.get(item);
    if (prev && d === depth.get(prev)) {
      prev.next = item;
    } else if (prev) prev.next = null;
    prev = item;
    if (item.left) {
      queue.push(item.left);
      depth.set(item.left, d + 1);
    }
    if (item.right) {
      queue.push(item.right);
      depth.set(item.right, d + 1);
    }
  }
  return root;
}
```

# SF/js-algorithms/LeetCode/Medium/142.js

```js
// 142. Linked List Cycle II

// Given a linked list, return the node where the cycle begins. If there is no cycle, return null.

// To represent a cycle in the given linked list, we use an integer pos which represents the position (0-indexed) in the linked list where tail connects to. If pos is -1, then there is no cycle in the linked list.

// Note: Do not modify the linked list.

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
export default function detectCycle(head) {
  let i = 0;
  const map = new Map();
  if (!head) return null;
  let curr = head;
  while (curr && curr.next) {
    map.set(curr, i);
    curr = curr.next;
    if (map.has(curr)) return curr;
    i++;
  }
  return null;
}
```

# SF/js-algorithms/LeetCode/Medium/17.js

```js
// 17. Letter Combinations of a Phone Number

// Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.

// A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

// Example:

// Input: "23"
// Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].

/**
 * @param {string} digits
 * @return {string[]}
 */
export default function letterCombinations(digits) {
  if (digits.length === 0) return [];
  const dict = new Map([
    ['2', ['a', 'b', 'c']],
    ['3', ['d', 'e', 'f']],
    ['4', ['g', 'h', 'i']],
    ['5', ['j', 'k', 'l']],
    ['6', ['m', 'n', 'o']],
    ['7', ['p', 'q', 'r', 's']],
    ['8', ['t', 'u', 'v']],
    ['9', ['w', 'x', 'y', 'z']],
  ]);
  const queue = [...dict.get(digits[0])];
  if (digits.length === 1) return queue;
  const res = [];
  while (queue.length) {
    const item = queue.shift();
    if (item.length === digits.length) {
      res.push(item);
    } else {
      for (const a of dict.get(digits[item.length])) {
        queue.push(item + a);
      }
    }
  }
  return res;
}
```

# SF/js-algorithms/LeetCode/Medium/199.js

```js
// 199. Binary Tree Right Side View

// Given a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

// Example:

// Input: [1,2,3,null,5,null,4]
// Output: [1, 3, 4]
// Explanation:

//    1            <---
//  /   \
// 2     3         <---
//  \     \
//   5     4       <---

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */

const getDepth = (node, depth, map) => {
  if (!node) return;
  map.set(node, depth);
  if (node.left) getDepth(node.left, depth + 1, map);
  if (node.right) getDepth(node.right, depth + 1, map);
};

export default function rightSideView(root) {
  // BFS from right to left
  const queue = [];
  const map = new Map();
  getDepth(root, 0, map);
  const ans = [];
  if (!root) return [];
  const set = new Set();

  queue.push(root);
  while (queue.length) {
    const item = queue.shift();
    if (map.has(item)) {
      if (item.right) queue.push(item.right);
      if (item.left) queue.push(item.left);
      if (!set.has(map.get(item))) {
        ans.push(item.val);
        set.add(map.get(item));
      }
    }
  }
  return ans;
}
```

# SF/js-algorithms/LeetCode/Medium/2.js

```js
// 2. Add Two Numbers

// You are given two non-empty linked lists representing two non-negative integers. The digits
// are stored in reverse order and each of their nodes contain a single digit. Add the two
// numbers and return it as a linked list.

// You may assume the two numbers do not contain any leading zero, except the number 0 itself.

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
import { ListNode } from '../globals';

export default function addTwoNumbers(l1, l2) {
  let carry = false;
  let ans;
  let prev;
  while (l1 || l2 || carry) {
    const val1 = (l1 && l1.val) || 0;
    const val2 = (l2 && l2.val) || 0;
    let sum = val1 + val2;
    if (carry) sum++;
    carry = sum > 9;
    const mod = sum % 10;
    if (ans) {
      prev.next = new ListNode(mod);
      prev = prev.next;
    } else {
      ans = new ListNode(mod);
      prev = ans;
    }
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return ans;
}
```

# SF/js-algorithms/LeetCode/Medium/207.js

```js
// https://leetcode.com/problems/course-schedule/

// There are a total of n courses you have to take, labeled from 0 to n-1.

// Some courses may have prerequisites, for example to take course 0 you have to first take course 1, which is expressed as a pair: [0,1]

// Given the total number of courses and a list of prerequisite pairs, is it possible for you to finish all courses?

/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */

const topsort = (numCourses, prereqs) => {
  const sortedOrder = [];
  // construct outdegree
  if (!prereqs.length) return true;

  const indegrees = new Array(numCourses);
  const graph = new Array(numCourses);
  for (let i = 0; i < numCourses; i++) {
    graph[i] = [];
    indegrees[i] = 0;
  }
  for (const pair of prereqs) {
    const [a, b] = pair;
    // add outdegrees
    graph[b].push(a);
    indegrees[a]++;
  }
  // Find vertices with indeg 0
  const queue = [];
  for (let i = 0; i < indegrees.length; i++) {
    if (indegrees[i] === 0) {
      queue.push(i);
    }
  }
  if (queue.length === 0) return false;
  while (queue.length) {
    const v = queue.shift();
    sortedOrder.push(v);
    for (const outgoing of graph[v]) {
      indegrees[outgoing]--;
      if (indegrees[outgoing] === 0) {
        queue.push(outgoing);
      }
    }
  }
  return sortedOrder.length === numCourses;
};

export default function canFinish(numCourses, prerequisites) {
  return topsort(numCourses, prerequisites);
}
```

# SF/js-algorithms/LeetCode/Medium/209.js

```js
// 209. Minimum Size Subarray Sum

// Given an array of n positive integers and a positive integer s, find the minimal length of a contiguous subarray of which the sum ≥ s. If there isn't one, return 0 instead.

// Example:

// Input: s = 7, nums = [2,3,1,2,4,3]
// Output: 2
// Explanation: the subarray [4,3] has the minimal length under the problem constraint.
// Follow up:
// If you have figured out the O(n) solution, try coding another solution of which the time complexity is O(n log n).

/**
 * @param {number} s
 * @param {number[]} nums
 * @return {number}
 */
export default function minSubArrayLen(s, nums) {
  let result = Number.MAX_SAFE_INTEGER;
  let left = 0;
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (result === 1) return 1;
    sum += nums[i];
    while (sum >= s) {
      result = Math.min(i - left + 1, result);
      sum -= nums[left];
      left++;
    }
  }
  return result === Number.MAX_SAFE_INTEGER ? 0 : result;
}
```

# SF/js-algorithms/LeetCode/Medium/229.js

```js
// 229. Majority Element II

// Given an integer array of size n, find all elements that appear more than ⌊ n/3 ⌋ times.

// Note: The algorithm should run in linear time and in O(1) space.

// Example 1:

// Input: [3,2,3]
// Output: [3]
// Example 2:

// Input: [1,1,1,3,3,2,2,2]
// Output: [1,2]

/**
 * @param {number[]} nums
 * @return {number[]}
 */
export default function majorityElement(nums) {
  if (!nums.length) return [];
  let count1 = 0;
  let count2 = 0;
  let maj1 = null;
  let maj2 = null;
  // Find the two numbers that occur the most
  for (const num of nums) {
    if (num === maj1) {
      count1++;
    } else if (num === maj2) {
      count2++;
    } else if (count1 === 0) {
      maj1 = num;
      count1 = 1;
    } else if (count2 === 0) {
      maj2 = num;
      count2 = 1;
    } else {
      count1--;
      count2--;
    }
  }
  // Filter any of the two numbers that do not occur more than len / 3 times
  return [maj1, maj2].filter(e => {
    let i = 0;
    for (const num of nums) {
      if (num === e) {
        i++;
      }
    }
    return i > nums.length / 3;
  });
}
```

# SF/js-algorithms/LeetCode/Medium/230.js

```js
// 230. Kth Smallest Element in a BST

// Given a binary search tree, write a function kthSmallest to find the kth smallest element in it.

// Note:
// You may assume k is always valid, 1 ≤ k ≤ BST's total elements.

// Example 1:

// Input: root = [3,1,4,null,2], k = 1
//    3
//   / \
//  1   4
//   \
//    2
// Output: 1
// Example 2:

// Input: root = [5,3,6,2,4,null,null,1], k = 3
//        5
//       / \
//      3   6
//     / \
//    2   4
//   /
//  1
// Output: 3
// Follow up:
// What if the BST is modified (insert/delete operations) often and you need to find the kth smallest frequently? How would you optimize the kthSmallest routine?

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

const kthSmallestAux = (root, ans) => {
  if (!root) return;
  if (root.left) kthSmallestAux(root.left, ans);
  ans.push(root.val);
  if (root.right) kthSmallestAux(root.right, ans);
};

/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
export default function kthSmallest(root, k) {
  if (!root) return -1;
  const ans = [];
  kthSmallestAux(root, ans);
  return ans[k - 1];
}
```

# SF/js-algorithms/LeetCode/Medium/236.js

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */

const trav = (root, node, path, paths) => {
  if (root === null) return;
  path.push(root);
  if (root.val === node.val) {
    paths.push(path);
    return;
  }
  if (root.left) trav(root.left, node, [...path], paths);
  if (root.right) trav(root.right, node, [...path], paths);
};

export default function lowestCommonAncestor(root, p, q) {
  let set = new Set();
  {
    const paths = [];
    trav(root, p, [], paths);
    if (!paths.length) return -1;
    const [path] = paths;
    if (path) set = new Set(path);
  }
  const paths = [];
  trav(root, q, [], paths);
  if (!paths.length) return -1;
  const [path] = paths;
  for (const item of path) {
    if (set.has(item)) return item;
  }
}
```

# SF/js-algorithms/LeetCode/Medium/300.js

```js
// 300. Longest Increasing Subsequence

// Given an unsorted array of integers, find the length of longest increasing subsequence.

// Example:

// Input: [10,9,2,5,3,7,101,18]
// Output: 4
// Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.
// Note:

// There may be more than one LIS combination, it is only necessary for you to return the length.
// Your algorithm should run in O(n2) complexity.

/**
 * @param {number[]} nums
 * @return {number}
 */
export default function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1);

  // current num
  for (let i = 1; i < nums.length; i++) {
    // nums before current num
    let max = 0;
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        max = Math.max(dp[j], max);
      }
    }
    dp[i] = max + dp[i];
  }

  let max = 0;
  for (let i = 0; i < dp.length; i++) {
    if (dp[i] > max) max = dp[i];
  }

  return max;
}
```

# SF/js-algorithms/LeetCode/Medium/310.js

```js
// For an undirected graph with tree characteristics, we can choose any node
// as the root. The result graph is then a rooted tree. Among all possible rooted trees, those with minimum height are called minimum height trees (MHTs). Given such a graph, write a function to find all the MHTs and return a list of their root labels.

// Format
// The graph contains n nodes which are labeled from 0 to n - 1. You will be given the
// number n and a list of undirected edges (each edge is a pair of labels).

// You can assume that no duplicate edges will appear in edges. Since all edges are
// undirected, [0, 1] is the same as [1, 0] and thus will not appear together in edges.

// Observations:
// The height of a graph is maximal when the tree is rooted at a leaf. Another observation
// is that the nodes in the centermost of the graph have the lowest height when chosen to
// be the root. The procedure is then to delete leaves until there are are either only one
// or two nodes left.

/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number[]}
 */
export default function findMinHeightTrees(n, edges) {
  if (n === 2) return edges[0];
  const adj = new Array(n);
  for (let i = 0; i < n; i++) {
    adj[i] = new Set();
  }
  for (const edge of edges) {
    const [a, b] = edge;
    adj[a].add(b);
    adj[b].add(a);
  }
  const ans = new Set();
  for (let i = 0; i < n; i++) {
    ans.add(i);
  }
  // Find leaves and add them to queue
  const queue = [];
  const a = [];
  for (let i = 0; i < n; i++) {
    if (adj[i].size === 1) {
      a.push(i);
    }
  }
  queue.push(a);

  // While set has more than two nodes, remove them
  while (queue.length) {
    const nodes = queue.shift();
    const b = [];
    for (const node of nodes) {
      ans.delete(node);
      // delete the edges from the current node to other nodes
      for (const child of adj[node]) {
        adj[child].delete(node);
        adj[node].delete(child);
        if (adj[child].size === 1) {
          b.push(child);
        }
      }
    }
    if (ans.size < 3) break;
    if (b.length) queue.push(b);
  }

  return Array.from(ans);
}
```

# SF/js-algorithms/LeetCode/Medium/33.js

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
const binSearch = (nums, target, n, m) => {
  if (n === m || m < n) {
    return nums[n] === target ? n : -1;
  }
  const mid = Math.floor((n + m) / 2);
  if (target === nums[mid]) return mid;
  // console.log(n, m, mid)
  if (target > nums[mid]) {
    return binSearch(nums, target, mid + 1, m);
  }
  return binSearch(nums, target, n, mid - 1);
};

export default function search(nums, target) {
  if (nums.length === 0) return -1;
  if (nums.length === 1) return nums[0] === target ? 0 : -1;

  let low = 0;
  let high = nums.length - 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] > nums[high]) low += 1;
    else high = mid;
  }

  const minIndex = low;
  const maxIndex = low - 1;

  if (nums[0] < nums[nums.length - 1]) {
    return binSearch(nums, target, 0, nums.length - 1);
  }

  if (target > nums[0]) {
    return binSearch(nums, target, 1, maxIndex);
  }
  if (target < nums[0]) {
    return binSearch(nums, target, minIndex, nums.length - 1);
  }
  return 0;
}
```

# SF/js-algorithms/LeetCode/Medium/34.js

```js
// 34. Find First and Last Position of Element in Sorted Array

// Given an array of integers nums sorted in ascending order, find the starting and ending position of a given target value.

// Your algorithm's runtime complexity must be in the order of O(log n).

// If the target is not found in the array, return [-1, -1].

// Input: nums = [5,7,7,8,8,10], target = 8
// Output: [3,4]

// Input: nums = [5,7,7,8,8,10], target = 6
// Output: [-1,-1]

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

const binSearch = (nums, lo, hi, target, left) => {
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (left) {
      if (nums[lo] === target) return lo;
      if (hi - lo === 1) return hi;
      if (nums[mid] < target) lo = mid;
      else hi = mid;
    } else {
      if (nums[hi] === target) return hi;
      if (hi - lo === 1) return lo;
      if (nums[mid] > target) hi = mid;
      else lo = mid;
    }
  }
};

export default function searchRange(nums, target) {
  if (nums.length === 0) return [-1, -1];
  // bin search for target.
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  if (nums[lo] !== target) return [-1, -1];

  // if left and right not equal to target, we are done
  if (nums[lo - 1] !== target && nums[lo + 1] !== target) return [lo, lo];

  if (nums.length === 2) return [0, 1];

  // if left of target not equal to target, find left
  const left = nums[hi - 1] === target ? binSearch(nums, 0, lo, target, true) : hi;

  // if right of target not equal to target, find right
  const right = nums[lo + 1] === target ? binSearch(nums, hi, nums.length - 1, target, false) : lo;

  return [left, right];
}
```

# SF/js-algorithms/LeetCode/Medium/36.js

```js
// 36. Valid Sudoku

// Determine if a 9x9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:

// Each row must contain the digits 1-9 without repetition.
// Each column must contain the digits 1-9 without repetition.
// Each of the 9 3x3 sub-boxes of the grid must contain the digits 1-9 without repetition.

/**
 * @param {character[][]} board
 * @return {boolean}
 */

const isNum = n => n !== '.';
const validateRow = (board, row) => {
  const set = new Set();
  for (let i = 0; i < board.length; i++) {
    if (isNum(board[row][i]) && set.has(board[row][i])) return false;
    set.add(board[row][i]);
  }
  return true;
};
const validateCol = (board, col) => {
  const set = new Set();
  for (let i = 0; i < board.length; i++) {
    if (isNum(board[i][col]) && set.has(board[i][col])) return false;
    set.add(board[i][col]);
  }
  return true;
};
const validateSquare = (board, i, j) => {
  const imin = i * 3;
  const imax = imin + 2;
  const jmin = j * 3;
  const jmax = jmin + 2;
  const set = new Set();
  for (let i = imin; i <= imax; i++) {
    for (let j = jmin; j <= jmax; j++) {
      if (isNum(board[i][j]) && set.has(board[i][j])) return false;
      set.add(board[i][j]);
    }
  }
  return true;
};

export default function isValidSudoku(board) {
  for (let i = 0; i < board.length; i++) {
    if (!validateRow(board, i)) return false;
  }
  for (let i = 0; i < board.length; i++) {
    if (!validateCol(board, i)) return false;
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!validateSquare(board, i, j)) return false;
    }
  }
  return true;
}
```

# SF/js-algorithms/LeetCode/Medium/380.js

```js
// Design a data structure that supports all following operations in average O(1) time.

// insert(val): Inserts an item val to the set if not already present.
// remove(val): Removes an item val from the set if present.
// getRandom: Returns a random element from current set of elements. Each element must have the same probability of being returned.
// Example:

// // Init an empty set.
// RandomizedSet randomSet = new RandomizedSet();

// // Inserts 1 to the set. Returns true as 1 was inserted successfully.
// randomSet.insert(1);

// // Returns false as 2 does not exist in the set.
// randomSet.remove(2);

// // Inserts 2 to the set, returns true. Set now contains [1,2].
// randomSet.insert(2);

// // getRandom should return either 1 or 2 randomly.
// randomSet.getRandom();

// // Removes 1 from the set, returns true. Set now contains [2].
// randomSet.remove(1);

// // 2 was already in the set, so return false.
// randomSet.insert(2);

// // Since 2 is the only number in the set, getRandom always return 2.
// randomSet.getRandom();

// Observations:
// use an array for order
// keep track of array indicies mapping to set key
//
// remove:
//   swap with last element, then delete
//   then delete from mappings
// insert:
//   add to end of array
//   then add to mappings
// getRandom:
//   get random array element from array and return

/**
 * Initialize your data structure here.
 */
export default class RandomizedSet {
  constructor() {
    this.set = new Set();
    this.mappings = new Map();
    this.randomArray = [];
    this.last = -1;
  }

  /**
   * Inserts a value to the set. Returns true if the set did not already contain the specified element.
   * @param {number} val
   * @return {boolean}
   */
  insert(val) {
    if (this.set.has(val)) return false;
    this.set.add(val);
    this.last++;
    this.randomArray[this.last] = val;
    this.mappings.set(val, this.last);
    return true;
  }

  /**
   * Removes a value from the set. Returns true if the set contained the specified element.
   * @param {number} val
   * @return {boolean}
   */
  remove(val) {
    if (!this.set.has(val)) return false;
    this.set.delete(val);
    const itemIndex = this.mappings.get(val);
    const last = this.randomArray[this.last];
    this.randomArray[this.last] = undefined;
    this.randomArray[itemIndex] = last;
    this.mappings.set(last, itemIndex);
    this.mappings.delete(val);
    this.last--;
    return true;
  }

  /**
   * Get a random element from the set.
   * @return {number}
   */
  getRandom() {
    const index = Math.floor(Math.random() * (this.last + 1));
    return this.randomArray[index];
  }
}
```

# SF/js-algorithms/LeetCode/Medium/394.js

```js
/**
 * Given an encoded string, return it's decoded string.
 * The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets
 * is being repeated exactly k times. Note that k is guaranteed to be a positive integer.
 * You may assume that the input string is always valid; No extra white spaces, square
 * brackets are well-formed, etc.
 * Furthermore, you may assume that the original data does not contain any digits and
 * that digits are only for those repeat numbers, k. For example, there won't be input
 * like 3a or 2[4].
 *
 * Examples:
 * s = "3[a]2[bc]", return "aaabcbc".
 * s = "3[a2[c]]", return "accaccacc".
 * s = "2[abc]3[cd]ef", return "abcabccdcdcdef".
 *
 * Approach:
 * We see that brackets can be nested, so from this, we can deduce that the algorithm can probably
 * be solved recursively
 *
 * We need to expand the mostly deeply nested, or innermost, strings first. Maybe we can add them
 * to a stack. The top-most elements would be the innermost strings:
 *
 * Example: "3[a2[c]]"
 *
 *   "3[a2[c]]"
 *    "a2[c]"
 *     "2[c]"
 *      "c"
 *     "cc"
 *     "acc"
 *   "accaccacc"
 *
 * @flow
 */
function joinNTimes(string: string, n: number): string {
  return new Array(n + 1).join(string);
}

export default function DecodeString(string: string, continuingString: string = ''): string {
  const chars = Array.from(string);

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (!Number.isNaN(parseInt(char))) {
      // console.log(continuingString);
      continuingString += joinNTimes(DecodeString(chars.slice(i + 2, chars.length - 1)), parseInt(char));
    }

    if (char === ']') {
      return continuingString;
    }

    if (char !== '[' && char !== ']') {
      continuingString += char;
    }
  }

  return continuingString;
}

console.log(DecodeString('3[a]2[bc]'));
// console.log(DecodeString('3[a2[c]]'));
```

# SF/js-algorithms/LeetCode/Medium/457.js

```js
// You are given an array of positive and negative integers. If a number n at
// an index is positive, then move forward n steps. Conversely, if it's
// negative (-n), move backward n steps. Assume the first element of the array
// is forward next to the last element, and the last element is backward next
// to the first element. Determine if there is a loop in this array. A loop
// starts and ends at a particular index with more than 1 element along the
// loop. The loop must be "forward" or "backward'.
//
// Example 1: Given the array [2, -1, 1, 2, 2], there is a loop, from index 0 -> 2 -> 3 -> 0.
//
// Example 2: Given the array [-1, 2], there is no loop.
//
// Note: The given array is guaranteed to contain no element "0".
//
// Can you do it in O(n) time complexity and O(1) space complexity?
//

import { expect } from 'chai';

function CircularArrayLoop(nums: number[]): boolean {
  const _nums = new Set();
  let ended = false;
  let index = 0;

  while (!ended) {
    if (!_nums.has(index)) {
      _nums.add(index);
    } else {
      ended = false;
    }

    index += nums[index];
  }

  return false;
}

test('CircularArrayLoop()', () => {
  expect(CircularArrayLoop([2, -1, 1, 2, 2])).instanceOf(Array);
});
```

# SF/js-algorithms/LeetCode/Medium/515.js

```js
// 515. Find Largest Value in Each Tree Row

// You need to find the largest value in each row of a binary tree.

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
const largestValuesAux = (root, depth, map) => {
  // DFS
  if (!root) return;
  if (Number.isInteger(map[depth])) {
    if (map[depth] < root.val) {
      map[depth] = root.val;
    }
  } else {
    map[depth] = root.val;
  }
  if (root.left) largestValuesAux(root.left, depth + 1, map);
  if (root.right) largestValuesAux(root.right, depth + 1, map);
};

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
export default function largestValues(root) {
  const map = [];
  largestValuesAux(root, 0, map);
  return map;
}
```

# SF/js-algorithms/LeetCode/Medium/56.js

```js
// 56. Merge Intervals

// Given a collection of intervals, merge all overlapping intervals.

// Example 1:

// Input: [[1,3],[2,6],[8,10],[15,18]]
// Output: [[1,6],[8,10],[15,18]]
// Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into [1,6].
// Example 2:

// Input: [[1,4],[4,5]]
// Output: [[1,5]]
// Explanation: Intervals [1,4] and [4,5] are considered overlapping.

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
export default function merge(intervals) {
  if (intervals.length === 0) return [];
  if (intervals.length === 1) return intervals;
  intervals = intervals.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });
  let start = intervals[0][0];
  let end = intervals[0][1];
  const ans = [];
  for (let i = 0; i < intervals.length - 1; i++) {
    const left = intervals[i];
    const right = intervals[i + 1];
    if (right[0] <= end && right[1] >= end) {
      end = right[1]; // then overlap
    } else if (right[0] > end) {
      ans.push([start, end]);
      start = right[0];
      end = right[1];
    }
    if (i === intervals.length - 2) ans.push([start, end]);
  }
  return ans;
}
```

# SF/js-algorithms/LeetCode/Medium/583.js

```js
// Given two words word1 and word2, find the minimum number of steps required
// to make word1 and word2 the same, where in each step you can delete one
// character in either string.

// Example:
// Input: "sea", "eat"
// Output: 2
// Explanation: You need one step to make "sea" to "ea" and another step to make "eat" to "ea".

// Note:
// The length of given words won't exceed 500.
// Characters in given words can only be lower-case letters.

/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */

/**
 * Longest common subsequence
 */
const LCS = (a, b, n, m, mat) => {
  if (n < 0 || m < 0) return 0;
  if (mat[n][m] !== undefined) return mat[n][m];

  let res;
  if (a[n] === b[m]) {
    res = 1 + LCS(a, b, n - 1, m - 1, mat);
  } else {
    res = Math.max(LCS(a, b, n - 1, m, mat), LCS(a, b, n, m - 1, mat));
  }

  mat[n][m] = res;

  return res;
};

export default function minDistance(word1, word2) {
  // Initialize DP table
  const mat = Array.from(Array(word1.length), () => new Array(word2.length));
  const lcsLength = LCS(word1, word2, word1.length - 1, word2.length - 1, mat);
  return word1.length - lcsLength + word2.length - lcsLength;
}
```

# SF/js-algorithms/LeetCode/Medium/61.js

```js
// 61. Rotate List

// Given a linked list, rotate the list to the right by k places, where k is non-negative.

// Example 1:

// Input: 1->2->3->4->5->NULL, k = 2
// Output: 4->5->1->2->3->NULL
// Explanation:
// rotate 1 steps to the right: 5->1->2->3->4->NULL
// rotate 2 steps to the right: 4->5->1->2->3->NULL
// Example 2:

// Input: 0->1->2->NULL, k = 4
// Output: 2->0->1->NULL
// Explanation:
// rotate 1 steps to the right: 2->0->1->NULL
// rotate 2 steps to the right: 1->2->0->NULL
// rotate 3 steps to the right: 0->1->2->NULL
// rotate 4 steps to the right: 2->0->1->NULL

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
export default function rotateRight(head, k) {
  let len = 0;
  let curr = head;
  let tail = curr;
  while (curr !== null) {
    tail = curr;
    curr = curr.next;
    len++;
  }
  k %= len;
  if (len <= 1 || k === 0) return head;
  curr = head;
  for (let i = 0; i < len - k - 1; i++) {
    curr = curr.next;
  }
  const nextHead = curr.next;
  tail.next = head;
  head = nextHead;
  curr.next = null;
  return head;
}
```

# SF/js-algorithms/LeetCode/Medium/64.js

```js
// Given a m x n grid filled with non-negative numbers, find a path from top left to bottom
// right which minimizes the sum of all numbers along its path.

// Note: You can only move either down or right at any point in time.

// Input:
// [
//   [1,3,1],
//   [1,5,1],
//   [4,2,1]
// ]
// Output: 7
// Explanation: Because the path 1→3→1→1→1 minimizes the sum.

// Observations:
// This is a DP problem. The shortest path of location i, j is the Min of down or right

/**
 * @param {number[][]} grid
 * @return {number}
 */

const traverse = (grid, i, j, dpTable) => {
  if (i === grid.length - 1 && j === grid[0].length - 1) return grid[i][j];
  if (i < 0 || j < 0 || i === grid.length || j === grid[0].length) return Infinity;
  if (dpTable[i][j]) return dpTable[i][j];
  const min = Math.min(traverse(grid, i + 1, j, dpTable), traverse(grid, i, j + 1, dpTable));
  const res = grid[i][j] + min;
  dpTable[i][j] = res;
  return res;
};

export default function minPathSum(grid) {
  const dpTable = new Array(grid.length);
  for (let i = 0; i < grid.length; i++) {
    dpTable[i] = [];
  }
  return traverse(grid, 0, 0, dpTable);
}
```

# SF/js-algorithms/LeetCode/Medium/74.js

```js
const binSearch = (nums, target) => {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return true;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo] === target;
};

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
export default function searchMatrix(matrix, target) {
  if (matrix.length === 0) return false;
  let lo = 0;
  let hi = matrix.length - 1;
  while (lo < hi) {
    // Search the middle row
    const mid = Math.floor((lo + hi) / 2);
    // If # is in range of the row then bin search row
    if (matrix[mid].length === 0) return false;
    if (matrix[mid][0] <= target && target <= matrix[mid][matrix[mid].length - 1]) {
      return binSearch(matrix[mid], target);
    }
    if (matrix[mid][0] > target) {
      // if less than range, search rows between middle row and first row
      hi = mid - 1;
    } else {
      // search rows between middle row and last row
      lo = mid + 1;
    }
    if (hi < lo) return false;
    if (lo === hi) return binSearch(matrix[lo], target);
  }
  if (lo === hi) return binSearch(matrix[lo], target);
  return false;
}
```

# SF/js-algorithms/LeetCode/Medium/75.js

```js
// 75. Sort Colors

// Given an array with n objects colored red, white or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white and blue.

// Here, we will use the integers 0, 1, and 2 to represent the color red, white, and blue respectively.

// Note: You are not suppose to use the library's sort function for this problem.

// Input: [2,0,2,1,1,0]
// Output: [0,0,1,1,2,2]

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
export default function sortColors(nums) {
  const counts = new Array(3);
  for (const item of nums) {
    counts[item] = counts[item] === undefined ? 1 : counts[item] + 1;
  }
  let index = 0;
  for (let i = 0; i < counts.length; i++) {
    for (let j = 0; j < counts[i]; j++) {
      nums[index] = i;
      index++;
    }
  }
  return nums;
}
```

# SF/js-algorithms/LeetCode/Medium/78.js

```js
// 78. Subsets

// Given a set of distinct integers, nums, return all possible subsets (the power set).

// Note: The solution set must not contain duplicate subsets.

// Example:

// Input: nums = [1,2,3]
// Output:
// [
//   [3],
//   [1],
//   [2],
//   [1,2,3],
//   [1,3],
//   [2,3],
//   [1,2],
//   []
// ]
const subsetsAux = (nums, prev, start, res) => {
  if (start === nums.length || start === prev.length) {
    res.push(prev);
    return res;
  }
  const remove = [];
  for (let i = 0; i < prev.length; i++) {
    if (start === i) {
      continue;
    }
    remove.push(prev[i]);
  }
  subsetsAux(nums, [...prev], start + 1, res);
  subsetsAux(nums, [...remove], start, res);
  return res;
};

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
export default function subsets(nums) {
  const res = [];
  return subsetsAux(nums, [...nums], 0, res);
}
```

# SF/js-algorithms/LeetCode/Medium/912.js

```js
// 912. Sort an Array

// Given an array of integers nums, sort the array in ascending order.

// Example 1:

// Input: [5,2,3,1]
// Output: [1,2,3,5]
// Example 2:

// Input: [5,1,1,2,0,0]
// Output: [0,0,1,1,2,5]

// Note:

// 1 <= A.length <= 10000
// -50000 <= A[i] <= 50000

const merge = (left, right) => {
  const merged = [];
  let leftI = 0;
  let rightI = 0;

  while (merged.length < left.length + right.length) {
    if (leftI === left.length) {
      merged.push(right[rightI]);
      rightI++;
    } else if (rightI === right.length) {
      merged.push(left[leftI]);
      leftI++;
    } else if (left[leftI] < right[rightI]) {
      merged.push(left[leftI]);
      leftI++;
    } else {
      merged.push(right[rightI]);
      rightI++;
    }
  }

  return merged;
};

const mergeSort = arr => {
  // console.log(arr)
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
};

/**
 * @param {number[]} nums
 * @return {number[]}
 */
export default function sortArray(nums) {
  return mergeSort(nums);
}
```

# SF/js-algorithms/LeetCode/Medium/98.js

```js
// Given a binary tree, determine if it is a valid binary search tree (BST).

// Assume a BST is defined as follows:

// The left subtree of a node contains only nodes with keys less than the node's key.
// The right subtree of a node contains only nodes with keys greater than the node's key.
// Both the left and right subtrees must also be binary search trees.

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */

const binSearch = (tree, val) => {
  if (tree === null) return false;
  if (tree.val === val) return true;
  return val > tree.val ? binSearch(tree.right, val) : binSearch(tree.left, val);
};

const traverseAndValidate = (root, tree) => {
  if (tree === null || root === null) return true;
  if (!binSearch(root, tree.val)) return false;
  return traverseAndValidate(root, tree.left) && traverseAndValidate(root, tree.right);
};

export default function isValidBST(root) {
  const values = [];
  // BFS
  const queue = [];
  if (root) queue.push(root);
  while (queue.length) {
    const item = queue.shift();
    values.push(item.val);
    if (item.left) queue.push(item.left);
    if (item.right) queue.push(item.right);
  }
  // Validate if BST has duplicates (BST does not allow duplicates)
  const set = new Set(values);
  if (set.size !== values.length) return false;
  return traverseAndValidate(root, root);
}
```

# SF/js-algorithms/LeetCode/Medium/987.js

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

const verticalTraversalAux = (root, map, mat) => {
  if (!root) return;
  const queue = [];
  queue.push([root, 0]);
  while (queue.length) {
    const [node, x] = queue.shift();
    if (map.has(x)) {
      const a = map.get(x);
      a.push(node.val);
    } else {
      map.set(x, [node.val]);
    }
    if (node.left) queue.push([node.left, x - 1]);
    if (node.right) queue.push([node.right, x + 1]);
  }
};

/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
const verticalTraversal = function(root) {
  const map = new Map();
  const mat = new Array().fill(new Array());
  verticalTraversalAux(root, map, mat);
  const keys = Array.from(map.keys()).sort((a, b) => a - b);
  const res = [];
  for (const key of keys) {
    res.push(map.get(key));
  }
  return res;
};
```

# SF/js-algorithms/LeetCode/globals.js

```js
/* eslint import/prefer-default-export: off */

export function ListNode(val) {
  this.val = val;
  this.next = null;
}
```

# SF/js-algorithms/Math/CheckAddition.js

```js
/**
 * Given a list of numbers and specific integer, check if the sum
 * of any two integers in the list add to equal the given number.
 *
 * Formally, in the given set of arbitray integers, do an two
 * integers m,n in the set exist such that m + n = k, where k is a
 * given integer
 *
 * @flow
 */
export default function CheckAddition(target: number, list: number[]): boolean {
  const map = new Map();

  for (let i = 0; i < list.length; i++) {
    if (map.has(list[i])) {
      const curr = map.get(list[i]);
      map.set(list[i], curr + 1);
    } else {
      map.set(list[i], 1);
    }
  }

  for (let i = 0; i < list.length; i++) {
    const res = target - list[i];
    if (map.has(res)) {
      if (res === list[i]) {
        return map.get(res) > 1;
      }
      return true;
    }
  }

  return false;
}
```

# SF/js-algorithms/Math/Factorial.js

```js
/**
 * What is a factorial? I think an example is better than an explaination in
 * this case:
 *
 * Factorial(4, 1)
 * 4 * Factorial(3)
 * 4 * 3 * Factorial(2)
 * 4 * 3 * 2 * Factorial(1)
 * 4 * 3 * 2 * 1
 *
 * @complexity: O(n)
 *
 * @flow
 */
type num = number;

export default function FactorialRecursive(number: num, product: num = 1): num {
  switch (number) {
    case 1:
      return product;
    default:
      return FactorialRecursive(number - 1, product * number);
  }
}

export function FactorialIterative(number: num): num {
  let factorial = 1;
  let current = 1;

  while (current < number) {
    current++;
    factorial *= current;
  }

  return factorial;
}
```

# SF/js-algorithms/Math/Fibonacci.js

```js
type num = number;

const list = [];

export default function FibonacciIterative(nth: number): num[] {
  const sequence = [];

  if (nth >= 1) sequence.push(1);
  if (nth >= 2) sequence.push(1);

  for (let i = 2; i < nth; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }

  return sequence;
}

export function FibonacciRecursive(number: num): num[] {
  return ((): num[] => {
    switch (list.length) {
      case 0:
        list.push(1);
        return FibonacciRecursive(number);
      case 1:
        list.push(1);
        return FibonacciRecursive(number);
      case number:
        return list;
      default:
        list.push(list[list.length - 1] + list[list.length - 2]);
        return FibonacciRecursive(number);
    }
  })();
}

const dict: Map<num, num> = new Map();

export function FibonacciRecursiveDP(stairs: num): num {
  if (stairs <= 0) return 0;
  if (stairs === 1) return 1;

  // Memoize stair count
  if (dict.has(stairs)) return dict.get(stairs);

  const res = FibonacciRecursiveDP(stairs - 1) + FibonacciRecursiveDP(stairs - 2);

  dict.set(stairs, res);

  return res;
}

// @TODO: FibonacciBinetsTheorem
```

# SF/js-algorithms/Math/HappyNumbers.js

```js
/**
 * Happy numbers
 *
 * Find the sum of the products of a digits of a number
 * Ex. 7 -> (7 * 7)
 * 7 -> 49 -> ...
 *
 * 36 -> (3 * 3) + (6 * 6)
 * 18 -> (1 * 1) + (8 * 8)
 *
 * 'Happy' numbers are numbers that will have a number whose pattern include
 * Ex. 7 -> 49 -> 97 -> 130 -> 10 -> 1
 *
 *
 * 'Unhappy' numbers will never include 1 in the sequence
 * Ex. 2 -> 4 -> 16 -> 37 -> 58 -> 89 -> 145 -> 42 -> 20 -> 4
 *
 * Question: Determine if a number is 'happy' or not
 *
 * @flow
 */

/**
 * Calculate if a number is happy or unhappy
 */
export default function HappyNumbers(number: number): boolean {
  const numbers = new Set();
  let currentNumber = calc(number);
  let infiniteLoopPreventionLimit = 0;

  while (!numbers.has(1) && infiniteLoopPreventionLimit < 1000) {
    currentNumber = calc(currentNumber);

    if (numbers.has(currentNumber)) {
      return false;
    }

    numbers.add(currentNumber);
    infiniteLoopPreventionLimit++;

    if (currentNumber === 1) {
      return true;
    }
  }

  return false;
}

export function calc(number: number): number {
  const castedNumber = number.toString();

  let index;
  let sum = 0;

  for (index = 0; index < castedNumber.length; index++) {
    const int = parseInt(castedNumber[index], 10);
    const result = int * int;
    sum += result;
  }

  return sum;
}
```

# SF/js-algorithms/Math/Integral.js

```js
type num = number;

function integ(coefs: num[]): num[] {
  const newCoefs = coefs.map((coef: num, index: num): num => coef / (coefs.length - index));

  return [...newCoefs, 0];
}

function addExp(coefs: num[], x: num): num {
  return coefs
    .map((a: num, index: num): num => x ** (coefs.length - index - 1) * a)
    .reduce((c: num, p: num): num => c + p, 0);
}

export default function areaExact(coefs: num[], a: num, b: num): num {
  return addExp(integ(coefs), b) - addExp(integ(coefs), a);
}

export function areaNumerical(coefs: num[], delta: num = 1, a: num, b: num): num {
  let sum = 0;

  for (let i = a; i < b; i += delta) {
    const comp = addExp(coefs, i) * delta;
    sum += comp;
  }

  return sum;
}
```

# SF/js-algorithms/Math/Pascal.js

```js
// Pascal's Triangle
//
// Given numRows, generate the first numRows of Pascal's triangle.
//
// For example, given numRows = 5, return
// [
//       [1],
//      [1,1],
//     [1,2,1],
//    [1,3,3,1],
//   [1,4,6,4,1],
//  [1,5,10,10,5,1]
// ]
//

type num = number;
type pt = number[][];

export default function PascalRecursive(number: num, list: pt = []): pt {
  switch (list.length) {
    case 0:
      list.push([1]);
      return PascalRecursive(number, list);
    case 1:
      list.push([1, 1]);
      return PascalRecursive(number, list);
    case number:
      return list;
    default: {
      const _list = list[list.length - 1];
      const _tmp = [1];
      for (let i = 0; i < _list.length - 1; i++) {
        _tmp.push(_list[i] + _list[i + 1]);
      }
      _tmp.push(1);
      list.push(_tmp);
      return PascalRecursive(number, list);
    }
  }
}

export function PascalIterative(number: number): pt {
  if (number === 0) return [];
  const rows = [[1]];

  for (let i = 1; i < number; i++) {
    const some = [1];
    const length = rows[i - 1] ? rows[i - 1].length - 1 : 0;

    for (let j = 0; j < length; j++) {
      some.push(rows[i - 1][j] + (rows[i - 1][j + 1] || 0));
    }

    some.push(1);
    rows.push(some);
  }

  return rows;
}
```

# SF/js-algorithms/Math/PrimeNumberGenerator.js

```js
/**
 * Find all the prime numbers of a certain number. This solution is based on the
 * Sieve of Eratosthenes method
 *
 * For each int 'a' until the given limit, check if each following int 'b' is divisible
 * by 'a'
 *
 * @complexity: O(n(logn))
 * @flow
 */
export default function PrimeNumberGenerator(limit: number = 100): number[] {
  const primeNumbers = [];

  for (let i = 1; i <= limit; i++) {
    primeNumbers.push(i);
  }

  for (let i = 0; i < primeNumbers.length; i++) {
    for (let d = 0; d < primeNumbers.length; d++) {
      // Check if number is composite
      if (
        primeNumbers[d] !== primeNumbers[i] &&
        primeNumbers[i] !== 1 &&
        primeNumbers[d] !== 1 &&
        primeNumbers[d] % primeNumbers[i] === 0
      ) {
        // Perform in-place mutation for better memory efficiency
        primeNumbers.splice(d, 1);
      }
    }
  }

  return primeNumbers;
}
```

# SF/js-algorithms/Math/RandomNumber.js

```js
// Returning random numbers from Javascript
// Javascript's Math.random function only returns a random number from 0 to 1
// Here, we can write our own random functions to improve the random functionality

type num = number;

/**
 * Return a random number between a min and max
 */
export default function RandomBetween(min: num, max: num): num {
  return Math.random() * (max - min) + min;
}

// Assert randomBetween
export function isBeween(number: num, min: num, max: num): boolean {
  return number > min && number < max;
}
```

# SF/js-algorithms/Math/SquareRoot.js

```js
// Find the square root of a given number, without using the Math.sqrt function
//
// Hmm.. if I divide the number by two and round it, will it always be less
// than than the square root?
//
// In the case that the number is less than 4, this is not true
// ex. √16 < 8^2 (64)
// ex. √4 = 2^2
// ex. √3 > 1.5^2
// ex. √2 > 1^2
// ex. √1 > 0.5^2 (1)
// ex. √0.5 < 0.25^2 (0.625)
//
// So if half the number is greater than or equal to four, we know that the
// root is less than half of the number
//
// An efficient way of doing this is using a binary search tree.
//

type num = number;

/**
 * @complexity: O(log(n))
 */
export default function SquareRoot(number: num): num {
  let sqrt = 1;
  let head = 1;
  let tail = number;

  while (sqrt ** 2 !== number) {
    const middle = Math.floor((tail + head) / 2);
    sqrt = middle;

    if (sqrt ** 2 > number) {
      tail = middle;
    } else {
      head = middle;
    }
  }

  return sqrt;
}

// @TODO: Taylor Series Method
// @TODO: Newtonian Method Method
// @TODO: Babylonian Method Method
```

# SF/js-algorithms/Math/VectorCalculate.js

```js
/**
 * Calculate the resultant vector of a given series of component vectors
 * @flow
 */
type num = number;

type vector = {
  magnitude: num,
  direction: num,
};

type result = {
  xMag: num,
  yMag: num,
  totalMag: num,
};

export default function VectorCalculate(coords: vector[]): result {
  const x = coords.map((e: vector): num => e.magnitude * Math.cos(radsToDegrees(e.direction)));
  const y = coords.map((e: vector): num => e.magnitude * Math.sin(radsToDegrees(e.direction)));

  const xMag = sum(x);
  const yMag = sum(y);
  const totalMag = pythag(xMag, yMag);

  return { xMag, yMag, totalMag };
}

function pythag(x: num, y: num): num {
  return round(Math.sqrt(x ** 2 + y ** 2));
}

function sum(nums: num[]): num {
  return round(nums.reduce((p: num, c: num): num => p + c, 0));
}

function radsToDegrees(rad: num): num {
  return round((rad * Math.PI) / 180);
}

function round(number: num): num {
  return Math.round(number * 1000) / 1000;
}
```

# SF/js-algorithms/Paradigmns/Functional/ImmutableLists.js

```js
/**
 * In functional programming a way of representing immutable lists are like so:
 *
 * ex. A list of objects with values and pointers to other values
 *
 * vowels -> ['a', pointer] -> ['b', pointer] -> ['c', pointer]
 *            ^ head  ^ tail                     ^^^^^^^^^^^^^^ cell
 *
 * Isn't this slow? Yes. So why do we do this? It makes insertion really fast
 * If you want to insert an elemnt in a given position. So we can give the
 * illusion of mutability while we're actually creating new lists and creating
 * new pointers to objects.
 *
 * All you have to do is change the pointers intead of
 *
 * @flow
 */
```

# SF/js-algorithms/Puzzles/CurrencyConvert.js

```js
function traverse(adj, startNode, endNode) {
  // BFS
  const queue = [];
  const visited = new Set();
  queue.push({ node: adj.get(startNode), rate: 1 });
  while (queue.length) {
    // Detect cycles
    if (visited.size === adj.size) return -1;
    let { node, rate, parent } = queue.shift();
    if (visited.has(node)) continue;
    // use parent and current node to find rate
    const computedRate = adj.get(parent);
    if (computedRate.has(name)) {
      rate *= adj.get(parent).get(name);
      if (node.name === endNode) return rate;
      const children = adj.get(node);
      for (const child of children) {
        queue.push({ node: child, rate, parent: node });
      }
    }
    visited.add(node);
  }
  return -1;
}

export default function getConversionRate(convs, startNode, endNode) {
  const adj = new Map();
  // construct graph
  for (const conv of convs) {
    const [from, to, rate] = conv;
    if (adj.has(from)) {
      const list = adj.get;
      list.push({ node: from, rate });
    } else {
      const list = [];
      list.push({ node: from, rate });
      adj.set(from, list);
    }
    // add inv
    if (adj.has(to)) {
      const list = adj.get(to);
      list.push({ node: to, rate: 1 / rate });
    } else {
      const list = [];
      list.push({ node: from, rate: 1 / rate });
      adj.set(to, list);
    }
  }
  return traverse(adj, startNode, endNode);
}
```

# SF/js-algorithms/Puzzles/Maze.js

```js
// Taken from http://www.geeksforgeeks.org/backttracking-set-2-rat-in-a-maze/
//
// We have discussed Backtracking and Knight’s tour problem in Set 1. Let us
// discuss Rat in a Maze as another example problem that can be solved using
// Backtracking.
//
// A Maze is given as N*N binary matrix of blocks where source block is the
// upper left most block i.e., maze[0][0] and destination block is lower
// rightmost block i.e., maze[N-1][N-1]. A rat starts from source and has to
// reach destination. The rat can move only in two directions: forward and down.
// In the maze matrix, 0 means the block is dead end and 1 means the block can
// be used in the path from source to destination. Note that this is a simple
// version of the typical Maze problem. For example, a more complex version can
// be that the rat can move in 4 directions and a more complex version can be
// with limited number of moves.
//
// Following is an example maze. Show
//

type num = number;
type mazeType = Array<Array<num>>;

const solutions = [];

export default function Maze(maze: mazeType, x: num, y: num, path: mazeType = []) {
  const mazeLength = maze.length;

  if (x === maze.length - 1 && y === maze.length - 1) {
    solutions.push(path);
  }

  const yPath = [...path];
  yPath.push([x + 1, y]);

  const xPath = [...path];
  xPath.push([x, y + 1]);

  if (maze[x][y] > 0) {
    if (x + 1 < mazeLength) Maze(maze, x + 1, y, yPath);
    if (y + 1 < mazeLength) Maze(maze, x, y + 1, xPath);
  }

  return solutions;
}
```

# SF/js-algorithms/Puzzles/SimulateWar.js

```js
// create a deck of cards with numbers 1 - 52
// shuffle deck, distribute
// each player has deck and scoringPile
// each player take item from deck, compare, add to corrresponding scoringPile

import shuffle from 'lodash/shuffle';

// if more than 2 players
// need to change how we distribute cards
// use objects instead of defined object literals
// if any player runs out of cards, end the game

export default function simulateWar() {
  let cards = new Array(52);
  const player1 = { cards: [], scoringPile: [] };
  const player2 = { cards: [], scoringPile: [] };
  for (let i = 0; i < cards.length; i++) {
    cards[i] = i + 1;
  }
  cards = shuffle(cards);
  // add cards to deck
  for (let i = 0; i < cards.length / 2; i++) {
    player1.cards.push(cards[i]);
    player2.cards.push(cards[i + 26]);
  }
  // simulate
  for (let i = 0; i < cards.length / 2; i++) {
    const p1Card = player1.cards.pop();
    const p2Card = player2.cards.pop();
    if (p1Card > p2Card) {
      player1.scoringPile.push(p1Card);
      player1.scoringPile.push(p2Card);
    } else {
      player2.scoringPile.push(p1Card);
      player2.scoringPile.push(p2Card);
    }
  }
  if (player1.scoringPile.length === player2.scoringPile.length) {
    return console.log('tie');
  }
  if (player1.scoringPile.length > player2.scoringPile.length) {
    return console.log('player 1 won');
  }
  return console.log('player2 won');
}
```

# SF/js-algorithms/README.md

# JS Algos

A list of Computer Science concepts **solved** and **explained** in JavaScript (ES6)

[![Build Status](https://travis-ci.org/amilajack/js-algorithms.svg?branch=master)](https://travis-ci.org/amilajack/js-algorithms)

# Getting Started

```bash
# Setup
git clone https://github.com/amilajack/js-algorithms.git
cd js-algorithms
yarn

# Test
yarn test

# Running individual files
yarn global add @babel/cli
# Running/testing files
babel-node General/PrintKDistance.js
```

## Support

If this project is saving you (or your team) time, please consider supporting it on Patreon 👍 thank you!

<p>
  <a href="https://www.patreon.com/amilajack">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
  </a>
</p>

## Planned Implementations

- [x] Algorithms
- [x] Data Structures
- [ ] Challenge Questions
- [ ] Time/Space Complexity Analysis
- [ ] Search Algorithms
- [ ] Sorting Algorithms

## Contributing

- Requirements:
- Time-space complexities of each method (insert, delete, access, etc)
- Please feel free to contribute any design patters, algorithms, or other kinds of code
- All contributions are welcome!

# SF/js-algorithms/Recursion/ArrayLength.js

```js
/**
 * Recursively find the length of an array by taking the length of the array
 * minus the first item
 *
 * Here's what that would look like:
 *
 * ArrayLength([1, 2, 3])
 * 1 + ArrayLength([2, 3])
 * 1 + 1 + ArrayLength([3])
 * 1 + 1 + 1 + ArrayLength([])
 * 1 + 1 + 1 + 0
 *
 * @flow
 */
export default function ArrayLength(array: number[]): number {
  switch (array.length !== 0) {
    case true: {
      array.splice(0, 1);
      return 1 + ArrayLength(array);
    }
    default:
      return 0;
  }
}
```

# SF/js-algorithms/Recursion/DivideArray.js

```js
// Recursively divide an array into half until it only has one element

const items = [];

export default function DivideArray(array: number[]): number[][] {
  switch (array.length) {
    case 1:
      items.push(array);
      return items;
    default: {
      const middle = Math.ceil(array.length / 2);
      const first = array.splice(middle);
      DivideArray(first);
      DivideArray(array);
      return items;
    }
  }
}
```

# SF/js-algorithms/Recursion/Flatten.js

```js
/**
 * Take a two dimentional array (array of arrays) and 'flatten' it. In other
 * words, this means to take multiple arrays and merge them together
 *
 * Javascript's Array.prototype.concat would make this easier but it creates a
 * new array every single time
 *
 * Complexity: O(n^2)
 * @flow
 */

/* eslint no-unused-expressions: 0 */

type num = number;

export default function Flatten(array: Array<Array<num>>, collector: num[] = []): num[] {
  switch (array.length > 0) {
    case true: {
      const [first, ...rest] = array;
      return Flatten(rest, [...first, ...collector]);
    }
    default:
      return collector;
  }
}

export function FlattenRecursive(items: Array<any>): Array<any> {
  let concatedItems = [];

  for (let i = 0; i < items.length; i++) {
    Array.isArray(items[i])
      ? (concatedItems = concatedItems.concat(FlattenRecursive(items[i])))
      : concatedItems.push(items[i]);
  }

  return concatedItems;
}
```

# SF/js-algorithms/Recursion/Palindrome.js

```js
/**
 * A palindrome is any string that can be reversed and still be the same.
 * An example of one is 'radar', since it is spelled the same even after
 * being reversed. One method to check if a
 *
 * Here's how this works recursively:
 *
 * Palindrome('radar')
 * true && Palindrome('ada')
 * true && true && Palindrome('d')
 * true && true && true && true
 *
 * @flow
 * @complexity: O(n)
 */
export default function PalindromeRecursive(string: string): boolean {
  // Base case
  if (string.length < 2) return true;

  // Check outermost keys
  if (string[0] !== string[string.length - 1]) {
    return false;
  }

  return PalindromeRecursive(string.slice(1, string.length - 1));
}

export function PalindromeIterative(string: string): boolean {
  const _string = string
    .toLowerCase()
    .replace(/ /g, '')
    .replace(/,/g, '')
    .replace(/'.'/g, '')
    .replace(/:/g, '')
    .split('');

  // A word of only 1 character is already a palindrome, so we skip to check it
  while (_string.length > 1) {
    if (_string.shift() !== _string.pop()) {
      return false;
    }
  }

  return true;
}
```

# SF/js-algorithms/Recursion/PrintStringPermutations.js

```js
/**
 * Print all the permutations of a string
 *
 * @param chars  The array of chars are yet to be be permuted to the string
 * @param string The currently built string
 * @flow
 */
function printStrPerm(chars: Array<string>, string: string) {
  if (chars.length === 0) {
    return console.log(string);
  }

  for (let i = 0; i < chars.length; i++) {
    printStrPerm(
      chars.filter(e => e !== chars[i]),
      string + chars[i],
    );
  }
}

export default function PrintStringPermutations(string: string) {
  return printStrPerm(Array.from(string), '');
}
```

# SF/js-algorithms/Recursion/StairCaseCombinations.js

```js
// You are climbing a stair case. It takes n steps to reach to the top.
//
// Each time you can either climb 1 or 2 steps. In how many distinct ways can
// you climb to the top?
//
// Here's the recursion tree:
//
//                  4
//                /   \
//               1     2
//             / \    / \
//            1  2   1   2
//          / \  |   |
//         1  2  1   1
//        /
//       1
//

type num = number;

// Use recursion to find number of steps
// @complexity: O(2^n)
export function StairCaseCombinationRecursive(stairs: num): num {
  if (stairs <= 0) return 0;
  if (stairs === 1) return 1;
  if (stairs === 2) return 2;
  return StairCaseCombinationRecursive(stairs - 1) + StairCaseCombinationRecursive(stairs - 2);
}

// This method of solving the problem uses dynamic programming. Its
// recurses and then save the computation for later in case it is necessary
// again. This is called memoization
//
// climbStairs(n)     = climbStairs(n - 1) + climbStairs(n - 2)
// climbStairs(n - 1) = climbStairs(n - 2) + climbStairs(n - 3)
// climbStairs(n - 2) = climbStairs(n - 3) + climbStairs(n - 4)
//
// @complexity: O(2^(n+1)
const dict: Map<num, num> = new Map();

export default function StairCaseCombinationDP(stairs: num): num {
  if (stairs <= 0) return 0;
  if (stairs === 1) return 1;
  if (stairs === 2) return 2;

  if (dict.has(stairs)) return dict.get(stairs);

  const res = StairCaseCombinationDP(stairs - 1) + StairCaseCombinationDP(stairs - 2);

  dict.set(stairs, res);

  return res;
}
```

# SF/js-algorithms/SlidingWindow/ContigousZeros.js

```js
// Given a binary array, find the maximum number of zeros in an array by flipping only one
// subarray of your choice. A flip operation switches all 0s to 1s and 1s to 0s.

// Input :  arr[] = {0, 1, 0, 0, 1, 1, 0}
// Output : 6
// We can get 6 zeros by flipping the subarray {1, 1}

// Input :  arr[] = {0, 0, 0, 1, 0, 1}
// Output : 5

// Naive Approach:
// Keep track of the max number of zeros so far. Then consider each subrarray `s` of the given array. For each `s`,
// if the
```

# SF/js-algorithms/StreamAlgorithms/MooresVotingAlgorithm.js

```js
/**
 * Moore's Voting Algorithm finds the majority element in an array that has a majority element.
 */
export default function MooresVotingAlgorithm(nums: number[]): number {
  if (!nums.length) return -1;
  let majorityIndex = 0;
  let count = 1;

  for (let i = 1; i < nums.length; i++) {
    // If current num === majority number, count++
    if (nums[i] === nums[majorityIndex]) {
      count++;
    } else {
      count--;
    }
    // If count === 0, set to current num
    if (count === 0) {
      majorityIndex = i;
    }
  }

  return nums[majorityIndex];
}
```

# SF/js-algorithms/StreamAlgorithms/ReservoirSampling.js

```js
// Reservoir sampling is a family of randomized algorithms for randomly choosing a sample of k items from a list S containing
// n items, where n is either a very large or unknown number. Typically, n is too large to fit the whole list into main memory.

// Observations:
// This means we don't know what n is. If we did, we would randomly take k numbers from 0 to n and add them to our sample.

// See:
// https://en.wikipedia.org/wiki/Reservoir_sampling

/**
 * @param {number} k The sample size
 * @param {LinkedList<number>} list The list which we are taking the random samples of
 */
export default function ReservoirSampling(k, list) {
  // Add the first k items of the list to the reservoir
  const reservoir = [];
  for (let i = 0; i < k; i++) {
    reservoir.push(list.val);
    list = list.next;
  }
  while (list.hasNext()) {
    const j = Math.floor(k * Math.random());
    if (j < k) {
      const randReservoirIndex = reservoir[j];
      reservoir[randReservoirIndex] = list.val;
    }
    list = list.next;
  }
  return reservoir;
}
```

# SF/js-algorithms/Web/IdenticalTree.js

```js
// http://stackoverflow.com/questions/19779438/dom-tree-traversal
//
// Given a node from a DOM tree find the node in the same position
// from an identical DOM tree. See diagram below for clarity.
// find the root and on the way, create breadcrumbs by marking the left

/* eslint-disable */

function TreeNode() {
  this.parent = {};
  this.children = [];
}

function FindRoot(node, TreeB) {
  let parent = node;
  const breadCrumbs = [];

  // Find root
  while (node.parent) {
    const index = parent.children.indexOf(node);
    breadCrumbs.push(index);
    parent = node.parent;
  }

  let found = TreeB.root;

  for (let i = breadCrumbs.length; i > -1; i--) {
    found = found[breadCrumbs[i]];
  }

  return found;
}
```
