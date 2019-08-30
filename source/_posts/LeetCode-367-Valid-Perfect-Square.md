---
title: '[LeetCode]367. Valid Perfect Square'
date: 2017-01-02 18:15:24
subtitle: 完全平方数的判断
tags:
    - Python
    - LeetCode
---
# Question
题目很简单，要求判断一个数字是不是完全平方数，不准使用各种内置函数

# Solution
## 第一个想法
我的第一个想法是这样的，不断遍历数从2到数的一半，进行除法操作，每次除数都push入一个数组，直到最后不能除为止，然后判断这个数组每个数字的数量是不是偶数
但是果然TEL了，我猜想可能是最后的判断数组中数字为偶数这个步骤成本太大。

## 第二个想法
我想到不需要去用一个数组去保存所有的除数，而是通过一个标记数去标记，如果标记数为0，就把除数赋值给它，如果标记数不是0，分两种情况，一个是除数和标记数相同，就把标记数归零，一个是除数和标记数不同，说明一定会多出一个数字，直接返回False
但是出乎我的意外，居然又超时了，即使是O(n)也不满足

## 解法1
discussion中一种解法是利用一个完全平方数相当于`1+3+5+7...`，所以我们循环操作每次减一个奇数最后判断为0就行了
```
public boolean isPerfectSquare(int num) {
     int i = 1;
     while (num > 0) {
         num -= i;
         i += 2;
     }
     return num == 0;
 }
```

## 解法2
另一种做法是这样的，先求出1和num的中位数，也就是`(1+num)/2`，然后判断中位数的平方和num^2的大小，如果相等就是找到它的根。
嗯，其实就是通过二分法找num的平方根
```
#coding: utf-8
class Solution(object):
    def isPerfectSquare(self, num):
        low = 1
        high = num

        while low <= high:
            mid = int((low + high) / 2)
            if mid * mid == num:
                return True

            elif mid * mid > num:
                high = int(mid - 1)
            elif mid * mid < num:
                low = int(mid + 1)
        return False
```



