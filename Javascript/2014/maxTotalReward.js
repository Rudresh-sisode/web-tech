function maxTotalReward(rewardValues) {
  rewardValues.sort((a, b) => a - b);
  const sum = new Set();
  for (let num of rewardValues) {
    for (let pre of [...sum]) {
      if (pre < num) sum.add(pre + num);
    }
    sum.add(num);
  }
  return Math.max(...sum);
}

// const rewardValues = [5, 3, 10, 1, 2];
// console.log(maxTotalReward(rewardValues));
console.log(maxTotalReward([1, 1, 3, 3])); // Output: 4
console.log(maxTotalReward([1, 6, 4, 3, 2]));