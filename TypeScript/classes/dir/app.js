"use strict";
class FirstBase {
    constructor(name) {
        this.name = name;
        this.name = name;
    }
}
class Child extends FirstBase {
    constructor(name) {
        super(name);
        this.name = name;
    }
    static getIntance() {
        if (this.intance) {
            return this.intance;
        }
        let objInstance = new Child("");
        return objInstance;
    }
    getName() {
        return this.name;
    }
}
let instanceOfClass = Child.getIntance();
