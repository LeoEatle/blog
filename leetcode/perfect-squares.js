/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function(n) {
    var memo = []
    memo[0] = 0
    memo[1] = 1
    memo[2] = 2
    memo[3] = 3
    
    for (var i = 3; i <= n; i++) {
        var temp = []
        for (var j = 1; j*j <= i; j++) {
            temp.push(memo[i-j*j] + 1)
        }
        memo[i] = Math.min(...temp)
    }
    return memo[n]
};

/**
 * @param {number} n
 * @return {number}
 */
var numSquares2 = function(n) {
    var memo = []
    memo[0] = 0
    memo[1] = 1
    memo[2] = 2
    memo[3] = 3
    
    for (var i = 3; i <= n; i++) {
        memo[i] = memo[i-1] + 1
        for (var j = 1; j*j <= i; j++) {
            // temp.push(memo[i-j*j] + 1)
            memo[i] = Math.min(memo[i], memo[i-j*j] + 1)
        }
    }
    return memo[n]
};

var result = numSquares2(4)
console.log(result)

// 居然一次过了
// dump memoization 真好用

// 第二个144ms 