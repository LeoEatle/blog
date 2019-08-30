---
title: '[LeetCode]74. Search a 2D matrix'
date: 2017-01-02 16:08:38
tags:
    - Python
    - LeetCode
---
# Question
遍历一个矩阵寻找某个值是否在这个矩阵里面，矩阵有如下特征：

1. 从左到右依次递增
2. 矩阵中一行的第一个一定比上一行的最后一个大

# Solution
其实这个问题确实比较简单，最简单的做法就是把矩阵看作一个普通的数组，然后在这里面进行查找就行了
但是最有效的查找方式应该是利用它每行首位数字的排序关系，我们可以先遍历每一行的第一个数字，用二分查找找到它在的那一行，然后再每行进行二分查找

# Code
我的确是没有想到二分查找，一些常用的算法比如二分查找这种确实应该记在心里时刻记得用才是
```
#coding: utf-8
class Solution(object):
    def searchMatrix(self, matrix, target):
        """
        :type matrix: List[List[int]]
        :type target: int
        :rtype: bool
        """
        if not matrix:
            return False
        if target < matrix[0][0]:
            return False
        y = len(matrix)
        x = len(matrix[0])
        for i in range(y):
            if i == y-1 or target < matrix[i+1][0]:
                for j in range(x):
                    if target == matrix[i][j]:
                        return True

        return False
```

