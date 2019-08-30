---
title: '[LeetCode]413. Arithmetic Slices'
date: 2016-11-14 12:22:19
tags:
    - Python
    - LeetCode
---
### Question
A sequence of number is called arithmetic if it consists of at least three elements and if the difference between any two consecutive elements is the same.

For example, these are arithmetic sequence:

1, 3, 5, 7, 9
7, 7, 7, 7
3, -1, -5, -9
The following sequence is not arithmetic.

1, 1, 2, 5, 7

A zero-indexed array A consisting of N numbers is given. A slice of that array is any pair of integers (P, Q) such that 0 <= P < Q < N.

A slice (P, Q) of array A is called arithmetic if the sequence:
A[P], A[p + 1], ..., A[Q - 1], A[Q] is arithmetic. In particular, this means that P + 1 < Q.

The function should return the number of arithmetic slices in the array A.

注意这里的slice必须是长度大于或等于3的，因为有P+1<Q这个条件

***

### 思路：分解问题
1. 如果是不连续的，如1231234，很明显123和1234两个是独立的，
    如果知道了一个序列变得不连续了，也就是说`P[n]-P[n-1]!=P[n-1]-P[n-2]`,那就说明这是两个独立的序列，需要分别计算，最后求和
    所以问题可以简化成，如何求两个独立的等差片段

2. 如何求一个以X结尾的连续的等差片段，它的子等差片段有多少个？
    这个时候又可以从初始状态考虑起，先考虑只有三个的等差序列，只有1个slice，如果长度是4，就是1+2=3个，如果长度是5，就是又多出了3个，1+2+3=6个，原来是个Fibonacchi序列，这样的话就可以用动态规划的方法求出来了
    
    用cur和sum保存已经求出来的和，一旦等差序列“断了”，就将cur清零

### Solution:

```
class Solution(object):
    def numberOfArithmeticSlices(self, A):
        cur = 0
        total = 0
        if len(A) < 3:
            return total
        for i in range(2, len(A)):
            if  A[i]-A[i-1] == A[i-1]-A[i-2]:
                cur = cur + 1
                total = total + cur
            else:
                cur = 0
        return total

```

