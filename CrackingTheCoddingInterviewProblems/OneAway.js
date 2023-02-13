function isOneEditAway(s1, s2) {
    if (Math.abs(s1.length - s2.length) > 1) return false;
  
    let s1Pointer = 0;
    let s2Pointer = 0;
    let edits = 0;
  
    while (s1Pointer < s1.length && s2Pointer < s2.length) {
      if (s1[s1Pointer] === s2[s2Pointer]) {
        s1Pointer++;
        s2Pointer++;
      } else {
        edits++;
        if (s1.length === s2.length) {
          s1Pointer++;
          s2Pointer++;
        } else if (s1.length > s2.length) {
          s1Pointer++;
        } else {
          s2Pointer++;
        }
      }
    }
  
    return edits <= 1;
  }