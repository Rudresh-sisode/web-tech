const checkForUniqueChars = (string) => {
  let charArray = Array.from(string);
  let asciiValues = [];
  let uniqueValues = [];

  charArray.forEach(char => {
    asciiValues.push(char.charCodeAt(0));
  });

  uniqueValues = [...new Set(asciiValues)];

  return asciiValues.length === uniqueValues.length;
};

console.log(checkForUniqueChars("rudresh"));