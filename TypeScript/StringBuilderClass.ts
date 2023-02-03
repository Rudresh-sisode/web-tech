class StringBuilder {
    //creating private buffer property
    private buffer:string[];
    constructor(){
        //init the empty array value to buffer
        this.buffer = [];
    }

    append(str:string){
        this.buffer.push(str);
    }

    toStrings(){
        return this.buffer.join("");
    }



}

const sbObject = new StringBuilder();

sbObject.append("rudresh ");
sbObject.append("Sisodiya");
console.log(sbObject.toStrings());