var customSortString = function (order, s) {
  // Create a map to store the count of characters in the given string
  const charCount = new Map();

  // Initialize the character count for each character in the order
  for (const char of order) {
    charCount.set(char, 0);
  }

  // Count the occurrences of each character in the string
  for (const char of s) {
    if (charCount.has(char)) {
      charCount.set(char, charCount.get(char) + 1);
    }
  }

  // Construct the sorted string based on the order
  let sortedS = '';
  for (const char of order) {
    sortedS += char.repeat(charCount.get(char));
  }

  // Append remaining characters not in the order
  for (const char of s) {
    if (!order.includes(char)) {
      sortedS += char;
    }
  }

  return sortedS;
};

let result = customSortString("bcafg", "abcd");
console.log(result);