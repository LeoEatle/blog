---
title: '[Leetcode]70 Climbing Stairs'
date: 2016-11-13 19:40:38
tags:
    - Leetcode
    - Python
---
>You are climbing a stair case. It takes n steps to reach to the top.
>Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

这是一道经典的动态规划题：爬梯子

### 解法一
很多人看到这道题会第一时间想到用recursive，因为这实际上就是在求一个Fibonacci序列，在教科书上都是拿这个例子当作递归的经典案例的
```
class Solution(object):
    def climbStairs(self, n):
        """
        :type n: int
        :rtype: int
        """
        self.ways = 0
        self.countWays(n)
        return self.ways

    def countWays(self, n):
        if n < 0:
            return
        if n == 0:
            self.ways = self.ways + 1
            return
        self.countWays(n-1)
        self.countWays(n-2)

```
**但是这样子提交的话，在Leetcode上会LTE，为什么呢？**

这个链接解释的非常清楚
[why does recursion not work](https://discuss.leetcode.com/topic/58252/why-does-recursion-not-work/3)
如果我们使用递归解法，时间复杂度会高达O(n^2)，因为其中子问题重复计算了两次，这就引出了这道题正确解法，非常经典的动态规划

### 解法二：动态规划

其实动态规划原理很简单，将每个子问题计算出的值进行一个保存就可以了，解法如下
```
class Solution(object):
    def climbStairs(self, n):
        """
        :type n: int
        :rtype: int
        """
        if n < 2:
            return 1
        prev1,prev2 = 0,1
        for i in range(n):
            now = prev1 + prev2
            prev2 = prev1
            prev1 = now
        return now
```
通过`prev1`和`prev2`两个值来保存子问题计算出来的值，避免递归造成的重复计算，这就是动态规划的关键

从整体来看，就好像把本来用于栈的重复计算（递归函数栈的调用）转变成一个普通的循环，但是通过保存中间值来实现状态转移
注意这里的初始状态是prev1 = 0，prev2 = 1，也就是说，没有台阶时，应该是0，有一个台阶时，应该是0+1=1，然后两个台阶时，1+1＝2，这样不断相加下去，循环就是答案

> 注意python中的range(n)函数是从0到n-1的

