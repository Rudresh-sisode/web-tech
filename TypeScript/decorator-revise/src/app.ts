function Logger(logString: string) {
  return function(constructor: Function) {
    console.log('Logging...\t'+logString);
    console.log(constructor);

  }

}
@Logger('person decorator')
class Person{
  name = 'Max';

  constructor(){
    console.log('Creating person object...',this.name);
  }
}

const pers = new Person();