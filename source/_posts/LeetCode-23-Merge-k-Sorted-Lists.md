---
title: '[LeetCode]23. Merge k Sorted Lists'
date: 2016-12-26 12:09:55
subtitle: 'heap和Priority Queue'
tags:
    - Python
    - LeetCode
---
## Question
给k个排序好的list，返回一个排序好的list

## Thinking
这个问题明显是比较早起的LeetCode题目了，居然序号是23，问题也非常简明，咋一看似乎不简单，但仔细想想就发现，其实比一般的排序说不定复杂度还能更低。

因为这可是排序好的lists啊

那么怎么做呢，其实有很多方案，其中一个最能利用现有数据结构的就是heap和prioriy Queue

## Heap
Heap排序，很多人也明白，其实就是实现一个最小堆，然后将全部数字入堆，每次入堆堆内都会进行一次调整，无非就是比左节点小了就换啦，比右节点大了就换啦，反正每次出堆的都能保证是堆内最小的，那么这道题就变得非常简单了，只需要把每个list里所有的数字依次进堆再出堆放到新的list里就行了。

Priority Queue其实也是一个道理，Java 1.5开始实现了这个数据结构，内部好像也是用的是heap作为数据结构，具体可以看这个[wikipedia链接](https://en.wikipedia.org/wiki/Priority_queue)，出入堆时间复杂度可以低至O(logn)，但是build一个heap就需要O(n)了

## Other Solution
其实这道题也完全没必要用堆的，评论区有人给出了一个js的方案，每次从lists中shift两个list进行合并，合并的时候就是遍历每个list哪个小就先抽出来，最后形成一个list再push进lists中等待下一次合并，但每次合并都能保证出来的list是有序的
但是这个时间复杂度可能要到O(nk^2)，试想每个list可能都需要遍历两遍以上甚至k遍

**两种方案的不同是使用heap一次能比较所有list的首位数字，第二种方案是一次比较两个list的首位数字然后不断合并**

## Code
Python如果用heap方式实现，有个内置的heapq库，很好用，很强
```
def mergeKLists(self, lists):
    from heapq import heappush, heappop, heapreplace, heapify
    dummy = node = ListNode(0)
    h = [(n.val, n) for n in lists if n]
    heapify(h)
    while h:
        v, n = h[0]
        if n.next is None:
            heappop(h) #only change heap size when necessary
        else:
            heapreplace(h, (n.next.val, n.next))
        node.next = n
        node = node.next

    return dummy.next
```

我尝试把后面那种方法改成用Python实现
```
class Solution(object):
    def mergeKLists(self, lists):
        """
        :type lists: List[ListNode]
        :rtype: ListNode
        """
        if lists == None or len(lists) == 0:
            return None
        while len(lists) > 1:
            #l = lists.pop()

            lists.append(self.merge(lists.pop(), lists.pop()))
        return lists[0]


    def merge(self, a, b):
        dummy = ListNode(None)
        tail = dummy
        while a and b:
            if a.val < b.val:
                tail.next = a#这里不能用连续赋值
                tail = tail.next
                a = a.next
            else:
                tail.next = b
                tail = tail.next
                b = b.next

        tail.next = a if a else b
        return dummy.next
```
值得一提的是其中注释的地方不能用连续赋值`tail = tail.next = a`，否则python会解读为
`tail = a tail.next = a`导致无限循环，这可能是python的"特性"之一吧