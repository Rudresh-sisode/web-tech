// 
// function greet(){
//     console.log(`hello, my name is ${this.name}`);
// }

// const person = {
//     name:'Rudresh'
// }

// greet.call(person);

// function greet(greeting,punctuation){
//     console.log(`${greeting}, my name is ${this.name} ${punctuation}`);
// }

// const person = {name:'rudresh sisodiya'};

// greet.apply(person,['Hellow','!'])

// function greet(greeting, punctuation){
//     console.log(`${greeting}, my name is ${this.name} ${punctuation}`)
// }

// const person = {
//     name : "rudresh"
// }

// const boundGreet = greet.bind(person);
// boundGreet("Hellos","!")


// const arr = [1,2,3,4];

// arr.forEach((item,index)=>{
//     console.log(`element ${item} is at index ${index}`);
// })

// const input = document.createElement('input');
// input.setAttribute('value','hello');
// console.log(input.getAttribute('value'));

function Rabbit(){

}

Rabbit.prototype.eats = true;

const rabbit = new Rabbit();
console.log(rabbit.eats)