function lengthOfLongestSubstring(s) {
  let maxLen = 0;
  let start = 0;
  const seen = new Map();
// abcabcbb
  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    if (seen.has(char) && seen.get(char) >= start) {
      start = seen.get(char) + 1;
    }
    seen.set(char, end);
    maxLen = Math.max(maxLen, end - start + 1);
  }

  return maxLen;
}