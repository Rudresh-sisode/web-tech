function compressString(str) {
    let compressed = '';
    let count = 1;
    let currChar = str[0];
    
    for (let i = 1; i < str.length; i++) {
      if (str[i] === currChar) {
        count++;
      } else {
        compressed += currChar + count;
        currChar = str[i];
        count = 1;
      }
    }
    
    compressed += currChar + count;
    
    return compressed.length < str.length ? compressed : str;
  }