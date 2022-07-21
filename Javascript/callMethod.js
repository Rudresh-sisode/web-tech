const person = {
    fullname : function(){
        return this.firstName+" "+this.lastName
    }
}
const abc ={
    firstName:"rudresh",
    lastName:"sisodiya"
}
const abc2 = {
    firstName:"sohame",
    lastName:"Rajput"
}

console.log(person.fullname.call(abc))
