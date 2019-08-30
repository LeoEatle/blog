---
title: '[LeetCode]202 Happy Number'
date: 2016-11-15 19:08:42
tags:
    - Python
    - LeetCode
---
### Question
Write an algorithm to determine if a number is "happy".

A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1. Those numbers for which this process ends in 1 are happy numbers.

Example: 19 is a happy number

12 + 92 = 82
82 + 22 = 68
62 + 82 = 100
12 + 02 + 02 = 1

### Solution
这道题一开始会想，我要怎么才能证明它被无限循环呢？一个程序不可能证明自己一直在无限循环，因为这个证明的时间是无限的。

其实这道题目隐藏了一个数学要素，如果它无限循环了，必然表明每次通过这个平方和的计算中，有一个数出现了两次，这样就形成了一个loop，产生了无限循环

所以我们可以利用各个语言中的set这个不含重复元素的数据结构，检查是否会出现相同的数

### Code
```
class Solution(object):
    def isHappy(self, n):
        """
        :type n: int
        :rtype: bool
        """
        s = set()
        while n!=1:
            if n in s:
                return False
            s.add(n)
            n = self.calculate(n)
        return True

    def calculate(self, n):
        total = 0
        for i in str(n):
            total = total + int(i)**2
        return total

s = Solution()
print s.isHappy(19)
```
### MORE
> 注意很多语言中都有set这个数据结构，Java中的`new HashSet()`，C++中的`set <int>s`，Python中的`s = set()`

> 用python想用一个函数map一个数各个数位非常简单，就用`for i in str(n)`，相比Java冗长的各个Collection的声明真是如开挂般爽，但是相比Javascript自带的map，还没有那么熟练