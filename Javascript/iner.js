// const numbers = [1, 2, 3, 4, 5];
// numbers.forEach((currentValue, index, array) => {
//   console.log(`Current value: ${currentValue}, Index: ${index}, Array: ${array}`);
// });


// const obj = { a: /abc/g };

// // Deep copy using JSON.parse() and JSON.stringify()
// const deepCopy = JSON.parse(JSON.stringify(obj));

// console.log(obj.a); // Outputs: /abc/g
// console.log(deepCopy); // Outputs: undefined

let exampleClass = {};
console.log('first ',exampleClass.constructor); // Outputs: [Function: Array]

let userInput = ['constructor', Array]; // User input
exampleClass[userInput[0]] = userInput[1];

console.log('second ',exampleClass.constructor); // Outputs: [Function: Array]