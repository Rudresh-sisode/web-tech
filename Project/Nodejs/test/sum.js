export function add(number){
    let sum = 0;
    for(const num of number){
        sum+=num
    }
    return sum;
}