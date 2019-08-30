---
title: '[LeetCode]274. H-index'
date: 2016-12-17 21:06:38
subtitle: bucketSort
tags:
    - Python
    - LeetCode
---
## Question
每一个科学家的h-index是这样定义的：假设他发表的文章是一个数组，那么数组中的值代表的是他这篇文章被引用数，比如[3,0,6,1,5]代表的是他有五篇文章，每篇文章的被引用数分别是3，0，6，1，5
H-index如果是N，就是说他至少有N篇文章的引用数不少于N，而且剩下的文章的引用数都是少于N的，在这个例子中就是3，因为他的3,6,5这三篇文章的引用数都不少于3，而且剩下的文章的引用数都没有达到3

## Solution
这道题的关键思路是如何把这个citations数组用另一种方式表示。
在这里就是利用了**Bucket Sort**的思想

Bucket Sort，也叫基数排序，是通过判断每一位数字的大小，分别按位数从高到低排序。

在这里我们可以定义一个长度为length+1的list,这个list的每一个值的index就是被引用数，比如上面的例子就会变成[1,1,0,1,0,1,1]，为什么长度是length+1呢，因为有可能文章的被引用数比总文章数还多，这种情况我们就把它分配到index为length的位置上

最后我们从尾到头遍历这个数组，将每个index上的值依次累加，如果累加的和是比index要大的，说明满足了H-index的条件，而且这个index就是最大的H-index

## Code
```
#coding: utf-8
class Solution(object):
    def hIndex(self, citations):
        """
        :type citations: List[int]
        :rtype: int
        """
        bucket_list = []#bucket_list就是代表在那个index的paper的citaion数就是index的值
        l = len(citations)
        for i in range(l+1):
            bucket_list.append(0)
        for i in citations:
            if i >= l:
                bucket_list[l] += 1
            else:
                bucket_list[i] += 1
        j = l
        accumulate = 0
        while j > 0:
            accumulate = accumulate + bucket_list[j]
            if accumulate >= j:
                return j
            j-=1
        return 0
```

## Extension
[Bucket Sort](https://en.wikipedia.org/wiki/Bucket_sort)
桶排序分为高位桶(MSD)和低位桶(LSD)，是个稳定的排序算法，时间复杂度为O(n + radix)