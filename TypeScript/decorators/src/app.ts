 
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

interface ValidatorConfig{
    [property:string]:{
        [validatorProp:string]:string[] // ['required','positive']
    }
}

const registerValidators: ValidatorConfig = {};

function Required(target:any,propName:string){
    registerValidators[target.constructor.name] = { //this line will take the class name, because target will have class's contrctor and that has class name, on what class it is.
        [propName] : ['required']
    }
}

function PositiveNumber(target:any,propName:string){
    console.log("Positive Decorator Target",target, " prop name ",propName)
    registerValidators[target.constructor.name] = { //this line will take the class name, because target will have class's contrctor and that has class name, on what class it is.
        [propName] : ['positive']
    }
}

function validate(obj:any){
    const objValidatorConfig = registerValidators[obj.constructor.name];
    console.log('object validator config ',objValidatorConfig)
    if(!objValidatorConfig){
        return true;
    }
    for(const prop  in objValidatorConfig ){
        for(const validator of objValidatorConfig[prop]){
            switch(validator){
                case 'required':
                    return !!obj[prop];
                case 'positive':
                    return obj[prop] > 0;
            }
        }
    }
    return true; 
}

class Course{
    @Required
    title:string;
    @PositiveNumber
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
    if(!validate(createdCourse)){
        alert('Invalid input, Please try again');
    }
    console.log(createdCourse);
})

