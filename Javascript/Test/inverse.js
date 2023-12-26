function invertObject(obj) {
    let invertedObj = {};
    for (let key in obj) {
        let value = obj[key];
        if (invertedObj.hasOwnProperty(value)) {
            if (Array.isArray(invertedObj[value])) {
                invertedObj[value].push(key);
            } else {
                invertedObj[value] = [invertedObj[value], key];
            }
        } else {
            invertedObj[value] = key;
        }
    }
    return invertedObj;
}

let result = invertObject({'a':'1','b':'2','a':'3','c':'4','d':'1'});
console.log(result); // Outputs: { '1': 'a', '2': [ 'b', 'c' ], '4': 'd' }



// 
/**
 * 
 * 
 * What is the difference between == and === in JavaScript?
Explain how this works in JavaScript.
What is a closure, and how/why would you use one?
Can you describe the main difference between a forEach loop and a .map() loop and why you might choose one over the other?
What's the difference between an "attribute" and a "property" in JavaScript?
What are the differences between null and undefined?
 * What is hoisting in JavaScript?
What is the event loop in JavaScript?
What is the difference between call and apply?
Explain how prototypal inheritance works in JavaScript.
What is the difference between let, const and var?
What is a Promise? Can you explain how async and await work with Promises?
What is the difference between stopPropagation and preventDefault?
What are arrow functions and how do they differ from regular functions?
What is the difference between a shallow copy and a deep copy?
What is a JavaScript generator?

var invertObject = function(obj) {

    var result = {}
    for (const field in obj) {
        const resultFieldValue = result[obj[field]]
        if(!resultFieldValue) {
            result[obj[field]] = field
        } 
        else if(typeof resultFieldValue === "string") {
            result[obj[field]] = [result[obj[field]], field]
        } 
        else if (Array.isArray(resultFieldValue)) {
            result[obj[field]].push(field)
        }
    }
    return result
};
 */