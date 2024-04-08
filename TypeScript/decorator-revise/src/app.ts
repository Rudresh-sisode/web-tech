function Logger(logString: string) {
  return function(constructor: Function) {
    console.log('Logging...\t'+logString);
    console.log(constructor);
  }
}

function WithTemplate(template: string, hookId: string) {
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

// @Logger('person decorator')
@WithTemplate('<h1>hello and welcome to the site</h1>','app')
class Person{
  name = 'Rudresh Sisodiya';

  constructor(){
    console.log('Creating person object...',this.name);
  }
}

const pers = new Person();