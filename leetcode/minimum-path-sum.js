/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {
    var m = grid.length;
    var n = grid[0].length;
    for (var x = 1; x < m; x +=1) {
        grid[x][0] = grid[x-1][0] + grid[x][0]
    }
    for (var y = 1; y < n; y +=1) {
        grid[0][y] = grid[0][y-1] + grid[0][y]
    }
    for (var a = 1; a < m; a+=1) {
        for (var b = 1; b < n; b+=1) {
            grid[a][b] = Math.min(grid[a-1][b], grid[a][b-1]) + grid[a][b]
            console.log(a, b)
        }
    }
    return grid[m-1][n-1]
};