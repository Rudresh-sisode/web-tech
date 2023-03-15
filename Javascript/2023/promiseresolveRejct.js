const promiseResolved = new Promise((res,rej)=>{
    setTimeout(()=>{
        res("promise resolved");
    },2000);
})

const promiseReject = new Promise((res,rej)=>{
    setTimeout(()=>{
        rej("promise reject");
    }, 3000);
})

promiseResolved.then((res)=>{
    console.log(res);
})
.catch((err)=>{
    console.log(err);
})

promiseReject.then((res)=>{
    console.log(res);
}).catch((err)=>{
    console(err);
})