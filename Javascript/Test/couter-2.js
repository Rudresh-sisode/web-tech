/**
 * 
 * Write a function createCounter. It should accept an initial integer init. It should return an object with three functions.
 * The three functions are:
 * increment() increases the current value by 1 and then returns it.
 * decrement() reduces the current value by 1 and then returns it.
 * reset() sets the current value to init and then returns it.
 * 

 */

let createCounter = function(init) {
    let current = init;

    function increment(){
        
        return ++current
    }

    function decrement(){
        return --current;
    }

    function reset(){
        current = init;
        return current;
    }

    return {
        increment,
        decrement,
        reset
    }
};

const counter = createCounter(5);

console.log(counter.increment());
console.log(counter.decrement());
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.reset());

