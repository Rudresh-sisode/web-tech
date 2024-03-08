"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
function Logger(logString) {
    return function (constructor) {
        console.log('Logging ' + logString);
        console.log(constructor);
    };
}
function withTemplate(template, hookId) {
    return function (originalConstructor) {
        return class extends originalConstructor {
            constructor(..._) {
                super();
                const hookEl = document.getElementById(hookId);
                if (hookEl) {
                    hookEl.innerHTML = template;
                }
            }
        };
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
//Accesor decorator
function Log2(target, propertyName, descriptor) {
}
function Log3(target, name, position) {
}
class Product {
    constructor(t) {
        this.title = t;
    }
    display(value) {
    }
}
__decorate([
    Log
], Product.prototype, "title", void 0);
__decorate([
    __param(0, Log3)
], Product.prototype, "display", null);
function Autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
class Printer {
    constructor() {
        this.message = 'This works';
    }
    showMessage() {
        console.log(this.message);
    }
}
__decorate([
    Autobind
], Printer.prototype, "showMessage", null);
const pp = new Printer();
const button = document.querySelector('button');
button.addEventListener('click', pp.showMessage);
const registerValidators = {};
function Required(target, propName) {
    registerValidators[target.constructor.name] = {
        [propName]: ['required']
    };
}
function PositiveNumber(target, propName) {
    console.log("Positive Decorator Target", target, " prop name ", propName);
    registerValidators[target.constructor.name] = {
        [propName]: ['positive']
    };
}
function validate(obj) {
    const objValidatorConfig = registerValidators[obj.constructor.name];
    console.log('object validator config ', objValidatorConfig);
    if (!objValidatorConfig) {
        return true;
    }
    for (const prop in objValidatorConfig) {
        for (const validator of objValidatorConfig[prop]) {
            switch (validator) {
                case 'required':
                    return !!obj[prop];
                case 'positive':
                    return obj[prop] > 0;
            }
        }
    }
    return true;
}
class Course {
    constructor(t, p) {
        this.price = p;
        this.title = t;
    }
}
__decorate([
    Required
], Course.prototype, "title", void 0);
__decorate([
    PositiveNumber
], Course.prototype, "price", void 0);
const courseForm = document.querySelector('form');
courseForm === null || courseForm === void 0 ? void 0 : courseForm.addEventListener('submit', event => {
    event.preventDefault();
    const titleEl = document.getElementById('title');
    const priceEl = document.getElementById('price');
    const price = +priceEl.value;
    const title = titleEl.value;
    const createdCourse = new Course(title, price);
    if (!validate(createdCourse)) {
        alert('Invalid input, Please try again');
    }
    console.log(createdCourse);
});
//# sourceMappingURL=app.js.map