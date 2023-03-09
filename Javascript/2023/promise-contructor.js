const promise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('foo');
    },300);
});

promise.then((value)=>{
    console.log(value);
})
//expected foo

console.log(promise);
//output: [object Promise]
