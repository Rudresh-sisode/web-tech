// ab  = "value";
// function abc(){
//    let abc = "sl"
//    return ()=>{
//        console.log("Your clouser",ab);
//    }
// }

// const a  = abc();
// a();



const arr = [{ name: 'reahul' , age: 24}, { name: 'vikram', age: 21 }];
let obj = {};

for(let i = 0; i < arr.length; i++){
   obj[arr[i]['name']] = arr[i]['age'];
}

console.log(obj);

// result:
// { rahul: 25, vikram: 21 }