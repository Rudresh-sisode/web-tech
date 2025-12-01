function minOperation(nums: number[], k: number) {
  let tempNum = [...nums];
  let total = 0;
  let sum = tempNum.reduce((a, b) => a + b);
  while (sum % k !== 0) {
    sum -= 1;
    total++;
   
  }
  console.log("total operation is ", total);
}





minOperation([3, 9, 7], 5);

// function change(num: number[]) {
//   num.slice(0, num.length - 1);
//   console.log("change log ", num);
// }

// let num = [4, 5, 6, 7, 8, 9];
// change(num);
// console.log("your array ", num);