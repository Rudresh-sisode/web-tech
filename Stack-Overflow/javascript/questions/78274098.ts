
function handleScroll(param:any){
  return 'Called from ' + param;
}

let hours = 0;
let minutes = 0;

 function X() {
  // Capture the name of the variable that the function is assigned to
  this.name = (new Error()).stack?.split('\n')[2]?.trim().split(' ')[1];

  // Define the function behavior based on the name
  this.call = function(event:Event) {
    if (this.name === 'handleHoursScroll') {
         const result = handleScroll(event);
        if (result) hours = Number(result);
    } else if (this.name === 'handleMinutesScroll') {
       const result = handleScroll(event);
        if (result) minutes = Number(result);
    }
  }
}

const handleHoursScroll = new X();
const handleMinutesScroll = new X();

handleHoursScroll.call(/* pass your parameter here*/); // Logs "Called from a"
handleMinutesScroll.call(/* pass your parameter here*/); // Logs "Called from b"



//   const handleHoursScroll = (event: Event) => {
//         const result = handleScroll(event);
//         if (result) hours = Number(result);
//     };

//     const handleMinutesScroll = (event: Event) => {
//         const result = handleScroll(event);
//         if (result) minutes = Number(result);
// };
    

