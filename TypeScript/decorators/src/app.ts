 
function Logger(logString:string){
    return function(constructor:Function){
        console.log('Logging '+logString);
        console.log(constructor);
    }
}

@Logger('Loging - person')
class Person{
    name = 'max';

    constructor(){
        console.log('Creating the person object');

    }
}