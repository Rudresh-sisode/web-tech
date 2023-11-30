let createObject = function(keysArr, valuesArr) {
    const obj = {};
    for (const i in keysArr) {
        console.log(i);
        if (!obj.hasOwnProperty(keysArr[i])) {
            obj[keysArr[i]] = valuesArr[i];
        }
    }
    return obj;
};


let obj = createObject([4,5,6,4],[22,23,44,55])
console.log(obj)

// let obj = {a: 1, b: 2, c: 3};
// for (let key in obj) {
//     console.log(key + ": " + obj[key]); // Outputs: "a: 1", "b: 2", "c: 3"
// }

// let arr = [1, 2, 3];
// for (let value of arr) {
//     console.log(value); // Outputs: 1, 2, 3
// }