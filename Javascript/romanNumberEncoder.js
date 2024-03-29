function solution(number){
    let map = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1}, output = '';

    for(let i in map){
        while(number >= map[i]){
            output +=i;
            number -= map[i]
        }
    }
    console.log(output)
}

const num = 3999
solution(num);

/**
 * Create a function taking a positive integer as its parameter and returning a string containing the Roman Numeral representation of that integer.

Modern Roman numerals are written by expressing each digit separately starting with the left most digit and skipping any digit with a value of zero. In Roman numerals 1990 is rendered: 1000=M, 900=CM, 90=XC; resulting in MCMXC. 2008 is written as 2000=MM, 8=VIII; or MMVIII. 1666 uses each Roman symbol in descending order: MDCLXVI.

Example:

solution(1000); // should return 'M'

 */

//approched second

function solution(number){
    const table = [
      [1000,'M'],
      [900,'CM'],
      [500,'D'],
      [400,'CD'],
      [100,'C'],
      [90,'XC'],
      [50,'L'],
      [40,'XL'],
      [10,'X'],
      [9,'IX'],
      [5,'V'],
      [4,'IV'],
      [1,'I']
    ];
    
    for (let [num, notation] of table) {
      if (number >= num)
        return notation + solution(number - num)
    }
    return ''
  }