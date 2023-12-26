// node server

const http = require('http')
const axios = require('axios')
const url = require('url');

const server = http.createServer(async(req,res)=>{

    const reqUrl = url.parse(req.url,true);
    

    if(reqUrl.pathname === '/profile'){
        try{
            const response = await axios('https://api.github.com/users/Rudresh-sisode');
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify(response.data))
        }
        catch(error){
            console.log(error);
            res.statusCode = 500;
            res.end("an error occurred")
            

        }
    }
    else{
        res.statusCode = 404;
        res.end("Not found")
    }
})

server.listen(3000,()=>{
    console.log("server is on port 3000")
})