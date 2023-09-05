function romanToInt(s) {
    const romanToIntMap = {
      'I': 1,
      'V': 5,
      'X': 10,
      'L': 50,
      'C': 100,
      'D': 500,
      'M': 1000
    };
    
    let result = 0;
    for (let i = 0; i < s.length; i++) {
      const current = romanToIntMap[s[i]];
      const next = romanToIntMap[s[i + 1]];
      console.log("current ",current," next ",next)
      if (next && current < next) {
        result -= current;
      } else {
        result += current;
      }
    }
    
    return result;
  }
  
//   console.log(romanToInt('III')); // Output: 3
//   console.log(romanToInt('IV')); // Output: 4
  console.log(romanToInt('IX')); // Output: 9
//   console.log(romanToInt('LVIII')); // Output: 58
//   console.log(romanToInt('MCMXCIV')); // Output: 1994