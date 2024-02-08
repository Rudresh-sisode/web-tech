"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function Logger(logString) {
    return function (constructor) {
        console.log('Logging ' + logString);
        console.log(constructor);
    };
}
function withTemplate(template, hookId) {
    return function (_) {
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
            hookEl.innerHTML = template;
        }
    };
}
// @Logger('Loging - person')
let Person = class Person {
    constructor() {
        this.name = 'max';
        console.log('Creating the person object');
    }
};
Person = __decorate([
    withTemplate('<h1>Hello</h1>', 'app')
], Person);
function Log(target, propertyName) {
    console.log(target, propertyName);
}
class Product {
    constructor(t) {
        this.title = t;
    }
}
__decorate([
    Log
], Product.prototype, "title", void 0);
//# sourceMappingURL=app.js.map