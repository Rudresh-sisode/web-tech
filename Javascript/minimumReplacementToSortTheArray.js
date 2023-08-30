
function minimumReplacement(numberArray){
    //get the copy of original array
    let copyOfArray = [...numberArray];
    //[3,40,43,32]
    console.log("started")
  //   while(!areTheyInAscendingOrder(copyOfArray)){
      console.log("while started")
      for(let i = 0; i < copyOfArray.length; i++){
       for(let j = 1; j < copyOfArray.length; j++){
           let breakNumber = [];
           if(copyOfArray[i] > copyOfArray[j]){
             console.log(i)
            //break the array into two both are need to <= next element
             let smallOne = Math.floor(copyOfArray[i] / 2);
             console.log(smallOne)
             breakNumber.push(smallOne);
             let bigOne = (copyOfArray[i] % 2 + Math.floor(copyOfArray[i] / 2));
             breakNumber.push(bigOne);
             console.log(bigOne,'big')
             copyOfArray[i] = breakNumber.flat();
                                
          }
       }
     }
  //   }
    console.log(copyOfArray);
    
  }
  
  console.log("slsl")
  
  minimumReplacement([3,40,43,35]);