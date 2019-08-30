---
title: '[LeetCode]419. Battleships in a Board'
date: 2017-01-10 22:18:37
tags:
    - Python
    - LeetCode
---
## Question
给一个矩阵，我们要找出其中有多少个战舰，一个战舰的定义是：一条n*1或者1*n的'X',两个战舰中间必须有至少一个'.'分隔开，比如：
```
X..X
...X
...X
```
这样就是两条战舰，
```
...X
XXXX
...X
```
这样就是无效的战舰

## Thinking
这道题如果用BFS去解，时间复杂度会比较大，其实这道题有更为简易的解法：

我们只需要计算每个战舰的左上角的那个一个'X'，有多少个这样有效的'X'就有多少个战舰

## Code
```
class Solution(object):
    def countBattleships(self, board):
        """
        :type board: List[List[str]]
        :rtype: int
        """
        x = len(board[0])
        y = len(board)
        count = 0
        for i in xrange(y):
            for j in xrange(x):
                if board == "X" and (i == 0 or board[i-1][j] == '.') and (j == 0 or board[i][j-1] == '.'):
                    count +=1
        return count

s = Solution()
print s.countBattleships(["X..X","...X","...X"])
```