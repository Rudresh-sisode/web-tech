let pgtoolsC = require('pgtools');
pgtoolsC.createdb({
    user:"postgres",
    password:"root",
    port:5432,
    host:"localhost"
}, "metromony",(err,res)=>{
    if(err){
        console.warn("DATABASE can't be created, Add it manually.\n ", err);
        process.exit( -1);
    }
    console.info("DB created (Database Installed Successfully)\n ", res)
})