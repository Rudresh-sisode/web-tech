function threeSum(nums) {
  const result = [];
  nums.sort((a, b) => a - b);  // Sort the array first

  for (let i = 0; i < nums.length - 2; i++) {
    // Skip duplicate values for the first element
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const currentSum = nums[i] + nums[left] + nums[right];

      if (currentSum === 0) {
        result.push([nums[i], nums[left], nums[right]]);

        // Skip duplicates for left pointer
        while (left < right && nums[left] === nums[left + 1]) {
          left++;
        }

        // Skip duplicates for right pointer
        while (left < right && nums[right] === nums[right - 1]) {
          right--;
        }

        left++;
        right--;
      } else if (currentSum < 0) {
        left++;  // Need a larger sum
      } else {
        right--;  // Need a smaller sum
      }
    }

  }

  return result;
}
console.log(threeSum([-1, 0, 1, 2, -1, -4]));
