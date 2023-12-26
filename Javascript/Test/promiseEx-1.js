//  
// function asynchOper(){
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             const result = Math.random() * 100;
//             if(result > 50){
//                 resolve(result);
//             }
//             else{
//                 reject('Operation failed, number is less than 50');
//             }
//         },1000)
//     })
// }

// asynchOper().then(result =>{
//     console.log('Operation success')
// })


function sum() {
    let total = 0;
    for (let i = 0; i < arguments.length; i++) {
      total += arguments[i];
    }
    return total;
  }
  
  console.log(sum(1, 2, 3, 4));