// my for each function
Array.prototype.myForEach = function(callback,context){
    for(let i = 0; i < this.length; i++){
        callback.call(context,this[i],i,this)
    }
}