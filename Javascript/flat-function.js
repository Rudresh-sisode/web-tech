const arr = [1, 2, [3, 4]];
// To flat single level array
arr.flat();
// is equivalent to
arr.reduce((acc, val) => acc.concat(val), []);
// [1, 2, 3, 4]
// or with decomposition syntax
const flattened = (arr) => [].concat(...arr);
