---
title: '[LeetCode]190 Reversed Bits'
date: 2016-11-28 13:55:26
subtitle: 位运算
tags:
    - Python
    - LeetCode
---
## Question
反转一个含有32位的无符号整数

比如，给一个输入是43261596，二进制是00000010100101000001111010011100，返回964176192，二进制是00111001011110000010100101000000

如果这个函数要被循环调用，你如何优化它呢？

## Solution
如果是利用Python强大的list与str互转以及强大的reverse的话，其实非常简单，但是这里其实是可以用位运算去做反转的

Code如下
```
def reverseBits_1(self, n):
        reversed = 0
        for i in range(32):
            reversed = reversed << 1
            print reversed
            reversed |= (n >> i) & 0x1#这里其实是把n右移i位取出最后一位，并将其放入reversed的首位
            print reversed
        return reversed
```

## 位运算
位运算还可以用于布隆过滤器、不通过临时空间去交换两个变量的值，还可以在一个数列中寻找奇数项和偶数项

[链接](http://www.nowcoder.com/courses/1/8/2)