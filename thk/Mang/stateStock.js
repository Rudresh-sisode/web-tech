//  function maxProfitTransaction(input){
//  // [7,1,5,3,6,4]
//     let lessStockValue = input[0];
//     let highStockValue = input[input.length - 1];
    
//     //to get the less margin stock
//     for(let i = 1; i < input.length; i++){
//         if(input[i] < lessStockValue){
//             lessStockValue = input[i];
//         }

//         //to get the high margin stock
//         if(input[i-1] > highStockValue){
//             highStockValue = input[i];
//         }
//     }


//  }

//  maxProfitTransaction([7,1,5,3,6,4]);

function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;

    for (let i = 0; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }

    return maxProfit;
}

let prices = [7,1,5,3,6,4];
console.log(maxProfit(prices));  // Output: 5