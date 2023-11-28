let addTwoPromise = async function(pro1,pro2){
    let result = await Promise.all([pro1,pro2]);
    return result[0] + result[1];
}

let first = new Promise((resol)=>{
    setTimeout(()=>{
        resol(20);
    },3000);
})

let second = new Promise((resol)=>{
    setTimeout(()=>{
        resol(30);
    },1000);
})

addTwoPromise(first,second)
.then(result=>{
    console.log(result);
})
