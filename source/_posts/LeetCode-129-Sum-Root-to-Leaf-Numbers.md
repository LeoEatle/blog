---
title: '[LeetCode]129. Sum Root to Leaf Numbers'
date: 2016-12-25 23:28:37
subtitle: '又是个经典的DFS'
tags:
    - Python
    - LeetCode
---
## Question
这个问题就是，给一个二叉树，返回从根节点到叶子节点形成的所有数的和，例子：
   1
   / \
  2   3
The root-to-leaf path 1->2 represents the number 12.
The root-to-leaf path 1->3 represents the number 13.

## Solution
做了这么多树相关的，其实也找到一些套路，无外乎是如果跟遍历根节点到叶子节点相关的，一般就是DFS，如果是同层的，一般就是BFS。

而这道题显然就是用DFS

## Code
```
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def sumNumbers(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        if root == None:
            return 0
        self.answer = 0
        self.dfs(root, 0)
        return self.answer

    def dfs(self, root, cache):
        cache = cache*10 + root.val
        if root.left == None and root.right == None:
            self.answer = cache + self.answer
        if root.left != None:
            # cache = cache + root.left.val
            self.dfs(root.left, cache)
        if root.right != None:
            # cache = cache + root.right.val
            self.dfs(root.right, cache)
```
