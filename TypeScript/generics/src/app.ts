
 function merge<T extends object,U extends object>(objA:T,objB:U){
    return Object.assign(objA,objB);
 }

 const mergedObj = merge({a:'bc'},{b:'ac'});

 interface Lenthy{
    length:number;
 }

 function countAndDescribe<T extends Lenthy>(element:T):[T,string]{
    let description = 'Got no value';
    if(element.length === 1){
        description = 'Got 1 elements';
    }
    else if(element.length > 1 ){
        description = `Got ${element.length} elements`;
    }
    return [element,description];
 }