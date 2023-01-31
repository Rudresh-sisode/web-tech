function mostFrequentElement(arr) {
    const frequency = {};
    for (const item of arr) {
      frequency[item] = frequency[item] ? frequency[item] + 1 : 1;
    }
    
    let mostFrequent = null;
    let highestCount = 0;
    for (const item in frequency) {
      if (frequency[item] > highestCount) {
        highestCount = frequency[item];
        mostFrequent = item;
      }
    }
    return mostFrequent;
  }