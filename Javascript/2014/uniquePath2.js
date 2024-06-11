var uniquePathsWithObstacles = function (obstacleGrid) {
  let m = obstacleGrid.length;
  let n = obstacleGrid[0].length;
  console.log("before ", obstacleGrid);
  let dp = new Array(m).fill(0).map(() => new Array(n).fill(0));
  console.log("after ", dp);
  dp[0][0] = obstacleGrid[0][0] === 1 ? 0 : 1;

  console.log("first ",dp);

  for (let i = 1; i < m; i++) {
    dp[i][0] = obstacleGrid[i][0] === 1 ? 0 : dp[i - 1][0];
    console.log(`second dp[${i}][0] `,dp);
  }

  for (let j = 1; j < n; j++) {
    dp[0][j] = obstacleGrid[0][j] === 1 ? 0 : dp[0][j - 1];
  }

  console.log("DP log ", dp);
  

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (obstacleGrid[i][j] === 1) {
        dp[i][j] = 0;
      } else {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      }
      console.log(`third dp[${i}][${j}] `,dp);
    }
  }

  return dp[m - 1][n - 1];
};

// console.log(uniquePathsWithObstacles([[0,0,0],[0,1,0],[0,0,0]])); // Output: 2
// console.log(uniquePathsWithObstacles([[0,1],[0,0]])); // Output: 1
// console.log(uniquePathsWithObstacles([[0,0,0,0],[0,0,0,0],[0,0,0,0]])); // Output: 10
// console.log(uniquePathsWithObstacles([[0,0,0,0],[0,1,0,0],[0,0,0,0]])); // Output: 7
// console.log(uniquePathsWithObstacles([[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0]])); // Output: 7
// console.log(uniquePathsWithObstacles([[0,0,0,0,0],[0,0,1,0,0],[0,0,0,1,0]])); // Output: 2
console.log(uniquePathsWithObstacles([[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0]])); // Output: 4
// console.log(uniquePathsWithObstacles([[0,0,0,0,0,0],[0,0,1,0,0,0],[0,0,0,1,0,0],[0,0,0,0,0,0]])); // Output: 7
// console.log(uniquePathsWithObstacles([[0,0,0,0,0,0],[0,0,1,0,0,0],[0,0,0,1,0,0],[0,0,0,0,1,0]])); // Output: 0
// console.log(uniquePathsWithObstacles([[0,0,0,0,0,0],[0,0,1,0,0,0],[0,0,0,1,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]])); // Output: 14