---
title: '[LeetCode]406. Queue Reconstruction by Height'
date: 2017-01-11 22:10:06
tags:
    - Python
    - LeetCode
---
## Question
这道题很有意思，给一个包含Person对象的list，每个person有两个值[h,k]，h代表这个人的高度，k代表这个人前面有多少个比他高或者高度一样的人
我们需要重新让他们排队，构建一个符合这个要求的队列
比如：
Input:
[[7,0], [4,4], [7,1], [5,0], [6,1], [5,2]]

Output:
[[5,0], [7,0], [5,2], [6,1], [4,4], [7,1]]

## Thinking
这道题排名第一的dicussion有一个python解法，他是先把list按照h由高到低排序，然后再按照k分别插入到一个新的list中，而k的值正是插入队列的index，然而我并没有看懂为什么这样做就能获得正确结果。

[第二个答案解释得非常清楚](https://discuss.leetcode.com/topic/60981/explanation-of-the-neat-sort-insert-solution)

原来这是利用了一个关系：高的人不需要考虑矮的人是否在他们前面，所以我们先安排高的人按照他们的k值插入队列，然后再按照k值插入矮的人，这样后面插入的矮的人对于高的人其实是“隐形”的

## Code
```
class Solution(object):
    def reconstructQueue(self, people):
        """
        :type people: List[List[int]]
        :rtype: List[List[int]]
        """
        if not people:
            return []
        queue = []
        for h, k in sorted(people, key=lambda (h, k): (-h, k)):
            queue.insert(k, [h , k])
        return queue
```
**PS: 这里利用了一个匿名lambda函数表达式简化了list的排序操作**
