// let ingredients_list = ["noodles",{"list":["eggs","flour","water"]}];

// let ingredients_list_copy = Array.from(ingredients_list);
// console.log(JSON.stringify(ingredients_list_copy));
// // ["noodles",{"list":["eggs","flour","water"]}]

let whetherList = ['34C','23F',{'location':['east india', 'south india']}];

let copyWetherList = Array.from(whetherList);

console.log(JSON.stringify(whetherList));

copyWetherList[2].location= 'East India'

console.log(JSON.stringify(whetherList));