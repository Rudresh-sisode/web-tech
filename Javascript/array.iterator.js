const arr = ['a', 'b', 'c', 'd', 'e'];
const arrIter = arr[Symbol.iterator]();
console.log(arrIter.next().value); // a
console.log(arrIter.next().value); // b
console.log(arrIter.next().value); // c
console.log(arrIter.next().value); // d
console.log(arrIter.next().value); // e
//************************************************** */

function logIterable(it) {
    if (!(Symbol.iterator in it)) {
      console.log(it, ' is not an iterable object.');
      return;
    }
  
    const iterator = it[Symbol.iterator]();
    for (const letter of iterator) {
      console.log(letter);
    }
  }
  
  // Array
  logIterable(['a', 'b', 'c']);
  // a
  // b
  // c
  
  // string
  logIterable('abc');
  // a
  // b
  // c
  
  logIterable(123);