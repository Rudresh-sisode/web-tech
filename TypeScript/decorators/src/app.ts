 
function Logger(logString:string){
    return function(constructor:Function){
        console.log('Logging '+logString);
        console.log(constructor);
    }
}

function withTemplate(template:string,hookId:string){
    return function<T extends {new (...args:any[]):{name:string}}>(originalConstructor:T){
        return class extends originalConstructor{
            constructor(..._:any[]){
                super();
                const hookEl = document.getElementById(hookId);
                if(hookEl){
                    hookEl.innerHTML = template;
                }
            }
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

function Log3(target:any,name:string | Symbol, position:number){

}

class Product{
    @Log
    title:string;
    constructor(t:string){
        this.title = t;
    }

    display(@Log3 value:string){

    }
}

function Autobind( _ : any, _2 : string | Symbol, descriptor : PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjDescriptor:PropertyDescriptor = {
        configurable:true,
        enumerable:false,
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjDescriptor;
}

class Printer{
    message = 'This works';

    @Autobind
    showMessage(){
        console.log(this.message);
    }
}

const pp  = new Printer(); 

const button = document.querySelector('button')!;
button.addEventListener('click',pp.showMessage);


class Course{
    title:string;
    price:number;

    constructor(t:string,p:number){
        this.price = p;
        this.title = t;
    }
}

const courseForm = document.querySelector('form');
courseForm?.addEventListener('submit',event =>{
    event.preventDefault();
    const titleEl = document.getElementById('title') as HTMLInputElement;
    const priceEl = document.getElementById('price') as HTMLInputElement;

    const price = +priceEl.value;
    const title = titleEl.value;

    const createdCourse = new Course(title,price);
    console.log(createdCourse);
})

