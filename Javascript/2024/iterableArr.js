let usrInput = [2, 4, 6, 7, 8, 9];

let prResult = usrInput.values();

let arrayFun = [() => { }, () => {
  console.log(prResult.next().value);
}];

for (let i = 0; i < usrInput.length; i++){
  arrayFun[1]();
}