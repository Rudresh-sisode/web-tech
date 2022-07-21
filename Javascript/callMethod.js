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


//call with arguments

const arguments = {
    detail:function(village,city){
        return this.firstName+" "+this.lastName+" "+village+" "+city
    }
}

const info={
    firstName:"Rudresh",
    lastName:"Sisodiya"
}
console.log(arguments.detail.call(info,"Pimpalgaon Golait","Jalgaon"))