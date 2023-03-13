//with bind
/**In this updated example, we use Function.prototype.bind()
 *  to create a new function that has its this value set to the person object, 
 * and pass that bound function as the callback to setTimeout(). 
 * Now, the this value inside the setTimeout() callback function refers to the person object, 
 * and the message is logged correctly.

Overall, it's important to keep in mind that the this keyword in a setTimeout() 
callback function is not automatically bound to the object that called the function 
containing setTimeout(). If you need to access object properties or methods inside the setTimeout() 
callback, you should either use bind() or store the object reference in a variable outside the 
callback function. */

const person = {
    name:"sohame",
    greet:function(){
        console.log(`hellow, my name is ${this.name}`);
        setTimeout(function(){
            console.log(`bye from ${this.name}`);
        }.bind(this),1000);
    }
}

//without bind

const person1 = {
    name: "John",
    greet: function() {
      console.log(`Hello, my name is ${this.name}`);
      setTimeout(function() {
        console.log(`Bye from ${this.name}`);
      }, 1000);
    }
  };
  
  person1.greet();