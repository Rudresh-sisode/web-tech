const median = arr => arr.sort((a, b) => a - b)
        .slice(Math.floor(arr.length / 2) - (arr.length % 2 === 0 ? 1 : 0), 
        Math.ceil(arr.length / 2))
        .reduce((a, b) => a + b, 0) / (arr.length % 2 === 0 ? 2 : 1);