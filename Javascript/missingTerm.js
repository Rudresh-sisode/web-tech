var findMissing = function (list) {  
    var listLen = list.length;
    var iter = (list[listLen-1]-list[0])/listLen;
    
    for(i = 0; i < listLen; i++){
      var next = list[i] + iter
      if(next != list[i+1]){
        return next;
      }
    }
  }

  //option 2

  var findMissing = function (l) {  
    return ((l[0]+l[l.length-1])*(l.length+1))/2-(l.reduce((a,b)=>a+b))
  }

  /**
   * An Arithmetic Progression is defined as one in which there is a constant difference between the consecutive terms of a given series of numbers. You are provided with consecutive elements of an Arithmetic Progression. There is however one hitch: exactly one term from the original series is missing from the set of numbers which have been given to you. The rest of the given series is the same as the original AP. Find the missing term.

    You have to write a function that receives a list, list size will always be at least 3 numbers. The missing term will never be the first or last one.
    Example

    findMissing([1, 3, 5, 9, 11]) == 7

   */