function Cheapest_Flights_Within_K_Stops(n, flights, src, dst, K) {
    let dp = new Array(n).fill(Infinity)
    dp[src] = 0
    for (let i = 0; i <= K; i++) {
        let temp = dp.slice()
        for (let [u, v, w] of flights) {
            temp[v] = Math.min(temp[v], dp[u] + w)
        }
        dp = temp
    }
    return dp[dst] === Infinity ? -1 : dp[dst]
}