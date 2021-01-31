---
layout: CustomPages
title: LeetCode 题解
date: 2020-11-21
aside: false
draft: true
---

## 1. 找出两个链表的交点

[160. Intersection of Two Linked Lists (Easy)](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/description/)

## 2. 链表反转

[206. Reverse Linked List (Easy)](https://leetcode-cn.com/problems/reverse-linked-list/description/)

## 3. 归并两个有序的链表

[21. Merge Two Sorted Lists (Easy)](https://leetcode-cn.com/problems/merge-two-sorted-lists/description/)

## 4. 从有序链表中删除重复节点

[83. Remove Duplicates from Sorted List (Easy)](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/description/)

## 5. 删除链表的倒数第 n 个节点

[19. Remove Nth Node From End of List (Medium)](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/description/)

## 6. 交换链表中的相邻结点

[24. Swap Nodes in Pairs (Medium)](https://leetcode-cn.com/problems/swap-nodes-in-pairs/description/)

## 7. 链表求和

[445. Add Two Numbers II (Medium)](https://leetcode-cn.com/problems/add-two-numbers-ii/description/)

## 8. 回文链表

[234. Palindrome Linked List (Easy)](https://leetcode-cn.com/problems/palindrome-linked-list/description/)

题目要求：以 O(1) 的空间复杂度来求解。

切成两半，把后半段反转，然后比较两半是否相等。

```java
public boolean isPalindrome(ListNode head) {
    if (head == null || head.next == null) return true;
    ListNode slow = head, fast = head.next;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    if (fast != null) slow = slow.next;  // 偶数节点，让 slow 指向下一个节点
    cut(head, slow);                     // 切成两个链表
    return isEqual(head, reverse(slow));
}

private void cut(ListNode head, ListNode cutNode) {
    while (head.next != cutNode) {
        head = head.next;
    }
    head.next = null;
}

private ListNode reverse(ListNode head) {
    ListNode newHead = null;
    while (head != null) {
        ListNode nextNode = head.next;
        head.next = newHead;
        newHead = head;
        head = nextNode;
    }
    return newHead;
}

private boolean isEqual(ListNode l1, ListNode l2) {
    while (l1 != null && l2 != null) {
        if (l1.val != l2.val) return false;
        l1 = l1.next;
        l2 = l2.next;
    }
    return true;
}
```

## 9. 分隔链表

[725. Split Linked List in Parts(Medium)](https://leetcode-cn.com/problems/split-linked-list-in-parts/description/)

```html
Input: root = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], k = 3 Output: [[1, 2, 3, 4], [5, 6, 7], [8, 9, 10]] Explanation: The
input has been split into consecutive parts with size difference at most 1, and earlier parts are a larger size than the
later parts.
```

题目描述：把链表分隔成 k 部分，每部分的长度都应该尽可能相同，排在前面的长度应该大于等于后面的。

```java
public ListNode[] splitListToParts(ListNode root, int k) {
    int N = 0;
    ListNode cur = root;
    while (cur != null) {
        N++;
        cur = cur.next;
    }
    int mod = N % k;
    int size = N / k;
    ListNode[] ret = new ListNode[k];
    cur = root;
    for (int i = 0; cur != null && i < k; i++) {
        ret[i] = cur;
        int curSize = size + (mod-- > 0 ? 1 : 0);
        for (int j = 0; j < curSize - 1; j++) {
            cur = cur.next;
        }
        ListNode next = cur.next;
        cur.next = null;
        cur = next;
    }
    return ret;
}
```

## 10. 链表元素按奇偶聚集

[328. Odd Even Linked List (Medium)](https://leetcode-cn.com/problems/odd-even-linked-list/description/)

```html
Example: Given 1->2->3->4->5->NULL, return 1->3->5->2->4->NULL.
```

```java
public ListNode oddEvenList(ListNode head) {
    if (head == null) {
        return head;
    }
    ListNode odd = head, even = head.next, evenHead = even;
    while (even != null && even.next != null) {
        odd.next = odd.next.next;
        odd = odd.next;
        even.next = even.next.next;
        even = even.next;
    }
    odd.next = evenHead;
    return head;
}
```
