---
title: 438. Find All Anagrams in a String
date: 2016-11-21 16:35:47
subtitle: "关键词：滑动窗口"
tags:
    - Python
    - LeetCode
---
## Question
Given a string s and a non-empty string p, find all the start indices of p's anagrams in s.

Strings consists of lowercase English letters only and the length of both strings s and p will not be larger than 20,100.

The order of output does not matter.

Example 1:

Input:
s: "cbaebabacd" p: "abc"

Output:
[0, 6]

Explanation:
The substring with start index = 0 is "cba", which is an anagram of "abc".
The substring with start index = 6 is "bac", which is an anagram of "abc".

## Thinking
这道题我一开始的思路比较简单，想到用两个循环去分别遍历p和s，在p的长度内验证s的子串是否是p的组合，所以我写出了如下的代码
```
class Solution(object):
    def findAnagrams(self, s, p):
        sLength = len(s)
        pLength = len(p)
        answer = []
        for i in xrange(sLength-pLength+1):
            flag = 1
            for j in s[i:i+pLength-1]:
                temp = list(p)
                if temp.count(j) != 0:
                    temp.remove(j)
                else:
                    flag = 0
                    break
            if flag == 1:
                answer.append(i)
        return  answer
```
但是提交的时候却出错了，
> Input:
"cbaebabacd"
"abc"
Output:
[0,1,4,5,6,7]
Expected:
[0,6]

为什么我会有这么多的输出呢，当第一个循环i遍历到e的时候不就应该判断为0而跳出了吗
于是进入了苦逼的debug阶段...

## Debug
我发现当我有两处错误

1. 当我执行到
`for j in s[i:i+pLength-1]:`时，我其实少执行了1次，因为在python的list切片中，后面那个数代表的是到第几位，而不是index，我不该-1

2. 我的temp不该是放在内部循环内，这样的话我每次去remove一个值，第二次它又被重新复制为原样

## TLE
修改完这些错误后，我提交竟然LTE了，想想也是，我用了嵌套循环，现在时间复杂度是O(len(s)*len(p))

无奈之下，我只好去看看别人的解法。

## Solution
我发现大家都无一例外的提到了**Sliding Window**这个概念，也就是滑动窗口，滑动窗口是TCP协议中解决网络堵塞的经典做法，使用滑动窗口遍历s，就可以避免双重循环的问题

有个用python的使用了Counter这个python的Collection类，他通过比较Counter是否相等来判断s子串是否和p相等，python的Counter类可以见此[链接](http://www.pythoner.com/205.html)非常详细，博客也做的很不错

不过底下有人评论说不需要用Counter的判断相等，因为用了Counter的相等相当于又遍历循环了一次，时间复杂度更大，只需要用dic就可以了，他的解法如下
```
def findAnagrams(self, s, p):
	"""
	:type s: str
	:type p: str
	:rtype: List[int]
	"""
	d = defaultdict(int)
	ns, np = len(s), len(p)
	ans = []
	
	for c in p:	d[c] -= 1
	
	for i in xrange(ns):
		if i < np:
			d[s[i]] += 1
			if not d[s[i]]: del d[s[i]]
			
		else:
			if not d: ans.append(i-np)
			
			d[s[i-np]] -= 1
			if not d[s[i-np]] : del d[s[i-np]]
			
			d[s[i]] += 1
			if not d[s[i]]: del d[s[i]]
	if not d: ans.append(i-np+1)
	
	return ans
```
这段代码有点unreadable，但确实是非常精彩，其中d就是这个滑动窗口，每一次只从需要比较的dic中删除开头的一个，并加入后面的一个，然后检查dic是否为空就行了

注意到这里的python代码用到了defaultdic()这个函数，这个函数是python的collections模块里的，需要import，但是在LeetCode里面已经自动引入了这个模块，可以直接用

## PS
只要掌握了这个滑动窗口的概念，其实各种语言有各种实现方式，看了java的版本，有人用的整形数组int[26]来作为滑动窗口，也有用map的，总之想办法实现这个滑动窗口，然后想办法判断是否相等就行了