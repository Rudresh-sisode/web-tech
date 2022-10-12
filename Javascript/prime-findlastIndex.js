function isPrime(element) {
    if (element % 2 === 0 || element < 2) {
      return false;
    }
    for (let factor = 3; factor <= Math.sqrt(element); factor += 2) {
      if (element % factor === 0) {
        return false;
      }
    }
    return true;
  }
  
  console.log([4, 6, 8, 12].findLastIndex(isPrime)); // -1, not found
  console.log([4, 5, 7, 8, 9, 11, 12].findLastIndex(isPrime)); // 5
  