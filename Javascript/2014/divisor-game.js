const divisorGame = (n) => {
    let dp = new Array(n + 1).fill(false);
    dp[1] = false;
    for (let i = 2; i <= n; i++) {
        for (let j = 1; j < i; j++) {
            if (i % j === 0 && !dp[i - j]) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}

//alternative solution
const divisorGame2 = (n) => {
    return n % 2 === 0;
}

console.log(divisorGame(3)); // true