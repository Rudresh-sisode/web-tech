const isBelow = (currentValue)=> currentValue < 10;

let array = [2,3,4,5,6,77,9];
console.log(array.every(isBelow));