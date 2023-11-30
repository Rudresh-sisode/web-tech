// 
let partial = function(fn,args){

    return function(...argsl){
        let indexValue = 0;

        let finalArrayValue = args.map((arg)=> arg === '_' ? argsl[indexValue++] : arg);

        finalArrayValue = finalArrayValue.concat(argsl.slice(indexValue));

        return fn(...finalArrayValue);
    }
}
const add = function(...arg){
    let result = 0;
    for(let i of arg){
        console.log(i,'i')
        result += i;
    }
    return result;
}
let first = partial(add,[4,"_",5,6]);

let result = first([7]);


console.log(result)

