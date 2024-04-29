function Logger(logString: string) {
  console.log("logging decorator");
  return function (constructor: Function) {

    console.log('Logging...\t'+logString);
    console.log(constructor);
  }
}

function WithTemplate(template: string, hookId: string) {
  console.log("template decorator")
  return function <T extends { new(...args: any[]): { name: string } }>(originalConstructor: T) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log("Rendering template");
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    }
  }
}

@Logger('person decorator') 
@WithTemplate('<h1>hello and welcome to the site</h1>','app')
class Person{
  name = 'Rudresh Sisodiya';

  constructor(){
    console.log('Creating person object...',this.name);
  }
}

const pers = new Person();


function Log(target:any, propertyName: string | Symbol) {
  
  console.log("Property Decorator ");

  console.log("target ",target,"\nproperty Name ",propertyName)

}

function Log2(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  
  console.log("accessor Decorator ");

  console.log("Target ", target);

  console.log("property  ", propertyName);

  console.log("descriptor ", descriptor);

}


function Log3(target: any, propertyName: string | Symbol, descriptor: PropertyDescriptor) {
  console.log("Method decorator");

  console.log("Target ", target);

  console.log("property  ", propertyName);

  console.log("descriptor ", descriptor);
}



function Log4(target: any, name: string, position: number) {
  console.log(" *******************************Parameter decorator");

  console.log("Target ", target);

  console.log("property  ", name);

  console.log("position ", position);
}

class Product{
  @Log
  title: string;

  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;  
    }
    else {
      throw new Error(
        "Invalid price, should be positive"
      )
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;

    
  }


  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }

}


class Printer{
  message: string = 'This Works';

  showMessage() {
    console.log("THIS : ",this);
    console.log(this.message)
  }
}

const p = new Printer();

const button = document.querySelector('button')!;
button.addEventListener('click',p.showMessage.bind(p))