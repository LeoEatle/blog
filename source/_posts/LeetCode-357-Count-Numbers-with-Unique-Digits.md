---
title: '[LeetCode]357. Count Numbers with Unique Digits'
date: 2017-01-13 16:08:40
subtitle: "利用简单的DP思想"
tags:
    - Python
    - LeetCode
---
## Question
给一个非负整数n，计算从0到10^n中有多少个没有重复数字的整数，比如：
n=2,返回91,因为从0<=x<100中除去了`[11,22,33,44,55,66,77,88,99]`

## Thinking
这道题可以利用dp的思想，我们通过n的增加发现：
n=1,是10个
n=2，对于1到9每个数字，都多出了另外9个数字可以组合，所以增加了`9*9`
n=3，对于前面的两个数字ij，我们的第三个数字k可以取另外8个数字，所以增加了`9*9*8`
以此类推，后面分别是`9*9*8*...*(11-k)`

所以我们可以建立一个dp数组，保存这些数字，然后根据n的大小依次累计

## Code
```
class Solution(object):
    def countNumbersWithUniqueDigits(self, n):
        """
        :type n: int
        :rtype: int
        """
        # using Dp solution
        dp = [1,9]

        for i in range(2,11):
            #if i == 2:
            #    dp.append(9*9)
            dp.append(dp[-1] * (11-i))
        print dp
        result = 0
        for j in range(n+1):
            if j > 10:
                return result
            result = result + dp[j]
        return result

s = Solution()
print s.countNumbersWithUniqueDigits(3)
```