function intToRoman(num){
    const intToRomanMap = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
      ];

        let result = '';
        for(let i = 0; i < intToRomanMap.length; i++){
            while(num >= intToRomanMap[i].value){
                result += intToRomanMap[i].symbol;
                num -= intToRomanMap[i].value
            }
        }

        return result;
}

console.log(intToRoman(3)); // Output: 'III'
console.log(intToRoman(4)); // Output: 'IV'
console.log(intToRoman(9)); // Output: 'IX'
console.log(intToRoman(58)); // Output: 'LVIII'