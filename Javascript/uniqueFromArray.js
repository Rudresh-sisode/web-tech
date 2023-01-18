

function onlyUnique(valud,index,self){
    console.log('value',value,'index',index,'self',self);
    return self.indexOf(value) === index;
}

let a = ['a',3,5,3,5,'a',2,4,5,6,7,8,7,6,5,4,7,8,9];

let unique = a.filter(onlyUnique);
console.log(unique);