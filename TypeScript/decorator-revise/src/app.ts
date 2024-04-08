function Logger(constructor: Function) {
  console.log('Logging...');
  console.log(constructor);
}

class Person{
  name = 'Max';

  constructor(){
    console.log('Creating person object...');
  }
}

const pers = new Person();