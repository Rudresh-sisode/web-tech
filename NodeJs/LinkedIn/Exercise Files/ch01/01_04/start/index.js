const http = require('http')
const cluster =  require('cluster');
const numCPUS =  require('os').cpus().length;

if(cluster.isMaster){
    console.log('this is the master process ',process.pid);
    for(let i = 0 ; i < numCPUS; i++){
        cluster.fork();
    }
    // cluster.fork();
    // cluster.fork();
    
    cluster.on('exit',worker=>{
        console.log(`worker process ${process.pid} had died`);
        console.log(`only ${Object.keys(cluster.workers).length} remain`)
        cluster.fork();
    })
}
else{
    // console.log('this is the worker process ',process.pid)

    http.createServer((req,res)=>{
        const message = `worker ${process.pid}...`
        console.log(message);
        res.end(`process: ${process.pid}`);

        if(req.url == '/kill'){
            process.exit();
        }
        else if(req.url == '/'){
            console.log(`working on request  ${process.pid}`);
        }
    }).listen( 3000);
}