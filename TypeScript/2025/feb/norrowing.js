function move(animal) {
    if ("swim" in animal) {
        console.log('swim');
        return animal.swim();
    }
    return animal.fly();
}
var obj = { swim: function () { return console.log('swim'); } };
move(obj); // swim
