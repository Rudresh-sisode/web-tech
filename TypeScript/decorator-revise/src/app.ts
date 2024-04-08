function Logger(logString: string) {
  console.log("logging decorator");
  return function (constructor: Function) {

    console.log('Logging...\t'+logString);
    console.log(constructor);
  }
}

function WithTemplate(template: string, hookId: string) {
  console.log("template decorator")
  return function (constructor: any) {
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template
      // hookEl.querySelector('h1')?.textContent = p.name;
      hookEl.querySelector('h1')!.textContent = p.name;

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


class Product{
  @Log
  title: string;

  private _price: number;

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

  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }

}