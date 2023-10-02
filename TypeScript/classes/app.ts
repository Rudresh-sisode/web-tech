abstract class FirstBase{
    constructor(public name:string){
        this.name = name;
    }

    abstract getName():string;
}

class Child extends FirstBase{
    constructor(public name:string){
        super(name);
    }

    getName(): string {
        return this.name;
    }
}

let instanceOfClass = new Child("");

