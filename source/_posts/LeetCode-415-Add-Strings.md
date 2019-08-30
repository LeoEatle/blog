---
title: '[LeetCode]415. Add Strings'
date: 2016-12-07 13:41:37
subtitle: "禁止使用某些内置函数"
tags:
    - Python
    - LeetCode
---
## Question
给两个非负整数num1和num2，这两个整数都是<5100，只包含数字，但这两个整数是以字符串的形式给出的，现在要求两者的和，不能使用任何内建的str to int之类的函数

## Solution
这道题的难点很突出，就是如何在不使用内置函数的情况下求两个数字的数学运算
我的思路也很简单，就和普通的按位相加一样，从地位到高位加上去

但是我并不知道如何在不使用内置函数的情况下将字符串转为数字

这就是涉及了python的`ord`函数，这个函数可以返回一个字符的ASCII码或者Unicode码，关于ASCII码和Unicode码的关系可以复习下这篇[阮一峰的经典](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)

如果是Java的话，直接用字符串相减就可以了，Java会自动去用他们的Unicode码去计算，但在python中这么做就会提示`unsupported operand type(s) for -: 'str' and 'str'`

## Code
```
class Solution(object):
    def addStrings(self, num1, num2):
        """
        :type num1: str
        :type num2: str
        :rtype: str
        """
        l1 = len(num1)
        l2 = len(num2)
        carry = 0
        answer = ""
        if l1 > l2:
            longer = l1
        else:
            longer = l2
        #longer = l1 > l2 ? l1: l2
        for i in range(longer):
            if i <= l1:
                n1 = ord(num1[-i]) - ord('0')
            else:
                n1 = 0
            if i <= l2:
                n2 = ord(num2[-i]) - ord('0')
            else:
                n2 = 0
            s = n1 + n2 + carry
            if s / 10 == 1:
                carry = 1
            else:
                carry = 0
            answer = answer + str(s % 10)
        if carry == 1:
            answer = answer + '1'
        return answer[::-1]
```

## Tips
我意外的发现原来python没有三元表达式，哎，代码是越来越不pythonic了，其实也许还是用C++写算法题是最好的吧