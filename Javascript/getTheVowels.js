function getVowels(str){
    let voWels = [
        'a',
        'e',
        'i',
        'o',
        'u'
    ];
    let stringValue = str.split('');
    let count = 0;

    /**
     * let arrayOfVowels = ['a','e','i','o','u'];
    let count = 0;
    let arrayOfLetters = string.split('');
     */

    for(let i = 0 ; i < stringValue.length; i++){

        if(voWels[0] == stringValue[i]){
            count++;
            voWels.shift();
        }

        if(voWels.length == 0){
            voWels =[
                'a',
                'e',
                'i',
                'o',
                'u'
            ];
        }
    }

    return count;
}

let abc = getVowels("agrtertyfikfmroyrntbvsukldkfa");
console.log("ykour abc ",abc);
