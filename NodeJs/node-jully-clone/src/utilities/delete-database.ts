import pgtools from 'pgtools';
require('dotenv').config();
pgtools.dropdb({
    //following is the name of the database you want to create
    user: process.env.PG_ADMIN_USER,
    //following is the password for your postgresql server
    password: process.env.PG_ADMIN_PASS,
    //following is the port for your postgresql server(usually it's the same)
    port: 5432,
    //following is the host for your postgresql server(usually it's the same)
    host: 'localhost'
},"testDB")
.then(res =>{
    //if database is Deleted successfully it will print following message
    console.info("DB deleted (Database Deleted Successfully)\n ", res)
})
.catch(err=>{
    //if any error occured while creating database, it will print following error
    console.warn("DATABASE can't be deleted, Delete it manually.\nERROR", err);
    process.exit(-1);
})
.finally(()=>{
    console.info("Process Completed");
    process.exit(0);
})