 
function Logger(logString:string){
    return function(constructor:Function){
        console.log('Logging '+logString);
        console.log(constructor);
    }
}

function withTemplate(template:string,hookId:string){
    return function(_:Function){
        const hookEl = document.getElementById(hookId);
        if(hookEl){
            hookEl.innerHTML = template;
        }
    }
}

// @Logger('Loging - person')
@withTemplate('<h1>Hello</h1>','app')
class Person{
    name = 'max';

    constructor(){
        console.log('Creating the person object');

    }
}

function Log(target:any,propertyName:string | Symbol){
    console.log(target,propertyName);
}


//Accesor decorator
function Log2(target:any, propertyName:string, descriptor:PropertyDescriptor){
    
}

class Product{
    @Log
    title:string;
    constructor(t:string){
        this.title = t;
    }
}