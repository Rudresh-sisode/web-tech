//  let obj = {
//     "name":"rudresh",
//     "age":25
//  }

//  handler = {
//     get(target,prob,receiver){
//         console.log('target ',target, ' probs ',prob, ' receiver ',receiver);
//     }
//  }

//  const proxyObj = new Proxy(obj,handler);

//  console.log(proxyObj.name);


let createInfiniteObject = function() {
    return new Proxy({},{
        get:function(target,methodName){
            return function(){
                console.log(methodName)
                return methodName
            }
        }
    })
};

const cl = createInfiniteObject()
cl['abc']();