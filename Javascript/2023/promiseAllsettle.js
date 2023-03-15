const promise1= Promise.resolve(3);
const promise2 = new Promise((res,rej)=> setTimeout(rej,100,'foo'));
const promises = [promise1,promise2];

Promise.allSettled(promises).then((res)=> res.forEach((reslut)=> console.log(reslut.status)));