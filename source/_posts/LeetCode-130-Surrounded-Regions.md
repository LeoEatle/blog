---
title: '[LeetCode]130. Surrounded Regions'
date: 2016-11-26 23:21:14
subtitle: 这道题调bug到痛哭出声
tags:
    - Python
    - LeetCode
---
## Question
Given a 2D board containing 'X' and 'O' (the letter O), capture all regions surrounded by 'X'.
给一个包含'X'和'O'的2d矩阵，找到所有被X包围的O

A region is captured by flipping all 'O's into 'X's in that surrounded region.
被X包围的O通通要被转化成X

For example,
X X X X
X O O X
X X O X
X O X X
After running your function, the board should be:

X X X X
X X X X
X X X X
X O X X

## Thinking
其实这道题不用想着怎么去证明一堆O被X给包围，只有在边缘的O和这个O连接的O才不会包围，所以秘诀就是——
**BFS**
如何利用BFS思想呢，只要把边缘上的O一一遍历，然后找出和这些O连接的O，进行一个标记，我的代码中是改为'S'，你也可以改成'+', 'P', or anything you like
最后把你标记过的改回'O'，剩下的'O'都是被包围的了，改成'X'就行了

## Code
```
#coding: utf-8

class Solution(object):
    def solve(self, board):
        """
        :type board: List[List[str]]
        :rtype: void Do not return anything, modify board in-place instead.
        """
        if len(board) == 0 or len(board[0]) == 0:
            return
        y = len(board)
        x = len(board[0])
        edgePoint = []

        #遍历加入边缘的O点,并将遍历过的边上的点置为'S'
        for i in range(x):
            if board[0][i] == 'O':
                board[0][i] = 'S'
                edgePoint.append([0, i])
            if board[y-1][i] == 'O':
                board[y-1][i] = 'S'
                edgePoint.append([y-1, i])

        for j in range(y):
            if board[j][0] == 'O':
                board[j][0] = 'S'
                edgePoint.append([j, 0])
            if board[j][x-1] == 'O':
                board[j][x-1] = 'S'
                edgePoint.append([j, x-1])

        #遍历检查边缘O点是否有临近O点
        while len(edgePoint) > 0:
            temp = edgePoint.pop(0)
            tempX = temp[1]
            tempY = temp[0]
            if tempX-1 >= 0 and board[tempY][tempX-1] == 'O':
                board[tempY][tempX - 1] = 'S'
                edgePoint.append([tempY, tempX-1])
            if tempY-1 >= 0 and board[tempY-1][tempX] == 'O':
                board[tempY - 1][tempX] = 'S'
                edgePoint.append([tempY-1, tempX])
            if tempX+1 <= x-1 and board[tempY][tempX+1] == 'O':
                board[tempY][tempX + 1] = 'S'
                edgePoint.append([tempY, tempX+1])
            if tempY+1 <= y-1 and board[tempY+1][tempX] == 'O':
                board[tempY + 1][tempX] = 'S'
                edgePoint.append([tempY+1, tempX])

        for i in range(x):
            for j in range(y):
                if board[j][i] == 'O':
                    board[j][i] = 'X'
                elif board[j][i] == 'S':
                    board[j][i] = 'O'


s = Solution()
s.solve([['O','O','O'],['O','O','O'],['O','O','O']])

```

## Debug
由于这道题的x和y太混了...还有各种情况需要去分辨case，所以调了很多次bug才成功...不容易啊