function latticePaths(n: number): number {
    // Initialize a 2D array to store the number of paths to each point in the grid
    const paths: number[][] = [];
    for (let i = 0; i <= n; i++) {
      paths[i] = [];
      for (let j = 0; j <= n; j++) {
        paths[i][j] = 0;
      }
    }
  
    // There is only one path to the starting point
    paths[0][0] = 1;
  
    // Fill in the table using dynamic programming
    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= n; j++) {
        if (i > 0) {
          paths[i][j] += paths[i - 1][j];
        }
        if (j > 0) {
          paths[i][j] += paths[i][j - 1];
        }
      }
    }
  
    // The number of paths to the bottom right corner is the last element in the table
    return paths[n][n];
  }
  
  // Example usage:
  console.log(latticePaths(2)); // Output: 6
  console.log(latticePaths(20)); // Output: 137846528820