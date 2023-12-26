const http = require('http');
const axios = require('axios')
const url = require('url');

const server = http.createServer(async (req,res)=>{
    const reqUrl = url.parse(req.url, true);

    if(reqUrl.pathname === '/profile'){
        try{
            const response = await axios.get('https://api.');
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify(response.data));

        }
        catch(error){
            console.log(error);
            res.statusCode = 500;
            res.end("an error occured")
        }
    }
    else{
        res.statusCode = 404;
        res.end("No found")
    }
});

const port = 3000;
server.listen(port,()=>{
    console.log('server is running at http://localhost:',port,'/')
})
