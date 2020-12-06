---
layout: CustomPages
title: 前端与数据结构-JS
date: 2020-09-04
aside: false
draft: true
---

# General/ChSorting

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

# Paradigmns/Functional/ImmutableLists

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

# Puzzles/CurrencyConvert

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

# Puzzles/Maze 迷宫

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

# Puzzles/SimulateWar 模拟战争

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

# StreamAlgorithms/MooresVotingAlgorithm 摩尔投票算法

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

# StreamAlgorithms/ReservoirSampling 水库采样

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
