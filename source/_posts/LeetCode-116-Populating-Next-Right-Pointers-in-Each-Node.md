---
title: '[LeetCode]116.Populating Next Right Pointers in Each Node'
date: 2016-12-31 21:00:06
subtitle: "如何利用已经计算好的结果来减少时间/空间复杂度"
tags:
    - Python
    - LeetCode
---
# Question
给一个二叉树，你需要按层遍历并像下面这样：
         1
       /  \
      2    3
     / \  / \
    4  5  6  7
变成下面这样：
        1 -> NULL
       /  \
      2 -> 3 -> NULL
     / \  / \
    4->5->6->7 -> NULL

# Hint
我一开始的想法是利用两个空的队列，通过每一层的遍历将队列中的数字串起来，但是这样空间复杂度有点高
有个很有趣的提示说，如果你想仅仅使用O(1)完成这个问题，你需要利用上一层建立好的链表

# 于是最棒的答案出现了
我们可以不需要将遍历过的数字放在队列里，而是利用上一层建立的链表去遍历上一层
然后通过上一层的遍历去建立下一层的链表
这样就不需要队列这个数据结构了

# Code
我们需要两个指针
`pre`和`cur`，pre指向上一层，cur指向你要建立的链表
这是C++的写法，果然C++是最适合做算法题的啊
```
void connect(TreeLinkNode *root) {
    if (root == NULL) return;
    TreeLinkNode *pre = root;
    TreeLinkNode *cur = NULL;
    while(pre->left) {
        cur = pre;
        while(cur) {
            cur->left->next = cur->right;
            if(cur->next) cur->right->next = cur->next->left;
            cur = cur->next;
        }
        pre = pre->left;
    }
}
```
我尝试把这段代码改成Python的
在这个过程中我明显感受到一点就是python这类不太关心变量类型的脚本语言，在涉及到这类指针操作的时候会比较困惑
在这段代码中很容易你会忘记`pre`和`cur`是指向什么样的变量类型
```
class Solution:
    # @param root, a tree link node
    # @return nothing
    def connect(self, root):
        cur = None
        pre = root
        while(pre.left != None):
            cur = pre
            while(cur):
                cur.left.next = cur.right
                if(cur.next):
                    cur.right.next = cur.next.right
                cur = cur.next
            pre = pre.left

```
