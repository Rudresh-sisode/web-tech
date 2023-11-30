function* factorial(n) {
    
    // let firstValue = 1;
    let result = 1;
    yield result;
    for(let i = 2; i <= n; i++){
        result *= i;
        yield result;
    }
    
};