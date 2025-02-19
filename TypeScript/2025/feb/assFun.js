let x = 4;
let y = 5;

function add(x, y) {
    assert(typeof x === 'number');
    
    assert(typeof y === 'number');
    return x + y;
}

console.log(add(x,y));