let arrayFun = [() => {
  console.log('Hello');
}, function myUpperName(name) {
  return name.toUpperCase();
  }]

let result = arrayFun[1]("John Doe");

console.log(result);

