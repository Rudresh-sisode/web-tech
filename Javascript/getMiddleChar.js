function getMiddle(s){
    let position = 0;
    let ln = 0;

    if(s.length % 2 === 1){
        position = s.length / 2;
        ln = 1;
    }
    else{
        position = s.length / 2 - 1;
        ln = 2;
    }
    return s.substring(position,position+ln);
}

let abc  =getMiddle("rudreshi");
console.log(abc)