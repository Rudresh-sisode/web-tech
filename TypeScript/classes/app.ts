abstract class FirstBase{
    constructor(public name:string){
        this.name = name;
    }

    abstract getName():string;
}

class Child extends FirstBase{
    private constructor(public name:string){
        super(name);
    }

    private static intance:Child;

    static getIntance(){
        if(this.intance){
            return this.intance;
        }
        let objInstance = new Child("");
        return objInstance;
    }

    getName(): string {
        return this.name;
    }

}

let instanceOfClass = Child.getIntance();



