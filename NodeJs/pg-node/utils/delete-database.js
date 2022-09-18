let pgtools = require('pgtools');
pgtools.dropdb({
    user:"postgres",
    password:"root",
    port:5432,
    host:"localhost"
}, "metromony",(err,res)=>{
    if(err){
        console.warn("Database can't be remove.\n Remove it manually\n",err);
        process.exit( -1);
    }
    console.info("DB Uninstall (removed)\n",res)
})