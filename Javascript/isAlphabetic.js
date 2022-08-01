function isAlph(s){
    let c=new Array(s);
    c.sort()
    for(let i = 0; i < c.length; i++){
        if(c[i] !== s[i]){
            return false
        }
    }
    return true;
}

console.log(isAlph("lskdfjsldk"))