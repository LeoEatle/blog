/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    // for every nums
    // if we know the LIS of nums[1...n-1]
    // let's call it lis[]
    // we check if nums[n] < lis[0] or nums[n] > lis[-1]
    // true: nums[1...n] = nums[1...n-1] + 1
    // false: nums[1...n] = nums[1...n-1]
    var dp = [0]
    for (var i = 0; i < nums.length; i++) {
        if (i === 0) {
            dp[0] = 1
        } else {
            var curdp = 0
            
            for (var j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    curdp = Math.max(dp[j], curdp)
                }
            }
            dp[i] = curdp + 1
        }
    }
    return Math.max(...dp)
};

var result = lengthOfLIS([1,3,6,7,9,4,10,5,6])
console.log(result)