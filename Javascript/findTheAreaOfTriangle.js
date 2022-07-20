function tri(a,b,c){
    let s = (a+b+c) /2;
    return Math.sqrt(s*(s-a)*(s-b)*(s-c));
}

let Area = tri(3,4,5);
console.log(Area)