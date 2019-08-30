---
title: '[LeetCode]125. Valid Palindrome'
date: 2017-01-03 21:27:40
tags:
    - Python
    - LeetCode
---
# Question
给一个字符串，判断这个字符串中除去字母和数字以外的空格等符号后，是一个回文字符串，比如：

"A man, a plan, a canal: Panama" 是回文的.
"race a car" 不是回文的.

**如果字符串为空，视为回文的**

# Solution
这道题也比较简单了，其实就是头尾遍历，如果不是字符串就跳过，是字符串就比较头尾会不会相等，不相等就返回False
主要是要对语言的判断字符等内置函数较为熟悉才行

# Code
```
class Solution(object):
    def isPalindrome(self, s):
        """
        :type s: str
        :rtype: bool
        """
        if len(s) == 0:
            return True
        head = 0
        tail = len(s)-1
        while head < tail:
            if not s[head].isalnum():
                head+=1
                continue
            elif not s[tail].isalnum():
                tail-=1
                continue
            elif s[head].lower() == s[tail].lower():
                head+=1
                tail-=1
                continue
            elif s[head].lower() != s[tail].lower():
                return False
        return True
```

