var StringBuilder = /** @class */ (function () {
    function StringBuilder() {
        //init the empty array value to buffer
        this.buffer = [];
    }
    StringBuilder.prototype.append = function (str) {
        this.buffer.push(str);
    };
    StringBuilder.prototype.toStrings = function () {
        return this.buffer.join("");
    };
    return StringBuilder;
}());
var sbObject = new StringBuilder();
sbObject.append("rudresh ");
sbObject.append("Sisodiya");
console.log(sbObject.toStrings.bind(this));
