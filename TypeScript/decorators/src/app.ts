 
function Logger(constructor:Function){
    console.log('Logging ');
    console.log(constructor);
}

@Logger
class Person{
    name = 'max';

    constructor(){
        console.log('Creating the person object');

    }
}