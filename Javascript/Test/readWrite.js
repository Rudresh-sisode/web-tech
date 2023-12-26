const fs = require('fs');

fs.writeFile('exp.txt','hello, work',(err)=>{
    if(err){
        throw err;
    }
    console.log("file write operation done");

})

fs.readFile('ex.txt','utf8',(err,data)=>{
    if(err) throw err;

    console.log(data);
})