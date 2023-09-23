function seriesPrint(startNum,endNum){
	
    if(startNum == endNum){
      return [startNum];
    }
     else{
       let abc = seriesPrint(startNum,endNum-1)
       return [...abc,endNum]
     }
   //   return abc;
   }
   
   seriesPrint(6,9);