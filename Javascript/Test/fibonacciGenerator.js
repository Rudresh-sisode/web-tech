// function* fibboGenerator(){
//     let value = 1;
//     while(true){

//     }
// }

function* fib(){

    let arr = [0,1];
    let init = 0;
    
    while(true){
        let sum = arr[init] + arr[init+1];
        arr.push(sum)
        yield(arr[init++]);
    }
}

// console.log(fib(5));
let g = fib();

console.log(g.next().value);
console.log(g.next().value)
console.log(g.next().value);
console.log(g.next().value)
console.log(g.next().value)
console.log(g.next().value);
console.log(g.next().value)
console.log(g.next().value);
console.log(g.next().value)