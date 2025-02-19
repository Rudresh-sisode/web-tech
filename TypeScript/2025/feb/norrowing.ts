type Fish = { swim: () => void };
type Bird = { fly: () => void };
 
function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    console.log('swim');
    return animal.swim();
  }
 
  return animal.fly();
}

let obj = { swim: () => console.log('swim') };
move(obj); // swim