---
layout: CustomPages
title: Trie
date: 2020-11-21
aside: false
draft: true
---

### Trie 树(前缀树, 字典树)

**trie** 是一种有序树，用于保存关联数组，其中的键通常是字符串。

简单点来说，这个结构的作用大多是为了方便搜索字符串，该树有以下几个特点

- 根节点代表空字符串，每个节点都有 N(假如搜索英文字符，就有 26 条) 条链接，每条链接代表一个字符
- 节点不存储字符，只有路径才存储，这点和其他的树结构不同
- 从根节点开始到任意一个节点，将沿途经过的字符连接起来就是该节点对应的字符串

与二叉搜索树不同, 树上没有节点存储与该节点关联的键; 相反,节点在树上的位置定义了与之关联的键。一个节点的全部后代节点都有一个与该节点关联的通用的字符串前缀, 与根节点关联的是空字符串。

值对于字典树中关联的节点来说,不是必需的,相反,值往往和相关的叶子相关,以及与一些键相关的内部节点相关。

在字符串相关算法中，Trie 树可以解决解决很多问题，同时具备良好的空间和时间复杂度，比如以下问题

- 词频统计
- 前缀匹配

Trie 树，又称前缀树，字典树， 是一种有序树，用于保存关联数组，其中的键通常是字符串。与二叉查找树不同，键不是直接保存在节点中，而是由节点在树中的位置决定。一个节点的所有子孙都有相同的前缀，也就是这个节点对应的字符串，而根节点对应空字符串。一般情况下，不是所有的节点都有对应的值，只有叶子节点和部分内部节点所对应的键才有相关的值。

Trie 树查询和插入时间复杂度都是 O(n)，是一种以空间换时间的方法。当节点树较多的时候，Trie 树占用的内存会很大。

Trie 树常用于搜索提示。如当输入一个网址，可以自动搜索出可能的选择。当没有完全匹配的搜索结果，可以返回前缀最相似的可能。

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

### 前缀树问题

前缀树的 api 主要有以下几个：

- `insert(word)`: 插入一个单词
- `search(word)`：查找一个单词是否存在
- `startWith(word)`： 查找是否存在以 word 为前缀的单词

其中 startWith 是前缀树最核心的用法，其名称前缀树就从这里而来。

### 字典树

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

### 1. 实现一个 Trie

[208. Implement Trie (Prefix Tree) (Medium)](https://leetcode-cn.com/problems/implement-trie-prefix-tree/description/)

一个前缀树大概是这个样子：

![](https://github.com/azl397985856/leetcode/raw/b8e8fa5f0554926efa9039495b25ed7fc158372a/assets/problems/208.implement-trie-prefix-tree-1.png)

如图每一个节点存储一个字符，然后外加一个控制信息表示是否是单词结尾，实际使用过程可能会有细微差别，不过变化不大。

```java
class Trie {

    private class Node {
        Node[] childs = new Node[26];
        boolean isLeaf;
    }

    private Node root = new Node();

    public Trie() {
    }

    public void insert(String word) {
        insert(word, root);
    }

    private void insert(String word, Node node) {
        if (node == null) return;
        if (word.length() == 0) {
            node.isLeaf = true;
            return;
        }
        int index = indexForChar(word.charAt(0));
        if (node.childs[index] == null) {
            node.childs[index] = new Node();
        }
        insert(word.substring(1), node.childs[index]);
    }

    public boolean search(String word) {
        return search(word, root);
    }

    private boolean search(String word, Node node) {
        if (node == null) return false;
        if (word.length() == 0) return node.isLeaf;
        int index = indexForChar(word.charAt(0));
        return search(word.substring(1), node.childs[index]);
    }

    public boolean startsWith(String prefix) {
        return startWith(prefix, root);
    }

    private boolean startWith(String prefix, Node node) {
        if (node == null) return false;
        if (prefix.length() == 0) return true;
        int index = indexForChar(prefix.charAt(0));
        return startWith(prefix.substring(1), node.childs[index]);
    }

    private int indexForChar(char c) {
        return c - 'a';
    }
}
```

### 2. 实现一个 Trie，用来求前缀和

[677. Map Sum Pairs (Medium)](https://leetcode-cn.com/problems/map-sum-pairs/description/)

```html
Input: insert("apple", 3), Output: Null Input: sum("ap"), Output: 3 Input: insert("app", 2), Output: Null Input:
sum("ap"), Output: 5
```

```java
class MapSum {

    private class Node {
        Node[] child = new Node[26];
        int value;
    }

    private Node root = new Node();

    public MapSum() {

    }

    public void insert(String key, int val) {
        insert(key, root, val);
    }

    private void insert(String key, Node node, int val) {
        if (node == null) return;
        if (key.length() == 0) {
            node.value = val;
            return;
        }
        int index = indexForChar(key.charAt(0));
        if (node.child[index] == null) {
            node.child[index] = new Node();
        }
        insert(key.substring(1), node.child[index], val);
    }

    public int sum(String prefix) {
        return sum(prefix, root);
    }

    private int sum(String prefix, Node node) {
        if (node == null) return 0;
        if (prefix.length() != 0) {
            int index = indexForChar(prefix.charAt(0));
            return sum(prefix.substring(1), node.child[index]);
        }
        int sum = node.value;
        for (Node child : node.child) {
            sum += sum(prefix, child);
        }
        return sum;
    }

    private int indexForChar(char c) {
        return c - 'a';
    }
}
```
