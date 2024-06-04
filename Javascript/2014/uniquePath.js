const uniquePath = (m, n) => {
    const dp = Array(m).fill().map(() => Array(n).fill(1));
    
    for(let i = 1; i < m; i++) { // m = 3
        for(let j = 1; j < n; j++) { // n = 7
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            
        }
    }
    
    return dp[m - 1][n - 1];
}

console.log(uniquePath(3, 7));