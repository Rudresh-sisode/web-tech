/**
 * Given an integer rowIndex, return the rowIndexth (0-indexed) row of the Pascal's triangle.

In Pascal's triangle, each number is the sum of the two numbers directly above it as shown:
 */

const getRow = (index)=>{

  let trigle = [1];

  for (let i = 1; i <= index; i++){
    trigle.push(trigle[i - 1] * (index - i + 1) / i);

  }
  return trigle;
}

const result = getRow(3);

console.log(result);