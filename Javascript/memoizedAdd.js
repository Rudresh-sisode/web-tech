function add(a,b){
    console.log('adding the number');
    return a+b;
}

const memoizedAdd = (function(){
    const cache = {};
    return function(a,b){
        const key = a + ',' + b;
        if(cache[key]){
            console.log("fetching from cache");
            return cache[key];
        }
        else{
            console.log("calculating result");
            const result = add(a,b);
            cache[key] = result;
            return result;
        }
    }
})();

console.log(memoizedAdd(3,5));
console.log(memoizedAdd(8,5));
console.log(memoizedAdd(9,5));
console.log(memoizedAdd(8,5));
console.log(memoizedAdd(3,5));
console.log(memoizedAdd(9,5));


