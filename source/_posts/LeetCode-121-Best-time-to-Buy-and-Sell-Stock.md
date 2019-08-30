---
title: '[LeetCode]121 Best time to Buy and Sell Stock'
date: 2016-11-11 22:37:38
tags: 
    - python
    - flask
---

# 121 Best Time to Buy and Sell Stock
这个问题比较经典，抽象出来就是从一个数组中找出两端之间的最大值

## 第一种解法
可以用遍历两次的方式，第一次遍历确定卖出股票的日期，第二次遍历买入股票的日期，相减求出最大值并放入一个数组中，这个数组所保存的就是每天卖出可以获得的最大利益，最后再求出这个数组的最大值
但是，这样嵌套循环的结果是O(n2)

## 第二种解法
我们可以只遍历一次，每次确定目前为止可以买入的最小值，然后拿目前的卖出价格减去之前确定的最小值，如果这个差值比现有的profit更大，就更新profit

代码：
```
#coding: utf-8

class Solution(object):
    def maxProfit(self, prices):
        """

        :param prices: List[int]:
        :return: int
        """
        if len(prices) == 0:
            return 0
        min_price = prices[0]
        profit = 0
        for price in prices:
            if price < min_price:
                min_price = price
            if price - min_price > profit:
                profit = price - min_price
        return profit


s = Solution()
print s.maxProfit([1,2,3,4])
```