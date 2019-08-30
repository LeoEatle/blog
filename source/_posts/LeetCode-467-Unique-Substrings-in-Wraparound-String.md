---
title: '[LeetCode]467. Unique Substrings in Wraparound String'
date: 2016-12-23 16:56:44
tags:
    - LeetCode
    - Python
---
## 题意
s属于a-z无限循环字符串中的一个子串。
现在我们有一个p，你要找到有多少种s属于p的子串。
还是举个栗子吧
<pre>
Example 1:
Input: "a"
Output: 1

Explanation: Only the substring "a" of string "a" is in the string s.
Example 2:
Input: "cac"
Output: 2
Explanation: There are two substrings "a", "c" of string "cac" in the string s.
Example 3:
Input: "zab"
Output: 6
Explanation: There are six substrings "z", "a", "b", "za", "ab", "zab" of string "zab" in the string s.
</pre>

## 解法
我一开始果然还是用了非常笨的方案，就是遍历每一个子串然后判断是否属于s，但是这样时间复杂度飙到了O(n3)，而且，我发现我没办法判断子串是否会有重复的情况。

于是我就加上了一个set，通过判断子串是否在set里决定是否对结果进行＋1，但这样效率还是太慢，set去重效率依然不高，最关键的依然是我每次都要遍历两遍一个字符开始的子串。

看了看topSolution，果然还是有更好的方案的：

维护一个dic，只需要遍历一遍，如果是连续的就让这个dic对应的字符maxLen更新，代表的含义就是，**以这个字符结尾的连续子串有多长**
最后把dic每个值加起来就可以了
一开始还不明白为什么这样就可以避免重复的子串，其实道理很简单
**dic只有26个值**，分别对应26个字母，如果后面还有相同的连续字母串，除非它的长度更大，否则相应的maxLen根本不会更新。

## Code
```
    def findSubstringInWraproundString(self, p):
        """
        :type p: str
        :rtype: int
        """
        unique = collections.defaultdict(int)
        l = len(p)
        maxLen = 0
        for i in range(l):

            if i and not self.checkS(p[i-1], p[i]):
                maxLen = 1
            else:
                maxLen = maxLen + 1
            unique[p[i]] = max(maxLen, unique[p[i]])
        return sum(unique.values())

```
对应我之前写的代码。整整少了20行不止。看来自己还需要多加锻炼啊...
