// function* gexEx(bc) {
//   yield bc;
//   yield bc++;
//   yield bc;
// }

// let its  = {}
// its[Symbol.iterator] = gexEx(99);
// console.log([...its]);
const iterable1 = {};

function* bb() {
  yield 1;
  yield 2;
  yield 3;
};

iterable1[Symbol.iterator] = bb;

console.log([...iterable1]);