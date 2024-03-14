
var findSubstringInWraproundString = function(s) {
    const dp = new Array(26).fill(0);  // Create an array to store the maximum length of substrings ending with each character.
    let length = 0;  // Initialize the length variable.
    
    for (let i = 0; i < s.length; i++) {
        const curr = s.charCodeAt(i);  // Current character code.
        const prev = s.charCodeAt(i - 1);  // Previous character code.
        
        // Check if the current character and the previous character create a valid consecutive pair.
        if (i > 0 && (curr - prev === 1 || prev - curr === 25)) {
            length++;
        } else {
            length = 1;  // Reset the length to 1 for a new substring.
        }
        
        const index = curr - 'a'.charCodeAt(0);  // Calculate the index for the character in the array.
        dp[index] = Math.max(dp[index], length);  // Update the maximum length for the character.
    }
    
    // Calculate the sum of all maximum substring lengths in dp array.
    return dp.reduce((ans, val) => ans + val, 0);
};

// let result = findSubstringInWraproundString('lslkdlsl');
let result = findSubstringInWraproundString('cdefghefghijklmnopqrstuvwxmnijklmnopqrstuvbcdefghijklmnopqrstuvwabcddefghijklfghijklmabcdefghijklmnopqrstuvwxymnopqrstuvwxyz');

console.log(result);