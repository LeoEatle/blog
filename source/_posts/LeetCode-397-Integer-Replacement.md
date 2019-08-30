---
title: '[LeetCode]397. Integer Replacement'
date: 2017-01-09 21:29:27
subtitle: "反直觉的问题"
tags:
    - Python
    - LeetCode
---
## Question
这个问题挺有趣的，给一个整数，通过除2、加1、减1三种方式，以最快的速度使数字变成1，比如：
`8 -> 4 -> 2 -> 1`
或者
`7 -> 8 -> 4 -> 2 -> 1 or 7 -> 6 -> 3 -> 2 -> 1`

## Thinking
这个问题我的第一个直觉是这样的，如果是偶数就除以2，如果是奇数就减去1，很自然的很简单的想法，不过测试之后有反例出现
为什么会这样呢，看了discussion，top 1的解释比较详细，这里翻译一下：
> 如果是偶数自然是毫不犹豫地除以2，但如果是奇数呢？我们要判断是否应该加1或者减1，需要看加1/减1后能否为后面取得更多的偶数
> 比如`111011 -> 111010 -> 11101 -> 11100 -> 1110 -> 111 -> 1000 -> 100 -> 10 -> 1`
> 其实还有更好的解法`111011 -> 111100 -> 11110 -> 1111 -> 10000 -> 1000 -> 100 -> 10 -> 1`
> 因为第二种能够除以的次数更多
知道原因之后，我们怎么能保证除以的次数最多呢？其实有两种思路：

1. 使用像Java中的`Integer.bitCount`方法去比较+1的的0多还是－1的0多，同样我们也可以用`$11`操作去比较后两位是否是`01`或者是`11`，其实也可以判断能否`%4==0`，这些都是大同小异了，这种思路就是想办法消除更多的0
2. 使用DP的思想，通过递归去找最小的路径，不过这种要耗费更多时间和空间

其实第一种方法会发现每次都是+1得到的结果可以整除2的次数最多，唯一的例外就是3

## Code
如果使用第二种方法，是这样的
```
class Solution(object):
    def integerReplacement(self, n):
        """
        :type n: int
        :rtype: int
        """
        if n == 1:
            return 0
        if n % 2:
            return 1 + min(self.integerReplacement(n+1), self.integerReplacement(n-1))
        else:
            return 1 + self.integerReplacement(n/2)
```

如果是第一种，是这样
```
class Solution(object):
    def integerReplacement(self, n):
        """
        :type n: int
        :rtype: int
        """
        count = 0
        while n is not 1:
            if n % 2 == 0:
                n = n / 2
                count += 1
            elif n == 3 or n & 3 == 1:
                n = n - 1
                count += 1
            else:
                n = n + 1
                count += 1
        return count

```