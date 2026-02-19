function removealInteger(num: number[], val: number) {
    let i = 0;
    for (let j = 0; j < num.length; j++) {
        if (num[j] !== val) {
            num[i] = num[j];
            console.log(num[i]);
            i++;
        }
    }
    console.log(num);
    console.log(i);
    return i;
}

removealInteger([3, 2, 2, 3], 3);