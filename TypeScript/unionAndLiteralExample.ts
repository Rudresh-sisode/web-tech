function inputValues(first:number | string,check:'text' | 'number'){
    //literal types example
    if(check === 'text'){
        console.log('text')
    }else{
        console.log('number')
    }
}


inputValues(1,'number')