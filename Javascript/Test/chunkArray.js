let chunk = function(arr, size) {
    let checkArray = [];
    for(let i = 0; i < arr.length; i+=size){
        let chunk = arr.slice(i,i+size);
        checkArray.push(chunk);
    }
    return checkArray;
    // let init = 0;
    
};

console.log(chunk([4,5,6,7,8],3))