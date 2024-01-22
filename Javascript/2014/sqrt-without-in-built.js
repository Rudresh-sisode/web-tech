function sqrt(x){
    let low = 0;
    while(low * low <= x){
       
        low++;
    }
    return low - 1;
}

console.log(sqrt(4));