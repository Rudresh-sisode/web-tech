function facto(n){
    if(n == 1){
        return n;
    }
    let sum = n * facto(n-1);
    return sum;
}

console.log(facto(9))

/**
 * function fact(n){
 * if(n == 1){
 * return n
 * }
 * let sum = n * fact(n-1);
 * return sum;
 * }
 */