function findNextSquare(sq) {
    // Return the next square if sq is a perfect square, -1 otherwise
    let suareRoot = Math.sqrt(sq);
    let isPerfectSqureRoot = isNum(suareRoot)
    if(isPerfectSqureRoot){
      return (suareRoot+1) * (suareRoot+1)
    }
    return -1;
  }
  
  function isNum(value){
    if( typeof value === 'number' && !Number.isNaN(value) && !Number.isInteger(value)){
      return false;
    }
    return true;
  }

//   function findNextSquare(sq) {
//   return Math.sqrt(sq)%1? -1 : Math.pow(Math.sqrt(sq)+1,2);
// }

/**
 * function findNextSquare(sq) {
    var number = Math.sqrt(sq);
    if(Math.round(number) === number) {
        return Math.pow(++number, 2)
    }
    return -1;
}
 */