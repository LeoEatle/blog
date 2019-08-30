---
title: 453. Minimum Moves to Equal Array Elements
date: 2016-11-20 14:31:38
tags:
    - Python
    - LeetCode
---

## Question
Given a non-empty integer array of size n, find the minimum number of moves required to make all array elements equal, where a move is incrementing n - 1 elements by 1.

Example:

Input:
[1,2,3]

Output:
3

Explanation:
Only three moves are needed (remember each move increments two elements):

[1,2,3]  =>  [2,3,3]  =>  [3,4,3]  =>  [4,4,4]

## Solution
这道题一开始会觉得没什么思路...但看了discussion一个大神的思路，立刻明白什么叫做逆向思维...
> Add 1 to n - 1 elements is the same as subtracting 1 from one element, w.r.t goal of making the elements in the array equal.
So, best way to do this is make all the elements in the array equal to the min element.

给n-1个数添加1其实就相当于让其中一个数减去1，这样的话我们只要向最小的那个数看齐就可以了，想办法把每个数减到最小的那个

就像另一个discuss中说的，it's a math question，假设sum是目前的总和，我们需要进行m次添加操作，每次给总和加了n-1，最后得到的应该是某个一样的数x*n

>  sum + m * (n - 1) = x * n

这个x就是minNum+了m次得到的
>  x = minNum + m

>  sum - minNum * n = m

## Code
```
class Solution(object):
    def minMoves(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        total = 0
        minNum = nums[0]

        for num in nums:
            total = total + num
            minNum = min(num, minNum)
        diff = total - len(nums)*minNum
        return diff
```