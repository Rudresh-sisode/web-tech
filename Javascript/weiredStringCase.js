// Write a function toWeirdCase (weirdcase in Ruby) that accepts a string, and returns the same string with all even indexed characters in each word upper cased, and all odd indexed characters in each word lower cased. The indexing just explained is zero based, so the zero-ith index is even, therefore that character should be upper cased and you need to start over for each word.

// The passed in string will only consist of alphabetical characters and spaces(' '). Spaces will only be present if there are multiple words. Words will be separated by a single space(' ').
// Examples:

// toWeirdCase( "String" );//=> returns "StRiNg"
// toWeirdCase( "Weird string case" );//=> returns "WeIrD StRiNg CaSe"

function toWeirdCase(string){
    return string.split(' ').map(function(word){
      return word.split('').map(function(letter,index){
        return index % 2 === 0 ? letter.toUpperCase() : letter.toLowerCase()
      }).join('');
    }).join(' ');
  }
  
  console.log(toWeirdCase("Rudresh is software developer"))


  function toWeirdCase(string){
    let stringToArray = string.split(" ");
  
     for(let i =0; i < stringToArray.length; i++){
       let char = [...stringToArray[i]];
       let a = char[0].toUpperCase();
       for(let j = 1; j < char.length; j++){
         if( j % 2 == 0){
           a += char[j].toUpperCase();
         }
         else{
           a += char[j].toLowerCase()
         }
       }
       stringToArray[i] = a+ " ";
      
     }
  
   let storedString = "";
   for(let a of stringToArray){
     storedString += a
   }
   return storedString.trim()
   
 }