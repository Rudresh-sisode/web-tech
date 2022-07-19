const arrOfStr = ['1', '2', '3'];

const arrOfNum = arrOfStr.map(str => {
  return Number(str);
});

// 👇️ [1, 2, 3]
console.log(arrOfNum);
