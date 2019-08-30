---
title: '[LeetCode]455. Assign Cookies & 452. Minimum Number of Arrows to Burst Balloons'
date: 2016-11-23 12:38:49
subtitle: Greedy贪心算法
tags:
    - Python
    - LeetCode
---
## Question1

这一次我同时把两道问题放在同一篇文章里，主要原因是这两个问题都运用了贪心算法

1. Assign Cookies
第一个问题是这样的，假设你作为父母要给孩子们曲奇吃，但每个孩子只能拿到一个曲奇饼，每个孩子有个贪心值g，这是他需要的曲奇饼大小的最小满意值，并且每个曲奇j的大小为sj，如果sj>gj，就说明这个曲奇能满足孩子的需要，你的目标是满足尽量多的孩子
Example 1:
Input: [1,2,3], [1,1]

Output: 1

Explanation: 你有三个孩子，两个曲奇饼，三个孩子的贪心值分别是1，2，3，虽然你有两个曲奇饼，但它们的大小分别是1和1，只能满足一个孩子的需要，output为1

## Solution1
这个问题非常简单，我很快想到先排序，再比较的方法，但我后来使用了循环嵌套去遍历每个曲奇饼能否满足这个孩子，其实没这个必要，我们可以遍历孩子们，如果曲奇满足就+1，如果不满足就下一个更大的曲奇，用指针去思考总比用暴力的循环好

## Question2
我想重点说下第二题，题目是这样的，现在在一个二维平面上有许多圆形气球，这些气球大小不一，给出他们的坐标值[x1, x2]，代表了它们占的x坐标区间为x1到x2，我们射箭可以选择一个x的坐标发射，所有区间包括了这个x值的气球都会爆炸，如果要射爆所有的气球，最少需要多少个箭呢？

## Solution2
这道题一开始我确实很难想出一个解决方案，看了其他人的代码才明白，原来也需要排序的，做法各不相同。

其中一个python的解法是通过排序x2，维护一个end值，然后循环遍历每个气球的坐标，如果它们的x1比这个end值大了，说明就不重合了，只能再多用一根箭并且把end值更新为这个气球的x2
简单的说，就是排序第二个坐标，遍历检测x1在重合的范围内

## Code
```
#coding : utf-8
class Solution(object):
    def findMinArrowShots(self, points):
        points = sorted(points, key = lambda x: x[1])
        res, end = 0, -float('inf')#赋值负无穷
        for interval in points:
            if interval[0] > end:
                res += 1
                end = interval[0]
        return res
```
