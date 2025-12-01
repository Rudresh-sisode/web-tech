function twoSum(nums: number[], target: number): number[] {
  // 1. Initialize a Map to store {value: index}
  const numMap = new Map<number, number>();

  let result: number[] = [];

  nums.forEach((num, index, nums) => {
    
    const complement = target - num;
    if (numMap.has(complement)) {
      result = [numMap.get(complement)!, index];
    }
    numMap.set(num, index);
  });
  console.log("result ", result);

  return result;
}

twoSum([15, 11,2, 7,], 9);