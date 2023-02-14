function rotateMatrix(matrix) {
    const n = matrix.length;
    
    // transpose the matrix
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        const temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
      }
    }
    
    // reverse each row
    for (let i = 0; i < n; i++) {
      matrix[i].reverse();
    }
    
    return matrix;
  }
  
  The first step is to transpose the matrix, which involves swapping each element with its corresponding element across the diagonal. To do this, we iterate over the upper triangle of the matrix and swap the element at (i, j) with the element at (j, i).
  
  The second step is to reverse each row of the matrix. This effectively rotates the matrix by 90 degrees.
  
  For example, if we have the matrix [[1, 2, 3], [4, 5, 6], [7, 8, 9]], rotateMatrix would return [[7, 4, 1], [8, 5, 2], [9, 6, 3]], which is the matrix rotated by 90 degrees.