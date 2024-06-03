function validMountain(n) {
    let i = 0;
    let j = n.length - 1;

    while(i < n.length - 1 && n[i] < n[i + 1]) i++;
    while(j > 0 && n[j] < n[j - 1]) j--;

    return i > 0 && i === j && j < n.length - 1;
}