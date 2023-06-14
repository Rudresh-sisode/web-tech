export function squeareSum(numbers:number[]):number {
  return numbers.reduce((acc, cur) => acc + cur * cur, 0)
}