---
title: '[LeetCode]396. Rotate Function'
date: 2016-12-13 03:45:00
tags: 
    - Python
    - LeetCode
---
## Question
给出一个数组A和它的长度n
假设Bk是通过循环旋转A得到的数组，我们基于A定义一个Function F，这个F是这样的
`F(k) = 0 * Bk[0] + 1 * Bk[1] + ... + (n-1) * Bk[n-1].`
我们需要从`F(0), F(1), ..., F(n-1).`找到最大的
好吧其实我每次都觉得不看LeetCode的例子我都不知道它在说什么
Example:
```
A = [4, 3, 2, 6]

F(0) = (0 * 4) + (1 * 3) + (2 * 2) + (3 * 6) = 0 + 3 + 4 + 18 = 25
F(1) = (0 * 6) + (1 * 4) + (2 * 3) + (3 * 2) = 0 + 4 + 6 + 6 = 16
F(2) = (0 * 2) + (1 * 6) + (2 * 4) + (3 * 3) = 0 + 6 + 8 + 9 = 23
F(3) = (0 * 3) + (1 * 2) + (2 * 6) + (3 * 4) = 0 + 2 + 12 + 12 = 26

So the maximum value of F(0), F(1), F(2), F(3) is F(3) = 26.
```

## Solution
我一开始又不小心想出了一个O(n^2)的解法，就是先遍历长度n，然后里面嵌套遍历每一个Bk[i]，得出它们的和存入一个list中
最后果然TEL

**怎么优化？**

应该马上想到，能不能基于每次上个循环的结果进行下一次循环的计算呢？
我们发现，其实F(n+1)可以通过F(n)加上数组A的和，再减去最后一个数*A的长度就行了
这样就完全省略了遍历计算中间的Bk们的和的过程

## Code
```
class Solution(object):
    def maxRotateFunction(self, A):
        """
        :type A: List[int]
        :rtype: int
        """

        Index = 0
        length = len(A)
        if length == 0:
            return 0
        total = 0
        for i in range(length):
            total = total + i*A[i]
        result = total
        addSum = sum(A)
        FValues = [total]
        answer = 0

        for i in range(1,length):
            result = result + addSum - length * A[-i]
            FValues.append(result)

        print FValues
        return  max(FValues)
```
