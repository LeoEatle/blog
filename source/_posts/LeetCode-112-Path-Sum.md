---
title: '[LeetCode]112 Path Sum'
date: 2016-11-13 19:02:41
tags:
    - LeetCode
    - Python
---

## This code need to import Treecode
>Given a binary tree and a sum, determine if the tree has a root-to-leaf path such that adding up all the values along the path equals the given sum.

>For example:
Given the below binary tree and sum = 22,

              5
             / \
            4   8
           /   / \
          11  13  4
         /  \      \
        7    2      1
>return true, as there exist a root-to-leaf path 5->4->11->2 which sum is 22.

## Solution
这道题最简单想到的方法就是DFS，在Python中使用DFS，可以利用Python中self的特性，将一些不需要迭代的值放入`self.xxx`中

比如这道题，应该想到将结果保存在一个`self.ifExist`中，还有不变的目标和targetSum也可以保存在`self.targetSum`中

## code
```
#coding: utf-8
import TreeNode
class Solution(object):
    def getSum(self, node, curSum):

        if node is None:
            return
        curSum = curSum + node.val
        if self.targetSum == curSum and not node.left and not node.right:#To ensure that this path if from root to leaf
            self.ifExist = True
            return
        self.getSum(node.left, curSum)
        self.getSum(node.right, curSum)

    def hasPathSum(self, root, sum):
        """
        :type root: TreeNode
        :type sum: int
        :rtype: bool
        """

        if not root:
            return False
        self.targetSum = sum
        self.ifExist = False
        curSum = 0
        self.getSum(root, curSum)
        print self.ifExist

treenode = TreeNode.TreeNode(3)
s = Solution()
s.hasPathSum(treenode,  3)
```

