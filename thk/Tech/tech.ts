 console.log("");
  
 let promise = new Promise();//

 setTimeout(()=>{},2000);


 //closure

 ab  = "value";
 function abc(){
    let abc = "sl"
    return ()=>{
        console.log("Your clouser value",abc);
        
    }
 }