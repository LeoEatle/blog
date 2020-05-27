---
title: '[LeetCode]886. Possible Bipartition'
date: 2020-05-27 21:40:56
tags:
    - LeetCode
---
# Question
有个N个人，我们需要把他们分为两个组。这N个人可能有两个人会互相讨厌，两个互相讨厌的人a和b被表示为数组`[a, b]`
两个互相讨厌的人不能被分到同一组。

Example
```
Input: N = 4, dislikes = [[1,2],[1,3],[2,4]]
Output: true
Explanation: group1 [1,4], group2 [2,3]
```

# Thinking

这其实是个二分图的题目，我们的目的就是把这些人分成两部分，每个组里不能有互相讨厌的人。
那么我们可以先用二维讨厌数组T来保存这些人的讨厌关系，比如`T[a][b] = 1`表示a讨厌b，当然人是互相讨厌的，所以`T[b][a] = 1`
建立了这个二维数组后，我们就可以用染色法来判断是否存在办法按要求分割成两个组。
什么是染色法呢，其实就是按照递归的方式，不断地寻找~
好吧，具体做法如下，准备一个染色数组，我们叫它C吧，一开始，各位都是白纸，所以`C[i] = 0`，0代表还未染色。
轮到第一个人，我们先把它染成黑色`C[0] = 1`，然后我们需要在讨厌数组中，找和他互相讨厌的人，比如如果`T[1][2] === 1`，2号就是和1号互相讨厌的人，看到没，这里用一个讨厌关系数组就能很轻松地遍历互相讨厌的人，否则还得在原来的二维数组里找，就比较麻烦。
假如这个2号还是白纸一张，那么我们就需要尝试把它染成`-1`，因为这里只需要分为两部分，所以分别用1和-1表示两种颜色就可以了。如何尝试染成-1呢，其实就是再调用这个遍历函数，让后面继续递归。所以这个函数需要哪些参数呢？需要讨厌数组`T`、起点`i`、需要染的颜色`color`、和整个染色数组`C`。如果这个函数最后还是返回了`false`，我们宣告染色失败，直接返回`false`。
假如这个2号也同样是1，那么说明这个人已经被染色过了，两个人会撞车在同组，直接返回`false`

# Code

```javascript
/**
 * @param {number} N
 * @param {number[][]} dislikes
 * @return {boolean}
 */
var possibleBipartition = function(N, dislikes) {
    // because dislikes start at 1, so we create array of N+1
    let T = new Array(N + 1);
    for(let i = 0; i < N + 1; i+=1) {
        T[i] = new Array(N + 1);
    }
    dislikes.forEach((item) => {
        T[item[0]][item[1]] = 1;
        T[item[1]][item[0]] = 1;
    })
    // console.log('T', T)
    let C = new Array(N + 1).fill(0);
    let coloring = function(T, i, color, C) {
        C[i] = color;
        for (let j = 1; j <= N; j+=1) {
            if (T[i][j] === 1) {
                if (C[j] === color) {
                    return false;
                }
                if (C[j] === 0) {
                    if (!coloring(T, j, -color, C)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    for (let i = 1; i <= N; i += 1) {
        if (C[i] === 0 && !coloring(T, i, 1, C)) {
            return false;
        }
    }
    return true;
};
```