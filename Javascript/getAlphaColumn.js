function getAlphColumn(number){
    let result = '';
    while( number > 0){
        let remainder = (number - 1) % 26;
        result = String.fromCharCode(65 + remainder) + result;
        number = Math.floor((number - 1) / 26)
    }
    return result;
}

console.log(getAlphColumn(202));