// 
Array.prototype.upperBound = function(target){
    let index= -1;

    for(let i = this.length - 1; i >= 0; i--){
        if(target === this[i]){
            index = i;
            break;
        }
    }
    return index;
}