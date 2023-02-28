const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("please enter your name\t");
rl.on('line', (input) => {
  console.log('The input you entered is:', input);
  rl.close();
  // Do something with the input
});
