function lengthOfLongestSubstring(s: string): number {
    // 1. Initialize the Hash Set (Window Content Tracker)
    // A Set provides O(1) average time complexity for adding, deleting, and checking existence.
    const charSet = new Set<string>();

    // 2. Initialize Pointers and Max Length
    let leftPointer = 0;
    let maxLength = 0;

    // 3. Iterate with the Right Pointer to expand the window
    for (let rightPointer = 0; rightPointer < s.length; rightPointer++) {
        const currentChar = s[rightPointer];

        // 4. Handle Duplicate Character (Step B: Shrink the Window)
        // If the current character is ALREADY in the set, it's a duplicate.
        while (charSet.has(currentChar)) {
            // Remove the character at the left pointer from the set.
            charSet.delete(s[leftPointer]);

            // Move the left pointer one step to the right, effectively shrinking the window.
            // This loop continues until the duplicate found at rightPointer is removed.
            leftPointer++;
        }

        // 5. Handle Unique Character (Step A: Expand the Window)
        // The current character is now guaranteed to be unique within the new [leftPointer, rightPointer] window.
        charSet.add(currentChar);

        // 6. Update Max Length
        // The current length is the size of the window (right index - left index + 1).
        maxLength = Math.max(maxLength, rightPointer - leftPointer + 1);
    }

    // 7. Return the final result
    return maxLength;
}

console.log("Testing lengthOfLongestSubstring function:");
console.log(`"abcabcbb" -> ${lengthOfLongestSubstring("abcabcbb")}`); // Expected: 3
console.log(`"bbbbb" -> ${lengthOfLongestSubstring("bbbbb")}`);       // Expected: 1
console.log(`"pwwkew" -> ${lengthOfLongestSubstring("pwwkew")}`);     // Expected: 3
console.log(`"" -> ${lengthOfLongestSubstring("")}`);                 // Expected: 0
console.log(`"dvdf" -> ${lengthOfLongestSubstring("dvdf")}`);  