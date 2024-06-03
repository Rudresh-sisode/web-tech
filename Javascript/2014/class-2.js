
// closure -> scope -> boundry -> limitation

let result = parents();
console.log("your result is\t", result());

let names = "soham "; // global scope but with undefined

function parents() {
  let a = 4;
  return function child() {
    let  b = 5;
    return names + (a + b); //concating // weekly type //D-RED -> Typescript OOPS -> Superset of javascript ()
  };

  //we can't access them here as well.

}




// Hoisting
// access the variables or functions before there declaration


