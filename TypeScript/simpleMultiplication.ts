// no conditional instructions like && or ? : for better performance
export const simpleMultiplication = (x: number) => x * (8 + x % 2);

export function simpleMultiplication1(num: number): number{
    return num * (num % 2 ? 9 : 8);
  }

  export function simpleMultiplication3(num: number): number{
    return num * [8, 9][num % 2];
  }