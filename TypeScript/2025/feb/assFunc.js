function assert(condition, msg) {
    if (!condition) {
        throw new Error(msg);
    }
}
var value = 123;
assert(typeof value === "string", "Value must be a string");
console.log(value.toUpperCase());
