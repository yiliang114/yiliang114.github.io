---
layout: CustomPages
title: 哈希
date: 2020-09-04
aside: false
draft: true
---

## Code

```js
function bfRainTerraces(terraces) {
  let waterAmount = 0;

  for (let terraceIndex = 0; terraceIndex < terraces.length; terraceIndex += 1) {
    // Get left most high terrace.
    let leftHighestLevel = 0;
    for (let leftIndex = terraceIndex - 1; leftIndex >= 0; leftIndex -= 1) {
      leftHighestLevel = Math.max(leftHighestLevel, terraces[leftIndex]);
    }

    // Get right most high terrace.
    let rightHighestLevel = 0;
    for (let rightIndex = terraceIndex + 1; rightIndex < terraces.length; rightIndex += 1) {
      rightHighestLevel = Math.max(rightHighestLevel, terraces[rightIndex]);
    }

    // Add current terrace water amount.
    const terraceBoundaryLevel = Math.min(leftHighestLevel, rightHighestLevel);
    if (terraceBoundaryLevel > terraces[terraceIndex]) {
      // Terrace will be able to store the water if the lowest of two left and right highest
      // terraces are still higher than the current one.
      waterAmount += Math.min(leftHighestLevel, rightHighestLevel) - terraces[terraceIndex];
    }
  }

  return waterAmount;
}
```

```js
function dpRainTerraces(terraces) {
  let waterAmount = 0;

  // Init arrays that will keep the list of left and right maximum levels for specific positions.
  const leftMaxLevels = new Array(terraces.length).fill(0);
  const rightMaxLevels = new Array(terraces.length).fill(0);

  // Calculate the highest terrace level from the LEFT relative to the current terrace.
  [leftMaxLevels[0]] = terraces;
  for (let terraceIndex = 1; terraceIndex < terraces.length; terraceIndex += 1) {
    leftMaxLevels[terraceIndex] = Math.max(terraces[terraceIndex], leftMaxLevels[terraceIndex - 1]);
  }

  // Calculate the highest terrace level from the RIGHT relative to the current terrace.
  rightMaxLevels[terraces.length - 1] = terraces[terraces.length - 1];
  for (let terraceIndex = terraces.length - 2; terraceIndex >= 0; terraceIndex -= 1) {
    rightMaxLevels[terraceIndex] = Math.max(terraces[terraceIndex], rightMaxLevels[terraceIndex + 1]);
  }

  // Not let's go through all terraces one by one and calculate how much water
  // each terrace may accumulate based on previously calculated values.
  for (let terraceIndex = 0; terraceIndex < terraces.length; terraceIndex += 1) {
    // Pick the lowest from the left/right highest terraces.
    const currentTerraceBoundary = Math.min(leftMaxLevels[terraceIndex], rightMaxLevels[terraceIndex]);

    if (currentTerraceBoundary > terraces[terraceIndex]) {
      waterAmount += currentTerraceBoundary - terraces[terraceIndex];
    }
  }

  return waterAmount;
}
```
