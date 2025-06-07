/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function(s, numRows) {
    if (numRows === 1 || s.length <= numRows) {
        return s;
    }

    let rows = new Array(numRows).fill('');
    let currentRow = 0;
    let goingDown = false;

    for (let char of s) {
        rows[currentRow] += char;
        if (currentRow === 0 || currentRow === numRows - 1) {
            goingDown = !goingDown;
        }
        currentRow += goingDown ? 1 : -1;
    }

    return rows
};

let result = convert('PAYPALISHIRING', 3);
console.log(result); // 'PAHNAPLSIIGYIR'