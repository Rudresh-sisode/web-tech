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


/**
 * 
 * function getTheVowels(word) {
  let st = "aeiou", i = 0, n = 0
  for(let x of word){
    if(x != st[i]) continue
    else{
      i = (i + 1) % st.length
      n++
    }
  }
  return n
}
 */

/**
 * 
 * function getTheVowels(word) {
  const vowels = 'aeiou'.split('');
  let count = 0;
  for (let i = 0, pos = 0;
       (pos = word.indexOf(vowels[i], pos)) >= 0;
       i = ++i % vowels.length, ++count)
    ;
  return count;
}
 */