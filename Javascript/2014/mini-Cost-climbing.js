const minCostClimbing = (cost) => {
    let n = cost.length;
    let dp = new Array(n + 1).fill(0);
    for (let i = 2; i <= n; i++) {
        dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
    }
    return dp[n];
}
console.log(minCostClimbing([10,30,100, 5,15, 20])); // 15
console.log(minCostClimbing([1,200, 100, 1, 1, 1, 100, 1, 1, 100, 1])); // 6
