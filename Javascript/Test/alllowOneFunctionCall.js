const call = function(fn) {
    let callCount = 0;

    return function(...args) {
        if(callCount > 0){
            return undefined;
        }
        callCount++;
        return fn(...args);
    }
}

const add = (a, b) => a + b;
const value = call(add);

console.log(value(3,4)); // 7
console.log(value(5,4)); // undefined