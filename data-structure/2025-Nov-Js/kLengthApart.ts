function kLengthApart(nums: number[], k: number): boolean {
  // Initialize variable to store the index of the previously found '1'.
  // Start with -1 to indicate that no '1' has been seen yet.
  let lastOneIndex = -1;

  for (let i = 0; i < nums.length; i++) {
    // We only care when we encounter a '1'
    if (nums[i] === 1) {
      // If this is not the first '1' we've seen...
      if (lastOneIndex !== -1) {
        // Calculate the distance between the current '1' and the previous '1'.
        // The number of places (zeros) between them is (current_index - previous_index - 1).
        const distance = i - lastOneIndex - 1;

        // If the actual distance is less than the required k, return false immediately.
        if (distance < k) {
          return false;
        }
      }
      // Update the lastOneIndex to the current index for the next iteration.
      lastOneIndex = i;
    }
  }

  // If the loop completes without returning false, the condition holds for the entire array.
  return true;
}

console.log(kLengthApart([1, 0, 0, 0, 1, 0, 0, 1], 2));