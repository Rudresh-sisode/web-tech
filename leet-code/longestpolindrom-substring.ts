function longestPalindrome(s: string): string {
    let longest = "";

    // Helper function to check if a string is a palindrome
    function isPalindrome(str: string): boolean {
        let left = 0;
        let right = str.length - 1;
        while (left < right) {
            if (str[left] !== str[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    // Try every possible substring
    for (let i = 0; i < s.length; i++) {
        for (let j = i + 1; j <= s.length; j++) {
            let sub = s.substring(i, j);
            if (isPalindrome(sub) && sub.length > longest.length) {
                longest = sub;
            }
        }
    }

    return longest;
}

// Example usage:
console.log(longestPalindrome("babad")); // Output: "bab" or "aba"
console.log(longestPalindrome("cbbd"));  // Output: "bb"