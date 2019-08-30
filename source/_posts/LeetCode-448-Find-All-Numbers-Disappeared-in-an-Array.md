---
title: '[LeetCode]448. Find All Numbers Disappeared in an Array'
date: 2016-11-22 12:49:25
subtitle: "关键词： 标记数组元素"
tags:
    - Python
    - LeetCode
---
## Question
> 今天开始我决定把题目翻译一下，提供一下自己的翻译水平～

给一个整数数组，数组里1<=a[i]<=n（n是数组的长度），有些整数会出现两次有些会出现一次
找到[1,n]中所有不在这个数组里的元素
**你可以不用任何额外空间并且在O(n)下解决这个问题吗？（返回的数组不算额外空间）**
Example:

Input:
[4,3,2,7,8,2,3,1]

Output:
[5,6]

## Thinking
这个问题一看似乎非常简单，我想了个办法是利用python强大的list数据结构，新建一个从1到n的list，然后遍历去除参数数组中有的整数，剩下的就是没有粗现过的整数了

但这就违反了题目的要求，**不用任何额外空间！**

啊，这个难，真的难，难出声

我一开始的思路是，将数组进行排序，排序后依次判断数字是否在该在的位置上，但这有两个问题
1. 排序的时间复杂度一般是nlog(n)
2. 排序后的数并不会在它的位置上，因为如果前面有223，那么3就算只有1个，也不在位置上

## Solution
只好再次求助Dicussion中的大神，发现了很多有趣的解法

其中最最重要的解法就是**标记数组元素的方法**，比如这个[Java解法](https://discuss.leetcode.com/topic/65738/java-accepted-simple-solution)，用的是将出现过的整数的下标对应元素标记为负数，最后遍历一遍数组，如果哪个数是正的，就是没有被标记的，也就是没有出现过的

还有这一个[Java解法](https://discuss.leetcode.com/topic/66063/5-line-java-easy-understanding),看起来更短一点，这是将出现过的整数下标对应元素标记为+n，n就是数组的长度，最后遍历一遍数组，如果哪个数是小于n的，说明他没有被标记过

还有很多种解法，无一例外都是利用**标记**去避免利用额外空间的问题

## Code
我的Python解法如下
```
#coding: utf-8
class Solution(object):
    def findDisappearedNumbers(self, nums):
        """
        :type nums: List[int]
        :rtype: List[int]
        """
        #without extra space and in O(n) time
        answer = []
        for i in nums:
            i = abs(i)
            if nums[i-1]> 0:
                nums[i-1] = -nums[i-1]
        for j in range(len(nums)):
            if nums[j] > 0:
                answer.append(j+1)
        return answer

        # nums.sort()
        # answer = []
        # for i in range(len(nums)):
        #     if nums[i] != i+1:
        #         answer.append(i)
        # return answer

s = Solution()
print s.findDisappearedNumbers([4,3,2,7,8,2,3,1])
```
要注意第11行要先取绝对值，否则它可能事先被标记过是负的

## PS
还有个[Python解法](https://discuss.leetcode.com/topic/68430/python-one-liner)非常有趣，只有一行，利用的是python强大的set()，我觉得应该也是符合时间复杂度O(n)的
代码如下
```
def findDisappearedNumbers(self, nums):
        """
        :type nums: List[int]
        :rtype: List[int]
        """
        return list(set(range(1, len(nums)+1)) - set(nums))
```