---
title: 525. Contiguous Array
date: 2020-05-28 17:26:19
tags:
    - LeetCode
---
# Question
有一串数组，由0和1组成，我们需要找到最长连续子数组符合这样的条件：这个子数组中的0和1数量相同。

# Thinking
其实看到数量相同，我很快就想到了把0换成-1，相加和为0，就能说明数量相同，但是要怎么找符合这个条件的最长连续子数组，就没了思路。

其实这种问题很典型，拆开来看，一个是最长子序列，一个是该序列符合的条件，我们能解决后者，但我们要考虑前者。
对于找最长子序列，有个很通用的做法是这样的。

通过一个hashMap（在js中完全可以通过Object代替），存储一个符合条件的子序列之和，与该子序列最后的坐标的映射关系。
只要后面遍历数组得到新的和，与这个hashmap中存在对应的和，就说明中间这段的数组加起来为0.然后不断取这个情况的最大值就可以了。

以此类推，之后遇到要求最长子序列的问题，我们同样可以把符合条件的情况和对应最后坐标存一个映射关系。之后想办法能够在后面利用到前面已经求得的结果，判断出后面的遍历中是否也能满足条件。

# Code

注意这里要初始化hashmap为`{0: -1}`，因为对于初始情况，sum就是0。

另外，这里如果使用object，它的key是个string，而不是个number，需要使用`toString()`进行转化。

最后的代码如下：

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxLength = function(nums) {
    let sumMap = {
        0: -1
    };
    let sum = 0;
    let res = 0;
    for (let i = 0; i < nums.length; i += 1) {
        if (nums[i] === 0) {
            nums[i] = -1;
        }
        sum = sum + nums[i];
        if (sumMap[sum.toString()] === undefined) {
            sumMap[sum.toString()] = i;
        } else {
            res = Math.max(res, i - sumMap[sum.toString()]);
        }
    }
    return res;
};
```