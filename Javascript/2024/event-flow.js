// let div = document.querySelector('div');
// let button = document.querySelector('button');

// div.addEventListener('click', () => {
//   console.log('DIV Clicked');
// },true);

// button.addEventListener('click', (event) => {
//   // event.stopPropagation();
//   console.log('Button Clicked');
// },true);
// function test() {
//   console.log(this);
// }
// test(); // Output: undefined in strict mode, Window {...} otherwise
// console.log(this)
// let obj = {
//   test: function() {
//     console.log(this);
//   }
// };

// let obj2 = {
//    bbc : 'bbc'
// }
// obj.test.call(obj2); // Output: obj

// function maxKRepeating(sequence, word) {

// }
function greeting(name) {
  alert('Hello ' + name);
}

function processUserInput(callback) {
  let name = prompt('Please enter your name.');
  callback(name);
}

processUserInput(greeting);