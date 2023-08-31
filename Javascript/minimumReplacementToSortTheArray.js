var minimumReplacement = function(nums) {
  const n = nums.length;
  let last = nums[n - 1];  // Initialize 'last' with the last element
  let ans = 0;  // Initialize the total operations count

  // Traverse the array in reverse order
  for (let i = n - 2; i >= 0; --i) {
      if (nums[i] > last) {  // If the current element needs replacement
          let t = Math.floor(nums[i] / last);  // Calculate how many times the element needs to be divided
          if (nums[i] % last !== 0) {
              t++;  // If there's a remainder, increment 't'
          }
          last = Math.floor(nums[i] / t);  // Update 'last' for the next comparison
          ans += t - 1;  // Add (t - 1) to 'ans' for the number of operations
      } else {
          last = nums[i];  // Update 'last' without replacement
      }
  }
  return ans;  // Return the total number of operations
};

console.log(minimumReplacement([7,3,5,4,8]))