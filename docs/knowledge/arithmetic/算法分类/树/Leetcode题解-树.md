---
layout: CustomPages
title: LeetCode 题解
date: 2020-11-21
aside: false
draft: true
---

## 递归

### 1. 树的高度

[104. Maximum Depth of Binary Tree (Easy)](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/description/)

### 2. 平衡树

[110. Balanced Binary Tree (Easy)](https://leetcode-cn.com/problems/balanced-binary-tree/description/)

平衡树左右子树高度差都小于等于 1

### 3. 两节点的最长路径

[543. Diameter of Binary Tree (Easy)](https://leetcode-cn.com/problems/diameter-of-binary-tree/description/)

### 4. 翻转树

[226. Invert Binary Tree (Easy)](https://leetcode-cn.com/problems/invert-binary-tree/description/)

### 5. 归并两棵树

[617. Merge Two Binary Trees (Easy)](https://leetcode-cn.com/problems/merge-two-binary-trees/description/)

### 6. 判断路径和是否等于一个数

[112. Path Sum (Easy)](https://leetcode-cn.com/problems/path-sum/description/)

```html
Given the below binary tree and sum = 22, 5 / \ 4 8 / / \ 11 13 4 / \ \ 7 2 1 return true, as there exist a root-to-leaf
path 5->4->11->2 which sum is 22.
```

路径和定义为从 root 到 leaf 的所有节点的和。

```java
public boolean hasPathSum(TreeNode root, int sum) {
    if (root == null) return false;
    if (root.left == null && root.right == null && root.val == sum) return true;
    return hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum - root.val);
}
```

### 7. 统计路径和等于一个数的路径数量

[437. Path Sum III (Easy)](https://leetcode-cn.com/problems/path-sum-iii/description/)

```html
root = [10,5,-3,3,2,null,11,3,-2,null,1], sum = 8 10 / \ 5 -3 / \ \ 3 2 11 / \ \ 3 -2 1 Return 3. The paths that sum to
8 are: 1. 5 -> 3 2. 5 -> 2 -> 1 3. -3 -> 11
```

路径不一定以 root 开头，也不一定以 leaf 结尾，但是必须连续。

```java
public int pathSum(TreeNode root, int sum) {
    if (root == null) return 0;
    int ret = pathSumStartWithRoot(root, sum) + pathSum(root.left, sum) + pathSum(root.right, sum);
    return ret;
}

private int pathSumStartWithRoot(TreeNode root, int sum) {
    if (root == null) return 0;
    int ret = 0;
    if (root.val == sum) ret++;
    ret += pathSumStartWithRoot(root.left, sum - root.val) + pathSumStartWithRoot(root.right, sum - root.val);
    return ret;
}
```

### 8. 子树

[572. Subtree of Another Tree (Easy)](https://leetcode-cn.com/problems/subtree-of-another-tree/description/)

```html
Given tree s: 3 / \ 4 5 / \ 1 2 Given tree t: 4 / \ 1 2 Return true, because t has the same structure and node values
with a subtree of s. Given tree s: 3 / \ 4 5 / \ 1 2 / 0 Given tree t: 4 / \ 1 2 Return false.
```

```java
public boolean isSubtree(TreeNode s, TreeNode t) {
    if (s == null) return false;
    return isSubtreeWithRoot(s, t) || isSubtree(s.left, t) || isSubtree(s.right, t);
}

private boolean isSubtreeWithRoot(TreeNode s, TreeNode t) {
    if (t == null && s == null) return true;
    if (t == null || s == null) return false;
    if (t.val != s.val) return false;
    return isSubtreeWithRoot(s.left, t.left) && isSubtreeWithRoot(s.right, t.right);
}
```

### 9. 树的对称

[101. Symmetric Tree (Easy)](https://leetcode-cn.com/problems/symmetric-tree/description/)

### 10. 最小路径

[111. Minimum Depth of Binary Tree (Easy)](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/description/)

树的根节点到叶子节点的最小路径长度

```java
public int minDepth(TreeNode root) {
    if (root == null) return 0;
    int left = minDepth(root.left);
    int right = minDepth(root.right);
    if (left == 0 || right == 0) return left + right + 1;
    return Math.min(left, right) + 1;
}
```

### 11. 统计左叶子节点的和

[404. Sum of Left Leaves (Easy)](https://leetcode-cn.com/problems/sum-of-left-leaves/description/)

```html
3 / \ 9 20 / \ 15 7 There are two left leaves in the binary tree, with values 9 and 15 respectively. Return 24.
```

```java
public int sumOfLeftLeaves(TreeNode root) {
    if (root == null) return 0;
    if (isLeaf(root.left)) return root.left.val + sumOfLeftLeaves(root.right);
    return sumOfLeftLeaves(root.left) + sumOfLeftLeaves(root.right);
}

private boolean isLeaf(TreeNode node){
    if (node == null) return false;
    return node.left == null && node.right == null;
}
```

### 12. 相同节点值的最大路径长度

[687. Longest Univalue Path (Easy)](https://leetcode-cn.com/problems/longest-univalue-path/)

```html
1 / \ 4 5 / \ \ 4 4 5 Output : 2
```

```java
private int path = 0;

public int longestUnivaluePath(TreeNode root) {
    dfs(root);
    return path;
}

private int dfs(TreeNode root){
    if (root == null) return 0;
    int left = dfs(root.left);
    int right = dfs(root.right);
    int leftPath = root.left != null && root.left.val == root.val ? left + 1 : 0;
    int rightPath = root.right != null && root.right.val == root.val ? right + 1 : 0;
    path = Math.max(path, leftPath + rightPath);
    return Math.max(leftPath, rightPath);
}
```

### 13. 间隔遍历

[337. House Robber III (Medium)](https://leetcode-cn.com/problems/house-robber-iii/description/)

```html
3 / \ 2 3 \ \ 3 1 Maximum amount of money the thief can rob = 3 + 3 + 1 = 7.
```

```java
public int rob(TreeNode root) {
    if (root == null) return 0;
    int val1 = root.val;
    if (root.left != null) val1 += rob(root.left.left) + rob(root.left.right);
    if (root.right != null) val1 += rob(root.right.left) + rob(root.right.right);
    int val2 = rob(root.left) + rob(root.right);
    return Math.max(val1, val2);
}
```

### 14. 找出二叉树中第二小的节点

[671. Second Minimum Node In a Binary Tree (Easy)](https://leetcode-cn.com/problems/second-minimum-node-in-a-binary-tree/description/)

```html
Input: 2 / \ 2 5 / \ 5 7 Output: 5
```

一个节点要么具有 0 个或 2 个子节点，如果有子节点，那么根节点是最小的节点。

```java
public int findSecondMinimumValue(TreeNode root) {
    if (root == null) return -1;
    if (root.left == null && root.right == null) return -1;
    int leftVal = root.left.val;
    int rightVal = root.right.val;
    if (leftVal == root.val) leftVal = findSecondMinimumValue(root.left);
    if (rightVal == root.val) rightVal = findSecondMinimumValue(root.right);
    if (leftVal != -1 && rightVal != -1) return Math.min(leftVal, rightVal);
    if (leftVal != -1) return leftVal;
    return rightVal;
}
```

## 层次遍历

使用 BFS 进行层次遍历。不需要使用两个队列来分别存储当前层的节点和下一层的节点，因为在开始遍历一层的节点时，当前队列中的节点数就是当前层的节点数，只要控制遍历这么多节点数，就能保证这次遍历的都是当前层的节点。

### 1. 一棵树每层节点的平均数

[637. Average of Levels in Binary Tree (Easy)](https://leetcode-cn.com/problems/average-of-levels-in-binary-tree/description/)

```java
public List<Double> averageOfLevels(TreeNode root) {
    List<Double> ret = new ArrayList<>();
    if (root == null) return ret;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        int cnt = queue.size();
        double sum = 0;
        for (int i = 0; i < cnt; i++) {
            TreeNode node = queue.poll();
            sum += node.val;
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        ret.add(sum / cnt);
    }
    return ret;
}
```

### 2. 得到左下角的节点

[513. Find Bottom Left Tree Value (Easy)](https://leetcode-cn.com/problems/find-bottom-left-tree-value/description/)

```html
Input: 1 / \ 2 3 / / \ 4 5 6 / 7 Output: 7
```

```java
public int findBottomLeftValue(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        root = queue.poll();
        if (root.right != null) queue.add(root.right);
        if (root.left != null) queue.add(root.left);
    }
    return root.val;
}
```

## 前中后序遍历

① 前序

```java
void dfs(TreeNode root) {
    visit(root);
    dfs(root.left);
    dfs(root.right);
}
```

② 中序

```java
void dfs(TreeNode root) {
    dfs(root.left);
    visit(root);
    dfs(root.right);
}
```

③ 后序

```java
void dfs(TreeNode root) {
    dfs(root.left);
    dfs(root.right);
    visit(root);
}
```

### 1. 非递归实现二叉树的前序遍历

[144. Binary Tree Preorder Traversal (Medium)](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/description/)

### 2. 非递归实现二叉树的后序遍历

[145. Binary Tree Postorder Traversal (Medium)](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/description/)

### 3. 非递归实现二叉树的中序遍历

[94. Binary Tree Inorder Traversal (Medium)](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/description/)
