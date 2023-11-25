function* generatorStat(){
    yield "rudresh";
    yield "manohar";
    yield "sisodiya";
}

const genValue = generatorStat();

console.log(genValue.next());
console.log(genValue.next())
