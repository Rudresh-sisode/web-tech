function* idGenerator(){
    let id = 0;
    while(true){
        yield id++;
    }
}

const gen = idGenerator();

console.log(gen.next().value);
console.log(gen.next().value);