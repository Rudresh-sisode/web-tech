function spiralMatrix(matrix){
    let result = [];
    let row = matrix.length;
    let column = matrix[0].length;

    let right = column - 1;
    let down = row - 1;
    let up = 0;
    let left = 0;

    while(result.length < row * column){
        //traverse through left to right
        for(let col = left; col <= right; col++){
            result.push(matrix[up][col])
        }

        //travels downward
        for(let row = up+1; row <= down; row++){
            result.push(matrix[row][down]);
        }

        //make sure we are on different row
         // Make sure we are now on a different row.
         if (up != down) {
            // Traverse from right to left.
            for (let col = right - 1; col >= left; col--) {
                result.add(matrix[down][col]);
            }
        }
        // Make sure we are now on a different column.
        if (left != right) {
            // Traverse upwards.
            for (let row = down - 1; row > up; row--) {
                result.add(matrix[row][left]);
            }
        }
        left++;
        right--;
        up++;
        down--;

    }
    return result;
}