---
layout: CustomPages
title: 布隆过滤器
date: 2020-09-04
aside: false
draft: true
---

## 布隆过滤器

假设你现在要处理这样一个问题，你有一个网站并且拥有`很多`访客，每当有用户访问时，你想知道这个 ip 是不是第一次访问你的网站。

### hash table 可以么

一个显而易见的答案是将所有的 ip 用 hash table 存起来，每次访问都去 hash table 中取，然后判断即可。但是题目说了网站有`很多`访客，
假如有 10 亿个用户访问过，每个 ip 的长度是 4 byte，那么你一共需要 4 \* 1000000000 = 4000000000Bytes = 4G , 如果是判断 URL 黑名单，
由于每个 URL 会更长，那么需要的空间可能会远远大于你的期望。

### bit

另一个稍微难想到的解法是 bit， 我们知道 bit 有 0 和 1 两种状态，那么用来表示存在，不存在再合适不过了。

加入有 10 亿个 ip，我们就可以用 10 亿个 bit 来存储，那么你一共需要 1 \* 1000000000 = (4000000000 / 8) Bytes = 128M, 变为原来的 1/32,
如果是存储 URL 这种更长的字符串，效率会更高。

基于这种想法，我们只需要两个操作，set(ip) 和 has(ip)

这样做有两个非常致命的缺点：

1. 当样本分布极度不均匀的时候，会造成很大空间上的浪费

> 我们可以通过散列函数来解决

2. 当元素不是整型(比如 URL)的时候，BitSet 就不适用了

> 我们还是可以使用散列函数来解决， 甚至可以多 hash 几次

### 布隆过滤器

布隆过滤器其实就是`bit + 多个散列函数`, 如果经过多次散列的值再 bit 上都为 1，那么可能存在(可能有冲突)。 如果
有一个不为 1，那么一定不存在(一个值经过散列函数得到的值一定是唯一的)，这也是布隆过滤器的一个重要特点。

### 布隆过滤器的应用

1. 网络爬虫
   判断某个 URL 是否已经被爬取过

2. K-V 数据库 判断某个 key 是否存在

比如 Hbase 的每个 Region 中都包含一个 BloomFilter，用于在查询时快速判断某个 key 在该 region 中是否存在。

3. 钓鱼网站识别

浏览器有时候会警告用户，访问的网站很可能是钓鱼网站，用的就是这种技术

> 从这个算法大家可以对 tradeoff(取舍) 有更入的理解。

### Bloom Filter

```js
export default class BloomFilter {
  /**
   * @param {number} size - the size of the storage.
   */
  constructor(size = 100) {
    // Bloom filter size directly affects the likelihood of false positives.
    // The bigger the size the lower the likelihood of false positives.
    this.size = size;
    this.storage = this.createStore(size);
  }

  /**
   * @param {string} item
   */
  insert(item) {
    const hashValues = this.getHashValues(item);

    // Set each hashValue index to true.
    hashValues.forEach(val => this.storage.setValue(val));
  }

  /**
   * @param {string} item
   * @return {boolean}
   */
  mayContain(item) {
    const hashValues = this.getHashValues(item);

    for (let hashIndex = 0; hashIndex < hashValues.length; hashIndex += 1) {
      if (!this.storage.getValue(hashValues[hashIndex])) {
        // We know that the item was definitely not inserted.
        return false;
      }
    }

    // The item may or may not have been inserted.
    return true;
  }

  /**
   * Creates the data store for our filter.
   * We use this method to generate the store in order to
   * encapsulate the data itself and only provide access
   * to the necessary methods.
   *
   * @param {number} size
   * @return {Object}
   */
  createStore(size) {
    const storage = [];

    // Initialize all indexes to false
    for (let storageCellIndex = 0; storageCellIndex < size; storageCellIndex += 1) {
      storage.push(false);
    }

    const storageInterface = {
      getValue(index) {
        return storage[index];
      },
      setValue(index) {
        storage[index] = true;
      },
    };

    return storageInterface;
  }

  /**
   * @param {string} item
   * @return {number}
   */
  hash1(item) {
    let hash = 0;

    for (let charIndex = 0; charIndex < item.length; charIndex += 1) {
      const char = item.charCodeAt(charIndex);
      hash = (hash << 5) + hash + char;
      hash &= hash; // Convert to 32bit integer
      hash = Math.abs(hash);
    }

    return hash % this.size;
  }

  /**
   * @param {string} item
   * @return {number}
   */
  hash2(item) {
    let hash = 5381;

    for (let charIndex = 0; charIndex < item.length; charIndex += 1) {
      const char = item.charCodeAt(charIndex);
      hash = (hash << 5) + hash + char; /* hash * 33 + c */
    }

    return Math.abs(hash % this.size);
  }

  /**
   * @param {string} item
   * @return {number}
   */
  hash3(item) {
    let hash = 0;

    for (let charIndex = 0; charIndex < item.length; charIndex += 1) {
      const char = item.charCodeAt(charIndex);
      hash = (hash << 5) - hash;
      hash += char;
      hash &= hash; // Convert to 32bit integer
    }

    return Math.abs(hash % this.size);
  }

  /**
   * Runs all 3 hash functions on the input and returns an array of results.
   *
   * @param {string} item
   * @return {number[]}
   */
  getHashValues(item) {
    return [this.hash1(item), this.hash2(item), this.hash3(item)];
  }
}
```

### Disjoint Set

```js
export default class DisjointSetItem {
  /**
   * @param {*} value
   * @param {function(value: *)} [keyCallback]
   */
  constructor(value, keyCallback) {
    this.value = value;
    this.keyCallback = keyCallback;
    /** @var {DisjointSetItem} this.parent */
    this.parent = null;
    this.children = {};
  }

  /**
   * @return {*}
   */
  getKey() {
    // Allow user to define custom key generator.
    if (this.keyCallback) {
      return this.keyCallback(this.value);
    }

    // Otherwise use value as a key by default.
    return this.value;
  }

  /**
   * @return {DisjointSetItem}
   */
  getRoot() {
    return this.isRoot() ? this : this.parent.getRoot();
  }

  /**
   * @return {boolean}
   */
  isRoot() {
    return this.parent === null;
  }

  /**
   * Rank basically means the number of all ancestors.
   *
   * @return {number}
   */
  getRank() {
    if (this.getChildren().length === 0) {
      return 0;
    }

    let rank = 0;

    /** @var {DisjointSetItem} child */
    this.getChildren().forEach(child => {
      // Count child itself.
      rank += 1;

      // Also add all children of current child.
      rank += child.getRank();
    });

    return rank;
  }

  /**
   * @return {DisjointSetItem[]}
   */
  getChildren() {
    return Object.values(this.children);
  }

  /**
   * @param {DisjointSetItem} parentItem
   * @param {boolean} forceSettingParentChild
   * @return {DisjointSetItem}
   */
  setParent(parentItem, forceSettingParentChild = true) {
    this.parent = parentItem;
    if (forceSettingParentChild) {
      parentItem.addChild(this);
    }

    return this;
  }

  /**
   * @param {DisjointSetItem} childItem
   * @return {DisjointSetItem}
   */
  addChild(childItem) {
    this.children[childItem.getKey()] = childItem;
    childItem.setParent(this, false);

    return this;
  }
}
```

<!-- DisjointSet -->

```js
import DisjointSetItem from './DisjointSetItem';

export default class DisjointSet {
  /**
   * @param {function(value: *)} [keyCallback]
   */
  constructor(keyCallback) {
    this.keyCallback = keyCallback;
    this.items = {};
  }

  /**
   * @param {*} itemValue
   * @return {DisjointSet}
   */
  makeSet(itemValue) {
    const disjointSetItem = new DisjointSetItem(itemValue, this.keyCallback);

    if (!this.items[disjointSetItem.getKey()]) {
      // Add new item only in case if it not presented yet.
      this.items[disjointSetItem.getKey()] = disjointSetItem;
    }

    return this;
  }

  /**
   * Find set representation node.
   *
   * @param {*} itemValue
   * @return {(string|null)}
   */
  find(itemValue) {
    const templateDisjointItem = new DisjointSetItem(itemValue, this.keyCallback);

    // Try to find item itself;
    const requiredDisjointItem = this.items[templateDisjointItem.getKey()];

    if (!requiredDisjointItem) {
      return null;
    }

    return requiredDisjointItem.getRoot().getKey();
  }

  /**
   * Union by rank.
   *
   * @param {*} valueA
   * @param {*} valueB
   * @return {DisjointSet}
   */
  union(valueA, valueB) {
    const rootKeyA = this.find(valueA);
    const rootKeyB = this.find(valueB);

    if (rootKeyA === null || rootKeyB === null) {
      throw new Error('One or two values are not in sets');
    }

    if (rootKeyA === rootKeyB) {
      // In case if both elements are already in the same set then just return its key.
      return this;
    }

    const rootA = this.items[rootKeyA];
    const rootB = this.items[rootKeyB];

    if (rootA.getRank() < rootB.getRank()) {
      // If rootB's tree is bigger then make rootB to be a new root.
      rootB.addChild(rootA);

      return this;
    }

    // If rootA's tree is bigger then make rootA to be a new root.
    rootA.addChild(rootB);

    return this;
  }

  /**
   * @param {*} valueA
   * @param {*} valueB
   * @return {boolean}
   */
  inSameSet(valueA, valueB) {
    const rootKeyA = this.find(valueA);
    const rootKeyB = this.find(valueB);

    if (rootKeyA === null || rootKeyB === null) {
      throw new Error('One or two values are not in sets');
    }

    return rootKeyA === rootKeyB;
  }
}
```

### 布隆过滤器

布隆过滤器其实就是`bit + 多个散列函数`, 如果经过多次散列的值再 bit 上都为 1，那么可能存在(可能有冲突)。 如果
有一个不为 1，那么一定不存在(一个值经过散列函数得到的值一定是唯一的)，这也是布隆过滤器的一个重要特点。

### 布隆过滤器的应用

1. 网络爬虫
   判断某个 URL 是否已经被爬取过

2. K-V 数据库 判断某个 key 是否存在

比如 Hbase 的每个 Region 中都包含一个 BloomFilter，用于在查询时快速判断某个 key 在该 region 中是否存在。

3. 钓鱼网站识别

浏览器有时候会警告用户，访问的网站很可能是钓鱼网站，用的就是这种技术

> 从这个算法大家可以对 tradeoff(取舍) 有更入的理解。
