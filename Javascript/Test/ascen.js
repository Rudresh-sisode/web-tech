function sortArrayByFn(arr, fn) {
    for(let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for(let j = i + 1; j < arr.length; j++) {
            if(fn(arr[j]) < fn(arr[minIndex])) {
                minIndex = j;
            }
        }
        if(minIndex !== i) {
            let temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
    return arr;
}

[4,5,6,3,2]