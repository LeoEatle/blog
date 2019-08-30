---
title: '[LeetCode]103. Binary Tree Zigzag Level Order Traversal'
date: 2017-01-04 19:54:31
tags:
    - Python
    - LeetCode
---
## Question
经典的按层遍历二叉树，但是需要按照zigzag的路线去进行遍历，见示例：
给这样一个二叉树
    3
   / \
  9  20
    /  \
   15   7
它应该返回
[
  [3],
  [20,9],
  [15,7]
]

## Solution
二叉树按层遍历首选bfs，而bfs首选队列作为数据结构，就算是选择了队列作为数据结构，一般而言按层遍历还有个判断一层结束的问题，这个问题有常见的两种解决方案

1. 当一层遍历完后，插入一个符号表示这层的结束，那么当遍历遇到这个符号的时候就知道一层结束了，进行一些清理工作后转入下一层的录入或计算

2. 使用两个队列，一层遍历时的左右节点加入另一个队列，当这一层遍历完时第一个队列已经空了，然后下一层遍历的时候就再将左右节点加回第一个队列

这道题由于路径比较特殊，我想了下面这个方案。

通过一个`direction`变量记录`left`从左遍历和`right`从右遍历，当从右遍历时就先录入右节点再录入左节点
由于队列先入先出的特性，我这样可以保证输出顺序就是我的遍历顺序。

看了下discussion有些人的答案是用将数组或者list逆序的办法，我认为这样反而增加了时间复杂度，不是一个最佳方案。

[有人整理的Leetcode中bfs和二叉树相关题型](http://www.jianshu.com/p/d5228282afe0)

## Code
```
# Definition for a binary tree node.
class TreeNode(object):
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution(object):
    def zigzagLevelOrder(self, root):
        """
        :type root: TreeNode
        :rtype: List[List[int]]
        """
        if not root:
            return []
        direction = 'left'
        self.result = []
        cache1 = [root]
        cache2 = []
        self.bfs(cache1, cache2, direction)
        return self.result

    def bfs(self, cache1, cache2, direction):
        if len(cache1) is 0 and len(cache2) is 0:
            return
        else:
            layer = []
            if direction == "right":
                while len(cache1) is not 0:
                    temp = cache1.pop()
                    layer.append(temp.val)
                    if temp.right:
                        cache2.append(temp.right)
                    if temp.left:
                        cache2.append(temp.left)
                self.result.append(layer)
                cache1, cache2 = cache2, cache1
                direction = "left"
            elif direction == "left":
                while len(cache1) is not 0:
                    temp = cache1.pop()
                    layer.append(temp.val)
                    if temp.left:
                        cache2.append(temp.left)
                    if temp.right:
                        cache2.append(temp.right)
                cache1, cache2 = cache2, cache1
                direction = "right"
                self.result.append(layer)
        self.bfs(cache1, cache2, direction)
```


