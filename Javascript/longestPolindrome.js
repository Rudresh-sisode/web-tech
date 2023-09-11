function longestPalindrome(s) {
    for (let length = s.length; length > 0; length--) {
      for (let start = 0; start <= s.length - length; start++) {
        if (check(start, start + length, s)) {
          return s.substring(start, start + length);
        }
      }
    }
    
    return "";
  }
  
  function check(i, j, s) {
    let left = i;
    let right = j - 1;
    
    while (left < right) {
      if (s.charAt(left) != s.charAt(right)) {
        return false;
      }
      
      left++;
      right--;
    }
    
    return true;
  }
  
  console.log(longestPalindrome("babad")); // Output: "bab"
  console.log(longestPalindrome("cbbd")); // Output: "bb"
  console.log(longestPalindrome("a")); // Output: "a"
  console.log(longestPalindrome("ac")); // Output: "a"