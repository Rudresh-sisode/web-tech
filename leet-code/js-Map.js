const map1 = new Map();
let map2 = new Map();

map2.set("a", 1);
const keyFunc = () => {};
// map2.set(keyFunc, 2);
map2.set(keyFunc,2)
console.log("value for keyFunc:", map2.get(keyFunc));
map2.set("*", 3);



// map2 = map1;


console.log("info ", map2.get(keyFunc));

// console.log("equal ", map1 == map2);