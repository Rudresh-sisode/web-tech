/**
 * @param {number[]} nums
 * @return {number}
 */
const sumOfPower = function(nums) {
    const MOD = 1000000007;
    let sum = 0;
    const n = nums.length;

    for (let i = 0; i < (1 << n); i++) {
        let max = 0, min = Infinity;
        for (let j = 0; j < n; j++) {
            if ((i & (1 << j)) !== 0) {
                max = Math.max(max, nums[j]);
                min = Math.min(min, nums[j]);
            }
        }
        if (max !== 0 && min !== Infinity) {
            sum = (sum + Math.pow(max, 2) * min) % MOD;
        }
    }

    return sum;
};

// Time: O(2^N), Space: O(1)
console.log(sumOfPower([2, 1, 4])); // 14