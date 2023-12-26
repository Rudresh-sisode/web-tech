function sortArrayByFn(arr, fn) {
    for(let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for(let j = i + 1; j < arr.length; j++) {
            if(fn(arr[j]) < fn(arr[minIndex])) {
                minIndex = j;
            }
        }
        if(minIndex !== i) {
            let temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
    return arr;
}

[4,5,6,3,2]



/**
 * What is the difference between == and === in JavaScript?
Can you explain how this works in JavaScript?
What is a closure, and how/why would you use one?
What is the event loop in JavaScript?
What is the difference between null and undefined?
What are promises and how they are useful in asynchronous programming?
Can you explain how prototypal inheritance works in JavaScript?
What is the difference between let, const and var?
What are arrow functions and how do they differ from regular functions?
What is the purpose of the Array.map() function?
How does JavaScript handle asynchronous operations?
What is a callback function and how does it work?
What is the difference between Array.slice() and Array.splice()?
What is the difference between a method and a function in JavaScript?
How do you handle exceptions (errors) in JavaScript with try/catch/finally blocks?
What is the concept of 'hoisting' in JavaScript?
What is the 'spread' operator and how do you use it?
What is the 'rest' parameter and how do you use it?
What is the difference between a static method and an instance method?
What is the purpose of Array.reduce() method and how do you use it?
 */