function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
      throw new Error(msg);
    }
  }

  const value: unknown = 123;

assert(typeof value === "string", "Value must be a string");
console.log(value.toUpperCase());