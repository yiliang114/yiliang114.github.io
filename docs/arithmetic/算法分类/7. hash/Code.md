---
layout: CustomPages
title: Hash Code
date: 2020-11-29
aside: false
draft: true
---

## Hash

```js
export default function Hash(key: string, mapLength: number = 50): number {
  return hashCode(key) % mapLength;
}

/**
 * Get the character code of a string
 */
function hashCode(string: string): number {
  let hash = 5381;
  let index = string.length;

  while (index) {
    hash = (hash * 33) ^ string.charCodeAt(--index);
  }

  return hash >>> 0;
}
```

## HashSet

```js
/**
 * Sets are unordered lists of objects
 *
 * Their order cannot be guaranteed to be the same as the order in
 * which they were inserted.
 *
 * @flow
 */
import Hash from './Hash';

function HashSet() {
  this.items = [];
  this.itemsLength = 0;
}

HashSet.prototype = {
  /**
   * Complexity: O(n)
   */
  add(value: any): boolean {
    this.items[Hash(value)] = value;
    this.itemsLength++;
    return true;
  },

  /**
   * Complexity: O(1)
   */
  contains(value: any): boolean {
    return !!this.items[Hash(value)];
  },

  /**
   * Complexity: O(1)
   */
  remove(value: any) {
    this.items[Hash(value)] = null;
    this.itemsLength--;
  },

  /**
   * Complexity: O(1)
   *
   * This complexity is a bit weird in Javascript. The array needs to be filtered
   * to remove null values, which are added when creating an array with a fixed
   * length (ex. array[42] = 'some')
   */
  all(): any[] {
    return this.items.filter((i: any): boolean => !!i); // eslint-disable-line
  },
};

export default HashSet;
```

## HashMap

```js
/**
 * A Map is used to map keys to values. It uses a hash function to compute
 * an index that maps to a value. Order of insertino is not guaranteed in hash
 * maps.
 *
 * TODO: Bucket collision detection and handling
 * @flow
 */
import Hash from './Hash';

function HashMap() {
  this.items = [];
  this.mapLength = 50;
}

HashMap.prototype.insert = function insert(key: any, value: any): HashMap {
  const generatedHashCode = Hash(key, this.mapLength);
  this.items[generatedHashCode] = value;
  return this;
};

HashMap.prototype.all = function all(): any[] {
  return this.items.filter((i: any): boolean => !!i);
};

/**
 * Search
 *
 * TODO:   Convert bucket type to array, loop through when accessing
 * @desc   Complexity: N/A, depends on strength of hash
 */
HashMap.prototype.get = function get(key: any): any {
  const generatedHashCode = Hash(key, this.mapLength);
  return this.items[generatedHashCode];
};

HashMap.prototype.remove = function remove(key: any): HashMap {
  const generatedHashCode = Hash(key, this.mapLength);
  this.items.splice(generatedHashCode, 1);
  return this;
};

export default HashMap;
```

```js
class HashMap {
  constructor() {
    this.data = [];
  }
  get(key) {
    let index = hash(key);
    let slot = this.data[index];
    if (!slot) {
      return undefined;
    }
    for (let [k, v] of slot) {
      if (key === k) {
        return v;
      }
    }
  }
  set(key, value) {
    let index = hash(key);

    if (!this.data[index]) {
      this.data[index] = [];
    }

    let slot = this.data[index];
    let indexInSlot = 0;

    // find available index in the given slot, or overwrite the given key
    // if a value is already defined for it.
    while (slot[indexInSlot]) {
      if (slot[indexInSlot][0] === key) {
        break;
      }
      indexInSlot++;
    }

    slot[indexInSlot] = [key, value];
  }
}

// hash function (provided)
function hash(string) {
  return string.split('').reduce((a, b) => (a << 5) + a + b.charCodeAt(0), 5381);
}
```
