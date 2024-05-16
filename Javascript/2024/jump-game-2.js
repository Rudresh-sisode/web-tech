let minJumps = (num) => {
  let n = num.length;
  let jump = new Array(n).fill(Infinity);
  jump[0] = 0;
  for (let i = 0; i < n; i++){
    for (let j = 1; j <=num[i] && i + i < n; j++){
      jump[i+j] = Math.min(jump[i+j],jump[i]  + 1)
    }
  }


  return jump[n - 1];
}

let nums = [5, 3, 1, 1, 4];
console.log(minJumps(nums));