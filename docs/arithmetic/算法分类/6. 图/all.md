---
layout: CustomPages
title: 前端与数据结构-图
date: 2020-09-04
aside: false
draft: true
---

# SF/ALGs/graph/articulation-points/README

## Articulation Points (or Cut Vertices)

A vertex in an undirected connected graph is an articulation point
(or cut vertex) if removing it (and edges through it) disconnects
the graph. Articulation points represent vulnerabilities in a
connected network – single points whose failure would split the
network into 2 or more disconnected components. They are useful for
designing reliable networks.

For a disconnected undirected graph, an articulation point is a
vertex removing which increases number of connected components.

![Articulation Points](https://www.geeksforgeeks.org/wp-content/uploads/ArticulationPoints.png)

![Articulation Points](https://www.geeksforgeeks.org/wp-content/uploads/ArticulationPoints1.png)

![Articulation Points](https://www.geeksforgeeks.org/wp-content/uploads/ArticulationPoints21.png)

### References

- [GeeksForGeeks](https://www.geeksforgeeks.org/articulation-points-or-cut-vertices-in-a-graph/)
- [YouTube](https://www.youtube.com/watch?v=2kREIkF9UAs&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

# SF/ALGs/graph/articulation-points/articulationPoints

```js
import depthFirstSearch from '../depth-first-search/depthFirstSearch';

/**
 * Helper class for visited vertex metadata.
 */
class VisitMetadata {
  constructor({ discoveryTime, lowDiscoveryTime }) {
    this.discoveryTime = discoveryTime;
    this.lowDiscoveryTime = lowDiscoveryTime;
    // We need this in order to check graph root node, whether it has two
    // disconnected children or not.
    this.independentChildrenCount = 0;
  }
}

/**
 * Tarjan's algorithm for finding articulation points in graph.
 *
 * @param {Graph} graph
 * @return {Object}
 */
export default function articulationPoints(graph) {
  // Set of vertices we've already visited during DFS.
  const visitedSet = {};

  // Set of articulation points.
  const articulationPointsSet = {};

  // Time needed to discover to the current vertex.
  let discoveryTime = 0;

  // Peek the start vertex for DFS traversal.
  const startVertex = graph.getAllVertices()[0];

  const dfsCallbacks = {
    /**
     * @param {GraphVertex} currentVertex
     * @param {GraphVertex} previousVertex
     */
    enterVertex: ({ currentVertex, previousVertex }) => {
      // Tick discovery time.
      discoveryTime += 1;

      // Put current vertex to visited set.
      visitedSet[currentVertex.getKey()] = new VisitMetadata({
        discoveryTime,
        lowDiscoveryTime: discoveryTime,
      });

      if (previousVertex) {
        // Update children counter for previous vertex.
        visitedSet[previousVertex.getKey()].independentChildrenCount += 1;
      }
    },
    /**
     * @param {GraphVertex} currentVertex
     * @param {GraphVertex} previousVertex
     */
    leaveVertex: ({ currentVertex, previousVertex }) => {
      if (previousVertex === null) {
        // Don't do anything for the root vertex if it is already current (not previous one)
        return;
      }

      // Update the low time with the smallest time of adjacent vertices.
      // Get minimum low discovery time from all neighbors.
      /** @param {GraphVertex} neighbor */
      visitedSet[currentVertex.getKey()].lowDiscoveryTime = currentVertex
        .getNeighbors()
        .filter(earlyNeighbor => earlyNeighbor.getKey() !== previousVertex.getKey())
        /**
         * @param {number} lowestDiscoveryTime
         * @param {GraphVertex} neighbor
         */
        .reduce((lowestDiscoveryTime, neighbor) => {
          const neighborLowTime = visitedSet[neighbor.getKey()].lowDiscoveryTime;
          return neighborLowTime < lowestDiscoveryTime ? neighborLowTime : lowestDiscoveryTime;
        }, visitedSet[currentVertex.getKey()].lowDiscoveryTime);

      // Detect whether previous vertex is articulation point or not.
      // To do so we need to check two [OR] conditions:
      // 1. Is it a root vertex with at least two independent children.
      // 2. If its visited time is <= low time of adjacent vertex.
      if (previousVertex === startVertex) {
        // Check that root vertex has at least two independent children.
        if (visitedSet[previousVertex.getKey()].independentChildrenCount >= 2) {
          articulationPointsSet[previousVertex.getKey()] = previousVertex;
        }
      } else {
        // Get current vertex low discovery time.
        const currentLowDiscoveryTime = visitedSet[currentVertex.getKey()].lowDiscoveryTime;

        // Compare current vertex low discovery time with parent discovery time. Check if there
        // are any short path (back edge) exists. If we can't get to current vertex other then
        // via parent then the parent vertex is articulation point for current one.
        const parentDiscoveryTime = visitedSet[previousVertex.getKey()].discoveryTime;
        if (parentDiscoveryTime <= currentLowDiscoveryTime) {
          articulationPointsSet[previousVertex.getKey()] = previousVertex;
        }
      }
    },
    allowTraversal: ({ nextVertex }) => {
      return !visitedSet[nextVertex.getKey()];
    },
  };

  // Do Depth First Search traversal over submitted graph.
  depthFirstSearch(graph, startVertex, dfsCallbacks);

  return articulationPointsSet;
}
```

# SF/ALGs/graph/bellman-ford/README

## Bellman–Ford Algorithm

The Bellman–Ford algorithm is an algorithm that computes shortest
paths from a single source vertex to all of the other vertices
in a weighted digraph. It is slower than Dijkstra's algorithm
for the same problem, but more versatile, as it is capable of
handling graphs in which some of the edge weights are negative
numbers.

![Bellman-Ford](https://upload.wikimedia.org/wikipedia/commons/2/2e/Shortest_path_Dijkstra_vs_BellmanFord.gif)

### Complexity

Worst-case performance `O(|V||E|)`
Best-case performance `O(|E|)`
Worst-case space complexity `O(|V|)`

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm)
- [On YouTube by Michael Sambol](https://www.youtube.com/watch?v=obWXjtg0L64&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

# SF/ALGs/graph/bellman-ford/bellmanFord

```js
/**
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @return {{distances, previousVertices}}
 */
export default function bellmanFord(graph, startVertex) {
  const distances = {};
  const previousVertices = {};

  // Init all distances with infinity assuming that currently we can't reach
  // any of the vertices except start one.
  distances[startVertex.getKey()] = 0;
  graph.getAllVertices().forEach(vertex => {
    previousVertices[vertex.getKey()] = null;
    if (vertex.getKey() !== startVertex.getKey()) {
      distances[vertex.getKey()] = Infinity;
    }
  });

  // We need (|V| - 1) iterations.
  for (let iteration = 0; iteration < graph.getAllVertices().length - 1; iteration += 1) {
    // During each iteration go through all vertices.
    Object.keys(distances).forEach(vertexKey => {
      const vertex = graph.getVertexByKey(vertexKey);

      // Go through all vertex edges.
      graph.getNeighbors(vertex).forEach(neighbor => {
        const edge = graph.findEdge(vertex, neighbor);
        // Find out if the distance to the neighbor is shorter in this iteration
        // then in previous one.
        const distanceToVertex = distances[vertex.getKey()];
        const distanceToNeighbor = distanceToVertex + edge.weight;
        if (distanceToNeighbor < distances[neighbor.getKey()]) {
          distances[neighbor.getKey()] = distanceToNeighbor;
          previousVertices[neighbor.getKey()] = vertex;
        }
      });
    });
  }

  return {
    distances,
    previousVertices,
  };
}
```

# SF/ALGs/graph/breadth-first-search/README

## Breadth-First Search (BFS)

Breadth-first search (BFS) is an algorithm for traversing
or searching tree or graph data structures. It starts at
the tree root (or some arbitrary node of a graph, sometimes
referred to as a 'search key') and explores the neighbor
nodes first, before moving to the next level neighbors.

![Algorithm Visualization](https://upload.wikimedia.org/wikipedia/commons/5/5d/Breadth-First-Search-Algorithm.gif)

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Breadth-first_search)
- [Tree Traversals (Inorder, Preorder and Postorder)](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)
- [BFS vs DFS](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/)
- [BFS Visualization](https://www.cs.usfca.edu/~galles/visualization/BFS.html)

# SF/ALGs/graph/breadth-first-search/breadthFirstSearch

```js
import Queue from '../../../data-structures/queue/Queue';

/**
 * @typedef {Object} Callbacks
 *
 * @property {function(vertices: Object): boolean} [allowTraversal] -
 *   Determines whether DFS should traverse from the vertex to its neighbor
 *   (along the edge). By default prohibits visiting the same vertex again.
 *
 * @property {function(vertices: Object)} [enterVertex] - Called when BFS enters the vertex.
 *
 * @property {function(vertices: Object)} [leaveVertex] - Called when BFS leaves the vertex.
 */

/**
 * @param {Callbacks} [callbacks]
 * @returns {Callbacks}
 */
function initCallbacks(callbacks = {}) {
  const initiatedCallback = callbacks;

  const stubCallback = () => {};

  const allowTraversalCallback = (() => {
    const seen = {};
    return ({ nextVertex }) => {
      if (!seen[nextVertex.getKey()]) {
        seen[nextVertex.getKey()] = true;
        return true;
      }
      return false;
    };
  })();

  initiatedCallback.allowTraversal = callbacks.allowTraversal || allowTraversalCallback;
  initiatedCallback.enterVertex = callbacks.enterVertex || stubCallback;
  initiatedCallback.leaveVertex = callbacks.leaveVertex || stubCallback;

  return initiatedCallback;
}

/**
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @param {Callbacks} [originalCallbacks]
 */
export default function breadthFirstSearch(graph, startVertex, originalCallbacks) {
  const callbacks = initCallbacks(originalCallbacks);
  const vertexQueue = new Queue();

  // Do initial queue setup.
  vertexQueue.enqueue(startVertex);

  let previousVertex = null;

  // Traverse all vertices from the queue.
  while (!vertexQueue.isEmpty()) {
    const currentVertex = vertexQueue.dequeue();
    callbacks.enterVertex({ currentVertex, previousVertex });

    // Add all neighbors to the queue for future traversals.
    graph.getNeighbors(currentVertex).forEach(nextVertex => {
      if (callbacks.allowTraversal({ previousVertex, currentVertex, nextVertex })) {
        vertexQueue.enqueue(nextVertex);
      }
    });

    callbacks.leaveVertex({ currentVertex, previousVertex });

    // Memorize current vertex before next loop.
    previousVertex = currentVertex;
  }
}
```

# SF/ALGs/graph/bridges/README

## Bridges in Graph

In graph theory, a **bridge**, **isthmus**, **cut-edge**, or **cut arc** is an edge
of a graph whose deletion increases its number of connected components. Equivalently,
an edge is a bridge if and only if it is not contained in any cycle. A graph is said
to be bridgeless or isthmus-free if it contains no bridges.

![Bridges in graph](https://upload.wikimedia.org/wikipedia/commons/d/df/Graph_cut_edges.svg)

A graph with 16 vertices and 6 bridges (highlighted in red)

![Bridgeless](https://upload.wikimedia.org/wikipedia/commons/b/bf/Undirected.svg)

An undirected connected graph with no cut edges

![Bridges in graph](https://www.geeksforgeeks.org/wp-content/uploads/Bridge1.png)

![Bridges in graph](https://www.geeksforgeeks.org/wp-content/uploads/Bridge2.png)

![Bridges in graph](https://www.geeksforgeeks.org/wp-content/uploads/Bridge3.png)

### References

- [GeeksForGeeks on YouTube](https://www.youtube.com/watch?v=thLQYBlz2DM&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Wikipedia](https://en.wikipedia.org/wiki/Bridge_%28graph_theory%29#Tarjan.27s_Bridge-finding_algorithm)
- [GeeksForGeeks](https://www.geeksforgeeks.org/bridge-in-a-graph/)

# SF/ALGs/graph/bridges/graphBridges

```js
import depthFirstSearch from '../depth-first-search/depthFirstSearch';

/**
 * Helper class for visited vertex metadata.
 */
class VisitMetadata {
  constructor({ discoveryTime, lowDiscoveryTime }) {
    this.discoveryTime = discoveryTime;
    this.lowDiscoveryTime = lowDiscoveryTime;
  }
}

/**
 * @param {Graph} graph
 * @return {Object}
 */
export default function graphBridges(graph) {
  // Set of vertices we've already visited during DFS.
  const visitedSet = {};

  // Set of bridges.
  const bridges = {};

  // Time needed to discover to the current vertex.
  let discoveryTime = 0;

  // Peek the start vertex for DFS traversal.
  const startVertex = graph.getAllVertices()[0];

  const dfsCallbacks = {
    /**
     * @param {GraphVertex} currentVertex
     */
    enterVertex: ({ currentVertex }) => {
      // Tick discovery time.
      discoveryTime += 1;

      // Put current vertex to visited set.
      visitedSet[currentVertex.getKey()] = new VisitMetadata({
        discoveryTime,
        lowDiscoveryTime: discoveryTime,
      });
    },
    /**
     * @param {GraphVertex} currentVertex
     * @param {GraphVertex} previousVertex
     */
    leaveVertex: ({ currentVertex, previousVertex }) => {
      if (previousVertex === null) {
        // Don't do anything for the root vertex if it is already current (not previous one).
        return;
      }

      // Check if current node is connected to any early node other then previous one.
      visitedSet[currentVertex.getKey()].lowDiscoveryTime = currentVertex
        .getNeighbors()
        .filter(earlyNeighbor => earlyNeighbor.getKey() !== previousVertex.getKey())
        .reduce(
          /**
           * @param {number} lowestDiscoveryTime
           * @param {GraphVertex} neighbor
           */
          (lowestDiscoveryTime, neighbor) => {
            const neighborLowTime = visitedSet[neighbor.getKey()].lowDiscoveryTime;
            return neighborLowTime < lowestDiscoveryTime ? neighborLowTime : lowestDiscoveryTime;
          },
          visitedSet[currentVertex.getKey()].lowDiscoveryTime,
        );

      // Compare low discovery times. In case if current low discovery time is less than the one
      // in previous vertex then update previous vertex low time.
      const currentLowDiscoveryTime = visitedSet[currentVertex.getKey()].lowDiscoveryTime;
      const previousLowDiscoveryTime = visitedSet[previousVertex.getKey()].lowDiscoveryTime;
      if (currentLowDiscoveryTime < previousLowDiscoveryTime) {
        visitedSet[previousVertex.getKey()].lowDiscoveryTime = currentLowDiscoveryTime;
      }

      // Compare current vertex low discovery time with parent discovery time. Check if there
      // are any short path (back edge) exists. If we can't get to current vertex other then
      // via parent then the parent vertex is articulation point for current one.
      const parentDiscoveryTime = visitedSet[previousVertex.getKey()].discoveryTime;
      if (parentDiscoveryTime < currentLowDiscoveryTime) {
        const bridge = graph.findEdge(previousVertex, currentVertex);
        bridges[bridge.getKey()] = bridge;
      }
    },
    allowTraversal: ({ nextVertex }) => {
      return !visitedSet[nextVertex.getKey()];
    },
  };

  // Do Depth First Search traversal over submitted graph.
  depthFirstSearch(graph, startVertex, dfsCallbacks);

  return bridges;
}
```

# SF/ALGs/graph/depth-first-search/README

## Depth-First Search (DFS)

Depth-first search (DFS) is an algorithm for traversing or
searching tree or graph data structures. One starts at
the root (selecting some arbitrary node as the root in
the case of a graph) and explores as far as possible
along each branch before backtracking.

![Algorithm Visualization](https://upload.wikimedia.org/wikipedia/commons/7/7f/Depth-First-Search.gif)

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Depth-first_search)
- [Tree Traversals (Inorder, Preorder and Postorder)](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)
- [BFS vs DFS](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/)
- [DFS Visualization](https://www.cs.usfca.edu/~galles/visualization/DFS.html)

# SF/ALGs/graph/depth-first-search/depthFirstSearch

```js
/**
 * @typedef {Object} Callbacks
 *
 * @property {function(vertices: Object): boolean} [allowTraversal] -
 *  Determines whether DFS should traverse from the vertex to its neighbor
 *  (along the edge). By default prohibits visiting the same vertex again.
 *
 * @property {function(vertices: Object)} [enterVertex] - Called when DFS enters the vertex.
 *
 * @property {function(vertices: Object)} [leaveVertex] - Called when DFS leaves the vertex.
 */

/**
 * @param {Callbacks} [callbacks]
 * @returns {Callbacks}
 */
function initCallbacks(callbacks = {}) {
  const initiatedCallback = callbacks;

  const stubCallback = () => {};

  const allowTraversalCallback = (() => {
    const seen = {};
    return ({ nextVertex }) => {
      if (!seen[nextVertex.getKey()]) {
        seen[nextVertex.getKey()] = true;
        return true;
      }
      return false;
    };
  })();

  initiatedCallback.allowTraversal = callbacks.allowTraversal || allowTraversalCallback;
  initiatedCallback.enterVertex = callbacks.enterVertex || stubCallback;
  initiatedCallback.leaveVertex = callbacks.leaveVertex || stubCallback;

  return initiatedCallback;
}

/**
 * @param {Graph} graph
 * @param {GraphVertex} currentVertex
 * @param {GraphVertex} previousVertex
 * @param {Callbacks} callbacks
 */
function depthFirstSearchRecursive(graph, currentVertex, previousVertex, callbacks) {
  callbacks.enterVertex({ currentVertex, previousVertex });

  graph.getNeighbors(currentVertex).forEach(nextVertex => {
    if (callbacks.allowTraversal({ previousVertex, currentVertex, nextVertex })) {
      depthFirstSearchRecursive(graph, nextVertex, currentVertex, callbacks);
    }
  });

  callbacks.leaveVertex({ currentVertex, previousVertex });
}

/**
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @param {Callbacks} [callbacks]
 */
export default function depthFirstSearch(graph, startVertex, callbacks) {
  const previousVertex = null;
  depthFirstSearchRecursive(graph, startVertex, previousVertex, initCallbacks(callbacks));
}
```

# SF/ALGs/graph/detect-cycle/README

## Detect Cycle in Graphs

In graph theory, a **cycle** is a path of edges and vertices
wherein a vertex is reachable from itself. There are several
different types of cycles, principally a **closed walk** and
a **simple cycle**.

### Definitions

A **closed walk** consists of a sequence of vertices starting
and ending at the same vertex, with each two consecutive vertices
in the sequence adjacent to each other in the graph. In a directed graph,
each edge must be traversed by the walk consistently with its direction:
the edge must be oriented from the earlier of two consecutive vertices
to the later of the two vertices in the sequence.
The choice of starting vertex is not important: traversing the same cyclic
sequence of edges from different starting vertices produces the same closed walk.

A **simple cycle may** be defined either as a closed walk with no repetitions of
vertices and edges allowed, other than the repetition of the starting and ending
vertex, or as the set of edges in such a walk. The two definitions are equivalent
in directed graphs, where simple cycles are also called directed cycles: the cyclic
sequence of vertices and edges in a walk is completely determined by the set of
edges that it uses. In undirected graphs the set of edges of a cycle can be
traversed by a walk in either of two directions, giving two possible directed cycles
for every undirected cycle. A circuit can be a closed walk allowing repetitions of
vertices but not edges; however, it can also be a simple cycle, so explicit
definition is recommended when it is used.

### Example

![Cycles](https://upload.wikimedia.org/wikipedia/commons/e/e7/Graph_cycle.gif)

A graph with edges colored to illustrate **path** `H-A-B` (green), closed path or
**walk with a repeated vertex** `B-D-E-F-D-C-B` (blue) and a **cycle with no repeated edge** or
vertex `H-D-G-H` (red)

#### Cycle in undirected graph

![Undirected Cycle](https://www.geeksforgeeks.org/wp-content/uploads/cycleGraph.png)

#### Cycle in directed graph

![Directed Cycle](https://cdncontribute.geeksforgeeks.org/wp-content/uploads/cycle.png)

### References

General information:

- [Wikipedia](<https://en.wikipedia.org/wiki/Cycle_(graph_theory)>)

Cycles in undirected graphs:

- [Detect Cycle in Undirected Graph on GeeksForGeeks](https://www.geeksforgeeks.org/detect-cycle-undirected-graph/)
- [Detect Cycle in Undirected Graph Algorithm on YouTube](https://www.youtube.com/watch?v=n_t0a_8H8VY&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

Cycles in directed graphs:

- [Detect Cycle in Directed Graph on GeeksForGeeks](https://www.geeksforgeeks.org/detect-cycle-in-a-graph/)
- [Detect Cycle in Directed Graph Algorithm on YouTube](https://www.youtube.com/watch?v=rKQaZuoUR4M&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

# SF/ALGs/graph/detect-cycle/detectDirectedCycle

```js
import depthFirstSearch from '../depth-first-search/depthFirstSearch';

/**
 * Detect cycle in directed graph using Depth First Search.
 *
 * @param {Graph} graph
 */
export default function detectDirectedCycle(graph) {
  let cycle = null;

  // Will store parents (previous vertices) for all visited nodes.
  // This will be needed in order to specify what path exactly is a cycle.
  const dfsParentMap = {};

  // White set (UNVISITED) contains all the vertices that haven't been visited at all.
  const whiteSet = {};

  // Gray set (VISITING) contains all the vertices that are being visited right now
  // (in current path).
  const graySet = {};

  // Black set (VISITED) contains all the vertices that has been fully visited.
  // Meaning that all children of the vertex has been visited.
  const blackSet = {};

  // If we encounter vertex in gray set it means that we've found a cycle.
  // Because when vertex in gray set it means that its neighbors or its neighbors
  // neighbors are still being explored.

  // Init white set and add all vertices to it.
  /** @param {GraphVertex} vertex */
  graph.getAllVertices().forEach(vertex => {
    whiteSet[vertex.getKey()] = vertex;
  });

  // Describe BFS callbacks.
  const callbacks = {
    enterVertex: ({ currentVertex, previousVertex }) => {
      if (graySet[currentVertex.getKey()]) {
        // If current vertex already in grey set it means that cycle is detected.
        // Let's detect cycle path.
        cycle = {};

        let currentCycleVertex = currentVertex;
        let previousCycleVertex = previousVertex;

        while (previousCycleVertex.getKey() !== currentVertex.getKey()) {
          cycle[currentCycleVertex.getKey()] = previousCycleVertex;
          currentCycleVertex = previousCycleVertex;
          previousCycleVertex = dfsParentMap[previousCycleVertex.getKey()];
        }

        cycle[currentCycleVertex.getKey()] = previousCycleVertex;
      } else {
        // Otherwise let's add current vertex to gray set and remove it from white set.
        graySet[currentVertex.getKey()] = currentVertex;
        delete whiteSet[currentVertex.getKey()];

        // Update DFS parents list.
        dfsParentMap[currentVertex.getKey()] = previousVertex;
      }
    },
    leaveVertex: ({ currentVertex }) => {
      // If all node's children has been visited let's remove it from gray set
      // and move it to the black set meaning that all its neighbors are visited.
      blackSet[currentVertex.getKey()] = currentVertex;
      delete graySet[currentVertex.getKey()];
    },
    allowTraversal: ({ nextVertex }) => {
      // If cycle was detected we must forbid all further traversing since it will
      // cause infinite traversal loop.
      if (cycle) {
        return false;
      }

      // Allow traversal only for the vertices that are not in black set
      // since all black set vertices have been already visited.
      return !blackSet[nextVertex.getKey()];
    },
  };

  // Start exploring vertices.
  while (Object.keys(whiteSet).length) {
    // Pick fist vertex to start BFS from.
    const firstWhiteKey = Object.keys(whiteSet)[0];
    const startVertex = whiteSet[firstWhiteKey];

    // Do Depth First Search.
    depthFirstSearch(graph, startVertex, callbacks);
  }

  return cycle;
}
```

# SF/ALGs/graph/detect-cycle/detectUndirectedCycle

```js
import depthFirstSearch from '../depth-first-search/depthFirstSearch';

/**
 * Detect cycle in undirected graph using Depth First Search.
 *
 * @param {Graph} graph
 */
export default function detectUndirectedCycle(graph) {
  let cycle = null;

  // List of vertices that we have visited.
  const visitedVertices = {};

  // List of parents vertices for every visited vertex.
  const parents = {};

  // Callbacks for DFS traversing.
  const callbacks = {
    allowTraversal: ({ currentVertex, nextVertex }) => {
      // Don't allow further traversal in case if cycle has been detected.
      if (cycle) {
        return false;
      }

      // Don't allow traversal from child back to its parent.
      const currentVertexParent = parents[currentVertex.getKey()];
      const currentVertexParentKey = currentVertexParent ? currentVertexParent.getKey() : null;

      return currentVertexParentKey !== nextVertex.getKey();
    },
    enterVertex: ({ currentVertex, previousVertex }) => {
      if (visitedVertices[currentVertex.getKey()]) {
        // Compile cycle path based on parents of previous vertices.
        cycle = {};

        let currentCycleVertex = currentVertex;
        let previousCycleVertex = previousVertex;

        while (previousCycleVertex.getKey() !== currentVertex.getKey()) {
          cycle[currentCycleVertex.getKey()] = previousCycleVertex;
          currentCycleVertex = previousCycleVertex;
          previousCycleVertex = parents[previousCycleVertex.getKey()];
        }

        cycle[currentCycleVertex.getKey()] = previousCycleVertex;
      } else {
        // Add next vertex to visited set.
        visitedVertices[currentVertex.getKey()] = currentVertex;
        parents[currentVertex.getKey()] = previousVertex;
      }
    },
  };

  // Start DFS traversing.
  const startVertex = graph.getAllVertices()[0];
  depthFirstSearch(graph, startVertex, callbacks);

  return cycle;
}
```

# SF/ALGs/graph/detect-cycle/detectUndirectedCycleUsingDisjointSet

```js
import DisjointSet from '../../../data-structures/disjoint-set/DisjointSet';

/**
 * Detect cycle in undirected graph using disjoint sets.
 *
 * @param {Graph} graph
 */
export default function detectUndirectedCycleUsingDisjointSet(graph) {
  // Create initial singleton disjoint sets for each graph vertex.
  /** @param {GraphVertex} graphVertex */
  const keyExtractor = graphVertex => graphVertex.getKey();
  const disjointSet = new DisjointSet(keyExtractor);
  graph.getAllVertices().forEach(graphVertex => disjointSet.makeSet(graphVertex));

  // Go trough all graph edges one by one and check if edge vertices are from the
  // different sets. In this case joint those sets together. Do this until you find
  // an edge where to edge vertices are already in one set. This means that current
  // edge will create a cycle.
  let cycleFound = false;
  /** @param {GraphEdge} graphEdge */
  graph.getAllEdges().forEach(graphEdge => {
    if (disjointSet.inSameSet(graphEdge.startVertex, graphEdge.endVertex)) {
      // Cycle found.
      cycleFound = true;
    } else {
      disjointSet.union(graphEdge.startVertex, graphEdge.endVertex);
    }
  });

  return cycleFound;
}
```

# SF/ALGs/graph/dijkstra/README

## Dijkstra's Algorithm

Dijkstra's algorithm is an algorithm for finding the shortest
paths between nodes in a graph, which may represent, for example,
road networks.

The algorithm exists in many variants; Dijkstra's original variant
found the shortest path between two nodes, but a more common
variant fixes a single node as the "source" node and finds
shortest paths from the source to all other nodes in the graph,
producing a shortest-path tree.

![Dijkstra](https://upload.wikimedia.org/wikipedia/commons/5/57/Dijkstra_Animation.gif)

Dijkstra's algorithm to find the shortest path between `a` and `b`.
It picks the unvisited vertex with the lowest distance,
calculates the distance through it to each unvisited neighbor,
and updates the neighbor's distance if smaller. Mark visited
(set to red) when done with neighbors.

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
- [On YouTube by Nathaniel Fan](https://www.youtube.com/watch?v=gdmfOwyQlcI&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [On YouTube by Tushar Roy](https://www.youtube.com/watch?v=lAXZGERcDf4&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

# SF/ALGs/graph/dijkstra/dijkstra

```js
import PriorityQueue from '../../../data-structures/priority-queue/PriorityQueue';

/**
 * @typedef {Object} ShortestPaths
 * @property {Object} distances - shortest distances to all vertices
 * @property {Object} previousVertices - shortest paths to all vertices.
 */

/**
 * Implementation of Dijkstra algorithm of finding the shortest paths to graph nodes.
 * @param {Graph} graph - graph we're going to traverse.
 * @param {GraphVertex} startVertex - traversal start vertex.
 * @return {ShortestPaths}
 */
export default function dijkstra(graph, startVertex) {
  // Init helper variables that we will need for Dijkstra algorithm.
  const distances = {};
  const visitedVertices = {};
  const previousVertices = {};
  const queue = new PriorityQueue();

  // Init all distances with infinity assuming that currently we can't reach
  // any of the vertices except the start one.
  graph.getAllVertices().forEach(vertex => {
    distances[vertex.getKey()] = Infinity;
    previousVertices[vertex.getKey()] = null;
  });

  // We are already at the startVertex so the distance to it is zero.
  distances[startVertex.getKey()] = 0;

  // Init vertices queue.
  queue.add(startVertex, distances[startVertex.getKey()]);

  // Iterate over the priority queue of vertices until it is empty.
  while (!queue.isEmpty()) {
    // Fetch next closest vertex.
    const currentVertex = queue.poll();

    // Iterate over every unvisited neighbor of the current vertex.
    currentVertex.getNeighbors().forEach(neighbor => {
      // Don't visit already visited vertices.
      if (!visitedVertices[neighbor.getKey()]) {
        // Update distances to every neighbor from current vertex.
        const edge = graph.findEdge(currentVertex, neighbor);

        const existingDistanceToNeighbor = distances[neighbor.getKey()];
        const distanceToNeighborFromCurrent = distances[currentVertex.getKey()] + edge.weight;

        // If we've found shorter path to the neighbor - update it.
        if (distanceToNeighborFromCurrent < existingDistanceToNeighbor) {
          distances[neighbor.getKey()] = distanceToNeighborFromCurrent;

          // Change priority of the neighbor in a queue since it might have became closer.
          if (queue.hasValue(neighbor)) {
            queue.changePriority(neighbor, distances[neighbor.getKey()]);
          }

          // Remember previous closest vertex.
          previousVertices[neighbor.getKey()] = currentVertex;
        }

        // Add neighbor to the queue for further visiting.
        if (!queue.hasValue(neighbor)) {
          queue.add(neighbor, distances[neighbor.getKey()]);
        }
      }
    });

    // Add current vertex to visited ones to avoid visiting it again later.
    visitedVertices[currentVertex.getKey()] = currentVertex;
  }

  // Return the set of shortest distances to all vertices and the set of
  // shortest paths to all vertices in a graph.
  return {
    distances,
    previousVertices,
  };
}
```

# SF/ALGs/graph/eulerian-path/README

## Eulerian Path

In graph theory, an **Eulerian trail** (or **Eulerian path**) is a
trail in a finite graph which visits every edge exactly once.
Similarly, an **Eulerian circuit** or **Eulerian cycle** is an
Eulerian trail which starts and ends on the same vertex.

Euler proved that a necessary condition for the existence of Eulerian
circuits is that all vertices in the graph have an even degree, and
stated that connected graphs with all vertices of even degree have
an Eulerian circuit.

![Eulerian Circuit](https://upload.wikimedia.org/wikipedia/commons/7/72/Labelled_Eulergraph.svg)

Every vertex of this graph has an even degree. Therefore, this is
an Eulerian graph. Following the edges in alphabetical order gives
an Eulerian circuit/cycle.

For the existence of Eulerian trails it is necessary that zero or
two vertices have an odd degree; this means the Königsberg graph
is not Eulerian. If there are no vertices of odd degree,
all Eulerian trails are circuits. If there are exactly two vertices
of odd degree, all Eulerian trails start at one of them and end at
the other. A graph that has an Eulerian trail but not an Eulerian
circuit is called semi-Eulerian.

![Königsberg graph](https://upload.wikimedia.org/wikipedia/commons/9/96/K%C3%B6nigsberg_graph.svg)

The Königsberg Bridges multigraph. This multigraph is not Eulerian,
therefore, a solution does not exist.

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Eulerian_path)
- [YouTube](https://www.youtube.com/watch?v=vvP4Fg4r-Ns&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

# SF/ALGs/graph/eulerian-path/eulerianPath

```js
import graphBridges from '../bridges/graphBridges';

/**
 * Fleury's algorithm of finding Eulerian Path (visit all graph edges exactly once).
 *
 * @param {Graph} graph
 * @return {GraphVertex[]}
 */
export default function eulerianPath(graph) {
  const eulerianPathVertices = [];

  // Set that contains all vertices with even rank (number of neighbors).
  const evenRankVertices = {};

  // Set that contains all vertices with odd rank (number of neighbors).
  const oddRankVertices = {};

  // Set of all not visited edges.
  const notVisitedEdges = {};
  graph.getAllEdges().forEach(vertex => {
    notVisitedEdges[vertex.getKey()] = vertex;
  });

  // Detect whether graph contains Eulerian Circuit or Eulerian Path or none of them.
  /** @params {GraphVertex} vertex */
  graph.getAllVertices().forEach(vertex => {
    if (vertex.getDegree() % 2) {
      oddRankVertices[vertex.getKey()] = vertex;
    } else {
      evenRankVertices[vertex.getKey()] = vertex;
    }
  });

  // Check whether we're dealing with Eulerian Circuit or Eulerian Path only.
  // Graph would be an Eulerian Circuit in case if all its vertices has even degree.
  // If not all vertices have even degree then graph must contain only two odd-degree
  // vertices in order to have Euler Path.
  const isCircuit = !Object.values(oddRankVertices).length;

  if (!isCircuit && Object.values(oddRankVertices).length !== 2) {
    throw new Error('Eulerian path must contain two odd-ranked vertices');
  }

  // Pick start vertex for traversal.
  let startVertex = null;

  if (isCircuit) {
    // For Eulerian Circuit it doesn't matter from what vertex to start thus we'll just
    // peek a first node.
    const evenVertexKey = Object.keys(evenRankVertices)[0];
    startVertex = evenRankVertices[evenVertexKey];
  } else {
    // For Eulerian Path we need to start from one of two odd-degree vertices.
    const oddVertexKey = Object.keys(oddRankVertices)[0];
    startVertex = oddRankVertices[oddVertexKey];
  }

  // Start traversing the graph.
  let currentVertex = startVertex;
  while (Object.values(notVisitedEdges).length) {
    // Add current vertex to Eulerian path.
    eulerianPathVertices.push(currentVertex);

    // Detect all bridges in graph.
    // We need to do it in order to not delete bridges if there are other edges
    // exists for deletion.
    const bridges = graphBridges(graph);

    // Peek the next edge to delete from graph.
    const currentEdges = currentVertex.getEdges();
    /** @var {GraphEdge} edgeToDelete */
    let edgeToDelete = null;
    if (currentEdges.length === 1) {
      // If there is only one edge left we need to peek it.
      [edgeToDelete] = currentEdges;
    } else {
      // If there are many edges left then we need to peek any of those except bridges.
      [edgeToDelete] = currentEdges.filter(edge => !bridges[edge.getKey()]);
    }

    // Detect next current vertex.
    if (currentVertex.getKey() === edgeToDelete.startVertex.getKey()) {
      currentVertex = edgeToDelete.endVertex;
    } else {
      currentVertex = edgeToDelete.startVertex;
    }

    // Delete edge from not visited edges set.
    delete notVisitedEdges[edgeToDelete.getKey()];

    // If last edge were deleted then add finish vertex to Eulerian Path.
    if (Object.values(notVisitedEdges).length === 0) {
      eulerianPathVertices.push(currentVertex);
    }

    // Delete the edge from graph.
    graph.deleteEdge(edgeToDelete);
  }

  return eulerianPathVertices;
}
```

# SF/ALGs/graph/floyd-warshall/README

## Floyd–Warshall Algorithm

In computer science, the **Floyd–Warshall algorithm** is an algorithm for finding
shortest paths in a weighted graph with positive or negative edge weights (but
with no negative cycles). A single execution of the algorithm will find the
lengths (summed weights) of shortest paths between all pairs of vertices. Although
it does not return details of the paths themselves, it is possible to reconstruct
the paths with simple modifications to the algorithm.

### Algorithm

The Floyd–Warshall algorithm compares all possible paths through the graph between
each pair of vertices. It is able to do this with `O(|V|^3)` comparisons in a graph.
This is remarkable considering that there may be up to `|V|^2` edges in the graph,
and every combination of edges is tested. It does so by incrementally improving an
estimate on the shortest path between two vertices, until the estimate is optimal.

Consider a graph `G` with vertices `V` numbered `1` through `N`. Further consider
a function `shortestPath(i, j, k)` that returns the shortest possible path
from `i` to `j` using vertices only from the set `{1, 2, ..., k}` as
intermediate points along the way. Now, given this function, our goal is to
find the shortest path from each `i` to each `j` using only vertices
in `{1, 2, ..., N}`.

![Recursive Formula](https://wikimedia.org/api/rest_v1/media/math/render/svg/f9b75e25063384ccca499c56f9a279abf661ad3b)

![Recursive Formula](https://wikimedia.org/api/rest_v1/media/math/render/svg/34ac7c89bbb18df3fd660225fd38997079e5e513)
![Recursive Formula](https://wikimedia.org/api/rest_v1/media/math/render/svg/0326d6c14def89269c029da59eba012d0f2edc9d)

This formula is the heart of the Floyd–Warshall algorithm.

### Example

The algorithm above is executed on the graph on the left below:

![Example](https://upload.wikimedia.org/wikipedia/commons/2/2e/Floyd-Warshall_example.svg)

In the tables below `i` is row numbers and `j` is column numbers.

**k = 0**

|       |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| **1** |  0  |  ∞  | −2  |  ∞  |
| **2** |  4  |  0  |  3  |  ∞  |
| **3** |  ∞  |  ∞  |  0  |  2  |
| **4** |  ∞  | −1  |  ∞  |  0  |

**k = 1**

|       |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| **1** |  0  |  ∞  | −2  |  ∞  |
| **2** |  4  |  0  |  2  |  ∞  |
| **3** |  ∞  |  ∞  |  0  |  2  |
| **4** |  ∞  |  −  |  ∞  |  0  |

**k = 2**

|       |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| **1** |  0  |  ∞  | −2  |  ∞  |
| **2** |  4  |  0  |  2  |  ∞  |
| **3** |  ∞  |  ∞  |  0  |  2  |
| **4** |  3  | −1  |  1  |  0  |

**k = 3**

|       |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| **1** |  0  |  ∞  | −2  |  0  |
| **2** |  4  |  0  |  2  |  4  |
| **3** |  ∞  |  ∞  |  0  |  2  |
| **4** |  3  | −1  |  1  |  0  |

**k = 4**

|       |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| **1** |  0  | −1  | −2  |  0  |
| **2** |  4  |  0  |  2  |  4  |
| **3** |  5  |  1  |  0  |  2  |
| **4** |  3  | −1  |  1  |  0  |

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm)
- [YouTube (by Abdul Bari)](https://www.youtube.com/watch?v=oNI0rf2P9gE&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=74)
- [YouTube (by Tushar Roy)](https://www.youtube.com/watch?v=LwJdNfdLF9s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=75)

# SF/ALGs/graph/floyd-warshall/floydWarshall

```js
/**
 * @param {Graph} graph
 * @return {{distances: number[][], nextVertices: GraphVertex[][]}}
 */
export default function floydWarshall(graph) {
  // Get all graph vertices.
  const vertices = graph.getAllVertices();

  // Init previous vertices matrix with nulls meaning that there are no
  // previous vertices exist that will give us shortest path.
  const nextVertices = Array(vertices.length)
    .fill(null)
    .map(() => {
      return Array(vertices.length).fill(null);
    });

  // Init distances matrix with Infinities meaning there are no paths
  // between vertices exist so far.
  const distances = Array(vertices.length)
    .fill(null)
    .map(() => {
      return Array(vertices.length).fill(Infinity);
    });

  // Init distance matrix with the distance we already now (from existing edges).
  // And also init previous vertices from the edges.
  vertices.forEach((startVertex, startIndex) => {
    vertices.forEach((endVertex, endIndex) => {
      if (startVertex === endVertex) {
        // Distance to the vertex itself is 0.
        distances[startIndex][endIndex] = 0;
      } else {
        // Find edge between the start and end vertices.
        const edge = graph.findEdge(startVertex, endVertex);

        if (edge) {
          // There is an edge from vertex with startIndex to vertex with endIndex.
          // Save distance and previous vertex.
          distances[startIndex][endIndex] = edge.weight;
          nextVertices[startIndex][endIndex] = startVertex;
        } else {
          distances[startIndex][endIndex] = Infinity;
        }
      }
    });
  });

  // Now let's go to the core of the algorithm.
  // Let's all pair of vertices (from start to end ones) and try to check if there
  // is a shorter path exists between them via middle vertex. Middle vertex may also
  // be one of the graph vertices. As you may see now we're going to have three
  // loops over all graph vertices: for start, end and middle vertices.
  vertices.forEach((middleVertex, middleIndex) => {
    // Path starts from startVertex with startIndex.
    vertices.forEach((startVertex, startIndex) => {
      // Path ends to endVertex with endIndex.
      vertices.forEach((endVertex, endIndex) => {
        // Compare existing distance from startVertex to endVertex, with distance
        // from startVertex to endVertex but via middleVertex.
        // Save the shortest distance and previous vertex that allows
        // us to have this shortest distance.
        const distViaMiddle = distances[startIndex][middleIndex] + distances[middleIndex][endIndex];

        if (distances[startIndex][endIndex] > distViaMiddle) {
          // We've found a shortest pass via middle vertex.
          distances[startIndex][endIndex] = distViaMiddle;
          nextVertices[startIndex][endIndex] = middleVertex;
        }
      });
    });
  });

  // Shortest distance from x to y: distance[x][y].
  // Next vertex after x one in path from x to y: nextVertices[x][y].
  return { distances, nextVertices };
}
```

# SF/ALGs/graph/hamiltonian-cycle/README

## Hamiltonian Path

**Hamiltonian path** (or **traceable path**) is a path in an
undirected or directed graph that visits each vertex exactly once.
A **Hamiltonian cycle** (or **Hamiltonian circuit**) is a
Hamiltonian path that is a cycle. Determining whether such paths
and cycles exist in graphs is the **Hamiltonian path problem**.

![Hamiltonian cycle](https://upload.wikimedia.org/wikipedia/commons/6/6c/Hamiltonian_path_3d.svg)

One possible Hamiltonian cycle through every vertex of a
dodecahedron is shown in red – like all platonic solids, the
dodecahedron is Hamiltonian.

### Naive Algorithm

Generate all possible configurations of vertices and print a
configuration that satisfies the given constraints. There
will be `n!` (n factorial) configurations.

```
while there are untried configurations
{
   generate the next configuration
   if ( there are edges between two consecutive vertices of this
      configuration and there is an edge from the last vertex to
      the first ).
   {
      print this configuration;
      break;
   }
}
```

### Backtracking Algorithm

Create an empty path array and add vertex `0` to it. Add other
vertices, starting from the vertex `1`. Before adding a vertex,
check for whether it is adjacent to the previously added vertex
and not already added. If we find such a vertex, we add the
vertex as part of the solution. If we do not find a vertex
then we return false.

### References

- [Hamiltonian path on Wikipedia](https://en.wikipedia.org/wiki/Hamiltonian_path)
- [Hamiltonian path on YouTube](https://www.youtube.com/watch?v=dQr4wZCiJJ4&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Hamiltonian cycle on GeeksForGeeks](https://www.geeksforgeeks.org/backtracking-set-7-hamiltonian-cycle/)

# SF/ALGs/graph/hamiltonian-cycle/hamiltonianCycle

```js
import GraphVertex from '../../../data-structures/graph/GraphVertex';

/**
 * @param {number[][]} adjacencyMatrix
 * @param {object} verticesIndices
 * @param {GraphVertex[]} cycle
 * @param {GraphVertex} vertexCandidate
 * @return {boolean}
 */
function isSafe(adjacencyMatrix, verticesIndices, cycle, vertexCandidate) {
  const endVertex = cycle[cycle.length - 1];

  // Get end and candidate vertices indices in adjacency matrix.
  const candidateVertexAdjacencyIndex = verticesIndices[vertexCandidate.getKey()];
  const endVertexAdjacencyIndex = verticesIndices[endVertex.getKey()];

  // Check if last vertex in the path and candidate vertex are adjacent.
  if (adjacencyMatrix[endVertexAdjacencyIndex][candidateVertexAdjacencyIndex] === Infinity) {
    return false;
  }

  // Check if vertexCandidate is being added to the path for the first time.
  const candidateDuplicate = cycle.find(vertex => vertex.getKey() === vertexCandidate.getKey());

  return !candidateDuplicate;
}

/**
 * @param {number[][]} adjacencyMatrix
 * @param {object} verticesIndices
 * @param {GraphVertex[]} cycle
 * @return {boolean}
 */
function isCycle(adjacencyMatrix, verticesIndices, cycle) {
  // Check if first and last vertices in hamiltonian path are adjacent.

  // Get start and end vertices from the path.
  const startVertex = cycle[0];
  const endVertex = cycle[cycle.length - 1];

  // Get start/end vertices indices in adjacency matrix.
  const startVertexAdjacencyIndex = verticesIndices[startVertex.getKey()];
  const endVertexAdjacencyIndex = verticesIndices[endVertex.getKey()];

  // Check if we can go from end vertex to the start one.
  return adjacencyMatrix[endVertexAdjacencyIndex][startVertexAdjacencyIndex] !== Infinity;
}

/**
 * @param {number[][]} adjacencyMatrix
 * @param {GraphVertex[]} vertices
 * @param {object} verticesIndices
 * @param {GraphVertex[][]} cycles
 * @param {GraphVertex[]} cycle
 */
function hamiltonianCycleRecursive({ adjacencyMatrix, vertices, verticesIndices, cycles, cycle }) {
  // Clone cycle in order to prevent it from modification by other DFS branches.
  const currentCycle = [...cycle].map(vertex => new GraphVertex(vertex.value));

  if (vertices.length === currentCycle.length) {
    // Hamiltonian path is found.
    // Now we need to check if it is cycle or not.
    if (isCycle(adjacencyMatrix, verticesIndices, currentCycle)) {
      // Another solution has been found. Save it.
      cycles.push(currentCycle);
    }
    return;
  }

  for (let vertexIndex = 0; vertexIndex < vertices.length; vertexIndex += 1) {
    // Get vertex candidate that we will try to put into next path step and see if it fits.
    const vertexCandidate = vertices[vertexIndex];

    // Check if it is safe to put vertex candidate to cycle.
    if (isSafe(adjacencyMatrix, verticesIndices, currentCycle, vertexCandidate)) {
      // Add candidate vertex to cycle path.
      currentCycle.push(vertexCandidate);

      // Try to find other vertices in cycle.
      hamiltonianCycleRecursive({
        adjacencyMatrix,
        vertices,
        verticesIndices,
        cycles,
        cycle: currentCycle,
      });

      // BACKTRACKING.
      // Remove candidate vertex from cycle path in order to try another one.
      currentCycle.pop();
    }
  }
}

/**
 * @param {Graph} graph
 * @return {GraphVertex[][]}
 */
export default function hamiltonianCycle(graph) {
  // Gather some information about the graph that we will need to during
  // the problem solving.
  const verticesIndices = graph.getVerticesIndices();
  const adjacencyMatrix = graph.getAdjacencyMatrix();
  const vertices = graph.getAllVertices();

  // Define start vertex. We will always pick the first one
  // this it doesn't matter which vertex to pick in a cycle.
  // Every vertex is in a cycle so we can start from any of them.
  const startVertex = vertices[0];

  // Init cycles array that will hold all solutions.
  const cycles = [];

  // Init cycle array that will hold current cycle path.
  const cycle = [startVertex];

  // Try to find cycles recursively in Depth First Search order.
  hamiltonianCycleRecursive({
    adjacencyMatrix,
    vertices,
    verticesIndices,
    cycles,
    cycle,
  });

  // Return found cycles.
  return cycles;
}
```

# SF/ALGs/graph/kruskal/README

## Kruskal's Algorithm

Kruskal's algorithm is a minimum-spanning-tree algorithm which
finds an edge of the least possible weight that connects any two
trees in the forest. It is a greedy algorithm in graph theory
as it finds a minimum spanning tree for a connected weighted
graph adding increasing cost arcs at each step. This means it
finds a subset of the edges that forms a tree that includes every
vertex, where the total weight of all the edges in the tree is
minimized. If the graph is not connected, then it finds a
minimum spanning forest (a minimum spanning tree for each
connected component).

![Kruskal Algorithm](https://upload.wikimedia.org/wikipedia/commons/5/5c/MST_kruskal_en.gif)

![Kruskal Demo](https://upload.wikimedia.org/wikipedia/commons/b/bb/KruskalDemo.gif)

A demo for Kruskal's algorithm based on Euclidean distance.

### Minimum Spanning Tree

A **minimum spanning tree** (MST) or minimum weight spanning tree
is a subset of the edges of a connected, edge-weighted
(un)directed graph that connects all the vertices together,
without any cycles and with the minimum possible total edge
weight. That is, it is a spanning tree whose sum of edge weights
is as small as possible. More generally, any edge-weighted
undirected graph (not necessarily connected) has a minimum
spanning forest, which is a union of the minimum spanning
trees for its connected components.

![Minimum Spanning Tree](https://upload.wikimedia.org/wikipedia/commons/d/d2/Minimum_spanning_tree.svg)

A planar graph and its minimum spanning tree. Each edge is
labeled with its weight, which here is roughly proportional
to its length.

![Minimum Spanning Tree](https://upload.wikimedia.org/wikipedia/commons/c/c9/Multiple_minimum_spanning_trees.svg)

This figure shows there may be more than one minimum spanning
tree in a graph. In the figure, the two trees below the graph
are two possibilities of minimum spanning tree of the given graph.

### References

- [Minimum Spanning Tree on Wikipedia](https://en.wikipedia.org/wiki/Minimum_spanning_tree)
- [Kruskal's Algorithm on Wikipedia](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm)
- [Kruskal's Algorithm on YouTube by Tushar Roy](https://www.youtube.com/watch?v=fAuF0EuZVCk&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Kruskal's Algorithm on YouTube by Michael Sambol](https://www.youtube.com/watch?v=71UQH7Pr9kU&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

# SF/ALGs/graph/kruskal/kruskal

```js
import Graph from '../../../data-structures/graph/Graph';
import QuickSort from '../../sorting/quick-sort/QuickSort';
import DisjointSet from '../../../data-structures/disjoint-set/DisjointSet';

/**
 * @param {Graph} graph
 * @return {Graph}
 */
export default function kruskal(graph) {
  // It should fire error if graph is directed since the algorithm works only
  // for undirected graphs.
  if (graph.isDirected) {
    throw new Error("Kruskal's algorithms works only for undirected graphs");
  }

  // Init new graph that will contain minimum spanning tree of original graph.
  const minimumSpanningTree = new Graph();

  // Sort all graph edges in increasing order.
  const sortingCallbacks = {
    /**
     * @param {GraphEdge} graphEdgeA
     * @param {GraphEdge} graphEdgeB
     */
    compareCallback: (graphEdgeA, graphEdgeB) => {
      if (graphEdgeA.weight === graphEdgeB.weight) {
        return 1;
      }

      return graphEdgeA.weight <= graphEdgeB.weight ? -1 : 1;
    },
  };
  const sortedEdges = new QuickSort(sortingCallbacks).sort(graph.getAllEdges());

  // Create disjoint sets for all graph vertices.
  const keyCallback = graphVertex => graphVertex.getKey();
  const disjointSet = new DisjointSet(keyCallback);

  graph.getAllVertices().forEach(graphVertex => {
    disjointSet.makeSet(graphVertex);
  });

  // Go through all edges started from the minimum one and try to add them
  // to minimum spanning tree. The criteria of adding the edge would be whether
  // it is forms the cycle or not (if it connects two vertices from one disjoint
  // set or not).
  for (let edgeIndex = 0; edgeIndex < sortedEdges.length; edgeIndex += 1) {
    /** @var {GraphEdge} currentEdge */
    const currentEdge = sortedEdges[edgeIndex];

    // Check if edge forms the cycle. If it does then skip it.
    if (!disjointSet.inSameSet(currentEdge.startVertex, currentEdge.endVertex)) {
      // Unite two subsets into one.
      disjointSet.union(currentEdge.startVertex, currentEdge.endVertex);

      // Add this edge to spanning tree.
      minimumSpanningTree.addEdge(currentEdge);
    }
  }

  return minimumSpanningTree;
}
```

# SF/ALGs/graph/prim/README

## Prim's Algorithm

In computer science, **Prim's algorithm** is a greedy algorithm that
finds a minimum spanning tree for a weighted undirected graph.

The algorithm operates by building this tree one vertex at a
time, from an arbitrary starting vertex, at each step adding
the cheapest possible connection from the tree to another vertex.

![Prim's Algorithm](https://upload.wikimedia.org/wikipedia/commons/f/f7/Prim%27s_algorithm.svg)

Prim's algorithm starting at vertex `A`. In the third step, edges
`BD` and `AB` both have weight `2`, so `BD` is chosen arbitrarily.
After that step, `AB` is no longer a candidate for addition
to the tree because it links two nodes that are already
in the tree.

### Minimum Spanning Tree

A **minimum spanning tree** (MST) or minimum weight spanning tree
is a subset of the edges of a connected, edge-weighted
(un)directed graph that connects all the vertices together,
without any cycles and with the minimum possible total edge
weight. That is, it is a spanning tree whose sum of edge weights
is as small as possible. More generally, any edge-weighted
undirected graph (not necessarily connected) has a minimum
spanning forest, which is a union of the minimum spanning
trees for its connected components.

![Minimum Spanning Tree](https://upload.wikimedia.org/wikipedia/commons/d/d2/Minimum_spanning_tree.svg)

A planar graph and its minimum spanning tree. Each edge is
labeled with its weight, which here is roughly proportional
to its length.

![Minimum Spanning Tree](https://upload.wikimedia.org/wikipedia/commons/c/c9/Multiple_minimum_spanning_trees.svg)

This figure shows there may be more than one minimum spanning
tree in a graph. In the figure, the two trees below the graph
are two possibilities of minimum spanning tree of the given graph.

### References

- [Minimum Spanning Tree on Wikipedia](https://en.wikipedia.org/wiki/Minimum_spanning_tree)
- [Prim's Algorithm on Wikipedia](https://en.wikipedia.org/wiki/Prim%27s_algorithm)
- [Prim's Algorithm on YouTube by Tushar Roy](https://www.youtube.com/watch?v=oP2-8ysT3QQ&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Prim's Algorithm on YouTube by Michael Sambol](https://www.youtube.com/watch?v=cplfcGZmX7I&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

# SF/ALGs/graph/prim/prim

```js
import Graph from '../../../data-structures/graph/Graph';
import PriorityQueue from '../../../data-structures/priority-queue/PriorityQueue';

/**
 * @param {Graph} graph
 * @return {Graph}
 */
export default function prim(graph) {
  // It should fire error if graph is directed since the algorithm works only
  // for undirected graphs.
  if (graph.isDirected) {
    throw new Error("Prim's algorithms works only for undirected graphs");
  }

  // Init new graph that will contain minimum spanning tree of original graph.
  const minimumSpanningTree = new Graph();

  // This priority queue will contain all the edges that are starting from
  // visited nodes and they will be ranked by edge weight - so that on each step
  // we would always pick the edge with minimal edge weight.
  const edgesQueue = new PriorityQueue();

  // Set of vertices that has been already visited.
  const visitedVertices = {};

  // Vertex from which we will start graph traversal.
  const startVertex = graph.getAllVertices()[0];

  // Add start vertex to the set of visited ones.
  visitedVertices[startVertex.getKey()] = startVertex;

  // Add all edges of start vertex to the queue.
  startVertex.getEdges().forEach(graphEdge => {
    edgesQueue.add(graphEdge, graphEdge.weight);
  });

  // Now let's explore all queued edges.
  while (!edgesQueue.isEmpty()) {
    // Fetch next queued edge with minimal weight.
    /** @var {GraphEdge} currentEdge */
    const currentMinEdge = edgesQueue.poll();

    // Find out the next unvisited minimal vertex to traverse.
    let nextMinVertex = null;
    if (!visitedVertices[currentMinEdge.startVertex.getKey()]) {
      nextMinVertex = currentMinEdge.startVertex;
    } else if (!visitedVertices[currentMinEdge.endVertex.getKey()]) {
      nextMinVertex = currentMinEdge.endVertex;
    }

    // If all vertices of current edge has been already visited then skip this round.
    if (nextMinVertex) {
      // Add current min edge to MST.
      minimumSpanningTree.addEdge(currentMinEdge);

      // Add vertex to the set of visited ones.
      visitedVertices[nextMinVertex.getKey()] = nextMinVertex;

      // Add all current vertex's edges to the queue.
      nextMinVertex.getEdges().forEach(graphEdge => {
        // Add only vertices that link to unvisited nodes.
        if (!visitedVertices[graphEdge.startVertex.getKey()] || !visitedVertices[graphEdge.endVertex.getKey()]) {
          edgesQueue.add(graphEdge, graphEdge.weight);
        }
      });
    }
  }

  return minimumSpanningTree;
}
```

# SF/ALGs/graph/strongly-connected-components/README

## Strongly Connected Component

A directed graph is called **strongly connected** if there is a path
in each direction between each pair of vertices of the graph.
In a directed graph G that may not itself be strongly connected,
a pair of vertices `u` and `v` are said to be strongly connected
to each other if there is a path in each direction between them.

![Strongly Connected](https://upload.wikimedia.org/wikipedia/commons/5/5c/Scc.png)

Graph with strongly connected components marked

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Strongly_connected_component)
- [YouTube](https://www.youtube.com/watch?v=RpgcYiky7uw&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

# SF/ALGs/graph/strongly-connected-components/stronglyConnectedComponents

```js
import Stack from '../../../data-structures/stack/Stack';
import depthFirstSearch from '../depth-first-search/depthFirstSearch';

/**
 * @param {Graph} graph
 * @return {Stack}
 */
function getVerticesSortedByDfsFinishTime(graph) {
  // Set of all visited vertices during DFS pass.
  const visitedVerticesSet = {};

  // Stack of vertices by finish time.
  // All vertices in this stack are ordered by finished time in decreasing order.
  // Vertex that has been finished first will be at the bottom of the stack and
  // vertex that has been finished last will be at the top of the stack.
  const verticesByDfsFinishTime = new Stack();

  // Set of all vertices we're going to visit.
  const notVisitedVerticesSet = {};
  graph.getAllVertices().forEach(vertex => {
    notVisitedVerticesSet[vertex.getKey()] = vertex;
  });

  // Specify DFS traversal callbacks.
  const dfsCallbacks = {
    enterVertex: ({ currentVertex }) => {
      // Add current vertex to visited set.
      visitedVerticesSet[currentVertex.getKey()] = currentVertex;

      // Delete current vertex from not visited set.
      delete notVisitedVerticesSet[currentVertex.getKey()];
    },
    leaveVertex: ({ currentVertex }) => {
      // Push vertex to the stack when leaving it.
      // This will make stack to be ordered by finish time in decreasing order.
      verticesByDfsFinishTime.push(currentVertex);
    },
    allowTraversal: ({ nextVertex }) => {
      // Don't allow to traverse the nodes that have been already visited.
      return !visitedVerticesSet[nextVertex.getKey()];
    },
  };

  // Do FIRST DFS PASS traversal for all graph vertices to fill the verticesByFinishTime stack.
  while (Object.values(notVisitedVerticesSet).length) {
    // Peek any vertex to start DFS traversal from.
    const startVertexKey = Object.keys(notVisitedVerticesSet)[0];
    const startVertex = notVisitedVerticesSet[startVertexKey];
    delete notVisitedVerticesSet[startVertexKey];

    depthFirstSearch(graph, startVertex, dfsCallbacks);
  }

  return verticesByDfsFinishTime;
}

/**
 * @param {Graph} graph
 * @param {Stack} verticesByFinishTime
 * @return {*[]}
 */
function getSCCSets(graph, verticesByFinishTime) {
  // Array of arrays of strongly connected vertices.
  const stronglyConnectedComponentsSets = [];

  // Array that will hold all vertices that are being visited during one DFS run.
  let stronglyConnectedComponentsSet = [];

  // Visited vertices set.
  const visitedVerticesSet = {};

  // Callbacks for DFS traversal.
  const dfsCallbacks = {
    enterVertex: ({ currentVertex }) => {
      // Add current vertex to SCC set of current DFS round.
      stronglyConnectedComponentsSet.push(currentVertex);

      // Add current vertex to visited set.
      visitedVerticesSet[currentVertex.getKey()] = currentVertex;
    },
    leaveVertex: ({ previousVertex }) => {
      // Once DFS traversal is finished push the set of found strongly connected
      // components during current DFS round to overall strongly connected components set.
      // The sign that traversal is about to be finished is that we came back to start vertex
      // which doesn't have parent.
      if (previousVertex === null) {
        stronglyConnectedComponentsSets.push([...stronglyConnectedComponentsSet]);
      }
    },
    allowTraversal: ({ nextVertex }) => {
      // Don't allow traversal of already visited vertices.
      return !visitedVerticesSet[nextVertex.getKey()];
    },
  };

  while (!verticesByFinishTime.isEmpty()) {
    /** @var {GraphVertex} startVertex */
    const startVertex = verticesByFinishTime.pop();

    // Reset the set of strongly connected vertices.
    stronglyConnectedComponentsSet = [];

    // Don't do DFS on already visited vertices.
    if (!visitedVerticesSet[startVertex.getKey()]) {
      // Do DFS traversal.
      depthFirstSearch(graph, startVertex, dfsCallbacks);
    }
  }

  return stronglyConnectedComponentsSets;
}

/**
 * Kosaraju's algorithm.
 *
 * @param {Graph} graph
 * @return {*[]}
 */
export default function stronglyConnectedComponents(graph) {
  // In this algorithm we will need to do TWO DFS PASSES overt the graph.

  // Get stack of vertices ordered by DFS finish time.
  // All vertices in this stack are ordered by finished time in decreasing order:
  // Vertex that has been finished first will be at the bottom of the stack and
  // vertex that has been finished last will be at the top of the stack.
  const verticesByFinishTime = getVerticesSortedByDfsFinishTime(graph);

  // Reverse the graph.
  graph.reverse();

  // Do DFS once again on reversed graph.
  return getSCCSets(graph, verticesByFinishTime);
}
```

# SF/ALGs/graph/topological-sorting/README

## Topological Sorting

In the field of computer science, a topological sort or
topological ordering of a directed graph is a linear ordering
of its vertices such that for every directed edge `uv` from
vertex `u` to vertex `v`, `u` comes before `v` in the ordering.

For instance, the vertices of the graph may represent tasks to
be performed, and the edges may represent constraints that one
task must be performed before another; in this application, a
topological ordering is just a valid sequence for the tasks.

A topological ordering is possible if and only if the graph has
no directed cycles, that is, if it is a [directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
(DAG). Any DAG has at least one topological ordering, and algorithms are
known for constructing a topological ordering of any DAG in linear time.

![Directed Acyclic Graph](https://upload.wikimedia.org/wikipedia/commons/c/c6/Topological_Ordering.svg)

A topological ordering of a directed acyclic graph: every edge goes from
earlier in the ordering (upper left) to later in the ordering (lower right).
A directed graph is acyclic if and only if it has a topological ordering.

### Example

![Topologic Sorting](https://upload.wikimedia.org/wikipedia/commons/0/03/Directed_acyclic_graph_2.svg)

The graph shown above has many valid topological sorts, including:

- `5, 7, 3, 11, 8, 2, 9, 10` (visual left-to-right, top-to-bottom)
- `3, 5, 7, 8, 11, 2, 9, 10` (smallest-numbered available vertex first)
- `5, 7, 3, 8, 11, 10, 9, 2` (fewest edges first)
- `7, 5, 11, 3, 10, 8, 9, 2` (largest-numbered available vertex first)
- `5, 7, 11, 2, 3, 8, 9, 10` (attempting top-to-bottom, left-to-right)
- `3, 7, 8, 5, 11, 10, 2, 9` (arbitrary)

### Application

The canonical application of topological sorting is in
**scheduling a sequence of jobs** or tasks based on their dependencies. The jobs
are represented by vertices, and there is an edge from `x` to `y` if
job `x` must be completed before job `y` can be started (for
example, when washing clothes, the washing machine must finish
before we put the clothes in the dryer). Then, a topological sort
gives an order in which to perform the jobs.

Other application is **dependency resolution**. Each vertex is a package
and each edge is a dependency of package `a` on package 'b'. Then topological
sorting will provide a sequence of installing dependencies in a way that every
next dependency has its dependent packages to be installed in prior.

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting)
- [Topological Sorting on YouTube by Tushar Roy](https://www.youtube.com/watch?v=ddTC4Zovtbc&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

# SF/ALGs/graph/topological-sorting/topologicalSort

```js
import Stack from '../../../data-structures/stack/Stack';
import depthFirstSearch from '../depth-first-search/depthFirstSearch';

/**
 * @param {Graph} graph
 */
export default function topologicalSort(graph) {
  // Create a set of all vertices we want to visit.
  const unvisitedSet = {};
  graph.getAllVertices().forEach(vertex => {
    unvisitedSet[vertex.getKey()] = vertex;
  });

  // Create a set for all vertices that we've already visited.
  const visitedSet = {};

  // Create a stack of already ordered vertices.
  const sortedStack = new Stack();

  const dfsCallbacks = {
    enterVertex: ({ currentVertex }) => {
      // Add vertex to visited set in case if all its children has been explored.
      visitedSet[currentVertex.getKey()] = currentVertex;

      // Remove this vertex from unvisited set.
      delete unvisitedSet[currentVertex.getKey()];
    },
    leaveVertex: ({ currentVertex }) => {
      // If the vertex has been totally explored then we may push it to stack.
      sortedStack.push(currentVertex);
    },
    allowTraversal: ({ nextVertex }) => {
      return !visitedSet[nextVertex.getKey()];
    },
  };

  // Let's go and do DFS for all unvisited nodes.
  while (Object.keys(unvisitedSet).length) {
    const currentVertexKey = Object.keys(unvisitedSet)[0];
    const currentVertex = unvisitedSet[currentVertexKey];

    // Do DFS for current node.
    depthFirstSearch(graph, currentVertex, dfsCallbacks);
  }

  return sortedStack.toArray();
}
```

# SF/ALGs/graph/travelling-salesman/README

## Travelling Salesman Problem

The travelling salesman problem (TSP) asks the following question:
"Given a list of cities and the distances between each pair of
cities, what is the shortest possible route that visits each city
and returns to the origin city?"

![Travelling Salesman](https://upload.wikimedia.org/wikipedia/commons/1/11/GLPK_solution_of_a_travelling_salesman_problem.svg)

Solution of a travelling salesman problem: the black line shows
the shortest possible loop that connects every red dot.

![Travelling Salesman Graph](https://upload.wikimedia.org/wikipedia/commons/3/30/Weighted_K4.svg)

TSP can be modelled as an undirected weighted graph, such that
cities are the graph's vertices, paths are the graph's edges,
and a path's distance is the edge's weight. It is a minimization
problem starting and finishing at a specified vertex after having
visited each other vertex exactly once. Often, the model is a
complete graph (i.e. each pair of vertices is connected by an
edge). If no path exists between two cities, adding an arbitrarily
long edge will complete the graph without affecting the optimal tour.

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Travelling_salesman_problem)

# SF/ALGs/graph/travelling-salesman/bfTravellingSalesman

```js
/**
 * Get all possible paths
 * @param {GraphVertex} startVertex
 * @param {GraphVertex[][]} [paths]
 * @param {GraphVertex[]} [path]
 */
function findAllPaths(startVertex, paths = [], path = []) {
  // Clone path.
  const currentPath = [...path];

  // Add startVertex to the path.
  currentPath.push(startVertex);

  // Generate visited set from path.
  const visitedSet = currentPath.reduce((accumulator, vertex) => {
    const updatedAccumulator = { ...accumulator };
    updatedAccumulator[vertex.getKey()] = vertex;

    return updatedAccumulator;
  }, {});

  // Get all unvisited neighbors of startVertex.
  const unvisitedNeighbors = startVertex.getNeighbors().filter(neighbor => {
    return !visitedSet[neighbor.getKey()];
  });

  // If there no unvisited neighbors then treat current path as complete and save it.
  if (!unvisitedNeighbors.length) {
    paths.push(currentPath);

    return paths;
  }

  // Go through all the neighbors.
  for (let neighborIndex = 0; neighborIndex < unvisitedNeighbors.length; neighborIndex += 1) {
    const currentUnvisitedNeighbor = unvisitedNeighbors[neighborIndex];
    findAllPaths(currentUnvisitedNeighbor, paths, currentPath);
  }

  return paths;
}

/**
 * @param {number[][]} adjacencyMatrix
 * @param {object} verticesIndices
 * @param {GraphVertex[]} cycle
 * @return {number}
 */
function getCycleWeight(adjacencyMatrix, verticesIndices, cycle) {
  let weight = 0;

  for (let cycleIndex = 1; cycleIndex < cycle.length; cycleIndex += 1) {
    const fromVertex = cycle[cycleIndex - 1];
    const toVertex = cycle[cycleIndex];
    const fromVertexIndex = verticesIndices[fromVertex.getKey()];
    const toVertexIndex = verticesIndices[toVertex.getKey()];
    weight += adjacencyMatrix[fromVertexIndex][toVertexIndex];
  }

  return weight;
}

/**
 * BRUTE FORCE approach to solve Traveling Salesman Problem.
 *
 * @param {Graph} graph
 * @return {GraphVertex[]}
 */
export default function bfTravellingSalesman(graph) {
  // Pick starting point from where we will traverse the graph.
  const startVertex = graph.getAllVertices()[0];

  // BRUTE FORCE.
  // Generate all possible paths from startVertex.
  const allPossiblePaths = findAllPaths(startVertex);

  // Filter out paths that are not cycles.
  const allPossibleCycles = allPossiblePaths.filter(path => {
    /** @var {GraphVertex} */
    const lastVertex = path[path.length - 1];
    const lastVertexNeighbors = lastVertex.getNeighbors();

    return lastVertexNeighbors.includes(startVertex);
  });

  // Go through all possible cycles and pick the one with minimum overall tour weight.
  const adjacencyMatrix = graph.getAdjacencyMatrix();
  const verticesIndices = graph.getVerticesIndices();
  let salesmanPath = [];
  let salesmanPathWeight = null;
  for (let cycleIndex = 0; cycleIndex < allPossibleCycles.length; cycleIndex += 1) {
    const currentCycle = allPossibleCycles[cycleIndex];
    const currentCycleWeight = getCycleWeight(adjacencyMatrix, verticesIndices, currentCycle);

    // If current cycle weight is smaller then previous ones treat current cycle as most optimal.
    if (salesmanPathWeight === null || currentCycleWeight < salesmanPathWeight) {
      salesmanPath = currentCycle;
      salesmanPathWeight = currentCycleWeight;
    }
  }

  // Return the solution.
  return salesmanPath;
}
```
