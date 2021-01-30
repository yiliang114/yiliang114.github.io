---
layout: CustomPages
title: Trie
date: 2020-11-21
aside: false
draft: true
---

### Trie

在字符串相关算法中，Trie 树可以解决解决很多问题，同时具备良好的空间和时间复杂度，比如以下问题

- 词频统计
- 前缀匹配

#### 概念

在计算机科学，**trie**，又称**前缀树**或**字典树**，是一种有序树，用于保存关联数组，其中的键通常是字符串。

简单点来说，这个结构的作用大多是为了方便搜索字符串，该树有以下几个特点

- 根节点代表空字符串，每个节点都有 N(假如搜索英文字符，就有 26 条) 条链接，每条链接代表一个字符
- 节点不存储字符，只有路径才存储，这点和其他的树结构不同
- 从根节点开始到任意一个节点，将沿途经过的字符连接起来就是该节点对应的字符串

#### 实现

总得来说 Trie 的实现相比别的树结构来说简单的很多，实现就以搜索英文字符为例。

```js
class TrieNode {
  constructor() {
    // 代表每个字符经过节点的次数
    this.path = 0;
    // 代表到该节点的字符串有几个
    this.end = 0;
    // 链接
    this.next = new Array(26).fill(null);
  }
}
class Trie {
  constructor() {
    // 根节点，代表空字符
    this.root = new TrieNode();
  }
  // 插入字符串
  insert(str) {
    if (!str) return;
    let node = this.root;
    for (let i = 0; i < str.length; i++) {
      // 获得字符先对应的索引
      let index = str[i].charCodeAt() - 'a'.charCodeAt();
      // 如果索引对应没有值，就创建
      if (!node.next[index]) {
        node.next[index] = new TrieNode();
      }
      node.path += 1;
      node = node.next[index];
    }
    node.end += 1;
  }
  // 搜索字符串出现的次数
  search(str) {
    if (!str) return;
    let node = this.root;
    for (let i = 0; i < str.length; i++) {
      let index = str[i].charCodeAt() - 'a'.charCodeAt();
      // 如果索引对应没有值，代表没有需要搜素的字符串
      if (!node.next[index]) {
        return 0;
      }
      node = node.next[index];
    }
    return node.end;
  }
  // 删除字符串
  delete(str) {
    if (!this.search(str)) return;
    let node = this.root;
    for (let i = 0; i < str.length; i++) {
      let index = str[i].charCodeAt() - 'a'.charCodeAt();
      // 如果索引对应的节点的 Path 为 0，代表经过该节点的字符串
      // 已经一个，直接删除即可
      if (--node.next[index].path == 0) {
        node.next[index] = null;
        return;
      }
      node = node.next[index];
    }
    node.end -= 1;
  }
}
```

### Code

```js
function node(val) {
  this.val = val;
  this.next = null;
}

function get(node, key, d) {
  if (node == null) return null;
  if (d == key.length) return node;
  let c = key.charAt(d);
  return get(node.next[c], key, d + 1);
}

function put(node, key, val, d) {
  if (node == null) node = new node(null);
  if (d == key.length) {
    node.val = val;
    return node;
  }
  let c = key.charAt(d);
  node.next[c] = put(node.next[c], key, val, d + 1);
  return node;
}

function del(node, key, d) {
  if (node == null) return null;
  if (d == key.length) {
    node.val = null;
  } else {
    let c = key.charAt(d);
    x.next[c] = del(node.next[c], key, d + 1);
  }
  if (node.val != null) return node;
  for (let c = 0; c < R; c++) {
    if (node.next[c] != null) return node;
  }
  return null;
}
```

```js
export default function PrefixTrie(words: Array<string>) {
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
}
```

### 前缀树问题

前缀树的 api 主要有以下几个：

- `insert(word)`: 插入一个单词
- `search(word)`：查找一个单词是否存在
- `startWith(word)`： 查找是否存在以 word 为前缀的单词

其中 startWith 是前缀树最核心的用法，其名称前缀树就从这里而来。

208 题: 一个前缀树大概是这个样子：

![](https://github.com/azl397985856/leetcode/raw/b8e8fa5f0554926efa9039495b25ed7fc158372a/assets/problems/208.implement-trie-prefix-tree-1.png)

如图每一个节点存储一个字符，然后外加一个控制信息表示是否是单词结尾，实际使用过程可能会有细微差别，不过变化不大。

### 字典树

在计算机科学中, **字典树(trie,中文又被称为”单词查找树“或 ”键树“)**, 也称为数字树,有时候也被称为基数树或前缀树(因为它们可以通过前缀搜索),它是一种搜索树--一种已排序的数据结构,通常用于存储动态集或键为字符串的关联数组。

与二叉搜索树不同, 树上没有节点存储与该节点关联的键; 相反,节点在树上的位置定义了与之关联的键。一个节点的全部后代节点都有一个与该节点关联的通用的字符串前缀, 与根节点关联的是空字符串。

值对于字典树中关联的节点来说,不是必需的,相反,值往往和相关的叶子相关,以及与一些键相关的内部节点相关。

有关字典树的空间优化示意,请参阅紧凑前缀树

![Trie](https://upload.wikimedia.org/wikipedia/commons/b/be/Trie_example.svg)

#### Code

```js
import TrieNode from './TrieNode';

// Character that we will use for trie tree root.
const HEAD_CHARACTER = '*';

export default class Trie {
  constructor() {
    this.head = new TrieNode(HEAD_CHARACTER);
  }

  /**
   * @param {string} word
   * @return {Trie}
   */
  addWord(word) {
    const characters = Array.from(word);
    let currentNode = this.head;

    for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
      const isComplete = charIndex === characters.length - 1;
      currentNode = currentNode.addChild(characters[charIndex], isComplete);
    }

    return this;
  }

  /**
   * @param {string} word
   * @return {Trie}
   */
  deleteWord(word) {
    const depthFirstDelete = (currentNode, charIndex = 0) => {
      if (charIndex >= word.length) {
        // Return if we're trying to delete the character that is out of word's scope.
        return;
      }

      const character = word[charIndex];
      const nextNode = currentNode.getChild(character);

      if (nextNode == null) {
        // Return if we're trying to delete a word that has not been added to the Trie.
        return;
      }

      // Go deeper.
      depthFirstDelete(nextNode, charIndex + 1);

      // Since we're going to delete a word let's un-mark its last character isCompleteWord flag.
      if (charIndex === word.length - 1) {
        nextNode.isCompleteWord = false;
      }

      // childNode is deleted only if:
      // - childNode has NO children
      // - childNode.isCompleteWord === false
      currentNode.removeChild(character);
    };

    // Start depth-first deletion from the head node.
    depthFirstDelete(this.head);

    return this;
  }

  /**
   * @param {string} word
   * @return {string[]}
   */
  suggestNextCharacters(word) {
    const lastCharacter = this.getLastCharacterNode(word);

    if (!lastCharacter) {
      return null;
    }

    return lastCharacter.suggestChildren();
  }

  /**
   * Check if complete word exists in Trie.
   *
   * @param {string} word
   * @return {boolean}
   */
  doesWordExist(word) {
    const lastCharacter = this.getLastCharacterNode(word);

    return !!lastCharacter && lastCharacter.isCompleteWord;
  }

  /**
   * @param {string} word
   * @return {TrieNode}
   */
  getLastCharacterNode(word) {
    const characters = Array.from(word);
    let currentNode = this.head;

    for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
      if (!currentNode.hasChild(characters[charIndex])) {
        return null;
      }

      currentNode = currentNode.getChild(characters[charIndex]);
    }

    return currentNode;
  }
}
```
