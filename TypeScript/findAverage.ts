export function findAverage(array:number[]): number{
    return array.reduce((acc, cur) => acc + cur, 0) / array.length;
}