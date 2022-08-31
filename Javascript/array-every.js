const isBelow = (currentValue)=> currentValue < 10;

let array = [2,3,4,5,6,77,9];
console.log(array.every(isBelow));


// second example

[12, 5, 8, 130, 44].every((x) => x >= 10);   // false
[12, 54, 18, 130, 44].every((x) => x >= 10); // true
