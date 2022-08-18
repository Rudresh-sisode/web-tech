// let ingredients_list = ["noodles",{"list":["eggs","flour","water"]}];
// let ingredients_list_deepcopy = JSON.parse(JSON.stringify(ingredients_list));

// // Change the value of the 'list' property in ingredients_list_deepcopy.
// ingredients_list_deepcopy[1].list = ["rice flour","water"]
// // The 'list' property does not change in ingredients_list.
// console.log(ingredients_list[1].list);
// // Array(3) [ "eggs", "flour", "water" ]


let food = ['mango','banana','orange',{"other":['egg','chicken','fish']}];

let foodCopy = JSON.parse(JSON.stringify(food));
console.log("your copy ",foodCopy);
console.log("your original ",food);

foodCopy[3].other = ['empty']
console.log("your copy ",foodCopy);
console.log("your original ",food);
