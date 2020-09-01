---
title: '[LeetCode]1029. Two City Scheduling'
date: 2020-06-03 20:46:19
tags:
    - LeetCode
---

# Question

现在有2N个人，需要飞往A城市或者B城市，假设第i个人飞到A城市有20公里，飞到B城市有50公里，记为`[20, 50]`，
给出成本costs数组，第i个人飞AB市的成本是`costs[i] === [20, 50]`，我们需要保证有N个人飞A城市，N个人飞B城市，而且他们总共飞的里程数是最小的。

# Thinking

第一直觉是需要用到动态规划的，那么我们想想其中的[状态转移方程](https://www.cnblogs.com/tgycoder/p/5037559.html)会是怎样的。

（https://juejin.im/post/5d556b7ef265da03aa2568d5 这个链接也非常值得推荐，适合理解动态规划中状态转移方程的推导）

好，我们来开始找个最优子状态

假设已经有最优解`dp[i-1][j-1]`，这里i代表i个人飞A城市，j代表j个人飞B城市，i+j === 2N

我们如何知道`dp[i][j]`的最优解呢

`dp[i][j]`代表又来了两个人，其中第`i+j-2`个飞A，另一个`i+j-1`飞B，我们可以把两种情况都列出来，取其中的最小值

所以就是`dp[i][j] = Math.min(dp[i-1][j-1] + costs[i+j-2][0] + costs[i+j-1][1], dp[i-1][j-1] + costs[i+j-2][1] + costs[i+j-1][0])`

然后我们来找下最基本的情况

`dp[0][0]` 就是没人飞，成本为0
`dp[i][0]` 代表全都飞A市，那么`dp[i][0] = dp[i-1][0] + costs[i][0]`
`dp[0][j]` 代表全都飞B市，那么`dp[0][j] = dp[0][j-1] + costs[j][1]`

