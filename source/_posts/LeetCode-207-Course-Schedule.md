---
title: '[LeetCode]207. Course Schedule'
date: 2020-06-01 17:18:30
tags:
    - LeetCode
---
# Question
现在一共有`numCourses`个课程需要你去完成。有些课程会有预先课程，比如为了完成课程0你需要先完成课程1。
提供课程总数和所有的预先课程关系列表，你是否能够完成所有课程呢？

# Thinking
这道题细想下就会发现，这就好像js模块的循环依赖问题一样，我们要如何检查是否有循环依赖的模块存在？（虽然现在node和webpack都有循环依赖的解决方案）

所以这个循环依赖本质上就是检查这是不是有向无环图。

由此我们就转换成了一个通用问题。

好，我们怎么检查一个图是否存在环呢？

用好理解的方式，应该用dfs解决，具体做法是准备一个对象`graph`，保存所有edge的指向关系，比如A->B A->C B->C就会变成这样
```
{
    A: [B, C]
    B: [C]
}
```
通过一个js对象即可表示一个有向图

然后，我们需要准备一个数组`visited`，这个数组记录了这些节点是否有访问过，如果是0，代表未访问过，初始状态；如果是-1，代表正在访问中，如果在dfs过程中遇到了-1，说明是有环了，返回`false`；如果是1，代表之前已经遍历完这个节点了，这节点没问题，没环，指向它没事。

# Code

之前写LeetCode都是用Python，最近才开始用js来写算法题，发现在一些数组的操作上确实还是不如python简便，但是在对象的使用上能更加灵活，各有优势吧。不过这里有个坑是，js对象的key会自动把数字转化成string，比如这个题每个课程

事实上ES6从Python上借鉴了太多东西，所以当时先学Python确实还是对后来学js有帮助的。

```javascript
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
    let graph = {}
    // generate graph
    for (let i = 0; i < numCourses; i+=1) {
        graph[i] = []
    }
    prerequisites.forEach((item) => {
        let [preq, next] = item
        if (!graph[preq]) {
            graph[preq] = [next]
        } else {
            graph[preq].push(next)
        }
    })
    let visited = new Array(numCourses).fill(0)
    let dfs = function(graph, visited, course) {
        if (visited[course] === -1) {
            return false
        }
        if (visited[course] === 1) {
            return true
        }
        visited[course] = -1
        for (let i = 0; i < graph[course.toString()].length; i+=1) {
            let res = dfs(graph, visited, graph[course.toString()][i])
            if (!res) {
                return false
            }
        }
        visited[course] = 1
        return true
    }
    for (let i = 0; i < numCourses; i+=1) {
        if (!dfs(graph, visited, i)) {
            return false
        }
    }
    return true
};
```