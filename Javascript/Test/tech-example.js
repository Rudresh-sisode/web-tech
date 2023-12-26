// // tech example
// 'use strict';

// function func(){
//     console.log(this);
//     function abc(){
//         console.log(this);
//     }
//     console.log("************************************************************")
//     console.log("************************************************************")

//     console.log("************************************************************")
//     console.log("************************************************************")
//     console.log("************************************************************")

//     abc()

// }

// func();



// const obj = {
//     method(){
//         const arrFn = ()=> {
//             console.log(this);
//         }
//         arrFn();
//     }
// }

const obj = {
    method(){
        const fn = function abc(){
            console.log(this)
        }
        fn();
    }
    
}

obj.method();